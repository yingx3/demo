<template>
<<<<<<< HEAD
  <div id="res">
    <div class="catlog1">
      <div class="plugin1">
        <div class="p1">
          <!-- <a href="/database" class="link" @click="showImage(0)"> -->
          <RouterLink to="/BaseData" @click="showImage(0)">
            <img src="../assets/img/right1.png" alt="" class="img img1" />
            <img src="../assets/img/right2.png" alt="" class="img img2" />
            <img src="../assets/img/hover1.png" alt="" class="img img3" />
            :class="{ hidden: 0 !== activeIndex }"
          </RouterLink>
        </div>
        <!-- <div class="p2">
          <RouterLink to="/BaseLayer" @click="showImage(1)">
            <img src="../assets/img/right1.png" alt="" class="img img1" />
            <img src="../assets/img/right3.png" alt="" class="img img2" />
            <img
              src="../assets/img/hover1.png"
              alt=""
              class="img img3"
              :class="{ hidden: 1 !== activeIndex }"
            />
          </RouterLink>
        </div>
        <div class="p3">
          <RouterLink to="/BiaoJi" @click="showImage(2)">
            <img src="../assets/img/right1.png" alt="" class="img img1" />
            <img src="../assets/img/right4.png" alt="" class="img img2" />
            <img
              src="../assets/img/hover1.png"
              alt=""
              class="img img3 image"
              :class="{ hidden: 2 !== activeIndex }"
            />
          </RouterLink>
        </div>
        <div class="p4">
          <RouterLink to="/CeLiang" @click="showImage(3)">
            <img src="../assets/img/right1.png" alt="" class="img img1" />
            <img src="../assets/img/right5.png" alt="" class="img img2" />
            <img
              src="../assets/img/hover1.png"
              alt=""
              class="img img3 image"
              :class="{ hidden: 3 !== activeIndex }"
            />
          </RouterLink>
        </div>
        <div class="p5">
          <RouterLink to="/SpAn" @click="showImage(4)">
            <img src="../assets/img/right1.png" alt="" class="img img1" />
            <img src="../assets/img/right6.png" alt="" class="img img2" />
            <img
              src="../assets/img/hover1.png"
              alt=""
              class="img img3 image"
              :class="{ hidden: 4 !== activeIndex }"
            />
          </RouterLink>
        </div>
        <div class="p6">
          <RouterLink to="/MyClean" @click="showImage(5)">
            <img src="../assets/img/right1.png" alt="" class="img img1" />
            <img src="../assets/img/right7.png" alt="" class="img img2" />
            <img
              src="../assets/img/hover1.png"
              alt=""
              class="img img3 image"
              :class="{ hidden: 5 !== activeIndex }"
            />
          </RouterLink>
        </div>
        <div class="p7">
          <RouterLink to="/MyEarth" @click="showImage(6)">
            <img src="../assets/img/right1.png" alt="" class="img img1" />
            <img src="../assets/img/right8.png" alt="" class="img img2" />
            <img
              src="../assets/img/hover1.png"
              alt=""
              class="img img3 image"
              :class="{ hidden: 6 !== activeIndex }"
            />
          </RouterLink>
        </div>
        <div class="p8">
          <RouterLink to="/ZoomIn" @click="showImage(7)">
            <img src="../assets/img/right1.png" alt="" class="img img1" />
            <img src="../assets/img/right9.png" alt="" class="img img2" />
            <img
              src="../assets/img/hover1.png"
              alt=""
              class="img img3 image"
              :class="{ hidden: 7 !== activeIndex }"
            />
          </RouterLink>
        </div>
        <div class="p9">
          <RouterLink to="/ZoomOut" @click="showImage(8)">
            <img src="../assets/img/right1.png" alt="" class="img img1" />
            <img src="../assets/img/right10.png" alt="" class="img img2" />
            <img
              src="../assets/img/hover1.png"
              alt=""
              class="img img3 image"
              :class="{ hidden: 8 !== activeIndex }"
            />
          </RouterLink>
        </div>
        <div class="p10">
          <RouterLink to="/TwoDimension" @click="showImage(9)">
            <img src="../assets/img/right1.png" alt="" class="img img1" />
            <img src="../assets/img/right11.png" alt="" class="img img2" />
            <img
              src="../assets/img/hover1.png"
              alt=""
              class="img img3 image"
              :class="{ hidden: 9 !== activeIndex }"
            />
          </RouterLink>
        </div>
        <div class="p11">
          <RouterLink to="/NorthArrow" @click="showImage(10)">
            <img src="../assets/img/right1.png" alt="" class="img img1" />
            <img src="../assets/img/right12.png" alt="" class="img img2" />
            <img
              src="../assets/img/hover1.png"
              alt=""
              class="img img3 image"
              :class="{ hidden: 10 !== activeIndex }"
            />
          </RouterLink>
        </div> -->
      </div>
=======
  <div class="right-container">
    <div class="tree-content">
      <el-tree
        style="max-width: 600px"
        :data="treeData"
        :props="defaultProps"
        show-checkbox
        @check="handleClick"
        ref="treeRef"
      />
