/**
 * ============================================================================
 * 气象数据采集与实时查询模块（新增）
 * ----------------------------------------------------------------------------
 * ⚠️ 旧逻辑保留说明（勿删）：
 *   平台原有气象链路保持原样、完全未改动，便于后续旧采集器恢复正常时复用：
 *     1) 旧链路（原表直读）：
 *        routes/spatial.js 的 GET /weatherstation → 前端 MapHome.vue 的
 *        addLayer_weatherstation()，直接读取 weatherstation 表渲染站点；
 *     2) 旧采集器恢复后的接入方式（无需改代码）：
 *        向 POST /weather/ingest 推送数据（请求头 x-ingest-token），
 *        数据以幂等 upsert 写入 weather_obs 表，与自动采集数据共用同一张表；
 *     3) 若要整体恢复旧采集器的采集逻辑，见文末 [LEGACY-ADAPTER] 注释块。
 * ----------------------------------------------------------------------------
 * 采集策略（Open-Meteo 公共 API；实测其调用量按“坐标数”计，
 * 免费层每分钟约 600 次限制，超限返回 HTTP 429）：
 *   - 研究区站点（默认 92~99E, 27~32N）：每 30 分钟一轮（WEATHER_FOCUS_INTERVAL_MS）
 *   - 其余全国站点：每 6 小时一轮（WEATHER_NATIONAL_INTERVAL_MS）
 *   - 分钟级调用预算（默认 500 坐标/分钟）+ 429 自动等待重试
 * ============================================================================
 */
import express from 'express'
import { pathToFileURL } from 'url'
import pool from '../db.js'

const router = express.Router()

// ---------------------------------------------------------------------------
// 采集配置（均可用环境变量覆盖）
// ---------------------------------------------------------------------------
const FOCUS_BBOX = {
  lonMin: Number(process.env.WEATHER_FOCUS_LON_MIN || 92),
  lonMax: Number(process.env.WEATHER_FOCUS_LON_MAX || 99),
  latMin: Number(process.env.WEATHER_FOCUS_LAT_MIN || 27),
  latMax: Number(process.env.WEATHER_FOCUS_LAT_MAX || 32),
}
const FOCUS_INTERVAL_MS = Number(
  process.env.WEATHER_FOCUS_INTERVAL_MS || 30 * 60 * 1000,
) // 研究区：30 分钟
const NATIONAL_INTERVAL_MS = Number(
  process.env.WEATHER_NATIONAL_INTERVAL_MS || 6 * 60 * 60 * 1000,
) // 全国：6 小时
const BATCH_SIZE = Number(process.env.WEATHER_COLLECT_BATCH || 50) // 每批站点数
const MAX_COORDS_PER_MINUTE = Number(
  process.env.WEATHER_MAX_COORDS_PER_MINUTE || 500,
) // 分钟调用预算（按坐标数）
const INGEST_TOKEN = process.env.WEATHER_INGEST_TOKEN || 'zhlt-weather-ingest'
const ENABLED = process.env.WEATHER_COLLECT_ENABLED !== '0' // 默认开启；设 0 关闭
const SOURCE = 'open-meteo'

