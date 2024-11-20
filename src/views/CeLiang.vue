<template>
  <div class="celiang">
    <table>
      <tbody>
        <tr>
          <td>
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
.celiang {
  position: absolute;
  top: 140px;
  left: 310px;
}
.no-list-style {
  list-style-type: none; /* 去掉序号 */
}
</style>
