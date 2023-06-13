<template>
  <div id="IndexView">
    <div id="indexHeader">
      <p class="backImg lazyImg">
        <img :src="getImgUrl(indexInitData.headImg)" />
      </p>
      <div>
        <div class="header-1">
          <p v-if="!isLogin && !adminIsLogin" @click="showLogin = true">登陆</p>
          <p v-else @click="goUserDetail()">{{ userInfo.name }}</p>
          <p v-if="adminIsLogin" @click="goAdmin">管理员</p>
        </div>
        <div class="header-2">
          <div>
            <div class="search">
              <input
                type="text"
                maxlength="15"
                size="15"
                placeholder="搜点什么吧 🧐"
                v-model="keySearchText"
                @keydown.enter="keySearch"
              />
              <i class="yumao icon-sousuo" @click="keySearch"></i>
            </div>
          </div>
        </div>
        <div class="header-3">
          <p class="profile lazyImg">
            <img src="../assets/images/default.jpg" />
          </p>
          <p
            v-for="(v, i) in topData1"
            :key="i"
            @click="goUserDetail(v.where)"
            @mouseenter="moveEnter($event)"
            @mouseleave="moveLeave($event)"
          >
            <em :class="'yumao ' + v.icon + ' ' + i"></em>
            <em>{{ v.text }}</em>
          </p>
        </div>
      </div>
    </div>
    <div id="indexSorter">
      <div class="sort-1">
        <i v-for="(v, i) in sort1" :key="i" @click="sortSearch(v)">{{ v }}</i>
      </div>
      <div class="sort-2">
        <div>
          <p class="content">
            {{ notice.message }}
          </p>
          <p class="other">
            <em class="time"
              ><i>{{ notice.time }}</i></em
            >
          </p>
        </div>
      </div>
    </div>
    <div id="indexBanner">
      <div class="banner-1">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div
              class="swiper-slide lazyImg"
              v-for="(v, i) in swiperData"
              :key="i"
              :id="i"
            >
              <img :src="getImgUrl(v.image)" />
              <i></i>
            </div>
          </div>
          <i
            class="swiper-mask"
            :style="{ background: `rgb(${swiperColor})` }"
            @click="goBook(swiperBookId)"
          ></i>
        </div>
        <div class="swiper-bootom">
          <div class="swiper-des">
            <p>{{ swiperDes }}</p>
            <p><em class="prevEl">&lt;</em><em class="nextEl">&gt;</em></p>
          </div>
          <p class="swiper-pagination">
            <em> </em>
          </p>
        </div>
      </div>
      <div class="banner-2">
        <!-- <div class="book-recommend"> -->
        <div :class="'item-' + v.id" v-for="(v, i) in recommendData" :key="i">
          <div class="lazyImg recommendLazyImg">
            <img
              :src="getImgUrl('mini.webp')"
              :data-src="getImgUrl(v.image)"
              @click="goBook(v.id)"
            />
            <i
              :style="{
                background: `rgba(${v.extra.color},1)`,
              }"
            ></i>
          </div>
          <div class="bookDes" @click="goBook(v.id)">{{ v.des }}</div>
          <div class="bookTag" v-if="!v.extra.dataTag">
            <em :class="i1" v-for="(v1, i1) in v.extra.dataTag" :key="i1">{{
              v1
            }}</em>
            <em class="dataTags">
              <i
                v-for="(v2, i2) in v.tagData"
                :key="i2"
                :style="{
                  color: `rgba(${v2.color},1)`,
                  background: `rgba(${v2.color},.1)`,
                }"
                >{{ v2.text }}</i
              >
            </em>
            <em class="dataSort">{{ v.sort }}</em>
          </div>
        </div>
        <!-- </div> -->
      </div>
      <!-- <div class="change-book">
        <i class="yumao icon-sousuo"></i>
        <i>换一换</i>
      </div> -->
    </div>
    <div id="indexSearch" v-if="showSearch">
      <p>
        <em class="title">搜索结果:{{ searchData.length }}条数据</em>
        <em class="cancel" @click="cancelSearch">取消搜索</em>
      </p>
      <div>
        <div :id="'book-' + v.id" v-for="(v, i) in searchData" :key="i">
          <div class="lazyImg">
            <img :src="getImgUrl(v.image)" @click="goBook(v.id)" />
            <i></i>
          </div>
          <div class="bookDes" @click="goBook(v.id)">{{ v.des }}</div>
          <div class="bookTag">
            <em :class="i1" v-for="(v1, i1) in v.extra.dataTag" :key="i1">{{
              v1
            }}</em>
            <em class="dataSort">{{ v.sort }}</em>
          </div>
        </div>
      </div>
    </div>
    <div id="indexLister">
      <p>
        <em class="title">书籍推荐</em>
      </p>
      <div>
        <div :id="'book-' + v.id" v-for="(v, i) in randomBook" :key="i">
          <div class="lazyImg test">
            <img
              :src="getImgUrl('mini.webp')"
              :data-src="getImgUrl(v.image)"
              @click="goBook(v.id)"
            />
            <i></i>
          </div>
          <div class="bookDes" @click="goBook(v.id)">{{ v.des }}</div>
          <div class="bookTag">
            <em
              :class="i1"
              v-for="(v1, i1) in v.tagData"
              :key="i1"
              :style="{
                color: `rgba(${v1.color},1)`,
                background: `rgba(${v1.color},.1)`,
              }"
              >{{ v1.text }}</em
            >
            <em class="dataSort">{{ v.sort }}</em>
          </div>
        </div>
      </div>
    </div>
    <div id="indexMasker">
      <p class="mask-1" v-for="(v, i) in 10" :key="i">
        <em></em>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </p>
    </div>
  </div>
