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
                  <span class="model-dialog-subtitle">TRIGRS 参数配置</span>
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
              width="1200px"
              max-height="600px"
              :close-on-click-modal="false"
              position="absolute"
              top="70px"
              style="
                background-image: url('./CS/src/assets/img/fz174.png');
                background-size: cover; /* 让背景图铺满对话框 */
                background-position: center; /* 背景图居中 */
                background-color: rgba(0, 0, 130, 0.5);
              "
            >
              <template #title>
                <span
                  style="
                    color: white;
                    font-size: 26px;
                    display: block;
                    text-align: center;
                  "
                  >风险源定量识别与表征模型核心信息</span
                >
              </template>
              <div
                id="trigrs-model-info"
                style="
                  width: 100%;
                  max-width: 1000px;
                  margin: 0 auto;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  max-height: 600px;
                  overflow-y: auto;
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                "
              >
                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  一、模型目的
                </h2>
                <p
                  style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                  "
                >
                  通过模拟降雨入渗与区域边坡稳定性，定量计算网格尺度的稳定性系数，划分滑坡泥石流不稳定/稳定区域，为灾害风险预警、防治规划提供支撑。
                </p>

                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  二、所需参数及介绍
                </h2>

                <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                  （一）前置参数（TopoIndex.exe用）
                </h3>
                <ul
                  style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #666;
                    margin: 8px 0 15px;
                    padding-left: 25px;
                  "
                >
                  <li style="margin-bottom: 5px">
                    <strong>输入</strong
                    >：数字高程模型（DEM，反映地形起伏）、流向（水流方向）、网格行列数（与DEM匹配）；
                  </li>
                  <li>
                    <strong>派生参数</strong
                    >：imax（有效网格总数）、nwf（下坡关联网格数），供后续计算调用。
                  </li>
                </ul>

                <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                  （二）核心参数（TRIGRS.exe用）
                </h3>
                <table
                  style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 16px;
                    color: #666;
                    margin: 8px 0 15px;
                  "
                >
                  <tbody>
                    <tr style="background-color: transparent">
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        "
                      >
                        类别
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        "
                      >
                        参数
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        "
                      >
                        单位
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        "
                      >
                        说明
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        网格/周期
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        imax、nwf、行列数
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        -
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        取自前置环节，定网格规模
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      ></td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        nper（周期数）、time（步长）
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        -、s
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        控制降雨模拟时长与精度
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        土壤/水文
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        zmin/zmax（土厚）、depth（初始水位）
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        m
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        反映土壤与地下水位基础状态
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      ></td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        rizero（初入渗率）、K-sat（饱和渗率）
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        m/s
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        表征土壤水分入渗能力
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      ></td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        diffus（水力扩散系数）
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        m²/s
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        反映水分扩散效率
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      ></td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        uww（水容重）、uws（土容重）
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        N/m³
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        基础物理属性，通常uww取10000
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        岩土力学
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        cohesion（粘聚力）、phi（内摩擦角）
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        Pa、°
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        决定土壤抗剪强度的关键参数
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        降雨
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        cri（雨强）、capt（周期时长）
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        -、s
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        模拟降雨特征
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        基础文件
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        前置4类径流文件
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        -
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        地形相关的径流基础数据
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p
                  style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                    font-style: italic;
                  "
                >
                  注：zmin、time、zmax等9个为暴露参数，可直接调整模拟不同场景。
                </p>

                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  三、生成结果
                </h2>
                <ol
                  style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #666;
                    margin: 8px 0 15px;
                    padding-left: 25px;
                  "
                >
                  <li style="margin-bottom: 5px">
                    <strong>TRfs_min_tutorial_1.txt</strong
                    >：易发性评估文件，0-1为高风险不稳定区，1-10为稳定区（值越大越稳），可转GIS专题图；
                  </li>
                  <li>
                    <strong>TRlist_z_p_fs_tutorial.txt</strong
                    >：网格详单，含土壤深度、孔隙水压力、稳定性系数，供量化分析。
                  </li>
                </ol>
                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  四、运行结果示例
                </h2>
                <p
                  style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                  "
                >
                  以下是模型运行后的示例输出结果：
                </p>
                <img
                  src="/img/TRIGRS.png"
                  alt="运行结果示例"
                  style="
                    width: 80%;
                    height: auto;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin: 10px 0;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                    filter: none;
                  "
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
              width="1200px"
              max-height="600px"
              :close-on-click-modal="false"
              position="absolute"
              top="70px"
              style="
                background-image: url('./CS/src/assets/img/fz174.png');
                background-size: cover; /* 让背景图铺满对话框 */
                background-position: center; /* 背景图居中 */
                background-color: rgba(0, 0, 130, 0.5);
              "
            >
              <template #title>
                <span
                  style="
                    color: white;
                    font-size: 26px;
                    display: block;
                    text-align: center;
                  "
                >
                  冰川泥石流易发性预测模型说明文档</span
                >
              </template>
              <div
                id="glacier-hazard-chain-info"
                style="
                  width: 100%;
                  max-width: 1000px;
                  margin: 0 auto;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  max-height: 600px;
                  overflow-y: auto;
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                "
              >
                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  一、脚本目的
                </h2>
                <p
                  style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                  "
                >
                  利用训练好的 LightGBM 机器学习模型，对 Shapefile
                  格式的地理矢量数据进行预处理（列名映射、缺失值填充、标准化）后，计算冰川型灾害链易发性概率；通过
                  Jenks 自然间断点法将概率划分为 5
                  个易发性等级，最终输出包含分级结果的新 Shapefile
                  文件，实现冰川型灾害链易发性预测。
                </p>

                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  二、参数/配置内容
                </h2>

                <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                  （一）环境依赖（第三方库）
                </h3>
                <ul
                  style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #666;
                    margin: 8px 0 15px;
                    padding-left: 25px;
                  "
                >
                  <li style="margin-bottom: 4px">
                    geopandas：处理地理空间数据
                  </li>
                  <li style="margin-bottom: 4px">pandas：数据处理</li>
                  <li style="margin-bottom: 4px">numpy：数值计算</li>
                  <li style="margin-bottom: 4px">
                    joblib：加载模型和标准化器（Scaler）
                  </li>
                  <li style="margin-bottom: 4px">
                    jenkspy：计算 Jenks 自然间断点
                  </li>
                  <li style="margin-bottom: 4px">
                    scikit-learn：特征数据标准化（StandardScaler）
                  </li>
                  <li>lightgbm：加载推理模型</li>
                </ul>

                <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                  （二）文件路径配置
                </h3>
                <table
                  style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 16px;
                    color: #666;
                    margin: 8px 0 15px;
                  "
                >
                  <tbody>
                    <tr style="background-color: #f5f5f5">
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        "
                      >
                        变量名
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        "
                      >
                        说明
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        "
                      >
                        示例路径
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        MODEL_PATH
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        预训练 LightGBM 模型文件（.pkl）
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        E:\...\LightGBM.pkl
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        SCALER_PATH
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        标准化器文件（.pkl）
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        E:\...\standard_scaler.pkl
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        INPUT_SHP_PATH
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        待预测的输入 Shapefile 文件
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        E:\...\waternet_new.shp
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        OUTPUT_SHP_PATH
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        预测结果输出路径
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "
                      >
                        E:\...\output\result.shp
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                  （三）输入数据字段（Shapefile 属性）
                </h3>
                <table
                  style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 16px;
                    color: #666;
                    margin: 8px 0 15px;
                  "
                >
                  <tbody>
                    <tr style="background-color: #f5f5f5">
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        "
                      >
                        Shapefile 输入字段
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        "
                      >
                        模型特征全称
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        "
                      >
                        说明
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Aspect
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Aspect
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        坡向
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Curvature
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Curvature
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        曲率
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Fault dist
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Fault distance
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        断层距离
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Glacier ar
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Glacier area ratio
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        冰川面积比
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Gully grad
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Gully gradient
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        沟谷坡度
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        NDVI
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        NDVI
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        植被覆盖指数
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Precipitat
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Precipitation
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        降雨量
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Relief amp
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Relief amplitude
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        地形起伏度
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Slope
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Slope
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        坡度
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Soil thick
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Soil thickness
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        土层厚度
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        SPI
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        SPI
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        沟壑功率指数
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Stream Dis
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Stream Distance
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        河流距离
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Surface ro
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Surface roughness
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        地表粗糙度
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Temperatur
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        Temperature
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        温度
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        TWI
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        TWI
                      </td>
                      <td
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        "
                      >
                        地形湿度指数
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p
                  style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                    font-style: italic;
                  "
                >
                  补充：特征列缺失值会自动用该列均值填充；路径配置需修改代码第26-33行，脚本会自动创建输出目录，且覆盖同名旧文件。
                </p>

                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  三、生成结果
                </h2>
                <ol
                  style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #666;
                    margin: 8px 0 15px;
                    padding-left: 25px;
                  "
                >
                  <li style="margin-bottom: 5px">
                    <strong>输出文件</strong>：在 OUTPUT_SHP_PATH 路径生成新的
                    Shapefile 文件；
                  </li>
                  <li style="margin-bottom: 5px">
                    <strong>文件结构</strong>：
                    <ul style="margin: 4px 0 0 20px; padding: 0">
                      <li>geometry：原始空间几何信息；</li>
                      <li>
                        susc_class：易发性等级（文本型：极低、低、中等、高、极高）；
                      </li>
                      <li>Id：原始数据ID（输入含Id列则保留）。</li>
                    </ul>
                  </li>
                  <li>
                    <strong>编码说明</strong>：属性表编码为 GBK，支持
                    ArcGIS/QGIS 等软件正常显示中文字符。
                  </li>
                </ol>
                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  四、运行结果示例
                </h2>
                <p
                  style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                  "
                >
                  以下是模型运行后的示例输出结果：
                </p>
                <img
                  src="/img/BCNSL_YC.png"
                  alt="运行结果示例"
                  style="
                    width: 80%;
                    height: auto;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin: 10px 0;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                    filter: none;
                  "
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
      </div>
      <!-- 灾害链模拟模块  -->
      <div class="theme">
        <div class="title">灾害链模拟</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisible1 = true"
            ><span>山洪泥石流启动动力学模型</span></el-button
          >
          <el-dialog
            v-model="dialogVisible1"
            title="山洪泥石流启动动力学模型"
            style="width: 480px"
            :close-on-click-modal="false"
            class="dialog_avaflow"
            @open="resetShanhongInputs"
          >
            <template #header>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                "
              >
                <span
                  style="
                    color: #ffffff;
                    font-size: 24px;
                    display: block;
                    text-align: center;
                  "
                  >山洪泥石流启动动力学模型</span
                >
                <!-- 问号容器：定位到关闭按钮左侧 -->
                <div style="position: relative; right: 23px; top: -7.5px">
                  <el-tooltip content="帮助" placement="top">
                    <el-icon
                      class="help-icon"
                      @click="openHelpDialog_sh = true"
                    >
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <el-dialog
                  v-model="openHelpDialog_sh"
                  width="1200px"
                  max-height="600px"
                  :close-on-click-modal="false"
                  position="absolute"
                  top="70px"
                  style="
                    background-image: url('./CS/src/assets/img/fz174.png');
                    background-size: cover; /* 让背景图铺满对话框 */
                    background-position: center; /* 背景图居中 */
                    background-color: rgba(0, 0, 130, 0.5);
                  "
                >
                  <template #title>
                    <span
                      style="
                        color: white;
                        font-size: 26px;
                        display: block;
                        text-align: center;
                      "
                      >山洪泥石流启动动力学模型说明文档</span
                    >
                  </template>
                  <div
                    id="r-avaflow-model-info"
                    style="
                      width: 100%;
                      max-width: 1000px;
                      margin: 0 auto;
                      padding: 20px;
                      font-family: Arial, sans-serif;
                      max-height: 600px;
                      overflow-y: auto;
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    "
                  >
                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      一、模型目的
                    </h2>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      "
                    >
                      用于模拟滑坡、泥石流等重力流灾害的运动过程，基于高程、释放高度、影响范围等地理栅格数据，结合摩擦力、时间、相数等参数量化分析灾害流动特征（如流量高度、路径）与影响范围，同时支持可视化参数配置生成灾害过程可视化结果，为重力流灾害风险评估、防治规划提供数据支撑（详细使用说明可参考官方手册：<a
                        href="https://www.landslidemodels.org/r.avaflow/direct.php"
                        target="_blank"
                        style="color: #0066cc"
                        >https://www.landslidemodels.org/r.avaflow/direct.php</a
                      >）。
                    </p>

                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      二、所需参数及介绍
                    </h2>

                    <h3
                      style="font-size: 18px; color: #555; margin: 15px 0 8px"
                    >
                      （一）核心输入数据（栅格格式）
                    </h3>
                    <ul
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      "
                    >
                      <li style="margin-bottom: 5px">
                        <strong>高程（elevation）</strong>：单位
                        m，栅格（raster）数据，表征研究区域地形高程基础信息；
                      </li>
                      <li style="margin-bottom: 5px">
                        <strong>释放高度（hrelease1）</strong>：单位
                        m，栅格（raster）数据，表征灾害启动的初始释放高度；
                      </li>
                      <li>
                        <strong>影响范围（impactarea）</strong
                        >：栅格（raster）数据，定义模型模拟的灾害影响范围边界。
                      </li>
                    </ul>

                    <h3
                      style="font-size: 18px; color: #555; margin: 15px 0 8px"
                    >
                      （二）核心配置参数
                    </h3>
                    <table
                      style="
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 16px;
                        color: #666;
                        margin: 8px 0 15px;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            "
                          >
                            参数名
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            "
                          >
                            单位/取值范围
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            "
                          >
                            说明
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            prefix
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            -
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            输出文件的前缀
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            cellsize
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            -
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            可选，无则从输入数据读取，建议去掉
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            phases
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            默认 3
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            相数（默认3：固体、细固体、流体），<strong
                              >暴露参数</strong
                            >
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            friction
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            内摩擦[0-90]、基底摩擦[0-90]、流体摩擦&gt;0
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            单相应含3类摩擦力，<strong>暴露参数</strong>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            time
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            -
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            2个时间值：①写入文件的时间间隔 ②模拟总时长
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            profile
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            m
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            流向坐标（从顶到底），x/y依次表示点位
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            visualization
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            -
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            共18个参数，控制可视化效果（如等高线、透明度、颜色权重等）
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <h4
                      style="font-size: 17px; color: #555; margin: 12px 0 8px"
                    >
                      可视化参数（visualization）细分说明
                    </h4>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 8px;
                      "
                    >
                      包含18个配置项，核心作用如下：
                    </p>
                    <ul
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                        column-count: 2;
                        column-gap: 20px;
                      "
                    >
                      <li>deform：控制正射影像变形（0关闭/1有/2无）</li>
                      <li>hflowmin：可视化最小流量高度（m）</li>
                      <li>hflowref：可视化参考高度（小流量高度透明）</li>
                      <li>htsunref：大流量高度显示为纯白色</li>
                      <li>hcontmin：水流等高线最低水位（整数）</li>
                      <li>hcontmax：水流等高线最高水位</li>
                      <li>hcontint：水流等高线间隔（整数）</li>
                      <li>zcontmin：高程等高线最低值</li>
                      <li>zcontmax：高程等高线最高值</li>
                      <li>zcontint：高程等高线间隔</li>
                      <li>pred/pgreen/pblue：红/绿/蓝权重（多相忽略）</li>
                      <li>pexp：流动显示透明曲线指数</li>
                      <li>phexagg：剖面中流动高度因素</li>
                      <li>pvpath/rscriptpath/rlibspath：各类路径配置</li>
                    </ul>

                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      三、生成结果
                    </h2>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      "
                    >
                      模型输出包含两部分核心结果：<br />
                      1.
                      <strong>量化数据</strong
                      >：重力流灾害的流动高度、速度、影响范围等数值模拟结果（以配置的
                      prefix 为前缀输出）；<br />
                      2. <strong>可视化结果</strong>：基于 visualization
                      参数生成的灾害流动过程可视化图表（如等高线图、流动路径图、正射影像叠加图等）；<br />
                      具体结果示例可参考官方使用手册或模型运行实测案例。
                    </p>
                  </div>
                </el-dialog>
              </div>
            </template>
            <p id="name_par2">模型参数</p>
            <el-form :model="form1" label-width="auto" class="form_avaflow">
              <el-form-item
                label="输入栅格文件"
                label-position="left"
                label-width="145px"
                class="form_files_avaflow"
                style="margin-bottom: 8px"
              >
                <div
                  style="
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    align-items: center;
                  "
                >
                  <el-input
                    v-model="fileNameElev"
                    placeholder="高程 (elev.tif)"
                    readonly
                    style="width: 180px"
                  >
                    <template #append>
                      <el-upload
                        ref="uploadElevRef"
                        :auto-upload="false"
                        :show-file-list="false"
                        accept=".tif,.tiff"
                        @change="handleFileChangeElev"
                      >
                        <el-button
                          @click.stop="triggerUploadElev"
                          style="
                            border: none;
                            color: white;
                            padding: 0;
                            margin-left: 8px;
                          "
                          ><i class="iconfont icon-daoru"></i
                        ></el-button>
                      </el-upload>
                    </template>
                  </el-input>

                  <el-input
                    v-model="fileNameDebris"
                    placeholder="启动堆积 (debris.tif)"
                    readonly
                    style="width: 200px"
                  >
                    <template #append>
                      <el-upload
                        ref="uploadDebrisRef"
                        :auto-upload="false"
                        :show-file-list="false"
                        accept=".tif,.tiff"
                        @change="handleFileChangeDebris"
                      >
                        <el-button
                          @click.stop="triggerUploadDebris"
                          style="
                            border: none;
                            color: white;
                            padding: 0;
                            margin-left: 8px;
                          "
                          ><i class="iconfont icon-daoru"></i
                        ></el-button>
                      </el-upload>
                    </template>
                  </el-input>

                  <el-input
                    v-model="fileNameImpact"
                    placeholder="影响范围 (impact_area.tif)"
                    readonly
                    style="width: 220px"
                  >
                    <template #append>
                      <el-upload
                        ref="uploadImpactRef"
                        :auto-upload="false"
                        :show-file-list="false"
                        accept=".tif,.tiff"
                        @change="handleFileChangeImpact"
                      >
                        <el-button
                          @click.stop="triggerUploadImpact"
                          style="
                            border: none;
                            color: white;
                            padding: 0;
                            margin-left: 8px;
                          "
                          ><i class="iconfont icon-daoru"></i
                        ></el-button>
                      </el-upload>
                    </template>
                  </el-input>
                </div>
              </el-form-item>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  height: 20px;
                  margin-top: 15px;
                "
              >
                <el-form-item
                  label="相数"
                  label-width="50px"
                  label-position="left"
                  class="form1_avaflow"
                >
                  <el-select
                    v-model="form1.phases"
                    placeholder="1"
                    style="width: 90px"
                  >
                    <el-option label="单相" value="1" />
                    <el-option label="双相" value="2" />
                    <el-option label="多相" value="3" />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="内部摩擦"
                  label-position="left"
                  label-width="88px"
                  class="form2_avaflow"
                >
                  <el-input v-model="form1.cf" placeholder="35" />
                </el-form-item>
                <el-form-item
                  label="基底摩擦"
                  label-position="left"
                  label-width="88px"
                  class="form3_avaflow"
                >
                  <el-input v-model="form1.bf" placeholder="20" />
                </el-form-item>
              </div>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="onSubmit1"
                  class="b_ex_avaflow"
                  >运行</el-button
                >
                <el-button @click="dialogVisible1 = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />

          <el-button :plain="true" @click="dialogVisible2 = true"
            ><span>洪水泥石流启动动力学模型</span></el-button
          >
          <el-dialog
            v-model="dialogVisible2"
            title="洪水泥石流启动动力学模型"
            width="560"
            :close-on-click-modal="false"
            class="dialog_quanyu"
            @open="resetFloodProInputs"
          >
            <template #header>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                "
              >
                <span style="color: #ffffff; font-size: 24px"
                  >洪水泥石流启动动力学模型</span
                >
                <!-- 问号容器：定位到关闭按钮左侧 -->
                <div style="position: relative; right: -3px; top: -28.5px">
                  <el-tooltip content="帮助" placement="top">
                    <el-icon
                      class="help-icon"
                      @click="openHelpDialog_flood = true"
                    >
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <el-dialog
                  v-model="openHelpDialog_flood"
                  width="1200px"
                  max-height="600px"
                  :close-on-click-modal="false"
                  position="absolute"
                  top="70px"
                  style="
                    background-image: url('./CS/src/assets/img/fz174.png');
                    background-size: cover; /* 让背景图铺满对话框 */
                    background-position: center; /* 背景图居中 */
                    background-color: rgba(0, 0, 130, 0.5);
                  "
                >
                  <template #title>
                    <span
                      style="
                        color: white;
                        font-size: 26px;
                        display: block;
                        text-align: center;
                      "
                      >洪水泥石流启动动力学模型说明文档</span
                    >
                  </template>
                  <div
                    id="debris-flow-dynamics-model-info"
                    style="
                      width: 100%;
                      max-width: 1000px;
                      margin: 0 auto;
                      padding: 20px;
                      font-family: Arial, sans-serif;
                      max-height: 600px;
                      overflow-y: auto;
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    "
                  >
                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      一、模型目的
                    </h2>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      "
                    >
                      基于输入的灾前/灾后地形、水深分布及相关参数，数值模拟山洪泥石流启动过程，输出滑坡、堰塞湖、洪水的关键特征数据（厚度、速度、水深等），为山洪泥石流灾害的形成机制分析、风险评估提供量化支撑。
                    </p>

                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      二、所需参数及介绍
                    </h2>

                    <h3
                      style="font-size: 18px; color: #555; margin: 15px 0 8px"
                    >
                      （一）输入数据格式与路径
                    </h3>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 10px;
                      "
                    >
                      所有输入数据均以
                      <strong>txt格式</strong>
                      读取。
                    </p>
                    <table
                      style="
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 16px;
                        color: #666;
                        margin: 8px 0 15px;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            "
                          >
                            变量/文件标识
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            "
                          >
                            文件名称示例
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            "
                          >
                            说明
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            zB
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            [basePath]\sufB.txt
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            灾前地形数据
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            zL
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            [basePath]\sufL.txt
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            灾后地形数据
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            hW
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            [basePath]\sufW.txt
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            水深分布数据
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            Par
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            [basePath]\sufP.txt
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            模型计算所需参数
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      "
                    >
                      <strong>路径说明</strong>：basePath 由
                      userName（用户目录）、taskName（任务目录）拼接而成，文件路径拼接逻辑为：<br />
                      <code
                        style="
                          background: #f0f0f0;
                          padding: 2px 4px;
                          border-radius: 2px;
                        "
                        >basePath = [userName, filesep, taskName,
                        filesep];</code
                      >
                    </p>

                    <h3
                      style="font-size: 18px; color: #555; margin: 15px 0 8px"
                    >
                      （二）核心输入数据类别
                    </h3>
                    <ul
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      "
                    >
                      <li style="margin-bottom: 5px">
                        <strong>灾前地形（zB）</strong
                        >：泥石流发生前的区域地形基础数据；
                      </li>
                      <li style="margin-bottom: 5px">
                        <strong>灾后地形（zL）</strong
                        >：泥石流发生后的区域地形变化数据；
                      </li>
                      <li style="margin-bottom: 5px">
                        <strong>水深分布（hW）</strong
                        >：研究区域内的水体深度空间分布数据；
                      </li>
                      <li>
                        <strong>模型参数（Par）</strong
                        >：支撑动力学模拟的核心参数（如物理力学参数、计算参数等）。
                      </li>
                    </ul>

                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      三、生成结果
                    </h2>
                    <ol
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      "
                    >
                      <li style="margin-bottom: 5px">
                        <strong>输出格式</strong>：所有模拟结果均以
                        <strong>txt 格式</strong> 输出；
                      </li>
                      <li style="margin-bottom: 5px">
                        <strong>滑坡特征数据</strong
                        >：厚度分布（hS）、速度分布（uS）；
                      </li>
                      <li style="margin-bottom: 5px">
                        <strong>堰塞湖特征数据</strong>：水深（hW）；
                      </li>
                      <li>
                        <strong>洪水特征数据</strong
                        >：水深（hW）、速度分布（uW）。
                      </li>
                    </ol>
                  </div>
                </el-dialog>
              </div>
            </template>
            <p id="name_par3">输入数据</p>
            <el-form label-width="auto" style="width: 500px" class="form_flood">
              <el-form-item
                label="数据坐标系"
                label-position="right"
                label-width="110px"
                style="flex: 1 1 100%; margin-bottom: 12px"
              >
                <el-input
                  v-model="proSourceCrs"
                  placeholder="EPSG:32646"
                  style="width: 260px"
                />
              </el-form-item>
              <el-form-item
                label="源区中心"
                label-position="right"
                label-width="110px"
                style="flex: 1 1 100%; margin-bottom: 12px"
              >
                <el-input
                  v-model="proAnchorLon"
                  placeholder="经度 95.0020"
                  style="width: 125px"
                />
                <el-input
                  v-model="proAnchorLat"
                  placeholder="纬度 30.2354"
                  style="width: 125px; margin-left: 10px"
                />
              </el-form-item>
              <el-form-item
                v-for="item in proFileItems"
                :key="item.key"
                :label="item.label"
                label-position="right"
                label-width="110px"
                style="flex: 1 1 100%; margin-bottom: 12px"
              >
                <el-input
                  v-model="proFileNames[item.key]"
                  :placeholder="item.placeholder"
                  style="width: 260px"
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
                        style="
                          border: none;
                          color: white;
                          padding: 0;
                          margin-left: 8px;
                        "
                        @click.stop="triggerProUpload(item.key)"
                      >
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>

            <p id="name_par3">模型参数</p>
            <el-form
              :model="form2"
              label-width="auto"
              style="width: 500px"
              class="form_flood"
            >
              <el-form-item label="基底摩擦角(rad)" class="form1_flood">
                <el-input v-model="form2.bed" placeholder="0.2" />
              </el-form-item>
              <el-form-item label="曼宁摩擦系数" class="form1_flood">
                <el-input v-model="form2.nn" placeholder="0.0125" />
              </el-form-item>
              <el-form-item label="网格长度" class="form1_flood">
                <el-input v-model="form2.dx" placeholder="20" />
              </el-form-item>
              <el-form-item label="网格宽度" class="form1_flood">
                <el-input v-model="form2.dy" placeholder="20" />
              </el-form-item>
              <el-form-item label="滑坡密度" class="form1_flood">
                <el-input v-model="form2.rous" placeholder="2700" />
              </el-form-item>
              <el-form-item label="河水密度" class="form1_flood">
                <el-input v-model="form2.rouf" placeholder="1000" />
              </el-form-item>
              <el-form-item label="输出间距" class="form1_flood">
                <el-input v-model="form2.interval" placeholder="1" />
              </el-form-item>
              <el-form-item label="计算时间" class="form1_flood">
                <el-input v-model="form2.Tmax" placeholder="100" />
              </el-form-item>

              <el-form-item style="flex: 1 1 100%; margin-bottom: 12px">
                <span style="color: #a6a6a6; font-size: 13px"
                  >支持 .tif / .tiff / .txt / .asc（ESRI ASCII）；txt/asc <b>自带 xllcorner/yllcorner 头部</b>时按「数据坐标系」解释；
                  无头部时必填「源区中心」经纬度（易贡示例 95.0020, 30.2354，坐标系 EPSG:32646）。zb / zl / hw 都不选时使用内置示例数据（suanfa/Pro/user1/task）。渲染场固定为泥石流层厚度（zB-zL）。</span
                >
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="onSubmit2"
                  class="b_ex_avaflow"
                  >运行</el-button
                >
                <el-button @click="dialogVisible2 = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <!-- 洪水泥石流启动动力学模型（测试）：暂时隐藏，保留代码备查 -->
        <div v-if="false" class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisible2Test = true"
            ><span>洪水泥石流启动动力学模型（测试）</span></el-button
          >
          <el-dialog
            v-model="dialogVisible2Test"
            title="洪水泥石流启动动力学模型（测试）"
            width="500"
            :close-on-click-modal="false"
            class="dialog_flood"
            @open="resetFloodTestInputs"
          >
            <template #header>
              <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
                <span style="color:#ffffff;font-size:24px">洪水泥石流启动动力学模型（测试）</span>
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
                    @click="openHelpDialog_flood = true"
                  >
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
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
            class="dialog_avaflow"
            style="height:480px"
            @open="resetSdpInputs"
          >
            <template #header>
              <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
                <span style="color:#ffffff;font-size:24px;display:block;text-align:center">泥石流启动物源计算模型</span>
              </div>
            </template>
            <p id="name_par_gbm" style="margin-left:28px;margin-top:30px;font-size:18px;color:#2763ca">模型参数</p>
            <el-form :model="formSDP" label-width="auto" style="max-width:600px" class="form_avaflow">
              <el-form-item label="降雨栅格路径" label-position="right" label-width="140px">
                <el-input v-model="fileNameRain" placeholder="选择降雨 tif 文件（可多选）" readonly style="width:220px">
                  <template #append>
                    <el-upload ref="uploadRainRef" :auto-upload="false" :show-file-list="false" :multiple="true" accept=".tif,.tiff" @change="handleFileRain">
                      <el-button @click.stop="triggerUploadRain" style="border:none;color:white;padding:0;margin-left:8px">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="温度栅格路径" label-position="right" label-width="140px">
                <el-input v-model="fileNameTemp" placeholder="选择温度 tif 文件（可多选）" readonly style="width:220px">
                  <template #append>
                    <el-upload ref="uploadTempRef" :auto-upload="false" :show-file-list="false" :multiple="true" accept=".tif,.tiff" @change="handleFileTemp">
                      <el-button @click.stop="triggerUploadTemp" style="border:none;color:white;padding:0;margin-left:8px">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              <!-- 输出目录 暂时注释
              <el-form-item label="输出目录" label-position="right" label-width="140px">
                <el-input v-model="fileNameOutput" placeholder="选择输出文件（可多选）" readonly style="width:220px">
                  <template #append>
                    <el-upload ref="uploadOutputRef" :auto-upload="false" :show-file-list="false" :multiple="true" @change="handleFileOutput">
                      <el-button @click.stop="triggerUploadOutput" style="border:none;color:white;padding:0;margin-left:8px">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              -->
              <el-form-item label="体积含冰量" label-position="right" label-width="140px">
                <el-input v-model="formSDP.ice_content" type="number" step="0.01" placeholder="0.2" style="width:160px" />
              </el-form-item>
              <el-form-item style="margin-top:-12px">
                <div style="display:flex;justify-content:center;gap:12px;width:100%">
                  <el-button type="primary" @click="submitSDP" :loading="sdpLoading">
                    {{ sdpLoading ? '计算中...' : '运行' }}
                  </el-button>
                  <el-button @click="dialogVisibleSDP = false">取消</el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <!-- 洪水泥石流启动动力学模型_beta：前端隐藏入口、逻辑保留；恢复时删除下方 v-if="false" -->
        <div v-if="false" class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogBeta = true"
            ><span>洪水泥石流启动动力学模型_beta</span></el-button
          >
          <el-dialog v-model="dialogBeta" title="洪水泥石流启动动力学模型_beta" width="520" :close-on-click-modal="false" class="dialog_quanyu" @open="resetBetaInputs">
            <template #header>
              <div style="display:flex;align-items:center;justify-content:space-between;width:100%">
                <span style="color:#ffffff;font-size:21px;padding-left:20px">洪水泥石流启动动力学模型_beta</span>
              </div>
            </template>
            <p id="name_par_gbm" style="margin-left:24px;margin-top:8px;font-size:18px;color:#2763ca">输入数据</p>
            <el-form label-width="auto" style="max-width:600px" class="form_gbm">
              <el-form-item v-for="item in betaFileItems" :key="item.key" :label="item.label" label-position="right" label-width="130px">
                <el-input v-model="betaFileNames[item.key]" :placeholder="item.placeholder" style="width:200px" readonly>
                  <template #append>
                    <el-upload :ref="el => { if (el) betaUploadRefs[item.key] = el }" :auto-upload="false" :show-file-list="false" accept=".tif,.tiff" @change="(f,fs) => handleBetaFile(item.key, f, fs)">
                      <el-button style="border:none;color:white;padding:0;margin-left:8px" @click.stop="triggerBetaUpload(item.key)">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <div style="display:flex;justify-content:center;gap:12px;width:100%">
                  <el-button type="primary" @click="submitBeta">运行</el-button>
                  <el-button @click="dialogBeta = false">取消</el-button>
                </div>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </div>
      <!-- 风险评估模块 -->
      <div class="theme">
        <div class="title">风险评估</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box">
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
              </div>
            </template>
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
                  width="1200px"
                  max-height="600px"
                  :close-on-click-modal="false"
                  position="absolute"
                  top="70px"
                  style="
                    background-image: url('./CS/src/assets/img/fz174.png');
                    background-size: cover; /* 让背景图铺满对话框 */
                    background-position: center; /* 背景图居中 */
                    background-color: rgba(0, 0, 130, 0.5);
                  "
                >
                  <template #title>
                    <span
                      style="
                        color: white;
                        font-size: 26px;
                        display: block;
                        text-align: center;
                      "
                      >基于位移监测滑坡预警说明文档</span
                    >
                  </template>
                  <div
                    id="landslide-warning-model-info"
                    style="
                      width: 100%;
                      max-width: 1000px;
                      margin: 0 auto;
                      padding: 20px;
                      font-family: Arial, sans-serif;
                      max-height: 600px;
                      overflow-y: auto;
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    "
                  >
                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      一、模型目的
                    </h2>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      "
                    >
                      基于位移传感器监测的时序数据，通过<strong>速度倒数法</strong>预测滑坡发生时间：将滑坡过程划分为恒速移动、变速移动、滑坡三阶段，检测变速起始点（OOA）到速度倒数为零的距离，判断滑坡发生时机，实现滑坡预警。
                    </p>

                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      二、所需数据/核心模块
                    </h2>

                    <h3
                      style="font-size: 18px; color: #555; margin: 15px 0 8px"
                    >
                      （一）核心输入数据
                    </h3>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 8px;
                      "
                    >
                      时序位移监测数据，包含两类字段：
                    </p>
                    <ul
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      "
                    >
                      <li style="margin-bottom: 5px">
                        <strong>timestamp</strong>：时间戳（如 2022-01-01
                        00:00:00）；
                      </li>
                      <li>
                        <strong>displ</strong>：传感器检测到的位移值（数值型）。
                      </li>
                    </ul>

                    <h3
                      style="font-size: 18px; color: #555; margin: 15px 0 8px"
                    >
                      （二）R语言核心脚本模块
                    </h3>
                    <table
                      style="
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 16px;
                        color: #666;
                        margin: 8px 0 15px;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            "
                          >
                            脚本文件
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            "
                          >
                            功能
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            1_1_input.R
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            主配置文件（参数入口）
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            2_data-input.R
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            数据读取与预处理
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            4_calculate_v-iv.R
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            计算速度/逆速度
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            6_OOA-detection_auto_2.R
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            自动检测加速起始点（OOA）
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            7_calculate_tof.R
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            计算破坏时间（滑坡发生时间）
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            plot7_combi.R
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            生成综合预测图表
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            99_1_new-iteration_run.R
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            增量更新预测（新数据到来时）
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      三、生成结果
                    </h2>
                    <ol
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      "
                    >
                      <li style="margin-bottom: 5px">
                        <strong>量化结果</strong
                        >：滑坡破坏时间（失效时间）预测值、预测不确定性区间、速度/逆速度计算结果、OOA检测结果；
                      </li>
                      <li style="margin-bottom: 5px">
                        <strong>可视化结果</strong>：
                        <ul style="margin: 4px 0 0 20px; padding: 0">
                          <li>
                            综合预测图表：位移-时间曲线、逆速度曲线、OOA检测标记；
                          </li>
                          <li>
                            统计图表：失效时间分布箱线图、预期寿命图表、速度区间可视化图；
                          </li>
                          <li>
                            案例专项图：PFTF结果图（含失效窗口、速度区间、四分位距等）。
                          </li>
                        </ul>
                      </li>
                      <li>
                        <strong>功能扩展</strong
                        >：支持新数据增量更新预测，输出实时预警相关的时间轴、不确定性分析结果。
                      </li>
                    </ol>
                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      四、运行结果示例
                    </h2>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      "
                    >
                      以下是模型运行后的示例输出结果：
                    </p>
                    <img
                      src="/img/pftf.png"
                      alt="运行结果示例"
                      style="
                        width: 80%;
                        height: auto;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        margin: 10px 0;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        filter: none;
                      "
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
                  width="1200px"
                  max-height="600px"
                  :close-on-click-modal="false"
                  position="absolute"
                  top="70px"
                  style="
                    background-image: url('./CS/src/assets/img/fz174.png');
                    background-size: cover; /* 让背景图铺满对话框 */
                    background-position: center; /* 背景图居中 */
                    background-color: rgba(0, 0, 130, 0.5);
                  "
                >
                  <template #title>
                    <span
                      style="
                        color: white;
                        font-size: 26px;
                        display: block;
                        text-align: center;
                      "
                      >冰川泥石流监测预警模型说明文档</span
                    >
                  </template>
                  <div
                    id="debris-flow-signal-detection-info"
                    style="
                      width: 100%;
                      max-width: 1000px;
                      margin: 0 auto;
                      padding: 20px;
                      font-family: Arial, sans-serif;
                      max-height: 600px;
                      overflow-y: auto;
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    "
                  >
                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      一、脚本目的
                    </h2>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      "
                    >
                      处理传感器采集的地震波/地声/振动等时序信号，基于<strong>改进的STA/LTA（短长时窗平均比）算法</strong>自动识别泥石流事件；通过二次校验（分段趋势分析）排除误报，输出检测结果并可视化波形与检测状态。
                    </p>

                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      二、参数/环境/输入要求
                    </h2>

                    <h3
                      style="font-size: 18px; color: #555; margin: 15px 0 8px"
                    >
                      （一）环境依赖
                    </h3>

                    <ul
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      "
                    >
                      <li style="margin-bottom: 4px">
                        numpy：高性能数值计算与数组操作
                      </li>
                      <li style="margin-bottom: 4px">
                        pandas：读取Excel/CSV格式数据
                      </li>
                      <li style="margin-bottom: 4px">
                        matplotlib：绘制波形与检测状态可视化图表
                      </li>
                      <li>openpyxl：pandas读取.xlsx文件的引擎</li>
                    </ul>

                    <h3
                      style="font-size: 18px; color: #555; margin: 15px 0 8px"
                    >
                      （二）关键参数（代码第39-45行）
                    </h3>
                    <table
                      style="
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 16px;
                        color: #666;
                        margin: 8px 0 15px;
                      "
                    >
                      <tbody>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            "
                          >
                            参数名
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            "
                          >
                            默认值
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            "
                          >
                            说明
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            threshold
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            2.5
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            触发阈值，STA/LTA比值超此值启动二次校验
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            short_window
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            30秒
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            短时窗，计算瞬时能量变化（反应灵敏）
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            long_window
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            240秒
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            长时窗，计算背景噪声水平（反应迟钝）
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            segment_duration
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            10秒
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            校验分段时长，触发后切分后续时间窗
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            total_duration
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            60秒
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            校验总时长，触发后向后检查的总时间
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            sampling_rate
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            100Hz
                          </td>
                          <td
                            style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            "
                          >
                            采样率，需与硬件采集参数一致
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <h3
                      style="font-size: 18px; color: #555; margin: 15px 0 8px"
                    >
                      （三）输入数据要求
                    </h3>
                    <ul
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      "
                    >
                      <li style="margin-bottom: 5px">
                        文件格式：Excel（.xlsx）格式的传感器波形数据；
                      </li>
                      <li style="margin-bottom: 5px">
                        数据结构：默认跳过第一行表头，读取第1列作为信号数值；若第一列为时间戳，需修改代码列索引；
                      </li>
                      <li>
                        使用前需修改代码第30行的
                        <code>filepath</code>
                        为实际数据文件路径。
                      </li>
                    </ul>

                    <h3
                      style="font-size: 18px; color: #555; margin: 15px 0 8px"
                    >
                      （四）核心判定逻辑
                    </h3>
                    <ol
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      "
                    >
                      <li style="margin-bottom: 4px">
                        能量计算：原始数据平方后，计算STA（短时平均能量）、LTA（长时平均能量）；
                      </li>
                      <li style="margin-bottom: 4px">
                        初筛：Ratio=STA/LTA > threshold 时，进入二次校验；
                      </li>
                      <li style="margin-bottom: 4px">
                        二次校验：锁定LTA背景值，截取后续60秒数据并切分为10秒片段，计算各片段均值与锁定LTA的比值；
                      </li>
                      <li>
                        最终判定：所有片段比值>threshold
                        <strong>且</strong> 片段能量增长趋势次数≥3次。
                      </li>
                    </ol>

                    <h2
                      style="font-size: 20px; color: #444; margin: 18px 0 10px"
                    >
                      三、生成结果
                    </h2>
                    <ol
                      style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      "
                    >
                      <li style="margin-bottom: 5px">
                        <strong>控制台输出</strong
                        >：是否检测到泥石流、检测到的信号数据点索引；
                      </li>
                      <li>
                        <strong>可视化结果</strong
                        >：弹出波形与检测状态图表，其中灰色曲线为原始信号波形，红色脉冲为判定的泥石流时间段（值为1）。
                      </li>
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
                <el-radio value="ml">机器学习 (STA/LTA)</el-radio>
                <el-radio value="dl">深度学习 (Transformer1D)</el-radio>
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
                  label="阈值/threshold"
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
        <div class="box regulation-entry" @click="openTerrainRegulation('chain')">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>灾害链断链调控技术</span>
        </div>
        <div class="box p_bottom regulation-entry" @click="openTerrainRegulation('along')">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>冰川泥石流沿程调控技术</span>
        </div>
        <el-dialog
          v-for="cfg in terrainRegulationConfigs"
          :key="cfg.kind"
          v-model="cfg.visible"
          :title="cfg.title"
          width="560"
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
            </div>
          </template>
          <div class="terrain-panel">
            <p class="terrain-desc" :style="{ borderLeftColor: cfg.accent }">
              {{ cfg.desc }}
            </p>
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
// import { exec } from 'child_process'
const dialogVisible = ref(false)
const dialogVisible1 = ref(false)
const dialogVisibleGBM = ref(false)
const dialogVisible2 = ref(false)
const dialog_inverseV = ref(false)
const dialog_avainit = ref(false)
const openHelpDialog_fxy = ref(false)
const openHelpDialog_sh = ref(false)
const openHelpDialog_flood = ref(false)
const openHelpDialog_inverseV = ref(false)
const openHelpDialog_gbm = ref(false)
const openHelpDialog_seismic = ref(false)
const uploadRef = ref(null)
const selectedDisplFile = ref(null)
const fileName_inverseV = ref('')
// --- GBM 上传相关 ---
const uploadRefGBM = ref(null)
const fileNameGBM = ref('')
const fileGBM = ref()
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
])
// 获取 store 实例
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
const form1 = reactive({
  area: '巴宜区',
  phases: '1',
  cf: '35',
  bf: '20',
  ff: '0.05',
})
// avaflow 上传文件 refs
const uploadElevRef = ref(null)
const uploadDebrisRef = ref(null)
const uploadImpactRef = ref(null)
const fileElev = ref(null)
const fileDebris = ref(null)
const fileImpact = ref(null)
const fileNameElev = ref('')
const fileNameDebris = ref('')
const fileNameImpact = ref('')

