import type { App } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-persistedstate-plugin";

export function setupStore(app: App) {
    const store = createPinia();
    store.use(createPersistedState());
    app.use(store);
}

export * from "./modules";
