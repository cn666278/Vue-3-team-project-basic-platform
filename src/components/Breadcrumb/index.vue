<template>
    <n-breadcrumb>
        <n-breadcrumb-item v-for="item in menuLevel" :key="item">
            <span>{{ item }}</span>
        </n-breadcrumb-item>
    </n-breadcrumb>
</template>
<script setup lang="ts">
import { ref, Ref, watch } from "vue";
import { useRoute } from "vue-router";
import type { RouteLocationMatched } from "vue-router";
const route = useRoute();
const routeMatched: RouteLocationMatched[] = route.matched;
let menuLevel: Ref<string[]> = ref(
    routeMatched.map((matched) => {
        const meta = matched.meta as unknown as AuthRoute.AuthRouteMeta;
        return meta.title;
    })
);
const breadcrumbHandle = watch(route, (nowRoute) => {
    menuLevel.value = nowRoute.matched.map((matched) => {
        const meta = matched.meta as unknown as AuthRoute.AuthRouteMeta;
        return meta.title;
    });
});
defineProps(['inverted', 'primaryColor'])
</script>
<style lang="scss"></style>