</template>

<script setup>
import _ from "lodash";
import $ from "jquery";
import "swiper/swiper.min.css";
import indexApi from "@/axios";
import { storeToRefs } from "pinia";
import { yumaoStore } from "../store";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { ref, reactive, onMounted, onUpdated } from "vue";
import Swiper, { Navigation, Pagination, Autoplay } from "swiper";

let store = yumaoStore();
let { throttle, debounce, inClient, swapAttr } = store;
let { userInfo, isLogin, showLogin, userWhere, adminIsLogin } =
  storeToRefs(store);
let router = useRouter();
let route = useRoute();
let sort1 = reactive([
  "环境",
  "科学",
  "劳动",
  "航空",
  "航天",
  "交通",
  "运输",
  "技术",
  "工业",
  "农业",
  "卫生",
  "医药",
  "生物",
  "地球",
  "天文",
  "化学",
  "数理",
  "自然",
  "劳动",
  "航空",
  "环境",
  "科学",
  "劳动",
  "航空",
  "航天",
  "交通",
  "自然",
  "劳动",
  "航空",
  "环境",
  "科学",
  "劳动",
  "航空",
  "航天",
  "交通",
]);
let indexInitData = await indexApi.indexInit();
indexInitData.book = indexInitData.book.reverse();
let swiperData = reactive(indexInitData.swiper);
let recommendData = reactive(indexInitData.recommend);
let topData1 = reactive([
  {
    icon: "icon-daifahuo",
    text: "我的订单",
    where: "MyOrder",
  },
  {
    icon: "icon-aixinD",
    text: "我的收藏",
    where: "MyLove",
  },
  {
    icon: "icon-gouwu",
    text: "我的商品",
    where: "MyGoods",
  },
  {
    icon: "icon-dianpu",
    text: "发布商品",
    where: "MySend",
  },
]);
let swiperDes = ref("加载中...🤯");
let swiperColor = ref("123,123,123");
let randomBookNum = ref(15);
let randomBook = reactive(indexInitData.book.splice(0, randomBookNum.value));
let swiperBookId = ref(0);
let keySearchText = ref("");
let searchData = reactive([]);
let showSearch = ref(0);
let notice = reactive(indexInitData.notice);

