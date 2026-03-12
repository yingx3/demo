# 按路由拆分的重构说明

## 目标

将原先集中在 `App.vue` 和部分 `components` 中的功能，拆成「每个功能一个独立组件，通过路由串联」的结构。

## 当前结构

```
src/
├── App.vue                 # 仅保留 <router-view /> 作为根出口
├── main.js                 # 已启用 router
├── router/
│   └── index.js            # 路由表：/ → MapLayout，子路由 '' | measure | disaster
├── views/
│   ├── MapLayout.vue       # 布局：初始化 Cesium、provide viewer、渲染子路由
│   ├── MapHome.vue         # 首页：综合监测（ZhJc + LeTh + ZyMl + 工具栏 + 弹窗等）
│   ├── MeasureView.vue     # 测量功能页（占位，待迁入测量/多边形等逻辑）
│   └── DisasterView.vue    # 灾害属性页（占位，待迁入添加/查询属性、属性表等）
└── components/             # 原有组件不变
    ├── ZhJc.vue
    ├── LeTh.vue
    ├── ZyMl.vue
    └── Dialog/...
```

## 路由与功能对应

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | MapHome | 主地图 + 综合监测、图层、资源模型、工具栏及现有弹窗 |
| `/measure` | MeasureView | 测量（距离/面积/高度、多边形） |
| `/disaster` | DisasterView | 灾害属性（添加属性、区划/属性查询、属性表、站点信息） |

- Cesium 只在 **MapLayout** 里初始化一次，通过 `provide('cesiumViewer', viewer)` 注入。
- 所有子路由页面通过 `inject('cesiumViewer')` 使用同一个 viewer，地图不随路由切换而重建。

## 已完成的修改

1. **App.vue**：内容迁到 `views/MapHome.vue`，App.vue 仅保留 `<router-view />`。
2. **MapLayout.vue**：新建；负责 Cesium 初始化、provide viewer、`<router-view />`。
3. **MapHome.vue**：由原 App.vue 复制并调整：
   - 根节点改为 `map-home-overlay`，不再包含 `#cesiumContainer`。
   - `viewer` 改为 `inject('cesiumViewer')`，去掉本地 Cesium 初始化。
   - 资源路径 `./` 改为 `../`（views 目录下）。
4. **MeasureView / DisasterView**：占位页，含「返回首页」按钮，便于后续把测量、灾害相关逻辑从 MapHome 迁入。
5. **首页工具栏**：「测量」「灾害查询」改为 `router-link` 跳转到 `/measure`、`/disaster`。

## 后续可做的拆分（建议顺序）

1. **测量**：把 MapHome 中与 `measure`、`polygon`、MeasureManager 等相关的逻辑与 UI 迁到 `MeasureView.vue`，在 `MeasureView` 的 `onMounted` 里根据 `viewer` 挂载测量逻辑。
2. **灾害属性**：把「添加属性」「查询属性」「属性表」「站点信息」相关表单、表格、弹窗和接口从 MapHome 迁到 `DisasterView.vue`。
3. **工具栏**：可抽成独立组件（如 `MapToolbar.vue`），放在 MapLayout 或 MapHome，通过路由或事件切换页面/功能。
4. **其它功能**：若还有独立业务块（如图层管理、预报等），可再增加路由与对应 view 组件，同样通过 `inject('cesiumViewer')` 使用地图。

## 运行与验证

- 开发：`npm run dev`，访问根路径应看到与原先一致的主地图和功能；点击「测量」「灾害查询」应跳转到对应占位页，再点「返回首页」回到主地图。
- 若部署带子路径（如 `/demo/`），需在 `createWebHistory(import.meta.env.BASE_URL)` 中保证 `BASE_URL` 与 `vite.config` / 部署路径一致。

## 注意事项

- `MapHome.vue` 中仍有 `teleport=".top-container"`，挂载目标是 MapLayout 的根节点，无需改路径。
- 样式：原 App 中与 `.top-container` 相关的已改为 `.map-home-overlay` 或保留在 MapHome；MapLayout 自带 `.top-container` 与 `#cesiumContainer` 样式。
