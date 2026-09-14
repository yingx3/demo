import express from 'express'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

/**
 * 地震动（DZD）波形桥接路由
 * ---------------------------------------------------------------------------
 * 数据源头：TCPClient.java
 *   src/main/java/com/tcp/client/TCPClient.java
 *   输出文件：wave_<X|Y|Z>_<UTC时间>.csv
 *   CSV 表头：Timestamp,Direction,Voltage_mV（兼容早期 Index,Voltage_mV）
 *   采样率：250 Hz（SAMPLE_RATE=250 / SAMPLE_INTERVAL_MS=4ms）
 *   每文件点数上限：30000（tcp.wave.maxPointsPerFile）
 * 本路由职责：
 *   1. 读取 TCPClient 的输出目录，向前端提供波形文件清单与波形采样
 *   2. 调用 suanfa/dzd 的 Transformer1D 模型完成泥石流识别
 * 环境变量：
 *   DZD_WAVE_DIR     波形目录（默认见下，对应 TCPClient 的 tcp.wave.outputDir）
 *   DZD_SCRIPT_DIR   transformer 脚本目录
 *   DZD_PYTHON       python 解释器（默认 python）
 *   DZD_SAMPLE_RATE  采样率（默认 250，与 TCPClient.SAMPLE_RATE 保持一致）
 */

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const WAVE_DIR =
  process.env.DZD_WAVE_DIR ||
  'E:/Projects/ZHLXT/backend/hd-mao_0322/suanfa/dzd/data'
const SCRIPT_DIR =
  process.env.DZD_SCRIPT_DIR ||
  'E:/Projects/ZHLXT/backend/hd-mao_0322/suanfa/dzd/scripts'
const PREDICT_SCRIPT = path.join(SCRIPT_DIR, 'transformer1d.py')
const PYTHON_BIN = process.env.DZD_PYTHON || 'python'
const SAMPLE_RATE = Number(process.env.DZD_SAMPLE_RATE || 250)
const PREDICT_TIMEOUT_MS = Number(process.env.DZD_PREDICT_TIMEOUT_MS || 180000)
const DEVICES_FILE = path.join(__dirname, '..', 'dzd-devices.json')
// 兼容 TCPClient 标准输出 wave_Z_20250913_101010.csv 与早期样例 wave_Z.csv
const FILE_PATTERN = /^wave_([XYZ])(?:_(\d{8})_(\d{6})(?:_(\d+))?)?\.csv$/i

function loadDevices() {
  try {
    const raw = fs.readFileSync(DEVICES_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed.devices) ? parsed.devices : []
  } catch (error) {
    console.warn('[dzd] 读取设备配置失败:', error.message)
    return []
  }
}

function listWaveFiles() {
  if (!fs.existsSync(WAVE_DIR)) return []
  return fs
    .readdirSync(WAVE_DIR)
    .filter(name => FILE_PATTERN.test(name))
    .map(name => {
      const match = FILE_PATTERN.exec(name)
      const fullPath = path.join(WAVE_DIR, name)
      const stat = fs.statSync(fullPath)
      return {
        name,
        direction: match[1].toUpperCase(),
        sizeBytes: stat.size,
        mtime: stat.mtimeMs,
        fileTimeUtc: match[2] ? match[2] + '_' + match[3] : null,
        fullPath,
      }
    })
    .sort((a, b) => b.mtime - a.mtime)
}

function parseWaveCsv(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
  if (!lines.length) return { header: [], points: [] }
  const header = lines
    .shift()
    .split(',')
    .map(item => item.trim())
  const timeIndex = header.findIndex(item => /timestamp/i.test(item))
  let voltageIndex = header.findIndex(item => /voltage/i.test(item))
  if (voltageIndex < 0) voltageIndex = header.length - 1
  const points = []
  lines.forEach((line, index) => {
    const cols = line.split(',')
    const voltage = Number(cols[voltageIndex])
    if (!Number.isFinite(voltage)) return
    let timestamp = null
    if (timeIndex >= 0) {
      const raw = Number(cols[timeIndex])
      if (Number.isFinite(raw)) timestamp = raw
    }
    if (timestamp === null) {
      // 早期格式（Index,Voltage_mV）没有时间戳，按采样率推算相对时间
      timestamp = Math.round((index * 1000) / SAMPLE_RATE)
    }
    points.push({ t: timestamp, v: voltage })
  })
  return { header, points }
}

function resolveWaveFile(name) {
  if (!name || typeof name !== 'string') return null
  const base = path.basename(name)
  if (base !== name || !FILE_PATTERN.test(base)) return null
  const full = path.join(WAVE_DIR, base)
  if (!fs.existsSync(full)) return null
  return full
}

function decimate(points, max) {
  if (!Number.isFinite(max) || max <= 0 || points.length <= max) return points
  const step = points.length / max
  const out = []
  for (let i = 0; i < max; i++) {
    out.push(points[Math.min(points.length - 1, Math.floor(i * step))])
  }
  return out
}

