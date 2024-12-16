import { Link, useLoaderData } from "@remix-run/react";
import { surveyDb, initializeDb } from "~/lib/db.server";

export async function loader() {
  console.log("loader");
  await initializeDb();
  const surveys = await surveyDb.getAll();

  return {
    surveys
  };
}

export default function Index() {
  const { surveys } = useLoaderData<typeof loader>();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">调查问卷系统</h1>
        <Link
          to="/surveys/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          创建问卷
        </Link>
      </div>

      <div className="space-y-4">
        {surveys.map((survey) => (
          <div key={survey.id} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{survey.title}</h2>
            <div className="mt-2 text-sm text-gray-600">
              题目数量: {survey.questions.length}
            </div>
            <div className="mt-4 flex gap-4">
              <Link
                to={`/surveys/${survey.id}`}
                className="text-blue-500 hover:underline"
              >
                查看结果
              </Link>
              <Link
                to={`/surveys/${survey.id}/answer`}
                className="text-green-500 hover:underline"
              >
                参与答题
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}