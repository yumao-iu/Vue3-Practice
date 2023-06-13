<template>
  <div id="myGoods">
    <p class="title">我的商品</p>
    <p class="head"><em>搜索</em></p>
    <div class="main">
      <el-table :data="goodsData" border style="width: 92%" id="table">
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
              <em class="del" @click="del(prop.row, prop.$index)">删除</em>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { isReactive, reactive, ref } from "vue";
import { yumaoStore } from "@/store";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import indexApi from "@/axios";

let router = useRouter();
let route = useRoute();
let store = yumaoStore();
let state = storeToRefs(store);
let { data } = await indexApi.getUserGoods();
let goodsData = reactive(data.reverse());

let del = async (v, i) => {
  let { id } = v;
  goodsData.splice(i, 1);
  let { state } = await indexApi.delGoods(id);
  if (state == 200)
    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
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
#myGoods {
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