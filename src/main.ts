import { createApp } from "vue";
import App from "./App.vue";
import { setupRouter } from "./router";
import { setupStore } from "./store";
import "virtual:svg-icons-register";
import '@/styles/index.scss';
// createApp(App).mount('#app')
async function setupApp() {
    const app = createApp(App);
    await setupStore(app);
    await setupRouter(app);
    app.mount("#app");
}
setupApp();
