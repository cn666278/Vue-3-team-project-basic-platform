import type { App } from "vue";
import { createRouterGuard } from './guard';
import {
    createRouter,
    createWebHashHistory
} from "vue-router";
import { constantRoutes } from './routes';
export const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes,
});

export function setupRouter(app: App) {
    createRouterGuard(router);
    app.use(router);
}

export * from './routes';