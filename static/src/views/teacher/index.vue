<template>
  <div class="page">
    <div class="page-bd">
      <template v-if="visibility">
        <div class="overlay" @click="visibility = false"></div>
        <div class="share-tip">
          <img src="@/assets/share-tip.png" />
          <p size-18>请点击右上角按钮邀请好友吧</p>
        </div>
      </template>
      <!-- <div class="cells-title">老师列表({{ list.length }})</div> -->
      <div class="cells">
        <div
          class="cell teacher-item"
          v-for="(teacher, index) in list"
          :key="index"
          @click="handleEditTeacher(teacher)"
        >
          <div class="cell-hd">
            <template v-if="teacher.photo">
              <img :src="teacher.photo" width="50" height="50" radius="50" />
            </template>
            <template v-else>
              <img src="@/assets/child-default@2x.png" width="50" height="50" radius="50" />
            </template>
          </div>
          <div class="cell-bd pl-20">
            <p class="mb-10">
              {{ teacher.teacherName }}
              <span
                size-14
                v-if="!teacher.openId"
                @click.stop="visibility = true"
                style="color: rgb(64, 158, 255);"
              >微信邀请</span>
            </p>
            <van-tag
              class="and"
              type="success"
              v-for="(cla, index) in teacher.classes"
              :key="index"
            >{{ cla.className }}</van-tag>
          </div>
          <div class="cell-ft flex">
            <template>
              <span size-14 v-if="teacher.openId" style="color:#92cd36">已加入</span>
              <span size-14 v-else style="color:#ff87b7">未加入</span>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" to="/teacher/add">添加新老师</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "teacher",
  data() {
    return {
      visibility: false,
      schoolId: this.$store.state.user.info.id,
      list: []
    };
  },
  methods: {
    handleEditTeacher(teacher) {
      this.$router.push({
        path: "/teacher/edit",
        query: { teacherId: teacher.teacherId }
      });
    },
    async queryTeacher(schoolId) {
      let res = await service.queryTeacher({ schoolId });
      if (res.errorCode === 0) {
        this.list = res.data;
      }
    }
  },
  mounted() {
    this.queryTeacher(this.schoolId);
  }
};
</script>
<style lang="less" scoped>
.teacher-item {
  min-height: 100px;
  padding-top: 20px;
  padding-bottom: 20px;
  p {
    margin-bottom: 10px;
  }
}
.status {
  color: #ff87b7;
}
.btn-del {
  width: 100px;
  height: 50px;
  line-height: 50px;
  background-color: #ce3c39;
}
.and {
  margin-right: 10px;
}
</style>
