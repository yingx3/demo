<template>
  <div class="left">
    <div class="name">数值计算模型集</div>
    <div class="total_theme">
      <div class="theme">
        <div class="title">发育规律与风险源判识</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>冰川泥石流、冰岩崩孕灾条件分析模型</span>
        </div>
        <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>增温冻融土边坡稳定性预测模型</span>
        </div>
        <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>冰碛土滑坡/泥石流运动过程模型</span>
        </div>
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisible = true"
            ><span>风险源定量识别与表征模型</span></el-button
          >
          <el-dialog
            v-model="dialogVisible"
            title="风险源定量识别与表征模型"
            width="500"
            :close-on-click-modal="false"
            class="dialog_trigrs"
          >
            <p id="name_par">模型参数</p>

            <el-form
              :model="form"
              label-width="auto"
              style="max-width: 600px"
              class="form_trigrs"
            >
              <el-form-item label="地点" class="form1_trigrs">
                <el-input v-model="form.name" placeholder="林芝市" />
              </el-form-item>
              <el-form-item label="色带" class="form2_trigrs">
                <el-select v-model="form.color" placeholder="危险等级">
                  <el-option label="危险等级" value="dangerLevel" />
                  <el-option label="灰度" value="gray" />
                  <el-option label="红绿蓝" value="rgb" />
                  <el-option label="红色渐变" value="redGradient" />
                </el-select>
              </el-form-item>
              <el-form-item label="预测时间" class="from3_trigrs">
                <div>
                  <el-checkbox-group v-model="form.time">
                    <el-checkbox :label="'3h'" :value="10800">3h</el-checkbox>
                    <el-checkbox :label="'6h'" :value="21600">6h</el-checkbox>
                    <el-checkbox :label="'12h'" :value="43200">12h</el-checkbox>
                    <el-checkbox :label="'24h'" :value="86400">24h</el-checkbox>
                    <el-checkbox :label="'48h'" :value="172800"
                      >48h</el-checkbox
                    >
                    <el-checkbox :label="'60h'" :value="216000"
                      >60h</el-checkbox
                    >
                  </el-checkbox-group>
                </div>
              </el-form-item>
              <el-form-item label="入渗率" class="form4_trigrs">
                <el-input v-model="form.rsl" placeholder="1.0e-6" />
              </el-form-item>
              <el-form-item label="初始地下水位">
                <el-input v-model="form.depth" placeholder="单位M" />
              </el-form-item>
              <el-form-item label="土壤最大深度">
                <el-input v-model="form.zmax" placeholder="单位M" />
              </el-form-item>
              <el-form-item label="水力扩散系数">
                <el-input v-model="form.diffus" placeholder="1.32e-3" />
              </el-form-item>
              <el-form-item label="饱和渗透系数">
                <el-input v-model="form.ksat" placeholder="1.32e-5" />
              </el-form-item>
              <el-form-item>
                <el-button class="b_ex" type="primary" @click="onSubmit"
                  >运行</el-button
                >
                <el-button @click="dialogVisible = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </div>
      <div class="theme">
        <div class="title">动力学过程模型模拟</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisible1 = true"
            ><span>冰川泥石流启动动力学模型</span></el-button
          >
          <el-dialog
            v-model="dialogVisible1"
            title="冰川泥石流启动动力学模型"
            width="500"
            :close-on-click-modal="false"
            class="dialog_avaflow"
          >
            <p id="name_par2">模型参数</p>
            <el-form
              :model="form1"
              label-width="auto"
              style="max-width: 600px"
              class="form_avaflow"
            >
              <el-form-item label="相数" class="form1_avaflow">
                <el-select v-model="form1.phases" placeholder="1">
                  <el-option label="单相" value="1" />
                  <el-option label="双相" value="2" />
                  <el-option label="多相" value="3" />
                </el-select>
              </el-form-item>
              <el-form-item label="内部摩擦" class="form2_avaflow">
                <el-input v-model="form1.cf" placeholder="35" />
              </el-form-item>
              <el-form-item label="基底摩擦" class="form3_avaflow">
                <el-input v-model="form1.bf" placeholder="20" />
              </el-form-item>
              <el-form-item label="水摩擦" class="form4_avaflow">
                <el-input v-model="form.ff" placeholder="0.05" />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="onSubmit1"
                  class="b_ex_avaflow"
                  >运行</el-button
                >
                <el-button @click="dialogVisible1 = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />

          <el-button :plain="true" @click="dialogVisible2 = true"
            ><span>洪水泥石流启动动力学模型</span></el-button
          >
          <el-dialog
            v-model="dialogVisible2"
            title="洪水泥石流启动动力学模型"
            width="500"
            :close-on-click-modal="false"
            class="dialog_flood"
          >
            <p id="name_par3">模型参数</p>
            <el-form
              :model="form2"
              label-width="auto"
              style="max-width: 600px"
              class="form_flood"
            >
              <el-form-item label="基底摩擦" class="form1_flood">
                <el-input v-model="form2.bed" placeholder="20" />
              </el-form-item>
              <el-form-item label="曼宁摩擦系数" class="form1_flood">
                <el-input v-model="form2.nn" placeholder="20" />
              </el-form-item>
              <el-form-item label="网格长度" class="form1_flood">
                <el-input v-model="form2.dx" placeholder="20" />
              </el-form-item>
              <el-form-item label="网格宽度" class="form1_flood">
                <el-input v-model="form2.dy" placeholder="20" />
              </el-form-item>
              <el-form-item label="滑坡密度" class="form1_flood">
                <el-input v-model="form2.rous" placeholder="20" />
              </el-form-item>
              <el-form-item label="河水密度" class="form1_flood">
                <el-input v-model="form2.rouf" placeholder="20" />
              </el-form-item>
              <el-form-item label="输出间距" class="form1_flood">
                <el-input v-model="form2.interval" placeholder="20" />
              </el-form-item>
              <el-form-item label="计算时间" class="form1_flood">
                <el-input v-model="form2.Tmax" placeholder="20" />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="onSubmit2"
                  class="b_ex_avaflow"
                  >运行</el-button
                >
                <el-button @click="dialogVisible2 = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </div>
      <div class="theme">
        <div class="title">定量风险评估</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>全域风险评估参数模型</span>
        </div>
        <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>承载体分布模拟模型</span>
        </div>
        <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>承载体脆弱性评估参数模拟</span>
        </div>
        <div class="box p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>致灾危险性评估参数模型</span>
        </div>
      </div>
      <div class="theme">
        <div class="title">突发性灾害监测预警</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>基于深度学习的灾害链预警模型</span>
        </div>
        <div class="box p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>基于地震动信号的反演过程模型</span>
        </div>
      </div>

      <div class="theme">
        <div class="title">调控技术与防控体系</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>灾害链断链调控技术</span>
        </div>
        <div class="box p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>冰川泥石流沿程调控技术</span>
        </div>
      </div>
    </div>

    <!-- 动态生成的正方形 -->
    <transition
      name="fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div v-if="squareStore.showSquare" class="square">
        <!-- <span class="close-btn" @click="closeSquare">×</span> -->

        <!-- 风险图例 -->
        <div class="legend">
          <div class="legend-item">
            <div
              class="color-box"
              :style="{ backgroundColor: 'rgba(212, 48, 48, 255)' }"
            ></div>
            <span class="legend-text">极高风险</span>
          </div>
          <div class="legend-item">
            <div
              class="color-box"
              :style="{ backgroundColor: 'rgba(230, 141, 26, 255)' }"
            ></div>
            <span class="legend-text">高风险</span>
          </div>
          <div class="legend-item">
            <div
              class="color-box"
              :style="{ backgroundColor: 'rgba(230, 195, 0, 220)' }"
            ></div>
            <span class="legend-text">中风险</span>
          </div>
          <div class="legend-item">
            <div
              class="color-box"
              :style="{ backgroundColor: 'rgba(42, 130, 228, 255)' }"
            ></div>
            <span class="legend-text">低风险</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import { inject, ref } from 'vue'
