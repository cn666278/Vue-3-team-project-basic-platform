<template>
    <suspense>
        <n-layout has-sider class="layout_main">
            <n-layout-sider
                class="layout_sider"
                collapse-mode="width"
                show-trigger
                bordered
            >
                <Slider></Slider>
            </n-layout-sider>
            <n-layout class="layout_content">
                <n-layout-header
                    class="layout_content_header"
                    position="static"
                    bordered
                >
                    <BasicHeader></BasicHeader>
                </n-layout-header>
                <n-layout-content class="layout_content_content" bordered>
                    <n-card class="layout_content_content_card" content-style="height: inherit">
                        <BlankLayout />
                    </n-card>
                </n-layout-content>
                <n-layout-footer class="layout_content_footer" bordered
                    >footer</n-layout-footer
                >
            </n-layout>
            <SettingDrawer />
        </n-layout>
    </suspense>
</template>
<script setup lang="ts">
import Slider from "./Slider/index.vue";
import SettingDrawer from "@/components/SettingDrawer/index.vue";
import BlankLayout from "@/Layout/BlankLayout/index.vue";
import BasicHeader from "./Header/index.vue";
</script>
<style lang="scss">
.layout_main {
    height: 100vh;
    // .layout_sider {
    // }
    .layout_content {
        .layout_content_header {
            height: 50px;
            padding: 0 10px;
            display: flex;
            align-items: center;
        }
        .layout_content_content {
            height: calc(100% - 80px);
            padding: 10px;
            box-sizing: border-box;
            background-color: #f3f3f3;
            .layout_content_content_card {
                height: initial;
            }
        }
        .layout_content_footer {
            height: 30px;
        }
    }
}
</style>
