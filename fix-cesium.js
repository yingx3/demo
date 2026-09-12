import { existsSync, renameSync, rmSync } from 'fs';
import path from 'path';

// vite-plugin-cesium 在 base=/CS 时会把 Cesium 复制到 CS/CS/cesium，
// 而 index.html 引用的是 /CS/cesium，所以构建后把它移回正确位置。
const outDir = path.resolve('CS');
const wrongDir = path.join(outDir, 'CS', 'cesium');
const rightDir = path.join(outDir, 'cesium');

if (existsSync(wrongDir)) {
  if (existsSync(rightDir)) {
    rmSync(rightDir, { recursive: true, force: true });
  }
  renameSync(wrongDir, rightDir);
  rmSync(path.join(outDir, 'CS'), { recursive: true, force: true });
  console.log('[fix-cesium] moved CS/CS/cesium -> CS/cesium');
} else {
  console.log('[fix-cesium] nothing to move');
}