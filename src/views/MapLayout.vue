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
import { ref, shallowRef, provide, onMounted, onBeforeUnmount } from 'vue'
import * as Cesium from 'cesium'

// Cesium Viewer 及 scene/globe/terrainProvider 等内部对象绝不能被 Vue 深度响应式代理。
// 否则 Cesium 内部（raw）与外部 viewer.value（Proxy）会混用同一棵 TileAvailability
// 四叉树，触发 Cannot read properties of undefined (reading 'rectangles')。
const viewer = shallowRef(null)

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

  // ion 令牌：可通过 .env 的 VITE_CESIUM_ION_TOKEN 覆盖（默认沿用内置账号令牌）。
  // 注意 api.cesium.com 返回的资产令牌有效期只有 1 小时，而一次长时段模拟动辄跑 1 小时以上：
  // 令牌过期后地形瓦片会成片 401，继而耗尽浏览器 socket（net::ERR_NO_BUFFER_SPACE）。
  const ION_TOKEN =
    (import.meta.env && import.meta.env.VITE_CESIUM_ION_TOKEN) ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTNhYTY5MS05Yzk0LTRhYmYtOTcwOC00YzdlN2JhMzU3ZTMiLCJpZCI6MjQxNzQxLCJpYXQiOjE3MjY1MzU1MjN9.aSxU00u1JUszveBFaf7IM9_KI8bq7A528YSjMXHE4sE'
  Cesium.Ion.defaultAccessToken = ION_TOKEN

  let terrainRecoveredAt = 0
  let terrainRecovering = false
  let terrainFallbackWarned = false
  let terrainRefreshTimer = null
  const terrainErrorStamps = []
  const TERRAIN_ERROR_WINDOW_MS = 10000
  const TERRAIN_ERROR_BURST = 15
  const TERRAIN_RECOVER_COOLDOWN_MS = 60000

  function fallbackToEllipsoidTerrain(reason) {
    try {
      if (!viewer.value || viewer.value.isDestroyed()) return
      viewer.value.terrainProvider = new Cesium.EllipsoidTerrainProvider()
      if (!terrainFallbackWarned) {
        terrainFallbackWarned = true
        console.warn('[terrain] 已退回椭球地形（无高程起伏）:', reason)
      }
    } catch (e) {
      console.warn('[terrain] 退回椭球地形失败:', e)
    }
  }

  // 定期/出错时重建地形提供者：重建会重新请求 /v1/assets/1/endpoint，拿到新的 1 小时令牌
  async function recoverIonTerrain(reason) {
    if (terrainRecovering) return
    const now = Date.now()
    if (now - terrainRecoveredAt < TERRAIN_RECOVER_COOLDOWN_MS) return
    terrainRecovering = true
    terrainRecoveredAt = now
    try {
      const fresh = await createIonTerrain()
      if (!viewer.value || viewer.value.isDestroyed()) return
      viewer.value.terrainProvider = fresh
      console.info('[terrain] 已重建 Cesium World Terrain（刷新 ion 令牌）:', reason)
    } catch (e) {
      console.warn('[terrain] 重建地形失败，改用椭球地形:', e)
      fallbackToEllipsoidTerrain((e && e.message) || reason)
    } finally {
      terrainRecovering = false
    }
  }

  function attachTerrainWatchdog(provider) {
    if (!provider || !provider.errorEvent) return
    try {
      provider.errorEvent.addEventListener(error => {
        const underlying = (error && error.error) || error
        const status = Number((underlying && underlying.statusCode) != null
          ? underlying.statusCode
          : error && error.statusCode)
        const now = Date.now()
        terrainErrorStamps.push(now)
        while (
          terrainErrorStamps.length &&
          now - terrainErrorStamps[0] > TERRAIN_ERROR_WINDOW_MS
        ) {
          terrainErrorStamps.shift()
        }
        if (status === 401 || terrainErrorStamps.length >= TERRAIN_ERROR_BURST) {
          recoverIonTerrain(status === 401 ? 'ion 令牌过期(401)' : '地形错误过多')
        }
      })
    } catch (e) {
      console.warn('[terrain] 地形错误监听注册失败:', e)
    }
  }

  async function createIonTerrain() {
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(1)
    attachTerrainWatchdog(terrainProvider)
    return terrainProvider
  }

  let terrainProvider = null
  try {
    terrainProvider = await createIonTerrain()
  } catch (e) {
    console.warn('[terrain] Cesium World Terrain 初始化失败，退回椭球地形:', e)
    terrainFallbackWarned = true
    terrainProvider = new Cesium.EllipsoidTerrainProvider()
  }
  // 主动在令牌到期前重建一次（50 分钟），避免等到出现 401 风暴
  terrainRefreshTimer = window.setInterval(
    () => recoverIonTerrain('定时刷新(50min)'),
    50 * 60 * 1000,
  )

  viewer.value = new Cesium.Viewer('cesiumContainer', {
    terrainProvider,
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
        'allow-same-origin allow-scripts allow-popups allow-forms',
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
  if (terrainRefreshTimer) {
    clearInterval(terrainRefreshTimer)
    terrainRefreshTimer = null
  }
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

// .screen-root {
//   pointer-events: none; // 如果只是展示层，建议这样
//   position: absolute;

//   left: 50%;
//   top: 50%;
//   width: 1920px;
//   height: 1080px;
//   transform: translate(-50%, -50%) scale(var(--scale));
//   transform-origin: center center;
// }
.screen-root {
  pointer-events: none;
  position: absolute;

  left: 50%;
  top: 0;
  width: 1920px;
  height: 1080px;
  transform: translate(-50%, 0) scale(var(--scale));
  transform-origin: top center; /* 缩放原点：顶部居中 */
}
@media screen and (height: 567.2px) {
  .screen-root {
    transform: translate(-50%, 0) scale(0.575);
  }
}
@media screen and (height: 911px) {
  .screen-root {
    transform: translate(-50%, 0) scale(1);
  }
}
@media screen and (height: 1187px) {
  .screen-root {
    transform: translate(-50%, 0) scale(1.35);
  }
}
@media screen and (height: 882.22px) {
  .screen-root {
    transform: translate(-50%, 0) scale(1);
  }
}

.top-container {
  position: relative;
  width: 100%;
  height: 100%;
  font-family:
    'Source Han Sans', 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
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
