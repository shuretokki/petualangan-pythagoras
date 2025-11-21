<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

const form = reactive({ email: "", pass: "" });
const ui = reactive({ loading: false, error: "" });

const submit = async () => {
    if (!form.email || !form.pass)
        return (ui.error = "Mohon isi email dan password.");

    ui.loading = true;
    ui.error = "";

    const res = await auth.login(form.email, form.pass);
    ui.loading = false;

    res.success
        ? router.push({ name: "admin" })
        : (ui.error = "Login gagal. Periksa kredensial.");
};
</script>

<template>
    <div
        class="fixed inset-0 bg-zinc-50 font-sans text-zinc-900 flex justify-center overflow-hidden"
    >
        <div
            class="w-full max-w-md bg-white h-full border border-zinc-200 flex flex-col relative"
        >
            <header
                class="flex-none z-30 bg-white border-b border-zinc-100 px-4 h-14 flex items-center gap-3"
            >
                <button
                    @click="router.push({ name: 'home' })"
                    class="p-2 -ml-2 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-zinc-50"
                >
                    <i-lucide-arrow-left class="w-5 h-5" />
                </button>
                <h1 class="font-recoleta text-lg font-bold text-zinc-800">
                    Admin Portal
                </h1>
            </header>

            <div class="flex-1 overflow-y-auto overscroll-contain p-6 pb-safe">
                <div
                    class="flex flex-col items-center py-8 animate-in slide-in-from-bottom-4 duration-500"
                >
                    <div
                        class="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-800 mb-4 border border-zinc-100"
                    >
                        <i-lucide-lock class="w-8 h-8" />
                    </div>
                    <h2 class="font-recoleta text-2xl font-bold text-zinc-900">
                        Selamat Datang
                    </h2>
                    <p class="text-zinc-400 text-sm text-center mt-1">
                        Masuk untuk mengelola konten.
                    </p>
                </div>

                <form
                    @submit.prevent="submit"
                    class="space-y-5 animate-in slide-in-from-bottom-4 duration-500 delay-100"
                >
                    <div class="space-y-1.5">
                        <label
                            class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1"
                            >Email</label
                        >
                        <div class="relative">
                            <span
                                class="absolute left-4 top-3.5 text-zinc-400 z-10"
                                ><i-lucide-mail class="w-4 h-4"
                            /></span>
                            <InputText
                                v-model="form.email"
                                type="email"
                                placeholder="admin@sekolah.id"
                                class="w-full pl-11 bg-zinc-50 border-zinc-200 rounded-xl py-3 text-sm focus:ring-0 focus:border-zinc-400 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label
                            class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1"
                            >Password</label
                        >
                        <div class="relative">
                            <Password
                                v-model="form.pass"
                                :feedback="false"
                                toggleMask
                                placeholder="••••••••"
                                inputClass="w-full pl-4 bg-zinc-50 border-zinc-200 rounded-xl py-3 text-sm focus:ring-0 focus:border-zinc-400 focus:bg-white transition-colors"
                                class="w-full"
                            />
                        </div>
                    </div>

                    <div
                        v-if="ui.error"
                        class="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-xs text-rose-600 font-bold"
                    >
                        <i-lucide-alert-circle class="w-4 h-4 shrink-0" />
                        {{ ui.error }}
                    </div>

                    <div class="pt-2">
                        <Button
                            type="submit"
                            label="Sign In"
                            :loading="ui.loading"
                            class="w-full bg-zinc-900! border-zinc-900! text-white! font-bold! hover:bg-zinc-800!"
                        />
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
