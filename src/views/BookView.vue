<template>
  <div id="BookView">
    <div id="bookHeader">
      <div class="header-1">
        <p @click="goIndex">首页</p>
      </div>
    </div>
    <div id="bookMainer">
      <div :class="'main ' + flexStyle">
        <div class="image lazyImg">
          <img
            :src="getImgUrl('mini.webp')"
            :data-src="getImgUrl(currentBook.image)"
          />
          <i
            :style="{
              background: `rgb(${currentBook.extra.color})`,
            }"
          ></i>
        </div>
        <div class="info">
          <p class="name">{{ currentBook.name }}</p>
          <p class="des">
            {{ currentBook.des }}
          </p>
          <p class="data">
            <em v-if="buyNum"
              ><i class="yumao icon-yifahuo"></i><i>{{ buyNum }}</i></em
            >
            <em v-if="collectNum"
              ><i class="yumao icon-shoucang1"></i><i>{{ collectNum }}</i></em
            >
            <em
              ><i class="yumao icon-shijian"></i
              ><i>{{ currentBook.time }}</i></em
            >
            <em
              ><i class="yumao icon-wode"></i
              ><i>{{ currentBook.username }}</i></em
            >
          </p>
          <p class="price">
            <span>
              <em class="digital">¥</em>
              <em class="num">{{ totalPrice }}</em>
              <el-input-number
                v-model="num"
                :min="1"
                :max="10"
                @change="handleChange"
                class="inputNumber"
              />
            </span>
            <span>
              <em @click="buy" class="buy"
                ><i class="yumao icon-daifukuan"></i><i>购买</i></em
              >
              <em @click="collect" class="collect"
                ><i class="yumao icon-gouwuche"></i><i>{{ hasCollect }}</i></em
              >
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { yumaoStore } from "@/store";
import { storeToRefs } from "pinia";
import { reactive, ref, computed, onMounted, isRef } from "vue";
import indexApi from "@/axios/index";
import { ElMessage } from "element-plus";
import { isNumber } from "@vueuse/shared";

let router = useRouter();
let route = useRoute();
let store = yumaoStore();
let { bid } = route.params;
let { throttle, debounce, inClient, swapAttr } = store;
let { userInfo, isLogin, allBook, showLogin } = storeToRefs(store);
let num = ref(1);
let hasCollect = ref("收藏");
let currentBook = reactive(allBook.value.filter((v) => v.id == bid))[0];
let buyNum = ref(currentBook.extra.buyNum);
let lookNum = ref(currentBook.extra.lookNum);
let collectNum = ref(currentBook.extra.collectNum);
let extraFiled = JSON.stringify({
  color: "123,123,123",
  state: 1,
  buyNum: 0,
  lookNum: 0,
  collectNum: 0,
});
let flexStyle = ref("horizontal");
flexStyle.value = currentBook.extra.ratio > 1 ? "horizontal" : "vertical";

let goIndex = () => {
  router.push({ name: "index" });
};
let getImgUrl = (v) => {
  return new URL(`../assets/images/${v}`, import.meta.url).href;
};
let handleChange = (v) => {
  // console.log(v);
};
let goBook = (bid) => {
  currentBook = allBook.value.filter((v) => bid == v.id)[0];
  num.value = 1;
  setCollectText();
  router.push({
    path: "/book/" + bid,
  });
};
let buy = async () => {
  let book = currentBook;
  let user = userInfo.value;
  let id = book.id;
  let price = book.price;
  let _num = num.value;
  let myPrice = user.price;
  let goodsPrice = price * _num;
  if (isLogin.value) {
    if (goodsPrice > myPrice)
      ElMessage({
        showClose: true,
        message: "余额不足🥵",
        type: "error",
        duration: 2000,
      });
    else {
      let { state, price } = await indexApi.buyGoods(id, 1, _num);
      userInfo.value.price = price;
      if (state == 200) {
        ++buyNum.value;
        ++userInfo.value.buyNum;
        ElMessage({
          showClose: true,
          message: "购买成功😎",
          type: "success",
          duration: 2000,
        });
      } else
        ElMessage({
          showClose: true,
          message: "余额不足😎",
          type: "error",
          duration: 2000,
        });
    }
  } else {
    ElMessage({
      showClose: true,
      message: "请先登录 🤔",
      type: "info",
      duration: 2000,
    });
    showLogin.value = 1;
  }
};
let collect = async () => {
  if (!isLogin.value) {
    showLogin.value = 1;
    ElMessage({
      showClose: true,
      message: "请先登录 🤔",
      type: "info",
      duration: 2000,
    });
    return;
  }
  let gid = currentBook.id;
  if (hasCollect.value == "已收藏") return;
  let { state } = await indexApi.loveGoods(gid);
  if (state == 200) {
    let loveStr = "";
    if (userInfo.value.love == null) loveStr = gid + "";
    else loveStr = userInfo.value.love + `,${gid}`;
    userInfo.value.love = loveStr;
    hasCollect.value = "已收藏";
    ++collectNum.value;
    ++userInfo.value.collectNum;
    ElMessage({
      showClose: true,
      message: "收藏成功😎",
      type: "success",
      duration: 2000,
    });
  }
};
let setCollectText = () => {
  if (isLogin.value) {
    if (userInfo.value.love !== null)
      if (
        userInfo.value.love
          .toString()
          .split(",")
          .includes(currentBook.id.toString())
      )
        hasCollect.value = "已收藏";
      else hasCollect.value = "收藏";
  }
};

