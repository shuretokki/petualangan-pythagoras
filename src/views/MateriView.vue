<script setup lang="ts">
import { ref, computed, watch, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import { Drag, Drop } from "vue-easy-dnd";

const router = useRouter();
const currentStep = ref(0);

const steps = [
    {
        title: "Rahasia Pythagoras",
        content:
            "Mari kita buktikan teorema Pythagoras dengan cara yang menyenangkan! Kita akan menggunakan 4 segitiga siku-siku yang sama.",
    },
    {
        title: "Puzzle Pythagoras",
        content:
            "Cobalah susun keempat segitiga ini di dalam kotak besar! Kamu bisa menggeser-geser segitiga dengan mouse.",
    },
    {
        title: "Lihat Hasilnya!",
        content:
            "Hebat! Sekarang perhatikan: Ada dua kotak yang terbentuk di dalam. Kotak kecil punya luas <strong>c²</strong>, dan area segitiga total adalah <strong>4 × ½ab</strong>.",
    },
    {
        title: "Perhitungan Luas",
        content:
            'Luas kotak besar = <strong class="font-recoleta text-2xl">(a + b)²</strong><br>Luas kotak besar juga = luas 4 segitiga + luas kotak kecil<br>Maka: (a + b)² = 4(½ab) + c²',
    },
    {
        title: "Penyederhanaan",
        content:
            'Mari kita sederhanakan:<br> <strong class="font-recoleta">(a + b)² = 2ab + c²<br>a² + 2ab + b² = 2ab + c²<br>a² + b² = c²</strong>',
    },
    {
        title: "Teorema Pythagoras!",
        content:
            'Tadaaa! Kita telah membuktikan:<br><br><strong class="text-2xl font-recoleta">a² + b² = c²</strong><br><br>Ini adalah <strong>Teorema Pythagoras</strong>!',
    },
];

const currentStepData = computed(() => steps[currentStep.value]);

const nextStep = () => {
    if (currentStep.value < steps.length - 1) {
        currentStep.value++;
    } else {
        router.push({ name: "contoh-soal" });
    }
};

const previousStep = () => {
    if (currentStep.value > 0) {
        currentStep.value--;
    }
};

const onDrop = (event: any) => {
    console.log("Dropped:", event, event.index, event.data);
};

const onDragStart = (triangleIndex: number) => {
    console.log("Dragging:", triangleIndex);
};
</script>
<template>
    <div class="flex flex-col items-center justify-center">
        <div class="min-h-100dvh flex flex-col justify- max-w-sm">
            <div
                class="flex-1 flex flex-col justify-center items-center mb-16 mt-4"
            >
                <!-- Title -->
                <h1
                    class="font-recoleta text-4xl font-bold text-zinc-900 text-center mb-6"
                    v-motion
                    :initial="{ opacity: 0, y: -50 }"
                    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
                >
                    {{ currentStepData?.title }}
                </h1>

                <!-- Pyta Speech -->
                <div class="flex justify-center mb-6 sm:mb-8 px-4">
                    <PytaSpeech
                        :text="currentStepData?.content || ''"
                        v-motion
                        :initial="{ opacity: 0, scale: 0.8 }"
                        :enter="{
                            opacity: 1,
                            scale: 1,
                            transition: { duration: 400, delay: 200 },
                        }"
                    />
                </div>

                <!-- Interactive Puzzle (Step 1 & 2) -->
                <div
                    v-if="currentStep === 1 || currentStep === 2"
                    class="flex justify-center mb-6 sm:mb-8"
                >
                    <div class="p-4 sm:p-6 md:p-8 w-full max-w-lg">
                        <div class="relative w-full max-w-[400px] mx-auto">
                            <drop
                                @drop="onDrop"
                                mode="cut"
                                class="drop w-full h-full aspect-square bg-gray-200 flex items-center justify-center"
                            >
                                <div
                                    class="text-zinc-400 text-base px-4 text-center"
                                >
                                    Susun segitiga di sini
                                </div>
                            </drop>
                        </div>
                    </div>
                </div>

                <div
                    v-if="currentStep >= 3 && currentStep <= 5"
                    class="flex justify-center mb-0 px-4"
                >
                    <div
                        class="p-6 max-w-2xl w-full"
                        v-motion
                        :initial="{ opacity: 0, scale: 0.9 }"
                        :enter="{
                            opacity: 1,
                            scale: 1,
                            transition: { duration: 500 },
                        }"
                    >
                        <div
                            class="font-recoleta text-zinc-800 overflow-x-auto"
                        >
                            <div
                                v-if="currentStep >= 3"
                                v-motion
                                :initial="{ opacity: 0, x: -20 }"
                                :enter="{
                                    opacity: 1,
                                    x: 0,
                                    transition: { delay: 300 },
                                }"
                            >
                                (a + b)² = 4(½ab) + c²
                            </div>
                            <div
                                v-if="currentStep >= 4"
                                v-motion
                                :initial="{ opacity: 0, x: -20 }"
                                :enter="{
                                    opacity: 1,
                                    x: 0,
                                    transition: { delay: 500 },
                                }"
                            >
                                a² + 2ab + b² = 2ab + c²
                            </div>
                            <div
                                v-if="currentStep >= 5"
                                class="text-lg font-bold text-emerald-600"
                            >
                                a² + b² = c²
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation -->
                <div
                    class="fixed bg-gray-50 bottom-0 left-0 overflow-hidden max-w-sm h-16 inset-x-0 mx-auto z-50 flex items-center justify-between"
                >
                    <Button
                        v-if="currentStep > 0"
                        @click="previousStep"
                        variant="text"
                        class="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-zinc-200 text-zinc-700 font-medium transition-all duration-300"
                    >
                        <svg
                            class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
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
                        Kembali
                    </Button>
                    <div v-else></div>

                    <div class="flex gap-2">
                        <div
                            v-for="(_step, index) in steps"
                            :key="index"
                            class="w-3 h-3 rounded-full transition-all duration-200"
                            :class="
                                currentStep === index
                                    ? 'bg-white w-8'
                                    : 'bg-white/50'
                            "
                        ></div>
                    </div>

                    <Button
                        @click="nextStep"
                        class="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-zinc-200 text-zinc-700 font-medium transition-all duration-300"
                        variant="text"
                    >
                        {{
                            currentStep === steps.length - 1
                                ? "Contoh"
                                : "Lanjut"
                        }}
                        <svg
                            class="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
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
