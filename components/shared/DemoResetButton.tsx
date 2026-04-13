"use client";

import { RotateCcw } from "lucide-react";

export function DemoResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      onClick={onReset}
      className="fixed top-20 right-6 z-40 inline-flex items-center gap-2 bg-white hairline border px-3 h-9 text-[12px] font-semibold hover:bg-[var(--muted)]"
    >
      <RotateCcw size={12} />
      Demo zurücksetzen
    </button>
  );
}
