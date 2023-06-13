<template>
  <Transition name="tran-1" mode="out-in">
    <div id="alter" v-if="alterState">
      <p>{{ alterMsg }}</p>
    </div>
  </Transition>
</template>
<script>
import { yumaoStore } from "../store";
import { storeToRefs } from "pinia";
import { isRef, toRef, toRefs, watch } from "vue";
export default {
  setup() {
    let store = yumaoStore();
    let state = storeToRefs(store);
    watch(state.alterState, () => {
      setTimeout(() => {
        state.alterState.value = 0;
      }, state.alterWait.value);
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
#alter {
  position: fixed;
  z-index: 3;
  left: 50%;
  transform: translateX(-50%);
  top: 10px;
  color: rgb(14, 14, 14);
  background: white;
  padding: 5px 14px;
  text-align: center;
  border-radius: 3px;
  font-size: 15px;
  box-shadow: 0 0 3px 3px rgba(245, 241, 241, 0.1);
}
.tran-1-enter-active,
.tran-1-leave-active {
  transition: all 0.5s;
}
.tran-1-enter-from,
.tran-1-leave-to {
  opacity: 0;
}
</style>