<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import RadioButton from "primevue/radiobutton";
import type { Quiz, Question, Difficulty } from "@/types/models";

// --- STATE ---
const MAIN_QUIZ_ID = "quiz-pythagoras-1";

const activeQuiz = ref<Quiz | null>(null);
const isLoading = ref(false);
const activeTab = ref<Difficulty>("easy");

// New Question Form
const defaultQuestion: Question = {
    id: "",
    text: "",
    type: "multiple-choice",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctAnswer: "",
    difficulty: "easy",
    imageUrl: "",
};

const newQuestion = ref<Question>(JSON.parse(JSON.stringify(defaultQuestion)));
const isAdding = ref(false);
const isEditing = ref(false); // Track if we are in edit mode
const correctOptionIndex = ref<number | null>(null);

// Watchers
watch(correctOptionIndex, (newIndex) => {
    if (newIndex !== null && newQuestion.value.options[newIndex]) {
        newQuestion.value.correctAnswer =
            newQuestion.value.options[newIndex].text;
    }
});

watch(
    () => newQuestion.value.options,
    (newOptions) => {
        if (
            correctOptionIndex.value !== null &&
            newOptions[correctOptionIndex.value]
        ) {
            newQuestion.value.correctAnswer =
                newOptions[correctOptionIndex.value].text;
        }
    },
    { deep: true },
);

// --- COMPUTED ---
const questionsByDifficulty = computed(() => {
    if (!activeQuiz.value?.questions) return { easy: [], medium: [], hard: [] };
    return {
        easy: activeQuiz.value.questions.filter((q) => q.difficulty === "easy"),
        medium: activeQuiz.value.questions.filter(
            (q) => q.difficulty === "medium",
        ),
        hard: activeQuiz.value.questions.filter((q) => q.difficulty === "hard"),
    };
});

const currentList = computed(() => {
    return questionsByDifficulty.value[activeTab.value] || [];
});

const difficultyStats = computed(() => {
    return [
        {
            id: "easy",
            label: "Mudah",
            count: questionsByDifficulty.value.easy.length,
            color: "bg-emerald-100 text-emerald-700",
        },
        {
            id: "medium",
            label: "Sedang",
            count: questionsByDifficulty.value.medium.length,
            color: "bg-amber-100 text-amber-700",
        },
        {
            id: "hard",
            label: "Sulit",
            count: questionsByDifficulty.value.hard.length,
            color: "bg-rose-100 text-rose-700",
        },
    ];
});

// --- ACTIONS ---

const fetchQuizBank = async () => {
    isLoading.value = true;
    try {
        const docRef = doc(db, "quizzes", MAIN_QUIZ_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            activeQuiz.value = { id: docSnap.id, ...docSnap.data() } as Quiz;
        } else {
            const newQuiz: Quiz = {
                title: "Bank Soal Pythagoras",
                questions: [],
            };
            await setDoc(docRef, newQuiz);
            activeQuiz.value = { id: MAIN_QUIZ_ID, ...newQuiz };
        }
    } catch (e) {
        console.error("Error loading quiz bank:", e);
    } finally {
        isLoading.value = false;
    }
};

const openCreateForm = () => {
    newQuestion.value = JSON.parse(JSON.stringify(defaultQuestion));
    correctOptionIndex.value = null;
    isEditing.value = false;
    isAdding.value = true;
};

const editQuestion = (q: Question) => {
    newQuestion.value = JSON.parse(JSON.stringify(q));
    // Find index of correct answer
    const idx = newQuestion.value.options.findIndex(
        (o) => o.text === q.correctAnswer,
    );
    correctOptionIndex.value = idx !== -1 ? idx : null;
    isEditing.value = true;
    isAdding.value = true;

    // Scroll to form
    window.scrollTo({ top: 200, behavior: "smooth" });
};

