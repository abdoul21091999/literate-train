import { createClient } from "@/lib/supabase/server";
import SearchForm from "@/components/SearchForm";
import TripCard from "@/components/TripCard";
import type { Trajet } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: trajets } = await supabase
    .from("trajets")
    .select("*, driver:profiles(*)")
    .eq("status", "active")
    .gt("seats_available", 0)
    .gte("departure_at", new Date().toISOString())
    .order("departure_at", { ascending: true })
    .limit(6);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2 p-6 text-center sm:p-10">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          Voyagez malin à travers le{" "}
          <span className="text-brand">Sénégal</span> 🇸🇳
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          SenTrajet met en relation conducteurs et passagers sur les 14
          régions du pays. Réservez votre place et payez en Wave, Orange
          Money ou Free Money.
        </p>
      </section>

      <SearchForm />

      <section>
        <h2 className="mb-4 text-lg font-bold">🔥 Trajets disponibles maintenant</h2>

        {trajets && trajets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {(trajets as Trajet[]).map((t) => (
              <TripCard key={t.id} trajet={t} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
            Aucun trajet disponible pour le moment. Soyez le premier à{" "}
            <a href="/publier" className="font-semibold text-brand">
              publier un trajet
            </a>
            !
          </p>
        )}
      </section>
    </div>
  );
}
