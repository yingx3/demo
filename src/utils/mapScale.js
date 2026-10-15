function formatDistance(meters) {
  if (meters >= 1000) {
    const value = meters / 1000
    return {
      valueText: Number(value.toFixed(2)).toString(),
      unit: 'km',
    }
  }
  return {
    valueText: Math.round(meters).toString(),
    unit: 'm',
  }
}

/** 在不超过 maxMeters 的前提下选择 1/2/5 × 10^n 的整刻度。 */
export function chooseMapScale(maxMeters) {
  const safeMax = Number(maxMeters)
  if (!Number.isFinite(safeMax) || safeMax <= 0) {
    return { meters: 1, valueText: '1', unit: 'm' }
  }

  const exponent = Math.floor(Math.log10(safeMax))
  const base = 10 ** exponent
  let meters = base
  for (const factor of [5, 2, 1]) {
    const candidate = factor * base
    if (candidate <= safeMax) {
      meters = candidate
      break
    }
  }
  return { meters, ...formatDistance(meters) }
}