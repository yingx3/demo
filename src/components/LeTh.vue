<template>
  <div class="left">
    <div class="name">数值计算模型集</div>
    <div class="total_theme">
      <!-- 灾害链风险源判识模块 -->
      <div class="theme">
        <div class="title">灾害链风险源判识</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisible = true"
            ><span>风险源定量识别与表征模型</span></el-button
          >
          <el-dialog
            v-model="dialogVisible"
            width="500"
            :close-on-click-modal="false"
            class="dialog_trigrs"
            @open="resetTrigrsInputs"
          >
            <!--在title旁添加帮助问号（用slot="header"自定义弹窗头部） -->
            <template #header>
              <div class="model-dialog-header trigrs-header">
                <div class="model-dialog-heading">
                  <span class="model-dialog-title"
                    >风险源定量识别与表征模型</span
                  >
                  <span class="model-dialog-subtitle">参数配置</span>
                </div>
                <el-tooltip content="查看参数说明" placement="top">
                  <el-icon
                    class="help-icon"
                    @click="openHelpDialog_fxy = true"
                  >
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-dialog
              v-model="openHelpDialog_fxy"
              class="model-help-dialog"
              width="1200px"
              :close-on-click-modal="false"
              top="70px"
              >
              <template #title>
                <div class="model-help-head">
                  <span class="model-help-title">风险源定量识别与表征模型</span>
                  <span class="model-help-subtitle">参数说明</span>
                </div>
              </template>
              <div
                id="trigrs-model-info"
                class="help-body"
                >
                <h2>一、功能目的</h2>
                <p>基于降雨入渗与边坡稳定性的耦合分析，逐网格计算降雨历时内的稳定性系数，定量识别滑坡、泥石流物源等风险源的位置与规模，输出不同降雨历时下的不稳定区分布，为灾害链风险源判识、预警与防治规划提供依据。</p>
                <h2>二、界面输入参数</h2>
                <table>
                  <tbody>
                    <tr><td>参数</td><td>单位 / 取值</td><td>默认值</td><td>说明</td></tr>
                    <tr><td>地点</td><td>文本</td><td>空（占位「林芝市」）</td><td>本次计算的地点名称，用于结果记录与图层对应，便于按流域区分成果</td></tr>
                    <tr><td>色带</td><td>危险等级 / 灰度 / 红绿蓝 / 红色渐变</td><td>危险等级</td><td>稳定性系数出图配色；「危险等级」按不稳定程度分级设色，其余为通用色带</td></tr>
                    <tr><td>预测时间</td><td>3h / 6h / 12h / 24h / 48h / 60h（可多选）</td><td>不选</td><td>降雨历时，对应 10800 / 21600 / 43200 / 86400 / 172800 / 216000 秒；勾选几个时段就输出几组结果，<strong>至少勾选一项</strong></td></tr>
                    <tr><td>入渗率</td><td>m/s</td><td>1.0e-6</td><td>坡面入渗速率，控制雨水进入土体的快慢；值越大，土体饱和度上升越快、越易失稳</td></tr>
                    <tr><td>初始地下水位</td><td>m</td><td>3.0</td><td>计算初始时刻的地下水位埋深；埋深越浅，初始孔隙水压力越高、稳定性系数越低</td></tr>
                    <tr><td>土壤最大深度</td><td>m</td><td>2.4</td><td>参与计算的土层最大厚度，决定潜在滑面的搜索深度</td></tr>
                    <tr><td>水力扩散系数</td><td>m²/s</td><td>1.32e-3</td><td>孔隙水压力在土体内的扩散能力，越大则压力扰动传播越快</td></tr>
                    <tr><td>饱和渗透系数</td><td>m/s</td><td>1.32e-5</td><td>土体饱和后的渗透能力，与入渗率共同控制降雨入渗与地下水位响应</td></tr>
                  </tbody>
                </table>
                <p>说明：DEM、流向、网格行列数、粘聚力、内摩擦角、土容重等参数由后端工程内置文件提供，界面不暴露、无需填写。</p>
                <h2>三、运行流程</h2>
                <ol>
                  <li>填写地点、色带与 5 项水文／岩土参数，勾选需要评估的降雨历时；</li>
                  <li>后端按勾选的每个时段依次执行模拟计算（运行前自动备份参数文件，计算结束后还原）；</li>
                  <li>逐时段生成稳定性（易发性）栅格与网格详单，前端按顺序加载为地图专题图层。</li>
                </ol>
                <h2>四、结果与提示</h2>
                <ul>
                  <li><strong>易发性评估成果</strong>：0–1 为不稳定高风险区，1–10 为稳定区（值越大越稳定），可转 GIS 专题图；</li>
                  <li><strong>逐网格详单成果</strong>：含土壤深度、孔隙水压力与稳定性系数，供量化分析；</li>
                  <li>结果按勾选的时段逐个输出，时段越多耗时越长，运行期间请勿关闭页面；</li>
                  <li>成果默认写入后端计算成果目录，地图图层可在资源目录中开关与调节透明度。</li>
                </ul>
                <h2>五、运行结果示例</h2>
                <img
                  :src="ASSET_BASE + 'img/demo-risk-source.png'"
                  alt="风险源定量识别与表征模型运行结果示例"
                  title="点击查看大图"
                  @click="previewSrc = $event.target.src"
                />
              </div>
            </el-dialog>
            <p id="name_par" class="trigrs-section-label">模型参数</p>

            <el-form
              :model="form"
              label-position="top"
              class="form_trigrs trigrs-form"
            >
              <el-form-item label="地点" class="form1_trigrs">
                <el-input v-model="form.name" placeholder="林芝市" />
              </el-form-item>
              <el-form-item label="色带" class="form2_trigrs">
                <el-select v-model="form.color" placeholder="危险等级">
                  <el-option label="危险等级" value="dangerLevel" />
                  <el-option label="灰度" value="gray" />
                  <el-option label="红绿蓝" value="rgb" />
                  <el-option label="红色渐变" value="redGradient" />
                </el-select>
              </el-form-item>
              <el-form-item label="预测时间" class="from3_trigrs trigrs-time-field">
                <div>
                  <el-checkbox-group v-model="form.time">
                    <el-checkbox :label="'3h'" :value="10800">3h</el-checkbox>
                    <el-checkbox :label="'6h'" :value="21600">6h</el-checkbox>
                    <el-checkbox :label="'12h'" :value="43200">12h</el-checkbox>
                    <el-checkbox :label="'24h'" :value="86400">24h</el-checkbox>
                    <el-checkbox :label="'48h'" :value="172800"
                      >48h</el-checkbox
                    >
                    <el-checkbox :label="'60h'" :value="216000"
                      >60h</el-checkbox
                    >
                  </el-checkbox-group>
                </div>
                <!-- <div>
                  <el-radio-group v-model="form.time">
                    <el-radio :label="'3h'" :value="10800">3h</el-radio>
                    <el-radio :label="'6h'" :value="21600">6h</el-radio>
                    <el-radio :label="'12h'" :value="43200">12h</el-radio>
                    <el-radio :label="'24h'" :value="86400">24h</el-radio>
                    <el-radio :label="'48h'" :value="172800">48h</el-radio>
                    <el-radio :label="'60h'" :value="216000">60h</el-radio>
                  </el-radio-group>
                </div> -->
              </el-form-item>
              <el-form-item label="入渗率" class="form4_trigrs trigrs-wide-field">
                <el-input v-model="form.rsl" placeholder="1.0e-6" />
              </el-form-item>
              <el-form-item label="初始地下水位">
                <el-input v-model="form.depth" placeholder="单位M" />
              </el-form-item>
              <el-form-item label="土壤最大深度">
                <el-input v-model="form.zmax" placeholder="单位M" />
              </el-form-item>
              <el-form-item label="水力扩散系数">
                <el-input v-model="form.diffus" placeholder="1.32e-3" />
              </el-form-item>
              <el-form-item label="饱和渗透系数">
                <el-input v-model="form.ksat" placeholder="1.32e-5" />
              </el-form-item>
              <el-form-item class="trigrs-actions">
                <el-button class="trigrs-submit" type="primary" @click="onSubmit"
                  >运行</el-button
                >
                <el-button class="trigrs-cancel" @click="dialogVisible = false"
                  >取消</el-button
                >
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisibleGBM = true"
            ><span>冰川泥石流易发性预测模型</span></el-button
          >
          <el-dialog
            v-model="dialogVisibleGBM"
            title="冰川泥石流易发性预测模型"
            width="500"
            :close-on-click-modal="false"
            class="dialog_lightGBM"
            @open="resetGbmInputs"
          >
            <template #header>
              <div class="model-dialog-header gbm-header">
                <div class="model-dialog-heading">
                  <span class="model-dialog-title"
                    >冰川泥石流易发性预测模型</span
                  >
                  <span class="model-dialog-subtitle">易发性参数配置</span>
                </div>
                <el-tooltip content="查看参数说明" placement="top">
                  <el-icon
                    class="help-icon"
                    @click="openHelpDialog_gbm = true"
                  >
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-dialog
              v-model="openHelpDialog_gbm"
              class="model-help-dialog"
              width="1200px"
              :close-on-click-modal="false"
              top="70px"
              >
              <template #title>
                <div class="model-help-head">
                  <span class="model-help-title">冰川泥石流易发性预测模型</span>
                  <span class="model-help-subtitle">参数说明</span>
                </div>
              </template>
              <div
                id="glacier-hazard-chain-info"
                class="help-body"
                >
                <h2>一、功能目的</h2>
                <p>调用已训练的易发性预测模型对上传的流域因子数据进行推理，并将易发性概率划分为 5 个易发性等级，输出带概率与等级字段的 Shapefile，实现冰川泥石流易发性预测。</p>
                <h2>二、界面输入参数</h2>
                <table>
                  <tbody>
                    <tr><td>参数</td><td>格式 / 单位</td><td>默认值</td><td>说明</td></tr>
                    <tr><td>Shapefile</td><td>.shp / .dbf / .shx / .prj，需一次多选上传</td><td>必填</td><td>待预测的矢量数据；同名的一组文件必须一起选中上传，缺少坐标系时后端按 EPSG:32646 处理</td></tr>
                    <tr><td>坡向</td><td>°</td><td>150</td><td>坡面朝向，影响日照与融冰差异</td></tr>
                    <tr><td>曲率</td><td>—（无量纲）</td><td>0.002</td><td>地形曲率，反映坡面汇流／发散与物质堆积条件</td></tr>
                    <tr><td>断层距离</td><td>m</td><td>30000</td><td>距最近断层的距离，表征构造破碎带对物源的贡献</td></tr>
                    <tr><td>NDVI</td><td>—（-1～1）</td><td>0.001</td><td>植被覆盖指数，值越低越易发生侵蚀与启动</td></tr>
                    <tr><td>降雨量</td><td>mm</td><td>700</td><td>降雨驱动因子，是冰川泥石流启动的核心诱因</td></tr>
                    <tr><td>起伏度</td><td>m</td><td>250</td><td>地形起伏幅度，控制势能与物质搬运能力</td></tr>
                  </tbody>
                </table>
                <p>说明：界面上这 6 个数值是<strong>缺失字段的补值</strong>——当上传的 Shapefile 缺少 Aspect / Curvature / Fault distance / NDVI / Precipitation / Relief amplitude 字段时，用这里填写的数值补齐；字段存在时以文件属性值为准。</p>
                <h2>三、数据字段要求</h2>
                <p>模型按训练时的 15 个特征推理，Shapefile 属性表建议包含以下字段（受字段名长度限制可用截断名）：</p>
                <table>
                  <tbody>
                    <tr><td>属性字段（截断名）</td><td>模型特征</td><td>含义</td></tr>
                    <tr><td>Aspect</td><td>Aspect</td><td>坡向</td></tr>
                    <tr><td>Curvature</td><td>Curvature</td><td>曲率</td></tr>
                    <tr><td>Fault dist</td><td>Fault distance</td><td>断层距离</td></tr>
                    <tr><td>Glacier ar</td><td>Glacier area ratio</td><td>冰川面积比</td></tr>
                    <tr><td>Gully grad</td><td>Gully gradient</td><td>沟谷坡度</td></tr>
                    <tr><td>NDVI</td><td>NDVI</td><td>植被覆盖指数</td></tr>
                    <tr><td>Precipitat</td><td>Precipitation</td><td>降雨量</td></tr>
                    <tr><td>Relief amp</td><td>Relief amplitude</td><td>地形起伏度</td></tr>
                    <tr><td>Slope</td><td>Slope</td><td>坡度</td></tr>
                    <tr><td>Soil thick</td><td>Soil thickness</td><td>土层厚度</td></tr>
                    <tr><td>SPI</td><td>SPI</td><td>沟壑功率指数</td></tr>
                    <tr><td>Stream Dis</td><td>Stream Distance</td><td>距河流距离</td></tr>
                    <tr><td>Surface ro</td><td>Surface roughness</td><td>地表粗糙度</td></tr>
                    <tr><td>Temperatur</td><td>Temperature</td><td>温度</td></tr>
                    <tr><td>TWI</td><td>TWI</td><td>地形湿度指数</td></tr>
                  </tbody>
                </table>
                <h2>四、运行流程与结果</h2>
                <ol>
                  <li>选择 Shapefile 相关文件 → 按需填写 6 个补值 → 点击「上传并提交」；</li>
                  <li>后端先落盘文件，再调用推理脚本完成列名映射、缺失值填充与标准化，并计算易发性概率；</li>
                  <li>概率按自然间断点法分为 5 个易发性等级，结果保存为 Shapefile 并转换为 GeoJSON 返回前端；</li>
                  <li>前端加载分级图层并自动定位，可在资源目录中开关与调节透明度。</li>
                </ol>
                <h2>五、运行结果示例</h2>
                <img
                  :src="ASSET_BASE + 'img/demo-gbm.png'"
                  alt="冰川泥石流易发性预测模型运行结果示例"
                  title="点击查看大图"
                  @click="previewSrc = $event.target.src"
                />
              </div>
            </el-dialog>
            <p id="name_par_gbm" class="gbm-section-label">模型参数</p>

            <el-form
              :model="formGBM"
              label-position="top"
              class="form_gbm gbm-form"
            >
              <el-form-item label="Shapefile" class="gbm-file-field">
                <el-input
                  v-model="fileNameGBM"
                  placeholder="上传 shp / dbf / shx / prj 文件"
                  class="gbm-file-input"
                >
                  <template #append>
                    <el-upload
                      ref="uploadRefGBM"
                      action="http://localhost:3000/node/upload_shp"
                      name="file"
                      :auto-upload="false"
                      :multiple="true"
                      :show-file-list="false"
                      accept=".shp,.dbf,.shx,.prj"
                      :data="uploadDataGBM"
                      @change="handleFileChangeGBM"
                      @success="handleUploadSuccessGBM"
                      @error="handleUploadErrorGBM"
                    >
                      <el-button
                        class="gbm-upload-trigger"
                        @click.stop="triggerUploadGBM"
                      >
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              <div class="gbm-param-row">
                <el-form-item
                  label="坡向"
                  label-position="center"
                  label-width="72px"
                >
                  <el-input
                    placeholder="150"
                    v-model="form_BGM.aspect"
                    style="width: 60px"
                  />
                </el-form-item>
                <el-form-item
                  label="曲率"
                  label-position="center"
                  label-width="60px"
                >
                  <el-input
                    placeholder="0.002"
                    v-model="form_BGM.curvature"
                    style="width: 60px"
                  />
                </el-form-item>
                <el-form-item
                  label="断层距离"
                  label-position="left"
                  label-width="90px"
                >
                  <el-input
                    placeholder="30000"
                    v-model="form_BGM.fault_distance"
                    style="width: 60px"
                  />
                </el-form-item>
              </div>
              <div class="gbm-param-row">
                <el-form-item
                  label="NDVI"
                  label-position="center"
                  label-width="72px"
                >
                  <el-input
                    placeholder="0.001"
                    v-model="form_BGM.ndvi"
                    style="width: 60px"
                  />
                </el-form-item>
                <el-form-item
                  label="降雨量"
                  label-position="center"
                  label-width="70px"
                >
                  <el-input
                    placeholder="700"
                    v-model="form_BGM.rainfall"
                    style="width: 60px"
                  />
                </el-form-item>
                <el-form-item
                  label="起伏度"
                  label-position="left"
                  label-width="90px"
                >
                  <el-input
                    placeholder="250"
                    v-model="form_BGM.relief_amplitude"
                    style="width: 60px"
                  />
                </el-form-item>
              </div>

              <el-form-item class="gbm-actions">
                <el-button
                  type="primary"
                  class="gbm-submit"
                  @click="submitGBM"
                  >上传并提交</el-button
                >
                <el-button
                  class="gbm-cancel"
                  @click="dialogVisibleGBM = false"
                  >取消</el-button
                >
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <!-- 静态数据卡片：区域灾害本底数据点位（与资源目录勾选同源） -->
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-popover width="290" trigger="click" placement="right-start" popper-class="data-layer-popover">
            <template #reference>
              <el-button :plain="true"
                ><span>区域灾害本底数据点位</span>
                <span v-if="dataLayerCount([611, 612, 613])" class="data-layer-count"
                  >{{ dataLayerCount([611, 612, 613]) }}/3</span
                ></el-button
              >
            </template>
            <div class="data-layer-panel">
              <div class="data-layer-panel-head">
                <span>区域灾害本底数据点位</span>
                <span class="data-layer-panel-actions">
                  <a href="#" @click.prevent="selectAllDataLayers([611, 612, 613], true)">全选</a>
                  <a href="#" @click.prevent="selectAllDataLayers([611, 612, 613], false)">清空</a>
                </span>
              </div>
              <p class="data-layer-panel-hint">
                勾选即在地图上加载，与「资源目录」勾选状态同步
              </p>
              <el-checkbox
                v-for="item in dataLayerGroups.riskBase"
                :key="item.id"
                :model-value="isDataLayerChecked(item.id)"
                @change="v => toggleDataLayerItem(item.id, v)"
                >{{ item.label }}</el-checkbox
              >
              <div v-if="isDataLayerChecked(611)" class="data-layer-time">
                <span>时间 / 降雨历时</span>
                <el-select
                  size="small"
                  style="width: 100%"
                  placeholder="选择时段"
                  :model-value="
                    dangerLevelSelected ||
                    (dangerLevelFiles[0] && dangerLevelFiles[0].file) ||
                    ''
                  "
                  @change="dangerLevelFileChange"
                >
                  <el-option
                    v-for="f in dangerLevelFiles"
                    :key="f.file"
                    :label="f.timeText + (f.durationText ? ' · ' + f.durationText : '')"
                    :value="f.file"
                  />
                </el-select>
              </div>
            </div>
          </el-popover>
        </div>
        <!-- 静态数据卡片：冰川泥石流风险源（与资源目录勾选同源） -->
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-popover width="290" trigger="click" placement="right-start" popper-class="data-layer-popover">
            <template #reference>
              <el-button :plain="true"
                ><span>冰川泥石流风险源</span>
                <span v-if="dataLayerCount([621, 622, 623])" class="data-layer-count"
                  >{{ dataLayerCount([621, 622, 623]) }}/3</span
                ></el-button
              >
            </template>
            <div class="data-layer-panel">
              <div class="data-layer-panel-head">
                <span>冰川泥石流风险源</span>
                <span class="data-layer-panel-actions">
                  <a href="#" @click.prevent="selectAllDataLayers([621, 622, 623], true)">全选</a>
                  <a href="#" @click.prevent="selectAllDataLayers([621, 622, 623], false)">清空</a>
                </span>
              </div>
              <p class="data-layer-panel-hint">
                勾选即在地图上加载，与「资源目录」勾选状态同步
              </p>
              <el-checkbox
                v-for="item in dataLayerGroups.glacierSource"
                :key="item.id"
                :model-value="isDataLayerChecked(item.id)"
                @change="v => toggleDataLayerItem(item.id, v)"
                >{{ item.label }}</el-checkbox
              >
            </div>
          </el-popover>
        </div>
      </div>
      <!-- 灾害链模拟模块  -->
      <div class="theme">
        <div class="title">灾害链模拟</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <!-- 冰川泥石流动力学模型：r.avaflow 内核 + 逐帧渲染泥石流层厚度 -->
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogBeta = true"
            ><span>冰川泥石流动力学模型</span></el-button
          >
          <el-dialog v-model="dialogBeta" title="冰川泥石流动力学模型" width="520" :close-on-click-modal="false" class="dialog_quanyu dialog_fullRisk" @open="resetBetaInputs">
            <template #header>
              <div class="model-dialog-header">
                <div class="model-dialog-heading">
                  <span class="model-dialog-title">冰川泥石流动力学模型</span>
                  <span class="model-dialog-subtitle">启动动力学参数配置</span>
                </div>
                <el-tooltip content="查看参数说明" placement="top">
                  <el-icon class="help-icon" @click="openHelpDialog_sh = true">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-dialog
              v-model="openHelpDialog_sh"
              class="model-help-dialog"
              width="1200px"
              :close-on-click-modal="false"
              top="70px"
            >
              <template #title>
                <div class="model-help-head">
                  <span class="model-help-title">冰川泥石流动力学模型</span>
                  <span class="model-help-subtitle">参数说明</span>
                </div>
              </template>
              <div id="shanhong-model-info" class="help-body">
                <h2>一、功能目的</h2>
                <p>采用二维流变动力学数值方法，基于平均高程、物源启动区与影响范围栅格模拟冰川泥石流的启动与运动过程，输出逐时刻的泥石流层厚度栅格序列，用于评估运动路径、堆积范围与致灾强度。</p>
                <h2>二、界面输入参数</h2>
                <table>
                  <tbody>
                    <tr><td>参数</td><td>格式</td><td>默认值</td><td>说明</td></tr>
                    <tr><td>平均高程</td><td>.tif / .tiff（单文件）</td><td>必填</td><td>地形基准面，作为流动计算的底床（上传后重命名为 elev.tif）</td></tr>
                    <tr><td>物源启动区</td><td>.tif / .tiff（单文件）</td><td>必填</td><td>标记参与启动的物源分布范围，决定初始泥石流体的位置与体积（重命名为 debris.tif）</td></tr>
                    <tr><td>影响范围</td><td>.tif / .tiff（单文件）</td><td>必填</td><td>限定计算域，范围外的像元不参与演算（重命名为 impact_area.tif）</td></tr>
                  </tbody>
                </table>
                <p>说明：本模型没有可调的物理参数输入框，全部动力学参数由后端模型统一配置；三份栅格需覆盖同一范围，提交时缺项会逐项提示。</p>
                <h2>三、运行流程</h2>
                <ol>
                  <li>依次选择并上传三份栅格数据（缺项会在提交时提示，无法启动计算）；</li>
                  <li>后端导入栅格并执行数值计算，按代表性时间节点抽取逐帧结果；</li>
                  <li>结果由 tif 转换为 GeoJSON（EPSG:4326）与 bbox，前端按帧播放泥石流层厚度并自动定位相机。</li>
                </ol>
                <h2>四、结果与提示</h2>
                <ul>
                  <li>结果包含逐时刻泥石流层厚度栅格序列与结果范围 bbox，<strong>默认渲染场为泥石流层厚度</strong>；</li>
                  <li>计算约需数分钟至十余分钟，进度会在提示消息中实时更新，等待超时为 30 分钟；</li>
                  <li>运行期间请勿关闭页面，完成后图层可在资源目录中开关与调节透明度；</li>
                  <li>若定位偏移，请检查输入栅格的坐标系与范围是否与案例区一致。</li>
                  <li>点击弹窗下方的<strong>「历史模拟」</strong>可查看并回放此前的运行结果（含基准工况与地形调控工况）。</li>
                </ul>
              </div>
            </el-dialog>
            <p class="quanyu-section-label">输入数据</p>
            <el-form label-position="top" class="quanyu-form">
              <el-form-item
                v-for="item in betaFileItems"
                :key="item.key"
                :label="item.label"
                label-position="top"
                class="quanyu-file-field"
              >
                <el-input
                  v-model="betaFileNames[item.key]"
                  :placeholder="item.placeholder"
                  readonly
                >
                  <template #append>
                    <el-upload
                      :ref="el => { if (el) betaUploadRefs[item.key] = el }"
                      :auto-upload="false"
                      :show-file-list="false"
                      accept=".tif,.tiff"
                      @change="(f, fs) => handleBetaFile(item.key, f, fs)"
                    >
                      <el-button
                        class="quanyu-upload-trigger"
                        @click.stop="triggerBetaUpload(item.key)"
                      >
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item class="quanyu-actions">
                <el-button class="quanyu-submit" type="primary" @click="submitBeta"
                  >运行</el-button
                >
                <el-button class="quanyu-cancel" @click="openBetaHistory"
                  >历史模拟</el-button
                >
                <el-button class="quanyu-cancel" @click="dialogBeta = false"
                  >取消</el-button
                >
              </el-form-item>
            </el-form>
            <el-dialog
              v-model="betaHistoryVisible"
              class="model-help-dialog"
              width="1020px"
              :close-on-click-modal="false"
              top="80px"
            >
              <template #title>
                <div class="model-help-head">
                  <span class="model-help-title">历史模拟记录</span>
                  <span class="model-help-subtitle"
                    >选择任意一次运行结果，直接在三维场景中回放</span
                  >
                </div>
              </template>
              <div class="help-body">
                <p v-if="betaHistoryLoading" style="margin: 6px 0">
                  历史记录读取中...
                </p>
                <p v-else-if="!betaHistoryItems.length" style="margin: 6px 0">
                  暂无可回放的历史模拟记录。
                </p>
                <table v-else class="pro-history-table">
                  <thead>
                    <tr>
                      <th>运行时间</th>
                      <th>任务号</th>
                      <th>帧数</th>
                      <th>最大厚度 (m)</th>
                      <th>工况</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in betaHistoryItems" :key="item.jobId">
                      <td>{{ item.createdAtText }}</td>
                      <td class="history-jobid">{{ item.jobId }}</td>
                      <td>{{ item.frameCount }}</td>
                      <td>{{ Number(item.globalMax || 0).toFixed(1) }}</td>
                      <td>{{ betaHistoryCondition(item) }}</td>
                      <td>
                        <el-button
                          v-if="betaHistoryPlayable(item)"
                          link
                          type="primary"
                          @click="loadBetaHistory(item)"
                          >加载</el-button
                        >
                        <span v-else style="opacity: 0.55">缺少坐标</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-dialog>
          </el-dialog>
        </div>
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />

          <el-button :plain="true" @click="dialogVisible2 = true"
            ><span>冰岩崩动力学模型</span></el-button
          >
          <el-dialog
            v-model="dialogVisible2"
            title="冰岩崩动力学模型"
            width="560"
            :close-on-click-modal="false"
            class="dialog_quanyu dialog_fullRisk"
            @open="resetFloodProInputs"
          >
            <template #header>
              <div class="model-dialog-header">
                <div class="model-dialog-heading">
                  <span class="model-dialog-title">冰岩崩动力学模型</span>
                  <span class="model-dialog-subtitle">冰岩崩动力学参数配置</span>
                </div>
                <el-tooltip content="查看参数说明" placement="top">
                  <el-icon
                    class="help-icon"
                    @click="openHelpDialog_flood = true"
                  >
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
                <el-dialog
                  v-model="openHelpDialog_flood"
                  class="model-help-dialog"
                  width="1200px"
                  :close-on-click-modal="false"
                  top="70px"
                  >
                  <template #title>
                    <div class="model-help-head">
                      <span class="model-help-title">冰岩崩动力学模型</span>
                      <span class="model-help-subtitle">参数说明</span>
                    </div>
                  </template>
                  <div
                    id="debris-flow-dynamics-model-info"
                    class="help-body"
                    >
                    <h2>一、功能目的</h2>
                    <p>采用泥石流—洪水耦合的浅水流数值方法，在灾后地形上模拟冰岩崩—泥石流的启动、输移与堆积过程，输出逐时刻的泥石流层厚度、水层厚度与流速，为堰塞湖溃决—洪水—泥石流灾害链的形成机制分析与风险评估提供量化支撑。</p>
                    <h2>二、界面输入参数（数据）</h2>
                    <table>
                      <tbody>
                        <tr><td>参数</td><td>格式 / 取值</td><td>默认值</td><td>说明</td></tr>
                        <tr><td>数据坐标系</td><td>EPSG 代码</td><td>EPSG:32646</td><td>txt / asc 输入不带坐标系时按此解释；带坐标系的 tif 以文件自身为准</td></tr>
                        <tr><td>源区中心</td><td>十进制度（WGS84），经度 + 纬度</td><td>95.0020 / 30.2354</td><td>仅用于 txt / asc 无 xllcorner、yllcorner 头部时，把结果定位到地图上的实际位置（示例即易贡案例区）</td></tr>
                        <tr><td>灾前地形 zb</td><td>.tif / .tiff / .txt / .asc</td><td>不选（用内置示例数据）</td><td>泥石流发生前的地形，作为计算初始底床</td></tr>
                        <tr><td>灾后地形 zl</td><td>.tif / .tiff / .txt / .asc</td><td>不选（用内置示例数据）</td><td>泥石流发生后的地形，<strong>泥石流层厚度 = zB − zL</strong></td></tr>
                        <tr><td>初始水深 hw</td><td>.tif / .tiff / .txt / .asc</td><td>不选（用内置示例数据）</td><td>初始水体（堰塞湖／河道）水深分布</td></tr>
                      </tbody>
                    </table>
                    <p>说明：三份数据<strong>要么都上传、要么都不上传</strong>，只上传其中一部分会被拦截；不选文件时后端使用内置示例数据。</p>
                    <h2>三、界面输入参数（模型参数）</h2>
                    <table>
                      <tbody>
                        <tr><td>参数</td><td>单位</td><td>默认值</td><td>说明</td></tr>
                        <tr><td>基底摩擦角</td><td>rad</td><td>0.05</td><td>有效基底摩擦角（弧度，参与 tan 计算），数值越大阻力越强、运动越易停止；水饱和的冰川型泥石流有效摩阻偏低，取 0.05（约 2.9°）时易贡 BH02 物源在 200 s 内基本入湖，是本案例运动速度的主控参数</td></tr>
                        <tr><td>曼宁摩擦系数</td><td>—</td><td>0.0125</td><td>曼宁糙率，控制流速大小与下泄过程</td></tr>
                        <tr><td>网格长度</td><td>m</td><td>20</td><td>计算网格 x 方向尺寸，影响计算精度、稳定性与耗时</td></tr>
                        <tr><td>网格宽度</td><td>m</td><td>20</td><td>计算网格 y 方向尺寸</td></tr>
                        <tr><td>滑坡密度</td><td>kg/m³</td><td>2700</td><td>固相（滑坡／泥石流）密度</td></tr>
                        <tr><td>河水密度</td><td>kg/m³</td><td>1000</td><td>液相（水）密度，与滑坡密度共同决定固液密度比</td></tr>
                        <tr><td>输出间距</td><td>s</td><td>10</td><td>结果输出时间间隔（出图节拍），越小结果越密、数据量越大</td></tr>
                        <tr><td>计算时间</td><td>s</td><td>200</td><td>模拟总时长，需覆盖完整的启动—输移—堆积过程</td></tr>
                        <tr><td>物源厚度比例</td><td>%</td><td>30</td><td>初始物源层厚度（zB − zL）的保留比例：100 表示不削薄，数值越小初始物源越薄、启动后下泄规模与堆积范围越小；物源层过厚时可调小该值</td></tr>
                      </tbody>
                    </table>
                    <h2>四、运行流程与结果</h2>
                    <ol>
                      <li>按需填写数据坐标系与源区中心，并上传 zb / zl / hw（不上传则使用内置示例数据）；</li>
                      <li>填写模型参数后点击「运行」，后端按输出间距抽取逐时刻结果；</li>
                      <li>返回逐帧栅格与 bbox，前端<strong>固定渲染泥石流层厚度（zB − zL）</strong>并自动定位相机、支持时间轴播放。</li>
                    </ol>
                    <ul>
                      <li>若上传的 zb 与 zl 完全相同，泥石流层厚度为 0，此时只能看到水层，建议提供真实的灾前／灾后地形；</li>
                      <li>最大厚度较小时结果会接近「原地铺展」，运行前提示会给出本次物源最大厚度参考值；</li>
                      <li>输出场还包含水层厚度与流速，前端默认只渲染泥石流层厚度。</li>
                      <li>点击弹窗下方的<strong>「历史模拟」</strong>可查看并回放此前的运行结果（含基准、物源削薄与地形调控工况）。</li>
                    </ul>
                  </div>
                </el-dialog>
                <el-dialog
                  v-model="proHistoryVisible"
                  class="model-help-dialog"
                  width="1020px"
                  :close-on-click-modal="false"
                  top="80px"
                >
                  <template #title>
                    <div class="model-help-head">
                      <span class="model-help-title">历史模拟记录</span>
                      <span class="model-help-subtitle"
                        >选择任意一次运行结果，直接在三维场景中回放</span
                      >
                    </div>
                  </template>
                  <div class="help-body">
                    <p v-if="proHistoryLoading" style="margin: 6px 0">
                      历史记录读取中...
                    </p>
                    <p v-else-if="!proHistoryItems.length" style="margin: 6px 0">
                      暂无可回放的历史模拟记录。
                    </p>
                    <table v-else class="pro-history-table">
                      <thead>
                        <tr>
                          <th>运行时间</th>
                          <th>任务号</th>
                          <th>帧数</th>
                          <th>最大厚度 (m)</th>
                          <th>时长 (s)</th>
                          <th>间隔 (s)</th>
                          <th>工况</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in proHistoryItems" :key="item.jobId">
                          <td>{{ item.createdAtText }}</td>
                          <td class="history-jobid">{{ item.jobId }}</td>
                          <td>{{ item.frameCount }}</td>
                          <td>{{ Number(item.globalMax || 0).toFixed(1) }}</td>
                          <td>{{ item.tmax }}</td>
                          <td>{{ item.interval }}</td>
                          <td>{{ proHistoryCondition(item) }}</td>
                          <td>
                            <el-button
                              v-if="proHistoryPlayable(item)"
                              link
                              type="primary"
                              @click="loadProHistory(item)"
                              >加载</el-button
                            >
                            <span v-else style="opacity: 0.55">缺少坐标</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </el-dialog>
              </div>
            </template>
            <p class="quanyu-section-label">输入数据</p>
            <el-form label-position="top" class="quanyu-form">
              <el-form-item label="数据坐标系" label-position="top">
                <el-input v-model="proSourceCrs" placeholder="EPSG:32646" />
              </el-form-item>
              <el-form-item
                label="源区中心（经度 / 纬度）"
                label-position="top"
              >
                <div class="quanyu-row-2">
                  <el-input v-model="proAnchorLon" placeholder="经度 95.0020" />
                  <el-input v-model="proAnchorLat" placeholder="纬度 30.2354" />
                </div>
              </el-form-item>
              <el-form-item
                v-for="item in proFileItems"
                :key="item.key"
                :label="item.label"
                label-position="top"
                class="quanyu-file-field"
              >
                <el-input
                  v-model="proFileNames[item.key]"
                  :placeholder="item.placeholder"
                  readonly
                >
                  <template #append>
                    <el-upload
                      :ref="el => { if (el) proUploadRefs[item.key] = el }"
                      :auto-upload="false"
                      :show-file-list="false"
                      accept=".tif,.tiff,.asc,.txt"
                      @change="(f, fs) => handleProFile(item.key, f, fs)"
                    >
                      <el-button
                        class="quanyu-upload-trigger"
                        @click.stop="triggerProUpload(item.key)"
                      >
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>

            <p class="quanyu-section-label">模型参数</p>
            <el-form :model="form2" label-position="top" class="quanyu-form">
              <div class="quanyu-param-grid">
                <el-form-item label="基底摩擦角 (rad)">
                  <el-input v-model="form2.bed" placeholder="0.05" />
                </el-form-item>
                <el-form-item label="曼宁摩擦系数">
                  <el-input v-model="form2.nn" placeholder="0.0125" />
                </el-form-item>
                <el-form-item label="网格长度 (m)">
                  <el-input v-model="form2.dx" placeholder="20" />
                </el-form-item>
                <el-form-item label="网格宽度 (m)">
                  <el-input v-model="form2.dy" placeholder="20" />
                </el-form-item>
                <el-form-item label="滑坡密度 (kg/m³)">
                  <el-input v-model="form2.rous" placeholder="2700" />
                </el-form-item>
                <el-form-item label="河水密度 (kg/m³)">
                  <el-input v-model="form2.rouf" placeholder="1000" />
                </el-form-item>
                <el-form-item label="输出间距 (s)">
                  <el-input v-model="form2.interval" placeholder="10" />
                </el-form-item>
                <el-form-item label="计算时间 (s)">
                  <el-input v-model="form2.Tmax" placeholder="200" />
                </el-form-item>
                <el-form-item label="物源厚度比例 (%)">
                  <el-input v-model="form2.depthScale" placeholder="30" />
                </el-form-item>
              </div>

              <el-form-item class="quanyu-note">
                <span>
                  支持 .tif / .tiff / .txt / .asc（ESRI ASCII）；txt/asc
                  <b>自带 xllcorner/yllcorner 头部</b
                  >时按「数据坐标系」解释；无头部时必填「源区中心」经纬度（易贡示例
                  95.0020, 30.2354，坐标系 EPSG:32646）。zb / zl / hw
                  都不选时使用内置示例数据。渲染场固定为泥石流层厚度（zB-zL）。
                  「物源厚度比例」按比例削薄初始物源（zB−zL）：100 = 不削薄，默认 30
                  表示只保留 30% 厚度，数值越小启动越弱、下泄与堆积规模越小。
                </span>
              </el-form-item>

              <el-form-item class="quanyu-actions">
                <el-button
                  type="primary"
                  class="quanyu-submit"
                  @click="onSubmit2"
                  >运行</el-button
                >
                <el-button class="quanyu-cancel" @click="openProHistory"
                  >历史模拟</el-button
                >
                <el-button class="quanyu-cancel" @click="dialogVisible2 = false"
                  >取消</el-button
                >
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <!-- 冰岩崩动力学模型（测试）：暂时隐藏，保留代码备查 -->
        <div v-if="false" class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisible2Test = true"
            ><span>冰岩崩动力学模型（测试）</span></el-button
          >
          <el-dialog
            v-model="dialogVisible2Test"
            title="冰岩崩动力学模型（测试）"
            width="500"
            :close-on-click-modal="false"
            class="dialog_flood"
            @open="resetFloodTestInputs"
          >
            <template #header>
              <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
                <span style="color:#ffffff;font-size:24px">冰岩崩动力学模型（测试）</span>
              </div>
            </template>
            <div style="display:flex;align-items:center;gap:12px;margin:6px 0 10px 24px">
              <span style="color:#aaa;font-size:14px">渲染方案：</span>
              <el-radio-group v-model="renderMethod" size="small">
                <el-radio value="debrisflow">DebrisFlow</el-radio>
                <el-radio value="watersimulation">WaterSimulate</el-radio>
                <el-radio value="sph">SPH</el-radio>
              </el-radio-group>
            </div>
            <p id="name_par_gbm" style="margin-left:24px;margin-top:-17px;font-size:18px;color:#2763ca">模型参数</p>
            <el-form :model="form2Test" label-width="auto" style="max-width:600px" class="form_flood">
              <el-form-item label="基底摩擦" class="form1_flood">
                <el-input v-model="form2Test.bed" placeholder="20" />
              </el-form-item>
              <el-form-item label="曼宁摩擦系数" class="form1_flood">
                <el-input v-model="form2Test.nn" placeholder="20" />
              </el-form-item>
              <el-form-item label="网格长度" class="form1_flood">
                <el-input v-model="form2Test.dx" placeholder="20" />
              </el-form-item>
              <el-form-item label="网格宽度" class="form1_flood">
                <el-input v-model="form2Test.dy" placeholder="20" />
              </el-form-item>
              <el-form-item label="滑坡密度" class="form1_flood">
                <el-input v-model="form2Test.rous" placeholder="20" />
              </el-form-item>
              <el-form-item label="河水密度" class="form1_flood">
                <el-input v-model="form2Test.rouf" placeholder="20" />
              </el-form-item>
              <el-form-item label="输出间距" class="form1_flood">
                <el-input v-model="form2Test.interval" placeholder="20" />
              </el-form-item>
              <el-form-item label="计算时间" class="form1_flood">
                <el-input v-model="form2Test.Tmax" placeholder="20" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit2Test" class="b_ex_avaflow">运行</el-button>
                <el-button @click="dialogVisible2Test = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialog_avainit = true">
            <span>冰岩崩起动模型</span>
          </el-button>
          <el-dialog
            v-model="dialog_avainit"
            title="冰岩崩起动模型"
            width="640"
            :close-on-click-modal="false"
            class="dialog_avainit"
            @open="resetAvainitInputs"
          >
            <template #header>
              <div class="avainit-header">
                <div class="avainit-header-text">
                  <span class="avainit-title">冰岩崩起动模型</span>
                  <span class="avainit-subtitle">冰–岩崩启动参数配置</span>
                </div>
                <el-tooltip content="查看参数说明" placement="top">
                  <el-icon
                    class="help-icon"
                    @click="openHelpDialog_avainit = true"
                  >
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
              <el-dialog
                v-model="openHelpDialog_avainit"
                class="model-help-dialog"
                width="1200px"
                :close-on-click-modal="false"
                top="70px"
              >
                <template #title>
                  <div class="model-help-head">
                    <span class="model-help-title">冰岩崩起动模型</span>
                    <span class="model-help-subtitle">参数说明</span>
                  </div>
                </template>
                <div id="avainit-model-info" class="help-body">
                  <h2>一、功能目的</h2>
                  <p>针对冰川区冰—岩组合边坡，按顺层滑移、反倾、楔形三类破坏模式分别计算冰岩崩的起动条件与启动规模，定量给出源区稳定性判断与崩落量级，为下游泥石流物源与灾害链演进提供启动条件。</p>
                  <h2>二、通用参数</h2>
                  <table>
                    <tbody>
                      <tr><td>参数</td><td>单位 / 取值</td><td>默认值</td><td>说明</td></tr>
                      <tr><td>破坏模式</td><td>顺层 / 反倾 / 楔形</td><td>顺层</td><td>选择后下方参数表单随之切换，各模式的参数组合不同</td></tr>
                      <tr><td>源区定位 · 经度</td><td>十进制度（WGS84）</td><td>95.0020</td><td>冰岩崩源区在地图上的经度，默认取易贡扎木弄沟案例</td></tr>
                      <tr><td>源区定位 · 纬度</td><td>十进制度（WGS84）</td><td>30.2354</td><td>冰岩崩源区在地图上的纬度</td></tr>
                    </tbody>
                  </table>
                  <h2>三、分模式参数</h2>
                  <h3>（一）顺层滑移</h3>
                  <table>
                    <tbody>
                      <tr><td>参数</td><td>单位</td><td>默认值</td><td>说明</td></tr>
                      <tr><td>融冰时长</td><td>h</td><td>240</td><td>融冰期持续时间，决定入渗量与下滑力的累积</td></tr>
                      <tr><td>边坡角度</td><td>°</td><td>60</td><td>坡面倾角，控制自重沿滑面的分量</td></tr>
                      <tr><td>滑面角</td><td>°</td><td>15</td><td>潜在滑面与水平面的夹角</td></tr>
                      <tr><td>冰层厚度</td><td>m</td><td>4</td><td>冰体平均厚度，参与自重计算</td></tr>
                      <tr><td>裂隙高度</td><td>m</td><td>10</td><td>后缘张拉裂隙的充水高度，决定静水压力</td></tr>
                      <tr><td>滑面长度</td><td>m</td><td>20</td><td>滑面沿程长度，影响阻滑力</td></tr>
                      <tr><td>内聚力</td><td>kPa</td><td>15</td><td>滑面黏聚力，控制抗滑能力</td></tr>
                      <tr><td>内摩擦角</td><td>°</td><td>20</td><td>滑面摩擦角</td></tr>
                      <tr><td>岩体重度</td><td>kN/m³</td><td>20</td><td>冰—岩体平均重度</td></tr>
                      <tr><td>渗透系数</td><td>m/s</td><td>0.0001</td><td>控制融水入渗与孔隙水压增长</td></tr>
                    </tbody>
                  </table>
                  <h3>（二）反倾</h3>
                  <table>
                    <tbody>
                      <tr><td>参数</td><td>单位</td><td>默认值</td><td>说明</td></tr>
                      <tr><td>融冰时长</td><td>h</td><td>240</td><td>融水补给时长</td></tr>
                      <tr><td>边坡角度</td><td>°</td><td>30</td><td>坡面倾角</td></tr>
                      <tr><td>反倾角</td><td>°</td><td>70</td><td>岩层倾向与坡向相反时的层面倾角，反倾倾倒的主控量</td></tr>
                      <tr><td>冰层厚度</td><td>m</td><td>5</td><td>冰体平均厚度</td></tr>
                      <tr><td>边坡高度</td><td>m</td><td>10</td><td>坡体临空高度</td></tr>
                      <tr><td>层面间隔</td><td>m</td><td>20</td><td>结构面间距，反映岩体完整性</td></tr>
                      <tr><td>内聚力</td><td>kPa</td><td>15</td><td>结构面黏聚力</td></tr>
                      <tr><td>内摩擦角</td><td>°</td><td>20</td><td>结构面摩擦角</td></tr>
                      <tr><td>岩体重度</td><td>kN/m³</td><td>20</td><td>冰—岩体平均重度</td></tr>
                      <tr><td>渗透系数</td><td>m/s</td><td>0.0001</td><td>融水入渗参数</td></tr>
                    </tbody>
                  </table>
                  <h3>（三）楔形</h3>
                  <table>
                    <tbody>
                      <tr><td>参数</td><td>单位</td><td>默认值</td><td>说明</td></tr>
                      <tr><td>融冰时长</td><td>h</td><td>240</td><td>融水补给时长</td></tr>
                      <tr><td>边坡角度</td><td>°</td><td>55</td><td>坡面倾角</td></tr>
                      <tr><td>法向量</td><td>—</td><td>1,1,1</td><td>两组结构面交棱方向的法向量，决定楔体几何（逗号分隔）</td></tr>
                      <tr><td>冰层厚度</td><td>m</td><td>5</td><td>冰体平均厚度</td></tr>
                      <tr><td>面积</td><td>m²</td><td>200</td><td>楔体潜在滑面面积</td></tr>
                      <tr><td>边坡高度</td><td>m</td><td>10</td><td>坡体临空高度</td></tr>
                      <tr><td>裂隙 / 中线</td><td>m</td><td>0.5</td><td>后缘裂隙张开度或中线长度</td></tr>
                      <tr><td>内聚力</td><td>kPa</td><td>15</td><td>结构面黏聚力</td></tr>
                      <tr><td>内摩擦角</td><td>°</td><td>20</td><td>结构面摩擦角</td></tr>
                      <tr><td>岩体重度</td><td>kN/m³</td><td>20</td><td>冰—岩体平均重度</td></tr>
                      <tr><td>渗透系数</td><td>m/s</td><td>0.0001</td><td>融水入渗参数</td></tr>
                    </tbody>
                  </table>
                  <h2>四、运行与结果</h2>
                  <ul>
                    <li>本模型无需上传文件，选择破坏模式、填写参数后点击「运行」即可；</li>
                    <li>后端按所选破坏模式执行对应的稳定性判别与启动规模计算；</li>
                    <li>返回源区位置与启动规模，前端自动定位到源区并叠加显示；</li>
                    <li>上表默认值取自易贡扎木弄沟案例，可直接用于联调，也可按实际冰岩体条件调整。</li>
                  </ul>
                </div>
              </el-dialog>
            <div class="avainit-mode-row">
              <span class="avainit-field-caption">破坏模式</span>
              <el-radio-group v-model="radio_avainit" size="large">
                <el-radio :value="1">顺层</el-radio>
                <el-radio :value="2">反倾</el-radio>
                <el-radio :value="3">楔形</el-radio>
              </el-radio-group>
            </div>
            <div class="avainit-location">
              <div class="avainit-location-head">
                <span class="avainit-field-caption">源区定位</span>
                <span class="avainit-location-hint">WGS84 · 十进制度</span>
              </div>
              <div class="avainit-location-grid">
                <div class="avainit-location-item">
                  <span>经度</span>
                  <el-input v-model="form_avainit_location.longitude" placeholder="例如 95.0020" />
                </div>
                <div class="avainit-location-item">
                  <span>纬度</span>
                  <el-input v-model="form_avainit_location.latitude" placeholder="例如 30.2354" />
                </div>
              </div>
            </div>
            <el-form
              :model="form_avainit"
              label-position="top"
              class="form_flood form_avainit"
              v-if="radio_avainit == 1"
            >
              <el-form-item label="融冰时长" class="form1_flood">
                <el-input
                  v-model="form_avainit.melt_duration"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="边坡角度" class="form1_flood">
                <el-input v-model="form_avainit.slope_angle" placeholder="20" />
              </el-form-item>
              <el-form-item label="滑面角" class="form1_flood">
                <el-input v-model="form_avainit.slide_angle" placeholder="20" />
              </el-form-item>
              <el-form-item label="冰层厚度" class="form1_flood">
                <el-input
                  v-model="form_avainit.ice_thickness"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="裂隙高度" class="form1_flood">
                <el-input
                  v-model="form_avainit.fissure_height"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="滑面长度" class="form1_flood">
                <el-input
                  v-model="form_avainit.slide_length"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="内聚力" class="form1_flood">
                <el-input v-model="form_avainit.cohesion" placeholder="20" />
              </el-form-item>
              <el-form-item label="内摩擦角" class="form1_flood">
                <el-input
                  v-model="form_avainit.friction_angle"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="岩体重度" class="form1_flood">
                <el-input
                  v-model="form_avainit.rock_density"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="渗透系数" class="form1_flood">
                <el-input
                  v-model="form_avainit.permeability"
                  placeholder="20"
                />
              </el-form-item>

              <div class="avainit-actions">
                <el-button class="avainit-cancel" @click="dialog_avainit = false">取消</el-button>
                <el-button
                  type="primary"
                  class="avainit-submit"
                  @click="sumbit_avainit"
                  >运行</el-button
                >
              </div>
            </el-form>
            <el-form
              :model="form_bedding_inverted"
              label-position="top"
              class="form_flood form_avainit"
              v-if="radio_avainit == 2"
            >
              <el-form-item label="融冰时长" class="form1_flood">
                <el-input
                  v-model="form_bedding_inverted.melt_duration"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="边坡角度" class="form1_flood">
                <el-input
                  v-model="form_bedding_inverted.slope_angle"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="反倾角" class="form1_flood">
                <el-input
                  v-model="form_bedding_inverted.inverse_angle"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="冰层厚度" class="form1_flood">
                <el-input
                  v-model="form_bedding_inverted.ice_thickness"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="边坡高度" class="form1_flood">
                <el-input
                  v-model="form_bedding_inverted.slope_height"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="层面间隔" class="form1_flood">
                <el-input
                  v-model="form_bedding_inverted.bedding_space"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="内聚力" class="form1_flood">
                <el-input
                  v-model="form_bedding_inverted.cohesion"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="内摩擦角" class="form1_flood">
                <el-input
                  v-model="form_bedding_inverted.friction_angle"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="岩体重度" class="form1_flood">
                <el-input
                  v-model="form_bedding_inverted.rock_density"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="渗透系数" class="form1_flood">
                <el-input
                  v-model="form_bedding_inverted.permeability"
                  placeholder="20"
                />
              </el-form-item>

              <div class="avainit-actions">
                <el-button class="avainit-cancel" @click="dialog_avainit = false">取消</el-button>
                <el-button
                  type="primary"
                  class="avainit-submit"
                  @click="sumbit_inverse"
                  >运行</el-button
                >
              </div>
            </el-form>
            <el-form
              :model="form_bedding_wedget"
              label-position="top"
              class="form_flood form_avainit"
              v-if="radio_avainit == 3"
            >
              <el-form-item label="融冰时长" class="form1_flood">
                <el-input
                  v-model="form_bedding_wedget.melt_duration"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="边坡角度" class="form1_flood">
                <el-input
                  v-model="form_bedding_wedget.slope_angle"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="法向量" class="form1_flood">
                <el-input
                  v-model="form_bedding_wedget.normal_vector"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="冰层厚度" class="form1_flood">
                <el-input
                  v-model="form_bedding_wedget.ice_thickness"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="面积" class="form1_flood">
                <el-input
                  v-model="form_bedding_wedget.square"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="边坡高度" class="form1_flood">
                <el-input
                  v-model="form_bedding_wedget.slope_height"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="裂隙/中线" class="form1_flood">
                <el-input
                  v-model="form_bedding_wedget.fracture"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="内聚力" class="form1_flood">
                <el-input
                  v-model="form_bedding_wedget.cohesion"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="内摩擦角" class="form1_flood">
                <el-input
                  v-model="form_bedding_wedget.friction_angle"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="岩体重度" class="form1_flood">
                <el-input
                  v-model="form_bedding_wedget.rock_density"
                  placeholder="20"
                />
              </el-form-item>
              <el-form-item label="渗透系数" class="form1_flood">
                <el-input
                  v-model="form_bedding_wedget.permeability"
                  placeholder="20"
                />
              </el-form-item>

              <div class="avainit-actions">
                <el-button class="avainit-cancel" @click="dialog_avainit = false">取消</el-button>
                <el-button type="primary" class="avainit-submit" @click="sumbit_wedget"
                  >运行</el-button
                >
              </div>
            </el-form>
          </el-dialog>
        </div>
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisibleSDP = true"
            ><span>泥石流启动物源计算模型</span></el-button
          >
          <el-dialog
            v-model="dialogVisibleSDP"
            title="泥石流启动物源计算模型"
            width="520"
            :close-on-click-modal="false"
            class="dialog_quanyu dialog_fullRisk"
            @open="resetSdpInputs"
          >
            <template #header>
              <div class="model-dialog-header sdp-header">
                <div class="model-dialog-heading">
                  <span class="model-dialog-title">泥石流启动物源计算模型</span>
                  <span class="model-dialog-subtitle">启动物源参数配置</span>
                </div>
                <el-tooltip content="查看参数说明" placement="top">
                  <el-icon class="help-icon" @click="openHelpDialog_sdp = true">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-dialog
              v-model="openHelpDialog_sdp"
              class="model-help-dialog"
              width="1200px"
              :close-on-click-modal="false"
              top="70px"
            >
              <template #title>
                <div class="model-help-head">
                  <span class="model-help-title">泥石流启动物源计算模型</span>
                  <span class="model-help-subtitle">参数说明</span>
                </div>
              </template>
              <div id="sdp-model-info" class="help-body">
                <h2>一、功能目的</h2>
                <p>结合降雨、气温栅格序列与冰川区体积含冰量，计算流域尺度泥石流启动的物源量级与空间分布，识别物源启动区与启动深度分布，为后续启动—输移—堆积的链式动力学模拟提供物源输入。</p>
                <h2>二、界面输入参数</h2>
                <table>
                  <tbody>
                    <tr><td>参数</td><td>格式 / 取值</td><td>默认值</td><td>说明</td></tr>
                    <tr><td>降雨栅格路径</td><td>.tif / .tiff，可多选</td><td>不选</td><td>多时相降雨量数据，用于入渗与产流计算；多选时按同一时间序列顺序排列</td></tr>
                    <tr><td>温度栅格路径</td><td>.tif / .tiff，可多选</td><td>不选</td><td>与降雨数据时间序列对应的气温数据，用于融冰量计算</td></tr>
                    <tr><td>体积含冰量</td><td>0–1（无量纲）</td><td>0.2</td><td>冰川区冰体体积占比；含冰量越高，同等升温条件下的产流与启动物源量越大</td></tr>
                  </tbody>
                </table>
                <p>说明：当前版本前端选择的降雨／温度栅格路径仅作记录，计算由后端按默认数据目录读取降雨与温度序列；<strong>实际生效并随请求提交的参数是体积含冰量</strong>。</p>
                <h2>三、运行流程</h2>
                <ol>
                  <li>填写体积含冰量（如需指定降雨／温度序列目录，请在部署端配置后端默认路径）；</li>
                  <li>点击「运行」，后端逐步计算各时段的物源启动量，输出分时段成果栅格序列；</li>
                  <li>取最后时间节点的物源启动深度结果，转换为 EPSG:4326 地理要素数据后返回前端渲染并自动定位。</li>
                </ol>
                <h2>四、结果与提示</h2>
                <ul>
                  <li>结果为最后一帧的物源启动深度分布，渲染场不提供切换；</li>
                  <li>结果以 GeoJSON 加载，可在资源目录中开关图层、调节透明度；</li>
                  <li>计算耗时与降雨／温度序列长度有关，运行期间请勿关闭页面；</li>
                  <li>若报错多为后端运行环境或结果目录缺失，可从提示消息中查看后端返回的详细原因。</li>
                </ul>
              </div>
            </el-dialog>
            <p class="quanyu-section-label">模型参数</p>
            <el-form :model="formSDP" label-position="top" class="quanyu-form">
              <el-form-item
                label="降雨栅格路径"
                label-position="top"
                class="quanyu-file-field"
              >
                <el-input
                  v-model="fileNameRain"
                  placeholder="选择降雨 tif 文件（可多选）"
                  readonly
                >
                  <template #append>
                    <el-upload
                      ref="uploadRainRef"
                      :auto-upload="false"
                      :show-file-list="false"
                      :multiple="true"
                      accept=".tif,.tiff"
                      @change="handleFileRain"
                    >
                      <el-button class="quanyu-upload-trigger" @click.stop="triggerUploadRain">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="温度栅格路径"
                label-position="top"
                class="quanyu-file-field"
              >
                <el-input
                  v-model="fileNameTemp"
                  placeholder="选择温度 tif 文件（可多选）"
                  readonly
                >
                  <template #append>
                    <el-upload
                      ref="uploadTempRef"
                      :auto-upload="false"
                      :show-file-list="false"
                      :multiple="true"
                      accept=".tif,.tiff"
                      @change="handleFileTemp"
                    >
                      <el-button class="quanyu-upload-trigger" @click.stop="triggerUploadTemp">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              <!-- 输出目录 暂时注释
              <el-form-item label="输出目录" label-position="top" class="quanyu-file-field">
                <el-input v-model="fileNameOutput" placeholder="选择输出文件（可多选）" readonly>
                  <template #append>
                    <el-upload ref="uploadOutputRef" :auto-upload="false" :show-file-list="false" :multiple="true" @change="handleFileOutput">
                      <el-button class="quanyu-upload-trigger" @click.stop="triggerUploadOutput">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              -->
              <el-form-item label="体积含冰量" label-position="top">
                <el-input
                  v-model="formSDP.ice_content"
                  type="number"
                  step="0.01"
                  placeholder="0.2"
                />
              </el-form-item>
              <el-form-item class="quanyu-actions">
                <el-button
                  class="quanyu-submit"
                  type="primary"
                  @click="submitSDP"
                  :loading="sdpLoading"
                >
                  {{ sdpLoading ? '计算中...' : '运行' }}
                </el-button>
                <el-button class="quanyu-cancel" @click="dialogVisibleSDP = false"
                  >取消</el-button
                >
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </div>
      <!-- 风险评估模块 -->
      <div class="theme">
        <div class="title">风险评估</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisibleQuanYu = true"
            ><span>全域风险脆弱性分析</span></el-button
          >
          <el-dialog
            v-model="dialogVisibleQuanYu"
            title="全域风险脆弱性分析"
            width="560"
            :close-on-click-modal="false"
            class="dialog_quanyu dialog_fullRisk"
            @open="resetQuanYuInputs"
          >
            <template #header>
              <div class="model-dialog-header quanyu-header">
                <div class="model-dialog-heading">
                  <span class="model-dialog-title">全域风险脆弱性分析</span>
                  <span class="model-dialog-subtitle">全域风险评估参数配置</span>
                </div>
                <el-tooltip content="查看参数说明" placement="top">
                  <el-icon class="help-icon" @click="openHelpDialog_quanyu = true">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            <el-dialog
              v-model="openHelpDialog_quanyu"
              class="model-help-dialog"
              width="1200px"
              :close-on-click-modal="false"
              top="70px"
            >
              <template #title>
                <div class="model-help-head">
                  <span class="model-help-title">全域风险脆弱性分析</span>
                  <span class="model-help-subtitle">参数说明</span>
                </div>
              </template>
              <div id="quanyu-model-info" class="help-body">
                <h2>一、功能目的</h2>
                <p>以 12 项孕灾环境因子栅格为输入，统一重采样与归一化后按权重叠加，输出全域尺度的风险脆弱性分级结果，用于识别高风险区并支撑防治规划与重点区筛选。</p>
                <h2>二、界面输入参数（栅格 .tif）</h2>
                <table>
                  <tbody>
                    <tr><td>因子</td><td>默认文件</td><td>说明</td></tr>
                    <tr><td>平均高程</td><td>elevation.tif</td><td>地形基准面，间接反映气温与冰川发育条件</td></tr>
                    <tr><td>地形起伏度</td><td>relief.tif</td><td>高差变化，控制势能与物质搬运能力</td></tr>
                    <tr><td>流域面积</td><td>watershed.tif</td><td>汇水规模，影响径流与物源汇集</td></tr>
                    <tr><td>地层岩性</td><td>lithology.tif</td><td>岩性分类栅格，反映抗侵蚀能力</td></tr>
                    <tr><td>断层密度</td><td>fault_density.tif</td><td>构造活动强度与岩体破碎程度</td></tr>
                    <tr><td>土壤类型</td><td>soil_type.tif</td><td>土壤可蚀性差异</td></tr>
                    <tr><td>距水系距离</td><td>water_dist.tif</td><td>距水系越近，承灾暴露度越高</td></tr>
                    <tr><td>河网密度</td><td>drainage_density.tif</td><td>汇流通道发育程度</td></tr>
                    <tr><td>降雨数据</td><td>rainfall.tif</td><td>降水驱动因子</td></tr>
                    <tr><td>土地利用</td><td>land_use.tif</td><td>地表覆被与人类活动影响</td></tr>
                    <tr><td>距公路距离</td><td>road_dist.tif</td><td>道路承灾体可达性与暴露度</td></tr>
                    <tr><td>NDVI</td><td>ndvi.tif</td><td>植被覆盖度，影响水土保持能力</td></tr>
                  </tbody>
                </table>
                <p>说明：12 项因子需全部选择，缺项在提交时会逐项提示因子名称；建议各因子使用同一空间范围与分辨率，坐标系不一致时由后端统一重采样。</p>
                <h2>三、运行流程</h2>
                <ol>
                  <li>逐项选择 12 个因子栅格（点击每行的导入按钮从本地选取）；</li>
                  <li>点击「运行」，后端完成重采样、归一化与加权叠加，约需 10 秒；</li>
                  <li>计算完成后自动加载脆弱性分级图层并定位到成果范围。</li>
                </ol>
                <h2>四、结果与提示</h2>
                <ul>
                  <li>结果为全域风险脆弱性分级专题图层，可在资源目录中开关与调节透明度；</li>
                  <li>因子权重与分级阈值由后端模型配置，界面不暴露；</li>
                  <li>如个别因子缺失，建议先用同范围的近似数据替代，以保证叠加结果完整。</li>
                </ul>
              </div>
            </el-dialog>
            <p id="name_par_gbm" class="quanyu-section-label">栅格数据</p>
            <el-form label-position="top" class="form_gbm quanyu-form">
              <el-form-item v-for="item in quanyuFileItems" :key="item.key" :label="item.label" label-position="top" class="quanyu-file-field">
                <el-input v-model="quanYuFileNames[item.key]" :placeholder="item.placeholder" readonly>
                  <template #append>
                    <el-upload
                      :ref="el => { if (el) uploadRefsQuanYu[item.key] = el }"
                      action="http://localhost:3000/node/upload_tif"
                      name="file"
                      :auto-upload="false"
                      :multiple="false"
                      :show-file-list="false"
                      accept=".tif,.tiff"
                      @change="(f,fs) => handleQuanYuFileChange(item.key, f, fs)"
                    >
                      <el-button class="quanyu-upload-trigger" @click.stop="triggerQuanYuUpload(item.key)">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item class="quanyu-actions">
                <el-button class="quanyu-submit" type="primary" @click="submitQuanYu" :loading="quanYuLoading">
                  {{ quanYuLoading ? '计算中 (10s)...' : '提交分析' }}
                </el-button>
                <el-button class="quanyu-cancel" @click="dialogVisibleQuanYu = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <!-- 静态数据卡片：人口分布（与资源目录勾选同源） -->
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-popover width="290" trigger="click" placement="right-start" popper-class="data-layer-popover">
            <template #reference>
              <el-button :plain="true"
                ><span>人口分布</span>
                <span v-if="dataLayerCount([732])" class="data-layer-count"
                  >{{ dataLayerCount([732]) }}/1</span
                ></el-button
              >
            </template>
            <div class="data-layer-panel">
              <div class="data-layer-panel-head">
                <span>人口分布</span>
                <span class="data-layer-panel-actions">
                  <a href="#" @click.prevent="selectAllDataLayers([732], true)">全选</a>
                  <a href="#" @click.prevent="selectAllDataLayers([732], false)">清空</a>
                </span>
              </div>
              <el-checkbox
                v-for="item in dataLayerGroups.population"
                :key="item.id"
                :model-value="isDataLayerChecked(item.id)"
                @change="v => toggleDataLayerItem(item.id, v)"
                >{{ item.label }}</el-checkbox
              >
            </div>
          </el-popover>
        </div>
        <!-- 静态数据卡片：脆弱性结果（与资源目录勾选同源） -->
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-popover width="290" trigger="click" placement="right-start" popper-class="data-layer-popover">
            <template #reference>
              <el-button :plain="true"
                ><span>脆弱性结果</span>
                <span v-if="dataLayerCount([711, 712, 713])" class="data-layer-count"
                  >{{ dataLayerCount([711, 712, 713]) }}/3</span
                ></el-button
              >
            </template>
            <div class="data-layer-panel">
              <div class="data-layer-panel-head">
                <span>脆弱性结果</span>
                <span class="data-layer-panel-actions">
                  <a href="#" @click.prevent="selectAllDataLayers([711, 712, 713], true)">全选</a>
                  <a href="#" @click.prevent="selectAllDataLayers([711, 712, 713], false)">清空</a>
                </span>
              </div>
              <p class="data-layer-panel-hint">
                勾选即在地图上加载，与「资源目录」勾选状态同步
              </p>
              <el-checkbox
                v-for="item in dataLayerGroups.vulnerability"
                :key="item.id"
                :model-value="isDataLayerChecked(item.id)"
                @change="v => toggleDataLayerItem(item.id, v)"
                >{{ item.label }}</el-checkbox
              >
            </div>
          </el-popover>
        </div>
        <!-- 静态数据卡片：危险性评估结果（与资源目录勾选同源） -->
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-popover width="290" trigger="click" placement="right-start" popper-class="data-layer-popover">
            <template #reference>
              <el-button :plain="true"
                ><span>危险性评估结果</span>
                <span v-if="dataLayerCount([721, 722, 723, 781, 782])" class="data-layer-count"
                  >{{ dataLayerCount([721, 722, 723, 781, 782]) }}/5</span
                ></el-button
              >
            </template>
            <div class="data-layer-panel">
              <div class="data-layer-panel-head">
                <span>危险性评估结果</span>
                <span class="data-layer-panel-actions">
                  <a href="#" @click.prevent="selectAllDataLayers([721, 722, 723, 781, 782], true)">全选</a>
                  <a href="#" @click.prevent="selectAllDataLayers([721, 722, 723, 781, 782], false)">清空</a>
                </span>
              </div>
              <p class="data-layer-panel-hint">
                勾选即在地图上加载，与「资源目录」勾选状态同步
              </p>
              <el-checkbox
                v-for="item in dataLayerGroups.danger"
                :key="item.id"
                :model-value="isDataLayerChecked(item.id)"
                @change="v => toggleDataLayerItem(item.id, v)"
                >{{ item.label }}</el-checkbox
              >
            </div>
          </el-popover>
        </div>
        <!-- 静态数据卡片：风险评估结果（与资源目录勾选同源） -->
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-popover width="290" trigger="click" placement="right-start" popper-class="data-layer-popover">
            <template #reference>
              <el-button :plain="true"
                ><span>风险评估结果</span>
                <span v-if="dataLayerCount([741, 742, 743, 744, 745, 751, 752, 753, 754, 761, 762, 763, 77])" class="data-layer-count"
                  >{{ dataLayerCount([741, 742, 743, 744, 745, 751, 752, 753, 754, 761, 762, 763, 77]) }}/13</span
                ></el-button
              >
            </template>
            <div class="data-layer-panel">
              <div class="data-layer-panel-head">
                <span>风险评估结果</span>
                <span class="data-layer-panel-actions">
                  <a href="#" @click.prevent="selectAllDataLayers([741, 742, 743, 744, 745, 751, 752, 753, 754, 761, 762, 763, 77], true)">全选</a>
                  <a href="#" @click.prevent="selectAllDataLayers([741, 742, 743, 744, 745, 751, 752, 753, 754, 761, 762, 763, 77], false)">清空</a>
                </span>
              </div>
              <p class="data-layer-panel-hint">
                勾选即在地图上加载，与「资源目录」勾选状态同步
              </p>
              <el-checkbox
                v-for="item in dataLayerGroups.risk"
                :key="item.id"
                :model-value="isDataLayerChecked(item.id)"
                @change="v => toggleDataLayerItem(item.id, v)"
                >{{ item.label }}</el-checkbox
              >
            </div>
          </el-popover>
        </div>
      </div>
      <!-- 监测预警模块 -->
      <div class="theme">
        <div class="title">监测预警</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box p_bottom box-used">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialog_inverseV = true">
            <span>基于位移监测滑坡预警</span></el-button
          >
          <el-dialog
            v-model="dialog_inverseV"
            title="滑坡预警（测试版）"
            width="500"
            :close-on-click-modal="false"
            class="dialog_inverseV"
            @open="resetInverseVInputs"
          >
            <template #header>
              <div class="model-dialog-header inverse-header">
                <div class="model-dialog-heading">
                  <span class="model-dialog-title">基于位移监测滑坡预警</span>
                  <span class="model-dialog-subtitle">位移监测参数配置</span>
                </div>
                <div class="help-anchor">
                  <el-tooltip content="查看参数说明" placement="top">
                    <el-icon
                      class="help-icon"
                      @click="openHelpDialog_inverseV = true"
                    >
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <el-dialog
                  v-model="openHelpDialog_inverseV"
                  class="model-help-dialog"
                  width="1200px"
                  :close-on-click-modal="false"
                  top="70px"
                  >
                  <template #title>
                    <div class="model-help-head">
                      <span class="model-help-title">基于位移监测滑坡预警</span>
                      <span class="model-help-subtitle">参数说明</span>
                    </div>
                  </template>
                  <div
                    id="landslide-warning-model-info"
                    class="help-body"
                    >
                    <h2>一、功能目的</h2>
                    <p>基于位移监测时序数据，采用速度倒数法预测滑坡失稳时间：自动识别加速变形起点（OOA），将速度倒数外推至零以估计破坏时刻，并按剩余时间分级给出预警。</p>
                    <h2>二、界面输入参数</h2>
                    <table>
                      <tbody>
                        <tr><td>参数</td><td>格式 / 取值</td><td>默认值</td><td>说明</td></tr>
                        <tr><td>地点</td><td>文本</td><td>空（占位「林芝」）</td><td>监测点名称，随结果写入数据库，用于地图点位与查询</td></tr>
                        <tr><td>位移文件</td><td>Excel（.xlsx）</td><td>必填</td><td>监测时序数据，需包含两列：<strong>timestamp</strong>（时间，形如 2022-01-01 00:00）与 <strong>displ</strong>（位移数值）；结构相同的 .csv 也可被识别</td></tr>
                        <tr><td>经度</td><td>十进制度（WGS84）</td><td>空</td><td>预警点在地图上的经度，缺失将无法定位结果点</td></tr>
                        <tr><td>纬度</td><td>十进制度（WGS84）</td><td>空</td><td>预警点在地图上的纬度</td></tr>
                      </tbody>
                    </table>
                    <p>说明：上传后后端按小时聚合（同一小时取最后一条记录）并排序，再由后端完成速度／逆速度计算、加速变形起点识别与破坏时间预测。</p>
                    <h2>三、运行流程</h2>
                    <ol>
                      <li>选择位移文件，填写地点与经度、纬度；</li>
                      <li>点击「运行」，后端先上传文件、再执行速度倒数法计算，返回预测失稳时间 rt（小时）、预测时间与状态；</li>
                      <li>前端在经纬度位置落预警图标并自动飞行定位。</li>
                    </ol>
                    <h2>四、结果与提示</h2>
                    <ul>
                      <li>预警分级：剩余时间 &lt; 24 h 红色、24–48 h 橙色、48–72 h 黄色、72–96 h 蓝色，超过 96 h 提示「预计失稳时间超过 96 小时」；</li>
                      <li>未检测到加速变形（no_ooa）时提示「暂无法计算失稳时间」，此时应补充更长的监测序列；</li>
                      <li>点击地图上的预警点可查看该监测点的位移数据。</li>
                    </ul>
                    <h2>五、运行结果示例</h2>
                    <img
                  :src="ASSET_BASE + 'img/demo-displacement.png'"
                  alt="基于位移监测滑坡预警运行结果示例"
                  title="点击查看大图"
                  @click="previewSrc = $event.target.src"
                />
                  </div>
                </el-dialog>
              </div>
            </template>
            <el-form
              :model="form_inverseV"
              label-position="top"
              class="form_inverseV inverse-form"
            >
              <el-form-item label="地点" class="inverse-field">
                <el-input v-model="form_inverseV.name" placeholder="林芝" />
              </el-form-item>

              <el-form-item label="位移文件" class="inverse-file-field">
                <el-input
                  v-model="fileName_inverseV"
                  placeholder="上传文件"
                  readonly
                >
                  <template #append>
                    <el-upload
                      ref="uploadRef"
                      action="/node/displ"
                      name="file"
                      :auto-upload="false"
                      :show-file-list="false"
                      @change="handleFileChange"
                    >
                      <el-button
                        class="inverse-upload-trigger"
                        @click.stop="triggerUpload"
                      >
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="经度" class="inverse-field">
                <el-input
                  v-model="form_inverseV.longitude"
                  placeholder="十进制度"
                />
              </el-form-item>
              <el-form-item label="纬度" class="inverse-field">
                <el-input
                  v-model="form_inverseV.latitude"
                  placeholder="十进制度"
                />
              </el-form-item>
            </el-form>
            <div class="inverse-actions">
              <el-button
                class="inverse-submit"
                type="primary"
                @click="(submit_inverseV(), (dialog_inverseV = false))"
                >运行</el-button
              >
              <el-button
                class="inverse-cancel"
                @click="dialog_inverseV = false"
                >取消</el-button
              >
            </div>
          </el-dialog>
        </div>
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisibleSeismic = true">
            <span>冰川泥石流监测预警模型</span>
          </el-button>
          <el-dialog
            v-model="dialogVisibleSeismic"
            title="冰川泥石流监测预警模型"
            :close-on-click-modal="false"
            class="dialog_seismic"
            @open="resetSeismicInputs"
          >
            <template #header>
              <div class="model-dialog-header seismic-header">
                <div class="model-dialog-heading">
                  <span class="model-dialog-title">冰川泥石流监测预警模型</span>
                  <span class="model-dialog-subtitle">监测预警参数配置</span>
                </div>
                <div class="help-anchor">
                  <el-tooltip content="查看参数说明" placement="top">
                    <el-icon
                      class="help-icon"
                      @click="openHelpDialog_seismic = true"
                    >
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <el-dialog
                  v-model="openHelpDialog_seismic"
                  class="model-help-dialog"
                  width="1200px"
                  :close-on-click-modal="false"
                  top="70px"
                  >
                  <template #title>
                    <div class="model-help-head">
                      <span class="model-help-title">冰川泥石流监测预警模型</span>
                      <span class="model-help-subtitle">参数说明</span>
                    </div>
                  </template>
                  <div
                    id="debris-flow-signal-detection-info"
                    class="help-body"
                    >
                    <h2>一、功能目的</h2>
                    <p>处理地震动传感器采集的振动／地声时序信号，自动识别泥石流事件并在地图上给出事件位置展示，支持机器学习与深度学习两种识别内核。</p>
                    <h2>二、模型类型</h2>
                    <table>
                      <tbody>
                        <tr><td>模型类型</td><td>输入文件</td><td>说明</td></tr>
                        <tr><td>机器学习</td><td>Excel（.xlsx）</td><td>基于短长时窗能量比识别事件，并通过分段趋势做二次校验以排除误报</td></tr>
                        <tr><td>深度学习</td><td>CSV（.csv）</td><td>基于深度学习模型推理，适合按列组织的电压／振动信号</td></tr>
                      </tbody>
                    </table>
                    <h2>三、机器学习模式参数</h2>
                    <table>
                      <tbody>
                        <tr><td>参数</td><td>单位 / 格式</td><td>默认值</td><td>说明</td></tr>
                        <tr><td>Excel文件</td><td>.xlsx</td><td>必填</td><td>传感器波形数据，默认读取第 1 列作为信号数值</td></tr>
                        <tr><td>经度</td><td>十进制度（WGS84）</td><td>97.5</td><td>事件在地图上的经度，前端按输入值定位</td></tr>
                        <tr><td>纬度</td><td>十进制度（WGS84）</td><td>31.0</td><td>事件在地图上的纬度</td></tr>
                        <tr><td>阈值</td><td>—</td><td>2.5</td><td>能量比触发阈值（短时窗能量 / 长时窗能量），超过后进入二次校验</td></tr>
                        <tr><td>短时窗</td><td>s</td><td>30</td><td>计算瞬时能量变化，反映对信号的灵敏程度</td></tr>
                        <tr><td>长时窗</td><td>s</td><td>240</td><td>计算背景噪声水平，反映稳定基线</td></tr>
                        <tr><td>分段时长</td><td>s</td><td>10</td><td>触发后把后续时间窗切分的片段长度</td></tr>
                        <tr><td>总时长</td><td>s</td><td>60</td><td>触发后向后检查的总时间长度</td></tr>
                        <tr><td>采样率</td><td>Hz</td><td>100</td><td>需与硬件采集参数一致，否则时间窗换算不正确</td></tr>
                      </tbody>
                    </table>
                    <h2>四、深度学习模式参数</h2>
                    <table>
                      <tbody>
                        <tr><td>参数</td><td>格式 / 取值</td><td>默认值</td><td>说明</td></tr>
                        <tr><td>CSV数据文件</td><td>.csv</td><td>必填</td><td>按列组织的信号数据，默认取数据中的电压列作为模型输入</td></tr>
                        <tr><td>经度</td><td>十进制度（WGS84）</td><td>97.5</td><td>事件点位经度，推理完成后在地图上定位展示</td></tr>
                        <tr><td>纬度</td><td>十进制度（WGS84）</td><td>31.0</td><td>事件点位纬度</td></tr>
                      </tbody>
                    </table>
                    <h2>五、判定逻辑与结果</h2>
                    <ol>
                      <li>机器学习模式：先计算短时窗与长时窗的平均能量，当两者能量比超过阈值时进入二次校验；锁定 LTA 背景值后把后续数据切分为若干片段，各片段比值均超过阈值且能量增长趋势达到要求次数，判定为泥石流事件；</li>
                      <li>深度学习模式：CSV 信号经标准化后送入深度学习模型推理，输出事件判定结果；</li>
                      <li>两种模式均返回检测结论与波形信息，前端在指定经纬度落事件点展示，可点击查看结果详情。</li>
                    </ol>
                  </div>
                </el-dialog>
              </div>
            </template>
            <p id="name_par_seismic" class="seismic-section-label">
              模型参数
            </p>

            <!-- ML/DL 切换 -->
            <div class="seismic-mode-switch">
              <span class="seismic-mode-label">模型类型</span>
              <el-radio-group v-model="seismicModelType" size="small">
                <el-radio value="ml">机器学习</el-radio>
                <el-radio value="dl">深度学习</el-radio>
              </el-radio-group>
            </div>

            <!-- ======== ML 模式：STA/LTA ======== -->
            <el-form
              v-if="seismicModelType === 'ml'"
              :model="formSeismic"
              class="form_seismic seismic-form seismic-form-ml"
            >
              <div class="seismic-row seismic-row-top">
                <el-form-item
                  label="Excel文件"
                  class="seismic-file-field"
                >
                  <el-input
                    v-model="fileNameSeismic"
                    placeholder="上传.xlsx文件"
                    readonly
                    style="width: 160px"
                  >
                    <template #append>
                      <el-upload
                        ref="uploadRefSeismic"
                        action="http://localhost:3000/node/upload_excel"
                        name="file"
                        :auto-upload="false"
                        :multiple="false"
                        :show-file-list="false"
                        accept=".xlsx"
                        :data="uploadDataSeismic"
                        @change="handleFileChangeSeismic"
                        @success="handleUploadSuccessSeismic"
                        @error="handleUploadErrorSeismic"
                      >
                        <el-button
                          class="seismic-upload-trigger"
                          @click.stop="triggerUploadSeismic"
                        >
                          <i class="iconfont icon-daoru"></i>
                        </el-button>
                      </el-upload>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item
                  label="经度"
                  label-width="67px"
                  label-position="right"
                >
                  <el-input
                    v-model="formSeismic.longitude"
                    type="number"
                    step="0.000001"
                    placeholder="97.5"
                    style="width: 100px"
                  />
                </el-form-item>

                <el-form-item
                  label="纬度"
                  label-width="50px"
                  label-position="right"
                >
                  <el-input
                    v-model="formSeismic.latitude"
                    type="number"
                    step="0.000001"
                    placeholder="31.0"
                    style="width: 100px"
                  />
                </el-form-item>
              </div>

              <div class="seismic-row">
                <el-form-item
                  label="阈值"
                  label-width="187px"
                  label-position="right"
                >
                  <el-input
                    v-model="formSeismic.threshold"
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    style="width: 68px"
                  />
                </el-form-item>
                <el-form-item
                  label="短时窗(秒)"
                  label-width="123px"
                  label-position="right"
                >
                  <el-input
                    v-model="formSeismic.short_window"
                    type="number"
                    step="1"
                    placeholder="30"
                    style="width: 80px"
                  />
                </el-form-item>
                <el-form-item
                  label="长时窗(秒)"
                  label-width="123px"
                  label-position="right"
                >
                  <el-input
                    v-model="formSeismic.long_window"
                    type="number"
                    step="1"
                    placeholder="240"
                    style="width: 80px"
                  />
                </el-form-item>
              </div>
              <div class="seismic-row">
                <el-form-item
                  label="分段时长(秒)"
                  label-width="187px"
                  label-position="center"
                >
                  <el-input
                    v-model="formSeismic.segment_duration"
                    type="number"
                    step="1"
                    placeholder="10"
                    style="width: 68px"
                  />
                </el-form-item>
                <el-form-item
                  label="总时长(秒)"
                  label-width="123px"
                  label-position="right"
                >
                  <el-input
                    v-model="formSeismic.total_duration"
                    type="number"
                    step="1"
                    placeholder="60"
                    style="width: 80px"
                  />
                </el-form-item>
                <el-form-item
                  label="采样率(Hz)"
                  label-width="123px"
                  label-position="right"
                >
                  <el-input
                    v-model="formSeismic.sampling_rate"
                    type="number"
                    step="1"
                    placeholder="100"
                    style="width: 80px"
                  />
                </el-form-item>
              </div>

              <el-form-item class="seismic-actions">
                <el-button
                  class="seismic-submit"
                  type="primary"
                  @click="submitSeismic"
                  >上传并提交</el-button
                >
                <el-button
                  class="seismic-cancel"
                  @click="dialogVisibleSeismic = false"
                  >取消</el-button
                >
              </el-form-item>
            </el-form>

            <!-- ======== DL 模式：Transformer1D ======== -->
            <el-form
              v-if="seismicModelType === 'dl'"
              class="form_seismic seismic-form seismic-form-dl"
            >
              <el-form-item label="CSV数据文件" class="seismic-dl-file-field">
                <el-input v-model="fileNameSeismicDL" placeholder="上传 .csv 文件" readonly>
                  <template #append>
                    <el-upload
                      ref="uploadRefSeismicDL"
                      action="http://localhost:3000/node/upload_excel"
                      name="file"
                      :auto-upload="false"
                      :multiple="false"
                      :show-file-list="false"
                      accept=".csv"
                      @change="handleFileChangeSeismicDL"
                      @success="handleUploadSuccessSeismicDL"
                      @error="handleUploadErrorSeismicDL"
                    >
                      <el-button class="seismic-upload-trigger" @click.stop="triggerUploadSeismicDL">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              <div class="seismic-dl-row">
                <el-form-item label="经度">
                  <el-input v-model="formSeismicDL.longitude" type="number" step="0.0001" placeholder="97.5" />
                </el-form-item>
                <el-form-item label="纬度">
                  <el-input v-model="formSeismicDL.latitude" type="number" step="0.0001" placeholder="31.0" />
                </el-form-item>
              </div>
              <el-form-item class="seismic-actions">
                <el-button class="seismic-submit" type="primary" @click="submitSeismicDL" :loading="dlLoading">
                  {{ dlLoading ? '推理中...' : '上传并推理' }}
                </el-button>
                <el-button class="seismic-cancel" @click="dialogVisibleSeismic = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </div>
      <!-- 断链防控模块 -->
      <div class="theme">
        <div class="title">断链防控</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box box-used regulation-entry">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="openTerrainRegulation('chain')"
            ><span>灾害链断链调控技术</span></el-button
          >
        </div>
        <div class="box box-used p_bottom regulation-entry">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="openTerrainRegulation('along')"
            ><span>冰川泥石流沿程调控技术</span></el-button
          >
        </div>
        <el-dialog
          v-for="cfg in terrainRegulationConfigs"
          :key="cfg.kind"
          v-model="cfg.visible"
          :title="cfg.title"
          :width="cfg.kind === 'chain' ? '700px' : '560px'"
          top="6vh"
          :close-on-click-modal="false"
          class="dialog_quanyu"
        >
          <template #header>
            <div class="terrain-dialog-header">
              <span class="terrain-dialog-title">{{ cfg.title }}</span>
              <span
                class="terrain-dialog-tag"
                :style="{ color: cfg.accent, borderColor: cfg.accent }"
                >{{ cfg.tagline }}</span
              >
              <el-tooltip content="查看参数说明" placement="top">
                <el-icon class="help-icon" @click="cfg.helpVisible = true">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-dialog
            v-model="cfg.helpVisible"
            class="model-help-dialog"
            width="1200px"
            :close-on-click-modal="false"
            top="70px"
          >
            <template #title>
              <div class="model-help-head">
                <span class="model-help-title">{{ cfg.title }}</span>
                <span class="model-help-subtitle">参数说明</span>
              </div>
            </template>
            <div class="help-body">
              <h2>一、功能目的</h2>
              <p>{{ cfg.desc }}</p>
              <h2>二、界面输入参数</h2>
              <table>
                <tbody>
                  <tr><td>参数</td><td>取值 / 单位</td><td>说明</td></tr>
                  <tr><td>{{ cfg.areaLabel }}</td><td>手绘闭合多边形</td><td>在三维地图上左键逐点落点、右键结束绘制，至少需要 3 个顶点；绘制结果即为调控范围</td></tr>
                  <tr><td>{{ cfg.raiseLabel }}</td><td>m（断链调控默认 20，沿程调控默认 15）</td><td>将绘制范围内的底床整体抬升该高度，模拟坝体或护底高程</td></tr>
                  <template v-if="cfg.kind === 'chain'">
                    <tr><td>数据坐标系</td><td>EPSG 编码</td><td>txt / asc 等不自带坐标系的输入按此解释；tif 或带 xllcorner / yllcorner 头部时以文件为准（默认 EPSG:32646）</td></tr>
                    <tr><td>源区中心（经度 / 纬度）</td><td>WGS84 十进制度</td><td>无投影头部输入的空间定位基准（易贡示例 95.0020 / 30.2354）</td></tr>
                    <tr><td>灾前地形 / 灾后地形 / 初始水深</td><td>.tif / .tiff / .txt / .asc</td><td>在断链调控面板内独立选择，不读取「冰岩崩动力学模型」弹窗中的数据；三份都不选时使用内置示例数据</td></tr>
                    <tr><td>动力学参数</td><td>数值</td><td>基底摩擦角、曼宁摩擦系数、网格长宽、滑坡与河水密度、输出间距、计算时间、物源厚度比例，全部在本面板单独填写</td></tr>
                  </template>
                  <template v-else>
                    <tr><td>输入栅格</td><td>.tif / .tiff（三份）</td><td>在沿程调控面板内独立选择平均高程 / 物源启动区 / 影响范围，不读取「冰川泥石流动力学模型」弹窗中的数据，三份都就绪才能启动</td></tr>
                    <tr><td>动力学参数</td><td>固定</td><td>摩擦参数、模拟时长与滑移路径沿用冰川泥石流动力学模型的默认配置</td></tr>
                  </template>
                </tbody>
              </table>
              <h2>三、运行流程</h2>
              <ol>
                <li>点击「在地图上绘制」，沿目标沟道绘制闭合范围（左键落点，右键结束，Esc 取消）；</li>
                <li>填写{{ cfg.raiseLabel }}，点击「{{ cfg.runText }}」；</li>
                <li v-if="cfg.kind === 'chain'">后端将范围内底床抬高指定高度后重新执行冰岩崩动力学计算，前端加载结果图层供对比查看。</li>
                <li v-else>后端将范围内高程栅格抬高指定高度后重新执行冰川泥石流动力学计算，前端加载结果图层供对比查看。</li>
              </ol>
              <h2>四、结果与提示</h2>
              <ul>
                <li>结果渲染场为抬升地形后的泥石流层厚度，与未调控工况对比即可评估断链／沿程调控的削峰效果；</li>
                <li>{{ cfg.hint }}</li>
                <li>绘制范围应落在输入数据覆盖范围内，范围过小或偏离沟道会明显削弱调控效果。</li>
              </ul>
            </div>
          </el-dialog>
          <div class="terrain-panel">
            <p class="terrain-desc" :style="{ borderLeftColor: cfg.accent }">
              {{ cfg.desc }}
            </p>
            <!-- 断链调控：本面板独立输入，不与「冰岩崩动力学模型」共享 -->
            <template v-if="cfg.kind === 'chain'">
              <p class="quanyu-section-label">输入数据</p>
              <el-form label-position="top" class="quanyu-form">
                <el-form-item label="数据坐标系" label-position="top">
                  <el-input v-model="chainSourceCrs" placeholder="EPSG:32646" />
                </el-form-item>
                <el-form-item label="源区中心（经度 / 纬度）" label-position="top">
                  <div class="quanyu-row-2">
                    <el-input v-model="chainAnchorLon" placeholder="经度 95.0020" />
                    <el-input v-model="chainAnchorLat" placeholder="纬度 30.2354" />
                  </div>
                </el-form-item>
                <el-form-item
                  v-for="item in chainFileItems"
                  :key="'chain-' + item.key"
                  :label="item.label"
                  label-position="top"
                  class="quanyu-file-field"
                >
                  <el-input
                    v-model="chainFileNames[item.key]"
                    :placeholder="item.placeholder"
                    readonly
                  >
                    <template #append>
                      <el-upload
                        :ref="el => { if (el) chainUploadRefs[item.key] = el }"
                        :auto-upload="false"
                        :show-file-list="false"
                        accept=".tif,.tiff,.asc,.txt"
                        @change="(f, fs) => handleChainFile(item.key, f, fs)"
                      >
                        <el-button
                          class="quanyu-upload-trigger"
                          @click.stop="triggerChainUpload(item.key)"
                        >
                          <i class="iconfont icon-daoru"></i>
                        </el-button>
                      </el-upload>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>

              <p class="quanyu-section-label">模型参数</p>
              <el-form :model="chainForm" label-position="top" class="quanyu-form">
                <div class="quanyu-param-grid">
                  <el-form-item label="基底摩擦角 (rad)">
                    <el-input v-model="chainForm.bed" placeholder="0.05" />
                  </el-form-item>
                  <el-form-item label="曼宁摩擦系数">
                    <el-input v-model="chainForm.nn" placeholder="0.0125" />
                  </el-form-item>
                  <el-form-item label="网格长度 (m)">
                    <el-input v-model="chainForm.dx" placeholder="20" />
                  </el-form-item>
                  <el-form-item label="网格宽度 (m)">
                    <el-input v-model="chainForm.dy" placeholder="20" />
                  </el-form-item>
                  <el-form-item label="滑坡密度 (kg/m³)">
                    <el-input v-model="chainForm.rous" placeholder="2700" />
                  </el-form-item>
                  <el-form-item label="河水密度 (kg/m³)">
                    <el-input v-model="chainForm.rouf" placeholder="1000" />
                  </el-form-item>
                  <el-form-item label="输出间距 (s)">
                    <el-input v-model="chainForm.interval" placeholder="10" />
                  </el-form-item>
                  <el-form-item label="计算时间 (s)">
                    <el-input v-model="chainForm.Tmax" placeholder="200" />
                  </el-form-item>
                  <el-form-item label="物源厚度比例 (%)">
                    <el-input v-model="chainForm.depthScale" placeholder="30" />
                  </el-form-item>
                </div>
                <el-form-item class="quanyu-note">
                  <span>
                    支持 .tif / .tiff / .txt / .asc（ESRI ASCII）；txt / asc 自带 xllcorner /
                    yllcorner 头部时按「数据坐标系」解释，无头部时按「源区中心」经纬度定位。
                    灾前地形 / 灾后地形 / 初始水深在本面板独立选择，三份都不选时使用内置示例数据。
                  </span>
                </el-form-item>
              </el-form>
            </template>

            <!-- 沿程调控：本面板独立输入，不与「冰川泥石流动力学模型」共享 -->
            <template v-else>
              <p class="quanyu-section-label">输入数据</p>
              <el-form label-position="top" class="quanyu-form">
                <el-form-item
                  v-for="item in alongFileItems"
                  :key="'along-' + item.key"
                  :label="item.label"
                  label-position="top"
                  class="quanyu-file-field"
                >
                  <el-input
                    v-model="alongFileNames[item.key]"
                    :placeholder="item.placeholder"
                    readonly
                  >
                    <template #append>
                      <el-upload
                        :ref="el => { if (el) alongUploadRefs[item.key] = el }"
                        :auto-upload="false"
                        :show-file-list="false"
                        accept=".tif,.tiff"
                        @change="(f, fs) => handleAlongFile(item.key, f, fs)"
                      >
                        <el-button
                          class="quanyu-upload-trigger"
                          @click.stop="triggerAlongUpload(item.key)"
                        >
                          <i class="iconfont icon-daoru"></i>
                        </el-button>
                      </el-upload>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
            </template>
            <div class="terrain-row">
              <span class="terrain-label">{{ cfg.areaLabel }}</span>
              <el-button size="small" type="primary" plain @click="startTerrainDraw(cfg.kind)"
                >在地图上绘制</el-button
              >
              <el-button size="small" @click="clearTerrainDraw">清除绘制</el-button>
              <span class="terrain-status">{{ terrainStatusText }}</span>
            </div>
            <el-form label-width="auto" class="terrain-form">
              <el-form-item :label="cfg.raiseLabel">
                <el-input
                  v-model="terrainRaise"
                  style="width: 160px"
                  :placeholder="cfg.raisePlaceholder"
                />
                <span class="terrain-unit">米</span>
              </el-form-item>
            </el-form>
            <p class="terrain-hint">{{ cfg.hint }}</p>
            <div class="terrain-actions">
              <el-button @click="cfg.visible = false">取消</el-button>
              <el-button
                type="primary"
                :loading="terrainRunning"
                @click="submitTerrainRegulation(cfg.kind)"
                >{{ cfg.runText }}</el-button
              >
            </div>
          </div>
        </el-dialog>
      </div>
    </div>

    <!-- 动态生成的正方形 -->
    <transition
      name="fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div v-if="squareStore.showSquare" class="square">
        <!-- <span class="close-btn" @click="closeSquare">×</span> -->

        <!-- 风险图例 -->
        <div class="legend">
          <div class="legend-item">
            <div
              class="color-box"
              :style="{ backgroundColor: 'rgba(212, 48, 48, 255)' }"
            ></div>
            <span class="legend-text">极高风险</span>
          </div>
          <div class="legend-item">
            <div
              class="color-box"
              :style="{ backgroundColor: 'rgba(230, 141, 26, 255)' }"
            ></div>
            <span class="legend-text">高风险</span>
          </div>
          <div class="legend-item">
            <div
              class="color-box"
              :style="{ backgroundColor: 'rgba(230, 195, 0, 220)' }"
            ></div>
            <span class="legend-text">中风险</span>
          </div>
          <div class="legend-item">
            <div
              class="color-box"
              :style="{ backgroundColor: 'rgba(42, 130, 228, 255)' }"
            ></div>
            <span class="legend-text">低风险</span>
          </div>
        </div>
      </div>
    </transition>
    <!-- 结果示例图全屏预览（点击任意位置关闭） -->
    <Teleport to="body">
      <div
        v-if="previewSrc"
        class="help-image-preview"
        @click="previewSrc = ''"
      >
        <img :src="previewSrc" alt="结果示例大图" />
      </div>
    </Teleport>
  </div>
