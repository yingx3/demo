import * as Cesium from 'cesium'
import Heatmap3d from '../js/heatmap3d.js'

export async function loadHeatmap(viewer, index, base) {
  try {
    const geoJson = await Cesium.Resource.fetchJson(`${base}/avaflow_output${index}.geojson`)
    const list = geoJson.features.map(feature => ({
      lnglat: feature.geometry.coordinates,
      value: feature.properties.value,
    }))
    const heatmapPrimitive = new Heatmap3d(viewer, {
      list: list,
      radius: 1,
      baseHeight: 0,
      primitiveType: 'TRIANGLE',
      gradient: {
        '.3': 'blue',
        '.99': 'yellow',
        '.999999999': 'red',
      },
    })
    return heatmapPrimitive
  } catch (error) {
    console.error('loadHeatmap error', error)
    throw error
  }
}

export async function loadHeatmapFlood(viewer, index) {
  try {
    const geoJson = await Cesium.Resource.fetchJson(`/ng/flood/flood_output${index}.geojson`)
    const list = geoJson.features.map(feature => ({
      lnglat: feature.geometry.coordinates,
      value: feature.properties.value,
    }))
    const heatmapPrimitive = new Heatmap3d(viewer, {
      list: list,
      radius: 1,
      baseHeight: 0,
      primitiveType: 'TRIANGLE',
      gradient: {
        '.3': 'blue',
        '.99': 'yellow',
        '.999999999': 'red',
      },
    })
    return heatmapPrimitive
  } catch (error) {
    console.error('loadHeatmapFlood error', error)
    throw error
  }
}
