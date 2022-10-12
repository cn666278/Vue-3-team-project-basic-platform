<template>
    <n-menu
        ref="menuRef"
        v-model="activeKey"
        :value="activeKey"
        :mode="mode"
        :options="menuOption"
        :expanded-keys="expandedKeys"
        :inverted="sideInverted || headerInverted"
        @update:value="onMenuItem"
        @update-expanded-keys="expandedKeysHandle"
    />
</template>
<script setup lang="ts">
import { useRouteStore, useThemeStore, useAppStore } from "@/store";
import type { MenuOption, MenuInst } from "naive-ui";
import { onMounted, ref, Ref, watch } from "vue";
// import { router } from "@/router";
import { useRoute, useRouter } from "vue-router";
const props = defineProps(["mode", "sideInverted", "headerInverted"]);
const routeStore = useRouteStore();
const themeStore = useThemeStore();
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();
let menu = ref(await routeStore.getMenu);
let menuOption: Ref<MenuOption[]> = ref([]);
const menuRef = ref<MenuInst | null>(null);
const expandedKeys = ref<string[]>([]);
/**递归拼装menu所需数据 */
const routeTransformMenu = (routes: AuthRoute.Route[]): MenuOption[] => {
    let routeMenu: MenuOption[] = [];
    for (let index = 0; index < routes.length; index++) {
        const route = routes[index];
        if (
            route.children != undefined &&
            route.children.length > 0 &&
            themeStore.layoutMode != "mix"
        ) {
            routeTransformMenu(route.children);
        }
        if(themeStore.layoutMode == "mix" && props.mode == "horizontal") {
            routeMenu.push({
                key: route.path,
                label: route.meta.title,
                show: !route.meta.hidden,
                children: undefined,
            });
        } else {
            routeMenu.push({
                key: route.path,
                label: route.meta.title,
                show: !route.meta.hidden,
                children:
                route.children != undefined &&
                route.children.length > 0
                // themeStore.layoutMode == "mix" &&
                // props.mode == "vertical"
                    ? routeTransformMenu(route.children)
                    : undefined,
            });
        }
    }
    return routeMenu;
};
if (menu.value.length > 0) {
    menuOption.value = routeTransformMenu(menu.value);
}
/**订阅store,如果store菜单获取到值就更新到菜单上 */
const subscribe = routeStore.$subscribe((mutation, store) => {
    if (store.menu.length > 0) {
        menu.value = store.menu;
        menuOption.value = routeTransformMenu(menu.value);
    }
});
const mixSubscribe = appStore.$subscribe((mutation, store) => {
    if (
        store.actionChildrenList != null &&
        themeStore.layoutMode == "mix" &&
        props.mode == "vertical"
    ) {
        // console.log(store.actionChildrenList);
        // menu.value = [store.actionChildrenList];
        menuOption.value = routeTransformMenu(store.actionChildrenList);
    } else {
        menuOption.value = routeTransformMenu(menu.value);
    }
});
const activeKey = ref<string | null>(null);
/**菜单点击事件,点击后跳转到当前点击菜单的要么 */
const onMenuItem = (key: string) => {
    if (themeStore.layoutMode == "mix" && props.mode == "horizontal") {
        let childrenListKey = menu.value.findIndex((item) => {
            return item.path == key;
        });
        
        if(childrenListKey != -1) {
            activeKey.value = key;
            console.log(menu.value, childrenListKey);
            appStore.setActionChildrenList(menu.value[childrenListKey].children);
        }
    } else {
        router.push({ path: key });
    }
};
/**监听路由实时选中菜单 */
const routeHandle = watch(route, (nowRoute) => {
    activeKey.value = nowRoute.path as string;
    let paths = nowRoute.matched.map((routerPath) => {
        let path = routerPath.path;
        if(path.lastIndexOf('/') > 0) {
            path = path.slice(path.lastIndexOf('/')+1)
        }
        return path
    }) as string[];
    expandedKeys.value = paths;
    if (themeStore.layoutMode == "mix" && props.mode == "horizontal") {
        onMenuItem(expandedKeys.value[0] as string);
    }
});
const expandedKeysHandle = (keys: string[]) => {
    expandedKeys.value = keys;
};
onMounted(() => {
    activeKey.value = route.path as string;
    expandedKeys.value = route.matched.map(
        (routeItem) => {
            let path = routeItem.path;
            if(path.lastIndexOf('/') > 0) {
                path = path.slice(path.lastIndexOf('/')+1)
            }
            return path
        }
    ) as string[];
    if (themeStore.layoutMode == "mix" && props.mode == "horizontal") {
        onMenuItem(expandedKeys.value[0] as string);
    }
});
</script>
<style lang="scss" scoped>
</style>
