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
      path: "/test",
      name: "test",
      component: () => import("@/views/test.vue"),
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  // 1. If route requires auth and user is NOT logged in -> Redirect to Login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "login" });
    return;
  }

  // 2. If user IS logged in and tries to visit Login -> Redirect to Admin
  if (to.name === "login" && authStore.isAuthenticated) {
    next({ name: "admin" });
    return;
  }

  next();
});

export default router;
