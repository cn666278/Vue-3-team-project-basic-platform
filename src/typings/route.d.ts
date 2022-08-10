declare namespace AuthRoute {
    import { RouteRecordRaw, RouteLocationRaw, RouteMeta, RawRouteComponent } from "vue-router";
    declare module 'vue-router' {
        interface AuthRouteMeta extends RouteMeta {
            title: string;
            hidden: boolean;
            icon: string;
        }
    }
    interface AuthRouteMeta extends RouteMeta {
        title: string;
        hidden: boolean;
        icon: string;
    }
    interface Route extends RouteRecordRaw {
        name: string;
        url: string;
        path: string;
        meta: AuthRouteMeta;
        component: Promise;
        children: route[];
    }
}
