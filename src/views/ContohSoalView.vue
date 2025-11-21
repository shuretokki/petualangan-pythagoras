<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import PytaSpeech from "../components/PytaSpeech.vue";

const router = useRouter();
const showIntro = ref(true);
const currentExample = ref(0);
const currentStepIndex = ref(-1);

const examples = [
    {
        title: "Kasus Segitiga",
        problem:
            "Ada segitiga siku-siku dengan alas <strong>8 cm</strong> dan tinggi <strong>6 cm</strong>.",
        question: "Berapa panjang sisi miring <strong>(m)</strong>?",
        labels: { a: "8 cm", b: "6 cm", c: "?" },
        steps: [
            { label: "Identifikasi", formula: "Alas (a)=8, Tinggi (b)=6" },
            { label: "Rumus", formula: "a² + b² = m²" },
            { label: "Substitusi", formula: "8² + 6² = m²" },
            { label: "Hitung", formula: "64 + 36 = 100" },
            { label: "Akar", formula: "m = √100 = 10 cm" },
        ],
        answer: "10 cm",
    },
    {
        title: "Bantu Tuan Tupai",
        problem:
            "Tuan Tupai ingin menyeberang sungai! Tinggi tebing <strong>4 m</strong> dan lebar sungai <strong>3 m</strong>.",
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
    },
    {
        title: "Perahu Menyeberang",
        problem:
            "Sebuah perahu menyeberang sungai arus deras. Jarak lurus <strong>80 m</strong>, terseret arus sejauh <strong>60 m</strong>.",
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
    },
];

const currentExampleData = computed(() => examples[currentExample.value]);
const isExampleFinished = computed(
    () =>
        currentExampleData.value &&
        currentStepIndex.value >= currentExampleData.value.steps.length - 1,
);

const handleNext = () => {
    if (!isExampleFinished.value) {
        currentStepIndex.value++;
        return;
    }
    currentExample.value < examples.length - 1
        ? (currentExample.value++, (currentStepIndex.value = -1))
        : router.push({ name: "kuis" });
};

const handleBack = () => {
    if (currentStepIndex.value > -1) currentStepIndex.value--;
    else if (currentExample.value > 0) {
        currentExample.value--;
        const ex = examples[currentExample.value];
        if (ex) currentStepIndex.value = ex.steps.length - 1;
    } else router.push({ name: "materi" });
};
</script>

