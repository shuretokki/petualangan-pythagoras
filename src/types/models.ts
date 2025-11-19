// TypeScript interfaces for the application data model

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
  type: "multiple-choice"; // Simplified for this context
  options: QuestionOption[];
  correctAnswer: string; // Explicitly storing correct answer string for easier comparison
  difficulty: Difficulty;
  imageUrl?: string; // Optional image URL
}

export interface Quiz {
  id?: string;
  title: string;
  questions: Question[];
}
