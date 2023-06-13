<template>
  <Transition name="tran-2" mode="out-in">
    <div id="login" v-if="showLogin">
      <p
        @click="
          showLogin = false;
          loginIndex = 0;
        "
      ></p>
      <div>
        <div class="userLeft">
          <p class="title">每日推荐书籍</p>
          <p class="image lazyImg">
            <img src="../assets/images/sguugmndri.jpeg" />
          </p>
          <p class="poem">欲买桂花同载酒,终不似,少年游--宋·刘过</p>
        </div>
        <div class="userRight">
          <p>
            <i
              @click="loginIndex = 0"
              :class="loginIndex == 0 ? 'blue' : 'none'"
              >用户登陆</i
            ><i>|</i
            ><i
              @click="loginIndex = 1"
              :class="loginIndex == 1 ? 'blue' : 'none'"
              >用户注册</i
            ><i>|</i
            ><i
              @click="loginIndex = 2"
              :class="loginIndex == 2 ? 'blue' : 'none'"
              >管理员登陆</i
            >
          </p>
          <div class="userLogin" v-show="loginIndex == 0">
            <div class="usernameInp">
              <i>账号</i>
              <input
                type="text"
                placeholder="请输入账号"
                maxlength="20"
                v-model="loginInfo.lUser"
              />
            </div>
            <div class="passwordInp">
              <i>密码</i>
              <input
                type="password"
                placeholder="请输入密码"
                maxlength="20"
                v-model="loginInfo.lPass"
              />
            </div>
            <div class="loginBtn">
              <p><i @click="notDo">找回密码</i></p>
              <p @click="login"><i>登陆</i></p>
            </div>
          </div>
          <div class="userRegister" v-show="loginIndex == 1">
            <div class="usernameInp">
              <i>账号</i>
              <input
                type="text"
                placeholder="请输入账号"
                maxlength="20"
                v-model="loginInfo.rUser"
              />
            </div>
            <div class="emailInp">
              <i>邮箱</i>
              <input
                type="text"
                placeholder="请输入邮箱"
                maxlength="20"
                v-model="loginInfo.email"
              />
            </div>
            <div class="passwordInp">
              <i>密码</i>
              <input
                type="password"
                placeholder="请输入密码"
                maxlength="20"
                v-model="loginInfo.rPass"
              />
            </div>
            <div class="registerBtn">
              <p @click="register"><i>注册</i></p>
            </div>
          </div>
          <div class="adminLogin" v-show="loginIndex == 2">
            <div class="usernameInp">
              <i>账号</i>
              <input
                type="text"
                placeholder="请输入账号"
                maxlength="20"
                v-model="loginInfo.aUser"
              />
            </div>
            <div class="passwordInp">
              <i>密码</i>
              <input
                type="password"
                placeholder="请输入密码"
                maxlength="20"
                v-model="loginInfo.aPass"
              />
            </div>
            <div class="loginBtn">
              <p><i @click="notDo">找回密码</i></p>
              <p @click="login"><i>登陆</i></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { yumaoStore } from "../store";
import { storeToRefs } from "pinia";
import { reactive, ref, watch } from "vue";
import indexApi from "@/axios";
import { ElMessage } from "element-plus";

let store = yumaoStore();
let { throttle, debounce } = store;
let { userInfo, adminInfo, isLogin,adminIsLogin, showLogin } = storeToRefs(store);
let loginIndex = ref(0);
let loginInfo = reactive({
  lUser: "",
  lPass: "",
  rUser: "",
  rPass: "",
  aUser: "",
  aPass: "",
  email: "",
  code: "",
});

let login = debounce(async () => {
  let { lUser, lPass, aUser, aPass, code } = loginInfo;
  !loginIndex.value ? (code = 0) : (code = 1);
  if (
    (code && (aUser.length < 6 || aPass.length < 6)) ||
    (!code && (lUser.length < 6 || lPass.length < 6))
  ) {
    ElMessage({
      showClose: true,
      message: "输入内容不能少于六位 😅",
      type: "error",
      duration: 3000,
    });
    return;
  }
  let data = "";
  if (!code) data = await indexApi.login(lUser, lPass, code);
  else data = await indexApi.login(aUser, aPass, code);
  let { state } = data;
  if (state == 500) {
    ElMessage({
      showClose: true,
      message: "账号或者密码错误 🤯",
      type: "error",
      duration: 2000,
    });
  } else if (state == 200) {
    isLogin.value = 1;
    showLogin.value = 0;
    userInfo.value = data;
    Object.keys(loginInfo).forEach((v) => {
      loginInfo[v] = "";
    });
    ElMessage({
      showClose: true,
      message: "用户登陆成功 🤯",
      type: "success",
      duration: 2000,
    });
  } else {
    adminIsLogin.value = 1;
    showLogin.value = 0
    adminInfo.value = data;
    Object.keys(loginInfo).forEach((v) => {
      loginInfo[v] = "";
    });
    ElMessage({
      showClose: true,
      message: "管理员登陆成功 🤯",
      type: "success",
      duration: 2000,
    });
  }
}, 800);
let register = debounce(async () => {
  let { rUser, rPass, email } = loginInfo;
  if (rUser.length < 6 || rPass.length < 6) {
    ElMessage({
      showClose: true,
      message: "输入内容不能少于六位 😅",
      type: "error",
      duration: 3000,
    });
    return;
  }
  if (
    !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/.test(email)
  ) {
    ElMessage({
      showClose: true,
      message: "请输入正确邮箱 😅",
      type: "error",
      duration: 3000,
    });
    return;
  }
  let data = await indexApi.register(rUser, rPass, email);
  if (data.state == 200) {
    ElMessage({
      showClose: true,
      message: "注册成功 😋",
      type: "success",
      duration: 2000,
    });
    isLogin.value = 1;
    showLogin.value = 0
    userInfo.value = data;
  } else if (data.state == 500) {
    ElMessage({
      showClose: true,
      message: "账号已经存在 🤯",
      type: "error",
      duration: 2000,
    });
  } else {
    ElMessage({
      showClose: true,
      message: "邮箱已经存在 🤯",
      type: "error",
      duration: 2000,
    });
  }
}, 800);
let notDo = debounce(() => {
  ElMessage({
    showClose: true,
    message: "该功能没有做 😋",
    type: "info",
    duration: 2000,
  });
}, 500);

