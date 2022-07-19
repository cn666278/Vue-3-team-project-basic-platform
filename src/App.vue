<template>
    <suspense>
        <n-config-provider :theme="theme.naiveUiTheme" :theme-overrides="themeOverrides">
            <n-theme-editor>
                <naive-global>
                    <router-view />
                </naive-global>
            </n-theme-editor>
        </n-config-provider>
    </suspense>
</template>
<script setup lang="ts">
import NaiveGlobal from "@/components/naiveGlobal/index.vue";
import { NThemeEditor } from "naive-ui";
import type { GlobalThemeOverrides } from "naive-ui";
import { useThemeStore } from "@/store";
let themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: "#002FA7",
        primaryColorHover: "#00237D",
        primaryColorPressed: "#002371",
        primaryColorSuppl: "#002371",
    },
};
const theme = useThemeStore();
</script>
<style>
body {
    padding: 0;
    margin: 0;
}
</style>
