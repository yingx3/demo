<template>
  <div class="left">
    <div class="name">数值计算模型集</div>
    <div class="total_theme">
      <!-- 发育规律与风险源判识 -->
      <div class="theme">
        <div class="title">发育规律与风险源判识</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisible = true"><span>风险源定量识别与表征模型</span></el-button>
          <el-dialog v-model="dialogVisible" width="500" :close-on-click-modal="false" class="dialog_trigrs">
            <!--在title旁添加帮助问号（用slot="header"自定义弹窗头部） -->
            <template #header>
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                ">
                <span style="color: #ffffff; font-size: 24px">风险源定量识别与表征模型</span>
                <!-- 问号容器：定位到关闭按钮左侧 -->
                <div style="position: relative; right: 24px; top: -42px">
                  <el-tooltip content="帮助" placement="top">
                    <el-icon class="help-icon" @click="openHelpDialog_fxy = true">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <el-dialog v-model="openHelpDialog_fxy" width="1200px" max-height="600px" :close-on-click-modal="false"
              position="absolute" top="70px" style="
                background-image: url('./CS/src/assets/img/fz174.png');
                background-size: cover; /* 让背景图铺满对话框 */
                background-position: center; /* 背景图居中 */
                background-color: rgba(0, 0, 130, 0.5);
              ">
              <template #title>
                <span style="
                    color: white;
                    font-size: 26px;
                    display: block;
                    text-align: center;
                  ">风险源定量识别与表征模型核心信息</span>
              </template>
              <div id="trigrs-model-info" style="
                  width: 100%;
                  max-width: 1000px;
                  margin: 0 auto;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  max-height: 600px;
                  overflow-y: auto;
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                ">
                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  一、模型目的
                </h2>
                <p style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                  ">
                  通过模拟降雨入渗与区域边坡稳定性，定量计算网格尺度的稳定性系数，划分滑坡泥石流不稳定/稳定区域，为灾害风险预警、防治规划提供支撑。
                </p>

                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  二、所需参数及介绍
                </h2>

                <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                  （一）前置参数（TopoIndex.exe用）
                </h3>
                <ul style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #666;
                    margin: 8px 0 15px;
                    padding-left: 25px;
                  ">
                  <li style="margin-bottom: 5px">
                    <strong>输入</strong>：数字高程模型（DEM，反映地形起伏）、流向（水流方向）、网格行列数（与DEM匹配）；
                  </li>
                  <li>
                    <strong>派生参数</strong>：imax（有效网格总数）、nwf（下坡关联网格数），供后续计算调用。
                  </li>
                </ul>

                <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                  （二）核心参数（TRIGRS.exe用）
                </h3>
                <table style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 16px;
                    color: #666;
                    margin: 8px 0 15px;
                  ">
                  <tbody>
                    <tr style="background-color: transparent">
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        ">
                        类别
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        ">
                        参数
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        ">
                        单位
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        ">
                        说明
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        网格/周期
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        imax、nwf、行列数
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        -
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        取自前置环节，定网格规模
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "></td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        nper（周期数）、time（步长）
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        -、s
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        控制降雨模拟时长与精度
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        土壤/水文
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        zmin/zmax（土厚）、depth（初始水位）
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        m
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        反映土壤与地下水位基础状态
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "></td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        rizero（初入渗率）、K-sat（饱和渗率）
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        m/s
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        表征土壤水分入渗能力
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "></td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        diffus（水力扩散系数）
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        m²/s
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        反映水分扩散效率
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        "></td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        uww（水容重）、uws（土容重）
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        N/m³
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        基础物理属性，通常uww取10000
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        岩土力学
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        cohesion（粘聚力）、phi（内摩擦角）
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        Pa、°
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        决定土壤抗剪强度的关键参数
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        降雨
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        cri（雨强）、capt（周期时长）
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        -、s
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        模拟降雨特征
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        基础文件
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        前置4类径流文件
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        -
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        地形相关的径流基础数据
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                    font-style: italic;
                  ">
                  注：zmin、time、zmax等9个为暴露参数，可直接调整模拟不同场景。
                </p>

                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  三、生成结果
                </h2>
                <ol style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #666;
                    margin: 8px 0 15px;
                    padding-left: 25px;
                  ">
                  <li style="margin-bottom: 5px">
                    <strong>TRfs_min_tutorial_1.txt</strong>：易发性评估文件，0-1为高风险不稳定区，1-10为稳定区（值越大越稳），可转GIS专题图；
                  </li>
                  <li>
                    <strong>TRlist_z_p_fs_tutorial.txt</strong>：网格详单，含土壤深度、孔隙水压力、稳定性系数，供量化分析。
                  </li>
                </ol>
                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  四、运行结果示例
                </h2>
                <p style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                  ">
                  以下是模型运行后的示例输出结果：
                </p>
                <img src="/img/TRIGRS.png" alt="运行结果示例" style="
                    width: 80%;
                    height: auto;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin: 10px 0;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                    filter: none;
                  " />
              </div>
            </el-dialog>
            <p id="name_par">模型参数</p>

            <el-form :model="form" label-width="auto" style="max-width: 600px" class="form_trigrs">
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
              <el-form-item label="预测时间" class="from3_trigrs">
                <div>
                  <el-checkbox-group v-model="form.time">
                    <el-checkbox :label="'3h'" :value="10800">3h</el-checkbox>
                    <el-checkbox :label="'6h'" :value="21600">6h</el-checkbox>
                    <el-checkbox :label="'12h'" :value="43200">12h</el-checkbox>
                    <el-checkbox :label="'24h'" :value="86400">24h</el-checkbox>
                    <el-checkbox :label="'48h'" :value="172800">48h</el-checkbox>
                    <el-checkbox :label="'60h'" :value="216000">60h</el-checkbox>
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
              <el-form-item label="入渗率" class="form4_trigrs">
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
              <el-form-item>
                <el-button class="b_ex" type="primary" @click="onSubmit">运行</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisibleGBM = true"><span>冰川泥石流易发性预测模型</span></el-button>
          <el-dialog v-model="dialogVisibleGBM" title="冰川泥石流易发性预测模型" width="500" :close-on-click-modal="false"
            class="dialog_lightGBM">
            <template #header>
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                ">
                <span style="color: #ffffff; font-size: 21px;padding-left: 20px">冰川泥石流易发性预测模型</span>
                <!-- 问号容器：定位到关闭按钮左侧 -->
                <div style="position: relative; right: -4px; top: -11.5px">
                  <el-tooltip content="帮助" placement="top">
                    <el-icon class="help-icon" @click="openHelpDialog_gbm = true">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <el-dialog v-model="openHelpDialog_gbm" width="1200px" max-height="600px" :close-on-click-modal="false"
              position="absolute" top="70px" style="
                background-image: url('./CS/src/assets/img/fz174.png');
                background-size: cover; /* 让背景图铺满对话框 */
                background-position: center; /* 背景图居中 */
                background-color: rgba(0, 0, 130, 0.5);
              ">
              <template #title>
                <span style="
                    color: white;
                    font-size: 26px;
                    display: block;
                    text-align: center;
                  ">
                  冰川泥石流易发性预测模型说明文档</span>
              </template>
              <div id="glacier-hazard-chain-info" style="
                  width: 100%;
                  max-width: 1000px;
                  margin: 0 auto;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  max-height: 600px;
                  overflow-y: auto;
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                ">
                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  一、脚本目的
                </h2>
                <p style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                  ">
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
                <ul style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #666;
                    margin: 8px 0 15px;
                    padding-left: 25px;
                  ">
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
                <table style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 16px;
                    color: #666;
                    margin: 8px 0 15px;
                  ">
                  <tbody>
                    <tr style="background-color: #f5f5f5">
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        ">
                        变量名
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        ">
                        说明
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        ">
                        示例路径
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        MODEL_PATH
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        预训练 LightGBM 模型文件（.pkl）
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        E:\...\LightGBM.pkl
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        SCALER_PATH
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        标准化器文件（.pkl）
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        E:\...\standard_scaler.pkl
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        INPUT_SHP_PATH
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        待预测的输入 Shapefile 文件
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        E:\...\waternet_new.shp
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        OUTPUT_SHP_PATH
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        预测结果输出路径
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                        ">
                        E:\...\output\result.shp
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                  （三）输入数据字段（Shapefile 属性）
                </h3>
                <table style="
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 16px;
                    color: #666;
                    margin: 8px 0 15px;
                  ">
                  <tbody>
                    <tr style="background-color: #f5f5f5">
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        ">
                        Shapefile 输入字段
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        ">
                        模型特征全称
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                          font-weight: bold;
                        ">
                        说明
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Aspect
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Aspect
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        坡向
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Curvature
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Curvature
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        曲率
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Fault dist
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Fault distance
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        断层距离
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Glacier ar
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Glacier area ratio
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        冰川面积比
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Gully grad
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Gully gradient
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        沟谷坡度
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        NDVI
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        NDVI
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        植被覆盖指数
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Precipitat
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Precipitation
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        降雨量
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Relief amp
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Relief amplitude
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        地形起伏度
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Slope
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Slope
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        坡度
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Soil thick
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Soil thickness
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        土层厚度
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        SPI
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        SPI
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        沟壑功率指数
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Stream Dis
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Stream Distance
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        河流距离
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Surface ro
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Surface roughness
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        地表粗糙度
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Temperatur
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        Temperature
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        温度
                      </td>
                    </tr>
                    <tr>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        TWI
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        TWI
                      </td>
                      <td style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: left;
                        ">
                        地形湿度指数
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                    font-style: italic;
                  ">
                  补充：特征列缺失值会自动用该列均值填充；路径配置需修改代码第26-33行，脚本会自动创建输出目录，且覆盖同名旧文件。
                </p>

                <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                  三、生成结果
                </h2>
                <ol style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #666;
                    margin: 8px 0 15px;
                    padding-left: 25px;
                  ">
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
                <p style="
                    font-size: 16px;
                    line-height: 1.5;
                    color: #666;
                    margin-bottom: 15px;
                  ">
                  以下是模型运行后的示例输出结果：
                </p>
                <img src="/img/BCNSL_YC.png" alt="运行结果示例" style="
                    width: 80%;
                    height: auto;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin: 10px 0;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                    filter: none;
                  " />
              </div>
            </el-dialog>
            <p id="name_par_gbm" style="margin-left: 24px;margin-top: -27px; font-size: 18px; color: #2763ca">
              模型参数
            </p>

            <el-form :model="formGBM" label-width="auto" style="max-width: 600px" class="form_gbm">
              <el-form-item label="Shapefile" label-position="right" label-width="120px">
                <el-input v-model="fileNameGBM" placeholder="上传shp文件" readonly style="width: 160px">
                  <template #append>
                    <el-upload ref="uploadRefGBM" action="http://localhost:3000/node/upload_shp" name="file"
                      :auto-upload="false" :multiple="true" :show-file-list="false" accept=".shp,.dbf,.shx,.prj"
                      :data="uploadDataGBM" @change="handleFileChangeGBM" @success="handleUploadSuccessGBM"
                      @error="handleUploadErrorGBM">
                      <el-button style="
                          border: none;
                          color: white;
                          padding: 0;
                          margin-left: 8px;
                        " @click.stop="triggerUploadGBM">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              <div style="display: flex; justify-content: space-between;">
                <el-form-item label="占位" label-position="right" label-width="120px">
                  <el-input placeholder="------" style="width: 80px" />
                </el-form-item>
                <el-form-item label="占位" label-position="right" label-width="60px">
                  <el-input placeholder="------" style="width: 80px" />
                </el-form-item>
              </div>

              <el-form-item>
                <el-button type="primary" @click="submitGBM" class="b_ex1">上传并提交</el-button>
                <el-button @click="dialogVisibleGBM = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
      </div>
      <!-- 突发性灾害监测预警 -->
      <div class="theme">
        <div class="title">突发性灾害监测预警</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box p_bottom box-used">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialog_inverseV = true">
            <span>基于位移监测滑坡预警</span></el-button>
          <el-dialog v-model="dialog_inverseV" title="滑坡预警（测试版）" width="500" :close-on-click-modal="false"
            class="dialog_inverseV">
            <template #header>
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                ">
                <span style="color: #ffffff; font-size: 24px">基于位移监测滑坡预警</span>
                <!-- 问号容器：定位到关闭按钮左侧 -->
                <div style="position: relative; right: -4px; top: -11.5px">
                  <el-tooltip content="帮助" placement="top">
                    <el-icon class="help-icon" @click="openHelpDialog_inverseV = true">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <el-dialog v-model="openHelpDialog_inverseV" width="1200px" max-height="600px"
                  :close-on-click-modal="false" position="absolute" top="70px" style="
                    background-image: url('./CS/src/assets/img/fz174.png');
                    background-size: cover; /* 让背景图铺满对话框 */
                    background-position: center; /* 背景图居中 */
                    background-color: rgba(0, 0, 130, 0.5);
                  ">
                  <template #title>
                    <span style="
                        color: white;
                        font-size: 26px;
                        display: block;
                        text-align: center;
                      ">基于位移监测滑坡预警说明文档</span>
                  </template>
                  <div id="landslide-warning-model-info" style="
                      width: 100%;
                      max-width: 1000px;
                      margin: 0 auto;
                      padding: 20px;
                      font-family: Arial, sans-serif;
                      max-height: 600px;
                      overflow-y: auto;
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    ">
                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      一、模型目的
                    </h2>
                    <p style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      ">
                      基于位移传感器监测的时序数据，通过<strong>速度倒数法</strong>预测滑坡发生时间：将滑坡过程划分为恒速移动、变速移动、滑坡三阶段，检测变速起始点（OOA）到速度倒数为零的距离，判断滑坡发生时机，实现滑坡预警。
                    </p>

                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      二、所需数据/核心模块
                    </h2>

                    <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                      （一）核心输入数据
                    </h3>
                    <p style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 8px;
                      ">
                      时序位移监测数据，包含两类字段：
                    </p>
                    <ul style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      ">
                      <li style="margin-bottom: 5px">
                        <strong>timestamp</strong>：时间戳（如 2022-01-01
                        00:00:00）；
                      </li>
                      <li>
                        <strong>displ</strong>：传感器检测到的位移值（数值型）。
                      </li>
                    </ul>

                    <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                      （二）R语言核心脚本模块
                    </h3>
                    <table style="
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 16px;
                        color: #666;
                        margin: 8px 0 15px;
                      ">
                      <tbody>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            ">
                            脚本文件
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            ">
                            功能
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            1_1_input.R
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            主配置文件（参数入口）
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            2_data-input.R
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            数据读取与预处理
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            4_calculate_v-iv.R
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            计算速度/逆速度
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            6_OOA-detection_auto_2.R
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            自动检测加速起始点（OOA）
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            7_calculate_tof.R
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            计算破坏时间（滑坡发生时间）
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            plot7_combi.R
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            生成综合预测图表
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            99_1_new-iteration_run.R
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            增量更新预测（新数据到来时）
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      三、生成结果
                    </h2>
                    <ol style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      ">
                      <li style="margin-bottom: 5px">
                        <strong>量化结果</strong>：滑坡破坏时间（失效时间）预测值、预测不确定性区间、速度/逆速度计算结果、OOA检测结果；
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
                        <strong>功能扩展</strong>：支持新数据增量更新预测，输出实时预警相关的时间轴、不确定性分析结果。
                      </li>
                    </ol>
                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      四、运行结果示例
                    </h2>
                    <p style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      ">
                      以下是模型运行后的示例输出结果：
                    </p>
                    <img src="/img/pftf.png" alt="运行结果示例" style="
                        width: 80%;
                        height: auto;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        margin: 10px 0;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        filter: none;
                      " />
                  </div>
                </el-dialog>
              </div>
            </template>
            <el-form :model="form_inverseV" label-width="auto" style="max-width: 600px" class="form_inverseV">
              <el-form-item label="地点" class="">
                <el-input v-model="form_inverseV.name" placeholder="林芝" />
              </el-form-item>

              <el-form-item label="位移文件">
                <el-input v-model="fileName_inverseV" placeholder="上传文件" readonly style="width: 100px">
                  <template #append>
                    <el-upload ref="uploadRef" action="/node/displ" name="file" :auto-upload="false"
                      :show-file-list="false" @change="handleFileChange">
                      <el-button style="
                          border: none;
                          color: white;
                          padding: 0;
                          margin-left: 8px;
                        " @click.stop="triggerUpload">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="经度" class="">
                <el-input v-model="form_inverseV.longitude" placeholder="十进制度" />
              </el-form-item>
              <el-form-item label="纬度" class="">
                <el-input v-model="form_inverseV.latitude" placeholder="十进制度" />
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="(submit_inverseV(), (dialog_inverseV = false))"
              style="margin-left: 280px; margin-top: 20px">运行</el-button>
            <el-button style="margin-top: 20px" @click="dialog_inverseV = false">取消</el-button>
          </el-dialog>
        </div>
        <!-- <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>基于地震动信号的反演过程模型</span>
        </div> -->
        <!-- <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialog_inverseV = true">
            <span>冰川泥石流监测预警模型</span></el-button
          >
        </div> -->
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisibleSeismic = true">
            <span>冰川泥石流监测预警模型</span>
          </el-button>
          <el-dialog v-model="dialogVisibleSeismic" title="冰川泥石流监测预警模型" width="700" :close-on-click-modal="false"
            class="dialog_seismic">
            <template #header>
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                ">
                <span style="color: #ffffff; font-size: 22px; margin-left: 24px">冰川泥石流监测预警模型</span>
                <!-- 问号容器：定位到关闭按钮左侧 -->
                <div style="position: relative; right: -8px; top: -12px">
                  <el-tooltip content="帮助" placement="top">
                    <el-icon class="help-icon" @click="openHelpDialog_seismic = true">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <el-dialog v-model="openHelpDialog_seismic" width="1200px" max-height="600px"
                  :close-on-click-modal="false" position="absolute" top="70px" style="
                    background-image: url('./CS/src/assets/img/fz174.png');
                    background-size: cover; /* 让背景图铺满对话框 */
                    background-position: center; /* 背景图居中 */
                    background-color: rgba(0, 0, 130, 0.5);
                  ">
                  <template #title>
                    <span style="
                        color: white;
                        font-size: 26px;
                        display: block;
                        text-align: center;
                      ">冰川泥石流监测预警模型说明文档</span>
                  </template>
                  <div id="debris-flow-signal-detection-info" style="
                      width: 100%;
                      max-width: 1000px;
                      margin: 0 auto;
                      padding: 20px;
                      font-family: Arial, sans-serif;
                      max-height: 600px;
                      overflow-y: auto;
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    ">
                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      一、脚本目的
                    </h2>
                    <p style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      ">
                      处理传感器采集的地震波/地声/振动等时序信号，基于<strong>改进的STA/LTA（短长时窗平均比）算法</strong>自动识别泥石流事件；通过二次校验（分段趋势分析）排除误报，输出检测结果并可视化波形与检测状态。
                    </p>

                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      二、参数/环境/输入要求
                    </h2>

                    <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                      （一）环境依赖
                    </h3>

                    <ul style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      ">
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

                    <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                      （二）关键参数（代码第39-45行）
                    </h3>
                    <table style="
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 16px;
                        color: #666;
                        margin: 8px 0 15px;
                      ">
                      <tbody>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            ">
                            参数名
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            ">
                            默认值
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            ">
                            说明
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            threshold
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            2.5
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            触发阈值，STA/LTA比值超此值启动二次校验
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            short_window
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            30秒
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            短时窗，计算瞬时能量变化（反应灵敏）
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            long_window
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            240秒
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            长时窗，计算背景噪声水平（反应迟钝）
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            segment_duration
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            10秒
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            校验分段时长，触发后切分后续时间窗
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            total_duration
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            60秒
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            校验总时长，触发后向后检查的总时间
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            sampling_rate
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            100Hz
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            采样率，需与硬件采集参数一致
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                      （三）输入数据要求
                    </h3>
                    <ul style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      ">
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

                    <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                      （四）核心判定逻辑
                    </h3>
                    <ol style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      ">
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

                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      三、生成结果
                    </h2>
                    <ol style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      ">
                      <li style="margin-bottom: 5px">
                        <strong>控制台输出</strong>：是否检测到泥石流、检测到的信号数据点索引；
                      </li>
                      <li>
                        <strong>可视化结果</strong>：弹出波形与检测状态图表，其中灰色曲线为原始信号波形，红色脉冲为判定的泥石流时间段（值为1）。
                      </li>
                    </ol>
                  </div>
                </el-dialog>
              </div>
            </template>
            <p id="name_par_seismic" style="margin-left: 70px; margin-top: -6px; font-size: 18px; color: #2763ca">
              模型参数
            </p>

            <el-form :model="formSeismic" label-width="auto" style="max-width: 650px" class="form_seismic">
              <el-form-item label="Excel文件" label-width="123px" label-position="right">
                <el-input v-model="fileNameSeismic" placeholder="上传.xlsx文件" readonly style="width: 160px">
                  <template #append>
                    <el-upload ref="uploadRefSeismic" action="http://localhost:3000/node/upload_excel" name="file"
                      :auto-upload="false" :multiple="false" :show-file-list="false" accept=".xlsx"
                      :data="uploadDataSeismic" @change="handleFileChangeSeismic" @success="handleUploadSuccessSeismic"
                      @error="handleUploadErrorSeismic">
                      <el-button style="
                          border: none;
                          color: white;
                          padding: 0;
                          margin-left: 8px;
                        " @click.stop="triggerUploadSeismic">
                        <i class="iconfont icon-daoru"></i>
                      </el-button>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
              <div style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 10px;">
                <el-form-item label="阈值(threshold)" label-width="123px" label-position="right">
                  <el-input v-model="formSeismic.threshold" type="number" step="0.1" placeholder="2.5" style="width: 80px" />
                </el-form-item>
                <el-form-item label="短时窗(秒)" label-width="123px" label-position="right">
                  <el-input v-model="formSeismic.short_window" type="number" step="1" placeholder="30" style="width: 80px" />
                </el-form-item>
                <el-form-item label="长时窗(秒)" label-width="123px" label-position="right">
                  <el-input v-model="formSeismic.long_window" type="number" step="1" placeholder="240" style="width: 80px" />
                </el-form-item>
              </div>
              <div style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 10px;">
                <el-form-item label="分段时长(秒)" label-width="123px" label-position="right">
                  <el-input v-model="formSeismic.segment_duration" type="number" step="1" placeholder="10" style="width: 80px" />
                </el-form-item>
                <el-form-item label="总时长(秒)" label-width="123px" label-position="right">
                  <el-input v-model="formSeismic.total_duration" type="number" step="1" placeholder="60" style="width: 80px" />
                </el-form-item>
                <el-form-item label="采样率(Hz)" label-width="123px" label-position="right">
                  <el-input v-model="formSeismic.sampling_rate" type="number" step="1" placeholder="100" style="width: 80px" />
                </el-form-item>
              </div>

              <el-form-item>
                <el-button type="primary" @click="submitSeismic" class="b_ex1">上传并提交</el-button>
                <el-button @click="dialogVisibleSeismic = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>

        <!-- <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>基于地震动数据的灾害识别模型</span>
        </div> -->
      </div>
      <!-- 动力学过程模型模拟 -->
      <div class="theme">
        <div class="title">动力学过程模型模拟</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <el-button :plain="true" @click="dialogVisible1 = true"><span>山洪泥石流启动动力学模型</span></el-button>
          <el-dialog v-model="dialogVisible1" title="山洪泥石流启动动力学模型" style="width: 480px" :close-on-click-modal="false"
            class="dialog_avaflow">
            <template #header>
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                ">
                <span style="
                    color: #ffffff;
                    font-size: 24px;
                    display: block;
                    text-align: center;
                  ">山洪泥石流启动动力学模型</span>
                <!-- 问号容器：定位到关闭按钮左侧 -->
                <div style="position: relative; right: 23px; top: -7.5px">
                  <el-tooltip content="帮助" placement="top">
                    <el-icon class="help-icon" @click="openHelpDialog_sh = true">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <el-dialog v-model="openHelpDialog_sh" width="1200px" max-height="600px" :close-on-click-modal="false"
                  position="absolute" top="70px" style="
                    background-image: url('./CS/src/assets/img/fz174.png');
                    background-size: cover; /* 让背景图铺满对话框 */
                    background-position: center; /* 背景图居中 */
                    background-color: rgba(0, 0, 130, 0.5);
                  ">
                  <template #title>
                    <span style="
                        color: white;
                        font-size: 26px;
                        display: block;
                        text-align: center;
                      ">山洪泥石流启动动力学模型说明文档</span>
                  </template>
                  <div id="r-avaflow-model-info" style="
                      width: 100%;
                      max-width: 1000px;
                      margin: 0 auto;
                      padding: 20px;
                      font-family: Arial, sans-serif;
                      max-height: 600px;
                      overflow-y: auto;
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    ">
                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      一、模型目的
                    </h2>
                    <p style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      ">
                      用于模拟滑坡、泥石流等重力流灾害的运动过程，基于高程、释放高度、影响范围等地理栅格数据，结合摩擦力、时间、相数等参数量化分析灾害流动特征（如流量高度、路径）与影响范围，同时支持可视化参数配置生成灾害过程可视化结果，为重力流灾害风险评估、防治规划提供数据支撑（详细使用说明可参考官方手册：<a
                        href="https://www.landslidemodels.org/r.avaflow/direct.php" target="_blank"
                        style="color: #0066cc">https://www.landslidemodels.org/r.avaflow/direct.php</a>）。
                    </p>

                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      二、所需参数及介绍
                    </h2>

                    <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                      （一）核心输入数据（栅格格式）
                    </h3>
                    <ul style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      ">
                      <li style="margin-bottom: 5px">
                        <strong>高程（elevation）</strong>：单位
                        m，栅格（raster）数据，表征研究区域地形高程基础信息；
                      </li>
                      <li style="margin-bottom: 5px">
                        <strong>释放高度（hrelease1）</strong>：单位
                        m，栅格（raster）数据，表征灾害启动的初始释放高度；
                      </li>
                      <li>
                        <strong>影响范围（impactarea）</strong>：栅格（raster）数据，定义模型模拟的灾害影响范围边界。
                      </li>
                    </ul>

                    <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                      （二）核心配置参数
                    </h3>
                    <table style="
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 16px;
                        color: #666;
                        margin: 8px 0 15px;
                      ">
                      <tbody>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            ">
                            参数名
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            ">
                            单位/取值范围
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            ">
                            说明
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            prefix
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            -
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            输出文件的前缀
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            cellsize
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            -
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            可选，无则从输入数据读取，建议去掉
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            phases
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            默认 3
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            相数（默认3：固体、细固体、流体），<strong>暴露参数</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            friction
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            内摩擦[0-90]、基底摩擦[0-90]、流体摩擦&gt;0
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            单相应含3类摩擦力，<strong>暴露参数</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            time
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            -
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            2个时间值：①写入文件的时间间隔 ②模拟总时长
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            profile
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            m
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            流向坐标（从顶到底），x/y依次表示点位
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            visualization
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            -
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            共18个参数，控制可视化效果（如等高线、透明度、颜色权重等）
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <h4 style="font-size: 17px; color: #555; margin: 12px 0 8px">
                      可视化参数（visualization）细分说明
                    </h4>
                    <p style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 8px;
                      ">
                      包含18个配置项，核心作用如下：
                    </p>
                    <ul style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                        column-count: 2;
                        column-gap: 20px;
                      ">
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

                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      三、生成结果
                    </h2>
                    <p style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      ">
                      模型输出包含两部分核心结果：<br />
                      1.
                      <strong>量化数据</strong>：重力流灾害的流动高度、速度、影响范围等数值模拟结果（以配置的
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
              <el-form-item label="输入栅格文件" label-position="left" label-width="145px" class="form_files_avaflow"
                style="margin-bottom: 8px">
                <div style="
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    align-items: center;
                  ">
                  <el-input v-model="fileNameElev" placeholder="高程 (elev.tif)" readonly style="width: 180px">
                    <template #append>
                      <el-upload ref="uploadElevRef" :auto-upload="false" :show-file-list="false" accept=".tif,.tiff"
                        @change="handleFileChangeElev">
                        <el-button @click.stop="triggerUploadElev" style="
                            border: none;
                            color: white;
                            padding: 0;
                            margin-left: 8px;
                          "><i class="iconfont icon-daoru"></i></el-button>
                      </el-upload>
                    </template>
                  </el-input>

                  <el-input v-model="fileNameDebris" placeholder="启动堆积 (debris.tif)" readonly style="width: 200px">
                    <template #append>
                      <el-upload ref="uploadDebrisRef" :auto-upload="false" :show-file-list="false" accept=".tif,.tiff"
                        @change="handleFileChangeDebris">
                        <el-button @click.stop="triggerUploadDebris" style="
                            border: none;
                            color: white;
                            padding: 0;
                            margin-left: 8px;
                          "><i class="iconfont icon-daoru"></i></el-button>
                      </el-upload>
                    </template>
                  </el-input>

                  <el-input v-model="fileNameImpact" placeholder="影响范围 (impact_area.tif)" readonly style="width: 220px">
                    <template #append>
                      <el-upload ref="uploadImpactRef" :auto-upload="false" :show-file-list="false" accept=".tif,.tiff"
                        @change="handleFileChangeImpact">
                        <el-button @click.stop="triggerUploadImpact" style="
                            border: none;
                            color: white;
                            padding: 0;
                            margin-left: 8px;
                          "><i class="iconfont icon-daoru"></i></el-button>
                      </el-upload>
                    </template>
                  </el-input>
                </div>
              </el-form-item>
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  height: 20px;
                  margin-top: 15px;
                ">
                <el-form-item label="相数" label-width="50px" label-position="left" class="form1_avaflow">
                  <el-select v-model="form1.phases" placeholder="1" style="width: 90px">
                    <el-option label="单相" value="1" />
                    <el-option label="双相" value="2" />
                    <el-option label="多相" value="3" />
                  </el-select>
                </el-form-item>
                <el-form-item label="内部摩擦" label-position="left" label-width="88px" class="form2_avaflow">
                  <el-input v-model="form1.cf" placeholder="35" />
                </el-form-item>
                <el-form-item label="基底摩擦" label-position="left" label-width="88px" class="form3_avaflow">
                  <el-input v-model="form1.bf" placeholder="20" />
                </el-form-item>
              </div>

              <el-form-item>
                <el-button type="primary" @click="onSubmit1" class="b_ex_avaflow">运行</el-button>
                <el-button @click="dialogVisible1 = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <div class="box box-used p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />

          <el-button :plain="true" @click="dialogVisible2 = true"><span>洪水泥石流启动动力学模型</span></el-button>
          <el-dialog v-model="dialogVisible2" title="洪水泥石流启动动力学模型" width="500" :close-on-click-modal="false"
            class="dialog_flood">
            <template #header>
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                ">
                <span style="color: #ffffff; font-size: 24px">洪水泥石流启动动力学模型</span>
                <!-- 问号容器：定位到关闭按钮左侧 -->
                <div style="position: relative; right: -3px; top: -28.5px">
                  <el-tooltip content="帮助" placement="top">
                    <el-icon class="help-icon" @click="openHelpDialog_flood = true">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
                <el-dialog v-model="openHelpDialog_flood" width="1200px" max-height="600px"
                  :close-on-click-modal="false" position="absolute" top="70px" style="
                    background-image: url('./CS/src/assets/img/fz174.png');
                    background-size: cover; /* 让背景图铺满对话框 */
                    background-position: center; /* 背景图居中 */
                    background-color: rgba(0, 0, 130, 0.5);
                  ">
                  <template #title>
                    <span style="
                        color: white;
                        font-size: 26px;
                        display: block;
                        text-align: center;
                      ">洪水泥石流启动动力学模型说明文档</span>
                  </template>
                  <div id="debris-flow-dynamics-model-info" style="
                      width: 100%;
                      max-width: 1000px;
                      margin: 0 auto;
                      padding: 20px;
                      font-family: Arial, sans-serif;
                      max-height: 600px;
                      overflow-y: auto;
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    ">
                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      一、模型目的
                    </h2>
                    <p style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      ">
                      基于输入的灾前/灾后地形、水深分布及相关参数，数值模拟山洪泥石流启动过程，输出滑坡、堰塞湖、洪水的关键特征数据（厚度、速度、水深等），为山洪泥石流灾害的形成机制分析、风险评估提供量化支撑。
                    </p>

                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      二、所需参数及介绍
                    </h2>

                    <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                      （一）输入数据格式与路径
                    </h3>
                    <p style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 10px;
                      ">
                      所有输入数据均以
                      <strong>txt格式</strong>
                      读取。
                    </p>
                    <table style="
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 16px;
                        color: #666;
                        margin: 8px 0 15px;
                      ">
                      <tbody>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            ">
                            变量/文件标识
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            ">
                            文件名称示例
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                              font-weight: bold;
                            ">
                            说明
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            zB
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            [basePath]\sufB.txt
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            灾前地形数据
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            zL
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            [basePath]\sufL.txt
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            灾后地形数据
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            hW
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            [basePath]\sufW.txt
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            水深分布数据
                          </td>
                        </tr>
                        <tr>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            Par
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            [basePath]\sufP.txt
                          </td>
                          <td style="
                              border: 1px solid #ddd;
                              padding: 10px;
                              text-align: left;
                            ">
                            模型计算所需参数
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p style="
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                        margin-bottom: 15px;
                      ">
                      <strong>路径说明</strong>：basePath 由
                      userName（用户目录）、taskName（任务目录）拼接而成，文件路径拼接逻辑为：<br />
                      <code style="
                          background: #f0f0f0;
                          padding: 2px 4px;
                          border-radius: 2px;
                        ">basePath = [userName, filesep, taskName,
          filesep];</code>
                    </p>

                    <h3 style="font-size: 18px; color: #555; margin: 15px 0 8px">
                      （二）核心输入数据类别
                    </h3>
                    <ul style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      ">
                      <li style="margin-bottom: 5px">
                        <strong>灾前地形（zB）</strong>：泥石流发生前的区域地形基础数据；
                      </li>
                      <li style="margin-bottom: 5px">
                        <strong>灾后地形（zL）</strong>：泥石流发生后的区域地形变化数据；
                      </li>
                      <li style="margin-bottom: 5px">
                        <strong>水深分布（hW）</strong>：研究区域内的水体深度空间分布数据；
                      </li>
                      <li>
                        <strong>模型参数（Par）</strong>：支撑动力学模拟的核心参数（如物理力学参数、计算参数等）。
                      </li>
                    </ul>

                    <h2 style="font-size: 20px; color: #444; margin: 18px 0 10px">
                      三、生成结果
                    </h2>
                    <ol style="
                        font-size: 16px;
                        line-height: 1.6;
                        color: #666;
                        margin: 8px 0 15px;
                        padding-left: 25px;
                      ">
                      <li style="margin-bottom: 5px">
                        <strong>输出格式</strong>：所有模拟结果均以
                        <strong>txt 格式</strong> 输出；
                      </li>
                      <li style="margin-bottom: 5px">
                        <strong>滑坡特征数据</strong>：厚度分布（hS）、速度分布（uS）；
                      </li>
                      <li style="margin-bottom: 5px">
                        <strong>堰塞湖特征数据</strong>：水深（hW）；
                      </li>
                      <li>
                        <strong>洪水特征数据</strong>：水深（hW）、速度分布（uW）。
                      </li>
                    </ol>
                  </div>
                </el-dialog>
              </div>
            </template>
            <p id="name_par3">模型参数</p>
            <el-form :model="form2" label-width="auto" style="max-width: 600px" class="form_flood">
              <el-form-item label="基底摩擦" class="form1_flood">
                <el-input v-model="form2.bed" placeholder="20" />
              </el-form-item>
              <el-form-item label="曼宁摩擦系数" class="form1_flood">
                <el-input v-model="form2.nn" placeholder="20" />
              </el-form-item>
              <el-form-item label="网格长度" class="form1_flood">
                <el-input v-model="form2.dx" placeholder="20" />
              </el-form-item>
              <el-form-item label="网格宽度" class="form1_flood">
                <el-input v-model="form2.dy" placeholder="20" />
              </el-form-item>
              <el-form-item label="滑坡密度" class="form1_flood">
                <el-input v-model="form2.rous" placeholder="20" />
              </el-form-item>
              <el-form-item label="河水密度" class="form1_flood">
                <el-input v-model="form2.rouf" placeholder="20" />
              </el-form-item>
              <el-form-item label="输出间距" class="form1_flood">
                <el-input v-model="form2.interval" placeholder="20" />
              </el-form-item>
              <el-form-item label="计算时间" class="form1_flood">
                <el-input v-model="form2.Tmax" placeholder="20" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit2" class="b_ex_avaflow">运行</el-button>
                <el-button @click="dialogVisible2 = false">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </div>
        <!-- <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>冰岩崩起动和冰岩碎屑流运动模型</span>
        </div> -->
        <!-- <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>冰川泥石流动力学模型</span>
        </div>         -->
      </div>
      <!-- 脆弱性分析 -->
      <div class="theme">
        <div class="title">脆弱性分析</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>全域风险脆弱性分析</span>
        </div>
      </div>

      <div class="theme">
        <div class="title">调控技术与防控体系</div>
        <img id="bar" src="../assets/img/left_line.png" alt="" />
        <div class="box">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>灾害链断链调控技术</span>
        </div>
        <div class="box p_bottom">
          <img src="../assets/img/云反射率.png" alt="" />
          <span>冰川泥石流沿程调控技术</span>
        </div>
      </div>
    </div>

    <!-- 动态生成的正方形 -->
    <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-if="squareStore.showSquare" class="square">
        <!-- <span class="close-btn" @click="closeSquare">×</span> -->

        <!-- 风险图例 -->
        <div class="legend">
          <div class="legend-item">
            <div class="color-box" :style="{ backgroundColor: 'rgba(212, 48, 48, 255)' }"></div>
            <span class="legend-text">极高风险</span>
          </div>
          <div class="legend-item">
            <div class="color-box" :style="{ backgroundColor: 'rgba(230, 141, 26, 255)' }"></div>
            <span class="legend-text">高风险</span>
          </div>
          <div class="legend-item">
            <div class="color-box" :style="{ backgroundColor: 'rgba(230, 195, 0, 220)' }"></div>
            <span class="legend-text">中风险</span>
          </div>
          <div class="legend-item">
            <div class="color-box" :style="{ backgroundColor: 'rgba(42, 130, 228, 255)' }"></div>
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
import { inject, ref } from 'vue'
import { reactive } from 'vue'
import axios from 'axios'
import modelService from '../services/modelService'
// import { exec } from 'child_process'
const dialogVisible = ref(false)
const dialogVisible1 = ref(false)
const dialogVisibleGBM = ref(false)
const dialogVisible2 = ref(false)
const dialog_inverseV = ref(false)
const openHelpDialog_fxy = ref(false)
const openHelpDialog_sh = ref(false)
const openHelpDialog_flood = ref(false)
const openHelpDialog_inverseV = ref(false)
const openHelpDialog_gbm = ref(false)
const openHelpDialog_seismic = ref(false)
const uploadRef = ref(null)
const fileName_inverseV = ref('')
// --- GBM 上传相关 ---
const uploadRefGBM = ref(null)
const fileNameGBM = ref('')
const fileGBM = ref()
const formGBM = reactive({
  name: '',
  // 前端不用把 targetFolder 强行传死，若后端需要可以传；这里演示也可以传
  targetFolder: 'E:\\Projects\\ZHLXT\\backend\\hd\\data\\BCNSL',
})
const dialogVisibleSeismic = ref(false)
const uploadRefSeismic = ref(null)
const fileNameSeismic = ref('')
const fileSeismic = ref(null)
const uploadDataSeismic = () => ({}) // 如果需要额外数据，可扩展
const showBarrage = ref(false) // 修复 "showBarrage" 未定义
const formSeismic = reactive({
  threshold: 2.5,
  short_window: 30,
  long_window: 240,
  segment_duration: 10,
  total_duration: 60,
  sampling_rate: 100
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
  'forecast',
  'seismicResult',
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
  bed: '24',
  nn: '0.0125',
  dx: '20',
  dy: '20',
  rous: '2700',
  rouf: '1000',
  interval: '10',
  Tmax: '100',
})
const form_inverseV = reactive({
  name: '',
  longitude: '',
  latitude: '',
  file: '',
})
const isProcessing = ref(false)
function onSubmit() {
  dialogVisible.value = false
  ElMessage({ message: '运行中!', type: 'success', duration: 40000 })
  subitForm()
  // console.log(form.time[0])
  //把选中的时间通过自定义事件传递给父组件
  $emit('timeSelected', form.time)
  // for (let t of form.time) {
  //   console.log(t) //打印每个选中的时间（秒数）
  // }
  // if (form.color == 'dangerLevel') {
  //   // squareStore.openSquare()
  //   console.log('111')
  //   // console.log(squareStore.showSquare)
  // }
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
      // console.log(imageNameRegex)
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
  // console.log(form.time[0])
  //把选中的时间通过自定义事件传递给父组件
  // $emit('timeSelected', form.time)
  // for (let t of form.time) {
  //   console.log(t) //打印每个选中的时间（秒数）
  // }
  // if (form.color == 'dangerLevel') {
  //   // squareStore.openSquare()
  //   console.log('111')
  //   // console.log(squareStore.showSquare)
  // }
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

//洪水泥石流-flood
function onSubmit2() {
  dialogVisible2.value = false
  ElMessage({ message: '运行中!', type: 'success', duration: 1500 })
  submitForm2()
}
const submitForm2 = () => {
  // axios
  //   .post('/testapi/admin/user/flood', form, { timeout: 40000 })
  //   .then(response => {
  //     const text = response.data
  //   })
  //   .catch(error => {
  //     console.error(error)
  //     // 处理错误
  //   })
  $emit('floodLayers')
  // setTimeout(() => {
  //   $emit('yjLayers')
  // }, 150000)
}

// const submitForm2 = async () => {
//   try {
//     isProcessing.value = true
//     await axios.post(
//       '/testapi/admin/user/start-process',
//       'mode=realtime&intervalMs=200',
//       {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       }
//     )
//     connectWebSocket()
//   } catch (error) {
//     console.error('启动失败:', error)
//   } finally {
//     isProcessing.value = false
//   }
// }
// const connectWebSocket = () => {
//   // 创建 STOMP 客户端实例
//   const client = new Client({
//     // 使用 SockJS 作为底层传输
//     webSocketFactory: () => new SockJS('http://localhost:8088/ws'),
//     // 自动重连配置
//     reconnectDelay: 5000,
//     heartbeatIncoming: 4000,
//     heartbeatOutgoing: 4000,

//     // 连接成功回调
//     onConnect: () => {
//       // 订阅指定主题
//       client.subscribe('/topic/txt-frames', message => {
//         try {
//           const data = JSON.parse(message.body)

//           // 触发纹理数据事件
//           emitter.emit('cesium-texture-data', data)

//           // 调试日志（可选）
//           console.log('WebSocket 数据接收成功', data)
//         } catch (error) {
//           emitter.emit('cesium-error', {
//             type: 'DATA_PARSE_ERROR',
//             message: '数据解析失败',
//             detail: error,
//           })
//         }
//       })
//     },
//     // 连接断开处理
//     onDisconnect: () => {
//       emitter.emit('cesium-error', {
//         type: 'CONNECTION_CLOSED',
//         message: '连接已断开，正在尝试重连...',
//       })
//     },

//     // 异常处理
//     onStompError: error => {
//       emitter.emit('cesium-error', {
//         type: 'STOMP_ERROR',
//         message: '协议通信错误',
//         detail: error.headers.message,
//       })
//     },

//     // WebSocket 失败回调
//     onWebSocketError: error => {
//       emitter.emit('cesium-error', {
//         type: 'WS_CONNECTION_ERROR',
//         message: '连接失败',
//         detail: error,
//       })
//     },
//   })

//   // 激活客户端连接
//   client.activate()

//   // 返回清理函数（用于组件卸载时断开连接）
//   return () => {
//     if (client.active) {
//       client.deactivate()
//       console.log('WebSocket 连接已主动断开')
//     }
//   }
// }
// 控制正方形显示与隐藏的状态
// const showSquare = ref(false)

// 创建正方形的函数
// const createSquare = () => {
//   showSquare.value = true
// }

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
  fileName_inverseV.value = file.name
  // 这里可以添加文件处理逻辑
  // console.log('已选择文件:', file.name)
  // 自动触发上传（如需手动上传可删除这部分）
  uploadRef.value.submit()
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
    const resp = await modelService.postGBM(savedFiles)

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
}
// 执行R脚本
// const submit_inverseV = async () => {
//   try {
//     const response = await axios.post('node/rscript', {
//       path: 'E:/practice/demo/PFTF_1.0.0/PFTF-PFTF_1.0.0',
//       script: '1_1_input.R'
//     })
//     console.log('执行结果:', response.data)
//   } catch (error) {
//     console.error('执行失败:', error.response?.data || error.message)
//   }
// }
const submit_inverseV = async () => {
  try {
    ElMessage({ message: '运行中!', type: 'success' })
    const params = { form_inverseV }
    const response = await axios.get('node/displ_file', { params })
    // console.log('执行结果:', response.data.rt_json)
    // console.log('执行结果:', response.data)
    // console.log('执行结果:', response.data.fileProcessing.rt_json.rt)

    const rt = response.data.fileProcessing.rt_json.rt
    const time = response.data.fileProcessing.rt_json.time
    const databaseOperation = response.data.databaseOperation
    const pointId = response.data.databaseOperation.pointId
    const lon = response.data.databaseOperation.coordinates.longitude
    const lat = response.data.databaseOperation.coordinates.latitude
    const params_return = { pointId, lon, lat, rt, time }
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
    console.error('执行失败:', error.response?.data || error.message)
  }
}
// const submit_inverseV = async () => {
//   try {
//     ElMessage({ message: '运行中!(约2分钟)', type: 'success', duration: 120000 })
//     const response = await axios.get('node/api/crack/ZXPRTL5002024A0454')

