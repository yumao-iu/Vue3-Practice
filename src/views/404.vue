<template>
  <div style="font-size: 25px">十分抱歉,{{ query.message }}</div>
</template>
<script setup>
  
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
let router = new useRouter();
let route = new useRoute();
let query = reactive(route.query);
// !query.message
//   ? (query.message = "这是自定义错误页面🤔")
//   : (name = "阳光彩虹小白马");
// document.title = "阳光彩虹小白马-404";
</script>