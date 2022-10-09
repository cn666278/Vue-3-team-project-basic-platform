import { BlankLayout, BasicLayout } from "@/Layout";
import { defineStore } from "pinia";
import { markRaw, defineAsyncComponent } from "vue";
import { getMenusTree, getMenusTreeNew } from "@/api/login";
interface RouterState {
    menu: AuthRoute.Route[];
    menuModules: Record<string, () => Promise<{[key: string]: any;}>>,
}
export const useRouteStore = defineStore("route-store", {
    state: (): RouterState => ({
        menu: [],
        menuModules: import.meta.glob("../../../views/**/index.vue"),
    }),
    getters: {
        getMenu: (state) => {
            return state.menu;
        },
        hasRoute: (state) => {
            return state.menu.length > 0;
        },
    },
    actions: {
        async getAsyncRouteMenu() {
            let { Data } = await getMenusTreeNew();
            this.menu = this.filterRouteMenu(
                Data as unknown as AuthRoute.Route[]
            );
        },
        filterRouteMenu(allRoute: AuthRoute.Route[]) {
            allRoute.map((route) => {
                if (route.component == null && route.url[0] != "/") {
                    route.path = `/${route.url}`;
                    route.component = markRaw(BasicLayout);
                } else if (route.component != null && route.url[0] != "/") {
                    route.path = route.url;
                    route.component = markRaw(BlankLayout);
                } else {
                    route.path = route.url;
                    route.component = this.AsyncComp(route.component);
                }
                if (route.children != undefined && route.children.length > 0) {
                    return this.filterRouteMenu(route.children);
                }
            });
            return allRoute;
        },
        AsyncComp(path: string) {
            return this.menuModules[`../../../views/${path}/index.vue`]
        },
            // (path: string) => {
            //     return this.menuModules[`../../../views/${path}/index.vue`];
            // }
            // defineAsyncComponent(
            //     () => import("../../../views/" + path + "/index.vue")
            // ),
            // () =>
            //     import("../../../views/" + path + "/index.vue"),
    },
});
