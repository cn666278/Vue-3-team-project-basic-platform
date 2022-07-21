import { createApp } from "vue";
import App from "./App.vue";
import { setupRouter } from "./router";
import { setupStore } from "./store";
import "virtual:svg-icons-register";
// createApp(App).mount('#app')
async function setupApp() {
    const app = createApp(App);
    setupStore(app);
    await setupRouter(app);
    app.mount("#app");
}
setupApp();
