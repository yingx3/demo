import * as Cesium from 'cesium'

//距离测量类
export default class MeasureDistance {
  constructor(viewer) {
    this.viewer = viewer
    this.initEvents()
    this.positions = []
    this.tempPositions = []
    this.vertexEntities = []
    this.labelEntity = undefined
    this.measureDistance = 0 //测量结果
    this.vertexSeq = 0 // [新增] 顶点实体自增 id，避免重复 id 报错
    this.lastVertexEntity = undefined // [新增] 记录最后一个顶点，结束时准确移除
    this.liveLabelEntity = undefined // [新增] 跟随鼠标的实时距离标签
  }

  //初始化事件
  initEvents() {
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    this.MeasureStartEvent = new Cesium.Event() //开始事件
    this.MeasureEndEvent = new Cesium.Event() //结束事件
  }

  //激活
  activate() {
    this.deactivate()
    this.registerEvents() //注册鼠标事件
    //设置鼠标状态
    this.viewer.enableCursorStyle = false
    this.viewer._element.style.cursor = 'default'
    this.isMeasure = true
    this.measureDistance = 0
  }

  //注册鼠标事件
  registerEvents() {
    this.leftClickEvent()
    this.rightClickEvent()
    this.mouseMoveEvent()
  }

  //禁用
  deactivate() {
    if (!this.isMeasure) return
    this.unRegisterEvents()
    this.viewer._element.style.cursor = 'pointer'
    this.viewer.enableCursorStyle = true
    this.isMeasure = false
    this.tempPositions = []
    this.positions = []
  }

  //清空绘制
  clear() {
    //清除线对象
    this.viewer.entities.remove(this.lineEntity)
    this.lineEntity = undefined

    //清除实时距离标签
    this.viewer.entities.remove(this.liveLabelEntity)
    this.liveLabelEntity = undefined

    //清除节点
    this.vertexEntities.forEach(item => {
      this.viewer.entities.remove(item)
    })
    this.vertexEntities = []
    this.lastVertexEntity = undefined
    this.positions = []
    this.tempPositions = []
    this.measureDistance = 0
  }

