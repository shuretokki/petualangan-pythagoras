<script setup lang="ts">
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import type { Quiz, Question, Difficulty } from "@/types/models";

const router = useRouter();
const { logout } = useAuthStore();
const QUIZ_ID = "quiz-pythagoras-1";

const ui = reactive({
    loading: false,
    adding: false,
    editing: false,
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
const stats = computed(() => [
    {
        id: "easy",
        label: "Mudah",
        count: questions.value.easy.length,
        color: "bg-emerald-100 text-emerald-700",
    },
    {
        id: "medium",
        label: "Sedang",
        count: questions.value.medium.length,
        color: "bg-amber-100 text-amber-700",
    },
    {
        id: "hard",
        label: "Sulit",
        count: questions.value.hard.length,
        color: "bg-rose-100 text-rose-700",
    },
]);

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
    try {
        const snap = await getDoc(doc(db, "quizzes", QUIZ_ID));
        if (snap.exists()) {
            quiz.value = { id: snap.id, ...snap.data() } as Quiz;
        } else {
            const newData: Quiz = {
                title: "Bank Soal Pythagoras",
                questions: [],
            };
            await setDoc(doc(db, "quizzes", QUIZ_ID), newData);
            quiz.value = { id: QUIZ_ID, ...newData };
        }
    } catch (e) {
        console.error(e);
    } finally {
        ui.loading = false;
    }
};

const handleImg = (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 500 * 1024)
        return alert("Image only, max 500KB.");
    const reader = new FileReader();
    reader.onload = (e) => {
        if (e.target?.result) draft.value.imageUrl = e.target.result as string;
    };
    reader.readAsDataURL(file);
};

const openForm = (q?: Question) => {
    correctIdx.value = null;
    draft.value = q ? JSON.parse(JSON.stringify(q)) : blank();

    if (correctIdx.value === -1) correctIdx.value = null;

    ui.editing = !!q;
    ui.adding = true;
    if (q) window.scrollTo({ top: 200, behavior: "smooth" });
};

const save = async () => {
    if (!quiz.value || !draft.value.text || correctIdx.value === null)
        return alert("Fill required fields.");

    draft.value.difficulty = ui.tab;
    draft.value.correctAnswer = draft.value.options[correctIdx.value]!.text;

    // FIX: Create a shallow copy of the array to ensure reactivity triggers correctly
    const target = [...(quiz.value.questions || [])];

    if (ui.editing && draft.value.id) {
        const i = target.findIndex((q) => q.id === draft.value.id);
        if (i !== -1) target[i] = { ...draft.value };
    } else {
        draft.value.id = Date.now().toString();
        target.push({ ...draft.value });
    }

    quiz.value.questions = target;

    try {
        await updateDoc(doc(db, "quizzes", QUIZ_ID), { questions: target });
        ui.adding = false;
        draft.value = blank();
        correctIdx.value = null; // Reset index after save
    } catch (e) {
        console.error(e);
    }
};

const remove = async (id: string) => {
    if (!confirm("Delete?") || !quiz.value) return;
    quiz.value.questions = quiz.value.questions.filter((q) => q.id !== id);
    await updateDoc(doc(db, "quizzes", QUIZ_ID), {
        questions: quiz.value.questions,
    }).catch(console.error);
};

const signout = async () => {
    await logout();
    router.push({ name: "login" });
};

onMounted(init);
</script>

