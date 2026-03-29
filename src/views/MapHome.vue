<template>
  <div class="map-home-overlay">
    <zh-jc></zh-jc>
    <le-th
      @openLayers="openLayers"
      @timeSelected="handleTimeSelected"
      @yjLayers="yjLayers"
      @floodLayers="floodLayers"
      @forecast="foreCast"
      @seismicResult="handleSeismicResult"
    ></le-th>
    <zy-ml
      :time="selectedTime"
      @checkedLayers="checkedLayers"
      :checked-ids="selectedIds"
    ></zy-ml>
    <div class="control">
      <div class="control_specific">
        <!-- <a href="#" @click="magnify"
          ><img src="../assets/img/magnify.png" alt=""
        /></a>
        <a href="#" @click="shrink"
          ><img src="../assets/img/shrink.png" alt=""
        /></a>
        <a href="#" @click="move"
          ><img src="../assets/img/move.png" alt=""
        /></a> -->
        <!-- 测量距离 -->
        <a-popover
          placement="left"
          trigger="hover"
          :open="popoverStatus_hover['popover_measure']"
          @openChange="open => handleHoverChange('popover_measure', open)"
          color="rgba(255,255,255,0.4)"
        >
          <template #content>
            <div>测量距离</div>
          </template>
          <a href="#" @click="measure"
            ><img src="../assets/img/measure.png" alt="" /></a
        ></a-popover>
        <!-- 测量面积 -->
        <a-popover
          placement="left"
          trigger="hover"
          :open="popoverStatus_hover['popover_polygon']"
          @openChange="open => handleHoverChange('popover_polygon', open)"
          color="rgba(255, 255, 255, 0.4)"
        >
          <template #content> <div>测量面积</div> </template
          ><a href="#" @click="polygon"
            ><img src="../assets/img/polygon.png" alt="" /></a
        ></a-popover>

        <!-- 设置位置 -->
        <a-popover
          placement="left"
          style="width: 500px"
          trigger="hover"
          :open="popoverStatus_hover['popover_setPosition']"
          color="rgba(255, 255, 255, 0.4)"
          @openChange="open => handleHoverChange('popover_setPosition', open)"
          overlayClassName="setPositionPopover"
        >
          <template #content>
            <div>设置位置</div>
          </template>
          <a-popover
            placement="left"
            trigger="click"
            :open="popoverStatus_click['popover_setPosition']"
            @openChange="open => handleClickChange('popover_setPosition', open)"
          >
            <template #content>
              <div>
                <el-form :model="form_setPosition">
                  <el-form-item label="经度" style="margin-bottom: 5px"
                    ><el-input
                      v-model.number="form_setPosition.longitude"
                    ></el-input></el-form-item
                  ><el-form-item label="纬度" style="margin-bottom: 5px"
                    ><el-input
                      v-model.number="form_setPosition.latitude"
                    ></el-input></el-form-item
                  ><el-form-item></el-form-item
                  ><el-form-item style="margin-top: 10px">
                    <el-button type="primary" @click="submit_setPosition"
                      >确认</el-button
                    >
                    <el-button
                      type="primary"
                      @click="
                        () => handleClickChange('popover_setPosition', false)
                      "
                      >取消</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </template>
            <a href="#"> <img src="../assets/img/position.png" alt="" /></a>
          </a-popover>
        </a-popover>

        <!-- 添加属性 -->
        <a-popover
          placement="left"
          trigger="hover"
          :open="popoverStatus_hover['popover_attribute']"
          @openChange="open => handleHoverChange('popover_attribute', open)"
          color="rgba(255, 255, 255, 0.4)"
        >
          <template #content>
            <div>添加属性</div>
          </template>
          <a href="#" @click="addattribute">
            <img src="../assets/img/flag.png" alt="" /></a
        ></a-popover>

        <!-- 查询属性 -->
        <a-popover
          placement="left"
          trigger="hover"
          :open="popoverStatus_hover['popover_searchattribute']"
          @openChange="
            open => handleHoverChange('popover_searchattribute', open)
          "
          color="rgba(255, 255, 255, 0.4)"
        >
          <template #content>
            <div>查询属性</div>
          </template>
          <a href="#" @click="searchdisaster">
            <img src="../assets/img/table.png" alt="" /></a
        ></a-popover>
        <!-- 清除实体 -->
        <a-popover
          placement="left"
          trigger="hover"
          :open="popoverStatus_hover['popover_cleanentity']"
          @openChange="open => handleHoverChange('popover_cleanentity', open)"
          color="rgba(255, 255, 255, 0.4)"
        >
          <template #content>
            <div>清除实体</div>
          </template>
          <a href="#" @click="cleanentity">
            <img src="../assets/img/clean.png" alt="" /></a
        ></a-popover>
        <!-- 重置 -->
        <!-- <a href="#"> <img src="./assets/img/roll.png" alt="" /></a> -->

        <el-dialog
          v-model="dialogVisible_disaster"
          title="添加属性"
          width="500"
        >
          <el-form :model="form">
            <el-form-item label="名称"
              ><el-input v-model="form.name"></el-input></el-form-item
            ><el-form-item label="断层密度"
              ><el-input v-model="form.dcmd"></el-input></el-form-item
            ><el-form-item label="隆升速率"
              ><el-input v-model="form.lssl"></el-input></el-form-item
            ><el-form-item label="坡度"
              ><el-input v-model="form.slope"></el-input></el-form-item
            ><el-form-item label="河流下切速率"
              ><el-input v-model="form.hlxqsl"></el-input></el-form-item
            ><el-form-item label="坡体后端汇水面积"
              ><el-input v-model="form.pthhsmj"></el-input></el-form-item
            ><el-form-item label="高差"
              ><el-input v-model="form.elevation"></el-input></el-form-item
            ><el-form-item label="潜在滑坡体积规模"
              ><el-select v-model="form.scale" teleport=".top-container"
                ><el-option label="小型" value="small" /><el-option
                  label="中型"
                  value="middle" /><el-option
                  label="大型"
                  value="big" /><el-option
                  label="特大型"
                  value="heavy" /></el-select
            ></el-form-item>
            <el-form-item
              ><el-button @click="submit_disaster">提交</el-button
              ><el-button @click="dialogVisible_disaster = false"
                >取消</el-button
              ></el-form-item
            ></el-form
          ></el-dialog
        >
        <el-dialog
          v-model="dialogVisible_searchdisaster"
          title="查询属性"
          width="500"
        >
          <el-form :model="form_disastersearch">
            <el-form-item label="区划查询" style="width: 500px">
              <div class="flex-container">
                <el-select
                  v-model="form_disastersearch.location"
                  teleport=".top-container"
                  ><el-option label="林芝市" value="林芝市"> </el-option
                  ><el-option label="朗县" value="朗县"> </el-option
                  ><el-option label="察隅县" value="察隅县"> </el-option
                  ><el-option label="工布江达县" value="工布江达县"> </el-option
                  ><el-option label="米林县" value="米林县"> </el-option
                  ><el-option label="墨脱县" value="墨脱县"> </el-option
                  ><el-option label="波密县" value="波密县">
                  </el-option></el-select
                ><el-button
                  @click="locationsearch"
                  v-on:click.middle="locationsearchqxz"
                  >查询</el-button
                >
              </div>
            </el-form-item>
            <el-form-item label="属性查询" style="width: 500px">
              <div class="flex-container">
                <el-select
                  v-model="form_disastersearch.attribute"
                  teleport=".top-container"
                >
                  <el-option label="地点" value="location"></el-option
                  ><el-option label="坡度" value="slope"></el-option
                  ><el-option label="规模" value="scale"></el-option></el-select
                ><el-input
                  v-model="form_disastersearch.attributevalue"
                ></el-input
                ><el-button @click="attributesearch">查询</el-button>
              </div>
            </el-form-item>
            <el-button style="margin-left: 284px">清空查询条件</el-button>
          </el-form>
        </el-dialog>

        <el-dialog
          v-model="dialogVisible_checkattribute"
          title="属性表"
          width="860"
        >
          <div class="dynamic-table-container">
            <!-- 搜索和过滤区域 -->
            <div class="table-controls">
              <el-input
                v-model="searchKeyword"
                placeholder="输入关键字搜索"
                style="width: 300px; margin-right: 20px"
              />
              <el-button type="primary">搜索</el-button>
            </div>

            <!-- 数据表格 -->
            <el-table
              v-loading="loading"
              :data="tableData"
              stripe
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="名称"
                width="80"
                sortable="custom"
                align="center"
              />
              <el-table-column
                prop="dcmd"
                label="断层密度"
                width="80"
                align="center"
              />
              <el-table-column
                prop="lssl"
                label="隆升速率"
                width="80"
                align="center"
              />
              <el-table-column
                prop="slope"
                label="坡度"
                width="80"
                align="center"
              />

              <el-table-column
                prop="hlxqsl"
                label="河流下切速率"
                width="140"
                align="center"
              />

              <el-table-column
                prop="pthhsmj"
                label="坡体后汇水面积"
                width="140"
                align="center"
              />

              <el-table-column
                prop="elevation"
                label="高差"
                width="80"
                align="center"
              />

              <el-table-column
                prop="scale"
                label="潜在滑坡体积规模"
                width="140"
                align="center"
              />
            </el-table>

            <!-- 分页组件 -->
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="pagination.currentPage"
                v-model:page-size="pagination.pageSize"
                :page-sizes="[5, 10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
              />
            </div>

            <!-- 错误提示 -->
            <el-alert
              v-if="errorMessage"
              :title="errorMessage"
              type="error"
              show-icon
              closable
              class="error-alert"
            />
          </div>
        </el-dialog>

        <el-dialog
          v-model="dialogVisible_checkqxz"
          title="站点信息"
          width="415"
        >
          <div class="dynamic-table-container">
            <!-- 搜索和过滤区域 -->
            <div class="table-controls">
              <el-input
                v-model="searchKeyword"
                placeholder="输入关键字搜索"
                style="width: 300px; margin-right: 20px"
              />
              <el-button type="primary">搜索</el-button>
            </div>
            <!-- 数据表格 -->
            <el-table
              v-loading="loading"
              :data="tableData_qxz"
              stripe
              style="width: 100%"
            >
              <el-table-column
                prop="z_name"
                label="站点名称"
                width="80"
                sortable="custom"
                align="center"
              />
              <el-table-column
                prop="jyl"
                label="降雨量"
                width="80"
                align="center"
              />
              <el-table-column
                prop="wind"
                label="风速"
                width="80"
                align="center"
              />
            </el-table>

            <!-- 分页组件 -->
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="pagination.currentPage"
                v-model:page-size="pagination.pageSize"
                :page-sizes="[5, 10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
              />
            </div>

            <!-- 错误提示 -->
            <el-alert
              v-if="errorMessage"
              :title="errorMessage"
              type="error"
              show-icon
              closable
              class="error-alert"
            />
          </div>
        </el-dialog>
      </div>
    </div>

    <div
      class="chart-container"
      :class="{ 'show-chart': chartVisible, 'hide-chart': !chartVisible }"
    >
      <div class="chart-close-btn" @click="chartVisible = false">
        <el-icon><Close /></el-icon>
      </div>

      <div class="chart-body">
        <div id="displacement-chart"></div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="popupVisible"
    title="设备详情"
    width="600px"
    :before-close="hidePopup"
  >
    <div v-if="currentEntity">
      <p><strong>设备 ID:</strong> {{ currentEntity.properties.deviceid }}</p>
      <p>
        <strong>泥石流检测结果:</strong>
        {{ detectionResult ? '检测到风险！' : '未检测到' }}
      </p>
      <el-button @click="showWaveform">查看波形与检测点</el-button>
      <div
        id="waveform-chart"
        style="width: 100%; height: 300px; margin-top: 20px"
      ></div>
    </div>
  </el-dialog>
</template>
<script setup>
// import wkb from 'wkb'
// import wkx from 'wkx'
import * as Cesium from 'cesium'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import {
  watch,
  nextTick,
  ref,
  inject,
  onMounted,
  onUpdated,
  onBeforeUnmount,
} from 'vue'
import { reactive } from 'vue'
import { getGeojson } from '../common/api/api.js'
import Dialog from '../js/dialog.js'
import ZhJc from '../components/ZhJc.vue'
import LeTh from '../components/LeTh.vue'
import ZyMl from '../components/ZyMl.vue'
import { useSquareStore } from '../stores/squareStore'
// import { EventBus } from '@/event-bus'
import { emitter } from '../eventBus.js'
// import { Buffer } from 'buffer'
import { en, vi } from 'element-plus/es/locale/index.mjs'
import Heatmap3d from '../js/heatmap3d.js'
import axios from 'axios'
import MeasureDistance from '../js/measuredistance.js'
import MeasureArea from '../js/MeasureArea.js'
import MeasureManager from '../js/MeasureManager.js'
import RainEffectManager from '../js/RainEffectManager.js'
import { KrigingInstance } from '../js/krigingInstance.js'
import turf, { point } from 'turf'
import {
  parseWKB,
  parseWKBMultiLineString,
  parseWKBMultiPolygon,
  parseLineStringWKB,
} from '../utils/wkb.js'
import { createFloodLayer, updateTexture } from '../services/textureService.js'
import {
  loadHeatmap as svcLoadHeatmap,
  loadHeatmapFlood as svcLoadHeatmapFlood,
} from '../services/heatmapService.js'
import {
  fetchAllDevices,
  fetchLatestRecords,
  getLatestDevicesByIds,
  calculateDebrisFlow,
  addLayerDZDdevice,
  removeLayerDZDdevice,
} from '../services/deviceService.js'
// import { Popover } from 'ant-design-vue'

// import type { TableColumnCtx } from 'element-plus'
// import * as WKB from 'wkb'
// import * as wkx from 'wkx'

