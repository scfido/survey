import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { responseDb, surveyDb } from "~/lib/db.server";
import type { Survey, SurveyResponse } from "~/types";

export async function loader({ params }: LoaderFunctionArgs) {
    const surveyId = params.id;
    // TODO: Implement database fetch
    const survey = await surveyDb.getById(surveyId!);
    const responses = await responseDb.getBySurveyId(surveyId!);

    if (!survey) {
        throw redirect('/surveys');
    }

    return {
        survey: survey,
        responses: responses
    };
}

export default function SurveyResults() {
    const { survey, responses } = useLoaderData<typeof loader>();

    // Sort responses by score
    const sortedResponses = [...responses].sort((a, b) => b.score - a.score);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">{survey.title} - 结果</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">排行榜</h2>
                <div className="space-y-3">
                    {sortedResponses.map((response, index) => (
                        <div
                            key={response.id}
                            className="flex items-center justify-between p-3 bg-white rounded shadow"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-bold">
                                    {index + 1}
                                </span>
                                <span>{response.respondentName}</span>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">
                                    得分: {response.score} / {survey.questions.length}
                                </div>
                                <div className="text-sm text-gray-500">
                                    正确率: {((response.score / survey.questions.length) * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-2xl font-bold">{survey.questions.length}</div>
                    <div className="text-gray-600">总题数</div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <div className="text-2xl font-bold">{responses.length}</div>
                    <div className="text-gray-600">答题人数</div>
                </div>
            </div>

            <div className="mt-8">
                <button
                    onClick={() => {
                        // TODO: Implement WeChat sharing
                        console.log('Share survey');
                    }}
                    className="w-full bg-green-500 text-white py-3 rounded-lg"
                >
                    分享到微信
                </button>
            </div>
        </div>
    );
}