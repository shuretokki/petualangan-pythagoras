import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Quiz, Question, Difficulty } from "@/types/models";

export const useQuizStore = defineStore("quiz", () => {
  // The full data loaded from DB
  const quizBank = ref<Quiz | null>(null);

  // The subset of questions for the current session
  const activeQuestions = ref<Question[]>([]);

  const currentQuestionIndex = ref(0);
  const userAnswers = ref<Map<string, string>>(new Map());
  const score = ref(0);
  const quizCompleted = ref(false);
  const currentDifficulty = ref<Difficulty | null>(null);

  // Computed properties now rely on activeQuestions
  const currentQuestion = computed(() => {
    if (
      !activeQuestions.value.length ||
      currentQuestionIndex.value >= activeQuestions.value.length
    ) {
      return null;
    }
    return activeQuestions.value[currentQuestionIndex.value];
  });

  const totalQuestions = computed(() => activeQuestions.value.length);

  const getUserAnswer = (questionId: string) => {
    return userAnswers.value.get(questionId);
  };

  // Load the full quiz bank (usually from Firebase)
  const loadQuizBank = (quiz: Quiz) => {
    quizBank.value = quiz;
  };

  // Start a session: Filter -> Shuffle -> Slice(5)
  const startQuizSession = (difficulty: Difficulty) => {
    if (!quizBank.value || !quizBank.value.questions) return;

    currentDifficulty.value = difficulty;

    // 1. Filter by difficulty
    const filtered = quizBank.value.questions.filter(
      (q) => q.difficulty === difficulty,
    );

    // 2. Shuffle (Fisher-Yates algorithm)
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 3. Limit to 5
    activeQuestions.value = shuffled.slice(0, 5);

    // Reset state
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
    if (activeQuestions.value.length === 0) return;

    let correctCount = 0;
    activeQuestions.value.forEach((question) => {
      const userAnswer = userAnswers.value.get(question.id);
      if (userAnswer && userAnswer === question.correctAnswer) {
        correctCount++;
      }
    });

    score.value = Math.round((correctCount / totalQuestions.value) * 100);
  };

  const resetQuiz = () => {
    // When restarting, we might want to re-shuffle or keep same.
    // Usually "Try Again" means same level, new questions if available.
    if (currentDifficulty.value) {
      startQuizSession(currentDifficulty.value);
    } else {
      // Fallback
      currentQuestionIndex.value = 0;
      userAnswers.value = new Map();
      score.value = 0;
      quizCompleted.value = false;
    }
  };

  return {
    quizBank,
    activeQuestions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    userAnswers,
    score,
    quizCompleted,
    loadQuizBank,
    startQuizSession,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    getUserAnswer,
  };
});
