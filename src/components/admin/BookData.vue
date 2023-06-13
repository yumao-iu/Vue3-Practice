<template>
  <div id="bookData">
    <p class="title">书籍管理</p>
    <div class="main">
      <el-table :data="bookData" border style="width: 100%">
        <el-table-column label="ID" width="60" align="center">
          <template #default="scope">
            <p class="bookImg">
              {{ scope.row.id }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="80" align="center">
          <template #default="scope">
            <p class="bookImg">
              <img
                :src="getImgUrl(scope.row.image)"
                @click="goBook(scope.row.id)"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="书名" width="200" />
        <el-table-column prop="price" label="价格" width="200" />
        <el-table-column prop="time" label="时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <p class="func">
              <em class="editBtn" @click="openEdit(scope.row, scope.$index)"
                >编辑</em
              >
              <em class="delBtn" @click="delBook(scope.row.id, scope.$index)"
                >删除</em
              >
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Teleport to="body">
      <Transition name="tran-99" mode="out-in">
        <div id="editBook" v-if="showEditBook">
          <p @click="closeEdit"></p>
          <div>
            <div class="bookInfo">
              <p class="title">正在编辑用户 {{ editBookInfo.name }} 的信息:</p>
              <div>
                <i>书名</i>
                <input type="text" v-model="editBookInfo.name" />
              </div>
              <div>
                <i>价格</i>
                <input type="text" v-model="editBookInfo.price" />
              </div>
              <div>
                <i>颜色</i>
                <input type="text" v-model="editBookInfo.color" />
              </div>
              <div>
                <i>时间</i>
                <input type="text" v-model="editBookInfo.time" />
              </div>
              <div>
                <i>用户</i>
                <input type="text" v-model="editBookInfo.username" disabled />
              </div>
              <i class="btn" @click="editBook">确定修改</i>
              <i class="btn" @click="autoColor">校对颜色</i>
            </div>
            <div class="bookImg">
              <p class="btn" @click="uploadImg">点击上传图片</p>
              <p class="profile">
                <Transition name="yumao-12" mode="out-in">
                  <img :src="imgSrc" v-show="showImg" @click="uploadImg" />
                </Transition>
              </p>
              <div class="tags">
                <p class="title">
                  <em>标签</em>
                  <em><i @click="removeTag">减</i><i @click="addTag">加</i></em>
                </p>
                <div v-for="(v, i) in tags" :key="i" :id="i">
                  <input type="text" placeholder="一千浏览" v-model="v.text" />
                  <input
                    type="text"
                    placeholder="43, 36, 36"
                    v-model="v.color"
                  />
                  <p
                    :style="{
                      background: `rgb(${v.color})`,
                    }"
                  ></p>
                </div>
              </div>
              <input type="file" style="display: none" @change="onChange" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import $ from "jquery";
import { useRouter, useRoute } from "vue-router";
import { yumaoStore } from "@/store";
import { adminStore } from "@/store/admin";
import { ElMessage } from "element-plus";
import adminApi from "@/axios/admin";
import { isReactive, reactive, ref } from "vue";
import { storeToRefs } from "pinia";

let yS = yumaoStore();
let aS = adminStore();
let router = useRouter();
let route = useRoute();
let bookData;
if (aS.bookData.length) {
  bookData = reactive(aS.bookData);
} else {
  let { data } = await adminApi.getAllBook(100);
  bookData = reactive(data.data.reverse());
  aS.bookData = data.data;
}
let showEditBook = ref(false);
let editBookInfo = reactive({ id: 0 });
let showImg = ref(false);
let imgSrc = ref("");
let inpFiles = reactive("");
let tags = reactive();

