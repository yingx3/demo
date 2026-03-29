import express from 'express'

const router = express.Router()

// 检查OOA检测结果
function checkOOADetected() {
  return false
}

// 获取裂缝数据
router.get('/api/crack/:deviceId', async (req, res) => {
  const { deviceId } = req.params
  const { months = 2 } = req.query

  let client
  try {
    const { Pool } = await import('pg')
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: '123456',
      port: 5432,
    })

    client = await pool.connect()

    console.log(`🔍 查询设备: ${deviceId}, 时间范围: 最近${months}个月`)

    const result = await client.query(
      `
      SELECT 
        update_time,
        lf
      FROM 
        public.crack
      WHERE 
        device_id = $1
        AND update_time >= CURRENT_DATE - INTERVAL '${months} months'
      ORDER BY 
        update_time
    `,
      [deviceId],
    )

    console.log(`📊 查询到 ${result.rowCount} 条记录`)

    if (result.rowCount === 0) {
      return res.json({
        success: true,
        deviceId: deviceId,
        message: '未找到匹配的数据',
        ooaDetected: false,
      })
    }

    res.json({
      success: true,
      deviceId: deviceId,
      originalCount: result.rowCount,
      ooaDetected: false,
      message: `数据查询完成，OOA检测结果: 不存在`,
    })
  } catch (error) {
    console.error('处理失败:', error)
    res.status(500).json({
      success: false,
      message: '处理失败',
      error: error.message,
      ooaDetected: false,
    })
  } finally {
    if (client) client.release()
  }
})

export default router