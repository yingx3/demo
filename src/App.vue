<template>
  <div class="top-container">
    <div id="cesiumContainer"></div>
    <zh-jc></zh-jc>
    <le-th @openLayers="openLayers"></le-th>
    <zy-ml @checkedLayers="checkedLayers" :checked-ids="selectedIds"></zy-ml>
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
import { useSquareStore } from './stores/squareStore'
// import Heatmap3d from './js/heatmap3d.js'

const viewer = ref(null)
const heatmapLayer = ref(null)
const layer4_guid = ref(null)
const layer5_guid = ref(null)

const data = ref(null)
const dialogs = ref()
// 获取 store 实例
const squareStore = useSquareStore()
const leftlong = ref(97.51465187373286)
const leftlat = ref(31.043538628515304)
const rightlong = ref(97.59842422060389)
const rightlat = ref(31.17398632290709)

const selectedIds = ref([])

// const hd = ref('dangerLevel_20241129_110851_273.png')
const hd = ref('dangerLevel_20241129_110851_27.gif')
// const hd = ref(null)
const gray = ref('')
const rgb = ref('')
const redGradient = ref('')
const dangerLevel = ref('')
// const id =ref(null)
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
  if (ps.length === 0) {
    // viewer.value.camera.flyTo({
    //   destination: Cesium.Cartesian3.fromDegrees(0, 0, 6378137 * 3),
    //   orientation: {
    //     heading: 0,
    //     pitch: Cesium.Math.toRadians(-90),
    //     roll: 0,
    //   },
    // })
    removeLayer1()
    removeLayer2()
    // viewer.value.entities.removeById('2')
    viewer.value.entities.removeAll()
    removeLayer4()
    removeLayer5()
  } else {
    for (const p of ps) {
      // console.log(p)
      if (p === 11) {
        addLayer1()
        // console.log('11')
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
        flyToWithRangeCheck(viewer.value, 95.0, 29.735)
      }
      if (p !== 11) {
        removeLayer1()
        // console.log('110')
      }
      if (p === 12) {
        addLayer2()
        // console.log('12')
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
        flyToWithRangeCheck(viewer.value, 95.0, 29.735)
      }
      if (p !== 12) {
        removeLayer2()
        // console.log('120')
      }
      if (p === 13) {
        const match = hd.value.match(/^([^_]+)_/)
        if (match[1] == 'dangerLevel') {
          // console.log('111')
          squareStore.openSquare()
          squareStore.openRisk()
        }
        var imgUrl = `/ng/${hd.value}`
        viewer.value.entities.add({
          id: '2',
          rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(
              leftlong.value,
              leftlat.value,
              rightlong.value,
              rightlat.value
            ),
            material: new Cesium.ImageMaterialProperty({
              image: imgUrl,
              repeat: new Cesium.Cartesian2(1.0, 1.0), // 图像重复方式
            }),
          },
        })
        // viewer.value.camera.flyTo({
        //   destination: Cesium.Cartesian3.fromDegrees(
        //     leftlong.value,
        //     leftlat.value + 0.1,
        //     50000
        //   ),
        // })
        //范围检测后执行跳转逻辑
        flyToWithRangeCheck(viewer.value, leftlong.value, leftlat.value - 0.4)
      }
      if (p !== 13) {
        console.log('111')
        viewer.value.entities.removeById('2')
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
    }
  }
}

