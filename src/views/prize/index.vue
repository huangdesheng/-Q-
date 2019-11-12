<template>
  <div class="page">
    <div class="paeg-bd">
      <!-- dialog -->
      <van-dialog
        v-model="dialogVisible"
        title="添加奖励"
        show-cancel-button
        :before-close="handleSubmit"
      >
        <form ref="form" action method="post">
          <div class="cells" style="padding:15px 0 15px 0;">
            <div class="cell">
              <div class="cell-bd">
                <textarea
                  rows="5"
                  class="textarea"
                  placeholder="请输入与孩子约定奖项内容,例如奖励20分钟游戏时间..."
                  v-model="form.textContent"
                ></textarea>
              </div>
            </div>
            <div class="cell">
              <div class="cell-bd">
                <input
                  type="number"
                  pattern="[0-9]*"
                  placeholder="请输入兑换Q星数量"
                  class="input text-left"
                  v-model.trim="form.starCount"
                />
              </div>
            </div>
          </div>
        </form>
      </van-dialog>
      <div class="pichi gradient-two">
        <div class="pichi-head">
          <img :src="photo" width="50" height="50" radius="50" v-if="photo" />
          <img
            src="@/assets/child-default@2x.png"
            width="40"
            height="40"
            radius="50"
            v-else
          />
          <h3 size-18 class="ml-20">
            {{ name }}
            <small>总Q星: {{ totalStarCount }}</small>
          </h3>
        </div>
        <div class="pichi-body">
          <div class="flex a-i-c j-c-c mb-30" @click="handleMessage">
            <img src="@/assets/rate-icon@2x.png" width="30" height="30" />
            <strong class="ml-20">{{ todayStarTotal }}</strong>
            <p size-12 style="align-self: flex-end;margin-bottom:8px">
              (可兑换Q星数量)
            </p>
          </div>
          <p>手指勾勾约定好，奖励兑现要做到！</p>
        </div>
        <div class="pichi-ft">
          <a href="javascript:void(0);" @click="dialogVisible = true">
            <img
              src="@/assets/prize-icon-2@2x.png"
              width="20"
              height="20"
              alt
            />
            <span class="ml-10">添加奖项</span>
          </a>
          <router-link :to="{ path: '/prize/log' }">
            <img
              src="@/assets/prize-icon-3@2x.png"
              width="20"
              height="20"
              alt
            />
            <span class="ml-10">兑换记录</span>
          </router-link>
        </div>
      </div>
      <div class="cells-title">
        <p>选择兑换奖项</p>
      </div>
      <div class="cells mb-30">
        <!-- 缺省的奖励不可删除 -->
        <van-swipe-cell
          ref="swipeCell"
          :right-width="60"
          v-for="(item, index) in list"
          :key="index"
          :disabled="item.prizeType === 0"
          :on-close="onClose(index, item.itemId, item.prizeType)"
        >
          <van-cell-group>
            <div class="cell min-h160">
              <div class="cell-hd">
                <van-checkbox
                  v-model="item.checked"
                  checked-color="#92cd36"
                  @change="chg"
                ></van-checkbox>
              </div>
              <div class="cell-bd pl-20">
                <p class="mb-20" size-16>{{ item.textContent }}</p>
                <p size-14 style="color:#ff4d67">{{ item.starCount }}颗Q星</p>
              </div>
              <div class="cell-ft">
                <van-stepper v-model="item.value" @change="chg"></van-stepper>
              </div>
            </div>
          </van-cell-group>
          <span slot="right" style="line-height: 80px;">删除</span>
        </van-swipe-cell>
      </div>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <div class="tapeti">
          <div class="tapeti-left">
            <p class="pl-20">合计Q星: {{ total }}</p>
          </div>
          <div class="tapeti-right">
            <van-button type="info" @click="handleSave">兑换</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import service from "@/api";
