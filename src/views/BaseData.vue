<template>
  <div class="basedata">
    <table>
      <tbody>
        <tr>
          <td>
            <details>
              <summary>基础地理空间数据</summary>
              <ol class="no-list-style c1">
                <li>
                  <input
                    type="checkbox"
                    id="imageData"
                    @change="handleCheckboxChange1"
                  />影像数据
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="terrainData"
                    @change="handleCheckboxChange2"
                  />路网数据
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="electronicMap"
                    @change="handleCheckboxChange3"
                  />灾害风险区划
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="electronicMap"
                    @change="handleCheckboxChange4"
                  />历史灾害点
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="electronicMap"
                    @change="handleCheckboxChange5"
                  />古滑坡灾害链
                </li>
              </ol>
            </details>
            <details>
              <summary>冰川泥石流专题数据</summary>
              <ul class="no-list-style c1">
                <li>
                  <details>
                    <summary>地形数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />坡度</li>
                      <li><input type="checkbox" />坡向</li>
                      <li><input type="checkbox" />地形起伏度</li>
                    </ul>
                  </details>
                  <details>
                    <summary>气象数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />降水量</li>
                      <li><input type="checkbox" />温度</li>
                      <li><input type="checkbox" />风速</li>
                    </ul>
                  </details>
                  <details>
                    <summary>冰川监测数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />冰川消融量</li>
                      <li><input type="checkbox" />冰川运动速率</li>
                      <li><input type="checkbox" />冰川厚度</li>
                    </ul>
                  </details>
                  <details>
                    <summary>水文数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />河流流量</li>
                      <li><input type="checkbox" />融水量</li>
                    </ul>
                  </details>
                  <details>
                    <summary>历史灾害数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />历史泥石流时间</li>
                      <li><input type="checkbox" />历史泥石流规模</li>
                      <li><input type="checkbox" />历史泥石流地点</li>
                    </ul>
                  </details>
                </li>
              </ul>
            </details>
            <details>
              <summary>冰岩崩专题数据</summary>
              <ul class="no-list-style c1">
                <li>
                  <details>
                    <summary>地质构造特征数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />地质构造</li>
                      <li><input type="checkbox" />岩层特征</li>
                      <li><input type="checkbox" />地质构造类型</li>
                    </ul>
                  </details>
                  <details>
                    <summary>地形地貌数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />地形图</li>
                      <li><input type="checkbox" />地貌图</li>
                      <li><input type="checkbox" />地形高程</li>
                    </ul>
                  </details>
                  <details>
                    <summary>气候环境数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />气温</li>
                      <li><input type="checkbox" />降水</li>
                      <li><input type="checkbox" />风速</li>
                    </ul>
                  </details>
                  <details>
                    <summary>植被覆盖数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />植被类型</li>
                      <li><input type="checkbox" />植被覆盖率</li>
                      <li><input type="checkbox" />植被分布</li>
                    </ul>
                  </details>
                  <details>
                    <summary>历史灾害数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />历史冰岩崩事件记录</li>
                      <li><input type="checkbox" />灾害影响范围</li>
                      <li><input type="checkbox" />灾害发生频率</li>
                    </ul>
                  </details>
                </li>
              </ul>
            </details>
            <details>
              <summary>溃决洪水专题数据</summary>
              <ul class="no-list-style c1">
                <li>
                  <details>
                    <summary>水文数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />水文测报数据</li>
                      <li><input type="checkbox" />水流速度</li>
                      <li><input type="checkbox" />水位高度</li>
                      <li><input type="checkbox" />流量</li>
                    </ul>
                  </details>
                  <details>
                    <summary>地形地貌数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />地形图</li>
                      <li><input type="checkbox" />地貌图</li>
                      <li><input type="checkbox" />地形高程</li>
                    </ul>
                  </details>
                  <details>
                    <summary>降雨数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />降雨量</li>
                      <li><input type="checkbox" />降雨强度</li>
                      <li><input type="checkbox" />降雨时空分布</li>
                    </ul>
                  </details>
                  <details>
                    <summary>水利工程数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />水库水文数据</li>
                      <li><input type="checkbox" />河流水文数据</li>
                      <li><input type="checkbox" />堤坝结构</li>
                    </ul>
                  </details>
                  <details>
                    <summary>历史洪水事件</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />历史洪水事件记录</li>
                      <li><input type="checkbox" />洪水泛滥范围</li>
                      <li><input type="checkbox" />灾害影响情况</li>
                    </ul>
                  </details>
                </li>
              </ul>
            </details>
            <details>
              <summary>调控防控专题数据</summary>
              <ul class="no-list-style c1">
                <li>
                  <details>
                    <summary>地形数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />坡度</li>
                      <li><input type="checkbox" />坡向</li>
                      <li><input type="checkbox" />地形起伏度</li>
                    </ul>
                  </details>
                  <details>
                    <summary>气象数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />降水量</li>
                      <li><input type="checkbox" />温度</li>
                      <li><input type="checkbox" />风速</li>
                    </ul>
                  </details>
                  <details>
                    <summary>冰川监测数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />冰川消融量</li>
                      <li><input type="checkbox" />冰川运动速率</li>
                      <li><input type="checkbox" />冰川厚度</li>
                    </ul>
                  </details>
                  <details>
                    <summary>水文数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />河流流量</li>
                      <li><input type="checkbox" />融水量</li>
                    </ul>
                  </details>
                  <details>
                    <summary>历史灾害数据</summary>
                    <ul class="no-list-style c1">
                      <li><input type="checkbox" />历史泥石流时间</li>
                      <li><input type="checkbox" />历史泥石流规模</li>
                      <li><input type="checkbox" />历史泥石流地点</li>
                    </ul>
                  </details>
                </li>
              </ul>
            </details>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'BaseData',
  methods: {
    handleCheckboxChange1(event) {
      const checked = event.target.checked
      this.$emit('checkboxclicked1', { checked })
    },
    handleCheckboxChange2(event) {
      const checked = event.target.checked
      this.$emit('checkboxclicked2', { checked })
    },
    handleCheckboxChange3(event) {
      const checked = event.target.checked
      this.$emit('checkboxclicked3', { checked })
    },
    handleCheckboxChange4(event) {
      const checked = event.target.checked
      this.$emit('checkboxclicked4', { checked })
    },
    handleCheckboxChange5(event) {
      const checked = event.target.checked
      this.$emit('checkboxclicked5', { checked })
    },
    handleCheckboxChange(event) {
      // if (event.target.checked) {
      //   console.log('111')
      // } else {
      //   console.log('222')
      // }
      const checked = event.target.checked
      this.$emit('checkboxclicked', { checked })
    },
  },
}
</script>
<style>
.basedata {
  position: absolute;
  top: 140px;
  left: 310px;
  width: 300px;
}
.no-list-style {
  list-style-type: none; /* 去掉序号 */
}
tbody tr {
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.9px;
  line-height: 26.06px;
  color: rgba(255, 255, 255, 1);
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
}
.c1 {
  margin-left: 20px;
}
</style>
