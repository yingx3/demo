import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'
//  获取当前脚本文件所在目录（固定标准写法）
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = express.Router()

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname) // 保留原始文件名
  },
})

const upload = multer({ storage })

// 全局变量存储文件路径
let filePath

// 配置路径
const SAVE_PATH = path.join(
  __dirname, // 当前脚本所在目录
  '..',
  '..',
  '..', // 向上三级目录
  'assets',
  'PFTF',
  'output', // 进入目标文件夹
)
const TARGET_PATH = path.join(
  __dirname, // 当前脚本所在目录
  '..',
  '..',
  'assets',
  'PFTF',
  'scripts', // 进入目标文件夹
)
const R_SCRIPT_PATH = path.join(TARGET_PATH, '1_1_input.R')

// 确保目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`📁 创建目录: ${dirPath}`)
  }
}

// 格式化UTC时间戳
function formatUTCTimestamp(date) {
  const pad = n => n.toString().padStart(2, '0')
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
}

// 读取Excel数据
function readExcelData(filePath) {
  try {
    console.log(`开始读取Excel文件: ${filePath}`)
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false })
    console.log(`从Excel读取 ${data.length} 条记录`)
    return data
  } catch (error) {
    console.error('❌ 读取Excel失败:', error.message)
    throw error
  }
}

// 处理小时数据
function processHourlyData(filePath) {
  console.log('🔄 正在处理时间数据...')
  const data = readExcelData(filePath)
  const hourlyGroups = {}

  data.forEach((row, index) => {
    if (!row || !row.timestamp) {
      console.warn(`⚠️ 第${index + 1}行: 缺少timestamp`)
      return
    }

    try {
      const timeStr = row.timestamp.toString()
      const [datePart, timePart] = timeStr.split(' ')
      const [year, month, day] = datePart.split('-').map(Number)
      const [hours, minutes] = timePart.split(':').map(Number)
      const timestamp = new Date(Date.UTC(year, month - 1, day, hours, minutes))
      const hourKey = new Date(Date.UTC(year, month - 1, day, hours, 0))
      const hourKeyStr = hourKey.toISOString()

      if (!hourlyGroups[hourKeyStr]) {
        hourlyGroups[hourKeyStr] = []
      }

      const displValue = parseFloat(row.displ) || 0
      hourlyGroups[hourKeyStr].push({
        originalTime: timeStr,
        timestamp: timestamp,
        displ: displValue,
      })
    } catch (error) {
      console.warn(`第${index + 1}行: 时间解析错误`, error.message)
    }
  })

  const processedData = []
  Object.keys(hourlyGroups)
    .sort()
    .forEach(hourKey => {
      const hourData = hourlyGroups[hourKey]
      const hourDate = new Date(hourKey)
      if (hourData.length > 0) {
        processedData.push({
          timestamp: formatUTCTimestamp(hourDate),
          displ: hourData[0].displ,
        })
      }
    })

  console.log(`处理前: ${data.length} 条, 处理后: ${processedData.length} 条`)
  return processedData
}

