<template>
  <div class="screen-wrapper">
    <div id="cesiumContainer"></div>

    <div class="screen-root" :style="{ '--scale': String(scale) }">
      <div class="top-container">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onBeforeUnmount } from 'vue'
import * as Cesium from 'cesium'

const viewer = ref(null)

provide('cesiumViewer', viewer)

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080
const scale = ref(1)
const updateScale = () => {
  const w = window.innerWidth
  const h = window.innerHeight
  if (!w || !h) {
    scale.value = 1
    return
  }
  scale.value = Math.min(w / DESIGN_WIDTH, h / DESIGN_HEIGHT)
}

onMounted(async () => {
  updateScale()
  window.addEventListener('resize', updateScale)

  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTNhYTY5MS05Yzk0LTRhYmYtOTcwOC00YzdlN2JhMzU3ZTMiLCJpZCI6MjQxNzQxLCJpYXQiOjE3MjY1MzU1MjN9.aSxU00u1JUszveBFaf7IM9_KI8bq7A528YSjMXHE4sE'
  viewer.value = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(1),
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    animation: false,
    timeline: false,
    infoBox: true,
  })

  viewer.value.cesiumWidget.creditContainer.style.display = 'none'

  try {
    const infoBoxFrame = viewer.value?.infoBox?.frame
    if (infoBoxFrame && typeof infoBoxFrame.setAttribute === 'function') {
      infoBoxFrame.setAttribute(
        'sandbox',
        'allow-same-origin allow-scripts allow-popups allow-forms'
      )
    }
  } catch (e) {
    console.warn('设置 infoBox iframe sandbox 属性失败', e)
  }

  setTimeout(() => {
    const bottomBar = document.querySelector('.cesium-viewer-bottom')
    if (bottomBar) {
      bottomBar.style.display = 'none'
      bottomBar.style.visibility = 'hidden'
    }
  }, 50)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScale)
  if (viewer.value && !viewer.value.isDestroyed()) {
    viewer.value.destroy()
    viewer.value = null
  }
})
</script>

<style lang="scss" scoped>
.screen-wrapper {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #000; /* 防止缩放后露底 */
}

.screen-root {
  pointer-events: none; // 如果只是展示层，建议这样
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1920px;
  height: 1080px;
  transform: translate(-50%, -50%) scale(var(--scale));
  transform-origin: center center;
}

.top-container {
  position: relative;
  width: 100%;
  height: 100%;
  font-family: 'Source Han Sans', 'Trebuchet MS', 'Lucida Sans Unicode',
    'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

#cesiumContainer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.top-container :deep(*) {
  pointer-events: auto; // 需要交互的 UI 再开启
}
</style>
