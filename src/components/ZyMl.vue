<template>
  <div id="res">
    <div class="content">
      <img src="../assets/img/c1.png" alt="" />
      <div class="data scroll-container">
        <el-menu default-active="1">
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>基础地理空间数据</span>
            </template>
            <el-menu-item index="1-1">影像数据</el-menu-item>
            <el-menu-item index="1-2">路网数据</el-menu-item>
            <el-menu-item index="1-3">灾害风险区划</el-menu-item>
            <el-menu-item index="1-4">历史灾害点</el-menu-item>
            <el-menu-item index="1-5">古滑坡灾害链</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><icon-menu /></el-icon>
              <span>冰川泥石流专题数据</span>
            </template>
            <el-menu-item index="2-1">地形数据</el-menu-item>
            <el-menu-item index="2-2">坡度</el-menu-item>
            <el-menu-item index="2-3">坡向</el-menu-item>
            <el-menu-item index="2-4">地形起伏度</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><document /></el-icon>
              <span>气象数据</span>
            </template>
            <el-menu-item index="3-1">降水量</el-menu-item>
            <el-menu-item index="3-2">温度</el-menu-item>
            <el-menu-item index="3-3">风速</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon><document /></el-icon>
              <span>冰川监测数据</span>
            </template>
            <el-menu-item index="4-1">冰川消融量</el-menu-item>
            <el-menu-item index="4-2">冰川运动速率</el-menu-item>
            <el-menu-item index="4-3">冰川厚度</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="5">
            <template #title>
              <el-icon><document /></el-icon>
              <span>水文数据</span>
            </template>
            <el-menu-item index="5-1">河流流量</el-menu-item>
            <el-menu-item index="5-2">融水量</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="6">
            <template #title>
              <el-icon><document /></el-icon>
              <span>历史灾害数据</span>
            </template>
            <el-menu-item index="6-1">历史泥石流时间</el-menu-item>
            <el-menu-item index="6-2">历史泥石流规模</el-menu-item>
            <el-menu-item index="6-3">历史泥石流地点</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="7">
            <template #title>
              <el-icon><document /></el-icon>
              <span>冰岩崩专题数据</span>
            </template>
            <el-sub-menu index="7-1">
              <template #title>
                <el-icon><document /></el-icon
                ><span>地质构造特征数据</span></template
              >
              <el-menu-item index="7-1-1">地质构造</el-menu-item>
              <el-menu-item index="7-1-2">岩层特征</el-menu-item>
              <el-menu-item index="7-1-3">地质构造类型</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="7-2">
              <template #title>
                <el-icon><document /></el-icon
                ><span>地形地貌数据</span></template
              >
              <el-menu-item index="7-2-1">地形图</el-menu-item>
              <el-menu-item index="7-2-2">地貌图</el-menu-item>
              <el-menu-item index="7-2-3">地形高程</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="7-3">
              <template #title>
                <el-icon><document /></el-icon
                ><span>气候环境数据</span></template
              >
              <el-menu-item index="7-3-1">气温</el-menu-item>
              <el-menu-item index="7-3-2">气温</el-menu-item>
              <el-menu-item index="7-3-3">风速</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="7-4">
              <template #title>
                <el-icon><document /></el-icon
                ><span>植被覆盖数据</span></template
              >
              <el-menu-item index="7-4-1">植被类型</el-menu-item>
              <el-menu-item index="7-4-2">植被覆盖率</el-menu-item>
              <el-menu-item index="7-4-3">植被分布</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="7-5">
              <template #title>
                <el-icon><document /></el-icon
                ><span>历史灾害数据</span></template
              >
              <el-menu-item index="7-5-1">历史冰岩崩事件记录</el-menu-item>
              <el-menu-item index="7-5-2">灾害影响范围</el-menu-item>
              <el-menu-item index="7-5-3">灾害发生频率</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="8">
            <template #title>
              <el-icon><document /></el-icon>
              <span>溃决洪水专题数据</span>
            </template>
            <el-sub-menu index="8-1">
              <template #title>
                <el-icon><document /></el-icon><span>水文数据</span></template
              >
              <el-menu-item index="8-1-1">水文测报数据</el-menu-item>
              <el-menu-item index="8-1-2">水流速度</el-menu-item>
              <el-menu-item index="8-1-3">水位高度</el-menu-item>
              <el-menu-item index="8-1-4">流量</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="8-2">
              <template #title>
                <el-icon><document /></el-icon
                ><span>地形地貌数据</span></template
              >
              <el-menu-item index="8-2-1">地形图</el-menu-item>
              <el-menu-item index="8-2-2">地貌图</el-menu-item>
              <el-menu-item index="8-2-3">地形高程</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="8-3">
              <template #title>
                <el-icon><document /></el-icon><span>降雨数据</span></template
              >
              <el-menu-item index="8-3-1">降雨量</el-menu-item>
              <el-menu-item index="8-3-2">降雨强度</el-menu-item>
              <el-menu-item index="8-3-3">降雨时空分布</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="8-4">
              <template #title>
                <el-icon><document /></el-icon
                ><span>水利工程数据</span></template
              >
              <el-menu-item index="8-4-1">水库水文数据</el-menu-item>
              <el-menu-item index="8-4-2">河流水文数据</el-menu-item>
              <el-menu-item index="8-4-3">堤坝结构</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="8-5">
              <template #title>
                <el-icon><document /></el-icon
                ><span>历史洪水事件</span></template
              >
              <el-menu-item index="8-5-1">历史洪水事件记录</el-menu-item>
              <el-menu-item index="8-5-2">洪水泛滥范围</el-menu-item>
              <el-menu-item index="8-5-3">灾害影响情况</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="9">
            <template #title>
              <el-icon><document /></el-icon>
              <span>调控防控专题数据</span>
            </template>
            <el-sub-menu index="9-1">
              <template #title>
                <el-icon><document /></el-icon><span>地形数据</span></template
              >
              <el-menu-item index="-1-1">坡度</el-menu-item>
              <el-menu-item index="9-1-2">坡向</el-menu-item>
              <el-menu-item index="9-1-3">地形起伏度</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="9-2">
              <template #title>
                <el-icon><document /></el-icon><span>气象数据</span></template
              >
              <el-menu-item index="9-2-1">降水量</el-menu-item>
              <el-menu-item index="9-2-2">温度</el-menu-item>
              <el-menu-item index="9-2-3">风速</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="9-3">
              <template #title>
                <el-icon><document /></el-icon
                ><span>冰川监测数据</span></template
              >
              <el-menu-item index="9-3-1">冰川消融量</el-menu-item>
              <el-menu-item index="9-3-2">冰川运动速率</el-menu-item>
              <el-menu-item index="9-3-3">冰川厚度</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="9-4">
              <template #title>
                <el-icon><document /></el-icon><span>水文数据</span></template
              >
              <el-menu-item index="9-4-1">河流流量</el-menu-item>
              <el-menu-item index="9-4-2">融水量</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="9-5">
              <template #title>
                <el-icon><document /></el-icon
                ><span>历史灾害数据</span></template
              >
              <el-menu-item index="9-5-1">历史泥石流时间</el-menu-item>
              <el-menu-item index="9-5-2">历史泥石流规模</el-menu-item>
              <el-menu-item index="9-5-3">历史泥石流地点</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.catlog {
  position: absolute;
  top: 135px;
  right: 30px;
  height: 930px;

  width: 40px;
  background-image: url(../assets/img/c2.png);
}

