<template>
    <n-scrollbar>
        <n-menu
            v-model="activeKey"
            mode="vertical"
            :options="menuOption"
            @update:value="onMenuItem"
        />
    </n-scrollbar>
</template>
<script setup lang="ts">
import { useRouteStore } from "@/store";
import type { MenuOption } from "naive-ui";
import { ref } from "vue";
import type { Ref } from "vue";
import { router } from "@/router";
const routeStore = useRouteStore();
let menu = ref(await routeStore.getMenu);
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
const subscribe = routeStore.$subscribe((mutation, store) => {
    if (menu.value.length == 0 && store.menu.length > 0) {
        menu.value = store.menu;
        menuOption.value = routeTransformMenu(menu.value);
    }
});
const activeKey = ref<string | null>(null);
const onMenuItem = (key: string, item: MenuOption) => {
    router.push({name: key});
};
</script>
<style lang="scss"></style>
