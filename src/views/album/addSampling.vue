<template>
  <div class="page">
    <div class="page-bd">
      <div class="empty">
        <div>
          <img :src="localData" alt @click="updatePic" />
          <p>点击照片可重新采样</p>
          <p style="margin-top:0">关注班级相册查看自动整理的孩子照片</p>
          <van-button type="info" size="large" class="no-radius addPic" @click="saveSampling">保存</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      localData: this.$route.query.localData,
      serverId: ""
    };
  },
  mounted() {
    this.checkFace();
  },
  computed: {
    ...mapState("user", {
      studentId: state => state.info.studentId,
      classId: state => state.info.classId
    })
  },
  methods: {
    saveSampling() {
      this.updateFace();
    },

    async checkFace() {
      let res = await service.checkFace(this.studentId);
      if (res.errorCode === 0) {
        this.localData = res.data.img;
      } else {
        this.$toast(res.errorMsg);
      }
      console.log(res);
    },

    async updateFace() {
      let data = {
        classId: this.classId,
        mediaId: this.serverId,
        studentId: this.studentId
      };

      if (this.serverId === "") {
        this.$router.push({
          path: "/album/view",
          query: { classId: this.classId }
        });
      } else {
        let res = await service.updateFace(data);
        if (res.errorCode === 0) {
          this.$toast("更新人脸成功");
          this.$router.push({
            path: "/album/view",
            query: { classId: this.classId }
          });
        } else {
          this.$toast(res.errorMsg);
        }
      }
    },

    updatePic() {
      wx.chooseImage({
        count: 1, //选择9张
        sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          console.log(res);
          let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          // 判断 ios
          if (window.__wxjs_is_wkwebview) {
            this.handleLocalImgData(localIds); //ios图片读取
          } else {
            console.log(1);
            localIds.forEach(element => {
              this.imagesList.push(element);
            });
          }
          this.handleUploadImage(localIds); //上传图片
        },
        fail: res => {
          console.log("00000");
          alert("失败");
        }
      });
    },
    handleUploadImage(localIds) {
      let i = 0;
      let length = localIds.length;
      let upload = () => {
        let loacId = localIds[i];
        if (window.__wxjs_is_wkwebview) {
          if (loacId.indexOf("wxlocalresource") != -1) {
            loacId = loacId.replace("wxlocalresource", "wxLocalResource");
          }
        }
        wx.uploadImage({
          localId: loacId, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: res => {
            let serverId = res.serverId; // 返回图片的服务器端ID
            this.serverId = serverId;
          },
          fail: res => {
            alert("失败");
          }
        });
      };
      upload();
    },
    //ios 图片读取
    handleLocalImgData(localIds) {
      let i = 0;
      let length = localIds.length;
      let upload = () => {
        wx.getLocalImgData({
          localId: localIds[i], // 图片的localID
          success: res => {
            console.log(res);
            let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
            localData = localData.replace("jgp", "jpeg");
            this.localData = localData;
          }
        });
      };
      upload();
    }
  }
};
</script>

<style lang="less" scoped>
.empty {
  width: 100vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 300px;
    height: 300px;
    border-radius: 100%;
  }
  p {
    color: #999999;
    font-size: 32px;
    padding-top: 15px;
    color: #999999;
  }
}
.addPic {
  width: 300px;
  height: 90px;
  line-height: 90px;
  margin-top: 120px;
  border-radius: 100px !important;
}
</style>