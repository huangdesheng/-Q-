<template>
  <div class="page">
    <div class="page-bd">
      <van-popup v-model="popupStudent" position="bottom">
        <van-picker
          title="选择要关联的学生"
          :columns="studentList"
          show-toolbar
          value-key="name"
          @cancel="popupStudent = false"
          @confirm="handleStudentConfirm"
        ></van-picker>
      </van-popup>
      <!-- popup -->
      <van-popup v-model="popupShow" position="bottom">
        <van-datetime-picker
          @cancel="popupShow = false"
          @confirm="handleConfirm"
          v-model="startDate"
          type="date"
          :min-date="minDate"
          :formatter="formatter"
        ></van-datetime-picker>
      </van-popup>
      <!-- popup -->
      <div class="cells mb-20">
        <div class="cell min-h100">
          <div class="cell-hd">
            <label for>学校名称</label>
          </div>
          <div class="cell-bd">
            <input class="input" placeholder="请输入学校名称" v-model="schoolName" disabled />
          </div>
        </div>
        <div class="cell min-h100">
          <div class="cell-hd">
            <label for>班级</label>
          </div>
          <div class="cell-bd">
            <input class="input" placeholder="请输入班级" v-model="className" disabled />
          </div>
        </div>
      </div>
      <div class="cells">
        <div class="cell min-h100">
          <div class="cell-hd">
            <label class="label">家长手机号码</label>
          </div>
          <div class="cell-bd">
            <input
              class="input"
              type="number"
              pattern="[0-9]*"
              placeholder="请输入手机号"
              v-model="form.tel"
              @input="changeTel(form.tel)"
            />
          </div>
        </div>
        <div class="cell min-h100">
          <div class="cell-hd">
            <label class="label">学生姓名</label>
          </div>
          <div class="cell-bd">
            <div class="cell-bd">
              <input class="input" placeholder="请输入学生姓名" maxlength="5" v-model="form.studentName" />
            </div>
          </div>
        </div>
        <div class="cell cell-select cell-select-after min-h100">
          <div class="cell-hd">
            <label for class="label">性别</label>
          </div>
          <div class="cell-bd">
            <select class="select" name dir="rtl" v-model="form.sex">
              <option
                :value="option.id"
                v-for="(option,index) in sexList"
                :key="index"
              >{{ option.name }}</option>
            </select>
          </div>
        </div>
        <div class="cell min-h100">
          <div class="cell-hd">出生日期</div>
          <div class="cell-bd">
            <input
              class="input"
              placeholder="请选择出生日期"
              @click="popupShow = true"
              v-model="form.birthday"
              readonly
              maxlength="20"
            />
          </div>
        </div>
        <div class="cell min-h100">
          <div class="cell-hd">
            <label class="label">地址</label>
          </div>
          <div class="cell-bd">
            <input class="input" placeholder="请输入地址" maxlength="100" v-model="form.address" />
          </div>
        </div>
        <div class="cell cell-select cell-select-after min-h100">
          <div class="cell-hd">
            <label for class="label">关系</label>
          </div>
          <div class="cell-bd">
            <select class="select" name dir="rtl" v-model="form.relation">
              <!-- 兼容性问题修改 -->
              <optgroup disabled hidden></optgroup>
              <option
                :value="option.id"
                v-for="(option,index) in relationList"
                :key="index"
              >{{ option.name }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="handleSubmit">添加</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import dayjs from "dayjs";
import { isPhone } from "@/utils/validator";
import { sex, relation } from "@/mixins/type";
import formatter from "@/mixins/date-formatter";
export default {
  name: "babyAdd",
  mixins: [sex, relation, formatter],
  data() {
    return {
      popupStudent: false,
      popupShow: false,
      minDate: new Date(1966, 10, 1),
      startDate: new Date(),
      schoolName: this.$route.query.schoolName,
      className: this.$route.query.className,
      form: {
        studentName: "",
        classId: this.$route.query.classId,
        className: this.$route.query.className,
        birthday: "",
        address: "",
        tel: "",
        openId: this.$route.query.openId,
        sex: 1,
        relation: 1
      },
      forms: {
        openId: this.$route.query.openId,
        classId: this.$route.query.classId,
        studentId: null
      },
      studentList: []
    };
  },
  methods: {
    changeTel(tel) {
      if (isPhone(tel)) {
        this.queryStudentOpen({ tel });
      } else {
        console.log("手机号格式不对");
      }
    },
    handleStudentConfirm(value) {
      this.forms.studentId = value.studentId;
      this.studentIdJoinClass(this.forms);
    },
    handleConfirm(value) {
      let now = dayjs(new Date(value).getTime()).format("YYYY-MM-DD");
      this.form.birthday = now;
      this.popupShow = false;
    },
    handleSubmit() {
      let { studentName, tel } = this.form;
      if (studentName == "") {
        this.$toast("请输入姓名");
        return;
      }
      if (isPhone(tel)) {
        this.studentJoinClass(this.form);
      } else {
        this.$toast("请正确填写手机号");
      }
    },
    //查询存在的学生
    async queryStudentOpen(params = {}) {
      let res = await service.queryStudentOpen(params);
      if (res.errorCode === 0 && res.data.length) {
        this.popupStudent = true;
        this.studentList = res.data;
      }
    },
    //小Q表现学生加入班级 (如果小Q表现已经有关联了孩子)
    async studentIdJoinClass(params = {}) {
      let res = await service.studentIdJoinClass(params);
      if (res.errorCode === 0) {
        let _cookie = Cookies.getJSON("info");
        let obj = Object.assign({}, _cookie, res.data);
        this.$store.dispatch("user/setInfo", obj).then(data => {
          if (data.success === "ok") {
            this.$router.replace({ path: "/home" });
          }
        });
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    },
    //学生加入班级
    async studentJoinClass(params = {}) {
      let res = await service.studentJoinClass(params);
      if (res.errorCode === 0) {
        let _cookie = Cookies.getJSON("info");
        let obj = Object.assign({}, _cookie, res.data);
        this.$store.dispatch("user/setInfo", obj).then(data => {
          if (data.success === "ok") {
            this.$router.replace({ path: "/home" });
          }
        });
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
