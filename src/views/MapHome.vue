<template>
  <div class="map-home-overlay">
    <zh-jc></zh-jc>
    <le-th
      ref="leThRef"
      @openLayers="openLayers"
      @timeSelected="handleTimeSelected"
      @yjLayers="yjLayers"
      @betaLayers="betaLayers"
      @proLayers="proLayers"
      @terrainDrawStart="startTerrainDraw"
      @terrainDrawCancel="cancelTerrainDraw"
      @floodLayers="floodLayers"
      @floodLayersTest="floodLayersTest"
      @forecast="foreCast"
      @seismicResult="handleSeismicResult"
      @fullRiskAnalysis="handleFullRiskAnalysis"
      @bedding_parallel="showBeddingFos"
      @bedding_inverted="showBeddingFos"
      @bedding_wedget="showBeddingFos"
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
                  title="左键查询灾害点，中键查询气象站"
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
                  <el-option label="地点" value="地点"></el-option
                  ><el-option label="坡度" value="slope"></el-option
                  ><el-option label="规模" value="scale"></el-option></el-select
                ><el-input
                  v-model="form_disastersearch.attributevalue"
                  :placeholder="attributeValueHint()"
                ></el-input
                ><el-button @click="attributesearch_disaster" v-on:click.middle="attributesearch_qxz" title="左键查询灾害点，中键查询气象站">查询</el-button>
              </div>
            </el-form-item>
            <el-button style="margin-left: 284px" @click="clearSearchCondition">清空查询条件</el-button>
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
  <el-drawer v-model="drawer" direction="ttb" resizable size="60%">
    <div>
      <el-button type="primary" @click="drawer_seismic('data')"
        >地震仪原数据</el-button
      >
      <el-button v-if="!seismicIsDL" type="primary" @click="drawer_seismic('ratio')"
        >比率</el-button
      >
      <el-button v-if="!seismicIsDL" type="primary" @click="drawer_seismic('result')"
        >结果</el-button
      >
    </div>
    <div id="seismic-chart" style="width: 100%; height: 500px"></div>
  </el-drawer>
  <!-- 地形因子图层图例（随图层勾选自动显示） -->
  <div class="map-legend" v-if="legendLayers.length">
    <div class="legend-item" v-for="lg in legendLayers" :key="lg.id">
      <div class="legend-title">{{ lg.title }}<span class="legend-unit" v-if="lg.unit">（{{ lg.unit }}）</span></div>
      <div class="legend-bar" :style="{ background: lg.gradient }"></div>
      <div class="legend-ticks"><span v-for="t in lg.ticks" :key="t">{{ t }}</span></div>
    </div>
  </div>
  <!-- 气象站近 7 天气象数据表格弹窗（点击气象站时显示，3 小时间隔） -->
  <el-dialog
    v-model="weatherTableVisible"
    :title="weatherTableTitle"
    width="860px"
    top="8vh"
    append-to-body
    @opened="onWeatherDialogOpened"
  >
    <!-- [新增] 近 7 天气象趋势折线图（ECharts：温度/湿度/风速/降水） -->
    <div ref="weatherChartRef" style="width: 100%; height: 280px; margin-bottom: 10px"></div>
    <el-table
      :data="weatherTableRows"
      v-loading="weatherTableLoading"
      max-height="300"
      size="small"
      stripe
      empty-text="暂无历史数据（等待采集器回填）"
    >
      <el-table-column prop="time_label" label="时间" min-width="130" />
      <el-table-column prop="temperature_c" label="温度(℃)" min-width="105" />
      <el-table-column prop="wind_speed_ms" label="风速(m/s)" min-width="110" />
      <el-table-column prop="humidity_pct" label="湿度(%)" min-width="100" />
      <el-table-column prop="precipitation_mm" label="降水(mm)" min-width="105" />
    </el-table>
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
import { ElMessageBox } from 'element-plus'
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
// 气象站近 7 天数据表格弹窗（新增）
const weatherTableVisible = ref(false)
const weatherTableLoading = ref(false)
const weatherTableTitle = ref('近 7 天气象数据')
const weatherTableRows = ref([])
const weatherChartRef = ref(null) // [新增] 近 7 天趋势图容器
let weatherChartInstance = null // [新增] ECharts 实例
const dujiangImagePopup = ref(null) // 堵江点图片弹窗
const dujiangClickHandler = ref(null) // 堵江点点击事件处理器
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

const chartVisible = ref(false) // displacement chart visibility
let displacementChart = null
let forecastHandler = null
let forecastEntityId = null
const currentPointId = ref(null) // current clicked point id
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
const drawer = ref(false)
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
// [新增] 测量工具状态：'' | 'distance' | 'area'；实例复用以避免事件/内存泄漏
const activeMeasureTool = ref('')
let areaMeasureInstance = null
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
  const lon = Number(form_setPosition.longitude)
  const lat = Number(form_setPosition.latitude)
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
    ElMessage.error('请输入有效的经纬度数字')
    return
  }
  if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
    ElMessage.error('经纬度超出范围（经度 -180~180，纬度 -90~90）')
    return
  }
  handleClickChange('popover_setPosition', false)

  // 2. 正确设置相机位置 + 姿态（替换直接赋值的代码）
  const safeHeight = Number(form_setPosition.height)
  viewer.value.camera.setView({
    // 位置：经纬度转笛卡尔坐标
    destination: Cesium.Cartesian3.fromDegrees(
      lon,
      lat,
      Number.isFinite(safeHeight) && safeHeight > 0 ? safeHeight : 30000,
    ),
    // 姿态：heading/pitch/roll（弧度值）
    orientation: {
      heading: Cesium.Math.toRadians(2.02), // 航向角
      pitch: Cesium.Math.toRadians(-48.92), // 俯仰角
      roll: Cesium.Math.toRadians(360.0), // 翻滚角
    },
  })
  ElMessage({
    message: `视角已定位到 ${lon.toFixed(5)}, ${lat.toFixed(5)}`,
    type: 'success',
  })
}
onMounted(() => {
  // viewer 由 MapLayout 初始化并通过 provide/inject 注入，此处无需再初始化 Cesium
  // 「冰川灾害链」模块已移除：不再初始化入口按钮（逻辑仍保留在 initChainButton/runChainCase 中）
  // initChainButton()
})

//选中与未选中图层
const checkedLayers = (ps, node) => {
  console.log('[checkedLayers] ps:', ps, 'node:', node)
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
    case 114:
      removeLayer_building()
      break
    case 115:
      removeLayer_population()
      break
    case 116:
      removeLayer_tianditu_road()
      break
    case 621:
      removeLayer_621()
      break
    case 622:
      removeLayer_622()
      break
    case 623:
      removeLayer_623()
      break
    case 711:
      removeLayer_HP_pop_Vulnerability()
      break
    case 712:
      removeLayer_NSL_pop_Vulnerability()
      break
    case 713:
      removeLayer_SH_pop_Vulnerability()
      break
    case 721:
      removeLayer_HP_Danger()
      break
    case 722:
      removeLayer_NSL_Danger()
      break
    case 723:
      removeLayer_SH_Danger()
      break
    case 731:
      removeLayer_domestic_build()
      break
    case 732:
      removeLayer_linzhi_pop()
      break
    case 733:
      removeLayer_motuo_traffic()
      break
    case 741:
      removeLayer_build_one()
      break
    case 742:
      removeLayer_build_two()
      break
    case 743:
      removeLayer_build_three()
      break
    case 744:
      removeLayer_build_masonry()
      break
    case 745:
      removeLayer_building_risk()
      break
    case 751:
      removeLayer_roadrisk_h()
      break
    case 752:
      removeLayer_roadrisk_m()
      break
    case 753:
      removeLayer_roadrisk_s()
      break
    case 754:
      removeLayer_road_risk()
      break
    case 761:
      removeLayer_bridge_d()
      break
    case 762:
      removeLayer_bridge_s()
      break
    case 763:
      removeLayer_bridge()
      break
    case 77:
      removeLayer_pop_risk()
      break
    case 781:
      removeLayer_linzi_hazard()
      break
    case 782:
      removeLayer_yigong_hazard()
      break
    default:
      break
  }

  // 取消勾选时从已处理集合中移除该节点ID，确保重新勾选时可再次加载
  if (node !== null) {
    processedPValues.value = processedPValues.value.filter(id => id !== node)
  }

  // 计算差集：当前循环中新增的 p 值
  const newPValues = ps.filter(p => !processedPValues.value.includes(p))
  // console.log(ps)
  if (ps.length === 0) {
    console.warn('[checkedLayers] ps 为空，即将清除所有图层，node:', node)
    squareStore.closeSquare()
    processedPValues.value = []
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
    // 停止动态图层定时器
    if (entityInterval.value) {
      clearInterval(entityInterval.value)
      entityInterval.value = null
    }
    // 只移除树图层管理的实体，避免误伤模型结果
    ;['2','3','4','5','6','7','h0','h1','h2','h3','h4','h5','h6','h7'].forEach(id => {
      if (viewer.value.entities.getById(id)) {
        viewer.value.entities.removeById(id)
      }
    })
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
          break
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
        case 114:
          addLayer_building()
          break
        case 115:
          addLayer_population()
          break
        case 116:
          addLayer_tianditu_road()
          break
        case 621:
          addLayer_621()
          break
        case 622:
          addLayer_622()
          break
        case 623:
          addLayer_623()
          break
        case 711:
          addLayer_HP_pop_Vulnerability()
          break
        case 712:
          addLayer_NSL_pop_Vulnerability()
          break
        case 713:
          addLayer_SH_pop_Vulnerability()
          break
        case 721:
          addLayer_HP_Danger()
          break
        case 722:
          addLayer_NSL_Danger()
          break
        case 723:
          addLayer_SH_Danger()
          break
        case 731:
          addLayer_domestic_build()
          break
        case 732:
          addLayer_linzhi_pop()
          break
        case 733:
          addLayer_motuo_traffic()
          break
        case 741:
          addLayer_build_one()
          break
        case 742:
          addLayer_build_two()
          break
        case 743:
          addLayer_build_three()
          break
        case 744:
          addLayer_build_masonry()
          break
        case 745:
          addLayer_building_risk()
          break
        case 751:
          addLayer_roadrisk_h()
          break
        case 752:
          addLayer_roadrisk_m()
          break
        case 753:
          addLayer_roadrisk_s()
          break
        case 754:
          addLayer_road_risk()
          break
        case 761:
          addLayer_bridge_d()
          break
        case 762:
          addLayer_bridge_s()
          break
        case 763:
          addLayer_bridge()
          break
        case 77:
          addLayer_pop_risk()
          break
        case 781:
          addLayer_linzi_hazard()
          break
        case 782:
          addLayer_yigong_hazard()
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
      if (p === 612) {
        addLayer4()
      }
      if (p !== 612) {
        removeLayer4()
      }
      if (p === 613) {
        addLayer5()
      }
      if (p !== 613) {
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

  // 新增：兼容处理后端返回的 processResp
  if (params) {
    const pr = params.processResp
    if (pr) {
      try {
        console.log('openLayers: processResp detected', pr)

        let maybeGeo = pr.geojson ?? pr.data ?? pr.geoJson ?? pr.result ?? pr
        if (Array.isArray(maybeGeo)) {
          maybeGeo = maybeGeo.length > 0 ? maybeGeo[0] : null
        }

        if (maybeGeo) {
          let geojsonObj = null
          if (typeof maybeGeo === 'string') {
            try { geojsonObj = JSON.parse(maybeGeo) } catch (e) { geojsonObj = null }
          } else if (typeof maybeGeo === 'object') {
            geojsonObj = maybeGeo
          }

          if (geojsonObj) {
            const dataSource = await Cesium.GeoJsonDataSource.load(geojsonObj, {
              clampToGround: true, strict: false,
            })
            viewer.value.dataSources.add(dataSource)
            try { applySuscSymbology(dataSource) } catch (err) {}
            viewer.value.flyTo(dataSource)
            ElMessage({ message: '后端返回的 GeoJSON 已加载', type: 'success' })
            return
          }
        }

        const filename = pr.filename || pr.savedFilename || params.uploadResp?.savedFilename || params.uploadResp?.filename
        const folder = pr.folder || params.uploadResp?.folder || ''
        if (filename) {
          await loadShpFromBackend({ filename, folder, endpoint: '/testapi/GBM' })
          return
        }
        console.warn('openLayers: processResp 未包含可解析的 geojson 或 filename')
      } catch (err) {
        console.error('openLayers 处理 processResp 时出错：', err)
      }
    }
  }

  // 泥石流启动物源计算模型结果：仅最后一帧
  try {
    if (params?.sdpResult) {
      // 兼容单对象（当前）与 frames 数组（旧版，取最后一帧）
      const sdp = params.sdpResult
      const frame = (Array.isArray(sdp.frames) && sdp.frames.length)
        ? sdp.frames[sdp.frames.length - 1]
        : sdp
      if (!frame || !frame.imageBase64) {
        console.warn('[SDP] 无有效结果')
        return
      }
      const { imageBase64, minLng, minLat, maxLng, maxLat } = frame
      console.log('openLayers: SDP result', { minLng, minLat, maxLng, maxLat })

      const imLayers = viewer.value.scene.imageryLayers
      for (let i = imLayers.length - 1; i >= 0; i--) {
        const layer = imLayers.get(i)
        if (layer.sdpResultTag) imLayers.remove(layer)
      }

      const img = new Image()
      img.onload = () => {
        // 用 Canvas 去掉白色背景（NoData 区域变透明）
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const d = imageData.data
        for (let i = 0; i < d.length; i += 4) {
          if (d[i] > 250 && d[i+1] > 250 && d[i+2] > 250) d[i+3] = 0
        }
        ctx.putImageData(imageData, 0, 0)
        const cleanUrl = canvas.toDataURL('image/png')

        const provider = new Cesium.SingleTileImageryProvider({
          url: cleanUrl,
          rectangle: Cesium.Rectangle.fromDegrees(minLng, minLat, maxLng, maxLat),
          tileWidth: img.width,
          tileHeight: img.height,
        })
        const addedLayer = imLayers.addImageryProvider(provider)
        addedLayer.sdpResultTag = true
        viewer.value.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees((minLng + maxLng) / 2, (minLat + maxLat) / 2, 7299),
          orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 },
        })
        // 清除旧图例并绘制 ZMAX 图例
        if (sdpLegendEl) { sdpLegendEl.remove(); sdpLegendEl = null }
        const legendColors = [
          { color: '#f5f0b0', label: '10–25 m', desc: '极少物源' },
          { color: '#f0c030', label: '25–50 m', desc: '少量物源' },
          { color: '#f08020', label: '50–80 m', desc: '中等物源' },
          { color: '#d03010', label: '80–110 m', desc: '大量物源' },
          { color: '#5c1010', label: '110–131 m', desc: '巨量物源' },
        ]
        sdpLegendEl = document.createElement('div')
        sdpLegendEl.style.cssText = 'position:fixed;bottom:30px;left:30px;z-index:999;background:rgba(0,0,0,0.8);border:1px solid #38e1ff;border-radius:6px;padding:10px 14px;color:#fff;font-size:12px;'
        sdpLegendEl.innerHTML = `
          <div style="font-weight:600;margin-bottom:6px;color:#38e1ff">ZMAX 物源深度</div>
          ${legendColors.map(c => `
            <div style="display:flex;align-items:center;gap:8px;margin:3px 0">
              <span style="width:20px;height:14px;background:${c.color};border-radius:2px;flex-shrink:0"></span>
              <span style="min-width:70px">${c.label}</span>
              <span style="color:#999;font-size:11px">${c.desc}</span>
            </div>
          `).join('')}
          <div id="sdp-legend-close" style="position:absolute;top:2px;right:8px;cursor:pointer;color:#999">×</div>
        `
        document.body.appendChild(sdpLegendEl)
        sdpLegendEl.querySelector('#sdp-legend-close').onclick = () => { sdpLegendEl.remove(); sdpLegendEl = null }

        ElMessage({ message: '泥石流起动区深度结果已加载', type: 'success' })
      }
      img.onerror = () => {
        console.error('SDP PNG 加载失败')
        ElMessage({ message: 'PNG 图片加载失败', type: 'error' })
      }
      img.src = `data:image/png;base64,${imageBase64}`
    }
  } catch (e) {
    console.error('加载 SDP 结果失败:', e)
  }
}
function showSdpResultLayer(sdpResult) {
  const sdp = (sdpResult && sdpResult.frames && sdpResult.frames.length) ? sdpResult.frames[sdpResult.frames.length - 1] : sdpResult
  if (!sdp || !sdp.imageBase64) { console.warn('[SDP] 无有效结果'); return }
  const { imageBase64, minLng, minLat, maxLng, maxLat } = sdp
  const imLayers = viewer.value.scene.imageryLayers
  for (let i = imLayers.length - 1; i >= 0; i--) { const l = imLayers.get(i); if (l.sdpResultTag) imLayers.remove(l) }
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width; canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    for (let i = 0; i < d.length; i += 4) { if (d[i] > 250 && d[i+1] > 250 && d[i+2] > 250) d[i+3] = 0 }
    ctx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0)
    const cleanUrl = canvas.toDataURL('image/png')
    const provider = new Cesium.SingleTileImageryProvider({ url: cleanUrl, rectangle: Cesium.Rectangle.fromDegrees(minLng, minLat, maxLng, maxLat), tileWidth: img.width, tileHeight: img.height })
    const addedLayer = imLayers.addImageryProvider(provider)
    addedLayer.sdpResultTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees((minLng + maxLng) / 2, (minLat + maxLat) / 2, 7299) })
    if (sdpLegendEl) { sdpLegendEl.remove(); sdpLegendEl = null }
    const legendColors = [ { color: '#f5f0b0', label: '10–25 m', desc: '极少物源' }, { color: '#f0c030', label: '25–50 m', desc: '少量物源' }, { color: '#f08020', label: '50–80 m', desc: '中等物源' }, { color: '#d03010', label: '80–110 m', desc: '大量物源' }, { color: '#5c1010', label: '110–131 m', desc: '巨量物源' } ]
    sdpLegendEl = document.createElement('div')
    sdpLegendEl.style.cssText = 'position:fixed;bottom:30px;left:30px;z-index:999;background:rgba(0,0,0,0.8);border:1px solid #38e1ff;border-radius:6px;padding:10px 14px;color:#fff;font-size:12px;'
    sdpLegendEl.innerHTML = `<div style="font-weight:600;margin-bottom:6px;color:#38e1ff">ZMAX 物源深度</div>` + legendColors.map(c => `<div style="display:flex;align-items:center;gap:8px;margin:3px 0"><span style="width:20px;height:14px;background:${c.color};border-radius:2px;flex-shrink:0"></span><span style="min-width:70px">${c.label}</span><span style="color:#999;font-size:11px">${c.desc}</span></div>`).join('')
    document.body.appendChild(sdpLegendEl)
    ElMessage({ message: '泥石流起动区深度结果已加载', type: 'success' })
  }
  img.onerror = () => { console.error('SDP PNG 加载失败'); ElMessage({ message: 'PNG 图片加载失败', type: 'error' }) }
  img.src = `data:image/png;base64,${imageBase64}`
}

