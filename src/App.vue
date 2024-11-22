<template>
  <div>11111</div>
  <div class="top-container">
    <div id="cesiumContainer"></div>
    <zh-jc></zh-jc>
    <le-th @openLayers="openLayers"></le-th>
<<<<<<< HEAD
    <zy-ml
      @checkboxclicked1="handleCheckboxClicked1"
      @checkboxclicked2="handleCheckboxClicked2"
      @checkboxclicked3="handleCheckboxClicked3"
      @checkboxclicked4="handleCheckboxClicked4"
      @checkboxclicked5="handleCheckboxClicked5"
    ></zy-ml>
=======
    <zy-ml @checkedLayers="checkedLayers"></zy-ml>
>>>>>>> 9b6896d (修改资源目录（el-tree）)
  </div>
</template>
<script setup>
import * as Cesium from 'cesium'
import { ref, onMounted, onUpdated, onBeforeUnmount } from 'vue'
import { getGeojson } from './common/api/api.js'
import Dialog from './js/dialog.js'
import ZhJc from './components/ZhJc.vue'
import LeTh from './components/LeTh.vue'
import ZyMl from './components/ZyMl.vue'
import Heatmap3d from './js/heatmap3d.js'

const viewer = ref(null)
const heatmapLayer = ref(null)
const layer4_guid = ref(null)
const layer5_guid = ref(null)
const data = ref(null)
const dialogs = ref()
onMounted(async () => {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTNhYTY5MS05Yzk0LTRhYmYtOTcwOC00YzdlN2JhMzU3ZTMiLCJpZCI6MjQxNzQxLCJpYXQiOjE3MjY1MzU1MjN9.aSxU00u1JUszveBFaf7IM9_KI8bq7A528YSjMXHE4sE'
  viewer.value = new Cesium.Viewer('cesiumContainer', {
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
  })
  //ScreenSpaceEventHandler是用于处理屏幕空间事件（例如鼠标点击、移动等）。该代码是将其绑定到指定的Cesiuim场景的canvas元素上。该实例监听canvas元素相关的鼠标和触摸事件。
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas)
  //handler.setInputAction(function (movement) { ... }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  //LEFT_CLICK、RIGHT_CLICK
  handler.setInputAction(function (movement) {
    //获取点击实体
    const pickedFeature = viewer.value.scene.pick(movement.position)
    const opts = {
      viewer,
      position: {
        _value: pickedFeature.primitive.position,
      },
      title: pickedFeature.id._properties._OBJECTID._value,
      content: [
        { name: '名称', value: pickedFeature.id._properties._名称._value },
        { name: '经度', value: pickedFeature.id._properties._经度._value },
        { name: '纬度', value: pickedFeature.id._properties._纬度._value },
        {
          name: '断层密度',
          value: pickedFeature.id._properties._断层密度_km_km2_._value,
        },
        {
          name: '隆升速率',
          value: pickedFeature.id._properties._隆升速率_mm_y_._value,
        },
        { name: '坡度', value: pickedFeature.id._properties._坡度___._value },
        {
          name: '河流下切速率',
          value: pickedFeature.id._properties._河流下切速率_mm_y_._value,
        },
        {
          name: '坡体后端汇水面积',
          value: pickedFeature.id._properties._坡体后端汇水面积_m2_._value,
        },
        { name: '高差', value: pickedFeature.id._properties._高差_m_._value },
        {
          name: '潜在滑坡体积规模',
          value: pickedFeature.id._properties._潜在滑坡体积规模._value,
        },
      ],
    }
    if (dialogs.value) {
      // 只允许一个弹窗出现
      dialogs.value.windowClose()
    }
    dialogs.value = new Dialog(opts)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
})

const checkedLayers = ps => {
  // console.log(ps)
  for (const p of ps) {
    // console.log(p)
    if (p === 11) {
      addLayer1()
      // console.log('11')
    }
    if (p !== 11) {
      removeLayer1()
      // console.log('110')
    }
    if (p === 12) {
      addLayer2()
      // console.log('12')
    }
    if (p !== 12) {
      removeLayer2()
      // console.log('120')
    }
    if (p === 13) {
    }
    if (p === 14) {
      addLayer4()
    }
    if (p !== 14) {
      removeLayer4()
    }
    if (p === 15) {
      addLayer5()
    }
    if (p !== 15) {
      removeLayer5()
    }
    if (p !== null) {
      // console.log('111')
      viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(95.0, 29.735, 4500),
        //相机的姿态
        orientation: {
          heading: Cesium.Math.toRadians(0.0), //朝向
          pitch: Cesium.Math.toRadians(-40), //俯仰
          // pitch: Cesium.Math.toRadians(-90), //俯仰
          roll: 0.0, //滚转
        },
      })
    }
  }
}

