import Link from "next/link";
import { redirect } from "next/navigation";
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
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-2xl font-bold">
          {profile.full_name[0]?.toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2 text-xl font-bold">
            {profile.full_name}
            {profile.is_verified && (
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">
                ✓ Vérifié
              </span>
            )}
          </div>
          <div className="text-sm text-muted">
            ★ {profile.rating_avg.toFixed(1)} ({profile.rating_count} avis) ·{" "}
            {profile.trips_count} trajets
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold">Mes réservations</h2>
        {bookings && bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((b) => (
              <Link
                key={b.id}
                href={
                  b.status === "pending_payment" ? `/paiement/${b.id}` : `/trajets/${b.trajet_id}`
                }
                className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 hover:border-brand"
              >
                <div>
                  <div className="font-semibold">
                    {b.trajet?.from_city} → {b.trajet?.to_city}
                  </div>
                  <div className="text-xs text-muted">
                    {b.seats} place(s) · {b.amount_total.toLocaleString("fr-FR")} FCFA
                  </div>
                </div>
                <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold">
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
          <h2 className="text-lg font-bold">Mes trajets publiés</h2>
          <Link href="/publier" className="text-sm font-semibold text-brand">
            + Publier
          </Link>
        </div>
        {trajets && trajets.length > 0 ? (
          <div className="space-y-3">
            {trajets.map((t) => (
              <Link
                key={t.id}
                href={`/trajets/${t.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 hover:border-brand"
              >
                <div>
                  <div className="font-semibold">
                    {t.from_city} → {t.to_city}
                  </div>
                  <div className="text-xs text-muted">
                    {t.seats_available}/{t.seats_total} places · {t.price_per_seat.toLocaleString("fr-FR")} FCFA
                  </div>
                </div>
                <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold">
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
