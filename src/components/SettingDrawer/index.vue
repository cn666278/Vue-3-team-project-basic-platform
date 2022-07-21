<template>
    <n-drawer
        v-model:show="app.settingDrawerVisible"
        width="300"
        placement="right"
    >
        <n-drawer-content title="系统配置">
            <dark-mode />
            <layout-mode />
            <interface-func />
        </n-drawer-content>
    </n-drawer>
    <DrawerButton />
</template>
<script setup lang="ts">
import { DrawerButton, DarkMode, LayoutMode, InterfaceFunc } from "./components";
import { useAppStore } from "@/store";
const app = useAppStore();
</script>
<style lang="scss"></style>
