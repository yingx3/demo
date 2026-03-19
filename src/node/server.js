import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { exec } from 'child_process'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import XLSX from 'xlsx'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// 加载环境变量
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// const upload = multer({ dest: 'uploads/' })
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname) // 保留原始文件名
  },
})
const upload = multer({ storage })
let filePath
// 文件保存路径
const SAVE_PATH =
  'E:/Projects/ZHLXT/算法/基于位移监测滑坡预警/PFTF_1.0.0/PFTF_1.0.0/icelake'
// const SAVE_PATH = 'D:/practice/PFTF/icelake'
// 目标R脚本路径
const TARGET_PATH =
  'E:/Projects/ZHLXT/算法/基于位移监测滑坡预警/PFTF_1.0.0/PFTF_1.0.0/PFTF-PFTF_1.0.0'
// const TARGET_PATH = 'D:/practice/PFTF/PFTF_1.0.0/PFTF-PFTF_1.0.0'
const R_SCRIPT_PATH = path.join(TARGET_PATH, '1_1_input.R')
const displ_file = ''

// Kingbase8 数据库配置
const dbConfig = {
  // user: 'system',
  // host: '172.21.135.11',
  // database: 'icelake',
  // password: 'Sipsd123!@#',
  // port: 54321,
  // connectionTimeoutMillis: 10000,
  // idleTimeoutMillis: 30000,
  //@王茂
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123456',
  port: 5432,
  //syl
  // user: 'postgres',
  // host: 'localhost',
  // database: 'postgis',
  // password: '123456',
  // port: 5432,
}

// 创建数据库连接池
let pool
try {
  const { Pool } = await import('pg')
  pool = new Pool(dbConfig)
  console.log('✅ 数据库连接池创建成功')
} catch (error) {
  console.error('❌ 创建数据库连接池失败:', error.message)
}

// 确保保存目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`📁 创建目录: ${dirPath}`)
  }
}

function formatUTCTimestamp(date) {
  const pad = n => n.toString().padStart(2, '0')
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
}

function readExcelData(filePath) {
  // console.log('1111')
  console.log(filePath)
  try {
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // 直接获取原始数据，避免自动日期转换
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false })

    console.log(`从Excel读取 ${data.length} 条记录`)

    // 检查数据格式
    if (data.length > 0) {
      const firstRow = data[0]
      // console.log('数据格式:', Object.keys(firstRow));
      console.log('时间示例:', firstRow.timestamp)
      console.log('位移示例:', firstRow.displ)
    }
    return data
  } catch (error) {
    console.error('❌ 读取Excel失败:', error.message)
    throw error
  }
}
// 处理时间数据并转换为整点
function processHourlyData(filePath) {
  console.log('🔄 正在处理时间数据...')
  const data = readExcelData(filePath)
  // console.log(data)
  const hourlyGroups = {}

  data.forEach((row, index) => {
    if (!row || !row.timestamp) {
      console.warn(`⚠️ 第${index + 1}行: 缺少timestamp`)
      return
    }

    try {
      // 直接使用字符串时间，避免时区转换
      const timeStr = row.timestamp.toString()

      // 解析时间字符串（保持原有时区）
      const [datePart, timePart] = timeStr.split(' ')
      const [year, month, day] = datePart.split('-').map(Number)
      const [hours, minutes] = timePart.split(':').map(Number)

      // 创建UTC时间对象（避免时区转换）
      const timestamp = new Date(Date.UTC(year, month - 1, day, hours, minutes))

      // 创建整点时间键（UTC时间）
      const hourKey = new Date(Date.UTC(year, month - 1, day, hours, 0))

      const hourKeyStr = hourKey.toISOString()

      if (!hourlyGroups[hourKeyStr]) {
        hourlyGroups[hourKeyStr] = []
      }

      const displValue = parseFloat(row.displ) || 0

      hourlyGroups[hourKeyStr].push({
        originalTime: timeStr, // 保留原始时间字符串
        timestamp: timestamp,
        displ: displValue,
      })
    } catch (error) {
      // console.warn(`第${index + 1}行: 时间解析错误`, error.message);
    }
  })

  const processedData = []

  Object.keys(hourlyGroups)
    .sort()
    .forEach(hourKey => {
      const hourData = hourlyGroups[hourKey]
      const hourDate = new Date(hourKey)

      // 使用该小时第一个数据（保持数据一致性）
      if (hourData.length > 0) {
        processedData.push({
          timestamp: formatUTCTimestamp(hourDate), // 使用整点时间
          displ: hourData[0].displ,
        })
      }
    })

  console.log(`处理前: ${data.length} 条, 处理后: ${processedData.length} 条`)
  // console.log(processedData)
  return processedData
}

