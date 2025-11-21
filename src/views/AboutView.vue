<script setup lang="ts">
import mascotImg from "@/assets/image/mascot.png";

const router = useRouter();
const goHome = () => router.push({ name: "home" });
</script>

<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center w-full bg-[#FAFAFA] overflow-hidden relative font-sans text-slate-900"
    >
        <div class="fixed inset-0 pointer-events-none">
            <div
                class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-200/20 blur-3xl animate-pulse"
            ></div>
            <div
                class="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-3xl animate-pulse"
                style="animation-delay: 1s"
            ></div>
        </div>

        <div class="relative z-10 w-full max-w-sm flex flex-col min-h-screen">
            <div class="flex-1 flex flex-col items-center pb-10 pt-8 px-6">
                <div class="w-full flex justify-start mb-4">
                    <Button
                        @click="goHome"
                        variant="text"
                        rounded
                        class="p-2! px-3! flex items-center gap-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors text-sm font-bold"
                    >
                        <i-lucide-arrow-left class="w-4 h-4" />
                        Kembali
                    </Button>
                </div>

                <div class="text-center space-y-6 mb-10">
                    <div class="relative w-40 h-40 mx-auto">
                        <div
                            class="absolute inset-0 bg-emerald-100 rounded-full scale-90 animate-ping opacity-20"
                        ></div>
                        <img
                            :src="mascotImg"
                            class="w-full h-full object-contain relative z-10 drop-shadow-xl"
                        />
                    </div>

                    <div>
                        <div
                            class="text-[10px] font-bold text-emerald-600 tracking-widest uppercase mb-2 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 inline-block"
                        >
                            Versi 1.0.0
                        </div>
                        <h1
                            class="font-recoleta text-3xl font-bold text-zinc-800"
                        >
                            Petualangan<br /><span class="text-emerald-600"
                                >Pythagoras</span
                            >
                        </h1>
                        <p
                            class="text-slate-500 text-sm mt-2 max-w-[250px] mx-auto"
                        >
                            Media pembelajaran interaktif untuk siswa sekolah
                            dasar & menengah.
                        </p>
                    </div>
                </div>

                <div class="w-full space-y-4">
                    <div class="bg-white border border-zinc-200 rounded-lg p-5">
                        <div class="flex items-center gap-3 mb-3">
                            <div
                                class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600"
                            >
                                <i-lucide-target class="w-4 h-4" />
                            </div>
                            <h3
                                class="font-recoleta text-lg font-bold text-zinc-800"
                            >
                                Tujuan
                            </h3>
                        </div>
                        <p class="text-sm text-zinc-600 leading-relaxed">
                            Membantu siswa memahami konsep Teorema Pythagoras
                            secara visual dan intuitif melalui puzzle dan
                            simulasi interaktif.
                        </p>
                    </div>

                    <div class="bg-white border border-zinc-200 rounded-lg p-5">
                        <div class="flex items-center gap-3 mb-3">
                            <div
                                class="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600"
                            >
                                <i-lucide-code class="w-4 h-4" />
                            </div>
                            <h3
                                class="font-recoleta text-lg font-bold text-zinc-800"
                            >
                                Pengembang
                            </h3>
                        </div>
                        <p class="text-sm text-zinc-600 leading-relaxed">
                            Aplikasi ini dikembangkan menggunakan teknologi web
                            modern (Vue 3, TypeScript, Tailwind) untuk performa
                            maksimal.
                        </p>
                        <div
                            class="mt-4 pt-4 border-t border-zinc-100 flex justify-between items-center text-xs"
                        >
                            <span class="text-zinc-400"
                                >© 2024 Tim Pengembang</span
                            >
                            <a
                                href="#"
                                class="text-emerald-600 font-bold hover:underline"
                                >Hubungi Kami</a
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
