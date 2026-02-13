const SimpleLineChart = ({ data, width = 320, height = 180, color = '#3b82f6', label }) => {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center text-slate-500 text-sm" style={{ height }}>
        Not enough data yet
      </div>
    );
  }

  const padding = { top: 20, right: 15, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = data.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const scaleX = (i) => padding.left + (i / (data.length - 1)) * chartW;
  const scaleY = (v) => padding.top + chartH - ((v - minVal) / range) * chartH;

  const pathD = data.map((d, i) =>
    `${i === 0 ? 'M' : 'L'} ${scaleX(i).toFixed(1)} ${scaleY(d.value).toFixed(1)}`
  ).join(' ');

  // Y-axis labels (3 ticks)
  const yTicks = [minVal, minVal + range / 2, maxVal];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {yTicks.map((tick, i) => (
        <g key={i}>
          <line
            x1={padding.left} y1={scaleY(tick)}
            x2={width - padding.right} y2={scaleY(tick)}
            stroke="#334155" strokeWidth="1" strokeDasharray="4 4"
          />
          <text
            x={padding.left - 5} y={scaleY(tick) + 4}
            textAnchor="end" fill="#64748b" fontSize="10"
          >
            {Math.round(tick)}
          </text>
        </g>
      ))}

      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {data.map((d, i) => (
        <circle
          key={i}
          cx={scaleX(i)} cy={scaleY(d.value)}
          r="3.5" fill={color} stroke="#0f172a" strokeWidth="1.5"
        />
      ))}

      {/* X labels */}
      {data.map((d, i) => {
        // Show every other label if too many
        if (data.length > 8 && i % 2 !== 0 && i !== data.length - 1) return null;
        return (
          <text
            key={i}
            x={scaleX(i)} y={height - 5}
            textAnchor="middle" fill="#64748b" fontSize="9"
          >
            {d.label}
          </text>
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

export default SimpleLineChart;
