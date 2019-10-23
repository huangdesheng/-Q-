<template>
  <div class="page">
    <div class="page-bd">
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
      <div class="cells">
        <div class="cell min-h120">
          <div class="cell-hd">
            <label class="label">学生姓名</label>
          </div>
          <div class="cell-bd">
            <input
              class="input"
              placeholder="请输入姓名"
              maxlength="5"
              v-model="form.studentName"
              readonly
            />
          </div>
        </div>
        <div class="cell cell-select cell-select-after min-h120">
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
        <div class="cell min-h120">
          <div class="cell-hd">
            <label class="label">就读学校</label>
          </div>
          <div class="cell-bd">
            <input class="input" v-model="form.schoolName" disabled />
          </div>
        </div>
        <div class="cell min-h120">
          <div class="cell-hd">
            <label class="label">所在班级</label>
          </div>
          <div class="cell-bd">
            <input class="input" v-model="form.className" disabled />
          </div>
        </div>
        <div class="cell min-h120">
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
        <div class="cell min-h120">
          <div class="cell-hd">
            <label class="label">地址</label>
          </div>
          <div class="cell-bd">
            <input class="input" placeholder="请输入地址" maxlength="100" v-model="form.address" />
          </div>
        </div>
        <div class="cell min-h120">
          <div class="cell-hd">
            <label for class="label">家长手机号码</label>
          </div>
          <div class="cell-bd">
            <input class="input" placeholder="请输入手机号" v-model="form.tel" disabled unselectable="on" />
          </div>
        </div>
        <div class="cell cell-select cell-select-after min-h120">
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
        <van-button size="large" type="info" class="no-radius" @click="handleSubmit">保存</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import dayjs from "dayjs";
import { sex, relation } from "@/mixins/type";
import formatter from "@/mixins/date-formatter";
export default {
  name: "babyEdit",
  mixins: [sex, relation, formatter],
  data() {
    return {
      popupShow: false,
      minDate: new Date(1966, 10, 1),
      query: {
        openId: this.$store.state.user.info.openId,
        studentId: this.$route.query.studentId
      },
      form: {}
    };
  },
  computed: {
    startDate() {
      if ("birthday" in this.form) {
        return new Date(dayjs(this.form.birthday));
      }
    }
  },
  methods: {
    handleConfirm(value) {
      let now = dayjs(new Date(value).getTime()).format("YYYY-MM-DD");
      this.form.birthday = now;
      this.popupShow = false;
    },
    handleSubmit() {
      this.studentInfoUpdate(this.form);
    },
    //查询学生信息
    async studentQueryMe(params = {}) {
      let res = await service.studentQueryMe(params);
      if (res.errorCode === 0) {
        this.form = res.data;
      }
    },
    //学生修改
    async studentInfoUpdate(params = {}) {
      let res = await service.studentInfoUpdate(params);
      if (res.errorCode === 0) {
        this.$router.go(-1);
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  mounted() {
    this.studentQueryMe(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>
