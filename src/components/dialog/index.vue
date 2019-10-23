<template>
  <transition name="dialog-fade">
    <div class="dialog-wrapper" v-if="visible" style="z-index: 9527">
      <div class="dialog-content">
        <div class="dialog-header">
          <h5 class="dialog-title">
            <slot name="title">{{ title }}</slot>
          </h5>
        </div>
        <div class="dialog-body">
          <slot></slot>
        </div>
        <div class="dialog-foter">
          <a href="javascript:;" @click="_onCancel">取消</a>
          <a href="javascript:;" @click="_onConfirm">确定</a>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "qxdialog",
  props: {
    title: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    _onCancel() {
      this.$emit("on-cancel", false);
    },
    _onConfirm() {
      this.$emit("on-confirm");
    }
  }
};
</script>
<style lang="less">
.dialog-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 80%;
  z-index: 1000;
  text-align: center;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.3);
  transform: translate3d(-50%, -50%, 0);
}
.dialog-title {
  font-size: 32px;
  position: relative;
  text-align: center;
  padding: 30px 0;
}

.dialog-body {
  margin: 30px 0;
}

.dialog-foter {
  font-size: 32px;
  display: flex;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #e5e5e5;
    color: #e5e5e5;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    z-index: 2;
  }
  > a {
    flex: 1;
    padding: 30px 0;
    position: relative;
  }
}

.dialog-fade-enter-active {
  animation: dialog-fade-in 0.2s;
}
.dialog-fade-leave-active {
  animation: dialog-fadde-out 0.2s;
}

@keyframes dialog-fade-in {
  0% {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.7);
  }
  100% {
    opacity: 1;
    transform: translate3d(-50%, -50%, 0) scale(1);
  }
}
@keyframes dialog-fadde-out {
  0% {
    opacity: 1;
    transform: translate3d(-50%, -50%, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.7);
  }
}
</style>
