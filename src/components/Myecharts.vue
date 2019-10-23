<template>
  <div :id="id" :style="style"></div>
</template>
<script>
import echarts from "echarts/lib/echarts";
// 引入柱状图组件
// 引入提示框和title组件
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/legendScroll";
export default {
  name: "Myecharts",
  props: {
    id: String,
    width: {
      type: String,
      default() {
        return window.innerWidth + "px";
      }
    },
    height: {
      type: String,
      default: "300px"
    },
    option: {
      type: Object,
      //Object类型的prop值一定要用函数return出来，不然会报错。原理和data是一样的，
      //使用闭包保证一个vue实例拥有自己的一份props
      default() {
        return {
          tooltip: {
            trigger: "axis"
          },
          legend: {
            type: "scroll",
            data: []
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: []
          },
          yAxis: {
            type: "value"
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          series: []
        };
      }
    }
  },
  data() {
    return {
      //echarts实例
      chart: ""
    };
  },
  computed: {
    style() {
      return {
        height: this.height,
        width: this.width
      };
    }
  },
  watch: {
    //观察option的变化
    option: {
      handler(newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.chart.setOption(newVal);
          } else {
            this.chart.setOption(oldVal);
          }
        } else {
          this.init();
        }
      },
      deep: true //对象内部属性的监听，关键。
    }
  },
  methods: {
    init() {
      this.chart = echarts.init(document.getElementById(this.id), "light");
      this.chart.setOption(this.option);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
</style>
