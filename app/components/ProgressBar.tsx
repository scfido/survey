interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="mb-4">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{
            width: `${((current + 1) / total) * 100}%`
          }}
        />
      </div>
      <div className="text-center mt-2 text-sm text-gray-600">
        {current + 1} / {total}
      </div>
    </div>
  );
}