const triggerUploadElev = () => {
  uploadElevRef.value?.$el.querySelector('input[type=file]').click()
}
const triggerUploadDebris = () => {
  uploadDebrisRef.value?.$el.querySelector('input[type=file]').click()
}
const triggerUploadImpact = () => {
  uploadImpactRef.value?.$el.querySelector('input[type=file]').click()
}

const handleFileChangeElev = (uploadFile, uploadFiles) => {
  const f = (uploadFiles && uploadFiles[0]?.raw) || uploadFile.raw || uploadFile
  fileElev.value = f
  fileNameElev.value = f?.name || ''
}
const handleFileChangeDebris = (uploadFile, uploadFiles) => {
  const f = (uploadFiles && uploadFiles[0]?.raw) || uploadFile.raw || uploadFile
  fileDebris.value = f
  fileNameDebris.value = f?.name || ''
}
const handleFileChangeImpact = (uploadFile, uploadFiles) => {
  const f = (uploadFiles && uploadFiles[0]?.raw) || uploadFile.raw || uploadFile
  fileImpact.value = f
  fileNameImpact.value = f?.name || ''
}
const form2 = reactive({
  bed: '0.2',
  nn: '0.0125',
  dx: '20',
  dy: '20',
  rous: '2700',
  rouf: '1000',
  // 输出间距=出图节拍（秒）；后端按「模拟时刻」抽帧，总帧数不超过 maxFrames
  interval: '1',
  Tmax: '100',
  // 渲染场固定为泥石流层厚度 solid=zB-zL（后端仍支持 total/water/speed）：旧语义 total=泥石流层+水层 / water=水层 / solid=泥石流层(zB-zL) / speed=流速
  field: 'solid',
})
// 洪水泥石流启动动力学模型（python_port）输入数据：zb 灾前地形 / zl 灾后地形 / hw 初始水深
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
// 洪水泥石流启动动力学模型（python_port）运行状态
const floodRunning = ref(false)
// 洪水泥石流启动动力学模型（测试）
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
    ElMessage({ message: 'r.avaflow 计算已启动，等待结果（约数分钟~十余分钟）...', type: 'info', duration: 0 })
    const startTs = Date.now()
    while (true) {
      await new Promise(r => setTimeout(r, 5000))
      let st = null
      try { st = await modelService.getAvaflowBetaStatus(jobId) } catch (e) { st = null }
      if (st && st.status === 'running') {
        const phaseLabel =
          st.phase === 'converting'
            ? '\u7ed3\u679c\u8f6c\u6362\u4e2d'
            : 'r.avaflow \u8ba1\u7b97\u4e2d'
        ElMessage.closeAll()
        ElMessage({ message: phaseLabel + '... ' + (st.progress ?? 0) + '%\uff08\u5df2\u4ea7\u51fa ' + (st.frames || 0) + ' \u5e27\uff09', type: 'info', duration: 0 })
      }
      if (st && st.status === 'done') {
        ElMessage.closeAll()
        ElMessage({ message: '洪水泥石流启动动力学模型_beta 完成，输出 ' + (st.frameCount || 0) + ' 帧', type: 'success', duration: 2500 })
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
        return
      }
      if (st && st.status === 'error') {
        ElMessage.closeAll()
        ElMessage({ message: '模拟失败: ' + (st.message || '未知错误'), type: 'error' })
        return
      }
      if (Date.now() - startTs > 30 * 60 * 1000) {
        ElMessage.closeAll()
        ElMessage({ message: '等待结果超时（30分钟）', type: 'error' })
        return
      }
    }
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
  dialogVisible.value = false
  ElMessage({ message: '运行中!', type: 'success', duration: 40000 })
  subitForm()
  // console.log(form.time[0])
  //把选中的时间通过自定义事件传递给父组件
  $emit('timeSelected', form.time)
}
const subitForm = () => {
  axios
    .post('/testapi/admin/user/fx', form, { timeout: 400000 })
    .then(response => {
      const text = response.data
      // console.log(text)

      // 匹配字符串中的经纬度和图片名称
      // console.log(form.time.length)

      // 构建图片名称部分的正则表达式
      let imageNameRegex = ''
      for (let i = 1; i <= form.time.length; i++) {
        imageNameRegex += `,图片名称${i}:(\\S+\\.png)`
      }
      console.log(imageNameRegex)
      // 动态构建完整的正则表达式
      const regex = new RegExp(
        `左下经度:([\\d.]+),左下纬度:([\\d.]+),右上经度:([\\d.]+),右上纬度:([\\d.]+)` +
          imageNameRegex,
      )

      // 使用构建的正则表达式进行匹配
      const matches = text.match(regex)

      // console.log(matches)

      if (matches) {
        const leftlong = Number(matches[1])
        const leftlat = Number(matches[2])
        const rightlong = Number(matches[3])
        const rightlat = Number(matches[4])

        // 提取 pname 参数（从索引 5 开始）
        const pnames = matches.slice(5)
        // console.log(pnames)

        // 传递参数给父组件
        const params = { leftlat, leftlong, rightlat, rightlong, pnames }
        $emit('openLayers', params)
      } else {
        console.error('没有找到匹配的数据！')
      }
    })
    .catch(error => {
      console.error(error)
      // 处理错误
    })
}
//演进模型-avaflow
function onSubmit1() {
  dialogVisible1.value = false
  ElMessage({ message: '运行中，请稍候...', type: 'info', duration: 3000 })
  subitForm1()
}
const subitForm1 = async () => {
  try {
    // 如果有上传文件，优先上传并按指定名字重命名
    if (fileElev.value || fileDebris.value || fileImpact.value) {
      const formData = new FormData()
      // append renamed files if present
      if (fileElev.value) {
        const f = new File([fileElev.value], 'elev.tif', {
          type: fileElev.value.type || 'application/octet-stream',
        })
        formData.append('files', f)
      }
      if (fileDebris.value) {
        const f = new File([fileDebris.value], 'debris.tif', {
          type: fileDebris.value.type || 'application/octet-stream',
        })
        formData.append('files', f)
      }
      if (fileImpact.value) {
        const f = new File([fileImpact.value], 'impact_area.tif', {
          type: fileImpact.value.type || 'application/octet-stream',
        })
        formData.append('files', f)
      }

      ElMessage({ message: '文件上传中，请稍候...', type: 'info', duration: 0 })
      const upResp = await modelService.uploadAvaflowFiles(formData)
      ElMessage.closeAll()
      if (!upResp || upResp?.status !== 'ok') {
        ElMessage({ message: upResp?.message || '文件上传失败', type: 'error' })
        return
      }
      ElMessage({
        message: '文件上传成功，开始启动模拟',
        type: 'success',
        duration: 1500,
      })
    }

    const data = await modelService.runAvaflow(form1)
    if (data && data.status === 'ok') {
      ElMessage({
        message:
          data?.message || '山洪泥石流模拟已启动（按 start1.sh 默认参数执行）',
        type: 'success',
        duration: 2500,
      })
      $emit('yjLayers', { area: form1.area, result: data })
    } else {
      ElMessage({ message: data?.message || '模拟失败', type: 'error' })
    }
  } catch (error) {
    console.error('山洪泥石流模拟请求失败:', error)
    ElMessage({
      message:
        error?.response?.data?.message ||
        error?.message ||
        '请求失败，请检查后端服务',
      type: 'error',
    })
    $emit('yjLayers', { area: form1.area, result: null })
  }
}

