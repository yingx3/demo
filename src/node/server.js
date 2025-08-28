import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { Client } from 'pg';
import { exec } from 'child_process'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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
    cb(null, file.originalname)  // 保留原始文件名
  }
})
const upload = multer({ storage })
let filePath
// 文件保存路径
const SAVE_PATH = 'E:\\practice\\PFTF\\icelake';
// 目标R脚本路径
const TARGET_PATH = 'E:\\practice\\PFTF\\PFTF_1.0.0\\PFTF-PFTF_1.0.0';
const R_SCRIPT_PATH = path.join(TARGET_PATH, '1_1_input.R');
const displ_file = '';

// Kingbase8 数据库配置
const dbConfig = {
  user: 'system',
  host: '172.21.135.11',
  database: 'icelake',
  password: 'Sipsd123!@#',
  port: 54321,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
};

// 创建数据库连接池
let pool;
try {
  const { Pool } = await import('pg');
  pool = new Pool(dbConfig);
  console.log('✅ 数据库连接池创建成功');
} catch (error) {
  console.error('❌ 创建数据库连接池失败:', error.message);
}

// 确保保存目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 创建目录: ${dirPath}`);
  }
}

// 格式化时间为 YYYY-MM-DD HH:MM 格式
function formatTimestamp(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 处理时间数据并转换为整点
function processHourlyData(data) {
  console.log('🔄 正在处理时间数据（转换为整点）...');

  // 按小时分组
  const hourlyGroups = {};
  console.log(data)
  data.forEach(row => {
    const timestamp = new Date(row.update_time);
    const hourKey = new Date(timestamp);
    hourKey.setMinutes(0, 0, 0); // 设置为整点

    const hourKeyStr = hourKey.toISOString();

    if (!hourlyGroups[hourKeyStr]) {
      hourlyGroups[hourKeyStr] = [];
    }

    hourlyGroups[hourKeyStr].push({
      timestamp: timestamp,
      displ: row.lf
    });
  });

  // 对每小时的数据进行处理
  const processedData = [];

  Object.keys(hourlyGroups).sort().forEach(hourKey => {
    const hourData = hourlyGroups[hourKey];
    const hourDate = new Date(hourKey);

    // 检查是否有整点数据
    const exactHourData = hourData.find(item =>
      item.timestamp.getTime() === hourDate.getTime()
    );

    if (exactHourData) {
      // 如果有整点数据，使用第一个整点数据
      processedData.push({
        timestamp: formatTimestamp(exactHourData.timestamp),
        displ: exactHourData.displ
      });
    } else {
      // 如果没有整点数据，使用该小时第一个数据，时间调整为整点
      processedData.push({
        timestamp: formatTimestamp(hourDate),
        displ: hourData[0].displ
      });
    }
  });

  console.log(`📊 处理前: ${data.length} 条, 处理后: ${processedData.length} 条`);
  return processedData;
}

// 将处理后的数据保存为CSV文件（覆写模式）
function saveProcessedCSV(data) {
  try {
    ensureDirectoryExists(SAVE_PATH);

    const filename = 'displ_data_processed.csv';
    const filepath = path.join(SAVE_PATH, filename);

    // 检查文件是否存在，如果存在则删除
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log('🗑️  删除已存在的CSV文件');
    }

    // CSV文件头
    let csvContent = 'timestamp,displ\n';

    // 添加数据行（使用格式化的时间字符串）
    data.forEach(row => {
      csvContent += `"${row.timestamp}","${row.displ}"\n`;
    });

    // 写入文件
    fs.writeFileSync(filepath, csvContent, 'utf8');
    console.log(`💾 CSV文件已保存（覆写模式）: ${filepath}`);

    return {
      filename: filename,
      filepath: filepath,
      recordCount: data.length
    };
  } catch (error) {
    console.error('❌ 保存CSV文件失败:', error.message);
    throw error;
  }
}

