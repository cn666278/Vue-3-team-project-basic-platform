import { defineStore } from 'pinia';

interface AppState {
    settingDrawerVisible: boolean;
}

export const useAppStore = defineStore("app-store", {
    state: ():AppState => ({
        settingDrawerVisible: false,
    }),
    actions: {
        toggleSettingDrawerVisible() {
            this.settingDrawerVisible = !this.settingDrawerVisible;
        },
    }
});