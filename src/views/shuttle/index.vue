<template>
  <div class="page">
    <div class="page-hd">
      <audio
        id="audios"
        ref="audioRef"
        :src="playUrl"
        @abort="handleAbort"
        @error="handleError"
        @play="handlePlay"
        @ended="handleEnded"
        @playing="handlePlaying"
        @pause="handlePause"
      ></audio>
      <!-- @error="handleError" -->
      <div class="shuttle-sp-area flex a-i-c j-c-s-b" size-17>
        <a href="javascript:void(0);" id="showDatePicker" @click="popupShow = true">
          <span>{{ className }}</span>
          <van-icon name="arrow-down" size="16px"></van-icon>
        </a>
        <div class="audio-box" @click="handlePlayAudio">
          <template v-if="isIOS">
            <van-icon name="play-circle-o" size="40px" v-if="playBoolean"></van-icon>
            <van-icon name="pause-circle-o" size="40px" v-else></van-icon>
          </template>
        </div>
      </div>
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
      <template>
        <div class="table">
          <div class="table-head">
            <div class="tr">
              <div class="th">
                <i style="background-color:#92cd36;"></i>
                <span size-14>表示已打卡</span>
              </div>
              <div class="th">
                <i style="background-color:#febf56;"></i>
                <span size-14>表示未打卡</span>
              </div>
            </div>
          </div>
          <div class="table-body">
            <div class="tr">
              <div
                class="td"
                :class="[item.clockFlag ? 'td-success': 'td-default']"
                v-for="(item, index) in classClockData"
                :key="index"
              >
                <div>
                  <img :src="item.photo" v-if="item.photo" />
                  <img src="@/assets/child-default@2x.png" v-else />
                  <div class>
                    <span>{{ item.studentName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="cells" style="margin-top:15px;">
          <div class="cell" v-for="(item, index) in shuttleData" :key="index">
            <div class="cell-hd">
              <label for class="label">{{ item.studentName }}</label>
            </div>
            <div class="cell-bd">
              <p class="cell-p">{{ item.postTime }}</p>
            </div>
            <div class="cell-ft">
              <!-- <span>{{ item.url ? "有": "无" }}</span> -->
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import service from "@/api";
import classList from "@/mixins/classList";
export default {
  name: "shuttle",
  mixins: [classList],
  data() {
    return {
      popupShow: false,
      className: decodeURI(this.$store.state.user.info.className),
      query: {
        openId: this.$store.state.user.info.openId,
        classId: this.$store.state.user.info.classId,
        date: dayjs().format("YYYY-MM-DD") //获取当前年月日
      },
      shuttleData: [],
      classClockData: [],
      isIOS: false,
      playBoolean: true,
      playIndex: 0, //播放起始位置为0
      playUrl: "", //播放url
      playList: [], //音频列表
      playNumber: 1, //默认播放次数为1
      playMax: 2, //每条语音最多播放次数
      playTimer: null //播放定时器,
    };
  },
  watch: {
    //audio的url, 如果有变化则重新播放
    playUrl(newPlaying, oldPlaying) {
      const audio = this.$refs.audioRef;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    }
  },
  methods: {
    handleClassConfirm(value, index) {
      this.className = value.className;
      this.query.classId = value.classId;
      this.classClockQuery();
      this.realShuttle(this.query);
    },
    handlePlay(e) {},
    //播放开始事件
    handlePlaying(e) {},
    //播放暂停事件
    handlePause(e) {
      //console.log("播放暂停");
    },
    handleAbort() {
      console.log("发生中止事件时运行脚本");
    },
    //播放结束事件
    handleEnded(e) {
      console.log("播放结束事件");
      this.onPlay();
    },
    handleOnemptied(e) {
      console.log("当媒介资源元素突然为空时（网络错误、加载错误等）运行脚本");
    },
    //当在元素加载期间发生错误时运行脚本
    handleError(e) {
      console.log("当这条语音发生播放错误时");
    },
    onPlay() {
      console.log("onPlay");
      const audio = this.$refs.audioRef;
      if (this.playNumber === this.playMax) {
        console.log("单条语音播放次数达到");
        //单条语音播放次数达到
        setTimeout(() => {
          this.playNumber = 1;
          this.playIndex++;
          if (this.playIndex < this.playList.length) {
            this.playUrl = this.playList[this.playIndex].url;
            //这时判断，如果读取的url是一样的值
            if (this.playUrl === audio.src) {
              audio.play();
            }
          } else {
            console.log("全部语音已经播放完");
            this.playIndex = 0;
            this.playUrl = "";
            this.playBoolean = false;
            //重新请求
            this.classClockQuery();
            this.realShuttle(this.query);
          }
        }, 1000);
      } else {
        console.log("还没有达到播放次数");
        this.playNumber++;
        this.$refs.audioRef.play();
      }
    },
    //播放按钮
    handlePlayAudio() {
      let audio = document.getElementById("audios");
      if (this.playUrl) {
        if (audio.paused) {
          audio.play();
          this.playBoolean = false;
        } else {
          audio.pause();
          this.playBoolean = true;
        }
      } else {
        this.$toast("暂无学生打卡");
      }
    },
    handleOnload() {
      //如果是ios设备，则显示播放按钮
      return window.__wxjs_is_wkwebview === true
        ? (this.isIOS = true)
        : (this.isIOS = false);
    },
    //实时接送接口 返回语音播报
    async realShuttle(params = {}) {
      let res = await service.realShuttle(params);
      if (res.errorCode === 0) {
        this.playUrl = "";
        this.playIndex = 0;
        this.playList = [];
        if (res.data.length) {
          //清除定时器
          clearInterval(this.playTimer);
          this.shuttleData = res.data;
          //保存音频url
          for (let i = 0; i < this.shuttleData.length; i++) {
            if (this.shuttleData[i].url != "") {
              let url = this.shuttleData[i].url;
              this.playList.push({ url });
            }
          }
          if (this.playList.length) {
            this.playUrl = this.playList[this.playIndex].url;
          } else {
            this.playTimer = setInterval(() => {
              console.log("8秒后重新请求");
              this.realShuttle(this.query);
            }, 8 * 1000);
          }
        } else {
          //没有到打卡时间
          this.shuttleData = [];
          clearInterval(this.playTimer);
          //启动定时器，8秒后重新请求
          this.playTimer = setInterval(() => {
            console.log("8秒后重新请求");
            this.realShuttle(this.query);
          }, 8 * 1000);
        }
      }
    },
    //查询班级当天打卡记录
    async classClockQuery() {
      let { openId, classId } = this.query;
      let res = await service.classClockQuery({ openId, classId });
      if (res.errorCode === 0) {
        this.popupShow = false;
        this.classClockData = res.data;
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  mounted() {
    this.handleOnload();
    this.classClockQuery();
    this.realShuttle(this.query);
  },
  destroyed() {
    clearInterval(this.playTimer);
    console.log("destroyed");
  }
};
</script>
<style lang="less" scoped>
.shuttle-sp-area {
  color: #9cd248;
  height: 120px;
  padding: 0 30px;
}
.table {
  background-color: #fff;
  .tr {
    display: flex;
    flex-wrap: wrap;
  }
}
.table-head {
  padding: 24px 0;
  .th {
    flex: 1;
    text-align: center;
    font-size: 0;
    i {
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-right: 10px;
      vertical-align: top;
    }
  }
}
.table-body {
  .td {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25%;
    height: 200px;
    position: relative;
    text-align: center;
    color: #fff;
    background-color: #fff;
    &::before {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      bottom: 0;
      border-left: 1px solid #e5e5e5;
      color: #e5e5e5;
      transform-origin: 0 0;
      transform: scaleX(0.5);
    }
    &::after {
      content: " ";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #e5e5e5;
      color: #e5e5e5;
      transform-origin: 0 0;
      transform: scaleY(0.5);
    }
    &-success {
      background-color: #92cd36;
    }
    &-default {
      background-color: #febf56;
    }
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    span {
      display: inline-block;
      margin-top: 20px;
    }
  }
}
</style>
