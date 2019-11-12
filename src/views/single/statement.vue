<template>
  <div class="qr-code-box" ref="imageToFile">
    <!-- <vue-qr :logoSrc="config.logo" :text="config.value" class="qr-code-pic" :correctLevel="3" :margin="0"
            :dotScale="0.5"></vue-qr> -->
        <div>fhdsakjfhdjsfhdasjkfhdsjk</div>
    <button type="button" class="shot-btn" @click="screenShot">截图</button>

    <img :src="img" v-if="img"/>
  </div>
</template>

<script>
//   import VueQr from 'vue-qr';
  import html2canvas from 'html2canvas'

  export default {
    data() {
      return {
        config: {
          value: '',
          logo: require('@/assets/action-icon-1@2x.png')
        },
        img: ""
      }
    },
    mounted() {
      this.config.value = "https://www.baidu.com/";
    },
    methods: {
      screenShot() {
          this.$nextTick()
        html2canvas(this.$refs.imageToFile, {
          width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
          height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        }).then((canvas) => {// 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
          this.img = canvas.toDataURL('image/png');
        })
      },
    },
    components: {
    //   VueQr,
      html2canvas
    }
  }
</script>