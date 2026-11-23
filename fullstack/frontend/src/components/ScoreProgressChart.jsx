import React, { useState } from 'react';
import { TrendingUp, Calendar, Award, Sparkles, HelpCircle } from 'lucide-react';

export default function ScoreProgressChart({ history = [], currentSimScore = null }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // If no history exists, provide "belum ada asesmen tercatat" state
  if (!history || history.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3 transition-colors">
        <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
          <Calendar className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 dark:text-white text-base">
          Belum ada asesmen tercatat
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Selesaikan asesmen belajarmu untuk mulai mencatat riwayat progres nilai Anda di sini.
        </p>
      </div>
    );
  }

  // Ensure points are sorted by timestamp
  const sortedHistory = [...history].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  // Chart configuration
  const width = 640;
  const height = 230;
  const padLeft = 55;
  const padRight = 35;
  const padTop = 25;
  const padBottom = 45;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Y Axis fixed from 0 to 100
  const minY = 0;
  const maxY = 100;
  const yTicks = [0, 25, 50, 75, 100];

  function getY(score) {
    const clamped = Math.max(0, Math.min(100, score));
    return padTop + chartH - (clamped / maxY) * chartH;
  }

  // Calculate coordinates for points
  const points = sortedHistory.map((item, idx) => {
    let x;
    if (sortedHistory.length === 1) {
      x = padLeft + chartW / 2;
    } else {
      x = padLeft + (idx / (sortedHistory.length - 1)) * chartW;
    }
    const y = getY(item.score);
    return {
      ...item,
      x,
      y,
      idx
    };
  });

  // Build SVG path
  let pathD = '';
  if (points.length === 1) {
    pathD = `M ${points[0].x - 30} ${points[0].y} L ${points[0].x + 30} ${points[0].y}`;
  } else {
    pathD = points.reduce((acc, pt, idx) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      // Smooth curve
      const prev = points[idx - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, '');
  }

  // Area fill path
  let areaD = '';
  if (points.length === 1) {
    areaD = `M ${points[0].x - 30} ${points[0].y} L ${points[0].x + 30} ${points[0].y} L ${points[0].x + 30} ${padTop + chartH} L ${points[0].x - 30} ${padTop + chartH} Z`;
  } else {
    const first = points[0];
    const last = points[points.length - 1];
    areaD = `${pathD} L ${last.x} ${padTop + chartH} L ${first.x} ${padTop + chartH} Z`;
  }

  // Delta score
  const firstScore = sortedHistory[0].score;
  const lastScore = sortedHistory[sortedHistory.length - 1].score;
  const diffScore = lastScore - firstScore;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Grafik Progres Skor Asesmen
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Riwayat perkembangan estimasi nilai belajar Anda berdasarkan tanggal pelaksanaan asesmen
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {diffScore > 0 ? (
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +{diffScore} Poin Meningkat
            </span>
          ) : diffScore < 0 ? (
            <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-bold">
              {diffScore} Poin
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
              Skor Stabil
            </span>
          )}
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            • {sortedHistory.length} Asesmen
          </span>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative w-full overflow-hidden">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto max-h-64 overflow-visible font-sans"
        >
          <defs>
            <linearGradient id="progressAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="progressLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and Y-axis Labels (Skor) */}
          {yTicks.map(tick => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] font-semibold fill-slate-400 dark:fill-slate-500"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Y-axis Title */}
          <text
            x={12}
            y={padTop + chartH / 2}
            textAnchor="middle"
            transform={`rotate(-90 12 ${padTop + chartH / 2})`}
            className="text-[10px] font-bold tracking-wider fill-slate-400 dark:fill-slate-500 uppercase"
          >
            Skor Nilai
          </text>

          {/* Area under curve */}
          <path
            d={areaD}
            fill="url(#progressAreaGradient)"
          />

          {/* Curved Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#progressLineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Sumbu X (Tanggal Saja) */}
          {points.map((pt) => {
            const isHovered = hoveredPoint?.idx === pt.idx;
            return (
              <g key={pt.idx} className="cursor-pointer">
                {/* X-axis date label below (SUMBU X TANGGAL SAJA) */}
                <text
                  x={pt.x}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-bold transition-all ${
                    isHovered 
                      ? 'fill-indigo-600 dark:fill-indigo-400 font-extrabold' 
                      : 'fill-slate-600 dark:fill-slate-400'
                  }`}
                >
                  {pt.date}
                </text>

                {/* Vertical subtle indicator line on point */}
                <line
                  x1={pt.x}
                  y1={pt.y}
                  x2={pt.x}
                  y2={padTop + chartH}
                  stroke="currentColor"
                  strokeDasharray="2 2"
                  className={`transition-colors ${isHovered ? 'text-indigo-400 dark:text-indigo-500' : 'text-slate-200 dark:text-slate-800'}`}
                  strokeWidth="1"
                />

                {/* Score badge above node */}
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  className="text-[11px] font-black fill-indigo-600 dark:fill-indigo-400"
                >
                  {pt.score}
                </text>

                {/* Outer Glow Ring on Hover */}
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill="#6366f1"
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Node Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 5.5}
                  fill="#ffffff"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  className="transition-all duration-200 drop-shadow-md"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* Invisible hover target */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="20"
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip when hovered */}
        {hoveredPoint && (
          <div 
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-xl text-xs space-y-0.5 border border-slate-700 animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`
            }}
          >
            <div className="font-bold flex items-center gap-1.5 text-indigo-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tanggal: {hoveredPoint.date}</span>
            </div>
            <div className="text-white font-extrabold text-sm">
              Skor: {hoveredPoint.score} / 100
            </div>
            <div className="text-[10px] text-slate-300">
              Kategori: {hoveredPoint.category || 'Terverifikasi'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
