<template>
  <div class="page">
    <div class="page-bd">
      <template v-if="list.length">
        <div class="album">
          <div class="album-figrue-box flex f-w-w" style="margin-left: -10px; margin-right: -10px;">
            <figure class="album-figure" v-for="(album, index) in list" :key="index">
              <router-link :to="{ path: '/album/view', query: { classId: album.classId } }">
                <div class="album-thumb">
                  <img v-if="album.image" :src="album.image" alt />
                  <img v-else src="@/assets/kong.png" alt />
                </div>
                <figcaption>
                  <p size-16>{{ album.className }}</p>
                  <p size-14>{{ album.imagesCount }}张</p>
                </figcaption>
              </router-link>
            </figure>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import service from "@/api";
export default {
  name: "album",
  data() {
    return {
      query: {
        openId: this.$store.state.user.info.openId,
        roleType: this.$store.state.user.info.roleType,
        studentId: this.$store.state.user.info.studentId
      },
      list: []
    };
  },
  methods: {
    //查询相册所属班级
    async albumClassQuery(params = {}) {
      let res = await service.albumClassQuery(params);
      if (res.errorCode === 0) {
        this.list = res.data;
        this.$router.push({ path: "/album" });
      }
      // // ============================
      // if (this.list.length <= 1) {
      //   this.$router.push({
      //     path: "/album/view?classId=" + this.list[0].classId
      //   });
      // } else {

      // }
    }
  },
  mounted() {
    this.albumClassQuery(this.query);
  }
};
</script>
<style lang="less" scoped>
.album {
  padding: 30px 30px 0 30px;
  background-color: #fff;
  .album-figure {
    width: 50%;
    padding: 0 20px;
    margin-bottom: 30px;
    > a {
      position: relative;
      display: block;
      box-shadow: 0 0 14px 0 rgba(21, 21, 21, 0.2);
    }
    figcaption {
      padding: 20px;
      p {
        &:first-child {
          font-weight: bold;
        }
      }
    }
  }
  .album-thumb {
    // width: 310px;
    height: 310px;
    position: relative;
    padding-bottom: 100%;
    overflow: hidden;
    background-color: #e4f1ff;
    img {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
