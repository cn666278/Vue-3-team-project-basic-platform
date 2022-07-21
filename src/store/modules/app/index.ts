import { defineStore } from "pinia";

interface AppState {
    settingDrawerVisible: boolean;
    sideCollapsed: boolean;
}

export const useAppStore = defineStore("app-store", {
    state: (): AppState => ({
        settingDrawerVisible: false,
        sideCollapsed: false,
    }),
    actions: {
        toggleSettingDrawerVisible() {
            this.settingDrawerVisible = !this.settingDrawerVisible;
        },
        setSideCollapsed(collapsed: boolean) {
            this.sideCollapsed = collapsed;
        },
    },
});
