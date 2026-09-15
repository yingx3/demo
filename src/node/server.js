import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// 加载环境变量
dotenv.config()

// 创建Express应用
const app = express()

// 中间件配置
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 导入路由
import displacementRouter from './routes/displacement.js'
import spatialRouter from './routes/spatial.js'
import uploadRouter from './routes/upload.js'
import crackRouter from './routes/crack.js'
import weatherRouter, { startWeatherScheduler } from './routes/weather.js'
// 地震动波形路由（新增；数据源为 TCPClient.java 输出的 wave_*.csv）
import dzdRouter from './routes/dzd.js'
// 地震动设备数据路由（迁移自 E:\Project_GS\解析\api.js；数据源为 PGSQL 表 dzd_device_data）
import deviceRouter from './routes/device.js'

// 使用路由
app.use('/', displacementRouter)
app.use('/', spatialRouter)
app.use('/', uploadRouter)
app.use('/', crackRouter)
// 气象数据采集与实时查询路由（新增；旧 /weatherstation 直读链路保持不变）
app.use('/', weatherRouter)
// 地震动波形路由（新增；与 TCPClient.java 的 CSV 输出保持一致）
app.use('/', dzdRouter)
// 地震动设备数据路由（PGSQL dzd_device_data；替代原 3001 独立服务）
app.use('/', deviceRouter)

// 启动服务器
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// 启动气象数据采集调度器（新增；默认开启，设 WEATHER_COLLECT_ENABLED=0 可关闭）
startWeatherScheduler()
