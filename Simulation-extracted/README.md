# 溃决洪水 / 泥石流渲染库 (extracted)

基于 Cesium + WebGL2 GPGPU 的灾害仿真渲染模块，从 RiskInsight 项目中提取。

## 包含模块

| 模块 | 类名 | 算法 |
|---|---|---|
| WaterSImulation | `WaterSimulate` | 2D 浅水方程 网格流体 |
| DebrisFlow | `DebrisFlow` | 2D 浅水方程 多相泥石流 |
| SPH | `WaterSimulateSPH` | 3D PCGSPH 粒子法 + Ray Marching |

## 前置条件

1. **Cesium 全局加载**: `window.Cesium` 必须存在（`<script src="cesium.js">` 或 Cesium CDN）
2. **构建工具支持 `?raw` 导入**: Vite 原生支持，Webpack 需配置 `raw-loader`

```bash
npm install @turf/turf proj4
```

若使用 Webpack，需配置 GLSL shader 的 raw 导入：

```js
// webpack.config.js
module: {
  rules: [
    { test: /\.glsl$/, use: 'raw-loader' }
  ]
}
```

然后将各模块 `index.js` 中的 `?raw` 后缀去掉：

```js
// 改为
import Command from './shaders/Command.glsl'
```

## 使用示例

```js
import { WaterSimulate } from './Simulation-extracted/index.js'

const sim = new WaterSimulate({
  viewer: viewer,          // Cesium.Viewer 实例
  width: 1024,             // 计算网格宽
  height: 1024,            // 计算网格高
  cellSize: 30,            // 像元大小(米)
  center: centerCartesian, // Cesium.Cartesian3 区域中心
  level: 13,               // Cesium 地形采样级别
  lakeJSON: geojson,       // 冰湖/水体范围 GeoJSON
  debrisJSON: geojson,     // 滑坡体范围 GeoJSON
  deepWaterColor: '#5C4225',
  lightWaterColor: '#B78C12',
  renderTerrain: true,
  renderHeatMap: false,
  renderOriginData: false,
  preRender: (ins) => { },
  postRender: (ins) => { },
  onDataUpdate: (ins) => { }
})

// 初始化：采样地形 → 创建纹理 → 编译 Shader → 注册渲染
await sim.initBox({ center: centerCartesian, level: 13 })

// 逐帧加载后端推送的 base64 PNG (每像素 RGBA = float32)
sim.dataSet = ['data:image/png;base64,...', ...]

// 移除
sim.remove()
```

## 数据协议

后端 WebSocket 推送每帧：

```js
{
  ncols: 200,        // 列数
  nrows: 200,        // 行数
  cellsize: 30,      // 像元大小(米)
  xllcorner: 345678, // 左下角 X (UTM)
  yllcorner: 3456789,// 左下角 Y (UTM)
  image: "base64..." // PNG, 每像素 4byte 编码 1 个 float32
}
```

## 文件结构

```
Simulation-extracted/
├── Util.js              ← 公共基础 (CustomPrimitive, RenderUtil, 坐标工具)
├── index.js             ← 统一导出
├── README.md
├── WaterSImulation/
│   ├── index.js
│   └── shaders/ (7 glsl)
├── DebrisFlow/
│   ├── index.js
│   └── shaders/ (7 glsl)
└── SPH/
    ├── index.js
    └── shaders/ (7 glsl)
```
