<template>
  <div id="mySend">
    <p class="title">发布书籍</p>
    <div class="main">
      <div class="left">
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
        <div class="btn" @click="sendGood"><em>确定上传</em></div>
      </div>
      <div class="right">
        <div>
          <i @click="uploadImg">点击上传图片</i>
          <p class="lazyImg">
            <Transition name="yumao" mode="out-in">
              <img :src="imgSrc" v-show="showImg" />
            </Transition>
          </p>
          <input type="file" style="display: none" @change="onChange($event)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { yumaoStore } from "@/store";
import { onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import indexApi from "@/axios";

let store = yumaoStore();
let state = storeToRefs(store);
let { userWhere } = state;
let showImg = ref(false);
let bookName = ref();
let bookDes = ref();
let bookSort = ref();
let bookTag = ref();
let bookPrice = ref();
let imgSrc = ref();
let inpFiles = reactive();
let color = ref("");

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
  if (!files.length) return;
  if (!bookDes) return;
  let imgDom = document.querySelector(".main img");
  let colorArr = await getColor(imgDom);
  let colorStr = colorArr.join(",");
  let ratio =
    parseInt((imgDom.naturalHeight / imgDom.naturalWidth) * 100) / 100;
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
      color: color.value,
      ratio,
    })
  );
  const { state } = await indexApi.sendGood(formData);
  if (state == 200) {
    store.$patch({ alterMsg: "发布成功 🧐" });
    bookName.value =
      bookDes.value =
      bookSort.value =
      bookTag.value =
      bookPrice.value =
        "";
    showImg.value = false;
    setTimeout(() => {
      location.href = location.href;
      // userWhere.value = MyGoods;
    }, 1500);
  }
};
let getColor = (imgDom) => {
  let colorThief = new ColorThief();
  let color = colorThief.getColor(imgDom);
  return color;
};
</script>


<style lang="less" scoped>
#mySend {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 3px;
  .title {
    width: 92%;
    margin-top: 15px;
    margin-bottom: 12px;
    font-size: 17px;
    color: rgb(30, 29, 29);
  }
  .main {
    display: flex;
    width: 92%;
    .left {
      width: 50%;
      > p {
        display: flex;
        flex-direction: column;
        margin-bottom: 18px;
        i {
          font-size: 15px;
          color: rgb(46, 44, 44);
          margin-bottom: 6px;
        }
        input {
          border: 1px solid rgb(164, 162, 162);
          height: 28px;
          padding: 0 10px;
          font-size: 15px;
          width: 80%;
        }
      }
      .btn {
        margin-top: 30px;
        em {
          padding: 3px 10px;
          border: 1px solid gray;
          cursor: pointer;
        }
      }
    }
    .right {
      font-size: 15px;
      i {
        border: 1px solid gray;
        padding: 3px 15px;
        cursor: pointer;
        color: rgb(255, 255, 255);
        background: rgb(0, 0, 0);
      }
      p {
        height: 200px;
        width: 200px;
        margin-top: 10px;
        img {
          height: 100%;
          width: 100%;
          border-radius: 3px;
          transition: all 0.5s;
          object-fit: cover;
        }
      }
    }
  }
}
.yumao-enter-active,
.yumao-leave-active {
  transition: all 0.5s;
}
.yumao-enter-from,
.yumao-leave-to {
  opacity: 0;
}
</style>