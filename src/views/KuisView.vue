<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import { useDocument } from 'vuefire';
import { doc } from 'firebase/firestore';
import { db } from '@/firebase';
import type { Quiz } from '@/types/models';

const router = useRouter();
const quizStore = useQuizStore();

const quizDoc = useDocument<Quiz>(doc(db, 'quizzes', 'quiz-pythagoras-1'));

watch(quizDoc, (newDoc) => {
  if (newDoc && newDoc.questions && newDoc.questions.length > 0) {
    quizStore.loadQuiz(newDoc);
  } 
}, { immediate: true });

const currentQuestion = computed(() => quizStore.currentQuestion);
const selectedAnswer = computed(() => 
  currentQuestion.value ? quizStore.getUserAnswer(currentQuestion.value.id) : null
);

const selectAnswer = (answer: string) => {
  if (currentQuestion.value) {
    quizStore.selectAnswer(currentQuestion.value.id, answer);
  }
};

const handleNext = () => {
  quizStore.nextQuestion();
};

const handlePrevious = () => {
  quizStore.previousQuestion();
};

const restartQuiz = () => {
  quizStore.resetQuiz();
  
  if (!quizDoc.value) {
    return;
  }
  
  quizStore.loadQuiz(quizDoc.value);
};

const goHome = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 pt-20">
    <div class="container mx-auto px-6 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Quiz Not Started / Loading -->
        <div v-if="!quizStore.currentQuiz" class="text-center">
          <div class="bg-white/90 rounded-2xl p-12 shadow-xl">
            <div class="text-6xl mb-4">📝</div>
            <h1 class="text-4xl font-bold text-gray-800 mb-4">Memuat Kuis...</h1>
            <p class="text-gray-600">Mohon tunggu sebentar</p>
          </div>
        </div>

        <!-- Quiz In Progress -->
        <div v-else-if="!quizStore.quizCompleted">
          <!-- Title -->
          <h1 
            class="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg"
            v-motion
            :initial="{ opacity: 0, y: -50 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
          >
            Kuis Pythagoras
          </h1>

          <!-- Progress -->
          <div class="bg-white/90 rounded-full p-2 mb-8 shadow-lg">
            <div class="flex justify-between items-center px-4">
              <span class="text-sm font-semibold text-gray-700">
                Soal {{ quizStore.currentQuestionIndex + 1 }} dari {{ quizStore.totalQuestions }}
              </span>
              <div class="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${((quizStore.currentQuestionIndex + 1) / quizStore.totalQuestions) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Pyta Speech -->
          <div class="flex justify-center mb-8">
            <PytaSpeech 
              text="Pilih jawaban yang menurutmu benar, lalu klik 'Lanjut' untuk ke soal berikutnya!"
              v-motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :enter="{ opacity: 1, scale: 1, transition: { duration: 400, delay: 200 } }"
            />
          </div>

          <!-- Question -->
          <div 
            class="bg-white/95 rounded-2xl p-8 shadow-xl mb-8"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 400 } }"
          >
            <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ currentQuestion?.text }}</h2>
            
            <!-- Options -->
            <div class="space-y-4">
              <button
                v-for="(option, index) in currentQuestion?.options"
                :key="index"
                @click="selectAnswer(option.text)"
                class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 hover:scale-102 hover:shadow-lg"
                :class="selectedAnswer === option.text 
                  ? 'border-purple-600 bg-purple-100 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-purple-300'"
              >
                <div class="flex items-center gap-4">
                  <div 
                    class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="selectedAnswer === option.text 
                      ? 'border-purple-600 bg-purple-600' 
                      : 'border-gray-300'"
                  >
                    <div v-if="selectedAnswer === option.text" class="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span class="text-lg">{{ option.text }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex justify-between items-center">
            <button
              v-if="quizStore.currentQuestionIndex > 0"
              @click="handlePrevious"
              class="px-6 py-3 bg-white text-purple-600 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              ← Sebelumnya
            </button>
            <div v-else></div>

            <button
              @click="handleNext"
              :disabled="!selectedAnswer"
              class="px-6 py-3 bg-white text-purple-600 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ quizStore.currentQuestionIndex === quizStore.totalQuestions - 1 ? 'Selesai' : 'Lanjut →' }}
            </button>
          </div>
        </div>

        <!-- Quiz Completed -->
        <div 
          v-else
          class="text-center"
          v-motion
          :initial="{ opacity: 0, scale: 0.8 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
        >
          <div class="bg-white/95 rounded-2xl p-12 shadow-2xl">
            <div class="text-8xl mb-6">
              {{ quizStore.score >= 80 ? '🎉' : quizStore.score >= 60 ? '👍' : '💪' }}
            </div>
            
            <h1 class="text-5xl font-bold text-gray-800 mb-4">Kuis Selesai!</h1>
            
            <div class="text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              {{ quizStore.score }}%
            </div>

            <p class="text-xl text-gray-700 mb-8">
              {{ quizStore.score >= 80 
                ? 'Luar biasa! Kamu menguasai Teorema Pythagoras!' 
                : quizStore.score >= 60 
                  ? 'Bagus! Terus berlatih untuk hasil yang lebih baik!' 
                  : 'Jangan menyerah! Coba pelajari lagi materinya ya!' 
              }}
            </p>

            <div class="flex gap-4 justify-center">
              <button
                @click="restartQuiz"
                class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                🔄 Ulangi Kuis
              </button>
              <button
                @click="goHome"
                class="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                🏠 Kembali ke Home
              </button>
            </div>
          </div>

          <p v-if="usingSampleData" class="mt-4 text-white/80 text-sm">
            ℹ️ Menggunakan data sampel (Firebase belum terhubung)
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