<template>
    <SectionIntro
        v-if="showIntro"
        title="Latihan Soal"
        description="Mari kita lihat bagaimana rumus Pythagoras digunakan untuk menyelesaikan masalah sehari-hari!"
        buttonText="Mulai Latihan"
        variant="violet"
        @start="showIntro = false"
    />
    <div
        class="min-h-screen flex flex-col items-center justify-center w-full bg-[#FDFBFF] overflow-hidden relative font-sans text-slate-900"
    >
        <div class="fixed inset-0 pointer-events-none">
            <div
                class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-violet-200/30 blur-3xl animate-pulse"
            ></div>
            <div
                class="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-200/20 blur-3xl animate-pulse"
                style="animation-delay: 1s"
            ></div>
            <div
                class="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 blur-3xl animate-pulse"
                style="animation-delay: 2s"
            ></div>
        </div>

        <div
            v-if="showIntro"
            class="relative z-20 w-full max-w-sm flex flex-col min-h-screen items-center justify-center p-6"
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :enter="{ opacity: 1, scale: 1 }"
        >
            <div
                class="w-20 h-20 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mb-6 animate-bounce"
            >
                <i-lucide-lightbulb class="w-10 h-10" />
            </div>
            <h1
                class="font-recoleta text-4xl font-bold text-zinc-800 mb-3 text-center"
            >
                Contoh Soal
            </h1>
            <p class="text-zinc-500 text-center mb-8 leading-relaxed">
                Mari kita lihat bagaimana rumus Pythagoras digunakan dalam
                masalah sehari-hari.
            </p>
            <PytaSpeech
                text="Jangan khawatir, aku akan membantumu di setiap langkah!"
                variant="violet"
                class="mb-8"
            />
            <Button
                @click="showIntro = false"
                label="Mulai Latihan"
                rounded
                class="!bg-violet-600 !border-violet-600 hover:!bg-violet-700 font-bold px-8 py-3 w-full sm:w-auto transition-all hover:scale-105"
            />
        </div>

        <div
            v-else
            class="relative z-10 w-full max-w-sm flex flex-col min-h-screen"
        >
            <div class="flex-1 flex flex-col items-center pb-32 pt-8 px-6">
                <div
                    class="text-[10px] font-bold text-violet-600 tracking-widest uppercase mb-3"
                    v-motion
                    :initial="{ opacity: 0, y: -10 }"
                    :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
                >
                    Contoh Soal
                </div>

                <h1
                    class="font-recoleta text-3xl sm:text-4xl font-bold text-zinc-800 text-center mb-6 leading-tight"
                    v-motion
                    :initial="{ opacity: 0, y: -20 }"
                    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
                    :key="currentExample"
                >
                    {{ currentExampleData?.title }}
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
                    class="w-full bg-white border border-zinc-200 rounded-lg overflow-hidden"
                    v-motion
                    :initial="{ opacity: 0, y: 20 }"
                    :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
                    :key="'card-' + currentExample"
                >
                    <div
                        class="bg-slate-50/50 border-b border-slate-100 p-6 flex justify-center relative overflow-hidden"
                    >
                        <div
                            class="relative w-48 h-40 flex items-center justify-center z-10"
                        >
                            <svg
                                viewBox="0 0 200 180"
                                class="w-full h-full overflow-visible drop-shadow-sm"
                            >
                                <defs>
                                    <linearGradient
                                        id="violetGradient"
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
                                    v-if="currentExample > 0"
                                    d="M-20 140 Q 50 130 100 140 T 220 140"
                                    fill="none"
                                    stroke="#60a5fa"
                                    stroke-width="4"
                                    opacity="0.3"
                                />
                                <path
                                    v-if="currentExample > 0"
                                    d="M-20 150 Q 50 140 100 150 T 220 150"
                                    fill="none"
                                    stroke="#60a5fa"
                                    stroke-width="4"
                                    opacity="0.3"
                                />

                                <path
                                    d="M40 20 L40 140 L180 140 Z"
                                    fill="url(#violetGradient)"
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
                                    v-if="currentExample === 1"
                                    x="30"
                                    y="15"
                                    font-size="24"
                                >
                                    🐿️
                                </text>
                                <text
                                    v-if="currentExample === 2"
                                    x="170"
                                    y="145"
                                    font-size="24"
                                >
                                    ⛵
                                </text>

                                <text
                                    x="25"
                                    y="80"
                                    class="font-bold fill-violet-700 text-sm font-sans"
                                    text-anchor="middle"
                                >
                                    {{ currentExampleData?.labels.b }}
                                </text>
                                <text
                                    x="110"
                                    y="160"
                                    class="font-bold fill-violet-700 text-sm font-sans"
                                    text-anchor="middle"
                                >
                                    {{ currentExampleData?.labels.a }}
                                </text>
                                <text
                                    x="125"
                                    y="65"
                                    class="font-bold fill-rose-500 text-sm font-sans"
                                    text-anchor="middle"
                                >
                                    {{ currentExampleData?.labels.c }}
                                </text>
                            </svg>
                        </div>
                    </div>

                    <div class="p-6 pb-2">
                        <p
                            class="text-slate-600 text-base leading-relaxed"
                            v-html="currentExampleData?.problem"
                        ></p>
                        <p
                            class="text-slate-900 font-bold mt-3 text-base border-t border-slate-100 pt-3"
                            v-html="currentExampleData?.question"
                        ></p>
                    </div>

                    <div class="p-6 pt-2 space-y-3">
                        <div
                            v-for="(step, index) in currentExampleData?.steps"
                            :key="index"
                            class="flex items-center gap-3 transition-all duration-300"
                            v-show="index <= currentStepIndex"
                            :class="
                                index === currentStepIndex
                                    ? 'opacity-100'
                                    : 'opacity-60 grayscale'
                            "
                            v-motion
                            :initial="{ opacity: 0, x: -10 }"
                            :enter="{ opacity: 1, x: 0 }"
                        >
                            <div
                                class="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border transition-colors duration-300"
                                :class="
                                    index === currentStepIndex
                                        ? 'bg-violet-500 text-white border-violet-500'
                                        : 'bg-slate-100 text-slate-400 border-slate-200'
                                "
                            >
                                {{ index + 1 }}
                            </div>
                            <div
                                class="flex-1 px-3 py-2 rounded border transition-all duration-300 flex justify-between items-center"
                                :class="
                                    index === currentStepIndex
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
                        v-if="isExampleFinished"
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
                            {{ currentExampleData?.answer }}
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="!showIntro"
                class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-white/90 backdrop-blur-xl border border-violet-200/60 rounded-full z-50"
            >
                <div
                    class="relative flex items-center justify-between px-2 h-16"
                >
                    <Button
                        @click="handleBack"
                        variant="text"
                        rounded
                        class="!p-0 w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors z-10"
                    >
                        <i-lucide-arrow-left class="w-6 h-6" />
                    </Button>
                    <div
                        class="absolute left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none"
                    >
                        <div
                            v-for="(_ex, index) in examples"
                            :key="index"
                            class="rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                            :class="
                                currentExample === index
                                    ? 'w-8 h-2 bg-violet-500'
                                    : 'w-2 h-2 bg-violet-200'
                            "
                        ></div>
                    </div>
                    <Button
                        @click="handleNext"
                        variant="text"
                        rounded
                        class="flex items-center gap-2 text-zinc-900 font-bold hover:bg-zinc-50 px-4 py-2 transition-colors z-10"
                    >
                        <span v-if="!isExampleFinished">Lanjut</span>
                        <span v-else-if="currentExample < examples.length - 1"
                            >Soal 2</span
                        >
                        <span v-else>Kuis</span>
                        <i-lucide-arrow-right class="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