let fosChartDom = null
let fosChartExpr = null
function showBeddingFos(payload) {
  const mode = payload?.mode || '冰岩崩启动'
  const result = payload?.result || {}
  const t = Array.isArray(result.t) ? result.t : []
  const fos = Array.isArray(result.fos) ? result.fos : []
  if (!t.length || !fos.length) { ElMessage({ message: '冰岩崩结果无效', type: 'warning' }); return }

  if (fosChartDom) { fosChartDom.remove(); fosChartDom = null }
  if (fosChartExpr) { fosChartExpr.dispose(); fosChartExpr = null }

  const isSeconds = t.length > 0 && Math.max(...t) > 100000
  const x = t.map(s => (isSeconds ? +(Number(s) / 86400).toFixed(2) : Number(s)))

  const el = document.createElement('div')
  el.style.cssText = 'position:fixed;bottom:30px;right:30px;z-index:999;width:560px;height:380px;background:rgba(0,0,0,0.85);border:1px solid #38e1ff;border-radius:6px;padding:8px 10px;color:#fff;'
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;font-weight:600;margin-bottom:4px;color:#38e1ff">
      <span>${mode} · 安全系数 FoS 随时间变化</span>
      <span id="bedding-fos-close" style="cursor:pointer;color:#999">&times;</span>
    </div>
    <div id="bedding-fos-chart" style="width:100%;height:330px"></div>
  `
  document.body.appendChild(el)
  fosChartDom = el
  const chart = echarts.init(el.querySelector('#bedding-fos-chart'))
  fosChartExpr = chart
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 55, right: 20, top: 24, bottom: 40 },
    xAxis: { type: 'category', name: isSeconds ? '时间 (天)' : '时间', data: x.map(v => String(v)) },
    yAxis: { type: 'value', name: 'FoS', scale: true },
    series: [{
      name: 'FoS', type: 'line', data: fos, symbol: 'none', smooth: true, lineStyle: { width: 2 },
      markLine: {
        symbol: 'none', silent: true,
        data: [{ yAxis: 1, name: '临界 FoS=1', lineStyle: { color: 'red', type: 'dashed' } }],
        label: { formatter: '临界 FoS=1', color: '#ff8080', position: 'insideEndTop' },
      },
    }],
  })
  el.querySelector('#bedding-fos-close').onclick = () => {
    el.remove(); fosChartDom = null
    if (fosChartExpr) { fosChartExpr.dispose(); fosChartExpr = null }
  }
  // 在地图上放置冰岩崩边坡标记（按最小 FoS 红/绿 + 标注）
  const loc = payload?.location || {}
  const lon = Number(loc.longitude) || 95.0020
  const lat = Number(loc.latitude) || 30.2354
  const minFos = fos.length ? Math.min(...fos) : 1
  const unstable = minFos < 1
  const col = unstable ? Cesium.Color.RED : Cesium.Color.LIME
  const oldE = viewer.value.entities.getById('bedding_avainit')
  if (oldE) viewer.value.entities.remove(oldE)
  viewer.value.entities.add({
    id: 'bedding_avainit',
    position: Cesium.Cartesian3.fromDegrees(lon, lat),
    point: { pixelSize: 16, color: col, outlineColor: Cesium.Color.WHITE, outlineWidth: 2 },
    label: {
      text: mode + (unstable ? ' · 不稳定' : ' · 稳定') + ' (minFoS=' + minFos.toFixed(2) + ')',
      font: '13px sans-serif',
      fillColor: col,
      showBackground: true,
      backgroundColor: new Cesium.Color(0, 0, 0, 0.6),
      pixelOffset: new Cesium.Cartesian2(0, -28),
    },
  })
  viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(lon, lat, 12000) })

  ElMessage({ message: mode + ' 冰岩崩安全系数已生成', type: 'success' })
}
// ---- 按案例(易贡/色东普)的冰川灾害链串联：每个案例都跑 冰岩崩→泥石流物源 并传参 ----
let chainPanelEl = null
const CHAIN_CASES = {
  yigong: { name: '易贡', loc: { lon: 95.0020, lat: 30.2354 }, ice: { melt_duration: '240', slope_angle: '45', slide_angle: '30', ice_thickness: '5', fissure_height: '10', slide_length: '50', cohesion: '20', friction_angle: '35', rock_density: '2500', permeability: '1e-05' }, collapseVolume: 1.86e8, sourceArea: 2.6e7 },
  sedongpu: { name: '色东普', loc: { lon: 94.8935, lat: 29.7429 }, ice: { melt_duration: '240', slope_angle: '50', slide_angle: '35', ice_thickness: '6', fissure_height: '12', slide_length: '60', cohesion: '22', friction_angle: '34', rock_density: '2500', permeability: '1e-05' }, collapseVolume: 0.4e8, sourceArea: 2.4e7 },
}
const chainCaseKey = { value: 'yigong' }
const chainState = { minFos: null, unstable: false, sourceBoost: 0 }

async function runChainCase() {
  const c = CHAIN_CASES[chainCaseKey.value] || CHAIN_CASES.yigong
  ElMessage({ message: c.name + ' 灾害链：冰岩崩→泥石流物源 运行中...', type: 'info', duration: 0 })
  try {
    const body = { ...c.ice }
    const res = await axios.post('/testapi/admin/user/avainit', body)
    const fos = Array.isArray(res.data.fos) ? res.data.fos : []
    const minFos = fos.length ? Math.min(...fos) : 1
    chainState.minFos = minFos
    chainState.unstable = minFos < 1
    // 参数传递：案例已知崩落体量 → 物源厚度增量(zmax_boost)
    chainState.sourceBoost = Math.min(20, Math.max(0, c.collapseVolume / c.sourceArea))
    showBeddingFos({ mode: c.name + '·冰岩崩', form: body, result: res.data, location: { longitude: String(c.loc.lon), latitude: String(c.loc.lat) } })
    const sdp = await axios.post('/testapi/admin/user/SDP_Start', { ice_content: 0.2, zmax_boost: chainState.sourceBoost })
    showSdpResultLayer(sdp.data)
    ElMessage.closeAll()
    ElMessage({ message: c.name + ' 完成：冰岩崩(' + (chainState.unstable ? '失稳' : '稳定') + ') → 泥石流物源(zmax+' + chainState.sourceBoost.toFixed(2) + 'm)', type: 'success' })
    updateChainStatus()
    return sdp.data
  } catch (e) {
    ElMessage.closeAll()
    const m = e.response?.data || e.message || e
    ElMessage({ message: c.name + ' 灾害链失败: ' + (typeof m === 'string' ? m : JSON.stringify(m)), type: 'error' })
    console.error('chain error:', e)
  }
}

function updateChainStatus() {
  if (!chainPanelEl) return
  const el = chainPanelEl.querySelector('#chain-status')
  if (!el) return
  const c = CHAIN_CASES[chainCaseKey.value]
  el.textContent = c.name + ' 冰岩崩 minFoS=' + (chainState.minFos == null ? '-' : chainState.minFos.toFixed(2)) + (chainState.unstable ? ' ·失稳' : ' ·稳定') + ' | 崩落体量 ' + (c.collapseVolume / 1e8).toFixed(2) + '×10⁸m³ | 物源厚度+' + chainState.sourceBoost.toFixed(2) + 'm'
}

function toggleChainPanel() {
  if (chainPanelEl) { chainPanelEl.remove(); chainPanelEl = null; return }
  const el = document.createElement('div')
  el.style.cssText = 'position:fixed;top:128px;left:30px;z-index:999;width:380px;background:rgba(0,0,0,0.85);border:1px solid #38e1ff;border-radius:6px;padding:10px 14px;color:#fff;font-size:13px;'
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;font-weight:600;color:#38e1ff;margin-bottom:8px"><span>冰川灾害链 · 按案例</span><span id="chain-close" style="cursor:pointer;color:#999">&times;</span></div>
    <div style="margin:4px 0;color:#fff">案例 <span style="margin-left:6px"><button id="case-yigong" style="background:#38e1ff;border:none;border-radius:3px;cursor:pointer;padding:2px 8px">易贡</button></span> <button id="case-sedongpu" style="background:#444;border:none;border-radius:3px;color:#fff;cursor:pointer;padding:2px 8px">色东普</button></div>
    <div style="margin:6px 0;color:#9cf;font-size:12px">每个案例都依次运行：①冰岩崩启动 ②(崩落体量→物源厚度) ③泥石流物源启动</div>
    <div style="margin:6px 0"><button id="chain-run" style="background:#ffaa00;border:none;border-radius:3px;color:#000;cursor:pointer;padding:4px 12px;font-weight:600">运行当前案例灾害链</button></div>
    <div id="chain-status" style="margin-top:6px;font-size:12px;color:#ffd"></div>
  `
  document.body.appendChild(el)
  chainPanelEl = el
  el.querySelector('#chain-close').onclick = () => { el.remove(); chainPanelEl = null }
  el.querySelector('#chain-run').onclick = () => { runChainCase() }
  el.querySelector('#case-yigong').onclick = () => { chainCaseKey.value = 'yigong'; updateChainStatus() }
  el.querySelector('#case-sedongpu').onclick = () => { chainCaseKey.value = 'sedongpu'; updateChainStatus() }
  updateChainStatus()
}

