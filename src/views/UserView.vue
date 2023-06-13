<template>
  <div id="UserView">
    <div id="userHeader">
      <div class="header-1">
        <em @click="goIndex">首页</em>
        <em @click="userLoginOut">退出</em>
      </div>
    </div>
    <div id="userBacker">
      <div class="backImg lazyImg">
        <img src="../assets/images/header-1.jpg" />
      </div>
      <div class="backInfo">
        <p class="profile lazyImg">
          <img :src="getImgUrl(userInfo.profile)" />
        </p>
        <p class="userInfo">
          <em class="name">{{ userInfo.name }}</em>
          <em class="time">{{ userInfo.time }} 加入</em>
        </p>
      </div>
    </div>
    <div id="userNaver">
      <div class="nav-left">
        <p v-for="(v, i) in navData" :key="v.icon" @click="show(v.show, i)">
          <em :class="'yumao ' + v.icon"></em>
          <em>{{ v.text }}</em>
        </p>
        <em class="scrollbar"></em>
      </div>
      <div class="nav-right">
        <p>
          <em>余额量</em>
          <em>{{ userInfo.price }}</em>
        </p>
        <p>
          <em>购买量</em>
          <em>{{ userInfo.buyNum }}</em>
        </p>
        <p>
          <em>收藏量</em>
          <em>{{ userInfo.collectNum }}</em>
        </p>
        <!-- 
        <p>
          <em>浏览量</em>
          <em>{{ userInfo.lookNum }}</em>
        </p> -->
      </div>
    </div>
    <div id="userOrder">
      <div class="orderLeft">
        <Transition name="tran-8" mode="out-in">
          <Suspense>
            <component :is="setComponent(userWhere)"></component>
          </Suspense>
        </Transition>
      </div>
      <div class="orderRight">
        <div id="userNotice">
          <p class="title">
            <i>公告:</i><i>{{ noticesIndex }}/{{ notices.length }}</i>
          </p>
          <div class="main">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(v, i) in notices" :key="v.id">
                  {{ v.message }}<em @click="konwNotice(v.id, i)">我知道了</em>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="userInfo">
          <p class="title"><i>个人资料:</i><i @click="save">保存</i></p>
          <div class="main">
            <p>
              <i>UID:</i>
              <input type="text" v-model="user.id" disabled />
            </p>
            <p>
              <i>地址:</i>
              <input type="text" v-model="user.address" maxlength="25" />
            </p>
            <p>
              <i>账号:</i>
              <input type="text" v-model="user.username" maxlength="15" />
            </p>
            <p>
              <i>用户名:</i>
              <input type="text" v-model="user.name" maxlength="15" />
            </p>
            <p>
              <i>旧密码:</i>
              <input type="password" v-model="oldPassword" maxlength="15" />
            </p>
            <p>
              <i>新密码:</i>
              <input type="password" v-model="newPassword" maxlength="15" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MyGoods from "../components/user/MyGoods.vue";
