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
      .post('/testapi/admin/user/yj_beta', form1, { timeout: 1800000 })
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
    return axios.post(
      '/testapi/admin/user/GBM',
      { files: savedFiles, form },
      { timeout: 120000 },
    )
  },
  postSeismic(savedFile, params) {
    return axios
      .post(
        '/testapi/admin/user/seismic',
        { file: savedFile, params },
        { timeout: 120000 },
      )
      .then(r => r.data)
  },
  postSeismicDL(data) {
    const payload = { file: data.file, col: data.col }
    return axios
      .post('/testapi/admin/user/seismic_dl', payload, { timeout: 120000 })
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
