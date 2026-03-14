//config/index.js(提交到Git,统一导出配置)
const fs = require('fs')
const path = require('path')
//加载模板配置
const defaultConfig = require('./config.example.js')

//加载本地配置（若存在则覆盖模板，不存在则使用模板）
let localConfig = {}
const localConfigPath = path.join(__dirname, 'config.local.js')
//existsSync检查文件是否存在
if (fs.existsSync(localConfigPath)) {
  localConfig = require('./config.local.js')
}
//加载环境变量配置
require('dotenv').config()

//合并配置
module.exports = {
  ...defaultConfig,
  ...localConfig,
  //环境变量配置
  localFilePath:
    process.env.LOCAL_FILE_PATH ||
    localConfig.localFilePath ||
    defaultConfig.localFilePath,
  dbPath: process.env.DB_PATH || localConfig.dbPath || defaultConfig.dbPath,
}
