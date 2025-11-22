export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface QuestionOption {
  text: string;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  text: string;
  type: "multiple-choice";
  options: QuestionOption[];
  correctAnswer: string;
  difficulty: Difficulty;
  imageUrl?: string;
}

export interface Quiz {
  id?: string;
  title: string;
  questions: Question[];
}
