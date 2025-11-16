<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCollection } from 'vuefire';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import type { Quiz, Question } from '@/types/models';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Password from 'primevue/password';

const router = useRouter();
const authStore = useAuthStore();

const showLogin = ref(!authStore.isAuthenticated);
const email = ref('');
const password = ref('');
const loginError = ref('');

const quizzes = useCollection<Quiz>(collection(db, 'quizzes'));
const showQuizDialog = ref(false);
const editingQuiz = ref<Quiz | null>(null);
const quizForm = ref({
  id: '',
  moduleId: 'pythagoras-v1',
  title: '',
  questions: [] as Question[]
});

const showQuestionDialog = ref(false);
const editingQuestionIndex = ref(-1);
const questionForm = ref({
  id: '',
  text: '',
  type: 'multiple-choice' as 'multiple-choice' | 'fill-in-the-blank',
  options: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]
});

const handleLogin = async () => {
  loginError.value = '';
  const result = await authStore.login(email.value, password.value);
  
  if (result.success) {
    showLogin.value = false;
  } else {
    loginError.value = result.error || 'Login failed';
  }
};

const handleLogout = async () => {
  await authStore.logout();
  showLogin.value = true;
  router.push({ name: 'home' });
};

const openNewQuizDialog = () => {
  editingQuiz.value = null;
  quizForm.value = {
    id: '',
    moduleId: 'pythagoras-v1',
    title: '',
    questions: []
  };
  showQuizDialog.value = true;
};

const openEditQuizDialog = (quiz: Quiz) => {
  editingQuiz.value = quiz;
  quizForm.value = { ...quiz };
  showQuizDialog.value = true;
};

const saveQuiz = async () => {
  try {
    if (editingQuiz.value) {
      const quizRef = doc(db, 'quizzes', editingQuiz.value.id);
      await updateDoc(quizRef, {
        title: quizForm.value.title,
        moduleId: quizForm.value.moduleId,
        questions: quizForm.value.questions
      });
    } else {
      await addDoc(collection(db, 'quizzes'), {
        moduleId: quizForm.value.moduleId,
        title: quizForm.value.title,
        questions: quizForm.value.questions
      });
    }
    showQuizDialog.value = false;
  } catch (error) {
    console.error('Error saving quiz:', error);
  }
};