>>>>>>> 9b6896d (修改资源目录（el-tree）)
    </div>

    <div class="content">
      <!-- <div class="plugin2" :class="{ hidden: null !== activeIndex }"> -->
      <div class="plugin2">
        <img src="../assets/img/c1.png" alt="" />
        <div class="data">
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
      </div>
    </div>
    <div class="plugin3">
      <RouterView
        :class="{ hidden1: null === activeIndex }"
        @checkboxclicked1="handelseclick1"
        @checkboxclicked2="handelseclick2"
        @checkboxclicked3="handelseclick3"
        @checkboxclicked4="handelseclick4"
        @checkboxclicked5="handelseclick5"
        @checkboxclicked="handelseclick"
      />
    </div>
  </div>
</template>
<<<<<<< HEAD
<script>
import { RouterLink, RouterView } from 'vue-router'
export default {
  name: 'ZyMl',
  data() {
    let activeIndex = 0
    return {
      activeIndex,
    }
  },
  methods: {
    showImage(number) {
      if (this.activeIndex === number) {
        this.activeIndex = null
      } else {
        this.activeIndex = number
      }
      //   console.log(number)
    },
    handelseclick1(event) {
      const checked = event.checked
      this.$emit('checkboxclicked1', { checked })
    },
    handelseclick2(event) {
      const checked = event.checked
      this.$emit('checkboxclicked2', { checked })
    },
    handelseclick3(event) {
      const checked = event.checked
      this.$emit('checkboxclicked3', { checked })
    },
    handelseclick4(event) {
      const checked = event.checked
      this.$emit('checkboxclicked4', { checked })
    },
    handelseclick5(event) {
      const checked = event.checked
      this.$emit('checkboxclicked5', { checked })
    },
    handelseclick(event) {
      // if (event.checked) {
      //   console.log('111')
      // } else {
      //   console.log('222')
      // }
      const checked = event.checked
      this.$emit('checkboxclicked', { checked })
    },
  },
}
</script>
<style>
.catlog {
  position: absolute;
  top: 135px;
  right: 30px;
  height: 930px;

  width: 40px;
  background-image: url(../assets/img/c2.png);
}
/* 点击按钮后移动 */
.catlog1 {
  /* right: 340px; */
  position: absolute;
  top: 135px;
  right: 340px;
  height: 930px;

  width: 40px;
  background-image: url(../assets/img/c2.png);
  display: none; /*不显示选框 */
}
.catlog .plugin1 {
  position: relative;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.plugin1 .p1 .img {
  position: absolute;
  top: 0;
}
.plugin1 .p2 .img {
  position: absolute;
  top: 50px;
}
.plugin1 .p3 .img {
  position: absolute;
  top: 100px;
}
.plugin1 .p4 .img {
  position: absolute;
  top: 150px;
}
.plugin1 .p5 .img {
  position: absolute;
  top: 200px;
}
.plugin1 .p6 .img {
  position: absolute;
  top: 250px;
}
.plugin1 .p7 .img {
  position: absolute;
  top: 300px;
}
.plugin1 .p8 .img {
  position: absolute;
  top: 350px;
}
.plugin1 .p9 .img {
  position: absolute;
  top: 400px;
}
.plugin1 .p10 .img {
  position: absolute;
  top: 450px;
}
.plugin1 .p11 .img {
  position: absolute;
  top: 500px;
}

.plugin1 .img1 {
  z-index: 2;
  transform: translate(-21px, 17px); /* 分别向左和向下移动 */
  top: 50%;
  left: 50%; /* 通过设置50%将其定位在容器的中心位置 */
}
.plugin1 .img2 {
  z-index: 1;
  transform: translate(-3.5px, 21px); /* 分别向左和向下移动 */
  top: 50%;
  left: 50%; /* 通过设置50%将其定位在容器的中心位置 */
}
.plugin1 .img3 {
  height: 65px;
  z-index: 3;
  transform: translate(-19px, 1.5px); /* 分别向左和向下移动 */
  top: 50%;
  left: 50%; /* 通过设置50%将其定位在容器的中心位置 */
}
.plugin1 a {
  text-decoration: none;
}
.plugin1 .hidden {
  display: none;
}
.content {
=======

<script setup>
import { onMounted, onUnmounted, ref, getCurrentInstance } from 'vue'
// 树组件实例
const treeRef = ref(null)

//自定义事件（子传父）
let $emit = defineEmits(['checkedLayers'])
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
        name: '灾害风险区划',
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
  children: 'children',
  label: 'name',
}

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
  max-height: 950px;
>>>>>>> 9b6896d (修改资源目录（el-tree）)
  position: absolute;
  right: 20px;
  top: 115px;
  height: 950px;
  width: 320px;
<<<<<<< HEAD
  overflow: hidden;
}
.plugin2 img {
  position: absolute;
  height: 950px;
  z-index: 400;
}
.plugin2 .data {
  z-index: 500;
  position: absolute;
  top: 40px;
  left: 10px;
}
.plugin3 {
  position: absolute;
  top: 10px;
  right: 140px;
  width: 500px;
}
.plugin3 .hidden1 {
  display: none;
=======
  background-image: url(../assets/img/c1.png);

  .tree-content {
    max-height: 100%;
    width: 100%;
    margin-top: 40px;
    // overflow-y: scroll;
    overflow: hidden;
  }
>>>>>>> 9b6896d (修改资源目录（el-tree）)
}
</style>
