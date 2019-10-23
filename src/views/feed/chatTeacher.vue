<template>
  <div class="wrapper">
    <div
      style="margin-bottom:16.467vw;height:90vh;overflow-y:auto"
      ref="sortMenu"
      id="div"
    >
      <div class="box" v-for="(item, index) in list" :key="index">
        <div class="lis" v-if="item.type == 1">
          <div class="date" v-text="item.postTime"></div>
          <div class="patriarch">
            <div class="picture">
              <img v-if="item.teacherPhoto" :src="item.teacherPhoto" alt />
              <img v-else src="@/assets/child-default@2x.png" alt />
            </div>
            <div class="main" v-text="item.textContent"></div>
          </div>
        </div>

        <div class="lis" v-else>
          <div class="date" v-text="item.postTime"></div>
          <div class="teacher">
            <div class="picture">
              <img v-if="item.studentPhoto" :src="item.studentPhoto" alt />
              <img v-else src="@/assets/child-default@2x.png" alt />
            </div>
            <div class="main" v-text="item.textContent"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div>
        <!-- <van-icon
          size="25px"
          name="service-o"
        /> -->
      </div>
      <div class="inp">
        <van-cell-group>
          <van-field
            v-model="value"
            placeholder
            :border="true"
            @change="onChange"
          />
        </van-cell-group>
      </div>
      <div class="send" @click="search">
        发送
        <!-- <van-icon size="25px" name="smile-o" /> -->
      </div>
      <div>
        <!-- <van-icon size="25px" name="add-o" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/api";
export default {
  data() {
    return {
      list: [],
      patriarchId: "",
      value: "",
      studentId: "",
      studentName: ""
    };
  },
  beforeCreate() {
    document.title = this.$route.query.studentName;
  },
  mounted() {
    this.getParams();
    this.queryTeacherFeedDetails();
    this.$route.meta.title = this.$route.query.studentName;
  },
  methods: {
    // 老师列表详情
    async queryTeacherFeedDetails() {
      let ID = this.id;
      let query2 = {
        teacherId: this.$store.state.user.info.id,
        role: 1,
        patriarchId: this.patriarchId,
        studentId: this.studentId
      };
      let res = await service.queryTeacherFeedDetails(query2);
      if (res.errorCode === 0) {
        this.list = res.data;
      }
    },

    //发送信息
    async queryTeacherFeedSeed() {
      let ID = this.id;
      let query = {
        teacherId: this.$store.state.user.info.id,
        type: 1,
        textContent: this.value,
        patriarchId: this.patriarchId,
        studentId: this.studentId
      };
      let res = await service.queryTeacherFeedSeed(query);
      if (res.errorCode === 0) {
        console.log("成功");
        this.queryTeacherFeedDetails();
        this.value = "";
        document.documentElement.scrollTop =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight +
          50;
        console.log(document.documentElement.scrollTop);
      }
    },
    search() {
      if (this.value) {
        this.queryTeacherFeedSeed();
      }
    },
    onChange(event) {
      // event.detail 为当前输入的值
      console.log(event.detail);
    },
    getParams() {
      if (this.$route.query.studentId != null) {
        this.studentId = this.$route.query.studentId;
      }
      if (this.$route.query.patriarchId != null) {
        this.patriarchId = this.$route.query.patriarchId;
      }
      if (this.$route.query.studentName != null) {
        this.studentName = this.$route.query.studentName;
      }
    }
  },
  updated() {
    document.getElementById("div").scrollTop = document.getElementById(
      "div"
    ).scrollHeight;
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  .date {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(153, 153, 153, 1);
    margin: 34px 0;
    text-align: center;
  }
  .teacher {
    display: flex;
    flex-direction: row;
    .picture {
      width: 60px;
      height: 60px;
      margin: 0 23px 0 30px;
      img{
        display:inline-block;
        width: 60px;
        height: 60px;
      }
    }
    .main {
      font-size: 30px;
      font-family: PingFang SC;
      // font-weight: 500;
      color: rgba(46, 46, 46, 1);
      background: #fff;
      padding: 20px 51px 19px 42px;
      margin: 0;
      position: relative;
      margin-left: 20px;
      border-radius: 10px;
      max-width: 400px;
      word-wrap: break-word;
      word-break: break-all;
      &::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border-width: 15px;
        border-style: solid;
        border-color: transparent #fff transparent transparent;
        position: absolute;
        left: -30px;
        top: 20px;
      }
    }
  }
  .patriarch {
    display: flex;
    flex-direction: row-reverse;
    .picture {
      width: 60px;
      height: 60px;
      margin: 0 23px 0 30px;
      img{
        display:inline-block;
        width: 60px;
        height: 60px;
      }
    }
    .main {
      font-size: 30px;
      font-family: PingFang SC;
      // font-weight: 500;
      color: rgba(46, 46, 46, 1);
      background: #a2de5a;
      padding: 20px 51px 19px 42px;
      margin: 0;
      position: relative;
      margin-left: 20px;
      border-radius: 10px;
      max-width: 400px;
      word-wrap: break-word;
      word-break: break-all;
      &::after {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border-width: 15px;
        border-style: solid;
        border-color: transparent transparent transparent #a2de5a;
        position: absolute;
        right: -30px;
        top: 20px;
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 10vh;
    background: #e9e9e9;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .inp {
      .van-cell {
        padding: 0;
        border-radius: 10px;
      }
    }
  }
}
.inp /deep/ .van-field__body {
  width: 500px;
  height: 70px;
  padding-left: 20px;
}
.inp /deep/ .van-cell-group {
  border-radius: 10px;
}
</style>