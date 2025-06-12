import { MainService } from '../MainService';
import { S3DP } from '../../core';
import { UniversalTool } from '../../utils/UniversalTool';
import { EntityService } from '../EntityService';
import cloneDeep from 'lodash/cloneDeep';
import { VectorService } from './VectorService';
import { DataSourceService } from '../DataSourceService';
import { DEFAULT_POLYGON_OPTIONS } from '../polygonPlot/PolygonPlotService';
import { Event, EventEmitter } from '../../utils/Event';
import VectorCommon from '../common/VectorCommon';
import turfBBox from '@turf/bbox';
import { ActionsName, OperationType, UndoOrReturnService } from '../vectorEditTool/UndoOrReturnService';
import { lineString as turfLineString } from '@turf/helpers';
import { CutClippingService } from '../CutClippingService';
export class RectangleDrawService {
  /**
   * 绘制完矩形后，对外订阅事件
   */
  public static completeEvent$: EventEmitter<any> = new EventEmitter<any>();
  /**
   * 图层id
   */
  private static layerId = null;
  /**
   * 图层geojson
   */
  private static geojson = null;
  /**
   * 图层style
   */
  private static style = null;
  /**
   * 存储点击的点的entity
   */
  private static entityPoints = [];
  /**
   * 图层数据集
   */
  private static _primitiveCollection = null;
  /**
   * cesium中ScreenSpaceEventHandler对象
   */
  private static actionHandler = null;
  /**
   * 存储点击的点的数组(cartesian3)
   */
  private static pointsArray = [];
  /**
   * 动态矩形
   */
  public static virtualRectangle = null;
  /**
   * 当前是主窗口还是小窗口
   */
  private static currentViewer = null;
  /**
   * 小窗矩形的矢量集合
   */
  private static windowPrimitives = null;
  /**
   * handler集合
   */
  public static handlerMaps = new Map<string, any>();
  constructor() {}

