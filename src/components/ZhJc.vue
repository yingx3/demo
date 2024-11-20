<template>
  <div id="">
    <div id="left"></div>
    <div id="right"></div>
    <div class="top">
      <!-- <div class="top-right1">
        <img src="../assets/img/top4.png" alt="" />
        <img src="../assets/img/top4.png" alt="" />
        <img src="../assets/img/top4.png" alt="" />
        <img src="../assets/img/top4.png" alt="" />
        <img src="../assets/img/top4.png" alt="" />
      </div>
      <div class="top-right2">
        <img src="../assets/img/top3.png" alt="" />
        <img src="../assets/img/top3.png" alt="" />
        <img src="../assets/img/top3.png" alt="" />
        <img src="../assets/img/top3.png" alt="" />
        <img src="../assets/img/top3.png" alt="" />
      </div> -->
      <div class="top-left">
        <div class="theme">
          <img
            src="../assets/img/应急管理局_1.png"
            alt="林芝市灾害应急管理局"
          />
          <!-- <img src="../assets/img/top8.png" alt="" /> -->
          <span>高山工程区灾害链数值模型集成平台</span>
        </div>
      </div>
      <!-- <div class="top-right6">
        <img src="../assets/img/top7.png" alt="" />
      </div> -->
      <div id="app1" class="top-right3">
        <div class="item" v-for="(item, index) in items" :key="index">
          <a
            href="#"
            :class="{ active: activeIndex === index }"
            @click="setActive(index)"
            >{{ item }}</a
          >
        </div>
      </div>
      <div class="top-right4">
        <!-- <img src="../assets/img/top5.png" alt="" /> -->
      </div>
      <!-- <div class="top-right5">
        <img src="../assets/img/top6_1.png" alt="" />
      </div> -->
      <!-- <div class="time">
        <p id="system-time"></p>
      </div> -->
      <!-- <div class="user">
        <a href="#">管理员</a>
      </div> -->
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'ZhJc',
  data() {
    let items = [
      // '发育规律与风险源判识',
      // '动力学过程模型模拟',
      // '定量风险评估',
      // '突发性灾害监测预警',
      // '调控技术与防控体系',
    ]
    let activeIndex = ref(0)
    return {
      items,
      activeIndex,
    }
  },
  methods: {
    setActive(index) {
      this.activeIndex = index
    },
  },
}

function formatTime(time) {
  return time < 10 ? '0' + time : time
}
// function displaySystemTime() {
//   var now = new Date()
//   var days = [
//     '星期天',
//     '星期一',
//     '星期二',
//     '星期三',
//     '星期四',
//     '星期五',
//     '星期六',
//   ]
//   var dayOfWeek = days[now.getDay()]
//   var year = now.getFullYear()
//   var month = now.getMonth() + 1 // 月份从 0 开始，所以需要加 1
//   var date = now.getDate()
//   var hours = formatTime(now.getHours())
//   var minutes = formatTime(now.getMinutes())
//   var seconds = formatTime(now.getSeconds())

//   var timeString = hours + ':' + minutes + ':' + seconds
//   var dateString = year + '-' + month + '-' + date
//   var dayString = dayOfWeek

//   document.getElementById('system-time').innerText =
//     dayString + ' ' + dateString + ' ' + timeString
// }
// 每秒更新一次系统时间
// setInterval(displaySystemTime, 1000)
</script>

<style>
/* 左右两边深色背景 */
#left {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 200px;
  height: 100vh;
  background: linear-gradient(
    90.11deg,
    rgba(3, 16, 42, 1) 0%,
    rgba(3, 16, 42, 0) 100%,
    rgba(3, 16, 42, 1) 100%
  );
}
#right {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 200px;
  height: 100vh;
  background: linear-gradient(
    -90.11deg,
    rgba(3, 16, 42, 1) 0%,
    rgba(3, 16, 42, 0) 100%,
    rgba(3, 16, 42, 1) 100%
  );
}

.top {
  position: absolute;
  top: 0;
  left: 0;
  height: 70px;
  width: 100%;
  opacity: 0.9;
  background: linear-gradient(
    180deg,
    rgba(0, 25, 75, 1) 0%,
    rgba(24, 100, 230, 1) 100%
  );
  /* 背景图片 */
  background-image: url(../assets/img/top2.png);
}
.top .top-left {
  display: flex;
  justify-content: left;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  /* width: 573.43px; */
  width: 100%;
  height: 68px;
  opacity: 1;
  /* background-image: url(../assets/img/top1_1.png); */
  background-image: url(../assets/img/导航栏.png);

  /* background: linear-gradient(
    224.82deg,
    rgba(178, 206, 255, 0.1) 0%,
    rgba(201, 221, 255, 0.4) 38.3%,
    rgba(220, 233, 255, 0.1) 100%
  ); */
  /* 字体样式 */
}
.top .top-left .theme {
  position: absolute;
  left: 585px;
  top: 0;
  font-size: 38px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 6px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  text-shadow: 0px 2px 4px;
}
.top .top-left .theme img {
  position: relative;
  left: 0;
  top: 16px;
  width: 50px;
}

.top .top-right1 {
  position: absolute;
  left: 454px;
  height: 68px;
  top: 11px;
  width: 1200px;
  height: 68px;
}
.top .top-right1 img {
  width: 220px;
}
.top .top-right2 {
  position: absolute;
  left: 454px;
  height: 68px;
  top: 5px;
  width: 1200px;
  height: 68px;
}
.top .top-right2 img {
  width: 220px;
}
.top .top-right3 {
  position: absolute;
  display: flex;
  left: 473px;
  height: 68px;
  top: 30px;
  width: 1130px;
  height: 68px;
  gap: 64px;
  text-align: center; /* 单元内的文字水平居中 */
}
.top .top-right3 .item {
  width: 158px;
}
.top .top-right3 a {
  font-size: 15px;
  font-weight: 400;
  text-decoration: none;
  color: rgba(217, 231, 255, 1);
  text-align: left;
}
.top .top-right3 a:hover {
  border: 2px solid rgba(0, 0, 0, 0);
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 1);
  line-height: 23.87px;
}
.top .top-right3 .active {
  border: 2px solid rgba(0, 0, 0, 0);
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 1);
  line-height: 23.87px;
}
.top .top-right4 {
  position: absolute;
  left: 1200px;
  top: 25px;
}
.top .top-right5 {
  position: absolute;
  left: 480px;
  top: 51px;
  width: 1422px;
  overflow: hidden;
}
.top .top-right6 {
  position: absolute;
  right: 0px;
  top: 0px;
}
.top .time {
  position: absolute;
  left: 1570px;
  top: 24px;
  font-size: 17px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
.top .user {
  position: absolute;
  left: 1840px;
  top: 24px;
}
.top .user a {
  font-size: 17px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  font-weight: 500;
  text-decoration: none;
  color: rgba(255, 255, 255, 1);
  text-align: left;
}
.top .user a:hover {
  border: 1px solid rgba(0, 0, 0, 0);
  font-size: 17px;
  font-weight: 700;
  line-height: 23.87px;
}
</style>