</template>
<script setup>
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
// import { UploadInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, inject, ref } from 'vue'
import { reactive } from 'vue'
import axios from 'axios'
import modelService from '../services/modelService'

// 「数值计算模型集」里的静态数据卡片：勾选状态与可用时段由 MapHome（资源目录同一套管线）下传
const props = defineProps({
  dataLayerChecked: { type: Array, default: () => [] },
  dangerLevelFiles: { type: Array, default: () => [] },
  dangerLevelSelected: { type: String, default: '' },
})
// import { exec } from 'child_process'
const dialogVisible = ref(false)
const dialogVisibleGBM = ref(false)
const dialogVisible2 = ref(false)
const dialog_inverseV = ref(false)
const dialog_avainit = ref(false)
const openHelpDialog_fxy = ref(false)
// 参数说明里结果示例图的全屏预览地址
const previewSrc = ref('')
const openHelpDialog_sh = ref(false)
const openHelpDialog_flood = ref(false)
const openHelpDialog_inverseV = ref(false)
const openHelpDialog_gbm = ref(false)
const openHelpDialog_seismic = ref(false)
const openHelpDialog_avainit = ref(false)
const openHelpDialog_sdp = ref(false)
const openHelpDialog_quanyu = ref(false)
const uploadRef = ref(null)
const selectedDisplFile = ref(null)
const fileName_inverseV = ref('')
// --- GBM 上传相关 ---
const uploadRefGBM = ref(null)
const fileNameGBM = ref('')
const fileGBM = ref()
// shp/dbf/shx/prj 一次选中会触发多次上传回调，这里按批次归并，全部上传完成后只发起一次推理
const gbmSubmitting = ref(false)
const gbmUploadBatch = reactive({
  active: false,
  total: 0,
  succeeded: 0,
  savedFiles: [],
})
const formGBM = reactive({
  name: '',
  // 前端不用把 targetFolder 强行传死，若后端需要可以传；这里演示也可以传
  targetFolder: './src/assets/shps',
})
// --- 全域风险脆弱性分析 ---
const dialogVisibleQuanYu = ref(false)
const quanYuLoading = ref(false)
const uploadRefsQuanYu = reactive({})
const quanYuFiles = reactive({})   // key → File
const quanYuFileNames = reactive({}) // key → display name
const quanyuFileItems = [
  { key:'elevation', label:'平均高程', placeholder:'选择 elevation.tif' },
  { key:'relief', label:'地形起伏度', placeholder:'选择 relief.tif' },
  { key:'watershed', label:'流域面积', placeholder:'选择 watershed.tif' },
  { key:'lithology', label:'地层岩性', placeholder:'选择 lithology.tif' },
  { key:'faultDensity', label:'断层密度', placeholder:'选择 fault_density.tif' },
  { key:'soilType', label:'土壤类型', placeholder:'选择 soil_type.tif' },
  { key:'waterDist', label:'距水系距离', placeholder:'选择 water_dist.tif' },
  { key:'drainageDensity', label:'河网密度', placeholder:'选择 drainage_density.tif' },
  { key:'rainfall', label:'降雨数据', placeholder:'选择 rainfall.tif' },
  { key:'landUse', label:'土地利用', placeholder:'选择 land_use.tif' },
  { key:'roadDist', label:'距公路距离', placeholder:'选择 road_dist.tif' },
  { key:'ndvi', label:'NDVI', placeholder:'选择 ndvi.tif' },
]
// 初始化
quanyuFileItems.forEach(item => {
  quanYuFileNames[item.key] = ''
  quanYuFiles[item.key] = null
})
const handleQuanYuFileChange = (key, uploadFile) => {
  quanYuFiles[key] = uploadFile.raw || uploadFile
  quanYuFileNames[key] = (uploadFile.raw || uploadFile).name || ''
}
const triggerQuanYuUpload = key => {
  const el = uploadRefsQuanYu[key]?.$el?.querySelector?.('input[type=file]')
  if (el) el.click()
}
const submitQuanYu = () => {
  const missing = quanyuFileItems.filter(item => !quanYuFiles[item.key])
  if (missing.length > 0) {
    ElMessage({ message: `请选择: ${missing.map(i => i.label).join('、')}`, type: 'warning' })
    return
  }
  dialogVisibleQuanYu.value = false
  quanYuLoading.value = true
  ElMessage({ message: '正在计算全域风险脆弱性', type: 'info', duration: 0 })
  setTimeout(() => {
    quanYuLoading.value = false
    ElMessage.closeAll()
    ElMessage({ message: '计算完成，正在加载结果图层', type: 'success' })
    $emit('fullRiskAnalysis')
  }, 10000)
}