  /**
   * 开始绘制矩形
   * @param layerId 图层id
   * @param geojsonObj geojson对象
   * @param viewer3D cesium中viewer对象
   */
  public static startDrawRectangle(layerId: string, geojsonObj?: any, viewer3D: any = MainService.viewer3D) {
    if (!layerId) {
      throw new Error('图层id不能为空！');
    }
    this.layerId = layerId;
    this.geojson = geojsonObj;
    RectangleDrawService.currentViewer = viewer3D;
    const collection = VectorService.loadVectors.get(layerId);
    if (collection) {
      this._primitiveCollection = collection.polygons;
    } else {
      this._primitiveCollection = MainService.scene3D.primitives.add(new S3DP.PrimitiveCollection());
      this._primitiveCollection['id'] = layerId;
      this._primitiveCollection['primitiveDataType'] = 'rectangle';
      VectorService.loadVectors.set(layerId, {
        id: layerId,
        polygons: this._primitiveCollection,
      });
    }
    if (RectangleDrawService.currentViewer?.id == 'windowView') {
      let primitives = CutClippingService.windowViewer.scene.primitives;
      let primitiveC = primitives?._primitives.find((res) => {
        if (res?.id == RectangleDrawService.layerId) {
          return res;
        }
      });
      if (primitiveC) {
        RectangleDrawService.windowPrimitives = primitiveC;
      } else {
        RectangleDrawService.windowPrimitives = CutClippingService.windowViewer.scene.primitives.add(new S3DP.PrimitiveCollection());
        RectangleDrawService.windowPrimitives['id'] = RectangleDrawService.layerId;
        RectangleDrawService.windowPrimitives['primitiveDataType'] = 'rectangle';
      }
    }
    if (RectangleDrawService.currentViewer?.id == 'windowView') {
      CutClippingService.createDataSource(this.layerId + '_window');
    } else {
      DataSourceService.createDataSource(this.layerId);
    }
    let handler = new S3DP.ScreenSpaceEventHandler(viewer3D.scene.canvas);
    if (this.currentViewer?.id == 'windowView') {
      RectangleDrawService.handlerMaps.set('windowHandler', handler);
    } else {
      RectangleDrawService.handlerMaps.set('MainHandler', handler);
    }
    let entity = null; //点击添加的点
    let mousePos = null; //鼠标最后滑动的位置
    let actionPoints = []; //动态更新矩形上的点数组
    this.style = cloneDeep(DEFAULT_POLYGON_OPTIONS);
    this.style.pickHeight = UniversalTool.pickHeight;
    this.style.pickWidth = UniversalTool.pickWidth;
    this.actionHandler = handler;
    let undoOperation = UndoOrReturnService.undoOperation;
    this.actionHandler.setInputAction((mouse) => {
      if (CutClippingService.deleteDrawStatus) {
        let pickObjs = CutClippingService.windowViewer.scene.drillPick(mouse.position, 3, 3);
        if (pickObjs && pickObjs?.length > 0) {
          let pickObj = pickObjs.find((obj) => {
            if (
              obj?.primitive?.primitiveDataType == 'point' ||
              obj?.primitive?.primitiveDataType == 'polyline' ||
              obj?.primitive?.primitiveDataType == 'polygon' ||
              obj?.primitive?.primitiveDataType == 'circle' ||
              obj?.primitive?.primitiveDataType == 'rectangle'
            ) {
              return obj;
            }
          });
          if (pickObj) {
            CutClippingService.deleteGraphic(RectangleDrawService.windowPrimitives, pickObj.id);
          }
        }
        return;
      }
      //获取坐标
      const position = UniversalTool.window2cartesian(viewer3D, mouse.position);
      if (this.pointsArray.length < 2) {
        if (position) {
          //当数组存在一个点时，点击相同点返回
          if (this.pointsArray.length > 0) {
            if (S3DP.Cartesian3.equalsEpsilon(this.pointsArray[0], position, S3DP.Math.EPSILON9)) {
              return;
            }
          }
          this.pointsArray.push(position);
          entity = {
            id: `pointRectangle${this.pointsArray.length}`,
            position: position,
            point: new S3DP.PointGraphics({
              pixelSize: 10,
              heightReference: S3DP.HeightReference.NONE,
              color: S3DP.Color.WHITE,
              outlineColor: S3DP.Color.RED,
              outlineWidth: 1.0,
            }),
          };
          if (CutClippingService.currentHandler == 'MainHandler') {
            EntityService.createEntity(this.layerId, entity);
            let obj = {
              action: ActionsName.RECTANGLE,
              operation: OperationType.DELETE,
              data: entity,
            };
            UndoOrReturnService.addUndoData(obj);
            UndoOrReturnService.returnOperation = [];
          } else {
            EntityService.createEntity(this.layerId + '_window', entity);
          }
          this.entityPoints.push(entity);
        }
      }
    }, Event.LEFT_CLICK);
    this.actionHandler.setInputAction((mouse) => {
      if (CutClippingService.currentHandler == 'MainHandler') {
        this.actionHandler = RectangleDrawService.handlerMaps.get('MainHandler');
      } else {
        this.actionHandler = RectangleDrawService.handlerMaps.get('windowHandler');
      }
      if (this.pointsArray.length == 2) {
        const firstPoint = this.pointsArray[0];
        const secondPoint = this.pointsArray[1];
        //获取坐标
        const position = UniversalTool.window2cartesian(viewer3D, mouse.endPosition);
        if (position && firstPoint && secondPoint) {
          //距离
          const distance = this.distanceLine(firstPoint, secondPoint, position); //meter
          //垂足点
          const perpendicular = this.getFootPoint3(position, firstPoint, secondPoint);
          if (perpendicular) {
            //计算两点方向向量差
            const direction = S3DP.Cartesian3.subtract(position, perpendicular, new S3DP.Cartesian3());
            if (distance) {
              //第三个点位置
              const threePoint = UniversalTool.translateByDirection(secondPoint, direction, distance);
              if (threePoint) {
                let rotationPoints = this.getPoints(firstPoint, secondPoint, threePoint);
                if (!this.virtualRectangle) {
                  if (actionPoints.length > 3) {
                    this.virtualRectangle = {
                      id: 'virtualRectangle',
                      polygon: {
                        hierarchy: new S3DP.CallbackProperty(function (time, result) {
                          const hierarchy = new S3DP.PolygonHierarchy(cloneDeep(actionPoints)); // PolygonHierarchy会将height设置为0
                          return hierarchy;
                        }, false),
                        material: S3DP.Color.RED.withAlpha(0.3),
                        show: true,
                        fill: true,
                        outlineColor: S3DP.Color.CHARTREUSE,
                        outlineWidth: 3,
                        outline: true,
                        perPositionHeight: true,
                      },
                    };
                    if (CutClippingService.currentHandler == 'MainHandler') {
                      EntityService.createEntity(this.layerId, this.virtualRectangle);
                    } else {
                      EntityService.createEntity(this.layerId + '_window', this.virtualRectangle);
                    }
                  }
                }
                actionPoints = rotationPoints;
              }
            }
          }
        }
      }
    }, Event.MOUSE_MOVE);
    this.actionHandler.setInputAction((mouse) => {
      //右键结束则从撤销数组去除点数据
      for (let j = 0; j < this.entityPoints.length; j++) {
        for (let i = undoOperation.length - 1; i >= 0; i--) {
          if (undoOperation[i].data?.id == this.entityPoints[j].id) {
            undoOperation.splice(i, 1);
          }
        }
      }
      if (this.pointsArray.length == 2) {
        //获取坐标
        const pos = UniversalTool.window2cartesian(viewer3D, mouse.position);
        if (pos) {
          this.pointsArray.push(pos);
        } else {
          if (mousePos) {
            this.pointsArray.push(mousePos);
          }
        }
      } else {
        if (CutClippingService.currentHandler == 'MainHandler') {
          this.entityPoints = this.deleteDrawPointAndRectangle(this.entityPoints, this.virtualRectangle);
        } else {
          CutClippingService.cleraDraw();
        }
        this.pointsArray = [];
        this.virtualRectangle = null;
      }
      if (this.pointsArray.length == 3) {
        //距离
        const distance = this.distanceLine(this.pointsArray[0], this.pointsArray[1], this.pointsArray[2]); //meter
        //垂足点
        const perpendicular = this.getFootPoint3(this.pointsArray[2], this.pointsArray[0], this.pointsArray[1]);
        if (perpendicular) {
          //计算两点方向向量差
          const direction = S3DP.Cartesian3.subtract(this.pointsArray[2], perpendicular, new S3DP.Cartesian3());
          //第三个点位置
          const threePoint = UniversalTool.translateByDirection(this.pointsArray[1], direction, distance);
          if (threePoint) {
            //返回矩形的四个点
            let rotationPoints = this.getPoints(this.pointsArray[0], this.pointsArray[1], threePoint);
            const objId = UniversalTool.idKey++;
            let feature = this.toFeature(objId, rotationPoints);
            if (this.geojson.features.length > 0) {
              VectorCommon.entendProperties(feature.properties, this.geojson.features[this.geojson.features.length - 1].properties);
            } else {
              feature.properties['dlGonC'] = this.style.polygonProps.material.toCssColorString();
              feature.properties['dlGonA'] = this.style.polygonProps.material.alpha;
              feature.properties['dlGonOutW'] = 1.0; // 面外轮廓线宽
              feature.properties['dlGonOutC'] = S3DP.Color.fromRandom({ alpha: 1.0 }).toCssColorString(); // 面外轮廓线颜色
              feature.properties['dlGonOutA'] = 1.0; // 面外轮廓线透明度
            }
            feature.properties.objId = Number(feature.properties.objId);
            this.geojson.features.push(feature); // 插入到geojson中
            let dataVector = VectorService.loadVectors.get(this.layerId);
            let bboxs = [];
            if (this.geojson.features.length > 0) {
              const bbox = turfBBox(this.geojson); // geojson的bbox
              bboxs.push([bbox[0], bbox[1]]);
              bboxs.push([bbox[2], bbox[3]]);
              if (dataVector?.locationPoint) {
                dataVector.locationPoint = turfBBox(turfLineString(bboxs));
              } else {
                dataVector['locationPoint'] = turfBBox(turfLineString(bboxs));
              }
            }
            VectorCommon.createPolygonPrimitive(feature, this._primitiveCollection, {}, 'rectangle');
            VectorService.setVectorProperty(this.layerId, feature.properties);

            if (CutClippingService.currentHandler == 'MainHandler') {
              //获取当前primitive矢量面
              const draw_rectangle = this._primitiveCollection._primitives.find((res) => res.id == feature.properties.objId);
              if (draw_rectangle) {
                let obj = {
                  action: ActionsName.RECTANGLE,
                  operation: OperationType.DELETE,
                  data: draw_rectangle,
                };
                UndoOrReturnService.addUndoData(obj);
              }
              this.entityPoints = this.deleteDrawPointAndRectangle(this.entityPoints, this.virtualRectangle);
            } else {
              VectorCommon.createPolygonPrimitive(feature, RectangleDrawService.windowPrimitives, {}, 'rectangle');
              CutClippingService.cleraDraw();
              this.pointsArray = [];
              this.virtualRectangle = null;
            }
            this.pointsArray = [];
            UniversalTool.idKey++; //绘制矩形属于多边形objId需要每次创建完后+1占位
            this.completeEvent$.emit([feature]);
            VectorCommon.addLabel(this.layerId, feature);
          }
        }
      }
      UndoOrReturnService.removeReturnPoint();
      UndoOrReturnService.UndoOrReturnEvent$.emit({ undoLength: undoOperation.length, returnLength: UndoOrReturnService.returnOperation.length });
    }, Event.RIGHT_CLICK);
  }

