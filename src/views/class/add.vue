<template>
  <div class="page">
    <div class="page-bd">
      <div class="cells">
        <div class="cell">
          <div class="cell-hd">
            <label class="label">班级名称</label>
          </div>
          <div class="cell-bd">
            <input class="input" placeholder="请输入班级名称" maxlength="10" v-model.trim="form.className" />
          </div>
        </div>
        <div class="cell cell-select cell-select-after">
          <div class="cell-hd">
            <label for class="label">年级</label>
          </div>
          <div class="cell-bd">
            <select class="select" name dir="rtl" v-model="form.gradeId">
              <option
                :value="option.gradeId"
                v-for="(option,index) in grdeList"
                :key="index"
              >{{ option.gradeName }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button size="large" type="info" class="no-radius" @click="handleSubmit">保存</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "classAdd",
  data() {
    return {
      form: {
        className: "",
        gradeId: 1,
        schoolId: this.$store.state.user.info.id,
        openId: this.$store.state.user.info.openId
      },
      grdeList: []
    };
  },
  methods: {
    handleSubmit() {
      if (this.form.className == "") {
        this.$toast("请输入班级名称");
        return false;
      }
      this.classAdd(this.form);
    },
    //班级创建
    async classAdd(params = {}) {
      let res = await service.classAdd(params);
      if (res.errorCode === 0) {
        this.$router.go(-1);
        //更新store
        let obj = {
          id: this.$store.state.user.info.id,
          roleType: 1,
          studentId: this.$store.state.user.info.studentId
        };
        this.$store.dispatch("queryClass/queryClassId", obj);
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    },
    //查询年级
    async queryGrade(params = {}) {
      let res = await service.queryGrade(params);
      if (res.errorCode === 0) {
        this.grdeList = res.data;
      }else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  mounted() {
    this.queryGrade();
  }
};
</script>
<style lang="less" scoped>
</style>