// --- 泥石流启动物源计算模型 ---
const dialogVisibleSDP = ref(false)
const dialogBeta = ref(false)
const betaUploadRefs = reactive({})
const betaFiles = reactive({})
const betaFileNames = reactive({})
const betaFileItems = [
  { key: 'elev', label: '平均高程', placeholder: '选择 elevation.tif' },
  { key: 'debris', label: '物源启动区', placeholder: '选择 debris.tif' },
  { key: 'impact', label: '影响范围', placeholder: '选择 impact_area.tif' },
]
betaFileItems.forEach(item => { betaFileNames[item.key] = ''; betaFiles[item.key] = null })
const handleBetaFile = (key, uploadFile, uploadFiles) => {
  const f = (uploadFiles && uploadFiles[0]?.raw) || uploadFile.raw || uploadFile
  betaFiles[key] = f
  betaFileNames[key] = f?.name || ''
}
const triggerBetaUpload = key => {
  const el = betaUploadRefs[key]?.$el?.querySelector?.('input[type=file]')
  if (el) el.click()
}
const sdpLoading = ref(false)
const uploadRainRef = ref(null)
const uploadTempRef = ref(null)
const uploadOutputRef = ref(null)
const fileNameRain = ref('')
const fileNameTemp = ref('')
const fileNameOutput = ref('')
const fileRainPath = ref('')
const fileTempPath = ref('')
const fileOutputPath = ref('')
const formSDP = reactive({
  ice_content: '0.2',
})
const triggerUploadRain = () => { uploadRainRef.value?.$el.querySelector('input[type=file]').click() }
const triggerUploadTemp = () => { uploadTempRef.value?.$el.querySelector('input[type=file]').click() }
const triggerUploadOutput = () => { uploadOutputRef.value?.$el.querySelector('input[type=file]').click() }
const handleFileRain = (uploadFile, uploadFiles) => {
  const files = uploadFiles || [uploadFile]
  fileNameRain.value = files.map(f => f.name).join(', ')
  fileRainPath.value = files.map(f => f.name).join(',')
}
const handleFileTemp = (uploadFile, uploadFiles) => {
  const files = uploadFiles || [uploadFile]
  fileNameTemp.value = files.map(f => f.name).join(', ')
  fileTempPath.value = files.map(f => f.name).join(',')
}
const handleFileOutput = (uploadFile, uploadFiles) => {
  const files = uploadFiles || [uploadFile]
  fileNameOutput.value = files.map(f => f.name).join(', ')
  fileOutputPath.value = files.map(f => f.name).join(',')
}
const submitSDP = async () => {
  dialogVisibleSDP.value = false
  sdpLoading.value = true
  ElMessage({ message: '泥石流起动物源计算运行中，约需数分钟...', type: 'info', duration: 0 })
  try {
    const params = {}
    // 暂不传路径，后端使用默认路径；后续接入文件上传后再启用
    // if (fileRainPath.value) params.rain_path = fileRainPath.value
    // if (fileTempPath.value) params.temp_path = fileTempPath.value
    if (formSDP.ice_content) params.ice_content = parseFloat(formSDP.ice_content)
    const result = await modelService.postSDPStart(params)
    console.log('[SDP] 后端返回:', result)
    sdpLoading.value = false
    ElMessage.closeAll()
    ElMessage({ message: '计算完成，正在加载结果图层', type: 'success' })
    $emit('openLayers', { sdpResult: result })
  } catch (e) {
    sdpLoading.value = false
    ElMessage.closeAll()
    console.error('SDP_Start error:', e)
    // 500 通常是后端 Python 环境问题，打印详细错误
    if (e.response?.data) {
      const text = new TextDecoder().decode(e.response.data)
      console.error('后端返回:', text)
      ElMessage({ message: '计算失败: ' + text.substring(0, 200), type: 'error' })
    } else {
      ElMessage({ message: '计算失败: ' + (e.message || e), type: 'error' })
    }
  }
}

