<script setup lang="ts">
import { useRouter } from "vue-router";
import mascot from "@/assets/image/mascot.png";

const router = useRouter();

const menu = [
    {
        route: "materi",
        label: "Materi",
        sub: "Konsep Dasar",
        icon: "book",
        theme: "bg-emerald-100 text-emerald-600",
        blob: "bg-emerald-500",
    },
    {
        route: "contoh-soal",
        label: "Contoh",
        sub: "Latihan Soal",
        icon: "pencil",
        theme: "bg-amber-100 text-amber-600",
        blob: "bg-amber-500",
    },
    {
        route: "kuis",
        label: "Kuis",
        sub: "Uji Pemahaman",
        icon: "trophy",
        theme: "bg-violet-100 text-violet-600",
        blob: "bg-violet-500",
    },
];
</script>

<template>
    <div
        class="fixed inset-0 bg-zinc-50 font-sans text-slate-900 flex justify-center overflow-hidden"
    >
        <div
            class="w-full max-w-md bg-[#FAFAFA] h-full overflow-y-auto overscroll-contain pb-safe relative flex flex-col"
        >
            <div class="p-8 pt-12 flex flex-col items-center text-center z-10">
                <div
                    class="relative w-40 h-40 mb-6 group"
                    v-motion
                    :initial="{ opacity: 0, scale: 0.5 }"
                    :enter="{
                        opacity: 1,
                        scale: 1,
                        transition: {
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                        },
                    }"
                >
                    <div
                        class="absolute inset-0 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"
                    />
                    <img
                        :src="mascot"
                        class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 animate-float"
                    />
                </div>

                <div
                    v-motion
                    :initial="{ opacity: 0, y: 20 }"
                    :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
                >
                    <h1
                        class="font-recoleta text-4xl font-bold text-slate-900 mb-2"
                    >
                        Petualangan<br /><span class="text-emerald-600"
                            >Pythagoras</span
                        >
                    </h1>
                    <p class="text-slate-500 max-w-[250px] leading-relaxed">
                        Jelajahi dunia matematika dengan cara yang seru!
                    </p>
                </div>
            </div>

            <div
                class="px-6 pb-10 w-full max-w-sm mx-auto grid grid-cols-2 gap-4"
            >
                <div
                    v-for="(item, i) in menu"
                    :key="item.route"
                    @click="router.push({ name: item.route })"
                    class="group relative bg-white p-5 rounded-3xl border border-zinc-100 hover:border-zinc-200 cursor-pointer overflow-hidden transition-colors"
                    :class="
                        i === 2
                            ? 'col-span-2 flex items-center justify-between px-8'
                            : 'aspect-square flex flex-col justify-between'
                    "
                    v-motion
                    :initial="{ opacity: 0, y: 50 }"
                    :enter="{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 300 + i * 100, type: 'spring' },
                    }"
                >
                    <div
                        class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2 transition-transform group-hover:scale-110 shrink-0"
                        :class="item.theme"
                    >
                        <i-lucide-book-open v-if="item.icon === 'book'" />
                        <i-lucide-edit-3 v-if="item.icon === 'pencil'" />
                        <i-lucide-trophy v-if="item.icon === 'trophy'" />
                    </div>

                    <div :class="{ 'text-right': i === 2 }">
                        <h3
                            class="font-recoleta text-xl font-bold text-slate-800"
                        >
                            {{ item.label }}
                        </h3>
                        <p
                            class="text-xs text-slate-400 font-medium tracking-wide"
                        >
                            {{ item.sub }}
                        </p>
                    </div>

                    <div
                        class="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-10 pointer-events-none"
                        :class="item.blob"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 20px);
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}
</style>
