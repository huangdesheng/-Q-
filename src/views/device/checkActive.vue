<template>
  <div>
    <div>
      <div class="button-sp-area flex top" size-17>
        <a href="javascript:void(0);" id="showDatePicker" @click="popupOne = true">
          <span id="data1">{{ date }}</span>
          <van-icon name="arrow-down" size="16px"></van-icon>
        </a>
      </div>
    </div>
    <van-popup v-model="popupOne" position="bottom">
      <van-datetime-picker
        ref="datetime"
        @cancel="popupOne = false"
        v-model="currentDate"
        @confirm="handleShowDatePicker"
        type="date"
        :formatter="formatter"
      ></van-datetime-picker>
    </van-popup>
    <div id="myChart" :style="{width: '100vw', height: '350px'}"></div>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
// 引入折线组件
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
import formatter from "@/mixins/date-formatter";
import dayjs from "dayjs";
export default {
  name: "hello",
  mixins: [formatter],
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      popupOne: false,
      currentDate: new Date(),
      date: dayjs().format("YYYY-MM-DD")
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["活跃度"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["8:00", "11:00", "14:00", "18:00", "20:00", "22:00"]
        },
        yAxis: {
          type: "value",
          name: "活跃度",
          interval: 50
        },
        series: [
          {
            name: "活跃度",
            type: "line",
            stack: "总量",
            data: [20, 150, 100, 290, 175, 100, 280, 50]
          }
        ]
      });
    },
    handleShowDatePicker(value) {
      let now = dayjs(new Date(value).getTime()).format("YYYY-MM-DD");
      this.date = now;
      this.popupOne = false;
      //   if (this.roleType == 2) {
      //     this.clockStat(this.query);
      //   } else {
      //     this.clockStatWithSchool(this.query);
      //   }
    }
  }
};
</script>

<style lang="less" scoped>
.top,
#myChart {
  background: #fff;
}

.top {
  padding: 60px 0px;
  margin-bottom: 20px;
}
</style>
