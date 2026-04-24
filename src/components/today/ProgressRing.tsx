interface Props {
  done: number;
  total: number;
  color: 'green' | 'violet';
  size?: number;
}

export function ProgressRing({ done, total, color, size = 56 }: Props) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const rate = total === 0 ? 0 : done / total;
  const offset = circumference * (1 - rate);

  const stroke = color === 'green' ? '#16a34a' : '#7c3aed';
  const trackStroke = color === 'green' ? '#bbf7d0' : '#ddd6fe';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackStroke}
        strokeWidth={6}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={stroke}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
    </svg>
  );
}
