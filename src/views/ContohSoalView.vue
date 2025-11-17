<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentExample = ref(0);

const examples = [
  {
    problem: 'Sebuah segitiga siku-siku memiliki alas (a) = 8 cm dan tinggi (b) = 6 cm. Berapa panjang sisi miringnya (c)?',
    steps: [
      { text: 'Gunakan rumus Pythagoras:', formula: 'a² + b² = c²' },
      { text: 'Substitusi nilai a dan b:', formula: '8² + 6² = c²' },
      { text: 'Hitung kuadratnya:', formula: '64 + 36 = c²' },
      { text: 'Jumlahkan:', formula: '100 = c²' },
      { text: 'Akar kuadratkan kedua sisi:', formula: 'c = √100 = 10 cm' }
    ],
    answer: '10 cm'
  },
  {
    problem: 'Sebuah segitiga siku-siku memiliki alas (a) = 15 cm dan tinggi (b) = 8 cm. Berapa panjang sisi miringnya (c)?',
    steps: [
      { text: 'Gunakan rumus Pythagoras:', formula: 'a² + b² = c²' },
      { text: 'Substitusi nilai a dan b:', formula: '15² + 8² = c²' },
      { text: 'Hitung kuadratnya:', formula: '225 + 64 = c²' },
      { text: 'Jumlahkan:', formula: '289 = c²' },
      { text: 'Akar kuadratkan kedua sisi:', formula: 'c = √289 = 17 cm' }
    ],
    answer: '17 cm'
  }
];

const currentStepIndex = ref(0);
const showAllSteps = ref(false);

const currentExampleData = computed(() => examples[currentExample.value]);

const nextStep = () => {
  if (currentStepIndex.value < currentExampleData.value!.steps.length - 1) {
    currentStepIndex.value++;
  } else {
    showAllSteps.value = true;
  }
};

const nextExample = () => {
  if (currentExample.value < examples.length - 1) {
    currentExample.value++;
    currentStepIndex.value = 0;
    showAllSteps.value = false;
  } else {
    router.push({ name: 'kuis' });
  }
};

const previousExample = () => {
  if (currentExample.value > 0) {
    currentExample.value--;
    currentStepIndex.value = 0;
    showAllSteps.value = false;
  } else {
    router.push({ name: 'materi' });
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 pt-20">
    <div class="container mx-auto px-6 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Title -->
        <h1 
          class="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg"
          v-motion
          :initial="{ opacity: 0, y: -50 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          Contoh Soal {{ currentExample + 1 }}
        </h1>

        <!-- Pyta Speech -->
        <div class="flex justify-center mb-8">
          <PytaSpeech 
            text="Mari kita lihat bagaimana cara menggunakan rumus Pythagoras untuk menyelesaikan soal!"
            v-motion
            :initial="{ opacity: 0, scale: 0.8 }"
            :enter="{ opacity: 1, scale: 1, transition: { duration: 400, delay: 200 } }"
          />
        </div>

        <!-- Problem Statement -->
        <div 
          class="bg-white/95 rounded-2xl p-8 shadow-xl mb-8"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 400 } }"
        >
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Soal:</h2>
          <p class="text-xl text-gray-700">{{ currentExampleData?.problem }}</p>
        </div>

        <!-- Solution Steps -->
        <div class="bg-white/95 rounded-2xl p-8 shadow-xl mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Penyelesaian:</h2>
          
          <div class="space-y-4">
            <div
              v-for="(step, index) in currentExampleData?.steps"
              :key="index"
              v-show="showAllSteps || index <= currentStepIndex"
              v-motion
              :initial="{ opacity: 0, x: -30 }"
              :enter="{ opacity: 1, x: 0, transition: { duration: 400, delay: index * 200 } }"
              class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500"
            >
              <div class="text-gray-700 mb-2">{{ index + 1 }}. {{ step.text }}</div>
              <div class="text-2xl font-mono font-bold text-purple-600">{{ step.formula }}</div>
            </div>
          </div>

          <!-- Show Next Step Button -->
          <div v-if="!showAllSteps" class="mt-6 text-center">
            <button
              @click="nextStep"
              class="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              {{ currentStepIndex < currentExampleData!.steps.length - 1 ? 'Langkah Selanjutnya →' : 'Lihat Jawaban 🎉' }}
            </button>
          </div>

          <!-- Final Answer -->
          <div 
            v-if="showAllSteps"
            v-motion
            :initial="{ opacity: 0, scale: 0.8 }"
            :enter="{ opacity: 1, scale: 1, transition: { duration: 500, delay: 1000 } }"
            class="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-6 text-center"
          >
            <div class="text-xl mb-2">Jawaban Akhir:</div>
            <div class="text-4xl font-bold">{{ currentExampleData?.answer }}</div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center mt-12">
          <button
            @click="previousExample"
            class="px-6 py-3 bg-white text-orange-600 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            ← {{ currentExample === 0 ? 'Kembali ke Materi' : 'Contoh Sebelumnya' }}
          </button>

          <div class="flex gap-2">
            <div
              v-for="(_example, index) in examples"
              :key="index"
              class="w-3 h-3 rounded-full transition-all duration-200"
              :class="currentExample === index ? 'bg-white w-8' : 'bg-white/50'"
            ></div>
          </div>

          <button
            v-if="showAllSteps"
            @click="nextExample"
            class="px-6 py-3 bg-white text-orange-600 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            {{ currentExample === examples.length - 1 ? 'Lanjut ke Kuis →' : 'Contoh Selanjutnya →' }}
          </button>
          <div v-else></div>
        </div>
      </div>
    </div>
  </div>
</template>
