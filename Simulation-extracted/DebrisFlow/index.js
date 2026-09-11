/* eslint-disable no-undef */
import * as Cesium from 'cesium'
import { CustomPrimitive, RenderUtil, getNorthPointByDistance, angle, generateModelMatrix, base64ToImg } from '../Util.js'

import Command from './shaders/Command.glsl?raw'
import BufferA from './shaders/BufferA.glsl?raw'
import BufferB from './shaders/BufferB.glsl?raw'
import BufferC from './shaders/BufferC.glsl?raw'
import BufferD from './shaders/BufferD.glsl?raw'
import BufferRange from './shaders/BufferRange.glsl?raw'
import BufferDraw from './shaders/BufferDraw.glsl?raw'

// const { sampleHeightMostDetailed } = Cesium.Scene
import * as turf from '@turf/turf'
// import shWorker from './sampleHeightWebWorker.js?worker' // 引入 worker 文件，通过 ?worker 标识

// const sampleHeightWith3DTiles = async (viewer, positions) => {
//   const promises = []
//   positions.forEach((pos, index) => {
//     const promise = new Promise((resolve, reject) => {
//       let worker = new shWorker()
//       console.log('addWorker:' + index)
//       worker.postMessage({ viewer: viewer, position, pos })
//       worker.onmessage = e => {
//         console.log('finshed:' + index)
//         resolve(e)
//       }
//     })
//     promises.push(promise)
//   })
//   return Promise.all(promises)
// }

const sampleHeightWith3DTiles = async (viewer, positions) => {
  const promises = []
  positions.forEach((pos, index) => {
    const promise = new Promise((resolve, reject) => {
      pos.height = viewer.scene.sampleHeight(pos)
      if (!pos.height) debugger
      if (pos.height == undefined) debugger
      resolve(pos)
      console.log('finshed:' + index)
    })
    promises.push(promise)
  })
  return Promise.all(promises)
}

class DebrisFlow {
  constructor(options) {
    this._viewer = options.viewer
    this._width = options.width ?? 1024
    this._height = options.height ?? 1024
    this.cellSize = options.cellSize ?? 30

    this.rect = new Cesium.Cartesian2(options.rect[0], options.rect[1])

    this._resolution = new Cesium.Cartesian2(this._width, this._height)

    this._waterAdd = new Cesium.Cartesian4(0, 0, 0, 0)
    this.deepWaterColor = options.deepWaterColor ?? '#5C4225'
    this.lightWaterColor = options.lightWaterColor ?? '#B78C12'
    this.renderTerrain = options.renderTerrain ?? false
    this.renderHeatMap = options.renderHeatMap ?? false
    this.renderOriginData = options.renderOriginData ?? false
    this.renderOriginData2 = options.renderOriginData2 ?? false
    this.renderOriginData3 = options.renderOriginData3 ?? false

    this.LakeGeoJson = options.debrisJSON
    this.lakeName = options.lakeName
    this.range = new Cesium.Cartesian2(options.range[0], options.range[1])
    this.dataSet = []
    this.dataSet2 = []
    this.dataSet3 = []
    this.renderSpeed = 1.0

    this.preRender = options.preRender
    this.postRender = options.postRender
    this.onDataUpdate = options.onDataUpdate
  }

  /**
   * Same as initBox but WITHOUT sampling the online terrain for every CPU grid cell.
   * The DEM texture is only used by the pass-1 terrain shader (disabled for pre-computed
   * ASC frames), so a flat DEM keeps positioning correct while avoiding thousands of
   * Cesium.sampleTerrain requests that can break the terrain availability tree.
   */
  async initBoxFlat(options) {
    this.center = options.center
    // Flat DEM => max === min, so the mesh would collapse to zero thickness in initRender.
    this.flatMinThickness = Number.isFinite(Number(options.minThickness)) ? Number(options.minThickness) : 20
    const terrainHeight = Number.isFinite(Number(options.terrainHeight)) ? Number(options.terrainHeight) : 0
    // genDemTexture reads longitude/latitude for every cell, so provide the centre
    // coordinates for all cells (the beta path uses an empty debris feature set).
    const centerCarto = Cesium.Cartographic.fromCartesian(this.center)
    const lonRad = centerCarto.longitude
    const latRad = centerCarto.latitude
    const terrainData = new Array(this._width * this._height)
    for (let i = 0; i < terrainData.length; i++) {
      terrainData[i] = { height: terrainHeight, longitude: lonRad, latitude: latRad }
    }
    await this.genDemTexture(terrainData)
    this.initShader()
    await this.initTexture()
    this.initFrameBuffer()
    this.initRender()
  }

