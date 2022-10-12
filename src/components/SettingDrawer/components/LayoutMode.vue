<template>
    <n-divider>布局模式</n-divider>
    <n-space justify="space-around" size="large">
        <div
            class="layout_mode"
            :style="{
                borderColor: layoutMode == 'vertical' ? primaryColor : 'transparent',
            }"
            @click="theme.setLayoutMod('vertical')"
        >
            <n-tooltip placement="bottom" trigger="hover">
                <template #trigger>
                    <div class="layout_mode_miniContent">
                        <div
                            class="layout_mode_menu"
                            style="width: 33%; height: 100%"
                        ></div>
                        <div
                            class="layout_mode_content"
                            style="width: 66.6%; height: 75%"
                        ></div>
                    </div>
                </template>
                <span>左侧菜单布局</span>
            </n-tooltip>
        </div>
        <div
            class="layout_mode"
            :style="{
                borderColor: layoutMode == 'horizontal' ? primaryColor : 'transparent',
            }"
            @click="theme.setLayoutMod('horizontal')"
        >
            <n-tooltip placement="bottom" trigger="hover">
                <template #trigger>
                    <div class="layout_mode_miniContent">
                        <div
                            class="layout_mode_menu"
                            style="width: 100%; height: 25%"
                        ></div>
                        <div
                            class="layout_mode_content"
                            style="width: 100%; height: 75%"
                        ></div>
                    </div>
                </template>
                <span>顶部菜单布局</span>
            </n-tooltip>
        </div>
        <div
            class="layout_mode"
            :style="{
                borderColor: layoutMode == 'mix' ? primaryColor : 'transparent',
            }"
            @click="theme.setLayoutMod('mix')"
        >
            <n-tooltip placement="bottom" trigger="hover">
                <template #trigger>
                    <div class="layout_mode_miniContent">
                        <div
                            class="layout_mode_menu"
                            style="width: 100%; height: 25%"
                        ></div>
                        <div
                            class="layout_mode_content"
                            style="width: 67%; height: 75%"
                        ></div>
                    </div>
                </template>
                <span>混合菜单布局</span>
            </n-tooltip>
        </div>
    </n-space>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/store";
import { useThemeVars } from "naive-ui";
const { primaryColor } = useThemeVars().value;
const theme = useThemeStore();
let { layoutMode } = storeToRefs(theme);
</script>
<style lang="scss" scoped>
.layout_mode {
    border-width: 2px;
    border-style: solid;
    border-radius: 4px;
    .layout_mode_miniContent {
        position: relative;
        width: 56px;
        height: 48px;
        background-color: #fff;
        border-radius: 2px;
        overflow: hidden;
        box-shadow: 0 1px 2.5px rgba(0, 0, 0, 0.18);
        cursor: pointer;
        .layout_mode_menu,
        .layout_mode_content {
            position: absolute;
        }
        .layout_mode_menu {
            top: 0;
            left: 0;
            background-color: #273352;
        }
        .layout_mode_content {
            right: 0;
            bottom: 0;
            background-color: #f0f2f5;
        }
    }
}
</style>