// 将CSV文件转换为RDA文件（覆写模式）
function convertToRDA(csvFilePath) {
  return new Promise((resolve, reject) => {
    try {
      const rdaFilename = 'displ_data.rda';
      const rdaFilePath = path.join(SAVE_PATH, rdaFilename);

      // 检查RDA文件是否存在，如果存在则删除
      if (fs.existsSync(rdaFilePath)) {
        fs.unlinkSync(rdaFilePath);
        console.log('🗑️  删除已存在的RDA文件');
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
cat("RDA文件已保存:", "${rdaFilePath.replace(/\\/g, '/')}\\n")
cat("时间格式: %Y-%m-%d %H:%M\\n")
cat("时区: UTC\\n")
`;

      // 写入临时R脚本（覆写模式）
      const rScriptPath = path.join(SAVE_PATH, 'convert_to_rda.R');
      if (fs.existsSync(rScriptPath)) {
        fs.unlinkSync(rScriptPath);
      }
      fs.writeFileSync(rScriptPath, rScriptContent, 'utf8');

      // 执行R脚本
      const Rscript = '"C:\\Program Files\\R\\R-4.5.1\\bin\\x64\\Rscript.exe"';
      const command = `cd /d "${SAVE_PATH}" && ${Rscript} "${rScriptPath}"`;

      console.log('🔄 正在转换为RDA格式...');
      exec(command, (error, stdout, stderr) => {
        // 清理临时文件
        try {
          if (fs.existsSync(rScriptPath)) {
            fs.unlinkSync(rScriptPath);
          }
        } catch (e) { }

        if (error) {
          console.error('❌ R脚本执行失败:', error.message);
          if (stderr) console.error('R脚本错误:', stderr);
          reject(error);
          return;
        }

        console.log('✅ R脚本输出:', stdout);
        if (stderr) {
          console.warn('⚠️ R脚本警告:', stderr);
        }

        const recordCount = parseInt(stdout.match(/成功转换 (\d+) 条记录/)?.[1] || '0');

        resolve({
          filename: rdaFilename,
          filepath: rdaFilePath,
          recordCount: recordCount,
          variableName: 'displ_data',
          timeFormat: '%Y-%m-%d %H:%M',
          timezone: 'UTC'
        });
      });

    } catch (error) {
      reject(error);
    }
  });
}

// 复制文件到目标路径
function copyFile(sourcePath, targetPath) {
  return new Promise((resolve, reject) => {
    try {
      // 确保目标目录存在
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 如果目标文件已存在，先删除
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }

      // 复制文件
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`📋 文件已复制到: ${targetPath}`);
      resolve(true);
    } catch (error) {
      console.error('❌ 文件复制失败:', error.message);
      reject(error);
    }
  });
}

// 读取CSV文件的第一行和最后一行时间
function getCSVTimeRange(csvFilePath) {
  try {
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvContent.trim().split('\n');

    // 跳过标题行，获取数据行
    if (lines.length <= 1) {
      throw new Error('CSV文件没有数据');
    }

    // 获取第一行数据（第二行，因为第一行是标题）
    const firstLine = lines[1].split(',');
    const firstTimestamp = firstLine[0].replace(/"/g, '').trim();

    // 获取最后一行数据
    const lastLine = lines[lines.length - 1].split(',');
    const lastTimestamp = lastLine[0].replace(/"/g, '').trim();

    console.log(`📅 时间范围: ${firstTimestamp} 至 ${lastTimestamp}`);

    return {
      firstTimestamp: firstTimestamp,
      lastTimestamp: lastTimestamp
    };
  } catch (error) {
    console.error('❌ 读取CSV时间范围失败:', error.message);
    throw error;
  }
}

// 计算最后一天的时间
function getFiveDaysBeforeLast(lastTimestamp) {
  const lastDate = new Date(lastTimestamp);
  const fiveDaysBefore = new Date(lastDate);
  fiveDaysBefore.setDate(lastDate.getDate());

  // 格式化为 YYYY-MM-DD HH:00:00
  const pad = (n) => n.toString().padStart(2, '0');
  return `${fiveDaysBefore.getFullYear()}-${pad(fiveDaysBefore.getMonth() + 1)}-${pad(fiveDaysBefore.getDate())} ${pad(fiveDaysBefore.getHours())}:00:00`;
}

// 修改R脚本文件
function modifyRScript(rScriptPath, startTime, endTime) {
  try {
    // 备份原始文件
    const backupPath = rScriptPath + '.backup';
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(rScriptPath, backupPath);
      console.log('📦 已创建R脚本备份文件');
    }

    // 读取R脚本内容
    let content = fs.readFileSync(rScriptPath, 'utf8');

    // 修改第16行的开始时间
    content = content.replace(
      /start_of_calc <- as\.POSIXct\(".*?", tz="UTC"\)/,
      `start_of_calc <- as.POSIXct("${startTime}", tz="UTC")`
    );

    // 修改第21行的结束时间（最后一天的前5天）
    content = content.replace(
      /start_of_sim <- as\.POSIXct\(".*?", tz="UTC"\)/,
      `start_of_sim <- as.POSIXct("${endTime}", tz="UTC")`
    );

    // 写入修改后的内容
    fs.writeFileSync(rScriptPath, content, 'utf8');
    console.log(`✏️  R脚本已修改: 开始时间=${startTime}, 结束时间=${endTime}`);

    return true;
  } catch (error) {
    console.error('❌ 修改R脚本失败:', error.message);
    throw error;
  }
}

// 恢复R脚本到原始状态
function restoreRScript(rScriptPath) {
  try {
    const backupPath = rScriptPath + '.backup';
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, rScriptPath);
      console.log('↩️  R脚本已恢复到原始状态');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ 恢复R脚本失败:', error.message);
    throw error;
  }
}

// 执行R脚本
function executeRScript(rScriptPath) {
  return new Promise((resolve, reject) => {
    try {
      const Rscript = '"C:\\Program Files\\R\\R-4.5.1\\bin\\x64\\Rscript.exe"';
      const command = `cd /d "${path.dirname(rScriptPath)}" && ${Rscript} "${rScriptPath}"`;

      console.log('🚀 正在执行R脚本...');
      console.log('执行命令:', command);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ R脚本执行失败:', error.message);
          if (stderr) console.error('R脚本错误:', stderr);
          reject(error);
          return;
        }

        console.log('✅ R脚本执行成功');
        console.log('输出:', stdout);
        if (stderr) {
          console.warn('警告:', stderr);
        }

        resolve(stdout);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// 检测日志文件中是否存在"OOA detected"
// function checkOOADetected() {
//   try {
//     const logFilePath = path.join(TARGET_PATH, 'plots', 'main', '24_log.txt');

//     if (!fs.existsSync(logFilePath)) {
//       console.log('❌ 日志文件不存在:', logFilePath);
//       return false;
//     }

//     // 读取日志文件内容
//     const logContent = fs.readFileSync(logFilePath, 'utf8');
//     const lines = logContent.trim().split('\n');

//     if (lines.length < 2) {
//       console.log('❌ 日志文件内容不足');
//       return false;
//     }

//     // 获取倒数第二行
//     const secondLastLine = lines[lines.length - 2].trim();
//     console.log('📋 倒数第二行内容:', secondLastLine);

//     // 检查是否包含"OOA detected"
//     const hasOOADetected = secondLastLine.includes('OOA detected');
//     console.log('🔍 OOA detected:', hasOOADetected);

//     return hasOOADetected;
//   } catch (error) {
//     console.error('❌ 检测OOA失败:', error.message);
//     return false;
//   }
// }

// 现有的文件上传路由
app.post('/displ', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ code: 400, message: '没有文件上传' })
  }


  // 这里 req.file.originalname 才是上传时的真实文件名
  filePath = path.join(__dirname, "uploads", req.file.originalname);
  console.log("保存路径：", filePath);
  res.json({
    code: 200,
    fileName: req.file.originalname, // 上传时的文件名
    savedPath: filePath         // 保存到服务器的路径 (uploads/xxxx)
  })
})


// 现有的 R 脚本执行路由
// app.post('/rscript', (req, res) => {
//   const { path: scriptPath, script } = req.body;

//   if (!scriptPath || !script) {
//     return res.status(400).json({ error: '缺少 path 或 script 参数' });
//   }

//   const Rscript = '"C:\\Program Files\\R\\R-4.5.1\\bin\\x64\\Rscript.exe"';
//   const command = `start cmd.exe /k "cd /d "${scriptPath}" && ${Rscript} "${script}""`;
//   console.log('执行命令:', command);
//   exec(command, (error) => {
//     if (error) {
//       console.error('执行失败:', error.message);
//       return res.status(500).json({ 
//         error: '执行失败',
//         details: error.message,
//         command: command
//       });
//     }
//     res.json({ 
//       success: true,
//       message: `CMD 已在 ${scriptPath} 目录下启动并执行 ${script}` 
//     });
//   });
// });

//使用用户上传文件预测滑坡时间
app.get('/displ_file', async (req, res) => {
  try {

    // 处理时间数据（转换为整点）
    const processedData = processHourlyData(filePath);

    // 保存处理后的CSV文件
    const csvInfo = saveProcessedCSV(processedData);

    // 转换为RDA文件
    const rdaInfo = await convertToRDA(csvInfo.filepath);

    // 复制RDA文件到目标路径
    const targetRdaPath = path.join(TARGET_PATH, 'displ_data.rda');
    await copyFile(rdaInfo.filepath, targetRdaPath);

    // 读取CSV文件的时间范围
    const timeRange = getCSVTimeRange(csvInfo.filepath);

    // 计算最后一天的时间
    const fiveDaysBeforeLast = getFiveDaysBeforeLast(timeRange.lastTimestamp);

    // 修改R脚本
    await modifyRScript(R_SCRIPT_PATH, timeRange.firstTimestamp, fiveDaysBeforeLast);

    // 执行R脚本
    const rScriptOutput = await executeRScript(R_SCRIPT_PATH);

    // 恢复R脚本到原始状态
    await restoreRScript(R_SCRIPT_PATH);

    res.json({
      success: true,
      originalCount: result.rowCount,
      processedCount: rdaInfo.recordCount,
      timeRange: {
        start: timeRange.firstTimestamp,
        end: timeRange.lastTimestamp,
        simulationStart: fiveDaysBeforeLast
      },
      rdaFile: targetRdaPath,
      rScriptExecuted: true,
      rScriptOutput: rScriptOutput,
    });

  } catch (error) {
    console.error('处理失败:', error);

    // 尝试恢复R脚本（如果修改过）
    try {
      await restoreRScript(R_SCRIPT_PATH);
    } catch (restoreError) {
      console.error('恢复R脚本失败:', restoreError.message);
    }

    res.status(500).json({
      success: false,
      message: '处理失败',
      error: error.message,
      ooaDetected: false
    });
  }
});
// 根据设备ID查询crack数据并处理为RDA
app.get('/api/crack/:deviceId', async (req, res) => {
  const { deviceId } = req.params;
  const { months = 2 } = req.query;

  let client;
  try {
    client = await pool.connect();

    console.log(`🔍 查询设备: ${deviceId}, 时间范围: 最近${months}个月`);

    // 查询所有匹配的数据
    const result = await client.query(`
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
    `, [deviceId]);

    console.log(`📊 查询到 ${result.rowCount} 条记录`);

    if (result.rowCount === 0) {
      return res.json({
        success: true,
        deviceId: deviceId,
        message: '未找到匹配的数据',
        ooaDetected: false
      });
    }

    // 处理时间数据（转换为整点）
    const processedData = processHourlyData(result.rows);

    // 保存处理后的CSV文件
    const csvInfo = saveProcessedCSV(processedData);

    // 转换为RDA文件
    const rdaInfo = await convertToRDA(csvInfo.filepath);

    // 复制RDA文件到目标路径
    const targetRdaPath = path.join(TARGET_PATH, 'displ_data.rda');
    await copyFile(rdaInfo.filepath, targetRdaPath);

    // 读取CSV文件的时间范围
    const timeRange = getCSVTimeRange(csvInfo.filepath);

    // 计算最后一天的前5天时间
    const fiveDaysBeforeLast = getFiveDaysBeforeLast(timeRange.lastTimestamp);

    // 修改R脚本
    await modifyRScript(R_SCRIPT_PATH, timeRange.firstTimestamp, fiveDaysBeforeLast);

    // 执行R脚本
    const rScriptOutput = await executeRScript(R_SCRIPT_PATH);

    // 检测OOA detected
    const ooaDetected = checkOOADetected();

    // 恢复R脚本到原始状态
    await restoreRScript(R_SCRIPT_PATH);

    res.json({
      success: true,
      deviceId: deviceId,
      originalCount: result.rowCount,
      processedCount: rdaInfo.recordCount,
      timeRange: {
        start: timeRange.firstTimestamp,
        end: timeRange.lastTimestamp,
        simulationStart: fiveDaysBeforeLast
      },
      rdaFile: targetRdaPath,
      rScriptExecuted: true,
      ooaDetected: ooaDetected,
      rScriptOutput: rScriptOutput,
      message: `数据处理完成并已执行R脚本，OOA检测结果: ${ooaDetected ? '存在' : '不存在'}`
    });

  } catch (error) {
    console.error('处理失败:', error);

    // 尝试恢复R脚本（如果修改过）
    try {
      await restoreRScript(R_SCRIPT_PATH);
    } catch (restoreError) {
      console.error('恢复R脚本失败:', restoreError.message);
    }

    res.status(500).json({
      success: false,
      message: '处理失败',
      error: error.message,
      ooaDetected: false
    });
  } finally {
    if (client) client.release();
  }
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('💾 文件保存路径:', SAVE_PATH);
  console.log('🎯 目标路径:', TARGET_PATH);
  console.log('📝 R脚本路径:', R_SCRIPT_PATH);
  console.log('🚀 可用接口: GET /api/crack/:deviceId');
});