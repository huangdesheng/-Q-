//班级列表
import {
  mapState
} from "vuex";
export default {
  computed: {
    ...mapState("queryClass", {
      classList: state => state.classList
    })
  },
}
