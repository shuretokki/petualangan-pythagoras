<script setup lang="ts">
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
        : (ui.error = "Login gagal. Periksa kredensial Anda.");
};
</script>

<template>
    <div
        class="fixed inset-0 w-full h-full bg-[#FAFAFA] flex items-center justify-center p-6 overflow-hidden font-sans text-slate-900"
    >
        <div class="absolute inset-0 pointer-events-none z-0">
            <div
                class="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-slate-200/40 blur-3xl"
            />
            <div
                class="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-200/30 blur-3xl"
            />
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
                <form @submit.prevent="submit" class="space-y-5">
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
                                v-model="form.email"
                                type="email"
                                placeholder="admin@sekolah.id"
                                class="w-full !pl-12 !bg-white !border-zinc-200 !text-zinc-800 !rounded-2xl !py-3 focus:!border-zinc-400 focus:!ring-0"
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
                                v-model="form.pass"
                                :feedback="false"
                                toggleMask
                                placeholder="••••••••"
                                inputClass="w-full !pl-4 !bg-white !border-zinc-200 !text-zinc-800 !rounded-2xl !py-3 focus:!border-zinc-400 focus:!ring-0"
                                class="w-full"
                            />
                        </div>
                    </div>

                    <div
                        v-if="ui.error"
                        class="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-sm text-rose-600 font-medium"
                    >
                        <i-lucide-alert-circle class="w-4 h-4 shrink-0" />
                        {{ ui.error }}
                    </div>

                    <Button
                        type="submit"
                        label="Sign In"
                        :loading="ui.loading"
                        class="w-full !bg-zinc-900 !border-zinc-900 !text-white !rounded-2xl !py-3.5 !font-bold hover:!bg-zinc-800 mt-2"
                    />
                </form>

                <div class="mt-8 pt-6 text-center">
                    <router-link
                        :to="{ name: 'home' }"
                        class="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-800 transition-colors font-medium"
                    >
                        <i-lucide-arrow-left class="w-4 h-4" /> Kembali ke Home
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
