<template>
    <suspense>
        <n-config-provider :theme-overrides="themeOverrides">
            <naive-global>
                <router-view />
            </naive-global>
        </n-config-provider>
    </suspense>
</template>
<script setup lang="ts">
import NaiveGlobal from "@/components/naiveGlobal/index.vue";
import type { GlobalThemeOverrides } from "naive-ui";
let themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: "#002FA7",
        primaryColorHover: "#00237D",
        primaryColorPressed: "#002371",
        primaryColorSuppl: "#002371",
    },
};
</script>
<style>
body {
    padding: 0;
    margin: 0;
}
</style>
