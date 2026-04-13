import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-[12px] text-[var(--muted-foreground)]">
          Vertraulich · Pilot-Konzept für SCHOLPP Holding GmbH · Stand April 2026
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[var(--muted-foreground)]">
          <span>Powered by</span>
          <Image
            src="/meisterwerk.svg"
            alt="Meisterwerk"
            width={120}
            height={16}
            className="h-4 w-auto"
          />
        </div>
      </div>
    </footer>
  );
}
