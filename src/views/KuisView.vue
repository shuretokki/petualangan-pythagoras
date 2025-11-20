<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "@/stores/quiz";
import { useDocument } from "vuefire";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";
import type { Quiz, Difficulty } from "@/types/models";
import Button from "primevue/button";
import PytaSpeech from "../components/PytaSpeech.vue";

const router = useRouter();
const quizStore = useQuizStore();
const quizDoc = useDocument<Quiz>(doc(db, "quizzes", "quiz-pythagoras-1"));

watch(
    quizDoc,
    (newDoc) => {
        if (newDoc) quizStore.loadQuizBank(newDoc);
    },
    { immediate: true },
);

const isSelectingLevel = ref(true);
const levels: { id: Difficulty; label: string; color: string }[] = [
    {
        id: "easy",
        label: "Mudah",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200",
    },
    {
        id: "medium",
        label: "Sedang",
        color: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200",
    },
    {
        id: "hard",
        label: "Sulit",
        color: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200",
    },
];

const currentQuestion = computed(() => quizStore.currentQuestion);
const selectedAnswer = computed(() =>
    currentQuestion.value
        ? quizStore.getUserAnswer(currentQuestion.value.id)
        : null,
);

const startLevel = (level: Difficulty) => {
    quizStore.startQuizSession(level);
    if (quizStore.totalQuestions === 0) {
        alert("Maaf, belum ada soal untuk level ini.");
        return;
    }
    isSelectingLevel.value = false;
};

const selectAnswer = (answer: string) => {
    if (currentQuestion.value)
        quizStore.selectAnswer(currentQuestion.value.id, answer);
};
const handleNext = () => quizStore.nextQuestion();
const handlePrevious = () => quizStore.previousQuestion();
const restartQuiz = () => {
    isSelectingLevel.value = true;
};
const goHome = () => {
    router.push({ name: "home" });
};
</script>