/** 波形目录与算法状态：前端"设备 → 地震动"图层进入时调用 */
router.get('/dzd/status', (req, res) => {
  try {
    const files = listWaveFiles()
    const directions = {}
    files.forEach(file => {
      directions[file.direction] = (directions[file.direction] || 0) + 1
    })
    res.json({
      waveDir: WAVE_DIR,
      waveDirExists: fs.existsSync(WAVE_DIR),
      scriptDir: SCRIPT_DIR,
      scriptReady: fs.existsSync(PREDICT_SCRIPT),
      sampleRate: SAMPLE_RATE,
      pointsPerFile: 30000,
      fileCount: files.length,
      directions,
      latest: files[0]
        ? { name: files[0].name, direction: files[0].direction, mtime: files[0].mtime }
        : null,
      devices: loadDevices(),
    })
  } catch (error) {
    console.error('[dzd] status 失败:', error)
    res.status(500).json({ error: '读取波形目录失败', details: error.message })
  }
})

/** 波形文件清单 */
router.get('/dzd/files', (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 500)
    const direction = String(req.query.direction || '').toUpperCase()
    let files = listWaveFiles()
    if (direction && ['X', 'Y', 'Z'].includes(direction)) {
      files = files.filter(file => file.direction === direction)
    }
    const data = files.slice(0, limit).map(file => {
      const text = fs.readFileSync(file.fullPath, 'utf8')
      const { header, points } = parseWaveCsv(text)
      return {
        name: file.name,
        direction: file.direction,
        sizeBytes: file.sizeBytes,
        mtime: file.mtime,
        fileTimeUtc: file.fileTimeUtc,
        header,
        points: points.length,
        startTime: points.length ? points[0].t : null,
        endTime: points.length ? points[points.length - 1].t : null,
      }
    })
    res.json({ count: data.length, total: files.length, waveDir: WAVE_DIR, data })
  } catch (error) {
    console.error('[dzd] files 失败:', error)
    res.status(500).json({ error: '读取波形文件失败', details: error.message })
  }
})

/** 单个波形文件的采样点（默认抽稀到 6000 点，便于前端绘图） */
router.get('/dzd/wave', (req, res) => {
  try {
    const full = resolveWaveFile(String(req.query.file || ''))
    if (!full) {
      return res.status(400).json({ error: 'file 参数不合法或文件不存在' })
    }
    const max = Math.min(Number(req.query.max) || 6000, 30000)
    const text = fs.readFileSync(full, 'utf8')
    const { header, points } = parseWaveCsv(text)
    const sampled = decimate(points, max)
    res.json({
      file: path.basename(full),
      direction: (FILE_PATTERN.exec(path.basename(full)) || [])[1] || null,
      sampleRate: SAMPLE_RATE,
      header,
      totalPoints: points.length,
      count: sampled.length,
      decimated: sampled.length !== points.length,
      startTime: points.length ? points[0].t : null,
      endTime: points.length ? points[points.length - 1].t : null,
      time: sampled.map(point => point.t),
      value: sampled.map(point => point.v),
    })
  } catch (error) {
    console.error('[dzd] wave 失败:', error)
    res.status(500).json({ error: '读取波形失败', details: error.message })
  }
})

/** 调用 Transformer1D 模型识别泥石流（输入：TCPClient 输出的 CSV） */
router.post('/dzd/predict', (req, res) => {
  const requested = req.body?.file
  let fullPath = resolveWaveFile(String(requested || ''))
  if (!fullPath && !requested) {
    const latest = listWaveFiles().find(file => file.direction === 'Z') || listWaveFiles()[0]
    if (latest) fullPath = latest.fullPath
  }
  if (!fullPath) {
    return res.status(400).json({ error: '未找到可用的波形文件，请检查 DZD_WAVE_DIR' })
  }
  if (!fs.existsSync(PREDICT_SCRIPT)) {
    return res.status(500).json({ error: '未找到识别脚本 transformer1d.py', script: PREDICT_SCRIPT })
  }

  const started = Date.now()
  const child = spawn(PYTHON_BIN, [PREDICT_SCRIPT, fullPath], {
    cwd: SCRIPT_DIR,
    windowsHide: true,
  })
  let stdout = ''
  let stderr = ''
  let finished = false
  const timer = setTimeout(() => {
    if (finished) return
    finished = true
    try { child.kill() } catch (e) {}
    res.status(504).json({ error: '识别超时', timeoutMs: PREDICT_TIMEOUT_MS })
  }, PREDICT_TIMEOUT_MS)

  child.stdout.on('data', chunk => { stdout += chunk.toString('utf8') })
  child.stderr.on('data', chunk => { stderr += chunk.toString('utf8') })
  child.on('error', error => {
    if (finished) return
    finished = true
    clearTimeout(timer)
    res.status(500).json({ error: '无法启动 Python 识别进程', details: error.message, python: PYTHON_BIN })
  })
  child.on('close', code => {
    if (finished) return
    finished = true
    clearTimeout(timer)
    const probMatch = /Sigmoid possibility:\s*([0-9.eE+-]+)/.exec(stdout)
    const classMatch = /pred_class:\s*(\d+)/.exec(stdout)
    const probability = probMatch ? Number(probMatch[1]) : null
    const detected = classMatch ? classMatch[1] === '1' : null
    res.json({
      file: path.basename(fullPath),
      direction: (FILE_PATTERN.exec(path.basename(fullPath)) || [])[1] || null,
      sampleRate: SAMPLE_RATE,
      probability,
      detected,
      label: detected === null ? '未知' : detected ? '检测到泥石流风险' : '未检测到泥石流',
      exitCode: code,
      elapsedMs: Date.now() - started,
      stdoutTail: stdout.split(/\r?\n/).filter(Boolean).slice(-6),
      stderrTail: stderr ? stderr.split(/\r?\n/).filter(Boolean).slice(-4) : [],
    })
  })
})

export default router
