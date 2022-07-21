import { defineStore } from "pinia";
import { darkTheme } from "naive-ui";

export const useThemeStore = defineStore("theme-store", {
    state: (): system.settingTheme => ({
        darkMode: false,
        layoutMode: "vertical",
        sideInverted: false,
        headerInverted: false,
    }),
    getters: {
        /**判断是否深色模式，为真返回深色模式 */
        naiveUiTheme(state) {
            return state.darkMode ? darkTheme : undefined;
        },
        /**判断是否深色模式 */
        isDarkTheme(state) {
            return state.darkMode
        },
    },
    actions: {
        /**设置深色模式 */
        setDarkMode(darkMode: boolean) {
            this.darkMode = darkMode;
        },
        /**设置布局模式 */
        setLayoutMod(mode: system.settingTheme["layoutMode"]) {
            this.layoutMode = mode;
        },
        /**设置侧边栏反转色 */
        setSideInverted(sideInverted: boolean) {
            this.sideInverted = sideInverted;
        },
        /**设置侧边栏反转色 */
        setHeaderInverted(headerInverted: boolean) {
            this.headerInverted = headerInverted;
        },
    },
    persist: {
        key: "theme-store",
        storage: window.localStorage,
    },
});
