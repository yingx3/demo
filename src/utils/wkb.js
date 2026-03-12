/* WKB parsing utilities extracted from MapHome.vue
   提供 parseWKB, parseWKBMultiLineString, parseWKBMultiPolygon, parseLineStringWKB
*/
function hexToBytes(hex) {
  const bytes = []
  for (let c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16))
  return bytes
}

function readUInt32LE(bytes, offset) {
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  ) >>> 0
}

function readDoubleLE(bytes, offset) {
  const buffer = new ArrayBuffer(8)
  const view = new DataView(buffer)
  for (let i = 0; i < 8; i++) view.setUint8(i, bytes[offset + i])
  return view.getFloat64(0, true)
}

export function parseLineStringWKB(wkbHex) {
  const bytes = hexToBytes(wkbHex)
  // skip byte order + type (1+4)
  let offset = 5
  const numPoints = readUInt32LE(bytes, offset)
  offset += 4
  const coords = []
  for (let i = 0; i < numPoints; i++) {
    const x = readDoubleLE(bytes, offset)
    offset += 8
    const y = readDoubleLE(bytes, offset)
    offset += 8
    coords.push([x, y])
  }
  return coords
}

export function parseWKBMultiLineString(wkbHex) {
  const bytes = hexToBytes(wkbHex)
  let offset = 5
  const numLines = readUInt32LE(bytes, offset)
  offset += 4
  const lines = []
  for (let l = 0; l < numLines; l++) {
    // each line has its own byte order and type header
    // read sub-byte order
    const subOrder = bytes[offset]
    // skip sub-order + type
    offset += 5
    const numPoints = readUInt32LE(bytes, offset)
    offset += 4
    const pts = []
    for (let p = 0; p < numPoints; p++) {
      const x = readDoubleLE(bytes, offset)
      offset += 8
      const y = readDoubleLE(bytes, offset)
      offset += 8
      pts.push([x, y])
    }
    lines.push(pts)
  }
  return lines
}

export function parseWKBMultiPolygon(wkbHex) {
  const bytes = hexToBytes(wkbHex)
  let offset = 5
  const numPolygons = readUInt32LE(bytes, offset)
  offset += 4
  const polygons = []
  for (let i = 0; i < numPolygons; i++) {
    // sub header
    offset += 5
    const numRings = readUInt32LE(bytes, offset)
    offset += 4
    const rings = []
    for (let r = 0; r < numRings; r++) {
      const numPoints = readUInt32LE(bytes, offset)
      offset += 4
      const ring = []
      for (let p = 0; p < numPoints; p++) {
        const x = readDoubleLE(bytes, offset)
        offset += 8
        const y = readDoubleLE(bytes, offset)
        offset += 8
        ring.push([x, y])
      }
      rings.push(ring)
    }
    polygons.push(rings)
  }
  return polygons
}

export function parseWKB(wkbHex) {
  // crude dispatcher by type code in header
  const bytes = hexToBytes(wkbHex)
  const type = readUInt32LE(bytes, 1)
  if (type === 5) return parseWKBMultiPolygon(wkbHex)
  if (type === 3) return parseWKBMultiLineString(wkbHex)
  if (type === 2) return parseLineStringWKB(wkbHex)
  return null
}