  //创建线对象
  createLineEntity() {
    this.lineEntity = this.viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(e => {
          return this.tempPositions
        }, false),
        width: 2,
        material: Cesium.Color.YELLOW,
        depthFailMaterial: Cesium.Color.YELLOW,
      },
    })
  }

  // [新增] 统一标签样式：原实现带 distanceDisplayCondition(0,5000)，
  // 相机在 5km 以外时标签被整段裁掉，用户完全看不到距离；
  // 这里取消距离裁剪，并让标签不被地形遮挡
  createLabelStyle(text, offsetY, scale) {
    return {
      text: text,
      scale: scale || 1,
      font: 'normal 24px MicroSoft YaHei',
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 4,
      pixelOffset: new Cesium.Cartesian2(0, offsetY || -30),
      scaleByDistance: new Cesium.NearFarScalar(1000, 1.2, 20000000, 1),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      showBackground: true,
      backgroundColor: new Cesium.Color(0, 0, 0, 0.45),
      backgroundPadding: new Cesium.Cartesian2(6, 4),
    }
  }

  // [修复] 计算整条折线的累计长度（原实现只量首段，并在每次调用时重复累加）
  pathDistance(list) {
    if (!list || list.length < 2) return 0
    const geodesic = new Cesium.EllipsoidGeodesic()
    let total = 0
    for (let i = 1; i < list.length; i++) {
      const from = Cesium.Cartographic.fromCartesian(list[i - 1])
      const to = Cesium.Cartographic.fromCartesian(list[i])
      if (!from || !to) continue
      geodesic.setEndPoints(from, to)
      total += geodesic.surfaceDistance
    }
    return Math.round(total)
  }

  //计算距离（保留原方法名，返回累计总距离，单位：米）
  spaceDistance(value) {
    this.measureDistance = this.pathDistance(value)
    return this.measureDistance
  }

  // [新增] 距离文本：超过 1 公里按公里显示
  formatDistance(meters) {
    const m = Number(meters) || 0
    if (m >= 1000) return (m / 1000).toFixed(2) + ' 公里'
    return m + ' 米'
  }

  //创建线节点
  createVertex() {
    this.vertexSeq += 1
    let vertexEntity = this.viewer.entities.add({
      position: this.positions[this.positions.length - 1],
      // [修复] 原 id 由笛卡尔对象拼接，恒为同一个字符串，第 3 个点起 id 冲突直接报错
      id: 'MeasureDistanceVertex' + this.vertexSeq,
      type: 'MeasureDistanceVertex',
      label: this.createLabelStyle(
        this.formatDistance(this.spaceDistance(this.positions)),
        -30,
        0.9,
      ),
      point: {
        color: Cesium.Color.FUCHSIA,
        pixelSize: 8,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    })
    this.vertexEntities.push(vertexEntity)
    this.lastVertexEntity = vertexEntity
  }

  //创建起点
  createStartEntity() {
    let vertexEntity = this.viewer.entities.add({
      position: this.positions[0],
      type: 'MeasureDistanceVertex',
      billboard: {
        image: '/ng/start.png',
        scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000000), // [修复] 放宽可见范围
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
    })
    this.vertexEntities.push(vertexEntity)
  }

  //创建终点节点
  createEndEntity() {
    // [修复] 按记录的实体移除最后一个节点的距离标识（原实现用会重复的 id 查找）
    if (this.lastVertexEntity) {
      this.viewer.entities.remove(this.lastVertexEntity)
      const idx = this.vertexEntities.indexOf(this.lastVertexEntity)
      if (idx >= 0) this.vertexEntities.splice(idx, 1)
      this.lastVertexEntity = undefined
    }
    // 移除跟随鼠标的实时标签
    this.viewer.entities.remove(this.liveLabelEntity)
    this.liveLabelEntity = undefined

    let vertexEntity = this.viewer.entities.add({
      position: this.positions[this.positions.length - 1],
      type: 'MeasureDistanceVertex',
      label: this.createLabelStyle(
        '总距离：' + this.formatDistance(this.measureDistance),
        -50,
        1,
      ),
      billboard: {
        image: '/ng/end.png',
        scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000000), // [修复] 放宽可见范围
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
    })
    this.vertexEntities.push(vertexEntity)
  }

  leftClickEvent() {
    //单击鼠标左键画点点击事件
    this.handler.setInputAction(e => {
      this.viewer._element.style.cursor = 'default'
      let position = this.viewer.scene.pickPosition(e.position)
      if (!position) {
        const ellipsoid = this.viewer.scene.globe.ellipsoid
        position = this.viewer.scene.camera.pickEllipsoid(e.position, ellipsoid)
      }
      if (!position) return
      this.positions.push(position)
      if (this.positions.length == 1) {
        //首次点击
        this.createLineEntity()
        this.createStartEntity()
        return
      }
      this.createVertex()
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  //鼠标移动事件
  mouseMoveEvent() {
    this.handler.setInputAction(e => {
      if (!this.isMeasure) return
      this.viewer._element.style.cursor = 'default'
      let position = this.viewer.scene.pickPosition(e.endPosition)
      if (!position) {
        // [修复] 原来误用 e.startPosition（MOUSE_MOVE 事件没有该字段），兜底拾取永远失败
        position = this.viewer.scene.camera.pickEllipsoid(
          e.endPosition,
          this.viewer.scene.globe.ellipsoid,
        )
      }
      if (!position) return
      this.handleMoveEvent(position)
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }

  //处理鼠标移动
  handleMoveEvent(position) {
    if (this.positions.length < 1) return
    this.tempPositions = this.positions.concat(position)
    // [新增] 跟随鼠标显示实时累计距离
    const total = this.pathDistance(this.tempPositions)
    const text = '距离：' + this.formatDistance(total)
    if (!this.liveLabelEntity) {
      this.liveLabelEntity = this.viewer.entities.add({
        position: position,
        label: this.createLabelStyle(text, -20, 0.9),
      })
    } else {
      this.liveLabelEntity.position = position
      this.liveLabelEntity.label.text = text
    }
  }

  //右键事件
  rightClickEvent() {
    this.handler.setInputAction(e => {
      if (!this.isMeasure || this.positions.length < 1) {
        this.deactivate()
        this.clear()
      } else {
        this.createEndEntity()
        this.lineEntity.polyline = {
          positions: this.positions,
          width: 2,
          material: Cesium.Color.YELLOW,
          depthFailMaterial: Cesium.Color.YELLOW,
        }
        this.measureEnd()
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  //测量结束
  measureEnd() {
    this.deactivate()
    this.MeasureEndEvent.raiseEvent(this.measureDistance) //触发结束事件 传入结果
  }

  //解除鼠标事件
  unRegisterEvents() {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
}
