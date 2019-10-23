<template>
  <div class="community">
    <div class="box" v-for="(fuck, fuckIndex) in data" :key="fuck.communityId">
      <div class="cell flex">
        <div class="cell-hd">
          <img v-if="fuck.photo" :src="fuck.photo" />
          <img src="@/assets/child-default@2x.png" v-else />
        </div>
        <div class="cell-bd">
          <h5 size-15>{{ fuck.name }}</h5>
          <p size-15>{{ fuck.textContent }}</p>
          <template>
            <div class="img-group">
              <div
                class="item"
                :style="{backgroundImage: `url(${img.imageUrl})`}"
                v-for="(img, index) in fuck.images"
                :key="index"
                @click="handlePreviewImage(img.imageUrl, fuck.images)"
              ></div>
            </div>
          </template>
          <div class="handle flex j-c-s-b a-i-c">
            <div class="left">
              <time>{{ fuck.postTime }}</time>
              <!-- 园长和管理员和老师才能删除 -->
              <template v-if="roleType == 1 || roleType == 2 || roleType == 4">
                <span class="del" @click="handleCommunityDelete(fuck, fuckIndex)">删除</span>
              </template>
            </div>
            <div class="right">
              <template
                v-if="fuck.praiseList.some(item => item.openId == openId && item.studentId == studentId)"
              >
                <van-icon
                  name="like"
                  size="18px"
                  color="#e64340"
                  @click="handlePraise(fuck, fuckIndex)"
                ></van-icon>
              </template>
              <template v-else>
                <van-icon
                  name="like"
                  size="18px"
                  color="#336d92"
                  @click="handlePraise(fuck, fuckIndex)"
                ></van-icon>
              </template>
              <van-icon
                name="comment"
                size="18px"
                color="#336d92"
                @click="handleComment(fuck, fuckIndex)"
              ></van-icon>
            </div>
          </div>
          <div class="data">
            <!-- 点赞列表 -->
            <template v-if="fuck.praiseList.length">
              <div class="zan-list flex a-i-c">
                <van-icon name="like" size="12px" color="#336d92"></van-icon>
                <span
                  v-for="(praise, index) in fuck.praiseList"
                  :key="index"
                >{{ praise.studentName}}</span>
              </div>
            </template>
            <!-- 评论列表 -->
            <template v-if="fuck.commentList.length">
              <transition name="fade" mode="out-in">
                <ul class="comment-list">
                  <li
                    ref="li"
                    v-for="(commen, index) in fuck.commentList.slice(0, fuck.showNumber)"
                    :key="index"
                  >
                    <span>{{ commen.studentName }}:</span>
                    <span style="color:#252525;">{{ commen.textContent }}</span>
                  </li>
                </ul>
              </transition>
            </template>
          </div>
          <!-- 显示更多 -->
          <div
            v-if="fuck.commentList.length > 3"
            class="more-show mt-20"
            @click="handleLiHeight(fuck, fuckIndex)"
          >{{ fuck.showMore ? '收起':'查看更多'}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "community",
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("user", {
      roleType: state => state.info.roleType,
      openId: state => state.info.openId,
      studentId: state => state.info.studentId,
      experience: state => state.info.experience //0否 1体验
    })
  },
  methods: {
    //查看更多评论
    handleLiHeight(item, fuckIndex) {
      if (item.showMore) {
        item.showMore = false;
        item.showNumber = 3;
      } else {
        item.showMore = true;
        item.showNumber = item.commentList.length;
      }
    },
    //预览图片
    handlePreviewImage(imgUrl, images) {
      let imgArray = [];
      if (images.length) {
        images.forEach(item => {
          imgArray.push(item.imageUrl);
        });
      }
      if (!imgArray.length) {
        imgArray.push(imgUrl);
      }
      wx.previewImage({
        current: encodeURI(imgUrl),
        urls: imgArray
      });
    },
    handleCommunityDelete(fuck, index) {
      this.$emit("on-del", fuck, index);
    },
    handlePraise(fuck, index) {
      if (this.experience == 1) {
        this.$toast("体验班不能点赞");
        return false;
      }
      this.$emit("on-praise", fuck, index);
    },
    handleComment(fuck, index) {
      if (this.experience == 1) {
        this.$toast("体验班不能评论");
        return false;
      }
      this.$emit("on-comment", fuck, index);
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.community {
  background-color: #fff;
  .box {
    border-top: 1px solid #f2f2f2;
    padding-top: 30px;
    padding-bottom: 30px;
  }
  .cell {
    padding: 0 30px;
    position: relative;
    align-items: flex-start;
    &::before {
      display: none;
    }
  }
  time {
    color: #999;
  }
  h5 {
    font-weight: bold;
    color: #336d92;
  }
  .cell-bd {
    flex: 1;
    padding-left: 20px;
    p {
      line-height: 1.2;
      margin-top: 16px;
      margin-bottom: 16px;
    }
  }
  .cell-hd {
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }
  .del {
    color: #336d92;
    margin-left: 20px;
  }
  .data {
    margin-top: 20px;
    border-radius: 4px;
    background-color: #eaf0f4;
  }
}
.img-group {
  font-size: 0;
  .item {
    display: inline-block;
    width: 160px;
    height: 160px;
    margin-right: 10px;
    margin-bottom: 10px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
}
.handle {
  .right {
    i {
      font-size: 36px;
      color: #9aa4cb;
      display: inline-block;
      margin-left: 10px;
      vertical-align: top;
    }
  }
}
.zan-list {
  color: #336d92;
  padding: 12px;
  flex-wrap: wrap;
  line-height: 1.4;
  font-size: 28px;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: 20px;
    top: -16px;
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
    border-bottom: 16px solid #eaf0f4;
  }
  i {
    font-size: 30px;
    color: #9aa4cb;
    margin-right: 10px;
  }
  span {
    position: relative;
    display: inline-block;
    &::after {
      content: ",";
    }
  }
}
.comment-list {
  //height: 100px;
  position: relative;
  color: #336d92;
  padding: 20px;
  font-size: 28px;
  overflow: hidden;
  transition: all ease 0.2s;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #fff;
    color: #e7e7e7;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    z-index: 2;
  }
  li {
    line-height: 1.4;
    margin-top: 10px;
    text-align: justify;
    &:first-child {
      margin-top: 0;
    }
  }
}
.more-show {
  color: #fe9430;
  text-align: right;
}
</style>
