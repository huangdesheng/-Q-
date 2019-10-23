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
                  placeholder="请输入评价标准..."
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
          <div class="cell min-h100">
            <div class="cell-hd">
              <h4>行为名称:</h4>
            </div>
            <div class="cell-bd">
              <input placeholder="请输入行为名称" maxlength="10" class="input" v-model.trim="form.title" />
            </div>
          </div>
          <div class="cell min-h100">
            <div class="cell-bd">
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
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="cells-title" size-16>
        <h4>评价标准</h4>
        <van-button type="info" size="small" @click="dialogVisible = true">添加</van-button>
      </div>
      <div class="rule-list">
        <div class="cells">
          <van-swipe-cell
            ref="swipeCell"
            :right-width="60"
            v-for="(item, index) in form.rules"
            :key="index"
            :on-close="onClose(index)"
          >
            <van-cell-group>
              <div class="cell min-h100">
                <div class="cell-bd">
                  <p class="font-color">{{ item.ruleText }}</p>
                </div>
              </div>
            </van-cell-group>
            <span slot="right">删除</span>
          </van-swipe-cell>
        </div>
      </div>
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
  name: "actionAdd",
  mixins: [pageMixin],
  data() {
    return {
      form: {
        openId: this.$store.state.user.info.openId,
        studentId: this.$store.state.user.info.studentId,
        title: "",
        textContent: "",
        rules: []
      },
      dialogForm: {
        ruleText: "",
        stressFlag: 0
      }
    };
  },
  methods: {
    onClose(index) {
      return (clickPosition, instance) => {
        switch (clickPosition) {
          case "right":
            this.$dialog
              .confirm({
                title: "提示",
                message: "确认要删除该行为标准吗?"
              })
              .then(() => {
                instance.close();
                this.form.rules.splice(index, 1);
              })
              .catch(() => {
                instance.close();
              });
            break;
        }
      };
    },
    //新增标准提交
    handleSubmit(action, done) {
      if (action === "confirm") {
        if (this.dialogForm.ruleText == "") {
          this.$toast("请输入评价标准");
          done(false);
        } else {
          this.form.rules.push(Object.assign({}, this.dialogForm));
          this.dialogForm.ruleText = "";
          done();
        }
      } else {
        done();
      }
    },
    //保存添加
    handleSave() {
      if (this.form.title == "") {
        this.$toast("请输入行为名称");
        return;
      }
      if (this.form.textContent == "") {
        this.$toast("请输入行为说明");
        return;
      }
      if (!this.form.rules.length) {
        this.$toast("请给行为添加评价标准");
        return;
      }
      this.actionAdd(this.form);
    },
    //行为添加
    async actionAdd(params = {}) {
      let res = await service.actionAdd(params);
      if (res.errorCode === 0) {
        this.$router.go(-1);
      } else if (res.errorCode === -1) {
        this.$toast(`${res.errorMsg}`);
      }
    }
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
.form-item {
  margin: 30px;
  position: relative;
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
}
</style>
