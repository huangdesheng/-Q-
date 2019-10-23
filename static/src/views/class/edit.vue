<template>
  <div class="page">
    <div class="page-bd">
      <div class="class-edit-head">
        <button class="btn btn-primary">{{ className }}</button>
      </div>
      <van-tabs v-model="index" color="#92cd36" :line-height="2" @click="handleTabClick">
        <van-tab title="关联的老师">
          <div class="cells-title">老师列表({{ teacherList.length }})</div>
          <div class="cells">
            <div class="cell min-h120" v-for="(teacher, index) in teacherList" :key="index">
              <div class="cell-hd">
                <img class="teacher-icon" v-if="teacher.photo" :src="teacher.photo" alt />
                <img src="@/assets/child-default@2x.png" width="50" height="50" radius="50" v-else />
              </div>
              <div class="cell-bd pl-20">
                <p>{{ teacher.teacherName }}</p>
              </div>
              <div class="cell-ft">
                <span size-14 style="color:#92cd36" @click="handleMoveTeacher(teacher)">移除</span>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="关联的学生">
          <div class="cells-title">学生列表({{ studentList.length }})</div>
          <div class="cells">
            <div class="cell min-h120" v-for="(student, index) in studentList" :key="index">
              <div class="cell-hd">
                <img class="teacher-icon" v-if="student.photo" :src="student.photo" alt />
                <img src="@/assets/child-default@2x.png" width="50" height="50" radius="50" v-else />
              </div>
              <div class="cell-bd pl-20">
                <p>{{ student.studentName }}</p>
              </div>
              <div class="cell-ft">
                <span size-14 style="color:#ce3c39" @click="handleMoveStudent(student)">移除</span>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "classEdit",
  data() {
    return {
      index: 0,
      query: {
        classId: this.$route.query.classId,
        openId: this.$store.state.user.info.openId
      },
      className: this.$route.query.className,
      teacherList: [],
      studentList: []
    };
  },
  methods: {
    handleTabClick(index) {
      this.index = index;
      return index === 0
        ? this.classQueryTeacher(this.query)
        : this.classQueryStudent(this.query);
    },
    handleMoveStudent(student) {
      let { classId, studentId } = student;
      let obj = Object.assign(
        {},
        { classId, studentId, openId: this.query.openId }
      );
      if (classId && studentId) {
        this.$dialog
          .confirm({
            title: "提示",
            message: "确定要移除学生吗？"
          })
          .then(() => {
            this.classMoveStudent(obj);
          })
          .catch(() => {});
      }
    },
    handleMoveTeacher(teacher) {
      let { classId, teacherId } = teacher;
      let obj = Object.assign(
        {},
        { classId, teacherId, openId: this.query.openId }
      );
      if (classId && teacherId) {
        this.$dialog
          .confirm({
            title: "提示",
            message: "确定要移除老师吗？"
          })
          .then(() => {
            this.classMoveTeacher(obj);
          })
          .catch(() => {});
      }
    },
    //移除班级对应的老师
    async classMoveTeacher(params = {}) {
      let res = await service.classMoveTeacher(params);
      if (res.errorCode === 0) {
        this.classQueryTeacher(this.query);
      }
    },
    //查询班级对应的老师
    async classQueryTeacher(params = {}) {
      let res = await service.classQueryTeacher(params);
      if (res.errorCode === 0) {
        this.teacherList = res.data.teacher;
      }
    },
    //移除班级对应的学生
    async classMoveStudent(params = {}) {
      let res = await service.classMoveStudent(params);
      if (res.errorCode === 0) {
        this.classQueryStudent(this.query);
      }
    },
    //查询班级对应的学生
    async classQueryStudent(params = {}) {
      let res = await service.classQueryStudent(params);
      if (res.errorCode === 0) {
        this.studentList = res.data.student;
      }
    }
  },
  activated() {
    this.classQueryTeacher(this.query);
  }
};
</script>
<style lang="less" scoped>
.class-edit-head {
  padding-top: 40px;
  text-align: center;
  background-color: #fff;
}
.teacher-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
