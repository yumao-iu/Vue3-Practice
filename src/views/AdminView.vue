<template>
  <div id="AdminView">
    <div id="adminHeader">
      <em @click="adminLoginOut">退出</em>
      <em @click="goIndex">首页</em>
    </div>
    <div id="adminMain">
      <div class="adminLeft">
        <p class="lazyImg">
          <img src="https://q4.qlogo.cn/g?b=qq&nk=202835956&s=140" />
        </p>
        <ul>
          <li
            v-for="(v, i) in asideData"
            :key="i"
            @click="componentName = v.componentName"
          >
            <em :class="'yumao ' + v.icon"></em><em>{{ v.name }}</em>
          </li>
        </ul>
      </div>
      <div class="adminRight">
        <Transition name="tran-12" mode="out-in">
          <Suspense>
            <component :is="showComponent(componentName)"></component>
          </Suspense>
        </Transition>
      </div>
    </div>
  </div>
</template>
<script setup>
import { yumaoStore } from "@/store";
import { storeToRefs } from "pinia";
import { reactive, ref, defineAsyncComponent } from "vue";
import BookData from "@/components/admin/BookData.vue";
import UserData from "@/components/admin/UserData.vue";
import SendData from "@/components/admin/SendData.vue";
import WebData from "@/components/admin/WebData.vue";
import { useRouter, useRoute } from "vue-router";
import adminApi from "@/axios/admin";

let router = new useRouter();
let route = new useRoute();
let store = yumaoStore();
let { adminLoginOut } = store;
let componentName = ref(localStorage.getItem("adminWhere"));
if (!componentName.value) componentName.value = BookData;
let asideData = reactive([
  {
    name: "书籍管理",
    icon: "icon-tongchoudingdan",
    componentName: "BookData",
  },
  {
    name: "用户管理",
    icon: "icon-wode",
    componentName: "UserData",
  },
  {
    name: "发布中心",
    icon: "icon-biaodan",
    componentName: "SendData",
  },
  {
    name: "网站设置",
    icon: "icon-shezhi1",
    componentName: "WebData",
  },
]);

let showComponent = (v) => {
  localStorage.setItem("adminWhere", v);
  let temp = BookData;
  if (v == "BookData") temp = BookData;
  else if (v == "UserData") temp = UserData;
  else if (v == "SendData") temp = SendData;
  else if (v == "WebData") temp = WebData;
  return temp;
};
let goIndex = () => {
  router.push({ name: "index" });
};
</script>
<style lang="less" scoped>
#AdminView {
  position: relative;
  width: 100%;
  height: 50px;
  background: rgb(255, 255, 255);
  box-shadow: 0 2px 10px 7px rgba(245, 242, 242, 0.6);
  #adminHeader {
    position: absolute;
    top: 0;
    width: 95%;
    height: 100%;
    margin: 0 auto;
    em {
      float: right;
      cursor: pointer;
      line-height: 50px;
      margin-left: 25px;
      color: rgb(111, 109, 109);
    }
  }
  #adminMain {
    width: 100%;
    height: 100vh;
    display: flex;
    .adminLeft {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 16%;
      height: 100%;
      background: white;
      box-shadow: 0 1px 3px 3px rgba(245, 243, 243, 0.6);
      margin-right: 4.5%;
      p {
        width: 70px;
        height: 70px;
        margin-top: 80px;
        margin-bottom: 20px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
      ul {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        li {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80%;
          cursor: pointer;
          margin-bottom: 12px;
          padding: 3px 5px;
          box-sizing: border-box;
          color: #82868b;
          transition: all 0.5s;
          border-radius: 3px;
          margin-bottom: 20px;
          &:hover {
            background: rgb(245, 246, 245);
            color: rgb(91, 87, 87);
          }
          em {
            margin: 0 10px;
          }
        }
      }
    }
    .adminRight {
      width: 75%;
      height: 85vh;
      margin-top: 80px;
      border-radius: 3px;
      display: flex;
      > div {
        box-shadow: 0 0 10px 2px rgb(242, 239, 239);
        border-radius: 5px;
      }
    }
  }
}
.tran-12-enter-active,
.tran-12-leave-active {
  transition: all 0.5s;
}
.tran-12-enter-from,
.tran-12-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>