<template>
  <div class="page">
    <div class="page-hd">
      <div class="share-image flex a-i-c j-c-s-b min-h100">
        <p>
          {{ name }}已经坚持习惯培养 <time style="color:#f44;">{{ days }}</time
          >天
        </p>
        <div
          class="text-center"
          style="color:#ff9933"
          @click="shareHistoryImage(1)"
        >
          <van-icon name="share" size="16px"></van-icon>
          <div size-12>晒一晒</div>
        </div>
      </div>
    </div>
    <div class="page-bd">
      <!-- dialog 图片生成分享 -->
      <van-dialog
        v-model="dialogImage"
        close-on-click-overlay
        :show-confirm-button="false"
      >
        <div class="cells">
          <img :src="shareImgUrl" />
          <p class="text-center pt-30 pb-30 share-desctext">
            长按图片保存或发给朋友
          </p>
        </div>
      </van-dialog>
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item
          :name="item.id"
          v-for="(item, indexs) in list"
          :key="indexs"
        >
          <div class="flex" size-16 slot="title" @click="acquireStarNum(item)">
            <time>{{ item.day }}</time>
            <div class="ml-20 mr-20 flex">
              <span>获得</span>
              <span style="color:#f44;">{{ item.starCount }}</span
              >颗Q星
            </div>
            <span v-show="item.comment === 0" style="color:#f44">补评价</span>
          </div>
          <div class="action-cells">
            <div
              class="action-cell flex a-i-c j-c-s-b"
              v-for="(action, index) in item.actions"
              :key="index"
            >
              <div class="action-cell-bd flex a-i-c j-c-s-b">
                <div class="action-cell-label text-ellipsis">
                  <span>{{ action.title }}</span>
                </div>
                <div class="action-cell-rate">
                  <van-rate
                    v-model="action.starCount"
                    :count="5"
                    :size="22"
                    color="#febf56"
                    void-color="#e5eee0"
                    disabled-color="#febf56"
                    :readonly="rateReadonly"
                    :disabled="action.comment === 1"
                    @change="handleChangeRate(action, indexs)"
                  ></van-rate>
                </div>
                <div class="action-cell-edit" @click="handleNote(action)">
                  <van-icon name="eye-o" size="18px"></van-icon>
                </div>
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import { mapState } from "vuex";
export default {
  name: "actionHistory",
  data() {
    return {
      dialogImage: false,
      shareImgUrl: "", //生成的分享图片地址
      dialogNote: false,
      rateReadonly: false,
      query: {
        openId: this.$store.state.user.info.openId,
        studentId: this.$store.state.user.info.studentId,
        page: 1,
        pageSize: 20
      },
      query2: {
        studentId: this.$store.state.user.info.studentId
      },
      activeNames: [],
      list: [],
      dayNum: "", //坚持天数
      starNumList: [] //每天总星数
    };
  },
  computed: {
    ...mapState("user", {
      name: state => state.info.name
    }),
    days() {
      return this.dayNum;
    },
    starNum() {
      let n = 0;
      this.starNumList.forEach(item => (n += item.starCount));
      return n;
    }
  },
  methods: {
    //获取星星总数
    acquireStarNum(item) {
      console.log(item);
      this.starNumList = item.actions;
    },
    //备注打星
    handleNote(params) {
      let { remarks } = params;
      if (remarks != null) {
        this.$dialog
          .alert({
            title: "查看备注",
            message: remarks
          })
          .then(() => {});
      } else {
        this.$toast(`暂无备注信息`);
      }
    },
    //rate事件
    handleChangeRate(params = {}, index) {
      // console.log(this.starNum);
      // console.log(index);
      // console.log(params);
      this.list[index].starCount = this.starNum;
      if (params) {
        let { comment, title, remarks, ...args } = params;
        let obj = Object.assign({}, args, {
          openId: this.query.openId
        });
        this.actionStrike(obj);
      }
    },
    //历史打星查询
    async historyStrikeQuery(params = {}) {
      let res = await service.historyStrikeQuery(params);
      if (res.errorCode === 0) {
        this.list = res.data.data || [];
      }
    },
    //已坚持习惯天数
    async queryUserDay(params = {}) {
      let res = await service.queryUserDay(params);
      if (res.errorCode === 0) {
        this.dayNum = res.data;
      }
    },
    //行为打星
    async actionStrike(params = {}) {
      this.rateReadonly = true;
      let res = await service.actionStrike(params);
      if (res.errorCode === 0) {
        this.rateReadonly = false;
        let { totalStarCount } = res.data;
        // this.historyStrikeQuery(this.query);

        this.queryUserDay(this.query2);
        //更新星星数量
        let _cookie = Cookies.getJSON("info");
        let obj = Object.assign({}, _cookie, { totalStarCount });
        this.$store.dispatch("user/setInfo", obj).then(data => {
          if (data.success === "ok") {
          }
        });
      }
    },
    //生成历史图片分享
    async shareHistoryImage(type) {
      let params = {
        type,
        days: this.days,
        studentId: this.query.studentId
      };
      let res = await service.historyImage(params);
      if (res.errorCode === 0) {
        this.shareImgUrl = res.data;
        this.dialogImage = true;
      }
    }
  },
  mounted() {
    this.historyStrikeQuery(this.query);
    this.queryUserDay(this.query2);
  }
};
</script>
<style lang="less" scoped>
.action-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 20px 0;
  i {
    vertical-align: top;
  }
  &-bd {
    flex: 1;
  }
  &-rate {
    flex: 1;
  }
  &-label {
    width: 280px;
    overflow: hidden;
  }
  &-edit {
    color: #999;
  }
}

.van-collapse-item {
  margin-bottom: 10px;
}

.share-image {
  padding: 0 30px;
}
.share-desctext {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
