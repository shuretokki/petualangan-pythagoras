<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
    if (!email.value || !password.value) {
        errorMsg.value = "Mohon isi email dan password.";
        return;
    }

    isLoading.value = true;
    errorMsg.value = "";

    const res = await authStore.login(email.value, password.value);

    if (res.success) {
        router.push({ name: "admin" });
    } else {
        errorMsg.value = "Login gagal. Periksa kredensial Anda.";
    }

    isLoading.value = false;
};
</script>

<template>
    <div
        class="fixed inset-0 w-full h-full bg-[#FAFAFA] flex items-center justify-center p-6 overflow-hidden font-sans text-slate-900"
    >
        <div class="absolute inset-0 pointer-events-none z-0">
            <div
                class="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-slate-200/40 blur-3xl"
            ></div>
            <div
                class="absolute bottom-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-violet-200/30 blur-3xl"
            ></div>
        </div>

        <div class="relative z-10 w-full max-w-sm flex flex-col items-center">
            <div class="text-center mb-8">
                <div
                    class="inline-flex items-center justify-center w-16 h-16 mb-4 text-slate-800 bg-slate-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect
                            width="18"
                            height="11"
                            x="3"
                            y="11"
                            rx="2"
                            ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>
                <h1 class="font-recoleta text-4xl font-bold text-zinc-900 mb-1">
                    Admin Portal
                </h1>
                <p class="text-zinc-500 text-sm">
                    Masuk untuk mengelola konten kuis.
                </p>
            </div>

            <div class="w-full">
                <form @submit.prevent="handleLogin" class="space-y-5">
                    <div class="space-y-1.5">
                        <label
                            class="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1"
                            >Email</label
                        >
                        <div class="relative">
                            <span
                                class="absolute left-4 top-3.5 text-zinc-400 z-10"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <rect
                                        width="20"
                                        height="16"
                                        x="2"
                                        y="4"
                                        rx="2"
                                    />
                                    <path
                                        d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                                    />
                                </svg>
                            </span>
                            <InputText
                                v-model="email"
                                type="email"
                                class="w-full !pl-12 !bg-white !border-zinc-200 !text-zinc-800 !py-3 focus:!border-zinc-400 focus:!ring-0 shadow-sm"
                                placeholder="admin@sekolah.id"
                            />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label
                            class="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1"
                            >Password</label
                        >
                        <div class="relative">
                            <Password
                                v-model="password"
                                :feedback="false"
                                toggleMask
                                inputClass="w-full !pl-4 !bg-white !border-zinc-200 !text-zinc-800 !py-3 focus:!border-zinc-400 focus:!ring-0 shadow-sm"
                                class="w-full"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div
                        v-if="errorMsg"
                        class="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-sm text-rose-600 font-medium"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                        {{ errorMsg }}
                    </div>

                    <Button
                        type="submit"
                        label="Sign In"
                        class="w-full !bg-zinc-900 !border-zinc-900 !text-white !py-3.5 !font-bold hover:!bg-zinc-800 shadow-lg shadow-zinc-200/50 transition-all mt-2"
                        :loading="isLoading"
                    />
                </form>

                <div class="mt-8 pt-6 text-center">
                    <router-link
                        :to="{ name: 'home' }"
                        class="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-800 transition-colors font-medium group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="group-hover:-translate-x-1 transition-transform"
                        >
                            <path d="m12 19-7-7 7-7" />
                            <path d="M19 12H5" />
                        </svg>
                        Kembali ke Home
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
