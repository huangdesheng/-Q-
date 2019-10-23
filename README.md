### 技术

vue2.x + vuex + vueRoute + axios + vantUI

### 项目公众号

小 Q 智慧
爱心 100
魔力课堂

## 项目目录介绍

- bulid webpack 编辑打包配置目录
- config 项目配置
- dist 项目打包后的文件
- node_modules npm 包
- src 开发需要的目录

  - api 后端接口地址
    - module api 接口模块文件
      - album.js 班级相册接口地址
    - axios.js axios 配置文件
    - index.js 导出所有接口地址
  - assets 资源目录
  - components 组件目录
  - config 配置
    - bracelet.js 小 Q 手环相关变量(手环协议)
    - isdev.js 根据是开始环境还是生产环境配置不同的微信公众号签名地址
    - wxapi.js 微信公众号 jsapi 相关接口
  - directive 全局指令
  - filters 全局过滤
  - mixins 混入
  - mock 模拟数据
  - router vue 路由配置文件
  - store vuex 文件
  - styles less 样式文件
  - vantUI 移动端 UI 组件
  - views 页面
    - about 关于我们
    - acion 行为管理页面
    - activity-recommend 活动推荐
    - alarm-clock 闹钟页面
    - album 班级相册
    - baby 学生
    - bracelet 学生手环页面
    - child 添加孩子页面
    - class 班级管理
    - clock 考勤管理
    - collention 我的收藏
    - community 班级圈发布
    - course 课堂表现
    - device 手环设备
    - edu-recommend 教育推荐
    - exampaper 试卷列表
    - fresh 新鲜速报
    - home 小 Q 班级页面
    - homework 作业
    - login 登陆页
    - my 我的
    - notice 公告通知
    - prize 奖励兑换页面
    - punch 扫码打卡接送页面
    - read-recommend 阅读推荐页面
    - recipe 营养食谱
    - remark 评语页面
    - school 创建学校和老师加入学校
    - score 学习成绩
    - share 分享页面
    - shuttle 实时接送
    - single 小 Q 表现页面
    - student 学生管理
    - teacher 老师管理
    - user 个人中心
    - welcome 启动页
    - wisdom 小 Q 智慧
    - works 作品管理
  - App.vue 根组件
  - main.js 项目启动文件（入口）

- static 静态资源目录
- .babelrc babel 配置文件
- .eslint eslint 配置文件
- .postcssrc webpack 处理 css 插件配置
- .package npm 配置信息

## 开发问题

> 在 keep-alive 作用下，某些钩子函数会失去作用，在 deactivated（）这个钩子函数解绑即可

```javascript
  deactivated() {
    window.removeEventListener("scroll", this.handleLoadingMore);
  },
  activated() {
    window.addEventListener("scroll", this.handleLoadingMore);
  },
```

> iphone 手机遇到 select 选中不了值问题

```html
<select class="select" name="" dir="rtl" v-model="selected" multiple size="1">
  <!-- 兼容性问题修改 -->
  <optgroup disabled hidden></optgroup>
  <option
    :value="option.classId"
    v-for="(option,index) in classList"
    :key="index"
    >{{ option.className }}</option
  >
</select>
```

> 调用微信 SDK 接口 wx.previewImage 出现华手机查看不了问题(黑屏)

```javascript
wx.previewImage({
  current: encodeURI(url), //encodeURI
  urls: imgArray
});

function getTagsMap() {
  return [...document.querySelectorAll("*")].reduce((a, c) => {
    let tagName = c.tagName.toLowerCase();
    if (a[tagName]) {
      a[tagName] += 1;
    } else {
      a[tagName] = 1;
    }
    return a;
  }, {});
}
schdule.map(elem => {
  return {
    startTime: "",
    endTime: "",
    s: elem.schdule.map(item => {
      let { title, ...args } = item;
      return {
        ...args
      };
    })
  };
});
```

## git 分支命名

- Develop
- Release
- Hotfix
- Master

## natapp -authtoken=a6260d5585826691

- 用户绑定设备有两种方式：扫码绑定，厂商服务器绑定，这两种方式都需要先向微信公众平台注册授权设备
- JSAPI：
- 调用 第一次:
- 绑定设备,-显示已绑定设备--> 连接设备 --onWXDeviceStateChange 判断 成功
- 调用 第二次:
- 解绑设备 --.显示设备 ---> 扫描设备 -> 显示设备 -->连接 -->不成功 不走 onWXDeviceStateChange;
- 手环已经连接后，其它手机(或本机)进行扫描会出来扫描不到的情况
- 小 Q 表现需先关联孩子才可绑定手环
- 已经绑定过的手环不会在出现扫描列表里

> 浅谈微信页面入口文件被缓存解决方案

- https://www.jb51.net/article/148249.htm

> 微信开发分享相关

- https://www.cnblogs.com/mingxinice/p/mingxin.html
- https://blog.csdn.net/weixin_41690905/article/details/80745821
- http://www.hehaibao.com/vue-wechat-share/
- https://segmentfault.com/a/1190000012339148
- https://segmentfault.com/a/1190000010753247
- https://www.cnblogs.com/zhoudawei/p/9802521.html

> 打包注意事项

- 打包前请配置好 config/prod.env.js 打包地址
- 打包前请配置好 src/config/isdev.js 地址
- 打包前请把不需要展示的页面关闭掉，如 src/components/Footer.vue 文件内的手环设备页面
- 打包前请把 index.html 下的微信调试工具 VConsole 注释掉

> 打包后注意事项

- 打包后请把 dist 下的文件夹压缩一份放在 F:/qxiao/linchang/weixinMp 打包文件/开放版本 覆盖相关的文件，然后用 svn 提交(commit)
