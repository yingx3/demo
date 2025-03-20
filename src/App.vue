<template>
  <div class="top-container">
    <div id="cesiumContainer"></div>
    <zh-jc></zh-jc>
    <le-th
      @openLayers="openLayers"
      @timeSelected="handleTimeSelected"
      @yjLayers="yjLayers"
      @floodLayers="floodLayers"
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
// import { EventBus } from '@/event-bus'
import { emitter } from '../src/eventBus.js'
import { en } from 'element-plus/es/locale/index.mjs'
import Heatmap3d from './js/heatmap3d.js'

const viewer = ref(null)
const heatmapLayer = ref(null)
const layer4_guid = ref(null)
const layer5_guid = ref(null)
const entityInterval = ref(null)

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

// Cesium 容器引用
const cesiumContainer = ref(null)

const floodPrimitive = ref(null)
const frontTexture = ref(null)
const backTexture = ref(null)
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

  // 监听鼠标左键点击事件
  // handler.setInputAction(event => {
  //   // 获取点击位置的屏幕坐标（Cartesian2）
  //   const screenPosition = event.position

  //   // 将屏幕坐标转换为三维场景坐标（Cartesian3）
  //   const ray = viewer.value.camera.getPickRay(screenPosition)
  //   const position = viewer.value.scene.globe.pick(ray, viewer.value.scene)

  //   // 如果点击位置在地球上
  //   if (position) {
  //     // 将三维坐标转换为地理坐标（Cartographic）
  //     const cartographic = Cesium.Cartographic.fromCartesian(position)

  //     // 将弧度转换为度数
  //     const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  //     const latitude = Cesium.Math.toDegrees(cartographic.latitude)
  //     const height = cartographic.height

  //     // 输出结果（保留6位小数）
  //     console.log(
  //       `经度: ${longitude.toFixed(6)}°, 纬度: ${latitude.toFixed(
  //         6
  //       )}°, 高度: ${height.toFixed(2)}米`
  //     )
  //   } else {
  //     console.log('未点击在地球表面')
  //   }
  // }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction(event => {
    // 获取点击位置的地理坐标
    const screenPosition = event.position
    const ray = viewer.value.camera.getPickRay(screenPosition)
    const position = viewer.value.scene.globe.pick(ray, viewer.value.scene)

    if (position) {
      // 转换坐标为经纬度（WGS84）
      const cartographic = Cesium.Cartographic.fromCartesian(position)
      const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)
      const height = cartographic.height.toFixed(2)

      // 获取相机当前姿态参数
      const camera = viewer.value.camera
      const cameraPositionCarto = Cesium.Cartographic.fromCartesian(
        camera.position
      )
      const cameraLon = Cesium.Math.toDegrees(
        cameraPositionCarto.longitude
      ).toFixed(6)
      const cameraLat = Cesium.Math.toDegrees(
        cameraPositionCarto.latitude
      ).toFixed(6)
      const cameraHeight = cameraPositionCarto.height.toFixed(2)
      const heading = Cesium.Math.toDegrees(camera.heading).toFixed(2)
      const pitch = Cesium.Math.toDegrees(camera.pitch).toFixed(2)
      const roll = Cesium.Math.toDegrees(camera.roll).toFixed(2)

      // 打印结果
      console.log(`
==== 点击位置 ====
经度: ${longitude}°
纬度: ${latitude}°
高程: ${height}m

==== 相机姿态 ====
经度: ${cameraLon}°
纬度: ${cameraLat}°
高度: ${cameraHeight}m
朝向: ${heading}°（正北为0°，顺时针增加）
俯仰: ${pitch}°（0°水平，正值为俯视）
横滚: ${roll}°（0°水平，正值为向右倾斜）
    `)
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
})

