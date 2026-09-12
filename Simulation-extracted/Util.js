/**
 * Cesium GPGPU Simulation Utility
 * 提供 CustomPrimitive、RenderUtil、坐标工具等公共基础设施
 *
 * @dependency window.Cesium (全局引入)
 */

import * as Cesium from 'cesium'

// ============================================================
//  CustomPrimitive — 封装 Cesium DrawCommand / ComputeCommand
// ============================================================
export class CustomPrimitive {
  constructor(options) {
    this.commandType = options.commandType

    this.geometry = options.geometry
    this.attributeLocations = options.attributeLocations
    this.primitiveType = options.primitiveType

    this.uniformMap = options.uniformMap

    this.vertexShaderSource = options.vertexShaderSource
    this.fragmentShaderSource = options.fragmentShaderSource

    this.rawRenderState = options.rawRenderState
    this.framebuffer = options.framebuffer

    this.outputTexture = options.outputTexture

    this.autoClear = options.autoClear ?? false
    this.preExecute = options.preExecute

    this.modelMatrix = options.modelMatrix ?? Cesium.Matrix4.IDENTITY
    // OPAQUE(默认) / TRANSLUCENT：预计算帧的叠加层必须走 TRANSLUCENT，
    // 否则没有 boundingVolume 的 DrawCommand 会在 OPAQUE 里最先绘制，被随后绘制的地球瓦片覆盖。
    this.pass = options.pass ?? Cesium.Pass.OPAQUE
    this.show = true
    this.commandToExecute = undefined
    this.clearCommand = undefined
    if (this.autoClear) {
      this.clearCommand = new Cesium.ClearCommand({
        color: new Cesium.Color(0.0, 0.0, 0.0, 0.0),
        depth: 1.0,
        framebuffer: this.framebuffer,
        pass: Cesium.Pass.OPAQUE
      })
    }
  }

  createCommand(context) {
    switch (this.commandType) {
      case 'Draw': {
        let vertexArray = Cesium.VertexArray.fromGeometry({
          context: context,
          geometry: this.geometry,
          attributeLocations: this.attributeLocations,
          bufferUsage: Cesium.BufferUsage.STATIC_DRAW
        })

        let shaderProgram = Cesium.ShaderProgram.fromCache({
          context: context,
          attributeLocations: this.attributeLocations,
          vertexShaderSource: this.vertexShaderSource,
          fragmentShaderSource: this.fragmentShaderSource
        })

        let renderState = Cesium.RenderState.fromCache(this.rawRenderState)
        return new Cesium.DrawCommand({
          owner: this,
          vertexArray: vertexArray,
          primitiveType: this.primitiveType,
          uniformMap: this.uniformMap,
          modelMatrix: this.modelMatrix,
          shaderProgram: shaderProgram,
          framebuffer: this.framebuffer,
          renderState: renderState,
          pass: this.pass
        })
      }
      case 'Compute': {
        return new Cesium.ComputeCommand({
          owner: this,
          fragmentShaderSource: this.fragmentShaderSource,
          uniformMap: this.uniformMap,
          outputTexture: this.outputTexture,
          persists: true
        })
      }
    }
  }

  setGeometry(context, geometry) {
    this.geometry = geometry
    let vertexArray = Cesium.VertexArray.fromGeometry({
      context: context,
      geometry: this.geometry,
      attributeLocations: this.attributeLocations,
      bufferUsage: Cesium.BufferUsage.STATIC_DRAW
    })
    this.commandToExecute.vertexArray = vertexArray
  }

  update(frameState) {
    if (!this.show) return

    if (!Cesium.defined(this.commandToExecute)) {
      this.commandToExecute = this.createCommand(frameState.context)
    }

    if (Cesium.defined(this.preExecute)) {
      this.preExecute()
    }

    if (Cesium.defined(this.clearCommand)) {
      frameState.commandList.push(this.clearCommand)
    }
    frameState.commandList.push(this.commandToExecute)
  }

  isDestroyed() { return false }

  destroy() {
    if (Cesium.defined(this.commandToExecute)) {
      this.commandToExecute.shaderProgram =
        this.commandToExecute.shaderProgram && this.commandToExecute.shaderProgram.destroy()
    }
    return Cesium.destroyObject(this)
  }
}

// ============================================================
//  RenderUtil — 纹理 / Framebuffer / 全屏Quad
// ============================================================
export class RenderUtil {
  constructor() {}

