<template>
  <div class="page">
    <template v-if="roleType == 2">
      <div class="page-hd">
        <div class="button-sp-area flex" size-17>
          <a
            href="javascript:void(0);"
            id="showDatePicker"
            @click="popupShow = true"
          >
            <span>{{ className }}</span>
            <van-icon name="arrow-down" size="16px"></van-icon>
          </a>
        </div>
      </div>
    </template>
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
      <template v-if="roleType != 3">
        <qxRelease url="/recipe/add" />
      </template>
      <!-- list -->
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        :offset="100"
        @load="onLoad"
      >
        <van-swipe-cell
          ref="swipeCell"
          :right-width="60"
          v-for="(recipe, index) in list"
          :key="index"
          :disabled="roleType == 3"
          :on-close="onClose(recipe, index)"
        >
          <van-cell-group>
            <figure class="figure figure-skin-two" @click="go(recipe)">
              <div class="figure-bd">
                <div class="figure-info">
                  <figcaption size-18 class="text-ellipsis">
                    {{ recipe.title }}
                  </figcaption>
                  <!-- <div
                    class="figure-thumb-medium"
                    v-if="recipe.topImage"
                    :style="{ backgroundImage: `url(${recipe.topImage})` }"
                  ></div> -->
                  <p class="line-clamp">{{ recipe.textContent | brReplace }}</p>
                  <div class="metedata flex">
                    <span class="name">{{ recipe.name }}</span>
                    <time class="time">{{ recipe.postTime }}</time>
                  </div>
                </div>
              </div>
              <div class="figure-ft">
                <!-- <div class="figure-icon">
                  <van-icon name="eye-o" size="16px"></van-icon>
                  <b>{{ recipe.readCount }}</b>
                </div> -->
                <div class="figure-total">
                  <span>已读{{ recipe.readCount }}人</span>
                </div>
              </div>
            </figure>
          </van-cell-group>
          <span slot="right" style="line-height: 80px;">删除</span>
        </van-swipe-cell>
      </van-list>
      <div class="empty" v-if="empty">
        <img src="@/assets/kong.png" alt />
        <p>暂无营养食谱</p>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import qxRelease from "@/components/Release";
import classList from "@/mixins/classList";
export default {
  name: "recipe",
  mixins: [classList],
  components: {
    qxRelease
  },
  data() {
    return {
      empty: false,
      loading: false,
      finished: false,
      popupShow: false,
      totalPage: 1, //总页数
      className: this.$store.state.user.info.className,
      query: {
        schoolId: this.$store.state.user.info.id,
        page: 1,
        pageSize: 10
      },
      roleType: this.$store.state.user.info.roleType,
      list: []
    };
  },
  methods: {
    onLoad() {
      if (this.query.page < this.totalPage) {
        //加载数据
        this.query.page += 1;
        service.recipeQuery(this.query).then(res => {
          if (res.errorCode === 0) {
            let list = res.data.data;
            this.totalPage = res.data.totalPage;
            this.query.page = res.data.page;
            // 加载状态结束
            this.loading = false;
            for (let i = 0; i < list.length; i++) {
              this.list.push(list[i]);
            }
          }
        });
      } else {
        // 数据全部加载完成
        console.log("数据全部加载完成");
        this.loading = false;
        this.finished = true;
      }
    },
    onClose(recipe, index) {
      return (clickPosition, instance) => {
        switch (clickPosition) {
          case "right":
            this.$dialog
              .confirm({
                title: "提示",
                message: "确定删除该条食谱吗？"
              })
              .then(async () => {
                let obj = {
                  openId: this.query.openId,
                  recipeId: recipe.recipeId
                };
                //删除速报
                let res = await service.recipeDelete(obj);
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
    go(recipe) {
      console.log(recipe)
      let { studentId, recipeId } = recipe;
      this.$router.push({
        path: "/recipe/show",
        query: { recipeId, studentId }
      });
    },
    //选择班级
    handleClassConfirm(value, index) {
      this.className = value.className;
      this.query.classId = value.classId;
      this.query.page = 1;
      //当切换班级时，重新设置为没有全部加载完成
      this.finished = false;
      this.recipeQuery(this.query);
    },
    //食谱列表查询
    // async recipeQuery(params = {}) {
    //   let res = await service.recipeQuery(params);
    //   if (res.errorCode === 0) {
    //     this.popupShow = false;
    //     this.list = res.data.data || [];
    //     this.query.page = res.data.page;
    //     this.totalPage = res.data.totalPage;
    //     if (this.list.length) {
    //       this.empty = false;
    //     } else {
    //       this.empty = true;
    //     }
    //   } else {
    //     this.$toast(`${res.errorMsg}`);
    //   }
    // }
    async querySchoolRecipeList(params = {}) {
      let res = await service.querySchoolRecipeList(params);
      if (res.errorCode === 0) {
        this.popupShow = false;
        this.list = res.data.data || [];
        this.query.page = res.data.page;
        this.totalPage = res.data.totalPage;
        if (this.list.length) {
          this.empty = false;
        } else {
          this.empty = true;
        }
      } else {
        this.$toast(`${res.errorMsg}`);
      }
    }
  },
  mounted() {
    this.querySchoolRecipeList(this.query);
  }
};
</script>
<style lang="less" scoped>
.line-clamp {
  font-size: 30px;
}
</style>
