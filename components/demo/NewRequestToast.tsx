"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox } from "lucide-react";

export function NewRequestToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 18000);
    const h = setTimeout(() => setVisible(false), 28000);
    return () => {
      clearTimeout(t);
      clearTimeout(h);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 hairline border bg-white shadow-lg p-4 max-w-xs z-50"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[var(--scholpp-red)] text-white flex items-center justify-center shrink-0">
              <Inbox size={16} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-1">
                Neue Anfrage
              </div>
              <div className="text-[13px] font-semibold leading-snug">
                REQ-2026-0413 · Dortmund, 3 Monteure
              </div>
              <div className="text-[12px] text-[var(--muted-foreground)] mt-1">
                Agent übernimmt automatisch
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
