import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { exec } from 'child_process'
const app = express()

app.use(cors())
// 关键中间件：必须放在所有路由之前！
app.use(express.json())  // 解析 application/json
app.use(express.urlencoded({ extended: true }))  // 解析表单数据
const upload = multer({ dest: 'uploads/' })

app.post('/displ', upload.single('file'), (req, res) => {
  res.json({ code: 200, fileName: req.file.originalname })
})
//执行R语言脚本
// app.post('/rscript', (req, res) => {
//   const { path, script } = req.body;

//   // 启动 CMD 并跳转到指定目录（不执行其他命令）
//   exec(`start cmd.exe /k "cd /d "${path}""`, (error) => {
//     if (error) {
//       console.error('启动失败:', error.message);
//       return res.status(500).json({ error: 'CMD启动失败' });
//     }
//     console.log(`CMD 已启动并跳转到目录: ${path}`);
//     res.json({ success: true, message: `CMD 已在 ${path} 目录下启动` });
//   });
// });
app.post('/rscript', (req, res) => {
  const { path, script } = req.body;

  // 验证参数
  if (!path || !script) {
    return res.status(400).json({ error: '缺少 path 或 script 参数' });
  }

  // 启动 CMD 并执行 R 脚本
  const Rscript = '"C:\\Program Files\\R\\R-4.5.1\\bin\\x64\\Rscript.exe"';
  const command = `start cmd.exe /k "cd /d "${path}" && ${Rscript} "${script}""`;
  console.log('执行命令:', command);

  exec(command, (error) => {
    if (error) {
      console.error('执行失败:', error.message);
      return res.status(500).json({ 
        error: '执行失败',
        details: error.message,
        command: command  // 返回实际执行的命令用于调试
      });
    }
    res.json({ 
      success: true,
      message: `CMD 已在 ${path} 目录下启动并执行 ${script}` 
    });
  });
});
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})