const viewer = inject('cesiumViewer')
const heatmapLayer = ref(null)
const layer17_guid = ref(null)
const layer4_guid = ref(null)
const layer5_guid = ref(null)
const entityInterval = ref(null)
const isChartVisible = ref(true) // 控制图表显示的标志

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

const dialogVisible_disaster = ref(false)
const dialogVisible_searchdisaster = ref(false)
const dialogVisible_checkattribute = ref(false)
const dialogVisible_checkqxz = ref(false)

const chartVisible = ref(false) // 控制趋势图显示隐藏
const currentPointId = ref(null) // 记录当前点击的点ID
const form = reactive({
  name: '111',
  dcmd: '222',
  lssl: '333',
  slope: '444',
  hlxqsl: '555',
  pthhsmj: '666',
  elevation: '777',
  scale: '888',
  longitude: '',
  latitude: '',
})
const form_disastersearch = reactive({
  location: '林芝市',
  attribute: '地点',
  attributevalue: '林芝',
})

// 响应式数据

const popupVisible = ref(false)
const currentEntity = ref(null)
const currentRecords = ref([])
const detectionResult = ref(false)
const resultArray = ref([])
const tableData = ref([
  {
    name: '',
    dcmd: '',
    lssl: '',
    slope: '',
    hlxqsl: '',
    pthhsmj: '',
    elevation: '',
    scale: '',
  },
])
const tableData_qxz = ref([
  {
    z_name: '',
    jyl: '',
    wind: '',
  },
])
//设置相机位置
const form_setPosition = reactive({
  longitude: 94.65348,
  latitude: 29.833531,
  height: 29515,
})
const loading = ref(false)
const errorMessage = ref('')
const searchKeyword = ref('')
const sortParams = reactive({
  prop: 'date',
  order: 'descending',
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

const boxStyle = ref({
  left: '0px',
  top: '0px',
  width: '0px',
  height: '0px',
  display: 'none',
  position: 'absolute',
  border: '2px solid red',
  backgroundColor: 'rgba(255,0,0,0.2)',
  pointerEvents: 'none',
})

const md = ref(null)
// const id =ref(null)
const popoverStatus_hover = ref({
  popover_measure: false,
  popover_polygon: false,
  popover_setPosition: false,
  popover_attribute: false,
  popover_searchattribute: false,
  popover_cleanentity: false,
})
const popoverStatus_click = ref({
  popover_measure: false,
  popover_polygon: false,
  popover_setPosition: false,
})
const clicked = ref(false)
const hovered = ref(false)
const hide = () => {
  clicked.value = false
  hovered.value = false
}
const handleHoverChange = (popoverKey, visible) => {
  // 步骤1：遍历对象，把所有 Popover 状态设为 false（关闭所有）
  Object.keys(popoverStatus_hover.value).forEach(key => {
    popoverStatus_hover.value[key] = false
  })
  // this.popoverKey = popoverKey
  // 步骤2：只把当前触发的 Popover 设为 visible（显示/隐藏当前）
  // console.log(popoverKey,visible)
  popoverStatus_hover.value[popoverKey] = visible
}
const handleClickChange = (popoverKey, visible) => {
  Object.keys(popoverStatus_click.value).forEach(key => {
    popoverStatus_click.value[key] = false
  })
  popoverStatus_click.value[popoverKey] = visible
}
const submit_setPosition = () => {
  if (!form_setPosition.longitude || !form_setPosition.latitude) {
    ElMessage.error('请输入完整信息')
    return
  }
  handleClickChange('popover_setPosition', false)

  // 2. 正确设置相机位置 + 姿态（替换直接赋值的代码）
  viewer.value.camera.setView({
    // 位置：经纬度转笛卡尔坐标
    destination: Cesium.Cartesian3.fromDegrees(
      form_setPosition.longitude,
      form_setPosition.latitude,
      form_setPosition.height,
    ),
    // 姿态：heading/pitch/roll（弧度值）
    orientation: {
      heading: Cesium.Math.toRadians(2.02), // 航向角
      pitch: Cesium.Math.toRadians(-48.92), // 俯仰角
      roll: Cesium.Math.toRadians(360.0), // 翻滚角
    },
  })
  //关闭弹窗

  // dialogVisible_setPosition.value = false
}
onMounted(() => {
  // viewer 由 MapLayout 初始化并通过 provide/inject 注入，此处无需再初始化 Cesium
})

//选中与未选中图层
const checkedLayers = (ps, node) => {
  //移除取消勾选的图层
  switch (node) {
    case 16:
      removeLayer_river()
      break
    case 17:
      removeLayer_glacier()
      break
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
    case 21:
      removeLayer_dem()
      break
    case 22:
      removeLayer_slope()
      break
    case 23:
      removeLayer_aspect()
      break
    case 24:
      removeLayer_relief()
      break
    case 31:
      removeAllStations()
      break
    case 32:
      removeLayer_DZDdevice()
      break

    default:
      break
  }

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
    removeLayer_dem()
    removeLayer_slope()
    removeLayer_aspect()
    removeLayer_relief()
    removeLayer_DZDdevice()
    removeLayer_river()
    removeLayer_glacier()
    // clearInterval(entityInterval)
    // entityInterval = null
    // viewer.value.entities.removeById('2')
    viewer.value.entities.removeAll()
  } else {
    // 遍历新增的 p 值并执行相应操作
    newPValues.forEach(p => {
      // console.log('p:', p)
      switch (p) {
        case 11:
          addLayer1()
          // flyToWithRangeCheck(viewer.value, 95.0, 29.735)
          break
        case 12:
          addLayer2()
          // flyToWithRangeCheck(viewer.value, 95.0, 29.735)
          break
        case 16:
          addLayer_river()
          break
        case 17:
          addLayer_glacier()
          break
        case 131:
          // console.log('3小时图层打开')
          const match = hd.value.match(/^([^_]+)_/)
          console.log(match)
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
                rightlat.value,
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
                rightlat.value,
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
                        rightlat.value,
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
                    leftlat.value - 0.4,
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
        case 21:
          addLayer_dem()
          break
        // default:
        case 22:
          addLayer_slope()
          break
        case 23:
          addLayer_aspect()
          break
        case 24:
          addLayer_relief()
          break
        case 31:
          addLayer_weatherstation()
          break
        case 32:
          // 使用 deviceService 中的封装方法，回调由本文件处理弹窗展示
          addlayer_DZDdevice()
          break
      }
    })
    processedPValues.value = [
      ...new Set([...processedPValues.value, ...newPValues]),
    ]
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
              rightlat.value,
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
              rightlat.value,
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
              rightlat.value,
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
              rightlat.value,
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
  rangeThreshold = 1,
) {
  // 获取当前相机中心的经纬度坐标
  // console.log(viewer)
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
      50000,
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0.0), //朝向
      pitch: Cesium.Math.toRadians(-40), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
  })
}

async function loadShpFromBackend({
  filename,
  folder,
  endpoint = '/testapi/GBM',
}) {
  ElMessage.closeAll()
  ElMessage({ message: '请求后端处理 shapefile...', type: 'info', duration: 0 })

  try {
    const resp = await axios.post(
      endpoint,
      { filename, folder },
      { timeout: 120000 },
    )
    ElMessage.closeAll()

    if (!resp?.data) {
      ElMessage.error('后端返回为空')
      return null
    }

    if (resp.data.status && resp.data.status !== 'ok') {
      ElMessage.error(
        '后端处理失败：' + (resp.data.message || resp.data.status),
      )
      return null
    }

    // ✅ 获取 GeoJSON
    let geojson = resp.data.geojson || resp.data.data || resp.data
    if (typeof geojson === 'string') {
      try {
        geojson = JSON.parse(geojson)
      } catch (e) {
        console.warn('geojson 不是 JSON 字符串')
      }
    }

    // ✅ 加载到 Cesium
    const dataSource = await Cesium.GeoJsonDataSource.load(geojson, {
      clampToGround: false,
      stroke: Cesium.Color.WHITE.withAlpha(0),
      fill: Cesium.Color.WHITE.withAlpha(0),
      clampToGround: true,
    })

    viewer.value.dataSources.add(dataSource)

    debugPrintDataSourceEntities(dataSource, 3)

    // ✅ 应用易发等级符号化
    const applied = applySuscSymbology(dataSource)
    ElMessage.success(`图层加载完成，共 ${applied} 个实体已符号化`)
    viewer.value.flyTo(dataSource)

    return dataSource
  } catch (err) {
    ElMessage.closeAll()
    ElMessage.error('加载失败：' + (err?.message || err))
    console.error('loadShpFromBackend error', err)
    return null
  }
}

