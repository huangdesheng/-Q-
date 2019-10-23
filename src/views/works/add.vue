<template>
  <div class="page">
    <div class="page-bd">
      <form id="form" action ref="form" method="post">
        <div class="cells">
          <div class="cell cell-select cell-select-after">
            <div class="cell-hd">
              <label for class="label">作品类别</label>
            </div>
            <div class="cell-bd">
              <select class="select" name="select" dir="rtl" v-model="form.type">
                <optgroup disabled hidden></optgroup>
                <option
                  :value="option.id"
                  v-for="(option,index) in worksTypeList"
                  :key="index"
                >{{ option.name }}</option>
              </select>
            </div>
          </div>
          <div class="cell">
            <div class="cell-hd">
              <label for class="label">作品标题</label>
            </div>
            <div class="cell-bd" style="padding-left:0">
              <input class="input" placeholder="请输入作品标题" v-model.trim="form.title" maxlength="30" />
            </div>
          </div>
          <div class="cell">
            <div class="cell-bd" style="padding-left:0">
              <ul class="uploader-files">
                <li
                  class="uploader-file"
                  v-for="(item, index) in imagesList"
                  :key="index"
                  :style="{backgroundImage: `url(${item.content})`}"
                >
                  <van-icon
                    name="clear"
                    size="18px"
                    class="clear"
                    @click.stop="handleDelImg(index)"
                  ></van-icon>
                </li>
              </ul>
              <div class="uploader-input_box">
                <van-uploader :after-read="handleRead" accept="image/*" multiple>
                  <van-icon name="plus" size="30px"></van-icon>
                </van-uploader>
              </div>
            </div>
          </div>
          <p class="works-desc">
            1.在此可上传孩子创作的作品（美术、书法、作业等），作品被平台选中，将有机会在全市科普电子屏上播放。
            <br />2.每次最多可上传10幅作品。
            <br />3.温馨提示：
            <br />(1)严禁上传违法作品
            <br />(2)严禁上传其他人作品，如作品侵权，由上传者负责。
            <br />(3)上传格式为：jpg/png
          </p>
        </div>
      </form>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="handleSubmit">确定</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { ImagePreview } from "vant";
import { mapState } from "vuex";
import eventBus from "@/utils/eventBus";
export default {
  name: "worksAdd",
  data() {
    return {
      form: {
        type: 1,
        title: "",
        studentId: this.$store.state.user.info.studentId,
        images: []
      },
      imagesList: [],
      worksTypeList: [
        {
          id: 1,
          name: "学生作品"
        },
        {
          id: 2,
          name: "班级风采"
        },
        {
          id: 3,
          name: "精选优品"
        }
      ]
    };
  },
  computed: {
    ...mapState("user", {
      openId: state => state.info.openId
    })
  },
  methods: {
    handleRead(file, detail) {
      if (Array.isArray(file)) {
        file.forEach(elem => {
          this.imagesList.push(elem);
        });
      } else {
        //如果用户是单选的图片
        this.imagesList.push(file);
      }
    },
    handleDelImg(index) {
      this.imagesList.splice(index, 1);
    },
    async handleSubmit() {
      let { title } = this.form;
      if (title == "") {
        this.$toast("请输入作品标题");
        return;
      }
      if (!this.imagesList.length) {
        this.$toast("请上传作品图片");
        return;
      }
      //配置上传头部信息
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        showLoading: true
      };
      let formData = new FormData();
      this.imagesList.forEach(elem => {
        formData.append("files", elem.file);
      });
      //开始上传文件
      let res = await service.uploadFile(formData, config);
      if (res.errorCode === 0) {
        this.form.images = res.data;
        //进行作品上传
        service.uploadWorks(this.form).then(res => {
          if (res.errorCode === 0) {
            this.$router.go(-1);
          } else {
            this.$toast(`${res.errorMsg}`);
          }
        });
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.works-desc {
  line-height: 1.6;
  color: #555;
  font-size: 24px;
  padding: 20px 30px;
}
</style>
