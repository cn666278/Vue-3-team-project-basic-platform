import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home/index.vue';
import Login from '@/views/Login/index.vue';
export const constantRoutes: RouteRecordRaw[] = [
    {
        name: 'root',
        path: '/',
        redirect: '/home',
    },
    {
        name: 'home',
        path: '/home',
        component: Home,
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
    }
];