// ---------------------------------------------------------------------------
// 采集状态（GET /weather/status 查看）
// ---------------------------------------------------------------------------
const state = {
  enabled: ENABLED,
  running: false,
  totalRuns: 0,
  lastScope: null,
  lastStartAt: null,
  lastFinishAt: null,
  lastDurationMs: null,
  lastStationCount: 0,
  lastSuccessCount: 0,
  lastFailCount: 0,
  lastError: null,
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const numOrNull = v => {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

// 将本地时间字符串 + UTC 偏移拼成带时区的 ISO 字符串（存 timestamptz 不歧义）
function toTimestamptz(timeStr, utcOffsetSeconds) {
  if (!timeStr) return null
  if (/[zZ]$/.test(timeStr) || /[+-]\d{2}:?\d{2}$/.test(timeStr)) return timeStr
  const off = Number.isFinite(Number(utcOffsetSeconds))
    ? Number(utcOffsetSeconds)
    : 28800
  const sign = off >= 0 ? '+' : '-'
  const abs = Math.abs(off)
  const hh = String(Math.floor(abs / 3600)).padStart(2, '0')
  const mm = String(Math.floor((abs % 3600) / 60)).padStart(2, '0')
  const base = timeStr.length === 16 ? `${timeStr}:00` : timeStr
  return `${base}${sign}${hh}:${mm}`
}

const isFocusStation = s =>
  s.lon >= FOCUS_BBOX.lonMin &&
  s.lon <= FOCUS_BBOX.lonMax &&
  s.lat >= FOCUS_BBOX.latMin &&
  s.lat <= FOCUS_BBOX.latMax

// ---------------------------------------------------------------------------
// 建表（首次运行自动创建，幂等）
// ---------------------------------------------------------------------------
export async function ensureWeatherTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS weather_obs (
      station_id         varchar(32)  NOT NULL,
      obs_time           timestamptz  NOT NULL,
      temperature_c      numeric(6,2),
      precipitation_mm   numeric(7,2),
      wind_speed_ms      numeric(6,2),
      wind_direction_deg numeric(6,1),
      humidity_pct       numeric(5,1),
      weather_code       integer,
      source             varchar(32)  NOT NULL DEFAULT 'open-meteo',
      raw                jsonb,
      collected_at       timestamptz  NOT NULL DEFAULT now(),
      PRIMARY KEY (station_id, obs_time)
    )
  `)
  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_weather_obs_time ON weather_obs (obs_time DESC)',
  )
  await pool.query(`
    CREATE TABLE IF NOT EXISTS weather_collect_log (
      scope         varchar(16) PRIMARY KEY,
      last_at       timestamptz NOT NULL DEFAULT now(),
      station_count integer,
      success_count integer,
      fail_count    integer
    )
  `)
}

// ---------------------------------------------------------------------------
// 站点读取（数据点 = weatherstation 原表中的站点坐标）
// ---------------------------------------------------------------------------
async function loadStations() {
  const { rows } = await pool.query(
    'SELECT "ID" AS id, "NAME" AS name, "LON" AS lon, "LAT" AS lat FROM weatherstation ORDER BY "ID"',
  )
  return rows
    .map(row => ({
      id: String(row.id ?? '').trim(),
      name: row.name,
      lon: parseFloat(row.lon),
      lat: parseFloat(row.lat),
    }))
    .filter(
      s =>
        s.id &&
        Number.isFinite(s.lon) &&
        Number.isFinite(s.lat) &&
        s.lon >= 60 &&
        s.lon <= 145 &&
        s.lat >= 0 &&
        s.lat <= 60,
    )
}

// ---------------------------------------------------------------------------
// 分钟调用预算（按坐标数计，防止触发 429）
// ---------------------------------------------------------------------------
let windowStart = 0
let windowCount = 0

async function rateLimitCost(n) {
  const now = Date.now()
  if (!windowStart || now - windowStart >= 60000) {
    windowStart = now
    windowCount = 0
  }
  if (windowCount + n > MAX_COORDS_PER_MINUTE) {
    const waitMs = Math.max(1000, 60000 - (now - windowStart) + 500)
    console.log(`[weather] 达到分钟调用预算，等待 ${(waitMs / 1000).toFixed(0)}s 后继续`)
    await sleep(waitMs)
    windowStart = Date.now()
    windowCount = 0
  }
  windowCount += n
}

// ---------------------------------------------------------------------------
// Open-Meteo 批量抓取（多坐标一次请求；429 等待窗口、网络错误重试）
// ---------------------------------------------------------------------------
async function fetchBatch(batch) {
  const lats = batch.map(s => s.lat.toFixed(4)).join(',')
  const lons = batch.map(s => s.lon.toFixed(4)).join(',')
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${lats}&longitude=${lons}` +
    '&current=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,relative_humidity_2m,weather_code' +
    '&wind_speed_unit=ms&timezone=Asia%2FShanghai'

  let lastError = null
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const resp = await fetch(url, { signal: AbortSignal.timeout(20000) })
      if (resp.status === 429) {
        // 公共 API 分钟限流：等待一个窗口后自动重试
        console.log('[weather] 遇到 429 限流，等待 61s 后重试')
        await sleep(61000)
        lastError = new Error('HTTP 429')
        continue
      }
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
      const data = await resp.json()
      return Array.isArray(data) ? data : [data]
    } catch (error) {
      lastError = error
      if (attempt < 4) await sleep(1200 * attempt)
    }
  }
  throw lastError || new Error('请求失败')
}

