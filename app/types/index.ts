export type QuestionType = '2' | '3' | '4'; // 2/3/4 options

export interface Question {
  id: string;
  category: string;
  content: string;
  options: string[];
  correctAnswer: number;
  createdBy: string; // 'system' for admin-created, user ID for user-created
}

export interface Survey {
  id: string;
  title: string;
  createdBy: string;
  questions: Question[];
  createdAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentName: string;
  answers: {
    questionId: string;
    selectedAnswer: number;
  }[];
  score: number;
  completedAt: string;
}

export interface User {
  id: string;
  role: 'admin' | 'creator' | 'respondent';
  name: string;
}