function applySuscSymbology(dataSource) {
  console.log(
    'applySuscSymbology: called',
    !!dataSource,
    dataSource?.entities?.values?.length ?? 0,
  )

  if (!dataSource?.entities) {
    console.warn('applySuscSymbology: dataSource 或 entities 缺失')
    return 0
  }

  const entities = dataSource.entities.values
  const now = Cesium.JulianDate.now()

  // 同时支持中文和英文 key
  const ramp = {
    // 英文下划线形式
    very_low: { color: '#4caf50', alpha: 0.55 }, // 绿色
    low: { color: '#2196f3', alpha: 0.65 }, // 蓝色
    middle: { color: '#ffeb3b', alpha: 0.78 }, // 黄色
    midlle: { color: '#ffeb3b', alpha: 0.78 }, // 容错拼写
    high: { color: '#f44336', alpha: 0.88 }, // 红色
    very_high: { color: '#8b0000', alpha: 0.95 }, // 红褐色

    // 中文 key（根据 debug 输出）
    极低: { color: '#4caf50', alpha: 0.55 },
    低: { color: '#2196f3', alpha: 0.65 },
    中等: { color: '#ffeb3b', alpha: 0.78 },
    高: { color: '#f44336', alpha: 0.88 },
    极高: { color: '#8b0000', alpha: 0.95 },
  }

  // 优先查找的字段名（把 class 放首位）
  const candidateKeys = [
    'class',
    'susc_class',
    'susc class',
    'suscClass',
    'susc',
  ]

  // ASCII 归一化备用（保留 a-z0-9_）
  const normalize = s =>
    String(s || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')

  const getClassValue = entity => {
    if (!entity.properties) return null
    const propNames =
      entity.properties.propertyNames || Object.keys(entity.properties || {})

    // 按候选字段优先读取（不做去除中文的归一化）
    for (const key of candidateKeys) {
      for (const pn of propNames) {
        try {
          if (pn === key || normalize(pn) === normalize(key)) {
            const p = entity.properties[pn]
            const raw =
              p?._value ??
              (typeof p?.getValue === 'function' ? p.getValue(now) : undefined)
            if (raw !== undefined && raw !== null) return String(raw).trim()
          }
        } catch (e) {
          // 忽略单个属性读取错误
        }
      }
    }

    // 兜底：返回第一个非 id 的属性值（原始字符串）
    for (const pn of propNames) {
      try {
        if (/^id$/i.test(pn)) continue
        const p = entity.properties[pn]
        const raw =
          p?._value ??
          (typeof p?.getValue === 'function' ? p.getValue(now) : undefined)
        if (raw !== undefined && raw !== null) return String(raw).trim()
      } catch (e) {}
    }
    return null
  }

  let applied = 0
  for (const e of entities) {
    try {
      const rawVal = getClassValue(e)
      if (!rawVal) continue

      // 三种尝试顺序：原始值（支持中文）、小写原始值（支持英文字母）、下划线归一化
      const rawTrim = rawVal
      const rawLower = String(rawVal).toLowerCase()
      const keyNorm = normalize(rawLower)

      const style = ramp[rawTrim] || ramp[rawLower] || ramp[keyNorm]
      if (!style) {
        // 便于调试：若没有匹配到样式，打印一次（可删除生产环境）
        // console.debug('applySuscSymbology: 未匹配等级 key', rawVal, { rawTrim, rawLower, keyNorm });
        continue
      }

      const color = Cesium.Color.fromCssColorString(style.color).withAlpha(
        style.alpha,
      )

      if (e.polygon) {
        // 移除高度设置，保持 clampToGround 效果
        e.polygon.material = new Cesium.ColorMaterialProperty(color)
        e.polygon.outline = true
        e.polygon.fill = true
        try {
          e.polygon.outlineColor = new Cesium.ConstantProperty(
            Cesium.Color.BLACK,
          )
        } catch (err) {
          try {
            e.polygon.outlineColor = Cesium.Color.BLACK
          } catch (e) {}
        }
      } else if (e.polyline) {
        e.polyline.material = new Cesium.PolylineGlowMaterialProperty({
          color,
          glowPower: 0.2,
        })
        const w =
          typeof e.polyline.width?.getValue === 'function'
            ? e.polyline.width.getValue(now)
            : e.polyline.width || 3
        e.polyline.width = w || 3
      } else if (e.point) {
        e.point.color = new Cesium.ConstantProperty(color)
        if (e.billboard) e.billboard.color = color
      }
      applied++
    } catch (err) {
      console.warn('applySuscSymbology: 单个实体着色失败', e?.id, err)
    }
  }

  console.log(
    `applySuscSymbology: success, applied ${applied} / ${entities.length}`,
  )
  return applied
}

function debugPrintDataSourceEntities(dataSource, sampleCount = 5) {
  if (!dataSource?.entities) {
    console.warn('debug: dataSource 或 entities 缺失')
    return
  }

  const entities = dataSource.entities.values
  console.log(`🧩 debug: entities total = ${entities.length}`)

  const now = Cesium.JulianDate.now()
  const max = Math.min(sampleCount, entities.length)

  for (let i = 0; i < max; i++) {
    const e = entities[i]
    console.group(`Entity [${i}] id=${e.id || '(无)'}`)
    const names = e.properties?.propertyNames || Object.keys(e.properties || {})
    console.log('属性名:', names)

    for (const n of names) {
      try {
        const p = e.properties[n]
        const val =
          p?._value ??
          (typeof p?.getValue === 'function' ? p.getValue(now) : undefined)
        console.log(`  ${n}:`, val)
      } catch (err) {
        console.warn(`  ${n} 读取失败`, err)
      }
    }

    const suspectKeys = ['susc', 'susc_class', 'class', '易发性']
    for (const k of suspectKeys) {
      try {
        const v =
          e.properties?.[k]?._value ?? e.properties?.[k]?.getValue?.(now)
        if (v !== undefined) console.log(`  → ${k} 值:`, v)
      } catch {}
    }

    console.groupEnd()
  }

  if (entities.length > max) {
    console.log(
      `（已省略 ${entities.length - max} 个实体，增加 sampleCount 可查看更多）`,
    )
  }
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

const openLayers = async params => {
  // 保留原有功能：兼容 params 为空、pnames 不是数组等情况
  // 原始逻辑：处理 pnames、判断 dangerLevel、调用 addLayer3 并设置 selectedIds
  try {
    if (!params) {
      console.warn('openLayers: params is empty')
      return
    }

    const { leftlat, leftlong, rightlat, rightlong, pnames } = params

    // 处理 pname 列表，兼容单个字符串或数组或未提供
    if (pnames) {
      if (Array.isArray(pnames)) {
        pname.value.push(...pnames)
      } else {
        pname.value.push(pnames)
      }
    } else {
      // 如果没有 pnames，不影响原有其它流程
      console.warn('openLayers: pnames is not provided')
    }
    // 与原逻辑相同：逆序排列
    if (pname.value.length > 1) pname.value.reverse()

    // 取第一个用于判断 dangerLevel / addLayer3（安全读取）
    const firstPname =
      Array.isArray(pnames) && pnames.length > 0
        ? pnames[0]
        : typeof pnames === 'string'
          ? pnames
          : pname.value[0] || null

    if (firstPname) {
      const match =
        firstPname && firstPname.match ? firstPname.match(/^([^_]+)_/) : null
      if (match && match[1] === 'dangerLevel') {
        squareStore.openSquare()
        squareStore.openRisk()
      } else {
        squareStore.closeRisk()
      }
    }

    // 仅在有完整四角坐标和第一个 pname 时调用 addLayer3（与原行为一致且更安全）
    if (
      leftlat !== undefined &&
      leftlong !== undefined &&
      rightlat !== undefined &&
      rightlong !== undefined &&
      firstPname
    ) {
      addLayer3(leftlat, leftlong, rightlat, rightlong, firstPname)
      selectedIds.value = [131]
    } else {
      // 若坐标或 pname 不完整，仍保留原行为但不调用会导致错误的代码
      console.warn(
        'openLayers: incomplete coordinates or pname, skipped addLayer3',
      )
    }
  } catch (err) {
    console.error('openLayers 原始逻辑执行错误：', err)
  }

  // 新增：兼容处理后端返回的 processResp（不影响上面原有逻辑）
  try {
    if (!params) return

    const pr = params.processResp
    if (!pr) return

    console.log('openLayers: processResp detected', pr)

    // 兼容多种后端结构：geojson 对象 / geojson 字符串 / data 数组 / filename
    let maybeGeo = pr.geojson ?? pr.data ?? pr.geoJson ?? pr.result ?? pr

    // 若是数组且第一个元素存在，尝试取第一个（兼容旧接口）
    if (Array.isArray(maybeGeo)) {
      if (maybeGeo.length === 0) {
        maybeGeo = null
      } else {
        maybeGeo = maybeGeo[0]
      }
    }

    // 尝试直接解析并加载 GeoJSON
    // console.log('openLayers: maybeGeo', maybeGeo)
    // console.log(Array.isArray(maybeGeo))
    if (maybeGeo) {
      let geojsonObj = null
      if (typeof maybeGeo === 'string') {
        try {
          // console.log('maybeGeo是字符串')
          geojsonObj = JSON.parse(maybeGeo)
        } catch (e) {
          // 不是 JSON 字符串 -> 可能是文件名，后续回退处理
          geojsonObj = null
        }
      } else if (typeof maybeGeo === 'object') {
        geojsonObj = maybeGeo
      }

      if (geojsonObj) {
        console.log(geojsonObj)
        try {
          const dataSource = await Cesium.GeoJsonDataSource.load(geojsonObj, {
            clampToGround: true,
            strict: false,
          })
          viewer.value.dataSources.add(dataSource)

          // ← 插入：对新加载的数据调用符号化并打印结果
          console.log(
            'openLayers: applying susc symbology for processResp GeoJSON',
          )
          try {
            const applied = applySuscSymbology(dataSource)
            console.log(
              `openLayers: applySuscSymbology applied ${applied} / ${dataSource.entities.values.length}`,
            )
          } catch (err) {
            console.warn('openLayers: applySuscSymbology failed', err)
          }

          debugPrintDataSourceEntities(dataSource)
          viewer.value.flyTo(dataSource)
          ElMessage({ message: '后端返回的 GeoJSON 已加载', type: 'success' })
          return
        } catch (e) {
          console.error('将 processResp 的 geojson 加载到 Cesium 失败', e)
          // 继续尝试回退（filename）
        }
      }
    }

    // 回退：尝试从 processResp 或 uploadResp 中取 filename 再次请求后端处理
    const filename =
      pr.filename ||
      pr.savedFilename ||
      params.uploadResp?.savedFilename ||
      params.uploadResp?.filename
    const folder = pr.folder || params.uploadResp?.folder || ''

    if (filename) {
      console.log(
        'openLayers: fallback to loadShpFromBackend with filename',
        filename,
        folder,
      )
      await loadShpFromBackend({ filename, folder, endpoint: '/testapi/GBM' })
      return
    }

    console.warn('openLayers: processResp 未包含可解析的 geojson 或 filename')
  } catch (err) {
    console.error('openLayers 处理 processResp 时出错：', err)
    ElMessage({
      message: '加载图层时发生错误：' + (err?.message || err),
      type: 'error',
    })
  }
}
const area_avaflow = ref(null)
/** 山洪泥石流 GeoJSON 的 base path，由后端返回或按 area 默认 */
const avaflowOutputBase = ref('/ng/avaflow')
/** 热力图帧数，用于轮播循环 */
const avaflowFrameCount = ref(21)
const yjLayers = payload => {
  const area = typeof payload === 'string' ? payload : payload?.area
  const result = typeof payload === 'object' ? payload?.result : null
  area_avaflow.value = area
  if (result?.outputBase) avaflowOutputBase.value = result.outputBase
  else
    avaflowOutputBase.value =
      area === '波密县' ? '/ng/avaflow_bomi' : '/ng/avaflow'
  if (result?.frameCount) avaflowFrameCount.value = result.frameCount
  else avaflowFrameCount.value = 21
  if (area_avaflow.value == '巴宜区') {
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
  }
  if (area_avaflow.value == '波密县') {
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(95.415357, 29.865934, 5929),
      //相机的姿态
      orientation: {
        heading: Cesium.Math.toRadians(26.0), //朝向
        pitch: Cesium.Math.toRadians(-15.77), //俯仰
        // pitch: Cesium.Math.toRadians(-90), //俯仰
        roll: 0.0, //滚转
      },
      complete: () => {
        // 飞行完成后启动热力图
        startHeatmapCycle()
      },
    })
  }
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

const floodLayers = () => {
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(94.897921, 29.644425, 14336),
    //相机的姿态
    orientation: {
      heading: Cesium.Math.toRadians(20.66), //朝向
      pitch: Cesium.Math.toRadians(-28.15), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
    complete: () => {
      // 飞行完成后启动热力图
      startHeatmapCycle_flood()
    },
  })
  // loadHeatmap().catch(error => {
  //   console.log('加载热力图失败', error)
  // })
  // 初始化加载
  loadHeatmap_flood(1).catch(error => {
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

const foreCast = params => {
  let picture
  const rt = params.rt
  const time = params.time
  const longitude = params.lon
  const latitude = params.lat
  const pointId = params.pointId
  let integer = Math.round(rt)
  if (rt > 0 && rt < 24) {
    // alert("红色警报！")
    picture = 'warning_red'
  } else if (rt >= 24 && rt < 48) {
    // alert("橙色警报！")
    picture = 'warning_orange'
  } else if (rt >= 48 && rt < 72) {
    // alert("黄色警报!")
    picture = 'warning_yellow'
  } else if (rt >= 72 && rt < 96) {
    // alert("蓝色警报！")
    picture = 'warning_blue'
  } else {
    // alert("未有险情！")
    picture = 'safe'
  }
  // console.log(rt, time)
  // 相机飞到目标位置
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(95.222479, 30.067881, 10565),
    orientation: {
      heading: Cesium.Math.toRadians(250.0), // 朝向
      pitch: Cesium.Math.toRadians(-35.4), // 俯仰
      roll: 0.0, // 滚转
    },
    complete: () => {
      // 检测并移除已有实体
      const entityId = 'targetEntity'
      const existingEntity = viewer.value.entities.getById(entityId)

      if (existingEntity) {
        viewer.value.entities.remove(existingEntity)
      }
      // 飞行结束后添加实体

      const entity = viewer.value.entities.add({
        id: 'pointId',
        pointId: pointId, // 添加 pointId 属性
        name: '预警信息',
        position: Cesium.Cartesian3.fromDegrees(95.137369, 30.038497, 10556),
        billboard: {
          image: `CS/img/${picture}.png`,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: 32,
          height: 32,
        },
        description: `
    <div>
      <p>预计还有${integer}小时发生滑坡，于${time}进行预测！</p>
    </div>
  `,
      })

      // 点击 billboard 时弹出信息框
      const handler = new Cesium.ScreenSpaceEventHandler(
        viewer.value.scene.canvas,
      )
      handler.setInputAction(movement => {
        const picked = viewer.value.scene.pick(movement.position)
        // console.log(picked) // 调试输出
        // console.log('11212') // 调试输出
        if (Cesium.defined(picked) && picked.id) {
          const entity = picked.id
          viewer.value.selectedEntity = entity // 使用 Cesium 内置 InfoBox 弹窗
          // 记录当前点ID
          currentPointId.value = entity.pointId // 假设实体有pointId属性
          // 点击实体时显示图表
          console.log('点击了实体，点ID为:', entity.pointId)
          fetchDisplacementData(entity.pointId)
        }
        // axios
        //   .get('node/search_displ', {
        //     params: {
        //       pointId: pointId, // 确保 pointId 有值
        //     },
        //   })
        //   .then(response => {
        //     const data = response.data
        //     isChartVisible.value = false // 显示图表
        //     if (data.success) {
        //       // 数据处理成功
        //       console.log('获取到的位移数据:', data.data)
        //       // 这里可以处理返回的数据，比如绘制图表等
        //       // data.data 是一个数组，包含 { record_time: '2023-01-01 08:00:00', displacement: 10.2 } 这样的对象
        //       // 准备图表数据
        //       const chartData = data.data

        //       // 分离时间和位移数据
        //       const times = chartData.map(item => item.record_time)
        //       const displacements = chartData.map(item => item.displacement)

        //       // 初始化ECharts实例
        //       const chartDom = document.getElementById('displacement-chart')
        //       const myChart = echarts.init(chartDom)

        //       // 配置图表选项
        //       const option = {
        //         title: {
        //           text: '位移变化趋势图',
        //           left: 'center',
        //           textStyle: {
        //             fontSize: 8,
        //             fontWeight: 'regular',
        //           },
        //         },
        //         tooltip: {
        //           trigger: 'axis',
        //           formatter: function (params) {
        //             const date = new Date(params[0].data[0])
        //             const formattedDate = date.toLocaleString('zh-CN', {
        //               year: 'numeric',
        //               month: '2-digit',
        //               day: '2-digit',
        //               hour: '2-digit',
        //               minute: '2-digit',
        //               second: '2-digit',
        //             })
        //             return `时间: ${formattedDate}<br/>位移: ${params[0].data[1]} mm`
        //           },
        //         },
        //         grid: {
        //           left: '3%',
        //           right: '4%',
        //           bottom: '3%',
        //           containLabel: true,
        //         },
        //         xAxis: {
        //           type: 'time',
        //           name: '时间',
        //           nameLocation: 'middle',
        //           nameGap: 30,
        //           axisLabel: {
        //             formatter: function (value) {
        //               return new Date(value).toLocaleDateString('zh-CN', {
        //                 month: '2-digit',
        //                 day: '2-digit',
        //                 hour: '2-digit',
        //                 minute: '2-digit',
        //               })
        //             },
        //           },
        //         },
        //         yAxis: {
        //           type: 'value',
        //           name: '位移 (mm)',
        //           nameGap: 30,
        //           axisLabel: {
        //             formatter: '{value} mm',
        //           },
        //         },
        //         dataZoom: [
        //           {
        //             type: 'inside',
        //             start: 0,
        //             end: 100,
        //           },
        //           {
        //             type: 'slider',
        //             start: 0,
        //             end: 100,
        //           },
        //         ],
        //         series: [
        //           {
        //             name: '位移',
        //             type: 'line',
        //             data: chartData.map(item => [
        //               item.record_time,
        //               item.displacement,
        //             ]),
        //             smooth: true,
        //             symbol: 'circle',
        //             symbolSize: 6,
        //             itemStyle: {
        //               color: '#5470c6',
        //             },
        //             lineStyle: {
        //               width: 2,
        //             },
        //             areaStyle: {
        //               color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //                 { offset: 0, color: 'rgba(84, 112, 198, 0.6)' },
        //                 { offset: 1, color: 'rgba(84, 112, 198, 0.1)' },
        //               ]),
        //             },
        //           },
        //         ],
        //         width: '280px',
        //         height: '180px',
        //       }

        //       // 应用配置项并渲染图表
        //       myChart.setOption(option)

        //       // 响应式调整
        //       window.addEventListener('resize', function () {
        //         myChart.resize()
        //       })
        //       ElMessage({
        //         message: data.message,
        //         type: 'success',
        //       })
        //     } else {
        //       // 后端返回了错误信息
        //       ElMessage({
        //         message: data.message,
        //         type: data.type || 'warning',
        //       })
        //     }
        //   })
        //   .catch(error => {
        //     console.error('请求失败:', error)
        //     ElMessage({
        //       message: '请求数据失败',
        //       type: 'error',
        //     })
        //   })
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
  })
}
// 提取数据获取和图表渲染为单独函数
const fetchDisplacementData = pointId => {
  if (!pointId) {
    console.log('fetchDisplacementData: pointId is empty')
    return
  }

  axios
    .get('node/search_displ', {
      params: { pointId },
    })
    .then(response => {
      const data = response.data
      if (data.success) {
        console.log('获取到的位移数据:', data.data)
        renderDisplacementChart(data.data)
        chartVisible.value = true // 显示图表
        console.log('图表已显示')
        ElMessage({
          message: data.message,
          type: 'success',
        })
      } else {
        ElMessage({
          message: data.message,
          type: data.type || 'warning',
        })
      }
    })
    .catch(error => {
      console.error('请求失败:', error)
      ElMessage({
        message: '请求数据失败',
        type: 'error',
      })
    })
}
// 图表渲染函数
const renderDisplacementChart = chartData => {
  // 分离时间和位移数据
  const times = chartData.map(item => item.record_time)
  const displacements = chartData.map(item => item.displacement)

  // 初始化ECharts实例
  const chartDom = document.getElementById('displacement-chart')
  const myChart = echarts.init(chartDom)

  // 清空之前的图表
  myChart.clear()

  // 配置图表选项 - 优化尺寸和样式
  // const option = {
  //   title: {
  //     text: '位移变化趋势图',
  //     left: 'center',
  //     textStyle: {
  //       fontSize: 14,
  //       fontWeight: 'bold',
  //     },
  //     // 右上角关闭按钮
  //     right: 10,
  //     buttonGap: 10,
  //     itemGap: 15,
  //     textStyle: {
  //       fontSize: 14,
  //     },
  //   },
  //   tooltip: {
  //     trigger: 'axis',
  //     formatter: function (params) {
  //       const date = new Date(params[0].data[0])
  //       const formattedDate = date.toLocaleString('zh-CN', {
  //         year: 'numeric',
  //         month: '2-digit',
  //         day: '2-digit',
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         second: '2-digit',
  //       })
  //       return `时间: ${formattedDate}<br/>位移: ${params[0].data[1]} mm`
  //     },
  //     backgroundColor: 'rgba(255, 255, 255, 0.9)',
  //     borderColor: '#ddd',
  //     borderWidth: 1,
  //     textStyle: { color: '#333' },
  //     padding: 10,
  //   },
  //   grid: {
  //     left: '5%',
  //     right: '5%',
  //     bottom: '10%',
  //     top: '15%',
  //     containLabel: true,
  //   },
  //   xAxis: {
  //     type: 'time',
  //     name: '时间',
  //     nameLocation: 'middle',
  //     nameGap: 30,
  //     nameTextStyle: {
  //       fontSize: 12,
  //     },
  //     axisLabel: {
  //       formatter: function (value) {
  //         return new Date(value).toLocaleDateString('zh-CN', {
  //           month: '2-digit',
  //           day: '2-digit',
  //           hour: '2-digit',
  //           minute: '2-digit',
  //         })
  //       },
  //       rotate: 30, // 旋转避免文字重叠
  //       fontSize: 10,
  //     },
  //     axisLine: {
  //       lineStyle: {
  //         color: '#ccc',
  //       },
  //     },
  //   },
  //   yAxis: {
  //     type: 'value',
  //     name: '位移 (mm)',
  //     nameGap: 30,
  //     nameTextStyle: {
  //       fontSize: 12,
  //     },
  //     axisLabel: {
  //       formatter: '{value} mm',
  //       fontSize: 10,
  //     },
  //     axisLine: {
  //       lineStyle: {
  //         color: '#ccc',
  //       },
  //     },
  //     splitLine: {
  //       lineStyle: {
  //         color: '#f0f0f0',
  //       },
  //     },
  //   },
  //   dataZoom: [
  //     {
  //       type: 'inside',
  //       start: 0,
  //       end: 100,
  //       zoomLock: false,
  //     },
  //     {
  //       type: 'slider',
  //       start: 0,
  //       end: 100,
  //       height: 8,
  //       bottom: 5,
  //     },
  //   ],
  //   series: [
  //     {
  //       name: '位移',
  //       type: 'line',
  //       data: chartData.map(item => [item.record_time, item.displacement]),
  //       smooth: true,
  //       symbol: 'circle',
  //       symbolSize: 6,
  //       showSymbol: false, // 鼠标 hover 时才显示点
  //       emphasis: {
  //         showSymbol: true,
  //         symbolSize: 8,
  //       },
  //       itemStyle: {
  //         color: '#5470c6',
  //       },
  //       lineStyle: {
  //         width: 2,
  //       },
  //       areaStyle: {
  //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  //           { offset: 0, color: 'rgba(84, 112, 198, 0.6)' },
  //           { offset: 1, color: 'rgba(84, 112, 198, 0.1)' },
  //         ]),
  //       },
  //     },
  //   ],
  // }
  const option = {
    title: {
      text: '位移变化趋势图',
      left: 'center',
      textStyle: {
        fontSize: 18, // 【修改】标题字号从14→18，更大更醒目
        fontWeight: 'bold',
      },
      right: 10,
      buttonGap: 10,
      itemGap: 15,
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const date = new Date(params[0].data[0])
        const formattedDate = date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        return `时间: ${formattedDate}<br/>位移: ${params[0].data[1]} mm`
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#ddd',
      borderWidth: 1,
      textStyle: { color: '#333', fontSize: 14 }, // 【新增】tooltip文字放大
      padding: 12, // 【修改】内边距从10→12，tooltip更饱满
    },
    grid: {
      left: '3%', // 【修改】左边距从5%→3%，缩小边距扩大图表区域
      right: '3%', // 【修改】右边距从5%→3%
      bottom: '8%', // 【修改】下边距从10%→8%
      top: '10%', // 【修改】上边距从15%→10%
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      name: '时间',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        fontSize: 16, // 【修改】坐标轴名称字号从12→16
      },
      axisLabel: {
        formatter: function (value) {
          return new Date(value).toLocaleDateString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        },
        rotate: 30,
        fontSize: 14, // 【修改】坐标轴标签字号从10→14
      },
      axisLine: {
        lineStyle: {
          color: '#ccc',
          width: 1.5, // 【新增】坐标轴线条加宽
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '位移 (mm)',
      nameGap: 30,
      nameTextStyle: {
        fontSize: 16, // 【修改】坐标轴名称字号从12→16
      },
      axisLabel: {
        formatter: '{value} mm',
        fontSize: 14, // 【修改】坐标轴标签字号从10→14
      },
      axisLine: {
        lineStyle: {
          color: '#ccc',
          width: 1.5, // 【新增】坐标轴线条加宽
        },
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          width: 1.2, // 【新增】网格线加宽
        },
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        zoomLock: false,
      },
      {
        type: 'slider',
        start: 0,
        end: 100,
        height: 12, // 【修改】滑块高度从8→12，更易操作
        bottom: 5,
      },
    ],
    series: [
      {
        name: '位移',
        type: 'line',
        data: chartData.map(item => [item.record_time, item.displacement]),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8, // 【修改】标记点尺寸从6→8
        showSymbol: false,
        emphasis: {
          showSymbol: true,
          symbolSize: 12, // 【修改】hover时标记点从8→12
        },
        itemStyle: {
          color: '#5470c6',
        },
        lineStyle: {
          width: 3, // 【修改】趋势线宽度从2→3，更粗更显眼
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(84, 112, 198, 0.6)' },
            { offset: 1, color: 'rgba(84, 112, 198, 0.1)' },
          ]),
        },
      },
    ],
    // 【新增】强制图表适配容器尺寸（确保占满displacement-chart div）
    responsive: true,
    maintainAspectRatio: false,
  }
  watch(
    () => chartVisible,
    val => {
      if (val) {
        nextTick(() => {
          chart.resize()
        })
      }
    },
  )
  // 应用配置项并渲染图表
  // myChart.setOption(option)

  // 响应式调整
  // window.addEventListener('resize', function () {
  //   myChart.resize()
  // })

  // 添加点击空白处关闭图表的功能
  chartDom.onclick = function (e) {
    // 检查点击位置是否是关闭按钮区域
    const boundingRect = chartDom.getBoundingClientRect()
    const closeBtnArea = {
      x1: boundingRect.right - 30,
      x2: boundingRect.right,
      y1: boundingRect.top,
      y2: boundingRect.top + 30,
    }

    if (
      e.clientX >= closeBtnArea.x1 &&
      e.clientX <= closeBtnArea.x2 &&
      e.clientY >= closeBtnArea.y1 &&
      e.clientY <= closeBtnArea.y2
    ) {
      chartVisible.value = false
    }
  }
}
//获取数据
const addLayer1 = () => {
  //影像数据
  const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    url: '/native/geoserver/tif_0610/wms',
    layers: 'tif_0610:image_njbwf',
    parameters: {
      transparent: true,
      format: 'image/jpeg',
      // format: 'application/openlayers',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
    rectangle: Cesium.Rectangle.fromDegrees(
      // 限制显示范围
      94.730835,
      29.606009, // 西南经度, 西南纬度
      95.417971,
      29.959721, // 东北经度, 东北纬度
    ),
  })
  const layers = viewer.value.scene.imageryLayers
  layers.addImageryProvider(wmsImageryProvider)
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
    //相机的姿态
    orientation: {
      heading: Cesium.Math.toRadians(56.34), //朝向
      pitch: Cesium.Math.toRadians(-31), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
  })
}
const removeLayer1 = () => {
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)

    // console.log(layer.imageryProvider._imagerProvider._layers)
    if (
      layer.imageryProvider &&
      layer.imageryProvider.layers === 'tif_0610:image_njbwf'
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
    url: '/native/geoserver/tif_0610/wms',
    layers: 'tif_0610:tif2',
    // layers: 'ne:tif13',
    parameters: {
      transparent: true,
      format: 'image/png',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
    // 限制显示范围
    rectangle: Cesium.Rectangle.fromDegrees(
      94.730835,
      29.606009, // 西南经度, 西南纬度
      95.417971,
      29.959721, // 东北经度, 东北纬度
    ),
  })
  // console.log(viewer.value)
  const layers = viewer.value.scene.imageryLayers

  layers.addImageryProvider(wmsImageryProvider1)
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
    //相机的姿态
    orientation: {
      heading: Cesium.Math.toRadians(56.34), //朝向
      pitch: Cesium.Math.toRadians(-31), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
  })
}
//移除路网
const removeLayer2 = () => {
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)
    if (
      layer.imageryProvider &&
      layer.imageryProvider.layers === 'tif_0610:tif2'
    ) {
      imageryLayers.remove(layer)
      break // 移除后退出循环
    }
  }
}
const addLayer_dem = () => {
  //影像数据
  const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    url: '/native/geoserver/tif_0610/wms',
    layers: 'tif_0610:dem_Level_16',
    parameters: {
      transparent: false,
      format: 'image/jpeg',
      // format: 'application/openlayers',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
    // 限制显示范围
    rectangle: Cesium.Rectangle.fromDegrees(
      94.730835,
      29.606009, // 西南经度, 西南纬度
      95.417971,
      29.959721, // 东北经度, 东北纬度
    ),
  })
  const layers = viewer.value.scene.imageryLayers
  layers.addImageryProvider(wmsImageryProvider)
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
    //相机的姿态
    orientation: {
      heading: Cesium.Math.toRadians(56.34), //朝向
      pitch: Cesium.Math.toRadians(-31), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
  })
}
const removeLayer_dem = () => {
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)

    if (layer.imageryProvider.layers === 'tif_0610:dem_Level_16') {
      imageryLayers.remove(layer)
      break // 移除后退出循环
    }
  }
}
const addLayer_slope = () => {
  //影像数据
  const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    url: '/native/geoserver/tif_0610/wms',
    layers: 'tif_0610:slope_njbwf',
    parameters: {
      transparent: true,
      format: 'image/jpeg',
      // format: 'application/openlayers',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
    // 限制显示范围
    rectangle: Cesium.Rectangle.fromDegrees(
      94.730835,
      29.606009, // 西南经度, 西南纬度
      95.417971,
      29.959721, // 东北经度, 东北纬度
    ),
  })
  const layers = viewer.value.scene.imageryLayers
  layers.addImageryProvider(wmsImageryProvider)
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
    //相机的姿态
    orientation: {
      heading: Cesium.Math.toRadians(56.34), //朝向
      pitch: Cesium.Math.toRadians(-31), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
  })
}
const removeLayer_slope = () => {
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)
    if (
      layer.imageryProvider &&
      layer.imageryProvider.layers === 'tif_0610:slope_njbwf'
    ) {
      imageryLayers.remove(layer)
      break // 移除后退出循环
    }
  }
}
const addLayer_aspect = () => {
  //影像数据
  const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    url: '/native/geoserver/tif_0610/wms',
    layers: 'tif_0610:aspect_njbwf',
    parameters: {
      transparent: true,
      format: 'image/jpeg',
      // format: 'application/openlayers',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
    // 限制显示范围
    rectangle: Cesium.Rectangle.fromDegrees(
      94.730835,
      29.606009, // 西南经度, 西南纬度
      95.417971,
      29.959721, // 东北经度, 东北纬度
    ),
  })
  const layers = viewer.value.scene.imageryLayers
  layers.addImageryProvider(wmsImageryProvider)
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
    //相机的姿态
    orientation: {
      heading: Cesium.Math.toRadians(56.34), //朝向
      pitch: Cesium.Math.toRadians(-31), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
  })
}
const removeLayer_aspect = () => {
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)
    if (
      layer.imageryProvider &&
      layer.imageryProvider.layers === 'tif_0610:aspect_njbwf'
    ) {
      imageryLayers.remove(layer)
      break // 移除后退出循环
    }
  }
}
const addLayer_relief = () => {
  //影像数据
  const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    url: '/native/geoserver/tif_0610/wms',
    layers: 'tif_0610:relief_njbwf',
    parameters: {
      transparent: true,
      format: 'image/jpeg',
      // format: 'application/openlayers',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
    // 限制显示范围
    rectangle: Cesium.Rectangle.fromDegrees(
      94.730835,
      29.606009, // 西南经度, 西南纬度
      95.417971,
      29.959721, // 东北经度, 东北纬度
    ),
  })
  const layers = viewer.value.scene.imageryLayers
  layers.addImageryProvider(wmsImageryProvider)
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
    //相机的姿态
    orientation: {
      heading: Cesium.Math.toRadians(56.34), //朝向
      pitch: Cesium.Math.toRadians(-31), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
  })
}
const removeLayer_relief = () => {
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)
    if (
      layer.imageryProvider &&
      layer.imageryProvider.layers === 'tif_0610:relief_njbwf'
    ) {
      imageryLayers.remove(layer)
      break // 移除后退出循环
    }
  }
}

