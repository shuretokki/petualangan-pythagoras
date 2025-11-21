import { createApp } from "vue";
import "./style.css";
import { createPinia } from "pinia";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import router from "./router";
import { VueFire, VueFireAuth } from "vuefire";
import { app as firebaseApp } from "./firebase";
import { MotionPlugin } from "@vueuse/motion";
import { useAuthStore } from "./stores/auth";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.use(MotionPlugin);

const authStore = useAuthStore();
authStore.initAuth();

app.mount("#app");
