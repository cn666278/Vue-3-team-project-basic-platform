import type { Router } from "vue-router";
import { getToken } from "@/utils/auth";
import constantRouter from './dynamic';

export async function createRouterGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        window.$loadingBar?.start();
        // next();
        if (getToken()) {
            await constantRouter(router);
            if (to.fullPath == "/login") {
                next({path: "/home"});
            } else {
                next();
            }
        } else {
            if (to.fullPath == "/login") {
                next();
            } else {
                next({ path: "/login" });
            }
        }
    });
    router.afterEach((to) => {
        window.$loadingBar?.finish();
    });
}
