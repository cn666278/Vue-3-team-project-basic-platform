<template>
    <suspense>
        <n-config-provider
            :theme="theme.naiveUiTheme"
            :theme-overrides="themeOverrides"
            :locale="zhCN"
            :date-locale="dateZhCN"
            size="small"
        >
            <!-- <n-theme-editor> -->
            <naive-global>
                <router-view />
            </naive-global>
            <!-- </n-theme-editor> -->
        </n-config-provider>
    </suspense>
</template>
<script setup lang="ts">
import NaiveGlobal from "@/components/naiveGlobal/index.vue";
import { zhCN, dateZhCN, NThemeEditor } from "naive-ui";
import type { GlobalThemeOverrides } from "naive-ui";
import { useThemeStore } from "@/store";
import webSocket, { onMessageListKey } from "@/utils/webSocket";
import { provide } from "vue";
let themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: "#002FA7",
        primaryColorHover: "#00237D",
        primaryColorPressed: "#002371",
        primaryColorSuppl: "#002371",
    },
    Menu: {
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