let getImgUrl = (v) => {
  return new URL(`../assets/images/${v}`, import.meta.url).href;
};
let goBook = (bid) => {
  router.push({
    path: "/book/" + bid,
  });
};
let goAdmin = () => {
  router.push({
    path: "/admin",
  });
};
let getSwiperImg = (v) => {
  return new URL(`../assets/images/${v}`, import.meta.url).href;
};
let goUserDetail = (where) => {
  if (isLogin.value) {
    userWhere.value = where;
    router.push({
      path: "/user/" + userInfo.value.id,
    });
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
let moveEnter = (e) => {
  let el = e.target.children[0];
  el.classList.add("move");
};
let moveLeave = (e) => {
  let el = e.target.children[0];
  el.classList.remove("move");
};
let autoSearch = throttle(() => {
  console.log(keySearchText.value);
}, 1000);
let keySearch = debounce(async () => {
  if (!keySearchText.value.length) return;
  let data = await indexApi.searchBook({
    text: keySearchText.value,
    mode: "keySearch",
  });
  if (!data.length) {
    ElMessage({
      showClose: true,
      message: "无数据 😅",
      type: "info",
      duration: 1500,
      customClass: "ElLeft",
    });
  } else {
    showSearch.value = 1;
    searchData = data;
    let topOffset = $("#indexLister .title").offset().top - 60;
    window.scrollTo({ top: topOffset, behavior: "smooth" });
  }
}, 800);
let sortSearch = debounce(async (v) => {
  let data = await indexApi.searchBook({
    text: v,
    mode: "sortSearch",
  });
  if (!data.length) {
    ElMessage({
      showClose: true,
      message: "无数据 😅",
      type: "info",
      duration: 1500,
      customClass: "ElLeft",
    });
  } else {
    showSearch.value = 1;
    searchData = data;
    let topOffset = $("#indexLister .title").offset().top - 60;
    window.scrollTo({ top: topOffset, behavior: "smooth" });
  }
}, 500);
let cancelSearch = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => {
    showSearch.value = 0;
    searchData = [];
  }, 1000);
};
let scrollFn = () => {
  let timer = null;
  timer = setInterval(() => {
    if (document.querySelector("#indexMasker")) {
      temp();
      clearInterval(timer);
      function temp() {
        let topOffset = $("#indexMasker").offset().top;
        if (inClient(document.getElementById("indexMasker"))) {
          if (indexInitData.book.length)
            randomBook.push(
              ...indexInitData.book.splice(0, randomBookNum.value)
            );
          setTimeout(() => {
            lazyImg();
          }, 10);
        }
      }
    }
  }, 200);
};
let lazyImg = () => {
  let imgDoms = document.querySelectorAll(".test");
  for (let a = 0; a < imgDoms.length; a++) {
    let dom = imgDoms[a];
    let imgDom = imgDoms[a].querySelector("img");
    if (dom.getAttribute("imgLoad")) continue;
    if (inClient(dom) && !dom.getAttribute("imgSwap")) {
      swapAttr(imgDom, "data-src", "src");
      dom.setAttribute("imgSwap", 1);
      imgDom.onload = () => {
        imgDom.style.opacity = 1;
        dom.setAttribute("imgLoad", 1);
      };
    }
  }
};
let recommendLazyImg = () => {
  let timer = null;
  timer = setInterval(() => {
    let imgDoms = document.querySelectorAll(".recommendLazyImg");
    if (imgDoms.length) {
      temp();
      clearInterval(timer);
    }
  }, 100);
  function temp() {
    let imgDoms = document.querySelectorAll(".recommendLazyImg");
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
  }
};
let swiperInit = () => {
  let timer = null;
  timer = setInterval(() => {
    let swiperDom = document.querySelector(".swiper-container");
    if (swiperDom != null) {
      temp();
      clearInterval(timer);
    }
  }, 100);
  function temp() {
    new Swiper(".swiper-container", {
      modules: [Navigation, Pagination, Autoplay],
      loop: true,
      autoplay: true,
      // observer: true, //修改swiper自己或子元素时，自动初始化swiper
      // observeParents: true, //修改swiper的父元素时，自动初始化swiper
      navigation: {
        prevEl: ".prevEl",
        nextEl: ".nextEl",
      },
      pagination: {
        el: ".swiper-pagination em",
        bulletElement: "i",
        clickable: true,
      },
      on: {
        slideChangeTransitionStart(e) {
          let swiperIndex = e.realIndex;
          let doms = document.querySelectorAll(".swiper-pagination em i");
          let swiperBottom = document.querySelector(".swiper-bootom");
          let color = swiperData[swiperIndex].extra.color;
          swiperBookId.value = swiperData[swiperIndex].id;
          doms.forEach((v) => {
            v.classList.remove("clickEnable");
            doms[swiperIndex].classList.add("clickEnable");
          });
          swiperDes.value = swiperData[swiperIndex].name;
          swiperColor.value = color;
        },
      },
    });
    $(".swiper-pagination em i").eq(0).addClass("clickEnable");
  }
};



