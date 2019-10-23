<template>
  <div class="page">
    <div class="page-bd">
      <!-- -->
      <van-dialog
        v-model="dialogVisible"
        title="评价标准"
        show-cancel-button
        :before-close="handleSubmit"
      >
        <form class="form" ref="dialogForm">
          <div class="cells" style="padding:15px 0 15px 0;">
            <div class="cell">
              <div class="cell-bd">
                <textarea
                  class="textarea"
                  placeholder="请输入评价标准"
                  rows="6"
                  v-model.trim="dialogForm.ruleText"
                ></textarea>
              </div>
            </div>
          </div>
        </form>
      </van-dialog>
      <div class="mod mb-30">
        <div class="cells">
          <div class="cell">
            <div class="cell-hd">
              <h4>行为名称:</h4>
            </div>
            <div class="cell-bd">
              <input
                placeholder="请输入行为名称"
                maxlength="10"
                class="input"
                v-model.trim="form.title"
                :readonly="query.actionType == 0"
              />
            </div>
          </div>
          <div class="cell min-h100">
            <div class="cell-hd">
              <h4>行为目标:</h4>
            </div>
          </div>
          <div class="cell">
            <div class="cell-bd">
              <textarea
                class="textarea text-left"
                placeholder="例如: 培养孩子坚持力"
                rows="4"
                v-model.trim="form.textContent"
                :readonly="query.actionType == 0"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="cells-title" size-16>
        <h4>评价标准</h4>
        <van-button
          v-if="query.actionType != 0"
          round
          type="info"
          size="small"
          @click="dialogVisible = true"
        >添加</van-button>
      </div>
      <div class="rule-list">
        <div class="cells">
          <van-swipe-cell
            ref="swipeCell"
            :right-width="60"
            v-for="(item, index) in form.rules"
            :key="index"
            :disabled="parseInt(query.actionType) === 0"
            :on-close="onClose(index, item.ruleId)"
          >
            <van-cell-group>
              <div class="cell rule-cell">
                <div class="cell-hd">
                  <van-checkbox-group v-model="chenkedList">
                    <van-checkbox
                      :key="item.ruleId"
                      :name="item.ruleId"
                      checked-color="#92cd36"
                      ref="checkboxes"
                    ></van-checkbox>
                  </van-checkbox-group>
                </div>
                <div class="cell-bd pl-20">
                  <p class="font-color">{{ item.ruleText }}</p>
                </div>
              </div>
            </van-cell-group>
            <span slot="right">删除</span>
          </van-swipe-cell>
        </div>
      </div>
      <!-- tip -->
      <p
        style="color:#999;font-size:12px;"
        class="ml-20"
        v-show="query.actionType == 0"
      >默认行为无法修改，不一样的培养标准请自定义哦</p>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" @click="handleSave">保存</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import pageMixin from "@/mixins/page";
export default {
  name: "actionEdit",
  mixins: [pageMixin],
  data() {
    return {
      form: {},
      chenkedList: [],
      query: {
        openId: this.$store.state.user.info.openId,
        studentId: this.$store.state.user.info.studentId,
        actionId: this.$route.query.actionId,
        actionType: this.$route.query.actionType,
        choiceType: this.$route.query.choiceType
      },
      dialogForm: {
        openId: this.$store.state.user.info.openId,
        actionId: this.$route.query.actionId,
        actionType: this.$route.query.actionType,
        ruleText: "",
        stressFlag: 0
      }
    };
  },
  methods: {
    onClose(index, ruleId) {
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
                  openId: this.dialogForm.openId,
                  actionType: this.dialogForm.actionType,
                  ruleId
                };
                //行为标准删除
                let res = await service.ruleDelete(obj);
                if (res.errorCode === 0) {
                  this.form.rules.splice(index, 1);
                }
              })
              .catch(() => {
                instance.close();
              });
            break;
        }
      };
    },
    //新增标准提交
    async handleSubmit(action, done) {
      if (action === "confirm") {
        if (this.dialogForm.ruleText == "") {
          this.$toast("请输入评价标准");
          done(false);
        } else {
          //行为标准增加
          let res = await service.ruleAdd(Object.assign({}, this.dialogForm));
          if (res.errorCode === 0) {
            this.dialogForm.ruleText = "";
            this.queryStudentRule(this.query);
            done();
          }
        }
      } else {
        done();
      }
    },
    //提交保存
    async handleSave() {
      let { rules, actionId, actionType, ...args } = this.form;
      let openId = this.dialogForm.openId;
      let studentId = this.query.studentId;
      let obj = Object.assign({}, args, { openId, actionId, actionType });
      if (this.chenkedList.length) {
        //行为编辑更新
        let res = await service.actionUpdate(obj);
        if (res.errorCode === 0) {
          let rules = [...this.chenkedList];
          let params = Object.assign(
            {},
            { openId, studentId, actionId, actionType, rules }
          );
          //行为标准关联
          let result = await service.ruleConnect(params);
          if (result.errorCode === 0) {
            this.$router.go(-1);
          }
        } else if (res.errorCode === -1) {
          this.$toast(`${res.errorMsg}`);
        }
      } else {
        this.$toast("请勾选标准");
      }
    },
    //按行为查询已选中的规则
    async queryStudentRule(params = {}) {
      let res = await service.queryStudentRule(params);
      if (res.errorCode === 0) {
        this.form = res.data;
        let ruleList = [];
        res.data.rules.forEach(element => {
          //是否有选中的数据
          if (element.choice) {
            ruleList.push(element.ruleId);
          }
        });
        this.chenkedList = ruleList;
      }
    }
  },
  mounted() {
    this.queryStudentRule(this.query);
  }
};
</script>
<style lang="less" scoped>
.tapeti {
  display: flex;
  align-items: center;
  > div {
    flex: 1;
    button {
      width: 100%;
      border-radius: 0;
    }
  }
}

.form {
  position: relative;
}
.form-tiem {
  margin: 30px;
}

.mod {
  margin-bottom: 20px;
}

.cells-title {
  color: #252525;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  padding: 0 20px;
  margin-bottom: 0;
  background-color: #fff;
}

.rule-list {
  margin-bottom: 20px;
  .rule-cell {
    min-height: 100px;
    padding-top: 30px;
    padding-bottom: 30px;
  }
}
</style>
