# 地震动设备数据（PGSQL）对接说明

> 本文件对应 `routes/device.js`，由独立服务 `E:\Project_GS\解析\api.js` 迁移而来。

## 1. 迁移了什么

| 原位置（E:\Project_GS\解析） | 现位置（ZHLXT） | 说明 |
|---|---|---|
| `api.js`（Express，独立端口 3001） | `src/node/routes/device.js` | 查询接口，路径与返回结构保持不变 |
| `db.js`（Sequelize 连 `postgres://postgres:***@localhost:5432/postgres`） | 复用 `src/node/db.js`（`pg` Pool） | 平台已有共享连接池，不再重复建连 |
| `app.js`（TCP 采集 demo，`DeviceData.create` 写库） | 未迁移 | 仍作为采集端独立运行（写入同一张表） |

迁移后**不需要**再单独启动 3001 进程，`/device/*` 由平台 node 服务（默认 3000）提供。

## 2. 数据链路

```
地震动传感器 → 采集端（厂商采集程序 app.js / TCPClient 等）
              → PGSQL 表 dzd_device_data
              → node 服务 /device/*
              → 前端「设备 → 地震动」图层（deviceService.js）
```

> 注：平台内另有一条 **CSV 链路**（`TCPClient.java` → `wave_*.csv` → `/dzd/*` → Transformer1D 识别）。
> 两条链路数据源不同、互不冲突：`/device/*` 读数据库历史记录，`/dzd/*` 读本地波形文件。

## 3. 接口

| 接口 | 说明 | 前端调用方 |
|---|---|---|
| `GET /device/all` | 全量设备数据（`?limit=` 可选，按时间倒序取） | `deviceService.fetchAllDevices()` |
| `GET /device/latestAll` | 关注设备各自最新 100 条（对象：deviceId → 数组） | （保留原 api.js 行为） |
| `GET /device/latest/:deviceid` | 单设备最新 100 条，`timestamp` 倒序 | `deviceService.fetchLatestRecords()`、`MapHome.vue` 弹窗折线图 |
| `GET /device/status` | 诊断：表名、总行数、设备清单与最新时间（新增） | 排查用 |

返回字段：`deviceid, gps_longitude, gps_latitude, gps_high, timestamp, channel_one_lp_x|y|z, channel_two_lp_x|y|z`。

## 4. 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `DZD_DEVICE_TABLE` | `dzd_device_data` | 数据表名（仅允许字母/数字/下划线） |
| `DZD_DEVICE_IDS` | `41109656,41126040,41158808` | `/device/latestAll` 关注的设备 |
| `DZD_DEVICE_LIMIT` | `100` | 「最新 N 条」的 N（上限 5000） |
| `DB_PASSWORD` | `123456` | 数据库口令（`src/node/db.js` 读取） |

## 5. 代理配置

- 开发环境 `vite.config.js`：`/device` → `http://localhost:3000`，**不做 rewrite**（保留 `/device` 前缀）。
- 生产 `nginx-deploy.conf`：`location /device/ { proxy_pass http://127.0.0.1:3000/device/; }`。

> 旧配置把 `/device` 前缀 rewrite 掉后转发到 3001，而 `api.js` 本身也只认 `/device/*`，
> 因此历史上 `/device/all` 一直 404；迁移时一并修正。

## 6. 自测

```bash
# 启动 node 服务（默认 3000）
node src/node/server.js

curl http://localhost:3000/device/status
curl http://localhost:3000/device/all
curl http://localhost:3000/device/latest/41109656
```

迁移时已与旧 3001 服务逐条比对：`/device/all`、`/device/latestAll`、`/device/latest/:id`
返回数据完全一致（230 条记录、3 个设备）。
