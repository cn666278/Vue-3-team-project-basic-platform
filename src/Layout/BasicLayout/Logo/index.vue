<template>
    <div class="logo">
        <svg-icon name="logo" :size="36" />
        <img :src="logoFont" style="height: 32px" v-show="!app.sideCollapsed" />
    </div>
</template>
<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue";
import logoFont from "@/assets/base/Yatinova-font.png";
import { useAppStore } from "@/store";
const app = useAppStore();
</script>
<style lang="scss" scoped>
.logo {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
