<template>
    <div class="errorContent">
        <n-result
            status="404"
            title="404 资源不存在"
            description="赶紧刷新或者回到首页吧"
        >
            <template #footer>
                <n-button type="info" size="medium" @click="onBack"
                    >回到上一页</n-button
                >
            </template>
        </n-result>
    </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const onBack = () => {
    let path: string = route.query.redirect as string;
    router.push({ path });
};
</script>
<style lang="scss" scoped>
.errorContent {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
