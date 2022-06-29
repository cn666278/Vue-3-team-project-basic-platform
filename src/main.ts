import { createApp } from "vue";
import App from "./App.vue";
import { setupRouter } from "./router";
import { setupStore } from "./store";
// createApp(App).mount('#app')
async function setupApp() {
    const app = createApp(App);
    setupRouter(app);
    setupStore(app);
    app.mount("#app");
}
setupApp();
