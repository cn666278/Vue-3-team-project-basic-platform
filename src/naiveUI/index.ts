import type { App } from "vue";
import { useLoadingBar } from "naive-ui";
export function setupNaiveUI(app: App) {
    window.$loadingBar = useLoadingBar();
}