function initChainButton() {
  const btn = document.createElement('div')
  btn.textContent = '✦ 冰川灾害链'
  btn.style.cssText = 'position:fixed;top:88px;left:30px;z-index:998;background:rgba(0,0,0,0.75);border:1px solid #38e1ff;border-radius:6px;padding:6px 10px;color:#fff;cursor:pointer;font-size:13px;'
  btn.onclick = () => toggleChainPanel()
  document.body.appendChild(btn)
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

// 洪水泥石流启动动力学模型（测试） — 独立渲染逻辑
// 洪水泥石流（测试）— DebrisFlow 渲染
let sdpSim = null
let sdpLegendEl = null

let betaSim = null
let betaFrameTimer = null
// 每次 beta 渲染的序号：转换/采样是异步的，用序号丢弃过期的调用
let betaRunId = 0

// ---- 贴地渲染状态：pro/beta 的流深帧由 Cesium 影像图层承载（自动贴合地形）----
let betaDrapeLayers = []
let betaDrapeTimer = null
let betaDrapeIndex = -1
const BETA_FLOW_LEGEND_ID = 'flowDepth'

/**
 * 清掉上一次的贴地渲染：移除影像图层、停掉时间轴、撤掉图例。
 */
function clearBetaDrape() {
  if (betaDrapeTimer) {
    clearInterval(betaDrapeTimer)
    betaDrapeTimer = null
  }
  const layers = viewer.value?.scene?.imageryLayers
  if (layers && betaDrapeLayers.length) {
    betaDrapeLayers.forEach(layer => {
      try {
        layers.remove(layer, true)
      } catch (e) {
        console.warn('[betaLayers] 移除贴地图层失败:', e)
      }
    })
  }
  betaDrapeLayers = []
  betaDrapeIndex = -1
  // 图例（legendLayers 在文件后段声明，运行时已初始化）
  legendLayers.value = legendLayers.value.filter(l => l.id !== BETA_FLOW_LEGEND_ID)
}

function cleanupBetaRenderer() {
  clearBetaDrape()
  if (betaFrameTimer) {
    clearTimeout(betaFrameTimer)
    betaFrameTimer = null
  }
  if (betaSim) {
    try {
      if (typeof betaSim.destroy === 'function') betaSim.destroy()
      else if (typeof betaSim.remove === 'function') betaSim.remove()
    } catch (e) {
      console.warn('[betaLayers] cleanup failed:', e)
    }
    betaSim = null
  }
}

/**
 * Light-weight ground height lookup for the beta renderer.
 * Reads the already-loaded globe instead of issuing a batch terrain request.
 * The old rectangles crash was caused by Vue deeply proxying the Viewer (now shallowRef), not by sampleTerrain itself.
 */
function frameUrlOf(ascBase, name) {
  return String(ascBase).replace(/\/$/, '') + '/' + encodeURIComponent(name)
}

function getGroundHeightMeters(lon, lat, fallback = 3000) {
  try {
    const carto = Cesium.Cartographic.fromDegrees(lon, lat)
    const h = viewer.value?.scene?.globe?.getHeight(carto)
    if (Number.isFinite(h)) return h
  } catch (e) {
    console.warn('[betaLayers] terrain height lookup failed:', e)
  }
  return fallback
}
/**
 * 把后端输出的 ASC 帧转成 DebrisFlow.dataSet 需要的 base64 PNG（24 位打包）。
 * 与 RiskInsight 的做法一致：一次性把全部帧交给渲染器，由 postRender 自动播放。
 */
async function buildAvaflowDataSet(frameFiles, ascBase, maxDepth, outW, outH, onProgress, mode = 'packed', paintOptions = null) {
  const { parseASC, resampleASCToSize, packNormalizedDepthToImageData, paintDepthToImageData } = await import('../utils/ascConverter.js')
  // packed：24 位打包图（给 DebrisFlow BOX 着色器用）
  // visual：带颜色的透明 PNG（给 Cesium 影像图层贴地用）
  const painter = mode === 'visual' ? paintDepthToImageData : packNormalizedDepthToImageData
  const frames = []
  // 所有帧湿区的并集（输出网格坐标，行 0 = 北），用来给相机定位
  const wet = { row0: Infinity, row1: -1, col0: Infinity, col1: -1 }
  for (let i = 0; i < frameFiles.length; i++) {
    const url = frameUrlOf(ascBase, frameFiles[i])
    const resp = await fetch(url)
    if (!resp.ok) throw new Error('帧加载失败 ' + resp.status + ': ' + frameFiles[i])
    const text = await resp.text()
    const { ncols, nrows, values } = parseASC(text)
    // flipY=false：PNG 首行放 ASC 首行（北侧）。渲染器用 flipY:false 上传该图片，
    // v=0 即北侧，正好对上 box 局部坐标（+z=南）；若翻转会南北镜像。
    const resampled = resampleASCToSize(values, ncols, nrows, outW, outH, false)
    for (let y = 0; y < outH; y++) {
      for (let x = 0; x < outW; x++) {
        if (resampled[y * outW + x] > 0.01) {
          if (y < wet.row0) wet.row0 = y
          if (y > wet.row1) wet.row1 = y
          if (x < wet.col0) wet.col0 = x
          if (x > wet.col1) wet.col1 = x
        }
      }
    }
    const { canvas, ctx, imgData } = painter(resampled, outW, outH, maxDepth, paintOptions || undefined)
    ctx.putImageData(imgData, 0, 0)
    frames.push(canvas.toDataURL('image/png'))
    onProgress && onProgress(i + 1, frameFiles.length)
  }
  return { frames, wetBbox: wet.row1 >= 0 ? wet : null }
}

/**
 * 结果范围 → 相机要看的矩形（附带用于采样地面高度的点）。
 * 优先用湿区并集：整幅网格有十几公里，直接看整幅会把泥石流缩成一个点。
 */
function computeBetaViewRect(meta, wetBbox, outW, outH, ncols, nrows, cellsize) {
  const bbox = Array.isArray(meta.bbox) && meta.bbox.length === 4 ? meta.bbox.map(Number) : null
  const cell = Number(cellsize) > 0 ? Number(cellsize) : 30
  if (bbox && bbox.every(Number.isFinite)) {
    const [west, south, east, north] = bbox
    const lonSpan = east - west
    const latSpan = north - south
    const hasWet = wetBbox && wetBbox.col1 >= wetBbox.col0 && wetBbox.row1 >= wetBbox.row0
    const fx0 = hasWet ? wetBbox.col0 / outW : 0
    const fx1 = hasWet ? (wetBbox.col1 + 1) / outW : 1
    const fy0 = hasWet ? wetBbox.row0 / outH : 0
    const fy1 = hasWet ? (wetBbox.row1 + 1) / outH : 1
    const westX = west + fx0 * lonSpan
    const eastX = west + fx1 * lonSpan
    const northY = north - fy0 * latSpan // 打包帧第 0 行 = 北侧
    const southY = north - fy1 * latSpan
    const padX = Math.max((eastX - westX) * 0.3, 0.0025)
    const padY = Math.max((northY - southY) * 0.3, 0.0022)
    const centerLon = (westX + eastX) / 2
    const centerLat = (southY + northY) / 2
    return {
      rectangle: Cesium.Rectangle.fromDegrees(westX - padX, southY - padY, eastX + padX, northY + padY),
      centerLon,
      centerLat,
      source: hasWet ? '湿区范围' : '整个网格',
      samples: [
        [westX, southY],
        [westX, northY],
        [eastX, northY],
        [eastX, southY],
        [centerLon, centerLat],
      ],
    }
  }

  // 没有 bbox 时退回：以网格中心俯视整幅
  const lon = Number(meta.centerLon)
  const lat = Number(meta.centerLat)
  const spanM = Math.max(ncols * cell, nrows * cell) || 15000
  const halfLat = spanM / 2 / 111320
  const halfLon = halfLat / Math.max(0.2, Math.cos((lat || 30) * Math.PI / 180))
  return {
    rectangle: Cesium.Rectangle.fromDegrees(lon - halfLon, lat - halfLat, lon + halfLon, lat + halfLat),
    centerLon: lon,
    centerLat: lat,
    source: '网格中心',
    samples: [[lon, lat]],
  }
}

// 渲染完成后飞向结果矩形时，在 Cesium 默认取景距离上再抬高的米数
const RESULT_CAMERA_LIFT_M = 5500

/**
 * 飞到结果矩形，并在 Cesium 默认取景基础上抬高 lift 米。
 *
 * Cesium 对 Rectangle 的默认取景是「矩形中心正上方、俯视」，距离由视锥与矩形角点算出，
 * 直接 flyTo(rectangle) 会把结果贴在屏幕边缘，很难看清。
 * 这里用一台离屏 Camera 先把同一套默认取景复算出来（不改动当前视角），
 * 再把高度加上 lift，最后用一次 flyTo 平滑飞过去：
 * 画面内容与默认取景完全一致，只是整体看得更高。
 */
const flyToResultRect = (rectangle, lift = RESULT_CAMERA_LIFT_M, duration = 2.5) => {
  const camera = viewer.value && viewer.value.camera
  if (!camera || !rectangle) return
  try {
    const ellipsoid = Cesium.Ellipsoid.WGS84
    // 离屏相机：只用来算 Cesium 的默认取景位置，不影响当前视角
    const scratch = new Cesium.Camera(viewer.value.scene)
    const fov = camera.frustum ? camera.frustum.fov : undefined
    if (Number.isFinite(fov)) {
      scratch.frustum.fov = fov
      scratch.frustum.aspectRatio = camera.frustum.aspectRatio
    }
    scratch.flyTo({ destination: rectangle, duration: 0 })
    const carto = ellipsoid.cartesianToCartographic(scratch.position)
    if (!carto || !Number.isFinite(carto.height)) throw new Error('invalid framing')
    const height = carto.height + lift
    camera.flyTo({
      destination: Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, height, ellipsoid),
      orientation: { heading: 0, pitch: -Cesium.Math.PI_OVER_TWO, roll: 0 },
      duration,
    })
    console.log(
      '[betaLayers] 相机定位: 默认取景高度=' + carto.height.toFixed(1) + 'm → ' + height.toFixed(1) + 'm',
    )
  } catch (e) {
    console.warn('[betaLayers] 抬高相机失败，回退默认取景:', e)
    camera.flyTo({ destination: rectangle, duration })
  }
}

// 前端固定渲染 solid（泥石流层厚度 zB-zL）
// pro / python_port 支持的输出场：total=泥石流层+水层, water=水层, solid=泥石流层(zB-zL), speed=流速
const PRO_FIELD_META = {
  total: { title: '流深', unit: 'm', colors: ['#FFC83C', '#F39220', '#D85218', '#9E2614', '#4C0C0A'] },
  water: { title: '水层深度', unit: 'm', colors: ['#FFC83C', '#F39220', '#D85218', '#9E2614', '#4C0C0A'] },
  solid: { title: '泥石流层厚度', unit: 'm', colors: ['#FFC83C', '#F39220', '#D85218', '#9E2614', '#4C0C0A'] },
  speed: { title: '流速', unit: 'm/s', colors: ['#2C7BB6', '#ABD9E9', '#FFFFBF', '#FDAE61', '#D7191C'] },
}
const proFieldMeta = field => PRO_FIELD_META[String(field || 'solid').toLowerCase()] || PRO_FIELD_META.solid

const betaLayers = async (payload, label = '山洪泥石流启动动力学模型_beta', options = {}) => {
  const useDrape = options.drape !== false
  const result = payload?.result
  if (!result || result.status !== 'ok') {
    cleanupBetaRenderer()
    clearHeatmapPrimitive()
    return
  }

  const meta = result.meta || {}
  const frameFiles = Array.isArray(result.frameFiles) ? result.frameFiles : []
  const ncols = Number(meta.ncols)
  const nrows = Number(meta.nrows)
  const cellsize = Number(meta.cellsize)
  const centerLon = Number(meta.centerLon)
  const centerLat = Number(meta.centerLat)
  const globalMax = Math.max(Number(meta.globalMax) || 0, 1e-6)

  // 兼容旧任务：没有 ASC 元数据时仍使用原来的 GeoJSON heatmap 链路
  if (
    !viewer.value ||
    !result.ascBase ||
    frameFiles.length === 0 ||
    !(ncols > 0) ||
    !(nrows > 0) ||
    !(cellsize > 0) ||
    !Number.isFinite(centerLon) ||
    !Number.isFinite(centerLat)
  ) {
    if (!result.outputBase) {
      cleanupBetaRenderer()
      clearHeatmapPrimitive()
      return
    }

    cleanupBetaRenderer()
    stopHeatmapCycle()
    currentHeatmapIndex = 1
    avaflowOutputBase.value = result.outputBase
    avaflowFrameCount.value = Math.max(1, Number(result.frameCount) || 1)
    await loadHeatmap(1)

    const bbox = Array.isArray(result.bbox) ? result.bbox.map(Number) : null
    if (bbox && bbox.length === 4 && bbox.every(Number.isFinite)) {
      flyToResultRect(Cesium.Rectangle.fromDegrees(bbox[0], bbox[1], bbox[2], bbox[3]), RESULT_CAMERA_LIFT_M, 1.5)
    }
    startHeatmapCycle()
    return
  }

  // ---- 贴地渲染分支（影像图层）----
  // 背景：ASC 帧是整片栅格（本例 444x247），原先把它当成一个水平 BOX 渲染：
  // 只取网格中心点的一处地面高度再整体抬高 ~30m，地形起伏几百米时必然
  // 一边悬空、一边穿地，这就是“不贴地”的根因。
  // 现在把每帧流深画成带透明度的 PNG，交给 Cesium 影像图层承载：
  // 影像由 Cesium 自动贴合地形网格，天然贴地；无数据像元全透明。
  // 若缺少 bbox 或出错，则回退到下面的 BOX 渲染分支。
  if (useDrape) {
    const rawBbox = Array.isArray(result.bbox) ? result.bbox.map(Number) : null
    const hasBbox = !!(rawBbox && rawBbox.length === 4 && rawBbox.every(Number.isFinite))
    if (hasBbox) {
      let drapeOk = false
      try {
        cleanupBetaRenderer()
        clearHeatmapPrimitive()
        const runId = ++betaRunId

        const fmeta = proFieldMeta(meta.field)
        // 空场保护：某字段全场为 0（例如 zB-zL≈0 时泥石流层为空）时直接提示，不再渲染空图层
        if (!(globalMax > 1e-6)) {
          cleanupBetaRenderer()
          clearHeatmapPrimitive()
          ElMessage.closeAll()
          ElMessage({
            message:
              fmeta.title + ' 全场最大值为 0，没有可渲染内容' +
              (meta.field === 'solid' ? '（zB - zL 无物源，请检查灾前/灾后地形）' : '（请检查输入数据或改用其他渲染场）'),
            type: 'warning',
            duration: 6000,
          })
          return
        }

        const [west, south, east, north] = rawBbox
        const rect = Cesium.Rectangle.fromDegrees(west, south, east, north)
        const maxDim = 1024
        const scale = Math.max(1, Math.max(ncols, nrows) / maxDim)
        const width = Math.max(2, Math.round(ncols / scale))
        const height = Math.max(2, Math.round(nrows / scale))

        const total = frameFiles.length
        const { frames, wetBbox } = await buildAvaflowDataSet(
          frameFiles,
          result.ascBase,
          globalMax,
          width,
          height,
          done => {
            if (done % 5 === 0 || done === total) {
              ElMessage({ message: '帧转换中 ' + done + '/' + total, type: 'info', duration: 800 })
            }
          },
          'visual',
          meta.field === 'speed' ? { ramp: 'speed' } : null,
        )
        if (runId !== betaRunId) return

        const view = computeBetaViewRect(meta, wetBbox, width, height, ncols, nrows, cellsize)
        flyToResultRect(view.rectangle)

        const layerCollection = viewer.value.scene.imageryLayers
        frames.forEach(url => {
          const layer = layerCollection.addImageryProvider(
            new Cesium.SingleTileImageryProvider({
              url,
              rectangle: rect,
              tileWidth: width,
              tileHeight: height,
            }),
          )
          layer.show = false
          layer.alpha = 1.0
          betaDrapeLayers.push(layer)
        })
        if (!betaDrapeLayers.length) throw new Error('未创建任何贴地图层')

        // 时间轴动画：默认 400ms 一帧，循环播放
        const showFrame = idx => {
          betaDrapeIndex = idx
          betaDrapeLayers.forEach((layer, i) => {
            layer.show = i === idx
          })
        }
        showFrame(0)
        betaDrapeTimer = setInterval(() => {
          if (!betaDrapeLayers.length) return
          showFrame((betaDrapeIndex + 1) % betaDrapeLayers.length)
        }, 400)

        // 图例：流深色带（复用地图右下角图例组件）
        const flowLegend = {
          title: fmeta.title,
          unit: fmeta.unit,
          stops: [0, 0.25, 0.5, 0.75, 1],
          colors: fmeta.colors,
          ticks: ['0', (globalMax / 2).toFixed(1), globalMax.toFixed(1)],
        }
        legendLayers.value = legendLayers.value.filter(l => l.id !== BETA_FLOW_LEGEND_ID)
        legendLayers.value.push({ id: BETA_FLOW_LEGEND_ID, ...flowLegend, gradient: legendGradient(flowLegend) })

        console.log(
          '[betaLayers] 贴地渲染就绪:',
          view.source,
          width + 'x' + height,
          frames.length + ' 帧',
          'maxDepth=' + globalMax.toFixed(2) + 'm',
        )
        ElMessage.closeAll()
        ElMessage({ message: label + ' 渲染完成（贴地）', type: 'success', duration: 2000 })
        drapeOk = true
      } catch (e) {
        console.error('[betaLayers] 贴地渲染失败，回退 BOX 渲染:', e)
        cleanupBetaRenderer()
      }
      if (drapeOk) return
    }
  }

  cleanupBetaRenderer()
  clearHeatmapPrimitive()

  const runId = ++betaRunId

  try {
    const Renderer = (await import('../../Simulation-extracted/DebrisFlow/index.js')).default
    const maxDim = 512
    const scale = Math.max(1, Math.max(ncols, nrows) / maxDim)
    const width = Math.max(2, Math.round(ncols / scale))
    const height = Math.max(2, Math.round(nrows / scale))
    const renderCellSize = cellsize * scale

    // ① 先把全部帧转成打包 PNG（只依赖 meta），顺便算出湿区并集用于定位相机
    const total = frameFiles.length
    const { frames: dataSet, wetBbox } = await buildAvaflowDataSet(
      frameFiles,
      result.ascBase,
      globalMax,
      width,
      height,
      done => {
        if (done % 5 === 0 || done === total) {
          ElMessage({ message: '帧转换中 ' + done + '/' + total, type: 'info', duration: 800 })
        }
      },
    )
    if (runId !== betaRunId) return

    // ② 相机自动定位。
    // 说明：sampleTerrain 本身不是根因；旧 rectangles 崩溃来自 Viewer 被 Vue 深度代理，
    // raw/Proxy 引用混入同一棵 TileAvailability 四叉树（MapLayout 已改为 shallowRef）。
    // 这里仍优先读已加载好的瓦片（globe.getHeight），避免相机尚未飞到该区域时产生大量地形请求。

    const view = computeBetaViewRect(meta, wetBbox, width, height, ncols, nrows, cellsize)
    const groundHeight = getGroundHeightMeters(view.centerLon, view.centerLat, 3000)
    console.log(
      '[betaLayers] 定位到' + view.source + ':',
      view.centerLon.toFixed(5) + ',' + view.centerLat.toFixed(5),
      '| 地面高度=' + groundHeight.toFixed(1) + 'm',
    )
    if (runId !== betaRunId) return
    flyToResultRect(view.rectangle)

    // ③ 建渲染器：网格仍定位在原始中心点上，整体抬高一点避开地形起伏
    const sim = new Renderer({
      viewer: viewer.value,
      width,
      height,
      cellSize: renderCellSize,
      rect: [ncols, nrows],
      range: [0, globalMax],
      debrisJSON: turf.featureCollection([]),
      lakeName: 'avaflow',
      deepWaterColor: '#5c3a1e',
      lightWaterColor: '#c8a050',
      renderTerrain: false,
      renderHeatMap: true,
      renderOriginData: false,
    })
    betaSim = sim

    // 平面 DEM 初始化：网格按中心点地面高度定位，避免逐像元采样在线地形导致 Cesium 崩溃
    const betaThickness = 20
    // betaClearance：整体再抬 30m，免得被起伏地形和地形网格误差挡掉
    const betaClearance = 30
    await sim.initBoxFlat({
      center: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, groundHeight + betaClearance + betaThickness / 2),
      terrainHeight: groundHeight + betaClearance,
      minThickness: betaThickness,
      renderDirectFrames: false,
      renderPackedFrames: true,
    })
    if (betaSim !== sim) return

    // ④ 交给 dataSet 自动播放：单相数据，dataSet2/3 留空即可（updateDataSets 已做空数组保护）
    sim.dataSet = dataSet
    sim.dataSet2 = []
    sim.dataSet3 = []
    // 每渲染帧 frame += 0.01 * renderSpeed，帧号 = frame * 2：3.0 大约 10 秒播完 41 帧
    sim.renderSpeed = 3.0
    console.log(
      '[betaLayers] 帧数据就绪:',
      dataSet.length + ' 帧',
      width + 'x' + height,
      'globalMax=' + globalMax.toFixed(2),
    )

    ElMessage.closeAll()
    ElMessage({ message: label + ' 渲染完成', type: 'success', duration: 2000 })
  } catch (e) {
    cleanupBetaRenderer()
    console.error('[betaLayers] DebrisFlow render failed:', e)
    ElMessage.closeAll()
    ElMessage({ message: 'DebrisFlow 渲染失败: ' + (e.message || e), type: 'error' })
  }

}
// 洪水泥石流启动动力学模型（python_port）复用 beta 的 ASC 帧渲染链路
const proLayers = payload => betaLayers(payload, '洪水泥石流启动动力学模型')

