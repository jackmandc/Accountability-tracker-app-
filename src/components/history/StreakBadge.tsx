interface Props {
  current: number;
  best: number;
}

export function StreakBadge({ current, best }: Props) {
  return (
    <div className="flex gap-3 justify-center">
      <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-center">
        <div className="text-2xl font-bold text-orange-500">{current}</div>
        <div className="text-xs text-gray-500">day streak</div>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-center">
        <div className="text-2xl font-bold text-gray-700">{best}</div>
        <div className="text-xs text-gray-500">best streak</div>
      </div>
    </div>
  );
}
