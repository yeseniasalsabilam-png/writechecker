import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AnalyticsDashboard({
  radarData = [],
  pieData = [],
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Radar Chart */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
          Dimensi Kompleksitas Tulisan
        </h4>

        <div className="w-full h-56 text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              radius="70%"
              data={Array.isArray(radarData) ? radarData : []}
            >
              <PolarGrid stroke="#e2e8f0" />

              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#64748b", fontSize: 10 }}
              />

              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "#cbd5e1" }}
              />

              <Radar
                name="Skor Metrik"
                dataKey="A"
                stroke="#4f46e5"
                fill="#818cf8"
                fillOpacity={0.3}
                isAnimationActive={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
          Proporsi Klaster Konten
        </h4>

        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={Array.isArray(pieData) ? pieData : []}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={4}
                dataKey="value"
                isAnimationActive={false}
              >
                {Array.isArray(pieData) &&
                  pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || "#6366f1"}
                    />
                  ))}
              </Pie>

              <Legend
                verticalAlign="bottom"
                height={36}
                iconSize={10}
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}