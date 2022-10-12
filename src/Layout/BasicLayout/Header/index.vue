<template>
    <div class="layout_header">
        <div class="layout_header_logo" :style="{width: theme.logoWidth + 'px', padding: '0 5px',}">
            <Logo />
        </div>
        <div class="layout_header_content">
            <Slider
                class="layout_header_slider"
                :mode="theme.layoutMode == 'mix' ? 'horizontal' : theme.layoutMode"
                :side-inverted="theme.headerInverted"
                v-if="theme.layoutMode == 'horizontal' || theme.layoutMode == 'mix'"
            />
            <!-- <Breadcrumb
                :inverted="theme.darkMode || theme.headerInverted"
                :primaryColor="primaryColor"
                v-else
            /> -->
        </div>
        <div class="layout_header_setting">
            <Setting />
        </div>
    </div>
</template>
<script setup lang="ts">
import Slider from "../Slider/index.vue";
import Logo from "../Logo/index.vue";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Setting from "@/components/Setting/index.vue";
import { useThemeVars } from "naive-ui";
import { useThemeStore } from "@/store";
const theme = useThemeStore();
const { primaryColor } = useThemeVars().value;
</script>