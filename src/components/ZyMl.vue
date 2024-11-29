<template>
  <div class="right-container">
    <div class="tree-content">
      <el-tree
        style="max-width: 600px"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        @check="handleClick"
        node-key="id"
        ref="treeRef"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, getCurrentInstance } from 'vue'
import { useSquareStore } from '../stores/squareStore'
// import { PropType } from 'vue'
// 树组件实例
const treeRef = ref(null)
// 获取 store 实例
const squareStore = useSquareStore()
//自定义事件（子传父）
let $emit = defineEmits(['checkedLayers'])

//接收父组件传递的选中节点 ID 列表
const props = defineProps({
  checkedIds: {
    type: Array,
    default: () => [],
  },
})
// 树形数据
const treeData = ref([
  {
    id: 1,
    name: '基础地理空间数据',
    children: [
      {
        id: 11,
        name: '影像数据',
      },
      {
        id: 12,
        name: '路网数据',
      },
      {
        id: 13,
        name: '灾害危险区划',
      },
      {
        id: 14,
        name: '历史灾害点',
      },
      {
        id: 15,
        name: '古滑坡灾害链',
      },
    ],
  },
  {
    id: 2,
    name: '冰川泥石流专题数据',
    children: [
      {
        id: 21,
        name: '地形数据',
      },
      {
        id: 22,
        name: '坡度',
      },
      {
        id: 23,
        name: '坡向',
      },
      {
        id: 24,
        name: '地形起伏度',
      },
    ],
  },
  {
    id: 3,
    name: '气象数据',
    children: [
      {
        id: 31,
        name: '降水量',
      },
      {
        id: 32,
        name: '温度',
      },
      {
        id: 33,
        name: '风速',
      },
    ],
  },
  {
    id: 4,
    name: '冰川监测数据',
    children: [
      {
        id: 41,
        name: '冰川消融量',
      },
      {
        id: 42,
        name: '冰川运动速率',
      },
      {
        id: 43,
        name: '冰川厚度',
      },
    ],
  },
  {
    id: 5,
    name: '水文数据',
    children: [
      {
        id: 51,
        name: '河流流量',
      },
      {
        id: 52,
        name: '融水量',
      },
    ],
  },
  {
    id: 6,
    name: '历史灾害数据',
    children: [
      {
        id: 61,
        name: '历史泥石流时间',
      },
      {
        id: 62,
        name: '历史泥石流规模',
      },
      {
        id: 63,
        name: '历史泥石流地点',
      },
    ],
  },
  {
    id: 7,
    name: '冰岩崩专题数据',
    children: [
      {
        id: 71,
        name: '地质构造特征数据',
        children: [
          {
            id: 711,
            name: '地质构造',
          },
          {
            id: 712,
            name: '岩层特征',
          },
          {
            id: 713,
            name: '地质构造类型',
          },
        ],
      },
      {
        id: 72,
        name: '地形地貌数据',
        children: [
          {
            id: 721,
            name: '地形图',
          },
          {
            id: 722,
            name: '地貌图',
          },
          {
            id: 723,
            name: '地形高程',
          },
        ],
      },
      {
        id: 73,
        name: '气候环境数据',
        children: [
          {
            id: 731,
            name: '气温',
          },
          {
            id: 732,
            name: '湿度',
          },
          {
            id: 733,
            name: '风速',
          },
        ],
      },
      {
        id: 74,
        name: '植被覆盖数据',
        children: [
          {
            id: 741,
            name: '植被类型',
          },
          {
            id: 742,
            name: '植被覆盖率',
          },
          {
            id: 743,
            name: '植被分布',
          },
        ],
      },
      {
        id: 75,
        name: '历史灾害数据',
        children: [
          {
            id: 751,
            name: '历史冰岩崩事件记录',
          },
          {
            id: 752,
            name: '灾害影响范围',
          },
          {
            id: 753,
            name: '灾害发生频率',
          },
        ],
      },
    ],
  },
  {
    id: 8,
    name: '溃决洪水专题数据',
    children: [
      {
        id: 81,
        name: '水文数据',
        children: [
          {
            id: 811,
            name: '水文测报数据',
          },
          {
            id: 812,
            name: '水流速度',
          },
          {
            id: 813,
            name: '水位高度',
          },
          {
            id: 813,
            name: '流量',
          },
        ],
      },
      {
        id: 82,
        name: '地形地貌数据',
        children: [
          {
            id: 821,
            name: '地形图',
          },
          {
            id: 822,
            name: '地貌图',
          },
          {
            id: 823,
            name: '地形高程',
          },
        ],
      },
      {
        id: 83,
        name: '降雨数据',
        children: [
          {
            id: 821,
            name: '降雨量',
          },
          {
            id: 822,
            name: '降雨强度',
          },
          {
            id: 823,
            name: '降雨时空分布',
          },
        ],
      },
      {
        id: 84,
        name: '水利工程数据',
        children: [
          {
            id: 841,
            name: '水库水文数据',
          },
          {
            id: 842,
            name: '河流水文数据',
          },
          {
            id: 843,
            name: '堤坝结构',
          },
        ],
      },
      {
        id: 85,
        name: '历史洪水事件',
        children: [
          {
            id: 851,
            name: '历史洪水事件记录',
          },
          {
            id: 852,
            name: '洪水泛滥范围',
          },
          {
            id: 853,
            name: '灾害影响情况',
          },
        ],
      },
    ],
  },
  {
    id: 9,
    name: '调控防控专题数据',
    children: [
      {
        id: 91,
        name: '地形数据',
        children: [
          {
            id: 911,
            name: '历史洪水事件记录',
          },
          {
            id: 912,
            name: '洪水泛滥范围',
          },
          {
            id: 913,
            name: '灾害影响情况',
          },
        ],
      },
      {
        id: 92,
        name: '气象数据',
        children: [
          {
            id: 921,
            name: '降水量',
          },
          {
            id: 922,
            name: '温度',
          },
          {
            id: 923,
            name: '风速',
          },
        ],
      },
      {
        id: 93,
        name: '冰川监测数据',

        children: [
          {
            id: 931,
            name: '冰川消融量',
          },
          {
            id: 932,
            name: '冰川运动速率',
          },
          {
            id: 933,
            name: '冰川厚度',
          },
        ],
      },
      {
        id: 94,
        name: '水文数据',
        children: [
          {
            id: 941,
            name: '河流流量',
          },
          {
            id: 942,
            name: '融水量',
          },
        ],
      },
      {
        id: 95,
        name: '历史灾害数据',
        children: [
          {
            id: 951,
            name: '历史泥石流时间',
          },
          {
            id: 952,
            name: '历史泥石流规模',
          },
          {
            id: 953,
            name: '历史泥石流地点',
          },
        ],
      },
    ],
  },
])
// 树节点属性映射关系
const defaultProps = {
  label: 'name',
  children: 'children',
}