//添加河流line
const addLayer_river = () => {
  axios.get('/node/river').then(res => {
    const data = res.data
    // console.log(data)
    // 1. 创建数据源
    const river = new Cesium.CustomDataSource('rivers')
    viewer.value.dataSources.add(river)

    // 加载所有河流
    function loadAllRivers() {
      data.forEach(river => {
        addRiverToCesium(river)
      })
    }
    // 初始化
    loadAllRivers()
    // 设置相机位置
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
      //相机的姿态
      orientation: {
        heading: Cesium.Math.toRadians(56.34), //朝向
        pitch: Cesium.Math.toRadians(-31), //俯仰
        // pitch: Cesium.Math.toRadians(-90), //俯仰
        roll: 0.0, //滚转
      },
    })
  })
}
// function addRiverToCesium(riverData) {
//   const coordinates = parseWKBToCoordinates(riverData.geom)

//   // 转换为 Cesium 笛卡尔坐标
//   const positions = []
//   for (let i = 0; i < coordinates.length; i += 2) {
//     positions.push(
//       Cesium.Cartesian3.fromDegrees(coordinates[i], coordinates[i + 1])
//     )
//   }

//   // 创建实体
//   viewer.entities.add({
//     name: riverData.Name,
//     polyline: {
//       positions: positions,
//       width: parseFloat(riverData.width) || 5, // 使用数据中的宽度或默认值
//       material: new Cesium.PolylineGlowMaterialProperty({
//         glowPower: 0.2,
//         color: Cesium.Color.CORNFLOWERBLUE,
//       }),
//       clampToGround: true,
//     },
//     properties: {
//       code: riverData.code,
//       fclass: riverData.fclass,
//       id: riverData.id,
//     },
//   })
// }
// WKB 转经纬度坐标数组（示例函数）
// function parseWKBToCoordinates(wkbString) {
//   // 实际解析需要根据你的 WKB 格式实现
//   // 这里假设是 LineString 的 WKB 格式
//   const hex = wkbString.startsWith('0x') ? wkbString.substring(2) : wkbString
//   const bytes = new Uint8Array(hex.match(/../g).map(h => parseInt(h, 16)))
//   const view = new DataView(bytes.buffer)

