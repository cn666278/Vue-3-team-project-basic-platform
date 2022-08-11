<template>
    <n-menu
        v-model="activeKey"
        :value="activeKey"
        :mode="theme.layoutMode"
        :options="menuOption"
        :expanded-keys="expandedKeys"
        :inverted="sideInverted || headerInverted"
        @update:value="onMenuItem"
        @update-expanded-keys="expandedKeysHandle"
    />
</template>
<script setup lang="ts">
import { useRouteStore, useThemeStore } from "@/store";
import type { MenuOption } from "naive-ui";
import { onMounted, ref, Ref, watch } from "vue";
// import { router } from "@/router";
import {useRoute, useRouter} from 'vue-router';
defineProps(['sideInverted','headerInverted'])
const routeStore = useRouteStore();
const theme = useThemeStore();
const route = useRoute();
const router = useRouter();
let menu = ref(await routeStore.getMenu);
let menuOption: Ref<MenuOption[]> = ref([]);
const expandedKeys = ref<string[]>([]);
/**递归拼装menu所需数据 */
const routeTransformMenu = (routes: AuthRoute.Route[]): MenuOption[] => {
    let routeMenu: MenuOption[] = [];
    for (let index = 0; index < routes.length; index++) {
        const route = routes[index];
        if (route.children != undefined && route.children.length > 0) {
            routeTransformMenu(route.children);
        }
        routeMenu.push({
            key: route.name,
            label: route.meta.title,
            children:
                (route.children != undefined && route.children.length > 0)
                    ? routeTransformMenu(route.children)
                    : undefined,
        });
    }
    return routeMenu;
};
if (menu.value.length > 0) {
    menuOption.value = routeTransformMenu(menu.value);
}
/**订阅store,如果store菜单获取到值就更新到菜单上 */
const subscribe = routeStore.$subscribe((mutation, store) => {
    if (menu.value.length == 0 && store.menu.length > 0) {
        menu.value = store.menu;
        menuOption.value = routeTransformMenu(menu.value);
    }
});
const activeKey = ref<string | null>(null);
/**菜单点击事件,点击后跳转到当前点击菜单的要么 */
const onMenuItem = (key: string) => {
    router.push({ path: key });
};
/**监听路由实时选中菜单 */
const routeHandle = watch(route,(nowRoute) => {
    activeKey.value = nowRoute.name as string;
    let paths = nowRoute.matched.map(routerPath => {
        return routerPath.name
    }) as string[];
    expandedKeys.value = paths;
});
const expandedKeysHandle = (keys: string[]) => {
    expandedKeys.value = keys;
};
onMounted(() => {
    activeKey.value = route.name as string;
    expandedKeys.value = route.matched.map(routeItem => routeItem.name) as string[];
});
</script>
<style lang="scss" scoped></style>
