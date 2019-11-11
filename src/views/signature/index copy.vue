
<template>
  <div class="sign">
    <div class="header">
      <i class="el-icon-arrow-left backImg" @click="goBack"></i>
      <!-- <span class="title">个人签名</span> -->
    </div>
    <section class="signature">
      <div class="signatureBox">
        <div class="canvasBox" ref="canvasHW">
          <canvas
            ref="canvasF"
            class="canvasStyle"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
            @mousedown="mouseDown"
            @mousemove="mouseMove"
            @mouseup="mouseUp"
          ></canvas>
        </div>
      </div>
    </section>
    <div class="btnBox">
      <div @click="overwrite" class="btn1">重置</div>
      <div @click="commit" class="btn1">确定</div>
    </div>
    <div
      class="imglist-box"
      :style="imgUrlList.length > 0 ? 'border: 1px solid #d9d9d9;' : ''"
    >
      <img
        v-for="(i, index) in imgUrlList"
        :key="index"
        class="imgCanvas"
        :src="i"
      />
      <!-- <img
        v-show="imgUrlList.length > 0"
        src="@/assets/action-icon-1@2x.png"
        class="resign"
        @click="deleteAll"
      /> -->
      <span v-show="imgUrlList.length > 0" class="resign" @click="deleteAll"
        >重签</span
      >
    </div>
    <div class="tijiao-box">
      <button @click="commitAll" class="tijiao">提 交</button>
    </div>
  </div>
