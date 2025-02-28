<template>
  <div class="top-container">
    <div id="cesiumContainer"></div>
    <zh-jc></zh-jc>
    <le-th
      @openLayers="openLayers"
      @timeSelected="handleTimeSelected"
      @yjLayers="yjLayers"
    ></le-th>
    <zy-ml
      :time="selectedTime"
      @checkedLayers="checkedLayers"
      :checked-ids="selectedIds"
    ></zy-ml>
    <div class="control">
      <div class="control_specific">
        <img src="./assets/img/global.png" alt="" />
        <img src="./assets/img/mountain.png" alt="" />
        <img src="./assets/img/arrow.png" alt="" />
        <img src="./assets/img/coverage.png" alt="" />
        <img src="./assets/img/table.png" alt="" />
        <img src="./assets/img/flag.png" alt="" />
        <img src="./assets/img/roll.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script setup>
import * as Cesium from 'cesium'
import { nextTick, ref, onMounted, onUpdated, onBeforeUnmount } from 'vue'
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

//存储选中的时间
const selectedTime = ref([])

const hd = ref('')
const gray = ref('')
const rgb = ref('')
const redGradient = ref('')
const dangerLevel = ref('')
const pname = ref([])
// 假设已处理的 p 值集合
const processedPValues = ref([])
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
  // console.log(pnames.value)
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

