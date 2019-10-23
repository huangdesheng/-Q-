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
                type="info"
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
            <van-swipe-cell
              ref="swipeCell"
              :right-width="60"
              v-for="(item, index) in optionList"
              :key="item.id"
              :on-close="onClose(item, index)"
            >
              <van-cell-group>
                <div class="cell min-h100" @click="onSwiptCellCick(item)">
                  <div class="cell-hd">
                    <label for class="label">{{ item.lessonName }}</label>
                  </div>
                  <div class="cell-bd">
                    <p class="text-right">{{ item.timeLong }}</p>
                  </div>
                </div>
              </van-cell-group>
              <span slot="right">删除</span>
            </van-swipe-cell>
          </div>
        </van-tab>
        <van-tab title="课表排版">
          <!-- 上午 -->
          <table class="schedule mt-20" align="center" style="width:100%;">
            <thead>
              <tr>
                <th></th>
                <th v-for="(week, index) in weekList" :key="index">{{ week.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tr, index) in tableData" :key="index">
                <!-- <td>{{ index + 1 }}</td> -->
                <template v-if="index == 0">
                  <td :rowspan="tableData.length">上午</td>
                </template>
                <td v-for="(td, tdIndex) in tr.list" :key="tdIndex">
                  <div @click="handleChangeLesson(td, index, tdIndex, 1)">
                    <span v-if="td.lessonName">{{ td.lessonName ? td.lessonName : "-" }}</span>
                    <van-icon name="plus" size="12px" color="#999" v-else></van-icon>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 下午 -->
          <table class="schedule" align="center" style="width:100%;">
            <tbody>
              <tr v-for="(tr, index) in tableDatapm" :key="index">
                <template v-if="index == 0">
                  <td :rowspan="tableDatapm.length">下午</td>
                </template>
                <td v-for="(td, tdIndex) in tr.list" :key="tdIndex">
                  <div @click="handleChangeLesson(td, index, tdIndex, 2)">
                    <span v-if="td.lessonName">{{ td.lessonName ? td.lessonName : "-" }}</span>
                    <van-icon name="plus" size="12px" color="#999" v-else></van-icon>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 晚自习 -->
          <table class="schedule" align="center" style="width:100%;">
            <tbody>
              <tr v-for="(tr, index) in tableDataNight" :key="index">
                <template v-if="index == 0">
                  <td :rowspan="tableDataNight.length">晚自习</td>
                </template>
                <td v-for="(td, tdIndex) in tr.list" :key="tdIndex">
                  <div @click="handleChangeLesson(td, index, tdIndex, 3)">
                    <span v-if="td.lessonName">{{ td.lessonName ? td.lessonName : "-" }}</span>
                    <van-icon name="plus" size="12px" color="#999" v-else></van-icon>
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
            v-show="tabActive == 1"
            @click="createSchedule"
          >保存课表</van-button>
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
  name: "scheduleAdd",
  mixins: [classList, weekList],
  data() {
    return {
      isDay: null,
      isPitchId: null,
      dialogVisible: false,
      isDialogState: 1, //1是新增状态 2是编辑状态
      popupRight: false,
      popupTime: false,
      rowIndex: 0, //tr行索引值
      tdIndex: 0, //td块索引值
      num: 0,
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
      tableData: [
        {
          list: [
            {
              lessonName: "",
              day: 1,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 1 //1上午 2下午 3晚自习
            },
            {
              lessonName: "",
              day: 2,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 1
            },
            {
              lessonName: "",
              day: 3,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 1
            },
            {
              lessonName: "",
              day: 4,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 1
            },
            {
              lessonName: "",
              day: 5,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 1
            }
          ]
        }
      ],
      tableDatapm: [
        {
          list: [
            {
              lessonName: "",
              day: 1,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 2
            },
            {
              lessonName: "",
              day: 2,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 2
            },
            {
              lessonName: "",
              day: 3,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 2
            },
            {
              lessonName: "",
              day: 4,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 2
            },
            {
              lessonName: "",
              day: 5,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 2
            }
          ]
        }
      ], //下午课表数据
      tableDataNight: [
        {
          list: [
            {
              lessonName: "",
              day: 1,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 3
            },
            {
              lessonName: "",
              day: 2,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 3
            },
            {
              lessonName: "",
              day: 3,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 3
            },
            {
              lessonName: "",
              day: 4,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 3
            },
            {
              lessonName: "",
              day: 5,
              pitchId: 1,
              timeLong: 0,
              lessonId: 0,
              type: 0,
              startTime: "",
              endTime: "",
              timePeriod: 3
            }
          ]
        }
      ],
      classId: this.$store.state.user.info.classId,
      studentId: this.$store.state.user.info.studentId,
      tabActive: 0,
      form: {
        lessonName: "",
        timeLong: 10
      },
      updateForm: {},
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
      roleType: state => state.info.roleType
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
      this.isDialogState = 1;
      this.dialogVisible = true;
      this.form.lessonName = "";
    },
    //编辑选项
    onSwiptCellCick(params = {}) {
      this.isDialogState = 2;
      this.dialogVisible = true;
      let { lessonName, timeLong, ...args } = params;
      this.form.lessonName = lessonName;
      this.form.timeLong = timeLong;
      this.updateForm = Object.assign({}, args);
    },
    //滑动单元格
    onClose(params, index) {
      let { id } = params;
      let obj = {
        type: this.roleType == 2 ? 2 : 1,
        id
      };
      return (clickPosition, instance) => {
        switch (clickPosition) {
          case "right":
            this.$dialog
              .confirm({
                title: "提示",
                message: "确认要删除该选项吗?"
              })
              .then(async () => {
                let res = await service.deleteMyLesson(obj);
                if (res.errorCode === 0) {
                  instance.close();
                  this.optionList.splice(index, 1);
                } else {
                  instance.close();
                  this.$toast(`${res.errorMsg}`);
                }
              })
              .catch(() => {
                instance.close();
              });
            break;
        }
      };
    },
    //新增选项
    async handleSubmit(action, done) {
      if (action === "confirm") {
        if (this.form.lessonName == "") {
          this.$toast("请输入选项名称");
          done(false);
        } else {
          let res;
          //判断是新增还是编辑模式
          if (this.isDialogState === 1) {
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
          } else {
            let { lessonName, timeLong } = this.form;
            let type = this.roleType == 2 ? 2 : 1;
            let obj = Object.assign({}, this.updateForm, {
              lessonName,
              timeLong,
              type
            });
            res = await service.updateMyLesson(obj);
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
    handleAddRow(type) {
      let len = this.tableData.length; //数据长度
      let list = [];
      for (let s = 1; s <= 5; s++) {
        let obj = {
          pitchId: len + 1,
          lessonName: "",
          lessonId: 0,
          type: 0,
          timeLong: 0,
          day: s,
          startTime: "",
          endTime: ""
        };
        list.push(obj);
      }
      if (type === 1) {
        this.tableData.push({ list });
      }
      if (type === 2) {
        this.tableDatapm.push({ list });
      }
      if (type === 3) {
        this.tableDataNight.push({ list });
      }
    },
    //选择课程
    handleChangeLesson(params, index, tdIndex, num) {
      this.popupRight = true;
      this.rowIndex = index; //设置点击的行数
      this.tdIndex = tdIndex; //设置点击的td块索引值
      this.num = num; //设置点击的
    },
    //确认课程
    handleLessonConfirm(params) {
      let tableData = this.tableData;
      let tableDatapm = this.tableDatapm;
      let tableDataNight = this.tableDataNight;
      let obj;
      let flag = false;
      let data;
      if (this.num === 1) {
        obj = this.tableData[this.rowIndex].list[this.tdIndex];
        data = tableData;
      } else if (this.num === 2) {
        obj = this.tableDatapm[this.rowIndex].list[this.tdIndex];
        data = tableDatapm;
      } else {
        obj = this.tableDataNight[this.rowIndex].list[this.tdIndex];
        data = tableDataNight;
      }
      if (Object.keys(obj).length) {
        for (let i in params) {
          this.$set(obj, i, params[i]);
        }
        this.popupRight = false;
      }
      let trObj = data[data.length - 1]; //获取数组最后一个元素
      for (let i = 0; i < trObj.list.length; i++) {
        if (
          obj.lessonName === trObj.list[i].lessonName &&
          obj.lessonName != ""
        ) {
          flag = true;
          break;
        }
      }
      if (flag) {
        //开始自增一行
        this.handleAddRow(this.num);
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
    //生成课表
    createSchedule() {
      let len = this.tableData.length;
      let tableData = this.tableData;
      let tableDatapm = this.tableDatapm;
      let tableDataNight = this.tableDataNight;
      let amList = [];
      let pmList = [];
      let nigList = [];
      let amFileter = [];
      let pmFileter = [];
      let nightFileter = [];
      //上午
      for (let i = 0; i < tableData.length; i++) {
        let list = tableData[i].list;
        for (let l = 0; l < list.length; l++) {
          let obj = list[l];
          obj.studentId = this.studentId;
          obj.timePeriod = 1;
          amList.push(obj);
        }
      }
      //下午
      for (let i = 0; i < tableDatapm.length; i++) {
        let list = tableDatapm[i].list;
        for (let l = 0; l < list.length; l++) {
          let obj = list[l];
          obj.pitchId = tableData.length + i + 1;
          obj.studentId = this.studentId;
          obj.timePeriod = 2;
          pmList.push(obj);
        }
      }
      //晚自习
      for (let i = 0; i < tableDataNight.length; i++) {
        let list = tableDataNight[i].list;
        for (let l = 0; l < list.length; l++) {
          let obj = list[l];
          obj.pitchId = tableData.length + tableDatapm.length + i + 1;
          obj.studentId = this.studentId;
          obj.timePeriod = 3;
          nigList.push(obj);
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
      //上午
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
        //保存课表并提交
        this.$dialog
          .confirm({
            title: "提示",
            message: "确定要保存课表吗？"
          })
          .then(() => {
            // 根据角色不同提交方法
            if (this.roleType == 2) {
              this.addSchedule({
                classId: this.classId,
                scheduleVOs: list4
              });
            } else {
              this.addMySchedule({ scheduleVOs: list4 });
            }
          });
      }
    },
    //查询家长自制课表可选课程
    async queryLessonWithStudentId(params = {}) {
      let res = await service.queryLessonWithStudentId(params);
      if (res.errorCode === 0) {
        this.lessonList = res.data || [];
      }
    },
    //查询家长自增课程
    async queryMyLessonByStudentId(params = {}) {
      let res = await service.queryMyLessonByStudentId(params);
      if (res.errorCode === 0) {
        this.optionList = res.data || [];
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
    //新增班级课表(老师)
    async addSchedule(params = {}) {
      let res = await service.addSchedule(params);
      if (res.errorCode === 0) {
        this.$router.go(-1);
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    },
    //自制我的课表
    async addMySchedule(params = {}) {
      let res = await service.addMySchedule(params);
      if (res.errorCode === 0) {
        this.$router.go(-1);
      } else {
        this.$toast(`${res.errorMsg}`);
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
      this.queryLessonWithClassId({ classId: this.classId });
      this.queryMyLessonByClassId({ classId: this.classId });
      this.queryClassDefaul({ classId: this.classId });
    } else {
      this.queryMyLessonByStudentId({ studentId: this.studentId });
      this.queryLessonWithStudentId({ studentId: this.studentId });
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