  /**
   * 计算鼠标点到线的最短距离
   * @param firstPoint 点击的点
   * @param secondPoint 线段的第一个点
   * @param position 鼠标的位置
   * @return distance 返回距离线的最短距离(两点之前直线最短)
   */
  private static distanceLine(firstPoint, secondPoint, position) {
    const ab = S3DP.Cartesian3.subtract(secondPoint, firstPoint, new S3DP.Cartesian3());
    if (position) {
      const ac = S3DP.Cartesian3.subtract(position, firstPoint, new S3DP.Cartesian3());
      let f = S3DP.Cartesian3.dot(ab, ac);
      if (f < 0) {
        return S3DP.Cartesian3.distance(position, firstPoint);
      }
      const d = S3DP.Cartesian3.dot(ab, ab);
      if (f > d) {
        return S3DP.Cartesian3.distance(position, secondPoint);
      }
      f = f / d;
      const D = S3DP.Cartesian3.add(firstPoint, new S3DP.Cartesian3(f * ab.x, f * ab.y, f * ab.z), new S3DP.Cartesian3());
      return S3DP.Cartesian3.distance(position, D);
    }
  }

  /**
   * 点到直线的垂足点3维
   * @param point 点击的点
   * @param start 线段的第一个点
   * @param end 线段的第二个点
   * @return Cartesian3 返回点击的点与线段的垂足点
   */
  private static getFootPoint3(point, start, end) {
    if (!start?.x || !end?.x || !point?.x) {
      return;
    }
    const dx = start.x - end.x;
    const dy = start.y - end.y;
    const dz = start.z - end.z;
    const EPS = 0.00000001;

    //  确保两个点不是同一个点
    if (Math.abs(dx) < EPS && Math.abs(dy) < EPS && Math.abs(dz) < EPS) {
      return start;
    }

    //计算斜率
    let u = (point.x - start.x) * (start.x - end.x) + (point.y - start.y) * (start.y - end.y) + (point.z - start.z) * (start.z - end.z);
    u = u / (Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));

