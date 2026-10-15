import test from 'node:test'
import assert from 'node:assert/strict'

import { isForecastEntity } from '../src/views/mapPickGuards.js'

test('普通灾害点带 pointId 但不能触发位移预警弹窗', () => {
  assert.equal(isForecastEntity({ pointId: 19 }), false)
})

test('只有带完整 forecastInfo 的预警点能触发位移预警弹窗', () => {
  assert.equal(
    isForecastEntity({ pointId: 19, forecastInfo: { rt: 12 } }),
    true,
  )
  assert.equal(isForecastEntity({ forecastInfo: { rt: 12 } }), false)
})