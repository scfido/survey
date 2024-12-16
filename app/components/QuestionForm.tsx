import { useState } from 'react';
import type { QuestionType } from '~/types';

interface QuestionFormProps {
  categories: string[];
}

export default function QuestionForm({ categories }: QuestionFormProps) {
  const [selectedType, setSelectedType] = useState<QuestionType>('4');

  return (
    <div className="space-y-4">
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
          onChange={(e) => setSelectedType(e.target.value as QuestionType)}
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
          required
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
            required
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
    </div>
  );
}