// ---------------------------------------------------------------------------
// 幂等入库（主键 station_id + obs_time）
// ---------------------------------------------------------------------------
async function saveObservations(entries) {
  if (!entries.length) return 0
  const params = []
  const tuples = entries.map(entry => {
    const base = params.length
    params.push(
      entry.station_id,
      entry.obs_time,
      entry.temperature_c,
      entry.precipitation_mm,
      entry.wind_speed_ms,
      entry.wind_direction_deg,
      entry.humidity_pct,
      entry.weather_code,
      entry.source,
      entry.raw === undefined ? null : JSON.stringify(entry.raw),
    )
    return `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${base + 5},$${base + 6},$${base + 7},$${base + 8},$${base + 9},$${base + 10})`
  })
  await pool.query(
    `INSERT INTO weather_obs
       (station_id, obs_time, temperature_c, precipitation_mm, wind_speed_ms,
        wind_direction_deg, humidity_pct, weather_code, source, raw)
     VALUES ${tuples.join(',')}
     ON CONFLICT (station_id, obs_time) DO UPDATE SET
       temperature_c = EXCLUDED.temperature_c,
       precipitation_mm = EXCLUDED.precipitation_mm,
       wind_speed_ms = EXCLUDED.wind_speed_ms,
       wind_direction_deg = EXCLUDED.wind_direction_deg,
       humidity_pct = EXCLUDED.humidity_pct,
       weather_code = EXCLUDED.weather_code,
       source = EXCLUDED.source,
       raw = EXCLUDED.raw,
       collected_at = now()`,
    params,
  )
  return entries.length
}

// ---------------------------------------------------------------------------
// 采集日志（用于启动防重复与状态查询）
// ---------------------------------------------------------------------------
async function logCollect(scope, stationCount, success, fail) {
  try {
    await pool.query(
      `INSERT INTO weather_collect_log (scope, last_at, station_count, success_count, fail_count)
       VALUES ($1, now(), $2, $3, $4)
       ON CONFLICT (scope) DO UPDATE SET
         last_at = now(),
         station_count = EXCLUDED.station_count,
         success_count = EXCLUDED.success_count,
         fail_count = EXCLUDED.fail_count`,
      [scope, stationCount, success, fail],
    )
  } catch (error) {
    console.error('[weather] 采集日志写入失败:', error.message)
  }
}

async function needCollect(scope, intervalMs) {
  try {
    const { rows } = await pool.query(
      'SELECT last_at FROM weather_collect_log WHERE scope = $1',
      [scope],
    )
    if (!rows.length) return true
    return Date.now() - new Date(rows[0].last_at).getTime() >= intervalMs * 0.95
  } catch (error) {
    return true
  }
}

// ---------------------------------------------------------------------------
// 采集主流程
//   scope: 'focus'（研究区）| 'national'（其余全国站点）| 'all'（全部）
//   limit > 0 时仅采前 N 个站点，便于自测
// ---------------------------------------------------------------------------
export async function collectOnce({ limit = 0, scope = 'all' } = {}) {
  if (state.running) return { skipped: true, reason: '上一轮采集尚未结束' }
  state.running = true
  state.lastScope = scope
  state.lastStartAt = new Date().toISOString()
  const startedAt = Date.now()
  let success = 0
  let fail = 0
  let stationCount = 0
  try {
    await ensureWeatherTable()
    let stations = await loadStations()
    if (scope === 'focus') stations = stations.filter(isFocusStation)
    else if (scope === 'national') stations = stations.filter(s => !isFocusStation(s))
    if (limit > 0) stations = stations.slice(0, limit)
    stationCount = stations.length
    state.lastStationCount = stationCount

    for (let i = 0; i < stations.length; i += BATCH_SIZE) {
      const batch = stations.slice(i, i + BATCH_SIZE)
      await rateLimitCost(batch.length)
      try {
        const results = await fetchBatch(batch)
        const entries = []
        batch.forEach((station, index) => {
          const current = results[index]?.current
          const obsTime = toTimestamptz(
            current?.time,
            results[index]?.utc_offset_seconds,
          )
          if (!current || !obsTime) return
          entries.push({
            station_id: station.id,
            obs_time: obsTime,
            temperature_c: numOrNull(current.temperature_2m),
            precipitation_mm: numOrNull(current.precipitation),
            wind_speed_ms: numOrNull(current.wind_speed_10m),
            wind_direction_deg: numOrNull(current.wind_direction_10m),
            humidity_pct: numOrNull(current.relative_humidity_2m),
            weather_code: numOrNull(current.weather_code),
            source: SOURCE,
            raw: current,
          })
        })
        success += await saveObservations(entries)
        fail += batch.length - entries.length
      } catch (error) {
        fail += batch.length
        state.lastError = `${new Date().toISOString()} ${error.message}`
        console.error('[weather] 批次采集失败:', error.message)
      }
      await sleep(250)
    }
    await logCollect(scope, stationCount, success, fail)
  } catch (error) {
    state.lastError = `${new Date().toISOString()} ${error.message}`
    console.error('[weather] 采集任务失败:', error.message)
  } finally {
    state.running = false
    state.totalRuns += 1
    state.lastFinishAt = new Date().toISOString()
    state.lastDurationMs = Date.now() - startedAt
    state.lastStationCount = stationCount
    state.lastSuccessCount = success
    state.lastFailCount = fail
    console.log(
      `[weather] 采集完成（${scope}）：成功 ${success} 站 / 失败 ${fail} 站，用时 ${(state.lastDurationMs / 1000).toFixed(1)}s`,
    )
  }
  return { success, fail, scope }
}

