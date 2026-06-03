<template>
  <div class="right-container" style="max-height: 820px">
    <div class="tree-content">
      <el-tree
        style="max-width: 600px; max-height: 750px"
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
  time: {
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
        id: 21,
        name: '地形数据',
      },

      {
        id: 12,
        name: '路网数据',
      },

      {
        id: 114,
        name: '建筑数据',
      },

      {
        id: 115,
        name: '人口数据',
      },
    ],
  },
  {
    id: 2,
    name: '地形因子',
    children: [
      {
        id: 21,
        name: '高程',
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
    name: '设备',
    children: [
      {
        id: 31,
        name: '气象站',
      },
      {
        id: 32,
        name: '地震动',
      },
      // {
      //   id: 32,
      //   name: '温度',
      // },
      // {
      //   id: 33,
      //   name: '风速',
      // },
    ],
  },
  {
    id: 4,
    name: '冰川',
    children: [
      {
        id: 17,
        name: '冰川分布',
      },
      // {
      //   id: 41,
      //   name: '冰川消融量',
      // },
      // {
      //   id: 42,
      //   name: '冰川运动速率',
      // },
      // {
      //   id: 43,
      //   name: '冰川厚度',
      // },
    ],
  },
  {
    id: 5,
    name: '水文数据',
    children: [
      {
        id: 16,
        name: '水系',
      },
      // {
      //   id: 51,
      //   name: '河流流量',
      // },
      // {
      //   id: 52,
      //   name: '融水量',
      // },
    ],
  },
  {
    id: 6,
    name: '灾害链风险源数据',
    children: [
      {
        id: 61,
        name: '灾害数据',
        children: [
          {
            id: 611,
            name: '灾害危险区划',
          },
          {
            id: 612,
            name: '历史灾害点',
          },
          {
            id: 613,
            name: '古灾害链',
          },
        ],
      },
      {
        id: 62,
        name: '冰川泥石流-堵江灾害链',
        children: [
          {
            id: 621,
            name: '历史数据模拟',
          },
          {
            id: 622,
            name: '历史未堵江点',
          },
          {
            id: 623,
            name: '历史堵江点',
          },
        ],
      },
    ],
  },
  {
    id: 7,
    name: '风险评估数据',
    children: [
      {
        id: 71,
        name: '脆弱性数据',
        children: [
          {
            id: 711,
            name: '滑坡人口脆弱性',
          },
          {
            id: 712,
            name: '泥石流人口脆弱性',
          },
          {
            id: 713,
            name: '山洪人口脆弱性',
          },
        ],
      },
      {
        id: 72,
        name: '危险性数据',
        children: [
          {
            id: 721,
            name: '滑坡危险性',
          },
          {
            id: 722,
            name: '泥石流危险性',
          },
          {
            id: 723,
            name: '山洪危险性',
          },
        ],
      },
      {
        id: 73,
        name: '承灾体分布',
        children: [
          {
            id: 731,
            name: '建筑物提取',//domestic_build
          },
          {
            id: 732,
            name: '人口提取',//linzhi_pop
          },
          {
            id: 733,
            name: '交通流量预测',//motuo_traffic
          },
        ],
      },
      {
        id: 74,
        name: '建筑物风险评估',
        children: [
          {
            id: 741,
            name: '1层建筑物脆弱性',//build_one
          },
          {
            id: 742,
            name: '2层建筑物脆弱性',//build_two
          },
          {
            id: 743,
            name: '3层建筑物脆弱性',//build_three
          },
          {
            id: 744,
            name: '砌体建筑物脆弱性',//build_masonry
          },
          {
            id: 745,
            name: '总体建筑物脆弱性',//building_risk
          },
        ],
      },
      {
        id: 75,
        name: '道路风险评估',
        children: [
          {
            id: 751,
            name: '高等级道路',//roadrisk_h
          },
          {
            id: 752,
            name: '次等级道路',//roadrisk_m
          },
          {
            id: 753,
            name: '简单道路',//roadrisk_s
          },
          {
            id: 754,
            name: '总体道路',//road_risk
          },
        ],
      },
      {
        id: 76,
        name: '桥梁风险评估',
        children: [
          {
            id: 761,
            name: '双柱式桥梁脆弱性',//bridge_d
          },
          {
            id: 762,
            name: '单柱式桥梁脆弱性',//bridge_s
          },
          {
            id: 763,
            name: '总体桥梁脆弱性',//bridge
          },
        ],
      },
      {
        id: 77,
        name: '人口风险评估',//pop_risk
      },
      {
        id: 78,
        name: '危险性评估',
        children: [
          {
            id: 781,
            name: '区域危险性评估',//linzhi_hazard
          },
          {
            id: 782,
            name: '点危险性评估',//yigong_hazard
          },
        ],
      },

    ],
  },
  // {
  //   id: 6,
  //   name: '灾害数据',
  //   children: [
  //     {
  //       id: 13,
  //       name: '灾害危险区划',
  //       children: [],
  //     },
  //     {
  //       id: 14,
  //       name: '历史灾害点',
  //     },
  //     {
  //       id: 15,
  //       name: '古灾害链',
  //     },
  //   ],
  // },
  // {
  //   id: 7,
  //   name: '冰岩崩专题数据',
  //   children: [
  //     {
  //       id: 71,
  //       name: '地质构造特征数据',
  //       children: [
  //         {
  //           id: 711,
  //           name: '地质构造',
  //         },
  //         {
  //           id: 712,
  //           name: '岩层特征',
  //         },
  //         {
  //           id: 713,
  //           name: '地质构造类型',
  //         },
  //       ],
  //     },
  //     {
  //       id: 72,
  //       name: '地形地貌数据',
  //       children: [
  //         {
  //           id: 721,
  //           name: '地形图',
  //         },
  //         {
  //           id: 722,
  //           name: '地貌图',
  //         },
  //         {
  //           id: 723,
  //           name: '地形高程',
  //         },
  //       ],
  //     },
  //     {
  //       id: 73,
  //       name: '气候环境数据',
  //       children: [
  //         {
  //           id: 731,
  //           name: '气温',
  //         },
  //         {
  //           id: 732,
  //           name: '湿度',
  //         },
  //         {
  //           id: 733,
  //           name: '风速',
  //         },
  //       ],
  //     },
  //     {
  //       id: 74,
  //       name: '植被覆盖数据',
  //       children: [
  //         {
  //           id: 741,
  //           name: '植被类型',
  //         },
  //         {
  //           id: 742,
  //           name: '植被覆盖率',
  //         },
  //         {
  //           id: 743,
  //           name: '植被分布',
  //         },
  //       ],
  //     },
  //     {
  //       id: 75,
  //       name: '历史灾害数据',
  //       children: [
  //         {
  //           id: 751,
  //           name: '历史冰岩崩事件记录',
  //         },
  //         {
  //           id: 752,
  //           name: '灾害影响范围',
  //         },
  //         {
  //           id: 753,
  //           name: '灾害发生频率',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 8,
  //   name: '溃决洪水专题数据',
  //   children: [
  //     {
  //       id: 81,
  //       name: '水文数据',
  //       children: [
  //         {
  //           id: 811,
  //           name: '水文测报数据',
  //         },
  //         {
  //           id: 812,
  //           name: '水流速度',
  //         },
  //         {
  //           id: 813,
  //           name: '水位高度',
  //         },
  //         {
  //           id: 813,
  //           name: '流量',
  //         },
  //       ],
  //     },
  //     {
  //       id: 82,
  //       name: '地形地貌数据',
  //       children: [
  //         {
  //           id: 821,
  //           name: '地形图',
  //         },
  //         {
  //           id: 822,
  //           name: '地貌图',
  //         },
  //         {
  //           id: 823,
  //           name: '地形高程',
  //         },
  //       ],
  //     },
  //     {
  //       id: 83,
  //       name: '降雨数据',
  //       children: [
  //         {
  //           id: 821,
  //           name: '降雨量',
  //         },
  //         {
  //           id: 822,
  //           name: '降雨强度',
  //         },
  //         {
  //           id: 823,
  //           name: '降雨时空分布',
  //         },
  //       ],
  //     },
  //     {
  //       id: 84,
  //       name: '水利工程数据',
  //       children: [
  //         {
  //           id: 841,
  //           name: '水库水文数据',
  //         },
  //         {
  //           id: 842,
  //           name: '河流水文数据',
  //         },
  //         {
  //           id: 843,
  //           name: '堤坝结构',
  //         },
  //       ],
  //     },
  //     {
  //       id: 85,
  //       name: '历史洪水事件',
  //       children: [
  //         {
  //           id: 851,
  //           name: '历史洪水事件记录',
  //         },
  //         {
  //           id: 852,
  //           name: '洪水泛滥范围',
  //         },
  //         {
  //           id: 853,
  //           name: '灾害影响情况',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 9,
  //   name: '调控防控专题数据',
  //   children: [
  //     {
  //       id: 91,
  //       name: '地形数据',
  //       children: [
  //         {
  //           id: 911,
  //           name: '历史洪水事件记录',
  //         },
  //         {
  //           id: 912,
  //           name: '洪水泛滥范围',
  //         },
  //         {
  //           id: 913,
  //           name: '灾害影响情况',
  //         },
  //       ],
  //     },
  //     {
  //       id: 92,
  //       name: '气象数据',
  //       children: [
  //         {
  //           id: 921,
  //           name: '降水量',
  //         },
  //         {
  //           id: 922,
  //           name: '温度',
  //         },
  //         {
  //           id: 923,
  //           name: '风速',
  //         },
  //       ],
  //     },
  //     {
  //       id: 93,
  //       name: '冰川监测数据',

  //       children: [
  //         {
  //           id: 931,
  //           name: '冰川消融量',
  //         },
  //         {
  //           id: 932,
  //           name: '冰川运动速率',
  //         },
  //         {
  //           id: 933,
  //           name: '冰川厚度',
  //         },
  //       ],
  //     },
  //     {
  //       id: 94,
  //       name: '水文数据',
  //       children: [
  //         {
  //           id: 941,
  //           name: '河流流量',
  //         },
  //         {
  //           id: 942,
  //           name: '融水量',
  //         },
  //       ],
  //     },
  //     {
  //       id: 95,
  //       name: '历史灾害数据',
  //       children: [
  //         {
  //           id: 951,
  //           name: '历史泥石流时间',
  //         },
  //         {
  //           id: 952,
  //           name: '历史泥石流规模',
  //         },
  //         {
  //           id: 953,
  //           name: '历史泥石流地点',
  //         },
  //       ],
  //     },
  //   ],
  // },
])
// 树节点属性映射关系
const defaultProps = {
  label: 'name',
  children: 'children',
}
//结构time
const { time } = props
// for (let t of time) {
//   console.log(t)
//   // console.log('121')
//   console.log('121')
// }