// 将处理后的数据保存为CSV文件（覆写模式）
function saveProcessedCSV(data) {
  try {
    ensureDirectoryExists(SAVE_PATH)

    const filename = 'displ_data_processed.csv'
    const filepath = path.join(SAVE_PATH, filename)

    // 检查文件是否存在，如果存在则删除
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
      // console.log('删除已存在的CSV文件');
    }

    // CSV文件头
    let csvContent = 'timestamp,displ\n'

    // 添加数据行（使用格式化的时间字符串）
    data.forEach(row => {
      csvContent += `"${row.timestamp}","${row.displ}"\n`
    })

    // 写入文件
    fs.writeFileSync(filepath, csvContent, 'utf8')
    console.log(`CSV文件已保存（覆写模式）: ${filepath}`)

    return {
      filename: filename,
      filepath: filepath,
      recordCount: data.length,
    }
  } catch (error) {
    console.error('保存CSV文件失败:', error.message)
    throw error
  }
}

// 将CSV文件转换为RDA文件（覆写模式）
function convertToRDA(csvFilePath) {
  return new Promise((resolve, reject) => {
    try {
      const rdaFilename = 'displ_data.rda'
      const rdaFilePath = path.join(SAVE_PATH, rdaFilename)

      // 检查RDA文件是否存在，如果存在则删除
      if (fs.existsSync(rdaFilePath)) {
        fs.unlinkSync(rdaFilePath)
        // console.log('删除已存在的RDA文件');
      }

      // R脚本 - 使用指定的时间格式和时区
      const rScriptContent = `
# 读取CSV文件
displ_data <- read.csv("${csvFilePath.replace(/\\/g, '/')}")

# 转换时间格式，使用指定的格式和UTC时区
displ_data$timestamp <- as.POSIXct(displ_data$timestamp, format = "%Y-%m-%d %H:%M", tz = "UTC")

# 按时间排序
displ_data <- displ_data[order(displ_data$timestamp), ]

# 检查数据结构
cat("数据结构:\\n")
str(displ_data)
cat("\\n时间范围: ", as.character(range(displ_data$timestamp)), "\\n")

# 保存为RDA文件（会覆写已存在的文件）
save(displ_data, file = "${rdaFilePath.replace(/\\/g, '/')}")

cat("成功转换", nrow(displ_data), "条记录到RDA文件\\n")
# cat("RDA文件已保存:", "${rdaFilePath.replace(/\\/g, '/')}\\n")
cat("时间格式: %Y-%m-%d %H:%M\\n")
cat("时区: UTC\\n")
`

      // 写入临时R脚本（覆写模式）
      const rScriptPath = path.join(SAVE_PATH, 'convert_to_rda.R')
      if (fs.existsSync(rScriptPath)) {
        fs.unlinkSync(rScriptPath)
      }
      fs.writeFileSync(rScriptPath, rScriptContent, 'utf8')

      // 执行R脚本
      const Rscript = '"D:/application/r/baseR/bin/Rscript.exe"'
      // const Rscript = '"C:\\Program Files\\R\\R-4.5.1\\bin\\x64\\Rscript.exe"'
      const command = `cd /d "${SAVE_PATH}" && ${Rscript} "${rScriptPath}"`

      console.log('正在转换为RDA格式...')
      exec(command, (error, stdout, stderr) => {
        // 清理临时文件
        try {
          if (fs.existsSync(rScriptPath)) {
            fs.unlinkSync(rScriptPath)
          }
        } catch (e) {}

        if (error) {
          console.error('❌ R脚本执行失败:', error.message)
          if (stderr) console.error('R脚本错误:', stderr)
          reject(error)
          return
        }

        console.log('R脚本输出:', stdout)
        if (stderr) {
          console.warn('R脚本警告:', stderr)
        }

        const recordCount = parseInt(
          stdout.match(/成功转换 (\d+) 条记录/)?.[1] || '0',
        )

        resolve({
          filename: rdaFilename,
          filepath: rdaFilePath,
          recordCount: recordCount,
          variableName: 'displ_data',
          timeFormat: '%Y-%m-%d %H:%M',
          timezone: 'UTC',
        })
      })
    } catch (error) {
      reject(error)
    }
  })
}

