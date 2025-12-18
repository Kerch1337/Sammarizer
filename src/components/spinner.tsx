// src/components/Spinner.tsx
"use client";
import React from "react";

export default function Spinner({ size = 20 }: { size?: number }) {
  // »спользуем Tailwind + inline-style дл¤ рамки спиннера
  const border = Math.max(2, Math.round(size / 8));
  return (
    <div
      style={{
        width: size,
        height: size,
        borderWidth: border,
      }}
      className="rounded-full border-[color:var(--tw-border-opacity,1)] border-gray-200 border-t-blue-600 animate-spin"
      // tailwind: border-gray-200, border-t-blue-600, animate-spin
    />
  );
}
