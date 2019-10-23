<template>
  <div class="page">
    <div class="page-bd">
      <div class="cells-title">基础信息</div>
      <!-- 园长 -->
      <template v-if="roleType == 1">
        <div class="cells">
          <div class="cell min-h120">
            <div class="cell-hd">
              <label for class="label">姓名</label>
            </div>
            <div class="cell-bd">
              <input
                class="input"
                placeholder="请输入姓名"
                maxlength="20"
                v-model="leaderInfo.leaderName"
              />
            </div>
          </div>
          <div class="cell min-h120">
            <div class="cell-hd">
              <label for class="label">手机号</label>
            </div>
            <div class="cell-bd">
              <input class="input" placeholder="请输入手机号" v-model="leaderInfo.tel" disabled />
            </div>
          </div>
          <div class="cell min-h120">
            <div class="cell-hd">
              <label for class="label">学校名称</label>
            </div>
            <div class="cell-bd">
              <input class="input" placeholder="请输入学校名称" v-model="leaderInfo.schoolName" disabled />
            </div>
          </div>
          <div class="cell min-h120">
            <div class="cell-hd">
              <label for class="label">详细地址</label>
            </div>
            <div class="cell-bd">
              <input class="input" placeholder="请输入详细地址" v-model="leaderInfo.location" />
            </div>
          </div>
        </div>
      </template>
      <!-- 老师 or 管理员 -->
      <template v-if="roleType == 2 || roleType == 4">
        <div class="cells">
          <div class="cell min-h120">
            <div class="cell-hd">
              <label for class="label">姓名</label>
            </div>
            <div class="cell-bd">
              <input
                class="input"
                placeholder="请输入老师姓名"
                maxlength="20"
                v-model="teacherInfo.teacherName"
              />
            </div>
          </div>
          <div class="cell cell-select cell-select-after min-h120">
            <div class="cell-hd">
              <label for class="label">性别</label>
            </div>
            <div class="cell-bd">
              <select class="select" name dir="rtl" v-model="teacherInfo.sex">
                <option
                  :value="option.id"
                  v-for="(option,index) in sexList"
                  :key="index"
                >{{ option.name }}</option>
              </select>
            </div>
          </div>
          <div class="cell min-h120">
            <div class="cell-hd">
              <label for class="label">手机号</label>
            </div>
            <div class="cell-bd">
              <input class="input" placeholder="请输入手机号" v-model="teacherInfo.tel" disabled />
            </div>
          </div>
          <div class="cell min-h120">
            <div class="cell-hd">
              <label for class="label">学校名称</label>
            </div>
            <div class="cell-bd">
              <input class="input" placeholder="请输入学校名称" v-model="teacherInfo.schoolName" disabled />
            </div>
          </div>
          <div class="cell min-h120">
            <div class="cell-hd">
              <label for class="label">学校地址</label>
            </div>
            <div class="cell-bd">
              <input class="input" placeholder="请输入学校地址" v-model="teacherInfo.location" disabled />
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="handleSubmit">保存</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import { sex, relation, schoolType } from "@/mixins/type";
import { mapState } from "vuex";
export default {
  name: "role",
  mixins: [sex, relation, schoolType],
  data() {
    return {
      leaderInfo: {},
      teacherInfo: {}
    };
  },
  computed: {
    ...mapState("user", {
      openId: state => state.info.openId,
      roleType: state => state.info.roleType,
      studentId: state => state.info.studentId
    })
  },
  methods: {
    handleSubmit() {
      if (this.roleType == 1) {
        this.updateSchool();
      } else if (this.roleType == 2 || this.roleType == 4) {
        this.teacherInfoUpdate();
      }
    },
    //老师信息修改
    async teacherInfoUpdate() {
      let { teacherName, sex } = this.teacherInfo;
      if (teacherName == "") {
        this.$toast("请完善老师名称");
      } else {
        let obj = Object.assign({}, { teacherName, sex, openId: this.openId });
        let res = await service.teacherInfoUpdate(obj);
        if (res.errorCode === 0) {
          let { name } = res.data;
          let _cookie = Cookies.getJSON("info");
          let objs = Object.assign({}, _cookie, { name });
          this.$store.dispatch("user/setInfo", objs).then(data => {
            this.$router.go(-1);
          });
        }
      }
    },
    //园长信息修改
    async updateSchool(params = {}) {
      let { schoolName, location, leaderName } = this.leaderInfo;
      if (leaderName == "") {
        this.$toast("请完善姓名");
        return;
      }
      if (schoolName == "") {
        this.$toast("请完善学校名称");
        return;
      }
      if (location == "") {
        this.$toast("请完善地址");
        return;
      }
      let res = await service.updateSchool(this.leaderInfo);
      if (res.errorCode === 0) {
        let { name } = res.data;
        let _cookie = Cookies.getJSON("info");
        let obj = Object.assign({}, _cookie, { name });
        this.$store.dispatch("user/setInfo", obj).then(data => {
          if (data.success === "ok") {
            this.$router.go(-1);
          }
        });
      }
    },
    //查询老师信息
    async queryTeacherInfo(openId) {
      let res = await service.queryTeacherInfo({ openId });
      if (res.errorCode === 0) {
        this.teacherInfo = res.data;
      }
    },
    //查询管理信息
    async queryInfo(openId) {
      let res = await service.queryInfo({ openId });
      if (res.errorCode === 0) {
        this.leaderInfo = res.data;
      }
    }
  },
  mounted() {
    if (this.roleType == 1) {
      this.queryInfo(this.openId);
    } else {
      this.queryTeacherInfo(this.openId);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