  async initBox(options) {
    this.center = options.center
    const terrainData = this.lakeName == 'YaAn' ? YaAnHeight : await this.initTerrain(options.center, options.level)
    // const terrainData = await this.initTerrain(options.center, options.level)
    await this.genDemTexture(terrainData)
    this.initShader()
    await this.initTexture()
    this.initFrameBuffer()
    this.initRender()
  }

  initTerrain(center, level) {
    const positions = []
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const offset = [(x - this._width / 2 + 0.5) * this.cellSize, (y - this._height / 2 + 0.5) * this.cellSize]
        const cellCenter = getNorthPointByDistance(center, offset)
        positions.push(Cesium.Cartographic.fromCartesian(cellCenter))
      }
    }
    if (this.lakeName == 'YaAn') return sampleHeightWith3DTiles(this._viewer, positions)
    else return Cesium.sampleTerrain(this._viewer.terrainProvider, level, positions)
    // return viewer.scene.sampleHeightMostDetailed(positions)
  }

  genDemForModel(data) {}

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.src = url
      img.onload = () => {
        // 当图像加载完成后进行resolve
        resolve(img)
      }
      img.onerror = () => {
        reject(new Error('图像加载失败'))
      }
    })
  }

  async genDemTexture(data) {
    this.terrainData = data
    const width = this._width
    const height = this._height

    const texData = new Float32Array(width * height * 4)
    const texDataLake = new Float32Array(width * height * 4)

    let sourceIdx = 0
    const sourceMax = 300

    const demBuffer = new ArrayBuffer(width * height * 4) // 每个 int 占 4 字节
    const binghuBuffer = new ArrayBuffer(width * height * 4) // 每个 int 占 4 字节
    const sourceBuffer = new ArrayBuffer(width * height * 4) // 每个 int 占 4 字节
    const glacierBuffer = new ArrayBuffer(width * height * 4) // 每个 int 占 4 字节
    const demDataView = new DataView(demBuffer)
    const binghuDataView = new DataView(binghuBuffer)
    const sourceDataView = new DataView(sourceBuffer)
    const glacierDataView = new DataView(glacierBuffer)

    let max = 0,
      min = 999999
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let originalIndex = y * width + x
        let flippedIndex = (height - 1 - y) * width + x

        max = Math.max(data[originalIndex].height, max)
        min = Math.min(data[originalIndex].height, min)
      }
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max)
    }

    // 遍历原始图像数据，按照上下翻转的方式将像素值填充到新的 ImageData 对象中
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // 计算原始图像数据和翻转后图像数据的索引
        let originalIndex = y * width + x
        let flippedIndex = (height - 1 - y) * width + x

        const h = clamp((data[originalIndex].height - min) / (max - min), 0, 1)
        texData[originalIndex * 4] =
          texData[originalIndex * 4 + 1] =
          texData[originalIndex * 4 + 2] =
          texData[originalIndex * 4 + 3] =
            h

        demDataView.setInt32(flippedIndex * 4, data[originalIndex].height, !true) // 小端序（true 表示小端序）
        glacierDataView.setInt32(flippedIndex * 4, 100, !true) // 小端序（true 表示小端序）

        const pt = turf.point([
          Cesium.Math.toDegrees(data[originalIndex].longitude),
          Cesium.Math.toDegrees(data[originalIndex].latitude)
        ])

        this.LakeGeoJson.features.forEach(feature => {
          if (turf.booleanPointInPolygon(pt, feature)) {
            texDataLake[originalIndex * 4] =
              texDataLake[originalIndex * 4 + 1] =
              texDataLake[originalIndex * 4 + 2] =
              texDataLake[originalIndex * 4 + 3] =
                1

            binghuDataView.setInt32(flippedIndex * 4, 80, false) // 小端序（true 表示小端序）
            if (sourceIdx < sourceMax) {
              sourceDataView.setInt32(flippedIndex * 4, 10, false) // 小端序（true 表示小端序）
              sourceIdx++
            }
          }
        })
      }
    }
    this.demMap = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: texData
    })
    this.lakeMap = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: texDataLake
    })
    this.waterHeightMap = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: texDataLake
    })
    this.phase2 = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: texDataLake
    })
    this.phase3 = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: texDataLake
    })
    this.rangeMap = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: texDataLake
    })
    this.rangeTempMap = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: texDataLake
    })

    this.max = max
    this.min = min

    this.texData = texData

    this.demBlob = new Blob([demBuffer], {
      type: 'application/octet-stream'
    })
    this.binghuBlob = new Blob([binghuBuffer], {
      type: 'application/octet-stream'
    })
    this.sourceBlob = new Blob([sourceBuffer], {
      type: 'application/octet-stream'
    })
    this.glacierBlob = new Blob([glacierBuffer], {
      type: 'application/octet-stream'
    })

    this.demBuffer = demBuffer
    this.binghuBuffer = binghuBuffer
    this.sourceBuffer = sourceBuffer
    this.glacierBuffer = glacierBuffer

    // saveTxt(demBuffer, "dem.txt", this._width);
    // saveTxt(binghuBuffer, "binghu.txt", this._width);
    // saveTxt(sourceBuffer, "source.txt", this._width);
    // saveTxt(glacierBuffer, "glacier.txt", this._width);
  }

  scaleDemTex() {
    const texData = new Float32Array(this._width * this._height * 4)
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        // 计算原始图像数据和翻转后图像数据的索引
        const scaleIndex = y * this._width + x
        const originalIndex = parseInt(y) * this._width + parseInt(x)

        // 将原始图像数据的像素值填充到翻转后图像数据中
        texData[scaleIndex * 4] = this.texData[originalIndex * 4]
        texData[scaleIndex * 4 + 1] = this.texData[originalIndex * 4 + 1]
        texData[scaleIndex * 4 + 2] = this.texData[originalIndex * 4 + 2]
        texData[scaleIndex * 4 + 3] = this.texData[originalIndex * 4 + 3]
      }
    }
    this.texData = texData
    this.demMap = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: texData
    })
  }

  initShader() {
    // 公共变量
    this.Command =
      `precision highp float;
      const int textureSize = ` +
      this._width +
      `;
      const float heightRange = ` +
      (Number.isFinite(this.max - this.min) ? Math.max(this.max - this.min, this.flatMinThickness || 0).toFixed(6) : '0.0') +
      `;` +
      Command
    // 计算地形和更新水位pass 1
    this.BufferA = BufferA

    // 更新水流量pass
    this.BufferB = BufferB

    // 水位计算pass2
    this.BufferC = BufferC

    // 水流量计算pass2
    this.BufferD = BufferD

    this.renderShaderSource = BufferDraw

    this.bufferRange = BufferRange
  }

  async initTexture() {
    this.texA = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: new Float32Array(this._width * this._height * 4)
    })
    this.texB = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: new Float32Array(this._width * this._height * 4)
    })
    this.texC = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: new Float32Array(this._width * this._height * 4)
    })
    this.texD = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: new Float32Array(this._width * this._height * 4)
    })

    // Render Box
    // this.terrainMap = this._viewer.scene.frameState.context.defaultTexture;
    // const image = await Cesium.Resource.fetchImage({
    //   url: "/SimulateData/terrainColorMap.jpg",
    // });
    // this.terrainMap = new Cesium.Texture({
    //   context: this._viewer.scene.frameState.context,
    //   source: image,
    //   sampler: new Cesium.Sampler({
    //     wrapS: Cesium.TextureWrap.REPEAT,
    //     wrapT: Cesium.TextureWrap.REPEAT,
    //     magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
    //     minificationFilter:
    //       Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR,
    //   }),
    // });
    // this.terrainMap.generateMipmap();
  }

  initFrameBuffer() {
    const _this = this
    // Render Buffers
    this.quadGeometry = RenderUtil.getFullscreenQuad()

    this.Buffer_RangeT = new CustomPrimitive({
      commandType: 'Compute',
      uniformMap: {
        rect: () => {
          return this.rect
        },
        rangeMap: () => {
          return this.rangeMap
        },
        waterHeightMap: () => {
          return this.waterHeightMap
        }
      },
      fragmentShaderSource: new Cesium.ShaderSource({
        sources: [this.Command, this.bufferRange]
      }),
      geometry: this.quadGeometry,
      outputTexture: this.rangeTempMap,
      preExecute: function () {
        _this.Buffer_RangeT.commandToExecute.outputTexture = _this.rangeTempMap
      }
    })
    this.Buffer_Range = new CustomPrimitive({
      commandType: 'Compute',
      uniformMap: {
        rect: () => {
          return this.rect
        },
        rangeMap: () => {
          return this.rangeTempMap
        },
        waterHeightMap: () => {
          return this.waterHeightMap
        }
      },
      fragmentShaderSource: new Cesium.ShaderSource({
        sources: [this.Command, this.bufferRange]
      }),
      geometry: this.quadGeometry,
      outputTexture: this.rangeMap,
      preExecute: function () {
        _this.Buffer_Range.commandToExecute.outputTexture = _this.rangeMap
      }
    })

    // BufferA
    this.Buffer_A = new CustomPrimitive({
      commandType: 'Compute',
      uniformMap: {
        iTime: () => {
          return this.time
        },
        iFrame: () => {
          return this.frame
        },
        waterAdd: () => {
          return this._waterAdd
        },
        resolution: () => {
          return this._resolution
        },
        range: () => {
          return this.range
        },
        TerrainWaterMap: () => {
          return this.texC
        },
        OutFlow: () => {
          return this.texD
        },
        heightMap: () => {
          return this.demMap
        },
        lakeMap: () => {
          return this.lakeMap
        },
        rangeMap: () => {
          return this.rangeMap
        },
        waterHeightMap: () => {
          return this.waterHeightMap
        }
      },
      fragmentShaderSource: new Cesium.ShaderSource({
        sources: [this.Command, this.BufferA]
      }),
      geometry: this.quadGeometry,
      outputTexture: this.texA,
      preExecute: function () {
        _this.Buffer_A.commandToExecute.outputTexture = _this.texA
      }
    })

    // BufferB
    this.Buffer_B = new CustomPrimitive({
      commandType: 'Compute',
      uniformMap: {
        iTime: () => {
          return this.time
        },
        iFrame: () => {
          return this.frame
        },
        resolution: () => {
          return this._resolution
        },
        iChannel0: () => {
          return this.texA
        },
        iChannel1: () => {
          return this.texD
        },
        waterHeightMap: () => {
          return this.waterHeightMap
        },
        rangeMap: () => {
          return this.rangeMap
        }
      },
      fragmentShaderSource: new Cesium.ShaderSource({
        sources: [this.Command, this.BufferB]
      }),
      geometry: this.quadGeometry,
      outputTexture: this.texB,
      preExecute: function () {
        _this.Buffer_B.commandToExecute.outputTexture = _this.texB
      }
    })

    // BufferC
    this.Buffer_C = new CustomPrimitive({
      commandType: 'Compute',
      uniformMap: {
        iTime: () => {
          return this.time
        },
        iFrame: () => {
          return this.frame
        },
        resolution: () => {
          return this._resolution
        },
        range: () => {
          return this.range
        },
        iChannel0: () => {
          return this.texA
        },
        iChannel1: () => {
          return this.texB
        },
        rangeMap: () => {
          return this.rangeMap
        },
        waterHeightMap: () => {
          return this.waterHeightMap
        }
      },
      fragmentShaderSource: new Cesium.ShaderSource({
        sources: [this.Command, this.BufferC]
      }),
      geometry: this.quadGeometry,
      outputTexture: this.texC,
      preExecute: function () {
        _this.Buffer_C.commandToExecute.outputTexture = _this.texC
      }
    })

    // BufferD
    this.Buffer_D = new CustomPrimitive({
      commandType: 'Compute',
      uniformMap: {
        iTime: () => {
          return this.time
        },
        iFrame: () => {
          return this.frame
        },
        resolution: () => {
          return this._resolution
        },
        iChannel0: () => {
          return this.texC
        },
        iChannel1: () => {
          return this.texB
        },
        waterHeightMap: () => {
          return this.waterHeightMap
        },
        rangeMap: () => {
          return this.rangeMap
        }
      },
      fragmentShaderSource: new Cesium.ShaderSource({
        sources: [this.Command, this.BufferD]
      }),
      geometry: this.quadGeometry,
      outputTexture: this.texD,
      preExecute: function () {
        _this.Buffer_D.commandToExecute.outputTexture = _this.texD
      }
    })
  }

  initRender() {
    const heightOffset = {
      QZKC: -300,
      JLC: -300,
      YaAn: 0,
      avaflow: -200
    }
    const cartographicCenter = Cesium.Cartographic.fromCartesian(this.center)
    const degreeCenter = [
      Cesium.Math.toDegrees(cartographicCenter.longitude),
      Cesium.Math.toDegrees(cartographicCenter.latitude),
      // cartographicCenter.height,
      (this.max + this.min) / 2 + (heightOffset[this.lakeName] ?? 0)
      // this.max,
    ]

    // Render Command
    const modelMatrix = generateModelMatrix(
      // [120.20998865783179, 30.13650797533829, 300],
      degreeCenter,
      [90, 0, 0],
      [
        this._width * this.cellSize,
        this.meshThickness = Math.max(this.max - this.min, this.flatMinThickness || 0),
        // 1600,
        this._height * this.cellSize
      ]
    )
    const boxGeometry = Cesium.BoxGeometry.fromDimensions({
      vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
      dimensions: new Cesium.Cartesian3(1, 1, 1)
    })
    const geometry = Cesium.BoxGeometry.createGeometry(boxGeometry)
    const attributelocations = Cesium.GeometryPipeline.createAttributeLocations(geometry)
    this.fluidCommand = new CustomPrimitive({
      commandType: 'Draw',
      uniformMap: {
        iTime: () => {
          return this.time
        },
        iFrame: () => {
          return this.frame
        },
        iResolution: () => {
          return this._resolution
        },
        iChannel0: () => {
          return this.texC
        },
        // iChannel1: () => {
        //   return this.terrainMap;
        // },
        heightMap: () => {
          return this.demMap
        },
        waterColor: () => {
          return Cesium.Color.fromCssColorString(_this.deepWaterColor)
        },
        lightWaterColor: () => {
          return Cesium.Color.fromCssColorString(_this.lightWaterColor)
        },
        waterHeightMap: () => {
          return this.waterHeightMap
        },
        phase2: () => {
          return this.phase2
        },
        phase3: () => {
          return this.phase3
        },
        rangeMap: () => {
          return this.rangeMap
        },
        renderTerrain: () => {
          return this.renderTerrain
        },
        renderHeatMap: () => {
          return this.renderHeatMap
        },
        renderOriginData: () => {
          return this.renderOriginData
        },
        renderOriginData2: () => {
          return this.renderOriginData2
        },
        renderOriginData3: () => {
          return this.renderOriginData3
        }
      },
      geometry: geometry,
      modelMatrix: modelMatrix,
      attributeLocations: attributelocations,
      vertexShaderSource: new Cesium.ShaderSource({
        sources: [
          `
                   in vec3 position;
                   in vec2 st;
                 
                   out vec3 vo;
                   out vec3 vd;
                   out vec2 v_st;
                   void main()
                   {    
                       vo = czm_encodedCameraPositionMCHigh + czm_encodedCameraPositionMCLow;
                       vd = position - vo;
                       v_st = st;
                       gl_Position = czm_modelViewProjection * vec4(position,1.0);
                   }
                   `
        ]
      }),
      fragmentShaderSource: new Cesium.ShaderSource({
        sources: [this.Command + this.renderShaderSource]
      }),
      rawRenderState: {
        depthTest: {
          enabled: true
          // func: DepthFunction.LESS,
        },
        blending: Cesium.BlendingState.ALPHA_BLEND
      }
    })

    this._viewer.scene.primitives.add(this.Buffer_RangeT)
    this._viewer.scene.primitives.add(this.Buffer_Range)
    this._viewer.scene.primitives.add(this.Buffer_A)
    this._viewer.scene.primitives.add(this.Buffer_B)
    this._viewer.scene.primitives.add(this.Buffer_C)
    this._viewer.scene.primitives.add(this.Buffer_D)
    this._viewer.scene.primitives.add(this.fluidCommand)

    // Render Event
    const _this = this
    this.time = 0.0
    this.frame = 0
    this.dataSetIdx = 0

    this.preEvent = () => {
      _this.preRender && _this.preRender(_this)
    }
    this.postEvent = () => {
      const now = performance.now()
      _this.time += 0.002 * _this.renderSpeed
      _this.frame += 0.01 * _this.renderSpeed

      if (_this.dataSet.length) {
        // _this.setWaterHeight(_this.dataSet[_this.dataSetIdx])
        _this.updateDataSets(_this.dataSetIdx)

        _this.dataSetIdx = Number.parseInt((_this.frame * 2) % _this.dataSet.length)
        if (_this.dataSetIdx >= _this.dataSet.length) _this.dataSetIdx = _this.dataSet.length - 1

        _this.onDataUpdate && _this.onDataUpdate(_this)
      }

      _this.postRender && _this.postRender(_this)
    }

    this._viewer.scene.preRender.addEventListener(this.preEvent)
    this._viewer.scene.postRender.addEventListener(this.postEvent)
  }

  addWater(position, strenght) {
    const { theta, distance } = angle(this.center, position)
    const dis_north = distance * Math.cos(Cesium.Math.toRadians(theta))
    const dis_east = distance * Math.sin(Cesium.Math.toRadians(theta))
    if (Math.abs(dis_north) > this._height * this.cellSize || Math.abs(dis_east) > this._width * this.cellSize) {
      this._waterAdd.w = 0
      return
    }
    const x = parseInt(dis_east / this.cellSize) + this._width / 2
    const y = parseInt(dis_north / this.cellSize) + this._height / 2

    this._waterAdd.x = x
    this._waterAdd.y = this._height - 1 - y
    this._waterAdd.z = strenght
    this._waterAdd.w = 1
  }
  StopAddWater() {
    this._waterAdd.w = 0
  }
  async pushFortronData(base64) {
    this.dataSet.push('data:image/png;base64,' + base64)
  }

  async updateDataSets(dataSetIdx) {
    const img = await base64ToImg(this.dataSet[dataSetIdx])

    const newTex = new Cesium.Texture({
      context: this._viewer.scene.frameState.context,
      source: img,
      flipY: false,
      sampler: new Cesium.Sampler({
        wrapS: Cesium.TextureWrap.REPEAT,
        wrapT: Cesium.TextureWrap.REPEAT,
        magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
        minificationFilter: Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR
      })
    })
    newTex.generateMipmap()
    let oldTex = this.waterHeightMap
    this.waterHeightMap = newTex
    oldTex.destroy()

    const img2 = await base64ToImg(this.dataSet2[dataSetIdx])
    const newTex2 = new Cesium.Texture({
      context: this._viewer.scene.frameState.context,
      source: img2,
      flipY: false,
      sampler: new Cesium.Sampler({
        wrapS: Cesium.TextureWrap.REPEAT,
        wrapT: Cesium.TextureWrap.REPEAT,
        magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
        minificationFilter: Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR
      })
    })
    newTex2.generateMipmap()
    oldTex = this.phase2
    this.phase2 = newTex2
    oldTex.destroy()

    const img3 = await base64ToImg(this.dataSet3[dataSetIdx])
    const newTex3 = new Cesium.Texture({
      context: this._viewer.scene.frameState.context,
      source: img3,
      flipY: false,
      sampler: new Cesium.Sampler({
        wrapS: Cesium.TextureWrap.REPEAT,
        wrapT: Cesium.TextureWrap.REPEAT,
        magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
        minificationFilter: Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR
      })
    })
    newTex3.generateMipmap()
    oldTex = this.phase3
    this.phase3 = newTex3
    oldTex.destroy()
  }

  async setWaterHeight(base64) {
    const img = await base64ToImg(base64)

    const newTex = new Cesium.Texture({
      context: this._viewer.scene.frameState.context,
      source: img,
      flipY: false,
      sampler: new Cesium.Sampler({
        wrapS: Cesium.TextureWrap.REPEAT,
        wrapT: Cesium.TextureWrap.REPEAT,
        magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
        minificationFilter: Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR
      })
    })
    newTex.generateMipmap()
    const oldTex = this.waterHeightMap
    this.waterHeightMap = newTex
    oldTex.destroy()
  }

  async getInundation(index) {
    const _this = this
    const promise = new Promise((resolve, reject) => {
      base64ToUint8Array(_this.dataSet[_this.dataSetIdx]).then(dataArray => {
        const points = []
        for (let y = 0; y < _this._height; y++) {
          for (let x = 0; x < _this._width; x++) {
            // 计算原始图像数据和翻转后图像数据的索引
            let originalIndex = y * _this._width + x
            let flippedIndex = (_this._height - 1 - y) * _this._width + x

            if (
              dataArray[flippedIndex * 4] != 0 &&
              dataArray[flippedIndex * 4 + 1] != 0 &&
              dataArray[flippedIndex * 4 + 2] != 0
            ) {
              const offset = [
                (x - _this._width / 2 + 0.5) * _this.cellSize,
                (y - _this._height / 2 + 0.5) * _this.cellSize
              ]
              const cellCenter = getNorthPointByDistance(_this.center, offset)
              const cart = Cesium.Cartographic.fromCartesian(cellCenter)
              points.push(turf.point([Cesium.Math.toDegrees(cart.longitude), Cesium.Math.toDegrees(cart.latitude)]))
            }
          }
        }
        const options = { units: 'miles', maxEdge: 10 }

        const hull = turf.convex(turf.featureCollection(points), options)
        // const dataSource = await Cesium.GeoJsonDataSource.load(hull)
        // this._viewer.dataSources.add(dataSource)
        resolve(hull)
      })
    })
    return promise
  }

  /**
   * 从 ASC 文件直接生成 waterHeightMap 纹理（重采样 + Y 翻转 + 归一化）
   * @param {string} url - ASC 文件的 URL
   * @param {number} [maxValue] - 物理最大值，不传则自动从数据中计算
   */
  async loadAscAsWaterHeight(url, maxValue) {
    const text = await fetch(url).then(r => r.text())
    const lines = text.trim().split(/\r?\n/)

    const header = {}
    for (let i = 0; i < 6; i++) {
      const parts = lines[i].trim().split(/\s+/)
      header[parts[0].toLowerCase()] = Number(parts[1])
    }
    const ncols = header.ncols
    const nrows = header.nrows
    const nodata = header.nodata_value

    const values = new Float32Array(ncols * nrows)
    let idx = 0
    for (let i = 6; i < lines.length; i++) {
      const row = lines[i].trim().split(/\s+/).map(Number)
      for (const v of row) { if (idx < values.length) values[idx++] = v === nodata ? 0 : v }
    }

    let computedMax = Number(maxValue)
    if (!(computedMax > 0)) {
      computedMax = 0
      for (const v of values) {
        if (v > computedMax) computedMax = v
      }
    }
    this.range = new Cesium.Cartesian2(0, computedMax)

    // 重采样到渲染纹理尺寸
    const texData = new Float32Array(this._width * this._height * 4)
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const srcX = Math.min(ncols - 1, Math.floor((x / this._width) * ncols))
        const srcYFromBottom = Math.min(nrows - 1, Math.floor((y / this._height) * nrows))
        const srcY = nrows - 1 - srcYFromBottom  // Y 翻转：ASC 首行是北侧
        const v = values[srcY * ncols + srcX]
        const normalized = Cesium.Math.clamp(v / computedMax, 0, 1)
        const t = (y * this._width + x) * 4
        texData[t] = normalized
        texData[t + 1] = normalized
        texData[t + 2] = normalized
        texData[t + 3] = 1
      }
    }

    const newTex = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: texData,
    })
    if (this.waterHeightMap) this.waterHeightMap.destroy()
    this.waterHeightMap = newTex
    console.log('[loadAscAsWaterHeight]', ncols, 'x', nrows, '→', this._width, 'x', this._height, 'max:', computedMax.toFixed(2))
  }

  remove() {
    const primitives = [
      this.fluidCommand,
      this.Buffer_D,
      this.Buffer_C,
      this.Buffer_B,
      this.Buffer_A,
      this.Buffer_Range,
      this.Buffer_RangeT
    ]
    for (const primitive of primitives) {
      if (primitive && !primitive.isDestroyed?.()) {
        try {
          this._viewer.scene.primitives.remove(primitive)
        } catch (e) {
          console.warn('[DebrisFlow] remove primitive failed:', e)
        }
      }
    }
    if (this.preEvent) this._viewer.scene.preRender.removeEventListener(this.preEvent)
    if (this.postEvent) this._viewer.scene.postRender.removeEventListener(this.postEvent)
  }
  destroy() {
    try {
      this.remove()
    } catch (e) {
      console.warn('[DebrisFlow] remove failed:', e)
    }
    const textures = [
      this.demMap,
      this.lakeMap,
      this.waterHeightMap,
      this.phase2,
      this.phase3,
      this.rangeMap,
      this.rangeTempMap,
      this.texA,
      this.texB,
      this.texC,
      this.texD
    ]
    for (const texture of textures) {
      if (texture && !texture.isDestroyed?.()) {
        try {
          texture.destroy()
        } catch (e) {
          console.warn('[DebrisFlow] destroy texture failed:', e)
        }
      }
    }
    this.demMap = null
    this.lakeMap = null
    this.waterHeightMap = null
    this.phase2 = null
    this.phase3 = null
    this.rangeMap = null
    this.rangeTempMap = null
    this.texA = null
    this.texB = null
    this.texC = null
    this.texD = null
  }
}

