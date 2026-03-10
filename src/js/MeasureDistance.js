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
    this.viewer.enableCursorStyle = false //禁用鼠标样式
    this.viewer._element.style.cursor = 'default' //设置鼠标样式为默认样式
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

    //清除节点
    this.vertexEntities.forEach(item => {
      this.viewer.entities.remove(item)
    })
    this.vertexEntities = []
  }

  //创建线对象
  createLineEntity() {
    this.lineEntity = this.viewer.entities.add({
      polyline: {
        //false表示不循环绘制，true表示循环绘制
        positions: new Cesium.CallbackProperty(e => {
          return this.tempPositions
        }, false),
        width: 2,
        material: Cesium.Color.YELLOW,
        // 深度测试失败时的材质
        depthFailMaterial: Cesium.Color.YELLOW,
      },
    })
  }

  //计算距离
  spaceDistance(value) {
    if (!value) return 0
    //ellipsoidGeodesic类用于计算椭球体上的距离
    let geodesic = new Cesium.EllipsoidGeodesic()

      // 笛卡尔坐标系转WGS84坐标系
      let cartographic = Cesium.Cartographic.fromCartesian(value[0])
      let cartographic1 = Cesium.Cartographic.fromCartesian(value[1])
      geodesic.setEndPoints(cartographic, cartographic1)
      //surfaceDistance属性用于获取椭球体上的距离，单位为米
      //round方法用于四舍五入
      let part = Math.round(geodesic.surfaceDistance)
      
      this.measureDistance += part
      console.log("value:",value,part, this.measureDistance)
    
    return this.measureDistance
  }

  //创建线节点
  createVertex() {
    let vertexEntity = this.viewer.entities.add({
      //下标为positions.length - 1的节点为最后一个节点，即终点节点
      position: this.positions[this.positions.length - 1],
      id: 'MeasureDistanceVertex' + this.positions[this.positions.length - 1],
      type: 'MeasureDistanceVertex',
      label: {
        text: this.spaceDistance(this.positions) + '米',
        scale: 0.5,
        font: 'normal 24px MicroSoft YaHei',
        //5000米内可见，超出5000米不可见
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000),
        //设置随图缩放距离和比例
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 3000, 0.4),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -30),
        outlineWidth: 9,
        outlineColor: Cesium.Color.WHITE,
      },
      point: {
        color: Cesium.Color.FUCHSIA,
        pixelSize: 8,
        //disableDepthTestDistance属性用于禁用深度测试，即在距离小于该值时，点不会被遮挡,遮挡时，点会显示在其他点的后面
        disableDepthTestDistance: 500,
      },
    })
    this.vertexEntities.push(vertexEntity)
  }

  //创建起点
  createStartEntity() {
    let vertexEntity = this.viewer.entities.add({
      position: this.positions[0],
      type: 'MeasureDistanceVertex',
      billboard: {
        //ng/start.png为起点图标路径
        image: '/ng/start.png',
        scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
      // point: {
      //   color: Cesium.Color.FUCHSIA,
      //   pixelSize: 6,
      // },
    })
    this.vertexEntities.push(vertexEntity)
  }

  //创建终点节点
  createEndEntity() {
    //结束时删除最后一个节点的距离标识
    let lastLabel = this.viewer.entities.getById(
      'MeasureDistanceVertex' + this.positions[this.positions.length - 1]
    )
    this.viewer.entities.remove(lastLabel)
    this.viewer.entities.remove(this.moveVertexEntity)

    let vertexEntity = this.viewer.entities.add({
      position: this.positions[this.positions.length - 1],
      type: 'MeasureDistanceVertex',
      label: {
        text: '总距离：' + this.measureDistance + '米',
        scale: 1,
        font: 'normal 26px MicroSoft YaHei',
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000),
        scaleByDistance: new Cesium.NearFarScalar(1000, 1, 3000, 0.4),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -50),
        outlineWidth: 9,
        outlineColor: Cesium.Color.WHITE,
        eyeOffset: new Cesium.Cartesian3(0, 0, -10),
      },
      billboard: {
        image: '/ng/end.png',
        scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
      // point: {
      //   color: Cesium.Color.FUCHSIA,
      //   pixelSize: 6,
      // },
    })
    this.vertexEntities.push(vertexEntity)
  }

  //左键点击事件
  leftClickEvent() {
    //单击鼠标左键画点点击事件
    this.handler.setInputAction(e => {
      this.viewer._element.style.cursor = 'default'
      //pickPosition方法用于获取鼠标点击位置的坐标
      let position = this.viewer.scene.pickPosition(e.position)
      if (!position) {
        const ellipsoid = this.viewer.scene.globe.ellipsoid
        //pickEllipsoid方法用于获取鼠标点击位置的椭球体坐标
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
        position = this.viewer.scene.camera.pickEllipsoid(
          e.startPosition,
          this.viewer.scene.globe.ellipsoid
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
    //raiseEvent方法用于触发事件,MeasureEndEvent为结束事件,measureDistance为测量结果参数
    this.MeasureEndEvent.raiseEvent(this.measureDistance) //触发结束事件 传入结果
  }

  //解除鼠标事件
  unRegisterEvents() {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
}
