<template>
  <div class="page">
    <div class="page-bd">
      <p class="tip">您的亲人邀请您一起关注孩子成长</p>
      <div class="container" v-if="list.length">
        <p>孩子列表</p>
        <div class="cells">
          <div class="cell min-h100" v-for="(item, index) in list" :key="index">
            <div class="cell-hd">
              <label class="label">{{ item.name }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="cells">
        <div class="cell min-h120">
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
            />
          </div>
        </div>
        <div class="cell cell-select cell-select-after min-h120">
          <div class="cell-hd">
            <label for class="label">您与孩子的关系</label>
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
        <van-button type="info" size="large" class="no-radius" @click="handleSubmit">提交</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import { isPhone } from "@/utils/validator";
import { relation } from "@/mixins/type";
export default {
  name: "focusJoin",
  mixins: [relation],
  data() {
    return {
      form: {
        id: this.$route.query.id,
        openId: this.$store.state.user.info.openId,
        tel: "",
        relation: 1
      },
      list: []
    };
  },
  methods: {
    handleSubmit() {
      let { tel } = this.form;
      if (isPhone(tel)) {
        this.joinStudent(this.form);
      } else {
        this.$toast("请正确填写手机号");
      }
    },
    //查询学生列表--开放版
    async queryStudentByParId(params = {}) {
      let res = await service.queryStudentByParId(params);
      if (res.errorCode === 0) {
        this.list = res.data;
      }
    },
    //家长关注孩子
    async joinStudent(params = {}) {
      let res = await service.joinStudent(params);
      if (res.errorCode === 0) {
        let _cookie = Cookies.getJSON("info");
        let obj = Object.assign({}, _cookie, res.data);
        this.$dialog
          .confirm({
            title: "提示",
            message: "关注成功，是否进入小Q智慧？"
          })
          .then(() => {
            this.$store.dispatch("user/setInfo", obj).then(data => {
              if (data.success === "ok") {
                this.$router.replace({
                  path: "/single"
                });
              }
            });
          })
          .catch(() => {
            this.form.tel = "";
          });
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  mounted() {
    this.queryStudentByParId({ id: this.form.id });
  }
};
</script>
<style lang="less" scoped>
.container {
  margin: 0 30px;
  border-radius: 20px;
  background-color: #fff;
  padding-top: 30px;
  margin-bottom: 30px;
  box-shadow: 0px 3px 8px 0px rgba(204, 204, 204, 0.35);
  .cells {
    border-radius: 0 0 20px 20px;
  }
  > p {
    padding-left: 20px;
    margin-bottom: 30px;
    margin-left: 30px;
    border-left: 4px solid #84ce09;
  }
}
.tip {
  font-size: 36px;
  text-align: center;
  color: #84ce09;
  padding: 30px 0;
}
</style>