//     console.log('执行结果:', response.data)
//     if (response.data.ooaDetected==false){
//       alert("并未出现滑坡！")
//     }else{
//       alert("请您及时关注预警！！！")
//     }

//   } catch (error) {
//     console.error('执行失败:', error.response?.data || error.message)
//   }
// }
// const submit_inverseV = async () => {
//   const rscriptPath = '"C:\\Program Files\\R\\R-4.3.1\\bin\\x64\\Rscript.exe"'
//   const targetDir = 'E:/practice/demo/PFTF_1.0.0/PFTF-PFTF_1.0.0'
//   const script = '1_1_input.R'

//   const command = `cd /d "${targetDir}" && ${rscriptPath} ${script}`

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error('执行失败:', { error: error.message, stderr })
//       return
//     }
//     console.log('执行成功:', stdout)
//   })
// }
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
  console.log('Seismic upload success resp:', response)

  const savedFile = response.file // 单文件
  try {
    const resp = await modelService.postSeismic(savedFile, formSeismic)

    ElMessage.closeAll()
    ElMessage({ message: '后端处理完成，正在加载结果', type: 'success' })

    // 不在子组件直接操作 Cesium，改为发事件给父组件由父组件渲染
    const detected = resp?.detected || false
    // 传回检测结果和可选坐标（若后端返回）
    const payload = {
      detected,
      lon: resp?.lon ?? 97.5,
      lat: resp?.lat ?? 31.0,
      info: resp,
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
  }
}

// el-upload 错误回调
const handleUploadErrorSeismic = (err, file, fileList) => {
  ElMessage.closeAll()
  ElMessage({
    message: '上传失败：' + (err?.message || '网络或后端错误'),
    type: 'error',
  })
  console.error('Seismic upload error:', err)
  fileSeismic.value = null
  fileNameSeismic.value = ''
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

/* .fade-leave-active 在离开时生效 */
  {
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
  height: 300px;
  background-image: url('../assets/img/fz173.png');
  background-size: 100% 100%;
}

:deep(.el-dialog.dialog_seismic) {
  --el-dialog-bg-color: transparent;
  margin-top: 15%;
  width: 700px;
  height: 400px;
  background-image: url('../assets/img/fz173.png');
  background-size: 100% 100%;
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

:deep(.el-input-group__append .el-button,
  .el-input-group__append .el-select,
  .el-input-group__prepend .el-button,
  .el-input-group__prepend .el-select) {
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

.b_ex1 {
  margin-left: 240px;
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
</style>
