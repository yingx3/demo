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

// 使用路由
app.use('/', displacementRouter)
app.use('/', spatialRouter)
app.use('/', uploadRouter)
app.use('/', crackRouter)
// 气象数据采集与实时查询路由（新增；旧 /weatherstation 直读链路保持不变）
app.use('/', weatherRouter)

// 启动服务器
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// 启动气象数据采集调度器（新增；默认开启，设 WEATHER_COLLECT_ENABLED=0 可关闭）
startWeatherScheduler()
