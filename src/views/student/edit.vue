<template>
  <div class="page">
    <div class="page-bd">
      <form action ref="form">
        <div class="cells-title">学生信息</div>
        <div class="cells">
          <div class="cell">
            <div class="cell-hd">
              <label class="label">学生姓名</label>
            </div>
            <div class="cell-bd">
              <input class="input" placeholder="请输入学生姓名" maxlength="10" v-model="form.studentName" />
            </div>
          </div>
          <div class="cell cell-select cell-select-after">
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
          <div class="cell cell-select cell-select-after">
            <div class="cell-hd">
              <label for class="label">学生所在班级</label>
            </div>
            <div class="cell-bd">
              <select class="select" name dir="rtl" v-model="form.classId">
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
        </div>

        <!-- <div class="cells" v-for="(link,index) in form.linkMan" :key="index">
          <div class="cell">
            <div class="cell-hd">
              <label class="label">家长手机号</label>
            </div>
            <div class="cell-bd">
              <input
                type="number"
                class="input"
                pattern="[0-9]*"
                placeholder="请输入手机号"
                v-model="link.tel"
              />
            </div>
          </div>
          <div class="cell cell-select cell-select-after">
            <div class="cell-hd">
              <label for class="label">学生和家长关系</label>
            </div>
            <div class="cell-bd">
              <select class="select" name dir="rtl" v-model="link.relation">
                <option
                  :value="option.id"
                  v-for="(option,index) in relationList"
                  :key="index"
                >{{ option.name }}</option>
              </select>
            </div>
          </div>
          <div class="cells-footer" v-if="form.linkMan.length > 1">
            <div class="cell">
              <van-button
                native-type="button"
                type="danger"
                size="small"
                @click="handleDelLinkMan(index)"
              >删除</van-button>
            </div>
          </div>
        </div>-->
        <div class="cells-title">家长信息</div>
        <div class="cells" v-for="(link,index) in form.linkMan" :key="index">
          <div class="cell">
            <div class="cell-hd">
              <label class="label">家长手机号</label>
            </div>
            <div class="cell-bd">
              <input
                type="number"
                class="input"
                pattern="[0-9]*"
                placeholder="请输入手机号"
                v-model="link.tel"
              />
            </div>
          </div>
          <div class="cell cell-select cell-select-after">
            <div class="cell-hd">
              <label for class="label">学生和家长关系</label>
            </div>
            <div class="cell-bd">
              <select class="select" name dir="rtl" v-model="link.relation">
                <option
                  :value="option.id"
                  v-for="(option,index) in relationList"
                  :key="index"
                >{{ option.name }}</option>
              </select>
            </div>
          </div>
          <div class="cells-footer" v-if="form.linkMan.length > 1">
            <div class="cell">
              <van-button
                native-type="button"
                type="danger"
                size="small"
                @click="handleDelLinkMan(index)"
              >删除</van-button>
            </div>
          </div>
        </div>
        <div class="cells-title ico">
          <span></span>
          <van-icon name="plus" />
          <van-button
            type="info"
            size="small"
            native-type="button"
            @click="handleAddLinkMan"
            class="add"
          >点击添加更多家长</van-button>
        </div>
      </form>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <div class="flex">
          <van-button size="large" type="danger" class="no-radius" @click="handleDel">移除</van-button>
          <van-button size="large" type="info" class="no-radius" @click="handleSubmit">保存</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { sex, relation } from "@/mixins/type";
import { isPhone } from "@/utils/validator";
export default {
  name: "studentEdit",
  mixins: [sex, relation],
  data() {
    return {
      query: {
        teacherId: this.$store.state.user.info.id
      },
      querys: {
        openId: this.$store.state.user.info.openId,
        tel: this.$route.query.tel,
        studentId: this.$route.query.studentId
      },
      form: {},
      classList: [],
      studentList: []
    };
  },
  methods: {
    handleAddLinkMan() {
      this.form.linkMan.push({ relation: 1, tel: "", id: 0 });
    },
    handleDelLinkMan(index) {
      return this.form.linkMan.splice(index, 1);
    },
    handleDel() {
      let { studentId } = this.form;
      if (studentId) {
        this.$dialog
          .confirm({
            title: "提示",
            message: "确定要移除学生吗？"
          })
          .then(() => {
            this.studentDelete({
              studentId,
              openId: this.$store.state.user.info.openId,
              classId: this.$route.query.classId,
              tel: this.querys.tel
            });
          })
          .catch(() => {});
      }
    },
    handleSubmit() {
      let { studentName, classId, linkMan } = this.form;
      if (studentName == "" || !studentName.length) {
        this.$toast("请输入学生姓名");
        return false;
      }
      if (!classId) {
        this.$toast("请选择学生所在班级");
        return false;
      }
      for (let i = 0; i < linkMan.length; i++) {
        let tel = linkMan[i].tel;
        if (!isPhone(tel)) {
          this.$toast("请正确填写手机号");
          return;
        }
      }
      this.studentUpdate(this.form);
    },
    //学生信息查询
    // async studentInfoQuery(params = {}) {
    //   let res = await service.studentInfoQuery(params);
    //   if (res.errorCode === 0) {
    //     this.form = res.data[0];
    //   }
    // },

    // 查询编辑学生资料(20191006)
    async queryUpdateStudnetInfo(params = {}) {
      let res = await service.queryUpdateStudnetInfo(params);
      console.log(res);
      if (res.errorCode === 0) {
        this.form = res.data;
      }
    },

    //学生修改
    async studentUpdate(params = {}) {
      let res = await service.studentUpdate(params);
      if (res.errorCode === 0) {
        this.$router.go(-1);
      } else if (res.errorCode === -1) {
        this.$toast(`${res.errorMsg}`);
      } else if (res.errorCode === 2) {
        this.$dialog
          .alert({
            message: `${res.errorMsg}`
          })
          .then(() => {
            this.$refs.form.reset();
            this.$router.go(-1);
          });
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    },
    //学生删除
    async studentDelete(params = {}) {
      let res = await service.studentDelete(params);
      if (res.errorCode === 0) {
        this.$router.go(-1);
      }
    },
    //查询老师能预录入学生的班级
    async queryTeacherClass(params = {}) {
      let res = await service.queryTeacherClass(params);
      if (res.errorCode === 0) {
        this.classList = res.data;
      }
    }
  },
  mounted() {
    this.queryTeacherClass(this.query);
    // this.studentInfoQuery(this.querys);
    // console.log(this.querys);
    this.queryUpdateStudnetInfo({ studentId: this.querys.studentId });
  }
};
</script>
<style lang="less" scoped>
.btn-area {
  justify-content: space-between;
  > a {
    width: 200px;
  }
}
.cells-footer {
  .cell {
    padding-top: 20px;
    padding-bottom: 20px;
    justify-content: flex-end;
  }
  a {
    font-size: 28px;
    border-radius: 0;
  }
}

.ico {
  justify-content: flex-end;
  align-items: center;
  font-size: 28px;
  color: #a2e14e;
}
.add {
  background: transparent;
  font-size: 24px;
  border: none;
  color: #a2e14e;
  padding: 0 !important;
}
</style>

