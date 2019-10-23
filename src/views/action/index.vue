<template>
  <div class="page">
    <div class="page-bd">
      <div class="wrap">
        <div class="mod">
          <div class="guanaco">
            <h4>我的行为培养</h4>
            <a href="javascript:void(0);" @click="isShow = !isShow">{{ isShow ? '编辑':'完成' }}</a>
          </div>
          <div class="narwhal">
            <div
              class="monodon"
              v-for="(item, index) in myActions"
              :key="index"
              @click="handleEdit(item)"
            >
              <div class="monoceros">
                <span>{{ item.title }}</span>
                <!-- 系统默认行为不可删除 -->
                <van-icon
                  name="clear"
                  size="18px"
                  class="clear"
                  @click.stop="handleActionDelete(index, item)"
                  v-show="!isShow"
                ></van-icon>
              </div>
            </div>
            <!-- -->
            <router-link :to="{path: '/action/add'}" tag="div" class="monodon">
              <div class="monoceros" style="background-color:#92cd36;color:#fff;">
                <van-icon name="plus"></van-icon>
                <span class="ml-10">自定义</span>
              </div>
            </router-link>
          </div>
        </div>
        <div class="mod">
          <div class="guanaco">
            <h4>小Q推荐行为</h4>
          </div>
          <div class="narwhal">
            <div
              class="monodon"
              v-for="(item, index) in recommends"
              :key="index"
              @click="handleEdit(item)"
            >
              <div class="monoceros text-ellipsis">
                <span>{{ item.title }}</span>
              </div>
            </div>
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
export default {
  name: "action",
  mixins: [pageMixin],
  data() {
    return {
      isShow: true,
      query: {
        openId: this.$store.state.user.info.openId,
        studentId: this.$store.state.user.info.studentId
      },
      myActions: [],
      recommends: []
    };
  },
  methods: {
    handleEdit(params = {}) {
      let { serial, title, textContent, ...args } = params;
      this.$router.push({
        path: "/action/edit",
        query: {
          ...args
        }
      });
    },
    handleActionDelete(index, params) {
      let { openId, studentId } = this.query;
      let obj = {
        openId,
        studentId,
        actionId: params.actionId,
        actionType: params.actionType
      };
      this.$dialog
        .confirm({
          title: "提示",
          message: "确认要删除该行为吗?"
        })
        .then(async () => {
          let res = await service.actionDelete(obj);
          if (res.errorCode === 0) {
            this.queryMyAction(this.query);
            this.updateStarCount();
          }
        });
    },
    //当删除自定义的行为时，更新Q星数
    async updateStarCount() {
      let res = await service.queryStar({
        studentId: this.query.studentId
      });
      if (res.errorCode === 0) {
        let _cookie = Cookies.getJSON("info");
        let totalStarCount = res.data; //Q星数
        let obj = Object.assign({}, _cookie, { totalStarCount });
        this.$store.dispatch("user/setInfo", obj).then(data => {
          if (data.success === "ok") {
          }
        });
      }
    },
    //行为列表查询
    async queryMyAction(params = {}) {
      let res = await service.queryMyAction(params);
      if (res.errorCode === 0) {
        this.myActions = res.data.myAction;
        this.recommends = res.data.noChoiceAction;
      }
    }
  },
  mounted() {
    this.queryMyAction(this.query);
  }
};
</script>
<style lang="less" scoped>
.mod {
  position: relative;
  background-color: #fff;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #e5e5e5;
    color: #e5e5e5;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    z-index: 2;
  }
}
.guanaco {
  display: flex;
  justify-content: space-between;
  padding: 30px 30px 0 30px;
  a {
    color: #92cd36;
  }
}
.narwhal {
  // display: flex;
  // flex-wrap: wrap;
  padding: 30px 20px;
}
.monodon {
  // padding: 10px;
  // width: 25%;
  margin: 10px;
  display: inline-block;
  vertical-align: top;
}
.monoceros {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  height: 80px;
  border-radius: 8px;
  padding: 0 20px;
  position: relative;
  background-color: #f6f8f9;
  .clear {
    position: absolute;
    right: -6%;
    top: -12%;
    color: #d2dde0;
  }
}
</style>
