import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function DetectionGauge({ aiScore, humanScore, confidence, risk }) {
  const data = [
    { name: "AI", value: aiScore },
    { name: "Human", value: 100 - aiScore }
  ];

  // Menentukan warna badge tingkat risiko
  const getRiskBadge = (r) => {
    if (r === "Tinggi") return "bg-rose-50 text-rose-700 border-rose-200";
    if (r === "Sedang") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const getConfidenceColor = (c) => {
    if (c >= 85) return "text-emerald-600";
    if (c >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Skor Probabilitas AI</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Gauge Chart Bulat */}
        <div className="relative w-full h-40 mx-auto flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={65}
                startAngle={180}
                endAngle={0}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#f97316" /> {/* Orange AI */}
                <Cell fill="#cbd5e1" /> {/* Gray/Slate */}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute text-center mt-6">
            <span className="text-3xl font-black text-slate-900">{aiScore}%</span>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mt-0.5">Indikasi AI</p>
          </div>
        </div>

        {/* Informasi Ringkasan */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Tulisan Manusia</span>
            <span className="text-sm font-bold text-slate-800">{humanScore}%</span>
          </div>
          
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Confidence Score</span>
            <span className={`text-sm font-bold ${getConfidenceColor(confidence)}`}>{confidence}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Indikasi AI</span>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${getRiskBadge(risk)}`}>
              {risk}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}