<template>
  <div class="flex-page">
    <div class="flex-bd cover">
      <div class="flex a-i-c j-c-c" style="padding-top: 50px;padding-bottom: 70px;">
        <img class="qxlogo" src="@/assets/xq-logo.png" alt width="42" height="42" />
        <p size-24 class="ml-20">小Q智慧</p>
      </div>
      <form action ref="form" class="login-form">
        <div class="cells">
          <div class="cell min-h120">
            <div class="cell-hd">
              <img class="ignore" src="@/assets/phone-icon@2x.png" alt />
            </div>
            <div class="cell-bd pl-20">
              <input
                type="number"
                class="input text-left"
                pattern="[0-9]*"
                placeholder="请输入手机号"
                v-model="form.tel"
              />
            </div>
            <div class="cell-ft">
              <a
                v-if="!hidden"
                href="javascript:void(0);"
                style="color:#92cd36"
                @click="handleSecond"
              >获取验证码</a>
              <span v-if="hidden" style="color:#8d8d8d;">{{ second }}s</span>
            </div>
          </div>
          <div class="cell min-h120">
            <div class="cell-hd">
              <img class="ignore" src="@/assets/phone-icon@2x.png" alt style="opacity: 0;" />
            </div>
            <div class="cell-bd pl-20">
              <input
                type="number"
                class="input text-left"
                pattern="[0-9]*"
                placeholder="请输入验证码"
                v-model="form.verifyCode"
              />
            </div>
          </div>
          <div class="cell" style>
            <div class="cell-bd text-center">
              <van-button
                style="width:240px;margin-top:40px;"
                round
                type="info"
                native-type="button"
                @click="handleLogin"
              >登录</van-button>
            </div>
          </div>
        </div>
      </form>
      <!-- <div class="text-center" style="margin-top:30px;">
        <span>未加入班级?</span>
        <span style="color:#f02310" @click="handleTourist">点击进入体验班级</span>
      </div>-->
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import { isPhone } from "@/utils/validator";
import { mapState } from "vuex";
export default {
  name: "login",
  data() {
    return {
      hidden: false,
      timer: null,
      second: 60,
      form: {
        openId: this.$store.state.user.info.tel || this.$route.query.openId, //登陆openId
        studentId: this.$store.state.user.info.studentId, //experienceStudentId
        tel: "",
        verifyCode: ""
      }
    };
  },
  computed: {
    ...mapState("user", {
      name: state => state.info.name,
      studentId: state => state.info.studentId,
      tel: state => state.info.tel
    })
  },
  methods: {
    handleSecond() {
      if (isPhone(this.form.tel)) {
        this.telVeriftCode(this.form.tel);
      } else {
        this.$toast("请正确填写手机号");
      }
    },
    handleLogin() {
      if (this.form.tel === "") {
        this.$toast("请填写手机号");
        return false;
      }
      if (this.form.verifyCode === "") {
        this.$toast("请填写手机验证码");
        return false;
      }
      if (isPhone(this.form.tel)) {
        this.userTeleLogin(this.form);
      } else {
        this.$toast("请正确填写手机号");
      }
    },
    //获取验证码
    async telVeriftCode(tel) {
      let res = await service.telVeriftCode({ tel, codeType: 1 });
      if (res.errorCode === 0) {
        this.$toast("验证码已经发送，请注意查收");
        this.hidden = true;
        this.timer = setInterval(() => {
          if (this.second === 1) {
            this.second = 60;
            this.hidden = false;
            window.clearInterval(this.timer);
          }
          this.second--;
        }, 1000);
      } else if (res.errorCode === -1) {
        this.$toast(`${res.errorMsg}`);
      }
    },
    //用户登录
    async userTeleLogin(params = {}) {
      let res = await service.userTeleLogin(params);
      if (res.errorCode === 0) {
        let { roleType, name } = res.data;
        //定时器清除
        this.second = 60;
        this.hidden = false;
        window.clearInterval(this.timer);
        this.$refs.form.reset();

        switch (roleType) {
          case 0:
            this.$toast("此手机号码还没有录入");
            break;
          case 1:
            this.$notify({
              message: `你当前登录用户为: ${name}`,
              duration: 3000
            });
            this.$router.push({ path: "/home" });
            break;
          case 2:
          case 3:
            this.$notify({
              message: `你当前登录用户为: ${name}`,
              duration: 3000
            });
            let _cookie = Cookies.getJSON("info");
            let obj = Object.assign({}, _cookie, res.data);
            this.$store.dispatch("user/setInfo", obj).then(data => {
              if (data.success === "ok") {
                this.$router.push({ path: "/home" });
              }
            });
            break;
          case 4:
            //进入注册页面
            this.$router.push({
              path: "/schoolCreate",
              query: {
                tel: res.data.tel,
                openId: this.$route.query.openId
              }
            });
            break;
          case 5:
            //老师进入绑定幼儿园页面
            this.$router.push({
              path: "/schoolJoin",
              query: {
                tel: res.data.tel,
                openId: this.$route.query.openId
              }
            });
            break;
          case 6:
            //学生进入完善信息页面
            this.$router.push({
              path: "/baby/supply",
              query: {
                tel: res.data.tel,
                openId: this.$route.query.openId
              }
            });
            break;
          default:
            this.$toast(`${res.errorMsg}`);
        }
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.cover {
  background-color: #fff;
}
</style>