// 范围检测逻辑
function flyToWithRangeCheck(
  viewer,
  targetLongitude,
  targetLatitude,
  rangeThreshold = 1
) {
  // 获取当前相机中心的经纬度坐标
  const cameraPosition = viewer.camera.positionCartographic
  const currentLongitude = Cesium.Math.toDegrees(cameraPosition.longitude)
  const currentLatitude = Cesium.Math.toDegrees(cameraPosition.latitude)

  // 计算与目标点的距离（经纬度差值）
  const longitudeDifference = Math.abs(currentLongitude - targetLongitude)
  const latitudeDifference = Math.abs(currentLatitude - targetLatitude)

  // 如果目标点在范围内，直接返回，不进行跳转
  if (
    longitudeDifference <= rangeThreshold &&
    latitudeDifference <= rangeThreshold
  ) {
    // console.log('Target location is within range, no jump performed.')
    return
  }

  // 如果超出范围，执行飞行跳转
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      targetLongitude,
      targetLatitude,
      50000
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0.0), //朝向
      pitch: Cesium.Math.toRadians(-40), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
  })
}

const openLayers = (p1, p2, p3, p4, p5) => {
  const match = p5.match(/^([^_]+)_/)
  if (match[1] == 'dangerLevel') {
    // console.log('111')
    squareStore.openSquare()
    squareStore.openRisk()
  } else {
    squareStore.closeRisk()
  }

  addLayer3(p1, p2, p3, p4, p5)
  selectedIds.value = [13]
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

//使用正则提取文件名
const extractString = filename => {
  // 使用正则表达式提取第一个 "_" 前的字符串
  const match = filename.match(/^([^_]+)_/) // 捕获从开头到第一个 "_" 的内容
  if (match && match[1]) {
    const firstPart = match[1] // 提取匹配的内容
    if (firstPart === 'redGradient') {
      redGradient.value = filename
    } else if (firstPart === 'gray') {
      gray.value = filename
    } else if (firstPart === 'rgb') {
      rgb.value = filename
    } else {
      // squareStore.openRisk
      dangerLevel.value = filename
    }
  }
}
//加载风险区划
const addLayer3 = (p1, p2, p3, p4, p5) => {
  // 定义四个顶点的经纬度
  // console.log(p1)
  leftlat.value = p1
  leftlong.value = p2
  rightlat.value = p3
  rightlong.value = p4

  extractString(p5)
  hd.value = p5

  var rectangle = Cesium.Rectangle.fromDegrees(p2, p1, p4, p3)
  // 指定图像的网络地址
  // var imgUrl = `http://localhost:8086/${p5}`

  var imgUrl = `/ng/${p5}`
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
  Cesium.GeoJsonDataSource.load('/ng/hpps2.geojson').then(function (
    dataSource
  ) {
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

    viewer.value.zoomTo(dataSource)
  })
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
    // console.log('No data source to remove.')
  }
}
// 加载古滑坡灾害链
const addLayer5 = () => {
  Cesium.GeoJsonDataSource.load('/ng/ghpzhl.geojson').then(function (
    dataSource
  ) {
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
    viewer.value.zoomTo(dataSource)
  })
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
    // console.log('No data source to remove.')
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
  /* max-height: 947px; */
  position: relative;
  width: 100vw;
  height: 100vh;
  font-family: 'Source Han Sans', 'Trebuchet MS', 'Lucida Sans Unicode',
    'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  /* display: flex;
  justify-self: center;
  align-content: center; */
}
#cesiumContainer {
  position: absolute;
  left: 0px;
  right: 0px;
  width: 100vw;
  height: 100vh;
  /* padding: 16px; */
  /* box-sizing: border-box; */
}
.cesium-viewer-bottom {
  display: none;
}
/* 媒体查询设置显示比例 */
@media (max-height: 911px) {
  .top-container {
    transform: scale(0.99);
    transform-origin: top;
  }
}
@media (max-height: 947px) {
  .top-container {
    transform: scale(1);
    transform-origin: top;
  }
}
@media (max-height: 956.55px) {
  .top-container {
    transform: scale(0.999);
    transform-origin: top;
  }
}
@media (max-height: 1080px) {
  .top-container {
    transform: scale(1);
    transform-origin: top;
  }
}
/* @media (max-width: 840px) and (max-height: 600px) {
  .top-container {
    transform: scale(0.5);
    transform-origin: top;
  }
} */
</style>