watch(loginIndex, (n) => {
  Object.keys(loginInfo).forEach((v) => {
    loginInfo[v] = "";
  });
});
watch(
  loginInfo,
  (n) => {
    Object.keys(n).forEach((v) => {
      loginInfo[v] = n[v].replace(/\s+/g, "");
    });
  },
  { deep: true }
);
</script>

<style lang="less" scoped>
#login {
  position: fixed;
  top: 0;
  z-index: 5;
  width: 100vw;
  height: 100vh;
  > p {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(57, 54, 54, 0.9);
  }
  > div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: 400px;
    background: white;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    .userLeft {
      border-right: 1px solid rgba(133, 128, 128, 0.1);
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 300px;
      > p {
        width: 100%;
        text-align: center;
        margin-bottom: 30px;
      }
      .title {
        color: #505050;
      }
      .image {
        margin-bottom: 30px;
        img {
          width: 150px;
          height: 150px;
          border-radius: 5px;
        }
      }
      .poem {
        width: 80%;
        color: gray;
        font-size: 10px;
      }
    }
    .userRight {
      margin-left: 30px;
      height: 300px;
      > p {
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
        i {
          margin-right: 12px;
          cursor: pointer;
          transition: all 0.2s;
          color: #505050;
        }
        i:nth-of-type(2n) {
          // opacity: .2;
          color: rgba(221, 228, 230, 0.7);
        }
      }
      .userLogin,
      .adminLogin {
        > div {
          display: flex;
          align-items: center;
        }
        .usernameInp,
        .passwordInp {
          width: 300px;
          height: 40px;
          border: 1px solid rgba(128, 128, 128, 0.5);
          i {
            margin-right: 10px;
            margin-left: 10px;
          }
          input {
            font-size: 15px;
          }
        }
        .usernameInp {
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
        }
        .passwordInp {
          border-top: none;
          margin-bottom: 8px;
          border-bottom-left-radius: 3px;
          border-bottom-right-radius: 3px;
        }
        .loginBtn {
          flex-direction: column;
          > p:nth-of-type(1) {
            width: 100%;
            i {
              float: right;
              font-size: 8px;
              padding: 0 10px;
              padding-right: 0;
              cursor: pointer;
              margin-bottom: 20px;
              color: gray;
            }
          }
          > p:nth-of-type(2) {
            width: 100%;
            text-align: center;
            background: rgb(104, 197, 234);
            color: white;
            padding: 5px 0;
            border-radius: 3px;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 0 0 0 transparent;
            i {
              width: 100%;
              letter-spacing: 3px;
            }
            &:hover {
              box-shadow: 0 3px 5px 0px rgba(104, 197, 234, 0.7);
            }
          }
        }
      }
      .adminLogin {
        .loginBtn {
          > p:nth-of-type(2) {
            background: rgb(234, 87, 88);
            &:hover {
              box-shadow: 0 3px 5px 0px rgba(234, 87, 88, 0.4);
            }
          }
        }
      }
      .userRegister {
        > div {
          display: flex;
          align-items: center;
        }
        .usernameInp,
        .emailInp,
        .passwordInp {
          width: 300px;
          height: 40px;
          border: 1px solid rgba(128, 128, 128, 0.5);
          i {
            margin-right: 10px;
            margin-left: 10px;
          }
          input {
            font-size: 15px;
          }
        }
        .usernameInp {
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
        }
        .emailInp {
          border-top: none;
        }
        .passwordInp {
          border-top: none;
          margin-bottom: 38px;
          border-bottom-left-radius: 3px;
          border-bottom-right-radius: 3px;
        }
        .registerBtn {
          flex-direction: column;
          > p:nth-of-type(1) {
            width: 100%;
            text-align: center;
            background: rgb(44, 200, 114);
            color: white;
            padding: 5px 0;
            border-radius: 3px;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 0 0 0 transparent;
            i {
              width: 100%;
              letter-spacing: 3px;
            }
            &:hover {
              box-shadow: 0 3px 5px 0px rgba(44, 200, 114, 0.4);
            }
          }
        }
      }
    }
  }
}
.blue {
  color: rgb(104, 197, 234) !important;
}
.tran-2-enter-active,
.tran-2-leave-active {
  transition: all 0.5s;
}
.tran-2-enter-from,
.tran-2-leave-to {
  opacity: 0;
}
</style>