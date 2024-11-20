<template>
  <div class="biaoji">
    <table>
      <tbody>
        <tr>
          <td>
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
.biaoji {
  position: absolute;
  top: 140px;
  left: 310px;
}
.no-list-style {
  list-style-type: none; /* 去掉序号 */
}
</style>
