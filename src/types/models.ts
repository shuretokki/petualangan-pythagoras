// TypeScript interfaces for the application data model

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string; // Use nanoid or uuid for unique IDs within the array
  text: string;
  type: 'multiple-choice' | 'fill-in-the-blank';
  options: QuestionOption[];
}

export interface Quiz {
  id: string;
  moduleId: string; // Foreign key to modules collection
  title: string;
  questions: Question[]; // Questions are embedded in the quiz document
}
