<template>
  <div id="webData">
    <p class="title">网站设置</p>
    <div class="main">
      <div id="c2">
        <div class="indexImage">
          <p class="title">网站首页图片</p>
          <p class="lazyImg">
            <img :src="getImgUrl(webInfo.headImg)" @click="change1" />
            <input
              type="file"
              id="headFile"
              style="display: none"
              @change="onChange1"
            />
          </p>
        </div>
        <div class="indexSwiper">
          <p class="title">网站首页轮播</p>
          <p class="input">
            <input type="text" v-model="webInfo.swiper" />
          </p>
        </div>
        <div class="indexRecommend">
          <p class="title">网站首页推荐</p>
          <p class="input">
            <input type="text" v-model="webInfo.recommend" />
          </p>
          <i class="tip">数字代表书籍ID,逗号隔开</i>
          <em @click="setWebInfo">确定保存</em>
        </div>
      </div>
      <div id="c1">
        <div>
          <p class="title">管理员账号修改</p>
          <div class="inpList">
            <i>新账号:</i>
            <input
              type="text"
              maxlength="15"
              size="15"
              v-model="inpInfo.username"
            />
          </div>
          <div>
            <i>旧密码:</i>
            <input
              type="password"
              maxlength="15"
              size="15"
              v-model="inpInfo.oldPassword"
            />
          </div>
          <div>
            <i>新密码:</i>
            <input
              type="password"
              maxlength="15"
              size="15"
              v-model="inpInfo.newPassword"
            />
          </div>
          <em @click="setAdminInfo">确定修改</em>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onUpdated, reactive } from "vue";
import { ElMessage } from "element-plus";
import { yumaoStore } from "@/store";
import { storeToRefs } from "pinia";
import "element-plus/es/components/message/style/css";
import adminApi from "@/axios/admin";

let store = yumaoStore();
let { debounce, throlle } = store;
let { userInfo } = storeToRefs(store);
let webInfo = reactive(await adminApi.getWebInfo());
let originWebInfo = JSON.parse(JSON.stringify(webInfo));
let inpInfo = reactive({
  username: "",
  oldPassword: "",
  newPassword: "",
});
let adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
let flag = "输入不能为空";
inpInfo.username = adminInfo.username;

let change1 = () => {
  let fileDom = document.getElementById("headFile");
  fileDom.click();
};
let onChange1 = () => {
  let file = document.getElementById("headFile").files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener("load", () => {
    webInfo.headImg = reader.result;
  });
};
let getColor = (img) => {
  let colorThief = new ColorThief();
  let dom = document.getElementById("cs");
  let color = colorThief.getColor(img);
  return color;
};
let setWebInfo = debounce(async () => {
  let arr = Object.keys(webInfo);
  let flag = 0;
  for (let i = 0; i < arr.length; i++) {
    let key = arr[i];
    if (originWebInfo[key] !== webInfo[key]) {
      flag = 1;
      break;
    }
  }
  if (!flag) return;
  let formData = new FormData();
  let file = document.getElementById("headFile").files[0];
  if (webInfo.headImg.length > 100) formData.append("file", file);
  formData.append("swiper", webInfo.swiper);
  formData.append("recommend", webInfo.recommend);
  let { state } = await adminApi.setWeb(formData);
  if (state == 200) {
    ElMessage({
      showClose: true,
      message: "修改成功 😋",
      type: "success",
      duration: 2000,
    });
  }
}, 1000);
let setAdminInfo = debounce(async () => {
  if (flag) {
    ElMessage({
      showClose: true,
      message: flag,
      type: "error",
      duration: 2000,
    });
  } else {
    let { data } = await adminApi.setAdminInfo(inpInfo);
    let { state } = data;
    console.log(state);
    if (state == 500) {
      ElMessage({
        showClose: true,
        message: "旧密码错误 🤡",
        type: "error",
        duration: 3000,
      });
    } else if (state == 300) {
      ElMessage({
        showClose: true,
        message: "该用户已经存在 🤡",
        type: "error",
        duration: 3000,
      });
    } else {
      localStorage.getItem("adminInfo", data.token);
      inpInfo.oldPassword = inpInfo.newPassword = "";
      ElMessage({
        showClose: true,
        message: "修改成功",
        type: "success",
        duration: 3000,
      });
    }
  }
}, 1000);
let getImgUrl = (v) => {
  if (v.length > 100) return v;
  return new URL(`../../assets/images/${v}`, import.meta.url).href;
};

onUpdated(() => {
  Object.keys(inpInfo).forEach((v) => {
    inpInfo[v] = inpInfo[v].replace(/\s/g, "");
  });
  let { username, oldPassword, newPassword } = inpInfo;
  if (!username || !oldPassword || !newPassword) {
    flag = "输入不能为空";
  } else if (
    username.length < 6 ||
    oldPassword.length < 6 ||
    newPassword.length < 6
  ) {
    flag = "输入长度必须大于六";
  } else flag = 0;
});
</script>
<style lang="less" scoped>
#webData {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  > .title {
    width: 95%;
    height: 30px;
    margin-top: 10px;
    margin-bottom: 25px;
    line-height: 30px;
    font-size: 20px;
    border-left: 3px solid rgb(96, 98, 102);
    border-radius: 3px;
    padding-left: 10px;
    color: rgb(96, 98, 102);
  }
  .main {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    width: 95%;
    > div {
      margin-right: 20px;
    }
    #c1 {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 280px;
      box-shadow: 0 0 10px 2px rgb(240, 240, 240);
      .title {
        margin-bottom: 10px;
        color: rgb(6, 151, 167);
        margin-top: 10px;
        margin-bottom: 5px;
        font-size: 16px;
      }
      > div {
        display: flex;
        flex-direction: column;
        width: 80%;
        div {
          display: flex;
          flex-direction: column;
          i {
            margin-bottom: 6px;
            font-size: 14px;
          }
          input {
            border: 1px solid rgb(198, 196, 196);
            padding: 1px 5px;
            box-sizing: border-box;
            font-size: 15px;
            margin-bottom: 23px;
            height: 28px;
          }
        }
      }
      em {
        border: 1px solid rgb(198, 196, 196);
        width: 40%;
        text-align: center;
        cursor: pointer;
        margin-bottom: 25px;
        font-size: 15px;
      }
    }
    #c2 {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 300px;
      box-shadow: 0 0 10px 2px rgb(240, 240, 240);
      > div {
        width: 80%;
        margin-bottom: 8px;
      }
      .title {
        margin-bottom: 10px;
        color: rgb(6, 151, 167);
        margin-top: 10px;
        margin-bottom: 5px;
        font-size: 16px;
      }
      .indexImage {
        .lazyImg {
          width: 100%;
          height: 80px;
          cursor: pointer;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            border-radius: 2px;
            object-fit: cover;
          }
        }
      }
      .indexSwiper {
        .input {
          margin-bottom: 5px;
          input {
            height: 24px;
            padding: 3px 5px;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid rgb(198, 196, 196);
          }
        }
      }
      .indexRecommend {
        margin-bottom: 15px;
        .input {
          margin-bottom: 5px;
          input {
            height: 24px;
            padding: 3px 5px;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid rgb(198, 196, 196);

            margin-bottom: 10px !important;
          }
        }
        em {
          padding: 1px 10px;
          border: 1px solid rgb(198, 196, 196);
          width: 40%;
          text-align: center;
          cursor: pointer;
          font-size: 15px;
        }
      }
      .tip {
        display: block;
        color: gray;
        text-align: right;
        font-size: 10px;
      }
    }
  }
}
</style>