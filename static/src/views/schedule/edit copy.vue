<template>
  <div class="page">
    <div class="page-bd">
      <!-- dialog -->
      <van-dialog
        :title="isDialogState == 1 ? '新增':'编辑'"
        v-model="dialogVisible"
        show-cancel-button
        @cancel="dialogVisible = false"
        :before-close="handleSubmit"
      >
        <div class="cells" style="padding:15px 0 15px 0;">
          <div class="cell min-h120">
            <div class="cell-hd">
              <label class="label">选项名称</label>
            </div>
            <div class="cell-bd">
              <input class="input" placeholder="如早操，升国旗" v-model.trim="form.lessonName" />
            </div>
          </div>
          <div class="cell min-h120">
            <div class="cell-hd">
              <label class="label">时长</label>
            </div>
            <div class="cell-bd">
              <p class="text-right">
                <van-stepper v-model="form.timeLong" :min="10" :max="60"></van-stepper>
              </p>
            </div>
          </div>
        </div>
      </van-dialog>
      <!-- dialog -->
      <!-- 选择课程 -->
      <van-popup class="lesson-popup" v-model="popupRight" position="right">
        <div class="cells">
          <div class="lesson">
            <div class="cells">
              <p class="mb-30">1.每天的课表从学生的第一个整体活动开始，如早操、早读等</p>
              <p class="mb-30">2.每节课程之后请根据实际情况安排学生的课间休息，如课间、课间操、大课间等。</p>
            </div>
            <h4 class="mb-20">课程:</h4>
            <div class="lesson-group">
              <van-button
                class="lesson-btn"
                type="primary"
                size="normal"
                v-for="(item, index) in lessonList.filter(item => item.type == 1)"
                :key="index"
                @click="handleLessonConfirm(item)"
              >{{ item.lessonName }}</van-button>
              <van-button
                class="lesson-btn"
                type="warning"
                size="normal"
                @click="handleLessonConfirm(noClass)"
              >无课</van-button>
            </div>
            <h4 class="mb-20">其他:</h4>
            <div class="lesson-group">
              <van-button
                class="lesson-btn"
                type="warning"
                size="normal"
                v-for="(item, index) in lessonList.filter(item => item.type == 2)"
                :key="index"
                @click="handleLessonConfirm(item)"
              >{{ item.lessonName }}</van-button>
            </div>
          </div>
        </div>
      </van-popup>
      <!-- am pm 晚自习 -->
      <van-popup v-model="popupTime" position="bottom">
        <van-datetime-picker
          v-model="data"
          type="time"
          @cancel="popupTime = false"
          @confirm="handleTimeConfirm"
        ></van-datetime-picker>
      </van-popup>
      <van-tabs v-model="tabActive" :line-height="2">
        <van-tab title="配置选项">
          <!-- 班级选择 -->
          <div class="cells mt-20" v-if="roleType == 2">
            <div class="cell cell-select cell-select-after">
              <div class="cell-hd">
                <label for class="label">学生所在班级</label>
              </div>
              <div class="cell-bd">
                <select class="select" name dir="rtl" v-model="classId">
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
          <!-- am pm 晚自习 -->
          <div class="cells mt-20 mb-20">
            <div class="cell min-h120">
              <div class="cell-hd">
                <label class="label">上午开始时间</label>
              </div>
              <div class="cell-bd text-right">
                <span @click="handleSelectTime('am')">{{ config.am }}</span>
              </div>
            </div>
            <div class="cell min-h120">
              <div class="cell-hd">
                <label class="label">下午开始时间</label>
              </div>
              <div class="cell-bd text-right">
                <span @click="handleSelectTime('pm')">{{ config.pm }}</span>
              </div>
            </div>
            <div class="cell min-h120">
              <div class="cell-hd">
                <label class="label">晚自习开始时间</label>
              </div>
              <div class="cell-bd text-right">
                <span @click="handleSelectTime('night')">{{ config.night }}</span>
              </div>
            </div>
            <div class="cell min-h120">
              <div class="cell-hd">
                <label class="label">课程时间</label>
              </div>
              <div class="cell-bd">
                <p class="text-right">
                  <van-stepper v-model="config.lessonTime" :min="20" :max="60"></van-stepper>
                </p>
              </div>
            </div>
          </div>
          <div class="cells-title" v-if="optionList.length">
            <span>选项名称</span>
            <span>时长(分)</span>
          </div>
          <div class="cells mb-20">
            <div class="cell min-h120" v-for="item in optionList" :key="item.id">
              <div class="cell-hd">
                <label for class="label">{{ item.lessonName }}</label>
              </div>
              <div class="cell-bd">
                <p class="text-right">{{ item.timeLong }}</p>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="课表排版">
          <table class="schedule mt-20" align="center" style="width:100%;" v-if="tableData.length">
            <thead>
              <tr>
                <th>
                  <span>星期</span>
                  <span></span>
                </th>
                <th v-for="(week, index) in weekList" :key="index">{{ week.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="schedule-tr" v-for="(tr, index) in tableData" :key="index">
                <template>
                  <td v-if="index == 0" :rowspan="amCount">上午</td>
                  <td v-if="index == amCount" :rowspan="pmCount">下午</td>
                  <td v-if="index == pmCount + amCount" :rowspan="nightCount">晚自习</td>
                </template>
                <td class="schedule-td" v-for="(td, tdIndex) in tr.list" :key="tdIndex">
                  <div @click="handleChangeLesson(td, index, tdIndex)">
                    <span v-if="td.lessonName">{{ td.lessonName }}</span>
                    <span class="have" v-else>-</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </van-tab>
      </van-tabs>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <div class="flex">
          <van-button
            type="default"
            size="large"
            class="no-radius"
            @click="handleAddLesson"
            v-show="tabActive == 0"
          >新增选项</van-button>
          <van-button
            type="info"
            size="large"
            class="no-radius"
            @click="tabActive = 1"
            v-show="tabActive == 0"
          >课表排版</van-button>
          <van-button
            type="info"
            size="large"
            class="no-radius"
            @click="saveSchedule"
            v-show="tabActive == 1"
          >保存</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { mapState } from "vuex";
import classList from "@/mixins/classList";
import weekList from "@/mixins/weekList";
export default {
  name: "scheduleEdit",
  mixins: [classList, weekList],
  data() {
    return {
      isDay: null,
      isPitchId: null,
      amCount: 0,
      pmCount: 0,
      nightCount: 0,
      dialogVisible: false,
      isDialogState: 1, //1是新增状态 2是编辑状态
      popupRight: false,
      popupTime: false,
      rowIndex: 0, //tr行索引值
      tdIndex: 0, //td块索引值
      openType: "am",
      data: "",
      config: {
        am: "08:00", //上午开始时间
        pm: "14:00", //下午开始时间
        night: "19:30", //晚自习开始时间
        lessonTime: 40
      },
      optionList: [], //选项
      lessonList: [],
      tableData: [],
      tabActive: 0,
      form: {
        lessonName: "",
        timeLong: 10
      },
      //无课
      noClass: {
        lessonId: 0,
        lessonName: "",
        timeLong: 0,
        type: 1
      }
    };
  },
  computed: {
    ...mapState("user", {
      roleType: state => state.info.roleType,
      classId: state => state.info.classId,
      studentId: state => state.info.studentId
    })
  },
  methods: {
    handleSelectTime(type) {
      this.popupTime = true;
      this.openType = type;
      if (type === "am") {
        this.data = this.config.am;
      } else if (type === "pm") {
        this.data = this.config.pm;
      } else {
        this.data = this.config.night;
      }
    },
    //确认选择时间
    handleTimeConfirm(value, index) {
      if (this.openType === "am") {
        this.config.am = value;
      } else if (this.openType === "pm") {
        this.config.pm = value;
      } else {
        this.config.night = value;
      }
      this.popupTime = false;
    },
    //新增选项
    handleAddLesson() {
      this.dialogVisible = true;
      this.form.lessonName = "";
    },
    async handleSubmit(action, done) {
      if (action === "confirm") {
        if (this.form.lessonName == "") {
          this.$toast("请输入选项名称");
          done(false);
        } else {
          let res;
          if (this.roleType == 2) {
            //添加老师自制课表可选课程
            let params = Object.assign({}, this.form, {
              classId: this.classId
            });
            res = await service.addMyLessonWithClass(params);
          } else {
            //添加家长自制课表可选课程
            let params = Object.assign({}, this.form, {
              studentId: this.studentId
            });
            res = await service.addMyLessonWithStudent(params);
          }
          if (res.errorCode === 0) {
            this.dialogVisible = false;
            if (this.roleType == 2) {
              this.queryLessonWithClassId({ classId: this.classId });
              this.queryMyLessonByClassId({ classId: this.classId });
            } else {
              this.queryMyLessonByStudentId({ studentId: this.studentId });
              this.queryLessonWithStudentId({ studentId: this.studentId });
            }
            done();
          } else {
            this.$toast(`${res.errorMsg}`);
          }
        }
      } else {
        done();
      }
    },
    //表格新增行数
    handleAddRow(type) {},
    //选择课程
    handleChangeLesson(params, index, tdIndex) {
      this.popupRight = true;
      this.rowIndex = index; //设置点击的行数
      this.tdIndex = tdIndex; //设置点击的td块索引值
    },
    //确认课程
    handleLessonConfirm(params) {
      let obj = this.tableData[this.rowIndex].list[this.tdIndex];
      if (Object.keys(obj).length) {
        for (let i in params) {
          this.$set(obj, i, params[i]);
        }
        this.popupRight = false;
      }
    },
    //将时间转成秒数
    timeToSec(time) {
      if (typeof time === "string") {
        let hour = time.split(":")[0] * 3600; //时
        let min = time.split(":")[1] * 60; //分
        return hour + min;
      }
    },
    //生成时分
    formatTime(seconds) {
      return [parseInt(seconds / 60 / 60), parseInt((seconds / 60) % 60)]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
    },
    //判断上午 下午 晚自习中间是否有选择课程
    isSelectLesson(arr = []) {
      let isTrue = 0;
      for (let e = 0; e < arr.length; e++) {
        let elem = arr[e];
        for (let len = elem.length - 1; len >= 0; len--) {
          if (elem[len].lessonId != 0) {
            let i = len - 1;
            for (i; i >= 0; i--) {
              if (elem[i].lessonId === 0) {
                this.isDay = elem[i].day;
                this.isPitchId = elem[i].pitchId;
                isTrue++;
              }
            }
          }
        }
      }
      return isTrue;
    },
    //保存课表
    saveSchedule() {
      let len = this.tableData.length;
      let tableData = this.tableData;
      let amList = [];
      let pmList = [];
      let nigList = [];
      let amFileter = [];
      let pmFileter = [];
      let nightFileter = [];
      //表格循环
      for (let i = 0; i < tableData.length; i++) {
        let list = tableData[i].list;
        for (let l = 0; l < list.length; l++) {
          let obj = list[l];
          obj.studentId = this.studentId;
          if (obj.timePeriod == 1) {
            amList.push(obj);
          }
          if (obj.timePeriod == 2) {
            pmList.push(obj);
          }
          if (obj.timePeriod == 3) {
            nigList.push(obj);
          }
        }
      }

      for (let s = 1; s <= 5; s++) {
        amFileter.push(amList.filter(item => item.day === s));
        pmFileter.push(pmList.filter(item => item.day === s));
        nightFileter.push(nigList.filter(item => item.day === s));
      }
      let f = this.isSelectLesson(amFileter);
      let c = this.isSelectLesson(pmFileter);
      let k = this.isSelectLesson(nightFileter);
      if (f != 0 || c != 0 || k != 0) {
        let obj = this.weekList.filter(item => item.day == this.isDay);
        this.$toast(`${obj[0].name}第${this.isPitchId}节不能为空, 请完善课表`);
        return false;
      }
      let list4 = [];
      let amStartTime;
      let amEndTime;
      let nigStartTime;
      let nigEndTime;
      let pmStartTime;
      let pmEndTime;
      for (let s = 0; s <= 4; s++) {
        amStartTime = this.timeToSec(this.config.am); //上午上课开始时间
        let li = amFileter[s];
        let li2 = pmFileter[s];
        let li3 = nightFileter[s];
        let result2 = [];
        let result3 = [];
        let result4 = [];
        for (let u = 0; u < li.length; u++) {
          if (li[u].timeLong === 0 && li[u].lessonName) {
            amEndTime = amStartTime + this.config.lessonTime * 60;
            li[u].startTime = this.formatTime(amStartTime);
            li[u].endTime = this.formatTime(amEndTime);
            amStartTime = amEndTime;
          }
          if (li[u].timeLong != 0 && li[u].lessonName) {
            amEndTime = amStartTime + li[u].timeLong * 60;
            li[u].startTime = this.formatTime(amStartTime);
            li[u].endTime = this.formatTime(amEndTime);
            amStartTime = amEndTime;
          }
          result2.push(li[u]);
        }
        pmStartTime = this.timeToSec(this.config.pm);
        for (let o = 0; o < li2.length; o++) {
          if (li2[o].timeLong === 0 && li2[o].lessonName) {
            pmEndTime = pmStartTime + this.config.lessonTime * 60;
            li2[o].startTime = this.formatTime(pmStartTime);
            li2[o].endTime = this.formatTime(pmEndTime);
            pmStartTime = pmEndTime;
          }
          if (li2[o].timeLong != 0 && li2[o].lessonName) {
            pmEndTime = pmStartTime + li2[o].timeLong * 60;
            li2[o].startTime = this.formatTime(pmStartTime);
            li2[o].endTime = this.formatTime(pmEndTime);
            pmStartTime = pmEndTime;
          }
          result3.push(li2[o]);
        }
        nigStartTime = this.timeToSec(this.config.night);
        for (let y = 0; y < li3.length; y++) {
          if (li3[y].timeLong === 0 && li3[y].lessonName) {
            nigEndTime = nigStartTime + this.config.lessonTime * 60;
            li3[y].startTime = this.formatTime(nigStartTime);
            li3[y].endTime = this.formatTime(nigEndTime);
            nigStartTime = nigEndTime;
          }
          if (li3[y].timeLong != 0 && li3[y].lessonName) {
            nigEndTime = nigStartTime + li3[y].timeLong * 60;
            li3[y].startTime = this.formatTime(nigStartTime);
            li3[y].endTime = this.formatTime(nigEndTime);
            nigStartTime = nigEndTime;
          }
          result4.push(li3[y]);
        }
        let lii = result2.concat(result3).concat(result4) || [];
        list4.push({ list: lii });
      }
      console.log(list4);
      if (list4.length) {
        this.$dialog
          .confirm({
            title: "提示",
            message: "确定要保存课表吗？"
          })
          .then(() => {
            // 根据角色不同提交方法
            if (this.roleType == 2) {
              this.updateSchedule({
                classId: this.classId,
                scheduleVOs: list4
              });
            } else {
              this.updateMySchedule({ scheduleVOs: list4 });
            }
          });
      }
    },
    //查询我的课表
    async queryMySchedule(params = {}) {
      let res = await service.queryMySchedule(params);
      if (res.errorCode === 0) {
        if (res.data.length) {
          let result = res.data || [];
          let amCount = 0;
          let pmCount = 0;
          let nightCount = 0;
          for (let i = 0; i < result.length; i++) {
            let list = result[i].list;
            for (let l = 0; l < list.length; l++) {
              let timePeriod = list[l].timePeriod;
              if (timePeriod == 1) {
                amCount++;
              }
              if (timePeriod == 2) {
                pmCount++;
              }
              if (timePeriod == 3) {
                nightCount++;
              }
            }
          }
          this.amCount = amCount / 5;
          this.pmCount = pmCount / 5;
          this.nightCount = nightCount / 5;
          this.tableData = res.data || [];
        }
      }
    },
    //查询班级课表（老师）
    async queryClassSchedule(params = {}) {
      let res = await service.queryClassSchedule(params);
      if (res.errorCode === 0) {
        if (res.data.length) {
          let result = res.data || [];
          let amCount = 0;
          let pmCount = 0;
          let nightCount = 0;
          for (let i = 0; i < result.length; i++) {
            let list = result[i].list;
            for (let l = 0; l < list.length; l++) {
              let timePeriod = list[l].timePeriod;
              if (timePeriod == 1) {
                amCount++;
              }
              if (timePeriod == 2) {
                pmCount++;
              }
              if (timePeriod == 3) {
                nightCount++;
              }
            }
          }
          this.amCount = amCount / 5;
          this.pmCount = pmCount / 5;
          this.nightCount = nightCount / 5;
          this.tableData = res.data || [];
        }
      }
    },
    //编辑我的课表
    async updateMySchedule(params = {}) {
      let res = await service.updateMySchedule(params);
      if (res.errorCode === 0) {
        this.$router.go(-1);
      }
    },
    //编辑班级课表（老师）
    async updateSchedule(params = {}) {
      let res = await service.updateSchedule(params);
      if (res.errorCode === 0) {
        this.$router.go(-1);
      }
    },
    //查询家长自制课表可选课程
    async queryLessonWithStudentId(params = {}) {
      let res = await service.queryLessonWithStudentId(params);
      if (res.errorCode === 0) {
        this.lessonList = res.data || [];
      }
    },
    //查询老师自制课表可选课程
    async queryLessonWithClassId(params = {}) {
      let res = await service.queryLessonWithClassId(params);
      if (res.errorCode === 0) {
        this.lessonList = res.data || [];
      }
    },
    //查询班级自增课程
    async queryMyLessonByClassId(params = {}) {
      let res = await service.queryMyLessonByClassId(params);
      if (res.errorCode === 0) {
        this.optionList = res.data || [];
      }
    },
    //查询班级自增课程
    async queryMyLessonByStudentId(params = {}) {
      let res = await service.queryMyLessonByStudentId(params);
      if (res.errorCode === 0) {
        this.optionList = res.data || [];
      }
    },
    //开始时间、课程时间
    async queryDefaulTime(params = {}) {
      let res = await service.queryDefaulTime(params);
      if (res.errorCode === 0) {
        this.config = Object.assign({}, res.data);
      }
    },
    //班级开始时间、课程时间
    async queryClassDefaul(params = {}) {
      let res = await service.queryClassDefaul(params);
      if (res.errorCode === 0) {
        this.config = Object.assign({}, res.data);
      }
    }
  },
  mounted() {
    if (this.roleType == 2) {
      this.queryClassSchedule({ classId: this.classId });
      this.queryLessonWithClassId({ classId: this.classId });
      this.queryMyLessonByClassId({ classId: this.classId });
      this.queryClassDefaul({ classId: this.classId });
    } else {
      this.queryMySchedule({ studentId: this.studentId });
      this.queryLessonWithStudentId({ studentId: this.studentId });
      this.queryMyLessonByStudentId({ studentId: this.studentId });
      this.queryDefaulTime({ studentId: this.studentId });
    }
  }
};
</script>
<style lang="less" scoped>
#lineTd {
  min-width: 180px;
  position: relative;
}
table {
  color: #606266;
  border-collapse: collapse;
  text-align: center;
  table-layout: fixed;
}
th,
td {
  font-size: 24px;
  height: 100px;
  border: 1px solid #ebeef5;
  text-align: center;
}
th {
  height: 80px;
  white-space: nowrap;
  background-color: #f5f7fa;
}
.lesson-popup {
  width: 70%;
  height: 100%;
}
.lesson {
  padding: 20px;
  &-btn {
    margin-bottom: 20px;
    margin-right: 20px;
  }
}
</style>
