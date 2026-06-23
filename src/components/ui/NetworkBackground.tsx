"use client";

import React from "react";

export function NetworkBackground() {
  // Predefined node positions for the network dot pattern
  const nodes = [
    { cx: 120, cy: 60 },
    { cx: 260, cy: 30 },
    { cx: 390, cy: 80 },
    { cx: 500, cy: 40 },
    { cx: 580, cy: 120 },
    { cx: 80, cy: 180 },
    { cx: 200, cy: 160 },
    { cx: 340, cy: 140 },
    { cx: 460, cy: 200 },
    { cx: 560, cy: 170 },
    { cx: 620, cy: 280 },
    { cx: 150, cy: 300 },
    { cx: 300, cy: 280 },
    { cx: 420, cy: 320 },
    { cx: 520, cy: 360 },
    { cx: 90, cy: 420 },
    { cx: 230, cy: 400 },
    { cx: 370, cy: 450 },
    { cx: 480, cy: 480 },
    { cx: 600, cy: 420 },
    { cx: 50, cy: 540 },
    { cx: 190, cy: 520 },
    { cx: 330, cy: 560 },
    { cx: 450, cy: 600 },
    { cx: 580, cy: 560 },
    { cx: 110, cy: 650 },
    { cx: 270, cy: 680 },
    { cx: 410, cy: 720 },
    { cx: 540, cy: 700 },
    { cx: 70, cy: 760 },
    { cx: 210, cy: 800 },
    { cx: 350, cy: 840 },
  ];

  // Edges between nearby nodes
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [1, 6], [2, 7], [3, 8], [4, 9],
    [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
    [5, 11], [6, 12], [7, 13], [8, 14], [9, 10],
    [11, 12], [12, 13], [13, 14], [14, 15],
    [11, 16], [12, 17], [13, 18], [14, 19],
    [16, 17], [17, 18], [18, 19],
    [16, 21], [17, 22], [18, 23], [19, 24],
    [20, 21], [21, 22], [22, 23], [23, 24],
    [21, 26], [22, 27], [23, 28],
    [25, 26], [26, 27], [27, 28],
    [26, 30], [27, 31],
    [29, 30], [30, 31],
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 640 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke="#D0D0D0"
          strokeWidth="0.8"
          opacity="0.6"
        />
      ))}
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r="4"
          fill="#C8C8C8"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}
