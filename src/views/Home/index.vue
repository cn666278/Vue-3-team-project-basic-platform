<script setup lang="ts">
import { login } from "@/api/login";
const data = await login({
    userName: 'suadmin',
    passWord: '22dd966c568c5b9c75484add52ccc862',
});
console.log(data);
</script>
<template>
    <h1>这里是首页</h1>
</template>
<style lang="scss"></style>
