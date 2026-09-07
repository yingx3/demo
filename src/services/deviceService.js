import axios from 'axios'

export async function fetchAllDevices() {
  const res = await axios.get('/device/all')
  return res.data
}

export async function fetchLatestRecords(deviceId) {
  const res = await axios.get(`/device/latest/${deviceId}`)
  return res.data
}

export function getLatestDevicesByIds(allDevices, targetIds) {
  return targetIds
    .map(id => {
      const records = allDevices.filter(d => d.deviceid === id)
      if (records.length === 0) return null
      records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      return records[0]
    })
    .filter(Boolean)
}

export async function addLayerDZDdevice(viewer, layerGuidRef, targetIds = [41109656, 41126040, 41158808], onSelectCallback) {
  try {
    const allDevices = await fetchAllDevices()
    const devices = getLatestDevicesByIds(allDevices, targetIds)

    // remove old
    const old = viewer.dataSources._dataSources.find(d => d.guid === layerGuidRef.value)
    if (old) viewer.dataSources.remove(old)

    // create new
    layerGuidRef.value = Cesium.createGuid()
    const dataSource = new Cesium.CustomDataSource('DZDdevice')
    dataSource.guid = layerGuidRef.value
    viewer.dataSources.add(dataSource)

    devices.forEach(device => {
      dataSource.entities.add({
        id: `dev_${device.deviceid}`,
        position: Cesium.Cartesian3.fromDegrees(
          device.gps_longitude,
          device.gps_latitude,
          device.gps_high || 0
        ),
        billboard: {
          image: '/ng/position.png',
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: 32,
          height: 32,
        },
        properties: { deviceid: device.deviceid },
      })
    })

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(102.093, 30.045, 5000),
      orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-70) },
    })

    // event listener: selection
    viewer.selectedEntityChanged.addEventListener(async entity => {
      if (entity && entity.id && String(entity.id).startsWith('dev_')) {
        const deviceId = Number(entity.properties.deviceid)
        const records = (await fetchLatestRecords(deviceId)).reverse()
        const seismicData = records.map(r => r.channel_one_lp_z || 0)
        const { detected, resultArray } = calculateDebrisFlow(seismicData)
        if (typeof onSelectCallback === 'function') {
          onSelectCallback(entity, records, detected, resultArray)
        }
      } else {
        // if selection cleared, caller may handle
      }
    })
  } catch (err) {
    console.error('加载地震监测设备失败:', err)
  }
}

export function removeLayerDZDdevice(viewer, layerGuidRef) {
  const dataSources = viewer.dataSources._dataSources
  const dataSourceToRemove = dataSources.find(data => data.guid === layerGuidRef.value)
  if (dataSourceToRemove) {
    viewer.dataSources.remove(dataSourceToRemove)
    layerGuidRef.value = null
    console.log('地震监测设备已移除.')
  }
}

export const calculateDebrisFlow = (
  data,
  threshold = 2.5,
  shortWindow = 30,
  longWindow = 240,
  segmentDuration = 10,
  totalDuration = 60,
  samplingRate = 100
) => {
  const shortWindowSamples = shortWindow * samplingRate
  const longWindowSamples = longWindow * samplingRate
  const segmentSamples = segmentDuration * samplingRate
  const totalSamples = totalDuration * samplingRate

  const convolve = (signal, kernel) => {
    const result = []
    for (let i = 0; i <= signal.length - kernel.length; i++) {
      let sum = 0
      for (let j = 0; j < kernel.length; j++) {
        sum += signal[i + j] * kernel[j]
      }
      result.push(sum)
    }
    return result
  }

  const squaredData = data.map(x => x ** 2)
  const staKernel = new Array(shortWindowSamples).fill(1)
  const ltaKernel = new Array(longWindowSamples).fill(1)

  let sta = convolve(squaredData, staKernel).map(x => x / shortWindowSamples)
  let lta = convolve(squaredData, ltaKernel).map(x => x / longWindowSamples)

  sta = new Array(shortWindowSamples - 1).fill(0).concat(sta)
  lta = new Array(longWindowSamples - 1).fill(0).concat(lta)

  const result = new Array(data.length).fill(0)

  for (let i = 0; i < data.length; i++) {
    if (i < longWindowSamples || lta[i] === 0) continue

    const ratio = sta[i] / lta[i]
    if (ratio > threshold) {
      const longWindowValue = lta[i]
      const segmentRatios = []
      for (
        let j = i;
        j < Math.min(i + totalSamples, data.length);
        j += segmentSamples
      ) {
        const segment = data.slice(j, j + segmentSamples)
        const segmentMean =
          segment.reduce((sum, x) => sum + x ** 2, 0) / segment.length
        segmentRatios.push(segmentMean / longWindowValue || 0)
      }

      const segmentChanges = segmentRatios
        .slice(1)
        .map((r, idx) => r > segmentRatios[idx])
      if (
        segmentRatios.every(r => r > threshold) &&
        segmentChanges.filter(Boolean).length >= 3
      ) {
        result[i] = 1
      }
    }
  }

  const detected = result.some(x => x === 1)
  return { resultArray: result, detected }
}
