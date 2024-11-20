<template>
  <div class="baselayer">
    <table>
      <tbody>
        <tr>
          <td>
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
          </td>
        </tr>
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
