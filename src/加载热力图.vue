<template>
  <div id="">
    <div id="cesiumContainer"></div>
    <zh-jc></zh-jc>
    <zy-ml></zy-ml>
  </div>
</template>
<script setup>
import * as Cesium from 'cesium'
import { onMounted } from 'vue'
import ZhJc from './components/ZhJc.vue'
import ZyMl from './components/ZyMl.vue'
import Heatmap3d from './js/heatmap3d.js'
onMounted(async () => {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTNhYTY5MS05Yzk0LTRhYmYtOTcwOC00YzdlN2JhMzU3ZTMiLCJpZCI6MjQxNzQxLCJpYXQiOjE3MjY1MzU1MjN9.aSxU00u1JUszveBFaf7IM9_KI8bq7A528YSjMXHE4sE'

  const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(1), //地形图层
    // terrainProvider: Cesium.createWorldTerrain(), //地形图层
    baseLayerPicker: false, //隐藏图层选择控件
    geocoder: false, //隐藏搜素框控件
    homeButton: false, //隐藏主页
    sceneModePicker: false, //隐藏投影方式
    navigationHelpButton: false, //隐藏帮助按钮
    fullscreenButton: false, //隐藏全屏按钮s
    animation: false, //隐藏动画控件
    timeline: false, //隐藏时间控件
    infoBox: false,
    // imageryProvider: false,
  })
  const layers = viewer.scene.imageryLayers

  //遥感影像
  const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    url: '/api/geoserver/ne/wms',
    layers: 'ne:南迦巴瓦峰',
    parameters: {
      // transparent: true,
      format: 'image/jpeg',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
  })

  //路网
  const wmsImageryProvider1 = new Cesium.WebMapServiceImageryProvider({
    url: '/api/geoserver/ne/wms',
    layers: 'ne:tif2',
    // layers: 'ne:tif13',
    parameters: {
      transparent: true,
      format: 'image/png',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    // tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
  })

  layers.addImageryProvider(wmsImageryProvider)

  layers.addImageryProvider(wmsImageryProvider1)

  let list = [
    // { lnglat: [95.054153, 29.7353939], value: 76 },
    // { lnglat: [95.0654284, 29.7354935], value: 63 },
    // { lnglat: [95.065005, 29.735573], value: 1 },
    // { lnglat: [95.064001, 29.735456], value: 21 },
    // { lnglat: [95.063219, 29.735181], value: 28 },
    // { lnglat: [95.062788, 29.735673], value: 41 },
    // { lnglat: [95.0632087, 29.7352665], value: 75 },
    // { lnglat: [95.0505158, 29.73538], value: 76 },
    // { lnglat: [95.0531094, 29.7353591], value: 100 },
    // { lnglat: [95.0531093, 29.735456], value: 80 },
    // { lnglat: [95.053293, 29.735826], value: 1 },
    // { lnglat: [95.050099, 29.735638], value: 21 },
    // { lnglat: [95.0469149, 29.7354109], value: 28 },
    // { lnglat: [95.054119, 29.735274], value: 41 },
  ]
  for (let i = 0; i < 100; i++) {
    list.push({
      lnglat: [
        95.13 + Math.random() * 0.5 * (Math.random() > 0.5 ? 1 : -1),
        29.35 + Math.random() * 0.52 * (Math.random() > 0.5 ? 1 : -1),
      ],
      value: 1000 * Math.random(),
    })
  }
  new Heatmap3d(viewer, {
    list: list,
    raduis: 15,
    baseHeight: 3000,
    primitiveType: 'TRNGLE',
    gradient: {
      '.3': 'blue',
      '.5': 'green',
      '.7': 'yellow',
      '.95': 'red',
    },
  })
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(95.0, 29.735, 4500),
    //相机的姿态
    orientation: {
      heading: Cesium.Math.toRadians(0.0), //朝向
      pitch: Cesium.Math.toRadians(-40), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
  })
})
</script>

<style>
#cesiumContainer {
  position: absolute;
  left: 0px;
  right: 0px;
  width: 100vw;
  height: 100vh;
}
.cesium-viewer-bottom {
  display: none;
}
</style>
