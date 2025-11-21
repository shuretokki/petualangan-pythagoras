<script setup lang="ts">
interface Triangle {
    id: number;
    fill: string;
    stroke: string;
    targetx: number;
    targety: number;
    rot: number;
    initx: number;
    inity: number;
    x: number;
    y: number;
    locked: boolean;
    dragging: boolean;
}

const router = useRouter();
const ui = reactive({ intro: true, step: 0 });

const triangles = reactive<Triangle[]>([
    {
        id: 1,
        fill: "#fb7185",
        stroke: "#e11d48",
        targetx: 75,
        targety: 30,
        rot: 0,
        initx: 25,
        inity: 240,
        x: 25,
        y: 240,
        locked: false,
        dragging: false,
    },
    {
        id: 2,
        fill: "#60a5fa",
        stroke: "#2563eb",
        targetx: 225,
        targety: 30,
        rot: 90,
        initx: 100,
        inity: 300,
        x: 100,
        y: 300,
        locked: false,
        dragging: false,
    },
    {
        id: 3,
        fill: "#34d399",
        stroke: "#059669",
        targetx: 225,
        targety: 180,
        rot: 180,
        initx: 275,
        inity: 290,
        x: 275,
        y: 290,
        locked: false,
        dragging: false,
    },
    {
        id: 4,
        fill: "#fbbf24",
        stroke: "#d97706",
        targetx: 75,
        targety: 180,
        rot: 270,
        initx: 200,
        inity: 400,
        x: 200,
        y: 400,
        locked: false,
        dragging: false,
    },
]);

const isComplete = computed(() => triangles.every((t) => t.locked));
watch(isComplete, (val) => val && navigator.vibrate?.([50, 50, 50]));

const drag = reactive({
    active: null as Triangle | null,
    sx: 0,
    sy: 0,
    elX: 0,
    elY: 0,
});

const onDown = (e: PointerEvent, t: Triangle) => {
    if (t.locked) return;
    e.preventDefault();
    drag.active = t;
    t.dragging = true;
    drag.sx = e.clientX;
    drag.sy = e.clientY;
    drag.elX = t.x;
    drag.elY = t.y;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
};

const onMove = (e: PointerEvent) => {
    if (!drag.active) return;
    e.preventDefault();
    drag.active.x = drag.elX + (e.clientX - drag.sx);
    drag.active.y = drag.elY + (e.clientY - drag.sy);
};

const onUp = () => {
    if (drag.active) {
        const t = drag.active;
        const dist = Math.hypot(t.x - t.targetx, t.y - t.targety);
        if (dist < 45) {
            t.x = t.targetx;
            t.y = t.targety;
            t.locked = true;
            navigator.vibrate?.(20);
        } else {
            t.x = t.initx;
            t.y = t.inity;
        }
        t.dragging = false;
    }
    drag.active = null;
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
};

onUnmounted(() => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
});

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
            "Nah, inilah <strong>Teorema Pythagoras</strong>!<br><em>a² + b² = c²</em> <br>(dengan c adalah hipotenusa).",
    },
];

const currData = computed(() => steps[ui.step]);

const nav = (dir: 1 | -1) => {
    if (dir === 1) {
        if (ui.step === 1 && !isComplete.value) return;
        ui.step < steps.length - 1
            ? ui.step++
            : router.push({ name: "contoh-soal" });
    } else {
        if (ui.step > 0) ui.step--;
    }
};
</script>

