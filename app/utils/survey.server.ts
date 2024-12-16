import { questionDb } from '~/lib/db.server';
import type { Question, Survey, SurveyResponse } from '~/types';

export function calculateScore(
  questions: Question[],
  answers: { questionId: string; selectedAnswer: number }[]
): number {
  return answers.reduce((score, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.selectedAnswer) {
      return score + 1;
    }
    return score;
  }, 0);
}

export function formatQuestionFormData(formData: FormData): Omit<Question, 'id'> {
  const category = formData.get('category') as string;
  const type = formData.get('type') as string;
  const content = formData.get('content') as string;
  const options: string[] = [];

  for (let i = 1; i <= Number(type); i++) {
    const option = formData.get(`option${i}`);
    if (option) options.push(option as string);
  }

  return {
    category,
    content,
    options,
    correctAnswer: Number(formData.get('correctAnswer')) - 1,
    createdBy: 'system'
  };
}

export async function formatSurveyFormData(
  formData: FormData
): Promise<Omit<Survey, 'id' | 'createdAt'>> {
  const title = formData.get('title') as string;
  const selectedQuestionIds = formData.getAll('questions[]') as string[];
  // TODO: get questions from db
  const questions = await questionDb.getAll();
  const selectedQuestions = questions.filter(q => 
    selectedQuestionIds.includes(q.id)
  );

  return {
    title,
    questions: selectedQuestions,
    createdBy: 'system' // TODO: Replace with actual user ID
  };
}