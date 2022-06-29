import type { App } from "vue";
import { createRouterGuard } from './guard';
import {
    createRouter,
    createWebHistory,
} from "vue-router";
import { constantRoutes } from './routes';
export const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
});

export function setupRouter(app: App) {
    createRouterGuard(router);
    app.use(router);
}

export * from './routes';