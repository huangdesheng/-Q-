<template>
  <div>
    <img :src="imgUrl" alt="" class="img" />
    <div class="statement" ref="imageDom">
      <h2 style="fontSize:20px">行为报表</h2>
      <div class="time" style="fontSize:10px">
        <span>2019.10.01</span>
        <span>~</span>
        <span>2019.10.02</span>
      </div>
      <div class="message" style="fontSize:15px">
        <div>
          <span>学生:</span>
          <span>刘德华</span>
        </div>
        <div>一年级(1)班</div>
      </div>
      <div class="title">
        <table class="gridtable">
          <tr>
            <th>日期</th>
            <th>行为名称</th>
            <th>获得Q星</th>
            <th>班级平均值</th>
            <th>备注</th>
          </tr>
          <tr>
            <td>Text 1A</td>
            <td>Text 1B</td>
            <td>
              <van-rate
                readonly
                :size="10"
                v-model="Qvalue"
                @change="QonChange"
              />
            </td>
            <td>
              <van-rate
                readonly
                :size="10"
                v-model="averageValue"
                @change="averageonChange"
              />
            </td>
            <td>Text 1C</td>
          </tr>
          <tr>
            <td>Text 2A</td>
            <td>Text 2B</td>
            <td>Text 2C</td>
            <td>Text 1B</td>
            <td>Text 1C</td>
          </tr>
        </table>
      </div>
    </div>
    <div v-show="show" @click="clickGeneratePicture">截图</div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      imgUrl: "",
      Qvalue: 0,
      averageValue: 0,
      show: true
    };
  },
  mounted() {
    // this.clickGeneratePicture();
  },
  methods: {
    //获取的Q星值
    QonChange(event) {
      console.log(event);
    },
    //班级平均值
    averageonChange(event) {
      console.log(event);
    },
    clickGeneratePicture() {
      this.$nextTick(function() {
        html2canvas(this.$refs.imageDom, {}).then(canvas => {
          // 转成图片，生成图片地址
          this.imgUrl = canvas.toDataURL("image/png");
          // console.log(this.imgUrl);
          this.show = false;
          this.$refs.imageDom.style.display = "none";
        });
      });
    }
  },
  components: {
    //   VueQr,
    // domtoimage
  }
};
</script>

<style lang="less" scoped>
.statement {
  width: 90vw;
  height: 100%;
  padding: 20px;
  text-align: center;
  .h2 {
    margin-bottom: 10px;
    // font-size:20px;
  }
  .message {
    display: flex;
    justify-content: space-between;
    margin: 30px 0 20px 0;
  }
}
.gridtable {
  width: 100%;
}
table.gridtable {
  font-family: verdana, arial, sans-serif;
  font-size: 11px;
  color: #333333;
  border-width: 1px;
  border-color: #666666;
  border-collapse: collapse;
}

table.gridtable th {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #666666;
  background-color: #dedede;
  text-align: center;
}

table.gridtable td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #666666;
  background-color: #ffffff;
}
</style>