const base64ToUint8Array = async base64String => {
  const promise = new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const dataArray = imageData.data
      resolve(dataArray)
    }

    img.src = base64String
  })
  return promise
}

/**
 * * base64转file
 * @param dataurl
 * @param fileName
 * @returns
 */
export const base64toFile = (dataurl, fileName) => {
  let dataArr = dataurl.split(','),
    mime = dataArr[0].match(/:(.*?);/)[1],
    bstr = atob(dataArr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, { type: mime })
}

const saveTxt = (buffer, name, width) => {
  const view = new DataView(buffer) // 假设你有一个 100x100 的二维数组
  const rows = width
  const cols = width
  const array = new Array(rows)

  // 填充二维数组（示例数据）
  for (let i = 0; i < rows; i++) {
    array[i] = new Array(cols)
    for (let j = 0; j < cols; j++) {
      array[i][j] = view.getInt32((i * cols + j) * 4, false) // 示例数据
    }
  }

  // 将二维数组转换为字符串
  let content = ''
  for (let i = 0; i < rows; i++) {
    content += array[i].join(' ') + '\n'
  }

  // 创建 Blob 对象
  const blob = new Blob([content], { type: 'text/plain' })

  // 创建下载链接
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = name

  // 触发下载
  link.click()

  // 释放 URL 对象
  URL.revokeObjectURL(link.href)
}

export default DebrisFlow
