import * as Cesium from 'cesium'

export function createPlaceholderTexture(viewer) {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, 1, 1)

  return new Cesium.Texture({
    context: viewer.scene.context,
    source: canvas,
    width: 1,
    height: 1,
    pixelFormat: Cesium.PixelFormat.RGBA,
  })
}

export function createTexture(data, viewer) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const width = data[0].length
  const height = data.length
  canvas.width = width
  canvas.height = height
  const imageData = ctx.createImageData(width, height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = data[y][x] * 255
      const i = (y * width + x) * 4
      imageData.data[i] = value
      imageData.data[i + 1] = value
      imageData.data[i + 2] = value
      imageData.data[i + 3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)

  return new Cesium.Texture({
    context: viewer.scene.context,
    source: canvas,
    width: width,
    height: height,
    pixelFormat: Cesium.PixelFormat.RGBA,
    sampler: new Cesium.Sampler({
      wrapS: Cesium.TextureWrap.CLAMP_TO_EDGE,
      wrapT: Cesium.TextureWrap.CLAMP_TO_EDGE,
    }),
  })
}

export async function createFloodLayer(data, viewer) {
  // 创建占位纹理并等待就绪
  const placeholderTexture = createPlaceholderTexture(viewer)
  await placeholderTexture.readyPromise

  const customShader = new Cesium.CustomShader({
    uniforms: {
      u_dynamicTexture: {
        type: Cesium.UniformType.SAMPLER_2D,
        value: new Cesium.TextureUniform({ url: '/ng/gray_20250219_220429_397.png' }),
      },
    },
    fragmentShaderText: `
      uniform sampler2D u_dynamicTexture;
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        material.diffuse = texture2D(u_dynamicTexture, fsInput.texCoord).rgb;
      }
    `,
  })

  const model = await Cesium.Model.fromGltfAsync({
    url: 'ng/Cesium_Air.glb',
    customShader: customShader,
  })

  // 将初始纹理设置为 placeholder（如果需要）
  try {
    model.customShader.uniforms.u_dynamicTexture = placeholderTexture
  } catch (e) {
    // 某些 Cesium 版本或模型可能不允许直接赋值，这里容错处理
    console.warn('无法直接设置 model.customShader.uniforms:', e)
  }

  // 如果有数据，立即用真实数据更新
  if (data) {
    try {
      await updateTexture(data, viewer, model)
    } catch (e) {
      console.error('updateTexture failed in createFloodLayer', e)
    }
  }

  return model
}

export async function updateTexture(data, viewer, model) {
  const newTexture = createTexture(data, viewer)
  await newTexture.readyPromise
  try {
    if (model && model.customShader && model.customShader.uniforms) {
      model.customShader.uniforms.u_dynamicTexture = newTexture
    } else {
      // fallback: nothing
      console.warn('model.customShader.uniforms not available to set texture')
    }
  } catch (e) {
    console.error('Failed to set new texture on model', e)
  }
  return newTexture
}
