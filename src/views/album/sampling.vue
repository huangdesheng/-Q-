<template>
  <div class="page">
    <div class="page-bd">
      <div class="content">
        <div class="top">
          <h2>亲爱的家长：</h2>
          <p class="indent">
            为了
            <span class="on">更精确的让您查看孩子在班级的照片</span>，要记得 给孩子添加人脸采样哟！
          </p>
        </div>
        <div class="common mainPic">
          <h3>合格照片示例</h3>
          <div class="flex j-c-c">
            <img src="@/assets/1.png" alt="图片加载中" />
          </div>
        </div>
        <div class="common">
          <h3>采样时请注意以下几点</h3>
          <div class="con-c">
            <p>
              1.保证每张照片都是小孩
              <span class="on">独立</span>拍照。
            </p>
            <p>
              2.保证小孩五官有足够的
              <span class="on">光照。</span>
            </p>
            <p>
              3.保证小孩五官正
              <span class="on">向面对镜头。</span>
            </p>
            <p>
              4.保证
              <span class="on">镜头对焦</span>到小孩五官上。
            </p>
            <p>
              5.保证拍照
              <span class="on">背景干净</span>，至少无其他人物等干扰。
            </p>
            <p>
              6.保证小孩没有
              <span class="on">太大</span>的动作。
            </p>
          </div>
        </div>
        <div class="common adatPic">
          <h3>不合格照片示例</h3>
          <div>
            <ul class="flex j-c-s-b">
              <li>
                <img src="@/assets/2.png" alt="图片加载中" />
                <div class="flex a-i-c">
                  <van-icon name="cross" />
                  <span>头像不清晰</span>
                </div>
              </li>
              <li>
                <img src="@/assets/3.png" alt="图片加载中" />
                <div class="flex a-i-c">
                  <van-icon name="cross" />
                  <span>光线太暗/亮</span>
                </div>
              </li>
            </ul>
            <ul class="flex j-c-s-b">
              <li>
                <img src="@/assets/4.png" alt="图片加载中" />
                <div class="flex a-i-c">
                  <van-icon name="cross" />
                  <span>左右侧脸</span>
                </div>
              </li>
              <li>
                <img src="@/assets/5.png" alt="图片加载中" />
                <div class="flex a-i-c">
                  <van-icon name="cross" />
                  <span>非孩子照片</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="page-ft">
      <template>
        <div class="fixed-bottom" style="z-index: 100;">
          <van-button type="info" size="large" class="no-radius" @click="addsamplPic">立即采样</van-button>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      localData: "",
      serverId: ""
    };
  },

  computed: {
    ...mapState("user", {
      studentId: state => state.info.studentId,
      classId: state => state.info.classId
    })
  },
  methods: {
    addsamplPic() {
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
            let data = {
              mediaId: serverId,
              studentId: this.studentId,
              classId: this.classId
            };
            this.face(data);
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
    },

    async face(data) {
      let res = await service.face(data);
      console.log(res);
      if (res.errorCode === 0) {
        this.$router.push({
          path: "/album/addSampling"
        });
      } else {
        this.$toast(res.errorMsg);
        // this.$router.push({
        //   path: "/album/addSampling"
        // });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  padding: 0 30px;
  background: #fff;
  .top {
    padding: 30px 0 40px;
    p {
      padding-top: 20px;
      line-height: 50px;
    }
  }
}

.indent {
  text-indent: 2em;
}

.on {
  color: #84ce09;
}
p {
  font-size: 30px;
  color: #252525;
}

.mainPic {
  div {
    img {
      width: 400px;
      height: 400px;
      margin: 60px 0px;
    }
  }
}

.con-c {
  padding: 30px 0 50px;
  p {
    margin-top: 10px;
  }
}

.adatPic {
  > div {
    padding: 30px 30px 40px;
    ul {
      margin-top: 20px;
      li {
        width: 100%;
        height: 100%;
        position: relative;
        left: 0;
        top: 0;
        &:nth-of-type(2) {
          margin-left: 20px;
        }
        > div {
          position: absolute;
          bottom: 20px;
          left: 0;
          padding: 0 30px;
          .van-icon {
            font-size: 40px;
            color: red;
            margin-right: 10px;
          }
          span {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