const checkedLayers = (ps, node) => {
  // console.log('ps:', ps)
  // console.log('node:', node)
  //移除取消勾选的图层

  // let entityInterval = null
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
      clearInterval(entityInterval.value)
      entityInterval.value = null
      // viewer.value.entities.removeAll()
      break
    default:
      break
  }
  // // 当前循环中的 p 值集合
  // let currentPValues = [11, 12, 131, 132];
  // 计算差集：当前循环中新增的 p 值
  const newPValues = ps.filter(p => !processedPValues.value.includes(p))
  // console.log(ps)
  if (ps.length === 0) {
    squareStore.closeSquare()
    processedPValues.value = []
    // console.log(processedPValues.value)
    // console.log('没有选中任何图层')
    removeLayer1()
    removeLayer2()
    removeLayer4()
    removeLayer5()
    // clearInterval(entityInterval)
    // entityInterval = null
    // viewer.value.entities.removeById('2')
    viewer.value.entities.removeAll()
  } else {
    // 遍历新增的 p 值并执行相应操作
    // console.log('newPValues:', newPValues)
    // const temp_p = [
    //   'dangerLevel_20250318_151758_659_10800.png',
    //   'dangerLevel_20250318_151820_740_21600.png',
    // ]
    newPValues.forEach(p => {
      console.log('p:', p)
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
          // 当前的 pname 对应的图片地址
          // 定义一个初始 ID（从 h0 开始）
          let entityId = 'h0'
          // 定义定时加载函数
          let currentEntityIndex = 0
          entityInterval.value = setInterval(() => {
            // 删除上一个实体，如果有的话
            const existingEntity = viewer.value.entities.getById(entityId)
            if (existingEntity) {
              viewer.value.entities.removeById(entityId) // 删除当前实体
            }
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
                  entityId = `h${currentEntityIndex + 1}` // id 从 h1 开始
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

        // default:

        //   break
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

    for (const p of ps) {
      // if (p !== 131) {
      //   console.log('6小时图层关闭')
      //   viewer.value.entities.removeById('2')
      // }
      // if (p !== 132) {
      //   console.log('6小时图层关闭')
      //   viewer.value.entities.removeById('3')
      // }
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
      // if (p !== 137) {
      //   clearInterval(entityInterval.value)
      //   viewer.value.entities.removeAll()
      // }

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
function addentity(entityId, imgUrl137, currentEntityIndex, pnameCount) {
  // 删除上一个实体，如果有的话
  const existingEntity = viewer.value.entities.getById(entityId)
  if (existingEntity) {
    viewer.value.entities.removeById(entityId) // 删除当前实体
  }

  imgUrl137 = `/ng/${pname.value[currentEntityIndex]}`
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
        flyToWithRangeCheck(viewer.value, leftlong.value, leftlat.value - 0.4)

        // 更新 entityId 和索引
        entityId = `h${currentEntityIndex + 1}` // id 从 h1 开始
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
}

// let entityInterval = setInterval(addentity(entityId, imageUrl137), 3000)
// 每隔 3 秒执行一次}
// let entityInterval = setInterval(addentity(entityId, imgUrl137), 3000) // 每隔 3 秒执行一次

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
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(95.137369, 30.038497, 10556),
    //相机的姿态
    orientation: {
      heading: Cesium.Math.toRadians(250.0), //朝向
      pitch: Cesium.Math.toRadians(-35.4), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
    complete: () => {
      // 飞行完成后启动热力图
      startHeatmapCycle()
    },
  })
  // loadHeatmap().catch(error => {
  //   console.log('加载热力图失败', error)
  // })
  // 初始化加载
  loadHeatmap(1).catch(error => {
    console.log('初始化热力图失败', error)
  })
  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    stopHeatmapCycle()
    if (heatmapPrimitive) {
      viewer.value.scene.primitives.remove(heatmapPrimitive)
    }
  })
  // console.log('已跳转！！！')
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
// const addLayer_3 = () => {
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
//   viewer.value.camera.flyTo({
//     destination: Cesium.Cartesian3.fromDegrees(95.0, 29.735, 4500),
//     //相机的姿态
//     orientation: {
//       heading: Cesium.Math.toRadians(0.0), //朝向
//       pitch: Cesium.Math.toRadians(-40), //俯仰
//       // pitch: Cesium.Math.toRadians(-90), //俯仰
//       roll: 0.0, //滚转
//     },
//   })
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
// 创建 1x1 的白色占位纹理
const createPlaceholderTexture = viewer => {
  // console.log(viewer)
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, 1, 1)

  return new Cesium.Texture({
    context: viewer.value.scene.context,
    source: canvas,
    width: 1,
    height: 1,
    pixelFormat: Cesium.PixelFormat.RGBA,
  })
}
// 正确创建 Texture 的示例
const createTexture = (data, viewer) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const width = data[0].length
  const height = data.length

  // 设置 Canvas 尺寸
  canvas.width = width
  canvas.height = height

  // 填充数据到 Canvas（假设数据为归一化的二维数组）
  const imageData = ctx.createImageData(width, height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = data[y][x] * 255 // 归一化值转 [0, 255]
      const i = (y * width + x) * 4
      imageData.data[i] = value // R
      imageData.data[i + 1] = value // G
      imageData.data[i + 2] = value // B
      imageData.data[i + 3] = 255 // A
    }
  }
  ctx.putImageData(imageData, 0, 0)

  // 创建纹理（关键参数必须显式定义）
  return new Cesium.Texture({
    context: viewer.scene.context, // 必须传递场景上下文
    source: canvas, // 数据源（Canvas）
    width: width, // 显式定义宽度
    height: height, // 显式定义高度
    pixelFormat: Cesium.PixelFormat.RGBA, // 匹配数据格式
    sampler: new Cesium.Sampler({
      // 定义采样器（可选但推荐）
      wrapS: Cesium.TextureWrap.CLAMP_TO_EDGE,
      wrapT: Cesium.TextureWrap.CLAMP_TO_EDGE,
    }),
  })
}

