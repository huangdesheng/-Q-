<template>
  <div class="wrapper">
    <div class="title">
      <i></i>
      <span>老师列表</span>
    </div>
    <div class="list">
      <div
        class="lis"
        v-for="(item, index) in list"
        :key="index"
        @click="acquireID(item)"
      >
        <div class="picture">
          <img :src="item.photo" alt />
          <span v-if="item.studentUnRead" v-text="item.studentUnRead"></span>
          <div v-else></div>
        </div>
        <div class="mainBox">
          <div class="main">
            <div class="character">
              <p class="p1" v-text="item.teacherName"></p>
              <p class="p2" v-text="item.textContent"></p>
            </div>
            <div class="date" v-text="item.postTime"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/api";

export default {
  components: {},
  props: {},
  data() {
    return {
      list: null,
      query: {
        patriarchId: this.$store.state.user.info.id,
        classId: this.$store.state.user.info.classId,
        studentId: this.$store.state.user.info.studentId
      },
      teacherId: 0,
      detailsList: null
    };
  },
  watch: {},
  computed: {},
  methods: {
    acquireID(item) {
      this.$router.push({
        path: "/feed/chat/",
        query: {
          teacherId: item.teacherId,
          teacherName: item.teacherName
        }
      });
    },
    //老师列表
    async queryTeacherFeedList() {
      // let type = this.active == 0 ? 1 : 2;
      let obj = Object.assign({}, this.query);
      let res = await service.queryTeacherFeedList(obj);
      if (res.errorCode === 0) {
        // this.popupShow = false;
        // this.query.page = res.data.page;
        // this.teacherId = res.data.teacherId;
        this.list = res.data || [];
      }
    }
  },
  created() {},
  mounted() {
    this.queryTeacherFeedList();
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  // background: red;
  height: 100%;
  .title {
    height: 28px;
    margin: 30px;
    line-height: 28px;
    i {
      background: #93db21;
      width: 4px;
      height: 30px;
      display: inline-block;
    }
    span {
      font-size: 30px;
      display: inline-block;
      color: #93db21;
      font-weight: 500;
    }
  }
  .list {
    background: #fff;
    .lis {
      height: 150px;
      // display: -webkit-flex;
      display: flex;
      flex-direction: row;
      align-items: center;
      .picture {
        width: 110px;
        height: 100px;
        position: relative;
        margin-left: 40px;
        // margin-left: 40px;
        // margin-top: 47px;
        img {
          border-radius: 50%;
          display: inline-block;
          width: 110px;
          height: 100px;
        }
        span {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: #f02310;
          color: #fff;
          border-radius: 50%;
          text-align: center;
          font-size: 24px;
          line-height: 24px;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .mainBox {
        height: 100%;
        padding-top: 18px;
        border-bottom: 1px solid rgb(236, 236, 236);
        margin-left: 31px;
      }
      .main {
        display: flex;
        flex-direction: row;
        // border-bottom: 1px solid rgb(231, 231, 231);
        // margin-left: 31px;
        width: 100%;
        .character {
          .p1 {
            margin: 0 0 20px 0;
            font-size: 30px;
            font-family: PingFang SC;
            // font-weight: 500;
            color: rgba(46, 46, 46, 1);
          }
          .p2 {
            font-size: 22px;
            font-family: PingFang SC;
            // font-weight: 500;
            color: rgba(153, 153, 153, 1);
            white-space: nowrap;
            width: 200px;
            overflow: hidden;
            text-overflow: ellipsis; //超出500px出现省略号
          }
        }
        .date {
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(153, 153, 153, 1);
          margin: 0 0 0 260px;
        }
      }
    }
  }
}
</style>