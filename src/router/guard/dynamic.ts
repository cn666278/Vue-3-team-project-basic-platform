import type { Router } from "vue-router";
import { useRouteStore } from "@/store";
export default async (router: Router) => {
    const routeStore = useRouteStore();
    const { getAsyncRouteMenu } = routeStore;
    if (!routeStore.hasRoute) {
        await getAsyncRouteMenu();
    }
    const menu: AuthRoute.Route[] = routeStore.getMenu;
    await menu.map((route) => {
        router.addRoute(route);
    });
};

