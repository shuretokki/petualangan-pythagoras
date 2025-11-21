<script setup lang="ts">
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import PytaSpeech from "../components/PytaSpeech.vue";
import SectionIntro from "../components/SectionIntro.vue";

interface Step {
    label: string;
    formula: string;
}

interface Problem {
    title: string;
    story: string;
    question: string;
    labels: { a: string; b: string; c: string };
    steps: Step[];
    answer: string;
    icon?: string;
}

const router = useRouter();
const ui = reactive({ intro: true, idx: 0, step: -1 });

const problems: Problem[] = [
    {
        title: "Segitiga 1",
        story: "Sebuah segitiga siku-siku memiliki alas <strong>a = 8 cm</strong> dan tinggi <strong>b = 6 cm</strong>.",
        question: "Berapa panjang sisi miring <strong>(c)</strong>?",
        labels: { a: "8 cm", b: "6 cm", c: "?" },
        steps: [
            { label: "Rumus", formula: "a² + b² = c²" },
            { label: "Substitusi", formula: "8² + 6² = c²" },
            { label: "Kuadrat", formula: "64 + 36 = c²" },
            { label: "Jumlah", formula: "100 = c²" },
            { label: "Akar", formula: "c = √100" },
        ],
        answer: "10 cm",
    },
    {
        title: "Bantu Tuan Tupai",
        story: "Tuan Tupai ingin menyeberang sungai! Tinggi tebing <strong>4 m</strong> dan lebar sungai <strong>3 m</strong>.",
        question: "Berapa panjang papan kayu yang dibutuhkan?",
        labels: { a: "3 m", b: "4 m", c: "?" },
        steps: [
            { label: "Identifikasi", formula: "Tebing (a)=4, Sungai (b)=3" },
            { label: "Rumus", formula: "a² + b² = c²" },
            { label: "Substitusi", formula: "4² + 3² = c²" },
            { label: "Hitung", formula: "16 + 9 = 25" },
            { label: "Akar", formula: "c = √25 = 5 m" },
        ],
        answer: "5 meter",
        icon: "🐿️",
    },
    {
        title: "Perahu Menyeberang",
        story: "Sebuah perahu menyeberang sungai arus deras. Jarak lurus <strong>80 m</strong>, terseret arus sejauh <strong>60 m</strong>.",
        question: "Berapa jarak tempuh perahu sebenarnya?",
        labels: { a: "60 m", b: "80 m", c: "?" },
        steps: [
            { label: "Identifikasi", formula: "a=60, b=80" },
            { label: "Rumus", formula: "a² + b² = c²" },
            { label: "Substitusi", formula: "60² + 80² = c²" },
            { label: "Hitung", formula: "3600 + 6400 = 10.000" },
            { label: "Akar", formula: "c = √10.000 = 100 m" },
        ],
        answer: "100 meter",
        icon: "⛵",
    },
];

const curr = computed<Problem | undefined>(() => problems[ui.idx]);
const isDone = computed(
    () => curr.value && ui.step >= curr.value.steps.length - 1,
);

const next = () => {
    if (!curr.value) return;
    if (!isDone.value) {
        ui.step++;
    } else if (ui.idx < problems.length - 1) {
        ui.idx++;
        ui.step = -1;
    } else {
        router.push({ name: "kuis" });
    }
};

const back = () => {
    if (ui.step > -1) {
        ui.step--;
    } else if (ui.idx > 0) {
        ui.idx--;
        ui.step = (problems[ui.idx]?.steps.length ?? 0) - 1;
    } else {
        router.push({ name: "materi" });
    }
};
</script>