// 复制文件到目标路径
function copyFile(sourcePath, targetPath) {
  return new Promise((resolve, reject) => {
    try {
      // 确保目标目录存在
      const targetDir = path.dirname(targetPath)
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      // 如果目标文件已存在，先删除
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath)
      }

      // 复制文件
      fs.copyFileSync(sourcePath, targetPath)
      console.log(`📋 文件已复制到: ${targetPath}`)
      resolve(true)
    } catch (error) {
      console.error('❌ 文件复制失败:', error.message)
      reject(error)
    }
  })
}

// 读取CSV文件的第一行和最后一行时间
function getCSVTimeRange(csvFilePath) {
  try {
    const csvContent = fs.readFileSync(csvFilePath, 'utf8')
    const lines = csvContent.trim().split('\n')

    // 跳过标题行，获取数据行
    if (lines.length <= 1) {
      throw new Error('CSV文件没有数据')
    }

    // 获取第一行数据（第二行，因为第一行是标题）
    const firstLine = lines[1].split(',')
    const firstTimestamp = firstLine[0].replace(/"/g, '').trim()

    // 获取最后一行数据
    const lastLine = lines[lines.length - 1].split(',')
    const lastTimestamp = lastLine[0].replace(/"/g, '').trim()

    console.log(`📅 时间范围: ${firstTimestamp} 至 ${lastTimestamp}`)

    return {
      firstTimestamp: firstTimestamp,
      lastTimestamp: lastTimestamp,
    }
  } catch (error) {
    console.error('❌ 读取CSV时间范围失败:', error.message)
    throw error
  }
}

// 计算最后一天的时间
function getFiveDaysBeforeLast(lastTimestamp) {
  const lastDate = new Date(lastTimestamp)
  const fiveDaysBefore = new Date(lastDate)
  fiveDaysBefore.setDate(lastDate.getDate())

  // 格式化为 YYYY-MM-DD HH:00:00
  const pad = n => n.toString().padStart(2, '0')
  return `${fiveDaysBefore.getFullYear()}-${pad(
    fiveDaysBefore.getMonth() + 1,
  )}-${pad(fiveDaysBefore.getDate())} ${pad(fiveDaysBefore.getHours())}:00:00`
}

// 修改R脚本文件
function modifyRScript(rScriptPath, startTime, endTime) {
  try {
    // 备份原始文件
    const backupPath = rScriptPath + '.backup'
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(rScriptPath, backupPath)
      console.log('📦 已创建R脚本备份文件')
    }

    // 读取R脚本内容
    let content = fs.readFileSync(rScriptPath, 'utf8')

    // 修改第16行的开始时间
    content = content.replace(
      /start_of_calc <- as\.POSIXct\(".*?", tz="UTC"\)/,
      `start_of_calc <- as.POSIXct("${startTime}", tz="UTC")`,
    )

    // 修改第21行的结束时间（最后一天的前5天）
    content = content.replace(
      /start_of_sim <- as\.POSIXct\(".*?", tz="UTC"\)/,
      `start_of_sim <- as.POSIXct("${endTime}", tz="UTC")`,
    )

    // 写入修改后的内容
    fs.writeFileSync(rScriptPath, content, 'utf8')
    console.log(`✏️  R脚本已修改: 开始时间=${startTime}, 结束时间=${endTime}`)

    return true
  } catch (error) {
    console.error('❌ 修改R脚本失败:', error.message)
    throw error
  }
}

// 恢复R脚本到原始状态
function restoreRScript(rScriptPath) {
  try {
    const backupPath = rScriptPath + '.backup'
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, rScriptPath)
      console.log('↩️  R脚本已恢复到原始状态')
      return true
    }
    return false
  } catch (error) {
    console.error('❌ 恢复R脚本失败:', error.message)
    throw error
  }
}