// 创建洪水图层
const createFloodLayer = async (data, viewer) => {
  // if (!viewer || viewer.scene.primitives.getById('flood-layer')) return

  // 1. 创建占位纹理并等待加载完成
  const placeholderTexture = createPlaceholderTexture(viewer)
  // await placeholderTexture.readyPromise // 关键：等待纹理就绪

  // 2. 等待纹理就绪（关键）
  await placeholderTexture.readyPromise
  // 创建自定义着色器
  const customShader = new Cesium.CustomShader({
    uniforms: {
      u_dynamicTexture: {
        type: Cesium.UniformType.SAMPLER_2D,
        // value: placeholderTexture, // 使用已加载的纹理
        value: new Cesium.TextureUniform({
          url: '/ng/gray_20250219_220429_397.png',
        }),
      },
    },
    fragmentShaderText: `
      uniform sampler2D u_dynamicTexture;
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        material.diffuse = texture2D(u_dynamicTexture, fsInput.texCoord).rgb;
      }
    `,
  })
  // 将 CustomShader 应用到 Model（如加载的 GLTF 模型）
  const model = await Cesium.Model.fromGltfAsync({
    // url: '../../models/Cesium_Air.glb',
    url: 'ng/Cesium_Air.glb',

    customShader: customShader, // 将自定义着色器应用到模型
  })
  // 1. 创建 Primitive 并直接应用 CustomShader
  const floodPrimitive = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(94.5, 29.4, 95.6, 29.5),
        vertexFormat: Cesium.MaterialAppearance.VERTEX_FORMAT,
      }),
    }),
    appearance: new Cesium.MaterialAppearance({
      // 可选：如果仍需基础材质，可在此配置
      material: new Cesium.Material({
        fabric: {
          type: 'Color', // 示例：使用纯色材质
          // customShader: customShader, //
          uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 1.0), // 红色
          },
        },
      }),
    }),
    customShader: customShader, //
    id: 'flood-layer',
  })
  // console.log(customShader)
  console.log(viewer.scene)
  // viewer.scene.primitives.add(floodPrimitive)
  viewer.scene.primitives.add(model)
  console.log(floodPrimitive.customShader)
  // console.log(viewer.value.scene.primitives)
  model.customShader.uniforms.u_dynamicTexture = newTexture

  // 4. 立即用真实数据更新纹理
  if (data) updateTexture(data, viewer)
}
//纹理更新逻辑
const updateTexture = async (data, viewer) => {
  // 1. 获取洪水图层
  // console.log(viewer.scene.primitives)
  // const floodPrimitive = viewer.scene.primitives.getById('flood-layer')
  // if (!floodPrimitive) return

  // 2. 生成新纹理
  const newTexture = createTexture(data, viewer)
  await newTexture.readyPromise // 等待新纹理加载完成

  // 3. 更新着色器 Uniform
  // floodPrimitive.appearance.material.uniforms.u_dynamicTexture = newTexture

  // 4. 清理旧纹理（可选）
  // const oldTexture =
  //   floodPrimitive.appearance.material.uniforms.u_dynamicTexture
  // if (oldTexture && !oldTexture.isDestroyed()) oldTexture.destroy()
}
// console.log(viewer.value.scene)
// 在 Vue 组件中监听数据事件
emitter.on('cesium-texture-data', async data => {
  // const viewer = viewer.value // 获取 Cesium Viewer 实例
  if (!viewer.value) return
  console.log(viewer.value.scene.primitives)

  try {
    // 1. 首次数据到达时创建图层
    if (viewer.value.scene.primitives.length === 0) {
      await createFloodLayer(data, viewer.value)
    }
    // if (!viewer.value.scene.primitives.getById('flood-layer')) {
    //   await createFloodLayer(data, viewer.value)
    // }
    // 2. 后续数据更新纹理
    else {
      await updateTexture(data, viewer.value)
    }
  } catch (error) {
    console.error('纹理处理失败:', error)
    emitter.emit('cesium-error', {
      type: 'TEXTURE_UPDATE_FAILED',
      detail: error,
    })
  }
})