// ===== 断链 / 沿程调控：地图手绘封闭范围 =====
// LeTh 面板点「在地图上绘制」后进入绘制模式：左键逐点、右键结束、Esc 取消；
// 结束后把 WGS84 顶点数组回传给 LeTh 面板，随计算一起提交给后端做地形抬升。
const leThRef = ref(null)
let terrainDrawHandler = null
let terrainDrawLonLat = []
let terrainDrawEntities = []

const removeTerrainDrawEntities = () => {
  const v = viewer.value
  if (v) {
    terrainDrawEntities.forEach(entity => {
      try {
        v.entities.remove(entity)
      } catch (e) {
        /* ignore */
      }
    })
  }
  terrainDrawEntities = []
}

const destroyTerrainDrawHandler = () => {
  if (terrainDrawHandler) {
    try {
      terrainDrawHandler.destroy()
    } catch (e) {
      /* ignore */
    }
    terrainDrawHandler = null
  }
  document.removeEventListener('keydown', terrainDrawKeyHandler)
}

const clearTerrainDraw = () => {
  destroyTerrainDrawHandler()
  terrainDrawLonLat = []
  removeTerrainDrawEntities()
}

const renderTerrainDraw = () => {
  removeTerrainDrawEntities()
  const v = viewer.value
  if (!v || terrainDrawLonLat.length === 0) return
  const cartesians = terrainDrawLonLat.map(p => Cesium.Cartesian3.fromDegrees(p[0], p[1]))
  terrainDrawLonLat.forEach((p, index) => {
    terrainDrawEntities.push(
      v.entities.add({
        position: Cesium.Cartesian3.fromDegrees(p[0], p[1]),
        point: {
          pixelSize: 8,
          color: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.fromCssColorString('#ff9f1c'),
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: String(index + 1),
          font: '12px sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -16),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      }),
    )
  })
  if (cartesians.length >= 2) {
    terrainDrawEntities.push(
      v.entities.add({
        polyline: {
          positions: cartesians.length >= 3 ? cartesians.concat([cartesians[0]]) : cartesians,
          width: 3,
          material: Cesium.Color.fromCssColorString('#ffb703'),
          clampToGround: true,
        },
      }),
    )
  }
  if (cartesians.length >= 3) {
    terrainDrawEntities.push(
      v.entities.add({
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(cartesians),
          material: Cesium.Color.fromCssColorString('#ffb703').withAlpha(0.35),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      }),
    )
  }
}

const finishTerrainDraw = () => {
  if (terrainDrawLonLat.length < 3) {
    ElMessage({
      message: '至少需要 3 个顶点才能封闭范围，请继续绘制或按 Esc 取消',
      type: 'warning',
      duration: 3500,
    })
    return
  }
  const points = terrainDrawLonLat.map(p => [Number(p[0].toFixed(7)), Number(p[1].toFixed(7))])
  terrainDrawLonLat = points
  destroyTerrainDrawHandler()
  renderTerrainDraw()
  terrainDrawLonLat = []
  if (leThRef.value && leThRef.value.onTerrainPolygonDrawn) {
    leThRef.value.onTerrainPolygonDrawn(points)
  }
  ElMessage({ message: '已绘制封闭范围（' + points.length + ' 个顶点）', type: 'success', duration: 3000 })
}

const terrainDrawKeyHandler = event => {
  if (event.key === 'Escape') cancelTerrainDraw()
}

const cancelTerrainDraw = () => {
  clearTerrainDraw()
  if (leThRef.value && leThRef.value.onTerrainDrawCancelled) {
    leThRef.value.onTerrainDrawCancelled()
  }
  ElMessage({ message: '已取消绘制', type: 'info', duration: 2000 })
}

const startTerrainDraw = () => {
  clearTerrainDraw()
  const v = viewer.value
  if (!v) return
  ElMessage({ message: '左键逐点绘制，右键结束，Esc 取消', type: 'info', duration: 5000 })
  const handler = new Cesium.ScreenSpaceEventHandler(v.scene.canvas)
  terrainDrawHandler = handler
  const pickPosition = position => {
    const ray = v.camera.getPickRay(position)
    let cartesian = ray ? v.scene.globe.pick(ray, v.scene) : null
    if (!cartesian) cartesian = v.camera.pickEllipsoid(position, v.scene.globe.ellipsoid)
    return cartesian
  }
  handler.setInputAction(event => {
    const cartesian = pickPosition(event.position)
    if (!cartesian) return
    const carto = Cesium.Cartographic.fromCartesian(cartesian)
    terrainDrawLonLat.push([
      Cesium.Math.toDegrees(carto.longitude),
      Cesium.Math.toDegrees(carto.latitude),
    ])
    renderTerrainDraw()
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler.setInputAction(() => finishTerrainDraw(), Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  document.addEventListener('keydown', terrainDrawKeyHandler)
}

const floodLayersTest = async payload => {
  const method = payload.renderMethod || 'debrisflow'
  console.log('[floodLayersTest] 参数:', payload, '渲染方案:', method)
  ElMessage({ message: `正在加载 ${method} 渲染器...`, type: 'info', duration: 0 })

  try {
    window.Cesium = Cesium
    let Renderer
    if (method === 'watersimulation') {
      Renderer = (await import('../../Simulation-extracted/WaterSImulation/index.js')).default
    } else if (method === 'sph') {
      Renderer = (await import('../../Simulation-extracted/SPH/index.js')).default
    } else {
      Renderer = (await import('../../Simulation-extracted/DebrisFlow/index.js')).default
    }

    // 移除旧实例
    if (sdpSim) { clearInterval(sdpSim._frameInterval); sdpSim.remove(); sdpSim = null }

    // 解析第一帧 ASC 获取头信息
    const { parseASC } = await import('../utils/ascConverter.js')
    const firstResp = await fetch('/CS/asc_data/flood_output1.asc')
    const header = parseASC(await firstResp.text())

    const centerLon = header.xllcorner + (header.ncols * header.cellsize) / 2
    const centerLat = header.yllcorner + (header.nrows * header.cellsize) / 2
    const metersPerDegLon = 111320 * Math.cos(centerLat * Math.PI / 180)
    const cellSizeM = header.cellsize * (111320 + metersPerDegLon) / 2
    const centerCart = Cesium.Cartesian3.fromDegrees(centerLon, centerLat)
    const sampled = await Cesium.sampleTerrain(viewer.value.terrainProvider, 13, [
      Cesium.Cartographic.fromCartesian(centerCart)
    ])
    const groundH = sampled[0]?.height || 3000
    const center = Cesium.Cartesian3.fromDegrees(centerLon, centerLat, groundH)

    const debrisJSON = turf.polygon([[
      [header.xllcorner, header.yllcorner],
      [header.xllcorner + header.ncols * header.cellsize, header.yllcorner],
      [header.xllcorner + header.ncols * header.cellsize, header.yllcorner + header.nrows * header.cellsize],
      [header.xllcorner, header.yllcorner + header.nrows * header.cellsize],
      [header.xllcorner, header.yllcorner],
    ]])

    if (method === 'watersimulation') {
      sdpSim = new Renderer({
        viewer: viewer.value, width: 256, height: 256,
        cellSize: cellSizeM * Math.max(header.ncols, header.nrows) / 256,
        lakeJSON: turf.featureCollection([]),
        debrisJSON: turf.featureCollection([debrisJSON]),
        deepWaterColor: '#5c3a1e', lightWaterColor: '#c8a050',
        renderHeatMap: true, renderOriginData: false, renderTerrain: false,
      })
      sdpSim.center = center; sdpSim.level = 13
      const tData = await sdpSim.initTerrain(center, 13)
      await sdpSim.genDemTexture(tData, true)
      sdpSim.initShader(); await sdpSim.initTexture()
      sdpSim.initFrameBuffer(); sdpSim.initRender()
    } else if (method === 'sph') {
      const sphCS = cellSizeM * Math.max(header.ncols, header.nrows) / 200
      sdpSim = new Renderer({
        viewer: viewer.value, width: header.ncols, height: header.nrows,
        cellSize: sphCS, rect: [header.ncols, header.nrows],
        validArea: { xmin:0, ymin:0, width:header.ncols, height:header.nrows },
        range: [0, 1], debrisJSON: turf.featureCollection([debrisJSON]),
        deepWaterColor: '#5c3a1e', lightWaterColor: '#c8a050', renderHeatMap: false,
      })
      await sdpSim.initBox({ center, level: 13 })
    } else {
      sdpSim = new Renderer({
        viewer: viewer.value, width: 2048, height: 2048,
        cellSize: cellSizeM * Math.max(header.ncols, header.nrows) / 2048,
        rect: [header.ncols, header.nrows], range: [0, 1],
        debrisJSON: turf.featureCollection([debrisJSON]),
        deepWaterColor: '#5c3a1e', lightWaterColor: '#c8a050',
        renderTerrain: false, renderHeatMap: false, renderOriginData: false,
      })
      await sdpSim.initBox({ center, level: 13 })
    }

    const totalFrames = 21; let currentFrame = 1
    const frameInterval = setInterval(async () => {
      if (!sdpSim || currentFrame > totalFrames) { clearInterval(frameInterval); return }
      if (sdpSim.loadAscAsWaterHeight) await sdpSim.loadAscAsWaterHeight(`/CS/asc_data/flood_output${currentFrame}.asc`)
      currentFrame++
    }, 600)
    sdpSim._frameInterval = frameInterval

    const terrainH = groundH + 2000
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, terrainH),
      orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-60), roll: 0.0 },
    })
    ElMessage.closeAll()
    ElMessage({ message: `${method} 已启动`, type: 'success' })
  } catch (e) {
    ElMessage.closeAll()
    console.error('[floodLayersTest] 加载失败:', e)
    ElMessage({ message: '加载失败: ' + (e.message || e), type: 'error' })
  }
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

const clearForecastEntity = () => {
  if (!viewer.value || !forecastEntityId) return
  const existing = viewer.value.entities.getById(forecastEntityId)
  if (existing) viewer.value.entities.remove(existing)
  forecastEntityId = null
}

const foreCast = params => {
  if (!viewer.value) return

  const rt = Number(params?.rt)
  const time = params?.time || '--'
  const longitude = Number(params?.lon)
  const latitude = Number(params?.lat)
  const pointId = params?.pointId
  const status =
    params?.status ||
    (Number.isFinite(rt) ? (rt < 0 ? 'no_ooa' : 'ok') : 'no_result')

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    ElMessage({ message: '缺少有效的监测点坐标，无法定位预警点', type: 'error' })
    return
  }

  clearForecastEntity()

  if (status === 'no_result' || !Number.isFinite(rt)) {
    ElMessage({
      message: '未获得有效预测结果，请检查位移数据长度或变化趋势',
      type: 'warning',
    })
    return
  }

  let picture = 'safe'
  let forecastText = ''
  if (status === 'no_ooa' || rt < 0) {
    picture = 'safe'
    forecastText = '未检测到加速变形（OOA），暂无法计算失稳时间'
  } else if (rt < 24) {
    picture = 'warning_red'
    forecastText = `红色预警，预计还有${Math.round(rt)}小时发生滑坡`
  } else if (rt < 48) {
    picture = 'warning_orange'
    forecastText = `橙色预警，预计还有${Math.round(rt)}小时发生滑坡`
  } else if (rt < 72) {
    picture = 'warning_yellow'
    forecastText = `黄色预警，预计还有${Math.round(rt)}小时发生滑坡`
  } else if (rt < 96) {
    picture = 'warning_blue'
    forecastText = `蓝色预警，预计还有${Math.round(rt)}小时发生滑坡`
  } else {
    forecastText = `预计失稳时间超过96小时（约${Math.round(rt)}小时）`
  }
  if (rt >= 0) forecastText += `（预测时间：${time}）`

  const groundHeight = getGroundHeightMeters(longitude, latitude, 3000)
  const pointPosition = Cesium.Cartesian3.fromDegrees(
    longitude,
    latitude,
    groundHeight,
  )
  // Keep the warning point centered and fly high enough to avoid a close-up
  // terrain view. Range is the camera-to-point distance in meters.
  viewer.value.camera.flyToBoundingSphere(
    new Cesium.BoundingSphere(pointPosition, 1000),
    {
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(250.0),
        Cesium.Math.toRadians(-55.0),
        18000,
      ),
      duration: 2.5,
      complete: () => {
        clearForecastEntity()
        const entityId = `forecast-${pointId}-${Date.now()}`
        viewer.value.entities.add({
          id: entityId,
          pointId,
          name: '预警信息',
          position: pointPosition,
          billboard: {
            image: `CS/img/${picture}.png`,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            width: 32,
            height: 32,
          },
          description: `<div><p>${forecastText}</p></div>`,
        })
        forecastEntityId = entityId

        if (!forecastHandler) {
          forecastHandler = new Cesium.ScreenSpaceEventHandler(
            viewer.value.scene.canvas,
          )
          forecastHandler.setInputAction(movement => {
            const picked = viewer.value.scene.pick(movement.position)
            if (!Cesium.defined(picked) || !picked.id) return
            const pickedPointId = picked.id.pointId
            if (pickedPointId === undefined || pickedPointId === null) return
            viewer.value.selectedEntity = picked.id
            currentPointId.value = pickedPointId
            fetchDisplacementData(pickedPointId)
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        }
      },
    },
  )
}
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
        chartVisible.value = true
        nextTick(() => {
          renderDisplacementChart(data.data)
        }) // 显示图表
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
  if (!chartDom) return
  if (displacementChart) {
    displacementChart.dispose()
  }
  displacementChart = echarts.init(chartDom)

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
  displacementChart.setOption(option, true)
  nextTick(() => {
    displacementChart?.resize()
  })

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
// ===== 地形因子图层图例 =====
const legendLayers = ref([])
const LEGEND_PRESETS = {
  dem: {
    title: "高程",
    unit: "m",
    stops: [150, 1200, 2200, 3200, 4200, 5200, 6200, 7500],
    colors: ["#1B7837", "#7FBF7B", "#E8E08E", "#D9B36C", "#B5794A", "#8C4A2F", "#E8E8E8", "#FFFFFF"],
    ticks: ["150", "3800", "7500+"],
  },
  slope: {
    title: "坡度",
    unit: "°",
    stops: [0, 5, 15, 25, 35, 45, 60],
    colors: ["#1A9850", "#A6D96A", "#FEE08B", "#FDAE61", "#F46D43", "#D73027", "#7F0000"],
    ticks: ["0", "30", "60+"],
  },
  aspect: {
    title: "坡向",
    unit: "°",
    stops: [0, 45, 90, 135, 180, 225, 270, 315, 360],
    colors: ["#FF2D2D", "#FF9900", "#FFFF00", "#33CC33", "#00E5E5", "#3399FF", "#6633CC", "#FF33CC", "#FF2D2D"],
    ticks: ["0 (N)", "180 (S)", "360 (N)"],
  },
  relief: {
    title: "地形起伏度",
    unit: "m",
    stops: [0, 30, 60, 100, 160, 300, 800],
    colors: ["#FFFFE5", "#FEE391", "#FEC44F", "#FE9929", "#D95F0E", "#993404", "#662506"],
    ticks: ["0", "400", "800+"],
  },
}
const legendGradient = preset => {
  const min = preset.stops[0]
  const max = preset.stops[preset.stops.length - 1]
  const parts = preset.stops.map((s, i) => {
    const pct = ((s - min) / (max - min)) * 100
    return `${preset.colors[i]} ${pct.toFixed(2)}%`
  })
  return `linear-gradient(90deg, ${parts.join(", ")})`
}
const setLegend = (key, visible) => {
  const preset = LEGEND_PRESETS[key]
  if (!preset) return
  const exists = legendLayers.value.some(l => l.id === key)
  if (visible) {
    if (!exists) legendLayers.value.push({ id: key, ...preset, gradient: legendGradient(preset) })
  } else if (exists) {
    legendLayers.value = legendLayers.value.filter(l => l.id !== key)
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
  setLegend('dem', true)
  //影像数据
  const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    url: '/geoserver/ZHLXT/wms',
    layers: 'ZHLXT:dem_Level_16',
    parameters: {
      transparent: true,
      format: 'image/png',
      // format: 'application/openlayers',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
    // 限制显示范围
    rectangle: Cesium.Rectangle.fromDegrees(
      92.1655311831515,
      27.55878578080392, // 西南经度, 西南纬度
      98.753326319242,
      30.663632897306222, // 东北经度, 东北纬度
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
  setLegend('dem', false)
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)

    if (layer.imageryProvider.layers === 'ZHLXT:dem_Level_16') {
      imageryLayers.remove(layer)
      break // 移除后退出循环
    }
  }
}
const addLayer_slope = () => {
  setLegend('slope', true)
  //影像数据
  const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    url: '/geoserver/ZHLXT/wms',
    layers: 'ZHLXT:slope_njbwf',
    parameters: {
      transparent: true,
      format: 'image/png',
      // format: 'application/openlayers',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
    // 限制显示范围
    rectangle: Cesium.Rectangle.fromDegrees(
      92.1655311831515,
      27.55878578080392, // 西南经度, 西南纬度
      98.753326319242,
      30.663632897306222, // 东北经度, 东北纬度
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
  setLegend('slope', false)
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)
    if (
      layer.imageryProvider &&
      layer.imageryProvider.layers === 'ZHLXT:slope_njbwf'
    ) {
      imageryLayers.remove(layer)
      break // 移除后退出循环
    }
  }
}
const addLayer_aspect = () => {
  setLegend('aspect', true)
  //影像数据
  const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    url: '/geoserver/ZHLXT/wms',
    layers: 'ZHLXT:aspect_njbwf',
    parameters: {
      transparent: true,
      format: 'image/png',
      // format: 'application/openlayers',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
    // 限制显示范围
    rectangle: Cesium.Rectangle.fromDegrees(
      92.1655311831515,
      27.55878578080392, // 西南经度, 西南纬度
      98.753326319242,
      30.663632897306222, // 东北经度, 东北纬度
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
  setLegend('aspect', false)
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)
    if (
      layer.imageryProvider &&
      layer.imageryProvider.layers === 'ZHLXT:aspect_njbwf'
    ) {
      imageryLayers.remove(layer)
      break // 移除后退出循环
    }
  }
}
const addLayer_relief = () => {
  setLegend('relief', true)
  //影像数据
  const wmsImageryProvider = new Cesium.WebMapServiceImageryProvider({
    url: '/geoserver/ZHLXT/wms',
    layers: 'ZHLXT:relief_njbwf',
    parameters: {
      transparent: true,
      format: 'image/png',
      // format: 'application/openlayers',
      // srs: 'EPSG:4326',默认4326，并且此配置不起作用
    },
    tilingScheme: new Cesium.WebMercatorTilingScheme(), //添加墨卡托投影
    // 限制显示范围
    rectangle: Cesium.Rectangle.fromDegrees(
      92.1655311831515,
      27.55878578080392, // 西南经度, 西南纬度
      98.753326319242,
      30.663632897306222, // 东北经度, 东北纬度
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
  setLegend('relief', false)
  // 假设 viewer 是您的 Cesium Viewer 对象
  const imageryLayers = viewer.value.scene.imageryLayers

  // 遍历所有图层，找到指定的图层并移除
  for (let i = 0; i < imageryLayers.length; i++) {
    const layer = imageryLayers.get(i)
    if (
      layer.imageryProvider &&
      layer.imageryProvider.layers === 'ZHLXT:relief_njbwf'
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

// ============================================================
// GeoServer WMS 配置（发布数据后修改以下常量即可）
// ============================================================
const GEOSERVER_WMS_URL = '/geoserver/ZHLXT/wms'
const FULL_RISK_RESULT_LAYER = 'linzi_hazard' // 全域风险脆弱性分析结果
const TIANDITU_KEY = '20d721cc10d01248502d5e90f817ca93' // TODO: 替换为实际的天地图 tk
const BUILDING_WMS_LAYER = 'ygBuildings' // 图层名
const POPULATION_WMS_LAYER = 'pop_LinZhi' // 图层名
const HP_pop_Vulnerability = 'HP_pop_Vulnerability' // 图层名
const NSL_pop_Vulnerability = 'NSL_pop_Vulnerability' // 图层名
const SH_pop_Vulnerability = 'SH_pop_Vulnerability' // 图层名
const HP_Danger = 'HP_Danger' // 图层名
const NSL_Danger = 'NSL_Danger' // 图层名
const SH_Danger = 'SH_Danger' // 图层名
// 73 承载体分布
const domestic_build = 'domestic_build'   // 731 建筑物提取
const linzhi_pop = 'linzhi_pop'           // 732 人口提取（栅格）
const motuo_traffic = 'motuo_traffic'     // 733 交通流量预测
// 74 建筑物风险评估
const build_one = 'build_one'             // 741 1层建筑物脆弱性
const build_two = 'build_two'             // 742 2层建筑物脆弱性
const build_three = 'build_three'         // 743 3层建筑物脆弱性
const build_masonry = 'build_masonry'     // 744 砌体建筑物脆弱性
const building_risk = 'building_risk'     // 745 总体建筑物脆弱性
// 75 道路风险评估
const roadrisk_h = 'roadrisk_h'           // 751 高等级道路
const roadrisk_m = 'roadrisk_m'           // 752 次等级道路
const roadrisk_s = 'roadrisk_s'           // 753 简单道路
const road_risk = 'road_risk'             // 754 总体道路
// 76 桥梁风险评估
const bridge_d = 'bridge_d'               // 761 双柱式桥梁脆弱性
const bridge_s = 'bridge_s'               // 762 单柱式桥梁脆弱性
const bridge = 'bridge'                   // 763 总体桥梁脆弱性
// 77 人口风险评估
const pop_risk = 'pop_risk'              // 77 人口风险评估（栅格）
// 78 危险性评估
const linzi_hazard = 'linzi_hazard'     // 781 区域危险性评估（栅格）
const yigong_hazard = 'yigong_hazard'     // 782 点危险性评估（栅格）
const HISTORY_SIM_WMS_LAYER = 'BCNSL_results' // 历史数据模拟
const STUDY_AREA_RECT = Cesium.Rectangle.fromDegrees(
  92.1550260147193, 27.422589628183562, // 西, 南
  98.8797996278891, 30.68902208298092, // 东, 北
)

// WMS imagery provider 工厂：统一配置，避免重复
const createWmsProvider = (layerName, transparent) => {
  return new Cesium.WebMapServiceImageryProvider({
    url: GEOSERVER_WMS_URL,
    layers: layerName,
    parameters: {
      format: 'image/png',
      transparent: true,
      version: '1.1.0',
    },
    // 图层以 EPSG:4326 发布，使用 GeographicTilingScheme 避免投影不匹配
    tilingScheme: new Cesium.GeographicTilingScheme(),
    rectangle: STUDY_AREA_RECT,
    maximumLevel: 18,
  })
}

//添加建筑数据（GeoServer WMS）
const addLayer_building = () => {
  try {
    console.log(`[建筑数据] 加前 primitives:${viewer.value.scene.primitives.length} entities:${viewer.value.entities.values.length} imageryLayers:${viewer.value.scene.imageryLayers.length}`)
    console.log(`[建筑数据] heatmapPrimitive:`, !!heatmapPrimitive, 'intervalId:', !!intervalId)

    const provider = createWmsProvider(BUILDING_WMS_LAYER, true)

    const layers = viewer.value.scene.imageryLayers
    const addedLayer = layers.addImageryProvider(provider)
    addedLayer.buildingTag = true

    console.log(`[建筑数据] 加后 primitives:${viewer.value.scene.primitives.length} entities:${viewer.value.entities.values.length} imageryLayers:${viewer.value.scene.imageryLayers.length}`)
    ElMessage.success('建筑数据加载完成')
  } catch (error) {
    console.error('加载建筑数据失败:', error)
    ElMessage.error(`加载建筑数据失败: ${error.message || error}`)
  }
}

//移除建筑数据
const removeLayer_building = () => {
  const imageryLayers = viewer.value.scene.imageryLayers
  for (let i = imageryLayers.length - 1; i >= 0; i--) {
    const layer = imageryLayers.get(i)
    if (layer.buildingTag) {
      imageryLayers.remove(layer)
    }
  }
  ElMessage.success('建筑数据已移除')
}

//添加人口数据（GeoServer WMS）
const addLayer_population = () => {
  try {
    console.log(`[人口数据] 正在加载 WMS 图层: ${POPULATION_WMS_LAYER}`)
    const provider = createWmsProvider(POPULATION_WMS_LAYER, false)

    const layers = viewer.value.scene.imageryLayers
    const addedLayer = layers.addImageryProvider(provider)
    addedLayer.populationTag = true

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
      orientation: {
        heading: Cesium.Math.toRadians(56.34),
        pitch: Cesium.Math.toRadians(-31),
        roll: 0.0,
      },
    })
    ElMessage.success('人口数据加载完成')
  } catch (error) {
    console.error('加载人口数据失败:', error)
    ElMessage.error(`加载人口数据失败: ${error.message || error}`)
  }
}

//移除人口数据
const removeLayer_population = () => {
  const imageryLayers = viewer.value.scene.imageryLayers
  for (let i = imageryLayers.length - 1; i >= 0; i--) {
    const layer = imageryLayers.get(i)
    if (layer.populationTag) {
      imageryLayers.remove(layer)
      break
    }
  }
  ElMessage.success('人口数据已移除')
}

//添加天地图路网（天地图 WMTS）
const addLayer_tianditu_road = () => {
  try {
    console.log('[天地图路网] 正在加载天地图路网图层')
    const provider = new Cesium.WebMapTileServiceImageryProvider({
      url: `/tianditu/cia_w/wmts?tk=${TIANDITU_KEY}`,
      layer: 'cia',
      style: 'default',
      format: 'image/png',
      tileMatrixSetID: 'w',
      maximumLevel: 18,
      credit: '天地图',
    })
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.tiandituRoadTag = true
    ElMessage.success('天地图路网加载完成')
  } catch (error) {
    console.error('加载天地图路网失败:', error)
    ElMessage.error(`加载天地图路网失败: ${error.message || error}`)
  }
}
const removeLayer_tianditu_road = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) {
    if (layers.get(i).tiandituRoadTag) {
      layers.remove(layers.get(i))
      break
    }
  }
  ElMessage.success('天地图路网已移除')
}

//添加历史数据模拟（GeoServer WMS）
const addLayer_621 = () => {
  try {
    console.log(`[历史数据模拟] 正在加载 WMS 图层: ${HISTORY_SIM_WMS_LAYER}`)
    const provider = createWmsProvider(HISTORY_SIM_WMS_LAYER, true)

    const layers = viewer.value.scene.imageryLayers
    const addedLayer = layers.addImageryProvider(provider)
    addedLayer.historySimTag = true

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
      orientation: {
        heading: Cesium.Math.toRadians(56.34),
        pitch: Cesium.Math.toRadians(-31),
        roll: 0.0,
      },
    })
    ElMessage.success('历史数据模拟加载完成')
  } catch (error) {
    console.error('加载历史数据模拟失败:', error)
    ElMessage.error(`加载历史数自动检测
    中文（简体）
    实验成果合集据模拟失败: ${error.message || error}`)
  }
}

//移除历史数据模拟
const removeLayer_621 = () => {
  const imageryLayers = viewer.value.scene.imageryLayers
  for (let i = imageryLayers.length - 1; i >= 0; i--) {
    const layer = imageryLayers.get(i)
    if (layer.historySimTag) {
      imageryLayers.remove(layer)
    }
  }
  ElMessage.success('历史数据模拟已移除')
}

// 历史未堵江点数据接口（点数据路径在此配置）
const NODUJIANG_DATA_URL = '/CS/json/select_nodujiang.geojson'
const DUJIANG_DATA_URL = '/CS/json/select_dujiang_glacier.geojson'

// 添加历史未堵江点（Cesium Entity 悬浮图标）
const addLayer_622 = () => {
  axios.get(NODUJIANG_DATA_URL).then(res => {
    const features = res.data.features
    console.log(`[历史未堵江点] 加载 ${features.length} 个点`)

    features.forEach(feature => {
      const [lon, lat] = feature.geometry.coordinates
      const props = feature.properties

      // 构建 Cesium InfoBox 描述 HTML（点击实体时自动弹出）
      const descFields = Object.entries(props)
        .map(([key, value]) => `<tr><th>${key}</th><td>${value ?? ''}</td></tr>`)
        .join('')
      const description = `<table style="width:100%">${descFields}</table>`

      const entity = viewer.value.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat),
        name: props.名称 || props.新编号 || '',
        description,
        billboard: {
          image: '/CS/img/positionBlue.png',
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: 32,
          height: 32,
        },
      })
      entity.noDujiangTag = true
    })

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
      orientation: {
        heading: Cesium.Math.toRadians(56.34),
        pitch: Cesium.Math.toRadians(-31),
        roll: 0.0,
      },
    })
    ElMessage.success('历史未堵江点加载完成')
  }).catch(error => {
    console.error('加载历史未堵江点失败:', error)
    ElMessage.error(`加载历史未堵江点失败: ${error.message || error}`)
  })
}