img {
  position: absolute;
  height: 950px;
  z-index: 400;
}

.content {
  position: absolute;
  right: 20px;
  top: 115px;
  height: 89%;
  width: 320px;
  overflow: hidden;
}
.data {
  z-index: 500;
  position: absolute;
  top: 40px;
  left: 15px;
}

:deep(.el-menu) {
  border-right: none !important;
  background-color: transparent;
}
:deep(.el-menu-item) {
  font-size: 16px; /* 修改文字大小 */
  color: white; /* 修改文字颜色 */
  line-height: 5px !important;
}
.data span {
  padding: 0%;
}

/* 修改 el-sub-menu 标题文字样式 */
:deep(.el-sub-menu__title) {
  font-size: 18px; /* 修改标题文字大小 */
  color: white; /* 修改标题文字颜色 */
  // line-height: 15px !important;
}
// :deep(.el-sub-menu__title > span) {
//   line-height: 15px !important;
// }

/* 定义滚动容器的样式 */
.scroll-container {
  max-height: 900px; /* 设置最大高度 */
  overflow-y: auto; /* 垂直滚动条 */
}
/* 自定义滚动条样式（可选） */
.scroll-container::-webkit-scrollbar {
  width: 5px; /* 滚动条宽度 */
}
.scroll-container::-webkit-scrollbar-thumb {
  background-color: #ccc; /* 滚动条颜色 */
  border-radius: 4px; /* 滚动条圆角 */
}
.scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: #999; /* 滚动条悬停颜色 */
}
</style>
