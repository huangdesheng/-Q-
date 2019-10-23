<template>
  <div class="page">
    <div class="page-bd">
      <van-swipe-cell
        ref="swipeCell"
        :right-width="60"
        v-for="(item, index) in list"
        :key="index"
        :on-close="onClose(index, item)"
      >
        <van-cell-group>
          <div class="cells">
            <div class="cell min-h120" @click="handleEditClass(item)">
              <div class="cell-bd">
                <p size-17 class="text-ellipsis">{{ item.className }}</p>
                <p>
                  <span class="t" size-12>带班老师{{ item.countTeacher }}人</span>
                  <span class="s" size-12>关联学生{{ item.countStudent }}人</span>
                </p>
              </div>
            </div>
          </div>
        </van-cell-group>
        <span slot="right">删除</span>
      </van-swipe-cell>
    </div>
    <div class="page-ft">
      <div class="fixed-bottom" style="z-index: 100;">
        <van-button type="info" size="large" class="no-radius" to="/class/add">新增</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "class",
  data() {
    return {
      className: "",
      schoolId: this.$store.state.user.info.id,
      openId: this.$store.state.user.info.openId,
      list: []
    };
  },
  methods: {
    onClose(index, item) {
      return (clickPosition, instance) => {
        switch (clickPosition) {
          case "right":
            this.$dialog
              .confirm({
                title: "提示",
                message: "确认要删除该班级吗?"
              })
              .then(async () => {
                let { classId, countStudent, countTeacher } = item;
                if (countStudent > 0 || countTeacher > 0) {
                  instance.close();
                  this.$toast("班级还有关联学生和老师，不能删除班级");
                  return;
                }
                let res = await service.classDelete({
                  classId,
                  openId: this.openId
                });
                if (res.errorCode === 0) {
                  this.list.splice(index, 1);
                } else if (res.errorCode === -1) {
                  this.$toast(`${res.errorMsg}`);
                }
              })
              .catch(() => {
                instance.close();
              });
        }
      };
    },
    handleEditClass(item) {
      this.$router.push({
        path: "/class/edit",
        query: {
          classId: item.classId,
          className: item.className
        }
      });
    },
    //查询对应学校的所有班级
    async queryClass(schoolId) {
      let res = await service.queryClass({ schoolId });
      if (res.errorCode === 0) {
        this.list = res.data;
      }
    }
  },
  mounted() {
    this.queryClass(this.schoolId);
  }
};
</script>
<style lang="less" scoped>
span.t {
  color: #409eff;
}
span.s {
  color: #ff40d9;
}
</style>
