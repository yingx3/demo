# 地震动（DZD）数据对接说明

## 数据链路

```
TCPClient.java（TCP 采集：250Hz，每文件 30000 点）
  → wave_<X|Y|Z>_<UTC时间>.csv（表头 Timestamp,Direction,Voltage_mV）
  → node 服务 /dzd/*（routes/dzd.js）
  → 前端“设备 → 地震动”图层（波形 + Transformer1D 识别结果）
```

## 1. TCPClient 侧：把波形写到平台读取的目录

TCPClient 默认写到进程当前目录（`tcp.wave.outputDir` 默认 `.`），运行时指定：

```bat
java -Dtcp.wave.outputDir=E:/Projects/ZHLXT/backend/hd-mao_0322/suanfa/dzd/data -cp ... com.tcp.client.TCPClient
```

或使用环境变量：

```bat
set TCP_WAVE_OUTPUT_DIR=E:\Projects\ZHLXT\backend\hd-mao_0322\suanfa\dzd\data
```

## 2. node 服务侧环境变量（可选）

| 变量 | 默认值 | 说明 |
|---|---|---|
| DZD_WAVE_DIR | backend/hd-mao_0322/suanfa/dzd/data | 波形 CSV 目录 |
| DZD_SCRIPT_DIR | backend/hd-mao_0322/suanfa/dzd/scripts | 识别脚本目录 |
| DZD_PYTHON | python | Python 解释器（需 torch、pandas、numpy） |
| DZD_SAMPLE_RATE | 250 | 采样率，与 TCPClient.SAMPLE_RATE 一致 |
| DZD_PREDICT_TIMEOUT_MS | 180000 | 单次识别超时 |

## 3. 设备与坐标

TCPClient 的 CSV 不含设备坐标，地图位置在 `src/node/dzd-devices.json` 维护，
`deviceId` 默认与 `TCPClient.DEFAULT_DEVICE_ID`（5200369）一致：

```json
{ "deviceId": 5200369, "name": "地震动监测站", "lng": 102.092337, "lat": 30.054334 }
```

## 4. 接口

| 接口 | 说明 |
|---|---|
| GET /dzd/status | 目录状态、文件数、最新文件、采样率、设备列表 |
| GET /dzd/files?limit=&direction= | 波形文件清单（点数、起止时间、CSV 表头） |
| GET /dzd/wave?file=&max= | 波形采样点（默认抽稀到 6000 点） |
| POST /dzd/predict `{ "file": "wave_Z_xxx.csv" }` | 调用 Transformer1D，返回概率与二分类 |

## 5. 与 TCPClient 输出的对应关系

| TCPClient.java | 平台侧 |
|---|---|
| `SAMPLE_RATE=250` / `SAMPLE_INTERVAL_MS=4ms` | `sampleRate: 250` |
| `DEFAULT_MAX_POINTS_PER_FILE=30000` | `pointsPerFile: 30000`（= Transformer1D 输入长度） |
| CSV 列 `Timestamp,Direction,Voltage_mV` | 波形 `time` / `value` 数组 |
| `DEFAULT_DEVICE_ID=5200369` | `dzd-devices.json` 的 `deviceId` |
| 目录 `tcp.wave.outputDir` | `DZD_WAVE_DIR` |

> 识别算法位于 `backend/hd-mao_0322/suanfa/dzd/scripts/transformer1d.py`，
> 输入为 CSV 的 `Voltage_mV` 列（不足/超出 30000 点自动补零或截断）。