import { reactive } from 'vue'
import axios from 'axios'
const dialogVisible = ref(false)
const dialogVisible1 = ref(false)
const dialogVisible2 = ref(false)
import { useSquareStore } from '../stores/squareStore'
import { emitter } from '../eventBus'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let $emit = defineEmits([
  'openLayers',
  'timeSelected',
  'yjLayers',
  'floodLayers',
])
// 获取 store 实例
const squareStore = useSquareStore()
// function handleClose(done) {
//   ElMessageBox.confirm('确定关闭吗?')
//     .then(() => {
//       done()
//     })
//     .catch(() => {})
//   // done()
// }

const form = reactive({
  name: '',
  // region: '',
  color: 'dangerLevel',
  time: [],
  rsl: '1.0e-6',
  depth: '3.0',
  zmax: '2.4',
  diffus: '1.32e-03',
  ksat: '1.32e-05',
})
const form1 = reactive({
  phases: '1',
  cf: '35',
  bf: '20',
  ff: '0.05',
})
const form2 = reactive({
  bed: '24',
  nn: '0.0125',
  dx: '20',
  dy: '20',
  rous: '2700',
  rouf: '1000',
  interval: '10',
  Tmax: '100',
})
const isProcessing = ref(false)
function onSubmit() {
  dialogVisible.value = false
  ElMessage({ message: '运行中!', type: 'success', duration: 40000 })
  subitForm()
  // console.log(form.time[0])
  //把选中的时间通过自定义事件传递给父组件
  $emit('timeSelected', form.time)
  // for (let t of form.time) {
  //   console.log(t) //打印每个选中的时间（秒数）
  // }
  // if (form.color == 'dangerLevel') {
  //   // squareStore.openSquare()
  //   console.log('111')
  //   // console.log(squareStore.showSquare)
  // }
}
const subitForm = () => {
  axios
    .post('/testapi/admin/user/fx', form, { timeout: 400000 })
    .then(response => {
      const text = response.data
      // console.log(text)

      // 匹配字符串中的经纬度和图片名称
      // console.log(form.time.length)

      // 构建图片名称部分的正则表达式
      let imageNameRegex = ''
      for (let i = 1; i <= form.time.length; i++) {
        imageNameRegex += `,图片名称${i}:(\\S+\\.png)`
      }
      // console.log(imageNameRegex)
      // 动态构建完整的正则表达式
      const regex = new RegExp(
        `左下经度:([\\d.]+),左下纬度:([\\d.]+),右上经度:([\\d.]+),右上纬度:([\\d.]+)` +
          imageNameRegex
      )

      // 使用构建的正则表达式进行匹配
      const matches = text.match(regex)

      // console.log(matches)

      if (matches) {
        const leftlong = Number(matches[1])
        const leftlat = Number(matches[2])
        const rightlong = Number(matches[3])
        const rightlat = Number(matches[4])

        // 提取 pname 参数（从索引 5 开始）
        const pnames = matches.slice(5)
        // console.log(pnames)

        // 传递参数给父组件
        const params = { leftlat, leftlong, rightlat, rightlong, pnames }
        $emit('openLayers', params)
      } else {
        console.error('没有找到匹配的数据！')
      }
    })
    .catch(error => {
      console.error(error)
      // 处理错误
    })
}
//演进模型
function onSubmit1() {
  dialogVisible1.value = false
  ElMessage({ message: '运行中!', type: 'success', duration: 150000 })
  subitForm1()
  // console.log(form.time[0])
  //把选中的时间通过自定义事件传递给父组件
  // $emit('timeSelected', form.time)
  // for (let t of form.time) {
  //   console.log(t) //打印每个选中的时间（秒数）
  // }
  // if (form.color == 'dangerLevel') {
  //   // squareStore.openSquare()
  //   console.log('111')
  //   // console.log(squareStore.showSquare)
  // }
}
const subitForm1 = () => {
  axios
    .post('/testapi/admin/user/yj', form, { timeout: 40000 })
    .then(response => {
      const text = response.data
    })
    .catch(error => {
      console.error(error)
      // 处理错误
    })
  setTimeout(() => {
    $emit('yjLayers')
  }, 150000)
}

