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
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const dataRange = dataMax - dataMin;
  // Tight scaling: at least 1 unit of padding so small changes are visible
  const pad = Math.max(dataRange * 0.15, 1);
  const minVal = dataMin - pad;
  const maxVal = dataMax + pad;
  const range = maxVal - minVal || 1;

  const scaleX = (i) => padding.left + (i / (data.length - 1)) * chartW;
  const scaleY = (v) => padding.top + chartH - ((v - minVal) / range) * chartH;

  const pathD = data.map((d, i) =>
    `${i === 0 ? 'M' : 'L'} ${scaleX(i).toFixed(1)} ${scaleY(d.value).toFixed(1)}`
  ).join(' ');

  // Gradient fill area path
  const areaD = pathD +
    ` L ${scaleX(data.length - 1).toFixed(1)} ${(padding.top + chartH).toFixed(1)}` +
    ` L ${scaleX(0).toFixed(1)} ${(padding.top + chartH).toFixed(1)} Z`;

  const gradientId = `gradient-${label?.replace(/\s+/g, '-') || 'default'}`;

  // Y-axis labels (5 ticks for better granularity)
  const yTicks = Array.from({ length: 5 }, (_, i) => minVal + (range * i) / 4);
  const useDecimal = dataRange < 5;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((tick, i) => (
        <g key={i}>
          <line
            x1={padding.left} y1={scaleY(tick)}
            x2={width - padding.right} y2={scaleY(tick)}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1"
          />
          <text
            x={padding.left - 5} y={scaleY(tick) + 4}
            textAnchor="end" fill="#64748b" fontSize="10"
          >
            {useDecimal ? tick.toFixed(1) : Math.round(tick)}
          </text>
        </g>
      ))}

      {/* Gradient fill */}
      <path d={areaD} fill={`url(#${gradientId})`} />

      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {data.map((d, i) => (
        <circle
          key={i}
          cx={scaleX(i)} cy={scaleY(d.value)}
          r={i === data.length - 1 ? '5' : '3'}
          fill={color}
          stroke="#0f172a"
          strokeWidth="2"
          style={i === data.length - 1 ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined}
        />
      ))}

      {/* X labels */}
      {data.map((d, i) => {
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
