<script setup lang="ts">
import { useDocument } from "vuefire";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useQuizStore } from "@/stores/quiz";
import type { Quiz, Difficulty } from "@/types/models";
import mascotImg from "@/assets/image/mascot.png";

const router = useRouter();
const store = useQuizStore();
const quizDoc = useDocument<Quiz>(doc(db, "quizzes", "quiz-pythagoras-1"));

const ui = reactive({ intro: true, selecting: true });
const levels = [
    {
        id: "easy",
        label: "Mudah",
        theme: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
        icon: "sprout",
    },
    {
        id: "medium",
        label: "Sedang",
        theme: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
        icon: "flame",
    },
    {
        id: "hard",
        label: "Sulit",
        theme: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200",
        icon: "zap",
    },
] as const;

watch(quizDoc, (doc) => doc && store.loadQuizBank(doc), { immediate: true });

const curr = computed(() => store.currentQuestion);
const userAnswer = computed(() =>
    curr.value ? store.getUserAnswer(curr.value.id) : null,
);
const progress = computed(
    () => ((store.currentQuestionIndex + 1) / store.totalQuestions) * 100,
);

const resultText = computed(() => {
    const s = store.score;
    if (s >= 80)
        return {
            title: "Luar Biasa!",
            desc: "Kamu sudah sangat menguasai materi ini.",
        };
    if (s >= 60)
        return {
            title: "Kerja Bagus!",
            desc: "Sedikit lagi, kamu pasti bisa sempurna!",
        };
    return {
        title: "Coba Lagi Yuk!",
        desc: "Jangan menyerah, pelajari materi lagi ya!",
    };
});

const start = (lvl: Difficulty) => {
    store.startQuizSession(lvl);
    store.totalQuestions > 0
        ? (ui.selecting = false)
        : alert("Level ini belum tersedia.");
};

const answer = (txt: string) =>
    curr.value && store.selectAnswer(curr.value.id, txt);
const reset = () => (ui.selecting = true);
const home = () => router.push({ name: "home" });
</script>

