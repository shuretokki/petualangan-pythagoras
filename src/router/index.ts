import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/materi",
      name: "materi",
      component: () => import("@/views/MateriView.vue"),
    },
    {
      path: "/contoh-soal",
      name: "contoh-soal",
      component: () => import("@/views/ContohSoalView.vue"),
    },
    {
      path: "/kuis",
      name: "kuis",
      component: () => import("@/views/KuisView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("@/views/AdminView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/about",
      name: "about",
      component: () => import("@/views/AboutView.vue"),
    },
    {
      path: "/labs",
      name: "labs",
      component: () => import("@/views/LabsView.vue"),
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login" });
    return;
  }

  if (to.name === "login" && authStore.isAuthenticated) {
    next({ name: "admin" });
    return;
  }

  next();
});

export default router;
