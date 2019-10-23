<template>
  <div class="page">
    <div class="page-hd">
      <template v-if="roleType == 2">
        <!-- 班级选择菜单 -->
        <div class="button-sp-area flex" size-17>
          <a href="javascript:;" id="showDatePicker" @click="popupShow = true">
            <span>{{ className }}</span>
            <van-icon name="arrow-down" size="16px"></van-icon>
          </a>
        </div>
        <!-- 班级选择菜单 -->
      </template>
    </div>
    <div class="page-bd">
      <van-popup v-model="popupShow" position="bottom">
        <van-picker
          :columns="classList"
          show-toolbar
          value-key="className"
          @cancel="popupShow = false"
          @confirm="handleClassConfirm"
        ></van-picker>
      </van-popup>
      <!-- 学校课表 -->
      <div
        class="schedule-top flex a-i-c"
        v-if="roleType == 2 && tableData.length"
      >
        <div>
          <van-button type="info" size="small" @click="handleEdit"
            >编辑课表</van-button
          >
          <van-button type="danger" size="small" @click="handleDelSchedule"
            >删除课表</van-button
          >
        </div>
      </div>
      <!-- <table class="schedule" align="center" style="width:100%;" v-if="tableData.length">
        <thead>
          <tr>
            <th></th>
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
              <template v-if="td.status != 1">
                <span v-if="td.lessonName">{{ td.lessonName }}</span>
                <span class="have" v-else>-</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>-->

      <!-- 上午 -->
      <table
        class="schedule mt-20"
        align="center"
        style="width:100%;"
        v-if="tableData.length"
      >
        <thead>
          <tr>
            <th></th>
            <th v-for="(week, index) in weekList" :key="index">
              {{ week.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tr, index) in tableData" :key="index">
            <!-- <td>{{ index + 1 }}</td> -->
            <template v-if="index == 0">
              <td :rowspan="tableData.length">上午</td>
            </template>
            <!-- <td v-for="(td, tdIndex) in tr.list" :key="tdIndex" v-if="td.lessonName!=='课间'"> -->
            <td v-for="(td, tdIndex) in tr.list" :key="tdIndex">
              <div @click="handleChangeLesson(td, index, tdIndex, 1)">
                <span v-if="td.lessonName">{{
                  td.lessonName == "课间" ? "-" : td.lessonName
                }}</span>
                <span class="have" v-else>-</span>
              </div>
            </td>
            <!-- <td v-else>-</td> -->
          </tr>
        </tbody>
      </table>
      <!-- 下午 -->
      <table
        class="schedule"
        align="center"
        style="width:100%;"
        v-if="tableData.length"
      >
        <tbody>
          <tr v-for="(tr, index) in tableDatapm" :key="index">
            <template v-if="index == 0">
              <td :rowspan="tableDatapm.length">下午</td>
            </template>
            <td v-for="(td, tdIndex) in tr.list" :key="tdIndex">
              <div @click="handleChangeLesson(td, index, tdIndex, 2)">
                <span v-if="td.lessonName">{{
                  td.lessonName == "课间" ? "-" : td.lessonName
                }}</span>
                <span class="have" v-else>-</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 晚自习 -->
      <table
        class="schedule"
        align="center"
        style="width:100%;"
        v-if="tableData.length"
      >
        <tbody>
          <tr v-for="(tr, index) in tableDataNight" :key="index">
            <template v-if="index == 0">
              <td :rowspan="tableDataNight.length">晚自习</td>
            </template>
            <td v-for="(td, tdIndex) in tr.list" :key="tdIndex">
              <div @click="handleChangeLesson(td, index, tdIndex, 3)">
                <span v-if="td.lessonName">{{
                  td.lessonName == "课间" ? "-" : td.lessonName
                }}</span>
                <span class="have" v-else>-</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="empty" v-if="!tableData.length">
        <img src="@/assets/kong.png" alt />
        <p>暂无课表</p>
      </div>
    </div>
    <div class="page-ft" v-if="!tableData.length">
      <div class="fixed-bottom" style="z-index: 100;" v-if="roleType == 2">
        <van-button
          type="info"
          size="large"
          class="no-radius"
          @click="handleAdd"
          >创建课表</van-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { mapState } from "vuex";
import classList from "@/mixins/classList";
export default {
  name: "",
  mixins: [classList],
  data() {
    return {
      amCount: 0,
      pmCount: 0,
      nightCount: 0,
      popupShow: false,
      className: this.$store.state.user.info.className,
      query: {
        classId: this.$store.state.user.info.classId
      },
      weekList: [
        { name: "周一", day: 1 },
        { name: "周二", day: 2 },
        { name: "周三", day: 3 },
        { name: "周四", day: 4 },
        { name: "周五", day: 5 }
      ],
      tableData: [],
      tableDatapm: [],
      tableDataNight: []
    };
  },
  computed: {
    ...mapState("user", {
      roleType: state => state.info.roleType
    })
  },
  methods: {
    handleClassConfirm(value, index) {
      this.className = value.className;
      this.query.classId = value.classId;
      this.queryClassSchedule(this.query);
    },
    handleAdd() {
      this.$router.push({
        path: "/schedule/add"
      });
    },
    handleEdit() {
      this.$router.push({
        path: "/schedule/edit",
        query: {
          classId: this.query.classId
        }
      });
    },
    handleDelSchedule() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定要删除课表吗？"
        })
        .then(() => {
          this.deteleSchedule({ classId: this.query.classId });
        })
        .catch(() => {});
    },
    async deteleSchedule(params = {}) {
      let res = await service.deteleSchedule(params);
      if (res.errorCode === 0) {
        this.tableData = [];
      }
    },
    //查询班级课表（老师）
    async queryClassSchedule(params = {}) {
      let res = await service.queryClassSchedule(params);
      if (res.errorCode === 0) {
        this.popupShow = false;
        if (res.data) {
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
          this.tableData = res.data.morming;
          this.tableDatapm = res.data.lunch;
          this.tableDataNight = res.data.evening;
          console.log(this.tableData);
        } else {
          this.tableData = [];
        }
      }
    }
  },
  activated() {
    this.queryClassSchedule(this.query);
  }
};
</script>
<style lang="less" scoped>
.page-hd {
  margin-bottom: 0;
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
</style>