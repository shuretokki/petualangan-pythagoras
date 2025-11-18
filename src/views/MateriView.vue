<script setup lang="ts">
import { ref, computed, reactive, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentStep = ref(0);

// --- PUZZLE DATA & LOGIC START ---

// Configuration: Triangles (100x50), Box (150x150)
// Container is 300px wide to fit in max-w-sm
interface Triangle {
    id: number;
    color: string;
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
        color: "bg-rose-500",
        targetLeft: 75,
        targetTop: 30,
        rotation: 0,
        initialLeft: 20,
        initialTop: 280,
        currentLeft: 20,
        currentTop: 280,
        isLocked: false,
        isDragging: false,
    },
    {
        id: 2,
        color: "bg-blue-500",
        targetLeft: 225,
        targetTop: 30,
        rotation: 90,
        initialLeft: 80,
        initialTop: 280,
        currentLeft: 80,
        currentTop: 280,
        isLocked: false,
        isDragging: false,
    },
    {
        id: 3,
        color: "bg-emerald-500",
        targetLeft: 225,
        targetTop: 180,
        rotation: 180,
        initialLeft: 140,
        initialTop: 280,
        currentLeft: 140,
        currentTop: 280,
        isLocked: false,
        isDragging: false,
    },
    {
        id: 4,
        color: "bg-amber-500",
        targetLeft: 75,
        targetTop: 180,
        rotation: 270,
        initialLeft: 200,
        initialTop: 280,
        currentLeft: 200,
        currentTop: 280,
        isLocked: false,
        isDragging: false,
    },
]);

let draggedItem: Triangle | null = null;
let startMouseX = 0;
let startMouseY = 0;
let startElemX = 0;
let startElemY = 0;

const mouseDown = (e: MouseEvent, item: Triangle) => {
    if (item.isLocked) return;
    draggedItem = item;
    item.isDragging = true;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startElemX = item.currentLeft;
    startElemY = item.currentTop;
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
};

const mouseMove = (e: MouseEvent) => {
    if (!draggedItem) return;
    draggedItem.currentLeft = startElemX + (e.clientX - startMouseX);
    draggedItem.currentTop = startElemY + (e.clientY - startMouseY);
};

const mouseUp = () => {
    if (draggedItem) {
        checkSnap(draggedItem);
        draggedItem.isDragging = false;
    }
    draggedItem = null;
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
};

const checkSnap = (item: Triangle) => {
    const SNAP_THRESHOLD = 30;
    const dist = Math.hypot(
        item.currentLeft - item.targetLeft,
        item.currentTop - item.targetTop,
    );

    if (dist < SNAP_THRESHOLD) {
        item.currentLeft = item.targetLeft;
        item.currentTop = item.targetTop;
        item.isLocked = true;
    } else {
        item.currentLeft = item.initialLeft;
        item.currentTop = item.initialTop;
    }
};

// Cleanup listeners if user leaves page while dragging
onUnmounted(() => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
});

// --- PUZZLE LOGIC END ---

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
</script>

<template>
    <div class="flex flex-col items-center justify-center">
        <div class="min-h-100dvh flex flex-col justify- max-w-sm w-full">
            <div
                class="flex-1 flex flex-col justify-center items-center mb-16 mt-4"
            >
                <h1
                    class="font-recoleta text-4xl font-bold text-zinc-900 text-center mb-6"
                    v-motion
                    :initial="{ opacity: 0, y: -50 }"
                    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
                >
                    {{ currentStepData?.title }}
                </h1>

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

                <div
                    v-if="currentStep === 1 || currentStep === 2"
                    class="flex justify-center mb-6 sm:mb-8 w-full"
                >
                    <div class="w-full max-w-[300px]">
                        <div
                            class="relative w-[300px] h-[400px] bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden select-none mx-auto"
                        >
                            <div
                                class="absolute border border-dashed border-slate-300 bg-slate-50 rounded-sm"
                                style="
                                    width: 150px;
                                    height: 150px;
                                    left: 75px;
                                    top: 30px;
                                "
                            >
                                <div
                                    v-if="currentStep === 1"
                                    class="w-full h-full flex items-center justify-center text-slate-300 text-xs text-center px-2"
                                >
                                    Drop here
                                </div>
                            </div>

                            <div
                                v-for="item in triangles"
                                :key="'ghost-' + item.id"
                                class="absolute w-[100px] h-[50px] bg-slate-100 pointer-events-none transition-colors duration-300"
                                :class="{ 'bg-slate-200': item.isDragging }"
                                :style="{
                                    left: item.targetLeft + 'px',
                                    top: item.targetTop + 'px',
                                    transform: `rotate(${item.rotation}deg)`,
                                    transformOrigin: 'top left',
                                    clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                                }"
                            ></div>

                            <div
                                v-for="item in triangles"
                                :key="item.id"
                                @mousedown="(e) => mouseDown(e, item)"
                                class="absolute w-[100px] h-[50px] shadow-sm"
                                :class="[
                                    item.color,
                                    item.isLocked
                                        ? 'z-20 cursor-default opacity-100'
                                        : 'z-50 cursor-grab active:cursor-grabbing opacity-90',
                                    item.isDragging
                                        ? 'transition-none ring-2 ring-black/10'
                                        : 'transition-all duration-300 ease-out',
                                ]"
                                :style="{
                                    left: item.currentLeft + 'px',
                                    top: item.currentTop + 'px',
                                    transform: `rotate(${item.rotation}deg)`,
                                    transformOrigin: 'top left',
                                    clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                                }"
                            ></div>

                            <div
                                class="absolute bottom-4 w-full text-center text-slate-400 text-xs pointer-events-none px-4"
                            >
                                Geser segitiga ke kotak garis putus-putus
                            </div>
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
                            class="font-recoleta text-zinc-700 overflow-x-auto"
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

                <div
                    class="fixed bg-gray-50 bottom-0 left-0 overflow-hidden max-w-sm h-16 inset-x-0 mx-auto z-50 flex items-center justify-between px-4"
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
                                    ? 'bg-zinc-800 w-8'
                                    : 'bg-zinc-300'
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