//洪水泥石流
function onSubmit2() {
  dialogVisible2.value = false
  ElMessage({ message: '运行中!', type: 'success', duration: 150000 })
  submitForm2()
}
const submitForm2 = async () => {
  try {
    isProcessing.value = true
    await axios.post(
      '/testapi/admin/user/start-process',
      'mode=realtime&intervalMs=200',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    )
    connectWebSocket()
  } catch (error) {
    console.error('启动失败:', error)
  } finally {
    isProcessing.value = false
  }
}
const connectWebSocket = () => {
  // 创建 STOMP 客户端实例
  const client = new Client({
    // 使用 SockJS 作为底层传输
    webSocketFactory: () => new SockJS('http://localhost:8088/ws'),
    // 自动重连配置
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    // 连接成功回调
    onConnect: () => {
      // 订阅指定主题
      client.subscribe('/topic/txt-frames', message => {
        try {
          const data = JSON.parse(message.body)

          // 触发纹理数据事件
          emitter.emit('cesium-texture-data', data)

          // 调试日志（可选）
          console.log('WebSocket 数据接收成功', data)
        } catch (error) {
          emitter.emit('cesium-error', {
            type: 'DATA_PARSE_ERROR',
            message: '数据解析失败',
            detail: error,
          })
        }
      })
    },
    // 连接断开处理
    onDisconnect: () => {
      emitter.emit('cesium-error', {
        type: 'CONNECTION_CLOSED',
        message: '连接已断开，正在尝试重连...',
      })
    },

    // 异常处理
    onStompError: error => {
      emitter.emit('cesium-error', {
        type: 'STOMP_ERROR',
        message: '协议通信错误',
        detail: error.headers.message,
      })
    },

    // WebSocket 失败回调
    onWebSocketError: error => {
      emitter.emit('cesium-error', {
        type: 'WS_CONNECTION_ERROR',
        message: '连接失败',
        detail: error,
      })
    },
  })

  // 激活客户端连接
  client.activate()

  // 返回清理函数（用于组件卸载时断开连接）
  return () => {
    if (client.active) {
      client.deactivate()
      console.log('WebSocket 连接已主动断开')
    }
  }
}
// 控制正方形显示与隐藏的状态
// const showSquare = ref(false)

