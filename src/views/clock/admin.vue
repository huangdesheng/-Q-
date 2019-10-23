<template>
  <div class="page">
    <div class="page-hd">
      <div class="button-sp-area flex" size-17>
        <a href="javascript:void(0);" id="showDatePicker" @click="popupShow = true">
          <span id="data1">{{ query.date }}</span>
          <van-icon name="arrow-down" size="16px"></van-icon>
        </a>
      </div>
    </div>
    <div class="page-bd">
      <!-- popup -->
      <van-popup v-model="popupShow" position="bottom">
        <van-datetime-picker
          ref="datetime"
          @cancel="popupShow = false"
          @confirm="handleShowDatePicker"
          v-model="currentDate"
          type="date"
          :formatter="formatter"
        ></van-datetime-picker>
      </van-popup>
      <!-- popup -->
      <div class="clock-table">
        <div class="cells">
          <div class="cell" size-17>
            <div class="cell-bd">年级</div>
            <div class="cell-bd">应到</div>
            <div class="cell-bd">实到</div>
            <div class="cell-bd">请假</div>
            <div class="cell-bd">缺勤</div>
            <div class="cell-bd">出勤率</div>
          </div>
        </div>
        <div class="cells">
          <div class="cell" v-for="item in list" :key="item.gradeName">
            <div class="cell-bd">
              <p>{{ item.gradeName }}</p>
            </div>
            <div class="cell-bd">
              <p>{{ item.classCount }}</p>
            </div>
            <div class="cell-bd">
              <p>{{ item.clockCount }}</p>
            </div>
            <div class="cell-bd">
              <p>{{ item.vacate }}</p>
            </div>
            <div class="cell-bd">
              <p>{{ item.absenteeism }}</p>
            </div>
            <div class="cell-bd">
              <van-circle
                v-model="clock.clockRate"
                :rate="clock.clockRate"
                color="#07c160"
                layer-color="#ebedf0"
                size="42px"
                :text="clock.clockRate.toFixed(0) + '%'"
              ></van-circle>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import service from "@/api";
import formatter from "@/mixins/date-formatter";
import { mapState } from "vuex";
export default {
  name: "clockAdmin",
  mixins: [formatter],
  data() {
    return {
      popupShow: false,
      currentDate: new Date(),
      query: {
        schoolId: this.$store.state.user.info.id,
        date: dayjs().format("YYYY-MM-DD")
      },
      list: []
    };
  },
  methods: {
    //选择年月日
    handleShowDatePicker(value) {
      let now = dayjs(new Date(value).getTime()).format("YYYY-MM-DD");
      this.query.date = now;
      this.clockStatWithSchool(this.query);
    },
    //园长端考勤统计查询
    async clockStatWithSchool(params = {}) {
      let res = await service.clockStatWithSchool(params);
      if (res.errorCode === 0) {
        this.list = res.data;
        this.popupShow = false;
      }
    }
  },
  mounted() {
    this.clockStatWithSchool(this.query);
  }
};
</script>
<style lang="less" scoped>
</style>