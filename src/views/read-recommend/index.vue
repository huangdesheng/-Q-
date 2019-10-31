<template>
  <div class="page">
    <div class="page-bd">
      <div class="empty">
        <img src="@/assets/kong.png" alt />
        <p class="mt-30">正在建设中~</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "readRecommend",
  data() {
    return {};
  },
  mounted() {
    // let date = new Date()

    // console.log(date.toLocaleString().getTime());
    // let timestamp1 = Date.parse(new Date());
    // console.log(timestamp);
    // let timestamp = new Date().getTime() / 1000;
    // console.log(timestamp);
    // var oldTime = new Date.getTime() / 1000;
    // console.log(timestamp);
    // var newDate = new Date(parseInt(timestamp1) * 1000)
    //   .toLocaleString()
    //   .replace(/:\d{1,2}$/, " ");
    // console.log(newDate);

    // var timestamp = new Date().valueOf();
    // let timestamp1 = `${timestamp}`;
    // let date = timestamp1.slice(0, 10);

    // var obj = new Object();
    // obj.a = "a"; // 要保存的变量
    // obj.time = 300; // 过期时间
    // obj.stamp = parseInt(date); // 保存变量时的那个时间点，这里以时间戳为例
    // let objString = JSON.stringify(obj);
    // localStorage.setItem("data", objString);

    // let b = window.localStorage.getItem("data");
    // let c = JSON.parse(b); // 将 JSON 字符串转成对象
    // let d = c.time;
    // let e = c.date;
    let b = window.localStorage.getItem("data");
    console.log(b);
    if (b === null) {
      let timestamp = new Date().valueOf();
      let timestamp1 = `${timestamp}`;
      let date = timestamp1.slice(0, 10);
      var obj = new Object();
      obj.a = "a"; // 要保存的变量
      obj.time = 300; // 过期时间
      obj.stamp = parseInt(date); // 保存变量时的那个时间点，这里以时间戳为例
      let objString = JSON.stringify(obj);
      localStorage.setItem("data", objString);
      // parseInt(d) + parseInt(e) < "当前时间戳"
      // 如果 date + time 小于当前时间的时间戳，说明已经超过3600秒的时效时间
    } else {
      console.log(1);
      let timestamp = new Date().valueOf();

      let timestamp1 = `${timestamp}`;
      let date = timestamp1.slice(0, 10);
      let c = JSON.parse(b);
      if (parseInt(c.time) + parseInt(c.stamp) < parseInt(date)) {
        console.log("过期了");
        let timestamp = new Date().valueOf();
        let timestamp1 = `${timestamp}`;
        let date = timestamp1.slice(0, 10);
        var obj = new Object();
        obj.a = "a"; // 要保存的变量
        obj.time = 300; // 过期时间
        obj.stamp = parseInt(date); // 保存变量时的那个时间点，这里以时间戳为例
        let objString = JSON.stringify(obj);
        localStorage.setItem("data", objString);
      } else {
        console.log("没有过期");
      }
      // 如果 date + time 大于当前时间戳，说明没过期
      // 22     let f= c.a;    // 之前保存的变量值
      // 然后要怎么用就怎么用
    }
  }
};
</script>
<style lang="less" scoped>
</style>