  static getFullscreenQuad() {
    let fullscreenQuad = new Cesium.Geometry({
      attributes: new Cesium.GeometryAttributes({
        position: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          componentsPerAttribute: 3,
          values: new Float32Array([
            -1, -1, 0,  1, -1, 0,  1, 1, 0,  -1, 1, 0
          ])
        }),
        st: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])
        })
      }),
      indices: new Uint32Array([3, 2, 0, 0, 2, 1])
    })
    return fullscreenQuad
  }

  static createTexture(options) {
    if (Cesium.defined(options.arrayBufferView)) {
      let source = { arrayBufferView: options.arrayBufferView }
      options.source = source
    }
    return new Cesium.Texture(options)
  }

  static createFramebuffer(context, colorTexture, depthTexture) {
    return new Cesium.Framebuffer({
      context: context,
      colorTextures: [colorTexture],
      depthTexture: depthTexture
    })
  }
}

// ============================================================
//  坐标工具
// ============================================================

/** 以点为原点建立局部坐标系(东=+x,北=+y)，返回偏移点的世界坐标 */
export const getNorthPointByDistance = (position, offset) => {
  var localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)
  return Cesium.Matrix4.multiplyByPoint(
    localToWorld_Matrix,
    Cesium.Cartesian3.fromElements(offset[0], offset[1], 0),
    new Cesium.Cartesian3()
  )
}

/** 计算两点间方位角(度)和大地线距离(米) */
export const angle = (A, B) => {
  const localToWorld = Cesium.Transforms.eastNorthUpToFixedFrame(A)
  const worldToLocal = Cesium.Matrix4.inverse(localToWorld, new Cesium.Matrix4())
  const localPosition_A = Cesium.Matrix4.multiplyByPoint(worldToLocal, A, new Cesium.Cartesian3())
  const localPosition_B = Cesium.Matrix4.multiplyByPoint(worldToLocal, B, new Cesium.Cartesian3())
  const angle = Math.atan2(localPosition_B.x - localPosition_A.x, localPosition_B.y - localPosition_A.y)
  let theta = angle * (180 / Math.PI)
  if (theta < 0) theta = theta + 360

  var geodesic = new Cesium.EllipsoidGeodesic()
  geodesic.setEndPoints(Cesium.Cartographic.fromCartesian(A), Cesium.Cartographic.fromCartesian(B))
  var distance = geodesic.surfaceDistance
  return { theta, distance }
}

/** 生成 ENU ModelMatrix */
export const generateModelMatrix = (position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) => {
  const rotationX = Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rotation[0]))
  )
  const rotationY = Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(rotation[1]))
  )
  const rotationZ = Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotation[2]))
  )
  if (!(position instanceof Cesium.Cartesian3)) {
    position = Cesium.Cartesian3.fromDegrees(...position)
  }
  const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)
  Cesium.Matrix4.multiply(enuMatrix, rotationX, enuMatrix)
  Cesium.Matrix4.multiply(enuMatrix, rotationY, enuMatrix)
  Cesium.Matrix4.multiply(enuMatrix, rotationZ, enuMatrix)
  const scaleMatrix = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(...scale))
  return Cesium.Matrix4.multiply(enuMatrix, scaleMatrix, new Cesium.Matrix4())
}

/** base64 → HTML Image */
export const base64ToImg = async base64 => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = base64
    img.onload = function () { resolve(img) }
    img.onerror = function (e) { reject(e) }
  })
}

/**
 * 颜色插值 — 在 Cesium.Color 数组间按比例插值
 * @param {Cesium.Color[]} colors - 至少2个颜色
 * @param {number} ratio - 0~1
 */
export function interpolateCesiumColor(colors, ratio) {
  if (!Array.isArray(colors) || colors.length < 2) {
    throw new Error('colors must be an array with at least 2 elements')
  }
  if (ratio < 0 || ratio > 1) {
    throw new Error('ratio must be between 0 and 1')
  }
  const segmentCount = colors.length - 1
  const segmentIndex = Math.min(Math.floor(ratio * segmentCount), segmentCount - 1)
  const segmentRatio = (ratio - segmentIndex / segmentCount) * segmentCount
  const startColor = colors[segmentIndex]
  const endColor = colors[segmentIndex + 1]
  const red = startColor.red + (endColor.red - startColor.red) * segmentRatio
  const green = startColor.green + (endColor.green - startColor.green) * segmentRatio
  const blue = startColor.blue + (endColor.blue - startColor.blue) * segmentRatio
  const alpha = startColor.alpha + (endColor.alpha - startColor.alpha) * segmentRatio
  return new Cesium.Color(red, green, blue, alpha)
}

export default { CustomPrimitive, RenderUtil, getNorthPointByDistance, angle, generateModelMatrix, base64ToImg, interpolateCesiumColor }