const form_avainit = reactive({
  slope_angle: '60',
  slide_angle: '15',
  cohesion: '15',
  friction_angle: '20',
  rock_density: '20',
  permeability: '0.0001',
  ice_thickness: '4',
  fissure_height: '10',
  melt_duration: '240',
  slide_length: '20',
})
const form_bedding_inverted = reactive({
melt_duration: '240',
  slope_angle: '30',
  inverse_angle: '70',
  ice_thickness: '5',
  slope_height: '10',
  bedding_space: '20',
  cohesion: '15',
  friction_angle: '20',
  rock_density: '20',
  permeability: '0.0001',
})
const form_bedding_wedget = reactive({
  slope_angle: '55',
  normal_vector: '1,1,1',
  cohesion: '15',
  friction_angle: '20',
  rock_density: '20',
  permeability: '0.0001',
  ice_thickness: '5',
  slope_height: '10',
  square: '200',
  fracture: '0.5',
  melt_duration: '240',
})
const form_avainit_location = reactive({ longitude: '95.0020', latitude: '30.2354' })
const radio_avainit = ref(1)
const seismicModelType = ref('ml') // ml | dl
const dialogVisibleSeismic = ref(false)
const uploadRefSeismic = ref(null)
const fileNameSeismic = ref('')
const fileSeismic = ref(null)
const uploadDataSeismic = () => ({})
const showBarrage = ref(false)
// DL 模式
const uploadRefSeismicDL = ref(null)
const fileNameSeismicDL = ref('')
const fileSeismicDL = ref(null)
const dlLoading = ref(false)
const formSeismicDL = reactive({ voltageColumn: 'Voltage_mV', longitude: '97.5', latitude: '31.0' })
const triggerUploadSeismicDL = () => {
  uploadRefSeismicDL.value?.$el.querySelector('input[type=file]').click()
}
const handleFileChangeSeismicDL = (uploadFile, uploadFiles) => {
  fileSeismicDL.value = uploadFiles.map(f => f.raw || f)
  fileNameSeismicDL.value = uploadFiles.map(f => f.name).join(', ')
}
const submitSeismicDL = async () => {
  if (!fileSeismicDL.value || fileSeismicDL.value.length === 0) {
    ElMessage({ message: '请选择 CSV 文件', type: 'warning' })
    return
  }
  dialogVisibleSeismic.value = false
  dlLoading.value = true
  ElMessage({ message: '上传并推理中...', type: 'info', duration: 0 })
  uploadRefSeismicDL.value?.submit()
}
const handleUploadSuccessSeismicDL = async (response, file, fileList) => {
  ElMessage.closeAll()
  if (response?.code !== 200) {
    ElMessage({ message: '上传失败: ' + (response?.message || ''), type: 'error' })
    dlLoading.value = false
    return
  }
  try {
    const resp = await modelService.postSeismicDL({ file: response.file, col: formSeismicDL.voltageColumn })
    dlLoading.value = false
    const prob = resp?.probability ?? 0
    const pred = resp?.prediction ?? 0

    // 读取 CSV 数据用于波形图
    let waveformData = null
    try {
      const raw = fileSeismicDL.value[0]
      const text = await raw.text()
      const lines = text.trim().split('\n').slice(1) // skip header
      const voltage = lines.map(l => parseFloat(l.split(',')[1])).filter(v => !isNaN(v))
      waveformData = { data: voltage, ratio: [], result: [] }
    } catch (e) {}

    const lon = Number(formSeismicDL.longitude) || 97.5
    const lat = Number(formSeismicDL.latitude) || 31.0
    const msg = pred ? `检测到泥石流信号 (概率 ${(prob*100).toFixed(1)}%)` : `未检测到泥石流信号 (概率 ${(prob*100).toFixed(1)}%)`
    ElMessage({ message: msg, type: pred ? 'warning' : 'success' })
    $emit('seismicResult', { detected: pred === 1, lon, lat, info: resp, echarts_data: waveformData, isDL: true })
  } catch (e) {
    dlLoading.value = false
    ElMessage({ message: '推理失败: ' + (e.message || e), type: 'error' })
  } finally {
    fileSeismicDL.value = []
    fileNameSeismicDL.value = ''
    uploadRefSeismicDL.value?.clearFiles()
  }
}
const handleUploadErrorSeismicDL = (err, file, fileList) => {
  dlLoading.value = false
  ElMessage({ message: '上传失败', type: 'error' })
  fileSeismicDL.value = []
  fileNameSeismicDL.value = ''
  uploadRefSeismicDL.value?.clearFiles()
}
const formSeismic = reactive({
  threshold: 2.5,
  short_window: 30,
  long_window: 240,
  segment_duration: 10,
  total_duration: 60,
  sampling_rate: 100,
  longitude: 97.5,
  latitude: 31.0,
}) // 修复 "formSeismic" 未定义（如果模板中用了 :model="formSeismic"）
// 返回给 el-upload 的附加表单字段
const uploadDataGBM = () => {
  return {
    name: formGBM.name || '',
    targetFolder: formGBM.targetFolder || '',
  }
}

