import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, Banknote, Users, Car, Star, CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BookingForm from "@/components/BookingForm";
import type { Trajet } from "@/lib/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function TrajetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: trajet } = await supabase
    .from("trajets")
    .select("*, driver:profiles(*)")
    .eq("id", id)
    .single();

  if (!trajet) notFound();

  const t = trajet as Trajet;
  const driver = t.driver;

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="space-y-6 sm:col-span-2">
        <div className="card-elevated rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-xl font-bold">
            <span>{t.from_city}</span>
            <ArrowRight size={18} strokeWidth={2.25} className="text-brand" />
            <span>{t.to_city}</span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <CalendarClock size={14} strokeWidth={2.25} />
            {formatDate(t.departure_at)}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="flex items-center gap-1 text-muted">
                <Banknote size={13} strokeWidth={2.25} />
                Prix par place
              </dt>
              <dd className="font-bold text-brand">
                {t.price_per_seat.toLocaleString("fr-FR")} FCFA
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-muted">
                <Users size={13} strokeWidth={2.25} />
                Places disponibles
              </dt>
              <dd className="font-bold">{t.seats_available} / {t.seats_total}</dd>
            </div>
            {t.vehicle && (
              <div>
                <dt className="flex items-center gap-1 text-muted">
                  <Car size={13} strokeWidth={2.25} />
                  Véhicule
                </dt>
                <dd className="font-bold">{t.vehicle}</dd>
              </div>
            )}
          </dl>

          {t.notes && (
            <p className="mt-4 rounded-lg bg-surface-2 p-3 text-sm text-muted">
              {t.notes}
            </p>
          )}
        </div>

        <div className="card-elevated rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-3 font-bold">Conducteur</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-surface-2 to-border text-lg font-bold text-foreground">
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
                {driver?.rating_avg?.toFixed(1) ?? "—"} ({driver?.rating_count ?? 0}) ·{" "}
                {driver?.trips_count ?? 0} trajets
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-elevated rounded-2xl border border-border bg-surface p-5 sm:sticky sm:top-20 sm:h-fit">
        <h2 className="mb-3 font-bold">Réserver</h2>
        {t.seats_available > 0 ? (
          <BookingForm
            trajetId={t.id}
            pricePerSeat={t.price_per_seat}
            seatsAvailable={t.seats_available}
          />
        ) : (
          <p className="text-sm text-muted">Ce trajet est complet.</p>
        )}
      </div>
    </div>
  );
}