// async function loadHeatmap() {
//   // 加载GeoJSON文件
//   const geoJson = await Cesium.Resource.fetchJson('/ng/output.geojson')

//   // 提取所有点的坐标和值
//   const points = geoJson.features.map(feature => ({
//     position: Cesium.Cartesian3.fromDegrees(
//       feature.geometry.coordinates[0],
//       feature.geometry.coordinates[1]
//     ),
//     value: feature.properties.value,
//   }))

//   // 计算值范围用于颜色映射
//   const values = points.map(p => p.value)
//   const minValue = Math.min(...values)
//   const maxValue = Math.max(...values)

//   // 3. 创建热力图材质
//   const heatmapMaterial = new Cesium.Material({
//     fabric: {
//       type: 'object',
//       uniforms: {
//         points: points,
//         radius: 100, // 热力点半径（米）
//         minValue: minValue,
//         maxValue: maxValue,
//         colorScheme: [
//           // 颜色梯度
//           { ratio: 0, color: new Cesium.Color(0, 0, 1, 0) }, // 蓝
//           { ratio: 0.5, color: new Cesium.Color(0, 1, 1, 0.5) }, // 青
//           { ratio: 1, color: new Cesium.Color(1, 0, 0, 1) }, // 红
//         ],
//       },
//       source: `
//                 uniform vec4[] points;
//                 uniform float radius;
//                 uniform float minValue;
//                 uniform float maxValue;
//                 uniform vec4[] colorScheme;

//                 float getIntensity(vec2 uv) {
//                     float intensity = 0.0;
//                     for(int i = 0; i < points.length(); i++) {
//                         vec4 point = points[i];
//                         vec2 position = czm_windowToWebGL(point.xy);
//                         float distance = length(uv - position);
//                         intensity += point.z * exp(-distance * distance / (2.0 * radius * radius));
//                     }
//                     return clamp((intensity - minValue) / (maxValue - minValue), 0.0, 1.0);
//                 }

//                 vec4 getColor(float ratio) {
//                     for(int i = 1; i < colorScheme.length(); i++) {
//                         if(ratio <= colorScheme[i].x) {
//                             float t = (ratio - colorScheme[i-1].x) / (colorScheme[i].x - colorScheme[i-1].x);
//                             return mix(colorScheme[i-1].yzw, colorScheme[i].yzw, t);
//                         }
//                     }
//                     return colorScheme[colorScheme.length()-1].yzw;
//                 }

//                 void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
//                     vec2 uv = fsInput.attributes.positionWC.xy;
//                     float ratio = getIntensity(uv);
//                     material.diffuse = getColor(ratio);
//                 }
//             `,
//     },
//   })

//   // 4. 创建覆盖热力图区域的地面图元
//   const rectangle = Cesium.Rectangle.fromDegrees(
//     95.0262,
//     29.5808,
//     95.3509,
//     30.0698
//   )

//   viewer.value.scene.primitives.add(
//     new Cesium.GroundPrimitive({
//       geometryInstances: new Cesium.GeometryInstance({
//         geometry: new Cesium.RectangleGeometry({
//           rectangle: rectangle,
//           height: 0,
//         }),
//       }),
//       appearance: new Cesium.MaterialAppearance({
//         material: heatmapMaterial,
//         translucent: true,
//       }),
//     })
//   )
// }
// 修复后的核心代码（基于Cesium 1.107+）
// async function loadHeatmap() {
//   const geoJson = await Cesium.Resource.fetchJson('ng/output.geojson')

