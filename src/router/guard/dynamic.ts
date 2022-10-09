import type { Router, RouteRecordRaw } from "vue-router";
import { useRouteStore, useAuthStore } from "@/store";
import { storeToRefs } from "pinia";
export default async (router: Router) => {
    const { getMenu, hasRoute } = storeToRefs(useRouteStore());
    const { getAsyncRouteMenu } = useRouteStore();
    const { getUserSession } = useAuthStore();
    if (!hasRoute.value) {
        await getAsyncRouteMenu();
        await getUserSession();
    }
    const menu: AuthRoute.Route[] = getMenu.value;
    await menu.map((route) => {
        if(route.children == undefined) {
            router.addRoute('Layout', route as unknown as RouteRecordRaw);
        } else {
            router.addRoute(route as unknown as RouteRecordRaw);
        }
    });
};