import { useSquareStore } from '../stores/squareStore'
import { emitter } from '../eventBus'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
// import { emit } from 'process'

let $emit = defineEmits([
  'openLayers',
  'timeSelected',
  'yjLayers',
  'floodLayers',
  'floodLayersTest',
  'forecast',
  'seismicResult',
  'fullRiskAnalysis',
  'bedding_parallel',
  'bedding_inverted',
  'bedding_wedget',
  'betaLayers',
  'proLayers',
  'terrainDrawStart',
  'terrainDrawCancel',
  'dataLayerToggle',
  'dangerLevelFileChange',
])
// ===== 模型集里的静态数据卡片（与资源目录同源）=====
// 每个卡片对应资源目录里的一组叶子节点，勾选即调用资源目录同一条加载管线
const dataLayerGroups = {
  riskBase: [
    { id: 611, label: '灾害危险区划' },
    { id: 612, label: '历史灾害点' },
    { id: 613, label: '古灾害链' },
  ],
  glacierSource: [
    { id: 621, label: '历史数据模拟' },
    { id: 622, label: '历史未堵江点' },
    { id: 623, label: '历史堵江点' },
  ],
  population: [{ id: 732, label: '人口提取' }],
  vulnerability: [
    { id: 711, label: '滑坡人口脆弱性' },
    { id: 712, label: '泥石流人口脆弱性' },
    { id: 713, label: '山洪人口脆弱性' },
  ],
  danger: [
    { id: 721, label: '滑坡危险性' },
    { id: 722, label: '泥石流危险性' },
    { id: 723, label: '山洪危险性' },
    { id: 781, label: '区域危险性评估' },
    { id: 782, label: '点危险性评估' },
  ],
  risk: [
    { id: 741, label: '1 层建筑物脆弱性' },
    { id: 742, label: '2 层建筑物脆弱性' },
    { id: 743, label: '3 层建筑物脆弱性' },
    { id: 744, label: '砌体建筑物脆弱性' },
    { id: 745, label: '总体建筑物脆弱性' },
    { id: 751, label: '高等级道路' },
    { id: 752, label: '次等级道路' },
    { id: 753, label: '简单道路' },
    { id: 754, label: '总体道路' },
    { id: 761, label: '双柱式桥梁脆弱性' },
    { id: 762, label: '单柱式桥梁脆弱性' },
    { id: 763, label: '总体桥梁脆弱性' },
    { id: 77, label: '人口风险评估' },
  ],
}
const isDataLayerChecked = id => (props.dataLayerChecked || []).includes(id)
const dataLayerCount = ids => (ids || []).filter(id => isDataLayerChecked(id)).length
const toggleDataLayerItem = (id, checked) => $emit('dataLayerToggle', { id, checked })
const selectAllDataLayers = (ids, checked) => {
  ;(ids || []).forEach(id => {
    if (isDataLayerChecked(id) !== checked) toggleDataLayerItem(id, checked)
  })
}
const dangerLevelFileChange = value => $emit('dangerLevelFileChange', value)

// 获取 store 实例
// 静态资源前缀（跟随 vite base，用于参数说明里的示例图）
const ASSET_BASE = String(import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')
const squareStore = useSquareStore()
// function handleClose(done) {
//   ElMessageBox.confirm('确定关闭吗?')
//     .then(() => {
//       done()
//     })
//     .catch(() => {})
//   // done()
// }

const form = reactive({
  name: '',
  // region: '',
  color: 'dangerLevel',
  time: [],
  rsl: '1.0e-6',
  depth: '3.0',
  zmax: '2.4',
  diffus: '1.32e-03',
  ksat: '1.32e-05',
})
const form2 = reactive({
  bed: '0.05',
  nn: '0.0125',
  dx: '20',
  dy: '20',
  rous: '2700',
  rouf: '1000',
  // 输出间距=出图节拍（秒）；后端按「模拟时刻」抽帧，总帧数不超过 maxFrames
  interval: '10',
  Tmax: '200',
  // 物源层厚度比例（%）：把初始物源 zB-zL 按该比例削薄，100 = 不削薄；越小启动越弱
  depthScale: '30',
  // 渲染场固定为泥石流层厚度 solid=zB-zL（后端仍支持 total/water/speed）：旧语义 total=泥石流层+水层 / water=水层 / solid=泥石流层(zB-zL) / speed=流速
  field: 'solid',
})
// 冰岩崩动力学模型（python_port）输入数据：zb 灾前地形 / zl 灾后地形 / hw 初始水深
const proUploadRefs = reactive({})
const proFiles = reactive({})
const proFileNames = reactive({})
const proFileItems = [
  { key: 'zb', label: '灾前地形', placeholder: 'zb.tif / zb.txt（灾前 DEM）' },
  { key: 'zl', label: '灾后地形', placeholder: 'zl.tif / zl.txt（灾后 DEM）' },
  { key: 'hw', label: '初始水深', placeholder: 'hw.tif / hw.txt（堰塞湖水深）' },
]
// txt / asc（ESRI ASCII）输入不带坐标系，按此坐标系解释；tif 自带坐标系时以文件为准
// 无 xllcorner/yllcorner 头部的 txt/asc：源区中心经纬度（WGS84），后端换算成 UTM 角点；有头部时忽略
const proAnchorLon = ref('95.0020')
const proAnchorLat = ref('30.2354')
const proSourceCrs = ref('EPSG:32646')
proFileItems.forEach(item => {
  proFileNames[item.key] = ''
  proFiles[item.key] = null
})
const handleProFile = (key, uploadFile, uploadFiles) => {
  const f = (uploadFiles && uploadFiles[0]?.raw) || uploadFile.raw || uploadFile
  proFiles[key] = f
  proFileNames[key] = f?.name || ''
}
const triggerProUpload = key => {
  const el = proUploadRefs[key]?.$el?.querySelector?.('input[type=file]')
  if (el) el.click()
}
// 冰岩崩动力学模型（python_port）运行状态
const floodRunning = ref(false)
// 冰岩崩动力学模型（测试）
const dialogVisible2Test = ref(false)
const renderMethod = ref('debrisflow')
const form2Test = reactive({
  bed: '24',
  nn: '0.0125',
  dx: '20',
  dy: '20',
  rous: '2700',
  rouf: '1000',
  interval: '10',
  Tmax: '100',
})
const onSubmit2Test = () => {
  dialogVisible2Test.value = false
  ElMessage({ message: '运行中!（测试）', type: 'success', duration: 1500 })
  $emit('floodLayersTest', { ...form2Test, renderMethod: renderMethod.value })
}
const form_inverseV = reactive({
  name: '',
  longitude: '',
  latitude: '',
  file: '',
})
const form_BGM = reactive({
  aspect: '150',
  curvature: '0.002',
  fault_distance: '30000',
  ndvi: '0.001',
  rainfall: '700',
  relief_amplitude: '250',
})
const isProcessing = ref(false)
async function submitBeta() {
  dialogBeta.value = false
  $emit('betaLayers', { result: null })
  const missing = betaFileItems.filter(item => !betaFiles[item.key])
  if (missing.length > 0) {
    ElMessage({ message: '请选择: ' + missing.map(i => i.label).join('、'), type: 'warning' })
    return
  }
  ElMessage({ message: '上传输入数据...', type: 'info', duration: 0 })
  try {
    const formData = new FormData()
    const map = { elev: 'elev.tif', debris: 'debris.tif', impact: 'impact_area.tif' }
    for (const key of ['elev', 'debris', 'impact']) {
      const f = betaFiles[key]
      if (f) {
        const nf = new File([f], map[key], { type: f.type || 'application/octet-stream' })
        formData.append('files', nf)
      }
    }
    const upResp = await modelService.uploadAvaflowFiles(formData)
    if (!upResp || upResp?.status !== 'ok') {
      ElMessage.closeAll()
      ElMessage({ message: upResp?.message || '文件上传失败', type: 'error' })
      return
    }
    const jobId = upResp.jobId
    if (!jobId) {
      ElMessage.closeAll()
      ElMessage({ message: '\u4e0a\u4f20\u6210\u529f\u4f46\u672a\u8fd4\u56de\u4efb\u52a1ID', type: 'error' })
      return
    }
    const accepted = await modelService.runAvaflowBeta({ jobId })
    ElMessage.closeAll()
    if (!accepted || accepted.status !== 'accepted' || !accepted.jobId) {
      ElMessage({ message: accepted?.message || '启动模拟失败', type: 'error' })
      return
    }
    return await waitAvaflowBetaResult(jobId, '冰川泥石流动力学模型')
  } catch (e) {
    ElMessage.closeAll()
    const m2 = e.response?.data || e.message || e
    ElMessage({ message: 'beta 失败: ' + (typeof m2 === 'string' ? m2 : JSON.stringify(m2)), type: 'error' })
    console.error('submitBeta error:', e)
    $emit('betaLayers', { result: null })
  }
}

async function sumbit_avainit() {
  ElMessage({ message: '顺层计算运行中...', type: 'success', duration: 0 })
  try {
    const res = await modelService.postAvainit(form_avainit)
    ElMessage.closeAll()
    ElMessage({ message: '顺层计算完成', type: 'success' })
    dialog_avainit.value = false
    $emit('bedding_parallel', { mode: '顺层', form: { ...form_avainit }, result: res, location: { ...form_avainit_location } })
  } catch (e) {
    ElMessage.closeAll()
    const emsg = e.response?.data || e.message || e
        ElMessage({ message: '顺层计算失败: ' + (typeof emsg === 'string' ? emsg : JSON.stringify(emsg)), type: 'error' })
    console.error('sumbit_avainit error:', e)
  }
}
async function sumbit_inverse() {
  ElMessage({ message: '反倾计算运行中...', type: 'success', duration: 0 })
  try {
    const res = await modelService.postInverse(form_bedding_inverted)
    ElMessage.closeAll()
    ElMessage({ message: '反倾计算完成', type: 'success' })
    dialog_avainit.value = false
    $emit('bedding_inverted', { mode: '反倾', form: { ...form_bedding_inverted }, result: res, location: { ...form_avainit_location } })
  } catch (e) {
    ElMessage.closeAll()
    const emsg = e.response?.data || e.message || e
        ElMessage({ message: '反倾计算失败: ' + (typeof emsg === 'string' ? emsg : JSON.stringify(emsg)), type: 'error' })
    console.error('sumbit_inverse error:', e)
  }
}
async function sumbit_wedget() {
  ElMessage({ message: '楔形计算运行中...', type: 'success', duration: 0 })
  try {
    const res = await modelService.postWedge(form_bedding_wedget)
    ElMessage.closeAll()
    ElMessage({ message: '楔形计算完成', type: 'success' })
    dialog_avainit.value = false
    $emit('bedding_wedget', { mode: '楔形', form: { ...form_bedding_wedget }, result: res, location: { ...form_avainit_location } })
  } catch (e) {
    ElMessage.closeAll()
    const emsg = e.response?.data || e.message || e
        ElMessage({ message: '楔形计算失败: ' + (typeof emsg === 'string' ? emsg : JSON.stringify(emsg)), type: 'error' })
    console.error('sumbit_wedget error:', e)
  }
}
function onSubmit() {
  // 未选择预测时间时，后端不会生成任何结果图，先在前端拦截并提示
  if (!Array.isArray(form.time) || form.time.length === 0) {
    ElMessage({ message: '请至少选择一个预测时间', type: 'warning' })
    return
  }
  dialogVisible.value = false
  ElMessage({ message: '运行中!', type: 'success', duration: 40000 })
  subitForm()
  // console.log(form.time[0])
  //把选中的时间通过自定义事件传递给父组件
  $emit('timeSelected', form.time)
}
const subitForm = () => {
  // 双保险：没有勾选预测时间时不发起请求
  if (!Array.isArray(form.time) || form.time.length === 0) {
    ElMessage({ message: '请至少选择一个预测时间', type: 'warning' })
    return
  }
  axios
    .post('/testapi/admin/user/fx', form, { timeout: 400000 })
    .then(response => {
      const text =
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data ?? '')

      // 经纬度范围与图片名称分开解析（非贪婪）：
      // 后端返回「左下经度:..,左下纬度:..,右上经度:..,右上纬度:..,图片名称N:xxx.png」
      // 图片数量与勾选时间数不一致（个别时段失败）时也能拿到已生成的结果图
      const boxMatch = text.match(
        /左下经度:([\d.]+),左下纬度:([\d.]+),右上经度:([\d.]+),右上纬度:([\d.]+)/,
      )
      const pnames = [...text.matchAll(/图片名称\d*:([^\s,]+\.png)/g)].map(m => m[1])

      if (boxMatch && pnames.length > 0) {
        const params = {
          leftlat: Number(boxMatch[2]),
          leftlong: Number(boxMatch[1]),
          rightlat: Number(boxMatch[4]),
          rightlong: Number(boxMatch[3]),
          pnames,
        }
        ElMessage.closeAll()
        ElMessage({
          message: `计算完成，加载 ${pnames.length} 张结果图...`,
          type: 'success',
          duration: 3000,
        })
        $emit('openLayers', params)
      } else {
        // 不再静默失败：把后端原始返回展示出来，便于定位问题
        ElMessage.closeAll()
        ElMessage({
          message: '未获取到结果图：' + (text || '后端返回为空').slice(0, 300),
          type: 'error',
          duration: 8000,
          showClose: true,
        })
        console.error('风险源模型未获取到结果图，后端返回:', text)
      }
    })
    .catch(error => {
      ElMessage.closeAll()
      const emsg = error.response?.data ?? error.message ?? error
      ElMessage({
        message:
          '风险源模型请求失败: ' +
          (typeof emsg === 'string' ? emsg : JSON.stringify(emsg)).slice(0, 300),
        type: 'error',
        duration: 8000,
        showClose: true,
      })
      console.error('subitForm error:', error)
    })
}
// 冰岩崩动力学模型（python_port 双层浅水流数值内核）
function onSubmit2() {
  dialogVisible2.value = false
  ElMessage({ message: '运行中，请稍候...', type: 'info', duration: 3000 })
  submitForm2()
}

