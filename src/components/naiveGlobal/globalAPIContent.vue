<template></template>
<script setup lang="ts">
import {
    useLoadingBar,
    useDialog,
    useNotification,
    useMessage,
} from "naive-ui";
import { onMounted } from "vue";
onMounted(() => {
    //  全局组件函数API声明
    window.$loadingBar = useLoadingBar();
    window.$dialog = useDialog();
    window.$notification = useNotification();
    window.$message = useMessage();
});
</script>
<style lang="scss"></style>
