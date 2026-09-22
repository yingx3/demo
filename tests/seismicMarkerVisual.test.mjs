import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getSeismicMarkerVisual,
  getSeismicPulseRadii,
} from '../src/views/seismicMarkerVisual.js'

test('检测到风险时使用红色告警点位', () => {
  const visual = getSeismicMarkerVisual(true, 0.825)

  assert.equal(visual.levelLabel, '检测到风险')
  assert.equal(visual.levelColor, '#ff4d4f')
  assert.equal(visual.picture, 'warning_red')
  assert.equal(visual.probabilityText, '82.5%')
  assert.equal(visual.billboardSize, 44)
})

test('未检测到异常时使用绿色安全点位', () => {
  const visual = getSeismicMarkerVisual(false, 0.125)

  assert.equal(visual.levelLabel, '未检测到异常')
  assert.equal(visual.levelColor, '#28c76f')
  assert.equal(visual.picture, 'safe')
  assert.equal(visual.probabilityText, '12.5%')
  assert.equal(visual.billboardSize, 40)
})

test('缺少有效概率时显示占位符', () => {
  const visual = getSeismicMarkerVisual(false, undefined)

  assert.equal(visual.probabilityText, '—')
})

test('呼吸圈长轴始终不小于短轴', () => {
  const visual = getSeismicMarkerVisual(true, 0.8)

  for (let elapsedMs = 0; elapsedMs <= 5000; elapsedMs += 25) {
    const radii = getSeismicPulseRadii(elapsedMs, visual)
    assert.ok(
      radii.semiMajorAxis >= radii.semiMinorAxis,
      `轴值顺序错误: ${radii.semiMajorAxis} < ${radii.semiMinorAxis}`,
    )
  }
})