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
                    >header</n-layout-header
                >
                <n-layout-content class="layout_content_content" bordered>
                    <BlankLayout />
                </n-layout-content>
                <n-layout-footer class="layout_content_footer" bordered
                    >footer</n-layout-footer
                >
            </n-layout>
        </n-layout>
    </suspense>
</template>
<script setup lang="ts">
import {
    useLoadingBar,
    useDialog,
    useNotification,
    useMessage,
} from "naive-ui";
import { onMounted } from "vue";
import Slider from "./Slider/index.vue";
import BlankLayout from '@/components/Layout/BlankLayout/index.vue';
onMounted(() => {
    //  全局组件函数API声明
    window.$loadingBar = useLoadingBar();
    window.$dialog = useDialog();
    window.$notification = useNotification();
    window.$message = useMessage();
});
</script>
<style lang="scss">
.layout_main {
    height: 100vh;
    // .layout_sider {
    // }
    .layout_content {
        .layout_content_header {
            height: 50px;
        }
        .layout_content_content {
            height: calc(100% - 80px);
        }
        .layout_content_footer {
            height: 30px;
        }
    }
}
</style>