//   // 1. 将点数据编码为纹理
//   const positions = []
//   const values = []
//   geoJson.features.forEach(feature => {
//     const cartesian = Cesium.Cartesian3.fromDegrees(
//       feature.geometry.coordinates[0],
//       feature.geometry.coordinates[1]
//     )
//     positions.push(cartesian.x, cartesian.y, cartesian.z)
//     values.push(feature.properties.value)
//   })

//   const minValue = Math.min(...values)
//   const maxValue = Math.max(...values)
//   const valueRange = maxValue - minValue

//   // 创建点数据纹理（RGBA32F格式，每个点占4个像素）
//   const pointsTexture = new Cesium.Texture({
//     context: viewer.value.scene.context,
//     pixelFormat: Cesium.PixelFormat.RGBA,
//     pixelDatatype: Cesium.PixelDatatype.FLOAT,
//     width: Math.ceil(positions.length / 4),
//     height: 1,
//     sampler: new Cesium.Sampler({
//       wrapS: Cesium.TextureWrap.CLAMP_TO_EDGE,
//     }),
//   })

//   // 将数据写入纹理
//   const array = new Float32Array(pointsTexture.width * 4)
//   positions.forEach((val, i) => (array[i] = val))
//   pointsTexture.copyFrom({
//     source: {
//       // 关键点：必须通过 source 传递 ArrayBuffer
//       arrayBuffer: array.buffer,
//       width: pointsTexture.width,
//       height: 1,
//     },
//     // 可选：明确指定像素格式和数据类型
//     pixelFormat: Cesium.PixelFormat.RGBA,
//     pixelDatatype: Cesium.PixelDatatype.FLOAT,
//   })

//   // 2. 修正后的热力图材质
//   const heatmapMaterial = new Cesium.Material({
//     fabric: {
//       type: 'Heatmap',
//       uniforms: {
//         pointsTexture: pointsTexture,
//         pointsCount: positions.length / 3,
//         radius: 100.0,
//         minValue: minValue,
//         maxValue: maxValue,
//         colorScheme: [
//           new Cesium.Color(0, 0, 1, 0),
//           new Cesium.Color(0, 1, 1, 0.5),
//           new Cesium.Color(1, 0, 0, 1),
//         ],
//       },
//       source: `
//                 uniform sampler2D pointsTexture;
//                 uniform float pointsCount;
//                 uniform float radius;
//                 uniform float minValue;
//                 uniform float maxValue;
//                 uniform vec4 colorScheme[3];

//                 vec4 getPoint(int index) {
//                     float u = float(index) / (pointsCount * 4.0 / 4.0);
//                     return texture2D(pointsTexture, vec2(u, 0.5));
//                 }

//                 float computeIntensity(vec2 uv) {
//                     float intensity = 0.0;
//                     for(int i = 0; i < 100; i++) { // 根据实际点数调整循环上限
//                         if(i >= int(pointsCount)) break;

//                         vec4 point = getPoint(i);
//                         vec4 screenPos = czm_modelToWindowCoordinates(point.xyz);
//                         vec2 pointUV = screenPos.xy / czm_viewport.zw;

//                         float distance = length(uv - pointUV);
//                         float value = (point.w - minValue) / (maxValue - minValue);
//                         intensity += value * exp(-distance * distance / (2.0 * radius * radius));
//                     }
//                     return intensity;
//                 }

//                 vec4 getHeatColor(float ratio) {
//                     ratio = clamp(ratio, 0.0, 1.0);
//                     if(ratio < 0.5) {
//                         return mix(colorScheme[0], colorScheme[1], ratio * 2.0);
//                     } else {
//                         return mix(colorScheme[1], colorScheme[2], (ratio - 0.5) * 2.0);
//                     }
//                 }

//                 void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
//                     vec2 uv = fsInput.positionWC.xy / czm_viewport.zw;
//                     float intensity = computeIntensity(uv);
//                     material.diffuse = getHeatColor(intensity).rgb;
//                     material.alpha = getHeatColor(intensity).a;
//                 }
//             `,
//     },
//   })