function executeRScript(rScriptPath) {
  return new Promise((resolve, reject) => {
    try {
      const Rscript = '"D:/application/r/baseR/bin/Rscript.exe"'
      // const Rscript = '"C:\\Program Files\\R\\R-4.5.1\\bin\\x64\\Rscript.exe"'
      const command = `cd /d "${path.dirname(
        rScriptPath,
      )}" && ${Rscript} "${rScriptPath}"`

      console.log('🚀 正在执行R脚本...')
      console.log('执行命令:', command)

      const child = exec(command, { cwd: path.dirname(rScriptPath) })

      let stdoutData = ''
      let stderrData = ''

      // 实时输出stdout
      child.stdout.on('data', data => {
        process.stdout.write(data) // 实时输出
        stdoutData += data
      })

      // 实时输出stderr
      child.stderr.on('data', data => {
        process.stderr.write(data) // 实时输出
        stderrData += data
      })

      child.on('close', code => {
        // console.log('\n✅ R脚本执行完成，退出码:', code);

        if (code === 0) {
          resolve(stdoutData)
        } else {
          const error = new Error(`R脚本执行失败，退出码: ${code}`)
          error.stdout = stdoutData
          error.stderr = stderrData
          reject(error)
        }
      })

      child.on('error', error => {
        console.error('❌ 启动R脚本失败:', error.message)
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}
// 现有的文件上传路由
app.post('/displ', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ code: 400, message: '没有文件上传' })
  }

  // 这里 req.file.originalname 才是上传时的真实文件名
  filePath = path.join(__dirname, 'uploads', req.file.originalname)
  console.log('保存路径：', filePath)
  res.json({
    code: 200,
    fileName: req.file.originalname, // 上传时的文件名
    savedPath: filePath, // 保存到服务器的路径 (uploads/xxxx)
  })
})

app.get('/displ_file', async (req, res) => {
  try {
    // 1. 首先处理文件和执行R脚本
    const processedData = processHourlyData(filePath)
    const timeSeriesData = processHourlyData(filePath)

    const csvInfo = saveProcessedCSV(processedData)
    const rdaInfo = await convertToRDA(csvInfo.filepath)
    // ... 其他文件处理操作 ...
    //     // 复制RDA文件到目标路径
    const targetRdaPath = path.join(TARGET_PATH, 'displ_data.rda')
    await copyFile(rdaInfo.filepath, targetRdaPath)

    // 读取CSV文件的时间范围
    const timeRange = getCSVTimeRange(csvInfo.filepath)

    // 计算最后一天的时间
    const fiveDaysBeforeLast = getFiveDaysBeforeLast(timeRange.lastTimestamp)

    // 修改R脚本
    await modifyRScript(
      R_SCRIPT_PATH,
      timeRange.firstTimestamp,
      fiveDaysBeforeLast,
    )

    // 执行R脚本
    const rScriptResult = await executeRScript(R_SCRIPT_PATH)
    console.log('R脚本执行完毕！')

    // 恢复R脚本到原始状态
    // await restoreRScript(R_SCRIPT_PATH);
    const rt_json = path.join(TARGET_PATH, 'rt_data.json')
    const data = await fs.promises.readFile(rt_json, 'utf8')
    // console.log(data)
    // 2. 然后进行数据库操作
    const longitude = req.query['form_inverseV[longitude]']
    const latitude = req.query['form_inverseV[latitude]']
    const Name = req.query['form_inverseV[name]']
    // console.log(Name)
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      // ... 数据库操作 ...
      // 查找是否已存在该坐标的监测点（在一定容差范围内）
      const findPointQuery = `
        SELECT point_id FROM monitoring_points 
        WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), 0.001)
        LIMIT 1
      `
      const pointResult = await client.query(findPointQuery, [
        longitude,
        latitude,
      ])
      let pointId
      const data_forecast = JSON.parse(data)
      if (pointResult.rows.length > 0) {
        // 点已存在，使用现有point_id
        pointId = pointResult.rows[0].point_id
        console.log(`找到现有监测点，ID: ${pointId}`)
      } else {
        // 点不存在，创建新监测点
        const insertPointQuery = `
          INSERT INTO monitoring_points (point_name, geom, description,rt,time)
          VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $2 || ',' || $3 || '的监测点',$4,$5)
          RETURNING point_id
        `
        const pointName = `${Name}`
        const newPointResult = await client.query(insertPointQuery, [
          pointName,
          longitude,
          latitude,
          data_forecast.rt,
          data_forecast.time,
        ])
        pointId = newPointResult.rows[0].point_id
        console.log(`创建新监测点，ID: ${pointId}`)
      }
      // console.log(Json.parse(data))
      // console.log(data_forecast.rt, data_forecast.time)

      // 4. 插入时间序列数据
      const insertDataQuery = `
        INSERT INTO displacement_data (point_id, record_time, displacement)
        VALUES ($1, $2, $3)
        ON CONFLICT (point_id,record_time) DO UPDATE 
        SET displacement = EXCLUDED.displacement
      `

      let insertedCount = 0
      for (const row of timeSeriesData) {
        // 处理Excel日期格式（可能是数字或日期对象）
        let recordTime
        if (typeof row.timestamp === 'number') {
          // Excel日期数字转JS日期
          recordTime = XLSX.SSF.parse_date_code(row.timestamp)
        } else if (row.timestamp instanceof Date) {
          recordTime = row.timestamp
        } else if (typeof row.timestamp === 'string') {
          try {
            // 将字符串转换为Date对象
            recordTime = new Date(row.timestamp)

            // 验证日期是否有效
            if (isNaN(recordTime.getTime())) {
              console.warn('无效的时间戳字符串，跳过:', row.timestamp)
              continue
            }

            // console.log(
            //   `解析时间字符串: ${row.timestamp} -> ${recordTime.toISOString()}`
            // )
          } catch (error) {
            console.warn('解析时间字符串时出错，跳过:', row.timestamp, error)
            continue
          }
        } else {
          console.warn('跳过无法解析的时间戳:', row.timestamp)
          continue
        }

        await client.query(insertDataQuery, [
          pointId,
          recordTime,
          parseFloat(row.displ),
        ])
        insertedCount++
      }

      await client.query('COMMIT')

      // 3. 最后发送一次组合的响应
      return res.json({
        success: true,
        fileProcessing: {
          processedCount: rdaInfo.recordCount,
          timeRange: {
            /* ... */
          },
          rdaFile: targetRdaPath,
          rScriptExecuted: true,
          rt_json: JSON.parse(data),
        },
        databaseOperation: {
          pointId: pointId,
          recordsInserted: insertedCount,
          coordinates: { longitude, latitude },
        },
      })
    } catch (dbError) {
      await client.query('ROLLBACK')
      throw dbError
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('处理失败:', error)
    return res.status(500).json({
      success: false,
      message: '处理失败',
      error: error.message,
    })
  }
})

//获取数据库的位移数据
app.get('/search_displ', async (req, res) => {
  const pointId = req.query.pointId // 从查询参数获取 pointId

  // 验证参数
  if (!pointId) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数: pointId',
    })
  }

  // 验证 pointId 是否为有效数字
  const pointIdNum = parseInt(pointId)
  if (isNaN(pointIdNum)) {
    return res.status(400).json({
      success: false,
      type: 'warning',
      message: 'pointId 必须是有效的数字',
    })
  }

  const client = await pool.connect()

  try {
    // 查询数据库，获取指定 pointId 的所有位移数据
    const query = `
      SELECT record_time, displacement
      FROM displacement_data
      WHERE point_id = $1
      ORDER BY record_time ASC
    `

    const result = await client.query(query, [pointIdNum])

    if (result.rows.length === 0) {
      // 没有找到数据
      return res.status(404).json({
        success: false,
        type: 'warning',
        message: '未找到该监测点的位移数据',
        data: [],
      })
    }

    // 找到数据，返回成功响应
    res.json({
      success: true,
      message: '数据获取成功',
      data: result.rows,
      total: result.rows.length,
    })
  } catch (error) {
    console.error('数据库查询错误:', error)
    res.status(500).json({
      success: false,
      type: 'error',
      message: '数据库查询失败',
      error: error.message,
    })
  } finally {
    client.release()
  }
})
app.get('/api/crack/:deviceId', async (req, res) => {
  const { deviceId } = req.params
  const { months = 2 } = req.query

  let client
  try {
    client = await pool.connect()

    console.log(`🔍 查询设备: ${deviceId}, 时间范围: 最近${months}个月`)

    // 查询所有匹配的数据
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

    // 处理时间数据（转换为整点）
    const processedData = processHourlyData(result.rows)

    // 保存处理后的CSV文件
    const csvInfo = saveProcessedCSV(processedData)

    // 转换为RDA文件
    const rdaInfo = await convertToRDA(csvInfo.filepath)

    // 复制RDA文件到目标路径
    const targetRdaPath = path.join(TARGET_PATH, 'displ_data.rda')
    await copyFile(rdaInfo.filepath, targetRdaPath)

    // 读取CSV文件的时间范围
    const timeRange = getCSVTimeRange(csvInfo.filepath)

    // 计算最后一天的前5天时间
    const fiveDaysBeforeLast = getFiveDaysBeforeLast(timeRange.lastTimestamp)

    // 修改R脚本
    await modifyRScript(
      R_SCRIPT_PATH,
      timeRange.firstTimestamp,
      fiveDaysBeforeLast,
    )

    // 执行R脚本
    const rScriptOutput = await executeRScript(R_SCRIPT_PATH)

    // 检测OOA detected
    const ooaDetected = checkOOADetected()

    // 恢复R脚本到原始状态
    await restoreRScript(R_SCRIPT_PATH)

    res.json({
      success: true,
      deviceId: deviceId,
      originalCount: result.rowCount,
      processedCount: rdaInfo.recordCount,
      timeRange: {
        start: timeRange.firstTimestamp,
        end: timeRange.lastTimestamp,
        simulationStart: fiveDaysBeforeLast,
      },
      rdaFile: targetRdaPath,
      rScriptExecuted: true,
      ooaDetected: ooaDetected,
      rScriptOutput: rScriptOutput,
      message: `数据处理完成并已执行R脚本，OOA检测结果: ${
        ooaDetected ? '存在' : '不存在'
      }`,
    })
  } catch (error) {
    console.error('处理失败:', error)

    // 尝试恢复R脚本（如果修改过）
    try {
      await restoreRScript(R_SCRIPT_PATH)
    } catch (restoreError) {
      console.error('恢复R脚本失败:', restoreError.message)
    }

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
//获取所有空间参考数据
app.get('/', async (req, res) => {
  //   res.send('Success!')
  const { rows } = await pool.query('SELECT * FROM point1')
  res.send(rows)
})
app.get('/point', async (req, res) => {
  try {
    const { name } = req.query
    // 参数验证
    if (!name) {
      return res.status(400).json({ error: '缺少 name 参数' })
    }
    // 使用参数化查询防止 SQL 注入
    const { rows } = await pool.query(
      `SELECT name, dcmd, lssl, slope, hlxqsl, pthhsmj, elevation, scale, ST_X(geom) AS lng,ST_Y(geom) AS lat FROM point2 WHERE name = $1`,
      [name],
    )

    // 处理查询结果
    if (rows.length === 0) {
      return res.status(404).json({ error: '未找到匹配记录' })
    }
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

// 配置允许查询的字段白名单及对应数据库字段名
const ALLOWED_ATTRIBUTES = {
  地点: 'name', // 前端传'location'对应数据库的'name'字段
  slope: 'slope', // 中文参数映射
  scale: 'scale',
  jyl: 'jyl',
  wind: 'wind',
}

app.get('/point/attribute', async (req, res) => {
  try {
    const { attribute_name, attribute_value } = req.query
    console.log(attribute_name, attribute_value)

    // 参数验证
    if (!attribute_name || !attribute_value) {
      return res.status(400).json({
        error: '缺少必要参数',
        details: {
          required: ['attribute_name', 'attribute_value'],
          received: req.query,
        },
      })
    }

    // 检查是否允许查询该字段
    const dbField = ALLOWED_ATTRIBUTES[attribute_name]
    if (!dbField) {
      return res.status(400).json({
        error: '不支持的属性名称',
        allowed_attributes: Object.keys(ALLOWED_ATTRIBUTES),
      })
    }

    // 统一查询逻辑
    const { rows } = await pool.query(
      `SELECT 
        name, dcmd, lssl, slope, hlxqsl, 
        pthhsmj, elevation, scale, 
        ST_X(geom) AS lng, ST_Y(geom) AS lat 
       FROM point2 
       WHERE ${dbField} = $1
       LIMIT 100`, // 添加分页限制防止过量查询
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
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
      }),
    })
  }
})
app.get('/point/attribute_qxz', async (req, res) => {
  try {
    const { attribute_name, attribute_value } = req.query
    console.log(attribute_name, attribute_value)

    // 参数验证
    if (!attribute_name || !attribute_value) {
      return res.status(400).json({
        error: '缺少必要参数',
        details: {
          required: ['attribute_name', 'attribute_value'],
          received: req.query,
        },
      })
    }

    // 检查是否允许查询该字段
    const dbField = ALLOWED_ATTRIBUTES[attribute_name]
    if (!dbField) {
      return res.status(400).json({
        error: '不支持的属性名称',
        allowed_attributes: Object.keys(ALLOWED_ATTRIBUTES),
      })
    }

    // 统一查询逻辑
    const { rows } = await pool.query(
      `SELECT 
      z_name, jyl, wind, ST_X(geom) AS lng,ST_Y(geom) AS lat 
      FROM point_qxz WHERE ${dbField} = $1 
      LIMIT 100`, // 添加分页限制防止过量查询
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
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
      }),
    })
  }
})
app.get('/point_qxz', async (req, res) => {
  try {
    const { z_name } = req.query
    // 参数验证
    if (!z_name) {
      return res.status(400).json({ error: '缺少 name 参数' })
    }
    // 使用参数化查询防止 SQL 注入
    const { rows } = await pool.query(
      `SELECT z_name, jyl, wind, ST_X(geom) AS lng,ST_Y(geom) AS lat FROM point_qxz WHERE z_name = $1`,
      [z_name],
    )

    // 处理查询结果
    if (rows.length === 0) {
      return res.status(404).json({ error: '未找到匹配记录' })
    }
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '服务器内部错误' })
  }
})
// 获取weatherstaton
app.get('/weatherstation', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM weatherstation')
  res.send(rows)
})
//获取river
app.get('/river', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM river')
  res.send(rows)
})
//获取glacier
app.get('/glacier', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM glacier')
  res.send(rows)
})

