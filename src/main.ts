import { createApp } from "vue";
import App from "./App.vue";
import { setupRouter } from "./router";
import { setupStore } from "./store";
import { setupNaive } from "@/plugins";
import "virtual:svg-icons-register";
import "@/styles/index.scss";

// createApp(App).mount('#app')
const app = createApp(App);
async function setupApp() {
  // 注册全局常用的 naive-ui 组件
  setupNaive(app);
  await setupStore(app);
  await setupRouter(app);
  app.mount("#app");
}
setupApp();
