import { defineStore } from "pinia";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { mergeObjArray } from "@/utils/common";

interface AppState {
    settingDrawerVisible: boolean;
    sideCollapsed: boolean;
    tagTabsVisible: boolean;
    tabRouteList: RouteLocationNormalizedLoaded[];
    actionChildrenList: AuthRoute.Route[];
}

export const useAppStore = defineStore("app-store", {
    state: (): AppState => ({
        settingDrawerVisible: false,
        sideCollapsed: false,
        tagTabsVisible: true,
        tabRouteList: [],
        actionChildrenList: [],
    }),
    getters: {
        getTagTabList: (state) => {
            return state.tabRouteList;
        },
    },
    actions: {
        /**触发系统配置抽屉展开 */
        toggleSettingDrawerVisible() {
            this.settingDrawerVisible = !this.settingDrawerVisible;
        },
        /**设置侧边栏是否缩小 */
        setSideCollapsed(collapsed: boolean) {
            this.sideCollapsed = collapsed;
        },
        /**设置活动子级菜单目录 */
        setActionChildrenList(actionChildrenList: AuthRoute.Route[]) {
            this.actionChildrenList = actionChildrenList;
        },
        /**设置是否显示多页签 */
        setTagTabsVisible(visible: boolean) {
            this.tagTabsVisible = visible;
        },
        /**设置多签页路由数据 */
        setTabRouteList(nowRoute: RouteLocationNormalizedLoaded[]) {
            this.tabRouteList.length = 0;
            this.tabRouteList = nowRoute;
        },
        /**合并多页签打开过的路由数据 */
        mergeTabRouteList(nowRoute: RouteLocationNormalizedLoaded) {
            this.tabRouteList = mergeObjArray(
                this.tabRouteList,
                [nowRoute],
                "name"
            );
        },
        /**删除多页签路由数据 */
        removeTabRouteList(key: string) {
            let findKey = this.tabRouteList.findIndex((v) => {
                if(v.name === key) return true
            });
            this.tabRouteList.splice(findKey, 1);
        },
        /**删除全部多签页路由数据 */
        removeAllTabRouteList() {
            this.tabRouteList.length = 0;
        }
    },
    persist: {
        key: 'app-store',
        storage: window.sessionStorage,
        paths: ['tagTabsVisible','tabRouteList'],
    }
});
