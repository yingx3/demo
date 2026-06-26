import * as turf from '@turf/turf'
import proj4 from 'proj4'

import * as Cesium from 'cesium'
import { CustomPrimitive, RenderUtil, getNorthPointByDistance, angle, generateModelMatrix, base64ToImg } from '../Util.js'

import Command from './shaders/Command.glsl?raw'
import BufferA from './shaders/BufferA.glsl?raw'
import BufferB from './shaders/BufferB.glsl?raw'
import BufferC from './shaders/BufferC.glsl?raw'
import BufferD from './shaders/BufferD.glsl?raw'
import BufferVector from './shaders/BufferVector.glsl?raw'
import BufferDraw from './shaders/BufferDraw.glsl?raw'

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

class WaterSimulate {
  constructor(options) {
    this._viewer = options.viewer
    this._width = options.width ?? 1024
    this._height = options.height ?? 1024
    this.center = options.center
    this.level = options.level
    this.cellSize = options.cellSize ?? 30

    this._resolution = new Cesium.Cartesian2(this._width, this._height)

    this._vectorScale = 4
    this._vectorWidth = this._width * this._vectorScale
    this._vectorHeight = this._height * this._vectorScale
    this._vectorResolution = new Cesium.Cartesian2(this._vectorWidth, this._vectorHeight)

    this._waterAdd = new Cesium.Cartesian4(0, 0, 0, 0)
    this.deepWaterColor = '#5C4225'
    this.lightWaterColor = '#B78C12'
    this.renderTerrain = options.renderTerrain ?? false
    this.renderHeatMap = options.renderHeatMap ?? false
    this.renderOriginData = options.renderOriginData ?? false
    this.LakeGeoJson = options.lakeJSON
    this.debrisJSON = options.debrisJSON
    this.lakeTex = options.lakeTex
    this.sourceTex = options.sourceTex
    this.lakeName = options.lakeName
    this.dataSet = []
    this.renderSpeed = 1.0

    this.preRender = options.preRender
    this.postRender = options.postRender
    this.onDataUpdate = options.onDataUpdate
  }

  async initData() {
    const terrainData = await this.initTerrain(this.center, this.level)
    await this.genDemTexture(terrainData, true)
  }

  async initBox(options) {
    const terrainData = await this.initTerrain(this.center, this.level)
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

  async genDemTexture(data, isCustom = false) {
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

        demDataView.setInt32(originalIndex * 4, data[originalIndex].height, !true) // 小端序（true 表示小端序）
        glacierDataView.setInt32(originalIndex * 4, 100, !true) // 小端序（true 表示小端序）

        const pt = turf.point([
          Cesium.Math.toDegrees(data[originalIndex].longitude),
          Cesium.Math.toDegrees(data[originalIndex].latitude)
        ])

        if (isCustom) {
          this.LakeGeoJson.features.forEach(feature => {
            if (turf.booleanPointInPolygon(pt, feature)) {
              texDataLake[originalIndex * 4] =
                texDataLake[originalIndex * 4 + 1] =
                texDataLake[originalIndex * 4 + 2] =
                texDataLake[originalIndex * 4 + 3] =
                  1

              binghuDataView.setInt32(originalIndex * 4, 80, false) // 小端序（true 表示小端序）
              // if (sourceIdx < sourceMax) {
              //   sourceDataView.setInt32(flippedIndex * 4, 10, false) // 小端序（true 表示小端序）
              //   sourceIdx++
              // }
            }
          })

          this.debrisJSON.features.forEach(feature => {
            if (turf.booleanPointInPolygon(pt, feature)) {
              sourceDataView.setInt32(originalIndex * 4, 10, false) // 小端序（true 表示小端序）
            }
          })
        }
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
    if (!isCustom) {
      const lakeImg = await base64ToImg(this.lakeTex, true)

      this.lakeMap = new Cesium.Texture({
        context: this._viewer.scene.frameState.context,
        source: lakeImg,
        flipY: false,
        sampler: new Cesium.Sampler({
          wrapS: Cesium.TextureWrap.REPEAT,
          wrapT: Cesium.TextureWrap.REPEAT,
          magnificationFilter: Cesium.TextureMagnificationFilter.LINEAR,
          minificationFilter: Cesium.TextureMinificationFilter.LINEAR_MIPMAP_LINEAR
        })
      })
      this.lakeMap.generateMipmap()
    }
    this.waterHeightMap = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._width,
      height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: texDataLake
    })
    // debugger
    // const base64 = await floatTextureToBase64(
    //   viewer.canvas.getContext('webgl2'),
    //   this.demMap._texture,
    //   this._width,
    //   this._height
    // )
    // const base642 = await floatTextureToBase64(
    //   viewer.canvas.getContext('webgl2'),
    //   this.lakeMap._texture,
    //   this._width,
    //   this._height
    // )
    // debugger

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

