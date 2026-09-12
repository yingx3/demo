/**
 * ASC (ESRI ASCII Grid) → base64 PNG 转换器
 * 每像素 RGBA 4byte 编码 1 个 float32，供 DebrisFlow / WaterSimulate 使用
 */

/**
 * 解析 ASC 文本
 * @returns {{ ncols, nrows, xllcorner, yllcorner, cellsize, nodata, values: Float32Array }}
 */
export function parseASC(text) {
  const lines = text.trim().split('\n')
  const header = {}
  let dataStart = 0
  // 注意：r.avaflow 输出的是 xllcenter/yllcenter（像元中心），原来的白名单里没有这两个键，
  // 会把表头当成第一行数据，导致整幅栅格错位两个像元。
  const headerKeys = ['ncols', 'nrows', 'xllcorner', 'yllcorner', 'xllcenter', 'yllcenter', 'cellsize', 'nodata_value']
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].trim().split(/\s+/)
    const key = (parts[0] || '').toLowerCase()
    if (!headerKeys.includes(key)) {
      dataStart = i
      break
    }
    header[key] = Number(parts[1])
  }

  // 像元中心 → 角点，和 Elevation 里的 xllcorner/yllcorner 语义保持一致
  const halfCell = (header.cellsize || 0) / 2
  if (header.xllcenter != null) header.xllcorner = header.xllcenter - halfCell
  if (header.yllcenter != null) header.yllcorner = header.yllcenter - halfCell

  const nodata = header.nodata_value
  const { ncols, nrows, xllcorner, yllcorner, cellsize } = header
  const values = new Float32Array(ncols * nrows)

  let idx = 0
  for (let i = dataStart; i < lines.length; i++) {
    const nums = lines[i].trim().split(/\s+/)
    for (const n of nums) {
      if (n === '' || idx >= values.length) continue
      const v = Number(n)
      values[idx++] = v === nodata ? 0 : v
    }
  }

  return { ncols, nrows, xllcorner, yllcorner, cellsize, nodata, values }
}

/**
 * Float32Array → RGBA ImageData（每 float32 占 4 字节）
 */
export function float32ToImageData(values, width, height, maxClip) {
  const w = Math.round(width) || 1
  const h = Math.round(height) || 1
  const total = w * h
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const imgData = ctx.createImageData(w, h)

  const buffer = new ArrayBuffer(total * 4)
  const view = new DataView(buffer)

  for (let i = 0; i < total; i++) {
    const raw = i < values.length ? values[i] : 0
    const v = maxClip != null ? Math.min(raw / maxClip, 1.0) : raw
    view.setFloat32(i * 4, v, true)
  }

  const src = new Uint8ClampedArray(buffer)
  imgData.data.set(src)
  return { canvas, ctx, imgData }
}

/**
 * ASC 文本 → base64 PNG（不含 data: 前缀）
 */
export function ascToBase64Png(text) {
  const { ncols, nrows, values } = parseASC(text)
  const { canvas, ctx, imgData } = float32ToImageData(values, ncols, nrows)
  ctx.putImageData(imgData, 0, 0)
  const dataUrl = canvas.toDataURL('image/png')
  // 去掉 "data:image/png;base64," 前缀
  return dataUrl.split(',')[1]
}

/**
 * 批量加载 ASC 文件并转换为 base64 PNG 数组
 * @param {string} baseUrl - ASC 文件的基础 URL
 * @param {number} count - 文件数量
 * @returns {Promise<{base64List: string[], header: object}>}
 */
export async function loadAscFrames(baseUrl, count, maxClip = 1) {
  const base64List = []
  let header = null

  for (let i = 1; i <= count; i++) {
    const url = `${baseUrl}/flood_output${i}.asc`
    const resp = await fetch(url)
    const text = await resp.text()

    if (!header) {
      header = parseASC(text)
    }

    const parsed = parseASC(text)
    const { canvas, ctx, imgData } = float32ToImageData(
      parsed.values,
      header.ncols || parsed.ncols,
      header.nrows || parsed.nrows,
      maxClip
    )
    ctx.putImageData(imgData, 0, 0)
    base64List.push(canvas.toDataURL('image/png').split(',')[1])
  }

  return { base64List, header }
}

/**
 * 把 [0,1] 归一化深度按 24 位整数打包进 RGB（小端），alpha 固定 255。
 * 不用 float32 写进 4 字节是因为 canvas 会对 alpha 做预乘，会破坏字节精度。
 */
export function packNormalizedDepthToImageData(values, width, height, maxClip) {
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const imgData = ctx.createImageData(w, h)
  const safeMax = maxClip > 0 ? maxClip : 1

  for (let i = 0; i < w * h; i++) {
    const raw = i < values.length ? values[i] : 0
    let v = raw / safeMax
    if (!Number.isFinite(v) || v < 0) v = 0
    if (v > 1) v = 1
    const q = Math.round(v * 16777215)
    imgData.data[i * 4] = q & 255
    imgData.data[i * 4 + 1] = (q >> 8) & 255
    imgData.data[i * 4 + 2] = (q >> 16) & 255
    imgData.data[i * 4 + 3] = 255
  }
  return { canvas, ctx, imgData }
}

