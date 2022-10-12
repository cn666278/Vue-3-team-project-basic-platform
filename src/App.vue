<template>
    <suspense>
        <n-config-provider
            :theme="theme.naiveUiTheme"
            :theme-overrides="theme.darkMode ? darkTheme : lightTheme"
            :locale="zhCN"
            :date-locale="dateZhCN"
            size="small"
            :class="theme.darkMode ? 'dark_theme':'light_theme'"
        >
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
import { zhCN, dateZhCN, NThemeEditor } from "naive-ui";
import type { GlobalThemeOverrides } from "naive-ui";
import { useThemeStore } from "@/store";
import webSocket, { onMessageListKey } from "@/utils/webSocket";
import { provide, computed } from "vue";
import { lightTheme } from '@/theme/light';
import { darkTheme } from '@/theme/dark';
let themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: "#00828D",
        primaryColorHover: "#00828D",
        primaryColorPressed: "#002371",
        primaryColorSuppl: "#002371",
        tableColorHover: '#00828D1A',
    },
    Menu: {
        itemTextColorHorizontal: '#ffffff',
        itemTextColorHoverHorizontal: '#FCE051',
        itemTextColorActiveHorizontal: '#FCE051',
        itemTextColorActiveHoverHorizontal: '#FCE051',
        itemTextColorChildActiveHorizontal: '#FCE051',
        borderColorHorizontal: '#FCE051',
    }
};
const theme = useThemeStore();

/**全局挂载websocket */
const onMessageList: Function[] = [];
provide(onMessageListKey, onMessageList);
const onMessage = (event: any) => {
    onMessageList.forEach((f) => {
        f.call(null, event);
    });
};
webSocket(onMessage);
</script>
<style>
body {
    padding: 0;
    margin: 0;
}
</style>
