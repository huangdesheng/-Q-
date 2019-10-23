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
            <label class="label">
              <img :src="imageUrl" width="50" height="50" radius="50" v-if="imageUrl" />
              <img src="@/assets/child-default@2x.png" width="50" height="50" radius="50" v-else />
            </label>
          </div>
          <div class="cell-bd text-right">
            <van-uploader :after-read="handleRead" accept="image/*">
              <span>点击更换</span>
            </van-uploader>
          </div>
        </div>
        <div class="cell min-h120">
          <div class="cell-hd">
            <label class="label">姓名</label>
          </div>
          <div class="cell-bd">
            <input class="input" placeholder="请输入姓名" maxlength="5" v-model.trim="form.studentName" />
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
            <input class="input" placeholder="请输入地址" maxlength="100" v-model.trim="form.address" />
          </div>
        </div>
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
              v-model.trim="form.tel"
            />
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
        <van-button type="info" size="large" class="no-radius" @click="handleSubmit">添加</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import dayjs from "dayjs";
import service from "@/api";
import { sex, relation } from "@/mixins/type";
import formatter from "@/mixins/date-formatter";
import { isPhone } from "@/utils/validator";
import { mapState } from "vuex";
export default {
  name: "childAdd",
  mixins: [sex, relation, formatter],
  data() {
    return {
      popupShow: false,
      minDate: new Date(1966, 10, 1),
      startDate: new Date(),
      imageUrl: "",
      filesObj: null,
      form: {
        openId: this.$store.state.user.info.openId,
        studentName: "",
        photo: "",
        birthday: "",
        address: "",
        sex: 1,
        tel: "",
        relation: 1
      }
    };
  },
  computed: {
    ...mapState("user", {
      roleType: state => state.info.roleType
    })
  },
  methods: {
    handleConfirm(value) {
      let now = dayjs(new Date(value).getTime()).format("YYYY-MM-DD");
      this.form.birthday = now;
      this.popupShow = false;
    },
    handleRead(file, detail) {
      this.imageUrl = file.content;
      this.filesObj = file.file;
    },
    async handleSubmit() {
      let { studentName, tel } = this.form;
      if (studentName == "") {
        this.$toast("请输入姓名");
        return;
      }
      if (isPhone(tel)) {
        //先上传头像
        if (this.imageUrl) {
          //配置上传头部信息
          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            },
            showLoading: true
          };
          let formData = new FormData();
          formData.append("file", this.filesObj);
          //开始上传文件
          let res = await service.addImage(formData, config);
          if (res.errorCode === 0) {
            this.form.photo = res.data.url;
            //添加孩子
            let result = await service.addStudentWithOpen(this.form);
            if (result.errorCode === 0) {
              let { first, ...args } = result.data;
              if (first) {
                let _cookie = Cookies.getJSON("info");
                let obj = Object.assign({}, _cookie, args);
                this.$store.dispatch("user/setInfo", obj).then(data => {
                  if (data.success === "ok") {
                    this.$router.go(-1);
                  }
                });
              } else {
                this.$router.go(-1);
              }
            } else {
              this.$toast(`${res.errorMsg}`);
            }
          }
        } else {
          this.addStudentWithOpen(this.form);
        }
      } else {
        this.$toast("请正确填写手机号");
      }
    },
    //添加孩子
    async addStudentWithOpen(params = {}) {
      let res = await service.addStudentWithOpen(params);
      if (res.errorCode === 0) {
        let { first, ...args } = res.data;
        //如果是第一个添加的孩子，则自动关联上
        if (first) {
          let _cookie = Cookies.getJSON("info");
          let obj = Object.assign({}, _cookie, args);
          this.$store.dispatch("user/setInfo", obj).then(data => {
            if (data.success === "ok") {
              this.$router.go(-1);
            }
          });
        } else {
          this.$router.go(-1);
        }
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>
