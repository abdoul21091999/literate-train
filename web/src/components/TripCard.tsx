import Link from "next/link";
import { BadgeCheck, Star, ArrowRight, Clock, Users } from "lucide-react";
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
      className="card-elevated group block rounded-2xl border border-border bg-surface p-4 hover:border-brand/60"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-surface-2 to-border font-bold text-foreground">
            {driver?.full_name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-semibold">
              {driver?.full_name ?? "Conducteur"}
              {driver?.is_verified && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
                  <BadgeCheck size={11} strokeWidth={2.5} />
                  Vérifié
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted">
              <Star size={12} strokeWidth={2.5} className="fill-brand text-brand" />
              {driver?.rating_avg?.toFixed(1) ?? "—"} · {driver?.trips_count ?? 0} trajets
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
        <ArrowRight
          size={14}
          strokeWidth={2.25}
          className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
        />
        <span className="font-semibold">{trajet.to_city}</span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span className="flex items-center gap-1">
          <Clock size={12} strokeWidth={2.25} />
          {formatDate(trajet.departure_at)}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} strokeWidth={2.25} />
          {trajet.seats_available} place(s)
        </span>
      </div>
    </Link>
  );
}
