<template>
  <div class="page">
    <div class="page-bd">
      <div class="cells-title">选择需要打卡的小孩</div>
      <div class="cells">
        <div class="cell min-h120" v-for="item in list" :key="item.studentId">
          <div class="cell-hd">
            <label class="label">{{ item.name }}</label>
          </div>
          <div class="cell-bd text-right">
            <van-radio-group v-model="studentId">
              <van-radio :name="item.studentId" checked-color="#92cd36"></van-radio>
            </van-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;" v-if="list.length">
        <van-button type="info" size="large" class="no-radius" @click="handleAddPunch">打卡接送</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "punch",
  data() {
    return {
      query: {
        openId: this.$route.query.openId || this.$store.state.user.info.openId
      },
      studentId: null, //绑定的学生ID
      list: [] //列表
    };
  },
  methods: {
    handleAddPunch() {
      let { openId } = this.query;
      let studentId = this.studentId;
      let obj = Object.assign({}, { openId, studentId });
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定接送孩子吗？"
        })
        .then(() => {
          this.addPunch(obj);
        });
    },
    //打卡接送
    async addPunch(params = {}) {
      let res = await service.addPunch(params);
      if (res.errorCode === 0) {
        //成功后的操作
        this.$dialog
          .alert({
            title: "提示",
            message: `${res.errorMsg}`
          })
          .then(() => {
            //关闭当前网页窗口接口
            wx.closeWindow();
          });
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    },
    //查询学生列表
    async queryClassStudentList(params = {}) {
      let res = await service.queryClassStudentList(params);
      if (res.errorCode === 0) {
        if (res.data.length) {
          this.list = res.data;
          this.studentId = this.list[0].studentId;
        }
      }
    }
  },
  mounted() {
    this.queryClassStudentList(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>