// 创建正方形的函数
// const createSquare = () => {
//   showSquare.value = true
// }

// 关闭正方形的函数
const closeSquare = () => {
  squareStore.closeSquare()
}

// 动画生命周期钩子

const beforeEnter = el => {
  el.style.opacity = '0'
  el.style.transform = 'scale(0)'
}

const enter = (el, done) => {
  el.offsetHeight // 强制重排，确保动画从初始状态开始
  el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
  el.style.opacity = '1'
  el.style.transform = 'scale(1)'
  done()
}

const leave = (el, done) => {
  el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
  el.style.opacity = '0'
  el.style.transform = 'scale(0)'
  done()
}
</script>
<style lang="scss" scoped>
:deep(.el-button.is-plain) {
  --el-fill-color-blank: transparent;
  --el-border-color: transparent;
  --el-button-hover-border-color: transparent;
  --el-button-text-color: white; //
  --el-font-family: 'Source Han Sans', 'Trebuchet MS', 'Lucida Sans Unicode',
    'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-size: 17px;
  padding: 0;
  // --el-color-primary: transparent;
}
:deep(.el-checkbox) {
  margin-right: 10px;
}
:deep(.el-checkbox__label) {
  padding-left: 2px;
}

.left {
  position: absolute;
  // max-height: 850px;
  top: 62px;
  left: 10px;
  background: url('../assets/img/left_theme_2.png');
  background-size: cover;
  width: 400px;
  height: 850px;
}
.name {
  position: absolute;
  top: 45px;
  left: 15px;
  writing-mode: vertical-rl; /* 将文字竖向排列，从上到下 */
  // text-orientation: upright; /* 保持文字方向垂直 */
  // white-space: nowrap; /* 防止文字换行 */
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
  // transform: rotate(0deg); /* 旋转文字，使其从下到上显示 */
}
.left .total_theme {
  position: absolute;
  top: 40px;
  left: 60px;
}
.theme .title {
  width: 300px;
  text-align: left;
  padding-left: 10px;
  line-height: 50px;
  font-weight: 500;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 1);
  font-size: 22px;
  background: url(../assets/img/left_theme_1.png);
}
#bar {
  width: 310px;
  display: block; /* 将图片设置为块级元素 */
  // vertical-align: middle; /* 使用垂直居中对齐方式 */
}
.theme .title img {
  width: 300px;
  color: #606266;
}
.box {
  height: 30px;
  font-weight: 500;
  /* letter-spacing: 1px; */
  letter-spacing: 1px; /* 添加字间距 */
  line-height: 40px; /* 添加行距，可以根据需要调整值 */
  // color: rgba(255, 255, 255, 1);
  color: #606266;
  text-align: left;
  font-size: 16.5px;
}
.box img {
  height: 12px;
  width: 12px;
  margin-right: 5px;
  filter: grayscale(100%) brightness(50%); //降低亮度
  vertical-align: middle; //使图片底部与相邻文本的中部对齐
}
.box-used img {
  filter: grayscale(100%) brightness(100%);
}
.p_bottom {
  padding-bottom: 10px;
}

/* 正方形的样式 */
.square {
  position: fixed;
  right: 365px;
  bottom: 100px;
  width: 130px; /* 宽度保持不变 */
  height: 140px; /* 减小正方形容器的高度 */
  background-color: transparent; /* 去掉背景色 */
  display: flex;
  flex-direction: column; /* 垂直布局 */
  align-items: center;
  justify-content: flex-start; /* 顶部对齐 */
  color: white;
  font-size: 18px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.3s ease, transform 0.3s ease; /* 默认过渡样式 */
}

/* 关闭按钮的样式 */
.close-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  user-select: none;
}

.close-btn:hover {
  color: #f56c6c;
}

/* 风险图例的容器 */
.legend {
  display: flex;
  flex-direction: column; /* 纵向排列 */
  justify-content: flex-start;
  width: 80%;
  margin-top: 10px;
}

