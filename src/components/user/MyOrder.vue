<template>
  <div id="myOrder">
    <p class="title">我的订单</p>
    <p class="head"><em @click="notDo">搜索</em></p>
    <div class="main">
      <el-table :data="orderData" border style="width: 92%" id="table">
        <el-table-column label="图片" width="80" align="center">
          <template #default="scope">
            <p class="bookImg">
              <img
                :src="getImgUrl(scope.row.image)"
                :id="scope.row.bid"
                @click="goBook(scope.row.bid)"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="130" />
        <el-table-column prop="price" label="商品价格" width="100" />
        <el-table-column prop="num" label="商品数量" width="85" />
        <el-table-column prop="time" label="商品时间" />
        <el-table-column label="商品状态">
          <template #default="">
            <p class="func">
              <em class="tradeSuccess">交易完成</em>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { inject, isReactive, reactive, defineProps, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import indexApi from "@/axios";
import { ElMessage } from "element-plus";

let router = useRouter();
let route = useRoute();
let temp = await indexApi.getUserData();
let orderData = reactive(temp.userOrder);
let notDo = () => {
  ElMessage({
    showClose: true,
    message: "该功能没有做 😋",
    type: "info",
    duration: 2000,
  });
};

let getImgUrl = (v) => {
  return new URL("../../assets/images/" + v, import.meta.url).href;
};
let goBook = (v) => {
  router.push({
    path: "/book/" + v,
  });
};
</script>

<style lang="less" scoped>
#myOrder {
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
    overflow: auto;

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