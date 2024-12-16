import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { categoryDb, questionDb } from "~/lib/db.server";
import { formatQuestionFormData } from "~/utils/survey.server";

export async function loader() {
  const questions = await questionDb.getAll();
  const categories = await categoryDb.getAll();

  return {
    questions,
    categories
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create": {
      const question = formatQuestionFormData(formData);
      await questionDb.create(question);
      break;
    }
    case "update": {
      const question = formatQuestionFormData(formData);
      await questionDb.create(question);
      break;
    }
    case "delete": {
      const questionId = formData.get("questionId");
      await questionDb.delete(questionId as string);
      break;
    }
  }

  return null;
}

export default function AdminQuestions() {
  const { questions, categories } = useLoaderData<typeof loader>();
  const [selectedType, setSelectedType] = useState<'2' | '3' | '4'>('4');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">题库管理</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">添加新题目</h2>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="create" />

          <div>
            <label className="block text-sm font-medium mb-1">类别</label>
            <select
              name="category"
              className="w-full p-2 border rounded"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">选项数量</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as '2' | '3' | '4')}
              name="type"
              className="w-full p-2 border rounded"
            >
              <option value="2">两项</option>
              <option value="3">三项</option>
              <option value="4">四项</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">题目内容</label>
            <textarea
              name="content"
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          {Array.from({ length: Number(selectedType) }).map((_, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">
                选项 {index + 1}
              </label>
              <input
                type="text"
                name={`option${index + 1}`}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">正确答案</label>
            <select
              name="correctAnswer"
              className="w-full p-2 border rounded"
            >
              {Array.from({ length: Number(selectedType) }).map((_, index) => (
                <option key={index} value={index + 1}>
                  选项 {index + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            添加题目
          </button>
        </Form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">现有题目</h2>
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
      </div>
    </div>
  );
}