// ---------------------------------------------------------------------------
// HTTP 接口
// ---------------------------------------------------------------------------

// 采集器状态（含各分组上次采集时间）
router.get('/weather/status', async (req, res) => {
  let collectLog = []
  try {
    const { rows } = await pool.query(
      'SELECT scope, last_at, station_count, success_count, fail_count FROM weather_collect_log ORDER BY scope',
    )
    collectLog = rows
  } catch (error) {
    // 表尚未创建时忽略
  }
  res.json({
    ...state,
    focusIntervalMin: Math.round(FOCUS_INTERVAL_MS / 60000),
    nationalIntervalMin: Math.round(NATIONAL_INTERVAL_MS / 60000),
    batchSize: BATCH_SIZE,
    maxCoordsPerMinute: MAX_COORDS_PER_MINUTE,
    focusBbox: FOCUS_BBOX,
    source: SOURCE,
    collectLog,
  })
})

// 手动触发一轮采集（异步执行；?limit=N 限制站点数、?scope=focus|national|all）
router.post('/weather/collect-now', (req, res) => {
  if (state.running) {
    return res.json({ started: false, message: '采集正在进行中' })
  }
  const limit = Number(req.query.limit || 0)
  const scope = ['focus', 'national', 'all'].includes(req.query.scope)
    ? req.query.scope
    : 'all'
  collectOnce({ limit: Number.isFinite(limit) ? limit : 0, scope }).catch(
    error => {
      console.error('[weather] 手动采集失败:', error.message)
    },
  )
  res.json({ started: true, limit, scope })
})

