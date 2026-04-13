import Link from "next/link";
import Image from "next/image";
import { agentStatus } from "@/data/kpis";

export function Header({ showStatus = false }: { showStatus?: boolean }) {
  return (
    <header className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/scholpp-logo.jpg"
            alt="SCHOLPP"
            width={110}
            height={28}
            className="h-7 w-auto"
            priority
          />
          <span className="hairline-strong border-l h-5 mx-1" />
          <span className="text-[13px] text-[var(--muted-foreground)] tracking-wide uppercase font-medium">
            Reisekoordinator
          </span>
        </Link>
        {!showStatus && (
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--muted-foreground)] font-medium">
            <span>powered by</span>
            <Image
              src="/meisterwerk.svg"
              alt="Meisterwerk"
              width={120}
              height={16}
              className="h-4 w-auto"
            />
          </div>
        )}
        {showStatus && (
          <div className="flex items-center gap-6 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              <span className="text-[var(--muted-foreground)]">
                Agent aktiv seit {agentStatus.aktivSeitTage} Tagen
              </span>
            </div>
            <div className="text-[var(--muted-foreground)]">
              <span className="font-semibold text-[var(--foreground)]">
                {agentStatus.anfragenBearbeitetGesamt}
              </span>{" "}
              Anfragen bearbeitet
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
