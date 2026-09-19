import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, Star, Ticket, Route, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "En attente de paiement",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  refunded: "Remboursée",
  active: "Actif",
  completed: "Terminé",
};

const STATUS_STYLE: Record<string, string> = {
  pending_payment: "bg-brand/15 text-brand",
  confirmed: "bg-success/15 text-success",
  active: "bg-success/15 text-success",
  cancelled: "bg-danger/15 text-danger",
  refunded: "bg-danger/15 text-danger",
  completed: "bg-surface-2 text-muted",
};

export default async function ProfilPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/connexion?next=/profil");

  const supabase = await createClient();

  const [{ data: bookings }, { data: trajets }] = await Promise.all([
    supabase
      .from("bookings")
      .select("*, trajet:trajets(from_city, to_city, departure_at)")
      .eq("passenger_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("trajets")
      .select("*")
      .eq("driver_id", profile.id)
      .order("departure_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-8">
      <div className="card-elevated flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-surface-2 to-border text-2xl font-bold text-foreground">
          {profile.full_name[0]?.toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2 text-xl font-bold">
            {profile.full_name}
            {profile.is_verified && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">
                <BadgeCheck size={12} strokeWidth={2.5} />
                Vérifié
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted">
            <Star size={13} strokeWidth={2.5} className="fill-brand text-brand" />
            {profile.rating_avg.toFixed(1)} ({profile.rating_count} avis) ·{" "}
            {profile.trips_count} trajets
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <Ticket size={18} strokeWidth={2.25} className="text-brand" />
          Mes réservations
        </h2>
        {bookings && bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((b) => (
              <Link
                key={b.id}
                href={
                  b.status === "pending_payment" ? `/paiement/${b.id}` : `/trajets/${b.trajet_id}`
                }
                className="card-elevated flex items-center justify-between rounded-xl border border-border bg-surface p-4 hover:border-brand/60"
              >
                <div>
                  <div className="font-semibold">
                    {b.trajet?.from_city} → {b.trajet?.to_city}
                  </div>
                  <div className="text-xs text-muted">
                    {b.seats} place(s) · {b.amount_total.toLocaleString("fr-FR")} FCFA
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[b.status] ?? "bg-surface-2 text-muted"}`}
                >
                  {STATUS_LABEL[b.status]}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Aucune réservation pour le moment.</p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Route size={18} strokeWidth={2.25} className="text-brand" />
            Mes trajets publiés
          </h2>
          <Link
            href="/publier"
            className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            <Plus size={14} strokeWidth={2.5} />
            Publier
          </Link>
        </div>
        {trajets && trajets.length > 0 ? (
          <div className="space-y-3">
            {trajets.map((t) => (
              <Link
                key={t.id}
                href={`/trajets/${t.id}`}
                className="card-elevated flex items-center justify-between rounded-xl border border-border bg-surface p-4 hover:border-brand/60"
              >
                <div>
                  <div className="font-semibold">
                    {t.from_city} → {t.to_city}
                  </div>
                  <div className="text-xs text-muted">
                    {t.seats_available}/{t.seats_total} places · {t.price_per_seat.toLocaleString("fr-FR")} FCFA
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[t.status] ?? "bg-surface-2 text-muted"}`}
                >
                  {STATUS_LABEL[t.status]}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Vous n&apos;avez publié aucun trajet.</p>
        )}
      </section>
    </div>
  );
}
