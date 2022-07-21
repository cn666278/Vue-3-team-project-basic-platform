<template>
    <n-menu
        v-model="activeKey"
        :mode="theme.layoutMode"
        :options="menuOption"
        :inverted="sideInverted || headerInverted"
        @update:value="onMenuItem"
    />
</template>
<script setup lang="ts">
import { useRouteStore, useThemeStore } from "@/store";
import type { MenuOption } from "naive-ui";
import { ref, Ref } from "vue";
import { router } from "@/router";
defineProps(['sideInverted','headerInverted'])
const routeStore = useRouteStore();
const theme = useThemeStore();
let menu = ref(await routeStore.getMenu);
/**递归拼装menu所需数据 */
const routeTransformMenu = (routes: AuthRoute.Route[]): MenuOption[] => {
    let routeMenu: MenuOption[] = [];
    for (let index = 0; index < routes.length; index++) {
        const route = routes[index];
        if (route.children.length > 0) {
            routeTransformMenu(route.children);
        }
        routeMenu.push({
            key: route.name,
            label: route.meta.title,
            children:
                route.children.length > 0
                    ? routeTransformMenu(route.children)
                    : undefined,
        });
    }
    return routeMenu;
};
let menuOption: Ref<MenuOption[]> = ref([]);
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
    router.push({ name: key });
};
</script>
<style lang="scss" scoped></style>