let addTag = () => {
  if (tags.length < 3) tags.push({ text: "一千点赞", color: "12,12,12" });
};
let removeTag = () => {
  if (tags.length) tags.splice(tags.length - 1, 1);
};
let openEdit = (v, i) => {
  editBookInfo = reactive({ ...v, ...v.extra, i });
  tags = editBookInfo?.tagData
    ? reactive(JSON.parse(editBookInfo.tagData))
    : reactive([]);
  console.log(editBookInfo);
  console.log(tags);
  console.log(tags.length);
  console.log(isReactive(tags));
  showImg.value = true;
  imgSrc.value = getImgUrl(v.image);
  showEditBook.value = true;
};
let closeEdit = () => {
  showEditBook.value = false;
};
let delBook = async (id, index) => {
  let data = await adminApi.delBook(id);
  let { state } = data;
  if (state == 200) {
    bookData.splice(index, 1);
    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
      duration: 3000,
    });
  }
};
let onChange = (e) => {
  let file = e.target;
  let f = file.files;
  inpFiles = f;
  let reader = new FileReader();
  reader.readAsDataURL(f[0]);
  reader.onload = () => {
    showImg.value = true;
    imgSrc.value = reader.result;
    let imgDom = document.querySelector(".profile img");
    editBookInfo.color = getColor(imgDom);
  };
};
let uploadImg = () => {
  document.querySelectorAll("input[type=file]")[0].click();
  showImg.value = false;
};
let editBook = async () => {
  if (!/^([0-9]{1,3},){2}[0-9]{1,3}$/.test(editBookInfo.color)) {
    ElMessage({
      showClose: true,
      message: "颜色设置错误 🧐",
      type: "info",
      duration: 2000,
    });
    return;
  }
  let formData = new FormData();
  let files = inpFiles;
  if (files) formData.append("file", files[0]);
  formData.append(
    "bookInfo",
    JSON.stringify({
      id: editBookInfo.id,
      color: editBookInfo.color,
      bookName: editBookInfo.name,
      bookTime: editBookInfo.time,
      bookPrice: editBookInfo.price,
      tagData: tags,
    })
  );
  let { state, image } = await adminApi.editBook(formData);
  if (state == 200) {
    inpFiles = 0;
    showEditBook.value = false;
    bookData[editBookInfo.i].extra.color = editBookInfo.color;
    if (image) editBookInfo.image = imgSrc.value;
    ElMessage({
      showClose: true,
      message: "修改成功 🧐",
      type: "success",
      duration: 2000,
    });
  }
};
let autoColor = () => {
  let imgDom = document.querySelector(".profile img");
  let color = getColor(imgDom);
  if (editBookInfo.color == color) {
    ElMessage({
      showClose: true,
      message: "主颜色正确 无需校对 🧐",
      type: "info",
      duration: 2000,
    });
  } else {
    editBookInfo.color = color;
    ElMessage({
      showClose: true,
      message: "校对成功 🧐",
      type: "success",
      duration: 2000,
    });
    editBook();
  }
};
let getImgUrl = (v) => {
  if (v.length > 250) return v;
  return new URL("../../assets/images/" + v, import.meta.url).href;
};
let goBook = (v) => {
  router.push({
    path: "/book/" + v,
  });
};
let getColor = (imgDom) => {
  let colorThief = new ColorThief();
  let color = colorThief.getColor(imgDom);
  return color.join(",");
};
</script>

<style lang="less" scoped>
#bookData {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
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
    flex-direction: column;
    align-items: center;
    width: 95%;
    > p {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      em {
        flex-grow: 1;
      }
    }
    > div {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-height: 70vh;
      overflow: auto;
    }
    .bookImg {
      img {
        cursor: pointer;
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 3px;
      }
    }
    .func {
      .editBtn {
        color: rgb(136, 158, 255);
        background: rgba(236, 245, 255, 1);
        padding: 3px 10px;
        border-radius: 3px;
        &:hover {
          background: rgba(95, 150, 213, 0.2);
        }
      }
      .delBtn {
        color: white;
        background: rgba(245, 108, 108, 0.6);
        padding: 3px 10px;
        border-radius: 4px;
        &:hover {
          background: rgba(245, 108, 108, 1);
        }
      }
      em {
        transition: all 1s;
        margin-right: 25px;
        cursor: pointer;
      }
    }
  }
}
#editBook {
  position: fixed;
  z-index: 3;
  top: 0;
  width: 100vw;
  height: 100vh;
  > p {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    opacity: 0.3;
    background: rgb(0, 0, 0);
  }
  > div {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    background: white;
    border-radius: 3px;
    .bookInfo {
      width: 45%;
      margin-right: 20px;
      margin-top: 15px;
      margin-bottom: 15px;
      .title {
        margin-bottom: 20px;
      }
      .btn {
        padding: 3px 10px;
        background: rgb(64, 158, 255);
        color: white;
        border-radius: 3px;
        font-size: 14px;
        cursor: pointer;
        opacity: 1;
        transition: all 0.5s;
        margin-right: 10px;
        &:hover {
          opacity: 0.8;
        }
      }
      > div {
        display: flex;
        flex-direction: column;
        margin-bottom: 15px;
        i {
          color: rgb(104, 106, 109);
          font-size: 14px;
          margin-bottom: 5px;
        }
        input {
          width: 200px;
          height: 28px;
          padding: 0 10px;
          border: 1px solid rgb(223, 225, 232);
          border-radius: 3px;
          transition: all 1s;
          &:hover {
            border: 1px solid rgb(64, 158, 255);
          }
        }
      }
    }
    .bookImg {
      width: 45%;
      margin-top: 15px;
      .btn {
        margin-bottom: 10px;
        cursor: pointer;
      }
      .profile {
        margin-bottom: 20px;
        width: 180px;
        height: 180px;
        img {
          width: 180px;
          height: 180px;
          border-radius: 3px;
          object-fit: cover;
          cursor: pointer;
        }
      }

      .tags {
        .title {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          width: 75%;
          i {
            margin-left: 10px;
            cursor: pointer;
            color: gray;
            font-size: 14px;
          }
        }
        > div {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          input {
            border: 1px solid rgb(223, 225, 232);
            box-sizing: border-box;
            padding: 2px 4px;
            margin-right: 10px;
            border-radius: 2px;
          }
          input:nth-of-type(1) {
            width: 30%;
          }
          input:nth-of-type(2) {
            width: 30%;
          }
          p {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: gray;
          }
        }
      }
    }
  }
}
.tran-99-enter-active,
.tran-99-leave-active {
  transition: all 0.5s;
}
.tran-99-enter-from,
.tran-99-leave-to {
  opacity: 0;
}
.yumao-12-enter-active,
.yumao-12-leave-active {
  transition: all 0.5s;
}
.yumao-12-enter-from,
.yumao-12-leave-to {
  opacity: 0;
}
</style>