// 洪水泥石流启动动力学模型（python_port 双层浅水流数值内核）
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
// 两个入口共用同一套「手绘范围 + 抬升底床 + Pro 动力学计算」实现，仅面板文案与主题按功能差异化。
const terrainRegulationConfigs = reactive([
  {
    kind: 'chain',
    visible: false,
    title: '灾害链断链调控技术',
    tagline: '关键链节阻截',
    accent: '#5ab0ff',
    desc:
      '在物源启动—沟道输移的关键转换链节手绘阻截范围，抬高底床形成拦挡坝体，截断物源向下游的逐级放大。',
    areaLabel: '拦挡范围',
    raiseLabel: '坝体加高值',
    raisePlaceholder: '例如 20',
    runText: '执行断链调控计算',
    hint: '运行前请先在「洪水泥石流启动动力学模型」中准备好输入数据（zb/zl/hw），未选择文件时使用内置示例数据。',
  },
  {
    kind: 'along',
    visible: false,
    title: '冰川泥石流沿程调控技术',
    tagline: '沿程护底消能',
    accent: '#24c8a0',
    desc:
      '沿冰川泥石流运动路径手绘护底与消能范围，抬升床面削弱沿程侵蚀冲刷，控制泥石流规模的持续放大。',
    areaLabel: '调控范围',
    raiseLabel: '床面抬升高度',
    raisePlaceholder: '例如 15',
    runText: '执行沿程调控计算',
    hint: '与断链调控共用同一套动力学内核与输入数据，区别在于调控范围沿沟道纵向布设。',
  },
])

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
  terrainRunning.value = true
  try {
    const ok = await submitForm2({
      terrainEdits: [
        {
          polygon: terrainPolygon.value.map(p => [Number(p[0]), Number(p[1])]),
          raise,
        },
      ],
    })
    if (ok === true) {
      const cfg = terrainRegulationConfigs.find(item => item.kind === kind)
      if (cfg) cfg.visible = false
    }
  } finally {
    terrainRunning.value = false
  }
}

