<template>
  <nav class="nav">
    <router-link
      :to="{ path: menu.url }"
      class="langur"
      v-for="(menu, index) in computedMenu"
      :key="index"
    >
      <img :src="menu.icon" width="57" height="57" />
      <div class="text-ellipsis">{{ menu.name }}</div>
    </router-link>
  </nav>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "qmenu",
  data() {
    return {
      //学校类型
      recipeList: [
        {
          name: "营养食谱",
          url: "/recipe",
          icon: require("../assets/men-icon-9@2x.png")
        }
      ],
      shuttleList: [
        {
          name: "实时接送",
          url: "/shuttle",
          icon: require("../assets/men-icon-6@2x.png")
        }
      ],
      clockList: [
        {
          name: "考勤管理",
          url: "/clock",
          icon: require("../assets/men-icon-3@2x.png")
        }
      ],
      //学校
      schoolList: [
        {
          name: "班级管理",
          url: "/class",
          icon: require("../assets/men-icon-1@2x.png")
        },
        {
          name: "老师管理",
          url: "/teacher",
          icon: require("../assets/men-icon-4@2x.png")
        }
      ],
      //老师
      teacherList: [
        {
          name: "学生管理",
          url: "/student",
          icon: require("../assets/men-icon-10@2x.png")
        }
      ],
      scheduleList: [
        {
          name: "班级课表",
          url: "/schedule/teacher",
          icon: require("../assets/men-icon-12@2x.png")
        }
      ],
      feedList: [
        {
          name: "师生互动",
          url:
            this.$store.state.user.info.roleType == 2
              ? "/feed/teacher"
              : "/feed",
          icon: require("../assets/men-icon-11@2x.png")
        },
        // {
        //   name: "园长专栏",
        //   url: "/specialColumn",
        //   icon: require("../assets/specialColumn.png")
        // }
      ],
      //共用的菜单
      menuList: [
        {
          name: "通知",
          url:
            this.$store.state.user.info.roleType == 1 ||
            this.$store.state.user.info.roleType == 4
              ? "/notice/admin"
              : "/notice",
          icon: require("../assets/men-icon-7@2x.png")
        },
        {
          name: "作业",
          url: "/home-work",
          icon: require("../assets/men-icon-5@2x.png")
        },
        {
          name: "班级速报",
          url: "/fresh",
          icon: require("../assets/men-icon-8@2x.png")
        },
        {
          name: "班级相册",
          url: "/album",
          icon: require("../assets/men-icon-2@2x.png")
        }
      ]
    };
  },
  computed: {
    ...mapState("user", {
      type: state => state.info.type,
      roleType: state => state.info.roleType
    }),
    computedMenu() {
      switch (parseInt(this.roleType)) {
        case 1:
          return this.menuList
            .concat(this.recipeList)
            .concat(this.clockList)
            .concat(this.schoolList);
          break;
        case 2:
          return this.menuList
            .concat(this.recipeList)
            .concat(this.clockList)
            .concat(this.teacherList)
            .concat(this.shuttleList)
            .concat(this.feedList)
            .concat(this.scheduleList);
          break;
        case 3:
          return this.menuList
            .concat(this.recipeList)
            .concat(this.clockList)
            .concat(this.scheduleList)
            .concat(this.feedList);
          break;
        default:
          return this.menuList
            .concat(this.recipeList)
            .concat(this.clockList)
            .concat(this.schoolList);
          break;
      }
    }
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.nav {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  .langur {
    width: 25%;
    min-width: 0; /*解决方案*/
    height: 180px;
    padding-top: 10px;
    text-align: center;
  }
}
</style>