let totalPrice = computed(() => {
  let money = parseInt(num.value * currentBook.price * 100) / 100;
  return money;
});

onMounted(() => {
  setTimeout(() => {
    let lazyImg = () => {
      console.log(1);
      let imgDoms = document.querySelectorAll(".lazyImg");
      for (let a = 0; a < imgDoms.length; a++) {
        let dom = imgDoms[a];
        let imgDom = imgDoms[a].querySelector("img");
        let iDom = imgDoms[a].querySelector("i");
        if (dom.getAttribute("imgLoad")) continue;
        if (inClient(dom) && !dom.getAttribute("imgSwap")) {
          swapAttr(imgDom, "data-src", "src");
          dom.setAttribute("imgSwap", 1);
          imgDom.onload = () => {
            iDom.style.opacity = 0;
            dom.setAttribute("imgLoad", 1);
          };
        }
      }
    };
    lazyImg();
    setCollectText();
  }, 1000);
});
</script>

<style lang="less">
#BookView {
  width: 100%;
  height: 50px;
  box-shadow: 0 3px 3px 1px rgba(214, 210, 210, 0.2);
  background: white;
  .lazyImg {
    position: relative;
    img,
    i {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 1;
      object-fit: cover;
      border-radius: 5px;
      transition: all 1s;
    }
    i {
      opacity: 1;
    }
  }
  .inputNumber {
    width: 120px;
    height: 30px;
    margin-right: 15px;
  }
  #bookHeader {
    width: 95%;
    height: 50px;
    margin: 0 auto;
    line-height: 50px;
    .header-1 {
      float: left;
      p {
        cursor: pointer;
        margin-right: 20px;
         color: rgb(111, 109, 109);
      }
    }
  }
  #bookMainer {
    width: 70%;
    max-width: 1300px;
    margin: 20px auto 0 auto;
    display: flex;
    justify-content: center;
    .main {
      width: 100%;
      display: flex;
      flex-direction: column;
      .image {
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 5px;
        }
      }
      .info {
        .name {
          width: 90%;
          font-size: 23px;
          color: rgb(20, 19, 19);
          margin-bottom: 5px;
        }
        .des {
          color: rgb(50, 47, 47);
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 3;
        }
        .data {
          display: flex;
          justify-content: flex-end;
          color: rgb(123, 117, 117);
          font-size: 12px;
          margin-bottom: 18px;
          width: 100%;
          em {
            display: flex;
            align-items: center;
            margin-left: 20px;
            i {
              margin-left: 5px;
            }
          }
        }
        .price {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-bottom: 15px;
          width: 100%;
          > span {
            display: flex;
            flex-grow: 1;
            border: 1px soli gray;
          }
          > span:nth-of-type(1) {
            align-items: center;
            .digital {
              font-size: 14px;
              margin-right: 8px;
            }
            .num {
              margin-right: 30px;
              width: 30px;
            }
          }
          > span:nth-of-type(2) {
            justify-content: flex-end;
            color: rgb(62, 58, 58);
            em {
              display: flex;
              align-items: center;
              margin-left: 30px;
              transition: all 0.8s;
              cursor: pointer;
              i:nth-of-type(1) {
                font-size: 23px;
                margin-right: 5px;
              }
              &:hover {
                color: rgb(0, 174, 236);
              }
            }
          }
        }
      }
    }
    .horizontal {
      justify-content: space-between;
      flex-direction: row;
      .image {
        width: 45%;
        height: 550px;
      }
      .info {
        position: relative;
        width: 50%;
        .name {
          margin-bottom: 20px;
        }
        .des {
          line-height: 23px;
        }
        .data {
          position: absolute;
          bottom: 35px;
        }
        .price {
          position: absolute;
          bottom: -15px;
        }
      }
    }
    .vertical {
      width: 80%;
      .image {
        margin-top: 15px;
        margin-bottom: 20px;
        width: 100%;
        height: 300px;
      }
      .info {
        width: 100%;
      }
    }
  }
}
</style>