<template>
    <SectionIntro
        v-if="ui.intro"
        title="Latihan Soal"
        description="Mari kita lihat bagaimana rumus Pythagoras digunakan untuk menyelesaikan masalah sehari-hari!"
        buttonText="Mulai Latihan"
        variant="violet"
        @start="ui.intro = false"
    />

    <div
        v-else
        class="fixed inset-0 bg-zinc-50 font-sans text-slate-900 flex justify-center overflow-hidden"
    >
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div
                class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-violet-200/30 blur-3xl animate-pulse"
            />
            <div
                class="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-200/20 blur-3xl animate-pulse delay-1000"
            />
            <div
                class="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 blur-3xl animate-pulse delay-2000"
            />
        </div>

        <div
            class="w-full max-w-md h-full border border-zinc-200 flex flex-col relative bg-[#FDFBFF]"
        >
            <div class="flex-none z-20 w-full flex justify-start pt-8 px-6">
                <Button
                    @click="router.push({ name: 'home' })"
                    variant="text"
                    rounded
                    class="!p-2 !px-3 flex items-center gap-2 text-zinc-900! hover:text-violet-600 hover:bg-violet-50 transition-colors text-sm font-bold"
                >
                    <i-lucide-arrow-left class="w-6 h-6" /> Home
                </Button>
            </div>

            <div
                class="flex-1 overflow-y-auto overscroll-contain px-6 pb-24 no-scrollbar"
            >
                <div class="flex flex-col items-center pt-4">
                    <div
                        class="text-[10px] font-bold text-violet-600 tracking-widest uppercase mb-3"
                    >
                        Contoh Soal
                    </div>

                    <h1
                        class="font-recoleta text-3xl sm:text-4xl font-bold text-zinc-800 text-center mb-6 leading-tight"
                        v-motion
                        :initial="{ opacity: 0, y: -20 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 500 },
                        }"
                        :key="ui.idx"
                    >
                        {{ curr?.title }}
                    </h1>

                    <div
                        class="flex justify-center mb-6 w-full min-h-[104px] items-center"
                    >
                        <PytaSpeech
                            text="Ayo selesaikan soal ini! Perhatikan gambar dan langkah-langkahnya ya."
                            variant="violet"
                        />
                    </div>

                    <div
                        class="w-full bg-white border border-zinc-200 rounded-lg overflow-hidden mb-4"
                        v-motion
                        :initial="{ opacity: 0, y: 20 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 400 },
                        }"
                        :key="`card-${ui.idx}`"
                    >
                        <div
                            class="bg-slate-50/50 border-b border-slate-100 p-6 flex justify-center"
                        >
                            <div
                                class="relative w-48 h-40 flex items-center justify-center"
                            >
                                <svg
                                    viewBox="0 0 200 180"
                                    class="w-full h-full overflow-visible"
                                >
                                    <defs>
                                        <linearGradient
                                            id="vGrad"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="100%"
                                        >
                                            <stop
                                                offset="0%"
                                                style="
                                                    stop-color: #a78bfa;
                                                    stop-opacity: 0.1;
                                                "
                                            />
                                            <stop
                                                offset="100%"
                                                style="
                                                    stop-color: #8b5cf6;
                                                    stop-opacity: 0.05;
                                                "
                                            />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M40 20 L40 140 L180 140 Z"
                                        fill="url(#vGrad)"
                                        stroke="#8b5cf6"
                                        stroke-width="3"
                                        stroke-linejoin="round"
                                    />
                                    <path
                                        d="M40 120 L60 120 L60 140"
                                        fill="none"
                                        stroke="#8b5cf6"
                                        stroke-width="2"
                                    />

                                    <text
                                        v-if="curr?.icon && ui.idx === 1"
                                        x="30"
                                        y="15"
                                        font-size="24"
                                    >
                                        {{ curr.icon }}
                                    </text>
                                    <text
                                        v-if="curr?.icon && ui.idx === 2"
                                        x="170"
                                        y="145"
                                        font-size="24"
                                    >
                                        {{ curr.icon }}
                                    </text>

                                    <text
                                        x="25"
                                        y="80"
                                        class="font-bold fill-violet-700 text-sm font-sans"
                                        text-anchor="middle"
                                    >
                                        {{ curr?.labels.b }}
                                    </text>
                                    <text
                                        x="110"
                                        y="160"
                                        class="font-bold fill-violet-700 text-sm font-sans"
                                        text-anchor="middle"
                                    >
                                        {{ curr?.labels.a }}
                                    </text>
                                    <text
                                        x="125"
                                        y="65"
                                        class="font-bold fill-rose-500 text-sm font-sans"
                                        text-anchor="middle"
                                    >
                                        {{ curr?.labels.c }}
                                    </text>
                                </svg>
                            </div>
                        </div>

                        <div class="p-6 pb-2">
                            <p
                                class="text-slate-600 text-base leading-relaxed"
                                v-html="curr?.story"
                            ></p>
                            <p
                                class="text-slate-900 font-bold mt-3 text-base border-t border-slate-100 pt-3"
                                v-html="curr?.question"
                            ></p>
                        </div>

                        <div class="p-6 pt-2 space-y-3">
                            <div
                                v-for="(step, index) in curr?.steps"
                                :key="index"
                                class="flex items-center gap-3 transition-all duration-300"
                                v-show="index <= ui.step"
                                :class="
                                    index === ui.step
                                        ? 'opacity-100'
                                        : 'opacity-60 grayscale'
                                "
                                v-motion
                                :initial="{ opacity: 0, x: -10 }"
                                :enter="{ opacity: 1, x: 0 }"
                            >
                                <div
                                    class="shrink-0 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border transition-colors duration-300"
                                    :class="
                                        index === ui.step
                                            ? 'bg-violet-500 text-white border-violet-500'
                                            : 'bg-slate-100 text-slate-400 border-slate-200'
                                    "
                                >
                                    {{ index + 1 }}
                                </div>

                                <div
                                    class="flex-1 px-3 py-2 rounded border transition-all duration-300 flex justify-between items-center"
                                    :class="
                                        index === ui.step
                                            ? 'bg-violet-50 border-violet-200'
                                            : 'bg-white border-transparent'
                                    "
                                >
                                    <span
                                        class="text-[9px] font-bold tracking-wider uppercase text-slate-400"
                                        >{{ step.label }}</span
                                    >
                                    <span
                                        class="font-serif italic text-base text-slate-800"
                                        >{{ step.formula }}</span
                                    >
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="isDone"
                            class="bg-violet-600 text-white p-6 text-center"
                            v-motion
                            :initial="{ height: 0, opacity: 0 }"
                            :enter="{
                                height: 'auto',
                                opacity: 1,
                                transition: { duration: 300 },
                            }"
                        >
                            <span
                                class="text-violet-200 text-[10px] font-bold uppercase tracking-widest block mb-1"
                                >Jawaban Akhir</span
                            >
                            <div
                                class="font-recoleta text-3xl font-bold tracking-wide"
                            >
                                {{ curr?.answer }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-white/90 backdrop-blur-xl border border-violet-200/60 rounded-full z-50"
            >
                <div
                    class="relative flex items-center justify-between px-2 h-16"
                >
                    <Button
                        @click="back"
                        variant="text"
                        rounded
                        class="!p-0 w-12 h-12 flex items-center justify-center text-zinc-900! hover:bg-violet-50 hover:text-violet-600 transition-colors z-10"
                    >
                        <i-lucide-arrow-left class="w-6 h-6" />
                    </Button>

                    <div
                        class="absolute left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none"
                    >
                        <div
                            v-for="(_, i) in problems"
                            :key="i"
                            class="rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                            :class="
                                ui.idx === i
                                    ? 'w-8 h-2 bg-violet-500'
                                    : 'w-2 h-2 bg-violet-200'
                            "
                        />
                    </div>

                    <Button
                        @click="next"
                        variant="text"
                        rounded
                        class="flex items-center gap-2 text-zinc-900! font-bold hover:bg-zinc-50 px-4 py-2 transition-colors z-10"
                    >
                        <span v-if="!isDone">Lanjut</span>
                        <span v-else-if="ui.idx < problems.length - 1"
                            >Soal {{ ui.idx + 2 }}</span
                        >
                        <span v-else>Kuis</span>
                        <i-lucide-arrow-right class="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 20px);
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
