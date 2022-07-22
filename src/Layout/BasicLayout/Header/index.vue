<template>
    <div class="layout_header">
        <div class="layout_header_logo" v-if="theme.layoutMode == 'horizontal'">
            <Logo />
        </div>
        <div class="layout_header_content">
            <Slider
                class="layout_header_slider"
                :side-inverted="theme.headerInverted"
                v-if="theme.layoutMode == 'horizontal'"
            />
            <Breadcrumb
                :inverted="theme.darkMode || theme.headerInverted"
                :primaryColor="primaryColor"
                v-else
            />
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