<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center w-full bg-[#FDFBFF] overflow-hidden relative"
    >
        <div class="fixed inset-0 pointer-events-none">
            <div
                class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-violet-200/30 blur-3xl"
            ></div>
            <div
                class="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-200/20 blur-3xl"
            ></div>
            <div
                class="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 blur-3xl"
            ></div>
        </div>

        <div class="relative z-10 w-full max-w-sm flex flex-col min-h-screen">
            <div class="flex-1 flex flex-col items-center pb-32 pt-8 px-6">
                <div
                    v-if="!quizStore.quizBank"
                    class="flex-1 flex flex-col justify-center items-center"
                >
                    <div
                        class="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4"
                    ></div>
                    <p class="text-slate-500">Memuat Data...</p>
                </div>

                <div
                    v-else-if="isSelectingLevel"
                    class="w-full flex flex-col items-center pt-12"
                >
                    <h1
                        class="font-recoleta text-4xl font-bold text-slate-800 mb-2"
                    >
                        Pilih Level
                    </h1>
                    <p class="text-slate-500 mb-12">Seberapa siap kamu?</p>

                    <div class="w-full space-y-4">
                        <button
                            v-for="lvl in levels"
                            :key="lvl.id"
                            @click="startLevel(lvl.id)"
                            class="w-full p-6 rounded-3xl border-2 transition-all duration-200 flex items-center gap-4 group hover:-translate-y-1 hover:shadow-lg"
                            :class="lvl.color"
                        >
                            <div class="text-3xl">
                                <svg
                                    v-if="lvl.id === 'easy'"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
                                    />
                                    <path d="M12 14v2" />
                                    <path d="M12 8v2" />
                                    <path d="m4.93 4.93 1.41 1.41" />
                                    <path d="m17.66 17.66 1.41 1.41" />
                                    <path d="M2 12h2" />
                                    <path d="M20 12h2" />
                                    <path d="m6.34 17.66-1.41 1.41" />
                                    <path d="m19.07 4.93-1.41 1.41" />
                                </svg>
                                <svg
                                    v-if="lvl.id === 'medium'"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <rect
                                        width="18"
                                        height="18"
                                        x="3"
                                        y="3"
                                        rx="2"
                                    />
                                    <path d="M3 9h18" />
                                    <path d="M9 21V9" />
                                </svg>
                                <svg
                                    v-if="lvl.id === 'hard'"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <polygon
                                        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                                    />
                                </svg>
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
                            <div class="flex-1 text-right">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>

                <div v-else-if="!quizStore.quizCompleted" class="w-full">
                    <div class="text-center mb-6">
                        <h1
                            class="font-recoleta text-3xl font-bold text-slate-800"
                        >
                            Kuis Pythagoras
                        </h1>
                    </div>
                    <div
                        class="flex justify-center mb-8 w-full min-h-[80px] items-center"
                    >
                        <PytaSpeech
                            text="Pilih jawaban yang menurutmu benar, lalu tekan lanjut!"
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
                    <div class="w-full space-y-4">
                        <div
                            v-if="currentQuestion?.imageUrl"
                            class="w-full rounded-2xl overflow-hidden shadow-sm border border-violet-100 bg-white"
                        >
                            <img
                                :src="currentQuestion.imageUrl"
                                class="w-full h-auto object-cover max-h-[200px]"
                                alt="Soal Image"
                            />
                        </div>
                        <div
                            class="w-full bg-white/60 border-l-4 border-violet-400 pl-5 pr-4 py-4 rounded-r-2xl backdrop-blur-sm"
                        >
                            <h2
                                class="font-recoleta text-xl text-slate-800 leading-relaxed"
                            >
                                {{ currentQuestion?.text }}
                            </h2>
                        </div>
                        <div class="space-y-3">
                            <button
                                v-for="(
                                    option, index
                                ) in currentQuestion?.options"
                                :key="index"
                                @click="selectAnswer(option.text)"
                                class="w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 relative overflow-hidden"
                                :class="
                                    selectedAnswer === option.text
                                        ? 'bg-violet-50 border-violet-400'
                                        : 'bg-white/80 border-white hover:border-violet-200'
                                "
                            >
                                <div
                                    class="flex items-center gap-4 relative z-10"
                                >
                                    <div
                                        class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
                                        :class="
                                            selectedAnswer === option.text
                                                ? 'border-violet-500 bg-violet-500'
                                                : 'border-slate-300'
                                        "
                                    >
                                        <div
                                            v-if="
                                                selectedAnswer === option.text
                                            "
                                            class="w-2 h-2 bg-white rounded-full"
                                        ></div>
                                    </div>
                                    <span
                                        class="text-base font-medium text-slate-700"
                                        >{{ option.text }}</span
                                    >
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    v-else
                    class="w-full flex flex-col items-center text-center pt-8"
                >
                    <div class="mb-4 text-violet-600 animate-bounce">
                        <svg
                            v-if="quizStore.score >= 80"
                            xmlns="http://www.w3.org/2000/svg"
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                            <path d="M4 22h16" />
                            <path
                                d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
                            />
                            <path
                                d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
                            />
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                        </svg>
                        <svg
                            v-else-if="quizStore.score >= 60"
                            xmlns="http://www.w3.org/2000/svg"
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M7 10v12" />
                            <path
                                d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"
                            />
                        </svg>
                        <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                        </svg>
                    </div>
                    <h1 class="font-recoleta text-4xl text-slate-800 mb-2">
                        Selesai!
                    </h1>
                    <div class="mt-8 mb-8">
                        <div
                            class="inline-block px-10 py-6 bg-white border-4 border-violet-100 rounded-[2rem]"
                        >
                            <span
                                class="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2 block"
                                >Skor Kamu</span
                            >
                            <div
                                class="font-recoleta text-6xl text-violet-600 font-bold tracking-tight"
                            >
                                {{ quizStore.score }}%
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col w-full gap-3 px-6">
                        <Button
                            @click="restartQuiz"
                            label="Main Lagi / Ganti Level"
                            class="!w-full !rounded-full !bg-violet-600 !border-violet-600 !font-bold !py-3 !text-white"
                        /><Button
                            @click="goHome"
                            label="Home"
                            variant="outlined"
                            class="!w-full !rounded-full !text-violet-600 !border-violet-200 !font-bold !py-3"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="!isSelectingLevel && !quizStore.quizCompleted"
                class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px] bg-white/90 backdrop-blur-xl border border-violet-200/60 rounded-full z-50"
            >
                <div
                    class="relative flex items-center justify-between px-2 h-16"
                >
                    <Button
                        @click="handlePrevious"
                        variant="text"
                        :disabled="quizStore.currentQuestionIndex === 0"
                        class="!p-0 w-12 h-12 flex items-center justify-center rounded-full transition-colors z-10"
                        :class="
                            quizStore.currentQuestionIndex === 0
                                ? '!text-slate-200'
                                : '!text-slate-400 hover:!bg-violet-50'
                        "
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
                        class="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none w-24"
                    >
                        <span
                            class="text-[10px] font-bold text-violet-400 tracking-widest uppercase"
                            >{{ quizStore.currentQuestionIndex + 1 }} /
                            {{ quizStore.totalQuestions }}</span
                        >
                        <div
                            class="w-full h-1 bg-slate-100 rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-violet-500 transition-all duration-500 ease-out rounded-full"
                                :style="{
                                    width: `${((quizStore.currentQuestionIndex + 1) / quizStore.totalQuestions) * 100}%`,
                                }"
                            ></div>
                        </div>
                    </div>
                    <Button
                        @click="handleNext"
                        variant="text"
                        :disabled="!selectedAnswer"
                        class="flex items-center gap-2 font-bold px-4 py-2 rounded-full transition-colors z-10"
                        :class="
                            !selectedAnswer
                                ? '!text-slate-300'
                                : '!text-zinc-900 hover:!bg-zinc-50'
                        "
                    >
                        <span>{{
                            quizStore.currentQuestionIndex ===
                            quizStore.totalQuestions - 1
                                ? "Selesai"
                                : "Lanjut"
                        }}</span>
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
