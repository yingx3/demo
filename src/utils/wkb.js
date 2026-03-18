/* WKB / EWKB parsing utilities
   支持:
   - LineString
   - MultiLineString
   - Polygon
   - MultiPolygon
   - EWKB SRID / Z / M 标志
*/

function hexToBytes(hex) {
  if (!hex || typeof hex !== 'string' || hex.length % 2 !== 0) {
    throw new Error('Invalid hex string')
  }
  return new Uint8Array(hex.match(/../g).map(h => parseInt(h, 16)))
}

function createReader(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = 0

  function ensure(n) {
    if (offset + n > view.byteLength) {
      throw new Error(
        `WKB out of range: need ${n} bytes at offset ${offset}, total=${view.byteLength}`
      )
    }
  }

  function readUint8() {
    ensure(1)
    const v = view.getUint8(offset)
    offset += 1
    return v
  }

  function readUint32(le) {
    ensure(4)
    const v = view.getUint32(offset, le)
    offset += 4
    return v
  }

  function readDouble(le) {
    ensure(8)
    const v = view.getFloat64(offset, le)
    offset += 8
    return v
  }

  function getOffset() {
    return offset
  }

  function setOffset(v) {
    offset = v
  }

  function getLength() {
    return view.byteLength
  }

  return {
    readUint8,
    readUint32,
    readDouble,
    getOffset,
    setOffset,
    getLength,
  }
}

function parseGeometry(reader) {
  const littleEndian = reader.readUint8() === 1
  const rawType = reader.readUint32(littleEndian)

  const hasZ = (rawType & 0x80000000) !== 0
  const hasM = (rawType & 0x40000000) !== 0
  const hasSRID = (rawType & 0x20000000) !== 0
  const baseType = rawType & 0x1fffffff

  let srid = null
  if (hasSRID) {
    srid = reader.readUint32(littleEndian)
  }

  function readPoint() {
    const x = reader.readDouble(littleEndian)
    const y = reader.readDouble(littleEndian)

    if (hasZ) {
      const z = reader.readDouble(littleEndian)
      if (hasM) {
        reader.readDouble(littleEndian) // skip M
      }
      return [x, y, z]
    }

    if (hasM) {
      reader.readDouble(littleEndian) // skip M
    }

    return [x, y]
  }

  if (baseType === 2) {
    const numPoints = reader.readUint32(littleEndian)
    if (numPoints > 1000000) {
      throw new Error(`Unreasonable LineString point count: ${numPoints}`)
    }

    const coordinates = []
    for (let i = 0; i < numPoints; i++) {
      coordinates.push(readPoint())
    }

    return {
      type: 'LineString',
      coordinates,
      srid,
    }
  }

  if (baseType === 3) {
    const numRings = reader.readUint32(littleEndian)
    if (numRings > 100000) {
      throw new Error(`Unreasonable Polygon ring count: ${numRings}`)
    }

    const coordinates = []
    for (let r = 0; r < numRings; r++) {
      const numPoints = reader.readUint32(littleEndian)
      if (numPoints > 1000000) {
        throw new Error(`Unreasonable Polygon point count: ${numPoints}`)
      }

      const ring = []
      for (let i = 0; i < numPoints; i++) {
        ring.push(readPoint())
      }
      coordinates.push(ring)
    }

    return {
      type: 'Polygon',
      coordinates,
      srid,
    }
  }

  if (baseType === 5) {
    const numLines = reader.readUint32(littleEndian)
    if (numLines > 100000) {
      throw new Error(`Unreasonable MultiLineString line count: ${numLines}`)
    }

    const coordinates = []
    for (let i = 0; i < numLines; i++) {
      const child = parseGeometry(reader)
      if (child.type !== 'LineString') {
        throw new Error(`MultiLineString child is not LineString: ${child.type}`)
      }
      coordinates.push(child.coordinates)
    }

    return {
      type: 'MultiLineString',
      coordinates,
      srid,
    }
  }

  if (baseType === 6) {
    const numPolygons = reader.readUint32(littleEndian)
    if (numPolygons > 100000) {
      throw new Error(`Unreasonable MultiPolygon polygon count: ${numPolygons}`)
    }

    const coordinates = []
    for (let i = 0; i < numPolygons; i++) {
      const child = parseGeometry(reader)
      if (child.type !== 'Polygon') {
        throw new Error(`MultiPolygon child is not Polygon: ${child.type}`)
      }
      coordinates.push(child.coordinates)
    }

    return {
      type: 'MultiPolygon',
      coordinates,
      srid,
    }
  }

  throw new Error(`Unsupported geometry type: rawType=${rawType}, baseType=${baseType}`)
}

function parseAnyWKB(wkbHex) {
  const bytes = hexToBytes(wkbHex)
  const reader = createReader(bytes)
  const geom = parseGeometry(reader)

  if (reader.getOffset() !== reader.getLength()) {
    console.warn(
      `WKB not fully consumed: offset=${reader.getOffset()}, total=${reader.getLength()}`
    )
  }

  return geom
}

export function parseLineStringWKB(wkbHex) {
  const geom = parseAnyWKB(wkbHex)
  if (geom.type !== 'LineString') {
    throw new Error(`Expected LineString, got ${geom.type}`)
  }
  return geom.coordinates
}

export function parseWKBMultiLineString(wkbHex) {
  const geom = parseAnyWKB(wkbHex)

  if (geom.type === 'LineString') {
    return [geom.coordinates]
  }

  if (geom.type !== 'MultiLineString') {
    throw new Error(`Expected MultiLineString or LineString, got ${geom.type}`)
  }

  return geom.coordinates
}

export function parseWKBMultiPolygon(wkbHex) {
  const geom = parseAnyWKB(wkbHex)

  if (geom.type === 'Polygon') {
    return [geom.coordinates]
  }

  if (geom.type !== 'MultiPolygon') {
    throw new Error(`Expected MultiPolygon or Polygon, got ${geom.type}`)
  }

  return geom.coordinates
}

export function parseWKB(wkbHex) {
  return parseAnyWKB(wkbHex)
}