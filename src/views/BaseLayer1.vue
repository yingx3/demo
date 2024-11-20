<template>
  <div class="baselayer">
    <table>
      <tbody>
        <tr>
          <td>
            <details>
              <summary>发育规律与风险判识</summary>
              <details>
                <summary style="margin-left: 20px">
                  冰川泥石流、冰岩崩孕灾模型
                </summary>
                <ol class="no-list-style">
                  <li>
                    <input type="checkbox" id="imageData" class="c2" />技术路线
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="terrainData"
                      class="c2"
                    />关键原理
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="electronicMap"
                      class="c2"
                    />输入参数
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="electronicMap"
                      class="c2"
                    />输出结果
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="electronicMap"
                      class="c2"
                    />非指标成果交付形式
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="electronicMap"
                      class="c2"
                    />预期用途及集成贡献
                  </li>
                  <details>
                    <summary style="margin-left: 60px">分析案例</summary>
                    <ol class="no-list-style">
                      <li>
                        <input
                          type="checkbox"
                          id="electronicMap"
                          class="c4"
                        />直白沟
                      </li>
                    </ol>
                  </details>
                </ol>
              </details>
              <details>
                <summary style="margin-left: 20px">
                  增温冻融土地边坡稳定性模型
                </summary>
                <ol class="no-list-style">
                  <li>
                    <details>
                      <summary class="c2">模型类别</summary>
                      <details>
                        <summary class="c3">
                          基于水文过程的降雨诱发边坡稳定性计算模型
                        </summary>
                        <ol class="no-list-style">
                          <li class="c4"><input type="checkbox" />TRIGRS</li>
                        </ol>
                      </details>
                    </details>
                  </li>
                  <li>
                    <details>
                      <summary class="c2">关键建模原理</summary>
                      <ol class="no-list-style">
                        <details>
                          <summary class="c3">水文模型</summary>
                          <details>
                            <summary class="c4">水量平衡</summary>
                            <ol class="no-list-style">
                              <li>
                                <input
                                  style="checkbox"
                                  class="c5"
                                />模拟地表径流
                              </li>
                            </ol>
                          </details>
                        </details>
                        <details>
                          <summary class="c3">入渗模型</summary>
                          <details>
                            <summary class="c4">Richard方程</summary>
                            <ol class="no-list-style">
                              <li>
                                <input
                                  style="checkbox"
                                  class="c5"
                                />反应短时间降雨引发的瞬态孔隙水压力变化
                              </li>
                            </ol>
                          </details>
                        </details>
                        <details>
                          <summary class="c3">边坡稳定性模型</summary>
                          <details>
                            <summary class="c4">无限边坡模型</summary>
                            <ul class="no-list-style">
                              <li class="c5">计算不同土壤深度下斜坡安全系数</li>
                            </ul>
                          </details>
                        </details>
                        <details>
                          <summary class="c3">斜坡单元</summary>
                          <details>
                            <summary class="c4">
                              由山脊山谷线划分计算单元
                            </summary>
                            <ol class="no-list-style">
                              <li class="c5">
                                <input
                                  type="checkbox"
                                />以斜坡单元为计算单元表征坡体状态
                              </li>
                            </ol>
                          </details>
                        </details>
                      </ol>
                    </details>
                  </li>

                  <li>
                    <details>
                      <summary class="c2">编程语言及依赖项</summary>
                      <ul class="no-list-style">
                        <li class="c3"><input type="checkbox" />Fortran</li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details>
                      <summary class="c2">模型输入参数</summary>
                      <ul class="no-list-style c3">
                        <li>
                          <details>
                            <summary>土力学参数</summary>
                            <ul class="no-list-style c1">
                              <li><input type="checkbox" />内摩擦角</li>
                              <li><input type="checkbox" />粘聚力</li>
                              <li><input type="checkbox" />土体重度</li>
                            </ul>
                          </details>
                          <details>
                            <summary>水力学参数</summary>
                            <ul class="no-list-style c1">
                              <li><input type="checkbox" />水利扩散系数</li>
                              <li><input type="checkbox" />饱和渗透系数</li>
                              <li><input type="checkbox" />初始入渗率</li>
                            </ul>
                          </details>
                          <details>
                            <summary>地形参数</summary>
                            <ul class="no-list-style c1">
                              <li><input type="checkbox" />DEM</li>
                              <li><input type="checkbox" />坡度</li>
                              <li><input type="checkbox" />土壤厚度</li>
                              <li><input type="checkbox" />流向</li>
                            </ul>
                          </details>
                          <details>
                            <summary>降雨过程</summary>
                          </details>
                        </li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details>
                      <summary class="c2">模型输出结果</summary>
                      <ul class="no-list-style c3">
                        <li>
                          <input
                            type="checkbox"
                          />不同温度下区域土体边坡稳定性安全系数
                        </li>
                        <li><input type="checkbox" />潜在危险物源总量</li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details>
                      <summary class="c2">上下游耦合目标</summary>
                      <details>
                        <summary class="c3">
                          为流域内危险冻融边坡土体防护与治理提供参考
                        </summary>
                        <ul class="no-list-style c4">
                          <li><input type="checkbox" />危险分布范围</li>
                          <li><input type="checkbox" />潜在放量大小</li>
                        </ul>
                      </details>
                    </details>
                  </li>
                </ol>
              </details>
              <details>
                <summary class="c1">冰碛土滑坡/泥石流运动过程模型</summary>
                <ul class="no-list-style c2">
                  <details>
                    <summary>模型类别</summary>
                    <details>
                      <summary class="c1">
                        基于物理过程的三维动力数值模拟
                      </summary>
                      <details>
                        <summary class="c2">
                          连续介质模拟-离散物质模拟耦合
                        </summary>
                        <ul class="no-list-style c3">
                          <li><input type="checkbox" />CFD-DEM</li>
                        </ul>
                      </details>
                    </details>
                  </details>
                  <details>
                    <summary>关键建模原理</summary>
                    <details>
                      <summary class="c1">流固耦合模型</summary>
                      <details>
                        <summary class="c2">CFD模型</summary>
                      </details>
                      <details>
                        <summary class="c2">DEM模型</summary>
                      </details>
                    </details>
                    <details>
                      <summary class="c1">颗粒间相互作用力</summary>
                      <ul class="no-list-style c2">
                        <li>
                          <input
                            type="checkbox"
                          />基于颗粒接触的颗粒间弹性力、阻尼力和摩擦力计算
                        </li>
                      </ul>
                    </details>
                    <details>
                      <summary class="c1">流体与颗粒间的相互作用</summary>
                      <ul class="no-list-style c2">
                        <li><input type="checkbox" />拖拽力</li>
                        <li><input type="checkbox" />压力梯度力</li>
                        <li><input type="checkbox" />粘性剪切力</li>
                      </ul>
                    </details>
                    <details>
                      <summary class="c1">颗粒运动学模型</summary>
                      <ul class="no-list-style c2">
                        <li><input type="checkbox" />刚体运动方程</li>
                        <li><input type="checkbox" />接触动力学模型</li>
                      </ul>
                    </details>
                  </details>
                  <details>
                    <summary>编程语言及依赖项</summary>
                    <ul class="no-list-style c1">
                      <li>C/C++</li>
                    </ul>
                  </details>
                  <details>
                    <summary>模型输入参数</summary>
                    <details>
                      <summary class="c1">地形参数</summary>
                      <ul class="no-list-style c2">
                        <li>
                          <input
                            type="checkbox"
                          />高精度数字高程模型及潜在冰碛土滑坡/泥石流物质分布
                        </li>
                      </ul>
                    </details>
                    <details>
                      <summary class="c1">材料参数</summary>
                      <details>
                        <summary class="c2">物质特性</summary>
                        <ul class="c3 no-list-style">
                          <li>流体密度、粘度</li>
                          <li>固体密度、摩擦系数</li>
                        </ul>
                      </details>
                      <details>
                        <summary class="c2">力学特性</summary>
                        <ul class="c3 no-list-style">
                          <li>流体湍流粘度、能量及耗散率</li>
                          <li>固体阻尼系数、恢复系数及泊松比</li>
                          <li>流固耦合模型、雷诺数及孔隙率</li>
                        </ul>
                      </details>
                    </details>
                  </details>
                  <details>
                    <summary>模型输出结果</summary>
                    <details>
                      <summary class="c1">冰碛土滑坡/泥石流失稳运动</summary>
                      <details>
                        <summary class="c1">运动过程时间序列</summary>
                        <ul class="no-list-style c2">
                          <li>速度</li>
                          <li>位置</li>
                          <li>作用力</li>
                        </ul>
                      </details>
                      <details>
                        <summary class="c1">能量变化时间序列</summary>
                        <ul class="no-list-style c2">
                          <li>动能</li>
                          <li>势能</li>
                          <li>能量耗散</li>
                        </ul>
                      </details>
                    </details>
                  </details>
                  <details>
                    <summary>上下游耦合目标</summary>
                    <details>
                      <summary class="c1">
                        为冰碛土滑坡/泥石流防护与治理提供参考
                      </summary>
                      <ul class="no-list-style c2">
                        <li>影像范围</li>
                        <li>减灾措施</li>
                      </ul>
                    </details>
                  </details>
                </ul>
              </details>
              <details>
                <summary class="c1">风险源定量识别与表征模型</summary>
                <ul class="no-list-style c2">
                  <details>
                    <summary>模型类别</summary>
                    <ul class="no-list-style c1">
                      <li>
                        基于临界态系统表征的高山区灾害链风险源定量判识模型
                      </li>
                    </ul>
                  </details>
                  <details>
                    <summary>关键原理</summary>
                  </details>
                  <details>
                    <summary>输出结果</summary>
                  </details>
                  <details>
                    <summary>输入参数</summary>
                  </details>
                  <details>
                    <summary>非指标性成果交付形式</summary>
                  </details>
                  <details>
                    <summary>分析案例</summary>
                  </details>
                  <details>
                    <summary>预期用途及集成贡献</summary>
                  </details>
                </ul>
              </details>
            </details>
          </td>
        </tr>

        <!-- 其他 <tr> 元素类似 -->
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'BaseData',
}
</script>
<style>
.baselayer {
  position: absolute;
  top: 140px;
  /* right: 1px; */
  left: 310px;
  width: 300px;
}
.no-list-style {
  list-style-type: none; /* 去掉序号 */
}
.c1 {
  margin-left: 20px;
}
.c2 {
  margin-left: 40px;
}
.c3 {
  margin-left: 60px;
}
.c4 {
  margin-left: 80px;
}
.c5 {
  margin-left: 100px;
}
</style>