// 递归查找节点的函数
function findNodeById(nodes, id) {
  for (let node of nodes) {
    if (node.id === id) {
      return node // 找到并返回节点
    }
    if (node.children && node.children.length > 0) {
      const childNode = findNodeById(node.children, id) // 递归查找子节点
      if (childNode) {
        return childNode
      }
    }
  }
  return null // 如果没有找到，返回 null
}

const addChildNode = time => {
  const targetNode = findNodeById(treeData.value, 13)
  if (targetNode) {
    let idCounter = 131
    let layer_id = 2
    const newChildren = []
    if (time && time.length > 0) {
      time.forEach(selectedTime => {
        newChildren.push({
          id: idCounter++,
          name: `${selectedTime / 3600}h`,
          children: [],
          layer_id: `${layer_id++}`,
        })
      })
      if (time.length > 1) {
        newChildren.push({
          id: 137,
          name: `合并所有时间段`,
          children: [],
        })
      }
    } else {
      console.log('时间数组为空，无法添加子节点')
    }
    // 一次性替换 children 再触发视图更新，避免中间空数组触发 @check 发射空 ps
    targetNode.children = newChildren
    treeData.value = [...treeData.value]
  } else {
    console.log('节点未找到')
  }
}
// 监听传递的 `time` prop，当时间变化时，动态更新树数据
watch(
  () => props.time,
  newTime => {
    setTimeout(() => {
      if (newTime.length > 0) {
        // console.log(newTime)
        // addChildNode(newTime)
        addChildNode(newTime)
      }
    }, 50)
  },
  { immediate: true } // 可选：在组件初始化时也执行一次
)
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
  // const validIds = [131, 132, 133, 134, 135, 136, 137]
  let uncheckedNode = null
  // 获取所有已选中的节点的 id
  const checkedNodeIds = treeRef.value.getCheckedNodes().map(node => node.id)
  // 检查当前节点的 id 是否在已选中的节点中
  if (!checkedNodeIds.includes(node.id)) {
    uncheckedNode = node.id
  }
  // 打印当前勾选的节点数据
  if (treeRef.value) {
    const checkedNodes = []

    for (const node of treeRef.value.getCheckedNodes()) {
      checkedNodes.push(node.id) // 假设节点数据中有 id 字段
    }
    // console.log('Selected Node IDs:', checkedNodes) // 打印选中节点的 id 数组
    $emit('checkedLayers', checkedNodes, uncheckedNode)
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
  height: 790px;
  width: 320px;
  background-image: url(../assets/img/c1.png);

  .tree-content {
    max-height: 780px;
    width: 100%;
    margin-top: 40px;
    overflow: scroll;
    // -ms-overflow-style: none;
    scrollbar-width: none; // 隐藏滚动条
  }
}
</style>
