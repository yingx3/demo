import express from 'express'
import pool from '../db.js'

/**
 * 地震动设备数据查询路由（PGSQL）
 * ---------------------------------------------------------------------------
 * 迁移自独立服务 E:\Project_GS\解析\api.js（原 Sequelize + 独立端口 3001），
 * 现统一由本 node 服务（默认 3000）以 /device/* 暴露，复用 src/node/db.js 的连接池，
 * 不再需要单独启动 3001 进程。
 *
 * 数据表：dzd_device_data（由采集端写入：厂商采集程序 app.js / TCPClient 等）
 * 字段：deviceid, gps_longitude, gps_latitude, gps_high, timestamp,
 *       channel_one_lp_x|y|z, channel_two_lp_x|y|z
 *
 * 环境变量：
 *   DZD_DEVICE_TABLE  表名（默认 dzd_device_data）
 *   DZD_DEVICE_IDS    /device/latestAll 关注的设备 ID（逗号分隔）
 *                     默认 41109656,41126040,41158808（与原 api.js 一致）
 *   DZD_DEVICE_LIMIT  最新记录条数（默认 100，与原 api.js 一致）
 *
 * 接口（路径与返回结构与原 api.js 保持一致）：
 *   GET /device/all                 全量数据（?limit= 可选，按时间倒序取）
 *   GET /device/latestAll           关注设备各自最新 N 条（对象：deviceId -> 数组）
 *   GET /device/latest/:deviceid    单设备最新 N 条（timestamp 倒序）
 *   GET /device/status              诊断：表、总行数、设备清单与最新时间
 */

const router = express.Router()

const rawTable = process.env.DZD_DEVICE_TABLE || 'dzd_device_data'
const TABLE = /^[A-Za-z_][A-Za-z0-9_]*$/.test(rawTable) ? rawTable : 'dzd_device_data'

const DEFAULT_DEVICE_IDS = [41109656, 41126040, 41158808]
const DEVICE_IDS = String(process.env.DZD_DEVICE_IDS || '')
  .split(',')
  .map(item => Number(item.trim()))
  .filter(item => Number.isInteger(item) && item > 0)
const TARGET_DEVICE_IDS = DEVICE_IDS.length ? DEVICE_IDS : DEFAULT_DEVICE_IDS

const LATEST_LIMIT = Math.max(1, Math.min(Number(process.env.DZD_DEVICE_LIMIT) || 100, 5000))

const CHANNEL_FIELDS = [
  'channel_one_lp_x',
  'channel_one_lp_y',
  'channel_one_lp_z',
  'channel_two_lp_x',
  'channel_two_lp_y',
  'channel_two_lp_z',
]
const FULL_FIELDS = [
  'deviceid',
  'gps_longitude',
  'gps_latitude',
  'gps_high',
  'timestamp',
  ...CHANNEL_FIELDS,
]

function parseDeviceId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function fail(res, label, error) {
  console.error('[device] ' + label + ' 失败:', error)
  res.status(500).json({ error: '查询失败', details: error.message })
}

/** 全量设备数据：前端据此挑出每个设备的最新一条来落图 */
router.get('/device/all', async (req, res) => {
  try {
    const limit = Number(req.query.limit)
    const hasLimit = Number.isFinite(limit) && limit > 0
    const sql =
      'SELECT ' + FULL_FIELDS.join(', ') + ' FROM ' + TABLE + ' ORDER BY timestamp ' +
      (hasLimit ? 'DESC LIMIT $1' : 'ASC')
    const params = hasLimit ? [Math.min(Math.floor(limit), 20000)] : []
    const { rows } = await pool.query(sql, params)
    res.json(rows)
  } catch (error) {
    fail(res, 'all', error)
  }
})

/** 关注设备各自最新 N 条（对象结构，与原 api.js 的 /device/latestAll 一致） */
router.get('/device/latestAll', async (req, res) => {
  try {
    const data = {}
    for (const id of TARGET_DEVICE_IDS) {
      const { rows } = await pool.query(
        'SELECT ' + FULL_FIELDS.join(', ') + ' FROM ' + TABLE +
          ' WHERE deviceid = $1 ORDER BY timestamp DESC LIMIT $2',
        [id, LATEST_LIMIT],
      )
      data[String(id)] = rows
    }
    res.json(data)
  } catch (error) {
    fail(res, 'latestAll', error)
  }
})

/** 单设备最新 N 条：字段与顺序保持与原 api.js 一致（timestamp 倒序） */
router.get('/device/latest/:deviceid', async (req, res) => {
  try {
    const deviceId = parseDeviceId(req.params.deviceid)
    if (deviceId === null) {
      return res.status(400).json({ error: 'deviceid 必须为正整数' })
    }
    const { rows } = await pool.query(
      'SELECT timestamp, ' + CHANNEL_FIELDS.join(', ') + ' FROM ' + TABLE +
        ' WHERE deviceid = $1 ORDER BY timestamp DESC LIMIT $2',
      [deviceId, LATEST_LIMIT],
    )
    if (!rows.length) {
      return res.status(404).json({ message: '未找到设备 ' + deviceId + ' 的数据' })
    }
    res.json(rows)
  } catch (error) {
    fail(res, 'latest', error)
  }
})

/** 诊断接口：确认表、行数与设备清单（前端/排查用） */
router.get('/device/status', async (req, res) => {
  try {
    const total = await pool.query('SELECT count(*)::int AS rows FROM ' + TABLE)
    const devices = await pool.query(
      'SELECT deviceid, count(*)::int AS rows, max(timestamp) AS latest FROM ' + TABLE +
        ' GROUP BY deviceid ORDER BY deviceid',
    )
    res.json({
      table: TABLE,
      rows: total.rows[0] ? total.rows[0].rows : 0,
      latestLimit: LATEST_LIMIT,
      targetDeviceIds: TARGET_DEVICE_IDS,
      devices: devices.rows,
    })
  } catch (error) {
    fail(res, 'status', error)
  }
})

export default router