defineExpose({ onTerrainPolygonDrawn, onTerrainDrawCancelled })

// 参数传回后端 -> 后端调用 suanfa/Pro/python_port 数值内核 -> 输出 ASC 帧 -> 前端渲染
const submitForm2 = async (extra = {}) => {
  if (floodRunning.value) {
    ElMessage({ message: '正在计算中，请稍候...', type: 'info' })
    return
  }
  floodRunning.value = true
  ElMessage({ message: '数值计算启动中...', type: 'info', duration: 0 })
  try {
    // 选了三份输入数据就先上传（后端用上传数据计算）；都不选则用内置示例数据
    const chosen = proFileItems.filter(item => proFiles[item.key])
    if (chosen.length > 0 && chosen.length < proFileItems.length) {
      ElMessage.closeAll()
      ElMessage({
        message: 'zb / zl / hw 三份数据要么都选，要么都不选（不选用内置示例数据）',
        type: 'warning',
        duration: 4000,
      })
      return
    }
    let jobId = ''
    if (chosen.length === proFileItems.length) {
      ElMessage.closeAll()
      ElMessage({ message: '输入数据上传中...', type: 'info', duration: 0 })
      const formData = new FormData()
      const crs = String(proSourceCrs.value || '').trim()
      const anchorLon = String(proAnchorLon.value || '').trim()
      const anchorLat = String(proAnchorLat.value || '').trim()
      if (crs) formData.append('sourceCrs', crs)
      if (anchorLon) formData.append('anchorLon', anchorLon)
      if (anchorLat) formData.append('anchorLat', anchorLat)
      const keepExts = ['.tif', '.tiff', '.asc', '.txt']
      for (const item of proFileItems) {
        const f = proFiles[item.key]
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
        return
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

    const anchorLonNum = proNumber(proAnchorLon.value, NaN)
    const anchorLatNum = proNumber(proAnchorLat.value, NaN)
    const accepted = await modelService.runProModel({
      jobId,
      sourceCrs: String(proSourceCrs.value || '').trim(),
      ...(Number.isFinite(anchorLonNum) && Number.isFinite(anchorLatNum)
        ? { anchorLon: anchorLonNum, anchorLat: anchorLatNum }
        : {}),
      ...(Array.isArray(extra.terrainEdits) && extra.terrainEdits.length
        ? { terrainEdits: extra.terrainEdits }
        : {}),
      params: {
        bed: proNumber(form2.bed, 0.2),
        nn: proNumber(form2.nn, 0.0125),
        dx: proNumber(form2.dx, 0),
        dy: proNumber(form2.dy, 0),
        rous: proNumber(form2.rous, 2700),
        rouf: proNumber(form2.rouf, 1000),
        interval: proNumber(form2.interval, 1),
        tmax: proNumber(form2.Tmax, 100),
        maxFrames: 40,
        field: 'solid',
      },
    })
    if (!accepted || accepted.status !== 'accepted') {
      ElMessage.closeAll()
      ElMessage({ message: accepted?.message || '启动计算失败', type: 'error' })
      return
    }
    ElMessage.closeAll()
    ElMessage({
      message: '数值计算已启动（约需数分钟），请稍候...',
      type: 'info',
      duration: 0,
    })

    const startTs = Date.now()
    while (true) {
      await new Promise(r => setTimeout(r, 4000))
      let st = null
      try {
        st = await modelService.getProStatus(accepted.jobId)
      } catch (e) {
        st = null
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
          message: '洪水泥石流启动动力学模型完成，输出 ' + (st.frameCount || 0) + ' 帧',
          type: 'success',
          duration: 2500,
        })
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
        ElMessage({ message: '模拟失败: ' + (st.message || '未知错误'), type: 'error' })
        return
      }
      if (Date.now() - startTs > 60 * 60 * 1000) {
        ElMessage.closeAll()
        ElMessage({ message: '等待结果超时（60分钟）', type: 'error' })
        return
      }
    }
  } catch (error) {
    ElMessage.closeAll()
    const msg = error?.response?.data || error?.message || error
    ElMessage({
      message:
        '洪水泥石流模拟失败: ' +
        (typeof msg === 'string' ? msg : JSON.stringify(msg)),
      type: 'error',
    })
    console.error('submitForm2 error:', error)
  } finally {
    floodRunning.value = false
  }
}

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