// 保存处理后的CSV文件
function saveProcessedCSV(data) {
  try {
    ensureDirectoryExists(SAVE_PATH)
    const filename = 'displ_data_processed.csv'
    const filepath = path.join(SAVE_PATH, filename)

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
    }

    let csvContent = 'timestamp,displ\n'
    data.forEach(row => {
      csvContent += `"${row.timestamp}","${row.displ}"\n`
    })

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

// 转换为RDA文件
function convertToRDA(csvFilePath) {
  return new Promise((resolve, reject) => {
    try {
      const rdaFilename = 'displ_data.rda'
      const rdaFilePath = path.join(SAVE_PATH, rdaFilename)

      if (fs.existsSync(rdaFilePath)) {
        fs.unlinkSync(rdaFilePath)
      }

      const rScriptContent = `
# 读取CSV文件
displ_data <- read.csv("${csvFilePath.replace(/\\/g, '/')}")

# 转换时间格式，使用指定的格式和UTC时区
displ_data$timestamp <- as.POSIXct(displ_data$timestamp, format = "%Y-%m-%d %H:%M", tz = "UTC")

# 按时间排序
displ_data <- displ_data[order(displ_data$timestamp), ]

# 检查数据结构
cat("数据结构:\n")
str(displ_data)
cat("\n时间范围: ", as.character(range(displ_data$timestamp)), "\n")

# 保存为RDA文件

save(displ_data, file = "${rdaFilePath.replace(/\\/g, '/')}")

cat("成功转换", nrow(displ_data), "条记录到RDA文件\n")
`

      const rScriptPath = path.join(SAVE_PATH, 'convert_to_rda.R')
      if (fs.existsSync(rScriptPath)) {
        fs.unlinkSync(rScriptPath)
      }
      fs.writeFileSync(rScriptPath, rScriptContent, 'utf8')

      // const Rscript = '"D:/application/r/baseR/bin/Rscript.exe"'
      const Rscript = path.join(
        __dirname, // 当前 JS 脚本所在目录
        '../../', // 向上跳多级（根据你真实目录层数修改）
        'assets/PFTF/R/R-4.5.1/bin/Rscript.exe',
      )
      const command = `cd /d "${SAVE_PATH}" && ${Rscript} "${rScriptPath}"`

      console.log('正在转换为RDA格式...')
      exec(command, (error, stdout, stderr) => {
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

// 复制文件
function copyFile(sourcePath, targetPath) {
  return new Promise((resolve, reject) => {
    try {
      const targetDir = path.dirname(targetPath)
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath)
      }

      fs.copyFileSync(sourcePath, targetPath)
      console.log(`📋 文件已复制到: ${targetPath}`)
      resolve(true)
    } catch (error) {
      console.error('❌ 文件复制失败:', error.message)
      reject(error)
    }
  })
}

// 获取CSV时间范围
function getCSVTimeRange(csvFilePath) {
  try {
    const csvContent = fs.readFileSync(csvFilePath, 'utf8')
    const lines = csvContent.trim().split('\n')

    if (lines.length <= 1) {
      throw new Error('CSV文件没有数据')
    }

    const firstLine = lines[1].split(',')
    const firstTimestamp = firstLine[0].replace(/"/g, '').trim()
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

  const pad = n => n.toString().padStart(2, '0')
  return `${fiveDaysBefore.getFullYear()}-${pad(
    fiveDaysBefore.getMonth() + 1,
  )}-${pad(fiveDaysBefore.getDate())} ${pad(fiveDaysBefore.getHours())}:00:00`
}

// 修改R脚本
function modifyRScript(rScriptPath, startTime, endTime) {
  try {
    const backupPath = rScriptPath + '.backup'
    console.log('开始修改R脚本...')
    // console.log('备份文件路径:', backupPath)
    // 只有备份文件不存在时，才创建备份（已存在就跳过，不报错）
    if (!fs.existsSync(backupPath)) {
      // 👇 加上第三个参数，允许覆盖（防止意外报错）
      fs.copyFileSync(rScriptPath, backupPath, fs.constants.COPYFILE_EXCL)
      console.log('📦 已创建R脚本备份文件')
    }

    // 读取并修改内容
    let content = fs.readFileSync(rScriptPath, 'utf8')
    content = content.replace(
      /start_of_calc <- as\.POSIXct\(".*?", tz="UTC"\)/,
      `start_of_calc <- as.POSIXct("${startTime}", tz="UTC")`,
    )

    content = content.replace(
      /start_of_sim <- as\.POSIXct\(".*?", tz="UTC"\)/,
      `start_of_sim <- as.POSIXct("${endTime}", tz="UTC")`,
    )

    fs.writeFileSync(rScriptPath, content, 'utf8')
    console.log(`✏️  R脚本已修改: 开始时间=${startTime}, 结束时间=${endTime}`)

    return true
  } catch (error) {
    console.error('❌ 修改R脚本失败:', error.message)
    throw error
  }
}

// 执行R脚本
function executeRScript(rScriptPath) {
  return new Promise((resolve, reject) => {
    try {
      // const Rscript = '"D:/application/r/baseR/bin/Rscript.exe"'
      const Rscript = path.join(
        __dirname, // 当前 JS 脚本所在目录
        '../../', // 向上跳多级（根据你真实目录层数修改）
        'assets/PFTF/R/R-4.5.1/bin/Rscript.exe',
      )
      console.log('Rscript路径:', Rscript)
      const command = `cd /d "${path.dirname(
        rScriptPath,
      )}" && ${Rscript} "${rScriptPath}"`

      console.log('🚀 正在执行R脚本...')
      console.log('执行命令:', command)

      const child = exec(command, { cwd: path.dirname(rScriptPath) })

      let stdoutData = ''
      let stderrData = ''

      child.stdout.on('data', data => {
        process.stdout.write(data)
        stdoutData += data
      })

      child.stderr.on('data', data => {
        process.stderr.write(data)
        stderrData += data
      })

      child.on('close', code => {
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

// 文件上传路由
router.post('/displ', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ code: 400, message: '没有文件上传' })
  }

  filePath = path.join(
    path.dirname(import.meta.url).replace('file:///', ''),
    '../',
    'uploads',
    req.file.originalname,
  )
  console.log('保存路径：', filePath)
  res.json({
    code: 200,
    fileName: req.file.originalname,
    savedPath: filePath,
  })
})

// 处理位移数据路由
router.get('/displ_file', async (req, res) => {
  try {
    console.log('开始处理位移数据...')
    const processedData = processHourlyData(filePath)
    const timeSeriesData = processHourlyData(filePath)

    const csvInfo = saveProcessedCSV(processedData)
    const rdaInfo = await convertToRDA(csvInfo.filepath)
    const targetRdaPath = path.join(TARGET_PATH, 'displ_data.rda')
    await copyFile(rdaInfo.filepath, targetRdaPath)

    const timeRange = getCSVTimeRange(csvInfo.filepath)
    const fiveDaysBeforeLast = getFiveDaysBeforeLast(timeRange.lastTimestamp)
    await modifyRScript(
      R_SCRIPT_PATH,
      timeRange.firstTimestamp,
      fiveDaysBeforeLast,
    )
    const rScriptResult = await executeRScript(R_SCRIPT_PATH)

    console.log('R脚本执行完毕！')

    const rt_json = path.join(TARGET_PATH, 'rt_data.json')
    const data = await fs.promises.readFile(rt_json, 'utf8')

    const longitude = req.query['form_inverseV[longitude]']
    const latitude = req.query['form_inverseV[latitude]']
    const Name = req.query['form_inverseV[name]']

    const { Pool } = await import('pg')
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: '123456',
      port: 5432,
    })

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

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
        pointId = pointResult.rows[0].point_id
        console.log(`找到现有监测点，ID: ${pointId}`)
      } else {
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

      const insertDataQuery = `
        INSERT INTO displacement_data (point_id, record_time, displacement)
        VALUES ($1, $2, $3)
        ON CONFLICT (point_id,record_time) DO UPDATE 
        SET displacement = EXCLUDED.displacement
      `

      let insertedCount = 0
      for (const row of timeSeriesData) {
        let recordTime
        if (typeof row.timestamp === 'number') {
          recordTime = XLSX.SSF.parse_date_code(row.timestamp)
        } else if (row.timestamp instanceof Date) {
          recordTime = row.timestamp
        } else if (typeof row.timestamp === 'string') {
          try {
            recordTime = new Date(row.timestamp)
            if (isNaN(recordTime.getTime())) {
              console.warn('无效的时间戳字符串，跳过:', row.timestamp)
              continue
            }
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

      return res.json({
        success: true,
        fileProcessing: {
          processedCount: rdaInfo.recordCount,
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

// 查询位移数据路由
router.get('/search_displ', async (req, res) => {
  const pointId = req.query.pointId

  if (!pointId) {
    return res.status(400).json({
      success: false,
      message: '缺少必要参数: pointId',
    })
  }

  const pointIdNum = parseInt(pointId)
  if (isNaN(pointIdNum)) {
    return res.status(400).json({
      success: false,
      type: 'warning',
      message: 'pointId 必须是有效的数字',
    })
  }

  const { Pool } = await import('pg')
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5432,
  })

  const client = await pool.connect()

  try {
    const query = `
      SELECT record_time, displacement
      FROM displacement_data
      WHERE point_id = $1
      ORDER BY record_time ASC
    `

    const result = await client.query(query, [pointIdNum])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        type: 'warning',
        message: '未找到该监测点的位移数据',
        data: [],
      })
    }

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

export default router