//创建要素（create）
app.post('/point', async (req, res) => {
  try {
    const { name, dcmd, lssl, slope, hlxqsl, pthhsmj, elevation, scale, geom } =
      req.body
    //验证GeoJSON格式
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
// --- 新增：接收 GBM/Shapefile 上传并保存到固定目录 ---
const GBM_SAVE_DIR = 'E:\\Projects\\ZHLXT\\backend\\hd\\data\\BCNSL'
// 确保目录存在（使用文件顶部已定义的 ensureDirectoryExists）
// ensureDirectoryExists(GBM_SAVE_DIR)

const storageGBM = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, GBM_SAVE_DIR)
  },
  filename: (req, file, cb) => {
    // 保留原始文件名（如需避免覆盖可在此添加时间戳或 uuid）
    cb(null, file.originalname)
  },
})
const uploadGBM = multer({ storage: storageGBM })

// 与前端 el-upload 的 action 对应：/node/upload_shp
app.post('/node/upload_shp', uploadGBM.array('file', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ code: 400, message: '没有文件上传' })
    }

    const savedFiles = req.files.map(f => ({
      originalFileName: f.originalname,
      savedPath: path.join(GBM_SAVE_DIR, f.originalname),
    }))
    console.log('GBM shapefile 保存：', savedFiles)

    // 返回给前端的示例响应，可按需扩展（例如解析 shp 返回 bbox 等）
    return res.json({
      code: 200,
      message: '上传成功',
      files: savedFiles,
      name: req.body.name || '',
    })
  } catch (err) {
    console.error('处理 /node/upload_shp 失败:', err)
    return res
      .status(500)
      .json({ code: 500, message: err.message || 'server error' })
  }
})

