import axios from 'axios'

const GEOSERVER_WFS_URL = '/geoserver/ZHLXT/wfs'

// GeoServer 图层名映射
const LAYERS = {
  building: 'ygBuildings',  // 建筑物
  population: 'linzhi_pop',     // 人口
}

/**
 * 从 GeoServer WFS 获取指定图层在 BBOX 范围内的要素
 * @param {string} layerName - GeoServer 图层名
 * @param {number[]} bbox - [minX, minY, maxX, maxY]
 * @returns {Promise<GeoJSON.FeatureCollection>}
 */
export async function fetchFeaturesInBbox(layerName, bbox) {
  const [minX, minY, maxX, maxY] = bbox
  const url = `${GEOSERVER_WFS_URL}?service=WFS&version=1.1.0`
    + `&request=GetFeature&typeName=ZHLXT:${layerName}`
    + `&outputFormat=application/json`
    + `&srsName=EPSG:4326`
    + `&bbox=${minX},${minY},${maxX},${maxY},urn:ogc:def:crs:EPSG:4326`

  const res = await axios.get(url)
  return res.data
}

/**
 * 计算 BBOX（扩展 margin 度）
 */
export function computeBbox(coords, margin = 0.02) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const [lon, lat] of coords) {
    if (lon < minX) minX = lon
    if (lon > maxX) maxX = lon
    if (lat < minY) minY = lat
    if (lat > maxY) maxY = lat
  }
  return [minX - margin, minY - margin, maxX + margin, maxY + margin]
}

/**
 * 从点集生成灾害影响面（凸包 + 缓冲，模拟灾害覆盖范围）
 * @param {number[][]} coords - [[lon,lat], ...]
 * @param {number} bufferKm - 缓冲区半径（公里）
 * @returns {GeoJSON.Polygon}
 */
export async function buildDisasterArea(coords, bufferKm = 1) {
  const turf = await import('@turf/turf')
  const points = turf.featureCollection(coords.map(c => turf.point(c)))
  const hull = turf.convex(points)
  // 凸包可能只有 2 点（线），兜底用 envelope
  if (!hull || hull.geometry.type === 'LineString') {
    const envelope = turf.envelope(points)
    return turf.buffer(envelope, bufferKm, { units: 'kilometers' })
  }
  return turf.buffer(hull, bufferKm, { units: 'kilometers' })
}

/**
 * 统计受灾害影响的建筑物数量
 * @param {GeoJSON.Polygon|GeoJSON.MultiPolygon} disasterArea - 灾害范围面
 * @param {GeoJSON.FeatureCollection} buildingFC - 建筑物要素集合
 * @returns {{ count: number, features: GeoJSON.Feature[] }}
 */
export async function analyzeBuildingImpact(disasterArea, buildingFC) {
  const turf = await import('@turf/turf')
  const affected = buildingFC.features.filter(f => {
    try {
      return turf.booleanIntersects(f, disasterArea)
    } catch {
      return false
    }
  })
  return { count: affected.length, features: affected }
}

/**
 * 统计受灾害影响的人口
 * @param {GeoJSON.Polygon|GeoJSON.MultiPolygon} disasterArea - 灾害范围面
 * @param {GeoJSON.FeatureCollection} popFC - 人口要素集合
 * @returns {{ totalPop: number, count: number, features: GeoJSON.Feature[] }}
 */
export async function analyzePopulationImpact(disasterArea, popFC) {
  const turf = await import('@turf/turf')
  const affected = popFC.features.filter(f => {
    try {
      return turf.booleanIntersects(f, disasterArea)
    } catch {
      return false
    }
  })
  // 人口数据可能有 pop_sum 或 pop 或 人口 字段
  let totalPop = 0
  for (const f of affected) {
    const pop = f.properties?.pop_sum
      ?? f.properties?.pop
      ?? f.properties?.人口
      ?? f.properties?.population
      ?? 0
    totalPop += Number(pop) || 0
  }
  return { totalPop, count: affected.length, features: affected }
}

/**
 * 一键分析灾害对建筑物+人口的影响
 * @param {number[][]} disasterCoords - 灾害点坐标 [[lon,lat],...]
 * @param {number} bufferKm - 缓冲区半径（公里）
 * @returns {{ disasterArea, building: {count}, population: {totalPop, count} }}
 */
export async function runFullAnalysis(disasterCoords, bufferKm = 1) {
  const bbox = computeBbox(disasterCoords, 0.05)
  const disasterArea = await buildDisasterArea(disasterCoords, bufferKm)

  const [buildingFC, popFC] = await Promise.all([
    fetchFeaturesInBbox(LAYERS.building, bbox),
    fetchFeaturesInBbox(LAYERS.population, bbox),
  ])

  const [building, population] = await Promise.all([
    analyzeBuildingImpact(disasterArea, buildingFC),
    analyzePopulationImpact(disasterArea, popFC),
  ])

  return { disasterArea, building, population }
}