import MySend from "../components/user/MySend.vue";
import MyLove from "../components/user/MyLove.vue";
import MyOrder from "../components/user/MyOrder.vue";
import { useRouter, useRoute } from "vue-router";
import { yumaoStore } from "../store";
import { storeToRefs } from "pinia";
import { nextTick, onMounted, onUpdated, provide, reactive, ref } from "vue";
import Swiper, { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/swiper.min.css";
import indexApi from "@/axios";
import { ElMessage } from "element-plus";

let router = useRouter();
let route = useRoute();
let store = yumaoStore();
let { userLoginOut } = store;
let { userInfo, userWhere } = storeToRefs(store);
let navData = reactive([
  {
    icon: "icon-daifahuo1",
    text: "订单",
    show: "MyOrder",
  },
  {
    icon: "icon-shoucang1",
    text: "收藏",
    show: "MyLove",
  },
  {
    icon: "icon-dianpu",
    text: "我的",
    show: "MyGoods",
  },
  {
    icon: "icon-biaodan",
    text: "发布",
    show: "MySend",
  },
]);
let oldPassword = ref("");
let newPassword = ref("");
let user = JSON.parse(JSON.stringify(userInfo.value));
let noticesIndex = ref(1);
let data = await indexApi.getNotice();
let notices = reactive(data);
let swiper;

let goIndex = () => {
  router.push({ name: "index" });
};
let show = (v, i) => {
  userWhere.value = v;
  document.querySelector(".scrollbar").style.left = i * 87 + 17.5 + "px";
};
let setComponent = (val) => {
  let temp = MyOrder;
  if (val == "MyOrder") temp = MyOrder;
  else if (val == "MyLove") temp = MyLove;
  else if (val == "MySend") temp = MySend;
  else if (val == "MyGoods") temp = MyGoods;
  return temp;
};
let getImgUrl = (v) => {
  return new URL(`../assets/images/${v}`, import.meta.url).href;
};
let save = async () => {
  if (oldPassword.value.length < 0) {
    ElMessage({
      showClose: true,
      message: "旧密码好像不对 😥",
      type: "error",
      duration: 2000,
    });
  } else {
    let temp = {
      ...user,
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    };
    let data = await indexApi.editUser(temp);
    let { state } = data;
    if (state == 500) {
      ElMessage({
        showClose: true,
        message: "旧密码好像不对 😥",
        type: "error",
        duration: 2000,
      });
    } else if (state == 400) {
      ElMessage({
        showClose: true,
        message: "账号已经存在 😋",
        type: "error",
        duration: 2000,
      });
    } else if (state == 300) {
      ElMessage({
        showClose: true,
        message: "用户名已经存在 😥",
        type: "error",
        duration: 2000,
      });
    } else if (state == 200) {
      userInfo.value = data;
      ElMessage({
        showClose: true,
        message: "修改成功 😋",
        type: "success",
        duration: 2000,
      });
    }
  }
};
let konwNotice = async (id, i) => {
  notices.splice(i, 1);
  swiper.destroy();
  noticesIndex.value = notices.length ? 1 : 0;
  swiper = new Swiper(".swiper-container", {
    module: [Autoplay],
    on: {
      slideChangeTransitionStart(e) {
        noticesIndex.value = e.realIndex + 1;
      },
    },
  });
  let data = await indexApi.konwNotice(id);
  console.log(data);
};

onMounted(() => {
  setTimeout(() => {
    swiper = new Swiper(".swiper-container", {
      module: [Autoplay],
      on: {
        slideChangeTransitionStart(e) {
          noticesIndex.value = e.realIndex + 1;
        },
      },
    });
    let i = 0;
    if (userWhere.value == "MyOrder") i = 0;
    else if (userWhere.value == "MyLove") i = 1;
    else if (userWhere.value == "MyGoods") i = 2;
    else if (userWhere.value == "MySend") i = 3;
    document.querySelector(".scrollbar").style.left = i * 87 + 17.5 + "px";
  }, 1000);
  let inputs = document.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].oninput = () => {
      inputs[i].value = inputs[i].value.replace(/\s+/g, "");
    };
  }
});
onUpdated(() => {
  oldPassword.value = oldPassword.value.replace(/\W+/g, "");
  newPassword.value = newPassword.value.replace(/\W+/g, "");
});
</script>


