<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import PytaSpeech from '@/components/PytaSpeech.vue';
import { useDraggable } from '@vueuse/core';

const router = useRouter();
const currentStep = ref(0);

const triangle1 = ref<HTMLElement>();
const triangle2 = ref<HTMLElement>();
const triangle3 = ref<HTMLElement>();
const triangle4 = ref<HTMLElement>();

const { style: style1 } = useDraggable(triangle1, { initialValue: { x: 0, y: 0 } });
const { style: style2 } = useDraggable(triangle2, { initialValue: { x: 0, y: 0 } });
const { style: style3 } = useDraggable(triangle3, { initialValue: { x: 0, y: 0 } });
const { style: style4 } = useDraggable(triangle4, { initialValue: { x: 0, y: 0 } });

const puzzleCompleted = ref(false);

const steps = [
  { 
    title: 'Rahasia Pythagoras',
    content: 'Mari kita buktikan teorema Pythagoras dengan cara yang menyenangkan! Kita akan menggunakan 4 segitiga siku-siku yang sama.' 
  },
  { 
    title: 'Puzzle Pythagoras',
    content: 'Cobalah susun keempat segitiga ini di dalam kotak besar! Kamu bisa menggeser-geser segitiga dengan mouse.' 
  },
  { 
    title: 'Lihat Hasilnya!',
    content: 'Hebat! Sekarang perhatikan: Ada dua kotak yang terbentuk di dalam. Kotak kecil punya luas <strong>c²</strong>, dan area segitiga total adalah <strong>4 × ½ab</strong>.' 
  },
  { 
    title: 'Perhitungan Luas',
    content: 'Luas kotak besar = (a + b)²<br>Luas kotak besar juga = luas 4 segitiga + luas kotak kecil<br>Maka: (a + b)² = 4(½ab) + c²' 
  },
  { 
    title: 'Penyederhanaan',
    content: 'Mari kita sederhanakan:<br>(a + b)² = 2ab + c²<br>a² + 2ab + b² = 2ab + c²<br>a² + b² = c²' 
  },
  { 
    title: 'Teorema Pythagoras!',
    content: 'Tadaaa! Kita telah membuktikan:<br><br><strong class="text-4xl">a² + b² = c²</strong><br><br>Ini adalah <strong>Teorema Pythagoras</strong>!' 
  }
];

const currentStepData = computed(() => steps[currentStep.value]);

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  } else {
    router.push({ name: 'contoh-soal' });
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const completePuzzle = () => {
  puzzleCompleted.value = true;
  setTimeout(() => {
    nextStep();
  }, 1000);
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-400 via-teal-400 to-blue-400 pt-20">
    <div class="container mx-auto px-6 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Title -->
        <h1 
          class="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg"
          v-motion
          :initial="{ opacity: 0, y: -50 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500 } }"
        >
          {{ currentStepData?.title }}
        </h1>

        <!-- Pyta Speech -->
        <div class="flex justify-center mb-8">
          <PytaSpeech 
            :text="currentStepData?.content || ''"
            v-motion
            :initial="{ opacity: 0, scale: 0.8 }"
            :enter="{ opacity: 1, scale: 1, transition: { duration: 400, delay: 200 } }"
          />
        </div>

        <!-- Interactive Puzzle (Step 1) -->
        <div v-if="currentStep === 1" class="flex justify-center mb-8">
          <div class="bg-white/90 rounded-2xl p-8 shadow-xl">
            <div class="relative w-[400px] h-[400px] border-4 border-purple-600 bg-purple-100">
              <!-- Drop zone -->
              <div class="absolute inset-0 flex items-center justify-center text-gray-400 text-xl">
                Susun segitiga di sini
              </div>
              
              <!-- Draggable triangles -->
              <div
                ref="triangle1"
                :style="style1"
                class="absolute w-0 h-0 border-l-[80px] border-l-transparent border-b-[120px] border-b-red-500 cursor-move"
                style="left: 50px; top: 50px;"
              ></div>
              
              <div
                ref="triangle2"
                :style="style2"
                class="absolute w-0 h-0 border-l-[80px] border-l-transparent border-b-[120px] border-b-blue-500 cursor-move"
                style="left: 200px; top: 50px;"
              ></div>
              
              <div
                ref="triangle3"
                :style="style3"
                class="absolute w-0 h-0 border-l-[80px] border-l-transparent border-b-[120px] border-b-green-500 cursor-move"
                style="left: 50px; top: 220px;"
              ></div>
              
              <div
                ref="triangle4"
                :style="style4"
                class="absolute w-0 h-0 border-l-[80px] border-l-transparent border-b-[120px] border-b-yellow-500 cursor-move"
                style="left: 200px; top: 220px;"
              ></div>
            </div>
            
            <button
              @click="completePuzzle"
              class="mt-4 w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
            >
              Selesai Menyusun
            </button>
          </div>
        </div>

        <!-- Formula Visualization (Steps 3-5) -->
        <div v-if="currentStep >= 3 && currentStep <= 5" class="flex justify-center mb-8">
          <div 
            class="bg-white/95 rounded-2xl p-8 shadow-xl max-w-2xl w-full"
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :enter="{ opacity: 1, scale: 1, transition: { duration: 500 } }"
          >
            <div class="space-y-4 text-lg text-gray-800 font-mono">
              <div 
                v-if="currentStep >= 3"
                v-motion
                :initial="{ opacity: 0, x: -20 }"
                :enter="{ opacity: 1, x: 0, transition: { delay: 300 } }"
              >
                (a + b)² = 4(½ab) + c²
              </div>
              <div 
                v-if="currentStep >= 4"
                v-motion
                :initial="{ opacity: 0, x: -20 }"
                :enter="{ opacity: 1, x: 0, transition: { delay: 500 } }"
              >
                a² + 2ab + b² = 2ab + c²
              </div>
              <div 
                v-if="currentStep >= 5"
                v-motion
                :initial="{ opacity: 0, x: -20 }"
                :enter="{ opacity: 1, x: 0, transition: { delay: 700 } }"
                class="text-2xl font-bold text-purple-600"
              >
                a² + b² = c²
              </div>
            </div>
          </div>
        </div>

        <!-- Final Formula (Step 5) -->
        <div v-if="currentStep === 5" class="flex justify-center mb-8">
          <div 
            class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-12 shadow-2xl text-center"
            v-motion
            :initial="{ opacity: 0, scale: 0.5, rotate: -10 }"
            :enter="{ opacity: 1, scale: 1, rotate: 0, transition: { duration: 800, delay: 1000 } }"
          >
            <div class="text-6xl font-bold mb-4">a² + b² = c²</div>
            <div class="text-2xl">Teorema Pythagoras</div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center mt-12">
          <button
            v-if="currentStep > 0"
            @click="previousStep"
            class="px-6 py-3 bg-white text-teal-600 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            ← Kembali
          </button>
          <div v-else></div>

          <div class="flex gap-2">
            <div
              v-for="(_step, index) in steps"
              :key="index"
              class="w-3 h-3 rounded-full transition-all duration-200"
              :class="currentStep === index ? 'bg-white w-8' : 'bg-white/50'"
            ></div>
          </div>

          <button
            @click="nextStep"
            class="px-6 py-3 bg-white text-teal-600 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            {{ currentStep === steps.length - 1 ? 'Lanjut ke Contoh →' : 'Lanjut →' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
