<script setup lang="ts">
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import type { Quiz, Question, Difficulty } from "@/types/models";

const MAIN_QUIZ_ID = "quiz-pythagoras-1";

const activeQuiz = ref<Quiz | null>(null);
const isLoading = ref(false);
const activeTab = ref<Difficulty>("easy");

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
const isEditing = ref(false);
const correctOptionIndex = ref<number | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

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

// --- REVERTED: Base64 Logic ---
const handleFileDrop = (e: DragEvent) => {
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
    }
};

const handleFileSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        processFile(input.files[0]);
    }
};

const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
        alert("Mohon upload file gambar.");
        return;
    }
    // Limit to 500KB because Base64 increases size by ~33%, and Firestore limit is 1MB
    if (file.size > 500 * 1024) {
        alert("Gambar terlalu besar! Maks 500KB untuk Firestore.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        if (e.target?.result)
            newQuestion.value.imageUrl = e.target.result as string;
    };
    reader.readAsDataURL(file);
};
// -----------------------------

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

const currentList = computed(
    () => questionsByDifficulty.value[activeTab.value] || [],
);

const difficultyStats = computed(() => [
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
]);

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
        console.error(e);
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
    const idx = newQuestion.value.options.findIndex(
        (o) => o.text === q.correctAnswer,
    );
    correctOptionIndex.value = idx !== -1 ? idx : null;
    isEditing.value = true;
    isAdding.value = true;
    window.scrollTo({ top: 200, behavior: "smooth" });
};

const saveQuestion = async () => {
    if (!activeQuiz.value) return;
    if (!newQuestion.value.text || correctOptionIndex.value === null) {
        alert("Mohon isi Pertanyaan dan pilih Jawaban Benar.");
        return;
    }

    if (
        newQuestion.value.options &&
        newQuestion.value.options[correctOptionIndex.value]
    ) {
        newQuestion.value.correctAnswer =
            newQuestion.value.options[correctOptionIndex.value].text;
    }

    newQuestion.value.difficulty = activeTab.value;

    if (isEditing.value && newQuestion.value.id) {
        const index = activeQuiz.value.questions.findIndex(
            (q) => q.id === newQuestion.value.id,
        );
        if (index !== -1)
            activeQuiz.value.questions[index] = { ...newQuestion.value };
    } else {
        newQuestion.value.id = Date.now().toString();
        if (!activeQuiz.value.questions) activeQuiz.value.questions = [];
        activeQuiz.value.questions.push({ ...newQuestion.value });
    }

    try {
        await updateDoc(doc(db, "quizzes", MAIN_QUIZ_ID), {
            questions: activeQuiz.value.questions,
        });
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
                        <i-lucide-refresh-ccw class="mr-2 w-4 h-4" />
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
                        class="cursor-pointer border rounded-lg p-6 text-center transition-all duration-300 group hover:-translate-y-1"
                        :class="
                            activeTab === stat.id
                                ? 'bg-white border-zinc-300 scale-105'
                                : 'bg-zinc-50 border-transparent hover:bg-white hover:border-zinc-200'
                        "
                    >
                        <div
                            class="w-12 h-12 rounded-lg mx-auto flex items-center justify-center mb-3 text-xl transition-transform group-hover:scale-110"
                            :class="stat.color"
                        >
                            <i-lucide-sprout
                                v-if="stat.id === 'easy'"
                                class="w-6 h-6"
                            />
                            <i-lucide-flame
                                v-if="stat.id === 'medium'"
                                class="w-6 h-6"
                            />
                            <i-lucide-zap
                                v-if="stat.id === 'hard'"
                                class="w-6 h-6"
                            />
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
                            <i-lucide-x v-if="isAdding" class="mr-2 w-4 h-4" />
                            <i-lucide-plus v-else class="mr-2 w-4 h-4" />
                        </template>
                    </Button>
                </div>

                <div
                    v-if="isAdding"
                    class="bg-white p-8 rounded-lg border border-zinc-200 animate-in fade-in zoom-in-95 duration-300"
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
                                class="w-full !bg-zinc-50 !border-zinc-200 !text-zinc-900 !rounded-lg p-4 focus:!border-zinc-400 focus:!ring-0"
                                placeholder="Tulis soal..."
                            />
                        </div>

                        <div class="space-y-2">
                            <label
                                class="text-xs font-bold text-zinc-400 uppercase tracking-wider"
                                >Gambar (Upload)</label
                            >
                            <div
                                class="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-colors flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
                                @dragover.prevent
                                @drop.prevent="handleFileDrop"
                                @click="fileInput?.click()"
                            >
                                <input
                                    type="file"
                                    ref="fileInput"
                                    class="hidden"
                                    accept="image/*"
                                    @change="handleFileSelect"
                                />

                                <img
                                    v-if="newQuestion.imageUrl"
                                    :src="newQuestion.imageUrl"
                                    class="absolute inset-0 w-full h-full object-contain bg-white p-2"
                                />
                                <div
                                    v-else
                                    class="text-center pointer-events-none"
                                >
                                    <div
                                        class="text-slate-400 mb-2 flex justify-center"
                                    >
                                        <i-lucide-image class="w-6 h-6" />
                                    </div>
                                    <p class="text-xs text-slate-500 font-bold">
                                        Klik atau Geser Gambar Kesini
                                    </p>
                                    <p class="text-[10px] text-slate-400">
                                        Maks 500KB
                                    </p>
                                </div>
                                <div
                                    v-if="newQuestion.imageUrl"
                                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    @click.stop="newQuestion.imageUrl = ''"
                                >
                                    <span
                                        class="text-white font-bold text-xs bg-red-500 px-3 py-1 rounded-lg"
                                        >Hapus Gambar</span
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="space-y-3">
                            <label
                                class="text-xs font-bold text-zinc-400 uppercase tracking-wider"
                                >Pilihan Jawaban</label
                            >
                            <div
                                v-for="(opt, idx) in newQuestion.options"
                                :key="idx"
                                class="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-200"
                            >
                                <RadioButton
                                    v-model="correctOptionIndex"
                                    :inputId="`opt-${idx}`"
                                    :value="idx"
                                />
                                <InputText
                                    v-model="opt.text"
                                    class="w-full !border-none !bg-transparent !text-zinc-900 !shadow-none focus:!ring-0"
                                    :placeholder="`Jawaban ${idx + 1}`"
                                />
                            </div>
                        </div>

                        <Button
                            :label="
                                isEditing ? 'Simpan Perubahan' : 'Simpan Soal'
                            "
                            class="w-full !bg-zinc-900 !border-zinc-900 !text-white !rounded-lg !py-3 !font-bold hover:!bg-zinc-800"
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
                        class="bg-white border border-zinc-100 p-6 rounded-lg flex gap-6 items-start group hover:border-zinc-300 transition-colors"
                    >
                        <div
                            class="flex-shrink-0 w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-500 text-xs font-bold"
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
                                ><template #icon
                                    ><i-lucide-pencil
                                        class="w-4 h-4" /></template
                            ></Button>
                            <Button
                                text
                                rounded
                                class="!w-10 !h-10 !text-rose-400 hover:!text-rose-600 hover:!bg-rose-50"
                                @click="deleteQuestion(q.id)"
                                ><template #icon
                                    ><i-lucide-trash-2
                                        class="w-4 h-4" /></template
                            ></Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