<template>
    <SectionIntro
        v-if="ui.intro"
        title="Kuis Interaktif"
        description="Siap menguji kemampuanmu? Pilih level tantangan dan buktikan keahlian Pythagoras-mu!"
        buttonText="Siap, Mulai!"
        variant="violet"
        @start="ui.intro = false"
    />

    <div
        v-else
        class="min-h-screen flex flex-col items-center justify-center w-full bg-[#FDFBFF] overflow-hidden relative font-sans text-slate-900"
    >
        <div class="fixed inset-0 pointer-events-none">
            <div
                class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-violet-200/30 blur-3xl"
            />
            <div
                class="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-200/20 blur-3xl"
            />
            <div
                class="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 blur-3xl"
            />
        </div>

        <div class="relative z-10 w-full max-w-sm flex flex-col min-h-screen">
            <div class="flex-1 flex flex-col items-center pb-32 pt-8 px-6">
                <div class="w-full flex justify-start mb-4">
                    <Button
                        @click="home"
                        variant="text"
                        rounded
                        class="!p-2 !px-3 flex items-center gap-2 text-zinc-900! hover:text-violet-600 hover:bg-violet-50 transition-colors text-sm font-bold"
                    >
                        <i-lucide-arrow-left class="w-4 h-4" /> Home
                    </Button>
                </div>

                <div
                    v-if="!store.quizBank"
                    class="flex-1 flex flex-col justify-center items-center w-full"
                >
                    <div
                        class="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4"
                    />
                    <p class="text-slate-500">Memuat Data...</p>
                </div>

                <div
                    v-else-if="ui.selecting"
                    class="w-full flex flex-col items-center"
                >
                    <div
                        class="text-[10px] font-bold text-violet-600 tracking-widest uppercase mb-3 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100"
                        v-motion
                        :initial="{ opacity: 0, y: -10 }"
                        :enter="{
                            opacity: 1,
                            y: 0,
                            transition: { delay: 100 },
                        }"
                    >
                        Pilih Kesulitan
                    </div>

                    <h1
                        class="font-recoleta text-4xl font-bold text-slate-800 mb-2 text-center"
                    >
                        Level Kuis
                    </h1>
                    <p class="text-slate-500 mb-12 text-center">
                        Seberapa siap kamu?
                    </p>

                    <div class="w-full space-y-4">
                        <button
                            v-for="lvl in levels"
                            :key="lvl.id"
                            @click="start(lvl.id)"
                            class="w-full p-6 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 group hover:-translate-y-1"
                            :class="lvl.theme"
                        >
                            <div class="text-3xl">
                                <i-lucide-sprout
                                    v-if="lvl.icon === 'sprout'"
                                    class="w-8 h-8"
                                />
                                <i-lucide-flame
                                    v-if="lvl.icon === 'flame'"
                                    class="w-8 h-8"
                                />
                                <i-lucide-zap
                                    v-if="lvl.icon === 'zap'"
                                    class="w-8 h-8"
                                />
                            </div>
                            <div class="text-left">
                                <h3 class="font-recoleta text-xl font-bold">
                                    {{ lvl.label }}
                                </h3>
                                <p
                                    class="text-xs opacity-80 uppercase tracking-wider font-bold"
                                >
                                    Mulai Kuis
                                </p>
                            </div>
                            <i-lucide-arrow-right
                                class="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                            />
                        </button>
                    </div>
                </div>

                <div v-else-if="!store.quizCompleted" class="w-full">
                    <div
                        class="text-[10px] font-bold text-violet-600 tracking-widest uppercase mb-3 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100 w-fit mx-auto"
                    >
                        Kuis Interaktif
                    </div>

                    <h1
                        class="font-recoleta text-3xl font-bold text-slate-800 text-center mb-6"
                    >
                        Pertanyaan {{ store.currentQuestionIndex + 1 }}
                    </h1>

                    <div
                        class="flex justify-center mb-8 w-full min-h-[104px] items-center"
                    >
                        <PytaSpeech
                            text="Pilih jawaban yang menurutmu benar, lalu tekan lanjut!"
                            variant="violet"
                            v-motion
                            :initial="{ opacity: 0, scale: 0.9 }"
                            :enter="{ opacity: 1, scale: 1 }"
                        />
                    </div>

                    <div
                        class="w-full bg-white border border-zinc-200 rounded-lg overflow-hidden"
                    >
                        <div
                            v-if="curr?.imageUrl"
                            class="bg-slate-50/50 border-b border-slate-100 p-4 flex justify-center min-h-[180px]"
                        >
                            <img
                                :src="curr.imageUrl"
                                class="w-full h-full object-contain max-h-[200px] mx-auto"
                            />
                        </div>
                        <div class="p-6 pb-4">
                            <h2
                                class="font-recoleta text-xl text-slate-800 leading-relaxed font-bold"
                            >
                                {{ curr?.text }}
                            </h2>
                        </div>
                        <div class="p-6 pt-0 space-y-3">
                            <button
                                v-for="(opt, idx) in curr?.options"
                                :key="idx"
                                @click="answer(opt.text)"
                                class="w-full text-left px-4 py-3.5 rounded-lg border transition-all duration-200 relative flex items-center gap-4"
                                :class="
                                    userAnswer === opt.text
                                        ? 'bg-violet-50 border-violet-500'
                                        : 'bg-white border-zinc-200 hover:border-violet-200'
                                "
                            >
                                <div
                                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                                    :class="
                                        userAnswer === opt.text
                                            ? 'border-violet-500 bg-violet-500'
                                            : 'border-slate-300'
                                    "
                                >
                                    <div
                                        v-if="userAnswer === opt.text"
                                        class="w-1.5 h-1.5 bg-white rounded-full"
                                    />
                                </div>
                                <span
                                    class="text-sm font-medium text-slate-700 leading-snug"
                                    >{{ opt.text }}</span
                                >
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    v-else
                    class="w-full flex flex-col items-center text-center pt-8"
                >
                    <div
                        class="mb-6"
                        v-motion
                        :initial="{ scale: 0 }"
                        :enter="{ scale: 1, transition: { type: 'spring' } }"
                    >
                        <div class="relative inline-block">
                            <img
                                :src="mascotImg"
                                class="w-32 h-32 object-contain drop-shadow-xl"
                            />
                            <div
                                class="absolute -bottom-2 -right-2 bg-violet-600 text-white font-recoleta font-bold text-xl px-4 py-1 rounded-full border-2 border-white shadow-md rotate-3"
                            >
                                {{ store.score }}%
                            </div>
                        </div>
                    </div>
                    <h1 class="font-recoleta text-4xl text-slate-800 mb-2">
                        {{ resultText.title }}
                    </h1>
                    <p class="text-slate-500 mb-10 px-8 leading-relaxed">
                        {{ resultText.desc }}
                    </p>

                    <div class="flex flex-col w-full gap-3 px-6">
                        <Button
                            @click="reset"
                            label="Main Lagi / Ganti Level"
                            class="w-full! rounded-full! bg-violet-600! border-violet-600! font-bold! py-3! text-white!"
                        />
                        <Button
                            @click="home"
                            label="Home"
                            variant="outlined"
                            class="w-full! rounded-full! text-violet-600! border-violet-200! font-bold! py-3!"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="!ui.selecting && !store.quizCompleted"
                class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-white/90 backdrop-blur-xl border border-violet-200/60 rounded-full z-50"
            >
                <div
                    class="relative flex items-center justify-between px-2 h-16"
                >
                    <Button
                        @click="store.previousQuestion()"
                        variant="text"
                        rounded
                        :disabled="store.currentQuestionIndex === 0"
                        class="!p-0 w-12 h-12 flex items-center justify-center z-10 transition-colors"
                        :class="
                            store.currentQuestionIndex === 0
                                ? '!text-slate-200'
                                : '!text-slate-400 hover:!bg-violet-50 hover:!text-violet-600'
                        "
                    >
                        <i-lucide-arrow-left class="w-6 h-6" />
                    </Button>

                    <div
                        class="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none w-24"
                    >
                        <span
                            class="text-[10px] font-bold text-violet-400 tracking-widest uppercase"
                        >
                            {{ store.currentQuestionIndex + 1 }} /
                            {{ store.totalQuestions }}
                        </span>
                        <div
                            class="w-full h-1 bg-slate-100 rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-violet-500 transition-all duration-500 ease-out rounded-full"
                                :style="{ width: `${progress}%` }"
                            />
                        </div>
                    </div>

                    <Button
                        @click="store.nextQuestion()"
                        variant="text"
                        rounded
                        :disabled="!userAnswer"
                        class="flex items-center gap-2 font-bold px-4 py-2 transition-colors z-10"
                        :class="
                            !userAnswer
                                ? '!text-slate-300'
                                : '!text-zinc-900 hover:!bg-zinc-50'
                        "
                    >
                        <span>{{
                            store.currentQuestionIndex ===
                            store.totalQuestions - 1
                                ? "Selesai"
                                : "Lanjut"
                        }}</span>
                        <i-lucide-arrow-right class="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
