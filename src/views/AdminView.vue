<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from "vue";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import type { Quiz, Question, Difficulty } from "@/types/models";

const router = useRouter();
const { logout } = useAuthStore();
const QUIZ_ID = "quiz-pythagoras-1";

const ui = reactive({
    loading: false,
    view: "list" as "list" | "form",
    tab: "easy" as Difficulty,
});
const quiz = ref<Quiz | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const blank = (): Question => ({
    id: "",
    text: "",
    type: "multiple-choice",
    options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
    correctAnswer: "",
    difficulty: "easy",
    imageUrl: "",
});

const draft = ref<Question>(blank());
const correctIdx = ref<number | null>(null);

const questions = computed(() => {
    if (!quiz.value?.questions) return { easy: [], medium: [], hard: [] };
    return {
        easy: quiz.value.questions.filter((q) => q.difficulty === "easy"),
        medium: quiz.value.questions.filter((q) => q.difficulty === "medium"),
        hard: quiz.value.questions.filter((q) => q.difficulty === "hard"),
    };
});

const list = computed(() => questions.value[ui.tab] || []);
const tabs = [
    {
        id: "easy",
        label: "Mudah",
        icon: "sprout",
        color: "text-emerald-600 bg-emerald-50 ring-emerald-500",
    },
    {
        id: "medium",
        label: "Sedang",
        icon: "flame",
        color: "text-amber-600 bg-amber-50 ring-amber-500",
    },
    {
        id: "hard",
        label: "Sulit",
        icon: "zap",
        color: "text-rose-600 bg-rose-50 ring-rose-500",
    },
] as const;

watch(
    [correctIdx, () => draft.value.options],
    ([idx, opts]) => {
        if (idx !== null && opts[idx])
            draft.value.correctAnswer = opts[idx].text;
    },
    { deep: true },
);

const init = async () => {
    ui.loading = true;
    const snap = await getDoc(doc(db, "quizzes", QUIZ_ID));
    if (snap.exists()) quiz.value = { id: snap.id, ...snap.data() } as Quiz;
    else {
        const newData: Quiz = { title: "Bank Soal", questions: [] };
        await setDoc(doc(db, "quizzes", QUIZ_ID), newData);
        quiz.value = { id: QUIZ_ID, ...newData };
    }
    ui.loading = false;
};

const handleImg = (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 500 * 1024)
        return alert("Max 500KB.");
    const reader = new FileReader();
    reader.onload = (e) => {
        if (e.target?.result) draft.value.imageUrl = e.target.result as string;
    };
    reader.readAsDataURL(file);
};

const openForm = (q?: Question) => {
    correctIdx.value = null;
    draft.value = q ? JSON.parse(JSON.stringify(q)) : blank();
    if (q) {
        const idx = draft.value.options.findIndex(
            (o) => o.text === q.correctAnswer,
        );
        correctIdx.value = idx !== -1 ? idx : null;
    }
    ui.view = "form";
};

const save = async () => {
    if (!quiz.value || !draft.value.text || correctIdx.value === null)
        return alert("Isi semua data.");
    draft.value.difficulty = ui.tab;
    draft.value.correctAnswer = draft.value.options[correctIdx.value].text;

    const target = [...(quiz.value.questions || [])];
    if (draft.value.id) {
        const i = target.findIndex((q) => q.id === draft.value.id);
        if (i !== -1) target[i] = { ...draft.value };
    } else {
        draft.value.id = Date.now().toString();
        target.push({ ...draft.value });
    }
    quiz.value.questions = target;
    await updateDoc(doc(db, "quizzes", QUIZ_ID), { questions: target });
    ui.view = "list";
};

const remove = async (id: string) => {
    if (!confirm("Hapus?") || !quiz.value) return;
    quiz.value.questions = quiz.value.questions.filter((q) => q.id !== id);
    await updateDoc(doc(db, "quizzes", QUIZ_ID), {
        questions: quiz.value.questions,
    });
};

onMounted(init);
</script>

