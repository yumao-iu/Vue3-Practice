<template>
  <div id="myLove">
    <p class="title">我的收藏</p>
    <p class="head">
      <em @click="payAll(loveData)">全部支付</em>
      <em @click="delAll">全部删除</em>
    </p>
    <div class="main">
      <el-table :data="loveData" border style="width: 92%" id="table">
        <el-table-column label="图片" width="80" align="center">
          <template #default="scope">
            <p class="bookImg">
              <img
                :src="getImgUrl(scope.row.image)"
                @click="goBook(scope.row.id)"
                :index="scope.$index"
                :id="scope.row.id"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="130" />
        <el-table-column prop="price" label="商品价格" width="100" />
        <el-table-column prop="time" label="商品时间" />
        <el-table-column label="状态操作">
          <template #default="prop">
            <p class="func">
              <em @click="pay(prop.row, prop.$index)" class="pay">购买</em>
              <em @click="del(prop.row.id, prop.$index)" class="del">删除</em>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { yumaoStore } from "@/store";
import { computed, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import indexApi from "@/axios";

let router = useRouter();
let route = useRoute();
let store = yumaoStore();
let state = storeToRefs(store);
let { userInfo } = state;
let bookData = reactive(await indexApi.getAllBook(100));
let loveStr = JSON.parse(localStorage.getItem("userInfo")).love;
if (loveStr == null) loveStr = "0";
let temp1 = await indexApi.getUserLove();
let temp2 = bookData.data.filter((v) =>
  loveStr.split(",").includes(v.id.toString())
);
let loveData = reactive(temp2);
let temp3 = computed(() => {
  let a = 0;
  loveData.forEach((v) => {
    a += Number(v.price);
  });
  return a;
});
let totalPrice = ref(temp3.value);
if (loveStr != null)
  loveData.forEach((v, i) => {
    v.time = temp1[i].time;
  });
let getImgUrl = (v) => {
  return new URL("../../assets/images/" + v, import.meta.url).href;
};
let goBook = (v) => {
  router.push({
    path: "/book/" + v,
  });
};
let pay = async (v, i) => {
  let id = v.id;
  let price = Number(v.price);
  let myPrice = userInfo.value.price;
  let goodsPrice = price;
  if (goodsPrice > myPrice)
    ElMessage({
      showClose: true,
      message: "余额不足🥵",
      type: "error",
      duration: 2000,
    });
  else {
    let temp = await indexApi.buyGoods(id, "loveRemove", 1);
    let { state, price, loveStr } = temp;
    if (state == 200) {
      ElMessage({
        showClose: true,
        message: "购买成功😎",
        type: "success",
        duration: 2000,
      });
      userInfo.value.love = loveStr;
      userInfo.value.price = price;
      loveData.splice(i, 1);
    }
  }
};
let del = async (bid, i) => {
  userInfo.value.love = userInfo.value.love
    .split(",")
    .filter((v) => bid != v)
    .join(",");
  ElMessage({
    showClose: true,
    message: "删除成功😎",
    type: "success",
    duration: 2000,
  });
  await indexApi.delLove(bid);
  loveData.splice(i, 1);
};
let delAll = async () => {
  let data = userInfo.value.love.split(",");
  for (let a = 0; a < data.length; a++) await api.delLove(data[a]);
  userInfo.value.love = null;
  ElMessage({
    showClose: true,
    message: "删除成功😎",
    type: "success",
    duration: 2000,
  });
};
let payAll = async (v) => {
  let id = v.id;
  let price = totalPrice.value;
  let myPrice = userInfo.value.price;
  let goodsPrice = price;
  console.log(myPrice, goodsPrice);
  if (myPrice < goodsPrice) {
    ElMessage({
      showClose: true,
      message: "余额不足🥵",
      type: "success",
      duration: 2000,
    });
  } else {
    let data = userInfo.value.love.split(",");
    loveData.splice(0, loveData.length);
    userInfo.value.love = "";
    userInfo.value.price -= parseInt(Number(price) * 100) / 100;
    for (let a = 0; a < data.length; a++)
      await indexApi.buyGoods(data[a], "loveRemove", 1);
    ElMessage({
      showClose: true,
      message: "购买成功😎",
      type: "success",
      duration: 2000,
    });
  }
};
</script>



<style lang="less" scoped>
#myLove {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 3px;
  > .title {
    width: 92%;
    margin-top: 15px;
    margin-bottom: 2px;
    font-size: 17px;
    color: rgb(30, 29, 29);
  }
  > .head {
    width: 92%;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.8s;
    border-bottom: 1px solid rgba(121, 116, 116, 0.2);
    em {
      margin-right: 18px;
      background: gray;
      padding: 2px 15px;
      border-radius: 1.5px;
      color: rgb(255, 255, 255);
      transition: all 0.5s;

      border-color: rgb(35, 201, 237);
      background-color: rgb(35, 201, 237);
      box-shadow: inset 0 -3px 0 rgba(32, 132, 154, 0.2);
      &:hover {
        box-shadow: inset 0 -3px 0 0 transparent;
      }
    }
  }
  > .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .func {
      em {
        padding: 1px 5px;
        border-radius: 3px;
        cursor: pointer;
        margin-right: 10px;
      }
      .pay {
        color: rgb(35, 201, 237);
        background: rgba(35, 201, 237, 0.1);
      }
      .del {
        color: rgb(225, 112, 81);
        background: rgba(225, 84, 46, 0.2);
      }
    }
    .bookImg {
      img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 3px;
        vertical-align: middle;
        margin-right: 3px;
        cursor: pointer;
      }
    }
    .tradeSuccess {
      color: rgb(65, 220, 127);
      background: rgba(35, 224, 111, 0.1);
      padding: 1px 5px;
      border-radius: 3px;
    }
  }
}
</style>