<template>
    <div
        class="min-h-screen bg-[#FAFAFA] p-8 md:p-20 font-sans text-slate-900 pb-32"
    >
        <div class="max-w-4xl mx-auto space-y-12">
            <div class="text-center space-y-4">
                <h1 class="font-recoleta text-5xl font-bold text-zinc-900">
                    Admin Panel
                </h1>
                <p class="text-zinc-500">
                    Kelola bank soal untuk aplikasi Pythagoras.
                </p>
                <div class="flex justify-center gap-3">
                    <Button
                        label="Refresh Data"
                        text
                        rounded
                        :loading="ui.loading"
                        @click="init"
                        class="text-slate-400! hover:text-slate-800!"
                    >
                        <template #icon
                            ><i-lucide-refresh-ccw class="mr-2 w-4 h-4"
                        /></template>
                    </Button>
                    <Button
                        label="Logout"
                        text
                        rounded
                        severity="danger"
                        @click="signout"
                        class="hover:bg-rose-50!"
                    >
                        <template #icon
                            ><i-lucide-log-out class="mr-2 w-4 h-4"
                        /></template>
                    </Button>
                </div>
            </div>

            <section class="space-y-6">
                <h2
                    class="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-2 text-center"
                >
                    Pilih Tingkat Kesulitan
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div
                        v-for="stat in stats"
                        :key="stat.id"
                        @click="ui.tab = stat.id as Difficulty"
                        class="cursor-pointer border rounded-lg p-6 text-center transition-colors duration-200"
                        :class="
                            ui.tab === stat.id
                                ? 'bg-white border-zinc-400'
                                : 'bg-zinc-50 border-transparent hover:border-zinc-200'
                        "
                    >
                        <div
                            class="w-12 h-12 rounded-lg mx-auto flex items-center justify-center mb-3 text-xl"
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
                        Daftar Soal ({{ ui.tab }})
                    </h2>
                    <Button
                        :label="ui.adding ? 'Batal' : 'Tambah Soal'"
                        text
                        rounded
                        @click="
                            ui.adding
                                ? ((ui.adding = false), (ui.editing = false))
                                : openForm()
                        "
                        class="text-zinc-900! font-bold! hover:bg-zinc-100!"
                    >
                        <template #icon>
                            <i-lucide-x v-if="ui.adding" class="mr-2 w-4 h-4" />
                            <i-lucide-plus v-else class="mr-2 w-4 h-4" />
                        </template>
                    </Button>
                </div>

                <div
                    v-if="ui.adding"
                    class="bg-white p-8 rounded-lg border border-zinc-200"
                >
                    <h3
                        class="font-recoleta text-2xl font-bold text-zinc-900 mb-6 text-center"
                    >
                        {{ ui.editing ? "Edit Soal" : "Buat Soal Baru" }}
                    </h3>
                    <div class="space-y-6 max-w-2xl mx-auto">
                        <div class="space-y-2">
                            <label
                                class="text-xs font-bold text-zinc-400 uppercase tracking-wider"
                                >Pertanyaan</label
                            >
                            <Textarea
                                v-model="draft.text"
                                rows="3"
                                placeholder="Tulis soal..."
                                class="w-full bg-zinc-50! border-zinc-200! text-zinc-900! rounded-lg! p-4 focus:border-zinc-400! focus:ring-0!"
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
                                @drop.prevent="
                                    (e) =>
                                        e.dataTransfer?.files[0] &&
                                        handleImg(e.dataTransfer.files[0])
                                "
                                @click="fileInput?.click()"
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

                                <img
                                    v-if="draft.imageUrl"
                                    :src="draft.imageUrl"
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
                                    v-if="draft.imageUrl"
                                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    @click.stop="draft.imageUrl = ''"
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
                                v-for="(opt, idx) in draft.options"
                                :key="idx"
                                class="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-200"
                            >
                                <RadioButton
                                    v-model="correctIdx"
                                    :inputId="`opt-${idx}`"
                                    :value="idx"
                                />
                                <InputText
                                    v-model="opt.text"
                                    :placeholder="`Jawaban ${idx + 1}`"
                                    class="w-full border-none! bg-transparent! text-zinc-900! shadow-none! focus:ring-0!"
                                />
                            </div>
                        </div>

                        <Button
                            :label="
                                ui.editing ? 'Simpan Perubahan' : 'Simpan Soal'
                            "
                            @click="save"
                            class="w-full bg-zinc-900! border-zinc-900! text-white! rounded-lg! py-3! font-bold! hover:bg-zinc-800!"
                        />
                    </div>
                </div>

                <div
                    v-if="list.length === 0 && !ui.adding"
                    class="text-center py-12 text-zinc-400"
                >
                    Belum ada soal untuk level ini.
                </div>

                <div v-else class="grid gap-4">
                    <div
                        v-for="(q, idx) in list"
                        :key="q.id"
                        class="bg-white border border-zinc-100 p-6 rounded-lg flex gap-6 items-start hover:border-zinc-300 transition-colors"
                    >
                        <div
                            class="shrink-0 w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-500 text-xs font-bold"
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
                        <div class="flex flex-col gap-2">
                            <Button
                                text
                                rounded
                                class="w-10! h-10! text-slate-400! hover:text-slate-700! hover:bg-slate-100!"
                                @click="openForm(q)"
                            >
                                <template #icon
                                    ><i-lucide-pencil class="w-4 h-4"
                                /></template>
                            </Button>
                            <Button
                                text
                                rounded
                                class="w-10! h-10! text-rose-400! hover:text-rose-600! hover:bg-rose-50!"
                                @click="remove(q.id)"
                            >
                                <template #icon
                                    ><i-lucide-trash-2 class="w-4 h-4"
                                /></template>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
