import type { Router } from "vue-router";
import { getToken } from "@/utils/auth";
import { getTitle } from "@/utils/common";
import constantRouter from "./dynamic";

const whitelist:string[] = ['/login', '/404'];
export async function createRouterGuard(router: Router) {
    let oneRun = false;
    router.beforeEach(async (to, from, next) => {
        window.$loadingBar?.start();
        if (getToken()) {
            await constantRouter(router);
            if (to.fullPath == "/login") {
                next({ path: "/" });
            } else {
                /**router必定会先执行带参数的next,再执行没带参数的next,所以需要个boolean来控制 */
                if (oneRun) {
                    next();
                } else {
                    if (to.query?.redirect && to.query.redirect != "/login") {
                        let path: string = to.query.redirect as string;
                        next({ path });
                    } else {
                        next(to.fullPath);
                    }
                    oneRun = true;
                }
            }
        } else {
            if (oneRun) {
                next();
            } else {
                console.log(to);
                if (to.path == "/login") {
                    next();
                } else if(whitelist.includes(to.path)) {
                    next(to.path);
                } else {
                    next({
                        path: "/login",
                        query: {
                            redirect: to.path,
                        },
                    });
                }
                oneRun = true;
            }
        }
        /**页面跳转就更改title */
        if(to.meta?.title) {
            getTitle(to.meta.title as string);
        }
    });
    router.onError((error: ErrorConstructor, to, from) => {
        if (
            error
                .toString()
                .indexOf(
                    "TypeError: Failed to fetch dynamically imported module"
                ) > -1
        ) {
            router.push({ path: "/404" });
        }
    });
    router.afterEach((to) => {
        window.$loadingBar?.finish();
    });
}