const saveQuestion = async () => {
    if (!activeQuiz.value) return;

    if (!newQuestion.value.text || correctOptionIndex.value === null) {
        alert("Mohon isi Pertanyaan dan pilih Jawaban Benar.");
        return;
    }

    newQuestion.value.correctAnswer =
        newQuestion.value.options[correctOptionIndex.value].text;

    if (!newQuestion.value.correctAnswer) {
        alert("Teks jawaban benar tidak boleh kosong.");
        return;
    }

    newQuestion.value.difficulty = activeTab.value;

    // Update Local State
    if (isEditing.value && newQuestion.value.id) {
        // Replace existing
        const index = activeQuiz.value.questions.findIndex(
            (q) => q.id === newQuestion.value.id,
        );
        if (index !== -1) {
            activeQuiz.value.questions[index] = { ...newQuestion.value };
        }
    } else {
        // Add New
        newQuestion.value.id = Date.now().toString();
        if (!activeQuiz.value.questions) activeQuiz.value.questions = [];
        activeQuiz.value.questions.push({ ...newQuestion.value });
    }

    try {
        await updateDoc(doc(db, "quizzes", MAIN_QUIZ_ID), {
            questions: activeQuiz.value.questions,
        });

        // Reset
        newQuestion.value = JSON.parse(JSON.stringify(defaultQuestion));
        correctOptionIndex.value = null;
        isAdding.value = false;
        isEditing.value = false;
    } catch (e) {
        console.error(e);
    }
};

const deleteQuestion = async (qId: string) => {
    if (!confirm("Hapus soal ini?")) return;
    if (!activeQuiz.value) return;

    activeQuiz.value.questions = activeQuiz.value.questions.filter(
        (q) => q.id !== qId,
    );

    try {
        await updateDoc(doc(db, "quizzes", MAIN_QUIZ_ID), {
            questions: activeQuiz.value.questions,
        });
    } catch (e) {
        console.error(e);
    }
};

onMounted(() => {
    fetchQuizBank();
});
</script>

