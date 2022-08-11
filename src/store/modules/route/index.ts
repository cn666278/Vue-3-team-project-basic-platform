import { BlankLayout, BasicLayout } from "@/Layout";
import { defineStore } from "pinia";
import { markRaw, defineAsyncComponent } from "vue";
import { getMenusTree, getMenusTreeNew } from "@/api/login";
interface RouterState {
    menu: AuthRoute.Route[];
}
export const useRouteStore = defineStore("route-store", {
    state: (): RouterState => ({
        menu: [],
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
                // if (route.component == "Layout") {
                //     route.path = `/${route.path}`;
                //     route.component = markRaw(BasicLayout);
                // } else if (
                //     route.component != "Layout" &&
                //     route.children.length > 0
                // ) {
                //     route.path = "/";
                //     route.component = markRaw(BlankLayout);
                // } else {
                //     route.component = this.AsyncComp(route.component);
                // }
                // if (route.children.length > 0) {
                //     return this.filterRouteMenu(route.children);
                // }
                // if (route.path[0] == "/") return route;
                if (route.component == null && route.url[0] != "/") {
                    route.path = `/${route.url}`;
                    route.component = markRaw(BasicLayout);
                } else if (route.component != null && route.url[0] != "/" && route.children == undefined) {
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
        AsyncComp:
            (path: string) =>
            // defineAsyncComponent(
            //     () => import("../../../views/" + path + "/index.vue")
            // ),
            () =>
                import("../../../views/" + path + "/index.vue"),
    },
});