const submitGBM = async () => {
  if (!fileGBM.value || fileGBM.value.length === 0) {
    ElMessage({
      message: '请先选择要上传的 shapefile 相关文件',
      type: 'warning',
    })
    return
  }
  dialogVisibleGBM.value = false
  ElMessage({ message: '上传中，请稍候...', type: 'info', duration: 0 })
  try {
    //element封装的submit方法
    uploadRefGBM.value?.submit()
  } catch (err) {
    ElMessage.closeAll()
    ElMessage({ message: '上传失败：' + (err.message || err), type: 'error' })
  }
}
// el-upload 成功回调
const handleUploadSuccessGBM = async (response, file, fileList) => {
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
  console.log('GBM upload success resp:', response)

  const savedFiles = response.files || []
  try {
    const resp = await modelService.postGBM(savedFiles, form_BGM)

    ElMessage.closeAll()
    ElMessage({ message: '后端处理完成，正在加载图层', type: 'success' })
    $emit('openLayers', {
      gbmUpload: true,
      uploadResp: response,
      processResp: resp.data,
    })
  } catch (err) {
    ElMessage.closeAll()
    ElMessage({
      message: '后端处理失败：' + (err?.message || '网络或服务错误'),
      type: 'error',
    })
    console.error('调用 Spring Boot 处理 shp 失败', err)
  } finally {
    fileGBM.value = []
    fileNameGBM.value = ''
    uploadRefGBM.value?.clearFiles()
  }
}

