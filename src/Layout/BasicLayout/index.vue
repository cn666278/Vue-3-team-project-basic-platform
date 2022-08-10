<template>
    <suspense>
        <n-layout has-sider class="layout_main">
            <n-layout-sider
                class="layout_sider"
                collapse-mode="width"
                :inverted="theme.sideInverted"
                :width="theme.sideWidth"
                :native-scrollbar="true"
                show-trigger
                bordered
                @update:collapsed="app.setSideCollapsed"
                v-if="theme.layoutMode == 'vertical'"
            >
                <Logo class="layout_sider_content" />
                <n-scrollbar>
                    <Slider
                        class="layout_sider_content"
                        :side-inverted="theme.sideInverted"
                    ></Slider>
                </n-scrollbar>
            </n-layout-sider>
            <n-layout class="layout_content">
                <n-layout-header
                    class="layout_content_header"
                    position="static"
                    :inverted="theme.headerInverted"
                    bordered
                >
                    <BasicHeader />
                </n-layout-header>
                <n-layout-content
                    :class="[
                        'layout_content_content',
                        theme.isDarkTheme ? '' : 'layout_content_background',
                    ]"
                    bordered
                >
                    <TagTabs v-if="app.tagTabsVisible" />
                    <n-scrollbar>
                        <n-card class="layout_content_content_card" content-style="padding: 10px">
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
import SettingDrawer from "@/components/SettingDrawer/index.vue";
import TagTabs from "@/components/TagTabs/index.vue";
import BlankLayout from "@/Layout/BlankLayout/index.vue";
import BasicHeader from "./Header/index.vue";
import { useThemeStore, useAppStore } from "@/store";
const theme = useThemeStore();
const app = useAppStore();
</script>
<style lang="scss" scoped>
.layout_sider {
    :deep(.n-layout-sider-scroll-container) {
        width: 100%;
        .n-scrollbar {
            height: calc(100% - 50px);
        }
    }
}
.layout_content_background {
    :deep(.n-layout-scroll-container) {
        display: inherit;
        flex-direction: inherit;
    }
}
</style>
