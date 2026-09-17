import axios from 'axios'

const modelService = {
  runTrigrs(form) {
    return axios
      .post('/testapi/admin/user/fx', form, { timeout: 400000 })
      .then(r => r.data)
  },
  runAvaflow(form1) {
    return axios
      .post('/testapi/admin/user/yj', form1, { timeout: 60000 })
      .then(r => r.data)
  },
  runAvaflowBeta(form1) {
    return axios
      .post('/testapi/admin/user/yj_beta', form1, { timeout: 60000 })
      .then(r => r.data)
  },
  getAvaflowBetaStatus(jobId) {
    return axios
      .get('/testapi/admin/user/yj_beta_status', { params: { jobId }, timeout: 30000 })
      .then(r => r.data)
  },
  // 「灾害危险区划」静态图层列表（风险源模型输出的 dangerLevel_*.png，含时间/降雨历时/地理范围）
  getDangerLevelList(params) {
    return axios
      .get('/testapi/admin/user/danger_level_list', { params, timeout: 30000 })
      .then(r => r.data)
  },
  // 冰川泥石流动力学模型历史模拟记录（静态目录里保留下来的历次运行结果，可直接回放）
  getAvaflowBetaHistory(params) {
    return axios
      .get('/testapi/admin/user/avaflow_beta_history', { params, timeout: 60000 })
      .then(r => r.data)
  },
  uploadProFiles(formData) {
    return axios
      .post('/testapi/admin/user/pro_upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000,
      })
      .then(r => r.data)
  },
  runProModel(payload) {
    return axios
      .post('/testapi/admin/user/pro_start', payload, { timeout: 60000 })
      .then(r => r.data)
  },
  getProStatus(jobId) {
    return axios
      .get('/testapi/admin/user/pro_start_status', {
        params: { jobId },
        timeout: 30000,
      })
      .then(r => r.data)
  },
  // 历史模拟记录（静态目录里保留下来的历次运行结果，可直接回放）
  getProHistory(params) {
    return axios
      .get('/testapi/admin/user/pro_history', { params, timeout: 30000 })
      .then(r => r.data)
  },
  uploadAvaflowFiles(formData) {
    return axios
      .post('/testapi/admin/user/upload_avaflow', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      })
      .then(r => r.data)
  },
  postGBM(savedFiles, form) {
    // 返回完整 response 以保留 uploadResp/processResp 语义
    // 推理脚本为串行执行，超时与后端 process-timeout 对齐（5 分钟）
    return axios.post(
      '/testapi/admin/user/GBM',
      { files: savedFiles, form },
      { timeout: 300000 },
    )
  },
  postSeismic(savedFile, params) {
    // 机器学习识别在后端跑脚本（大文件可能数分钟），超时与后端 process-timeout(600s) 对齐并留余量
    return axios
      .post(
        '/testapi/admin/user/seismic',
        { file: savedFile, params },
        { timeout: 900000 },
      )
      .then(r => r.data)
  },
  postSeismicDL(data) {
    const payload = { file: data.file, col: data.col }
    // 深度学习推理同样可能较慢，超时放宽到 15 分钟
    return axios
      .post('/testapi/admin/user/seismic_dl', payload, { timeout: 900000 })
      .then(r => r.data)
  },
  postAvainit(form) {
    return axios
      .post('/testapi/admin/user/avainit', form, { timeout: 40000 })
      .then(r => r.data)
  },
    postInverse(form) {
    return axios
      .post('/testapi/admin/user/bedding_inverse', form, { timeout: 40000 })
      .then(r => r.data)
  },
    postWedge(form) {
    return axios
      .post('/testapi/admin/user/bedding_wedge', form, { timeout: 40000 })
      .then(r => r.data)
  },
  postSDPStart(params) {
    return axios
      .post('/testapi/admin/user/SDP_Start', params, {
        timeout: 600000,
      })
      .then(r => r.data)
  },
}

export default modelService