function proNumber(value, fallback) {
  const raw = String(value ?? '').trim()
  if (raw === '') return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

// ===== 灾害链断链调控 / 冰川泥石流沿程调控 =====
// 断链调控：冰岩崩动力学模型（Pro 内核）——在 zb/zl/hw 底床上抬高拦挡范围后重算；
// 沿程调控：冰川泥石流动力学模型（r.avaflow 内核）——在 elevation 栅格上抬高护底范围后重算。
const terrainRegulationConfigs = reactive([
  {
    kind: 'chain',
    visible: false,
    helpVisible: false,
    title: '灾害链断链调控技术',
    tagline: '关键链节阻截',
    accent: '#5ab0ff',
    desc:
      '在物源启动—沟道输移的关键转换链节手绘阻截范围，抬高底床形成拦挡坝体，截断物源向下游的逐级放大。',
    areaLabel: '拦挡范围',
    raiseLabel: '坝体加高值',
    raisePlaceholder: '例如 20',
    runText: '执行断链调控计算',
    hint: '运行前请在本面板准备输入数据（灾前地形 / 灾后地形 / 初始水深）并核对数据坐标系与源区中心；本面板与「冰岩崩动力学模型」弹窗各自独立，三份都不选时使用内置示例数据。',
  },
  {
    kind: 'along',
    visible: false,
    helpVisible: false,
    title: '冰川泥石流沿程调控技术',
    tagline: '沿程护底消能',
    accent: '#24c8a0',
    desc:
      '沿冰川泥石流运动路径手绘护底与消能范围，抬升床面削弱沿程侵蚀冲刷，控制泥石流规模的持续放大。',
    areaLabel: '调控范围',
    raiseLabel: '床面抬升高度',
    raisePlaceholder: '例如 15',
    runText: '执行沿程调控计算',
    hint: '运行前请在本面板选择三份输入栅格（平均高程 / 物源启动区 / 影响范围）；本面板与「冰川泥石流动力学模型」弹窗各自独立，未选齐三份时无法启动。',
  },
])

// ===== 两个调控面板的输入状态：各自独立，不与动力学模型共享 =====
// 断链调控（冰岩崩内核）：本面板自己的坐标系 / 源区中心 / 三份底床数据 / 模型参数
const chainUploadRefs = reactive({})
const chainFiles = reactive({})
const chainFileNames = reactive({})
const chainFileItems = [
  { key: 'zb', label: '灾前地形', placeholder: 'zb.tif / zb.txt（灾前 DEM）' },
  { key: 'zl', label: '灾后地形', placeholder: 'zl.tif / zl.txt（灾后 DEM）' },
  { key: 'hw', label: '初始水深', placeholder: 'hw.tif / hw.txt（堰塞湖水深）' },
]
const chainSourceCrs = ref('EPSG:32646')
const chainAnchorLon = ref('95.0020')
const chainAnchorLat = ref('30.2354')
const chainFormDefaults = {
  bed: '0.05',
  nn: '0.0125',
  dx: '20',
  dy: '20',
  rous: '2700',
  rouf: '1000',
  interval: '10',
  Tmax: '200',
  depthScale: '30',
  field: 'solid',
}
const chainForm = reactive({ ...chainFormDefaults })
chainFileItems.forEach(item => {
  chainFiles[item.key] = null
  chainFileNames[item.key] = ''
})
const handleChainFile = (key, uploadFile, uploadFiles) => {
  const f = (uploadFiles && uploadFiles[0]?.raw) || uploadFile.raw || uploadFile
  chainFiles[key] = f
  chainFileNames[key] = f?.name || ''
}
const triggerChainUpload = key => {
  const el = chainUploadRefs[key]?.$el?.querySelector?.('input[type=file]')
  if (el) el.click()
}
const resetChainInputs = () => {
  if (floodRunning.value) return
  Object.assign(chainForm, chainFormDefaults)
  chainFileItems.forEach(item => {
    chainFiles[item.key] = null
    chainFileNames[item.key] = ''
  })
  chainSourceCrs.value = 'EPSG:32646'
  chainAnchorLon.value = '95.0020'
  chainAnchorLat.value = '30.2354'
  Object.values(chainUploadRefs).forEach(refItem => {
    refItem?.clearFiles?.()
    const input = refItem?.$el?.querySelector?.('input[type=file]')
    if (input) input.value = ''
  })
}

// 沿程调控（冰川泥石流内核）：本面板自己的三份栅格
const alongUploadRefs = reactive({})
const alongFiles = reactive({})
const alongFileNames = reactive({})
const alongFileItems = [
  { key: 'elev', label: '平均高程', placeholder: '选择 elevation.tif' },
  { key: 'debris', label: '物源启动区', placeholder: '选择 debris.tif' },
  { key: 'impact', label: '影响范围', placeholder: '选择 impact_area.tif' },
]
alongFileItems.forEach(item => {
  alongFiles[item.key] = null
  alongFileNames[item.key] = ''
})
const handleAlongFile = (key, uploadFile, uploadFiles) => {
  const f = (uploadFiles && uploadFiles[0]?.raw) || uploadFile.raw || uploadFile
  alongFiles[key] = f
  alongFileNames[key] = f?.name || ''
}
const triggerAlongUpload = key => {
  const el = alongUploadRefs[key]?.$el?.querySelector?.('input[type=file]')
  if (el) el.click()
}
const resetAlongInputs = () => {
  if (isProcessing.value) return
  alongFileItems.forEach(item => {
    alongFiles[item.key] = null
    alongFileNames[item.key] = ''
  })
  Object.values(alongUploadRefs).forEach(refItem => {
    refItem?.clearFiles?.()
    const input = refItem?.$el?.querySelector?.('input[type=file]')
    if (input) input.value = ''
  })
}
const resetTerrainInputs = kind => {
  if (kind === 'along') resetAlongInputs()
  else resetChainInputs()
}

const terrainPolygon = ref([])
const terrainKind = ref('')
const terrainRaise = ref('20')
const terrainDrawing = ref(false)
const terrainRunning = ref(false)
const terrainStatusText = computed(() => {
  if (terrainDrawing.value) return '绘制中：左键逐点、右键结束'
  const n = terrainPolygon.value.length
  return n >= 3 ? '已绘制 ' + n + ' 个顶点' : '尚未绘制封闭范围'
})

const openTerrainRegulation = kind => {
  const cfg = terrainRegulationConfigs.find(item => item.kind === kind)
  if (!cfg) return
  terrainPolygon.value = []
  terrainDrawing.value = false
  terrainKind.value = kind
  terrainRaise.value = kind === 'chain' ? '20' : '15'
  // 每次重新进入功能：清空本面板上一次的输入（两个面板互不影响）
  resetTerrainInputs(kind)
  cfg.visible = true
}

const startTerrainDraw = kind => {
  const cfg = terrainRegulationConfigs.find(item => item.kind === kind)
  terrainKind.value = kind
  terrainPolygon.value = []
  terrainDrawing.value = true
  if (cfg) cfg.visible = false
  $emit('terrainDrawStart', { kind })
  ElMessage({ message: '在地图上左键逐点绘制范围，右键结束，Esc 取消', type: 'info', duration: 5000 })
}

const clearTerrainDraw = () => {
  terrainPolygon.value = []
  terrainDrawing.value = false
  $emit('terrainDrawCancel')
}

// MapHome 手绘结束后回传顶点（WGS84 经纬度数组）
const onTerrainPolygonDrawn = points => {
  terrainPolygon.value = Array.isArray(points) ? points : []
  terrainDrawing.value = false
  const cfg = terrainRegulationConfigs.find(item => item.kind === terrainKind.value)
  if (cfg) cfg.visible = true
}

const onTerrainDrawCancelled = () => {
  terrainDrawing.value = false
  const cfg = terrainRegulationConfigs.find(item => item.kind === terrainKind.value)
  if (cfg) cfg.visible = true
}

// 沿程调控的输入状态（alongFiles / alongFileNames / alongUploadRefs）在上方「调控面板输入状态」区块中独立定义，
// 不再复用冰川泥石流动力学模型弹窗的选择。

// 调控结果反馈：让用户一眼确认「拦挡 / 护底范围」有没有真正作用到这次计算上。
// 后端 run_pro 会回传自检字段：
//   cells          范围落在计算网格内的格数（0 = 范围没落在数据范围内，等于没调控）
//   sourceCells    范围内原始物源格数
//   flowPathCells  范围内出现过流深(>0.05m)的格数（0 = 泥石流没流经这里）
//   flowPathMax    范围内全场最大流深
// 只有 flowPathCells > 0 时，抬高底床才会真正改变下游结果。
const notifyTerrainEdits = (edits, name = '调控范围', meta = null) => {
  const list = Array.isArray(edits) ? edits : []
  const cells = list.reduce((sum, item) => sum + (Number(item && item.cells) || 0), 0)
  const raise = Number(list.length ? list[0].raise : NaN)
  const raiseText = Number.isFinite(raise) ? raise + ' m' : '--'
  if (!(cells > 0)) {
    ElMessage({
      message:
        name +
        '未生效：手绘范围没有落在输入数据覆盖范围内，本次结果与未调控工况一致；请把范围画在泥石流通道上再运行',
      type: 'warning',
      duration: 9000,
      showClose: true,
    })
    return
  }
  // 面积按「栅格真实像元尺寸」算：cells 统计的是栅格格子数，
  // 而 meta.dx/dy 是求解器步长（界面可填，可能与数据像元不一致，例如数据 30m、界面填 20m）
  const cellSize = Number(meta?.cellsize) || 0
  const dx = cellSize > 0 ? cellSize : Number(meta?.dx) || 0
  const dy = cellSize > 0 ? cellSize : Number(meta?.dy) || 0
  const areaText = dx > 0 && dy > 0 ? '（约 ' + ((cells * dx * dy) / 1e6).toFixed(3) + ' km²）' : ''
  const checked = list.filter(item => item && Number.isFinite(Number(item.flowPathCells)))
  const maxOf = key => checked.reduce((m, item) => Math.max(m, Number(item[key]) || 0), 0)
  if (checked.length && checked.every(item => Number(item.flowPathCells) === 0)) {
    ElMessage({
      message:
        name + '已抬高底床 ' + raiseText + ' × ' + cells + ' 格' + areaText +
        '，但本次泥石流没有流经该范围（范围内最大流深 ' + maxOf('flowPathMax').toFixed(2) +
        ' m），对结果几乎没有影响：请把范围画在过流的沟道上再运行',
      type: 'warning',
      duration: 12000,
      showClose: true,
    })
    return
  }
  ElMessage({
    message:
      name + '已生效：底床抬高 ' + raiseText + ' × ' + cells + ' 格' + areaText +
      (checked.length
        ? '，范围内最大流深 ' + maxOf('flowPathMax').toFixed(2) + ' m（泥石流确实流经该范围）'
        : ''),
    type: 'success',
    duration: 9000,
    showClose: true,
  })
}

// 轮询 r.avaflow 计算状态（冰川泥石流动力学模型 / 沿程调控共用）
const waitAvaflowBetaResult = async (jobId, label, regulation = false) => {
  ElMessage({ message: '模型计算已启动，等待结果（约数分钟~十余分钟）...', type: 'info', duration: 0 })
  const startTs = Date.now()
  // 轮询退避：长时间高频轮询叠加地形瓦片请求会把浏览器 socket 缓冲耗尽
  // （控制台报 net::ERR_NO_BUFFER_SPACE），请求失败后指数退避，成功后立即恢复。
  let pollFailures = 0
  let pollHintShown = false
  while (true) {
    await new Promise(r => setTimeout(r, Math.min(5000 * Math.pow(1.6, pollFailures), 20000)))
    let st = null
    try { st = await modelService.getAvaflowBetaStatus(jobId) } catch (e) { st = null }
    if (st) {
      pollFailures = 0
    } else {
      pollFailures += 1
      if (pollFailures >= 3 && !pollHintShown) {
        pollHintShown = true
        ElMessage.closeAll()
        ElMessage({
          message:
            '与后端的状态连接不稳定（浏览器网络缓冲耗尽），已自动降低轮询频率；后端计算仍在继续，稍后可在「历史模拟」中找回结果',
          type: 'warning',
          duration: 8000,
          showClose: true,
        })
      }
    }
    if (st && st.status === 'running') {
      const phaseLabel = st.phase === 'converting' ? '结果转换中' : '模型计算中'
      ElMessage.closeAll()
      ElMessage({ message: phaseLabel + '... ' + (st.progress ?? 0) + '%（已产出 ' + (st.frames || 0) + ' 帧）', type: 'info', duration: 0 })
    }
    if (st && st.status === 'done') {
      ElMessage.closeAll()
      ElMessage({ message: label + ' 完成，输出 ' + (st.frameCount || 0) + ' 帧', type: 'success', duration: 2500 })
      if (regulation) notifyTerrainEdits(st?.terrainEdits, '调控范围', st?.meta)
      $emit('betaLayers', {
        result: {
          status: 'ok',
          outputBase: st.outputBase,
          ascBase: st.ascBase,
          frameFiles: st.frameFiles,
          frameCount: st.frameCount,
          bbox: st.bbox,
          meta: st.meta,
        },
      })
      return true
    }
    if (st && st.status === 'error') {
      ElMessage.closeAll()
      ElMessage({ message: '模拟失败: ' + (st.message || '未知错误'), type: 'error' })
      return false
    }
    if (Date.now() - startTs > 30 * 60 * 1000) {
      ElMessage.closeAll()
      ElMessage({ message: '等待结果超时（30分钟）', type: 'error' })
      return false
    }
  }
}

// 冰川泥石流沿程调控：上传三份栅格 -> 后端抬高 elevation 范围 -> r.avaflow 计算
const submitBetaRegulation = async terrainEdits => {
  const missing = alongFileItems.filter(item => !alongFiles[item.key])
  if (missing.length > 0) {
    ElMessage({
      message: '请先在本面板选择输入数据: ' + missing.map(i => i.label).join('、'),
      type: 'warning',
      duration: 6000,
    })
    return false
  }
  ElMessage({ message: '输入数据上传中...', type: 'info', duration: 0 })
  try {
    const formData = new FormData()
    const map = { elev: 'elev.tif', debris: 'debris.tif', impact: 'impact_area.tif' }
    for (const key of ['elev', 'debris', 'impact']) {
      const f = alongFiles[key]
      if (f) {
        const nf = new File([f], map[key], { type: f.type || 'application/octet-stream' })
        formData.append('files', nf)
      }
    }
    const upResp = await modelService.uploadAvaflowFiles(formData)
    if (!upResp || upResp?.status !== 'ok' || !upResp.jobId) {
      ElMessage.closeAll()
      ElMessage({ message: upResp?.message || '输入数据上传失败', type: 'error' })
      return false
    }
    const accepted = await modelService.runAvaflowBeta({ jobId: upResp.jobId, terrainEdits })
    if (!accepted || accepted.status !== 'accepted') {
      ElMessage.closeAll()
      ElMessage({ message: accepted?.message || '启动计算失败', type: 'error' })
      return false
    }
    return await waitAvaflowBetaResult(accepted.jobId || upResp.jobId, '冰川泥石流沿程调控', true)
  } catch (error) {
    ElMessage.closeAll()
    const msg = error?.response?.data || error?.message || error
    ElMessage({ message: '沿程调控计算失败: ' + (typeof msg === 'string' ? msg : JSON.stringify(msg)), type: 'error' })
    console.error('submitBetaRegulation error:', error)
    return false
  }
}

const submitTerrainRegulation = async kind => {
  if (terrainPolygon.value.length < 3) {
    ElMessage({ message: '请先在地图上手绘一个封闭范围（至少 3 个顶点）', type: 'warning', duration: 4000 })
    return
  }
  const raise = proNumber(terrainRaise.value, NaN)
  if (!Number.isFinite(raise) || raise <= 0) {
    ElMessage({ message: '请输入大于 0 的加高值（米）', type: 'warning', duration: 4000 })
    return
  }
  const terrainEdits = [
    {
      polygon: terrainPolygon.value.map(p => [Number(p[0]), Number(p[1])]),
      raise,
    },
  ]
  terrainRunning.value = true
  try {
    // 断链调控走冰岩崩动力学模型（Pro），沿程调控走冰川泥石流动力学模型（r.avaflow）
    const ok =
      kind === 'along'
        ? await submitBetaRegulation(terrainEdits)
        : await submitChainRegulation(terrainEdits)
    if (ok === true) {
      const cfg = terrainRegulationConfigs.find(item => item.kind === kind)
      if (cfg) cfg.visible = false
    }
  } finally {
    terrainRunning.value = false
  }
}

defineExpose({ onTerrainPolygonDrawn, onTerrainDrawCancelled })

// 参数传回后端 -> 后端调用数值内核 -> 输出 ASC 帧 -> 前端渲染
// 传参化改造：冰岩崩动力学模型与灾害链断链调控各自使用本面板的输入状态，互不共享
const runProJob = async (config, extra = {}) => {
  const {
    files,
    fileItems,
    sourceCrs,
    anchorLon,
    anchorLat,
    params,
    label,
    partialHint,
    regulation = false,
  } = config
  if (floodRunning.value) {
    ElMessage({ message: '正在计算中，请稍候...', type: 'info' })
    return false
  }
  floodRunning.value = true
  ElMessage({ message: '数值计算启动中...', type: 'info', duration: 0 })
  try {
    // 选了三份输入数据就先上传（后端用上传数据计算）；都不选则用内置示例数据
    const chosen = fileItems.filter(item => files[item.key])
    if (chosen.length > 0 && chosen.length < fileItems.length) {
      ElMessage.closeAll()
      ElMessage({ message: partialHint, type: 'warning', duration: 4000 })
      return false
    }
    let jobId = ''
    if (chosen.length === fileItems.length) {
      ElMessage.closeAll()
      ElMessage({ message: '输入数据上传中...', type: 'info', duration: 0 })
      const formData = new FormData()
      const crsValue = String(sourceCrs || '').trim()
      const anchorLonValue = String(anchorLon || '').trim()
      const anchorLatValue = String(anchorLat || '').trim()
      if (crsValue) formData.append('sourceCrs', crsValue)
      if (anchorLonValue) formData.append('anchorLon', anchorLonValue)
      if (anchorLatValue) formData.append('anchorLat', anchorLatValue)
      const keepExts = ['.tif', '.tiff', '.asc', '.txt']
      for (const item of fileItems) {
        const f = files[item.key]
        const rawName = String((f && f.name) || '')
        const dot = rawName.lastIndexOf('.')
        const lowerExt = dot >= 0 ? rawName.slice(dot).toLowerCase() : ''
        // 保留原始扩展名：txt / asc（ESRI ASCII）直接透传后端，不再强制改成 .tif
        const ext = keepExts.includes(lowerExt) ? lowerExt : '.tif'
        formData.append(
          item.key,
          new File([f], item.key + ext, {
            type: f.type || 'application/octet-stream',
          }),
        )
      }
      const up = await modelService.uploadProFiles(formData)
      if (!up || up.status !== 'ok' || !up.jobId) {
        ElMessage.closeAll()
        ElMessage({ message: up?.message || '输入数据上传失败', type: 'error' })
        return false
      }
      jobId = up.jobId

      // 输入探测提示：模型里泥石流层厚度 = zB - zL，若两者相同则该层为空
      const probe = up.probe || null
      const probeThick = Number(probe && probe.maxThickness)
      const probeWater = Number(probe && probe.maxWaterDepth)
      if (Number.isFinite(probeThick) && probeThick <= 1e-6) {
        ElMessage({
          message:
            '提示：输入 zb 与 zl 完全相同，模型里泥石流层厚度 = zB - zL = 0，total 渲染出来的只是水层；如需泥石流效果请提供真正的灾前/灾后地形。',
          type: 'warning',
          duration: 9000,
        })
      } else if (Number.isFinite(probeThick) && probeThick < 5) {
        ElMessage({
          message:
            '提示：本次物源最大厚度仅 ' + probeThick.toFixed(2) + ' m' +
            (Number.isFinite(probeWater) ? '（水层最大 ' + probeWater.toFixed(2) + ' m）' : '') +
            '，泥石流层体积很小，结果可能接近“原地铺展”。',
          type: 'warning',
          duration: 9000,
        })
      }
    }

    const anchorLonNum = proNumber(anchorLon, NaN)
    const anchorLatNum = proNumber(anchorLat, NaN)
    const accepted = await modelService.runProModel({
      jobId,
      sourceCrs: String(sourceCrs || '').trim(),
      ...(Number.isFinite(anchorLonNum) && Number.isFinite(anchorLatNum)
        ? { anchorLon: anchorLonNum, anchorLat: anchorLatNum }
        : {}),
      ...(Array.isArray(extra.terrainEdits) && extra.terrainEdits.length
        ? { terrainEdits: extra.terrainEdits }
        : {}),
      params: {
        bed: proNumber(params.bed, 0.05),
        nn: proNumber(params.nn, 0.0125),
        dx: proNumber(params.dx, 0),
        dy: proNumber(params.dy, 0),
        rous: proNumber(params.rous, 2700),
        rouf: proNumber(params.rouf, 1000),
        interval: proNumber(params.interval, 10),
        tmax: proNumber(params.Tmax, 200),
        // 物源层厚度比例（% -> 0~1）：100 = 不削薄
        depthScale: Math.min(1, Math.max(0, proNumber(params.depthScale, 30) / 100)),
        maxFrames: 40,
        field: 'solid',
      },
    })
    if (!accepted || accepted.status !== 'accepted') {
      ElMessage.closeAll()
      ElMessage({ message: accepted?.message || '启动计算失败', type: 'error' })
      return false
    }
    ElMessage.closeAll()
    // 长时段模拟（Tmax 大）墙钟耗时成倍增长：按「约 9 秒墙钟 / 1 秒模拟」估算前端等待上限，
    // 最少 60 分钟、最多 4 小时，避免结果还没出来就先报「等待超时」。
    // 后端同口径（12*Tmax+300s）会先一步终止进程并把原因写进 message，因此前端再多留 300s，
    // 让用户看到的是「后端为何没算完」，而不是笼统的「等待结果超时」。
    const proTmaxHint = proNumber(params.Tmax, 200)
    const proWaitLimitMs = Math.min(
      4 * 60 * 60 * 1000,
      Math.max(60 * 60 * 1000, (Math.round(proTmaxHint * 12) + 600) * 1000),
    )
    ElMessage({
      message:
        proTmaxHint > 300
          ? '数值计算已启动：模拟 ' +
            proTmaxHint +
            ' s 预计约 ' +
            Math.max(1, Math.round((proTmaxHint * 9) / 60)) +
            ' 分钟（最长等待 ' +
            Math.round(proWaitLimitMs / 60000) +
            ' 分钟），请保持页面打开'
          : '数值计算已启动（约需数分钟），请稍候...',
      type: 'info',
      duration: 0,
    })

    const startTs = Date.now()
    // 轮询退避：同 waitAvaflowBetaResult，避免 net::ERR_NO_BUFFER_SPACE 把结果读取打断。
    let pollFailures = 0
    let pollHintShown = false
    while (true) {
      await new Promise(r => setTimeout(r, Math.min(4000 * Math.pow(1.6, pollFailures), 20000)))
      let st = null
      try {
        st = await modelService.getProStatus(accepted.jobId)
      } catch (e) {
        st = null
      }
      if (st) {
        pollFailures = 0
      } else {
        pollFailures += 1
        if (pollFailures >= 3 && !pollHintShown) {
          pollHintShown = true
          ElMessage.closeAll()
          ElMessage({
            message:
              '与后端的状态连接不稳定（浏览器网络缓冲耗尽），已自动降低轮询频率；计算仍在后端继续，稍后可在「历史模拟」中找回本次结果',
            type: 'warning',
            duration: 8000,
            showClose: true,
          })
        }
      }
      if (st && st.status === 'running') {
        ElMessage.closeAll()
        ElMessage({
          message: '计算中 ' + Math.round(st.progress ?? 0) + '%',
          type: 'info',
          duration: 0,
        })
        continue
      }
      if (st && st.status === 'done') {
        ElMessage.closeAll()
        ElMessage({
          message: label + '完成，输出 ' + (st.frameCount || 0) + ' 帧',
          type: 'success',
          duration: 2500,
        })
        if (regulation) notifyTerrainEdits(st?.meta?.terrainEdits, '拦挡范围', st?.meta)
        $emit('proLayers', {
          result: {
            status: 'ok',
            outputBase: st.outputBase,
            ascBase: st.ascBase,
            frameFiles: st.frameFiles,
            frameCount: st.frameCount,
            bbox: st.bbox,
            meta: st.meta,
          },
        })
        return true
      }
      if (st && st.status === 'error') {
        ElMessage.closeAll()
        ElMessage({ message: label + '计算失败: ' + (st.message || '未知错误'), type: 'error' })
        return false
      }
      if (Date.now() - startTs > proWaitLimitMs) {
        ElMessage.closeAll()
        ElMessage({
          message:
            '等待结果超时（' +
            Math.round(proWaitLimitMs / 60000) +
            '分钟），后端计算可能仍在继续，可稍后重新运行或调小「计算时间」',
          type: 'error',
        })
        return false
      }
    }
  } catch (error) {
    ElMessage.closeAll()
    const msg = error?.response?.data || error?.message || error
    ElMessage({
      message: label + '计算失败: ' + (typeof msg === 'string' ? msg : JSON.stringify(msg)),
      type: 'error',
    })
    console.error('runProJob error:', error)
    return false
  } finally {
    floodRunning.value = false
  }
}

// 冰岩崩动力学模型：使用模型弹窗自己的输入状态
const submitForm2 = async (extra = {}) =>
  runProJob(
    {
      files: proFiles,
      fileItems: proFileItems,
      sourceCrs: proSourceCrs.value,
      anchorLon: proAnchorLon.value,
      anchorLat: proAnchorLat.value,
      params: form2,
      label: '冰岩崩动力学模型',
      partialHint: 'zb / zl / hw 三份数据要么都选，要么都不选（不选用内置示例数据）',
    },
    extra,
  )

// 灾害链断链调控：使用断链调控面板自己的输入状态（与冰岩崩动力学模型互不影响）
const submitChainRegulation = async terrainEdits =>
  runProJob(
    {
      files: chainFiles,
      fileItems: chainFileItems,
      sourceCrs: chainSourceCrs.value,
      anchorLon: chainAnchorLon.value,
      anchorLat: chainAnchorLat.value,
      params: chainForm,
      label: '灾害链断链调控',
      partialHint: 'zb / zl / hw 三份数据要么都选，要么都不选（不选用内置示例数据）',
      regulation: true,
    },
    { terrainEdits },
  )

// 关闭正方形的函数
const closeSquare = () => {
  squareStore.closeSquare()
}

// 动画生命周期钩子

const beforeEnter = el => {
  el.style.opacity = '0'
  el.style.transform = 'scale(0)'
}

const enter = (el, done) => {
  el.offsetHeight // 强制重排，确保动画从初始状态开始
  el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
  el.style.opacity = '1'
  el.style.transform = 'scale(1)'
  done()
}

const leave = (el, done) => {
  el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
  el.style.opacity = '0'
  el.style.transform = 'scale(0)'
  done()
}
//触发文件选择
const triggerUpload = () => {
  // 获取原生文件input元素
  uploadRef.value?.$el.querySelector('input[type=file]').click()
}

const handleFileChange = file => {
  selectedDisplFile.value = file.raw || file
  fileName_inverseV.value = file.name
}
const triggerUploadGBM = () => {
  // 打开文件选择
  uploadRefGBM.value?.$el.querySelector('input[type=file]').click()
}

const handleFileChangeGBM = (uploadFile, uploadFiles) => {
  // uploadFiles 是所有选中的文件
  fileGBM.value = uploadFiles.map(f => f.raw || f)
  fileNameGBM.value = uploadFiles.map(f => f.name).join(', ')
}

const resetGbmUploadBatch = () => {
  gbmUploadBatch.active = false
  gbmUploadBatch.total = 0
  gbmUploadBatch.succeeded = 0
  gbmUploadBatch.savedFiles = []
}

const clearGbmUpload = () => {
  fileGBM.value = []
  fileNameGBM.value = ''
  uploadRefGBM.value?.clearFiles()
}

const submitGBM = async () => {
  if (!fileGBM.value || fileGBM.value.length === 0) {
    ElMessage({
      message: '请先选择要上传的 shapefile 相关文件',
      type: 'warning',
    })
    return
  }
  if (gbmSubmitting.value) {
    ElMessage({ message: '模型正在计算中，请稍候...', type: 'warning' })
    return
  }
  if (!fileGBM.value.some(f => /\.shp$/i.test(f?.name || ''))) {
    ElMessage({
      message: '请把 shp / dbf / shx / prj 一起选中后再提交',
      type: 'warning',
    })
    return
  }

  dialogVisibleGBM.value = false
  gbmSubmitting.value = true
  gbmUploadBatch.active = true
  gbmUploadBatch.total = fileGBM.value.length
  gbmUploadBatch.succeeded = 0
  gbmUploadBatch.savedFiles = []

  ElMessage({ message: '上传中，请稍候...', type: 'info', duration: 0 })
  try {
    //element封装的submit方法
    uploadRefGBM.value?.submit()
  } catch (err) {
    ElMessage.closeAll()
    ElMessage({ message: '上传失败：' + (err.message || err), type: 'error' })
    resetGbmUploadBatch()
    gbmSubmitting.value = false
  }
}

// el-upload 成功回调：每个文件各回调一次，等这一批全部上传完成后只推理一次
const handleUploadSuccessGBM = async (response, file, fileList) => {
  if (!gbmUploadBatch.active) return

  if (response?.code !== 200) {
    ElMessage.closeAll()
    ElMessage({
      message: '上传失败：' + (response?.message || '未知错误'),
      type: 'error',
    })
    resetGbmUploadBatch()
    clearGbmUpload()
    gbmSubmitting.value = false
    return
  }

  if (Array.isArray(response.files)) {
    gbmUploadBatch.savedFiles.push(...response.files)
  }
  gbmUploadBatch.succeeded += 1
  // 还有文件没上传完，先不发起推理
  if (gbmUploadBatch.succeeded < gbmUploadBatch.total) return

  const shpEntry = gbmUploadBatch.savedFiles.find(f =>
    /\.shp$/i.test(f?.savedPath || ''),
  )
  if (!shpEntry) {
    ElMessage.closeAll()
    ElMessage({
      message: '未检测到 .shp 文件，请重新选择 shp / dbf / shx / prj',
      type: 'error',
    })
    resetGbmUploadBatch()
    clearGbmUpload()
    gbmSubmitting.value = false
    return
  }

  ElMessage.closeAll()
  ElMessage({ message: '上传完成，正在计算...', type: 'info', duration: 0 })
  console.log('GBM upload success resp:', response)

  try {
    const resp = await modelService.postGBM([shpEntry], form_BGM)

    ElMessage.closeAll()
    ElMessage({ message: '后端处理完成，正在加载图层', type: 'success' })
    $emit('openLayers', {
      gbmUpload: true,
      uploadResp: { files: gbmUploadBatch.savedFiles },
      processResp: resp.data,
    })
  } catch (err) {
    const detail = err?.response?.data ?? err?.message ?? '网络或服务错误'
    ElMessage.closeAll()
    ElMessage({
      message:
        '后端处理失败：' +
        (typeof detail === 'string'
          ? detail
          : JSON.stringify(detail)
        ).slice(0, 200),
      type: 'error',
    })
    console.error('调用 Spring Boot 处理 shp 失败', err)
  } finally {
    resetGbmUploadBatch()
    clearGbmUpload()
    gbmSubmitting.value = false
  }
}

// el-upload 错误回调
const handleUploadErrorGBM = (err, file, fileList) => {
  if (!gbmUploadBatch.active) return
  resetGbmUploadBatch()
  ElMessage.closeAll()
  ElMessage({
    message: '上传失败：' + (err?.message || '网络或后端错误'),
    type: 'error',
  })
  console.error('GBM upload error:', err)
  clearGbmUpload()
  gbmSubmitting.value = false
}

const submit_inverseV = async () => {
  try {
    ElMessage({ message: '运行中!', type: 'success' })
    if (!selectedDisplFile.value) {
      ElMessage({ message: '请先选择位移文件', type: 'warning' })
      return
    }

    const formData = new FormData()
    formData.append('file', selectedDisplFile.value)
    const uploadResponse = await axios.post('/node/displ', formData, {
      timeout: 300000,
    })
    const uploadedFileIdValue = uploadResponse.data?.fileId
    const params = { form_inverseV }
    if (uploadedFileIdValue) params.fileId = uploadedFileIdValue
    // await new Promise(resolve => setTimeout(resolve, 1000)) // 等待1秒
    const response = await axios.get('/node/displ_file', { params })
    console.log('执行结果:', response.data.rt_json)
    // console.log('执行结果:', response.data)
    // console.log('执行结果:', response.data.fileProcessing.rt_json.rt)

    const forecast = response.data.fileProcessing.rt_json
    const rt = forecast.rt
    const time = forecast.time || forecast.check_time
    const status = forecast.status
    const databaseOperation = response.data.databaseOperation
    const pointId = response.data.databaseOperation.pointId
    const lon = response.data.databaseOperation.coordinates.longitude
    const lat = response.data.databaseOperation.coordinates.latitude
    const params_return = { pointId, lon, lat, rt, time, status }
    // console.log(databaseOperation)
    // console.log(lon, lat)
    // if (rt < 24) {
    //   console.log("红色警报！")
    // } else if (rt >= 24 && rt < 48) {
    //   console.log("橙色警报！")
    // }
    // else if (rt >= 48 && rt < 72) {
    //   console.log("黄色警报!")
    // } else if (rt >= 72 && rt < 96) {
    //   console.log("蓝色警报！")
    // } else {
    //   console.log("未有险情！")
    // }
    $emit('forecast', params_return)
  } catch (error) {
    console.error('位移预警计算失败:', error.response?.data || error.message)
    ElMessage({
      message: error.response?.data?.message || '位移预警计算失败',
      type: 'error',
    })
  }
}

const triggerUploadSeismic = () => {
  // 打开文件选择
  uploadRefSeismic.value?.$el.querySelector('input[type=file]').click()
}

const handleFileChangeSeismic = (uploadFile, uploadFiles) => {
  // uploadFiles 是所有选中的文件
  fileSeismic.value = uploadFiles.map(f => f.raw || f)
  fileNameSeismic.value = uploadFiles.map(f => f.name).join(', ')
}

const submitSeismic = async () => {
  if (!fileSeismic.value || fileSeismic.value.length === 0) {
    ElMessage({
      message: '请先选择要上传的 shapefile 相关文件',
      type: 'warning',
    })
    return
  }
  dialogVisibleSeismic.value = false
  ElMessage({ message: '上传中，请稍候...', type: 'info', duration: 0 })
  try {
    uploadRefSeismic.value?.submit()
  } catch (err) {
    ElMessage.closeAll()
    ElMessage({ message: '上传失败：' + (err.message || err), type: 'error' })
  }
}
// el-upload 成功回调
const handleUploadSuccessSeismic = async (response, file, fileList) => {
  ElMessage.closeAll()
  if (response?.code !== 200) {
    ElMessage({
      message: '上传失败：' + (response?.message || '未知错误'),
      type: 'error',
    })
    return
  }

  ElMessage({
    message: '上传成功，正在请求后端处理...',
    type: 'info',
    duration: 0,
  })
  // console.log('Seismic upload success resp:', response)

  const savedFile = response.file // 单文件
  // console.log(savedFile)
  // console.log(file, fileList)
  try {
    const resp = await modelService.postSeismic(savedFile, formSeismic)

    ElMessage.closeAll()
    ElMessage({ message: '后端处理完成，正在加载结果', type: 'success' })

    // 不在子组件直接操作 Cesium，改为发事件给父组件由父组件渲染
    const detected = resp?.detected || false
    const echarts_data = JSON.parse(resp.echarts_data)
    // const data = await resp.json() // 将响应转换为 JSON
    // 使用前端输入的经纬度，而不是后端返回的
    const payload = {
      detected,
      lon: Number(formSeismic.longitude) || 97.5,
      lat: Number(formSeismic.latitude) || 31.0,
      info: resp,
      echarts_data,
    }
    // 发出事件，父组件监听 seismicResult
    $emit('seismicResult', payload)

    // 如果需要保留弹幕或内部状态，可在这里处理
    if (detected) {
      showBarrage.value = true
      setTimeout(() => {
        showBarrage.value = false
      }, 5000)
    }
  } catch (err) {
    ElMessage.closeAll()
    ElMessage({
      message: '后端处理失败：' + (err?.message || '网络或服务错误'),
      type: 'error',
    })
    console.error('调用后端处理 excel 失败', err)
  } finally {
    fileSeismic.value = []
    fileNameSeismic.value = ''
    uploadRefSeismic.value?.clearFiles()
  }
}

const handleUploadErrorSeismic = (err, file, fileList) => {
  ElMessage.closeAll()
  ElMessage({ message: '上传失败', type: 'error' })
  console.error('Seismic upload error:', err)
  fileSeismic.value = null
  fileNameSeismic.value = ''
  uploadRefSeismic.value?.clearFiles()
}

// ============ [新增] 重新打开输入弹窗时自动重置表单，避免残留上一次提交的数据 ============
// 说明：只在弹窗打开瞬间执行；若该模型正在计算中（loading/running）则跳过，不打断运行中的任务。
// 如需关闭该行为：删除对应 <el-dialog> 上的 @open 绑定即可（函数可保留）。

// 风险源定量识别与表征模型（TRIGRS）
const resetTrigrsInputs = () => {
  Object.assign(form, {
    name: '',
    color: 'dangerLevel',
    time: [],
    rsl: '1.0e-6',
    depth: '3.0',
    zmax: '2.4',
    diffus: '1.32e-03',
    ksat: '1.32e-05',
  })
}

// 冰川泥石流易发性预测模型（LightGBM）
const resetGbmInputs = () => {
  Object.assign(form_BGM, {
    aspect: '150',
    curvature: '0.002',
    fault_distance: '30000',
    ndvi: '0.001',
    rainfall: '700',
    relief_amplitude: '250',
  })
  fileNameGBM.value = ''
  fileGBM.value = null
  uploadRefGBM.value?.clearFiles?.()
}

// 冰岩崩动力学模型（Pro）
// 冰岩崩动力学模型：历史模拟记录（静态目录里的历次运行结果）
const proHistoryVisible = ref(false)
const proHistoryLoading = ref(false)
const proHistoryItems = ref([])

/** 历史记录的工况描述：地形调控 / 物源削薄比例 / 基准工况 */
const proHistoryCondition = item => {
  const parts = []
  if (item && item.terrainEdited) parts.push('地形调控')
  const scale = item && item.depthScale != null ? Number(item.depthScale) : NaN
  if (Number.isFinite(scale) && scale < 1) {
    parts.push('物源 ' + Math.round(scale * 100) + '%')
  }
  if (!parts.length) parts.push('基准工况')
  return parts.join(' + ')
}

/** 该记录是否可回放：需要帧文件 + 网格尺寸 + 中心经纬度（老任务可能缺少坐标） */
const proHistoryPlayable = item => {
  const meta = (item && item.result && item.result.meta) || {}
  const lon = meta.centerLon
  const lat = meta.centerLat
  return (
    Number(item && item.frameCount) > 0 &&
    Number(meta.ncols) > 0 &&
    Number(meta.nrows) > 0 &&
    Number(meta.cellsize) > 0 &&
    lon != null &&
    lat != null &&
    Number.isFinite(Number(lon)) &&
    Number.isFinite(Number(lat))
  )
}

/** 打开历史记录列表（后端扫描 nginx 静态目录下的 pro 输出） */
const openProHistory = async () => {
  proHistoryVisible.value = true
  proHistoryLoading.value = true
  try {
    const resp = await modelService.getProHistory({ limit: 50 })
    proHistoryItems.value = Array.isArray(resp && resp.items) ? resp.items : []
  } catch (e) {
    proHistoryItems.value = []
    ElMessage({ message: '历史记录读取失败: ' + (e?.message || e), type: 'error' })
  } finally {
    proHistoryLoading.value = false
  }
}

/** 加载某条历史记录：复用实时计算的渲染链路（proLayers） */
const loadProHistory = item => {
  if (!proHistoryPlayable(item)) {
    ElMessage({
      message: '该记录缺少网格坐标信息，无法在三维场景中回放',
      type: 'warning',
    })
    return
  }
  proHistoryVisible.value = false
  $emit('proLayers', { result: { status: 'ok', ...item.result } })
  ElMessage({
    message: '已加载 ' + (item.createdAtText || item.jobId) + ' 的模拟结果',
    type: 'success',
    duration: 2500,
  })
}

const resetFloodProInputs = () => {
  if (floodRunning.value) return
  Object.assign(form2, {
    bed: '0.05',
    nn: '0.0125',
    dx: '20',
    dy: '20',
    rous: '2700',
    rouf: '1000',
    interval: '10',
    Tmax: '200',
    depthScale: '30',
    field: 'solid',
  })
  new Set([...Object.keys(proFiles), ...Object.keys(proFileNames)]).forEach(key => {
    delete proFiles[key]
    delete proFileNames[key]
  })
  proAnchorLon.value = '95.0020'
  proAnchorLat.value = '30.2354'
  proSourceCrs.value = 'EPSG:32646'
  Object.values(proUploadRefs).forEach(refItem => refItem?.clearFiles?.())
}

// 冰岩崩动力学模型（测试，界面已隐藏）
const resetFloodTestInputs = () => {
  Object.assign(form2Test, {
    bed: '24',
    nn: '0.0125',
    dx: '20',
    dy: '20',
    rous: '2700',
    rouf: '1000',
    interval: '10',
    Tmax: '100',
  })
  renderMethod.value = 'debrisflow'
}

// 冰岩崩起动模型（默认 / 反演 / 楔形三种模式共用弹窗）
const resetAvainitInputs = () => {
  Object.assign(form_avainit, {
    slope_angle: '60',
    slide_angle: '15',
    cohesion: '15',
    friction_angle: '20',
    rock_density: '20',
    permeability: '0.0001',
    ice_thickness: '4',
    fissure_height: '10',
    melt_duration: '240',
    slide_length: '20',
  })
  Object.assign(form_bedding_inverted, {
    melt_duration: '240',
    slope_angle: '30',
    inverse_angle: '70',
    ice_thickness: '5',
    slope_height: '10',
    bedding_space: '20',
    cohesion: '15',
    friction_angle: '20',
    rock_density: '20',
    permeability: '0.0001',
  })
  Object.assign(form_bedding_wedget, {
    slope_angle: '55',
    normal_vector: '1,1,1',
    cohesion: '15',
    friction_angle: '20',
    rock_density: '20',
    permeability: '0.0001',
    ice_thickness: '5',
    slope_height: '10',
    square: '200',
    fracture: '0.5',
    melt_duration: '240',
  })
  form_avainit_location.longitude = '95.0020'
  form_avainit_location.latitude = '30.2354'
  radio_avainit.value = 1
}

// 泥石流启动物源计算模型（SDP）
const resetSdpInputs = () => {
  if (sdpLoading.value) return
  formSDP.ice_content = '0.2'
  fileNameRain.value = ''
  fileNameTemp.value = ''
  fileNameOutput.value = ''
  fileRainPath.value = ''
  fileTempPath.value = ''
  fileOutputPath.value = ''
  uploadRainRef.value?.clearFiles?.()
  uploadTempRef.value?.clearFiles?.()
  uploadOutputRef.value?.clearFiles?.()
}

// 冰川泥石流动力学模型（r.avaflow beta 内核，逐帧输出 hflow）
// 历史模拟记录：后端扫描 nginx 静态目录 avaflow_beta/ 下的历次结果直接回放
const betaHistoryVisible = ref(false)
const betaHistoryLoading = ref(false)
const betaHistoryItems = ref([])

/** 工况描述：地形调控 / 基准工况 */
const betaHistoryCondition = item => (item && item.terrainEdited ? '地形调控' : '基准工况')

/** 该记录是否可回放：需要帧文件 + 网格尺寸 + 中心经纬度（老任务可能缺少坐标） */
const betaHistoryPlayable = item => {
  const meta = (item && item.result && item.result.meta) || {}
  const lon = meta.centerLon
  const lat = meta.centerLat
  return (
    Number(item && item.frameCount) > 0 &&
    Number(meta.ncols) > 0 &&
    Number(meta.nrows) > 0 &&
    Number(meta.cellsize) > 0 &&
    lon != null &&
    lat != null &&
    Number.isFinite(Number(lon)) &&
    Number.isFinite(Number(lat))
  )
}

/** 打开历史记录列表 */
const openBetaHistory = async () => {
  betaHistoryVisible.value = true
  betaHistoryLoading.value = true
  try {
    const resp = await modelService.getAvaflowBetaHistory({ limit: 50 })
    betaHistoryItems.value = Array.isArray(resp && resp.items) ? resp.items : []
  } catch (e) {
    betaHistoryItems.value = []
    ElMessage({ message: '历史记录读取失败: ' + (e?.message || e), type: 'error' })
  } finally {
    betaHistoryLoading.value = false
  }
}

/** 加载某条历史记录：复用实时计算的渲染链路（betaLayers） */
const loadBetaHistory = item => {
  if (!betaHistoryPlayable(item)) {
    ElMessage({
      message: '该记录缺少网格坐标信息，无法在三维场景中回放',
      type: 'warning',
    })
    return
  }
  betaHistoryVisible.value = false
  dialogBeta.value = false
  $emit('betaLayers', { result: { status: 'ok', ...item.result } })
  ElMessage({
    message: '已加载 ' + (item.createdAtText || item.jobId) + ' 的模拟结果',
    type: 'success',
    duration: 2500,
  })
}

const resetBetaInputs = () => {
  if (isProcessing.value) return
  new Set([...Object.keys(betaFiles), ...Object.keys(betaFileNames)]).forEach(key => {
    delete betaFiles[key]
    delete betaFileNames[key]
  })
  Object.values(betaUploadRefs).forEach(refItem => refItem?.clearFiles?.())
}

// 全域风险脆弱性分析
const resetQuanYuInputs = () => {
  if (quanYuLoading.value) return
  new Set([...Object.keys(quanYuFiles), ...Object.keys(quanYuFileNames)]).forEach(key => {
    delete quanYuFiles[key]
    delete quanYuFileNames[key]
  })
  Object.values(uploadRefsQuanYu).forEach(refItem => refItem?.clearFiles?.())
}

// 基于位移监测滑坡预警（测试版）
const resetInverseVInputs = () => {
  Object.assign(form_inverseV, {
    name: '',
    longitude: '',
    latitude: '',
    file: '',
  })
  fileName_inverseV.value = ''
  selectedDisplFile.value = null
  uploadRef.value?.clearFiles?.()
}

// 冰川泥石流监测预警模型（机器学习 / 深度学习共用弹窗）
const resetSeismicInputs = () => {
  if (dlLoading.value) return
  Object.assign(formSeismic, {
    threshold: 2.5,
    short_window: 30,
    long_window: 240,
    segment_duration: 10,
    total_duration: 60,
    sampling_rate: 100,
    longitude: 97.5,
    latitude: 31.0,
  })
  Object.assign(formSeismicDL, {
    voltageColumn: 'Voltage_mV',
    longitude: '97.5',
    latitude: '31.0',
  })
  fileNameSeismic.value = ''
  fileNameSeismicDL.value = ''
  fileSeismic.value = null
  fileSeismicDL.value = null
  seismicModelType.value = 'ml'
  uploadRefSeismic.value?.clearFiles?.()
  uploadRefSeismicDL.value?.clearFiles?.()
}
</script>
<style lang="scss" scoped>
/* 模型集数据卡片的勾选弹窗：弹窗节点挂在 body 上，样式需用 :global 才能命中 */
:global(.data-layer-popover.el-popover.el-popper) {
  background: linear-gradient(180deg, rgba(7, 28, 56, 0.97), rgba(4, 16, 34, 0.97));
  border: 1px solid rgba(56, 225, 255, 0.55);
  box-shadow: 0 0 18px rgba(56, 225, 255, 0.25);
  border-radius: 6px;
  padding: 10px 12px;
  color: #eaf6ff;
}

:global(.data-layer-popover.el-popper .el-popper__arrow::before) {
  background: rgba(7, 28, 56, 0.97);
  border: 1px solid rgba(56, 225, 255, 0.55);
}

:global(.data-layer-popover .el-checkbox) {
  display: flex;
  align-items: center;
  height: 26px;
  margin-right: 0;
}

:global(.data-layer-popover .el-checkbox__label) {
  color: #dbeaf7;
  font-size: 13px;
}

:global(.data-layer-popover .el-checkbox__inner) {
  background-color: transparent;
  border-color: rgba(56, 225, 255, 0.65);
}

:global(.data-layer-popover .el-checkbox__input.is-checked .el-checkbox__inner),
:global(.data-layer-popover .el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: #1e88e5;
  border-color: #38e1ff;
}

:global(.data-layer-popover .el-checkbox__input.is-checked .el-checkbox__inner::after) {
  border-color: #ffffff;
}

:global(.data-layer-popover .el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #38e1ff;
}

:global(.data-layer-popover .el-select__wrapper) {
  background-color: rgba(255, 255, 255, 0.06);
  box-shadow: none;
  border: 1px solid rgba(56, 225, 255, 0.35);
}

:global(.data-layer-popover .el-select__selected-item),
:global(.data-layer-popover .el-select__placeholder) {
  color: #eaf6ff;
}

/* 模型集里的静态数据卡片（勾选UI） */
.data-layer-count {
  margin-left: 6px;
  color: #38e1ff;
  font-size: 12px;
}
.data-layer-panel {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.data-layer-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #38e1ff;
  font-size: 14px;
}
.data-layer-panel-actions a {
  margin-left: 10px;
  font-size: 12px;
  color: #38e1ff;
  text-decoration: none;
}

.data-layer-panel-actions a:hover {
  color: #8ceaff;
}
.data-layer-panel-hint {
  margin: 2px 0 4px;
  font-size: 12px;
  line-height: 16px;
  color: #9fc6e6;
}
.data-layer-time {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
  font-size: 12px;
  color: #9fc6e6;
}

:deep(.el-button.is-plain) {
  --el-fill-color-blank: transparent;
  --el-border-color: transparent;
  --el-button-hover-border-color: transparent;
  --el-button-text-color: white; //
  --el-font-family:
    'Source Han Sans', 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  font-size: 15px;
  padding: 0;
  /* 模型条目变多：压缩按钮高度，让左侧面板装下全部分类（超出可滚动） */
  height: 28px;
  line-height: 28px;
  // --el-color-primary: transparent;
}

:deep(.el-checkbox) {
  margin-right: 10px;
}

:deep(.el-checkbox__label) {
  padding-left: 2px;
}

.left {
  position: absolute;
  // max-height: 850px;
  top: 62px;
  left: 10px;
  background: url('../assets/img/left_theme_3.png');
  background-size: cover;
  width: 400px;
  height: 819px;
}

.name {
  position: absolute;
  top: 45px;
  left: 15px;
  writing-mode: vertical-rl;
  /* 将文字竖向排列，从上到下 */
  // text-orientation: upright; /* 旋转文字，使其从下到上显示 */
  // white-space: nowrap; /* 防止文字换行 */
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
  // transform: rotate(0deg); /* 旋转文字，使其从下到上显示 */
}

.left .total_theme {
  position: absolute;
  top: 50px;
  left: 60px;
  /* 模型/数据卡片变多：内容超出时面板内滚动，不再溢出背景边框 */
  max-height: 745px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 6px;
}

.left .total_theme::-webkit-scrollbar {
  width: 6px;
}

.left .total_theme::-webkit-scrollbar-thumb {
  background: rgba(56, 225, 255, 0.45);
  border-radius: 3px;
}

.left .total_theme::-webkit-scrollbar-thumb:hover {
  background: rgba(56, 225, 255, 0.75);
}

.left .total_theme::-webkit-scrollbar-track {
  background: transparent;
}

.left .total_theme .theme {
  margin: 10px 0;
}

.theme .title {
  width: 300px;
  text-align: left;
  padding-left: 10px;
  line-height: 32px;
  font-weight: 500;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 1);
  font-size: 20px;
  // background: url(../assets/img/left_theme_1.png);
}

