<template>
    <suspense>
        <n-layout class="layout_main">
            <n-layout-header
                    class="layout_header"
                    position="static"
                    :inverted="theme.headerInverted"
                    bordered
                >
                <BasicHeader />
            </n-layout-header>
            <n-layout has-sider class="layout_content">
                <n-layout-sider
                    class="layout_sider"
                    collapse-mode="width"
                    :inverted="theme.sideInverted"
                    :width="theme.sideWidth"
                    :native-scrollbar="true"
                    show-trigger
                    bordered
                    @update:collapsed="app.setSideCollapsed"
                    v-if="theme.layoutMode == 'vertical' || theme.layoutMode == 'mix'"
                >
                    <!-- <Logo class="layout_sider_content" v-if="theme.layoutMode == 'vertical'"/> -->
                    <n-scrollbar>
                        <Slider
                            class="layout_sider_content"
                            :mode="theme.layoutMode == 'mix' ? 'vertical' : theme.layoutMode"
                            :side-inverted="theme.sideInverted"
                        ></Slider>
                    </n-scrollbar>
                </n-layout-sider>
                <n-layout-content
                    :class="[
                        'layout_content_content',
                        theme.isDarkTheme ? '' : 'layout_content_background',
                    ]"
                    bordered
                >
                    <Breadcrumb
                        :inverted="theme.darkMode"
                        :primaryColor="primaryColor"
                        class="layout_content_breadcrumb"
                    />
                    <TagTabs v-if="app.tagTabsVisible" />
                    <n-scrollbar>
                        <n-card class="layout_content_content_card" content-style="padding: 0">
                            <BlankLayout />
                        </n-card>
                    </n-scrollbar>
                </n-layout-content>
            </n-layout>
            <SettingDrawer />
        </n-layout>
    </suspense>
</template>
<script setup lang="ts">
import Logo from "./Logo/index.vue";
import Slider from "./Slider/index.vue";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import SettingDrawer from "@/components/SettingDrawer/index.vue";
import TagTabs from "@/components/TagTabs/index.vue";
import BlankLayout from "@/Layout/BlankLayout/index.vue";
import BasicHeader from "./Header/index.vue";
import { useThemeVars } from "naive-ui";
import { useThemeStore, useAppStore } from "@/store";
const theme = useThemeStore();
const app = useAppStore();
const { primaryColor } = useThemeVars().value;
</script>
<style lang="scss" scoped>
.layout_sider {
    :deep(.n-layout-sider-scroll-container) {
        width: 100%;
        // .n-scrollbar {
        //     height: calc(100% - 50px);
        // }
    }
}
.layout_main {
    :deep(.n-layout-scroll-container) {
        display: inherit;
        flex-direction: inherit;
    }
}
</style>
