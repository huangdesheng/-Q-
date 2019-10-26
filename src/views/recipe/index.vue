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
                  <div class="metedata flex">
                    <!-- <span class="name">{{ recipe.name }}</span> -->
                    <time class="time">{{ recipe.postTime }}</time>
                  </div>
                  <p class="line-clamp">{{ recipe.textContent | brReplace }}</p>
                   <!-- :style="{
                      backgroundImage:
                        'url(' + require('@/assets/teacher@2x.png') + ')'
                    }" -->
                  <div
                    class="figure-thumb-medium"
                     v-if="recipe.topImage"
                    :style="{ backgroundImage: `url(${recipe.topImage})` }"
                  ></div>
                </div>
              </div>
              <div class="figure-ft">
                <!-- <div class="figure-icon">
                  <van-icon name="eye-o" size="16px"></van-icon>
                  <b>{{ recipe.readCount }}</b>
                </div> -->
                <!-- <div class="figure-total">
                  <span>已读{{ recipe.readCount }}人</span>
                </div> -->
                 <div class="figure-icon">
                  <div class="user">
                    <div class="userImg">
                      <img v-if="recipe.photo" :src="recipe.photo" alt="" />
                      <img v-else src="@/assets/child-default@2x.png" alt="" />
                    </div>
                    <span class="name">{{ recipe.name }}</span>
                  </div>
                  <div class="readNum">
                    <van-icon
                      name="eye-o"
                      size="16px"
                      color="#999999"
                    ></van-icon>
                    <span>{{ recipe.readCount }}</span>

                    <!-- <van-icon
                      class="vanIcon2"
                      name="comment-o"
                      size="16px"
                      color="#999999"
                    />
                    <span>{{ recipe.classCommentCount }}</span> -->
                  </div>
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
      query2: {
        openId: this.$store.state.user.info.openId,
        classId: this.$store.state.user.info.classId,
        studentId: this.$store.state.user.info.studentId,
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
        service.recipeQuery(this.query2).then(res => {
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
      console.log(recipe);
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
      this.recipeQuery(this.query2);
    },
    //食谱列表查询 家长端、老师端
    async recipeQuery(params = {}) {
      let res = await service.recipeQuery(params);
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
    },

    //园长端
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
    console.log(this.roleType);
    if (this.roleType == 1 || this.roleType == 4) {
      console.log(111);
      this.querySchoolRecipeList(this.query);
    } else {
      this.recipeQuery(this.query2);
      console.log(222);
    }
  }
};
</script>
<style lang="less" scoped>
.line-clamp {
  font-size: 30px;
}
.text-ellipsis {
  font-size: 36px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(37, 37, 37, 1);
  margin-bottom: 28px;
}
.figure-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  margin-right: 0;
  .user {
    display: flex;
    align-items: center;
    .userImg {
      display: inline-block;
      margin-right: 14px;
      img {
        width: 40px;
        height: 40px;
      }
    }
    span {
      font-size: 24px;
      color: rgba(153, 153, 153, 1);
    }
  }
  .readNum {
    display: flex;
    align-items: center;
    span {
      margin-left: 21px;
      font-size: 26px;
      color: rgba(169, 169, 169, 1);
    }
    .vanIcon2 {
      margin-left: 40px;
    }
  }
}
</style>
