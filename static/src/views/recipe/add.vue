<template>
  <div class="page">
    <div class="page-bd">
      <!-- 开始时间选择 -->
      <van-popup v-model="startTimeShow" position="bottom">
        <van-datetime-picker
          @cancel="startTimeShow = false"
          @confirm="handleConfirmStartTime"
          v-model="startDate"
          type="date"
          :formatter="formatter"
        ></van-datetime-picker>
      </van-popup>
      <!-- 结束时间选择 -->
      <van-popup v-model="endTimeShow" position="bottom">
        <van-datetime-picker
          @cancel="endTimeShow = false"
          @confirm="handleConfirmEndTime"
          v-model="endDate"
          type="date"
          :formatter="formatter"
        ></van-datetime-picker>
      </van-popup>
      <form id="form" action ref="form" method="post">
        <div class="cells">
          <div class="cell">
            <div class="cell-hd">起始日期</div>
            <div class="cell-bd">
              <input
                class="input"
                placeholder="请选择起始日期"
                @click="startTimeShow = true"
                v-model="form.startDate"
                readonly
                maxlength="20"
              />
            </div>
          </div>
          <div class="cell">
            <div class="cell-hd">结束日期</div>
            <div class="cell-bd">
              <input
                class="input"
                placeholder="请选择结束日期"
                @click="endTimeShow = true"
                v-model="form.endDate"
                readonly
                maxlength="20"
              />
            </div>
          </div>
          <div class="cell">
            <div class="cell-hd"></div>
            <div class="cell-bd">
              <input
                class="input"
                placeholder="请输入食谱标题"
                v-model.trim="form.title"
                maxlength="30"
                style="text-align:left;"
              />
            </div>
          </div>
          <div class="cell">
            <div class="cell-bd">
              <textarea
                class="textarea"
                rows="6"
                v-model="form.textContent"
                placeholder="请输入食谱内容..."
              ></textarea>
            </div>
          </div>
          <div class="cell cell-select cell-select-after">
            <div class="cell-hd">
              <label for class="label">发送班级</label>
            </div>
            <div class="cell-bd">
              <select class="select" name="select" dir="rtl" v-model="selected" multiple size="1">
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
          <div class="cell">
            <div class="cell-bd">
              <ul class="uploader-files">
                <li
                  class="uploader-file"
                  v-for="(file, index) in imagesList"
                  :key="index"
                  :style="{backgroundImage: `url(${file})`}"
                >
                  <van-icon
                    name="clear"
                    size="18px"
                    class="clear"
                    @click.stop="handleDelImg(index)"
                  ></van-icon>
                </li>
              </ul>
              <div class="uploader-input_box" @click="handleChooseImage">
                <van-icon name="plus" size="40px"></van-icon>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="handleSubmit">发布</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import service from "@/api";
import classList from "@/mixins/classList";
import formatter from "@/mixins/date-formatter";
import { textReplace } from "@/utils/string";
import wxHandle from "@/mixins/wx";
export default {
  name: "recipeAdd",
  mixins: [classList, wxHandle, formatter],
  data() {
    return {
      selected: [parseInt(this.$store.state.user.info.classId)],
      startTimeShow: false,
      endTimeShow: false,
      startDate: new Date(),
      endDate: new Date(),
      form: {
        openId: this.$store.state.user.info.openId,
        title: "",
        textContent: "",
        images: [],
        startDate: "",
        endDate: "",
        senders: []
      }
    };
  },
  methods: {
    //选择开始时间
    handleConfirmStartTime(value) {
      let now = dayjs(new Date(value).getTime()).format("YYYY-MM-DD");
      this.form.startDate = now;
      this.startTimeShow = false;
    },
    //选择结束时间
    handleConfirmEndTime(value) {
      let now = dayjs(new Date(value).getTime()).format("YYYY-MM-DD");
      this.form.endDate = now;
      this.endTimeShow = false;
    },
    handleSubmit() {
      let { startDate, endDate, title, textContent, ...args } = this.form;
      if (startDate === "") {
        this.$toast("请选择起始日期");
        return;
      }
      if (endDate === "") {
        this.$toast("请选择结束日期");
        return;
      }
      if (title === "") {
        this.$toast("请输入食谱标题");
        return;
      }
      if (textContent === "" && !this.serverId.length) {
        this.$toast("请输入食谱内容或者上传图片");
        return;
      } else {
        this.form.textContent = textReplace(textContent) || "";
      }
      this.form.senders = this.selected.map(item => {
        return { classId: item };
      });
      let params = {
        openId: this.form.openId,
        imgIds: this.serverId
      };
      //如果有上传图片
      if (this.serverId.length) {
        service.imgIds(params).then(res => {
          if (res.errorCode === 0) {
            this.form.images = res.data.paths;
            //食谱发布
            service.recipeAdd(this.form).then(res => {
              if (res.errorCode === 0) {
                this.$refs.form.reset();
                this.$router.go(-1);
              } else {
                this.$toast(`${res.errorMsg}`);
              }
            });
          } else {
            this.$toast(`${res.errorMsg}`);
          }
        });
      } else {
        this.recipeAdd(this.form);
      }
    },
    async recipeAdd(params = {}) {
      let res = await service.recipeAdd(params);
      if (res.errorCode === 0) {
        this.$router.go(-1);
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
</style>