</template>
<script>
import Bus from "@/utils/Bus";
import service from "@/api";
export default {
  name: "personsign",
  data() {
    return {
      params:{
        openId:this.$route.query.openId,
        noticeId:this.$route.query.noticeId,
        studentId:this.$route.query.studentId,
        file: "", //生成的图片
      },
      stageInfo: "",
      imgUrl: "",
      imgUrlList: [],
      client: {},
      points: [],
      canvasTxt: null,
      startX: 0,
      startY: 0,
      moveY: 0,
      moveX: 0,
      endY: 0,
      endX: 0,
      w: null,
      h: null,
      isDown: false,
      isViewAutograph: this.$route.query.isViews > 0,
      contractSuccess: this.$route.query.contractSuccess
    };
  },
  mounted() {
    let canvas = this.$refs.canvasF;
    canvas.height = this.$refs.canvasHW.offsetHeight - 0;
    canvas.width = this.$refs.canvasHW.offsetWidth - 0;
    this.canvasTxt = canvas.getContext("2d");
    this.canvasTxt.lineWidth = 4;
    this.stageInfo = canvas.getBoundingClientRect();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
      // session.clear()
    },
    //mobile
    touchStart(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clienX,
          y: ev.targetTouches[0].clientY
        };
        this.startX = obj.x;
        this.startY = obj.y;
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();
        this.canvasTxt.closePath();
        this.points.push(obj);
      }
    },
    touchMove(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX - this.stageInfo.left,
          y: ev.targetTouches[0].clientY - this.stageInfo.top
        };
        this.moveY = obj.y;
        this.moveX = obj.x;
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();
        this.canvasTxt.closePath();
        this.startY = obj.y;
        this.startX = obj.x;
        this.points.push(obj);
      }
    },
    touchEnd(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX - this.stageInfo.left,
          y: ev.targetTouches[0].clientY - this.stageInfo.top
        };
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();
        this.canvasTxt.closePath();
        this.points.push(obj);
      }
    },
    //pc
    mouseDown(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        };
        this.startX = obj.x;
        this.startY = obj.y;
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();

        // this.canvasTxt.strokeRect(20,20,80,100);
        this.canvasTxt.closePath();
        this.points.push(obj);
        this.isDown = true;
      }
    },
    mouseMove(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (this.isDown) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        };
        this.moveY = obj.y;
        this.moveX = obj.x;
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();
        this.canvasTxt.closePath();
        this.startY = obj.y;
        this.startX = obj.x;
        this.points.push(obj);
      }
    },
    mouseUp(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        };
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();
        this.canvasTxt.closePath();
        this.points.push(obj);
        this.points.push({ x: -1, y: -1 });
        this.isDown = false;
      }
    },
    //重写
    overwrite() {
      this.canvasTxt.clearRect(
        0,
        0,
        this.$refs.canvasF.width,
        this.$refs.canvasF.height
      );
      this.points = [];
    },
    //确定签名
    commit() {
      this.imgUrl = this.$refs.canvasF.toDataURL();
      this.imgUrlList.push(this.imgUrl);
      if (this.imgUrlList.length > 0) {
        this.canvasTxt.clearRect(
          0,
          0,
          this.$refs.canvasF.width,
          this.$refs.canvasF.height
        );
        this.points = [];
      }
    },
    deleteAll() {
      this.imgUrlList = [];
    },
    // 提交签名给前一页
    commitAll() {
      // 用canvas合并多张图片的base64为一张图的base64
      var canvas = document.createElement("canvas");
      canvas.width = 75 * this.imgUrlList.length;
      canvas.height = 100;
      var context = canvas.getContext("2d");

      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#fff";
      context.fill();

      var myImage = new Image();
      myImage.crossOrigin = "Anonymous";
      // 当签名列表有值时
      if (this.imgUrlList.length > 0) {
        for (let i = 0; i < this.imgUrlList.length; i++) {
          myImage.src = this.imgUrlList[i];
          // 多张图片绘制成一张图片
          context.drawImage(myImage, 50 * i, 0, 75, 75); //context.drawImage(img,x,y,width,height);
          // context.font = "60px Courier New";
          // context.fillText("我是文字",350,450);
        }
        this.params.file = canvas.toDataURL("image/jpg"); //"image/jpg" 这里注意一下
        console.log(this.params.file)
        this.saveSignature()
        // this.$router.go(-1); //要在bus之前写不然值传不回去
        setTimeout(() => {
          Bus.$emit("signImage", this.params.file); //签名base64传给前一页
        }, 300);
      }
    },
    //上传
    async saveSignature() {
      let res = await service.saveSignature(this.params)
        if (res.errorCode === 0) {
           this.$router.go(-1)
        }else{
          this.$toast(`${res.errorMsg}`)
        }
    }
  },
  beforeDestroy() {
    // 销毁bus
    Bus.$off();
  }
};
</script>
<style scoped lang="less">
// 签名样式很重要，会影响触点位置
.sign {
  width: 100%;
  min-height: 100vh;
  position: relative;
  .header {
    margin-bottom: 20px;
  }
  .tijiao-box {
    width: 100%;
    text-align: center;
  }
  .tijiao {
    width: 90%;
    height: 84px;
    color: #fff;
    border-radius: 2px;
    background: #fa4b31;
    box-shadow: 0 0 0px 1px #fa4b31;
    font-size: 30px;
  }
}
.signature {
  width: 100%;
  height: 50vh;
}
.imglist-box {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 20px;
  position: relative;
}
.imgCanvas {
  width: 150px;
  height: 150px;
}
.resign {
  width: 10%;
  position: absolute;
  top: 2px;
  right: 0;
}
.signatureBox {
  width: 90%;
  margin: 0 auto;
  height: calc(100% - 50px);
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.canvasBox {
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  flex: 1;
}
canvas {
  // background-image: url("../../assets/action-icon-1@2x.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-origin: border-box;
  background-size: 100% 100%;
  background-color: #fff;
}
.btnBox {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .btn1 {
    width: 46%;
    height: 84px;
    line-height: 84px;
    color: #fa4b31;
    border-radius: 2px;
    background: #fff;
    border: 1px solid #fa4b31;
    box-shadow: 0 0 0px 1px #fa4b31;
    font-size: 30px;
    text-align: center;
  }
}
.btnBox button:first-of-type {
  background: transparent;
  border-radius: 4px;
  height: 40px;
  width: 80px;
  font-size: 14px;
}
.btnBox button:last-of-type {
  background: #71b900;
  color: #fff;
  border-radius: 4px;
  height: 40px;
  width: 80px;
  font-size: 14px;
}
</style>