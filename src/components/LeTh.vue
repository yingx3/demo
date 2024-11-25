<template>
  <div class="left">
    <div class="total_theme">
      <div class="theme theme1">
        <h1>发育规律与风险源判识</h1>
        <div class="line"><img src="../assets/img/left_line.png" alt="" /></div>
        <div class="icon">
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
          <div class="box box-used">
            <img src="../assets/img/云反射率.png" alt="" />
            <el-button :plain="true" @click="dialogVisible = true"
              ><span>风险源定量识别与表征模型</span></el-button
            >
            <el-dialog
              v-model="dialogVisible"
              title="模型参数"
              width="500"
              :before-close="handleClose"
              :close-on-click-modal="false"
            >
              <el-form
                :model="form"
                label-width="auto"
                style="max-width: 600px"
              >
                <el-form-item label="地点">
                  <el-input v-model="form.name" placeholder="林芝市" />
                </el-form-item>
                <el-form-item label="带号">
                  <el-select
                    v-model="form.region"
                    placeholder="请选择基于WGS84的墨卡托投影带号"
                  >
                    <el-option label="45" value="45N" />
                    <el-option label="46" value="46N" />
                    <el-option label="47" value="47N" />
                    <el-option label="48" value="48N" />
                    <el-option label="49" value="49N" />
                  </el-select>
                </el-form-item>
                <el-form-item label="色带">
                  <el-select v-model="form.color" placeholder="危险等级">
                    <el-option label="灰度" value="gray" />
                    <el-option label="红绿蓝" value="rgb" />
                    <el-option label="红色渐变" value="redGradient" />
                    <el-option label="危险等级" value="dangerLevel" />
                  </el-select>
                </el-form-item>
                <el-form-item label="预测时间">
                  <el-input v-model="form.time" placeholder="100800s" />
                </el-form-item>
                <el-form-item label="入渗率">
                  <el-input v-model="form.rsl" placeholder="范围：[0-1]" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">运行</el-button>
                  <el-button @click="handleClose">取消</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </div>
        </div>
      </div>
      <div class="theme theme2">
        <h1>动力学过程模型模拟</h1>
        <div class="line"><img src="../assets/img/left_line.png" alt="" /></div>
        <div class="icon">
          <div class="box">
            <img src="../assets/img/云反射率.png" alt="" />
            <span>冰川泥石流启动动力学模型</span>
          </div>
          <div class="box">
            <img src="../assets/img/云反射率.png" alt="" />
            <span>冰岩崩启动动力学模型</span>
          </div>
        </div>
      </div>
      <div class="theme theme1">
        <h1>定量风险评估</h1>
        <div class="line"><img src="../assets/img/left_line.png" alt="" /></div>
        <div class="icon">
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
          <div class="box">
            <img src="../assets/img/云反射率.png" alt="" />
            <span>致灾危险性评估参数模型</span>
          </div>
        </div>
      </div>
      <div class="theme theme2">
        <h1>突发性灾害监测预警</h1>

        <div class="line">
          <img src="../assets/img/left_line.png" alt="" />
        </div>
        <div class="icon">
          <div class="box">
            <img src="../assets/img/云反射率.png" alt="" />
            <span>基于深度学习的灾害链预警模型</span>
          </div>
          <div class="box">
            <img src="../assets/img/云反射率.png" alt="" />
            <span>基于地震动信号的反演过程模型</span>
          </div>
        </div>
      </div>
      <div class="theme">
        <h1>调控技术与防控体系</h1>
        <div class="line"><img src="../assets/img/left_line.png" alt="" /></div>
        <div class="icon">
          <div class="box">
            <img src="../assets/img/云反射率.png" alt="" />
            <span>灾害链断链调控技术</span>
          </div>
          <div class="box">
            <img src="../assets/img/云反射率.png" alt="" />
            <span>冰川泥石流沿程调控技术</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import { inject, ref } from 'vue'
import { reactive } from 'vue'
import axios from 'axios'
const dialogVisible = ref(false)

let $emit = defineEmits(['openLayers'])

function handleClose(done) {
  ElMessageBox.confirm('确定关闭吗?')
    .then(() => {
      done()
    })
    .catch(() => {})
}

const form = reactive({
  name: '',
  region: '',
  color: '',
  time: '',
  rsl: '',
})

function onSubmit() {
  dialogVisible.value = false
  ElMessage({ message: '运行中!', type: 'success' })
  subitForm()
}
const subitForm = () => {
  axios
    .post('/testapi/admin/user/fx', form, { timeout: 400000 })
    .then(response => {
      const text = response.data
      // console.log(text)
      const matches = text.match(
        /左下经度:([\d.]+), 左下纬度:([\d.]+), 右上经度:([\d.]+), 右上纬度:([\d.]+),图片名称：(.+)$/
      )

      const leftlong = Number(matches[1])
      const leftlat = Number(matches[2])
      const rightlong = Number(matches[3])
      const rightlat = Number(matches[4])
      const pname = matches[5]
      $emit('openLayers', leftlat, leftlong, rightlat, rightlong, pname)
    })
    .catch(error => {
      console.error(error)
      // 处理错误
    })
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
  font-size: 16px;
  padding: 0;
  // --el-color-primary: transparent;
}

.left {
  position: absolute;
  // max-height: 850px;
  top: 60px;
  left: 10px;
  background: url('../assets/img/left_theme_2.png');
  background-size: cover;
  width: 400px;
  height: 850px;
}
.left .total_theme {
  position: absolute;
  top: 60px;
  left: 60px;
}
.left .total_theme .theme .line img {
  width: 325px;
  color: #606266;
}
.left .total_theme .theme .box {
  font-family: 'Source Han Sans', 'Trebuchet MS', 'Lucida Sans Unicode',
    'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-weight: 500;
  /* letter-spacing: 1px; */
  letter-spacing: 1px; /* 添加字间距 */
  line-height: 2; /* 添加行距，可以根据需要调整值 */
  // color: rgba(255, 255, 255, 1);
  color: #606266;
  text-align: left;
  font-size: 16px;
}
.left .total_theme .theme .box img {
  margin-right: 5px;
}
.left .total_theme .theme .icon .box img {
  height: 12px;
  width: 12px;
  filter: grayscale(100%) brightness(50%);
}
.left .total_theme .theme .icon .box-used img {
  filter: grayscale(100%) brightness(100%);
}

.left .total_theme .theme h1 {
  font-family: 'Source Han Sans', 'Trebuchet MS', 'Lucida Sans Unicode',
    'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-weight: 500;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  font-size: 22px;
  background: url(../assets/img/left_theme_1.png);
}
.left .total_theme .theme h2 {
  /* font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif; */
  /* flex: 1; */
  font-family: 'Source Han Sans', 'Trebuchet MS', 'Lucida Sans Unicode',
    'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-weight: 500;
  /* letter-spacing: 1px; */
  letter-spacing: 1px; /* 添加字间距 */
  line-height: 2; /* 添加行距，可以根据需要调整值 */
  color: rgba(255, 255, 255, 1);
  text-align: left;
  font-size: 16px;
}
// .line {
//   visibility: hidden;
// }
// .theme1 {
//   height: 190px;
// }
// .theme2 {
//   height: 135px;
// }
</style>
