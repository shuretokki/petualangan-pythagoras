<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import PytaSpeech from "../components/PytaSpeech.vue";

const router = useRouter();
const currentExample = ref(0);
const currentStepIndex = ref(-1);

// Enhanced Data Structure with visualization props
const examples = [
    {
        title: "Segitiga 1",
        // We store raw numbers for the visualizer
        values: { a: 8, b: 6, c: 10 },
        problem:
            "Sebuah segitiga siku-siku memiliki alas <strong>a = 8 cm</strong> dan tinggi <strong>b = 6 cm</strong>. Berapa panjang sisi miringnya <strong>(c)</strong>?",
        steps: [
            { label: "Rumus", formula: "a² + b² = c²" },
            { label: "Substitusi", formula: "8² + 6² = c²" },
            { label: "Kuadrat", formula: "64 + 36 = c²" },
            { label: "Jumlah", formula: "100 = c²" },
            { label: "Akar", formula: "c = √100 = 10" },
        ],
        answer: "10 cm",
    },
    {
        title: "Segitiga 2",
        values: { a: 15, b: 8, c: 17 },
        problem:
            "Sebuah segitiga siku-siku memiliki alas <strong>a = 15 cm</strong> dan tinggi <strong>b = 8 cm</strong>. Berapa panjang sisi miringnya <strong>(c)</strong>?",
        steps: [
            { label: "Rumus", formula: "a² + b² = c²" },
            { label: "Substitusi", formula: "15² + 8² = c²" },
            { label: "Kuadrat", formula: "225 + 64 = c²" },
            { label: "Jumlah", formula: "289 = c²" },
            { label: "Akar", formula: "c = √289 = 17" },
        ],
        answer: "17 cm",
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

    if (currentExample.value < examples.length - 1) {
        currentExample.value++;
        currentStepIndex.value = -1;
    } else {
        router.push({ name: "kuis" });
    }
};

const handleBack = () => {
    if (currentStepIndex.value > -1) {
        currentStepIndex.value--;
    } else if (currentExample.value > 0) {
        currentExample.value--;
        const ex = examples[currentExample.value];
        if (ex) currentStepIndex.value = ex.steps.length - 1;
    } else {
        router.push({ name: "materi" });
    }
};
</script>

<template>
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

        <div class="relative z-10 w-full max-w-sm flex flex-col min-h-screen">
            <div class="flex-1 flex flex-col items-center pb-32 pt-8 px-6">
                <div class="text-center mb-6">
                    <h1
                        class="font-recoleta text-3xl sm:text-4xl font-bold text-slate-800 leading-tight"
                        v-motion
                        :initial="{ opacity: 0, y: -20 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 500 },
                        }"
                        :key="currentExample"
                    >
                        Contoh Soal {{ currentExample + 1 }}
                    </h1>
                </div>

                <div
                    class="flex justify-center mb-8 w-full min-h-[104px] items-center"
                >
                    <PytaSpeech
                        text="Mari kita selesaikan soal ini bersama-sama! Tekan <strong>Lanjut</strong> untuk melihat langkahnya."
                        variant="violet"
                        v-motion
                        :initial="{ opacity: 0, scale: 0.9 }"
                        :enter="{
                            opacity: 1,
                            scale: 1,
                            transition: { duration: 300 },
                        }"
                    />
                </div>

                <div
                    class="w-full flex justify-center mb-8"
                    v-motion
                    :initial="{ opacity: 0, scale: 0.8 }"
                    :enter="{
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 500 },
                    }"
                    :key="'vis-' + currentExample"
                >
                    <div
                        class="relative w-64 h-48 bg-white/60 backdrop-blur-sm border border-white rounded-3xl shadow-sm flex items-center justify-center"
                    >
                        <svg
                            width="200"
                            height="150"
                            viewBox="0 0 200 150"
                            class="overflow-visible"
                        >
                            <path
                                d="M40 120 L160 120 L40 30 Z"
                                fill="none"
                                stroke="#8b5cf6"
                                stroke-width="3"
                                stroke-linejoin="round"
                                class="drop-shadow-md"
                            />
                            <path
                                d="M40 105 L55 105 L55 120"
                                fill="none"
                                stroke="#8b5cf6"
                                stroke-width="2"
                            />

                            <text
                                x="25"
                                y="75"
                                class="font-bold text-sm fill-slate-500"
                                text-anchor="end"
                            >
                                {{ currentExampleData?.values.b }} cm
                            </text>
                            <text
                                x="100"
                                y="140"
                                class="font-bold text-sm fill-slate-500"
                                text-anchor="middle"
                            >
                                {{ currentExampleData?.values.a }} cm
                            </text>
                            <text
                                x="110"
                                y="65"
                                class="font-bold text-sm transition-all duration-500"
                                text-anchor="start"
                                :class="
                                    isExampleFinished
                                        ? 'fill-violet-600 text-lg'
                                        : 'fill-slate-400'
                                "
                            >
                                {{
                                    isExampleFinished
                                        ? currentExampleData?.values.c + " cm"
                                        : "c = ?"
                                }}
                            </text>
                        </svg>
                    </div>
                </div>

                <div
                    class="w-full mb-6 bg-white/60 border-l-4 border-violet-400 pl-4 py-3 rounded-r-xl backdrop-blur-sm shadow-sm"
                    v-motion
                    :initial="{ opacity: 0, x: -20 }"
                    :enter="{ opacity: 1, x: 0, transition: { duration: 400 } }"
                    :key="'problem-' + currentExample"
                >
                    <div
                        class="text-base text-slate-700 leading-relaxed"
                        v-html="currentExampleData?.problem"
                    ></div>
                </div>

                <div class="w-full space-y-3">
                    <div
                        v-for="(step, index) in currentExampleData?.steps"
                        :key="index"
                        class="flex items-center gap-3"
                        v-show="index <= currentStepIndex"
                        v-motion
                        :initial="{ opacity: 0, x: -10, height: 0 }"
                        :enter="{
                            opacity: 1,
                            x: 0,
                            height: 'auto',
                            transition: { duration: 300 },
                        }"
                    >
                        <div
                            class="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-bold border border-violet-200 shadow-sm"
                        >
                            {{ index + 1 }}
                        </div>

                        <div
                            class="flex-1 bg-white border border-violet-100 rounded-xl px-4 py-3 flex justify-between items-center shadow-sm"
                        >
                            <span
                                class="text-[10px] text-slate-400 font-bold tracking-wider uppercase"
                                >{{ step.label }}</span
                            >
                            <span
                                class="font-recoleta text-lg text-slate-800 tracking-wide"
                                >{{ step.formula }}</span
                            >
                        </div>
                    </div>

                    <div
                        v-if="isExampleFinished"
                        class="mt-8 w-full text-center"
                        v-motion
                        :initial="{ opacity: 0, scale: 0.9 }"
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
                            class="inline-block px-8 py-4 bg-violet-600 text-white rounded-2xl shadow-lg shadow-violet-200 hover:scale-105 transition-transform"
                        >
                            <span
                                class="text-violet-200 text-[10px] font-bold uppercase tracking-widest mb-1 block"
                                >Jawaban Akhir</span
                            >
                            <div
                                class="font-recoleta text-3xl font-bold tracking-wide"
                            >
                                c = {{ currentExampleData?.answer }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-white/90 backdrop-blur-xl border border-violet-200/60 rounded-full z-50 shadow-lg shadow-violet-100/50"
            >
                <div
                    class="relative flex items-center justify-between px-2 h-16"
                >
                    <Button
                        @click="handleBack"
                        variant="text"
                        class="!p-0 w-12 h-12 flex items-center justify-center rounded-full text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors z-10"
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
                        class="flex items-center gap-2 text-zinc-900 font-bold hover:bg-zinc-50 px-4 py-2 rounded-full transition-colors z-10"
                    >
                        <span v-if="!isExampleFinished">Lanjut</span>
                        <span v-else-if="currentExample < examples.length - 1"
                            >Soal 2</span
                        >
                        <span v-else>Kuis</span>

                        <svg
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
