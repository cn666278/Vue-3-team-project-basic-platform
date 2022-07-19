<template>
    <n-divider>主题模式</n-divider>
    <n-space vertical size="large">
        <setting-menu label="深色模式">
            <n-switch
                :value="theme.darkMode"
                @update:value="theme.setDarkMode"
            ></n-switch>
        </setting-menu>
    </n-space>
</template>
<script setup lang="ts">
import settingMenu from "./SettingMenu.vue";
import { useThemeStore } from "@/store";
const theme = useThemeStore();
</script>
<style lang="scss"></style>
