const RISK_COLOR = '#ff4d4f'
const SAFE_COLOR = '#28c76f'

/**
 * 地图点位的等级、图标和尺寸统一在这里解析，避免展示逻辑散落在 Cesium 实体代码中。
 */
export function getSeismicMarkerVisual(detected, probability) {
  const isRisk = Boolean(detected)
  const probabilityValue = Number(probability)
  const probabilityText = Number.isFinite(probabilityValue)
    ? (probabilityValue * 100).toFixed(1) + '%'
    : '—'

  return {
    levelLabel: isRisk ? '检测到风险' : '未检测到异常',
    levelColor: isRisk ? RISK_COLOR : SAFE_COLOR,
    picture: isRisk ? 'warning_red' : 'safe',
    probabilityText,
    billboardSize: isRisk ? 44 : 40,
    pulseDurationMs: isRisk ? 1900 : 2600,
    pulseMinRadius: 440,
    pulseMaxRadius: isRisk ? 760 : 660,
  }
}
/**
 * 生成呼吸圈的一对轴值。长轴始终比短轴多留 2 m，
 * 避免 Cesium 在同一帧分别求值动态属性时因时间差触发轴顺序异常。
 */
export function getSeismicPulseRadii(elapsedMs, visual) {
  const duration = Math.max(1, Number(visual?.pulseDurationMs) || 1)
  const minRadius = Number(visual?.pulseMinRadius) || 440
  const maxRadius = Math.max(minRadius, Number(visual?.pulseMaxRadius) || minRadius)
  const elapsed = Number(elapsedMs) || 0
  const progress = (((elapsed % duration) + duration) % duration) / duration
  const wave = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2)
  const semiMinorAxis = minRadius + (maxRadius - minRadius) * wave

  return {
    semiMajorAxis: semiMinorAxis + 2,
    semiMinorAxis,
  }
}