<template>
    <SectionIntro
        v-if="ui.intro"
        title="Materi Pembelajaran"
        description="Ayo kita bongkar rahasia di balik rumus Pythagoras dengan puzzle interaktif!"
        buttonText="Mulai Belajar"
        variant="emerald"
        @start="ui.intro = false"
    />

    <div
        v-else
        class="fixed inset-0 bg-zinc-50 font-sans text-slate-900 flex justify-center overflow-hidden"
    >
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div
                class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-200/20 blur-3xl animate-pulse"
            />
            <div
                class="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-3xl animate-pulse delay-1000"
            />
        </div>

        <div
            class="w-full max-w-md h-full border border-zinc-200 flex flex-col relative bg-[#FAFAFA]"
        >
            <div class="flex-none z-20 w-full flex justify-start pt-8 px-6">
                <Button
                    @click="router.push({ name: 'home' })"
                    variant="text"
                    rounded
                    class="!p-2 !px-3 flex items-center gap-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors text-sm font-bold"
                >
                    <i-lucide-arrow-left class="w-6 h-6" /> Home
                </Button>
            </div>

            <div
                class="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-6 pb-24"
            >
                <div class="flex flex-col items-center pt-4">
                    <div
                        class="text-[10px] font-bold text-emerald-600 tracking-widest uppercase mb-3"
                    >
                        Materi Pembelajaran
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
                        :key="currData?.title"
                    >
                        {{ currData?.title }}
                    </h1>

                    <div
                        class="flex justify-center mb-10 w-full z-20 min-h-[120px] items-center"
                    >
                        <PytaSpeech :text="currData?.content || ''" />
                    </div>

                    <div
                        v-if="ui.step >= 1"
                        class="w-full flex justify-center mb-4"
                        v-motion
                        :initial="{ opacity: 0, scale: 0.9 }"
                        :enter="{ opacity: 1, scale: 1 }"
                    >
                        <div class="relative w-full">
                            <div
                                v-if="isComplete && ui.step === 1"
                                class="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300"
                            >
                                <div
                                    class="bg-white/90 backdrop-blur text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1"
                                >
                                    <i-lucide-check class="w-3 h-3" /> Sempurna!
                                </div>
                            </div>

                            <template v-if="ui.step >= 2">
                                <div
                                    class="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col items-center text-xs font-bold text-slate-400 h-[150px] justify-between z-20"
                                    v-motion
                                    :initial="{ opacity: 0 }"
                                    :enter="{ opacity: 1 }"
                                >
                                    <span class="font-serif italic">a</span>
                                    <div
                                        class="h-full w-px bg-slate-300 my-1"
                                    />
                                    <span class="font-serif italic">b</span>
                                </div>
                                <div
                                    class="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center text-xs font-bold text-slate-400 w-[150px] justify-between z-20"
                                    v-motion
                                    :initial="{ opacity: 0 }"
                                    :enter="{ opacity: 1 }"
                                >
                                    <span class="font-serif italic">b</span>
                                    <div
                                        class="w-full h-px bg-slate-300 mx-1"
                                    />
                                    <span class="font-serif italic">a</span>
                                </div>
                            </template>

                            <div
                                class="w-full bg-white border-2 rounded-lg overflow-hidden select-none touch-none transition-all duration-700 ease-in-out relative z-10"
                                :class="[
                                    ui.step >= 2
                                        ? 'h-[220px] border-zinc-100'
                                        : 'h-[450px]',
                                    isComplete && ui.step === 1
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
                                    <template v-if="ui.step === 1">
                                        <div
                                            v-for="t in triangles"
                                            :key="'ghost-' + t.id"
                                            class="absolute w-[100px] h-[50px] pointer-events-none transition-all duration-300 z-10"
                                            :style="{
                                                left: t.targetx + 'px',
                                                top: t.targety + 'px',
                                                transform: `rotate(${t.rot}deg)`,
                                                transformOrigin: 'top left',
                                            }"
                                        >
                                            <svg
                                                viewBox="0 0 100 50"
                                                class="overflow-visible"
                                            >
                                                <path
                                                    d="M0 0 L100 0 L0 50 Z"
                                                    fill="none"
                                                    stroke-width="2"
                                                    stroke-dasharray="5,5"
                                                    :stroke="
                                                        drag.active?.id === t.id
                                                            ? '#34d399'
                                                            : '#cbd5e1'
                                                    "
                                                    class="transition-colors duration-300"
                                                />
                                                <path
                                                    v-if="
                                                        drag.active?.id === t.id
                                                    "
                                                    d="M0 0 L100 0 L0 50 Z"
                                                    fill="#10b981"
                                                    opacity="0.15"
                                                />
                                                <text
                                                    v-if="
                                                        drag.active?.id === t.id
                                                    "
                                                    x="33.33"
                                                    y="20"
                                                    font-size="10"
                                                    font-weight="bold"
                                                    fill="#059669"
                                                    text-anchor="middle"
                                                    :transform="`rotate(${-t.rot}, 33.33, 20)`"
                                                    style="
                                                        text-shadow: 0 0 2px
                                                            white;
                                                    "
                                                >
                                                    Sini!
                                                </text>
                                            </svg>
                                        </div>
                                    </template>

                                    <div
                                        v-for="t in triangles"
                                        :key="t.id"
                                        @pointerdown="(e) => onDown(e, t)"
                                        class="absolute w-[100px] h-[50px] touch-none"
                                        :class="[
                                            ui.step === 1
                                                ? t.locked
                                                    ? 'z-20 cursor-default'
                                                    : 'z-50 cursor-grab active:cursor-grabbing'
                                                : 'z-20 pointer-events-none',
                                            t.locked
                                                ? 'opacity-100'
                                                : 'opacity-90',
                                            t.dragging && ui.step === 1
                                                ? 'transition-none scale-110 z-[100]'
                                                : 'transition-all duration-500 ease-out',
                                        ]"
                                        :style="{
                                            left: t.x + 'px',
                                            top: t.y + 'px',
                                            transform: `rotate(${t.rot}deg)`,
                                            transformOrigin: 'top left',
                                        }"
                                    >
                                        <svg
                                            viewBox="0 0 100 50"
                                            class="overflow-visible"
                                        >
                                            <path
                                                d="M0 0 L100 0 L0 50 Z"
                                                :fill="t.fill"
                                                :stroke="t.stroke"
                                                stroke-width="2"
                                            />
                                        </svg>
                                    </div>

                                    <div
                                        v-if="ui.step === 1 && !isComplete"
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

                    <div
                        v-if="ui.step === 0"
                        class="w-full flex justify-center mb-8"
                        v-motion
                        :initial="{ opacity: 0, scale: 0.8 }"
                        :enter="{ opacity: 1, scale: 1 }"
                    >
                        <div class="relative w-64 h-64">
                            <svg viewBox="0 0 200 200" class="w-full h-full">
                                <g>
                                    <path
                                        d="M150 150 L150 110 L180 150 Z"
                                        fill="#fbbf24"
                                        stroke="#d97706"
                                        stroke-width="2"
                                    />
                                </g>
                                <g>
                                    <path
                                        d="M60 40 L100 40 L60 70 Z"
                                        fill="#fb7185"
                                        stroke="#e11d48"
                                        stroke-width="2"
                                    />
                                </g>
                                <g>
                                    <path
                                        d="M140 60 L140 100 L110 100 Z"
                                        fill="#60a5fa"
                                        stroke="#2563eb"
                                        stroke-width="2"
                                    />
                                </g>
                                <g>
                                    <path
                                        d="M60 140 L100 140 L60 110 Z"
                                        fill="#34d399"
                                        stroke="#059669"
                                        stroke-width="2"
                                    />
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div
                        v-if="ui.step >= 3"
                        class="w-full mt-6 min-h-[200px] flex flex-col items-center justify-center"
                    >
                        <div
                            v-if="ui.step === 3"
                            class="w-full flex flex-col items-center gap-4"
                            v-motion
                            :initial="{ opacity: 0, y: 20 }"
                            :enter="{ opacity: 1, y: 0 }"
                        >
                            <div
                                class="text-xs font-bold text-zinc-400 uppercase tracking-widest"
                            >
                                Persamaan Luas
                            </div>
                            <div
                                class="flex items-center gap-3 text-xl sm:text-2xl font-recoleta text-zinc-800"
                            >
                                <div class="flex flex-col items-center">
                                    <span class="font-serif italic"
                                        >(a + b)²</span
                                    ><span
                                        class="text-[10px] text-zinc-400 font-sans mt-1"
                                        >Total Luas</span
                                    >
                                </div>
                                <span class="text-zinc-300">=</span>
                                <div class="flex items-center gap-2">
                                    <div class="flex flex-col items-center">
                                        <span
                                            class="text-emerald-600 font-serif italic font-bold"
                                            >c²</span
                                        ><span
                                            class="text-[10px] text-emerald-200 font-sans mt-1"
                                            >Persegi Kecil</span
                                        >
                                    </div>
                                    <span>+</span>
                                    <div class="flex flex-col items-center">
                                        <span
                                            ><span
                                                class="text-rose-500 font-bold"
                                                >4</span
                                            ><span
                                                class="font-serif italic text-zinc-500"
                                                >(½ab)</span
                                            ></span
                                        ><span
                                            class="text-[10px] text-rose-200 font-sans mt-1"
                                            >4 Segitiga</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            v-if="ui.step === 4"
                            class="w-full flex flex-col items-center gap-2"
                            v-motion
                            :initial="{ opacity: 0 }"
                            :enter="{ opacity: 1 }"
                        >
                            <div
                                class="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2"
                            >
                                Penyederhanaan
                            </div>
                            <div
                                class="text-lg text-zinc-500 font-serif italic mb-2 opacity-50"
                            >
                                (a² + 2ab + b²) = c² + 2ab
                            </div>
                            <div class="text-zinc-300 text-xl mb-2">↓</div>
                            <div
                                class="text-xl sm:text-2xl font-recoleta text-zinc-800 flex items-center gap-2"
                            >
                                <span class="font-serif italic">a²</span
                                ><span>+</span>
                                <div class="relative text-rose-400">
                                    <span class="font-serif italic">2ab</span
                                    ><svg
                                        class="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                                    >
                                        <line
                                            x1="-10%"
                                            y1="90%"
                                            x2="110%"
                                            y2="10%"
                                            stroke="currentColor"
                                            stroke-width="3"
                                            class="animate-draw"
                                        />
                                    </svg>
                                </div>
                                <span>+</span
                                ><span class="font-serif italic">b²</span
                                ><span class="mx-2">=</span
                                ><span
                                    class="font-serif italic text-emerald-600"
                                    >c²</span
                                ><span>+</span>
                                <div class="relative text-rose-400">
                                    <span class="font-serif italic">2ab</span
                                    ><svg
                                        class="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                                    >
                                        <line
                                            x1="-10%"
                                            y1="90%"
                                            x2="110%"
                                            y2="10%"
                                            stroke="currentColor"
                                            stroke-width="3"
                                            class="animate-draw delay-300"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p
                                class="text-xs text-zinc-400 mt-4 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100"
                            >
                                Coret
                                <span class="font-serif italic text-rose-400"
                                    >2ab</span
                                >
                                dari kedua sisi
                            </p>
                        </div>

                        <div
                            v-if="ui.step === 5"
                            class="w-full flex flex-col items-center"
                            v-motion
                            :initial="{ opacity: 0, scale: 0.8 }"
                            :enter="{
                                opacity: 1,
                                scale: 1,
                                transition: { type: 'spring', stiffness: 100 },
                            }"
                        >
                            <div
                                class="relative px-10 py-6 flex flex-col items-center"
                            >
                                <span
                                    class="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600 uppercase tracking-widest mb-1"
                                    >Teorema Pythagoras</span
                                >
                                <div
                                    class="text-4xl sm:text-5xl font-bold font-recoleta tracking-wide text-slate-800 mt-2"
                                >
                                    <span class="font-serif italic">a</span>² +
                                    <span class="font-serif italic">b</span>² =
                                    <span
                                        class="font-serif italic text-emerald-600"
                                        >c</span
                                    >²
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-white/90 backdrop-blur-xl border border-zinc-200/60 rounded-full z-50"
            >
                <div
                    class="relative flex items-center justify-between px-2 h-16"
                >
                    <Button
                        v-if="ui.step > 0"
                        @click="nav(-1)"
                        variant="text"
                        rounded
                        class="!p-0 w-12 h-12 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors z-10"
                    >
                        <i-lucide-arrow-left class="w-6 h-6" />
                    </Button>
                    <div v-else class="w-12" />

                    <div
                        class="absolute left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none"
                    >
                        <div
                            v-for="(_s, i) in steps"
                            :key="i"
                            class="rounded-full transition-all duration-500"
                            :class="
                                ui.step === i
                                    ? 'w-8 h-2 bg-emerald-500'
                                    : 'w-2 h-2 bg-emerald-200'
                            "
                        />
                    </div>

                    <Button
                        @click="nav(1)"
                        variant="text"
                        rounded
                        :disabled="ui.step === 1 && !isComplete"
                        class="flex items-center gap-2 text-emerald-600 font-bold hover:bg-emerald-50 hover:text-emerald-700 px-4 py-2 transition-all z-10"
                        :class="
                            ui.step === 1 && !isComplete
                                ? 'text-zinc-300 opacity-50 cursor-not-allowed'
                                : ''
                        "
                    >
                        <span>{{
                            ui.step === steps.length - 1 ? "Selesai" : "Lanjut"
                        }}</span>
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
.animate-draw {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: draw 0.6s ease-out forwards;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.delay-300 {
    animation-delay: 0.3s;
}
@keyframes draw {
    to {
        stroke-dashoffset: 0;
    }
}
</style>