//   // 跳过 WKB 头部（1字节字节序 + 4字节类型）
//   const offset = 5
//   const pointCount = view.getUint32(offset, true)

//   const coordinates = []
//   for (let i = 0; i < pointCount; i++) {
//     const x = view.getFloat64(offset + 4 + i * 16, true)
//     const y = view.getFloat64(offset + 12 + i * 16, true)
//     coordinates.push(x, y)
//   }

//   return coordinates
// }

function addRiverToCesium(riverData) {
  try {
    const lines = parseWKBMultiLineString(riverData.geom)
    const style = getRiverStyle(riverData.fclass)

    lines.forEach(line => {
      const positions = line.map(point =>
        Cesium.Cartesian3.fromDegrees(point[0], point[1], point[2] || 0),
      )

      const entity = viewer.value.entities.add({
        name: riverData.Name,
        polyline: {
          positions,
          width: style.width,
          material: new Cesium.PolylineGlowMaterialProperty({
            color: style.color,
            glowPower: 0.2,
          }),
          clampToGround: !line[0][2],
        },
        properties: {
          code: riverData.code,
          fclass: riverData.fclass,
          id: riverData.id,
        },
      })

      entity.riverTag = true
    })
  } catch (e) {
    console.error('解析失败:', {
      error: e,
      sampleData: riverData.geom?.substring(0, 50) + '...',
    })
  }
}
// function addRiverToCesium(riverData) {
//   try {
//     const geoJSON = parseWKBMultiLineString(riverData.geom)

//     lines.forEach.forEach(line => {
//       const positions = line.map(point =>
//         Cesium.Cartesian3.fromDegrees(point[0], point[1], point[2] || 0),
//       )
//       const style = getRiverStyle(riverData.fclass)
//       const entity = viewer.value.entities.add({
//         name: riverData.Name,
//         polyline: {
//           positions,
//           // width: parseFloat(riverData.width) || 5,
//           width: style.width,
//           material: new Cesium.PolylineGlowMaterialProperty({
//             color: style.color,
//             glowPower: 0.2,
//           }),
//           // width: getRiverStyle(riverData.fclass).width,
//           clampToGround: !line[0][2],
//         },
//         properties: {
//           code: riverData.code,
//           fclass: riverData.fclass,
//           id: riverData.id,
//         },
//       })
//       // 标记为河流图层
//       entity.riverTag = true
//     })
//   } catch (e) {
//     console.error('解析失败:', {
//       error: e,
//       sampleData: riverData.geom?.substring(0, 50) + '...',
//     })
//   }
// }
//样式优化
function getRiverStyle(fclass) {
  const styles = {
    river: { color: Cesium.Color.BLUE.withAlpha(0.8), width: 5 },
    canal: { color: Cesium.Color.SKYBLUE.withAlpha(0.8), width: 3 },
    stream: { color: Cesium.Color.NAVY.withAlpha(0.6), width: 2 },
  }
  return styles[fclass] || styles.river
}

//移除河流
const removeLayer_river = () => {
  const entities = viewer.value.entities.values
  for (let i = entities.length - 1; i >= 0; i--) {
    const e = entities[i]
    if (e.riverTag) {
      viewer.value.entities.remove(e)
    }
  }
}
//添加冰川面
const addLayer_glacier = () => {
  // console.log(data)
  axios.get('/node/glacier').then(res => {
    const data = res.data

    data.forEach(glacier => {
      try {
        const polygons = parseWKBMultiPolygon(glacier.geom) // ⬅️ 新函数（见下方）
        const style = getGlacierStyle(glacier.fclass)
        polygons.forEach(polygon => {
          // polygon 是二维数组，外环 + 若干内环
          const hierarchy = polygon.map(ring =>
            ring.map(point =>
              Cesium.Cartesian3.fromDegrees(point[0], point[1], point[2] || 0),
            ),
          )

          const entity = viewer.value.entities.add({
            name: glacier.Name || 'Glacier',
            polygon: {
              hierarchy: {
                positions: hierarchy[0], // 外环
                holes: hierarchy.slice(1).map(inner => ({ positions: inner })), // 内环
              },
              // material: Cesium.Color.ALICEBLUE.withAlpha(0.6),
              material: style,
              clampToGround: !polygon[0][0][2], // 判断有无Z坐标
            },
            properties: {
              code: glacier.code,
              id: glacier.id,
              fclass: glacier.fclass,
            },
          })

          // 添加 glacierTag 方便后续删除
          entity.glacierTag = true
        })
      } catch (e) {
        console.error('解析失败:', {
          error: e,
          sampleData: glacier.geom?.substring(0, 50) + '...',
        })
      }
    })
  })
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
    //相机的姿态
    orientation: {
      heading: Cesium.Math.toRadians(56.34), //朝向
      pitch: Cesium.Math.toRadians(-31), //俯仰
      // pitch: Cesium.Math.toRadians(-90), //俯仰
      roll: 0.0, //滚转
    },
  })
}
// MultiPolygon parsing moved to ../utils/wkb.js

function getGlacierStyle(fclass) {
  const styles = {
    glacier: Cesium.Color.ALICEBLUE.withAlpha(0.6),
    ice_cap: Cesium.Color.CYAN.withAlpha(0.5),
    mountain_glacier: Cesium.Color.LIGHTSKYBLUE.withAlpha(0.5),
    ice_sheet: Cesium.Color.LIGHTSTEELBLUE.withAlpha(0.5),
  }

  return styles[fclass] || Cesium.Color.ALICEBLUE.withAlpha(0.4)
}
//移除冰川面
const removeLayer_glacier = () => {
  const entities = viewer.value.entities.values
  for (let i = entities.length - 1; i >= 0; i--) {
    const e = entities[i]
    if (e.glacierTag) {
      viewer.value.entities.remove(e)
    }
  }
}
//加载全国气象站
const addLayer_weatherstation = () => {
  axios.get('/node/weatherstation').then(res => {
    const stations = res.data
    // console.log(data)
    // 1. 创建数据源
    const stationDataSource = new Cesium.CustomDataSource('weatherStations')
    viewer.value.dataSources.add(stationDataSource)
    // 2. 处理每个气象站
    stations.forEach(station => {
      // 解析几何坐标（WKT格式转经纬度）
      const [lon, lat] = parseWKB(station.geom) // 示例函数见下方
      // 创建实体
      const entity = stationDataSource.entities.add({
        name: station.NAME,
        position: Cesium.Cartesian3.fromDegrees(lon, lat),
        point: {
          pixelSize: 5,
          color: getColorByType(station.TYPES), // 按类型着色
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        label: {
          text: station.NAME,
          font: '10px sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -10),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      })
    })

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        109.543752,
        32.898714,
        10000000,
      ),
      //相机的姿态
      orientation: {
        heading: Cesium.Math.toRadians(0), //朝向
        pitch: Cesium.Math.toRadians(-90), //俯仰
        // pitch: Cesium.Math.toRadians(-90), //俯仰
        roll: 0.0, //滚转
      },
    })
  })

  // 3. 添加点击事件
  const layerwsClickHandler = new Cesium.ScreenSpaceEventHandler(
    viewer.value.scene.canvas,
  )
  layerwsClickHandler
    .setInputAction(handleLayerwsClick, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    .catch(error => {
      console.error('加载气象站数据失败:', error)
    })
}
const handleLayerwsClick = event => {
  // 获取点击位置
  const pickedFeature = viewer.value.scene.pick(event.position)
  // console.log(pickedFeature)
  const getProperty = prop => {
    return pickedFeature.id._properties[prop]?._value ?? '无数据'
  }
  // console.log(getProperty('_OBJECTID'))
  console.log(getProperty(''))
  const opts = {
    viewer,
    position: {
      _value: pickedFeature.id.position || pickedFeature.primitive.position,
    },
    title: getProperty('_county'),
    content: [
      { name: '名称', value: getProperty('_county') },
      { name: '高度', value: getProperty('_height') },
      { name: '服役时间', value: getProperty('_period') },
      { name: '雨量', value: getProperty('_rain') },
      { name: '日照', value: getProperty('_sunshine') },
      { name: '温度', value: getProperty('_temperature') + '°' },
      {
        name: '类型',
        value: getProperty('_type'),
      },
      {
        name: '描述',
        value: getProperty('comment'),
      },
    ],
  }

  // 关闭现有弹窗并打开新弹窗
  if (dialogs.value) {
    dialogs.value.windowClose()
  }
  dialogs.value = new Dialog(opts)
}
// 使用 utils/wkb.js 中的 parseWKB

// 使用 utils/wkb.js 中的 parseLineStringWKB / parseWKBMultiLineString

// 按气象站类型返回颜色
const getColorByType = type => {
  const colors = {
    基准站: Cesium.Color.RED,
    基本站: Cesium.Color.BLUE,
    一般站: Cesium.Color.GREEN,
    自动站: Cesium.Color.YELLOW,
  }
  return colors[type] || Cesium.Color.WHITE
}

//移除气象站
const removeAllStations = () => {
  // 1. 获取数据源
  const dataSource = viewer.value.dataSources.getByName('weatherStations')[0]

  // 2. 移除数据源（会自动移除所有关联实体）
  if (dataSource) {
    viewer.value.dataSources.remove(dataSource)
  }
  // 3. 清空实体引用
  // stationEntities.value = {}
}
const rightClickHandler = ref(null)
// 初始化右键事件处理器
const initRightClickHandler = () => {
  rightClickHandler.value = new Cesium.ScreenSpaceEventHandler(
    viewer.value.scene.canvas,
  )

  // 右键点击事件
  rightClickHandler.value.setInputAction(movement => {
    const pickedObject = viewer.value.scene.pick(movement.position)
    if (pickedObject?.id) {
      const entity = pickedObject.id
      // 检查 _id 是否包含 'dev'（不区分大小写）
      if (entity._id?.toLowerCase().includes('dev')) {
        showPopup(entity)
      }
    }
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
}

//加载地震动设备
// const addlayer_DZDdevice = () => {
//   Cesium.GeoJsonDataSource.load('/ng/DZD1.geojson')
//     .then(dataSource => {
//       layer17_guid.value = Cesium.createGuid() // 生成唯一 GUID
//       dataSource.guid = layer17_guid.value
//       viewer.value.dataSources.add(dataSource)

//       const entities = dataSource.entities.values

//       // 为每个实体绑定点击事件
//       entities.forEach(entity => {
//         entity.billboard = {
//           image: '/ng/position.png',
//           heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
//           verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//           width: 32,
//           height: 32,
//         }
//       })
//       // viewer.value.zoomTo(dataSource) // 自动飞行到数据范围
//       viewer.value.camera.flyTo({
//         destination: Cesium.Cartesian3.fromDegrees(
//           102.166189,
//           30.091431,
//           4321.57
//         ),
//         //相机的姿态
//         orientation: {
//           heading: Cesium.Math.toRadians(237.79), //朝向
//           pitch: Cesium.Math.toRadians(-12.97), //俯仰
//           // pitch: Cesium.Math.toRadians(-90), //俯仰
//           roll: 0.0, //滚转
//         },
//       })

//       viewer.value.selectedEntityChanged.addEventListener(selectedEntity => {
//         if (selectedEntity) {
//           // console.log('选中实体:', selectedEntity._id)
//           // 检查 _id 是否包含 'dev'
//           if (selectedEntity._id.includes('dev')) {
//             showPopup(selectedEntity)
//           }
//           // showPopup(selectedEntity)
//         } else {
//           hidePopup()
//         }
//       })

//       // showPopup(entity) // 调用 addEarthquakeDevices 的弹窗逻辑
//     })
//     .catch(error => {
//       // console.error('加载地震监测设备失败:', error)
//     })
// }

// 更新 showPopup 函数
// 修改 showPopupWithDetection，直接操作 popup 元素
const showPopupWithDetection = async (
  entity,
  records,
  detected,
  resultArray,
) => {
  const position = entity.position.getValue(Cesium.JulianDate.now())
  const cartographic = Cesium.Cartographic.fromCartesian(position)
  const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4)

  // 设置弹出窗口位置
  popup.style.left = `${viewer.value.canvas.clientWidth / 2 + 100}px`
  popup.style.top = `${viewer.value.canvas.clientHeight / 2}px`
  popup.style.display = 'block'

  // 更新弹出窗口内容，包含检测结果
  const status = detected ? '检测到泥石流风险！' : '未检测到泥石流'
  popup.innerHTML = `
    <p>经度: ${longitude} | 纬度: ${latitude}</p>
    <p>设备 ID: ${entity.properties.deviceid}</p>
    <p>检测结果: ${status}</p>
    <button id="showWaveformBtn">查看波形与检测点</button>
    <div id="chart" style="width: 480px; height: 360px;"></div>
  `

  // 添加按钮事件（显示波形）
  document.getElementById('showWaveformBtn').addEventListener('click', () => {
    showWaveform(records, resultArray)
  })

  // 初始化图表（复用原有逻辑）
  const chartDom = document.getElementById('chart')
  const myChart = echarts.init(chartDom)

  if (!records || records.length === 0) {
    myChart.setOption({ title: { text: '暂无数据' } })
    return
  }

  // 提取数据（假设字段为 channel_one_lp_x 等，如原有代码）
  const times = records.map(r => new Date(r.timestamp).toLocaleTimeString())
  const LpX = records.map(r => r.channel_one_lp_x || 0)
  const LpY = records.map(r => r.channel_one_lp_y || 0)
  const LpZ = records.map(r => r.channel_one_lp_z || 0)

  // 自动缩放 y 轴
  const allValues = [...LpX, ...LpY, ...LpZ]
  const min = Math.min(...allValues)
  const max = Math.max(...allValues)
  const padding = (max - min) * 0.15 || 0.001

  const option = {
    title: { text: `设备 ${entity.properties.deviceid} 地震动监测波形` },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['LpX', 'LpY', 'LpZ'],
      right: 10,
      selected: { LpX: true, LpY: false, LpZ: false },
    },
    xAxis: { type: 'category', data: times, axisLabel: { show: false } },
    yAxis: { type: 'value', min: min - padding, max: max + padding },
    grid: { left: 60, right: 30, top: 60, bottom: 30, containLabel: true },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        start: 0,
        end: times.length > 40 ? (40 / times.length) * 100 : 100,
      },
      { type: 'inside', xAxisIndex: 0 },
    ],
    series: [
      { name: 'LpX', type: 'line', data: LpX, symbol: 'circle', symbolSize: 5 },
      { name: 'LpY', type: 'line', data: LpY, symbol: 'circle', symbolSize: 5 },
      { name: 'LpZ', type: 'line', data: LpZ, symbol: 'circle', symbolSize: 5 },
    ],
  }

  myChart.setOption(option)
  myChart.on('legendSelectChanged', params => {
    const selected = params.selected
    const newSeries = []
    if (selected.LpX) newSeries.push({ name: 'LpX', type: 'line', data: LpX })
    if (selected.LpY) newSeries.push({ name: 'LpY', type: 'line', data: LpY })
    if (selected.LpZ) newSeries.push({ name: 'LpZ', type: 'line', data: LpZ })
    myChart.setOption({ series: newSeries })
  })
}

