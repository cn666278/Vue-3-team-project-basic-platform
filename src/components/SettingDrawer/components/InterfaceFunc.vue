<template>
    <n-divider>界面功能</n-divider>
    <n-space vertical size="large">
        <setting-menu label="深色侧边栏">
            <n-switch
                :value="theme.sideInverted"
                @update:value="theme.setSideInverted"
            ></n-switch>
        </setting-menu>
        <setting-menu label="深色头部">
            <n-switch
                :value="theme.headerInverted"
                @update:value="theme.setHeaderInverted"
            ></n-switch>
        </setting-menu>
        <setting-menu label="多页签">
            <n-switch
                :value="app.tagTabsVisible"
                @update:value="app.setTagTabsVisible"
            ></n-switch>
        </setting-menu>
        <setting-menu label="侧边栏宽度">
            <n-input-number
                class="setting_menu_list"
                v-model:value="theme.sideWidth"
                @update="theme.setSideWidth"
                placeholder="输入侧边栏宽度"
                button-placement="both"
            />
        </setting-menu>
        <setting-menu label="Logo宽度">
            <n-input-number
                class="setting_menu_list"
                v-model:value="theme.logoWidth"
                @update="theme.setLogoWidth"
                placeholder="输入logo宽度"
                button-placement="both"
            />
        </setting-menu>
    </n-space>
</template>
<script setup lang="ts">
import { useThemeStore, useAppStore } from "@/store";
import SettingMenu from "./SettingMenu.vue";
const theme = useThemeStore();
const app = useAppStore();
</script>
<style lang="scss" scoped>
.setting_menu_list {
    width: 120px;
}
</style>
