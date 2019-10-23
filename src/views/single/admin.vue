<template>
  <div class="page">
    <div class="page-bd">
      <!-- 角色选择 -->
      <div class="flex a-i-c home-user gradient-two" @click="jumpRole">
        <div class="flex a-i-c">
          <div class="avatar">
            <img :src="photo" width="60" height="60" radius="50" />
          </div>
          <div class="pl-20">
            <h3 class="mb-20" size-18>{{ name }}</h3>
            <p size-12>知识是智慧的火炬</p>
          </div>
        </div>
        <van-icon name="arrow" size="16px"></van-icon>
      </div>
      <!-- 角色选择 -->
      <!-- 日期选择 1 -->
      <van-popup v-model="popupOne" position="bottom">
        <calendar :zero="true" :value="valueOne" :range="true" :lunar="true" @select="selectOne"></calendar>
      </van-popup>
      <!-- 日期选择 1 -->
      <!-- 日期选择 2 -->
      <van-popup v-model="popupTwo" position="bottom">
        <calendar :zero="true" :value="valueTwo" :range="true" :lunar="true" @select="selectTwo"></calendar>
      </van-popup>
      <!-- 日期选择 2 -->
      <van-popup v-model="popupShow" position="bottom">
        <van-picker
          :columns="gradeList"
          show-toolbar
          value-key="gradeName"
          @cancel="popupShow = false"
          @confirm="handlegradeConfirm"
        ></van-picker>
      </van-popup>
      <!-- 年级选择菜单 -->
      <div class="classId flex a-i-c j-c-s-b">
        <p>年级</p>
        <div @click="popupShow = true">
          <span class="mr-10">{{ gradeName }}</span>
          <van-icon name="arrow-down" size="16px"></van-icon>
        </div>
      </div>
      <!-- 年级选择菜单 -->
      <van-tabs v-model="tabActive" :line-height="2">
        <van-tab title="在家表现">
          <div class="container">
            <p class="pl-20 mt-30 mb-30">在家表现分析</p>
            <div class="mod" style="padding-bottom:0">
              <div class="flex j-c-c a-i-c today">
                <div class="flex a-i-c" @click="popupOne = true">
                  <time size-16>{{ query.startDate }}</time>
                  <span style="padding:0 4px;">至</span>
                  <time class="mr-20" size-16>{{ query.endDate }}</time>
                  <van-icon name="arrow-down" size="14px"></van-icon>
                </div>
              </div>
              <!-- 数据表格 -->
              <div class="el-table">
                <table class="fixedTable" style="width:160%;">
                  <thead>
                    <tr>
                      <td>
                        <div id="lineTd" class="block">
                          <span class="span2">行为</span>
                          <span class="span1">Q星</span>
                        </div>
                      </td>
                      <td class="fixedColumn">
                        <div class="block"></div>
                      </td>
                      <td>
                        <div class="block">
                          <van-rate v-model="count" :size="14" :count="5" color="#febf56" readonly></van-rate>
                        </div>
                      </td>
                      <td>
                        <div class="block">
                          <van-rate v-model="count" :size="14" :count="4" color="#febf56" readonly></van-rate>
                        </div>
                      </td>
                      <td>
                        <div class="block">
                          <van-rate v-model="count" :size="14" :count="3" color="#febf56" readonly></van-rate>
                        </div>
                      </td>
                      <td>
                        <div class="block">
                          <van-rate v-model="count" :size="14" :count="2" color="#febf56" readonly></van-rate>
                        </div>
                      </td>
                      <td>
                        <div class="block">
                          <van-rate v-model="count" :size="14" :count="1" color="#febf56" readonly></van-rate>
                        </div>
                      </td>
                      <td>
                        <div class="block">未打卡</div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in actionTable" :key="index">
                      <td>
                        <div class="block">{{ item.name }}</div>
                      </td>
                      <td class="fixedColumn">
                        <div class="block"></div>
                      </td>
                      <td>
                        <div class="block">{{ item.five + '人' }}</div>
                      </td>
                      <td>
                        <div class="block">{{ item.four + '人' }}</div>
                      </td>
                      <td>
                        <div class="block">{{ item.three + '人' }}</div>
                      </td>
                      <td>
                        <div class="block">{{ item.two + '人' }}</div>
                      </td>
                      <td>
                        <div class="block">{{ item.one + '人' }}</div>
                      </td>
                      <template v-if="item.actionId == 0">
                        <td>
                          <div class="block">-</div>
                        </td>
                      </template>
                      <template v-else>
                        <td>
                          <div class="block">{{ item.zero + '人' }}</div>
                        </td>
                      </template>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p class="pl-20 mt-30 mb-30">使用人数分布</p>
            <div class="mod">
              <!-- 数据分析 -->
              <qxChart id="homeOption" height="300px" :option="homeOption" />
            </div>
            <!-- 在家表现统计 -->
            <div class="flex mt-30 mb-30" size-12>
              <div class="flex-1 text-center">
                班级总人数：
                <span style="color:#f36969">{{ actionObj.allNumber + "人" }}</span>
              </div>
              <div class="flex-1 text-center">
                使用行为人数：
                <span style="color:#f36969">{{ actionObj.userNumber + "人" }}</span>
              </div>
              <div class="flex-1 text-center">
                未使用人数：
                <span style="color:#f36969">{{ actionObj.unUser + "人" }}</span>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="在校表现">
          <div class="container">
            <p class="pl-20 mt-30 mb-30">学生上课效果分析</p>
            <div class="mod" style="padding-bottom:0">
              <div class="flex j-c-c a-i-c today">
                <div class="flex a-i-c" @click="popupTwo = true">
                  <time size-16>{{ querys.startDate }}</time>
                  <span style="padding:0 4px;">至</span>
                  <time class="mr-20" size-16>{{ querys.endDate }}</time>
                  <van-icon name="arrow-down" size="14px"></van-icon>
                </div>
              </div>
              <!-- 数据表格 -->
              <div class="el-table">
                <table class="fixedTable" style="width:160%;">
                  <thead>
                    <tr>
                      <td>
                        <div id="lineTd" class="block">
                          <span class="span2">课程</span>
                          <span class="span1">Q星</span>
                        </div>
                      </td>
                      <td class="fixedColumn">
                        <div class="block"></div>
                      </td>
                      <td>
                        <div class="block">
                          <van-rate v-model="count" :size="14" :count="5" color="#febf56" readonly></van-rate>
                        </div>
                      </td>
                      <td>
                        <div class="block">
                          <van-rate v-model="count" :size="14" :count="4" color="#febf56" readonly></van-rate>
                        </div>
                      </td>
                      <td>
                        <div class="block">
                          <van-rate v-model="count" :size="14" :count="3" color="#febf56" readonly></van-rate>
                        </div>
                      </td>
                      <td>
                        <div class="block">
                          <van-rate v-model="count" :size="14" :count="2" color="#febf56" readonly></van-rate>
                        </div>
                      </td>
                      <td>
                        <div class="block">
                          <van-rate v-model="count" :size="14" :count="1" color="#febf56" readonly></van-rate>
                        </div>
                      </td>
                      <td>
                        <div class="block">未打卡</div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in lessonTable" :key="index">
                      <td>
                        <div class="block">{{ item.name }}</div>
                      </td>
                      <td class="fixedColumn">
                        <div class="block"></div>
                      </td>
                      <td>
                        <div class="block">{{ item.five + '人' }}</div>
                      </td>
                      <td>
                        <div class="block">{{ item.four + '人' }}</div>
                      </td>
                      <td>
                        <div class="block">{{ item.three + '人' }}</div>
                      </td>
                      <td>
                        <div class="block">{{ item.two + '人' }}</div>
                      </td>
                      <td>
                        <div class="block">{{ item.one + '人' }}</div>
                      </td>
                      <td>
                        <div class="block">{{ item.zero + '人' }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- 在校表现统计 -->
            <div class="flex mt-30 mb-30" size-12>
              <div class="flex-1 text-center">
                班级总人数：
                <span style="color:#f36969">{{ lessonObj.allNumber + "人" }}</span>
              </div>
              <div class="flex-1 text-center">
                使用手环人数：
                <span style="color:#f36969">{{ lessonObj.userNumber + "人" }}</span>
              </div>
              <div class="flex-1 text-center">
                未使用人数：
                <span style="color:#f36969">{{ lessonObj.unUser + "人" }}</span>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="page-ft">
      <qxFooter></qxFooter>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import dayjs from "dayjs";
import calendar from "@/components/calendar";
import qxChart from "@/components/Myecharts";
import qxFooter from "@/components/Footer";
import { mapState } from "vuex";
export default {
  name: "singleAdmin",
  components: {
    qxChart,
    qxFooter,
    calendar
  },
  data() {
    return {
      count: 5,
      popupOne: false,
      popupTwo: false,
      popupShow: false,
      tabActive: 0, //tab
      gradeName: "",
      valueOne: [
        dayjs()
          .format("YYYY-MM-DD")
          .split("-"),
        dayjs()
          .format("YYYY-MM-DD")
          .split("-")
      ], //默认日期
      valueTwo: [
        dayjs()
          .format("YYYY-MM-DD")
          .split("-"),
        dayjs()
          .format("YYYY-MM-DD")
          .split("-")
      ], //默认日期
      query: {
        schoolId: this.$store.state.user.info.id,
        gradeId: this.$store.state.user.info.gradeId,
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD")
      },
      querys: {
        schoolId: this.$store.state.user.info.id,
        gradeId: this.$store.state.user.info.gradeId,
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD")
      },
      gradeList: [],
      actionObj: {},
      lessonObj: {},
      actionTable: [], //在家表格数据
      lessonTable: [], //在校表格数据
      homeOption: {
        tooltip: {
          trigger: "item",
          triggerOn: "click",
          formatter: function(a) {
            return a["name"] + "<br/>人数: " + a["value"];
          }
        },
        legend: {
          icon: "circle",
          itemWidth: 12,
          itemHeight: 12,
          orient: "horizontal",
          left: "center",
          bottom: 0,
          data: [],
          show: true
        },
        series: [
          {
            name: "在家表现",
            type: "pie",
            hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果
            radius: "80%",
            center: ["50%", "42%"],
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "inside",
                  formatter: function(a) {
                    return a["name"] + ": " + a["value"] + "人";
                  }
                }
              }
            }
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("user", {
      id: state => state.info.id,
      photo: state => state.info.photo,
      name: state => state.info.name
    })
  },
  methods: {
    //在家表现选择日期范围
    selectOne(begin, end) {
      if (begin && end) {
        this.query.startDate = begin.join("-");
        this.query.endDate = end.join("-");
        this.queryActionListAdmin(this.query);
        this.queryPieChartAdmin(this.query);
        this.queryStudentDetailAdmin(this.query);
      }
    },
    //在校表现选择日期范围
    selectTwo(begin, end) {
      if (begin && end) {
        this.querys.startDate = begin.join("-");
        this.querys.endDate = end.join("-");
        this.queryLessonInSchoolAdmin(this.querys);
        this.queryLessonStudentStatisticsAdmin(this.querys);
      }
    },
    jumpRole() {
      this.$router.push({
        path: "/role"
      });
    },
    handlegradeConfirm(value, index) {
      this.gradeName = value.gradeName;
      if (this.tabActive == 0) {
        this.query.gradeId = value.gradeId;
        //在家查询
        this.queryActionListAdmin(this.query);
        this.queryPieChartAdmin(this.query);
        this.queryStudentDetailAdmin(this.query);
      } else {
        this.querys.gradeId = value.gradeId;
        //在校查询
        this.queryLessonInSchoolAdmin(this.querys);
        this.queryLessonStudentStatisticsAdmin(this.querys);
      }
    },
    //查询学校年级
    async queryGradeAdmin(params = {}) {
      let res = await service.queryGradeAdmin(params);
      if (res.errorCode === 0) {
        this.gradeList = res.data;
        this.gradeName = res.data[0].gradeName;
      }
    },
    //查询在家表现（表格接口）
    async queryActionListAdmin(params = {}) {
      let res = await service.queryActionListAdmin(params);
      if (res.errorCode === 0) {
        this.actionTable = res.data;
      }
    },
    //查询在家表现（新图表接口）
    async queryPieChartAdmin(params = {}) {
      let res = await service.queryPieChartAdmin(params);
      if (res.errorCode === 0) {
        this.popupShow = false;
        this.popupOne = false;
        if (res.data.length) {
          this.homeOption.series[0].data = res.data;
          this.homeOption.legend.data = res.data.map(item => item.name);
        }
      }
    },
    //班级使用情况（行为表现）
    async queryStudentDetailAdmin(params = {}) {
      let res = await service.queryStudentDetailAdmin(params);
      if (res.errorCode === 0) {
        this.actionObj = res.data;
      }
    },
    //查询在校表现（表格接口）
    async queryLessonInSchoolAdmin(params = {}) {
      let res = await service.queryLessonInSchoolAdmin(params);
      if (res.errorCode === 0) {
        this.popupShow = false;
        this.popupTwo = false;
        this.lessonTable = res.data;
      }
    },
    //班级使用情况（在校表现）
    async queryLessonStudentStatisticsAdmin(params = {}) {
      let res = await service.queryLessonStudentStatisticsAdmin(params);
      if (res.errorCode === 0) {
        this.lessonObj = res.data;
      }
    }
  },
  mounted() {
    this.queryGradeAdmin({ schoolId: this.id });
    //在家查询
    this.queryActionListAdmin(this.query);
    this.queryPieChartAdmin(this.query);
    this.queryStudentDetailAdmin(this.query);
    //在校查询
    this.queryLessonInSchoolAdmin(this.querys);
    this.queryLessonStudentStatisticsAdmin(this.querys);
  }
};
</script>
<style lang="less" scoped>
.home-user {
  color: #fff;
  height: 180px;
  padding: 0 30px;
  position: relative;
  justify-content: space-between;
}
.classId {
  margin-bottom: 10px;
  background-color: #fff;
}
.today {
  padding: 30px;
  border-bottom: 1px solid #ebebeb;
}
.mod {
  height: auto;
  padding-bottom: 30px;
  background-color: #fff;
  box-shadow: 0 1px 20px 0 rgba(204, 204, 204, 0.4);
}
.el-table {
  width: 100%;
  overflow-x: scroll;
  white-space: nowrap;
}

.fixedTable tr {
  position: relative;
}
.block {
  color: #96d723;
  min-width: 240px;
  height: 100px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.span1 {
  position: absolute;
  top: 20%;
  right: 8%;
}
.span2 {
  position: absolute;
  top: 60%;
  left: 10%;
}

.fixedTable th {
  text-align: center;
  padding: 20px 0;
}
.fixedTable td:first-child {
  position: absolute;
  z-index: 3;
  .block {
    color: #444;
  }
}
.fixedTable td:nth-child(even) {
  background-color: #fafafa;
}
.fixedTable td:nth-child(odd) {
  background-color: #fff;
}

.fixedColumn {
  min-width: 240px;
  border: none;
}

#lineTd {
  &:before {
    content: "";
    position: absolute;
    width: 1px;
    height: 260px; /*这里需要自己调整，根据td的宽度和高度*/
    top: 0;
    left: 0;
    background-color: #ebeef5;
    display: block;
    transform: rotate(-68deg); /*这里需要自己调整，根据线的位置*/
    transform-origin: top;
  }
}
</style>
