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
                @contextmenu="onContextMenu(item, $event)"
                :closable="app.getTagTabList.length > 1"
                >{{ item.meta.title }}</n-tag
            >
        </div>
        <n-dropdown
            :show="showDropdownRef"
            placement="bottom-start"
            trigger="manual"
            :x="xRef"
            :y="yRef"
            :options="contextMenuOption"
            @clickoutside="onClickOutSide"
            @select="onContextMenuSelect"
        />
    </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from "vue-router";
import { useAppStore } from "@/store";
const route = useRoute();
const router = useRouter();
const app = useAppStore();
const showDropdownRef = ref(false);
const xRef = ref(0);
const yRef = ref(0);
const contextMenuData = ref<RouteLocationNormalizedLoaded>();
const contextMenuOption = [
    {
        label: "关闭当前",
        key: "closeCurrent",
    },
    {
        label: "关闭其他",
        key: "closeOther",
    },
    // {
    //     label: "关闭全部",
    //     key: "closeAll",
    // },
];
onMounted(() => {
    app.mergeTabRouteList(Object.assign({}, JSON.parse(JSON.stringify(route))));
});

/**监听路由状态进行增加 */
watch(route, (nowRoute) => {
    if (nowRoute.name != "NotFound404") {
        app.mergeTabRouteList(
            Object.assign({}, JSON.parse(JSON.stringify(nowRoute)))
        );
    }
});

/**点击tag后路由跳转 */
const onTagTab = (route: RouteLocationNormalizedLoaded) => {
    router.push({ path: route.path });
};

/**右键tag后显示下拉菜单 */
const onContextMenu = (
    route: RouteLocationNormalizedLoaded,
    event: MouseEvent
) => {
    event.preventDefault();
    event.stopPropagation();
    contextMenuData.value = route;
    showDropdownRef.value = false;
    nextTick().then(() => {
        showDropdownRef.value = true;
        xRef.value = event.clientX;
        yRef.value = event.clientY;
    });
};

/**右键tag后选择下拉 */
const onContextMenuSelect = (key: string | number) => {
    if(key === 'closeCurrent' && contextMenuData.value) {
        tagTabCloseHandle(contextMenuData.value.name as string);
    } else if(key === 'closeOther' && contextMenuData.value) {
        let currentRoute = app.tabRouteList.filter((item) => {
            return contextMenuData.value?.name === item.name;
        });
        app.setTabRouteList(currentRoute);
        router.push({ path: contextMenuData.value.path });
    }
    showDropdownRef.value = false;
};

/**右键tag后点击其他地方 */
const onClickOutSide = () => {
    showDropdownRef.value = false;
    contextMenuData.value = undefined;
};

/**tag关闭事件 */
const tagTabCloseHandle = (key: string, event?: MouseEvent) => {
    event?.stopPropagation();
    if (app.tabRouteList.length > 1) {
        let currentKey = app.tabRouteList.findIndex((item) => {
            return route.path === item.path;
        });
        app.removeTabRouteList(key);
        let lastRoute = app.tabRouteList[app.tabRouteList.length - 1];
        if (
            currentKey == app.tabRouteList.length ||
            currentKey == app.tabRouteList.length - 1
        ) {
            router.push({ path: lastRoute.path });
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
