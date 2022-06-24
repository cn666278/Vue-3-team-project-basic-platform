import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router';
import { setupNaiveUI } from './naiveUI';
// createApp(App).mount('#app')
async function setupApp() {
    const app = createApp(App);
    setupRouter(app);
    setupNaiveUI(app);
    app.mount('#app');
}
setupApp();