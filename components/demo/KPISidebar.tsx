import { agentStatus } from "@/data/kpis";
import { formatEur } from "@/lib/utils";
import { Activity, CheckCircle2, TrendingUp } from "lucide-react";

export function KPISidebar() {
  return (
    <aside className="hairline border bg-white sticky top-4">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
        <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold">
          Live-Dashboard
        </span>
      </div>
      <div className="divide-y divide-[var(--border)]">
        <KPI
          icon={Activity}
          label="Diese Woche"
          value={`${agentStatus.anfragenDieseWoche}`}
          sub="Anfragen bearbeitet"
        />
        <KPI
          icon={TrendingUp}
          label="Gespart"
          value={formatEur(agentStatus.ersparnisDieseWocheEur)}
          sub="Woche (Fahrzeuge + Hotel)"
        />
        <KPI
          icon={CheckCircle2}
          label="Compliance"
          value={`${agentStatus.richtlinienkonformProzent} %`}
          sub="Richtlinien-konform"
          success
        />
        <KPI
          label="Ø Bearbeitungszeit"
          value={`${agentStatus.durchschnittlicheZeitMinuten} min`}
          sub={`vorher ${agentStatus.vorherZeitMinuten} min`}
        />
        <KPI
          label="Jahres-Hochrechnung"
          value={formatEur(agentStatus.ersparnisJahreHochgerechnet)}
          sub="@ 500 Buchungen/Jahr"
        />
      </div>
    </aside>
  );
}

function KPI({
  icon: Icon,
  label,
  value,
  sub,
  success,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sub: string;
  success?: boolean;
}) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)] font-semibold mb-1">
        {Icon && <Icon size={11} />}
        {label}
      </div>
      <div
        className={`text-[22px] font-bold tracking-[-0.02em] leading-none ${
          success ? "text-[var(--success)]" : ""
        }`}
      >
        {value}
      </div>
      <div className="text-[11px] text-[var(--muted-foreground)] mt-1">{sub}</div>
    </div>
  );
}
