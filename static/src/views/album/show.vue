<template>
  <div class="page">
    <div class="page-bd">
      <van-dialog
        v-model="dialogVisible"
        title="修改相册名称"
        show-cancel-button
        @cancel="dialogVisible = false"
        :before-close="handleSubmit"
      >
        <div class="cells" style="padding:15px 0 15px 0;">
          <div class="cell">
            <div class="cell-bd" style="padding-left:0">
              <input
                class="input"
                placeholder="请输入相册名称"
                maxlength="10"
                v-model="title"
                style="text-align:left;"
              />
            </div>
          </div>
        </div>
      </van-dialog>
      <article class="article">
        <h1 size-24 class="flex a-i-c">
          {{ title }}
          <template v-if="roleType != 3">
            <template v-if="experience != 1">
              <van-icon name="edit" @click="handleEditChannel" />
            </template>
          </template>
        </h1>
        <div class="article-hd flex">
          <div class="article-cell">
            <time style="color:#8d8d8d;">{{ updateTime }}</time>
          </div>
        </div>
        <div class="album-content">
          <!-- 分页 -->
          <van-list
            v-model="loading"
            :finished="finished"
            :immediate-check="false"
            :offset="100"
            @load="onLoad"
          >
            <div class="grid-content flex f-w-w" style="margin-left: -5px; margin-right: -5px;">
              <div
                class="album-img mb-20"
                v-for="(pic, index) in list"
                :key="index"
                @click="handlePreviewImage(pic.imageUrl, index)"
              >
                <div class="suni">
                  <!-- 删除 -->
                  <div class="album-mask" v-show="mask" style="z-index: 95">
                    <van-checkbox-group v-model="albumCheckList">
                      <van-checkbox :key="pic.itemId" :name="pic.itemId" checked-color="#92cd36"></van-checkbox>
                    </van-checkbox-group>
                  </div>
                  <img :src="pic.smallUrl" />
                </div>
              </div>
            </div>
          </van-list>
        </div>
        <div class="empty" v-if="empty">
          <img src="@/assets/kong.png" alt />
          <p>暂无相册</p>
        </div>
      </article>
    </div>
    <div class="page-ft" v-if="roleType == 2">
      <div class="fixed-bottom" style="z-index: 100;">
        <div class="flex">
          <van-button
            size="large"
            type="default"
            class="no-radius"
            v-show="mask"
            @click="handleCancel"
          >取消</van-button>
          <van-button
            size="large"
            type="default"
            class="no-radius"
            v-show="!mask"
            @click="mask = true"
          >编辑</van-button>
          <van-button
            size="large"
            type="danger"
            class="no-radius"
            v-show="mask"
            @click="handleConfirm"
          >删除</van-button>
          <van-button
            size="large"
            type="info"
            class="no-radius"
            v-show="!mask"
            @click="handleBlumAdd"
          >上传相片</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from "@/api";
import { mapState } from "vuex";
export default {
  name: "albumDetail",
  data() {
    return {
      empty: false,
      loading: false,
      finished: false,
      totalPage: 1, //总页数
      dialogVisible: false,
      mask: false,
      roleType: this.$store.state.user.info.roleType,
      title: "",
      updateTime: this.$route.query.updateTime,
      query: {
        openId: this.$store.state.user.info.openId,
        channelId: this.$route.query.channelId,
        page: 1,
        pageSize: 20
      },
      list: [],
      albumCheckList: [] //选择的图片ID
    };
  },
  computed: {
    ...mapState("user", {
      experience: state => state.info.experience //0不是体验用户 1是
    })
  },
  methods: {
    onLoad() {
      console.log("onload");
      if (this.query.page < this.totalPage) {
        this.query.page += 1;
        service.albumChannelDetail(this.query).then(res => {
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
    handleBlumAdd(e) {
      this.$router.push({
        path: "/album/add",
        query: { channelId: this.$route.query.channelId }
      });
    },
    //修改栏目名称
    handleEditChannel() {
      //体验用户和家长角色不可修改
      if (this.experience != 1) {
        console.log("体验用户和家长角色不可修改");
        this.dialogVisible = true;
      }
    },
    handleCancel() {
      this.mask = false;
      this.albumCheckList = [];
    },
    async handleConfirm() {
      if (this.albumCheckList.length) {
        let result = [];
        let params = {
          openId: this.query.openId,
          itemIds: this.albumCheckList
        };
        //相册照片或视频删除
        let res = await service.imageDelete(params);
        if (res.errorCode === 0) {
          for (let i = 0; i < this.list.length; i++) {
            if (!this.albumCheckList.includes(this.list[i].itemId)) {
              result.push(this.list[i]);
            }
          }
          this.list = result || [];
          this.mask = false; //关闭透明层
          this.albumCheckList = []; //清空checkbox选择
        }
      } else {
        this.$toast("没有选择图片");
      }
    },
    //预览图片
    handlePreviewImage(imgUrl, index) {
      let result = [];
      let min = index - 5 <= 0 ? 0 : index - 5;
      let max = index + 5;
      let imgArr = this.list.filter((item, i) => {
        return i >= min && i <= max;
      });
      if (imgArr.length) {
        for (let i = 0; i < imgArr.length; i++) {
          result.push(imgArr[i].imageUrl);
        }
      }
      wx.previewImage({
        current: encodeURI(imgUrl),
        urls: result || [imgUrl]
      });
    },
    async handleSubmit(action, done) {
      if (action === "confirm") {
        if (this.title == "") {
          this.$toast("请输入相册名称");
          done(false);
        } else {
          let { channelId } = this.query;
          let name = this.title;
          let res = await service.updateChannel({ channelId, name });
          if (res.errorCode === 0) {
            done();
            this.$toast("相册名称修改成功");
            this.dialogVisible = false;
            this.queryTitle(this.query.channelId);
          }
        }
      } else {
        done();
      }
    },
    //查询班级所属的相册栏目
    async albumChannelDetail(params = {}) {
      let res = await service.albumChannelDetail(params);
      if (res.errorCode === 0) {
        this.query.page = res.data.page;
        this.totalPage = res.data.totalPage;
        this.list = res.data.data || [];
        if (this.list.length) {
          this.empty = false;
        } else {
          this.empty = true;
        }
      }
    },
    //查询栏目名称
    async queryTitle(channelId) {
      let res = await service.queryTitle({ channelId });
      if (res.errorCode === 0) {
        this.title = res.data;
      }
    }
  },
  mounted() {
    this.albumChannelDetail(this.query);
    this.queryTitle(this.query.channelId);
  }
};
</script>
<style lang="less" scoped>
.album-content {
  overflow: hidden;
}
.album-img {
  width: 33.33333%;
  padding: 0 10px;
  .suni {
    position: relative;
    overflow: hidden;
    padding-bottom: 100%;
    img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
  }
}
.album-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 10px;
  text-align: right;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
