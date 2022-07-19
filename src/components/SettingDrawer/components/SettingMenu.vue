<template>
    <div class="setting_menu">
        <span>{{label}}</span>
        <slot></slot>
    </div>
</template>
<script setup lang='ts'>
interface Props {
    label: string;
}
defineProps<Props>();
</script>
<style lang='scss' scoped>
.setting_menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>