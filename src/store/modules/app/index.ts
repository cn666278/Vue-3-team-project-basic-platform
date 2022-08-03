import { defineStore } from "pinia";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { mergeArray } from "@/utils/common";

interface AppState {
    settingDrawerVisible: boolean;
    sideCollapsed: boolean;
    tagTabsVisible: boolean;
    tabRouteList: RouteLocationNormalizedLoaded[];
}

export const useAppStore = defineStore("app-store", {
    state: (): AppState => ({
        settingDrawerVisible: false,
        sideCollapsed: false,
        tagTabsVisible: true,
        tabRouteList: [],
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
        /**设置是否显示多页签 */
        setTagTabsVisible(visible: boolean) {
            this.tagTabsVisible = visible;
        },
        /**设置多页签打开过的路由数据 */
        setTabRouteList(nowRoute: RouteLocationNormalizedLoaded) {
            this.tabRouteList = mergeArray(
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
            console.log(this.tabRouteList);
        },
    },
    persist: {
        key: 'app-store',
        storage: window.sessionStorage,
        paths: ['tagTabsVisible','tabRouteList'],
    }
});