// 查询单站最新实时数据（前端气象站弹窗使用）
router.get('/weather/realtime', async (req, res) => {
  try {
    const station = String(req.query.station || '').trim()
    if (!station) {
      return res
        .status(400)
        .json({ success: false, message: '缺少 station 参数' })
    }
    const { rows } = await pool.query(
      `SELECT station_id,
              to_char(obs_time AT TIME ZONE 'Asia/Shanghai', 'YYYY-MM-DD HH24:MI') AS obs_time_display,
              temperature_c, precipitation_mm, wind_speed_ms, wind_direction_deg,
              humidity_pct, weather_code, source, collected_at
         FROM weather_obs
        WHERE station_id = $1
        ORDER BY obs_time DESC
        LIMIT 1`,
      [station],
    )
    if (!rows.length) return res.json({ found: false })
    res.json({ found: true, observation: rows[0] })
  } catch (error) {
    console.error('[weather] 实时查询失败:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
})

// 外部数据推送入口（旧采集器恢复后直接复用；请求头 x-ingest-token 校验）
router.post('/weather/ingest', async (req, res) => {
  try {
    const token = req.headers['x-ingest-token'] || req.query.token
    if (token !== INGEST_TOKEN) {
      return res.status(401).json({ success: false, message: 'ingest token 无效' })
    }
    const body = req.body || {}
    const list = Array.isArray(body.observations)
      ? body.observations
      : Array.isArray(body)
        ? body
        : []
    if (!list.length) {
      return res
        .status(400)
        .json({ success: false, message: 'observations 不能为空' })
    }
    const entries = []
    for (const item of list) {
      const stationId = String(item.station_id ?? item.id ?? '').trim()
      const obsTime = item.obs_time
        ? toTimestamptz(String(item.obs_time), item.utc_offset_seconds)
        : null
      if (!stationId || !obsTime || Number.isNaN(Date.parse(obsTime))) continue
      entries.push({
        station_id: stationId,
        obs_time: obsTime,
        temperature_c: numOrNull(item.temperature_c ?? item.temperature),
        precipitation_mm: numOrNull(item.precipitation_mm ?? item.precipitation),
        wind_speed_ms: numOrNull(item.wind_speed_ms ?? item.wind_speed),
        wind_direction_deg: numOrNull(
          item.wind_direction_deg ?? item.wind_direction,
        ),
        humidity_pct: numOrNull(item.humidity_pct ?? item.humidity),
        weather_code: numOrNull(item.weather_code),
        source: String(item.source || body.source || 'external'),
        raw: item,
      })
    }
    await ensureWeatherTable()
    const saved = await saveObservations(entries)
    res.json({ success: true, saved, skipped: list.length - entries.length })
  } catch (error) {
    console.error('[weather] ingest 写入失败:', error.message)
    res.status(500).json({ success: false, message: error.message })
  }
})

// ---------------------------------------------------------------------------
// 定时调度（研究区高频 / 全国低频；启动时按上次采集时间决定是否补采）
// ---------------------------------------------------------------------------
let timerFocus = null
let timerNational = null
let kickoffTimer = null

export function startWeatherScheduler() {
  if (!ENABLED) {
    console.log('[weather] 采集器已由 WEATHER_COLLECT_ENABLED=0 关闭')
    return
  }
  if (timerFocus || timerNational) return

  const run = (scope, retryOnSkip) => {
    collectOnce({ scope })
      .then(result => {
        if (result && result.skipped && retryOnSkip) {
          setTimeout(() => run(scope, retryOnSkip), 60000)
        }
      })
      .catch(error => console.error('[weather] 定时采集失败:', error.message))
  }

  kickoffTimer = setTimeout(async () => {
    try {
      if (await needCollect('focus', FOCUS_INTERVAL_MS)) run('focus', true)
      if (await needCollect('national', NATIONAL_INTERVAL_MS)) {
        setTimeout(() => run('national', true), 20000)
      }
    } catch (error) {
      console.error('[weather] 启动采集检查失败:', error.message)
    }
  }, 8000)

  timerFocus = setInterval(() => run('focus', true), FOCUS_INTERVAL_MS)
  timerNational = setInterval(() => run('national', true), NATIONAL_INTERVAL_MS)
  console.log(
    `[weather] 采集器已启动：研究区每 ${Math.round(FOCUS_INTERVAL_MS / 60000)} 分钟 / 全国每 ${Math.round(NATIONAL_INTERVAL_MS / 60000)} 分钟（Open-Meteo，批量 ${BATCH_SIZE} 站/请求，预算 ${MAX_COORDS_PER_MINUTE} 坐标/分钟）`,
  )
}

export function stopWeatherScheduler() {
  if (kickoffTimer) {
    clearTimeout(kickoffTimer)
    kickoffTimer = null
  }
  if (timerFocus) {
    clearInterval(timerFocus)
    timerFocus = null
  }
  if (timerNational) {
    clearInterval(timerNational)
    timerNational = null
  }
}

/* ---------------------------------------------------------------------------
 * [LEGACY-ADAPTER] 旧采集器恢复时的挂接说明（保留，勿删）：
 *   1) 若旧采集器以“直接写库”方式恢复：把目标表改为 weather_obs，
 *      或在 loadStations() 之后、saveObservations() 之前接入旧采集函数，
 *      将旧格式转换为 { station_id, obs_time, temperature_c, ... } 条目即可；
 *   2) 若旧采集器以“HTTP 推送”方式恢复：保持本文件不变，直接调用
 *      POST /weather/ingest（请求头 x-ingest-token）推送；
 *   3) 平台前端与查询接口（GET /weather/realtime）对新旧数据源完全透明。
 * ------------------------------------------------------------------------- */

export default router

// ---------------------------------------------------------------------------
// 独立运行支持（Windows 计划任务 / 手动执行；不影响服务内嵌调度）
//   node weather.js --once auto      按需采集（到间隔才采；计划任务使用此模式）
//   node weather.js --once focus     强制采集研究区
//   node weather.js --once national  强制采集全国
//   node weather.js --once all       强制全量
//   node weather.js --daemon         常驻调度（等价于服务内嵌调度器）
// ---------------------------------------------------------------------------
const isMainEntry =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isMainEntry) {
  const args = process.argv.slice(2)
  ;(async () => {
    try {
      if (args[0] === '--daemon') {
        startWeatherScheduler()
        console.log('[weather] 独立守护模式运行中（Ctrl+C 退出）')
        return
      }
      const target = args[1] || 'auto'
      if (target === 'auto') {
        if (await needCollect('focus', FOCUS_INTERVAL_MS)) {
          await collectOnce({ scope: 'focus' })
        } else {
          console.log('[weather] focus 未到采集间隔，跳过')
        }
        if (await needCollect('national', NATIONAL_INTERVAL_MS)) {
          await collectOnce({ scope: 'national' })
        } else {
          console.log('[weather] national 未到采集间隔，跳过')
        }
      } else {
        await collectOnce({
          scope: ['focus', 'national', 'all'].includes(target) ? target : 'all',
        })
      }
      process.exit(0)
    } catch (error) {
      console.error('[weather] 独立运行失败:', error.message)
      process.exit(1)
    }
  })()
}