// 修改 showWaveform，标记检测点
const showWaveform = (records, resultArray) => {
  const chartDom = document.getElementById('chart')
  if (!chartDom) return

  const myChart = echarts.init(chartDom)
  const times = records.map(r => new Date(r.timestamp).toLocaleTimeString())
  const zData = records.map(r => r.channel_one_lp_z || 0) // 假设 Z 轴用于检测
  const markers = resultArray.map((val, idx) => (val === 1 ? zData[idx] : null))

  const option = {
    title: { text: '地震动波形与泥石流检测' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: times },
    yAxis: { type: 'value' },
    series: [
      { name: 'Z 轴', type: 'line', data: zData },
      {
        name: '检测点',
        type: 'scatter',
        data: markers,
        symbolSize: 8,
        color: 'red',
      },
    ],
  }
  myChart.setOption(option)
}

// `calculateDebrisFlow` 已提取到 `services/deviceService.js`

const addlayer_DZDdevice = async () => {
  try {
    const targetIds = [41109656, 41126040, 41158808]

    // ✅ 获取后端最新位置数据（这里假设接口返回所有记录）
    const allDevices = await fetchAllDevices()

    // 筛选目标设备的最新位置
    const devices = targetIds
      .map(id => {
        const records = allDevices.filter(d => d.deviceid === id)
        if (records.length === 0) return null
        // 按 timestamp 倒序排序，取最新记录
        records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        return records[0]
      })
      .filter(Boolean)

    // ✅ 移除旧数据源，避免重复加载
    const old = viewer.value.dataSources._dataSources.find(
      d => d.guid === layer17_guid.value,
    )
    if (old) viewer.value.dataSources.remove(old)

    // ✅ 新建数据源
    layer17_guid.value = Cesium.createGuid()
    const dataSource = new Cesium.CustomDataSource('DZDdevice')
    dataSource.guid = layer17_guid.value
    viewer.value.dataSources.add(dataSource)

    // ✅ 添加实体点
    devices.forEach(device => {
      dataSource.entities.add({
        id: `dev_${device.deviceid}`,
        position: Cesium.Cartesian3.fromDegrees(
          device.gps_longitude,
          device.gps_latitude,
          device.gps_high || 0,
        ),
        billboard: {
          image: '/ng/position.png',
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: 32,
          height: 32,
        },
        properties: {
          deviceid: device.deviceid,
        },
      })
    })

    // ✅ 飞行到设备区域
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(102.093, 30.045, 5000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-70),
      },
    })

    viewer.value.selectedEntityChanged.addEventListener(async entity => {
      if (entity && entity.id.startsWith('dev_')) {
        const deviceId = Number(entity.properties.deviceid)
        const records = (await fetchLatestRecords(deviceId)).reverse()

        // 提取地震动数据（假设使用 Z 轴；可改为 X/Y 或组合）
        const seismicData = records.map(r => r.channel_one_lp_z || 0) // 如果字段不同，调整

        // 运行泥石流检测
        const { detected, resultArray } = calculateDebrisFlow(seismicData)

        // 显示弹窗，包含检测结果
        showPopupWithDetection(entity, records, detected, resultArray)
      } else {
        hidePopup()
      }
    })

    // // ✅ 点击弹窗
    // viewer.value.selectedEntityChanged.addEventListener(async (entity) => {
    //   if (entity && entity.id.startsWith('dev_')) {
    //     const deviceId = Number(entity.properties.deviceid)
    //     // 获取该设备最新 100 条数据
    //     const res = await axios.get(`http://localhost:3001/device/latest/${deviceId}`)
    //     const records = res.data.reverse() // 反转为正序绘图
    //     showPopup(entity, records)
    //   } else {
    //     hidePopup()
    //   }
    // })
  } catch (err) {
    console.error('加载地震监测设备失败:', err)
  }
}

const removeLayer_DZDdevice = () => {
  removeLayerDZDdevice(viewer.value, layer17_guid)
}

const popup = document.createElement('div')
popup.style.position = 'absolute'
popup.style.backgroundColor = 'white'
popup.style.border = '1px solid #ccc'
popup.style.padding = '10px'
popup.style.zIndex = '1000'
popup.style.display = 'none'
document.body.appendChild(popup)

const showPopup = async entity => {
  const position = entity.position.getValue(Cesium.JulianDate.now())
  const cartographic = Cesium.Cartographic.fromCartesian(position)
  const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4)

  // 设置弹出窗口位置
  popup.style.left = `${viewer.value.canvas.clientWidth / 2 + 100}px`
  popup.style.top = `${viewer.value.canvas.clientHeight / 2}px`
  popup.style.display = 'block'

  // 更新弹出窗口内容（预留图表容器）
  popup.innerHTML = `
    <p>经度: ${longitude} | 纬度: ${latitude}</p>
    <div id="chart" style="width: 480px; height: 360px;"></div>
  `

  const chartDom = document.getElementById('chart')
  const myChart = echarts.init(chartDom)

  try {
    // ✅ 向后端请求该设备的最新 100 条记录
    const deviceId = entity.properties.deviceid
    const res = await axios.get(
      `http://localhost:3001/device/latest/${deviceId}`,
    )
    const records = res.data.reverse() // 最新 -> 时间正序

    if (!records || records.length === 0) {
      myChart.setOption({
        title: { text: '暂无数据' },
      })
      return
    }

    // ✅ 提取各通道数据
    const times = records.map(r => new Date(r.timestamp).toLocaleTimeString())
    const LpX = records.map(r => r.channel_one_lp_x)
    const LpY = records.map(r => r.channel_one_lp_y)
    const LpZ = records.map(r => r.channel_one_lp_z)

    // ✅ 自动缩放 y 轴范围
    const allValues = [...LpX, ...LpY, ...LpZ]
    const min = Math.min(...allValues)
    const max = Math.max(...allValues)
    const padding = (max - min) * 0.15 || 0.001

    // ✅ 配置折线图
    const option = {
      title: {
        text: `设备 ${deviceId} 地震动监测波形`,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['LpX', 'LpY', 'LpZ'],
        right: 10,
        selected: {
          LpX: true,
          LpY: false,
          LpZ: false,
        },
      },
      xAxis: {
        type: 'category',
        data: times,
        axisLabel: { show: false },
      },
      yAxis: {
        type: 'value',
        min: min - padding,
        max: max + padding,
      },
      grid: {
        left: 60,
        right: 30,
        top: 60,
        bottom: 30,
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 0,
          end: times.length > 40 ? (40 / times.length) * 100 : 100,
        },
        { type: 'inside', xAxisIndex: 0 },
      ],
      series: [
        {
          name: 'LpX',
          type: 'line',
          data: LpX,
          symbol: 'circle',
          symbolSize: 5,
        },
        {
          name: 'LpY',
          type: 'line',
          data: LpY,
          symbol: 'circle',
          symbolSize: 5,
        },
        {
          name: 'LpZ',
          type: 'line',
          data: LpZ,
          symbol: 'circle',
          symbolSize: 5,
        },
      ],
    }

    // 初始化图表
    myChart.setOption(option)
    myChart.on('legendSelectChanged', params => {
      const selected = params.selected
      const newSeries = []
      if (selected.LpX) newSeries.push({ name: 'LpX', type: 'line', data: LpX })
      if (selected.LpY) newSeries.push({ name: 'LpY', type: 'line', data: LpY })
      if (selected.LpZ) newSeries.push({ name: 'LpZ', type: 'line', data: LpZ })
      myChart.setOption({ series: newSeries })
    })
  } catch (err) {
    console.error('获取设备数据失败:', err)
    myChart.setOption({ title: { text: '加载失败' } })
  }
}

// 隐藏弹出窗口