// el-upload 错误回调
const handleUploadErrorGBM = (err, file, fileList) => {
  ElMessage.closeAll()
  ElMessage({
    message: '上传失败：' + (err?.message || '网络或后端错误'),
    type: 'error',
  })
  console.error('GBM upload error:', err)
  fileGBM.value = null
  fileNameGBM.value = ''
  uploadRefGBM.value?.clearFiles()
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

// 山洪泥石流启动动力学模型
const resetShanhongInputs = () => {
  Object.assign(form1, {
    area: '巴宜区',
    phases: '1',
    cf: '35',
    bf: '20',
    ff: '0.05',
  })
  fileNameElev.value = ''
  fileNameDebris.value = ''
  fileNameImpact.value = ''
  fileElev.value = null
  fileDebris.value = null
  fileImpact.value = null
  uploadElevRef.value?.clearFiles?.()
  uploadDebrisRef.value?.clearFiles?.()
  uploadImpactRef.value?.clearFiles?.()
}

// 洪水泥石流启动动力学模型（Pro）
const resetFloodProInputs = () => {
  if (floodRunning.value) return
  Object.assign(form2, {
    bed: '0.2',
    nn: '0.0125',
    dx: '20',
    dy: '20',
    rous: '2700',
    rouf: '1000',
    interval: '1',
    Tmax: '100',
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

// 洪水泥石流启动动力学模型（测试，界面已隐藏）
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

// 洪水泥石流启动动力学模型_beta
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
}

.left .total_theme .theme {
  margin: 20px 0;
}

.theme .title {
  width: 300px;
  text-align: left;
  padding-left: 10px;
  line-height: 35px;
  font-weight: 500;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 1);
  font-size: 22px;
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

.regulation-entry {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.regulation-entry:hover {
  transform: translateX(2px);
  box-shadow: 0 0 10px rgba(90, 176, 255, 0.55);
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
  height: 30px;
  font-weight: 500;
  letter-spacing: 1px;
  /* 添加字间距 */
  line-height: 40px;
  /* 添加行距，可以根据需要调整值 */
  // color: rgba(255, 255, 255, 1);
  color: #606266;
  text-align: left;
  font-size: 15px;
  padding-left: 10px;
  padding-top: 5px;
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
  padding-bottom: 10px;
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
