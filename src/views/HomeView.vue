<script setup lang="ts">
import mascotImg from "@/assets/image/mascot.png";

const router = useRouter();
const currentPage = ref(0);

const pages = [
    {
        title: "Halo Teman-teman!",
        subtitle: "Kenalan yuk sama Pyta!",
        description:
            "Hai! Aku <strong>Pyta</strong>, teman belajarmu hari ini! Aku bakal nemenin kamu menjelajahi rahasia di balik segitiga siku-siku. Siap? Yuk kita mulai!",
        highlight: "Petualangan dimulai!",
        type: "intro",
    },
    {
        title: "Tujuan Belajar",
        subtitle: "Apa target kita hari ini?",
        description: "Ada 3 hal seru yang akan kita capai:",
        objectives: [
            "Menemukan Teorema Pythagoras lewat puzzle.",
            "Menggunakan rumus untuk menghitung jarak/sisi yang hilang.",
            "Menguji pemahaman lewat Kuis interaktif.",
        ],
        highlight: "Semangat belajar!",
        type: "objectives",
    },
    {
        title: "Segitiga Siku-Siku",
        subtitle: "Kenali bagian-bagiannya",
        description:
            "Jika kamu melihat sudut siku-siku pada segitiga, ada 2 bagian penting:",
        components: [
            {
                label: "1. Hipotenusa",
                desc: "Sisi yang <strong>berhadapan langsung</strong> dengan sudut siku-siku. Ini sisi terpanjang!",
            },
            {
                label: "2. Sisi Lainnya",
                desc: "Dua sisi yang saling <strong>tegak lurus</strong>. Bisa kamu sebut alas dan tinggi.",
            },
        ],
        highlight: "Ingat posisinya ya!",
        type: "components",
    },
    {
        title: "Mari Mulai!",
        subtitle: "Waktunya Menjelajah",
        description:
            "Ternyata ketiga sisi ini punya <strong>hubungan rahasia</strong> lho! Penasaran?",
        highlight: "Ayo buka rahasianya di Materi!",
        type: "cta",
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
        class="min-h-screen flex flex-col items-center justify-center w-full bg-[#FAFAFA] overflow-x-hidden relative font-sans text-slate-900"
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
            <div
                class="flex-1 flex flex-col justify-center items-center pb-32 pt-8 px-6"
            >
                <div
                    v-if="currentPageData!.type === 'intro'"
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
                        <img
                            :src="mascotImg"
                            alt="Pyta Mascot"
                            class="w-48 h-auto relative z-10 hover:scale-105 transition-transform duration-300"
                        />
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
                            class="font-recoleta text-4xl font-bold text-zinc-800 mb-3 leading-tight tracking-tight"
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
                        <p
                            class="text-zinc-600 leading-relaxed mb-4 text-lg"
                            v-html="currentPageData?.description"
                        ></p>
                    </div>
                </div>

                <div
                    v-if="currentPageData!.type === 'objectives'"
                    class="w-full"
                >
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
                    <div
                        class="space-y-4"
                        v-motion
                        :initial="{ opacity: 0, x: 20 }"
                        :enter="{
                            opacity: 1,
                            x: 0,
                            transition: { duration: 500 },
                        }"
                    >
                        <div
                            v-for="(obj, i) in currentPageData!.objectives"
                            :key="i"
                            class="bg-white border border-emerald-100 rounded-lg p-4 flex gap-4 items-start"
                        >
                            <div
                                class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm flex-shrink-0"
                            >
                                {{ i + 1 }}
                            </div>
                            <p class="text-zinc-600 text-sm leading-relaxed">
                                {{ obj }}
                            </p>
                        </div>
                    </div>
                    <div class="mt-8 text-center">
                        <p
                            class="text-lg font-bold text-emerald-600 bg-emerald-50 inline-block px-4 py-2 rounded-lg"
                        >
                            {{ currentPageData?.highlight }}
                        </p>
                    </div>
                </div>

                <div
                    v-if="currentPageData!.type === 'components'"
                    class="w-full"
                >
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
                                    class="w-full h-auto"
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
                                        class="fill-zinc-500 font-bold text-xs font-sans"
                                    >
                                        Sisi Lain (Alas)
                                    </text>
                                    <text
                                        x="35"
                                        y="130"
                                        text-anchor="middle"
                                        class="fill-zinc-500 font-bold text-xs font-sans"
                                        transform="rotate(-90 35 130)"
                                    >
                                        Sisi Lain (Tinggi)
                                    </text>
                                    <text
                                        x="170"
                                        y="110"
                                        text-anchor="middle"
                                        class="fill-emerald-600 font-bold text-sm font-sans"
                                        transform="rotate(40 170 110)"
                                    >
                                        HIPOTENUSA
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
                                    class="font-recoleta text-lg font-semibold text-zinc-800"
                                >
                                    {{ component.label }}
                                </h3>
                                <p
                                    class="text-sm text-zinc-600 leading-snug"
                                    v-html="component.desc"
                                ></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="currentPageData!.type === 'cta'"
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
                            class="w-32 h-32 mx-auto bg-linear-to-br from-emerald-400 to-teal-500 text-white rounded-4xl flex items-center justify-center text-6xl transform -rotate-3"
                        >
                            <i-lucide-rocket class="w-16 h-16" />
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
                            v-html="currentPageData?.description"
                        ></p>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="fixed bottom-6 left-0 right-0 mx-auto w-[90%] max-w-[350px] bg-white/90 backdrop-blur-xl border border-zinc-200/60 rounded-full z-50"
        >
            <div class="relative flex items-center justify-between px-2 h-16">
                <Button
                    v-if="currentPage > 0"
                    @click="previousPage"
                    variant="text"
                    rounded
                    class="!p-0 w-12 h-12 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors z-10"
                >
                    <i-lucide-arrow-left class="w-4 h-4" />
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
                    rounded
                    class="flex items-center gap-2 text-emerald-600 font-bold hover:bg-emerald-50 hover:text-emerald-700 px-4 py-2 transition-all z-10"
                >
                    {{ currentPage === pages.length - 1 ? "Mulai" : "Lanjut" }}
                    <i-lucide-arrow-right class="w-4 h-4" />
                </Button>
            </div>
        </div>
    </div>
</template>
