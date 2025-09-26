// components/PitchGraph.tsx
import React from "react";
import { splitIntoMora } from "../utils/mora";

interface PitchGraphProps {
  reading: string;
  pattern: string[]; // e.g. ["L","H","H","(L)"]
}

export const PitchGraph: React.FC<PitchGraphProps> = ({ reading, pattern }) => {
  const morae = splitIntoMora(reading);

  const step = 40;
  const padding = 20; // left/right padding
  const height = 80;
  const width = step * (morae.length - 1) + padding * 2;

  const yForPitch = (p: string) => (p === "H" ? 10 : 45);

  // shift each point by padding
  const points = pattern
    .map((p, i) => `${i * step + padding},${yForPitch(p)}`)
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      className="border border-gray-300 rounded bg-white"
    >
      {/* baseline */}
      <line x1={0} y1={45} x2={width} y2={45} stroke="#ccc" />

      {/* pitch polyline */}
      <polyline fill="none" stroke="black" strokeWidth={2} points={points}/>

      {/* dots at each mora */}
      {pattern.map((p, i) => (
        <circle
          key={i}
          cx={i * step + padding}
          cy={yForPitch(p)}
          r={5} // radius of the dot
          fill="black"
        />
      ))}

      {/* mora labels */}
      {morae.map((m, i) => (
        <text
          key={i}
          x={i * step + padding}
          y={height - 10}
          textAnchor="middle"
          fontSize="14"
        >
          {m}
        </text>
      ))}
    </svg>
  );
};