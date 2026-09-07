import express from 'express'
import pool from '../db.js'

const router = express.Router()

// 配置允许查询的字段白名单及对应数据库字段名
const ALLOWED_ATTRIBUTES = {
  地点: 'name',
  slope: 'slope',
  scale: 'scale',
  jyl: 'jyl',
  wind: 'wind',
}

// 获取所有空间参考数据
router.get('/', async (req, res) => {
  try {

    const { rows } = await pool.query('SELECT * FROM point1')
    res.send(rows)
  } catch (error) {
    console.error('数据库查询错误:', error)
    res.status(500).json({
      success: false,
      message: '数据库查询失败',
      error: error.message,
    })
  }
})

// 获取指定名称的点数据
router.get('/point', async (req, res) => {
  try {
    const { name } = req.query
    if (!name) {
      return res.status(400).json({ error: '缺少 name 参数' })
    }

    const { rows } = await pool.query(
      `SELECT name, dcmd, lssl, slope, hlxqsl, pthhsmj, elevation, scale, ST_X(geom) AS lng,ST_Y(geom) AS lat FROM point2 WHERE name = $1`,
      [name],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: '未找到匹配记录' })
    }
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

// 根据属性查询点数据
router.get('/point/attribute', async (req, res) => {
  try {
    const { attribute_name, attribute_value } = req.query

    if (!attribute_name || !attribute_value) {
      return res.status(400).json({
        error: '缺少必要参数',
        details: {
          required: ['attribute_name', 'attribute_value'],
          received: req.query,
        },
      })
    }

    const dbField = ALLOWED_ATTRIBUTES[attribute_name]
    if (!dbField) {
      return res.status(400).json({
        error: '不支持的属性名称',
        allowed_attributes: Object.keys(ALLOWED_ATTRIBUTES),
      })
    }

    const { rows } = await pool.query(
      `SELECT 
        name, dcmd, lssl, slope, hlxqsl, 
        pthhsmj, elevation, scale, 
        ST_X(geom) AS lng, ST_Y(geom) AS lat 
       FROM point2 
       WHERE ${dbField} = $1
       LIMIT 100`,
      [attribute_value],
    )

    if (rows.length === 0) {
      return res.status(404).json({
        message: '未找到匹配数据',
        query: { attribute_name, attribute_value },
      })
    }

    res.json({
      count: rows.length,
      data: rows,
    })
  } catch (error) {
    console.error('数据库查询失败:', error)
    res.status(500).json({
      error: '服务器内部错误',
      details: error.message,
    })
  }
})

// 根据属性查询 qxz 点数据
router.get('/point/attribute_qxz', async (req, res) => {
  try {
    const { attribute_name, attribute_value } = req.query

    if (!attribute_name || !attribute_value) {
      return res.status(400).json({
        error: '缺少必要参数',
        details: {
          required: ['attribute_name', 'attribute_value'],
          received: req.query,
        },
      })
    }

    const dbField = ALLOWED_ATTRIBUTES[attribute_name]
    if (!dbField) {
      return res.status(400).json({
        error: '不支持的属性名称',
        allowed_attributes: Object.keys(ALLOWED_ATTRIBUTES),
      })
    }

    const { rows } = await pool.query(
      `SELECT 
      z_name, jyl, wind, ST_X(geom) AS lng,ST_Y(geom) AS lat 
      FROM point_qxz WHERE ${dbField} = $1 
      LIMIT 100`,
      [attribute_value],
    )

    if (rows.length === 0) {
      return res.status(404).json({
        message: '未找到匹配数据',
        query: { attribute_name, attribute_value },
      })
    }

    res.json({
      count: rows.length,
      data: rows,
    })
  } catch (error) {
    console.error('数据库查询失败:', error)
    res.status(500).json({
      error: '服务器内部错误',
      details: error.message,
    })
  }
})

// 获取指定名称的 qxz 点数据
router.get('/point_qxz', async (req, res) => {
  try {
    const { z_name } = req.query
    if (!z_name) {
      return res.status(400).json({ error: '缺少 name 参数' })
    }

    const { rows } = await pool.query(
      `SELECT z_name, jyl, wind, ST_X(geom) AS lng,ST_Y(geom) AS lat FROM point_qxz WHERE z_name = $1`,
      [z_name],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: '未找到匹配记录' })
    }
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

// 获取 weatherstation 数据
router.get('/weatherstation', async (req, res) => {
  try {

    const { rows } = await pool.query('SELECT * FROM weatherstation')
    res.send(rows)
  } catch (error) {
    console.error('数据库查询错误:', error)
    res.status(500).json({
      success: false,
      message: '数据库查询失败',
      error: error.message,
    })
  }
})

// 获取 river 数据
router.get('/river', async (req, res) => {
  try {

    const { rows } = await pool.query('SELECT * FROM river')
    res.send(rows)
  } catch (error) {
    console.error('数据库查询错误:', error)
    res.status(500).json({
      success: false,
      message: '数据库查询失败',
      error: error.message,
    })
  }
})

// 获取 glacier 数据
router.get('/glacier', async (req, res) => {
  try {

    const { rows } = await pool.query('SELECT * FROM glacier')
    res.send(rows)
  } catch (error) {
    console.error('数据库查询错误:', error)
    res.status(500).json({
      success: false,
      message: '数据库查询失败',
      error: error.message,
    })
  }
})

// 创建新的点要素
router.post('/point', async (req, res) => {
  try {
    const { name, dcmd, lssl, slope, hlxqsl, pthhsmj, elevation, scale, geom } = req.body

    if (!geom || geom.type !== 'Point') {
      return res.status(400).send('Invalid GeoJSON')
    }

    const result = await pool.query(
      'INSERT INTO point2(name,dcmd,lssl,slope,hlxqsl,pthhsmj,elevation,scale,geom) VALUES($1,$2,$3,$4,$5,$6,$7,$8,ST_SetSRID(ST_GeomFromGeoJSON($9),4326)) RETURNING *',
      [
        name,
        dcmd,
        lssl,
        slope,
        hlxqsl,
        pthhsmj,
        elevation,
        scale,
        JSON.stringify(geom),
      ],
    )

    res.status(201).send(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send('创建要素失败')
  }
})

export default router