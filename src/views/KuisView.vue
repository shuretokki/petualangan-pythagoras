<script setup lang="ts">
import { useDocument } from "vuefire";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";
import type { Quiz, Difficulty } from "@/types/models";
import mascotImg from "@/assets/image/mascot.png";

const router = useRouter();
const store = useQuizStore();
const quizDoc = useDocument<Quiz>(doc(db, "quizzes", "quiz-pythagoras-1"));

// Added 'review' state to toggle the review screen
const ui = reactive({ intro: true, selecting: true, review: false });

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

// Reset now also resets the review state
const reset = () => {
    ui.selecting = true;
    ui.review = false;
};

const home = () => router.push({ name: "home" });

// Helper to check if an answer is correct for the review loop
const isCorrect = (qId: string, correctAns: string) => {
    return store.getUserAnswer(qId) === correctAns;
};
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
        class="fixed inset-0 bg-zinc-50 font-sans text-slate-900 flex justify-center overflow-hidden"
    >
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
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

        <div
            class="w-full max-w-md h-full shadow-sm flex flex-col relative bg-[#FDFBFF]"
        >
            <div class="flex-none z-20 w-full flex justify-start pt-8 px-6">
                <Button
                    @click="ui.review ? (ui.review = false) : home()"
                    variant="text"
                    rounded
                    class="!p-2 !px-3 flex items-center gap-2 text-zinc-900! hover:text-violet-600 hover:bg-violet-50 transition-colors text-sm font-bold"
                >
                    <i-lucide-arrow-left class="w-6 h-6" />
                    {{ ui.review ? "Kembali ke Skor" : "Home" }}
                </Button>
            </div>

            <div
                class="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-6 pb-24"
            >
                <div class="flex flex-col items-center pt-4">
                    <div
                        v-if="!store.quizBank"
                        class="flex flex-col justify-center items-center w-full h-64"
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
                            v-if="!ui.review"
                            class="w-full flex flex-col items-center"
                        >
                            <div
                                class="mb-6"
                                v-motion
                                :initial="{ scale: 0 }"
                                :enter="{
                                    scale: 1,
                                    transition: { type: 'spring' },
                                }"
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
                            <h1
                                class="font-recoleta text-4xl text-slate-800 mb-2"
                            >
                                {{ resultText.title }}
                            </h1>
                            <p
                                class="text-slate-500 mb-10 px-8 leading-relaxed"
                            >
                                {{ resultText.desc }}
                            </p>

                            <div class="flex flex-col w-full gap-3 px-6">
                                <Button
                                    @click="ui.review = true"
                                    label="Lihat Pembahasan"
                                    class="!w-full !rounded-full !bg-white !text-violet-600 !border !border-violet-200 !font-bold !py-3 hover:!bg-violet-50"
                                />
                                <Button
                                    @click="reset"
                                    label="Main Lagi / Ganti Level"
                                    class="!w-full !rounded-full !bg-violet-600 !border-violet-600 !font-bold !py-3 !text-white"
                                />
                                <Button
                                    @click="home"
                                    label="Home"
                                    variant="text"
                                    class="!w-full !rounded-full !text-slate-400 !font-bold !py-3 hover:!bg-slate-50"
                                />
                            </div>
                        </div>

                        <div v-else class="w-full text-left animate-fade-in">
                            <h2
                                class="font-recoleta text-2xl text-slate-800 mb-1 px-2"
                            >
                                Pembahasan
                            </h2>
                            <p class="text-slate-500 text-sm mb-6 px-2">
                                Review jawaban kamu di bawah ini
                            </p>

                            <div class="space-y-6">
                                <div
                                    v-for="(q, idx) in store.activeQuestions"
                                    :key="q.id"
                                    class="bg-white rounded-xl border border-slate-200 overflow-hidden"
                                >
                                    <div
                                        class="bg-slate-50 p-4 border-b border-slate-100 flex gap-3"
                                    >
                                        <span
                                            class="flex-none w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                                            :class="
                                                isCorrect(q.id, q.correctAnswer)
                                                    ? 'bg-emerald-100 text-emerald-600'
                                                    : 'bg-rose-100 text-rose-600'
                                            "
                                        >
                                            {{ idx + 1 }}
                                        </span>
                                        <p
                                            class="text-slate-800 font-medium leading-relaxed text-sm"
                                        >
                                            {{ q.text }}
                                        </p>
                                    </div>

                                    <div
                                        v-if="q.imageUrl"
                                        class="p-4 bg-white flex justify-center border-b border-slate-50"
                                    >
                                        <img
                                            :src="q.imageUrl"
                                            class="max-h-[120px] object-contain rounded"
                                        />
                                    </div>

                                    <div class="p-4 space-y-3">
                                        <div class="text-sm">
                                            <span
                                                class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1"
                                                >Jawaban Kamu:</span
                                            >
                                            <div
                                                class="flex items-center gap-2 font-bold"
                                                :class="
                                                    isCorrect(
                                                        q.id,
                                                        q.correctAnswer,
                                                    )
                                                        ? 'text-emerald-600'
                                                        : 'text-rose-600'
                                                "
                                            >
                                                <i-lucide-check-circle
                                                    v-if="
                                                        isCorrect(
                                                            q.id,
                                                            q.correctAnswer,
                                                        )
                                                    "
                                                    class="w-4 h-4"
                                                />
                                                <i-lucide-x-circle
                                                    v-else
                                                    class="w-4 h-4"
                                                />
                                                {{ store.getUserAnswer(q.id) }}
                                            </div>
                                        </div>

                                        <div
                                            v-if="
                                                !isCorrect(
                                                    q.id,
                                                    q.correctAnswer,
                                                )
                                            "
                                            class="pt-2 border-t border-slate-100"
                                        >
                                            <span
                                                class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1"
                                                >Jawaban Benar:</span
                                            >
                                            <div
                                                class="flex items-center gap-2 font-bold text-emerald-600"
                                            >
                                                <i-lucide-check
                                                    class="w-4 h-4"
                                                />
                                                {{ q.correctAnswer }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-8 mb-4">
                                <Button
                                    @click="ui.review = false"
                                    label="Tutup Pembahasan"
                                    class="!w-full !rounded-full !bg-slate-100 !text-slate-600 !font-bold !py-3 hover:!bg-slate-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="!ui.selecting && !store.quizCompleted"
                class="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-white/90 backdrop-blur-xl border border-violet-200/60 rounded-full z-50"
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
                                : '!text-zinc-900 hover:!bg-violet-50 hover:!text-violet-600'
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
