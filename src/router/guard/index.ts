import type { Router } from 'vue-router';

export function createRouterGuard(router: Router) {
    router.beforeEach((to, from, next) => {
        console.log(window);
        window.$loadingBar?.start();
        setTimeout(() => {
            next();
            window.$loadingBar?.finish();
        }, 3000);
    });
    router.afterEach((to) => {
        window.$loadingBar?.finish();
    });
}