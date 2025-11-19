<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";

const router = useRouter();
const currentPage = ref(0);

const pages = [
    {
        title: "Selamat Datang!",
        subtitle: "Petualangan Matematika Dimulai",
        description:
            "Halo! Namaku Pyta. Aku akan menemanimu menjelajahi keajaiban di balik Teorema Pythagoras.",
        highlight: "Mari kita berpetualang bersama!",
    },
    {
        title: "Segitiga Siku-Siku",
        subtitle: "Tiga Sisi yang Istimewa",
        description:
            "Sebuah segitiga siku-siku memiliki tiga komponen penting yang saling terkait:",
        components: [
            {
                label: "Sisi Miring (c)",
                desc: "Sisi terpanjang, berhadapan dengan sudut siku-siku",
            },
            { label: "Tinggi (b)", desc: "Sisi vertikal yang tegak lurus" },
            { label: "Alas (a)", desc: "Sisi horizontal sebagai dasar" },
        ],
    },
    {
        title: "Mari Mulai!",
        subtitle: "Waktunya Menjelajah",
        description:
            "Kamu sudah siap untuk memahami rahasia matematika yang telah menakjubkan dunia selama ribuan tahun.",
        highlight: "Mari temukan keajaiban Teorema Pythagoras!",
    },
];

const currentPageData = computed(() => pages[currentPage.value]);
const nextPage = () => {
    currentPage.value < pages.length - 1
        ? currentPage.value++
        : router.push({ name: "materi" });
};
const previousPage = () => {
    if (currentPage.value > 0) currentPage.value--;
};
</script>

