/**
 * 只有位移预警实体同时具有 forecastInfo 和监测点编号时才响应预警弹窗。
 * 普通灾害点也可能带 pointId，不能仅凭 pointId 判定。
 */
export function isForecastEntity(entity) {
  return !!(
    entity &&
    entity.forecastInfo &&
    entity.pointId !== undefined &&
    entity.pointId !== null
  )
}