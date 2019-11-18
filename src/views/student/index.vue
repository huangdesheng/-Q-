<template>
  <div class="page">
    <div class="page-hd">
      <div class="button-sp-area flex" size-17>
        <a href="javascript:;" id="showDatePicker" @click="popupShow = true">
          <span>{{ className }}</span>
          <van-icon name="arrow-down" size="16px"></van-icon>
        </a>
      </div>
    </div>
    <div class="page-bd">
      <van-popup v-model="popupShow" position="bottom">
        <van-picker
          :columns="classList"
          show-toolbar
          value-key="className"
          @cancel="popupShow = false"
          @confirm="handleConfirm"
        ></van-picker>
      </van-popup>
      <v-dialog
        title="提示"
        :visible="visible"
        @on-cancel="handleOnCancel"
        @on-confirm="handleOnConfirm"
      >
        <p>请登录管理后台进行批量操作</p>
      </v-dialog>
      <template v-if="visibility">
        <div class="overlay" @click="visibility = false"></div>
        <div class="share-tip">
          <img src="@/assets/share-tip.png" />
          <p size-18>请点击右上角按钮邀请好友吧</p>
        </div>
      </template>
      <!-- <div class="cells-title">学生家长列表({{ studentCount }})</div>
      <div class="cells">
        <div
          class="cell min-h120"
          v-for="(student, index) in studentList"
          :key="index"
          @click="handleEditStudent(student)"
        >
          <div class="cell-hd">
            <template v-if="student.photo">
              <img :src="student.photo" width="50" height="50" radius="50" />
            </template>
            <template v-else>
              <img src="@/assets/child-default@2x.png" width="50" height="50" radius="50" />
            </template>
          </div>
          <div class="cell-bd pl-20">
            <p>
              {{ student.studentName }}
              <span
                size-14
                v-if="!student.openId"
                @click.stop="visibility = true"
                style="color: rgb(64, 158, 255);margin-left:10px;"
              >微信邀请</span>
            </p>
            <small class="and" style="color:#bdbdbd;">{{ student.tel }}</small>
            <small class="and" style="color:#bdbdbd;">{{ student.className }}</small>
          </div>
          <div class="cell-ft flex">
            <template>
              <span size-14 v-if="student.openId" style="color:#92cd36">已加入</span>
              <span size-14 v-else style="color:#ff87b7">未加入</span>
            </template>
          </div>
        </div>
      </div>-->

      <!-- 修改学生管理列表2019106 -->
      <div v-if="studentStatus">
        <div class="cells-title">已加入学生列表({{ studentCounted }})</div>
        <div class="cells">
          <div
            class="cell min-h120"
            v-for="(student, index) in studentListed"
            :key="index"
          >
            <div class="num" v-if="studentListed.length < 9">
              0{{ index + 1 }}
            </div>
            <div class="num" v-else>{{ index + 1 }}</div>
            <div class="cell-hd">
              <template v-if="student.photo">
                <img :src="student.photo" width="35" height="35" radius="50" />
              </template>
              <template v-else>
                <img
                  src="@/assets/child-default@2x.png"
                  width="35"
                  height="35"
                  radius="50"
                />
              </template>
            </div>
            <div class="cell-bd pl-20">
              <p>{{ student.studentName }}</p>
            </div>
            <div class="cell-ft flex">
              <div class="pf" @click="handlePhone(student)">
                <van-icon name="phone-o" />
                <p>联系家长</p>
              </div>
              <div class="pf" @click="handleWord(student)">
                <van-icon name="comment-o" />
                <p>留言</p>
              </div>
              <div class="pf" @click="handleEditStudent(student)">
                <van-icon name="edit" />
                <p>编辑</p>
              </div>
            </div>
          </div>
        </div>
        <div class="cells-title">未加入学生列表({{ studentCounting }})</div>
        <div class="cells">
          <div
            class="cell min-h120"
            v-for="(student, index) in studentListing"
            :key="index"
          >
            <div v-if="index < 9">0{{ index + 1 }}</div>
            <div v-else>{{ index + 1 }}</div>
            <div class="cell-hd">
              <template v-if="student.photo">
                <img :src="student.photo" width="50" height="50" radius="50" />
              </template>
              <template v-else>
                <img
                  src="@/assets/child-default@2x.png"
                  width="50"
                  height="50"
                  radius="50"
                />
              </template>
            </div>
            <div class="cell-bd pl-20">
              <p>{{ student.studentName }}</p>
            </div>

            <div class="cell-ft flex">
              <div class="pf" @click="handlePhone(student)">
                <van-icon name="phone-o" />
                <p>联系家长</p>
              </div>
              <div class="pf" @click="handleWord(student)">
                <van-icon name="comment-o" />
                <p>留言</p>
              </div>
              <div class="pf" @click="handleEditStudent(student)">
                <van-icon name="edit" />
                <p>编辑</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系家长20191006 -->
    <van-dialog
      v-model="phoneStatus"
      :title="parentInfo.name"
      :show-confirm-button="false"
      :show-cancel-button="false"
    >
      <div class="centerPhone" v-if="status === 1">
        <van-radio-group v-model="parentInfo.radio">
          <van-cell-group>
            <template>
              <van-cell
                v-for="(item, index) in parentInfo.phone"
                :key="index"
                :title="item.studentName + ':' + item.tel"
                clickable
                @click="parentInfo.radio = item.tel"
                class="select"
              >
                <van-radio checked-color="#93DB21" :name="item.tel" />
              </van-cell>
            </template>
          </van-cell-group>
        </van-radio-group>
        <div class="cell-ft flex btnPhone">
          <p @click="phoneStatus = false">取消</p>
          <a :href="'tel:' + parentInfo.radio">确定</a>
        </div>
      </div>
      <div class="centerPhone" v-if="status === 2">
        <van-cell-group>
          <van-field
            v-model="title"
            type="textarea"
            placeholder="请输入您想对家长说的话"
            rows="3"
          />
        </van-cell-group>
        <div class="selectContent">
          <p>选择发送家长</p>
          <div class="checkBox">
            <van-radio-group
              :value="radio"
              @change="onChange"
              v-model="radio"
              v-for="(item, index) in checkBoxList"
              :key="index"
            >
              <van-radio :name="item.patriarchId" checked-color="#93DB21">{{
                item.studentName
              }}</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="cell-ft flex btnPhone">
          <p @click="leaveWordOff">取消</p>
          <a @click="sendWord">发送</a>
        </div>
      </div>
    </van-dialog>

    <!-- 修改结束部分20191006 -->
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button
          type="info"
          size="large"
          class="no-radius"
          @click="handleJumpRoute"
          >录入新学生</van-button
        >
        <!-- <van-button
          type="info"
          size="large"
          class="no-radius"
          @click="handleJumpRoute"
          v-if="openDirection == 0"
        >录入学生</van-button>-->
        <!-- <van-button
          type="info"
          size="large"
          class="no-radius"
          v-else
          @click.stop="visibility = true"
        >点击邀请家长加入</van-button>-->
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import dialog from "@/components/dialog";
import { mapState } from "vuex";
import { API_ROOT } from "@/config/isdev";
import wxapi from "@/config/wxapi";
export default {
  name: "student",
  components: {
    "v-dialog": dialog
  },
  data() {
    return {
      studentId: "",
      patriarchId: "",
      checkBoxList: [
        // { id: 1, name: "复选框1" },
        // { id: 2, name: "复选框2" },
        // { id: 3, name: "复选框3" },
        // { id: 4, name: "复选框4" },
        // { id: 5, name: "复选框5" }
      ],
      radio: "1",
      visible: false,
      visibility: false,
      popupShow: false,
      className: "",
      classId: null,
      openDirection: 0, // 0-小Q班级流程加入 1-分享流程加入
      teacherId: this.$store.state.user.info.id,
      // studentList: [],
      classList: [],
      // 20191006
      studentListed: [],
      studentListing: [],
      studentStatus: false,
      phoneStatus: false,
      status: 1,
      parentInfo: {
        name: "",
        radio: "1",
        phone: []
      },
      studentInfo: {},
      title: ""
    };
  },
  computed: {
    // studentCount() {
    //   return this.studentList.length;
    // },
    // 加入学生人数（20191006）
    studentCounted() {
      return this.studentListed.length;
    },
    // 未加入学生人数（20191006）
    studentCounting() {
      return this.studentListing.length;
    },
    ...mapState("user", {
      experience: state => state.info.experience
    })
  },
  methods: {
    //留言-取消
    leaveWordOff() {
      this.title="";
      this.phoneStatus = false;
    },
    onChange(event) {
      console.log(event);
      this.patriarchId = event;
    },
    handleConfirm(value, index) {
      this.className = value.className;
      this.classId = value.classId;
      this.openDirection = value.openDirection;
      // this.queryStudentByClassId(this.classId);
      this.queryStudentStatusList(this.classId);
      wxapi.wxRegister(this.wxRegCallback);
    },
    wxRegCallback() {
      //用于微信JS-SDK回调
      this.wxShareAppMessage();
    },
    wxShareAppMessage() {
      let that = this;
      let shareUrl = "";
      if (this.openDirection == 0) {
        shareUrl = API_ROOT + "#/share";
      } else {
        shareUrl = API_ROOT + "#/baby/share?classId=" + this.classId + "&id=0";
      }
      let option = {
        title: "亲爱的用户您好", // 分享标题
        desc: "小Q智慧欢迎您的加入", // 分享描述
        link: shareUrl, // 分享链接，根据自身项目决定是否需要split
        success: () => {
          that.$toast("分享成功");
        },
        error: () => {
          that.$toast("已取消分享");
        }
      };
      wxapi.wxShareAppMessage(option);
    },
    handleOnCancel(state) {
      this.visible = state;
    },
    handleOnConfirm() {
      console.log("confirm");
    },
    handleEditStudent(student) {
      this.$router.push({
        path: `/student/edit`,
        query: {
          tel: student.tel,
          studentId: student.studentId,
          classId: student.classId,
          openDirection: this.openDirection
        }
      });
    },
    handleJumpRoute() {
      this.$router.push({
        path: "/student/add",
        query: {
          openDirection: this.openDirection
        }
      });
    },
    //查询班级学生
    // async queryStudentByClassId(classId) {
    //   let res = await service.queryStudentByClassId({ classId });
    //   if (res.errorCode === 0) {
    //     this.studentList = res.data;
    //     this.studentListed = res.data.filter(item => item.openId != null);
    //     // 未加入学生列表
    //     this.studentListing = res.data.filter(item => item.openId === null);
    //     this.popupShow = false;
    //   }
    // },

    // 老师查询班级学生列表(20191006)
    async queryStudentStatusList(classId) {
      let res = await service.queryStudentStatusList({ classId });
      console.log(res);
      if (res.errorCode === 0) {
        this.studentList = res.data;
        this.studentListed = res.data.filter(item => item.status === 1);
        // // 未加入学生列表
        this.studentListing = res.data.filter(item => item.status === 0);
        this.popupShow = false;
        this.studentStatus = true;
      }
    },
    // 查询学生家长电话(20191006)
    async handlePhone(student) {
      this.status = 1;
      let data = {
        studentId: student.studentId,
        openId: this.$store.state.user.info.openId
      };
      let res = await service.queryStudentQP(data);
      if (res.errorCode === 0) {
        this.parentInfo.name = student.studentName;
        this.parentInfo.radio = res.data[0].tel;
        this.parentInfo.phone = res.data;
        this.phoneStatus = true;
      }
    },

    // 新增师生互动(20191006)
    handleWord(student) {
      console.log(student);
      this.phoneStatus = true;
      this.status = 2;
      this.parentInfo.name = student.studentName;
      this.studentInfo = student;
      this.studentId = student.studentId;
      this.queryStduentpar(this.studentId);
    },

    //查询学生家长的关系
    async queryStduentpar(studentId) {
      let res = await service.queryStduentpar({ studentId });
      if (res.errorCode === 0) {
        this.checkBoxList = res.data;
      }
    },
    // 发送留言(20191006)
    async sendWord() {
      let data = {
        studentId: this.studentId,
        teacherId: this.$store.state.user.info.id,
        patriarchId: this.patriarchId,
        textContent: this.title,
        type: 1
      };
      let res = await service.teacherReplyStudent(data);
      if (res.errorCode === 0) {
        this.$toast("留言成功");
        this.phoneStatus = false;
        this.title = "";
      } else {
        that.$toast(res.errorMsg);
        this.title = "";
      }
    },
    //查询老师管理的班级
    async queryClassNameList(teacherId) {
      let res = await service.queryClassNameList({ teacherId });
      if (res.errorCode === 0) {
        if (res.data.length) {
          this.classList = res.data;
          this.className = res.data[0].className;
          this.classId = res.data[0].classId;
          this.openDirection = res.data[0].openDirection;
          // this.queryStudentByClassId(res.data[0].classId);
          this.queryStudentStatusList(res.data[0].classId);
          wxapi.wxRegister(this.wxRegCallback);
        }
      }
    }
  },
  mounted() {
    this.queryClassNameList(this.teacherId);
  }
};
</script>
<style lang="less" scoped>
.pf {
  font-size: 22px;
  text-align: center;
  margin-left: 35px;
  color: #999;
}
.pf {
  i {
    font-size: 35px;
  }
}
.btnPhone {
  text-align: center;
  display: flex;
  padding: 30px 0;
  p {
    flex: 1;
  }
  a {
    flex: 1;
    color: #93db21;
  }
}

.centerPhone {
  width: 95%;
  margin: 40px auto 0;
}
.centerPhone /deep/ .van-cell {
  background: #f8f8f8;
  border-radius: 10px;
}
.checkBox {
  display: flex;
  flex-wrap: wrap;
}
.checkBox /deep/ .van-radio-group {
  margin: 10px;
}
.selectContent {
  p {
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(46, 46, 46, 1);
    margin: 30px 0 50px 30px;
  }
}
.num {
  margin-right: 20px;
}
</style>
