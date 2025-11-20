<script setup lang="ts">
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

const draggedItem = ref<Triangle | null>(null);
let startX = 0;
let startY = 0;
let startElemX = 0;
let startElemY = 0;

const isPuzzleComplete = computed(() => triangles.every((t) => t.isLocked));

watch(isPuzzleComplete, (newVal) => {
    if (newVal && navigator.vibrate) navigator.vibrate([50, 50, 50]);
});

const startDrag = (e: PointerEvent, item: Triangle) => {
    if (item.isLocked) return;
    e.preventDefault();
    draggedItem.value = item;
    item.isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startElemX = item.currentLeft;
    startElemY = item.currentTop;
    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", endDrag);
};

const onDrag = (e: PointerEvent) => {
    if (!draggedItem.value) return;
    e.preventDefault();
    draggedItem.value.currentLeft = startElemX + (e.clientX - startX);
    draggedItem.value.currentTop = startElemY + (e.clientY - startY);
};

const endDrag = () => {
    if (draggedItem.value) {
        checkSnap(draggedItem.value);
        draggedItem.value.isDragging = false;
    }
    draggedItem.value = null;
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

// Content from PDF "Hijau Biru Ilustrasi Alam Tugas Presentasi"
const steps = [
    {
        title: "Rahasia Pythagoras",
        content:
            "Oke, di sini Pyta punya 4 segitiga siku-siku yang sama besar. Coba perhatikan sisi-sisinya ya!",
    },
    {
        title: "Misi Menyusun",
        content:
            "Mari bantu Pyta menyusun <strong>hipotenusa</strong> dari keempat segitiga ini supaya membentuk bingkai persegi di tengahnya.",
    },
    {
        title: "Analisis Bentuk",
        content:
            "Taraaa! Inilah bentuk yang kita peroleh. Perhatikan ada <strong>persegi kecil</strong> di tengah (warna putih). Luasnya adalah <strong class='text-emerald-600'>c²</strong>.",
    },
    {
        title: "Perhitungan Luas",
        content:
            "Luas Persegi Besar = Luas Persegi Kecil + 4 × Luas Segitiga.<br>Dalam rumus: <strong>(a + b)² = c² + 4(½ab)</strong>",
    },
    {
        title: "Penyederhanaan",
        content:
            "Kita jabarkan kedua ruas dan coret <strong>2ab</strong>. <br>Maka diperoleh: <strong>a² + b² = c²</strong>.",
    },
    {
        title: "Kesimpulan",
        content:
            "Nah, inilah <strong>Teorema Pythagoras</strong>! <br><em>a² + b² = c²</em> <br>(dengan c adalah hipotenusa).",
    },
];

const currentStepData = computed(() => steps[currentStep.value]);

const nextStep = () => {
    if (currentStep.value === 1 && !isPuzzleComplete.value) return;
    currentStep.value < steps.length - 1
        ? currentStep.value++
        : router.push({ name: "contoh-soal" });
};

const previousStep = () => {
    if (currentStep.value > 0) currentStep.value--;
};
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
            <div class="flex-1 flex flex-col items-center pb-32 pt-8 px-6">
                <div
                    class="text-[10px] font-bold text-emerald-600 tracking-widest uppercase mb-3"
                    v-motion
                    :initial="{ opacity: 0, y: -10 }"
                    :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
                >
                    Materi Pembelajaran
                </div>

                <h1
                    class="font-recoleta text-3xl sm:text-4xl font-bold text-zinc-800 text-center mb-6 leading-tight"
                    v-motion
                    :initial="{ opacity: 0, y: -20 }"
                    :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
                    :key="currentStepData?.title"
                >
                    {{ currentStepData?.title }}
                </h1>

                <div
                    class="flex justify-center mb-10 w-full z-20 min-h-[120px] items-center"
                >
                    <PytaSpeech :text="currentStepData?.content || ''" />
                </div>

                <div
                    v-if="currentStep === 0"
                    class="w-full flex justify-center mb-8"
                    v-motion
                    :initial="{ opacity: 0, scale: 0.8 }"
                    :enter="{ opacity: 1, scale: 1 }"
                >
                    <div class="relative w-64 h-64">
                        <svg
                            viewBox="0 0 200 200"
                            class="w-full h-full drop-shadow-xl"
                        >
                            <circle
                                cx="100"
                                cy="100"
                                r="60"
                                fill="#10b981"
                                opacity="0.1"
                                class="animate-pulse"
                            />

                            <g class="animate-float-slow">
                                <path
                                    d="M60 40 L100 40 L60 70 Z"
                                    fill="#fb7185"
                                    stroke="#e11d48"
                                    stroke-width="2"
                                />
                                <text
                                    x="65"
                                    y="60"
                                    font-size="10"
                                    fill="white"
                                    font-weight="bold"
                                >
                                    1
                                </text>
                            </g>
                            <g
                                class="animate-float-medium"
                                style="transform-origin: center"
                            >
                                <path
                                    d="M140 60 L140 100 L110 100 Z"
                                    fill="#60a5fa"
                                    stroke="#2563eb"
                                    stroke-width="2"
                                />
                                <text
                                    x="130"
                                    y="90"
                                    font-size="10"
                                    fill="white"
                                    font-weight="bold"
                                >
                                    2
                                </text>
                            </g>
                            <g class="animate-float-fast">
                                <path
                                    d="M60 140 L100 140 L60 110 Z"
                                    fill="#34d399"
                                    stroke="#059669"
                                    stroke-width="2"
                                />
                                <text
                                    x="70"
                                    y="130"
                                    font-size="10"
                                    fill="white"
                                    font-weight="bold"
                                >
                                    3
                                </text>
                            </g>
                            <g
                                class="animate-float-slow"
                                style="animation-delay: 1s"
                            >
                                <path
                                    d="M150 150 L150 110 L180 150 Z"
                                    fill="#fbbf24"
                                    stroke="#d97706"
                                    stroke-width="2"
                                />
                                <text
                                    x="160"
                                    y="140"
                                    font-size="10"
                                    fill="white"
                                    font-weight="bold"
                                >
                                    4
                                </text>
                            </g>
                        </svg>
                        <div class="absolute -bottom-4 w-full text-center">
                            <p
                                class="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full inline-block"
                            >
                                4 Segitiga Siku-Siku
                            </p>
                        </div>
                    </div>
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
                    <div class="relative w-full">
                        <div
                            v-if="isPuzzleComplete && currentStep === 1"
                            class="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300"
                        >
                            <div
                                class="bg-white/90 backdrop-blur text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1"
                            >
                                <i-lucide-check class="w-3 h-3" />
                                Sempurna!
                            </div>
                        </div>

                        <div
                            v-if="currentStep >= 2"
                            class="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col items-center text-xs font-bold text-slate-400 h-[150px] justify-between z-20"
                            v-motion
                            :initial="{ opacity: 0 }"
                            :enter="{ opacity: 1 }"
                        >
                            <span class="font-serif italic">a</span>
                            <div class="h-full w-px bg-slate-300 my-1"></div>
                            <span class="font-serif italic">b</span>
                        </div>
                        <div
                            v-if="currentStep >= 2"
                            class="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center text-xs font-bold text-slate-400 w-[150px] justify-between z-20"
                            v-motion
                            :initial="{ opacity: 0 }"
                            :enter="{ opacity: 1 }"
                        >
                            <span class="font-serif italic">b</span>
                            <div class="w-full h-px bg-slate-300 mx-1"></div>
                            <span class="font-serif italic">a</span>
                        </div>

                        <div
                            class="w-full bg-white border-2 rounded-lg overflow-hidden select-none touch-none transition-all duration-700 ease-in-out relative z-10"
                            :class="[
                                currentStep >= 2
                                    ? 'h-[220px] border-zinc-100'
                                    : 'h-[450px]',
                                isPuzzleComplete && currentStep === 1
                                    ? 'border-emerald-400'
                                    : 'border-zinc-100',
                            ]"
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
                                                v-if="
                                                    draggedItem?.id === item.id
                                                "
                                                d="M0 0 L100 0 L0 50 Z"
                                                fill="#10b981"
                                                opacity="0.15"
                                            />
                                            <text
                                                v-if="
                                                    draggedItem?.id === item.id
                                                "
                                                x="33.33"
                                                y="20"
                                                font-size="10"
                                                font-weight="bold"
                                                fill="#059669"
                                                text-anchor="middle"
                                                :transform="`rotate(${-item.rotation}, 33.33, 20)`"
                                                style="
                                                    text-shadow: 0px 0px 2px
                                                        white;
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
                                            ? 'transition-none scale-110 z-[100]'
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
                                        <text
                                            x="-10"
                                            y="25"
                                            font-size="14"
                                            font-weight="bold"
                                            fill="#18181b"
                                            text-anchor="middle"
                                            class="select-none font-serif italic"
                                        >
                                            a
                                        </text>
                                        <text
                                            x="50"
                                            y="-8"
                                            font-size="14"
                                            font-weight="bold"
                                            fill="#18181b"
                                            text-anchor="middle"
                                            class="select-none font-serif italic"
                                        >
                                            b
                                        </text>
                                        <text
                                            x="55"
                                            y="35"
                                            font-size="14"
                                            font-weight="bold"
                                            fill="#18181b"
                                            text-anchor="middle"
                                            class="select-none font-serif italic"
                                        >
                                            c
                                        </text>
                                    </svg>
                                </div>

                                <div
                                    v-if="
                                        currentStep === 1 && !isPuzzleComplete
                                    "
                                    class="absolute bottom-4 w-full text-center"
                                >
                                    <p
                                        class="text-slate-400 text-xs bg-white/80 inline-block px-3 py-1 rounded-lg backdrop-blur-sm border border-slate-100"
                                    >
                                        Geser segitiga ke area putus-putus
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="currentStep >= 3" class="w-full mt-4">
                    <div
                        class="w-full flex flex-col gap-6 items-center transition-all duration-500"
                    >
                        <div
                            v-if="currentStep >= 3"
                            class="w-full text-center"
                            v-motion
                            :initial="{ opacity: 0, y: 10 }"
                            :enter="{ opacity: 1, y: 0 }"
                        >
                            <span
                                class="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-2 block"
                                >Rumus Luas</span
                            >
                            <div
                                class="text-xl sm:text-2xl text-zinc-700 font-recoleta leading-relaxed"
                            >
                                <span class="font-serif italic">(a + b)²</span>
                                = <span class="text-rose-500 font-bold">4</span
                                ><span class="font-serif italic">(½ab)</span> +
                                <span
                                    class="text-emerald-600 font-bold font-serif italic"
                                    >c²</span
                                >
                            </div>
                        </div>
                        <div
                            v-if="currentStep >= 4"
                            class="text-zinc-300 text-lg animate-bounce"
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
                            :initial="{ opacity: 0, y: 10 }"
                            :enter="{ opacity: 1, y: 0 }"
                        >
                            <span
                                class="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-2 block"
                                >Jabarkan</span
                            >
                            <div
                                class="text-lg sm:text-xl text-zinc-700 font-recoleta leading-relaxed"
                            >
                                <span class="font-serif italic">a²</span> +
                                <span
                                    class="relative inline-block text-zinc-400 font-serif italic"
                                    >2ab<span
                                        class="absolute top-1/2 left-0 w-full h-0.5 bg-rose-400 -rotate-12 animate-strike"
                                    ></span
                                ></span>
                                + <span class="font-serif italic">b²</span> =
                                <span
                                    class="relative inline-block text-zinc-400 font-serif italic"
                                    >2ab<span
                                        class="absolute top-1/2 left-0 w-full h-0.5 bg-rose-400 -rotate-12 animate-strike"
                                    ></span
                                ></span>
                                + <span class="font-serif italic">c²</span>
                            </div>
                        </div>
                        <div
                            v-if="currentStep >= 5"
                            class="text-zinc-300 text-lg animate-bounce"
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
                            <div
                                class="relative inline-block px-8 py-4 bg-emerald-600 rounded-lg text-white transform hover:scale-105 transition-transform duration-300 cursor-default border-2 border-emerald-500 shadow-lg"
                            >
                                <span
                                    class="text-3xl font-bold font-recoleta tracking-wide"
                                    >a² + b² = c²</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-white/90 backdrop-blur-xl border border-zinc-200/60 rounded-full z-50"
        >
            <div class="relative flex items-center justify-between px-2 h-16">
                <Button
                    v-if="currentStep > 0"
                    @click="previousStep"
                    variant="text"
                    rounded
                    class="!p-0 w-12 h-12 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors z-10"
                >
                    <i-lucide-arrow-left class="w-6 h-6" />
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
                    rounded
                    :disabled="currentStep === 1 && !isPuzzleComplete"
                    class="flex items-center gap-2 text-emerald-600 font-bold hover:bg-emerald-50 hover:text-emerald-700 px-4 py-2 transition-all z-10"
                    :class="[
                        currentStep === 1 && !isPuzzleComplete
                            ? 'text-zinc-300 opacity-50 cursor-not-allowed'
                            : '',
                    ]"
                >
                    <span>{{
                        currentStep === steps.length - 1 ? "Selesai" : "Lanjut"
                    }}</span>
                    <i-lucide-arrow-right class="w-4 h-4" />
                </Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-float-slow {
    animation: float 6s ease-in-out infinite;
}
.animate-float-medium {
    animation: float 5s ease-in-out infinite reverse;
}
.animate-float-fast {
    animation: float 4s ease-in-out infinite;
}
@keyframes float {
    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-10px) rotate(5deg);
    }
}
.animate-strike {
    animation: strike 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
}
@keyframes strike {
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
}
</style>
