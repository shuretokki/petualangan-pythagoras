<script setup lang="ts">
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
                    class="inline-flex items-center justify-center w-16 h-16 mb-4 text-slate-800 bg-slate-100 rounded-2xl"
                >
                    <i-lucide-lock class="w-8 h-8" />
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
                                ><i-lucide-mail class="w-4 h-4"
                            /></span>
                            <InputText
                                v-model="email"
                                type="email"
                                class="w-full !pl-12 !bg-white !border-zinc-200 !text-zinc-800 !rounded-2xl !py-3 focus:!border-zinc-400 focus:!ring-0 shadow-sm"
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
                                inputClass="w-full !pl-4 !bg-white !border-zinc-200 !text-zinc-800 !rounded-2xl !py-3 focus:!border-zinc-400 focus:!ring-0 shadow-sm"
                                class="w-full"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div
                        v-if="errorMsg"
                        class="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-sm text-rose-600 font-medium"
                    >
                        <i-lucide-alert-circle class="w-4 h-4" />
                        {{ errorMsg }}
                    </div>

                    <Button
                        type="submit"
                        label="Sign In"
                        class="w-full !bg-zinc-900 !border-zinc-900 !text-white !rounded-2xl !py-3.5 !font-bold hover:!bg-zinc-800 shadow-lg shadow-zinc-200/50 transition-all mt-2"
                        :loading="isLoading"
                    />
                </form>

                <div class="mt-8 pt-6 text-center">
                    <router-link
                        :to="{ name: 'home' }"
                        class="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-800 transition-colors font-medium group"
                    >
                        <i-lucide-arrow-left
                            class="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                        />
                        Kembali ke Home
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
