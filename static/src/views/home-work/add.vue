<template>
  <div class="page">
    <div class="page-bd">
      <form action ref="form" method="post">
        <div class="cells">
          <div class="cell">
            <div class="cell-hd"></div>
            <div class="cell-bd">
              <input
                class="input"
                placeholder="请输入作业标题"
                v-model.trim="form.title"
                maxlength="20"
                style="text-align:left;"
              />
            </div>
          </div>
          <div class="cell">
            <div class="cell-bd">
              <textarea
                class="textarea"
                rows="6"
                placeholder="请输入作业内容..."
                v-model="form.textContent"
              ></textarea>
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
                <van-icon name="plus" size="30px"></van-icon>
              </div>
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
          <div class="cell cell-switch">
            <div class="cell-bd">
              <label for class="label">是否需要确定</label>
            </div>
            <div class="cell-ft">
              <van-switch v-model="needSwitch" size="28px" active-color="#92cd36"></van-switch>
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
import service from "@/api";
import { textReplace } from "@/utils/string";
import classList from "@/mixins/classList";
import wxHandle from "@/mixins/wx";
export default {
  name: "homeWorkAdd",
  mixins: [wxHandle, classList],
  data() {
    return {
      selected: [parseInt(this.$store.state.user.info.classId)],
      needSwitch: false,
      form: {
        openId: this.$store.state.user.info.openId,
        title: "",
        textContent: "",
        images: [],
        needConfirm: 0, //0-无需确认 1-需要确认
        senders: []
      }
    };
  },
  methods: {
    handleSubmit() {
      let { title, textContent } = this.form;
      if (title == "") {
        this.$toast("请输入作业标题");
        return;
      }
      if (textContent == "" && !this.serverId.length) {
        this.$toast("请输入作业内容或者上传图片");
        return;
      } else {
        this.form.textContent = textReplace(textContent) || "";
      }
      if (this.needSwitch) {
        this.form.needConfirm = 1;
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
            //发布亲子作业
            service.homeworkAdd(this.form).then(res => {
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
        this.homeworkAdd(this.form);
      }
    },
    //作业发布
    async homeworkAdd(params = {}) {
      let res = await service.homeworkAdd(params);
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