import pageMixin from "@/mixins/page";
import { mapState } from "vuex";
export default {
  name: "action",
  mixins: [pageMixin],
  data() {
    return {
      query: {
        studentId: this.$store.state.user.info.studentId,
        openId: this.$store.state.user.info.openId,
        page: 1,
        pageSize: 20
      },
      query2: {
        studentId: this.$store.state.user.info.studentId,
        openId: this.$store.state.user.info.openId
      },
      form: {
        studentId: this.$store.state.user.info.studentId,
        textContent: "",
        starCount: ""
      },
      list: [],
      total: 0,
      todayStarTotal: 0 //当天可兑换Q星数
    };
  },
  computed: {
    ...mapState("user", {
      photo: state => state.info.photo,
      name: state => state.info.name,
      totalStarCount: state => state.info.totalStarCount
    })
  },
  methods: {
    handleMessage() {
      this.$toast("当天获得的Q星需第二天才能兑换");
    },
    onClose(index, itemId, prizeType) {
      return (clickPosition, instance) => {
        switch (clickPosition) {
          case "right":
            this.$dialog
              .confirm({
                title: "提示",
                message: "确认要删除该行为标准吗?"
              })
              .then(async () => {
                instance.close();
                let obj = {
                  openId: this.query.openId,
                  itemId,
                  prizeType
                };
                //行为标准删除
                let res = await service.prizeDelete(obj);
                if (res.errorCode === 0) {
                  instance.close();
                  this.list.splice(index, 1);
                }
              })
              .catch(() => {
                instance.close();
              });
            break;
        }
      };
    },
    chg() {
      let n = 0;
      this.list.forEach(element => {
        if (element.checked) {
          n += element.starCount * element.value;
        }
      });
      this.total = n;
    },
    async handleSubmit(action, done) {
      if (action === "confirm") {
        if (this.form.textContent == "") {
          this.$toast("请输入奖项说明");
          done(false);
          return;
        }
        if (this.form.starCount == "") {
          this.$toast("请输入Q星数量");
          done(false);
          return;
        }
        let res = await service.prizeAdd(this.form);
        if (res.errorCode === 0) {
          done();
          this.form.textContent = "";
          this.form.starCount = "";
          this.dialogVisible = false;
          this.prizeListQuery(this.query);
        }
      } else {
        done();
      }
    },
    handleSave() {
      if (!this.total) {
        this.$toast("请勾选你要兑换的奖项");
        return;
      }
      if (this.total > this.totalStarCount) {
        this.$toast("你的Q星数量不够兑换的奖项哦");
        return;
      }
      let itemArray = [];
      this.list.forEach(element => {
        if (element.checked) {
          itemArray.push({
            itemId: element.itemId,
            times: element.value,
            prizeType: element.prizeType
          });
        }
      });
      if (itemArray.length) {
        let obj = {
          studentId: this.query.studentId,
          openId: this.query.openId,
          itemArray
        };
        this.$dialog
          .confirm({
            title: "提示",
            message: `您确认用${this.total}Q星兑换奖励吗?`
          })
          .then(() => {
            this.prizeExchange(obj);
          });
      }
    },
    //奖励兑换-可兑换Q星数量
    async queryTotalCountStar(params = {}) {
      let res = await service.queryTotalCountStar(params);
      if (res.errorCode === 0) {
        console.log(res);
        this.todayStarTotal = res.data.todayTotal;
      }
    },
    //奖励兑换
    async prizeExchange(params = {}) {
      let res = await service.prizeExchange(params);
      if (res.errorCode === 0) {
        let totalStarCount = res.data;
        let _cookie = Cookies.getJSON("info");
        let obj = Object.assign({}, _cookie, { totalStarCount });
        this.$store.dispatch("user/setInfo", obj).then(data => {
          if (data.success === "ok") {
          }
        });
        this.$toast("奖励兑换成功");
        this.prizeListQuery(this.query);
      }
    },
    //奖励列表查询
    async prizeListQuery(params = {}) {
      let res = await service.prizeListQuery(params);
      if (res.errorCode === 0) {
        if (res.data) {
          // this.todayStarTotal = res.data.data[0].todayTotal;
          this.list = res.data.map(element => {
            return {
              ...element,
              checked: false,
              value: 1 //由于后端没有该字段返回，默认设置一个
            };
          });
        }
      }
    }
  },
  mounted() {
    this.prizeListQuery(this.query);
    this.queryTotalCountStar(this.query2);
  }
};
</script>
<style lang="less" scoped>
.tapeti {
  display: flex;
  align-items: center;
  background-color: #fff;
  > div {
    flex: 1;
    button {
      width: 100%;
      border-radius: 0;
    }
  }
}
.cells-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #2e2e2e;
  height: 40px;
  padding: 0 20px;
}
.pichi {
  position: relative;
  color: #fff;
  margin: 20px;
  border-radius: 20px;
  &-head {
    display: flex;
    align-items: center;
    padding: 30px 0 0 30px;
  }
  &-body {
    text-align: center;
    padding-bottom: 30px;
    div {
    }
    strong {
      font-size: 72px;
    }
  }
  &-ft {
    height: 100px;
    display: flex;
    align-items: center;
    color: #2e2e2e;
    border-radius: 0 0 20px 20px;
    background-color: #fff;
    > a {
      display: flex;
      width: 50%;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
