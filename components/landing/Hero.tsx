"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-white">
      <div className="grid md:grid-cols-12 min-h-[calc(100vh-4rem)]">
        <div className="md:col-span-5 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16 md:py-0">
          <div className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-[var(--scholpp-red)] font-semibold mb-8">
            <span className="w-8 h-px bg-[var(--scholpp-red)]" />
            Live-Demo · Reisekoordinator
          </div>

          <h1 className="font-sans text-[44px] md:text-[56px] lg:text-[64px] leading-[1.02] tracking-[-0.025em] font-bold text-[var(--foreground)]">
            Einsatz-Reisen planen
            <br />
            <span className="text-[var(--scholpp-red)]">in 2 Minuten</span>
            <span className="text-[var(--muted-foreground)] font-light"> statt 45.</span>
          </h1>

          <p className="mt-8 max-w-md text-[17px] leading-[1.55] text-[var(--muted-foreground)]">
            Ein digitaler Agent recherchiert Hotels, vergleicht Fahrzeuge und prüft
            die Betriebsordnung. Der Projektleiter klickt nur noch auf Freigeben.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
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
          </div>
        </div>

        <div className="md:col-span-7 relative bg-white flex items-center justify-center overflow-hidden">
          <video
            src="/hero.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover md:object-contain"
            onEnded={(e) => e.currentTarget.pause()}
          />
        </div>
      </div>
    </section>
  );
}
