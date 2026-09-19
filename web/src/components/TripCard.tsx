import Link from "next/link";
import type { Trajet } from "@/lib/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function TripCard({ trajet }: { trajet: Trajet }) {
  const driver = trajet.driver;

  return (
    <Link
      href={`/trajets/${trajet.id}`}
      className="block rounded-2xl border border-border bg-surface p-4 transition hover:border-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 font-bold">
            {driver?.full_name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold">
              {driver?.full_name ?? "Conducteur"}
              {driver?.is_verified && (
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
                  ✓ Vérifié
                </span>
              )}
            </div>
            <div className="text-xs text-muted">
              ★ {driver?.rating_avg?.toFixed(1) ?? "—"} · {driver?.trips_count ?? 0} trajets
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-extrabold text-brand">
            {trajet.price_per_seat.toLocaleString("fr-FR")}
          </div>
          <div className="text-xs text-muted">FCFA / place</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="font-semibold">{trajet.from_city}</span>
        <span className="text-muted">→</span>
        <span className="font-semibold">{trajet.to_city}</span>
      </div>

      <div className="mt-1 flex items-center justify-between text-xs text-muted">
        <span>{formatDate(trajet.departure_at)}</span>
        <span>{trajet.seats_available} place(s) restante(s)</span>
      </div>
    </Link>
  );
}
