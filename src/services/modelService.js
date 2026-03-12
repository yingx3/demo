import axios from 'axios'

const modelService = {
  runTrigrs(form) {
    return axios.post('/testapi/admin/user/fx', form, { timeout: 400000 }).then(r => r.data)
  },
  runAvaflow(form1) {
    return axios.post('/testapi/admin/user/yj', form1, { timeout: 60000 }).then(r => r.data)
  },
  uploadAvaflowFiles(formData) {
    return axios.post('/testapi/admin/user/upload_avaflow', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    }).then(r => r.data)
  },
  postGBM(savedFiles) {
    // 返回完整 response 以保留 uploadResp/processResp 语义
    return axios.post('/testapi/admin/user/GBM', { files: savedFiles }, { timeout: 120000 })
  },
  postSeismic(savedFile) {
    return axios.post('/testapi/admin/user/seismic', { file: savedFile }, { timeout: 120000 }).then(r => r.data)
  },
}

export default modelService
