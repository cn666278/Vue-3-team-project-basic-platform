<template>
    <n-grid :x-gap="10" :cols="2">
        <n-gi class="header_control header_control_left">
            <Breadcrumb></Breadcrumb>
        </n-gi>
        <n-gi class="header_control header_control_right">
            <Setting></Setting>
        </n-gi>
    </n-grid>
</template>
<script setup lang="ts">
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Setting from "@/components/Setting/index.vue";
</script>
<style lang="scss" scoped>
.header_control {
    display: flex;
    align-items: center;
}
.header_control_left {
}
.header_control_right {
    justify-content: flex-end;
}
</style>
