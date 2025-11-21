import { auth } from "@/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const isAuthenticated = computed(() => !!user.value);

  let initialized = false;
  const initAuth = () => {
    if (initialized) return;
    initialized = true;

    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
      loading.value = false;
    });
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      user.value = userCredential.user;
      return { success: true };
    } catch (e: any) {
      return { success: false, e: e.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
      return { success: true };
    } catch (e: any) {
      return { success: false, e: e.message };
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    initAuth,
    login,
    logout,
  };
});
