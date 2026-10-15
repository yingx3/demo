import test from 'node:test'
import assert from 'node:assert/strict'

import { chooseMapScale } from '../src/utils/mapScale.js'

test('比例尺选择不超过可用宽度的 1/2/5 整刻度', () => {
  assert.deepEqual(chooseMapScale(4800), { meters: 2000, valueText: '2', unit: 'km' })
  assert.deepEqual(chooseMapScale(24000), { meters: 20000, valueText: '20', unit: 'km' })
  assert.deepEqual(chooseMapScale(480), { meters: 200, valueText: '200', unit: 'm' })
})

test('无效距离回退为 1 米', () => {
  assert.deepEqual(chooseMapScale(0), { meters: 1, valueText: '1', unit: 'm' })
  assert.deepEqual(chooseMapScale(NaN), { meters: 1, valueText: '1', unit: 'm' })
})