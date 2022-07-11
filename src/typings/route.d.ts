declare namespace AuthRoute {
    import { RouteRecordRaw, RouteLocationRaw, RouteMeta, RawRouteComponent } from "vue-router";
    declare module 'vue-router' {
        interface AuthRouteMeta extends RouteMeta {
            title: string;
            icon: string;
            noCache: boolean;
            breadcrumb: boolean;
            affix: boolean;
        }
    }
    // type RoutePath = "/" | "/:pathMatch(.*)*";
    // interface AuthRouteMeta extends RouteMeta {
    //     title: string;
    //     icon: string;
    //     noCache: boolean;
    //     breadcrumb: boolean;
    //     affix: boolean;
    // }
    interface Route extends RouteRecordRaw {
        path: string;
        name: string;
        hidden: boolean;
        meta: AuthRouteMeta;
        component: Promise;
        redirect: RouteLocationRaw;
        children: Route[];
    }
}
