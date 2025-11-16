import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Quiz, Question } from '@/types/models';

export const useQuizStore = defineStore('quiz', () => {
  const currentQuiz = ref<Quiz | null>(null);
  const currentQuestionIndex = ref(0);
  const userAnswers = ref<Map<string, string>>(new Map());
  const score = ref(0);
  const quizCompleted = ref(false);

  const currentQuestion = computed(() => {
    if (!currentQuiz.value || currentQuestionIndex.value >= currentQuiz.value.questions.length) {
      return null;
    }
    return currentQuiz.value.questions[currentQuestionIndex.value];
  });

  const totalQuestions = computed(() => {
    return currentQuiz.value?.questions.length || 0;
  });

  const loadQuiz = (quiz: Quiz) => {
    currentQuiz.value = quiz;
    currentQuestionIndex.value = 0;
    userAnswers.value = new Map();
    score.value = 0;
    quizCompleted.value = false;
  };

  const selectAnswer = (questionId: string, answer: string) => {
    userAnswers.value.set(questionId, answer);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++;
    } else {
      calculateFinalScore();
      quizCompleted.value = true;
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  };

  const calculateFinalScore = () => {
    if (!currentQuiz.value) return;

    let correctCount = 0;
    currentQuiz.value.questions.forEach((question: Question) => {
      const userAnswer = userAnswers.value.get(question.id);
      const correctOption = question.options.find((opt) => opt.isCorrect);
      
      if (userAnswer && correctOption && userAnswer === correctOption.text) {
        correctCount++;
      }
    });

    score.value = Math.round((correctCount / totalQuestions.value) * 100);
  };

  const resetQuiz = () => {
    currentQuestionIndex.value = 0;
    userAnswers.value = new Map();
    score.value = 0;
    quizCompleted.value = false;
  };

  const getUserAnswer = (questionId: string) => {
    return userAnswers.value.get(questionId);
  };

  return {
    currentQuiz,
    currentQuestionIndex,
    userAnswers,
    score,
    quizCompleted,
    currentQuestion,
    totalQuestions,
    loadQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    calculateFinalScore,
    resetQuiz,
    getUserAnswer
  };
});
