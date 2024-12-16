import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { responseDb, surveyDb } from "~/lib/db.server";
import type { Survey } from "~/types";

export async function loader({ params }: LoaderFunctionArgs) {
  const surveyId = params.id;
  const survey = await surveyDb.getById(surveyId!);

  if (!survey) {
    throw Response.json({ error: "Survey not found" }, { status: 404 });
  }

  return {
    survey
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const surveyId = params.id;
  const formData = await request.formData();
  const answers = formData.get("answers");
  const name = formData.get("name");
  
  await responseDb.create({
    surveyId: surveyId!,
    answers: answers,
    name: name
  });

  return null;
}

export default function AnswerSurvey() {
  const { survey } = useLoaderData<typeof loader>();
  console.log("survey", survey);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState('');

  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const question = survey.questions[currentQuestion];
  const isLastQuestion = currentQuestion === survey.questions.length - 1;
  const hasAnsweredCurrent = answers[currentQuestion] !== undefined;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">{survey.title}</h1>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{
              width: `${((currentQuestion + 1) / survey.questions.length) * 100}%`
            }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          {currentQuestion + 1} / {survey.questions.length}
        </div>
      </div>

      {question && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">{question.content}</h2>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-3 text-left rounded border ${answers[currentQuestion] === index
                    ? 'bg-blue-50 border-blue-500'
                    : 'border-gray-300'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLastQuestion && hasAnsweredCurrent && (
        <Form method="post" className="space-y-4">
          <input
            type="hidden"
            name="answers"
            value={JSON.stringify(answers)}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              请输入您的名字
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            提交答案
          </button>
        </Form>
      )}
    </div>
  );
}