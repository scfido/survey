import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { categoryDb, questionDb, surveyDb } from "~/lib/db.server";
import type { Question } from "~/types";
import { formatSurveyFormData } from "~/utils/survey.server";

export async function loader() {
  const categories = await categoryDb.getAll();
  const questions = await questionDb.getAll();

  return {
    categories,
    questions
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const survey = await formatSurveyFormData(formData);
  const createdSurvey = await surveyDb.create(survey);
  
  return redirect(`/surveys/${createdSurvey.id}/answer`);
}

export default function CreateSurvey() {
  const { categories, questions } = useLoaderData<typeof loader>();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const filteredQuestions = questions.filter(q => q.category === selectedCategory);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">创建问卷</h1>

      <Form method="post" className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">问卷标题</label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">选择类别</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">选择题目</h2>
          <div className="space-y-3">
            {filteredQuestions.map(question => (
              <label key={question.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="questions[]"
                  value={question.id}
                  checked={selectedQuestions.includes(question.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedQuestions([...selectedQuestions, question.id]);
                    } else {
                      setSelectedQuestions(
                        selectedQuestions.filter(id => id !== question.id)
                      );
                    }
                  }}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">{question.content}</p>
                  <div className="mt-1 text-sm text-gray-600">
                    {question.options.map((option, index) => (
                      <p key={index}>{index + 1}. {option}</p>
                    ))}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={selectedQuestions.length === 0}
        >
          创建问卷
        </button>
      </Form>
    </div>
  );
}