const checkedLayers = (ps, node) => {
  // console.log('ps:', ps)
  // console.log('node:', node)
  //移除取消勾选的图层
  switch (node) {
    case 131:
      viewer.value.entities.removeById('2')
      break
    case 132:
      viewer.value.entities.removeById('3')
      break
    case 133:
      viewer.value.entities.removeById('4')
      break
    case 134:
      viewer.value.entities.removeById('5')
      break
    case 135:
      viewer.value.entities.removeById('6')
      break
    case 136:
      viewer.value.entities.removeById('7')
      break
    case 137:
      viewer.value.entities.removeAll()
      break
    default:
      break
  }
  // // 当前循环中的 p 值集合
  // let currentPValues = [11, 12, 131, 132];
  // 计算差集：当前循环中新增的 p 值
  const newPValues = ps.filter(p => !processedPValues.value.includes(p))
  // console.log('newPValues:', newPValues)
  if (ps.length === 0) {
    squareStore.closeSquare()
    processedPValues.value = []
    // console.log(processedPValues.value)
    // console.log('没有选中任何图层')
    removeLayer1()
    removeLayer2()
    // viewer.value.entities.removeById('2')
    viewer.value.entities.removeAll()
    removeLayer4()
    removeLayer5()
  } else {
    // console.log('entities:', viewer.value.entities)
    // viewer.value.entities.removeById('2')
    // if (p === 11) {
    //   addLayer1()
    //   flyToWithRangeCheck(viewer.value, 95.0, 29.735)
    // }
    // if (p !== 11) {
    //   removeLayer1()
    //   // console.log('110')
    // }
    // if (p === 12) {
    //   addLayer2()
    //   flyToWithRangeCheck(viewer.value, 95.0, 29.735)
    // }
    // if (p !== 12) {
    //   removeLayer2()
    // }
    // if (p === 131) {
    //   console.log('3小时图层打开')
    //   const match = hd.value.match(/^([^_]+)_/)
    //   if (match[1] == 'dangerLevel') {
    //     squareStore.openSquare()
    //     squareStore.openRisk()
    //   }
    //   // var imgUrl = `/ng/${pname.value[0]}`
    //   var imgUrl = `/ng/dangerLevel_20250219_214621_669_10800.png`
    //   viewer.value.entities.add({
    //     id: '8',
    //     rectangle: {
    //       coordinates: Cesium.Rectangle.fromDegrees(
    //         leftlong.value,
    //         leftlat.value,
    //         rightlong.value,
    //         rightlat.value
    //       ),
    //       material: new Cesium.ImageMaterialProperty({
    //         image: imgUrl,
    //         repeat: new Cesium.Cartesian2(1.0, 1.0), // 图像重复方式
    //       }),
    //     },
    //   })
    //   flyToWithRangeCheck(viewer.value, leftlong.value, leftlat.value - 0.4)
    // }
    // if (p !== 131) {
    //   console.log('3小时图层关闭')
    //   viewer.value.entities.removeById('2')
    // }
    // 遍历新增的 p 值并执行相应操作
    newPValues.forEach(p => {
      switch (p) {
        case 11:
          addLayer1()
          flyToWithRangeCheck(viewer.value, 95.0, 29.735)
          break
        case 12:
          addLayer2()
          flyToWithRangeCheck(viewer.value, 95.0, 29.735)
          break
        case 131:
          // console.log('3小时图层打开')
          const match = hd.value.match(/^([^_]+)_/)
          if (match[1] === 'dangerLevel') {
            squareStore.openSquare()
            squareStore.openRisk()
          }
          const imgUrl = `/ng/${pname.value[0]}`
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
          flyToWithRangeCheck(viewer.value, leftlong.value, leftlat.value - 0.4)
          break
        case 132:
          // console.log('6小时图层打开')
          const match132 = hd.value.match(/^([^_]+)_/)
          if (match132[1] === 'dangerLevel') {
            squareStore.openSquare()
            squareStore.openRisk()
          }
          const imgUrl132 = `/ng/${pname.value[1]}`
          viewer.value.entities.add({
            id: '3',
            rectangle: {
              coordinates: Cesium.Rectangle.fromDegrees(
                leftlong.value,
                leftlat.value,
                rightlong.value,
                rightlat.value
              ),
              material: new Cesium.ImageMaterialProperty({
                image: imgUrl132,
                repeat: new Cesium.Cartesian2(1.0, 1.0), // 图像重复方式
              }),
            },
          })
          flyToWithRangeCheck(viewer.value, leftlong.value, leftlat.value - 0.4)
        case 137:
          const match137 = hd.value.match(/^([^_]+)_/)
          if (match137[1] === 'dangerLevel') {
            squareStore.openSquare()
            squareStore.openRisk()
          }

          // 获取 pname 的个数
          const pnameCount = pname.value.length

          // 定义一个初始 ID（从 h1 开始）
          let entityId = 'h1'

          // 定义定时加载函数
          let currentEntityIndex = 0
          let entityInterval = setInterval(() => {
            // 删除上一个实体，如果有的话
            const existingEntity = viewer.value.entities.getById(entityId)
            if (existingEntity) {
              viewer.value.entities.removeById(entityId) // 删除当前实体
            }

            // 当前的 pname 对应的图片地址
            const imgUrl137 = `/ng/${pname.value[currentEntityIndex]}`

            // 使用 Cesium.Resource 加载图像
            const imageResource = new Cesium.Resource({
              url: imgUrl137,
            })

            imageResource
              .fetchImage()
              .then(image => {
                if (image && image.width > 0 && image.height > 0) {
                  // 如果图像有效，继续添加实体
                  viewer.value.entities.add({
                    id: entityId, // 使用当前的 entityId
                    rectangle: {
                      coordinates: Cesium.Rectangle.fromDegrees(
                        leftlong.value,
                        leftlat.value,
                        rightlong.value,
                        rightlat.value
                      ),
                      material: new Cesium.ImageMaterialProperty({
                        image: imgUrl137,
                        repeat: new Cesium.Cartesian2(1.0, 1.0), // 图像重复方式
                      }),
                    },
                  })

                  // 飞行至目标位置
                  flyToWithRangeCheck(
                    viewer.value,
                    leftlong.value,
                    leftlat.value - 0.4
                  )

                  // 更新 entityId 和索引
                  entityId = `h${currentEntityIndex + 2}` // id 从 h1 开始
                  currentEntityIndex++

                  // 如果加载到最后一个实体，重置索引，重新循环
                  if (currentEntityIndex >= pnameCount) {
                    currentEntityIndex = 0
                  }
                } else {
                  console.error('图像无效或尺寸为零：', imgUrl137)
                }
              })
              .catch(error => {
                console.error('图像加载失败：', error)
              })
          }, 3000) // 每隔 3 秒执行一次

          break

        default:
          // 处理其他情况
          break
      }
    })
    processedPValues.value = [
      ...new Set([...processedPValues.value, ...newPValues]),
    ]
    // console.log(processedPValues.value)
    // if (p === 132) {
    //   console.log('6小时图层打开')
    //   const match = hd.value.match(/^([^_]+)_/)
    //   if (match[1] == 'dangerLevel') {
    //     // console.log('111')
    //     squareStore.openSquare()
    //     squareStore.openRisk()
    //   }
    //   // var imgUrl = `/ng/${pname.value[1]}`
    //   var imgUrl = `/ng/gray_20250219_220429_397.png`
    //   viewer.value.entities.add({
    //     id: '3',
    //     rectangle: {
    //       coordinates: Cesium.Rectangle.fromDegrees(
    //         leftlong.value,
    //         leftlat.value,
    //         rightlong.value,
    //         rightlat.value
    //       ),
    //       material: new Cesium.ImageMaterialProperty({
    //         image: imgUrl,
    //         repeat: new Cesium.Cartesian2(1.0, 1.0), // 图像重复方式
    //       }),
    //     },
    //   })
    //   flyToWithRangeCheck(viewer.value, leftlong.value, leftlat.value - 0.4)
    // }
    // if (p !== 132) {
    //   console.log('6小时图层关闭')
    //   viewer.value.entities.removeById('3')
    // }
    for (const p of ps) {
      if (p === 133) {
        const match = hd.value.match(/^([^_]+)_/)
        if (match[1] == 'dangerLevel') {
          // console.log('111')
          squareStore.openSquare()
          squareStore.openRisk()
        }
        var imgUrl = `/ng/${pname.value[2]}`
        viewer.value.entities.add({
          id: '4',
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
        flyToWithRangeCheck(viewer.value, leftlong.value, leftlat.value - 0.4)
      }
      if (p !== 133) {
        // console.log('111')
        viewer.value.entities.removeById('4')
      }
      if (p === 134) {
        const match = hd.value.match(/^([^_]+)_/)
        if (match[1] == 'dangerLevel') {
          // console.log('111')
          squareStore.openSquare()
          squareStore.openRisk()
        }
        var imgUrl = `/ng/${pname.value[3]}`
        viewer.value.entities.add({
          id: '5',
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
        flyToWithRangeCheck(viewer.value, leftlong.value, leftlat.value - 0.4)
      }
      if (p !== 134) {
        // console.log('111')
        viewer.value.entities.removeById('5')
      }
      if (p === 135) {
        const match = hd.value.match(/^([^_]+)_/)
        if (match[1] == 'dangerLevel') {
          // console.log('111')
          squareStore.openSquare()
          squareStore.openRisk()
        }
        var imgUrl = `/ng/${pname.value[4]}`
        viewer.value.entities.add({
          id: '6',
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
        flyToWithRangeCheck(viewer.value, leftlong.value, leftlat.value - 0.4)
      }
      if (p !== 135) {
        // console.log('111')
        viewer.value.entities.removeById('6')
      }
      if (p === 136) {
        const match = hd.value.match(/^([^_]+)_/)
        if (match[1] == 'dangerLevel') {
          // console.log('111')
          squareStore.openSquare()
          squareStore.openRisk()
        }
        var imgUrl = `/ng/${pname.value[5]}`
        viewer.value.entities.add({
          id: '7',
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
        flyToWithRangeCheck(viewer.value, leftlong.value, leftlat.value - 0.4)
      }
      if (p !== 136) {
        // console.log('111')
        viewer.value.entities.removeById('7')
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
//处理LeTh组件传递的时间
const handleTimeSelected = time => {
  // console.log(time)
  // selectedTime.value = time[0]
  selectedTime.value = []
  for (let t of time) {
    selectedTime.value.push(t) //打印每个选中的时间（秒数）
    // console.log(t)
  }
  // console.log(selectedTime.value)
}

const openLayers = params => {
  // console.log(params)
  const { leftlat, leftlong, rightlat, rightlong, pnames } = params
  // console.log(pnames)
  if (pnames && Array.isArray(pnames)) {
    pname.value.push(...pnames)
  } else {
    // 如果 pns 是 undefined 或 null，或者不是数组，将其作为单个元素添加
    pname.value.push(pnames)
  }
  pname.value.reverse() //逆序排列数组
  console.log(pname.value)
  // console.log(leftlat, leftlong, rightlat, rightlong)
  // console.log(pnames.value) // pnames 是一个数组，包含所有传递的 pname 参数
  const match = pnames[0].match(/^([^_]+)_/)
  if (match[1] == 'dangerLevel') {
    // console.log('111')
    squareStore.openSquare()
    squareStore.openRisk()
  } else {
    squareStore.closeRisk()
  }

  addLayer3(leftlat, leftlong, rightlat, rightlong, pnames[1])
  selectedIds.value = [131]
}

const yjLayers = () => {
  var imgUrl = `/ng/ca_exp2_hflow_map.gif`
  var rectangle = Cesium.Rectangle.fromDegrees(
    94.975777,
    29.976196,
    95.088043,
    30.035248
  )
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
    destination: Cesium.Cartesian3.fromDegrees(95.0293964, 30.0092938, 50000),
  })
  console.log('已跳转！！！')
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

.top-container .control .control_specific {
  display: flex;
  /* height: 450px; */

  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  top: 85px;
  right: 350px;
  align-items: center;
}
.top-container .control .control_specific img {
  transform: scale(0.7);
}
</style>