// 新存储目录（确保ensureDirectoryExists函数已定义，或添加一个简单mkdir）
const SEISMIC_SAVE_DIR = 'E:\\Projects\\ZHLXT\\backend\\hd\\data\\seismic'
// if (!fs.existsSync(SEISMIC_SAVE_DIR)) {
//   fs.mkdirSync(SEISMIC_SAVE_DIR, { recursive: true })
// }

const storageSeismic = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SEISMIC_SAVE_DIR)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname) // 保留原始文件名
  },
})
const uploadSeismic = multer({ storage: storageSeismic })

// 新端点：只上传并保存Excel
app.post('/node/upload_excel', uploadSeismic.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: '没有文件上传' })
    }

    const savedFile = {
      originalFileName: req.file.originalname,
      savedPath: path.join(SEISMIC_SAVE_DIR, req.file.originalname),
    }
    console.log('Seismic Excel 保存：', savedFile)

    return res.json({
      code: 200,
      message: '上传成功',
      file: savedFile,
    })
  } catch (err) {
    console.error('处理 /node/upload_excel 失败:', err)
    return res
      .status(500)
      .json({ code: 500, message: err.message || 'server error' })
  }
})
app.post('/displ', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ code: 400, message: '没有文件上传' })
  }
  // 这里 req.file.originalname 才是上传时的真实文件名
  filePath = path.join(__dirname, 'uploads', req.file.originalname)
  console.log('保存路径：', filePath)
  res.json({
    code: 200,
    fileName: req.file.originalname, // 上传时的文件名
    savedPath: filePath, // 保存到服务器的路径 (uploads/xxxx)
  })
})
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