//   // 3. 创建地面图元
//   const rectangle = Cesium.Rectangle.fromDegrees(
//     95.0262,
//     29.5808,
//     95.3509,
//     30.0698
//   )
//   viewer.value.scene.primitives.add(
//     new Cesium.GroundPrimitive({
//       geometryInstances: new Cesium.GeometryInstance({
//         geometry: new Cesium.RectangleGeometry({
//           rectangle: rectangle,
//           vertexFormat: Cesium.MaterialAppearance.VERTEX_FORMAT,
//         }),
//       }),
//       appearance: new Cesium.MaterialAppearance({
//         material: heatmapMaterial,
//         translucent: true,
//       }),
//     })
//   )
// }

// async function loadHeatmap(output) {
//   const geoJson = await Cesium.Resource.fetchJson('/ng/avaflow/output.geojson')
//   let list = []
//   geoJson.features.forEach(feature => {
//     // 提取坐标并转为普通数组 [经度, 纬度]
//     list.push({
//       lnglat: [
//         feature.geometry.coordinates[0], // 经度
//         feature.geometry.coordinates[1], // 纬度
//       ],
//       // 提取数值
//       value: feature.properties.value,
//     })
//   })
//   heatmapLayer.value = new Heatmap3d(viewer.value, {
//     list: list,
//     raduis: 15,
//     baseHeight: 0,
//     primitiveType: 'TRAINGLE',
//     gradient: {
//       '.1': 'red',
//       '.3': 'yellow',
//       '.6': 'cyan',
//       '.8': 'blue',
//       '.95': 'navy',
//     },
//   })

// }

// async function loadHeatmap(output) {
//   const geoJson = await Cesium.Resource.fetchJson('/ng/output.geojson')
//   let list = []
//   geoJson.features.forEach(feature => {
//     // 提取坐标并转为普通数组 [经度, 纬度]
//     list.push({
//       lnglat: [
//         feature.geometry.coordinates[0], // 经度
//         feature.geometry.coordinates[1], // 纬度
//       ],
//       // 提取数值
//       value: feature.properties.value,
//     })
//   })
//   heatmapLayer.value = new Heatmap3d(viewer.value, {
//     list: list,
//     raduis: 15,
//     baseHeight: 0,
//     primitiveType: 'TRAINGLE',
//     gradient: {
//       '.1': 'red',
//       '.3': 'yellow',
//       '.6': 'cyan',
//       '.8': 'blue',
//       '.95': 'navy',
//     },
//   })
// }

let currentHeatmapIndex = 1 // 当前加载的文件索引
let heatmapPrimitive = null // 当前热力图对象
let intervalId = null // 定时器ID

async function loadHeatmap(index) {
  try {
    // 1. 移除旧的热力图
    if (heatmapPrimitive) {
      // viewer.value.scene.primitives.remove(heatmapPrimitive)
      heatmapPrimitive.destroy()
      heatmapPrimitive = null
    }

    // 2. 加载新数据
    const geoJson = await Cesium.Resource.fetchJson(
      `/ng/avaflow/avaflow_output${index}.geojson`
    )

    // 3. 转换数据格式
    const list = geoJson.features.map(feature => ({
      lnglat: feature.geometry.coordinates,
      value: feature.properties.value,
    }))

    // 4. 创建新热力图
    heatmapPrimitive = new Heatmap3d(viewer.value, {
      list: list,
      radius: 1, //
      baseHeight: 0,
      primitiveType: 'TRIANGLE', // 修正拼写 TRAINGLE -> TRIANGLE
      gradient: {
        '.3': 'blue',
        '.99': 'yellow',
        '.999999999': 'red',
      },
    })

    // 5. 添加到场景
    // viewer.value.scene.primitives.add(heatmapPrimitive)
  } catch (error) {
    console.error(`加载output${index}.geojson失败:`, error)
  }
}

// 启动定时任务
function startHeatmapCycle() {
  intervalId = setInterval(() => {
    currentHeatmapIndex = (currentHeatmapIndex % 21) + 1 // 1-41循环
    loadHeatmap(currentHeatmapIndex)
  }, 1000) // 0.5秒间隔
}

// 停止定时任务
function stopHeatmapCycle() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
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
