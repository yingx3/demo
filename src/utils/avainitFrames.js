// -*- coding: utf-8 -*-
// 冰岩崩启动动画：根据后端返回的源区厚度场（ASC）在前端合成启动帧。
//
// 后端返回的 ASC 严格等于手绘范围；崩落体会推进到范围之外，因此这里把源区场
// 放进一个四周各外扩 padCells 的渲染网格，再合成 10 帧。
// 规则与后端 region_frames.py 一致：源区自下游向上游剥离 + 体积守恒的椭圆崩落体。

import { parseASC } from './ascConverter'

/**
 * @param {{ascText:string, azimuth?:number, frameCount?:number, padCells?:number}} options
 * @returns {{frames: Array<{values:Float32Array,ncols:number,nrows:number}>, meta:object}|null}
 */
export function buildAvainitFrames({ ascText, azimuth, frameCount = 10, padCells = 0 }) {
  if (!ascText || typeof ascText !== 'string') return null
  const grid = parseASC(ascText)
  const { ncols, nrows, cellsize, xllcorner, yllcorner, values } = grid
  if (!(ncols > 1) || !(nrows > 1) || !(cellsize > 0) || !values) return null

  const pad = Math.max(0, Math.floor(Number(padCells) || 0))
  const outNcols = ncols + 2 * pad
  const outNrows = nrows + 2 * pad
  const outXll = xllcorner - pad * cellsize
  const outYll = yllcorner - pad * cellsize
  const total = outNcols * outNrows

  // 把源区场放进外扩网格
  const base = new Float32Array(total)
  let baseSum = 0
  for (let r = 0; r < nrows; r++) {
    for (let c = 0; c < ncols; c++) {
      const v = values[r * ncols + c]
      if (!(v > 0)) continue
      base[(r + pad) * outNcols + (c + pad)] = v
      baseSum += v
    }
  }
  if (!(baseSum > 0)) return null

  const xs = new Float64Array(outNcols)
  const ys = new Float64Array(outNrows)
  for (let c = 0; c < outNcols; c++) xs[c] = outXll + (c + 0.5) * cellsize
  for (let r = 0; r < outNrows; r++) ys[r] = outYll + (outNrows - r - 0.5) * cellsize

  const mask = new Uint8Array(total)
  let cx = 0
  let cy = 0
  for (let r = 0; r < outNrows; r++) {
    for (let c = 0; c < outNcols; c++) {
      const i = r * outNcols + c
      if (!(base[i] > 0)) continue
      mask[i] = 1
      cx += xs[c] * base[i]
      cy += ys[r] * base[i]
    }
  }
  cx /= baseSum
  cy /= baseSum

  // 下坡单位向量（自北顺时针方位角）；缺省用加权主成分轴
  let ax
  let ay
  if (Number.isFinite(Number(azimuth))) {
    const rad = (Number(azimuth) * Math.PI) / 180
    ax = Math.sin(rad)
    ay = Math.cos(rad)
  } else {
    let sxx = 0
    let sxy = 0
    let syy = 0
    for (let r = 0; r < outNrows; r++) {
      for (let c = 0; c < outNcols; c++) {
        if (!mask[r * outNcols + c]) continue
        const dx = xs[c] - cx
        const dy = ys[r] - cy
        sxx += dx * dx
        sxy += dx * dy
        syy += dy * dy
      }
    }
    const theta = 0.5 * Math.atan2(2 * sxy, sxx - syy)
    ax = Math.cos(theta)
    ay = Math.sin(theta)
    if (ay > 0) {
      ax = -ax
      ay = -ay
    }
  }
  const nx = -ay
  const ny = ax

  const along = new Float64Array(total)
  const lateral = new Float64Array(total)
  let sMin = Infinity
  let sMax = -Infinity
  let wMax = 0
  for (let r = 0; r < outNrows; r++) {
    for (let c = 0; c < outNcols; c++) {
      const i = r * outNcols + c
      const dx = xs[c] - cx
      const dy = ys[r] - cy
      along[i] = dx * ax + dy * ay
      lateral[i] = dx * nx + dy * ny
      if (!mask[i]) continue
      if (along[i] < sMin) sMin = along[i]
      if (along[i] > sMax) sMax = along[i]
      const lat = Math.abs(lateral[i])
      if (lat > wMax) wMax = lat
    }
  }
  if (!Number.isFinite(sMin) || !Number.isFinite(sMax)) return null

  const sSpan = Math.max(sMax - sMin, cellsize)
  const halfWidth = Math.max(wMax, cellsize * 0.5)
  const lobeLen = 1.35 * sSpan
  const cellArea = cellsize * cellsize
  const count = Math.max(2, Math.floor(Number(frameCount) || 10))

  const frames = []
  for (let k = 0; k < count; k++) {
    const f = count > 1 ? k / (count - 1) : 1
    const out = new Float32Array(total)

    // 源区自下游向上游逐步剥离
    const release = Math.max(0, (f - 0.08) / 0.92)
    const front = 1.15 - 1.3 * release
    let remaining = 0
    for (let i = 0; i < total; i++) {
      if (!mask[i]) continue
      const sn = Math.min(1, Math.max(0, (along[i] - sMin) / sSpan))
      const keep = Math.min(1, Math.max(0, (front - sn) / 0.15))
      const h = base[i] * keep
      out[i] = h
      remaining += h
    }

    // 崩落体：沿坡向前进的椭圆，按剥离体积反算厚度
    const released = Math.max(0, (baseSum - remaining) * cellArea)
    if (f > 0 && released > 1e-9) {
      const adv = lobeLen * f
      const center = sMax + 0.55 * adv
      const halfLen = Math.max(0.5 * adv, 0.6 * cellsize)
      const halfWid = Math.max(halfWidth * (0.6 + 0.8 * f), 0.9 * cellsize)
      const profile = new Float64Array(total)
      let profileSum = 0
      for (let i = 0; i < total; i++) {
        if (mask[i]) continue
        const ta = (along[i] - center) / halfLen
        const tl = lateral[i] / halfWid
        const r2 = ta * ta + tl * tl
        if (r2 >= 1) continue
        const p = Math.pow(1 - r2, 0.75)
        profile[i] = p
        profileSum += p
      }
      if (profileSum > 0) {
        const deposit = released / (profileSum * cellArea)
        for (let i = 0; i < total; i++) {
          if (profile[i] <= 0) continue
          const h = profile[i] * deposit
          if (h > out[i]) out[i] = h
        }
      }
    }

    frames.push({ values: out, ncols: outNcols, nrows: outNrows })
  }

  return {
    frames,
    meta: { ncols: outNcols, nrows: outNrows, cellsize, padCells: pad },
  }
}

export default buildAvainitFrames