const openLayers = (p1, p2, p3, p4, p5) => {
  // console.log(p5)
  addLayer3(p1, p2, p3, p4, p5)
}
// 先获取点位的json信息
const getJson = async () => {
  const responses = []

  // 发起第一个异步请求
  const response1 = await getGeojson('/json/hpps2.geojson')
  const { features: features1 } = response1.res
  // console.log(response1.res)
  responses.push(features1)

  // 发起第二个异步请求
  const response2 = await getGeojson('/json/ghpzhl.geojson')
  const { features: features2 } = response2.res
  // console.log(response2.res)
  responses.push(features2)

  // responses 数组包含两个响应对象中的 features
  console.log(responses)
}

//获取数据
const addLayer1 = () => {
  //影像数据
  const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    url: '/api/geoserver/ne/wms',
    layers: 'ne:南迦巴瓦峰',
    parameters: {
      transparent: true,
      format: 'image/jpeg',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
  })
  const layers = viewer.value.scene.imageryLayers
  layers.addImageryProvider(wmsImageryProvider)
  // viewer.value.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(95.0, 29.735, 4500),
  //   //相机的姿态
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0.0), //朝向
  //     pitch: Cesium.Math.toRadians(-40), //俯仰
  //     // pitch: Cesium.Math.toRadians(-90), //俯仰
  //     roll: 0.0, //滚转
  //   },
  // })
}
const removeLayer1 = () => {
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)
    if (
      layer.imageryProvider &&
      layer.imageryProvider.layers === 'ne:南迦巴瓦峰'
    ) {
      imageryLayers.remove(layer)
      break // 移除后退出循环
    }
  }
}
//加载路网
const addLayer2 = () => {
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
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
  })
  // console.log(viewer.value)
  const layers = viewer.value.scene.imageryLayers

  layers.addImageryProvider(wmsImageryProvider1)
  // viewer.value.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(95.0, 29.735, 4500),
  //   //相机的姿态
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0.0), //朝向
  //     pitch: Cesium.Math.toRadians(-40), //俯仰
  //     // pitch: Cesium.Math.toRadians(-90), //俯仰
  //     roll: 0.0, //滚转
  //   },
  // })
}
//移除路网
const removeLayer2 = () => {
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)
    if (layer.imageryProvider && layer.imageryProvider.layers === 'ne:tif2') {
      imageryLayers.remove(layer)
      break // 移除后退出循环
    }
  }
}
// 加载热力图
// const addLayer3 = () => {
//   // 先移除之前的热力图
//   removeHeatmapLayer()
//   let list = []
//   for (let i = 0; i < 100; i++) {
//     list.push({
//       lnglat: [
//         95.13 + Math.random() * 0.5 * (Math.random() > 0.5 ? 1 : -1),
//         29.35 + Math.random() * 0.52 * (Math.random() > 0.5 ? 1 : -1),
//       ],
//       value: 1000 * Math.random(),
//     })
//   }
//   heatmapLayer.value = new Heatmap3d(viewer.value, {
//     list: list,
//     raduis: 15,
//     baseHeight: 3000,
//     primitiveType: 'TRNGLE',
//     gradient: {
//       '.3': 'blue',
//       '.5': 'green',
//       '.7': 'yellow',
//       '.95': 'red',
//     },
//   })
//   // viewer.value.camera.flyTo({
//   //   destination: Cesium.Cartesian3.fromDegrees(95.0, 29.735, 4500),
//   //   //相机的姿态
//   //   orientation: {
//   //     heading: Cesium.Math.toRadians(0.0), //朝向
//   //     pitch: Cesium.Math.toRadians(-40), //俯仰
//   //     // pitch: Cesium.Math.toRadians(-90), //俯仰
//   //     roll: 0.0, //滚转
//   //   },
//   // })
// }

