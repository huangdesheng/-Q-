<template>
  <div class="page">
    <div class="page-bd">
      <p size-18 class="mt-20 mb-20 pl-20">问题描述</p>
      <div class="cells mb-20">
        <div class="cell">
          <div class="cell-bd">
            <textarea class="textarea" placeholder="请填写您的意见和建议..." rows="10" v-model="form.title"></textarea>
          </div>
        </div>
      </div>
      <!-- 选择老师 -->
      <div class="cells" v-if="roleType == 3">
        <div class="cell cell-input cell-input-after">
          <div class="cell-hd">
            <label for class="label">选择老师</label>
          </div>
          <div class="cell-bd">
            <select class="select" name="select" dir="rtl" v-model="teacherId">
              <!-- 兼容性问题修改 -->
              <optgroup disabled hidden></optgroup>
              <option
                :value="option.teacherId"
                v-for="(option,index) in teacherList"
                :key="index"
              >{{ option.teacherName }}</option>
            </select>
          </div>
        </div>
      </div>
      <!-- 选择学生 -->
      <div class="cells" v-if="roleType == 2">
        <div class="cell cell-input cell-input-after">
          <div class="cell-hd">
            <label for class="label">选择班级</label>
          </div>
          <div class="cell-bd">
            <select class="select" name="select" dir="rtl" v-model="classId" @change="onChange">
              <!-- 兼容性问题修改 -->
              <optgroup disabled hidden></optgroup>
              <option
                :value="option.classId"
                v-for="(option,index) in classList"
                :key="index"
              >{{ option.className }}</option>
            </select>
          </div>
        </div>
        <div class="cell cell-input cell-input-after">
          <div class="cell-hd">
            <label for class="label">选择学生</label>
          </div>
          <div class="cell-bd">
            <select class="select" name="select" dir="rtl" v-model="studentId">
              <!-- 兼容性问题修改 -->
              <optgroup disabled hidden></optgroup>
              <option
                :value="option.studentId"
                v-for="(option,index) in studentList"
                :key="index"
              >{{ option.studentName }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="handleSubmit(roleType)">发送</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import classList from "@/mixins/classList";
import { mapState } from "vuex";
export default {
  name: "feedAdd",
  mixins: [classList],
  data() {
    return {
      query: {
        studentId: this.$store.state.user.info.studentId
      },
      form: {
        title: "",
        openId: this.$store.state.user.info.openId
      },
      studentId: null,
      teacherId: null,
      classId: this.$store.state.user.info.classId,
      teacherList: [], //老师列表
      studentList: [] //学生列表
    };
  },
  computed: {
    ...mapState("user", {
      roleType: state => state.info.roleType
    })
  },
  methods: {
    //选择班级时触发
    onChange() {
      this.studentId = null;
      this.queryStudentName({ classId: this.classId });
    },
    handleSubmit() {
      let type = this.roleType == 2 ? 2 : 1;
      let studentId =
        this.roleType == 2
          ? this.studentId
          : this.$store.state.user.info.studentId;
      let teacherId =
        this.roleType == 2 ? this.$store.state.user.info.id : this.teacherId;
      if (this.form.title == "") {
        this.$toast("请输入内容");
        return;
      }
      if (this.roleType == 2) {
        if (!studentId) {
          this.$toast("请选择学生");
          return;
        }
      }
      if (this.roleType == 3) {
        if (!teacherId) {
          this.$toast("请选择老师");
          return;
        }
      }
      let obj = Object.assign({}, this.form, { studentId, teacherId, type });
      console.log(obj);
      this.addFeed(obj);
    },
    //查询孩子所在班级的老师
    async queryTeacherWithStudentId(params = {}) {
      let res = await service.queryTeacherWithStudentId(params);
      if (res.errorCode === 0) {
        this.teacherList = res.data;
      }
    },
    //查询班级学生
    async queryStudentName(params = {}) {
      let res = await service.queryStudentName(params);
      if (res.errorCode === 0) {
        this.studentList = res.data;
      }
    },
    //新增师生互动
    async addFeed(params = {}) {
      let res = await service.addFeed(params);
      if (res.errorCode === 0) {
        this.$router.go(-1);
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  mounted() {
    if (this.roleType == 2) {
      this.queryStudentName({ classId: this.classId });
    } else {
      this.queryTeacherWithStudentId(this.query);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
