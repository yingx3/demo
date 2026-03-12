<template>
  <div class="feature-overlay">
    <div class="feature-panel">
      <h2>测量</h2>
      <p>距离、面积、高度测量及多边形绘制将在此模块实现。</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const viewer = inject('cesiumViewer')

onMounted(() => {
  // 可在此根据 viewer 挂载测量相关逻辑（如 MeasureManager）
})

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.feature-overlay {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  pointer-events: none;
}
.feature-panel {
  pointer-events: auto;
  margin: 20px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 360px;
}
.feature-panel h2 {
  margin: 0 0 12px;
  font-size: 18px;
}
.feature-panel p {
  margin: 0 0 16px;
  color: #666;
  font-size: 14px;
}
</style>
