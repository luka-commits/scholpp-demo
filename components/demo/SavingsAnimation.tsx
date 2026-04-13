"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { formatEur } from "@/lib/utils";

export function SavingsAnimation({ target }: { target: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  // 7 coins dropping into bucket
  const coins = Array.from({ length: 8 });

  return (
    <div className="relative hairline border bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border)] text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
        Kumulierte Jahres-Ersparnis
      </div>
      <div className="relative h-[220px] flex items-center justify-center">
        {/* Animated counter */}
        <div className="relative z-10 text-center">
          <div className="font-mono text-[10px] tracking-wider text-[var(--muted-foreground)] mb-1">
            € GESPART PRO JAHR
          </div>
          <div className="text-[52px] font-bold tracking-[-0.03em] leading-none">
            {formatEur(value)}
          </div>
        </div>

        {/* Coin animations — left side */}
        <div className="absolute left-10 top-0 bottom-0 w-32 pointer-events-none">
          {coins.map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -30, x: 0, opacity: 0, rotate: 0 }}
              animate={{
                y: 180,
                x: 35 + (i % 3) * 10,
                opacity: [0, 1, 1, 0.8],
                rotate: 360 * 2,
              }}
              transition={{
                duration: 1.8,
                delay: 0.1 + i * 0.18,
                repeat: Infinity,
                repeatDelay: 0.4,
                ease: "easeIn",
              }}
              className="absolute top-0 w-6 h-6 rounded-full bg-[#f5c242] border-2 border-[#c89a2a] shadow-md flex items-center justify-center text-[10px] font-bold text-[#8a6a10]"
            >
              €
            </motion.div>
          ))}
        </div>

        {/* Bucket / stack — right side */}
        <div className="absolute right-10 bottom-4 w-24 h-20 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 flex flex-col-reverse items-center gap-[1px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.25, duration: 0.3 }}
                className="h-[8px] rounded-sm bg-[#f5c242] border border-[#c89a2a]"
                style={{ width: `${64 - i * 4}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