    return new S3DP.Cartesian3(start.x + u * dx, start.y + u * dy, start.z + u * dz);
  }

  /**
   * 获取矩形四个点
   * @param firstPoint 点击的点
   * @param secondPoint 线段的第一个点
   * @param threePoint 线段的第二个点
   * @return 数组 存储矩形的四个点
   */
  private static getPoints(firstPoint, secondPoint, threePoint) {
    let points = [];
    //计算两点方向向量差
    const direction = S3DP.Cartesian3.subtract(threePoint, secondPoint, new S3DP.Cartesian3());
    //计算两点的距离
    const distance = S3DP.Cartesian3.distance(secondPoint, threePoint);
    //第四个点位置
    const fourPoint = UniversalTool.translateByDirection(firstPoint, direction, distance);
    if (fourPoint) {
      points.push(firstPoint);
      points.push(secondPoint);
      points.push(threePoint);
      points.push(fourPoint);
      return points;
    }
  }

  /**
   * 删除点击添加的点
   * @param entityPoints 点击添加的点的数组
   * @param virtualRectangle 动态生成的矩形
   * @return [] 删除后清空，返回空数组
   */
  public static deleteDrawPointAndRectangle(entityPoints, virtualRectangle?: any) {
    for (let i = 0; i < entityPoints.length; i++) {
      let entity = EntityService.getEntityByDataSourceId(this.layerId, entityPoints[i].id);
      if (entity?.id == 'pointRectangle1') {
        this.pointsArray = [];
      }
      if (entity?.id == 'pointRectangle2') {
        this.pointsArray.splice(this.pointsArray.length - 1);
        this.virtualRectangle = null;
      }
      if (entity) {
        EntityService.removeEntity(entity);
      }
    }
    if (virtualRectangle) {
      let entity = EntityService.getEntityByDataSourceId(this.layerId, virtualRectangle.id);
      if (entity) {
        EntityService.removeEntity(entity);
      }
    }
    return [];
  }

  public static addPoints(entity, virtualRectangle?: any) {
    this.pointsArray.push(entity.position);
    if (entity?.id == 'pointRectangle2') {
      this.virtualRectangle = virtualRectangle;
    }
    EntityService.createEntity(this.layerId, entity);
  }

  /**
   * 将世界坐标转为经纬度
   * @param polygonPoints 圆上的所有点(cartesian3)
   * @return coordinates[] 返回经纬度数组
   */
  private static getCoordinates(polygonPoints) {
    //获取当前线的点
    const points = polygonPoints;
    const coordinates = [];
    for (let i = 0; i < points.length; i++) {
      //转弧度
      const cartographic = new S3DP.Cartographic.fromCartesian(points[i]);
      //转经纬度
      let x = S3DP.Math.toDegrees(cartographic.longitude);
      let y = S3DP.Math.toDegrees(cartographic.latitude);
      let z = cartographic.height;
      coordinates.push([x, y, z]);
    }
    //首点弧度
    let firstCartographic = new S3DP.Cartographic.fromCartesian(points[0]);
    //转经纬度
    let firstX = S3DP.Math.toDegrees(firstCartographic.longitude);
    let firstY = S3DP.Math.toDegrees(firstCartographic.latitude);
    let firstZ = firstCartographic.height;
    coordinates.push([firstX, firstY, firstZ]);
    return coordinates;
  }

  /**
   * 将可编辑对象转换成geojson中feature对象
   * @param id 图层id
   * @param points 圆上的所有点
   * @return feature 返回feature对象
   */
  private static toFeature(id, points) {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [this.getCoordinates(points)],
      },
      properties: {
        objId: id,
      },
    };
    let maxHeight = 0;
    let degrees = feature.geometry.coordinates[0];
    for (let i = 0; i < degrees.length; i++) {
      degrees[i][2] > maxHeight && (maxHeight = degrees[i][2]);
    }
    feature.properties['bbox'] = turfBBox(feature);
    feature.properties['maxHeight'] = maxHeight;
    return feature;
  }

  /**
   * 结束绘制
   */
  public static endDrawRectangle() {
    let mainHandler = RectangleDrawService.handlerMaps.get('MainHandler');
    if (mainHandler) {
      mainHandler?.destroy();
    }
    let windowHandler = RectangleDrawService.handlerMaps.get('windowHandler');
    if (windowHandler) {
      windowHandler?.destroy();
    }
    this.handlerMaps.clear();
    this.actionHandler = null;
    this.style = null;
    if (RectangleDrawService.currentViewer?.id == 'windowView') {
      CutClippingService.cleraDraw();
      CutClippingService.drawDataSource = CutClippingService.createDataSource(this.layerId + '_window');
    } else {
      this.entityPoints = this.deleteDrawPointAndRectangle(this.entityPoints, this.virtualRectangle);
    }
    this.pointsArray = [];
    this.virtualRectangle = null;
    UndoOrReturnService.removeUndoPoint();
    UndoOrReturnService.UndoOrReturnEvent$.emit({ undoLength: UndoOrReturnService.undoOperation.length, returnLength: UndoOrReturnService.returnOperation.length });
  }
}