<template>
    <div
        class="flex flex-col items-center justify-center w-full bg-[#FAFAFA] overflow-hidden"
    >
        <div class="fixed inset-0 overflow-hidden pointer-events-none">
            <div
                class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-200/20 blur-3xl animate-pulse"
            ></div>
            <div
                class="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-3xl animate-pulse"
                style="animation-delay: 1s"
            ></div>
        </div>

        <div class="min-h-[100dvh] w-full max-w-sm flex flex-col relative z-10">
            <div
                class="flex-1 flex flex-col justify-center items-center mb-28 mt-4 px-6"
            >
                <div
                    v-if="currentPage === 0"
                    class="text-center space-y-6 w-full"
                >
                    <div
                        class="inline-block mb-6 relative"
                        v-motion
                        :initial="{ opacity: 0, scale: 0.8 }"
                        :enter="{
                            opacity: 1,
                            scale: 1,
                            transition: { duration: 400, type: 'spring' },
                        }"
                    >
                        <div
                            class="absolute inset-0 bg-emerald-100 rounded-full scale-90 animate-ping opacity-20"
                        ></div>
                        <div
                            class="text-9xl filter drop-shadow-md relative z-10"
                        >
                            🐍
                        </div>
                    </div>
                    <div
                        v-motion
                        :initial="{ opacity: 0, y: 20 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 500, delay: 200 },
                        }"
                    >
                        <h1
                            class="font-recoleta text-5xl font-bold text-zinc-800 mb-3 leading-tight tracking-tight"
                        >
                            {{ currentPageData?.title }}
                        </h1>
                        <p class="text-lg text-zinc-500 font-medium">
                            {{ currentPageData?.subtitle }}
                        </p>
                    </div>
                    <div
                        class="p-2"
                        v-motion
                        :initial="{ opacity: 0, y: 20 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 500, delay: 400 },
                        }"
                    >
                        <p class="text-zinc-600 leading-relaxed mb-4 text-lg">
                            {{ currentPageData?.description }}
                        </p>
                        <p class="text-lg font-bold text-emerald-600">
                            {{ currentPageData?.highlight }}
                        </p>
                    </div>
                </div>

                <div v-if="currentPage === 1" class="w-full">
                    <div class="text-center space-y-2 mb-8">
                        <h1
                            class="font-recoleta text-4xl font-bold text-zinc-800"
                        >
                            {{ currentPageData?.title }}
                        </h1>
                        <p class="text-zinc-500 font-light">
                            {{ currentPageData?.subtitle }}
                        </p>
                    </div>
                    <div class="flex flex-col gap-6 items-center mb-6">
                        <div
                            class="w-full flex justify-center"
                            v-motion
                            :initial="{ opacity: 0, scale: 0.9 }"
                            :enter="{
                                opacity: 1,
                                scale: 1,
                                transition: { duration: 600, delay: 200 },
                            }"
                        >
                            <div class="px-4 w-full max-w-[280px] p-2">
                                <svg
                                    viewBox="0 0 300 250"
                                    class="w-full h-auto drop-shadow-xl"
                                >
                                    <defs>
                                        <linearGradient
                                            id="triangleGradient"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="100%"
                                        >
                                            <stop
                                                offset="0%"
                                                style="
                                                    stop-color: #50c878;
                                                    stop-opacity: 0.3;
                                                "
                                            />
                                            <stop
                                                offset="100%"
                                                style="
                                                    stop-color: #34d399;
                                                    stop-opacity: 0.1;
                                                "
                                            />
                                        </linearGradient>
                                    </defs>
                                    <polygon
                                        points="50,200 50,50 250,200"
                                        fill="url(#triangleGradient)"
                                        stroke="#10b981"
                                        stroke-width="3"
                                        stroke-linejoin="round"
                                    />
                                    <text
                                        x="150"
                                        y="225"
                                        text-anchor="middle"
                                        class="fill-zinc-700 font-bold text-sm font-sans"
                                    >
                                        a (alas)
                                    </text>
                                    <text
                                        x="25"
                                        y="130"
                                        text-anchor="middle"
                                        class="fill-zinc-700 font-bold text-sm font-sans"
                                        transform="rotate(-90 25 130)"
                                    >
                                        b (tinggi)
                                    </text>
                                    <text
                                        x="160"
                                        y="110"
                                        text-anchor="middle"
                                        class="fill-emerald-600 font-bold text-sm font-sans"
                                        transform="rotate(40 160 110)"
                                    >
                                        c (miring)
                                    </text>
                                    <rect
                                        x="50"
                                        y="180"
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="#10b981"
                                        stroke-width="2"
                                        rx="4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div
                            class="flex flex-col gap-4 w-full px-2"
                            v-motion
                            :initial="{ opacity: 0, y: 30 }"
                            :enter="{
                                opacity: 1,
                                y: 0,
                                transition: { duration: 600, delay: 400 },
                            }"
                        >
                            <div
                                v-for="(
                                    component, index
                                ) in currentPageData?.components"
                                :key="index"
                                class="space-y-1"
                            >
                                <h3
                                    class="font-recoleta text-xl font-semibold text-zinc-800"
                                >
                                    {{ component.label }}
                                </h3>
                                <p class="text-base text-zinc-600 leading-snug">
                                    {{ component.desc }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="currentPage === 2"
                    class="text-center space-y-8 w-full"
                >
                    <div
                        v-motion
                        :initial="{ scale: 0, rotate: 45 }"
                        :enter="{
                            scale: 1,
                            rotate: 0,
                            transition: {
                                duration: 800,
                                delay: 200,
                                type: 'spring',
                            },
                        }"
                        class="inline-block mt-10"
                    >
                        <div
                            class="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-[2.5rem] flex items-center justify-center text-6xl shadow-lg shadow-emerald-300/50 transform -rotate-3"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
                                />
                                <path
                                    d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
                                />
                                <path
                                    d="M9 12H4s.55-3.03 2-4c1.62-1.1 2.75-.58 3 0"
                                />
                                <path
                                    d="M12 15v5s3.03-.55 4-2c1.1-1.62.58-2.75 0-3"
                                />
                            </svg>
                        </div>
                    </div>
                    <div
                        v-motion
                        :initial="{ opacity: 0, y: 30 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 600, delay: 400 },
                        }"
                    >
                        <h1
                            class="font-recoleta text-5xl font-bold text-zinc-800 mb-4"
                        >
                            {{ currentPageData?.title }}
                        </h1>
                        <div class="inline-block px-6 py-2">
                            <p class="text-xl font-medium text-zinc-600">
                                {{ currentPageData?.subtitle }}
                            </p>
                        </div>
                    </div>
                    <div
                        v-motion
                        :initial="{ opacity: 0, y: 20 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 600, delay: 600 },
                        }"
                        class="flex flex-col max-w-2xl mx-auto"
                    >
                        <p
                            class="text-zinc-600 leading-relaxed mb-6 px-4 text-lg"
                        >
                            {{ currentPageData?.description }}
                        </p>
                    </div>
                </div>
            </div>

            <div
                class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-white/90 backdrop-blur-xl border border-zinc-200/60 rounded-full z-50"
            >
                <div
                    class="relative flex items-center justify-between px-2 h-16"
                >
                    <Button
                        v-if="currentPage > 0"
                        @click="previousPage"
                        variant="text"
                        class="!p-0 w-12 h-12 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all z-10"
                    >
                        <svg
                            class="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 19l-7-7 7-7"
                            ></path>
                        </svg>
                    </Button>
                    <div v-else class="w-12"></div>
                    <div
                        class="absolute left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none"
                    >
                        <div
                            v-for="(_page, index) in pages"
                            :key="index"
                            class="rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                            :class="
                                currentPage === index
                                    ? 'w-8 h-2 bg-emerald-500'
                                    : 'w-2 h-2 bg-emerald-200'
                            "
                        ></div>
                    </div>
                    <Button
                        @click="nextPage"
                        variant="text"
                        class="flex items-center gap-2 text-emerald-600 font-bold hover:bg-emerald-50 hover:text-emerald-700 px-4 py-2 rounded-full transition-all z-10"
                    >
                        {{
                            currentPage === pages.length - 1
                                ? "Mulai"
                                : "Lanjut"
                        }}
                        <svg
                            v-if="currentPage !== pages.length - 1"
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                            ></path>
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