/**
 * 把 ASC 栅格最近邻重采样到渲染纹理尺寸（Y 轴翻转：ASC 首行是北侧），
 * 与 DebrisFlow 内部 loadAscAsWaterHeight 的采样方式保持一致。
 */
export function resampleASCToSize(values, ncols, nrows, outW, outH, flipY = true) {
  const out = new Float32Array(outW * outH)
  for (let y = 0; y < outH; y++) {
    const srcYFromBottom = Math.min(nrows - 1, Math.floor((y / outH) * nrows))
    const srcY = flipY ? nrows - 1 - srcYFromBottom : srcYFromBottom
    for (let x = 0; x < outW; x++) {
      const srcX = Math.min(ncols - 1, Math.floor((x / outW) * ncols))
      out[y * outW + x] = values[srcY * ncols + srcX]
    }
  }
  return out
}

/**
 * ASC 文本 → 24 位打包 base64 PNG（含 data: 前缀，可直接喂给 DebrisFlow.dataSet）
 */
export function ascToPackedDataUrl(text, outW, outH, maxClip) {
  const { ncols, nrows, values } = parseASC(text)
  const resampled = outW && outH ? resampleASCToSize(values, ncols, nrows, outW, outH) : values
  const w = outW || ncols
  const h = outH || nrows
  const { canvas, ctx, imgData } = packNormalizedDepthToImageData(resampled, w, h, maxClip)
  ctx.putImageData(imgData, 0, 0)
  return canvas.toDataURL('image/png')
}

/**
 * 流深（米）-> 可视化 RGBA（颜色 + 透明度）。
 *
 * 用于「贴地影像图层」渲染：把每帧流深画成带透明度的 PNG 交给 Cesium 的影像图层承载，
 * 由 Cesium 自动把影像贴合到地形网格上；无数据像元 alpha=0，不会盖住底图。
 * 色带与 DebrisFlow 着色器 getColorByValue 保持一致，保证两种渲染方式观感统一。
 */
const WATER_DEPTH_RAMP = [
  [140, 120, 90],
  [160, 130, 80],
  [140, 100, 55],
  [110, 70, 35],
  [70, 40, 20],
]

function sampleWaterDepthColor(v) {
  const last = WATER_DEPTH_RAMP.length - 1
  const x = Math.min(Math.max(v, 0), 1) * last
  const i = Math.min(Math.floor(x), last - 1)
  const t = x - i
  const c0 = WATER_DEPTH_RAMP[i]
  const c1 = WATER_DEPTH_RAMP[i + 1]
  return [
    Math.round(c0[0] + (c1[0] - c0[0]) * t),
    Math.round(c0[1] + (c1[1] - c0[1]) * t),
    Math.round(c0[2] + (c1[2] - c0[2]) * t),
  ]
}

/**
 * 流深数组 -> 可视化 ImageData（颜色 + 透明度）。
 * @param {Float32Array|number[]} values 流深（米）
 * @param {number} width 输出宽（像素）
 * @param {number} height 输出高（像素）
 * @param {number} maxClip 全帧最大流深，用于归一化配色
 * @param {{minDepth?: number, minAlpha?: number}} [options]
 *        minDepth：小于该流深视为无数据（透明），默认 0.05m
 *        minAlpha：湿区最小不透明度，默认 0.25，避免浅水看不到
 */
export function paintDepthToImageData(values, width, height, maxClip, options = {}) {
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height))
  const minDepth = Number.isFinite(options.minDepth) ? Number(options.minDepth) : 0.05
  const minAlpha = Number.isFinite(options.minAlpha) ? Number(options.minAlpha) : 0.25
  const safeMax = maxClip > 0 ? maxClip : 1
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const imgData = ctx.createImageData(w, h)

  for (let i = 0; i < w * h; i++) {
    const idx = i * 4
    const depth = i < values.length ? Number(values[i]) : 0
    if (!Number.isFinite(depth) || depth < minDepth) {
      imgData.data[idx] = 0
      imgData.data[idx + 1] = 0
      imgData.data[idx + 2] = 0
      imgData.data[idx + 3] = 0
      continue
    }
    const norm = Math.min(depth / safeMax, 1)
    const vis = Math.pow(norm, 0.6) // 与着色器一致：浅水也能分辨层次
    const smooth = vis * vis * (3 - 2 * vis) // smoothstep(0, 1, vis)
    const alpha = Math.min(Math.max(minAlpha + (1 - minAlpha) * smooth, 0), 1)
    const rgb = sampleWaterDepthColor(vis)
    imgData.data[idx] = rgb[0]
    imgData.data[idx + 1] = rgb[1]
    imgData.data[idx + 2] = rgb[2]
    imgData.data[idx + 3] = Math.round(alpha * 255)
  }
  return { canvas, ctx, imgData }
}
