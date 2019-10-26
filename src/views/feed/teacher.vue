<template>
  <div class="wrapper">
    <div class="search">
      <van-search
        v-model="value"
        placeholder="请输入学生名字"
        @input="seek()"
      />
    </div>
    <div class="searchMain" v-show="searchShow">
      <div
        v-for="(item, index) in searchList"
        :key="index"
        @click="particulars(item)"
      >
        <img v-if="item.studentPhoto" :src="item.studentPhoto" alt />
        <img v-else src="@/assets/child-default@2x.png" alt />
        <span v-text="item.studentName"></span>
      </div>
      <!-- <div>
        <img src="@/assets/ellipse.png" alt />
        <span>蓝晴晴(妈妈)</span>
      </div>-->
    </div>
    <div class="title">
      <div class="txt">
        <i></i>
        <span>聊天列表</span>
      </div>
      <div class="pullDown" @click="grade">
        <span v-html="className"></span>
        <van-icon name="arrow-down" size="16px"></van-icon>
      </div>
    </div>
    <div v-if="list" class="list">
      <div
        class="lis"
        v-for="(item, index) in list"
        :key="index"
        @click="acquireID(item)"
      >
        <div class="picture">
          <img v-if="item.photo" :src="item.photo" alt />
          <img v-else src="@/assets/child-default@2x.png" alt />
          <span v-if="item.teacherUnRead" v-text="item.teacherUnRead"></span>
          <div v-else></div>
        </div>
        <div class="mainBox">
          <div class="main">
            <div class="character">
              <p class="p1" v-text="item.studentName"></p>
              <p class="p2" v-text="item.textContent"></p>
            </div>
            <div class="date" v-text="item.postTime"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="noData">
      <img src="@/assets/kong.png" alt />
      <p>当前还没有聊天记录</p>
      <p>可搜索学生姓名进行聊天</p>
    </div>
    <van-popup v-model="popupShow" position="bottom">
      <van-picker
        :columns="classList"
        show-toolbar
        value-key="className"
        @cancel="popupShow = false"
        @confirm="handleClassConfirm"
      ></van-picker>
    </van-popup>
  </div>
</template>

<script>
import service from "@/api";
import classList from "@/mixins/classList";

export default {
  mixins: [classList],
  components: {},
  props: {},
  data() {
    return {
      className: this.$store.state.user.info.className,
      columns: [],
      popupShow: false,
      classId: "",
      list: null,
      searchList: [],
      searchShow: false,
      query: {
        patriarchId: this.$store.state.user.info.id,
        classId: this.$store.state.user.info.classId,
        studentId: this.$store.state.user.info.studentId
      },
      teacherId: 0,
      detailsList: null,
      value: ""
    };
  },
  watch: {},
  computed: {},
  methods: {
    handleClassConfirm(value, index) {
      this.className = value.className;
      this.classId = value.classId;
      this.queryFeedList();
      this.popupShow = false;
    },
    //选择搜索框出现的内容
    particulars(item) {
      this.acquireID(item);
    },
    grade() {
      this.popupShow = true;
      this.gradeSelect();
    },
    //年级选择
    async gradeSelect() {
      let query = {
        teacherId: this.$store.state.user.info.id
      };
      let res = await service.gradeSelect(query);
      if (res.errorCode === 0) {
        this.columns = res.data;
      }
    },

    //搜索
    seek() {
      if (this.value === "") {
        this.searchShow = false;
      } else {
        this.studentInquire();
      }
    },
    onConfirm(event) {
      // const { picker, value, index } = event.detail;
      // Toast(`当前值：${value}, 当前索引：${index}`);
    },

    onCancel() {
      // Toast("取消");
      this.popupShow = false;
    },

    // 点击跳转详情
    acquireID(item) {
      this.$router.push({
        path: "/feed/chatTeacher/",
        query: {
          studentId: item.studentId,
          patriarchId: item.patriarchId,
          studentName: item.studentName
        }
      });
    },

    //实时搜索
    async studentInquire() {
      let query = {
        studentName: this.value,
        classId: this.$store.state.user.info.classId
      };
      let res = await service.studentInquire(query);
      if (res.errorCode === 0) {
        this.searchList = res.data;
        // console.log(1123213);
        // console.log(this.searchList);
        this.searchShow = true;
      } else {
        this.searchShow = false;
      }
    },

    //家长列表
    async queryFeedList() {
      let query = {
        page: 1,
        pageSize: 100,
        teacherId: this.$store.state.user.info.id,
        classId: this.classId
          ? this.classId
          : this.$store.state.user.info.classId
      };
      let res = await service.queryFeedList(query);
      if (res.errorCode === 0) {
        this.list = res.data.data;
        // console.log(1123213);
        // console.log(this.list);
      }
    }
  },
  created() {},
  mounted() {
    this.queryFeedList();
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  // background: red;
  height: 100%;
  .search {
    display: flex;
    justify-content: center;
    padding-top: 30px;
    .van-search {
      padding: 0;
      width: 510px;
      height: 60px;
      background: #fff;
      border-radius: 40px;
    }
  }
  .searchMain {
    width: 510px;
    // height: 100%;
    border: 1px solid #ccc;
    position: absolute;
    top: 110px;
    left: 50%;
    transform: translate(-50%);
    z-index: 2;
    background: #fff;
    border-radius: 10px;
    div {
      height: 110px;
      display: flex;
      align-items: center;
      margin: 0 30px;
      border-bottom: 1px solid #ccc;
      &:last-child {
        border: 0;
      }
      img {
        width: 60px;
        height: 60px;
        display: inline-block;
        margin-right: 22px;
      }
      span {
        display: inline-block;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 500;
      }
    }
  }
  .title {
    // height: 28px;
    margin: 30px;
    line-height: 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .txt {
      i {
        background: #93db21;
        width: 4px;
        height: 30px;
        display: inline-block;
        position: relative;
        top: 4px;
      }
      span {
        font-size: 30px;
        display: inline-block;
        color: #93db21;
        font-weight: 500;
      }
    }
    .pullDown {
      height: 70px;
      border-radius: 40px;
      background: #93db21;
      padding: 10px 20px;
      color: #fff;
      .van-icon {
        position: relative;
        top: 5px;
      }
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
        // margin-top: 47px;
        // border-radius: 50%;
        img {
          border-radius: 50%;
          display: inline-block;
          width: 110px;
          height: 100px;
        }
        span {
          display:flex;
          align-items:center;
          justify-content:center;
          width: 30px;
          height: 30px;
          line-height: 30px;
          background: #f02310;
          color: #fff;
          border-radius: 50%;
          text-align: center;
          font-size: 24px;
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
            font-weight: 500;
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
  .noData {
    text-align: center;
    img {
      margin: 100px 0 29px 0;
    }
    p {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(204, 204, 204, 1);
      margin-bottom: 5px;
    }
  }
}
.search /deep/ .van-search__content {
  background: #fff;
  padding-left: 120px;
  border-radius: 40px;
}
</style>