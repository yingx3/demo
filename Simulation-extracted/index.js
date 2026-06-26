/**
 * DebrisFlow Simulation — 溃决洪水 / 泥石流渲染库 (extracted)
 *
 * 使用方式:
 *   import { WaterSimulate, DebrisFlow, WaterSimulateSPH } from './Simulation-extracted/index.js'
 *
 * 前提:
 *   - window.Cesium 已全局加载
 *   - npm install @turf/turf proj4
 */

export { default as WaterSimulate } from './WaterSImulation/index.js'
export { default as DebrisFlow } from './DebrisFlow/index.js'
export { default as WaterSimulateSPH } from './SPH/index.js'
export { CustomPrimitive, RenderUtil, getNorthPointByDistance, angle, generateModelMatrix, base64ToImg, interpolateCesiumColor } from './Util.js'
