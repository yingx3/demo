<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from 'cesium'
import { onMounted } from 'vue'
// console.log(Cesium.VERSION, 'cesium版本号')
onMounted(async () => {
  // Cesium.Ion.defaultAccessToken =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTNhYTY5MS05Yzk0LTRhYmYtOTcwOC00YzdlN2JhMzU3ZTMiLCJpZCI6MjQxNzQxLCJpYXQiOjE3MjY1MzU1MjN9.aSxU00u1JUszveBFaf7IM9_KI8bq7A528YSjMXHE4sE'
  // const viewer = new Cesium.Viewer('cesiumContainer', {
  //   // terrainProvider: Cesium.createWorldTerrain(), //地形图层
  //   baseLayerPicker: false, //隐藏图层选择控件
  //   geocoder: false, //隐藏搜素框控件
  //   homeButton: false, //隐藏主页
  //   sceneModePicker: false, //隐藏投影方式
  //   navigationHelpButton: false, //隐藏帮助按钮
  //   fullscreenButton: false, //隐藏全屏按钮s
  //   animation: false, //隐藏动画控件
  //   timeline: false, //隐藏时间控件
  // })

  // //鼠标移动事件
  // // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  // // handler.setInputAction(event => {
  // //   //拾取模型
  // //   let pick = viewer.scene.pick(event.endPosition)
  // //   console.log(pick)
  // // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  // // const tileset = viewer.scene.primitives.add(
  // //   Cesium.Cesium3DTileset.fromIonAssetId(69380)
  // // )
  // // async add3DTiles (url) {
  // //     const tileset = await Cesium.Cesium.Cesium3DTileset.fromIonAssetId(69380);
  // //     this.viewer.scene.primitives.add(tileset); // 将倾斜摄影实体加载到地图上
  // //     this.viewer.zoomTo(tileset);
  // //   }
  // Grant CesiumJS access to your ion assets
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTNhYTY5MS05Yzk0LTRhYmYtOTcwOC00YzdlN2JhMzU3ZTMiLCJpZCI6MjQxNzQxLCJpYXQiOjE3MjY1MzU1MjN9.aSxU00u1JUszveBFaf7IM9_KI8bq7A528YSjMXHE4sE'

  const viewer = new Cesium.Viewer('cesiumContainer', {
    // terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(1),
    // terrainProvider: Cesium.createWorldTerrain(), //地形图层
    baseLayerPicker: false, //隐藏图层选择控件
    geocoder: false, //隐藏搜素框控件
    homeButton: false, //隐藏主页
    sceneModePicker: false, //隐藏投影方式
    navigationHelpButton: false, //隐藏帮助按钮
    fullscreenButton: false, //隐藏全屏按钮s
    animation: false, //隐藏动画控件
    timeline: false, //隐藏时间控件
  })
  viewer.scene.globe.depthTestAgainstTerrain = true //开启Cesium地形检测，计算其他地理要素和地形之间的遮挡关系，防止场景变化事地理位置显示不正确的情况。

  const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(69380)
  viewer.scene.primitives.add(tileset)
  await viewer.zoomTo(tileset)

  // Apply the default style if it exists
  // const extras = tileset.asset.extras
  // if (
  //   Cesium.defined(extras) &&
  //   Cesium.defined(extras.ion) &&
  //   Cesium.defined(extras.ion.defaultStyle)
  // ) {
  //   tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle)
  // }

  // // 获取 WebGL 上下文
  // const canvas = document.getElementById('canvas')
  // const gl = canvas.getContext('webgl')

  // // 创建一个纹理
  // const texture = gl.createTexture()
  // gl.bindTexture(gl.TEXTURE_2D, texture)

  // // 设置纹理参数和加载纹理数据...
  // // 这里假设您已经完成了纹理参数设置和数据加载的步骤

  // // 手动调用 generateMipmap 来确保级别 0 被正确初始化
  // gl.generateMipmap(gl.TEXTURE_2D)

  // // 绘制纹理到画布上
  // // 这里需要您根据实际情况编写绘制纹理的代码

  // // 如果需要清理工作，记得在最后释放纹理
  // gl.deleteTexture(texture)
})
</script>

<style>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
.cesium-viewer-bottom {
  display: none;
}
/* button {
  position: absolute;
  left: 50px;
  top: 50px;
} */
</style>