<style lang="less">
#UserView {
  width: 100%;
  height: 50px;
  box-shadow: 0 3px 3px 1px rgba(214, 210, 210, 0.2);
  background: white;
  #userHeader {
    width: 95%;
    height: 50px;
    margin: 0 auto;
    line-height: 50px;
    .header-1 {
      float: left;
      em {
        cursor: pointer;
        margin-right: 20px;
         color: rgb(111, 109, 109);
      }
    }
  }
  #userBacker {
    position: relative;
    width: 85%;
    height: 200px;
    margin: 0 auto;
    max-width: 1300px;
    .backImg {
      position: absolute;
      z-index: -1;
      top: 0;
      width: 100%;
      height: 200px;
      margin: 0 auto;
      overflow: hidden;
      img {
        width: 100%;
        height: auto;
        // object-fit: cover;
        // filter: blur(px);
      }
    }
    .backInfo {
      position: absolute;
      left: 2%;
      bottom: 5%;
      width: 100%;
      display: flex;
      align-items: center;
      .profile {
        width: 65px;
        height: 65px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(146, 138, 138, 0.4);
        border-radius: 50%;
        margin-right: 10px;
        img {
          width: 92%;
          height: 92%;
          border-radius: 50%;
        }
      }
      .userInfo {
        color: white;
        display: flex;
        flex-direction: column;
        em:nth-of-type(1) {
          margin-bottom: 10px;
        }
        em:nth-of-type(2) {
          color: rgba(197, 187, 187, 0.8);
          font-size: 13px;
        }
      }
    }
  }
  #userNaver {
    width: 85%;
    height: 55px;
    max-width: 1300px;
    margin: 0 auto 15px auto;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background: white;
    border-left: 0.5px solid rgba(151, 148, 148, 0.15);
    border-right: 0.5px solid rgba(151, 148, 148, 0.15);
    border-bottom: 0.5px solid rgba(151, 148, 148, 0.15);
    .nav-left {
      position: relative;
      display: flex;
      align-items: center;
      height: 100%;
      width: 40%;
      float: left;
      > p {
        height: 100%;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 30px;
        em {
          transition: all 0.8s;
        }
        em:nth-of-type(1) {
          margin-right: 10px;
        }
        em:nth-of-type(2) {
          font-size: 15px;
        }
      }
      > p:nth-of-type(1) {
        margin-left: 15px;
      }
      .scrollbar {
        position: absolute;
        left: 17.5px;
        // left: 104.5px; //87
        bottom: 1px;
        width: 53px;
        height: 2px;
        border-radius: 2px;
        background: skyblue;
        transition: all 0.5s;
      }
    }
    .nav-right {
      float: right;
      display: flex;
      align-items: center;
      display: flex;
      justify-content: flex-end;
      height: 100%;
      width: 40%;
      > p {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 20px;
        cursor: pointer;
        transition: all 0.8s;
        em {
          transition: all 0.8s;
        }
        em:nth-of-type(1) {
          margin-bottom: 5px;
          font-size: 14px;
          color: gray;
        }
        em:nth-of-type(2) {
          font-size: 13px;
          color: rgb(30, 28, 28);
        }
      }
      > p:nth-last-of-type(1) {
        margin-right: 15px;
      }
    }
  }
  #userOrder {
    width: 85%;
    max-width: 1300px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .orderLeft {
      width: 65%;
      background: white;
      border: 0.5px solid rgba(151, 148, 148, 0.15);
      height: 600px;
      margin-bottom: 30px;
      border-radius: 5px;
      overflow: hidden;
      > div {
        width: 100%;
        height: 100%;
        > .main {
          height: 85%;
        }
      }
    }
    .orderRight {
      width: 33%;
      #userNotice {
        width: 100%;
        height: 200px;
        background: white;
        border-radius: 3px;
        margin-bottom: 18px;
        border: 0.5px solid rgba(88, 86, 86, 0.1);
        .title {
          display: flex;
          justify-content: space-between;
          height: 30px;
          line-height: 30px;
          border-bottom: 1px solid rgb(211, 203, 203);
          width: 90%;
          margin: 10px auto 10px auto;
          i:nth-of-type(2) {
            font-size: 14px;
            color: rgb(71, 66, 66);
          }
        }
        .main {
          width: 90%;
          height: 120px;
          margin: 0 auto;
          // border: 1px solid gray;
          overflow: hidden;
          div {
            width: 100%;
            height: 100%;
            cursor: pointer;
            .swiper-slide {
              position: relative;
              width: 100%;
              height: 100%;
              em {
                position: absolute;
                right: 10px;
                bottom: 10px;
                padding: 3px 10px;
                border-radius: 2px;
                background: gray;
                color: white;
                font-size: 13px;
                cursor: pointer;
              }
            }
          }
        }
      }
      #userInfo {
        width: 100%;
        background: white;
        border-radius: 3px;
        border: 0.5px solid rgba(88, 86, 86, 0.1);
        .title {
          display: flex;
          justify-content: space-between;
          height: 30px;
          line-height: 30px;
          border-bottom: 1px solid rgb(211, 203, 203);
          width: 90%;
          margin: 10px auto 10px auto;
          i:nth-of-type(2) {
            font-size: 14px;
            cursor: pointer;
            color: rgb(71, 66, 66);
          }
        }
        .main {
          width: 90%;
          margin: 0 auto;
          overflow: hidden;
          > p {
            width: 80%;
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            // border: 1px solid gray;
            i {
              font-size: 14px;
            }
            input {
              height: 25px;
              width: 80%;
              // border: 1px solid rgb(159, 154, 154);
              padding: 0 5px;
              box-sizing: border-box;
              border-radius: 1.5px;
              transition: all 1s;
            }
          }
        }
      }
    }
  }
}

.tran-8-enter-active,
.tran-8-leave-active {
  transition: all 0.5s;
}
.tran-8-enter-from,
.tran-8-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>