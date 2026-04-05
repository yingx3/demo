import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const router = express.Router()

// GBM shapefile 上传配置
const GBM_SAVE_DIR = '../../src/assets/input'
const storageGBM = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, GBM_SAVE_DIR)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const uploadGBM = multer({ storage: storageGBM })

// Seismic Excel 上传配置
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SEISMIC_SAVE_DIR = '../../src/assets/input'

const storageSeismic = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SEISMIC_SAVE_DIR)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const uploadSeismic = multer({ storage: storageSeismic })

// 上传 shapefile
router.post('/node/upload_shp', uploadGBM.array('file', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ code: 400, message: '没有文件上传' })
    }

    const savedFiles = req.files.map(f => ({
      originalFileName: f.originalname,
      savedPath: path.join(GBM_SAVE_DIR, f.originalname),
    }))
    console.log('GBM shapefile 保存：', savedFiles)

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

// 上传 Excel 文件
router.post('/node/upload_excel', uploadSeismic.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 400, message: '没有文件上传' })
    }

    const savedFile = {
      originalFileName: req.file.originalname,
      savedPath: path.join(
        __dirname,
        '../',
        SEISMIC_SAVE_DIR,
        req.file.originalname,
      ),
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

export default router