#bar {
  width: 310px;
  display: block;
  /* 将图片设置为块级元素 */
  // vertical-align: middle; /* 使用垂直居中对齐方式 */
}

.theme .title img {
  width: 300px;
  color: #606266;
}

/* [调整] hover 仅文字变蓝（由 el-button 自带样式提供），
   不再出现背景光框/位移，与上方其它模型保持一致 */
.regulation-entry {
  cursor: pointer;
}
.terrain-dialog-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.terrain-dialog-title {
  color: #ffffff;
  font-size: 22px;
  letter-spacing: 1px;
}
.terrain-dialog-tag {
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 10px;
  border: 1px solid currentColor;
  opacity: 0.9;
}
.terrain-panel {
  padding: 2px 6px 0;
  /* 断链调控面板输入项较多：内容超长时面板内滚动，保证底部按钮始终可达 */
  max-height: 70vh;
  overflow-y: auto;
}
.terrain-desc {
  margin: 0 0 14px;
  padding: 8px 10px;
  border-left: 3px solid #5ab0ff;
  background: rgba(255, 255, 255, 0.06);
  color: #dbe7ff;
  font-size: 13px;
  line-height: 1.7;
}
.terrain-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.terrain-label {
  color: #ffffff;
  font-size: 14px;
}
.terrain-status {
  color: #ffd166;
  font-size: 12px;
}
.terrain-form {
  margin-top: 14px;
}
.terrain-unit {
  margin-left: 8px;
  color: #9aa7c7;
  font-size: 12px;
}
.terrain-hint {
  margin: 0 0 14px;
  color: #9aa7c7;
  font-size: 12px;
  line-height: 1.6;
}
.terrain-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.box {
  height: 28px;
  font-weight: 500;
  letter-spacing: 1px;
  /* 添加字间距 */
  line-height: 28px;
  /* 添加行距，可以根据需要调整值 */
  // color: rgba(255, 255, 255, 1);
  color: #606266;
  text-align: left;
  font-size: 15px;
  padding-left: 10px;
  padding-top: 2px;
}

.box img {
  height: 12px;
  width: 12px;
  margin-right: 5px;
  filter: grayscale(100%) brightness(50%); //降低亮度
  vertical-align: middle; //使图片底部与相邻文本的中部对齐
}

.box-used img {
  filter: grayscale(100%) brightness(100%);
}

.p_bottom {
  padding-bottom: 2px;
}

/* 正方形的样式 */
.square {
  position: fixed;
  right: 365px;
  bottom: 100px;
  width: 130px;
  /* 宽度保持不变 */
  height: 140px;
  /* 减小正方形容器的高度 */
  background-color: transparent;
  /* 去掉背景色 */
  display: flex;
  flex-direction: column;
  /* 垂直布局 */
  align-items: center;
  justify-content: flex-start;
  /* 顶部对齐 */
  color: white;
  font-size: 18px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: 0;
  transform: scale(0);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  /* 默认过渡样式 */
}

/* 关闭按钮的样式 */
.close-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  user-select: none;
}

.close-btn:hover {
  color: #f56c6c;
}

/* 风险图例的容器 */
.legend {
  display: flex;
  flex-direction: column;
  /* 纵向排列 */
  justify-content: flex-start;
  width: 80%;
  margin-top: 10px;
}

/* 每个图例项的样式 */
.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* 每个小正方形的样式 */
.color-box {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid #fff;
  /* 添加边框以增强对比 */
  margin-right: 8px;
  /* 正方形与文本之间的间距 */
}

/* 图例文本的样式 */
.legend-text {
  font-size: 14px;
  color: white;
}

/* 为 transition 设置过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active 在离开时生效 */ {
  opacity: 0;
  transform: scale(0);
}

:deep(.el-dialog.dialog_trigrs) {
  --el-dialog-bg-color: transparent;
  width: 776px;
  height: 503px;
  background-image: url('../assets/img/fz173.png');
  background-size: 100% 100%;
}

:deep(.el-dialog.dialog_lightGBM) {
  --el-dialog-bg-color: transparent;
  margin-top: 15%;
  width: 450px;
  height: 350px;
  background-image: url('../assets/img/fz173.png');
  background-size: 100% 100%;
}

:deep(.el-dialog.dialog_seismic) {
  --el-dialog-bg-color: transparent;
  margin-top: 15%;
  width: 700px;
  height: 360px;
  background-image: url('../assets/img/fz173.png');
  background-size: 100% 100%;
}

:deep(.el-dialog.dialog_quanyu) {
  --el-dialog-bg-color: transparent;
  margin-top: 3%;
  width: 560px;
  background-image: url('../assets/img/fz174.png');
  background-size: 100% 100%;
}
:deep(.el-dialog.dialog_quanyu .el-form-item__label) {
  color: #c8e6ff;
}
:deep(.el-dialog.dialog_quanyu .el-input__wrapper) {
  background: rgba(255,255,255,0.1);
  box-shadow: 0 0 0 1px #38e1ff66 inset;
}
:deep(.el-dialog.dialog_quanyu .el-select .el-input__wrapper) {
  background: rgba(255,255,255,0.1);
  box-shadow: 0 0 0 1px #38e1ff66 inset;
}

:deep(.el-dialog.dialog_avaflow) {
  --el-dialog-bg-color: transparent;
  margin-top: 15%;
  width: 450px;
  height: 300px;
  background-image: url('../assets/img/fz173.png');
  background-size: 100% 100%;
}

:deep(.el-dialog.dialog_flood) {
  --el-dialog-bg-color: transparent;
  margin-top: 10%;
  width: 450px;
  height: 420px;
  background-image: url('../assets/img/fz173.png');
  background-size: 100% 100%;
}

:deep(.el-dialog.dialog_inverseV) {
  --el-dialog-bg-color: transparent;
  margin-top: 15%;
  width: 450px;
  height: 280px;
  background-image: url('../assets/img/fz173.png');
  background-size: 100% 100%;
}
:deep(.el-dialog.dialog_avainit) {
  --el-dialog-bg-color: transparent;
  margin-top: 7vh;
  width: min(640px, calc(100vw - 32px));
  height: auto;
  max-height: 88vh;
  border-radius: 16px;
  border: 1px solid rgba(94, 178, 255, 0.35);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  background-image: linear-gradient(180deg, rgba(5, 22, 40, 0.18), rgba(5, 22, 40, 0.72)), url('../assets/img/fz175.png');
  background-size: 100% 100%;
  overflow: hidden;
}

:deep(.el-dialog.dialog_avainit .el-dialog__header) {
  padding: 18px 42px 0 22px;
}

:deep(.el-dialog.dialog_avainit .el-dialog__body) {
  max-height: calc(88vh - 84px);
  padding: 6px 22px 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(96, 180, 255, 0.5) transparent;
}

:deep(.el-dialog.dialog_avainit .el-dialog__body::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-dialog.dialog_avainit .el-dialog__body::-webkit-scrollbar-thumb) {
  border-radius: 999px;
  background: rgba(96, 180, 255, 0.45);
}

:deep(.el-dialog.dialog_avainit .el-dialog__headerbtn) {
  top: 14px;
  right: 14px;
  z-index: 5;
}

.avainit-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-right: 30px;
}

.avainit-header-text {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-left: 14px;
}

.avainit-header-text::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  width: 4px;
  height: 40px;
  border-radius: 999px;
  background: linear-gradient(180deg, #35d5ff, #2f7cff 55%, rgba(47, 124, 255, 0));
  box-shadow: 0 0 14px rgba(53, 213, 255, 0.6);
}

.avainit-title {
  color: #f2f8ff;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: 0.5px;
}

.avainit-subtitle {
  color: rgba(178, 210, 238, 0.72);
  font-size: 12px;
  letter-spacing: 1.2px;
}

.avainit-header .help-icon {
  margin-top: 4px;
  color: rgba(164, 214, 255, 0.85);
  font-size: 19px;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
}

.avainit-header .help-icon:hover {
  color: #ffffff;
  transform: scale(1.08);
}

.avainit-mode-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 6px;
  padding: 8px 10px 8px 12px;
  border: 1px solid rgba(93, 174, 255, 0.18);
  border-radius: 12px;
  background: rgba(8, 28, 48, 0.52);
}

.avainit-field-caption {
  color: #d9ecff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.6px;
  white-space: nowrap;
}

.avainit-mode-row :deep(.el-radio-group) {
  display: flex;
  flex: 1;
  gap: 4px;
  padding: 3px;
  border-radius: 9px;
  background: rgba(4, 18, 32, 0.55);
}

.avainit-mode-row :deep(.el-radio) {
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 30px;
  margin-right: 0;
  padding: 0 10px;
  border-radius: 7px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.avainit-mode-row :deep(.el-radio.is-checked) {
  background: linear-gradient(135deg, rgba(45, 160, 255, 0.32), rgba(53, 213, 255, 0.18));
  box-shadow: inset 0 0 0 1px rgba(83, 190, 255, 0.55);
}

.avainit-mode-row :deep(.el-radio__label) {
  color: #cfe6ff;
  font-size: 14px;
  padding-left: 6px;
}

.avainit-mode-row :deep(.el-radio.is-checked .el-radio__label) {
  color: #ffffff;
  font-weight: 600;
}

.avainit-mode-row :deep(.el-radio__inner) {
  border-color: rgba(150, 205, 255, 0.65);
  background: transparent;
}

.avainit-mode-row :deep(.el-radio.is-checked .el-radio__inner) {
  border-color: #63d7ff;
  background: #63d7ff;
  box-shadow: 0 0 10px rgba(99, 215, 255, 0.55);
}

.avainit-location {
  margin-top: 10px;
  padding: 10px 12px 12px;
  border: 1px solid rgba(93, 174, 255, 0.18);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(8, 28, 48, 0.62), rgba(8, 28, 48, 0.4));
}

.avainit-location-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
}

.avainit-location-hint {
  color: rgba(160, 196, 226, 0.65);
  font-size: 11px;
  letter-spacing: 0.5px;
}

.avainit-location-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.avainit-location-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: rgba(190, 218, 244, 0.8);
  font-size: 12px;
}

.avainit-location-item :deep(.el-input__wrapper) {
  min-height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  background: rgba(5, 20, 36, 0.58);
  box-shadow: inset 0 0 0 1px rgba(104, 181, 255, 0.24);
  transition: box-shadow 0.2s, background 0.2s;
}

.avainit-location-item :deep(.el-input__wrapper:hover) {
  box-shadow: inset 0 0 0 1px rgba(104, 181, 255, 0.42);
}

.avainit-location-item :deep(.el-input__wrapper.is-focus) {
  background: rgba(7, 28, 49, 0.82);
  box-shadow: inset 0 0 0 1px rgba(91, 200, 255, 0.85), 0 0 0 3px rgba(55, 150, 255, 0.1);
}

.avainit-location-item :deep(.el-input__inner) {
  color: #eaf4ff;
  font-size: 14px;
}

.avainit-location-item :deep(.el-input__inner::placeholder) {
  color: rgba(150, 181, 210, 0.52);
}

.form_avainit {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 18px;
  width: 100%;
  margin: 12px 0 0;
}

.form_avainit :deep(.el-form-item) {
  min-width: 0;
  margin-bottom: 14px;
}

.form_avainit :deep(.el-form-item__label) {
  height: auto;
  margin-bottom: 3px;
  padding: 0;
  color: #b9d6f1;
  font-size: 12px;
  line-height: 1.2;
}

.form_avainit :deep(.el-input__wrapper) {
  min-height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  background: rgba(5, 20, 36, 0.58);
  box-shadow: inset 0 0 0 1px rgba(104, 181, 255, 0.24);
  transition: box-shadow 0.2s, background 0.2s;
}

.form_avainit :deep(.el-input__wrapper:hover) {
  box-shadow: inset 0 0 0 1px rgba(104, 181, 255, 0.42);
}

.form_avainit :deep(.el-input__wrapper.is-focus) {
  background: rgba(7, 28, 49, 0.82);
  box-shadow: inset 0 0 0 1px rgba(91, 200, 255, 0.85), 0 0 0 3px rgba(55, 150, 255, 0.1);
}

.form_avainit :deep(.el-input__inner) {
  color: #eaf4ff;
  font-size: 14px;
}

.form_avainit :deep(.el-input__inner::placeholder) {
  color: rgba(150, 181, 210, 0.52);
}

.avainit-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(104, 181, 255, 0.15);
}

.avainit-actions .avainit-cancel {
  min-width: 78px;
  color: #c9def3;
  border-color: rgba(128, 181, 229, 0.45);
  background: rgba(9, 28, 47, 0.45);
}

.avainit-actions .avainit-submit {
  min-width: 98px;
  border: none;
  color: #ffffff;
  background: linear-gradient(135deg, #2f8cff, #24c6ff);
  box-shadow: 0 8px 20px rgba(31, 143, 255, 0.28);
}

.avainit-actions .avainit-submit:hover {
  background: linear-gradient(135deg, #3d98ff, #39d1ff);
  box-shadow: 0 10px 24px rgba(31, 143, 255, 0.4);
}

:deep(.el-input__wrapper) {
  padding: 1px 0px;
}

:deep(.el-input) {
  --el-input-bg-color: transparent;
  --el-input-border-color: transparent;
}

:deep(.el-select__wrapper) {
  background-color: transparent;
}

:deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px transparent inset;
  font-size: 18px;
}

:deep(.el-dialog__title) {
  color: rgba(255, 255, 255, 1);
  font-size: 24px;
}

:deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
  //line-height: 50px;
}

:deep(.el-input__inner) {
  color: rgba(166, 166, 166, 1);
  font-size: 18px;
}

:deep(.el-select__placeholder) {
  color: rgba(166, 166, 166, 1);
}

:deep(.el-checkbox) {
  --el-checkbox-text-color: rgba(166, 166, 166, 1);
}

:deep(.el-dialog.dialog_trigrs .el-dialog__header) {
  padding: 30px 0px 0px 48px;
}

:deep(.el-dialog.dialog_avaflow .el-dialog__header) {
  padding: 0px 0px 0px 22px;
  line-height: 30px;
}

:deep(.el-dialog.dialog_flood .el-dialog__header) {
  padding-bottom: 0px;
  padding-top: 16px;
  padding-left: 20px;
}

:deep(.el-dialog.dialog_inverseV .el-dialog__header) {
  padding-bottom: 0px;
  padding-left: 20px;
}

:deep(.header.el-dialog_header.show-close) {
  padding: 15px 25px 16px 0px;
}

:deep(.el-input-group__append, .el-input-group__prepend) {
  background-color: transparent;
}

:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0px;
}

:deep(
  .el-input-group__append .el-button,
  .el-input-group__append .el-select,
  .el-input-group__prepend .el-button,
  .el-input-group__prepend .el-select
) {
  margin: 0px;
}

.form_trigrs {
  display: flex;
  flex-wrap: wrap;
  /*子元素在必要时换行*/
  width: 650px;
  margin-top: 10px;
  margin-left: 50px;
}

.form_avaflow {
  display: flex;
  flex-wrap: wrap;
  /*子元素在必要时换行*/
  width: 370px;
  margin-top: 10px;
  margin-left: 28px;
}

.form_flood {
  display: flex;
  flex-wrap: wrap;
  /*子元素在必要时换行*/
  width: 380px;
  margin-top: 10px;
  margin-left: 8px;
}

.form_inverseV {
  display: flex;
  flex-wrap: wrap;
  /*子元素在必要时换行*/
  // width: 500px;
  margin-top: 50px;
  margin-left: -12px;
  height: 80px;
}

.el-form-item {
  flex: 1 1 50%;
  /* 每个表单项宽度为45%（两列布局） */
  margin-bottom: 30px;
  /* 每个表单项之间的间距 */
}

/* 强制特定项的宽度和布局 */
.el-form-item.form1_avaflow,
.el-form-item.form2_avaflow {
  flex: 1 1 45%;
  /* 地点和色带为一行 */
}

.el-form-item.form3_avaflow,
.el-form-item.form4_avaflow {
  flex: 1 1 45%;
  /* 地点和色带为一行 */
}

.el-form-item.form3_trigrs {
  flex: 1 1 100%;
  /* 预测时间为一行 */
}

.el-form-item.form4_trigrs {
  flex: 1 1 100%;
  /* 入渗率为一行 */
}

.el-form-item:nth-child(5),
.el-form-item:nth-child(6) {
  flex: 1 1 45%;
  /* 初始地下水位和土壤最大深度为一行 */
}

