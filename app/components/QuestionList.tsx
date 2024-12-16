import { Form } from '@remix-run/react';
import type { Question } from '~/types';

interface QuestionListProps {
  questions: Question[];
}

export default function QuestionList({ questions }: QuestionListProps) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question.id} className="border p-4 rounded">
          <p className="font-medium">{question.content}</p>
          <div className="mt-2 space-y-1">
            {question.options.map((option, index) => (
              <p key={index} className="text-sm">
                {index + 1}. {option}
              </p>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Form method="post" className="inline">
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="questionId" value={question.id} />
              <button
                type="submit"
                className="text-red-500 text-sm hover:underline"
              >
                删除
              </button>
            </Form>
          </div>
        </div>
      ))}
    </div>
  );
}