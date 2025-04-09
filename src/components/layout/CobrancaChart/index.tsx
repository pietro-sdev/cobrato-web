"use client";

import { useState } from "react";

const chartData = [
  { month: "Jan", pagas: 350, emitidas: 620 },
  { month: "Fev", pagas: 300, emitidas: 480 },
  { month: "Mar", pagas: 450, emitidas: 800 },
  { month: "Abr", pagas: 390, emitidas: 590 },
  { month: "Mai", pagas: 180, emitidas: 250 },
  { month: "Jun", pagas: 320, emitidas: 740 },
  { month: "Jul", pagas: 310, emitidas: 620 },
  { month: "Ago", pagas: 470, emitidas: 800 },
  { month: "Set", pagas: 360, emitidas: 500 },
  { month: "Out", pagas: 200, emitidas: 290 },
  { month: "Nov", pagas: 390, emitidas: 680 },
  { month: "Dez", pagas: 270, emitidas: 430 },
];

export function CobrancaChart() {
  const maxValue = Math.max(...chartData.map(d => d.pagas + d.emitidas));

  const [tooltip, setTooltip] = useState<{
    left: number;
    top: number;
    content: string;
    visible: boolean;
  }>({ left: 0, top: 0, content: "", visible: false });

  return (
    <div className="relative w-full rounded-lg border border-[#E4E4E4] bg-white p-6">
      <h3 className="text-lg font-semibold mb-6">Evolução do Volume de Cobranças</h3>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#3C50E0] rounded-sm" />
          <span className="text-gray-700">Cobranças Pagas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#dbe3ff] rounded-sm" />
          <span className="text-gray-700">Cobranças Emitidas</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-4 h-64 relative">
        {chartData.map((item, idx) => {
          const total = item.pagas + item.emitidas;
          const pagasHeight = (item.pagas / maxValue) * 100;
          const emitidasHeight = (item.emitidas / maxValue) * 100;

          return (
            <div
              key={idx}
              className="flex flex-col items-center group relative w-full cursor-pointer"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  left: rect.left + rect.width / 2,
                  top: rect.top,
                  content: `Pagas: ${item.pagas}\nEmitidas: ${item.emitidas}`,
                  visible: true,
                });
              }}
              onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
            >
              {/* Barras empilhadas */}
              <div className="relative w-full h-full flex flex-col-reverse">
                <div
                  className="bg-[#3C50E0] rounded-t"
                  style={{ height: `${pagasHeight}%` }}
                />
                <div
                  className="bg-[#dbe3ff] rounded-t"
                  style={{ height: `${emitidasHeight}%` }}
                />
              </div>
              <span className="text-xs mt-2 text-gray-700">{item.month}</span>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute bg-black text-white text-xs px-3 py-1 rounded shadow-md pointer-events-none z-50 whitespace-pre"
          style={{ left: tooltip.left, top: tooltip.top - 40, transform: 'translateX(-50%)' }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