//监听父组件传递的选中节点ID列表,watch(source, callback, options)source:数据源，表示要监听的内容。callback: 回调函数，当数据发生变化时会触发。options: 可选配置项，比如是否立即执行。
watch(
  () => props.checkedIds,
  newCheckedIds => {
    setTimeout(() => {
      if (treeRef.value) {
        treeRef.value.setCheckedKeys(newCheckedIds)
      }
    }, 50)
  },
  { immediate: true } //立即执行一次，确保初始值被处理
)

/**
 * 点击节点事件句柄方法
 */
// const handleNodeClick = (node, data) => {
//   console.log(node, data)
//   console.log('111')
// }

const handleClick = (node, data) => {
  // console.log('Clicked Node Instance:', node) // 节点的实例信息
  // console.log('Clicked Node Data:', data) // 节点的原始数据
  if (node.id == 13 && squareStore.risk) {
    squareStore.toggleSquare()
    // console.log('111')
  }
  // 打印当前勾选的节点数据
  if (treeRef.value) {
    const checkedNodes = []

    for (const node of treeRef.value.getCheckedNodes()) {
      checkedNodes.push(node.id) // 假设节点数据中有 id 字段
    }
    // console.log('Selected Node IDs:', checkedNodes) // 打印选中节点的 id 数组
    $emit('checkedLayers', checkedNodes)
    // const checkedNodes = treeRef.value.getCheckedNodes() // 获取选中的节点数据
    // console.log(treeRef.value.getCheckedNodes().length)
    // console.log(checkedNodes)
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-tree) {
  --el-fill-color-blank: transparent;
  --el-tree-node-content-height: 30px;
  font-size: 16px;
  color: white;
}
:deep(.el-tree-node:focus > .el-tree-node__content) {
  background-color: transparent; //激活颜色
}
:deep(.el-tree-node__content:hover) {
  background-color: #243857; //hover颜色
}
.right-container {
  max-height: 800px;
  position: absolute;
  right: 20px;
  top: 85px;
  height: 950px;
  width: 320px;
  background-image: url(../assets/img/c1.png);

  .tree-content {
    max-height: 100%;
    width: 100%;
    margin-top: 40px;
    // overflow-y: scroll;
    overflow: hidden;
  }
}
</style>