<template>
    <div
        class="fixed inset-0 bg-zinc-50 font-sans text-zinc-900 flex justify-center overflow-hidden"
    >
        <div
            class="w-full max-w-md bg-white border border-zinc-200 h-full flex flex-col relative"
        >
            <header
                class="flex-none z-30 bg-white border-b border-zinc-100 px-4 h-14 flex items-center justify-between"
            >
                <h1 class="font-recoleta text-lg font-bold text-zinc-800">
                    Admin Panel
                </h1>
                <div class="flex gap-1">
                    <button
                        @click="init"
                        class="p-2 text-zinc-400 hover:text-zinc-800 rounded-full hover:bg-zinc-50"
                    >
                        <i-lucide-refresh-ccw
                            class="w-4 h-4"
                            :class="{ 'animate-spin': ui.loading }"
                        />
                    </button>
                    <button
                        @click="
                            logout().then(() => router.push({ name: 'login' }))
                        "
                        class="p-2 text-rose-400 hover:text-rose-600 rounded-full hover:bg-rose-50"
                    >
                        <i-lucide-log-out class="w-4 h-4" />
                    </button>
                </div>
            </header>

            <div
                class="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 pb-safe no-scrollbar"
            >
                <template v-if="ui.view === 'list'">
                    <div class="flex p-1 bg-zinc-100 rounded-xl shrink-0">
                        <button
                            v-for="t in tabs"
                            :key="t.id"
                            @click="ui.tab = t.id as Difficulty"
                            class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                            :class="
                                ui.tab === t.id
                                    ? `bg-white  ${t.color}`
                                    : 'text-zinc-400 hover:text-zinc-600'
                            "
                        >
                            <component class="w-3.5 h-3.5" />
                            {{ t.label }}
                            <span class="opacity-60 text-[10px]"
                                >({{ questions[t.id].length }})</span
                            >
                        </button>
                    </div>

                    <button
                        @click="openForm()"
                        class="w-full py-3 border border-dashed border-zinc-300 rounded-xl text-zinc-400 text-sm font-bold hover:bg-zinc-50 hover:border-zinc-400 hover:text-zinc-600 flex items-center justify-center gap-2 transition-colors shrink-0"
                    >
                        <i-lucide-plus class="w-4 h-4" /> Tambah Soal
                    </button>

                    <div class="space-y-3 pb-8">
                        <div
                            v-for="(q, i) in list"
                            :key="q.id"
                            class="flex gap-3 bg-white border border-zinc-100 p-3 rounded-xl items-start"
                        >
                            <div
                                class="shrink-0 w-12 h-12 bg-zinc-50 rounded-lg overflow-hidden border border-zinc-100"
                            >
                                <img
                                    v-if="q.imageUrl"
                                    :src="q.imageUrl"
                                    class="w-full h-full object-cover"
                                />
                                <div
                                    v-else
                                    class="w-full h-full flex items-center justify-center text-zinc-300 font-recoleta font-bold text-lg"
                                >
                                    {{ i + 1 }}
                                </div>
                            </div>
                            <div class="flex-1 min-w-0 pt-1">
                                <p
                                    class="text-sm font-bold text-zinc-800 truncate mb-1"
                                >
                                    {{ q.text }}
                                </p>
                                <p
                                    class="text-[10px] text-zinc-400 bg-zinc-50 inline-block px-1.5 py-0.5 rounded border border-zinc-100"
                                >
                                    Ans: {{ q.correctAnswer }}
                                </p>
                            </div>
                            <div class="flex flex-col gap-1 pt-1">
                                <button
                                    @click="openForm(q)"
                                    class="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                                >
                                    <i-lucide-pencil class="w-4 h-4" />
                                </button>
                                <button
                                    @click="remove(q.id)"
                                    class="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded"
                                >
                                    <i-lucide-trash-2 class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div
                            v-if="list.length === 0"
                            class="text-center py-10 text-zinc-300 text-sm"
                        >
                            Belum ada soal.
                        </div>
                    </div>
                </template>

                <template v-else>
                    <div
                        class="space-y-4 pb-8 animate-in slide-in-from-bottom-4 duration-300"
                    >
                        <div class="flex items-center gap-2 mb-2">
                            <button
                                @click="ui.view = 'list'"
                                class="p-1 -ml-1 text-zinc-400"
                            >
                                <i-lucide-arrow-left class="w-5 h-5" />
                            </button>
                            <h2 class="font-bold text-zinc-800">
                                {{ draft.id ? "Edit Soal" : "Soal Baru" }}
                            </h2>
                        </div>

                        <div>
                            <label
                                class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1"
                                >Pertanyaan</label
                            >
                            <Textarea
                                v-model="draft.text"
                                rows="3"
                                placeholder="Tulis pertanyaan..."
                                class="w-full mt-1 bg-zinc-50 border-zinc-200 rounded-xl text-sm p-3 focus:ring-0 focus:border-zinc-400"
                            />
                        </div>

                        <div>
                            <label
                                class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1"
                                >Gambar</label
                            >
                            <div class="mt-1 flex gap-3">
                                <div
                                    @click="fileInput?.click()"
                                    class="w-20 h-20 shrink-0 bg-zinc-50 border border-dashed border-zinc-300 rounded-xl flex flex-col items-center justify-center text-zinc-400 cursor-pointer hover:bg-zinc-100"
                                >
                                    <i-lucide-image-plus class="w-5 h-5 mb-1" />
                                    <span class="text-[9px] font-bold"
                                        >Upload</span
                                    >
                                    <input
                                        type="file"
                                        ref="fileInput"
                                        class="hidden"
                                        accept="image/*"
                                        @change="
                                            (e: any) =>
                                                e.target.files[0] &&
                                                handleImg(e.target.files[0])
                                        "
                                    />
                                </div>
                                <div
                                    v-if="draft.imageUrl"
                                    class="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-zinc-200 group"
                                >
                                    <img
                                        :src="draft.imageUrl"
                                        class="w-full h-full object-cover"
                                    />
                                    <button
                                        @click="draft.imageUrl = ''"
                                        class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <i-lucide-x
                                            class="w-5 h-5 text-white"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider pl-1 mb-1 block"
                                >Jawaban Benar</label
                            >
                            <div class="space-y-2">
                                <div
                                    v-for="(opt, idx) in draft.options"
                                    :key="idx"
                                    class="flex items-center gap-3 bg-white border border-zinc-200 p-2 pr-3 rounded-xl focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-200"
                                >
                                    <RadioButton
                                        v-model="correctIdx"
                                        :inputId="`o${idx}`"
                                        :value="idx"
                                        class="ml-1"
                                    />
                                    <InputText
                                        v-model="opt.text"
                                        :placeholder="`Opsi ${idx + 1}`"
                                        class="w-full border-none text-sm bg-transparent p-1 focus:ring-0 shadow-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="pt-4">
                            <Button
                                label="Simpan"
                                @click="save"
                                class="w-full bg-zinc-900 text-white font-bold py-3 rounded-xl hover:bg-zinc-800"
                            />
                        </div>
                    </div>
                </template>
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

.stable-gutter {
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: #e4e4e7 transparent;
}

.stable-gutter::-webkit-scrollbar {
    width: 6px;
}
.stable-gutter::-webkit-scrollbar-track {
    background: transparent;
}
.stable-gutter::-webkit-scrollbar-thumb {
    background-color: #e4e4e7;
    border-radius: 20px;
}
</style>