    this.demBlob = this.genBlobWithHeader(demDataView)
    this.binghuBlob = this.genBlobWithHeader(binghuDataView)
    this.sourceBlob = this.genBlobWithHeader(sourceDataView)
    this.glacierBlob = this.genBlobWithHeader(glacierDataView)

    // saveTxt(demBuffer, "dem.txt", this._width);
    // saveTxt(binghuBuffer, "binghu.txt", this._width);
    // saveTxt(sourceBuffer, "source.txt", this._width);
    // saveTxt(glacierBuffer, "glacier.txt", this._width);
  }

  genBlobWithHeader(dataView) {
    const left_top = getNorthPointByDistance(this.center, [
      (-this._width / 2 + 0.5) * this.cellSize,
      (this._height / 2 + 0.5) * this.cellSize
    ])
    const right_bottom = getNorthPointByDistance(this.center, [
      (this._width / 2 + 0.5) * this.cellSize,
      (-this._height / 2 + 0.5) * this.cellSize
    ])
    const { theta, distance } = angle(left_top, right_bottom)
    const left_top_cart = Cesium.Cartographic.fromCartesian(left_top)
    const left_bottom_cart = Cesium.Cartographic.fromCartesian(
      getNorthPointByDistance(left_top, [0, -this._height * this.cellSize])
    )
    // project
    // 定义 WGS84 坐标系
    const wgs84 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
    // 计算 UTM 投影带
    const zone = Math.floor((Cesium.Math.toDegrees(left_bottom_cart.longitude) + 180) / 6) + 1
    const utm = `+proj=utm +zone=${zone} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`
    const [x, y] = proj4(wgs84, utm, [
      Cesium.Math.toDegrees(left_bottom_cart.longitude),
      Cesium.Math.toDegrees(left_bottom_cart.latitude)
    ])

    const asciiJson = {
      ncols: this._width,
      nrows: this._height,
      xllcorner: x,
      yllcorner: y,
      cellsize: this.cellSize,
      NODATA_value: -9999,
      zone: 'EPSG:326' + zone
    }

    // 构建ASCII文件头部
    const header = [
      `ncols         ${asciiJson.ncols}`,
      `nrows         ${asciiJson.nrows}`,
      `xllcorner     ${asciiJson.xllcorner}`,
      `yllcorner     ${asciiJson.yllcorner}`,
      `cellsize      ${asciiJson.cellsize}`,
      `NODATA_value  ${asciiJson.NODATA_value}`
    ].join('\n')

    // 将数据按行分组(从上到下)
    const rowData = []
    const dataRows = []

    for (let y = 0; y < this._height; y++) {
      rowData.length = 0
      for (let x = 0; x < this._width; x++) {
        // 计算原始图像数据和翻转后图像数据的索引
        let originalIndex = y * this._width + x
        let flippedIndex = (this._height - 1 - y) * this._width + x

        rowData.push(dataView.getInt32(flippedIndex * 4, false))
      }

      dataRows.push(rowData.join(' '))
    }

    // 合并头部和数据
    const asciiContent = `${header}\n${dataRows.join('\n')}`

    // 创建Blob对象(文本格式)
    return new Blob([asciiContent], { type: 'text/plain;charset=utf-8' })
  }

  initShader() {
    // 公共变量
    this.Command =
      `precision highp float;
      const int textureSize = ` +
      this._width +
      `;
      const float heightRange = ` +
      (this.max - this.min) +
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

    this.BufferVector = BufferVector
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

    this.texV = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._vectorWidth,
      height: this._vectorHeight,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: new Float32Array(this._vectorWidth * this._vectorHeight * 4),
      sampler: Cesium.Sampler.NEAREST
    })

    this.texV_Temp = RenderUtil.createTexture({
      context: this._viewer.scene.context,
      width: this._vectorWidth,
      height: this._vectorHeight,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: new Float32Array(this._vectorWidth * this._vectorHeight * 4),
      sampler: Cesium.Sampler.NEAREST
    })
  }

  initFrameBuffer() {
    const _this = this
    // Render Buffers
    this.quadGeometry = RenderUtil.getFullscreenQuad()

    this.Buffer_Vector = new CustomPrimitive({
      commandType: 'Compute',
      uniformMap: {
        iTime: () => {
          return this.iTime
        },
        iTimeDelta: () => {
          return this.iTimeDelta
        },
        iFrame: () => {
          return this.frame
        },
        resolution: () => {
          return this._vectorResolution
        },
        vectorMap: () => {
          return this.texV_Temp
        },
        dataTex: () => {
          return this.texA
        },
        dataTexSize: () => {
          return this._resolution
        },
        dataThreshold: () => {
          return 0.001
        },
        gradScale: () => {
          return 40
        },
        flowMode: () => {
          return 1
        },
        vKillEps: () => {
          return 0.0001
        }
      },
      fragmentShaderSource: new Cesium.ShaderSource({
        sources: [this.Command, this.BufferVector]
      }),
      geometry: this.quadGeometry,
      outputTexture: this.texV,
      preExecute: function () {
        _this.Buffer_Vector.commandToExecute.outputTexture = _this.texV
      }
    })

    this.Buffer_Vector_Temp = new CustomPrimitive({
      commandType: 'Compute',
      uniformMap: {
        iTime: () => {
          return this.iTime
        },
        iTimeDelta: () => {
          return this.iTimeDelta
        },
        iFrame: () => {
          return this.frame
        },
        resolution: () => {
          return this._vectorResolution
        },
        vectorMap: () => {
          return this.texV
        },
        dataTex: () => {
          return this.texA
        },
        dataTexSize: () => {
          return this._resolution
        },
        dataThreshold: () => {
          return 0.001
        },
        gradScale: () => {
          return 40
        },
        flowMode: () => {
          return 1
        },
        vKillEps: () => {
          return 0.0001
        }
      },
      fragmentShaderSource: new Cesium.ShaderSource({
        sources: [this.Command, this.BufferVector]
      }),
      geometry: this.quadGeometry,
      outputTexture: this.texV_Temp,
      preExecute: function () {
        _this.Buffer_Vector_Temp.commandToExecute.outputTexture = _this.texV_Temp
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
        renderSpeed: () => {
          return this.renderSpeed
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
        iChannel0: () => {
          return this.texA
        },
        iChannel1: () => {
          return this.texB
        },
        lakeMap: () => {
          return this.lakeMap
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
        renderSpeed: () => {
          return this.renderSpeed
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
      XJB: 0
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
        this.max - this.min,
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
        lakeMap: () => {
          return this.lakeMap
        },
        waterHeightMap: () => {
          return this.waterHeightMap
        },
        waterVectorMap: () => {
          return this.texV
        },
        waterColor: () => {
          return Cesium.Color.fromCssColorString(_this.deepWaterColor)
        },
        lightWaterColor: () => {
          return Cesium.Color.fromCssColorString(_this.lightWaterColor)
        },
        renderTerrain: () => {
          return this.renderTerrain
        },
        renderHeatMap: () => {
          return this.renderHeatMap
        },
        renderOriginData: () => {
          return this.renderOriginData
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

    this._viewer.scene.primitives.add(this.Buffer_Vector)
    this._viewer.scene.primitives.add(this.Buffer_Vector_Temp)

    this._viewer.scene.primitives.add(this.Buffer_A)
    this._viewer.scene.primitives.add(this.Buffer_B)
    this._viewer.scene.primitives.add(this.Buffer_C)
    this._viewer.scene.primitives.add(this.Buffer_D)
    this._viewer.scene.primitives.add(this.fluidCommand)

    // Render Event
    const _this = this
    this.time = 1.0
    this.frame = 0
    this.dataSetIdx = 0

    this.preEvent = () => {
      _this.preRender && _this.preRender(_this)
    }
    this.postEvent = () => {
      const now = performance.now()
      _this.time += 0.002 * _this.renderSpeed
      _this.frame += 0.01 * _this.renderSpeed

      // if (frame % 1 < 0.01)
      //   this.updateTex(this.dataSet[parseInt((frame * 10) % 10000)]);
      if (_this.dataSet.length) {
        _this.setWaterHeight(_this.dataSet[_this.dataSetIdx])
        _this.dataSetIdx = Number.parseInt(_this.frame * 2)
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
  async pushFortronData(message) {
    this.dataSet.push(message.image)
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

  async loadAscAsWaterHeight(url, maxValue) {
    const text = await fetch(url).then(r => r.text())
    const lines = text.trim().split(/\r?\n/)
    const header = {}
    for (let i = 0; i < 6; i++) {
      const parts = lines[i].trim().split(/\s+/)
      header[parts[0].toLowerCase()] = Number(parts[1])
    }
    const ncols = header.ncols; const nrows = header.nrows; const nodata = header.nodata_value
    const values = new Float32Array(ncols * nrows); let idx = 0
    for (let i = 6; i < lines.length; i++) {
      const row = lines[i].trim().split(/\s+/).map(Number)
      for (const v of row) { if (idx < values.length) { values[idx++] = (v === nodata || v === 0) ? -1 : v } }
    }
    const validVals = []; for (const v of values) { if (v > 0) validVals.push(v) }
    const computedMax = maxValue || Math.max(...validVals)
    this.range = new Cesium.Cartesian2(0, computedMax)

    const texData = new Float32Array(this._width * this._height * 4)
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        const srcX = Math.min(ncols - 1, Math.floor((x / this._width) * ncols))
        const srcYFromBottom = Math.min(nrows - 1, Math.floor((y / this._height) * nrows))
        const srcY = nrows - 1 - srcYFromBottom
        const v = values[srcY * ncols + srcX]
        const isNodata = v < 0
        const normalized = isNodata ? 0 : Cesium.Math.clamp(v / computedMax, 0, 1)
        const t = (y * this._width + x) * 4
        texData[t] = normalized; texData[t+1] = normalized; texData[t+2] = normalized
        texData[t+3] = isNodata ? 0 : 1
      }
    }

    const newTex = RenderUtil.createTexture({
      context: this._viewer.scene.context, width: this._width, height: this._height,
      pixelFormat: Cesium.PixelFormat.RGBA, pixelDatatype: Cesium.PixelDatatype.FLOAT,
      arrayBufferView: texData,
    })
    if (this.waterHeightMap) this.waterHeightMap.destroy()
    this.waterHeightMap = newTex
    console.log('[WaterSimulate] ASC', ncols, 'x', nrows, '→', this._width, 'x', this._height, 'max:', computedMax.toFixed(2))
  }

  async getInundation(index) {
    const _this = this
    const promise = new Promise((resolve, reject) => {
      base64ToUint8Array(_this.dataSet[Math.floor(_this.dataSetIdx / 15)]).then(dataArray => {
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

  remove() {
    this._viewer.scene.primitives.remove(this.fluidCommand)
    this._viewer.scene.primitives.remove(this.Buffer_D)
    this._viewer.scene.primitives.remove(this.Buffer_C)
    this._viewer.scene.primitives.remove(this.Buffer_B)
    this._viewer.scene.primitives.remove(this.Buffer_A)
    this._viewer.scene.primitives.remove(this.Buffer_Vector_Temp)
    this._viewer.scene.primitives.remove(this.Buffer_Vector)

    this._viewer.scene.preRender.removeEventListener(this.preEvent)
    this._viewer.scene.postRender.removeEventListener(this.postEvent)
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

/**
 * 将 WebGL2 浮点纹理(RGBA16F)转换为 Base64 图像
 * @param {WebGL2RenderingContext} gl - WebGL2 上下文
 * @param {WebGLTexture} texture - 要转换的纹理
 * @param {number} width - 纹理宽度
 * @param {number} height - 纹理高度
 * @param {string} [format='image/png'] - 输出格式
 * @param {boolean} [toneMapping=true] - 是否应用简单的色调映射
 * @returns {Promise<string>} 返回Base64字符串的Promise
 */
function floatTextureToBase64(gl, texture, width, height, format = 'image/png', toneMapping = true) {
  return new Promise((resolve, reject) => {
    try {
      // 创建帧缓冲区并绑定纹理
      const framebuffer = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

      // 检查帧缓冲区状态
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error('Framebuffer is not complete')
      }

      // 读取浮点像素数据 (RGBA16F)
      const pixels = new Float32Array(width * height * 4)
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.FLOAT, pixels)

      // 清理资源
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.deleteFramebuffer(framebuffer)

      // 创建临时canvas
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Could not get 2D context')
      }

      // 创建ImageData
      const imageData = ctx.createImageData(width, height)

      // 处理浮点数据并转换为8位RGBA
      for (let i = 0; i < width * height; i++) {
        const srcIdx = i * 4
        const dstIdx = ((height - Math.floor(i / width) - 1) * width + (i % width)) * 4

        // 从浮点数据中提取颜色值 (可能需要色调映射)
        let r = pixels[srcIdx]
        let g = pixels[srcIdx + 1]
        let b = pixels[srcIdx + 2]
        let a = pixels[srcIdx + 3]

        if (toneMapping) {
          // 简单的Reinhard色调映射
          r = r / (1.0 + r)
          g = g / (1.0 + g)
          b = b / (1.0 + b)
        }

        // 转换为8位颜色值 (0-255)
        imageData.data[dstIdx] = Math.min(255, r * 255) // R
        imageData.data[dstIdx + 1] = Math.min(255, g * 255) // G
        imageData.data[dstIdx + 2] = Math.min(255, b * 255) // B
        imageData.data[dstIdx + 3] = Math.min(255, a * 255) // A
      }

      ctx.putImageData(imageData, 0, 0)

      // 转换为Base64
      resolve(canvas.toDataURL(format))
    } catch (error) {
      reject(error)
    }
  })
}

export default WaterSimulate
