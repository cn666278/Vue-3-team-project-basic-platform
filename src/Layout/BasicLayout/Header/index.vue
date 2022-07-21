<template>
    <n-grid :x-gap="10" :cols="2">
        <n-gi class="header_control header_control_left">
            <Slider v-if="theme.layoutMode == 'horizontal'" />
            <Breadcrumb
                :inverted="theme.darkMode || theme.headerInverted"
                :primaryColor="primaryColor"
                v-else
            />
        </n-gi>
        <n-gi class="header_control header_control_right">
            <Setting></Setting>
        </n-gi>
    </n-grid>
</template>
<script setup lang="ts">
import Slider from "../Slider/index.vue";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Setting from "@/components/Setting/index.vue";
import { useThemeVars } from "naive-ui";
import { useThemeStore } from "@/store";
const theme = useThemeStore();
const { primaryColor } = useThemeVars().value;
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