.el-form-item:nth-child(7),
.el-form-item:nth-child(8) {
  flex: 1 1 45%;
  /* 水力扩散系数和饱和渗透系数为一行 */
}

.b_ex {
  margin-left: 440px;
}
.b_ex_avaflow {
  margin-left: 180px;
}

#name_par {
  font-size: 20px;
  color: rgba(39, 99, 202, 1);
  margin-left: 78px;
}

#name_par2 {
  font-size: 16px;
  color: rgba(39, 99, 202, 1);
  margin-left: 27px;
  line-height: 34px;
}

#name_par3 {
  font-size: 16px;
  color: rgba(39, 99, 202, 1);
  margin-left: 27px;
  line-height: 34px;
}

.barrage-container {
  position: fixed;
  top: 50%;
  left: 0;
  width: 100%;
  height: 50px;
  overflow: hidden;
  z-index: 1000;
  pointer-events: none;
}

.barrage-text {
  position: absolute;
  white-space: nowrap;
  font-size: 24px;
  color: red;
  animation: barrage-scroll 10s linear infinite;
}

@keyframes barrage-scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
/* ===== Beautified input dialogs: risk source & glacier debris flow susceptibility ===== */
:deep(.el-dialog.dialog_trigrs),
:deep(.el-dialog.dialog_lightGBM) {
  --el-dialog-bg-color: transparent;
  margin-top: 7vh;
  width: min(720px, calc(100vw - 32px)) !important;
  height: auto !important;
  max-height: 88vh;
  border: 1px solid rgba(94, 178, 255, 0.35);
  border-radius: 16px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  background-image: linear-gradient(180deg, rgba(5, 22, 40, 0.18), rgba(5, 22, 40, 0.72)), url('../assets/img/fz175.png');
  background-size: 100% 100%;
  overflow: hidden;
}

:deep(.el-dialog.dialog_lightGBM) {
  width: min(660px, calc(100vw - 32px)) !important;
}

:deep(.el-dialog.dialog_trigrs .el-dialog__header),
:deep(.el-dialog.dialog_lightGBM .el-dialog__header) {
  padding: 18px 42px 0 22px;
}

:deep(.el-dialog.dialog_trigrs .el-dialog__headerbtn),
:deep(.el-dialog.dialog_lightGBM .el-dialog__headerbtn) {
  top: 14px;
  right: 14px;
  z-index: 5;
}

:deep(.el-dialog.dialog_trigrs .el-dialog__body),
:deep(.el-dialog.dialog_lightGBM .el-dialog__body) {
  max-height: calc(88vh - 84px);
  padding: 8px 22px 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(96, 180, 255, 0.5) transparent;
}

:deep(.el-dialog.dialog_trigrs .el-dialog__body::-webkit-scrollbar),
:deep(.el-dialog.dialog_lightGBM .el-dialog__body::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-dialog.dialog_trigrs .el-dialog__body::-webkit-scrollbar-thumb),
:deep(.el-dialog.dialog_lightGBM .el-dialog__body::-webkit-scrollbar-thumb) {
  border-radius: 999px;
  background: rgba(96, 180, 255, 0.45);
}

.model-dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-right: 28px;
}

.model-dialog-heading {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-left: 14px;
}

.model-dialog-heading::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  width: 4px;
  height: 40px;
  border-radius: 999px;
  background: linear-gradient(180deg, #35d5ff, #2f7cff 55%, rgba(47, 124, 255, 0));
  box-shadow: 0 0 14px rgba(53, 213, 255, 0.6);
}

.model-dialog-title {
  color: #f2f8ff;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: 0.5px;
}

.model-dialog-subtitle {
  color: rgba(178, 210, 238, 0.72);
  font-size: 12px;
  letter-spacing: 1.2px;
}

.model-dialog-header .help-icon {
  margin-top: 4px;
  color: rgba(164, 214, 255, 0.85);
  font-size: 19px;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
}

.model-dialog-header .help-icon:hover {
  color: #ffffff;
  transform: scale(1.08);
}

.trigrs-form,
.gbm-form {
  display: grid;
  width: 100%;
  margin: 6px 0 0;
  column-gap: 18px;
  row-gap: 14px;
  align-items: start;
}

.trigrs-form {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gbm-form {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.trigrs-form :deep(.el-form-item),
.gbm-form :deep(.el-form-item) {
  min-width: 0;
  margin-bottom: 0;
}

.trigrs-form :deep(.el-form-item__label),
.gbm-form :deep(.el-form-item__label) {
  display: block;
  float: none;
  width: auto !important;
  height: auto;
  margin-bottom: 5px;
  padding: 0;
  color: #b9d6f1;
  font-size: 12px;
  line-height: 1.2;
  text-align: left !important;
}

.trigrs-form :deep(.el-form-item__content),
.gbm-form :deep(.el-form-item__content) {
  width: 100%;
  margin-left: 0 !important;
}

.trigrs-form :deep(.el-input),
.gbm-form :deep(.el-input),
.trigrs-form :deep(.el-select),
.gbm-form :deep(.el-select) {
  width: 100% !important;
}

.trigrs-form :deep(.el-input__wrapper),
.trigrs-form :deep(.el-select__wrapper),
.gbm-form :deep(.el-input__wrapper),
.gbm-form :deep(.el-select__wrapper) {
  min-height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  background: rgba(5, 20, 36, 0.58);
  box-shadow: inset 0 0 0 1px rgba(104, 181, 255, 0.24);
  font-size: 14px;
  transition: background 0.2s, box-shadow 0.2s;
}

.trigrs-form :deep(.el-input__wrapper:hover),
.trigrs-form :deep(.el-select__wrapper:hover),
.gbm-form :deep(.el-input__wrapper:hover),
.gbm-form :deep(.el-select__wrapper:hover) {
  box-shadow: inset 0 0 0 1px rgba(104, 181, 255, 0.42);
}

.trigrs-form :deep(.el-input__wrapper.is-focus),
.trigrs-form :deep(.el-select__wrapper.is-focused),
.gbm-form :deep(.el-input__wrapper.is-focus),
.gbm-form :deep(.el-select__wrapper.is-focused) {
  background: rgba(7, 28, 49, 0.82);
  box-shadow: inset 0 0 0 1px rgba(91, 200, 255, 0.85), 0 0 0 3px rgba(55, 150, 255, 0.1);
}

.trigrs-form :deep(.el-input__inner),
.gbm-form :deep(.el-input__inner) {
  color: #eaf4ff;
  font-size: 14px;
}

.trigrs-form :deep(.el-input__inner::placeholder),
.gbm-form :deep(.el-input__inner::placeholder) {
  color: rgba(150, 181, 210, 0.52);
}

.trigrs-form :deep(.el-select__placeholder),
.gbm-form :deep(.el-select__placeholder) {
  color: rgba(150, 181, 210, 0.62);
}

.trigrs-form :deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trigrs-form :deep(.el-checkbox) {
  margin-right: 0;
  padding: 4px 10px;
  border: 1px solid rgba(104, 181, 255, 0.22);
  border-radius: 999px;
  background: rgba(5, 20, 36, 0.5);
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.trigrs-form :deep(.el-checkbox__label) {
  padding-left: 4px;
  color: #cfe6ff;
  font-size: 13px;
}

.trigrs-form :deep(.el-checkbox.is-checked) {
  border-color: rgba(83, 190, 255, 0.55);
  background: linear-gradient(135deg, rgba(45, 160, 255, 0.32), rgba(53, 213, 255, 0.18));
  box-shadow: inset 0 0 0 1px rgba(83, 190, 255, 0.35);
}

.trigrs-time-field,
.trigrs-wide-field,
.trigrs-actions,
.gbm-file-field,
.gbm-param-row,
.gbm-actions {
  grid-column: 1 / -1;
}

.gbm-param-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.gbm-param-row :deep(.el-form-item) {
  width: 100%;
}

.trigrs-actions :deep(.el-form-item__content),
.gbm-actions :deep(.el-form-item__content) {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.trigrs-actions,
.gbm-actions {
  padding-top: 4px;
  border-top: 1px solid rgba(104, 181, 255, 0.15);
}

.trigrs-cancel,
.gbm-cancel {
  min-width: 78px;
  color: #c9def3;
  border-color: rgba(128, 181, 229, 0.45) !important;
  background: rgba(9, 28, 47, 0.45) !important;
}

.trigrs-cancel:hover,
.gbm-cancel:hover {
  color: #ffffff;
  border-color: rgba(128, 181, 229, 0.7) !important;
  background: rgba(16, 46, 74, 0.68) !important;
}

.trigrs-submit,
.gbm-submit {
  min-width: 98px;
  border: none !important;
  color: #ffffff !important;
  background: linear-gradient(135deg, #2f8cff, #24c6ff) !important;
  box-shadow: 0 8px 20px rgba(31, 143, 255, 0.28);
}

.trigrs-submit:hover,
.gbm-submit:hover {
  background: linear-gradient(135deg, #3d98ff, #39d1ff) !important;
  box-shadow: 0 10px 24px rgba(31, 143, 255, 0.4);
}

.gbm-file-field :deep(.el-input-group__append) {
  padding: 0 !important;
  border: none;
  background: transparent;
}

.gbm-upload-trigger {
  width: 38px;
  height: 34px;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 8px 8px 0;
  color: #ffffff !important;
  background: linear-gradient(135deg, #2f8cff, #24c6ff) !important;
}

.gbm-upload-trigger:hover {
  background: linear-gradient(135deg, #3d98ff, #39d1ff) !important;
}

.gbm-file-field :deep(.el-input__wrapper) {
  border-radius: 8px 0 0 8px;
}
#name_par.trigrs-section-label,
#name_par_gbm.gbm-section-label {
  position: relative;
  margin: 2px 0 0;
  padding-left: 10px;
  color: #d9ecff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.8px;
}

#name_par.trigrs-section-label::before,
#name_par_gbm.gbm-section-label::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 12px;
  margin-right: 8px;
  border-radius: 999px;
  background: linear-gradient(180deg, #35d5ff, #2f7cff);
  box-shadow: 0 0 8px rgba(53, 213, 255, 0.55);
  vertical-align: -1px;
}

/* ===== Beautified input dialogs: full risk / displacement / seismic ===== */
:deep(.el-dialog.dialog_fullRisk),
:deep(.el-dialog.dialog_inverseV),
:deep(.el-dialog.dialog_seismic) {
  --el-dialog-bg-color: transparent;
  margin-top: 7vh;
  width: min(700px, calc(100vw - 32px)) !important;
  height: auto !important;
  max-height: 88vh;
  border: 1px solid rgba(94, 178, 255, 0.35);
  border-radius: 16px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  background-image: linear-gradient(180deg, rgba(5, 22, 40, 0.18), rgba(5, 22, 40, 0.72)), url('../assets/img/fz175.png');
  background-size: 100% 100%;
  overflow: hidden;
}

:deep(.el-dialog.dialog_inverseV) {
  width: min(640px, calc(100vw - 32px)) !important;
}

:deep(.el-dialog.dialog_seismic) {
  width: min(780px, calc(100vw - 32px)) !important;
}

:deep(.el-dialog.dialog_fullRisk > .el-dialog__header),
:deep(.el-dialog.dialog_inverseV > .el-dialog__header),
:deep(.el-dialog.dialog_seismic > .el-dialog__header) {
  padding: 18px 42px 0 22px;
}

:deep(.el-dialog.dialog_fullRisk > .el-dialog__headerbtn),
:deep(.el-dialog.dialog_inverseV > .el-dialog__headerbtn),
:deep(.el-dialog.dialog_seismic > .el-dialog__headerbtn) {
  top: 14px;
  right: 14px;
  z-index: 8;
}

:deep(.el-dialog.dialog_fullRisk > .el-dialog__body),
:deep(.el-dialog.dialog_inverseV > .el-dialog__body),
:deep(.el-dialog.dialog_seismic > .el-dialog__body) {
  max-height: calc(88vh - 84px);
  padding: 8px 22px 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(96, 180, 255, 0.5) transparent;
}

:deep(.el-dialog.dialog_fullRisk > .el-dialog__body::-webkit-scrollbar),
:deep(.el-dialog.dialog_inverseV > .el-dialog__body::-webkit-scrollbar),
:deep(.el-dialog.dialog_seismic > .el-dialog__body::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-dialog.dialog_fullRisk > .el-dialog__body::-webkit-scrollbar-thumb),
:deep(.el-dialog.dialog_inverseV > .el-dialog__body::-webkit-scrollbar-thumb),
:deep(.el-dialog.dialog_seismic > .el-dialog__body::-webkit-scrollbar-thumb) {
  border-radius: 999px;
  background: rgba(96, 180, 255, 0.45);
}

.help-anchor {
  position: relative;
  flex: 0 0 auto;
  margin-top: 4px;
}

.help-anchor .help-icon {
  margin-top: 0;
}

.quanyu-section-label,
.seismic-section-label {
  position: relative;
  margin: 2px 0 12px;
  padding-left: 10px;
  color: #d9ecff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.8px;
}

.quanyu-section-label::before,
.seismic-section-label::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 12px;
  margin-right: 8px;
  border-radius: 999px;
  background: linear-gradient(180deg, #35d5ff, #2f7cff);
  box-shadow: 0 0 8px rgba(53, 213, 255, 0.55);
  vertical-align: -1px;
}

.quanyu-form,
.inverse-form,
.seismic-form {
  width: 100%;
  margin: 8px 0 0;
}

.quanyu-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: 14px;
}

.quanyu-row-2,
.quanyu-param-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
  width: 100%;
}

.quanyu-note {
  color: rgba(166, 196, 224, 0.78);
  font-size: 12px;
  line-height: 1.7;
}

.quanyu-note b {
  color: #cfe4ff;
  font-weight: 600;
}

.inverse-form {
  height: auto;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 18px;
  row-gap: 14px;
}

.inverse-file-field {
  grid-column: 1 / -1;
}

.quanyu-form :deep(.el-form-item),
.inverse-form :deep(.el-form-item),
.seismic-form :deep(.el-form-item) {
  min-width: 0;
  margin-bottom: 0;
}

.quanyu-form :deep(.el-form-item__label),
.inverse-form :deep(.el-form-item__label),
.seismic-form :deep(.el-form-item__label) {
  display: block;
  float: none;
  width: auto !important;
  height: auto;
  margin-bottom: 5px;
  padding: 0;
  color: #b9d6f1;
  font-size: 12px;
  line-height: 1.2;
  text-align: left !important;
}

.quanyu-form :deep(.el-form-item__content),
.inverse-form :deep(.el-form-item__content),
.seismic-form :deep(.el-form-item__content) {
  width: 100%;
  margin-left: 0 !important;
}

.quanyu-form :deep(.el-input),
.inverse-form :deep(.el-input),
.seismic-form :deep(.el-input) {
  width: 100% !important;
}

.quanyu-form :deep(.el-input__wrapper),
.inverse-form :deep(.el-input__wrapper),
.seismic-form :deep(.el-input__wrapper) {
  min-height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  background: rgba(5, 20, 36, 0.58);
  box-shadow: inset 0 0 0 1px rgba(104, 181, 255, 0.24);
  font-size: 14px;
  transition: background 0.2s, box-shadow 0.2s;
}

.quanyu-form :deep(.el-input__wrapper:hover),
.inverse-form :deep(.el-input__wrapper:hover),
.seismic-form :deep(.el-input__wrapper:hover) {
  box-shadow: inset 0 0 0 1px rgba(104, 181, 255, 0.42);
}

.quanyu-form :deep(.el-input__wrapper.is-focus),
.inverse-form :deep(.el-input__wrapper.is-focus),
.seismic-form :deep(.el-input__wrapper.is-focus) {
  background: rgba(7, 28, 49, 0.82);
  box-shadow: inset 0 0 0 1px rgba(91, 200, 255, 0.85), 0 0 0 3px rgba(55, 150, 255, 0.1);
}

.quanyu-form :deep(.el-input__inner),
.inverse-form :deep(.el-input__inner),
.seismic-form :deep(.el-input__inner) {
  color: #eaf4ff;
  font-size: 14px;
}

.quanyu-form :deep(.el-input__inner::placeholder),
.inverse-form :deep(.el-input__inner::placeholder),
.seismic-form :deep(.el-input__inner::placeholder) {
  color: rgba(150, 181, 210, 0.52);
}

.quanyu-form :deep(.el-input-group__append),
.inverse-form :deep(.el-input-group__append),
.seismic-form :deep(.el-input-group__append) {
  padding: 0 !important;
  border: none;
  background: transparent;
}

.quanyu-file-field :deep(.el-input__wrapper),
.inverse-file-field :deep(.el-input__wrapper),
.seismic-file-field :deep(.el-input__wrapper),
.seismic-dl-file-field :deep(.el-input__wrapper) {
  border-radius: 8px 0 0 8px;
}

.quanyu-upload-trigger,
.inverse-upload-trigger,
.seismic-upload-trigger {
  width: 38px;
  height: 34px;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 8px 8px 0;
  color: #ffffff !important;
  background: linear-gradient(135deg, #2f8cff, #24c6ff) !important;
  box-shadow: none;
}

.quanyu-upload-trigger:hover,
.inverse-upload-trigger:hover,
.seismic-upload-trigger:hover {
  background: linear-gradient(135deg, #3d98ff, #39d1ff) !important;
}

.quanyu-actions,
.seismic-actions {
  grid-column: 1 / -1;
  margin-top: 2px;
  padding-top: 14px;
  border-top: 1px solid rgba(104, 181, 255, 0.15);
}

.quanyu-actions :deep(.el-form-item__content),
.seismic-actions :deep(.el-form-item__content) {
  display: flex !important;
  justify-content: flex-end;
  gap: 12px;
}

.inverse-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 2px;
  padding-top: 14px;
  border-top: 1px solid rgba(104, 181, 255, 0.15);
}

.quanyu-submit,
.inverse-submit,
.seismic-submit {
  min-width: 98px;
  border: none !important;
  color: #ffffff !important;
  background: linear-gradient(135deg, #2f8cff, #24c6ff) !important;
  box-shadow: 0 8px 20px rgba(31, 143, 255, 0.28);
}

.quanyu-submit:hover,
.inverse-submit:hover,
.seismic-submit:hover {
  background: linear-gradient(135deg, #3d98ff, #39d1ff) !important;
  box-shadow: 0 10px 24px rgba(31, 143, 255, 0.4);
}

.quanyu-cancel,
.inverse-cancel,
.seismic-cancel {
  min-width: 78px;
  color: #c9def3;
  border-color: rgba(128, 181, 229, 0.45) !important;
  background: rgba(9, 28, 47, 0.45) !important;
}

.quanyu-cancel:hover,
.inverse-cancel:hover,
.seismic-cancel:hover {
  color: #ffffff;
  border-color: rgba(128, 181, 229, 0.7) !important;
  background: rgba(16, 46, 74, 0.68) !important;
}

.seismic-mode-switch {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 12px;
  margin: 4px 0 16px;
  padding: 10px 12px;
  border: 1px solid rgba(104, 181, 255, 0.18);
  border-radius: 10px;
  background: rgba(5, 20, 36, 0.42);
}

.seismic-mode-label {
  color: #b9d6f1;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.seismic-mode-switch :deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.seismic-mode-switch :deep(.el-radio) {
  margin-right: 0;
  padding: 5px 12px;
  border: 1px solid rgba(104, 181, 255, 0.22);
  border-radius: 999px;
  background: rgba(5, 20, 36, 0.5);
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.seismic-mode-switch :deep(.el-radio__input) {
  display: none;
}

.seismic-mode-switch :deep(.el-radio__label) {
  padding: 0;
  color: #cfe6ff;
  font-size: 13px;
}

.seismic-mode-switch :deep(.el-radio.is-checked) {
  border-color: rgba(83, 190, 255, 0.55);
  background: linear-gradient(135deg, rgba(45, 160, 255, 0.32), rgba(53, 213, 255, 0.18));
  box-shadow: inset 0 0 0 1px rgba(83, 190, 255, 0.35);
}

.seismic-mode-switch :deep(.el-radio.is-checked .el-radio__label) {
  color: #ffffff;
}

.seismic-form {
  display: block !important;
}

.seismic-form-dl {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
}

.seismic-dl-file-field,
.seismic-dl-row,
.seismic-form-dl .seismic-actions {
  grid-column: 1 / -1;
}

.seismic-dl-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.seismic-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 14px;
}

.seismic-row-top {
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr) minmax(0, 0.9fr);
}

.seismic-row:last-of-type {
  margin-bottom: 0;
}

.seismic-row :deep(.el-form-item) {
  width: 100%;
  margin-bottom: 0;
}

.seismic-row :deep(.el-form-item__content) {
  width: 100%;
  margin-left: 0 !important;
}

@media (max-width: 680px) {
  .inverse-form,
  .seismic-form-dl,
  .seismic-row,
  .seismic-row-top,
  .seismic-dl-row {
    grid-template-columns: minmax(0, 1fr);
  }

  .seismic-dl-file-field,
  .seismic-dl-row,
  .seismic-form-dl .seismic-actions {
    grid-column: auto;
  }

  .model-dialog-title {
    font-size: 19px;
  }
}
</style>
<style>
/* ===== 数值计算模型「查看参数说明」弹窗统一样式 ===== */
.model-help-dialog {
  max-width: 94vw;
  border-radius: 14px;
  overflow: hidden;
  background-color: rgba(5, 15, 44, 0.98) !important;
  background-image: linear-gradient(180deg, rgba(12, 34, 88, 0.94), rgba(4, 11, 32, 0.98)),
    url('../assets/img/fz174.png') !important;
  background-size: cover, cover !important;
  background-position: center, center !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(90, 176, 255, 0.35) !important;
}

.model-help-dialog .el-dialog__header {
  margin: 0;
  padding: 16px 24px 12px;
  border-bottom: 1px solid rgba(96, 168, 255, 0.28);
  background: linear-gradient(90deg, rgba(24, 78, 170, 0.55), rgba(10, 30, 80, 0.05));
}

.model-help-dialog .el-dialog__headerbtn {
  top: 14px;
  right: 14px;
  font-size: 18px;
}

.model-help-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #cfe6ff;
}

.model-help-dialog .el-dialog__body {
  padding: 0;
}

.model-help-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 34px;
}

.model-help-title {
  font-size: 20px;
  font-weight: 700;
  color: #eaf4ff;
  letter-spacing: 0.5px;
}

.model-help-subtitle {
  font-size: 12px;
  line-height: 18px;
  color: #7fd4ff;
  border: 1px solid rgba(127, 212, 255, 0.55);
  border-radius: 999px;
  padding: 1px 10px;
  background: rgba(20, 90, 170, 0.25);
  white-space: nowrap;
}

.model-help-dialog .help-body {
  max-height: 62vh;
  overflow-y: auto;
  padding: 8px 26px 26px;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-size: 15px;
  line-height: 1.8;
  color: #cfdcf2;
  scrollbar-width: thin;
  scrollbar-color: #3c8dff rgba(8, 20, 50, 0.6);
}

.model-help-dialog .help-body::-webkit-scrollbar {
  width: 10px;
}

.model-help-dialog .help-body::-webkit-scrollbar-track {
  background: rgba(8, 20, 50, 0.6);
  border-radius: 8px;
}

.model-help-dialog .help-body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3c8dff, #1b5fd0);
  border-radius: 8px;
  border: 2px solid rgba(5, 15, 44, 0.9);
}

/* 正文统一覆盖原先写死在标签里的浅色主题颜色 */
.model-help-dialog .help-body *:not(a) {
  color: #cfdcf2 !important;
}

.model-help-dialog .help-body p {
  margin: 10px 0 16px;
}

.model-help-dialog .help-body h2 {
  font-size: 18px !important;
  color: #9fe0ff !important;
  margin: 22px 0 10px !important;
  padding: 6px 0 6px 12px;
  border-left: 3px solid #35a8ff;
  background: linear-gradient(90deg, rgba(36, 110, 200, 0.28), rgba(36, 110, 200, 0));
  border-radius: 0 6px 6px 0;
}

.model-help-dialog .help-body h3 {
  font-size: 16px !important;
  color: #b8e6ff !important;
  margin: 16px 0 8px !important;
}

.model-help-dialog .help-body h4 {
  font-size: 15px !important;
  color: #b8e6ff !important;
}

.model-help-dialog .help-body strong {
  color: #ffd98a !important;
  font-weight: 600;
}

.model-help-dialog .help-body a {
  color: #7fd4ff !important;
  text-decoration: underline;
}

.model-help-dialog .help-body ul,
.model-help-dialog .help-body ol {
  margin: 8px 0 16px;
  padding-left: 24px;
}

.model-help-dialog .help-body li {
  margin-bottom: 6px;
}

.model-help-dialog .help-body li::marker {
  color: #4fb2ff !important;
}

.model-help-dialog .help-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0 20px;
  font-size: 14px;
  background: rgba(8, 22, 58, 0.72);
}

.model-help-dialog .help-body th,
.model-help-dialog .help-body td {
  border: 1px solid rgba(96, 168, 255, 0.28) !important;
  padding: 9px 12px !important;
  text-align: left;
  vertical-align: top;
}

.model-help-dialog .help-body tr {
  background: transparent !important;
}

.model-help-dialog .help-body tbody tr:first-child td {
  background: rgba(40, 110, 205, 0.38) !important;
  color: #eaf4ff !important;
  font-weight: 600 !important;
}

.model-help-dialog .help-body tbody tr:nth-child(even) td {
  background: rgba(16, 40, 92, 0.4) !important;
}

/* 历史模拟记录表：表头单独着色（边框/字号沿用 help-body 的表格样式） */
.model-help-dialog .help-body .pro-history-table thead th {
  background: rgba(40, 110, 205, 0.45) !important;
  color: #eaf4ff !important;
  font-weight: 600 !important;
}

.model-help-dialog .help-body .pro-history-table th,
.model-help-dialog .help-body .pro-history-table td {
  white-space: nowrap;
  vertical-align: middle;
}

.model-help-dialog .help-body .pro-history-table .history-jobid {
  font-size: 12px;
  opacity: 0.75;
}

.model-help-dialog .help-body img {
  display: block;
  /* 结果示例图占满弹窗宽度，高度只做视口级保护（原来限死 460px，示例图显得偏小） */
  width: 100%;
  height: auto;
  max-width: 100%;
  /* 与正文可视高度（62vh）一致，避免图片被截断 */
  max-height: 62vh;
  cursor: zoom-in;
  margin: 14px auto;
  border-radius: 10px;
  border: 1px solid rgba(96, 168, 255, 0.3);
  /* 弹窗挂在 .box 内，父级 .box img{filter:grayscale(100%)} 会穿透进来把结果示例图变成黑白，这里强制恢复原色 */
  filter: none !important;
  -webkit-filter: none !important;
}

/* 结果示例图点击后的全屏预览层 */
.help-image-preview {
  position: fixed;
  inset: 0;
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2vh 2vw;
  background: rgba(2, 8, 24, 0.92);
  cursor: zoom-out;
}

.help-image-preview img {
  max-width: 96vw;
  max-height: 96vh;
  border-radius: 10px;
  border: 1px solid rgba(96, 168, 255, 0.35);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
}

.model-help-dialog .help-body code,
.model-help-dialog .help-body pre {
  font-family: Consolas, 'Courier New', monospace;
  background: rgba(8, 20, 50, 0.85) !important;
  border: 1px solid rgba(96, 168, 255, 0.25);
  border-radius: 6px;
}

.model-help-dialog .help-body code {
  padding: 1px 6px;
}

.model-help-dialog .help-body pre {
  padding: 12px 14px;
  overflow-x: auto;
}

@media (max-width: 1360px) {
  .model-help-dialog .help-body {
    max-height: 58vh;
  }
}
</style>