//移除历史未堵江点
const removeLayer_622 = () => {
  const entities = viewer.value.entities.values
  for (let i = entities.length - 1; i >= 0; i--) {
    if (entities[i].noDujiangTag) {
      viewer.value.entities.remove(entities[i])
    }
  }
  ElMessage.success('历史未堵江点已移除')
}

// ========== 堵江点图片弹窗 ==========
const DUJIANG_PHOTO_BASE = '/CS/img/dujiang_photos'

const showDujiangImagePopup = (imageUrl, title) => {
  closeDujiangImagePopup()
  const el = document.createElement('div')
  el.style.cssText = `
    position: fixed; bottom: 75px; left: 105px; z-index: 9999;
    background: rgba(0,0,0,0.85); border: 1px solid #38e1ff;
    border-radius: 8px; box-shadow: 0 0 10px 2px #29baf1;
    padding: 10px; min-width: 220px; min-height: 100px;
    resize: both; overflow: auto;
  `
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
      <span style="color:#fff;font-size:14px;font-weight:600;">${title}</span>
      <span id="dujiang-popup-close" style="color:#fff;cursor:pointer;font-size:16px;padding:0 6px;">X</span>
    </div>
    <img src="${imageUrl}" style="width:100%;max-width:800px;display:block;"
         onerror="this.style.display='none'" />
  `
  document.body.appendChild(el)
  el.querySelector('#dujiang-popup-close').onclick = closeDujiangImagePopup
  dujiangImagePopup.value = el
}

const closeDujiangImagePopup = () => {
  if (dujiangImagePopup.value) {
    dujiangImagePopup.value.remove()
    dujiangImagePopup.value = null
  }
}

const handleDujiangClick = movement => {
  const picked = viewer.value.scene.pick(movement.position)
  console.log('[堵江点] pick result:', picked)
  if (!Cesium.defined(picked) || !picked.id) return
  const entity = picked.id
  console.log('[堵江点] entity:', entity.name, 'dujiangTag:', entity.dujiangTag)
  if (!entity.dujiangTag) return
  const name = entity.name || ''
  const imageUrl = `${DUJIANG_PHOTO_BASE}/${name}.png`
  console.log('[堵江点] 显示图片:', imageUrl)
  showDujiangImagePopup(imageUrl, name)
}

//添加历史堵江点（Cesium Entity 悬浮图标）
const addLayer_623 = () => {
  axios.get(DUJIANG_DATA_URL).then(res => {
    const features = res.data.features
    console.log(`[历史堵江点] 加载 ${features.length} 个点`)

    features.forEach(feature => {
      const [lon, lat] = feature.geometry.coordinates
      const props = feature.properties

      const descFields = Object.entries(props)
        .map(([key, value]) => `<tr><th>${key}</th><td>${value ?? ''}</td></tr>`)
        .join('')
      const description = `<table style="width:100%">${descFields}</table>`

      const entity = viewer.value.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat),
        name: props.名称 || props.新编号 || '',
        description,
        billboard: {
          image: '/CS/img/positionBlue.png',
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: 32,
          height: 32,
        },
      })
      entity.dujiangTag = true
    })

    // 添加点击事件：点击堵江点弹出关联图片
    dujiangClickHandler.value = new Cesium.ScreenSpaceEventHandler(
      viewer.value.scene.canvas,
    )
    dujiangClickHandler.value.setInputAction(
      handleDujiangClick,
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    )

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
      orientation: {
        heading: Cesium.Math.toRadians(56.34),
        pitch: Cesium.Math.toRadians(-31),
        roll: 0.0,
      },
    })
    ElMessage.success('历史堵江点加载完成')
  }).catch(error => {
    console.error('加载历史堵江点失败:', error)
    ElMessage.error(`加载历史堵江点失败: ${error.message || error}`)
  })
}

//移除历史堵江点
const removeLayer_623 = () => {
  // 移除图片弹窗
  closeDujiangImagePopup()
  // 移除点击事件处理器
  if (dujiangClickHandler.value) {
    dujiangClickHandler.value.destroy()
    dujiangClickHandler.value = null
  }
  // 移除实体
  const entities = viewer.value.entities.values
  for (let i = entities.length - 1; i >= 0; i--) {
    if (entities[i].dujiangTag) {
      viewer.value.entities.remove(entities[i])
    }
  }
  ElMessage.success('历史堵江点已移除')
}

//添加滑坡人口脆弱性数据（GeoServer WMS）
const addLayer_HP_pop_Vulnerability = () => {
  try {
    const provider = createWmsProvider(HP_pop_Vulnerability, false)

    const layers = viewer.value.scene.imageryLayers
    const addedLayer = layers.addImageryProvider(provider)
    addedLayer.HP_pop_VulnerabilityTag = true

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
      orientation: {
        heading: Cesium.Math.toRadians(56.34),
        pitch: Cesium.Math.toRadians(-31),
        roll: 0.0,
      },
    })
    ElMessage.success('滑坡人口脆弱性数据加载完成')
  } catch (error) {
    console.error('滑坡人口脆弱性数据失败:', error)
    ElMessage.error(`滑坡人口脆弱性数据失败: ${error.message || error}`)
  }
}

//移除滑坡人口脆弱性数据
const removeLayer_HP_pop_Vulnerability = () => {
  const imageryLayers = viewer.value.scene.imageryLayers
  for (let i = imageryLayers.length - 1; i >= 0; i--) {
    const layer = imageryLayers.get(i)
    if (layer.HP_pop_VulnerabilityTag) {
      imageryLayers.remove(layer)
      break
    }
  }
  ElMessage.success('滑坡人口脆弱性数据已移除')
}

//添加泥石流人口脆弱性数据（GeoServer WMS）
const addLayer_NSL_pop_Vulnerability = () => {
  try {
    const provider = createWmsProvider(NSL_pop_Vulnerability, false)

    const layers = viewer.value.scene.imageryLayers
    const addedLayer = layers.addImageryProvider(provider)
    addedLayer.NSL_pop_VulnerabilityTag = true

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
      orientation: {
        heading: Cesium.Math.toRadians(56.34),
        pitch: Cesium.Math.toRadians(-31),
        roll: 0.0,
      },
    })
    ElMessage.success('泥石流人口脆弱性数据加载完成')
  } catch (error) {
    console.error('泥石流人口脆弱性数据失败:', error)
    ElMessage.error(`泥石流人口脆弱性数据失败: ${error.message || error}`)
  }
}

//移除泥石流人口脆弱性数据
const removeLayer_NSL_pop_Vulnerability = () => {
  const imageryLayers = viewer.value.scene.imageryLayers
  for (let i = imageryLayers.length - 1; i >= 0; i--) {
    const layer = imageryLayers.get(i)
    if (layer.NSL_pop_VulnerabilityTag) {
      imageryLayers.remove(layer)
      break
    }
  }
  ElMessage.success('泥石流人口脆弱性数据已移除')
}

//添加山洪人口脆弱性数据（GeoServer WMS）
const addLayer_SH_pop_Vulnerability = () => {
  try {
    const provider = createWmsProvider(SH_pop_Vulnerability, false)

    const layers = viewer.value.scene.imageryLayers
    const addedLayer = layers.addImageryProvider(provider)
    addedLayer.SH_pop_VulnerabilityTag = true

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
      orientation: {
        heading: Cesium.Math.toRadians(56.34),
        pitch: Cesium.Math.toRadians(-31),
        roll: 0.0,
      },
    })
    ElMessage.success('山洪人口脆弱性数据加载完成')
  } catch (error) {
    console.error('山洪人口脆弱性数据失败:', error)
    ElMessage.error(`山洪人口脆弱性数据失败: ${error.message || error}`)
  }
}

const removeLayer_SH_pop_Vulnerability = () => {
  const imageryLayers = viewer.value.scene.imageryLayers
  for (let i = imageryLayers.length - 1; i >= 0; i--) {
    const layer = imageryLayers.get(i)
    if (layer.SH_pop_VulnerabilityTag) {
      imageryLayers.remove(layer)
      break
    }
  }
  ElMessage.success('山洪人口脆弱性数据已移除')
}

//添加滑坡危险性数据（GeoServer WMS）
const addLayer_HP_Danger = () => {
  try {
    const provider = createWmsProvider(HP_Danger, false)

    const layers = viewer.value.scene.imageryLayers
    const addedLayer = layers.addImageryProvider(provider)
    addedLayer.HP_DangerTag = true

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
      orientation: {
        heading: Cesium.Math.toRadians(56.34),
        pitch: Cesium.Math.toRadians(-31),
        roll: 0.0,
      },
    })
    ElMessage.success('滑坡危险性数据加载完成')
  } catch (error) {
    console.error('滑坡危险性数据失败:', error)
    ElMessage.error(`滑坡危险性数据失败: ${error.message || error}`)
  }
}

const removeLayer_HP_Danger = () => {
  const imageryLayers = viewer.value.scene.imageryLayers
  for (let i = imageryLayers.length - 1; i >= 0; i--) {
    const layer = imageryLayers.get(i)
    if (layer.HP_DangerTag) {
      imageryLayers.remove(layer)
      break
    }
  }
  ElMessage.success('滑坡危险性数据已移除')
}

//添加泥石流危险性数据（GeoServer WMS）
const addLayer_NSL_Danger = () => {
  try {
    const provider = createWmsProvider(NSL_Danger, false)

    const layers = viewer.value.scene.imageryLayers
    const addedLayer = layers.addImageryProvider(provider)
    addedLayer.NSL_DangerTag = true

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
      orientation: {
        heading: Cesium.Math.toRadians(56.34),
        pitch: Cesium.Math.toRadians(-31),
        roll: 0.0,
      },
    })
    ElMessage.success('泥石流危险性数据加载完成')
  } catch (error) {
    console.error('泥石流危险性数据失败:', error)
    ElMessage.error(`泥石流危险性数据失败: ${error.message || error}`)
  }
}

const removeLayer_NSL_Danger = () => {
  const imageryLayers = viewer.value.scene.imageryLayers
  for (let i = imageryLayers.length - 1; i >= 0; i--) {
    const layer = imageryLayers.get(i)
    if (layer.NSL_DangerTag) {
      imageryLayers.remove(layer)
      break
    }
  }
  ElMessage.success('泥石流危险性数据已移除')
}

//添加山洪危险性数据（GeoServer WMS）
const addLayer_SH_Danger = () => {
  try {
    const provider = createWmsProvider(SH_Danger, false)

    const layers = viewer.value.scene.imageryLayers
    const addedLayer = layers.addImageryProvider(provider)
    addedLayer.SH_DangerTag = true

    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
      orientation: {
        heading: Cesium.Math.toRadians(56.34),
        pitch: Cesium.Math.toRadians(-31),
        roll: 0.0,
      },
    })
    ElMessage.success('山洪危险性数据加载完成')
  } catch (error) {
    console.error('山洪危险性数据失败:', error)
    ElMessage.error(`山洪危险性数据失败: ${error.message || error}`)
  }
}

const removeLayer_SH_Danger = () => {
  const imageryLayers = viewer.value.scene.imageryLayers
  for (let i = imageryLayers.length - 1; i >= 0; i--) {
    const layer = imageryLayers.get(i)
    if (layer.SH_DangerTag) {
      imageryLayers.remove(layer)
      break
    }
  }
  ElMessage.success('山洪危险性数据已移除')
}

// ========== 73 承载体分布 ==========
const addLayer_domestic_build = () => {
  try {
    const provider = createWmsProvider(domestic_build, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.domestic_buildTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('建筑物提取加载完成')
  } catch (error) { console.error('建筑物提取失败:', error); ElMessage.error(`建筑物提取失败: ${error.message || error}`) }
}
const removeLayer_domestic_build = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).domestic_buildTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('建筑物提取已移除')
}

const addLayer_linzhi_pop = () => {
  try {
    const provider = createWmsProvider(linzhi_pop, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.linzhi_popTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('人口提取加载完成')
  } catch (error) { console.error('人口提取失败:', error); ElMessage.error(`人口提取失败: ${error.message || error}`) }
}
const removeLayer_linzhi_pop = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).linzhi_popTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('人口提取已移除')
}

const addLayer_motuo_traffic = () => {
  try {
    const provider = createWmsProvider(motuo_traffic, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.motuo_trafficTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('交通流量预测加载完成')
  } catch (error) { console.error('交通流量预测失败:', error); ElMessage.error(`交通流量预测失败: ${error.message || error}`) }
}
const removeLayer_motuo_traffic = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).motuo_trafficTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('交通流量预测已移除')
}

// ========== 74 建筑物风险评估 ==========
const addLayer_build_one = () => {
  try {
    const provider = createWmsProvider(build_one, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.build_oneTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('1层建筑物脆弱性加载完成')
  } catch (error) { console.error('1层建筑物脆弱性失败:', error); ElMessage.error(`1层建筑物脆弱性失败: ${error.message || error}`) }
}
const removeLayer_build_one = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).build_oneTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('1层建筑物脆弱性已移除')
}

const addLayer_build_two = () => {
  try {
    const provider = createWmsProvider(build_two, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.build_twoTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('2层建筑物脆弱性加载完成')
  } catch (error) { console.error('2层建筑物脆弱性失败:', error); ElMessage.error(`2层建筑物脆弱性失败: ${error.message || error}`) }
}
const removeLayer_build_two = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).build_twoTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('2层建筑物脆弱性已移除')
}

const addLayer_build_three = () => {
  try {
    const provider = createWmsProvider(build_three, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.build_threeTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('3层建筑物脆弱性加载完成')
  } catch (error) { console.error('3层建筑物脆弱性失败:', error); ElMessage.error(`3层建筑物脆弱性失败: ${error.message || error}`) }
}
const removeLayer_build_three = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).build_threeTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('3层建筑物脆弱性已移除')
}

const addLayer_build_masonry = () => {
  try {
    const provider = createWmsProvider(build_masonry, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.build_masonryTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('砌体建筑物脆弱性加载完成')
  } catch (error) { console.error('砌体建筑物脆弱性失败:', error); ElMessage.error(`砌体建筑物脆弱性失败: ${error.message || error}`) }
}
const removeLayer_build_masonry = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).build_masonryTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('砌体建筑物脆弱性已移除')
}

const addLayer_building_risk = () => {
  try {
    const provider = createWmsProvider(building_risk, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.building_riskTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('总体建筑物脆弱性加载完成')
  } catch (error) { console.error('总体建筑物脆弱性失败:', error); ElMessage.error(`总体建筑物脆弱性失败: ${error.message || error}`) }
}
const removeLayer_building_risk = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).building_riskTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('总体建筑物脆弱性已移除')
}

// ========== 75 道路风险评估 ==========
const addLayer_roadrisk_h = () => {
  try {
    const provider = createWmsProvider(roadrisk_h, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.roadrisk_hTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('高等级道路加载完成')
  } catch (error) { console.error('高等级道路失败:', error); ElMessage.error(`高等级道路失败: ${error.message || error}`) }
}
const removeLayer_roadrisk_h = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).roadrisk_hTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('高等级道路已移除')
}

const addLayer_roadrisk_m = () => {
  try {
    const provider = createWmsProvider(roadrisk_m, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.roadrisk_mTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('次等级道路加载完成')
  } catch (error) { console.error('次等级道路失败:', error); ElMessage.error(`次等级道路失败: ${error.message || error}`) }
}
const removeLayer_roadrisk_m = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).roadrisk_mTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('次等级道路已移除')
}

const addLayer_roadrisk_s = () => {
  try {
    const provider = createWmsProvider(roadrisk_s, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.roadrisk_sTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('简单道路加载完成')
  } catch (error) { console.error('简单道路失败:', error); ElMessage.error(`简单道路失败: ${error.message || error}`) }
}
const removeLayer_roadrisk_s = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).roadrisk_sTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('简单道路已移除')
}

const addLayer_road_risk = () => {
  try {
    const provider = createWmsProvider(road_risk, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.road_riskTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('总体道路加载完成')
  } catch (error) { console.error('总体道路失败:', error); ElMessage.error(`总体道路失败: ${error.message || error}`) }
}
const removeLayer_road_risk = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).road_riskTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('总体道路已移除')
}

// ========== 76 桥梁风险评估 ==========
const addLayer_bridge_d = () => {
  try {
    const provider = createWmsProvider(bridge_d, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.bridge_dTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('双柱式桥梁脆弱性加载完成')
  } catch (error) { console.error('双柱式桥梁脆弱性失败:', error); ElMessage.error(`双柱式桥梁脆弱性失败: ${error.message || error}`) }
}
const removeLayer_bridge_d = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).bridge_dTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('双柱式桥梁脆弱性已移除')
}

const addLayer_bridge_s = () => {
  try {
    const provider = createWmsProvider(bridge_s, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.bridge_sTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('单柱式桥梁脆弱性加载完成')
  } catch (error) { console.error('单柱式桥梁脆弱性失败:', error); ElMessage.error(`单柱式桥梁脆弱性失败: ${error.message || error}`) }
}
const removeLayer_bridge_s = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).bridge_sTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('单柱式桥梁脆弱性已移除')
}

const addLayer_bridge = () => {
  try {
    const provider = createWmsProvider(bridge, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.bridgeTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('总体桥梁脆弱性加载完成')
  } catch (error) { console.error('总体桥梁脆弱性失败:', error); ElMessage.error(`总体桥梁脆弱性失败: ${error.message || error}`) }
}
const removeLayer_bridge = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).bridgeTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('总体桥梁脆弱性已移除')
}

// ========== 77 人口风险评估 ==========
const addLayer_pop_risk = () => {
  try {
    const provider = createWmsProvider(pop_risk, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.pop_riskTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('人口风险评估加载完成')
  } catch (error) { console.error('人口风险评估失败:', error); ElMessage.error(`人口风险评估失败: ${error.message || error}`) }
}
const removeLayer_pop_risk = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).pop_riskTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('人口风险评估已移除')
}

// ========== 78 危险性评估 ==========
const addLayer_linzi_hazard = () => {
  try {
    const provider = createWmsProvider(linzi_hazard, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.linzi_hazardTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('区域危险性评估加载完成')
  } catch (error) { console.error('区域危险性评估失败:', error); ElMessage.error(`区域危险性评估失败: ${error.message || error}`) }
}
const removeLayer_linzi_hazard = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).linzi_hazardTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('区域危险性评估已移除')
}

const addLayer_yigong_hazard = () => {
  try {
    const provider = createWmsProvider(yigong_hazard, false)
    const addedLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
    addedLayer.yigong_hazardTag = true
    viewer.value.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299), orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 } })
    ElMessage.success('点危险性评估加载完成')
  } catch (error) { console.error('点危险性评估失败:', error); ElMessage.error(`点危险性评估失败: ${error.message || error}`) }
}
const removeLayer_yigong_hazard = () => {
  const layers = viewer.value.scene.imageryLayers
  for (let i = layers.length - 1; i >= 0; i--) { if (layers.get(i).yigong_hazardTag) { layers.remove(layers.get(i)); break } }
  ElMessage.success('点危险性评估已移除')
}

//加载气象站（仅林芝市）
// [旧逻辑保留] 原实现渲染全部站点（全国）；现按需求仅渲染林芝市站点，
// 如需恢复全国渲染：删除下方 LINZHI_COUNTY_NAMES 判断即可（其余逻辑未变）。
const LINZHI_COUNTY_NAMES = [
  '林芝县',
  '林芝市',
  '巴宜区',
  '工布江达县',
  '米林县',
  '米林市',
  '墨脱县',
  '波密县',
  '察隅县',
  '朗县',
]
const addLayer_weatherstation = () => {
  // [新增] 接口仅返回林芝市站点；下方白名单过滤保留作兜底
  axios.get('/node/weatherstation?scope=linzhi').then(res => {
    const stations = res.data
    // 1. 创建数据源
    const stationDataSource = new Cesium.CustomDataSource('weatherStations')
    viewer.value.dataSources.add(stationDataSource)
    // 2. 处理每个气象站（仅保留林芝市站点）
    stations.forEach(station => {
      // [旧逻辑保留] 原来此处直接渲染全部站点；现仅保留林芝市站点
      if (!LINZHI_COUNTY_NAMES.includes(String(station.COUNTYNAME || '').trim())) return
      // 解析几何坐标（WKB Point），失败时回退使用 LON/LAT 字段
      let lon = parseFloat(station.LON)
      let lat = parseFloat(station.LAT)
      try {
        const geom = parseWKB(station.geom)
        if (geom?.type === 'Point' && Array.isArray(geom.coordinates)) {
          lon = geom.coordinates[0]
          lat = geom.coordinates[1]
        }
      } catch (e) {
        // geom 解析失败时保持使用 LON/LAT
      }
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) return
      // 创建实体（properties 供点击弹窗展示，字段与数据表一致）
      stationDataSource.entities.add({
        name: station.NAME,
        position: Cesium.Cartesian3.fromDegrees(lon, lat),
        properties: {
          SID: station.SID,
          ID: station.ID,
          NAME: station.NAME,
          COUNTYNAME: station.COUNTYNAME,
          HEIGHT: station.HEIGHT,
          TIMES: station.TIMES,
          RAIN: station.RAIN,
          SUN: station.SUN,
          TEMPE: station.TEMPE,
          TYPES: station.TYPES,
          COMMENT: station.COMMENT,
        },
        point: {
          pixelSize: 6,
          color: getColorByType(station.TYPES), // 按类型着色
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 1,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        label: {
          text: station.NAME,
          font: '12px sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -10),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      })
    })

    // 相机飞到林芝市范围（[旧逻辑保留] 原为全国视角 109.54/32.90/10000000，恢复全国渲染时可改回）
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(95.9, 29.3, 450000),
      //相机的姿态
      orientation: {
        heading: Cesium.Math.toRadians(0), //朝向
        pitch: Cesium.Math.toRadians(-90), //俯仰
        roll: 0.0, //滚转
      },
    })
  })

  // 3. 添加点击事件（setInputAction 返回 undefined，不能链式 .catch）
  const layerwsClickHandler = new Cesium.ScreenSpaceEventHandler(
    viewer.value.scene.canvas,
  )
  try {
    layerwsClickHandler.setInputAction(
      handleLayerwsClick,
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    )
  } catch (error) {
    console.error('注册气象站点击事件失败:', error)
  }
}
const handleLayerwsClick = async event => {
  // 获取点击位置
  const pickedFeature = viewer.value.scene.pick(event.position)
  if (!pickedFeature || !pickedFeature.id) return
  const entity = pickedFeature.id
  const currentTime = viewer.value.clock.currentTime
  // 从实体 properties 读取字段（旧代码字段名与数据源不一致，此处已修正）
  const getProp = key => {
    const value = entity.properties?.[key]?.getValue?.(currentTime)
    return value === undefined || value === null || value === '' ? '无数据' : value
  }
  const stationName = getProp('NAME')
  const stationId = getProp('ID') === '无数据' ? '' : String(getProp('ID'))
  const fmtValue = (v, unit) =>
    v === null || v === undefined ? '无数据' : `${v}${unit}`

  // 实时气象弹窗：按需求只保留 时间/站点名称/温度/风速/湿度/降水
  let realtimeItems = [
    { name: '时间', value: '无数据' },
    { name: '站点名称', value: stationName },
  ]
  if (stationId) {
    try {
      const resp = await axios.get('/node/weather/realtime', {
        params: { station: stationId },
      })
      if (resp.data?.found) {
        const ob = resp.data.observation
        realtimeItems = [
          { name: '时间', value: ob.obs_time_display || '无数据' },
          { name: '站点名称', value: stationName },
          { name: '温度', value: fmtValue(ob.temperature_c, '℃') },
          { name: '风速', value: fmtValue(ob.wind_speed_ms, 'm/s') },
          { name: '湿度', value: fmtValue(ob.humidity_pct, '%') },
          { name: '降水', value: fmtValue(ob.precipitation_mm, 'mm') },
        ]
      } else {
        realtimeItems = [
          { name: '时间', value: '暂无数据（等待采集器运行）' },
          { name: '站点名称', value: stationName },
        ]
      }
    } catch (error) {
      console.error('获取实时气象数据失败:', error)
      realtimeItems = [
        { name: '时间', value: '获取失败' },
        { name: '站点名称', value: stationName },
      ]
    }
  }

  const opts = {
    viewer,
    position: {
      _value:
        entity.position?.getValue?.(currentTime) ??
        pickedFeature.primitive?.position,
    },
    title: stationName,
    content: realtimeItems,
  }

  // 关闭现有弹窗并打开新弹窗
  if (dialogs.value) {
    dialogs.value.windowClose()
  }
  dialogs.value = new Dialog(opts)

  // 近 7 天气象数据表格弹窗（新增，3 小时间隔聚合）
  openWeatherTable(stationId, stationName)
}

// 近 7 天气象数据表格弹窗（3 小时间隔聚合，数据来自采集器的 /weather/history）
const openWeatherTable = async (stationId, stationName) => {
  weatherTableTitle.value = `${stationName} · 近 7 天气象数据（3 小时间隔）`
  weatherTableRows.value = []
  weatherTableVisible.value = true
  if (!stationId) {
    renderWeatherChart()
    return
  }
  weatherTableLoading.value = true
  try {
    const resp = await axios.get('/node/weather/history', {
      params: { station: stationId, days: 7 },
    })
    weatherTableRows.value = resp.data?.rows || []
  } catch (error) {
    console.error('获取近 7 天气象数据失败:', error)
    weatherTableRows.value = []
  } finally {
    weatherTableLoading.value = false
  }
  await renderWeatherChart()
}

// [新增] 近 7 天气象趋势折线图：温度/风速（左轴）、湿度/降水（右轴）
const renderWeatherChart = async () => {
  await nextTick()
  if (!weatherChartRef.value) {
    // el-dialog 首次打开有过渡动画，容器可能稍晚挂载
    await new Promise(resolve => setTimeout(resolve, 150))
  }
  const el = weatherChartRef.value
  if (!el) return
  if (!weatherChartInstance) {
    weatherChartInstance = echarts.init(el)
  }
  const rows = weatherTableRows.value || []
  const num = v => (v === null || v === undefined || v === '' ? null : Number(v))
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: '#e8f1fb' } },
    grid: { left: 48, right: 52, top: 36, bottom: 30 },
    xAxis: {
      type: 'category',
      data: rows.map(r => r.time_label),
      boundaryGap: false,
      axisLabel: { color: '#a9bed4' },
      axisLine: { lineStyle: { color: '#3c4f66' } },
    },
    yAxis: [
      {
        type: 'value',
        name: '温度/风速',
        nameTextStyle: { color: '#a9bed4' },
        axisLabel: { color: '#a9bed4' },
        splitLine: { lineStyle: { color: 'rgba(120,150,180,0.18)' } },
      },
      {
        type: 'value',
        name: '湿度/降水',
        nameTextStyle: { color: '#a9bed4' },
        axisLabel: { color: '#a9bed4' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '温度(°C)',
        type: 'line',
        smooth: true,
        symbolSize: 4,
        data: rows.map(r => num(r.temperature_c)),
        itemStyle: { color: '#ffb454' },
      },
      {
        name: '湿度(%)',
        type: 'line',
        smooth: true,
        symbolSize: 4,
        yAxisIndex: 1,
        data: rows.map(r => num(r.humidity_pct)),
        itemStyle: { color: '#4fc3f7' },
      },
      {
        name: '风速(m/s)',
        type: 'line',
        smooth: true,
        symbolSize: 4,
        data: rows.map(r => num(r.wind_speed_ms)),
        itemStyle: { color: '#a29bfe' },
      },
      {
        name: '降水(mm)',
        type: 'line',
        smooth: true,
        symbolSize: 4,
        yAxisIndex: 1,
        data: rows.map(r => num(r.precipitation_mm)),
        itemStyle: { color: '#5ee7a0' },
        areaStyle: { opacity: 0.08 },
      },
    ],
  }
  weatherChartInstance.setOption(option, true)
  weatherChartInstance.resize()
}

// [新增] 弹窗完全打开后再自适应一次尺寸
const onWeatherDialogOpened = () => {
  if (weatherChartInstance) weatherChartInstance.resize()
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
    撤消: Cesium.Color.GRAY, // 原表中存在的历史台站状态
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
      `/device/latest/${deviceId}`,
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
    console.log('[loadHeatmap] 帧', index, '加载完成 primitive:', !!heatmapPrimitive, '总数:', viewer.value.scene.primitives.length)
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
  stopHeatmapCycle()
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

// [新增] 距离测量：再次点击退出并清除；与面积测量互斥；实例复用避免事件泄漏
const measure = () => {
  if (!viewer.value) return
  if (activeMeasureTool.value === 'distance') {
    md.value?.deactivate?.()
    md.value?.clear?.()
    activeMeasureTool.value = ''
    ElMessage({ message: '已退出距离测量并清除结果', type: 'info' })
    return
  }
  if (activeMeasureTool.value === 'area') {
    areaMeasureInstance?.deactivate?.()
    areaMeasureInstance?.clear?.()
    activeMeasureTool.value = ''
  }
  if (!md.value) md.value = new MeasureDistance(viewer.value)
  md.value.clear?.()
  md.value.activate()
  activeMeasureTool.value = 'distance'
  ElMessage({ message: '距离测量已开启：左键加点，右键结束', type: 'success' })
}

// [新增] 面积测量：再次点击退出并清除；与距离测量互斥；实例复用避免事件泄漏
const polygon = () => {
  if (!viewer.value) return
  if (activeMeasureTool.value === 'area') {
    areaMeasureInstance?.deactivate?.()
    areaMeasureInstance?.clear?.()
    activeMeasureTool.value = ''
    ElMessage({ message: '已退出面积测量并清除结果', type: 'info' })
    return
  }
  if (activeMeasureTool.value === 'distance') {
    md.value?.deactivate?.()
    md.value?.clear?.()
    activeMeasureTool.value = ''
  }
  if (!areaMeasureInstance) areaMeasureInstance = new MeasureManager(viewer.value)
  areaMeasureInstance.clear?.()
  areaMeasureInstance.measurePolygon()
  activeMeasureTool.value = 'area'
  ElMessage({ message: '面积测量已开启：左键加点，右键结束', type: 'success' })
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
// [新增] 复用拾取处理器：重复点击"添加属性"时销毁上一个，避免事件泄漏
let attrPickHandler = null
const addattribute = () => {
  if (!viewer.value) return
  if (attrPickHandler) {
    try { attrPickHandler.destroy() } catch (e) {}
    attrPickHandler = null
  }
  ElMessage({ message: '请在地图上单击选择要添加属性的位置', type: 'info' })
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas)
  attrPickHandler = handler
  handler.setInputAction(e => {
    //转换坐标到三维场景
    const ray = viewer.value.camera.getPickRay(e.position)
    const position = ray ? viewer.value.scene.globe.pick(ray, viewer.value.scene) : null
    if (!position) {
      ElMessage({ message: '未拾取到地表位置，请在地球表面重新点击', type: 'warning' })
      return
    }
    const cart = Cesium.Cartographic.fromCartesian(position)
    //经纬度
    const longitude = Cesium.Math.toDegrees(cart.longitude)
    const latitude = Cesium.Math.toDegrees(cart.latitude)
    form.longitude = Number(longitude.toFixed(6))
    form.latitude = Number(latitude.toFixed(6))
    position_point.value = position
    // 自动移除事件监听（单次点击模式）
    handler.destroy()
    attrPickHandler = null
    dialogVisible_disaster.value = true
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
}
const submit_disaster = () => {
  if (!String(form.name || '').trim()) {
    ElMessage({ message: '请填写名称后再提交', type: 'warning' })
    return
  }
  if (!position_point.value) {
    ElMessage({ message: '请先在地图上点击选择位置', type: 'warning' })
    return
  }
  dialogVisible_disaster.value = false
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
      // 后端返回 201 Created，按 2xx 统一判定成功
      if (res.status >= 200 && res.status < 300) {
        // 落库成功后再在地图上落点，避免失败时留下孤立标记
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
        ElMessage({ message: '灾害点添加成功', type: 'success' })
        // 重置表单，便于继续添加下一个点
        Object.assign(form, {
          name: '',
          dcmd: '',
          lssl: '',
          slope: '',
          hlxqsl: '',
          pthhsmj: '',
          elevation: '',
          scale: '',
          longitude: '',
          latitude: '',
        })
        position_point.value = null
      } else {
        ElMessage({
          message: '添加失败：' + (res.data?.message || '未知错误'),
          type: 'error',
        })
      }
    })
    .catch(err => {
      ElMessage({ message: '添加失败：网络或服务错误', type: 'error' })
      console.log(err)
    })
}

// [新增] 查询属性标记点管理：每次查询前清除上一次的标记，避免叠加
const searchMarkerEntities = []
const clearSearchMarkers = () => {
  if (!viewer.value) return
  while (searchMarkerEntities.length) {
    const ent = searchMarkerEntities.pop()
    try {
      viewer.value.entities.remove(ent)
    } catch (e) {}
  }
}
const addSearchMarker = (lng, lat) => {
  const ent = viewer.value.entities.add({
    position: Cesium.Cartesian3.fromDegrees(lng, lat),
    billboard: {
      image: '/ng/position.png',
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY, // 确保始终可见
      width: 48,
      height: 48,
    },
  })
  searchMarkerEntities.push(ent)
  return ent
}

// [新增] 清空查询条件
const clearSearchCondition = () => {
  form_disastersearch.location = '林芝市'
  form_disastersearch.attribute = '地点'
  form_disastersearch.attributevalue = ''
}

// [新增] 查询失败统一提示：404=无数据、400=参数不合法、其它=服务错误
const handleQueryError = (err, label = '数据') => {
  const status = err?.response?.status
  if (status === 404) {
    ElMessage({ message: `未查询到${label}`, type: 'warning' })
  } else if (status === 400) {
    ElMessage({ message: '查询条件不合法，请检查后重试', type: 'warning' })
  } else {
    ElMessage({ message: '查询失败：服务或网络错误', type: 'error' })
  }
  console.log(err)
}

// [新增] 属性查询输入提示：不同属性的取值示例不同
const attributeValueHint = () => {
  const a = form_disastersearch.attribute
  if (a === '地点') return '请输入完整名称，如：林芝市'
  if (a === 'slope') return '请输入坡度数值，如：35'
  if (a === 'scale') return '请输入规模取值：small / middle / big / heavy'
  return '请输入查询值'
}

// [新增] 属性查询前校验：必须选择属性并填写查询值
const validateAttrSearch = () => {
  if (!form_disastersearch.attribute) {
    ElMessage({ message: '请选择查询属性', type: 'warning' })
    return false
  }
  if (!String(form_disastersearch.attributevalue || '').trim()) {
    ElMessage({ message: '请输入查询值', type: 'warning' })
    return false
  }
  return true
}

//灾害点查询(打开属性框)
const searchdisaster = () => {
  dialogVisible_searchdisaster.value = true
}

//位置查询
const locationsearch = () => {
  dialogVisible_searchdisaster.value = false
  clearSearchMarkers()
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
          addSearchMarker(item.lng, item.lat)
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
        ElMessage({ message: '未查询到数据', type: 'warning' })
      }
      if (data.length > 0) {
        viewer.value.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            data[0].lng,
            data[0].lat,
            50000,
          ),
        })
        dialogVisible_checkattribute.value = true
      }
    })
    .catch(err => handleQueryError(err, '灾害点数据'))
}
const search_dis_location = () => {
  console.log(tableData.value)
}
const locationsearchqxz = () => {
  dialogVisible_searchdisaster.value = false
  clearSearchMarkers()
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
          addSearchMarker(item.lng, item.lat)
          // 2. 格式化表格数据
          tableData_qxz.value.push({
            z_name: item.z_name || '--', // 处理空值
            jyl: item.jyl || '--',
            wind: item.wind || '--',
          })
        })
      } else {
        ElMessage({ message: '未查询到数据', type: 'warning' })
      }
      if (data.length > 0) {
        viewer.value.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            data[0].lng,
            data[0].lat,
            50000,
          ),
        })
        dialogVisible_checkqxz.value = true
      }
    })
    .catch(err => handleQueryError(err, '气象站数据'))
}
//属性查询
const attributesearch_disaster = () => {
  if (!validateAttrSearch()) return
  dialogVisible_searchdisaster.value = false
  clearSearchMarkers()
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
          addSearchMarker(item.lng, item.lat)
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
        ElMessage({ message: '未查询到数据', type: 'warning' })
      }
      if (data.length > 0) {
        viewer.value.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            data[0].lng,
            data[0].lat,
            50000,
          ),
        })
        dialogVisible_checkattribute.value = true
      }
    })
    .catch(err => handleQueryError(err, '灾害点数据'))
}
const attributesearch_qxz = () => {
  if (!validateAttrSearch()) return
  dialogVisible_searchdisaster.value = false
  clearSearchMarkers()
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
          addSearchMarker(item.lng, item.lat)
          // 2. 格式化表格数据
          tableData_qxz.value.push({
            z_name: item.z_name || '--', // 处理空值
            jyl: item.jyl || '--',
            wind: item.wind || '--',
          })
        })
      } else {
        ElMessage({ message: '未查询到数据', type: 'warning' })
      }
      if (data.length > 0) {
        viewer.value.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            data[0].lng,
            data[0].lat,
            50000,
          ),
        })
        dialogVisible_checkqxz.value = true
      }
    })
    .catch(err => handleQueryError(err, '气象站数据'))
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
  // 4. 移除旧式图层
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
  // 5. 移除所有模拟相关的 DataSource
  removeAllSimulationDataSources()
  // 6. 清空所有实体
  viewer.value.entities.removeAll()
  // 7. 移除所有 GeoServer WMS 影像图层（保留 Cesium 内置图层）
  const imLayers = viewer.value.scene.imageryLayers
  for (let i = imLayers.length - 1; i >= 0; i--) {
    const layer = imLayers.get(i)
    if (layer.imageryProvider?.url?.includes('/geoserver/')) {
      imLayers.remove(layer)
    }
  }
  // 8. 移除 SDP 结果图层
  const imLayers2 = viewer.value.scene.imageryLayers
  for (let i = imLayers2.length - 1; i >= 0; i--) {
    const layer = imLayers2.get(i)
    if (layer.sdpResultTag) {
      imLayers2.remove(layer)
    }
  }
  if (sdpLegendEl) { sdpLegendEl.remove(); sdpLegendEl = null }
  // 9. 移除全域风险结果图层及图例
  if (fullRiskResultLayer && !fullRiskResultLayer.isDestroyed?.()) {
    try { viewer.value.scene.imageryLayers.remove(fullRiskResultLayer) } catch (e) {}
    fullRiskResultLayer = null
  }
  if (fullRiskLegendEl) { fullRiskLegendEl.remove(); fullRiskLegendEl = null }
  // 9. 关闭 UI 状态
  squareStore.closeSquare()
  squareStore.closeRisk()
  // 10. 移除事件
  if (handler_seismic.value && typeof handler_seismic.value.destroy === 'function') {
    handler_seismic.value.destroy()
  }
  handler_seismic.value = ''
  if (fosChartDom) { fosChartDom.remove(); fosChartDom = null }
  if (fosChartExpr) { fosChartExpr.dispose(); fosChartExpr = null }
  const bedE = viewer.value.entities.getById('bedding_avainit')
  if (bedE) viewer.value.entities.remove(bedE)
  // 11. 停止测量工具并清除测量图形
  try {
    md.value?.deactivate?.()
    md.value?.clear?.()
    areaMeasureInstance?.deactivate?.()
    areaMeasureInstance?.clear?.()
  } catch (e) {}
  activeMeasureTool.value = ''
  // 12. 清除"查询属性"添加的标记点
  clearSearchMarkers()
  // 13. 销毁"添加属性"的拾取处理器
  if (attrPickHandler) {
    try { attrPickHandler.destroy() } catch (e) {}
    attrPickHandler = null
  }
}
const handler_seismic = ref('')
var echarts_data = ''
const seismicIsDL = ref(false)
function handleSeismicResult(payload) {
  try {
    seismicIsDL.value = !!payload?.isDL
    echarts_data = payload.echarts_data
    const detected = payload?.detected
    const lon = Number(payload?.lon) || 97.5
    const lat = Number(payload?.lat) || 30.5
    const imageUrl = detected ? '/CS/img/warning_red.png' : '/CS/img/safe.png' // 统一大小写路径
    viewer.value.entities.add({
      // id: `seismic_${Date.now()}`,
      id: 'seismic',
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
      destination: Cesium.Cartesian3.fromDegrees(lon, lat - 0.05, 10000), // 高度可按需调整
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
    //监听seismic鼠标点击事件,
    handler_seismic.value = new Cesium.ScreenSpaceEventHandler(
      viewer.value.scene.canvas,
    )
    handler_seismic.value.setInputAction(e => {
      //获取点击位置
      // console.log(echarts_data)
      const pick = viewer.value.scene.pick(e.position)
      // console.log(pick.id._id)
      if (pick.id._id == 'seismic') {
        console.log(echarts_data)
        //绘制图表
        drawSeismicChart()
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  } catch (e) {
    console.error('handleSeismicResult error', e)
  }
}

// 全域风险脆弱性分析结果处理
let fullRiskResultLayer = null // 结果 WMS 图层引用
let fullRiskLegendEl = null    // 图例 DOM 元素

const handleFullRiskAnalysis = () => {
  console.log('[全域风险脆弱性分析] 开始加载结果图层')
  // 移除旧的结果图层
  if (fullRiskResultLayer && !fullRiskResultLayer.isDestroyed?.()) {
    viewer.value.scene.imageryLayers.remove(fullRiskResultLayer)
    fullRiskResultLayer = null
  }
  if (fullRiskLegendEl) { fullRiskLegendEl.remove(); fullRiskLegendEl = null }

  try {
    const provider = createWmsProvider(FULL_RISK_RESULT_LAYER, false)
    fullRiskResultLayer = viewer.value.scene.imageryLayers.addImageryProvider(provider)
  } catch (e) {
    console.error('加载结果图层失败:', e)
  }

  // 绘制风险图例（SLD ColorMap）
  const colors = [
    { color: '#eee400', label: 'Low', range: '≤0.42' },
    { color: '#eea200', label: 'Medium', range: '0.42-0.70' },
    { color: '#f08200', label: 'Medium-High', range: '0.70-0.86' },
    { color: '#f34a00', label: 'High', range: '0.86-1.12' },
  ]
  fullRiskLegendEl = document.createElement('div')
  fullRiskLegendEl.style.cssText = 'position:fixed;bottom:30px;left:30px;z-index:999;background:rgba(0,0,0,0.8);border:1px solid #38e1ff;border-radius:6px;padding:10px 14px;color:#fff;font-size:12px;'
  fullRiskLegendEl.innerHTML = `
    <div style="font-weight:600;margin-bottom:6px;color:#38e1ff">全域风险脆弱性</div>
    ${colors.map(c => `
      <div style="display:flex;align-items:center;gap:8px;margin:3px 0">
        <span style="width:20px;height:14px;background:${c.color};border-radius:2px;flex-shrink:0"></span>
        <span style="min-width:80px">${c.label}</span>
        <span style="color:#999;font-size:11px">${c.range}</span>
      </div>
    `).join('')}
    <div id="quanyu-legend-close" style="position:absolute;top:2px;right:8px;cursor:pointer;color:#999">×</div>
  `
  document.body.appendChild(fullRiskLegendEl)
  fullRiskLegendEl.querySelector('#quanyu-legend-close').onclick = () => {
    if (fullRiskResultLayer) { viewer.value.scene.imageryLayers.remove(fullRiskResultLayer); fullRiskResultLayer = null }
    fullRiskLegendEl.remove(); fullRiskLegendEl = null
  }

  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(94.8845, 29.697148, 7299),
    orientation: { heading: Cesium.Math.toRadians(56.34), pitch: Cesium.Math.toRadians(-31), roll: 0.0 },
  })
}
//使用echart绘制seismic图表
let seismic_chart = null
function drawSeismicChart(d) {
  // console.log(d)
  const dataType = d || 'data'
  let seismic_data
  switch (dataType) {
    case 'data':
      seismic_data = echarts_data.data
      break
    case 'ratio':
      seismic_data = echarts_data.ratio
      break
    case 'result':
      seismic_data = echarts_data.result_array
      break
    default:
      seismic_data = echarts_data.data // 默认使用 data
  }
  // console.log(seismic_data)
  // 检查数据是否存在
  if (!seismic_data || !Array.isArray(seismic_data)) {
    console.error('数据不存在或格式错误')
    return
  }
  drawer.value = true
  // console.log(echarts_data.data)
  nextTick(() => {
    const seismic_container = document.getElementById('seismic-chart')

    // 检查 DOM 元素是否存在
    if (seismic_container) {
      try {
        seismic_chart = echarts.init(seismic_container)

        // 配置图表
        const option = {
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%']
            },
          },
          title: {
            left: 'center',
            text: `${dataType === 'data' ? '地震仪原数据' : dataType === 'ratio' ? '比率' : '结果'}`,
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: 'none',
              },
              restore: {},
              saveAsImage: {},
            },
          },
          xAxis: {
            name: 'x',
            type: 'category',
            minorTick: {
              show: true,
            },
          },
          yAxis: {
            name: 'y',

            minorTick: {
              show: true,
            },
          },
          series: [
            {
              name: `${dataType === 'data' ? '地震仪原数据' : dataType === 'ratio' ? '比率' : '结果'}`,
              type: 'line',
              smooth: false,
              symbol: 'none',
              areaStyle: {},
              data: seismic_data.map((item, index) => [index, item]), // 使用索引作为 x 轴
            },
          ],
        }

        seismic_chart.setOption(option)
      } catch (error) {
        console.error('ECharts 初始化失败:', error)
      }
    } else {
      console.error('DOM 元素不存在')
    }
  })
}
function drawer_seismic(data) {
  // console.log('点击事件的：', data)
  const seismic = document.getElementById('seismic-chart')
  if (seismic) {
    seismic_chart.dispose()
    // console.log('销毁图表')
  }
  drawSeismicChart(data)
}
onBeforeUnmount(() => {
  if (weatherChartInstance) {
    weatherChartInstance.dispose()
    weatherChartInstance = null
  }
  cleanupBetaRenderer()
  if (forecastHandler) {
    forecastHandler.destroy()
    forecastHandler = null
  }
  forecastEntityId = null
  if (displacementChart) {
    displacementChart.dispose()
    displacementChart = null
  }
})
</script>
<style lang="scss" scoped>
.map-legend {
  position: absolute;
  right: 372px;
  bottom: 26px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 190px;
  padding: 12px 14px;
  background: rgba(8, 24, 46, 0.78);
  border: 1px solid rgba(96, 156, 224, 0.45);
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}
.map-legend .legend-title {
  color: #e8f1fb;
  font-size: 13px;
  margin-bottom: 6px;
}
.map-legend .legend-unit {
  color: #9fb8d4;
  font-size: 12px;
}
.map-legend .legend-bar {
  width: 100%;
  height: 12px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.25);
}
.map-legend .legend-ticks {
  display: flex;
  justify-content: space-between;
  color: #b9cbe0;
  font-size: 11px;
  margin-top: 3px;
}

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
