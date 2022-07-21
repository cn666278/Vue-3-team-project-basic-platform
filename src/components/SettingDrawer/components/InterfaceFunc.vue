<template>
    <n-divider>界面功能</n-divider>
    <n-space vertical size="large">
        <setting-menu label="深色侧边栏">
            <n-switch :value="theme.sideInverted" @update:value="theme.setSideInverted"></n-switch>
        </setting-menu>
        <setting-menu label="深色头部">
            <n-switch :value="theme.headerInverted" @update:value="theme.setHeaderInverted"></n-switch>
        </setting-menu>
    </n-space>
</template>
<script setup lang="ts">
import settingMenu from "./SettingMenu.vue";
import { useThemeStore } from "@/store";
const theme = useThemeStore();
</script>
<style lang="scss"></style>
