<template>
    <div class="tag_tab">
        <div
            class="tag"
            v-for="(item, index) in app.getTagTabList"
            :key="index"
        >
            <n-tag
                :type="route.name === item.name ? 'primary' : 'default'"
                @click="onTagTab(item)"
                @close="tagTabCloseHandle(item.name as string, $event)"
                :closable="app.getTagTabList.length > 1"
                >{{ item.meta.title }}</n-tag
            >
        </div>
    </div>
</template>
<script setup lang="ts">
import { watch, onMounted } from "vue";
import {
    useRoute,
    useRouter,
    RouteLocationNormalizedLoaded,
    RouteRecordName,
} from "vue-router";
import { useAppStore } from "@/store";
const route = useRoute();
const router = useRouter();
const app = useAppStore();
onMounted(() => {
    console.log(app.getTagTabList);
    app.setTabRouteList(Object.assign({}, JSON.parse(JSON.stringify(route))));
});
watch(route, (nowRoute) => {
    app.setTabRouteList(
        Object.assign({}, JSON.parse(JSON.stringify(nowRoute)))
    );
});
const onTagTab = (route: RouteLocationNormalizedLoaded) => {
    router.push({ name: route.name as RouteRecordName });
};
const tagTabCloseHandle = (key: string, event: MouseEvent) => {
    event.stopPropagation();
    if (app.tabRouteList.length > 1) {
        let currentKey = app.tabRouteList.findIndex((item) => {
            return route.path === item.path;
        });
        app.removeTabRouteList(key);
        let lastRoute = app.tabRouteList[app.tabRouteList.length - 1];
        if(currentKey == app.tabRouteList.length || currentKey == app.tabRouteList.length - 1) {
            router.push({ name: lastRoute.name as RouteRecordName });
        }
    }
};
</script>
<style lang="scss" scoped>
.tag_tab {
    width: 100%;
    display: flex;
    .tag {
        padding: 5px;
        &:first-child {
            padding-left: 0px;
        }
        &:last-child {
            padding-right: 0px;
        }
        :deep(.n-tag) {
            cursor: pointer;
        }
    }
}
</style>
