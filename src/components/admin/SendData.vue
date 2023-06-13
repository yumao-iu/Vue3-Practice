<template>
  <div id="sendData">
    <p class="title">发布中心</p>
    <div class="main">
      <div class="sendBook">
        <div class="sendLeft">
          <p class="title">发布图书</p>
          <p>
            <i>书籍名称:</i>
            <input type="text" v-model="bookName" />
          </p>
          <p>
            <i>书籍描述:</i>
            <input type="text" v-model="bookDes" />
          </p>
          <p>
            <i>书籍分类:</i>
            <input type="text" v-model="bookSort" />
          </p>
          <p>
            <i>书籍标签:</i>
            <input type="text" v-model="bookTag" />
          </p>
          <p>
            <i>书籍价格:</i>
            <input type="text" v-model="bookPrice" />
          </p>
          <em class="btn" @click="sendGood">确定发布</em>
        </div>
        <div class="sendRight">
          <p @click="uploadImg">点击上传图片</p>
          <p>
            <input
              type="file"
              style="display: none"
              @change="onChange($event)"
            />
            <Transition name="yumao-2" mode="out-in">
              <img class="bookImg" :src="imgSrc" v-show="showImg" />
            </Transition>
          </p>
        </div>
      </div>
      <div class="sendNotice">
        <div>
          <p class="title">发布公告</p>
          <p>
            <i>内容:</i>
            <textarea type="text" v-model="noticeMsg" />
          </p>
          <em class="btn" @click="sendNotice">确定发布</em>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { yumaoStore } from "@/store";
import { onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import adminApi from "@/axios/admin";
import "element-plus/es/components/message/style/css";
import { ElMessage } from "element-plus";

let store = yumaoStore();
let state = storeToRefs(store);
let { userWhere } = state;
let showImg = ref(false);
let bookName = ref("");
let bookDes = ref("");
let bookSort = ref("");
let bookTag = ref("");
let bookPrice = ref("");
let imgSrc = ref("");
let inpFiles = reactive();
let noticeMsg = ref("");

let onChange = (e) => {
  let file = e.target;
  let f = file.files;
  inpFiles = f;
  let reader = new FileReader();
  reader.readAsDataURL(f[0]);
  reader.onload = () => {
    showImg.value = true;
    imgSrc.value = reader.result;
  };
};
let uploadImg = () => {
  document.querySelectorAll("input[type=file]")[0].click();
  showImg.value = false;
};
let sendGood = async () => {
  let files = inpFiles;
  let imgDom = document.querySelector(".bookImg");
  let colorArr = await getColor(imgDom);
  let colorStr = colorArr.join(",");
  let ratio =
    parseInt((imgDom.naturalHeight / imgDom.naturalWidth) * 100) / 100;
  if (!files) return;
  if (!bookDes) return;
  const formData = new FormData();
  formData.append("file", files[0]);
  formData.append(
    "bookInfo",
    JSON.stringify({
      bookName: bookName.value,
      bookDes: bookDes.value,
      bookSort: bookSort.value,
      bookTag: bookTag.value,
      bookPrice: bookPrice.value,
      color: colorStr,
      ratio,
    })
  );
  let { data } = await adminApi.sendBook(formData);
  let { state } = data;
  if (state == 200) {
    inpFiles = "";
    ElMessage({
      showClose: true,
      message: "发布成功 🧐",
      type: "success",
      duration: 3000,
    });
    bookName.value =
      bookDes.value =
      bookSort.value =
      bookTag.value =
      bookPrice.value =
        "";
    showImg.value = false;
  }
};
let sendNotice = async () => {
  let msg = noticeMsg.value;
  if (!msg.replace(/\s/g, "").length) return;
  let { data } = await adminApi.sendNotice(msg);
  let { state } = data;
  if (state == 200) {
    noticeMsg.value = "";
    ElMessage({
      showClose: true,
      message: "发布成功 🧐",
      type: "success",
      duration: 3000,
    });
  }
};
let getColor = (imgDom) => {
  let colorThief = new ColorThief();
  let color = colorThief.getColor(imgDom);
  return color;
};
</script>



<style lang="less" scoped>
#sendData {
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
    width: 95%;
    .sendBook {
      margin-right: 30px;
      display: flex;
      justify-content: center;
      box-shadow: 0 0 10px 2px rgb(240, 240, 240);
      .sendLeft {
        display: flex;
        flex-direction: column;
        width: 90%;
        margin-left: 20px;
        margin-right: 30px;
        p {
          display: flex;
          flex-direction: column;
          width: 100%;
          i {
            margin-bottom: 6px;
            font-size: 14px;
          }
          input {
            width: 100%;
            height: 28px;
            border: 1px solid rgb(198, 196, 196);
            padding: 1px 5px;
            box-sizing: border-box;
            font-size: 15px;
            margin-bottom: 23px;
          }
        }
        .btn {
          border: 1px solid rgb(198, 196, 196);
          width: 40%;
          text-align: center;
          cursor: pointer;
          margin-bottom: 25px;
          font-size: 15px;
        }
      }
      .sendRight {
        width: 200px;
        height: 200px;
        font-size: 14px;
        margin-right: 20px;
        p:nth-child(1) {
          width: 150px;
          margin-top: 46px;
          margin-bottom: 10px;
          cursor: pointer;
        }
        img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 3px;
        }
      }
      .title {
        width: 100%;
        margin-bottom: 10px;
        color: rgb(0, 207, 232);
        margin-top: 10px;
        margin-bottom: 15px;
        font-size: 18px;
      }
    }
    .sendNotice {
      display: flex;
      justify-content: center;
      width: 280px;
      height: 230px;
      box-shadow: 0 0 10px 2px rgb(240, 240, 240);
      > div {
        display: flex;
        flex-direction: column;
        .title {
          margin-bottom: 10px;
          color: rgb(0, 207, 232);
          margin-top: 10px;
          margin-bottom: 15px;
          font-size: 18px;
        }
      }
      p {
        display: flex;
        flex-direction: column;
        i {
          font-size: 14px;
          margin-bottom: 10px;
        }
        textarea {
          width: 250px;
          height: 100px;
          resize: none;
          border: 1px solid rgb(198, 196, 196);
          border-radius: 2px;
          padding: 10px 10px;
          font-size: 15px;
          box-sizing: border-box;
          margin-bottom: 10px;
        }
      }
      .btn {
        border: 1px solid rgb(198, 196, 196);
        width: 40%;
        text-align: center;
        cursor: pointer;
        font-size: 15px;
      }
    }
  }
}
.yumao-2-enter-active,
.yumao-2-leave-active {
  transition: all 0.5s;
}
.yumao-2-enter-from,
.yumao-2-leave-to {
  opacity: 0;
}
</style>