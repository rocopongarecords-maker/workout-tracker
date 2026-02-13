const SimpleBarChart = ({ data, width = 320, height = 160, label }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-slate-500 text-sm" style={{ height }}>
        Not enough data yet
      </div>
    );
  }

  const padding = { top: 20, right: 10, bottom: 30, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values) || 1;

  const barWidth = Math.min(30, (chartW / data.length) * 0.7);
  const gap = (chartW - barWidth * data.length) / (data.length + 1);

  const barX = (i) => padding.left + gap + i * (barWidth + gap);
  const barH = (v) => (v / maxVal) * chartH;

  // Y-axis ticks
  const yTicks = [0, Math.round(maxVal / 2), Math.round(maxVal)];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        {data.map((d, i) => {
          const barColor = d.color || '#3b82f6';
          return (
            <linearGradient key={i} id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={barColor} stopOpacity="1" />
              <stop offset="100%" stopColor={barColor} stopOpacity="0.5" />
            </linearGradient>
          );
        })}
      </defs>

      {/* Grid lines */}
      {yTicks.map((tick, i) => {
        const y = padding.top + chartH - (tick / maxVal) * chartH;
        return (
          <g key={i}>
            <line
              x1={padding.left} y1={y}
              x2={width - padding.right} y2={y}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1"
            />
            <text x={padding.left - 5} y={y + 4} textAnchor="end" fill="#64748b" fontSize="9">
              {tick >= 1000 ? `${(tick / 1000).toFixed(0)}k` : tick}
            </text>
          </g>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const h = barH(d.value);
        const y = padding.top + chartH - h;
        return (
          <g key={i}>
            <rect
              x={barX(i)} y={y}
              width={barWidth} height={h}
              rx="4"
              fill={`url(#bar-grad-${i})`}
            />
            <text
              x={barX(i) + barWidth / 2} y={height - 5}
              textAnchor="middle" fill="#64748b" fontSize="9"
            >
              {d.label}
            </text>
          </g>
        );
      })}

      {/* Label */}
      {label && (
        <text x={padding.left} y={12} fill="#94a3b8" fontSize="10" fontWeight="600">
          {label}
        </text>
      )}
    </svg>
  );
};

export default SimpleBarChart;