/* 每个图例项的样式 */
.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* 每个小正方形的样式 */
.color-box {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid #fff; /* 添加边框以增强对比 */
  margin-right: 8px; /* 正方形与文本之间的间距 */
}

/* 图例文本的样式 */
.legend-text {
  font-size: 14px;
  color: white;
}

/* 为 transition 设置过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active 在离开时生效 */ {
  opacity: 0;
  transform: scale(0);
}

:deep(.el-dialog.dialog_trigrs) {
  --el-dialog-bg-color: transparent;
  width: 776px;
  height: 503px;
  background-image: url('../assets/img/fz173.png');
  background-size: 100% 100%;
}
:deep(.el-dialog.dialog_avaflow) {
  --el-dialog-bg-color: transparent;
  width: 450px;
  height: 300px;
  background-image: url('../assets/img/fz173.png');
  background-size: 100% 100%;
}
:deep(.el-dialog.dialog_flood) {
  --el-dialog-bg-color: transparent;
  width: 450px;
  height: 420px;
  background-image: url('../assets/img/fz173.png');
  background-size: 100% 100%;
}
:deep(.el-input__wrapper) {
  padding: 1px 0px;
}
:deep(.el-input) {
  --el-input-bg-color: transparent;
  --el-input-border-color: transparent;
}
:deep(.el-select__wrapper) {
  background-color: transparent;
}
:deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px transparent inset;
  font-size: 18px;
}
:deep(.el-dialog__title) {
  color: rgba(255, 255, 255, 1);
  font-size: 24px;
}
:deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
}
:deep(.el-input__inner) {
  color: rgba(166, 166, 166, 1);
  font-size: 18px;
}
:deep(.el-select__placeholder) {
  color: rgba(166, 166, 166, 1);
}
:deep(.el-checkbox) {
  --el-checkbox-text-color: rgba(166, 166, 166, 1);
}
:deep(.el-dialog.dialog_trigrs .el-dialog__header) {
  padding: 30px 0px 0px 48px;
}
:deep(.el-dialog.dialog_avaflow .el-dialog__header) {
  padding: 0px 0px 0px 22px;
  line-height: 30px;
}
:deep(.el-dialog.dialog_flood .el-dialog__header) {
  padding-bottom: 0px;
  padding-top: 16px;
  padding-left: 20px;
}
:deep(.header.el-dialog_header.show-close) {
  padding: 15px 25px 16px 0px;
}
.form_trigrs {
  display: flex;
  flex-wrap: wrap; /*子元素在必要时换行*/
  width: 650px;
  margin-top: 10px;
  margin-left: 50px;
}
.form_avaflow {
  display: flex;
  flex-wrap: wrap; /*子元素在必要时换行*/
  width: 370px;
  margin-top: 10px;
  margin-left: 28px;
}
.form_flood {
  display: flex;
  flex-wrap: wrap; /*子元素在必要时换行*/
  width: 380px;
  margin-top: 10px;
  margin-left: 8px;
}
.el-form-item {
  flex: 1 1 50%; /* 每个表单项宽度为45%（两列布局） */
  margin-bottom: 30px; /* 每个表单项之间的间距 */
}
/* 强制特定项的宽度和布局 */
.el-form-item.form1_avaflow,
.el-form-item.form2_avaflow {
  flex: 1 1 45%; /* 地点和色带为一行 */
}
.el-form-item.form3_avaflow,
.el-form-item.form4_avaflow {
  flex: 1 1 45%; /* 地点和色带为一行 */
}

.el-form-item.form3_trigrs {
  flex: 1 1 100%; /* 预测时间为一行 */
}

.el-form-item.form4_trigrs {
  flex: 1 1 100%; /* 入渗率为一行 */
}

.el-form-item:nth-child(5),
.el-form-item:nth-child(6) {
  flex: 1 1 45%; /* 初始地下水位和土壤最大深度为一行 */
}

.el-form-item:nth-child(7),
.el-form-item:nth-child(8) {
  flex: 1 1 45%; /* 水力扩散系数和饱和渗透系数为一行 */
}
.b_ex {
  margin-left: 440px;
}
.b_ex_avaflow {
  margin-left: 180px;
}
#name_par {
  font-size: 20px;
  color: rgba(39, 99, 202, 1);
  margin-left: 78px;
}
#name_par2 {
  font-size: 16px;
  color: rgba(39, 99, 202, 1);
  margin-left: 27px;
  line-height: 34px;
}
#name_par3 {
  font-size: 16px;
  color: rgba(39, 99, 202, 1);
  margin-left: 27px;
  line-height: 34px;
}
</style>
