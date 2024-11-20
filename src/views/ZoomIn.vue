<template>
  <div class="zoomin">
    <table>
      <tbody>
        <tr>
          <td>
            <details>
              <summary>放大</summary>
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
.zoomin {
  position: absolute;
  top: 140px;
  left: 310px;
}
.no-list-style {
  list-style-type: none; /* 去掉序号 */
}
</style>