<template>
    <div class="min-h-screen bg-[#FAFAFA] p-8 md:p-20 font-sans text-slate-900">
        <div class="max-w-4xl mx-auto space-y-12">
            <div class="text-center space-y-4">
                <h1 class="font-recoleta text-5xl font-bold text-zinc-900">
                    Admin Panel
                </h1>
                <p class="text-zinc-500">
                    Kelola bank soal untuk aplikasi Pythagoras.
                </p>
                <Button
                    label="Refresh Data"
                    text
                    rounded
                    :loading="isLoading"
                    @click="fetchQuizBank"
                    class="!text-slate-400 hover:!text-slate-800"
                >
                    <template #icon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="mr-2"
                        >
                            <path
                                d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
                            />
                            <path d="M21 3v5h-5" />
                            <path
                                d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
                            />
                            <path d="M8 16H3v5" />
                        </svg>
                    </template>
                </Button>
            </div>

            <section class="space-y-6">
                <h2
                    class="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-2 text-center"
                >
                    Pilih Tingkat Kesulitan
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div
                        v-for="stat in difficultyStats"
                        :key="stat.id"
                        @click="activeTab = stat.id as Difficulty"
                        class="cursor-pointer border rounded-2xl p-6 text-center transition-all duration-300 group hover:-translate-y-1"
                        :class="
                            activeTab === stat.id
                                ? 'bg-white border-zinc-300 shadow-lg scale-105'
                                : 'bg-zinc-50 border-transparent hover:bg-white hover:border-zinc-200'
                        "
                    >
                        <div
                            class="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 text-xl transition-transform group-hover:scale-110"
                            :class="stat.color"
                        >
                            <svg
                                v-if="stat.id === 'easy'"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
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
                                v-if="stat.id === 'medium'"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
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
                                v-if="stat.id === 'hard'"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
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
                        <h3 class="font-bold text-zinc-800">
                            {{ stat.label }}
                        </h3>
                        <p class="text-zinc-400 text-sm">
                            {{ stat.count }} Soal
                        </p>
                    </div>
                </div>
            </section>

            <section class="space-y-6">
                <div
                    class="flex items-center justify-between border-b border-zinc-200 pb-2"
                >
                    <h2
                        class="text-xs font-bold text-zinc-400 uppercase tracking-widest"
                    >
                        Daftar Soal ({{ activeTab }})
                    </h2>
                    <Button
                        :label="isAdding ? 'Batal' : 'Tambah Soal'"
                        text
                        rounded
                        @click="
                            isAdding
                                ? ((isAdding = false), (isEditing = false))
                                : openCreateForm()
                        "
                        class="!text-zinc-900 !font-bold hover:!bg-zinc-100"
                    >
                        <template #icon>
                            <svg
                                v-if="isAdding"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="mr-2"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="mr-2"
                            >
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                        </template>
                    </Button>
                </div>

                <div
                    v-if="isAdding"
                    class="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm animate-in fade-in zoom-in-95 duration-300"
                >
                    <h3
                        class="font-recoleta text-2xl font-bold text-zinc-900 mb-6 text-center"
                    >
                        {{ isEditing ? "Edit Soal" : "Buat Soal Baru" }}
                    </h3>

                    <div class="space-y-6 max-w-2xl mx-auto">
                        <div class="space-y-2">
                            <label
                                class="text-xs font-bold text-zinc-400 uppercase tracking-wider"
                                >Pertanyaan</label
                            >
                            <Textarea
                                v-model="newQuestion.text"
                                rows="3"
                                class="w-full !bg-zinc-50 !border-zinc-200 !rounded-xl p-4 focus:!border-zinc-400 focus:!ring-0"
                                placeholder="Tulis soal..."
                            />
                        </div>

                        <div class="space-y-2">
                            <label
                                class="text-xs font-bold text-zinc-400 uppercase tracking-wider"
                                >Gambar (URL)</label
                            >
                            <InputText
                                v-model="newQuestion.imageUrl"
                                class="w-full !bg-zinc-50 !border-zinc-200 !rounded-xl p-3"
                                placeholder="https://..."
                            />
                        </div>

                        <div class="space-y-3">
                            <label
                                class="text-xs font-bold text-zinc-400 uppercase tracking-wider"
                                >Pilihan Jawaban</label
                            >
                            <div
                                v-for="(opt, idx) in newQuestion.options"
                                :key="idx"
                                class="flex items-center gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200"
                            >
                                <RadioButton
                                    v-model="correctOptionIndex"
                                    :inputId="`opt-${idx}`"
                                    :value="idx"
                                />
                                <InputText
                                    v-model="opt.text"
                                    class="w-full !border-none !bg-transparent !shadow-none focus:!ring-0"
                                    :placeholder="`Jawaban ${idx + 1}`"
                                />
                            </div>
                        </div>

                        <Button
                            :label="
                                isEditing ? 'Simpan Perubahan' : 'Simpan Soal'
                            "
                            class="w-full !bg-zinc-900 !border-zinc-900 !text-white !rounded-xl !py-3 !font-bold hover:!bg-zinc-800"
                            @click="saveQuestion"
                        />
                    </div>
                </div>

                <div
                    v-if="currentList.length === 0 && !isAdding"
                    class="text-center py-12 text-zinc-400"
                >
                    Belum ada soal untuk level ini.
                </div>

                <div v-else class="grid gap-4">
                    <div
                        v-for="(q, idx) in currentList"
                        :key="q.id"
                        class="bg-white border border-zinc-100 p-6 rounded-2xl flex gap-6 items-start group hover:border-zinc-300 transition-colors"
                    >
                        <div
                            class="flex-shrink-0 w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500 text-xs font-bold"
                        >
                            {{ idx + 1 }}
                        </div>

                        <div class="flex-1 space-y-2">
                            <div class="flex gap-4">
                                <img
                                    v-if="q.imageUrl"
                                    :src="q.imageUrl"
                                    class="w-16 h-16 rounded-lg object-cover bg-zinc-100"
                                />
                                <p class="font-bold text-zinc-800 text-lg">
                                    {{ q.text }}
                                </p>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <div
                                    v-for="opt in q.options"
                                    :key="opt.text"
                                    class="text-sm px-3 py-1 rounded-lg border truncate"
                                    :class="
                                        opt.text === q.correctAnswer
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold'
                                            : 'bg-white border-zinc-100 text-zinc-500'
                                    "
                                >
                                    {{ opt.text }}
                                </div>
                            </div>
                        </div>

                        <div
                            class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Button
                                text
                                rounded
                                class="!w-10 !h-10 !text-slate-400 hover:!text-slate-700 hover:!bg-slate-100"
                                @click="editQuestion(q)"
                            >
                                <template #icon>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path
                                            d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
                                        />
                                        <path d="m15 5 4 4" />
                                    </svg>
                                </template>
                            </Button>

                            <Button
                                text
                                rounded
                                class="!w-10 !h-10 !text-rose-400 hover:!text-rose-600 hover:!bg-rose-50"
                                @click="deleteQuestion(q.id)"
                            >
                                <template #icon>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="M3 6h18" />
                                        <path
                                            d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
                                        />
                                        <path
                                            d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                                        />
                                        <line x1="10" x2="10" y1="11" y2="17" />
                                        <line x1="14" x2="14" y1="11" y2="17" />
                                    </svg>
                                </template>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
