import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { VueFire, VueFireAuth } from "vuefire";
import { app as firebaseApp } from "./firebase";
import { MotionPlugin } from "@vueuse/motion";

createApp(App)
  .use(createPinia())
  .use(router)
  .use(MotionPlugin)
  .use(PrimeVue, { theme: { preset: Aura } })
  .use(VueFire, { firebaseApp, modules: [VueFireAuth()] })
  .mount("#app");
