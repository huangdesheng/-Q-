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
              <img :src="form.photo" width="50" height="50" radius="50" v-if="form.photo" />
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
            <label class="label">学生姓名</label>
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
        <div class="cell min-h120" v-if="form.schoolName">
          <div class="cell-hd">
            <label class="label">就读学校</label>
          </div>
          <div class="cell-bd">
            <input class="input" v-model="form.schoolName" disabled />
          </div>
        </div>
        <div class="cell min-h120" v-if="form.className">
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
            <input class="input" placeholder="请输入地址" maxlength="100" v-model.trim="form.address" />
          </div>
        </div>
        <div class="cell min-h120">
          <div class="cell-hd">
            <label for class="label">家长手机号码</label>
          </div>
          <div class="cell-bd">
            <input class="input" placeholder="请输入手机号" v-model.trim="form.tel" disabled />
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
        <div class="flex">
          <van-button
            size="large"
            type="danger"
            class="no-radius"
            @click="handleDel"
            v-if="isShowDelBtn"
          >删除</van-button>
          <van-button size="large" type="info" class="no-radius" @click="handleSubmit">保存</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import dayjs from "dayjs";
import { sex, relation } from "@/mixins/type";
import formatter from "@/mixins/date-formatter";
import { isPhone } from "@/utils/validator";
import { mapState } from "vuex";
export default {
  name: "childEdit",
  mixins: [sex, relation, formatter],
  data() {
    return {
      popupShow: false,
      minDate: new Date(1966, 10, 1),
      filesObj: null,
      form: {},
      isShowDelBtn: false,
      query: {
        openId: this.$store.state.user.info.openId,
        studentId: this.$route.query.studentId
      },
      name: this.$route.query.name,
      len: this.$route.query.len,
      roleType: this.$route.query.roleType
    };
  },
  computed: {
    ...mapState("user", {
      studentId: state => state.info.studentId
    }),
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
    handleDel() {
      let params = {
        studentId: this.query.studentId,
        roleType: this.roleType
      };
      let tip =
        this.studentId == params.studentId
          ? `你当前正在关注${this.name}, 确定要删除吗？`
          : "确定要删除吗？";
      this.$dialog
        .confirm({
          title: "提示",
          message: tip
        })
        .then(() => {
          this.deleteOpenStudent(params);
        });
    },
    handleRead(file, detail) {
      this.form.photo = file.content;
      this.filesObj = file.file;
    },
    async handleSubmit() {
      let { studentName, address } = this.form;
      if (studentName == "") {
        this.$toast("请输入姓名");
        return;
      }
      if (this.filesObj) {
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
          //提交保存
          let result = await service.studentInfoUpdate(this.form);
          if (result.errorCode === 0) {
            if (this.studentId == this.query.studentId) {
              //编辑的是当前关联的学生
              let _cookie = Cookies.getJSON("info");
              let user = {
                name: this.form.studentName,
                photo: this.form.photo
              };
              let obj = Object.assign({}, _cookie, user);
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
        this.studentInfoUpdate(this.form);
      }
    },
    //学生删除（开放版）
    async deleteOpenStudent(params = {}) {
      let res = await service.deleteOpenStudent(params);
      if (res.errorCode === 0) {
        let _cookie = Cookies.getJSON("info");
        //如果删除的是当前正在关注的
        if (this.studentId == this.query.studentId) {
          let result = await service.queryOpenStudentList({
            openId: this.query.openId
          });
          if (result.errorCode === 0) {
            if (result.data.length) {
              //关注另外的孩子
              let { sex, ...args } = result.data[0];
              let obj = Object.assign({}, _cookie, args);
              this.$store.dispatch("user/setInfo", obj).then(data => {
                if (data.success === "ok") {
                  console.log("关注另外的孩子");
                  this.$router.go(-1);
                }
              });
            } else {
              //如果删除后没有孩子了，则初始化数据
              let init = {
                photo: "",
                name: "",
                studentId: 0,
                totalStarCount: 0
              };
              let obj = Object.assign({}, _cookie, init);
              this.$store.dispatch("user/setInfo", obj).then(data => {
                if (data.success === "ok") {
                  console.log("删除后没有孩子了");
                  this.$router.go(-1);
                }
              });
            }
          }
        } else {
          this.$router.go(-1);
        }
      }
    },
    //学生信息查询
    async studentQueryMe(params = {}) {
      let res = await service.studentQueryMe(params);
      if (res.errorCode === 0) {
        this.form = res.data;
        if (this.form.className || this.form.schoolName) {
          this.isShowDelBtn = false;
        } else {
          this.isShowDelBtn = true;
        }
      }
    },
    //学生修改
    async studentInfoUpdate(params = {}) {
      let res = await service.studentInfoUpdate(params);
      if (res.errorCode === 0) {
        if (this.studentId == this.query.studentId) {
          //编辑的是当前关联的学生
          let _cookie = Cookies.getJSON("info");
          let user = {
            name: this.form.studentName,
            photo: this.form.photo
          };
          let obj = Object.assign({}, _cookie, user);
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
    },
    //查询学生列表--开放版
    async queryOpenStudentList() {
      let res = await service.queryOpenStudentList(params);
    }
  },
  mounted() {
    this.studentQueryMe(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>
