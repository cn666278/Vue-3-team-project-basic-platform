import { defineStore } from 'pinia';
import { darkTheme } from 'naive-ui';

export const useThemeStore = defineStore('theme-store', {
    state: ():system.settingTheme => ({
        darkMode: false,
    }),
    getters: {
        naiveUiTheme(state) {
            return state.darkMode ? darkTheme : undefined;
        },
    },
    actions: {
        setDarkMode(darkMode: boolean) {
            this.darkMode = darkMode;
        },
    },
})