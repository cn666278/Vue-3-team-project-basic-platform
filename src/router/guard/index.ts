import type { Router } from "vue-router";
import { getToken } from "@/utils/auth";

export function createRouterGuard(router: Router) {
    router.beforeEach((to, from, next) => {
        window.$loadingBar?.start();
        // next();
        if (getToken()) {
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
