import { JsonDB, Config } from 'node-json-db';
import { v4 as uuidv4 } from 'uuid';
import type { Question, Survey, SurveyResponse, User } from '~/types';

const db = new JsonDB(new Config("myDatabase", true, false, '/'));

// Initialize database with default data if empty
export async function initializeDb() {
    await db.getData("/");
    if (!await db.exists("/questions")) {
        await db.push("/questions", []);
    }
    if (!await db.exists("/surveys")) {
        await db.push("/surveys", []);
    }
    if (!await db.exists("/responses")) {
        await db.push("/responses", []);
    }
    if (!await db.exists("/users")) {
        await db.push("/users", []);
    }
    if (!await db.exists("/categories")) {
        await db.push("/categories", ['General', 'Science', 'History']);
    }
}

initializeDb();

export const questionDb = {
    async getAll(): Promise<Question[]> {
        return db.getData("/questions") || [];
    },

    async getByCategory(category: string): Promise<Question[]> {
        const questions = await this.getAll();
        return questions.filter(q => q.category === category);
    },

    async create(question: Omit<Question, 'id'>): Promise<Question> {
        const questions = await this.getAll();
        const newQuestion = { ...question, id: uuidv4() };
        await db.push("/questions", [...questions, newQuestion]);
        return newQuestion;
    },

    async delete(id: string): Promise<void> {
        const questions = await this.getAll();
        await db.push("/questions", questions.filter(q => q.id !== id));
    }
};

export const surveyDb = {
    async getAll(): Promise<Survey[]> {
        return db.getData("/surveys") || [];
    },

    async getById(id: string): Promise<Survey | null> {
        const surveys = await this.getAll();
        return surveys.find(s => s.id === id) || null;
    },

    async create(survey: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> {
        const surveys = await this.getAll();
        const newSurvey = {
            ...survey,
            id: uuidv4(),
            createdAt: new Date().toISOString()
        };
        await db.push("/surveys", [...surveys, newSurvey]);
        return newSurvey;
    }
};

export const responseDb = {
    async getBySurveyId(surveyId: string): Promise<SurveyResponse[]> {
        const responses = await db.getData("/responses") || [];
        return responses.filter(r => r.surveyId === surveyId);
    },

    async create(response: Omit<SurveyResponse, 'id' | 'completedAt'>): Promise<SurveyResponse> {
        const responses = await db.getData("/responses") || [];
        const newResponse = {
            ...response,
            id: uuidv4(),
            completedAt: new Date().toISOString()
        };
        await db.push("/responses", [...responses, newResponse]);
        return newResponse;
    }
};

export const categoryDb = {
    async getAll(): Promise<string[]> {
        return db.getData("/categories") || [];
    }
};