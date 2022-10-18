<template>
    <div></div>
  </template>
  <script setup lang="ts">
  import { h, onMounted, reactive, ref, Ref } from "vue";
  import { getMenusList } from "@/api/setting";
  
  // 列表搜索参数
  let searchMenuName: Ref<string> = ref("");
  let tableCurrentPage: Ref<number> = ref(1);
  let tablePageSize: Ref<number> = ref(9999);
  
  onMounted(() => {
    getMenuList();
  });
  
  const getMenuList = () => {
    getMenusList({
      title: searchMenuName.value,
      currentPage: tableCurrentPage.value,
      pageSize: tablePageSize.value,
    }).then((res) => {
      console.log(res);
    });
  };
  </script>
  <style lang="scss"></style>
  