const hidePopup = () => {
  popup.style.display = 'none'
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
// const imageCache = new Set()
// const addLayer3 = (p1, p2, p3, p4, p5) => {
//   const imgUrl = `/ng/${p5}`
//   if (imageCache.has(imgUrl)) {
//     console.log('图像已加载过，跳过')
//     return
//   }
//   imageCache.add(imgUrl)
//   extractString(p5)
//   hd.value = p5
//   const img = new Image()
//   img.onload = () => {
//     const rectangle = Cesium.Rectangle.fromDegrees(p2, p1, p4, p3)
//     viewer.value.entities.add({
//       rectangle: {
//         coordinates: rectangle,
//         material: new Cesium.ImageMaterialProperty({
//           image: imgUrl,
//           repeat: new Cesium.Cartesian2(1.0, 1.0),
//         }),
//       },
//     })
//     viewer.value.camera.flyTo({
//       destination: Cesium.Cartesian3.fromDegrees(p2, p1 + 0.1, 50000),
//     })
//   }
//   img.onerror = () => {
//     console.error('图像加载失败:', imgUrl)
//     imageCache.delete(imgUrl) // 下次重新尝试加载
//   }

//   img.src = imgUrl
// }
const addLayer4 = () => {
  Cesium.GeoJsonDataSource.load('/ng/hpps2.geojson')
    .then(function (dataSource) {
      // 存储数据源引用以便后续操作
      // layer4DataSource = dataSource
      layer4_guid.value = Cesium.createGuid()
      dataSource.guid = layer4_guid.value

      // 添加数据源到视图
      viewer.value.dataSources.add(dataSource)

      // 统一设置实体样式
      const entities = dataSource.entities.values
      entities.forEach(entity => {
        entity.billboard = {
          image: '/ng/position.png',
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: 32,
          height: 32,
        }
      })

      // 缩放到数据范围
      viewer.value.zoomTo(dataSource)

      // 设置点击事件处理器
      const layer4ClickHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.value.scene.canvas,
      )
      layer4ClickHandler.setInputAction(
        handleLayer4Click,
        Cesium.ScreenSpaceEventType.RIGHT_CLICK,
      )
    })
    .catch(error => {
      console.error('加载GeoJSON失败:', error)
    })
}
// 点击事件处理函数
const handleLayer4Click = movement => {
  const pickedFeature = viewer.value.scene.pick(movement.position)
  if (!pickedFeature || !pickedFeature.id) return

  // 安全获取属性值
  const getProperty = prop => {
    return pickedFeature.id._properties[prop]?._value ?? '无数据'
  }

  // 准备弹窗内容
  const opts = {
    viewer,
    position: {
      _value: pickedFeature.id.position || pickedFeature.primitive.position,
    },
    title: getProperty('_OBJECTID'),
    content: [
      { name: '名称', value: getProperty('_名称') },
      { name: '经度', value: getProperty('_经度') },
      { name: '纬度', value: getProperty('_纬度') },
      { name: '断层密度', value: getProperty('_断层密度_km_km2_') + ' km/km²' },
      { name: '隆升速率', value: getProperty('_隆升速率_mm_y_') + ' mm/y' },
      { name: '坡度', value: getProperty('_坡度___') + '°' },
      {
        name: '河流下切速率',
        value: getProperty('_河流下切速率_mm_y_') + ' mm/y',
      },
      {
        name: '坡体后端汇水面积',
        value: getProperty('_坡体后端汇水面积_m2_') + ' m²',
      },
      { name: '高差', value: getProperty('_高差_m_') + ' m' },
      { name: '潜在滑坡体积规模', value: getProperty('_潜在滑坡体积规模') },
    ],
  }

  // 关闭现有弹窗并打开新弹窗
  if (dialogs.value) {
    dialogs.value.windowClose()
  }
  dialogs.value = new Dialog(opts)
}
//移除滑坡判识矢量点
const removeLayer4 = () => {
  const dataSources = viewer.value.dataSources._dataSources
  // console.log(dataSources)

  const dataSourceToRemove = dataSources.find(
    data => data.guid == layer4_guid.value,
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
  Cesium.GeoJsonDataSource.load('/ng/ghpzhl.geojson').then(
    function (dataSource) {
      layer5_guid.value = Cesium.createGuid()
      dataSource.guid = layer5_guid.value
      viewer.value.dataSources.add(dataSource)
      const entities = dataSource.entities.values
      for (var i = 0; i < entities.length; i++) {
        const entity = entities[i]

        const name = entity.name
        entity.billboard.heightReference =
          Cesium.HeightReference.CLAMP_TO_GROUND
        entity.billboard.image = '/ng/position.png'
      }
      viewer.value.zoomTo(dataSource)
      // 设置点击事件处理器
      const layer5ClickHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.value.scene.canvas,
      )
      layer5ClickHandler.setInputAction(
        handleLayer5Click,
        Cesium.ScreenSpaceEventType.RIGHT_CLICK,
      )
    },
  )
}
const handleLayer5Click = movement => {
  const pickedFeature = viewer.value.scene.pick(movement.position)
  if (!pickedFeature || !pickedFeature.id) return

  // 安全获取属性值
  const getProperty = prop => {
    return pickedFeature.id._properties[prop]?._value ?? '无数据'
  }

  // console.log(pickedFeature)
  // console.log(getProperty('_OBJECTID'))
  // 准备弹窗内容
  const opts = {
    viewer,
    position: {
      _value: pickedFeature.id.position || pickedFeature.primitive.position,
    },
    title: getProperty('_OBJECTID'),
    content: [
      { name: '名称', value: getProperty('_遥感解译编号') },
      { name: '经度', value: getProperty('_X') },
      { name: '纬度', value: getProperty('_Y') },
      { name: '干_支流', value: getProperty('_干_支流') },
      { name: '高差', value: getProperty('_高差_m') + ' m' },
      { name: '主滑方向', value: getProperty('_主滑方向__') + '°' },
      {
        name: '滑坡全长',
        value: getProperty('_滑坡全长_m') + ' m',
      },
      {
        name: '滑坡体面积',
        value: getProperty('滑坡体面积_m2') + ' m²',
      },
      { name: '滑坡体体积', value: getProperty('_滑坡体体积_m3') + ' m³' },
    ],
  }

  // 关闭现有弹窗并打开新弹窗
  if (dialogs.value) {
    dialogs.value.windowClose()
  }
  dialogs.value = new Dialog(opts)
}
//移除古滑坡灾害链
const removeLayer5 = () => {
  const dataSources = viewer.value.dataSources._dataSources
  // console.log(dataSources)

  const dataSourceToRemove = dataSources.find(
    data => data.guid == layer5_guid.value,
  )
  if (dataSourceToRemove) {
    viewer.value.dataSources.remove(dataSourceToRemove)
    // console.log('Data source removed successfully.')
  } else {
    // console.log('No data source to remove.')
  }
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
      const model = await createFloodLayer(data, viewer.value)
      floodPrimitive.value = model
      return
    }
    // if (!viewer.value.scene.primitives.getById('flood-layer')) {
    //   await createFloodLayer(data, viewer.value)
    // }
    // 2. 后续数据更新纹理
    else {
      if (floodPrimitive.value) {
        await updateTexture(data, viewer.value, floodPrimitive.value)
      } else {
        const model = await createFloodLayer(data, viewer.value)
        floodPrimitive.value = model
      }
    }
  } catch (error) {
    console.error('纹理处理失败:', error)
    emitter.emit('cesium-error', {
      type: 'TEXTURE_UPDATE_FAILED',
      detail: error,
    })
  }
})

let currentHeatmapIndex = 1 // 当前加载的文件索引
let heatmapPrimitive = null // 当前热力图对象
let intervalId = null // 定时器ID
//加载avaflow
async function loadHeatmap(index) {
  try {
    if (heatmapPrimitive) {
      try {
        heatmapPrimitive.destroy()
      } catch (e) {}
      heatmapPrimitive = null
    }
    const base =
      avaflowOutputBase.value ||
      (area_avaflow.value === '波密县' ? '/ng/avaflow_bomi' : '/ng/avaflow')
    heatmapPrimitive = await svcLoadHeatmap(viewer.value, index, base)
  } catch (error) {
    console.error(`加载output${index}.geojson失败:`, error)
  }
}
//加载flood
async function loadHeatmap_flood(index) {
  try {
    if (heatmapPrimitive) {
      try {
        heatmapPrimitive.destroy()
      } catch (e) {}
      heatmapPrimitive = null
    }
    heatmapPrimitive = await svcLoadHeatmapFlood(viewer.value, index)
  } catch (error) {
    console.error(`加载flood_output${index}.geojson失败:`, error)
  }
}
// 启动定时任务-avaflow
function startHeatmapCycle() {
  const maxFrame = avaflowFrameCount.value || 21
  intervalId = setInterval(() => {
    currentHeatmapIndex = (currentHeatmapIndex % maxFrame) + 1
    loadHeatmap(currentHeatmapIndex)
  }, 1000)
}
// 启动定时任务-flood
function startHeatmapCycle_flood() {
  intervalId = setInterval(() => {
    currentHeatmapIndex = (currentHeatmapIndex % 21) + 1 // 1-41循环
    loadHeatmap_flood(currentHeatmapIndex)
  }, 1000) // 0.5秒间隔
}
// 停止定时任务
function stopHeatmapCycle() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

/** 移除热力图图元（供清空结果时调用） */
function clearHeatmapPrimitive() {
  stopHeatmapCycle()
  if (heatmapPrimitive) {
    try {
      heatmapPrimitive.destroy()
    } catch (e) {
      console.warn('clearHeatmapPrimitive destroy:', e)
    }
    heatmapPrimitive = null
  }
}

/** 移除洪水图层（使用创建时保存的图元引用） */
function removeFloodPrimitive() {
  if (!viewer.value) return
  if (floodPrimitive.value) {
    try {
      viewer.value.scene.primitives.remove(floodPrimitive.value)
    } catch (e) {
      console.warn('removeFloodPrimitive:', e)
    }
    floodPrimitive.value = null
  }
}

/** 移除所有由模拟添加的 dataSources */
function removeAllSimulationDataSources() {
  if (!viewer.value) return
  const collection = viewer.value.dataSources
  const list = []
  for (let i = 0; i < collection.length; i++) {
    list.push(collection.get(i))
  }
  list.forEach(ds => collection.remove(ds))
}

// console.log(viewer.value)

