import { createApp } from "vue";
import "./style.css";
// @ts-ignore
import App from "./App.vue";
import router from './router'

// createApp(App).mount("#app");
const app = createApp(App)
app.use(router)
// 路由准备就绪后挂载APP实例
router.isReady().then(() => app.mount('#app'))

postMessage({ payload: "removeLoading" }, "*");

