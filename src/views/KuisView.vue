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
import SectionIntro from "../components/SectionIntro.vue";
import mascotImg from "@/assets/image/mascot.png";

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

const showIntro = ref(true);
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
    <SectionIntro
        v-if="showIntro"
        title="Kuis Pythagoras"
        description="Waktunya menguji kemampuanmu! Pilih level dan kerjakan soal sebaik mungkin."
        buttonText="Siap, Mulai!"
        variant="violet"
        @start="showIntro = false"
    />

    <div
        v-else
        class="min-h-screen flex flex-col items-center justify-center w-full bg-[#FDFBFF] overflow-hidden relative font-sans text-slate-900"
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
                            class="w-full p-6 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 group hover:-translate-y-1"
                            :class="lvl.color"
                        >
                            <div class="text-3xl">
                                <i-lucide-sprout
                                    v-if="lvl.id === 'easy'"
                                    class="w-8 h-8"
                                />
                                <i-lucide-flame
                                    v-if="lvl.id === 'medium'"
                                    class="w-8 h-8"
                                />
                                <i-lucide-zap
                                    v-if="lvl.id === 'hard'"
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
                            <div class="flex-1 text-right">
                                <i-lucide-arrow-right
                                    class="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                                />
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

                    <div
                        class="w-full bg-white border border-zinc-200 rounded-lg overflow-hidden"
                    >
                        <div
                            v-if="currentQuestion?.imageUrl"
                            class="bg-slate-50/50 border-b border-slate-100 p-4 flex justify-center min-h-[180px]"
                        >
                            <img
                                :src="currentQuestion.imageUrl"
                                class="w-full h-full object-contain max-h-[200px] mx-auto"
                                alt="Soal Image"
                            />
                        </div>
                        <div class="p-6 pb-4">
                            <h2
                                class="font-recoleta text-xl text-slate-800 leading-relaxed font-bold"
                            >
                                {{ currentQuestion?.text }}
                            </h2>
                        </div>
                        <div class="p-6 pt-0 space-y-3">
                            <button
                                v-for="(
                                    option, index
                                ) in currentQuestion?.options"
                                :key="index"
                                @click="selectAnswer(option.text)"
                                class="w-full text-left px-4 py-3.5 rounded-lg border transition-all duration-200 relative flex items-center gap-4"
                                :class="
                                    selectedAnswer === option.text
                                        ? 'bg-violet-50 border-violet-500'
                                        : 'bg-white border-zinc-200 hover:border-violet-200'
                                "
                            >
                                <div
                                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                                    :class="
                                        selectedAnswer === option.text
                                            ? 'border-violet-500 bg-violet-500'
                                            : 'border-slate-300'
                                    "
                                >
                                    <div
                                        v-if="selectedAnswer === option.text"
                                        class="w-1.5 h-1.5 bg-white rounded-full"
                                    ></div>
                                </div>
                                <span
                                    class="text-sm font-medium text-slate-700 leading-snug"
                                    >{{ option.text }}</span
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
                                {{ quizStore.score }}%
                            </div>
                        </div>
                    </div>
                    <h1 class="font-recoleta text-4xl text-slate-800 mb-2">
                        {{
                            quizStore.score >= 80
                                ? "Luar Biasa!"
                                : quizStore.score >= 60
                                  ? "Kerja Bagus!"
                                  : "Coba Lagi Yuk!"
                        }}
                    </h1>
                    <p class="text-slate-500 mb-10 px-8 leading-relaxed">
                        {{
                            quizStore.score >= 80
                                ? "Kamu sudah sangat menguasai materi ini."
                                : "Jangan menyerah, pelajari materi lagi dan coba lagi!"
                        }}
                    </p>
                    <div class="flex flex-col w-full gap-3 px-6">
                        <Button
                            @click="restartQuiz"
                            label="Main Lagi / Ganti Level"
                            class="!w-full !rounded-lg !bg-violet-600 !border-violet-600 !font-bold !py-3 !text-white"
                        /><Button
                            @click="goHome"
                            label="Home"
                            variant="outlined"
                            class="!w-full !rounded-lg !text-violet-600 !border-violet-200 !font-bold !py-3"
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
                        rounded
                        :disabled="quizStore.currentQuestionIndex === 0"
                        class="!p-0 w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors z-10"
                        :class="
                            quizStore.currentQuestionIndex === 0
                                ? '!text-slate-200'
                                : '!text-slate-400 hover:!bg-violet-50'
                        "
                    >
                        <i-lucide-arrow-left class="w-6 h-6" />
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
                        rounded
                        :disabled="!selectedAnswer"
                        class="flex items-center gap-2 text-zinc-900 font-bold hover:bg-zinc-50 px-4 py-2 transition-colors z-10"
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
                        <i-lucide-arrow-right class="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
