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
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].trim().split(/\s+/)
    if (parts.length === 2 && isNaN(Number(parts[1]))) continue
    if (['ncols', 'nrows', 'xllcorner', 'yllcorner', 'cellsize', 'NODATA_value'].includes(parts[0].toLowerCase())) {
      const key = parts[0].toLowerCase() === 'nodata_value' ? 'nodata' : parts[0].toLowerCase()
      header[key] = Number(parts[1])
    } else {
      dataStart = i
      break
    }
  }

  const { ncols, nrows, xllcorner, yllcorner, cellsize, nodata } = header
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
