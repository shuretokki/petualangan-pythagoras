<script setup lang="ts">
import { ref, computed, reactive, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import PytaSpeech from "../components/PytaSpeech.vue";

const router = useRouter();
const currentStep = ref(0);

interface Triangle {
    id: number;
    fillColor: string;
    strokeColor: string;
    targetLeft: number;
    targetTop: number;
    rotation: number;
    initialLeft: number;
    initialTop: number;
    currentLeft: number;
    currentTop: number;
    isLocked: boolean;
    isDragging: boolean;
}

const triangles = reactive<Triangle[]>([
    {
        id: 1,
        fillColor: "#fb7185",
        strokeColor: "#e11d48",
        targetLeft: 75,
        targetTop: 30,
        rotation: 0,
        initialLeft: 25,
        initialTop: 240,
        currentLeft: 25,
        currentTop: 240,
        isLocked: false,
        isDragging: false,
    },
    {
        id: 2,
        fillColor: "#60a5fa",
        strokeColor: "#2563eb",
        targetLeft: 225,
        targetTop: 30,
        rotation: 90,
        initialLeft: 100,
        initialTop: 300,
        currentLeft: 100,
        currentTop: 300,
        isLocked: false,
        isDragging: false,
    },
    {
        id: 3,
        fillColor: "#34d399",
        strokeColor: "#059669",
        targetLeft: 225,
        targetTop: 180,
        rotation: 180,
        initialLeft: 275,
        initialTop: 290,
        currentLeft: 275,
        currentTop: 290,
        isLocked: false,
        isDragging: false,
    },
    {
        id: 4,
        fillColor: "#fbbf24",
        strokeColor: "#d97706",
        targetLeft: 75,
        targetTop: 180,
        rotation: 270,
        initialLeft: 200,
        initialTop: 400,
        currentLeft: 200,
        currentTop: 400,
        isLocked: false,
        isDragging: false,
    },
]);

let draggedItem: Triangle | null = null;
let startX = 0;
let startY = 0;
let startElemX = 0;
let startElemY = 0;

const isPuzzleComplete = computed(() => {
    return triangles.every((t) => t.isLocked);
});

const startDrag = (e: PointerEvent, item: Triangle) => {
    if (item.isLocked) return;
    e.preventDefault();
    draggedItem = item;
    item.isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startElemX = item.currentLeft;
    startElemY = item.currentTop;

    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", endDrag);
};

const onDrag = (e: PointerEvent) => {
    if (!draggedItem) return;
    e.preventDefault();
    draggedItem.currentLeft = startElemX + (e.clientX - startX);
    draggedItem.currentTop = startElemY + (e.clientY - startY);
};

const endDrag = () => {
    if (draggedItem) {
        checkSnap(draggedItem);
        draggedItem.isDragging = false;
    }
    draggedItem = null;
    window.removeEventListener("pointermove", onDrag);
    window.removeEventListener("pointerup", endDrag);
};

const checkSnap = (item: Triangle) => {
    const SNAP_THRESHOLD = 45;
    const dist = Math.hypot(
        item.currentLeft - item.targetLeft,
        item.currentTop - item.targetTop,
    );

    if (dist < SNAP_THRESHOLD) {
        item.currentLeft = item.targetLeft;
        item.currentTop = item.targetTop;
        item.isLocked = true;
        if (navigator.vibrate) navigator.vibrate(20);
    } else {
        item.currentLeft = item.initialLeft;
        item.currentTop = item.initialTop;
    }
};

onUnmounted(() => {
    window.removeEventListener("pointermove", onDrag);
    window.removeEventListener("pointerup", endDrag);
});

const steps = [
    {
        title: "Rahasia Pythagoras",
        content:
            "Mari kita buktikan teorema Pythagoras dengan cara yang menyenangkan! Kita akan menggunakan 4 segitiga siku-siku yang sama.",
    },
    {
        title: "Puzzle Pythagoras",
        content:
            "Cobalah susun keempat segitiga ini di dalam kotak garis putus-putus! Geser menggunakan jarimu.",
    },
    {
        title: "Lihat Hasilnya!",
        content:
            "Hebat! Perhatikan: Ada dua kotak yang terbentuk. Kotak kecil di tengah luasnya <strong>c²</strong>, dan total luas 4 segitiga adalah <strong>4 × ½ab</strong>.",
    },
    {
        title: "Perhitungan Luas",
        content:
            "Luas kotak besar (sisi a+b) sama dengan luas 4 segitiga ditambah luas kotak kecil (c).",
    },
    {
        title: "Penyederhanaan",
        content:
            "Kita uraikan persamaannya. Perhatikan bahwa nilai <strong>2ab</strong> ada di kedua sisi, jadi bisa kita coret!",
    },
    {
        title: "Teorema Pythagoras!",
        content:
            "Tadaaa! Kita telah membuktikan <strong>Teorema Pythagoras</strong> dengan menyusun ulang luas bangun datar. Keren kan?",
    },
];

const currentStepData = computed(() => steps[currentStep.value]);

const nextStep = () => {
    if (currentStep.value === 1 && !isPuzzleComplete.value) return;

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
</script>

<template>
    <div class="flex flex-col items-center justify-center w-full">
        <div class="min-h-[100dvh] flex flex-col max-w-sm w-full relative">
            <div class="flex-1 flex flex-col items-center pb-32 pt-8 px-6">
                <h1
                    class="font-recoleta text-3xl sm:text-4xl font-bold text-zinc-800 text-center mb-4 leading-tight"
                    v-motion
                    :initial="{ opacity: 0, y: -20 }"
                    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
                    :key="currentStepData.title"
                >
                    {{ currentStepData?.title }}
                </h1>

                <div
                    class="flex justify-center mb-6 w-full min-h-[104px] items-center"
                >
                    <PytaSpeech
                        :text="currentStepData?.content || ''"
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
                    v-if="currentStep >= 1"
                    class="w-full flex justify-center mb-4"
                    v-motion
                    :initial="{ opacity: 0, scale: 0.9 }"
                    :enter="{
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 500 },
                    }"
                >
                    <div
                        class="w-full bg-white border-2 border-zinc-100 rounded-2xl overflow-hidden select-none touch-none transition-all duration-700 ease-in-out"
                        :class="[currentStep >= 2 ? 'h-[220px]' : 'h-[450px]']"
                        style="
                            background-image: radial-gradient(
                                #e5e7eb 1px,
                                transparent 1px
                            );
                            background-size: 20px 20px;
                        "
                    >
                        <div class="relative w-[300px] h-full mx-auto">
                            <template v-if="currentStep === 1">
                                <div
                                    v-for="item in triangles"
                                    :key="'ghost-' + item.id"
                                    class="absolute w-[100px] h-[50px] pointer-events-none transition-all duration-300 z-10"
                                    :style="{
                                        left: item.targetLeft + 'px',
                                        top: item.targetTop + 'px',
                                        transform: `rotate(${item.rotation}deg)`,
                                        transformOrigin: 'top left',
                                    }"
                                >
                                    <svg
                                        width="100"
                                        height="50"
                                        viewBox="0 0 100 50"
                                        class="overflow-visible"
                                    >
                                        <path
                                            d="M0 0 L100 0 L0 50 Z"
                                            fill="none"
                                            stroke-width="2"
                                            stroke-dasharray="5,5"
                                            stroke-linejoin="miter"
                                            :stroke="
                                                draggedItem?.id === item.id
                                                    ? '#34d399'
                                                    : '#cbd5e1'
                                            "
                                            class="transition-colors duration-300"
                                        />
                                        <path
                                            v-if="draggedItem?.id === item.id"
                                            d="M0 0 L100 0 L0 50 Z"
                                            fill="#10b981"
                                            opacity="0.15"
                                        />
                                        <text
                                            v-if="draggedItem?.id === item.id"
                                            x="33.33"
                                            y="16.66"
                                            font-size="10"
                                            font-weight="bold"
                                            fill="#059669"
                                            text-anchor="middle"
                                            dominant-baseline="middle"
                                            :transform="`rotate(${-item.rotation}, 33.33, 16.66)`"
                                            style="
                                                text-shadow: 0px 0px 2px white;
                                            "
                                        >
                                            Sini!
                                        </text>
                                    </svg>
                                </div>
                            </template>

                            <div
                                v-for="item in triangles"
                                :key="item.id"
                                @pointerdown="(e) => startDrag(e, item)"
                                class="absolute w-[100px] h-[50px] touch-none"
                                :class="[
                                    currentStep === 1
                                        ? item.isLocked
                                            ? 'z-20 cursor-default'
                                            : 'z-50 cursor-grab active:cursor-grabbing'
                                        : 'z-20 pointer-events-none',
                                    item.isLocked
                                        ? 'opacity-100'
                                        : 'opacity-90',
                                    item.isDragging && currentStep === 1
                                        ? 'transition-none scale-110 drop-shadow-xl z-[100]'
                                        : 'transition-all duration-500 ease-out',
                                ]"
                                :style="{
                                    left: item.currentLeft + 'px',
                                    top: item.currentTop + 'px',
                                    transform: `rotate(${item.rotation}deg)`,
                                    transformOrigin: 'top left',
                                }"
                            >
                                <svg
                                    width="100"
                                    height="50"
                                    viewBox="0 0 100 50"
                                    class="overflow-visible"
                                >
                                    <path
                                        d="M0 0 L100 0 L0 50 Z"
                                        :fill="item.fillColor"
                                        :stroke="item.strokeColor"
                                        stroke-width="2"
                                        stroke-linejoin="miter"
                                    />
                                </svg>
                            </div>

                            <div
                                v-if="currentStep === 1"
                                class="absolute bottom-4 w-full text-center"
                            >
                                <p
                                    class="text-slate-400 text-xs bg-white/80 inline-block px-3 py-1 rounded-full backdrop-blur-sm border border-slate-100"
                                >
                                    Geser segitiga ke area putus-putus
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="currentStep >= 3" class="w-full mt-2">
                    <div class="w-full flex flex-col gap-2 items-center">
                        <div
                            v-if="currentStep >= 3"
                            class="w-full text-center"
                            v-motion
                            :initial="{ opacity: 0, y: 20 }"
                            :enter="{ opacity: 1, y: 0 }"
                        >
                            <span
                                class="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1 block"
                                >Total Luas</span
                            >
                            <div class="text-xl text-zinc-700 font-recoleta">
                                (a + b)² =
                                <span class="text-blue-600">4(½ab)</span> +
                                <span class="text-emerald-600">c²</span>
                            </div>
                        </div>

                        <div
                            v-if="currentStep >= 4"
                            class="text-zinc-300 text-lg animate-bounce py-1"
                            v-motion
                            :initial="{ opacity: 0 }"
                            :enter="{ opacity: 1, transition: { delay: 200 } }"
                        >
                            ↓
                        </div>

                        <div
                            v-if="currentStep >= 4"
                            class="w-full text-center"
                            v-motion
                            :initial="{ opacity: 0, y: 20 }"
                            :enter="{ opacity: 1, y: 0 }"
                        >
                            <span
                                class="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1 block"
                                >Jabarkan</span
                            >
                            <div class="text-xl text-zinc-700 font-recoleta">
                                a² +
                                <span
                                    class="text-zinc-400 line-through decoration-red-400/50 decoration-2"
                                    >2ab</span
                                >
                                + b² =
                                <span
                                    class="text-zinc-400 line-through decoration-red-400/50 decoration-2"
                                    >2ab</span
                                >
                                + c²
                            </div>
                        </div>

                        <div
                            v-if="currentStep >= 5"
                            class="text-zinc-300 text-lg animate-bounce py-1"
                            v-motion
                            :initial="{ opacity: 0 }"
                            :enter="{ opacity: 1, transition: { delay: 200 } }"
                        >
                            ↓
                        </div>

                        <div
                            v-if="currentStep >= 5"
                            class="w-full text-center relative"
                            v-motion
                            :initial="{ opacity: 0, scale: 0.8 }"
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
                            <span
                                class="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-2 block"
                                >Hasil Akhir</span
                            >

                            <div class="relative inline-block group">
                                <div
                                    class="absolute -inset-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-500"
                                ></div>
                                <div
                                    class="relative bg-white border-2 border-emerald-100 px-8 py-4 rounded-xl shadow-sm"
                                >
                                    <span
                                        class="text-3xl font-bold text-emerald-600 font-recoleta tracking-wide"
                                    >
                                        a² + b² = c²
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-white/90 backdrop-blur-xl border border-zinc-200/60 rounded-full z-[90]"
            >
                <div
                    class="relative flex items-center justify-between px-2 h-16"
                >
                    <Button
                        v-if="currentStep > 0"
                        @click="previousStep"
                        variant="text"
                        class="!p-0 w-12 h-12 flex items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors z-10"
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
                            v-for="(_step, index) in steps"
                            :key="index"
                            class="rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                            :class="
                                currentStep === index
                                    ? 'w-8 h-2 bg-emerald-500'
                                    : 'w-2 h-2 bg-emerald-200'
                            "
                        ></div>
                    </div>

                    <Button
                        @click="nextStep"
                        variant="text"
                        :disabled="currentStep === 1 && !isPuzzleComplete"
                        class="flex items-center gap-2 font-bold px-4 py-2 rounded-full transition-all z-10"
                        :class="[
                            currentStep === 1 && !isPuzzleComplete
                                ? 'text-zinc-300 opacity-50 cursor-not-allowed'
                                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50',
                        ]"
                    >
                        <span>{{
                            currentStep === steps.length - 1
                                ? "Selesai"
                                : "Lanjut"
                        }}</span>
                        <svg
                            v-if="currentStep !== steps.length - 1"
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