onMounted(() => {
  recommendLazyImg();
  swiperInit();
  scrollFn();
  lazyImg();
  window.addEventListener("scroll", throttle(lazyImg, 500));
  window.addEventListener("scroll", throttle(scrollFn, 500));
});
onUpdated(() => {
  keySearchText.value = keySearchText.value.replace(/\s+/g, "");
});
</script>

<style lang="less">
#IndexView {
  width: 100%;
  height: 150px;
  @keyframes move {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-4px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  .move {
    animation: move linear 0.4s 1;
  }
  .lazyImg {
    position: relative;
    img,
    i {
      top: 0;
      width: 100%;
      height: 100%;
      // opacity: 1;
      object-fit: cover;
      transition: all 0.5s;
    }
    i {
      opacity: 1;
    }
  }
  .test {
    height: 130px;
    margin-bottom: 10px;
    img {
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: all 0.5s;
    }
    i {
      position: absolute;
      z-index: 3;
      width: 100%;
      height: 100%;
      top: 0;
    }
  }
  .clickEnable {
    width: 25px !important;
    opacity: 1 !important;
  }
  #indexHeader {
    position: relative;
    width: 100%;
    height: 100%;
    .backImg {
      position: absolute;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    > div {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 15px;
      z-index: 1;
      width: 95%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      font-size: 14px;
      box-shadow: 0 0 10px 10px rgba(19, 18, 18, 0.05);
      background: rgba(17, 17, 17, 0.06);
    }
    .header-1 {
      display: flex;
      p {
        margin-right: 18px;
        cursor: pointer;
      }
    }
    .header-2 {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      background: rgb(220, 219, 224);
      transition: all 1s;
      border-radius: 8px;
      opacity: 0.95;
      flex-grow: 0.5;
      max-width: 520px;
      margin-left: 350px;
      margin-right: 10px;
      &:hover {
        background: rgb(244, 243, 245);
      }
      > div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 95%;
        height: 100%;
        .search {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 100%;
          //   border: 1px solid gray;
          input {
            width: 85%;
            height: 75%;
            font-size: 14px;
            // background: rgb(227, 229, 231);
            border-radius: 5px;
            padding: 0 8px;
            padding-right: 15px;
            box-sizing: border-box;
            transition: all 1s;
            &:hover {
              background: rgb(227, 229, 231);
            }
          }

          i {
            width: 32px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            color: white;
            cursor: pointer;
            color: rgb(19, 19, 19);
            font-size: 18px;
            border-radius: 5px;
            background: transparent;
            transition: all 1s;
            font-weight: 700;
            &:hover {
              background: rgb(227, 229, 231);
            }
          }
        }
      }
    }
    .header-3 {
      display: flex;
      align-content: center;
      .profile {
        img {
          height: 40px;
          width: 40px;
          border-radius: 50%;
        }
      }
      p {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 28px;
        cursor: pointer;
        em:nth-of-type(1) {
          margin-bottom: 2px;
          font-size: 18px;
        }
      }
      p:nth-of-type(1) {
        margin-left: 0;
      }
    }
  }
  #indexSorter {
    display: flex;
    width: 90%;
    margin: 20px auto;
    max-width: 2000px;
    .sort-1 {
      width: 80%;
      height: 73px;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      i {
        display: inline-block;
        width: 68px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        background: rgb(246, 247, 248);
        margin: 5px 15px;
        margin-left: 0;
        transition: all 0.6s;
        font-size: 14px;
        border-radius: 5px;
        color: #61666d;
        cursor: pointer;
        letter-spacing: 3px;
        &:hover {
          background: rgb(227, 229, 231);
        }
      }
    }
    .sort-2 {
      display: flex;
      flex-wrap: wrap;
      color: #61666d;
      margin: 5px 0;
      width: 30%;
      .content {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-bottom: 5px;
      }
      .other {
        display: flex;
        justify-content: flex-end;
        font-size: 12px;
        em {
          margin-left: 5px;
        }
      }
    }
  }
  #indexBanner {
    position: relative;
    width: 90%;
    max-width: 2000px;
    height: 400px;
    margin: 0 auto 50px auto;
    display: flex;
    justify-content: center;
    .banner-1 {
      position: relative;
      width: 40%;
      height: 335px;
      border-radius: 8px;
      overflow: hidden;

      > div {
        width: 100%;
        height: 100%;
        img {
          object-fit: cover;
          width: 100%;
          height: 80%;
          cursor: pointer;
          vertical-align: middle;
        }
      }
      .swiper-container {
        position: absolute;
        top: 0;
      }
      .swiper-bootom {
        position: absolute;
        z-index: 4;
        bottom: 0;
        height: 70px;
        color: white;
        display: flex;
        flex-direction: column;
        transition: all 0.5s;

        > div {
          width: 100%;
        }
        .swiper-des {
          width: 90%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px auto 10px auto;
          > p:nth-of-type(2) {
            display: flex;
            em {
              width: 25px;
              height: 25px;
              line-height: 25px;
              text-align: center;
              border-radius: 5px;
              background: gray;
              color: white;
              margin: 0 3px;
              cursor: pointer;
              transition: all 0.5s;
              opacity: 0.6;
              &:hover {
                opacity: 0.8;
              }
            }
          }
        }
        .swiper-pagination {
          width: 90%;
          margin: 0 auto;
          em {
            display: flex;
            i {
              width: 15px;
              height: 8px;
              border-radius: 8px;
              background: white;
              margin-right: 10px;
              cursor: pointer;
              opacity: 0.5;
              transition: all 0.5s;
            }
          }
        }
      }
      .swiper-mask {
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: gray;
        transition: background 0.5s;
        -webkit-mask-image: linear-gradient(0, #0f56e6 22%, transparent 30%);
      }
    }
    .banner-2 {
      width: 60%;
      height: 410px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-left: 20px;
      overflow: hidden;
      > div {
        border-radius: 5px;
      }
      > div:nth-of-type(-n + 4) {
        margin-bottom: 30px;
      }
      div[class^="item-"] {
        .lazyImg {
          img {
            width: 100%;
            height: 115px;
            object-fit: cover;
            border-radius: 5px;
            margin-bottom: 8px;
            cursor: pointer;
          }
          i {
            position: absolute;
            left: 0;
            top: 0;
            height: 115px;
            background: gray;
            border-radius: 4px;
          }
        }
        .bookDes {
          width: 100%;
          height: 35px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 2;
          cursor: pointer;
          font-size: 15px;
          margin-bottom: 5px;
          transition: all 0.5s;
          &:hover {
            color: rgb(0, 174, 236);
          }
        }
        .bookTag {
          em {
            font-size: 11px;
          }
          .dataBuy {
            color: rgb(234, 30, 11);
            padding: 0 5px;
            background: rgba(246, 21, 0, 0.1);
            border-radius: 1.5px;
          }
          .dataLook {
            color: rgb(216, 183, 15);
            padding: 0 5px;
            background: rgba(216, 183, 15, 0.1);
            border-radius: 1.5px;
          }
          .dataSave {
            color: rgb(27, 1, 222);
            padding: 0 5px;
            background: rgba(27, 1, 222, 0.1);
            border-radius: 1.5px;
          }
          .dataTags {
            i {
              display: inline-block;
              margin-right: 2px;
              padding: 2px 8px;
              border-radius: 2px;
              font-size: 13px;
              transform: scale(0.83333);
              transform-origin: 0 0;
            }
          }
          .dataSort {
            color: rgb(127, 116, 116);
            cursor: pointer;
            transition: all 0.8s;
            &:hover {
              color: rgb(0, 174, 236);
            }
          }
        }
      }
    }
    .change-book {
      position: absolute;
      right: -40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 20px;
      border: 1px solid gray;
      border-radius: 4px;
      padding: 8px 5px;
      cursor: pointer;
      text-align: center;
      i:nth-of-type(1) {
        margin-bottom: 4px;
      }
      i:nth-of-type(2) {
        font-size: 3px;
      }
    }
  }
  #indexSearch {
    width: 90%;
    max-width: 2000px;
    margin: 0 auto;
    .title {
      font-size: 20px;
      margin-right: 40px;
    }
    .cancel {
      cursor: pointer;
      color: gray;
    }
    > div {
      flex-wrap: wrap;
      width: 100%;
    }
    > p {
      margin-bottom: 30px;
    }
    div[id^="book-"] {
      display: inline-block;
      margin-bottom: 50px;
      img {
        width: 100%;
        object-fit: cover;
        height: 130px;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      .bookDes {
        width: 100%;
        height: 35px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        cursor: pointer;
        font-size: 15px;
        margin-bottom: 5px;
        transition: all 0.5s;
        &:hover {
          color: rgb(0, 174, 236);
        }
      }
      .bookTag {
        em {
          margin-right: 10px;
          font-size: 11px;
        }
        .dataLove {
          color: rgb(234, 30, 11);
          padding: 0 5px;
          background: rgba(246, 21, 0, 0.1);
          border-radius: 1.5px;
        }
        .dataLook {
          color: rgb(216, 183, 15);
          padding: 0 5px;
          background: rgba(216, 183, 15, 0.1);
          border-radius: 1.5px;
        }
        .dataSave {
          color: rgb(27, 1, 222);
          padding: 0 5px;
          background: rgba(27, 1, 222, 0.1);
          border-radius: 1.5px;
        }
        .dataSort {
          color: rgb(127, 116, 116);
          cursor: pointer;
          transition: all 0.8s;
          &:hover {
            color: rgb(0, 174, 236);
          }
        }
      }
    }
  }
  #indexLister {
    width: 90%;
    max-width: 2000px;
    margin: 0 auto;
    .title {
      font-size: 20px;
    }
    > div {
      flex-wrap: wrap;
      width: 100%;
    }
    > p {
      margin-bottom: 30px;
    }

    div[id^="book-"] {
      display: inline-block;
      margin-bottom: 50px;
      img {
        width: 100%;
        object-fit: cover;
        height: 130px;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      .bookDes {
        width: 100%;
        height: 35px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        cursor: pointer;
        font-size: 15px;
        margin-bottom: 5px;
        transition: all 0.5s;
        &:hover {
          color: rgb(0, 174, 236);
        }
      }
      .bookTag {
        em {
          display: inline-block;
          margin-right: 2px;
          padding: 2px 8px;
          border-radius: 2px;
          font-size: 13px;
          transform: scale(0.83333);
          transform-origin: 0 0;
        }
        .dataSort {
          padding-left: 0;
          padding-right: 0;
          color: rgb(127, 116, 116);
          cursor: pointer;
          transition: all 0.8s;
          &:hover {
            color: rgb(0, 174, 236);
          }
        }
      }
    }
  }
  #indexMasker {
    width: 90%;
    margin: 0 auto;
    max-width: 2000px;
    display: flex;
    flex-wrap: wrap;
    opacity: 1;
    transition: all 1s;
    > p {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      margin-bottom: 50px;
      em {
        position: absolute;
        top: 30px;
        left: -60px;
        width: 220px;
        height: 20px;
        transform: rotate(-45deg);
        transition: all 1s;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0 30px 35px 35px rgba(255, 255, 255, 0.7);
        animation: yumao 2s infinite;
      }
      @keyframes yumao {
        0% {
          top: 30px;
          left: -150px;
        }
        100% {
          top: 180px;
          left: 200px;
        }
      }
      i {
        background: rgb(245, 245, 245);
        margin-bottom: 8px;
      }
      > i:nth-of-type(1) {
        width: 100%;
        height: 150px;
        border-radius: 3px;
      }
      > i:nth-of-type(2) {
        width: 90%;
        height: 20px;
        border-radius: 3px;
      }
      > i:nth-of-type(3) {
        width: 80%;
        height: 20px;
        border-radius: 3px;
      }
      > i:nth-of-type(4) {
        width: 65%;
        height: 20px;
        border-radius: 3px;
      }
    }
    > p:nth-of-type(5n) {
      margin-right: 0;
    }
  }
  @media screen and (max-width: 1919px) {
    div[id^="book-"] {
      width: 18.4%;
      margin-right: 2%;
    }
    div[id^="book-"]:nth-of-type(5n) {
      margin-right: 0;
    }
    #indexMasker {
      > p {
        width: 18.4%;
        margin-right: 2%;
      }
    }
    #indexBanner {
      .banner-1 {
        width: 40%;
      }
      .banner-2 {
        > div {
          width: 32%;
        }
      }
    }
  }
  @media screen and (min-width: 1920px) {
    div[id^="book-"] {
      width: 15.8%;
      margin-right: 1%;
    }
    div[id^="book-"]:nth-of-type(6n) {
      margin-right: 0;
    }
    #indexMasker {
      > p {
        width: 15.8%;
        margin-right: 1%;
      }
    }
    #indexBanner {
      .banner-2 {
        > div {
          width: 24%;
        }
      }
    }
  }
}
.ElLeft {
  height: 39px;
  border-radius: 7px;
  background: rgb(239, 237, 242);
  transform: translateX(-420px);
}
</style>