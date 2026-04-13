"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <section className="relative bg-white overflow-hidden" style={{ height: "calc(100vh - 4rem)" }}>
      <video
        src="/hero.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        onEnded={(e) => {
          e.currentTarget.pause();
          setVideoEnded(true);
        }}
      />

      <AnimatePresence>
        {videoEnded && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent md:from-white/95 md:via-white/60 md:to-transparent" />

            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                    className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold mb-8"
                  >
                    <span className="w-8 h-px bg-[var(--scholpp-red)]" />
                    Live-Demo · Reisekoordinator
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="font-sans text-[44px] md:text-[60px] lg:text-[72px] leading-[1.02] tracking-[-0.025em] font-bold text-[var(--foreground)]"
                  >
                    Einsatz-Reisen planen
                    <br />
                    <span className="text-[var(--scholpp-red)]">in 2 Minuten</span>
                    <span className="text-[var(--muted-foreground)] font-light"> statt 45.</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mt-8 max-w-lg text-[17px] leading-[1.55] text-[var(--muted-foreground)]"
                  >
                    Ein digitaler Agent recherchiert Hotels, vergleicht Fahrzeuge
                    und prüft die Betriebsordnung. Der Projektleiter klickt nur
                    noch auf Freigeben.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85, duration: 0.6 }}
                    className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                  >
                    <Link
                      href="/demo"
                      className="inline-flex items-center gap-2 bg-[var(--scholpp-red)] hover:bg-[var(--scholpp-red-hover)] text-white px-8 h-14 font-semibold text-[15px] transition-colors"
                    >
                      Agent jetzt testen
                      <ArrowRight size={18} />
                    </Link>
                    <span className="text-[13px] text-[var(--muted-foreground)]">
                      3 Minuten · Hannover-Szenario
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