const deleteQuiz = async (quiz: Quiz) => {
  if (confirm(`Apakah Anda yakin ingin menghapus quiz "${quiz.title}"?`)) {
    try {
      await deleteDoc(doc(db, 'quizzes', quiz.id));
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  }
};

const openNewQuestionDialog = () => {
  editingQuestionIndex.value = -1;
  questionForm.value = {
    id: `q${Date.now()}`,
    text: '',
    type: 'multiple-choice',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  };
  showQuestionDialog.value = true;
};

const openEditQuestionDialog = (question: Question, index: number) => {
  editingQuestionIndex.value = index;
  questionForm.value = { ...question };
  showQuestionDialog.value = true;
};

const saveQuestion = () => {
  if (editingQuestionIndex.value >= 0) {
    quizForm.value.questions[editingQuestionIndex.value] = { ...questionForm.value };
  } else {
    quizForm.value.questions.push({ ...questionForm.value });
  }
  showQuestionDialog.value = false;
};

const deleteQuestion = (index: number) => {
  if (confirm('Hapus pertanyaan ini?')) {
    quizForm.value.questions.splice(index, 1);
  }
};

const setCorrectAnswer = (optionIndex: number) => {
  questionForm.value.options.forEach((opt, idx) => {
    opt.isCorrect = idx === optionIndex;
  });
};

onMounted(() => {
  if (!authStore.isAuthenticated) {
    showLogin.value = true;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-20">
    <div class="container mx-auto px-6 py-12">
      <Dialog v-model:visible="showLogin" modal header="Admin Login" :closable="false" class="w-96">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-2">Email</label>
            <InputText v-model="email" type="email" class="w-full" placeholder="admin@example.com" />
          </div>
          
          <div>
            <label class="block text-sm font-semibold mb-2">Password</label>
            <Password v-model="password" :feedback="false" toggle-mask class="w-full" />
          </div>

          <div v-if="loginError" class="text-red-600 text-sm">{{ loginError }}</div>

          <div class="flex gap-2">
            <Button label="Login" @click="handleLogin" class="flex-1" severity="primary" />
            <Button label="Kembali" @click="router.push({ name: 'home' })" class="flex-1" severity="secondary" />
          </div>
        </div>
      </Dialog>

      <!-- Admin Panel (when authenticated) -->
      <div v-if="authStore.isAuthenticated && !showLogin">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-gray-800">Admin Panel - Quiz Management</h1>
          <Button label="Logout" @click="handleLogout" severity="danger" />
        </div>

        <!-- Quiz List -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Daftar Quiz</h2>
            <Button label="Tambah Quiz Baru" @click="openNewQuizDialog" severity="success" />
          </div>

          <DataTable :value="quizzes" stripedRows>
            <Column field="title" header="Judul Quiz"></Column>
            <Column field="moduleId" header="Module ID"></Column>
            <Column header="Jumlah Soal">
              <template #body="slotProps">
                {{ slotProps.data.questions?.length || 0 }} soal
              </template>
            </Column>
            <Column header="Actions">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button label="Edit" @click="openEditQuizDialog(slotProps.data)" severity="info" size="small" />
                  <Button label="Hapus" @click="deleteQuiz(slotProps.data)" severity="danger" size="small" />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Quiz Edit Dialog -->
        <Dialog v-model:visible="showQuizDialog" modal :header="editingQuiz ? 'Edit Quiz' : 'Tambah Quiz Baru'" class="w-[800px]">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Judul Quiz</label>
              <InputText v-model="quizForm.title" class="w-full" />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Module ID</label>
              <InputText v-model="quizForm.moduleId" class="w-full" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-semibold">Pertanyaan</label>
                <Button label="Tambah Pertanyaan" @click="openNewQuestionDialog" severity="success" size="small" />
              </div>

              <div class="space-y-2 max-h-96 overflow-y-auto">
                <div
                  v-for="(question, index) in quizForm.questions"
                  :key="index"
                  class="border rounded p-3 bg-gray-50"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="font-semibold">{{ index + 1 }}. {{ question.text }}</div>
                      <div class="text-sm text-gray-600 mt-1">
                        {{ question.options.length }} pilihan
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <Button label="Edit" @click="openEditQuestionDialog(question, index)" severity="info" size="small" />
                      <Button label="Hapus" @click="deleteQuestion(index)" severity="danger" size="small" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-2 pt-4">
              <Button label="Simpan Quiz" @click="saveQuiz" severity="primary" class="flex-1" />
              <Button label="Batal" @click="showQuizDialog = false" severity="secondary" class="flex-1" />
            </div>
          </div>
        </Dialog>

        <!-- Question Edit Dialog -->
        <Dialog v-model:visible="showQuestionDialog" modal header="Edit Pertanyaan" class="w-[600px]">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-2">Pertanyaan</label>
              <Textarea v-model="questionForm.text" class="w-full" rows="3" />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Pilihan Jawaban</label>
              <div class="space-y-2">
                <div
                  v-for="(option, index) in questionForm.options"
                  :key="index"
                  class="flex gap-2 items-center"
                >
                  <InputText v-model="option.text" class="flex-1" :placeholder="`Pilihan ${index + 1}`" />
                  <Button
                    :label="option.isCorrect ? '✓ Benar' : 'Tandai Benar'"
                    @click="setCorrectAnswer(index)"
                    :severity="option.isCorrect ? 'success' : 'secondary'"
                    size="small"
                  />
                </div>
              </div>
            </div>

            <div class="flex gap-2 pt-4">
              <Button label="Simpan Pertanyaan" @click="saveQuestion" severity="primary" class="flex-1" />
              <Button label="Batal" @click="showQuestionDialog = false" severity="secondary" class="flex-1" />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  </div>
</template>
