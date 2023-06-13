<template>
  <router-view v-slot="{ Component }">
    <Transition name="tran-00" mode="out-in">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </Transition>
  </router-view>
  <Login />
  <!-- <div class="mask" v-if="showMask">正在等待字体完成加载,请稍等...🤯🥵</div> -->
</template>

<script setup>
import { yumaoStore } from "./store";
import { storeToRefs } from "pinia";
import { isRef, onMounted, reactive, ref, watch } from "vue";
import Login from "./components/Login.vue";
import indexApi from "@/axios";

let store = yumaoStore();
let { userInfo, adminInfo, isLogin, allBook, adminIsLogin } =
  storeToRefs(store);
let showMask = ref(true);

watch(
  userInfo,
  (n) => {
    localStorage.setItem("userInfo", JSON.stringify(n));
  },
  { deep: true }
);

watch(
  adminInfo,
  (n) => {
    localStorage.setItem("adminInfo", JSON.stringify(n));
  },
  { deep: true }
);

onMounted(async () => {
  if (localStorage.getItem("userInfo")) {
    userInfo.value = JSON.parse(localStorage.getItem("userInfo"));
    isLogin.value = 1;
  } else if (localStorage.getItem("adminInfo")) {
    adminInfo.value = JSON.parse(localStorage.getItem("adminInfo"));
    adminIsLogin.value = 1;
  }
  let temp = await indexApi.getAllBook(100);
  allBook.value = temp.data;

  // let fontLoad = new FontFace("yumao-font", "url(/src/assets/fonts/yumao.TTF)");
  // fontLoad.load().then(() => {
  //   console.log("字体加载完成");
  //   showMask.value = false
  // });
});
</script>
<script>
console.log("App.vue");
</script>

<style lang='less'>
body,
html {
  width: 100%;
  max-width: 2600px;
  min-width: 1100px;
  margin: 0 auto;
}
.tran-00-enter-active,
.tran-00-leave-active {
  transition: all 0.8s;
}
.tran-00-enter-from,
.tran-00-leave-to {
  opacity: 0.5;
}
.mask {
  position: fixed;
  z-index: 8;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: white;
}
</style>