//加载风险区划
const addLayer3 = (p1, p2, p3, p4, p5) => {
  // 定义四个顶点的经纬度
  var rectangle = Cesium.Rectangle.fromDegrees(p2, p1, p4, p3)
  // 指定图像的网络地址
  var imgUrl = `https://28e52549795d707d1da2e91bb09c4eb9.loophole.site/${p5}`
  // 创建一个矩形实体，并将图像应用到该矩形上
  viewer.value.entities.add({
    rectangle: {
      coordinates: rectangle,
      material: new Cesium.ImageMaterialProperty({
        image: imgUrl,
        repeat: new Cesium.Cartesian2(1.0, 1.0), // 图像重复方式
      }),
    },
  })
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(p2, p1 + 0.1, 50000),
  })
}

//加载滑坡判识矢量点
const addLayer4 = () => {
  Cesium.GeoJsonDataSource.load('http://localhost:8086/hpps2.geojson').then(
    function (dataSource) {
      layer4_guid.value = Cesium.createGuid()
      dataSource.guid = layer4_guid.value
      viewer.value.dataSources.add(dataSource)
      // console.log('dataSource:', dataSource)

      const entities = dataSource.entities.values
      const colorHash = {}
      for (var i = 0; i < entities.length; i++) {
        const entity = entities[i]
        const name = entity.name
        entity.point = {
          pixelSize: 30,
          color: Cesium.Color.RED,
        }
        entity.billboard = undefined // 去掉广告牌
      }

      // viewer.value.zoomTo(dataSource)
    }
  )
}
//移除滑坡判识矢量点
const removeLayer4 = () => {
  const dataSources = viewer.value.dataSources._dataSources
  // console.log(dataSources)

  const dataSourceToRemove = dataSources.find(
    data => data.guid == layer4_guid.value
  )
  // console.log(dataSourceToRemove)
  if (dataSourceToRemove) {
    viewer.value.dataSources.remove(dataSourceToRemove)
    // console.log('Data source removed successfully.')
  } else {
    console.log('No data source to remove.')
  }
}
// 加载古滑坡灾害链
const addLayer5 = () => {
  Cesium.GeoJsonDataSource.load('http://localhost:8086/ghpzhl.geojson').then(
    function (dataSource) {
      layer5_guid.value = Cesium.createGuid()
      dataSource.guid = layer5_guid.value
      viewer.value.dataSources.add(dataSource)
      const entities = dataSource.entities.values
      for (var i = 0; i < entities.length; i++) {
        const entity = entities[i]
        const name = entity.name
        entity.point = {
          pixelSize: 30,
          color: Cesium.Color.BLUE,
        }
        entity.billboard = undefined // 去掉广告牌
      }
      // viewer.value.zoomTo(dataSource)
    }
  )
}
//移除古滑坡灾害链
const removeLayer5 = () => {
  const dataSources = viewer.value.dataSources._dataSources
  // console.log(dataSources)

  const dataSourceToRemove = dataSources.find(
    data => data.guid == layer5_guid.value
  )
  if (dataSourceToRemove) {
    viewer.value.dataSources.remove(dataSourceToRemove)
    // console.log('Data source removed successfully.')
  } else {
    console.log('No data source to remove.')
  }
}
//移除热力图
const removeHeatmapLayer = () => {
  if (heatmapLayer.value) {
    heatmapLayer.value.destroy()
    heatmapLayer.value = null
  }
}
const removefximg = () => {
  // Assuming viewer.value.entities is a collection to hold entities
  viewer.value.entities.removeAll()
}
</script>
<style>
.top-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}
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
