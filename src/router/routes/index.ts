import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home/index.vue';
import Login from '@/views/Login/index.vue';
import { BasicLayout } from '@/components/Layout';
import NotFound from '@/components/error/404.vue';
export const constantRoutes: RouteRecordRaw[] = [
    {
        name: 'root',
        path: '/',
        redirect: '/home',
    },
    {
        name: 'Layout',
        path: '/',
        component: BasicLayout,
        children: [{
            name: 'home',
            path: 'home',
            component: Home,
        }]
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
    },
    {
        path: '/:pathMatch(.*)',
        name: 'NotFound404',
        component: NotFound,
    },
];