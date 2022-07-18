import { RouteRecordRaw } from "vue-router";
import Home from "@/views/Home/index.vue";
import Login from "@/views/Login/index.vue";
import { BasicLayout } from "@/Layout";
import NotFound from "@/components/Error/404.vue";
export const constantRoutes: RouteRecordRaw[] = [
    {
        name: "root",
        path: "/",
        redirect: "/home",
    },
    {
        name: "Layout",
        path: "/",
        component: BasicLayout,
        children: [
            {
                name: "home",
                path: "/home",
                meta: {
                    title: "首页",
                },
                component: Home,
            },
        ],
    },
    {
        name: "login",
        path: "/login",
        meta: {
            title: "登录页",
        },
        component: Login,
    },
    {
        name: "NotFound404",
        path: "/:pathMatch(.*)",
        // alias: '/404',
        meta: {
            title: "找不到页面",
        },
        component: NotFound,
    },
    //白名单页面只需要写上路由在白名单列表加上路径即可
    // {
    //     name: "test",
    //     path: "/test",
    //     meta: {
    //         title: "测试",
    //     },
    //     component: Test,
    // },
];