//框选放大
const magnify = () => {
  //   setTimeout(() => {
  //     enableBoxZoom(viewer.value).activate()
  //   }, 5000)

  // isDrawing.value = true
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas)

  // 第一阶段：等待第一次点击
  handler.setInputAction(firstClick => {
    const startPosition = firstClick.position

    // 移除第一次点击监听
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 实时更新框选区域
    const moveHandler = movement => {
      updateBoxStyle(startPosition, movement.endPosition)
    }

    // 第二阶段：处理确认点击
    const confirmHandler = secondClick => {
      // isDrawing.value = false
      handler.destroy()

      // 计算目标区域
      const endPosition = secondClick.position
      const rectangle = calculateRectangle(startPosition, endPosition)

      // 执行视角切换
      flyToRectangle(rectangle)
    }

    handler.setInputAction(moveHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction(
      confirmHandler,
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    )
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  const calculateRectangle = (start, end) => {
    const [startCart, endCart] = [start, end].map(pos =>
      viewer.value.scene.camera.pickEllipsoid(
        pos,
        viewer.value.scene.globe.ellipsoid,
      ),
    )

    if (!startCart || !endCart) return null

    const startCarto = Cesium.Cartographic.fromCartesian(startCart)
    const endCarto = Cesium.Cartographic.fromCartesian(endCart)
    return Cesium.Rectangle.fromRadians(
      Math.min(startCarto.longitude, endCarto.longitude),
      Math.min(startCarto.latitude, endCarto.latitude),
      Math.max(startCarto.longitude, endCarto.longitude),
      Math.max(startCarto.latitude, endCarto.latitude),
    )
  }

  const flyToRectangle = rectangle => {
    viewer.value.camera.flyTo({
      destination: rectangle,
      orientation: {
        heading: viewer.value.camera.heading,
        pitch: viewer.value.camera.pitch,
        roll: viewer.value.camera.roll,
      },
      duration: 1,
    })
  }

  const updateBoxStyle = (start, end) => {
    const canvas = viewer.value.scene.canvas
    const rect = canvas.getBoundingClientRect()

    const normalize = pos => ({
      x: pos.x - rect.left,
      y: pos.y - rect.top,
    })

    const s = normalize(start)
    const e = normalize(end)

    boxStyle.value = {
      left: `${Math.min(s.x, e.x)}px`,
      top: `${Math.min(s.y, e.y)}px`,
      width: `${Math.abs(e.x - s.x)}px`,
      height: `${Math.abs(e.y - s.y)}px`,
      display: 'block',
      position: 'absolute',
      border: '2px solid red',
      backgroundColor: 'rgba(255,0,0,0.2)',
      pointerEvents: 'none',
    }
  }

  return {
    //   isDrawing,
    boxStyle,
    //   startBoxSelect,
  }
}
//框选缩小
const shrink = () => {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas)
  // isDrawing.value = true // 启用绘制状态

  handler.setInputAction(firstClick => {
    const startPosition = firstClick.position
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 移动监听（实时更新选框）
    const moveHandler = movement => {
      updateBoxStyle(startPosition, movement.endPosition)
    }
    const updateBoxStyle = (start, end) => {
      const canvas = viewer.value.scene.canvas
      const rect = canvas.getBoundingClientRect()

      const normalize = pos => ({
        x: pos.x - rect.left,
        y: pos.y - rect.top,
      })

      const s = normalize(start)
      const e = normalize(end)

      boxStyle.value = {
        left: `${Math.min(s.x, e.x)}px`,
        top: `${Math.min(s.y, e.y)}px`,
        width: `${Math.abs(e.x - s.x)}px`,
        height: `${Math.abs(e.y - s.y)}px`,
        display: 'block',
        position: 'absolute',
        border: '2px solid red',
        backgroundColor: 'rgba(255,0,0,0.2)',
        pointerEvents: 'none',
      }
    }
    // 确认点击处理
    const confirmHandler = secondClick => {
      // isDrawing.value = false
      handler.destroy()

      const rectangle = calculateShrinkArea(startPosition, secondClick.position)

      if (rectangle) {
        flyToShrinkView(rectangle)
      }
    }

    handler.setInputAction(moveHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction(
      confirmHandler,
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    )
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

// 专用缩小版计算函数
// 缩小专用区域计算
const calculateShrinkArea = (startPos, endPos) => {
  const [startCart, endCart] = [startPos, endPos].map(pos =>
    viewer.value.scene.camera.pickEllipsoid(
      pos,
      viewer.value.scene.globe.ellipsoid,
    ),
  )

  if (!startCart || !endCart) return null

  // 获取地理坐标
  const toCartographic = cartesian =>
    Cesium.Cartographic.fromCartesian(cartesian)
  const [startCarto, endCarto] = [startCart, endCart].map(toCartographic)

  // 计算原始边界
  const west = Math.min(startCarto.longitude, endCarto.longitude)
  const east = Math.max(startCarto.longitude, endCarto.longitude)
  const south = Math.min(startCarto.latitude, endCarto.latitude)
  const north = Math.max(startCarto.latitude, endCarto.latitude)

  // 扩展区域（实现缩小效果）
  const EXPAND_FACTOR = 1.5 // 扩展系数，值越大缩小越明显
  const centerLon = (west + east) / 2
  const centerLat = (south + north) / 2
  const newWidth = (east - west) * EXPAND_FACTOR
  const newHeight = (north - south) * EXPAND_FACTOR

  // 创建安全矩形（防止越界）
  return Cesium.Rectangle.fromRadians(
    Math.max(centerLon - newWidth / 2, -Math.PI),
    Math.max(centerLat - newHeight / 2, -Cesium.Math.PI_OVER_TWO),
    Math.min(centerLon + newWidth / 2, Math.PI),
    Math.min(centerLat + newHeight / 2, Cesium.Math.PI_OVER_TWO),
  )
}

// 专用缩小飞行逻辑
const flyToShrinkView = rectangle => {
  const camera = viewer.value.camera
  const currentHeight = camera.positionCartographic.height

  viewer.value.camera.flyTo({
    destination: rectangle,
    orientation: {
      heading: camera.heading,
      pitch: -Math.atan(currentHeight / Cesium.Ellipsoid.WGS84.maximumRadius),
      roll: camera.roll,
    },
    duration: 2,
    easingFunction: Cesium.EasingFunction.CUBIC_OUT,
    pitchAdjustHeight: currentHeight * 2, // 提升视角高度
  })
}

const measure = () => {
  // new MeasureDistance(viewer.value).activate()
  md.value = new MeasureDistance(viewer.value)
  if (md.value) {
    md.value.activate()
  }
}

const polygon = () => {
  const measureManager = new MeasureManager(viewer.value)
  measureManager.measurePolygon()
}

const position = () => {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas)
  handler.setInputAction(function (event) {
    let ray = viewer.value.camera.getPickRay(event.position)
    let cartesian = viewer.value.scene.globe.pick(ray, viewer.value.scene)
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian)
    let lng = Cesium.Math.toDegrees(cartographic.longitude) // 经度
    let lat = Cesium.Math.toDegrees(cartographic.latitude) // 纬度
    let alt = cartographic.height // 高度
    let coordinate = {
      longitude: Number(lng.toFixed(6)),
      latitude: Number(lat.toFixed(6)),
      altitude: Number(alt.toFixed(2)),
    }
    console.log(coordinate)
    viewer.value.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        Number(lng.toFixed(6)),
        Number(lat.toFixed(6)),
      ),
      label: {
        text:
          '坐标：' +
          lng.toFixed(6) +
          ',' +
          lat.toFixed(6) +
          ',' +
          alt.toFixed(6), // 显示坐标
        font: '20px Helvetica',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        pixelOffset: new Cesium.Cartesian2(0, -0.5),
      },
      billboard: {
        image: '/ng/position.png',
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 确保始终可见
        width: 48,
        height: 48,
      },
    })
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

const position_point = ref(null)

//添加灾害点属性
const addattribute = () => {
  let position = null
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas)
  handler.setInputAction(e => {
    //转换坐标到三维场景
    const ray = viewer.value.camera.getPickRay(e.position)

    position = viewer.value.scene.globe.pick(ray, viewer.value.scene)
    const cart = Cesium.Cartographic.fromCartesian(position)
    //经纬度
    const longitude = Cesium.Math.toDegrees(cart.longitude)
    const latitude = Cesium.Math.toDegrees(cart.latitude)
    form.longitude = longitude
    form.latitude = latitude

    // console.log(cartographic)
    position_point.value = position
    ;((dialogVisible_disaster.value = true),
      // 自动移除事件监听（单次点击模式）
      handler.destroy())
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
}
const submit_disaster = () => {
  // console.log(form)
  dialogVisible_disaster.value = false
  viewer.value.entities.add({
    position: position_point.value,
    billboard: {
      image: '/ng/position.png',
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY, // 确保始终可见
      width: 48,
      height: 48,
    },
  })
  // 1. 构建GeoJSON格式的空间数据
  const geoData = {
    type: 'Point',
    coordinates: [form.longitude, form.latitude],
  }
  axios
    .post('/node/point', {
      name: form.name,
      dcmd: form.dcmd,
      lssl: form.lssl,
      slope: form.slope,
      hlxqsl: form.hlxqsl,
      pthhsmj: form.pthhsmj,
      elevation: form.elevation,
      scale: form.scale,
      geom: geoData,
    })
    .then(res => {
      // console.log(res)
      if (res.data.code === 200) {
        console.log('提交成功')
      }
    })
    .catch(err => {
      console.log(err)
    })
}

//灾害点查询(打开属性框)
const searchdisaster = () => {
  dialogVisible_searchdisaster.value = true
}

//位置查询
const locationsearch = () => {
  dialogVisible_searchdisaster.value = false
  axios
    .get('/node/point', {
      params: {
        name: form_disastersearch.location,
      },
    })
    .then(res => {
      tableData.value = [] // 清空表格数据
      const data = res.data
      // console.log(typeof data)
      // console.log(typeof data[0].lng)
      if (data.length > 0) {
        data.forEach(item => {
          viewer.value.entities.add({
            position: Cesium.Cartesian3.fromDegrees(item.lng, item.lat),
            billboard: {
              image: '/ng/position.png',
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY, // 确保始终可见
              width: 48,
              height: 48,
            },
          })
          // 2. 格式化表格数据
          tableData.value.push({
            name: item.name || '--', // 处理空值
            dcmd: item.dcmd || '--',
            lssl: item.lssl || '--',
            slope: item.slope ? `${item.slope}°` : '--', // 添加单位
            hlxqsl: item.hlxqsl || '--',
            pthhsmj: item.pthhsmj ? `${item.pthhsmj} m²` : '--',
            elevation: item.elevation ? `${item.elevation} 米` : '--',
            scale: item.scale || '--',
          })
        })
      } else {
        console.log('未查询到数据')
      }
      viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          data[0].lng,
          data[0].lat,
          50000,
        ),
      })
    })
    .catch(err => {
      console.log(err)
    })
  setTimeout(() => {
    dialogVisible_checkattribute.value = true
  }, 2000)
}
const search_dis_location = () => {
  console.log(tableData.value)
}
const locationsearchqxz = () => {
  dialogVisible_searchdisaster.value = false
  axios
    .get('/node/point_qxz', {
      params: {
        z_name: form_disastersearch.location,
      },
    })
    .then(res => {
      tableData_qxz.value = [] // 清空表格数据
      const data = res.data
      // console.log(typeof data[0].lng)
      if (data.length > 0) {
        data.forEach(item => {
          viewer.value.entities.add({
            position: Cesium.Cartesian3.fromDegrees(item.lng, item.lat),
            billboard: {
              image: '/ng/position.png',
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY, // 确保始终可见
              width: 48,
              height: 48,
            },
          })
          // 2. 格式化表格数据
          tableData_qxz.value.push({
            z_name: item.z_name || '--', // 处理空值
            jyl: item.jyl || '--',
            wind: item.wind || '--',
          })
        })
      } else {
        console.log('未查询到数据')
      }
      viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          data[0].lng,
          data[0].lat,
          50000,
        ),
      })
    })
    .catch(err => {
      console.log(err)
    })
  setTimeout(() => {
    dialogVisible_checkqxz.value = true
  }, 2000)
}
//属性查询
const attributesearch_disaster = () => {
  dialogVisible_searchdisaster.value = false
  // console.log(form_disastersearch.attribute, form_disastersearch.attributevalue)
  const name = form_disastersearch.attribute
  const value = form_disastersearch.attributevalue
  axios
    .get('/node/point/attribute', {
      params: {
        attribute_name: name,
        attribute_value: value,
      },
    })
    .then(res => {
      tableData.value = []
      const data = res.data.data
      // console.log(data)
      // console.log(typeof data)
      if (data.length > 0) {
        data.forEach(item => {
          viewer.value.entities.add({
            position: Cesium.Cartesian3.fromDegrees(item.lng, item.lat),
            billboard: {
              image: '/ng/position.png',
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY, // 确保始终可见
              width: 48,
              height: 48,
            },
          })
          // 2. 格式化表格数据
          tableData.value.push({
            name: item.name || '--', // 处理空值
            dcmd: item.dcmd || '--',
            lssl: item.lssl || '--',
            slope: item.slope ? `${item.slope}°` : '--', // 添加单位
            hlxqsl: item.hlxqsl || '--',
            pthhsmj: item.pthhsmj ? `${item.pthhsmj} m²` : '--',
            elevation: item.elevation ? `${item.elevation} 米` : '--',
            scale: item.scale || '--',
          })
        })
      } else {
        console.log('未查询到数据')
      }
      console.log(data[0])
      viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          data[0].lng,
          data[0].lat,
          50000,
        ),
      })
    })
    .catch(err => {
      console.log(err)
    })
  setTimeout(() => {
    dialogVisible_checkattribute.value = true
  }, 2000)
}
const attributesearch_qxz = () => {
  dialogVisible_searchdisaster.value = false
  // console.log(form_disastersearch.attribute, form_disastersearch.attributevalue)
  const name = form_disastersearch.attribute
  const value = form_disastersearch.attributevalue
  axios
    .get('/node/point/attribute_qxz', {
      params: {
        attribute_name: name,
        attribute_value: value,
      },
    })
    .then(res => {
      tableData_qxz.value = []
      const data = res.data.data
      // console.log(data)
      // console.log(typeof data)
      if (data.length > 0) {
        data.forEach(item => {
          viewer.value.entities.add({
            position: Cesium.Cartesian3.fromDegrees(item.lng, item.lat),
            billboard: {
              image: '/ng/position.png',
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY, // 确保始终可见
              width: 48,
              height: 48,
            },
          })
          // 2. 格式化表格数据
          tableData_qxz.value.push({
            z_name: item.z_name || '--', // 处理空值
            jyl: item.jyl || '--',
            wind: item.wind || '--',
          })
        })
      } else {
        console.log('未查询到数据')
      }
      console.log(data[0])
      viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          data[0].lng,
          data[0].lat,
          50000,
        ),
      })
    })
    .catch(err => {
      console.log(err)
    })
  setTimeout(() => {
    dialogVisible_checkqxz.value = true
  }, 2000)
}

/** 一键清除所有灾害模拟结果（实体、图元、数据源、影像图层等），无需硬刷新 */
const cleanentity = () => {
  if (!viewer.value) return
  // 1. 停止动态图层定时器
  if (entityInterval.value) {
    clearInterval(entityInterval.value)
    entityInterval.value = null
  }
  // 2. 移除热力图及定时轮播
  clearHeatmapPrimitive()
  // 3. 移除洪水图层
  removeFloodPrimitive()
  // 4. 移除各类影像/矢量图层（DEM、坡向、河流、冰川、站点、泥石流设备等）
  removeLayer1()
  removeLayer2()
  removeLayer4()
  removeLayer5()
  removeLayer_dem()
  removeLayer_slope()
  removeLayer_aspect()
  removeLayer_relief()
  removeLayer_river()
  removeLayer_glacier()
  removeAllStations()
  removeLayer_DZDdevice()
  // 5. 移除所有模拟相关的 DataSource（如 GeoJSON、站点等）
  removeAllSimulationDataSources()
  // 6. 清空所有实体（图标、矩形、标记等）
  viewer.value.entities.removeAll()
  // 7. 关闭风险/方框等 UI 状态
  squareStore.closeSquare()
  squareStore.closeRisk()
}

function handleSeismicResult(payload) {
  try {
    const detected = payload?.detected
    const lon = Number(payload?.lon) || 97.5
    const lat = Number(payload?.lat) || 30.5
    const imageUrl = detected ? '/CS/img/warning_red.png' : '/CS/img/safe.png' // 统一大小写路径
    viewer.value.entities.add({
      id: `seismic_${Date.now()}`,
      position: Cesium.Cartesian3.fromDegrees(lon, lat),
      billboard: {
        image: imageUrl,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        width: 48,
        height: 48,
      },
      properties: {
        raw: payload.info,
      },
    })

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat-0.05, 10000), // 高度可按需调整
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-35.0),
        roll: 0.0,
      },
      complete: () => {
        // 飞行完成后选中实体以触发 InfoBox（若需要）
        try {
          viewer.value.selectedEntity = entity
        } catch (e) {}
      },
    })

    if (detected) {
      ElMessage({ message: '检测到异常，已在地图标记', type: 'warning' })
    } else {
      ElMessage({ message: '未检测到异常', type: 'success' })
    }
  } catch (e) {
    console.error('handleSeismicResult error', e)
  }
}
</script>
<style lang="scss" scoped>
.flex-container {
  width: 300px;
  display: flex;
  gap: 30px;
}

.map-home-overlay {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
.map-home-overlay > * {
  pointer-events: auto;
}

.map-home-overlay .control {
  position: relative;
  font-family:
    'Source Han Sans', 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
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

:deep(.el-table__header) {
  width: 350px !important;
}

:deep(.el-table__body) {
  width: 350px !important;
}

.map-home-overlay .control .control_specific {
  display: flex;
  /* height: 450px; */

  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  top: 85px;
  right: 350px;
  align-items: center;
}

.map-home-overlay .control .control_specific img {
  transform: scale(0.7);
}

.cesium-infoBox {
  right: 450px !important;
  top: 460px !important;
  // height: 100px !important;
}

.chart-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 1200px;
  height: 700px;
  background: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 20px;
  box-sizing: border-box;
  z-index: 100;
}

.show-chart {
  display: block;
}

.hide-chart {
  display: none;
}
.show_displ {
  display: none;
}

.chart-close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
}
</style>
