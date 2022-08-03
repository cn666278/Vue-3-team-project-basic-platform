import type { App } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export async function setupStore(app: App) {
    const store = createPinia();
    store.use(piniaPluginPersistedstate);
    app.use(store);
}

export * from "./modules";
