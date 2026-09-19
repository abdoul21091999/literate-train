import { Flame, ShieldCheck, Zap, MapPinned } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SearchForm from "@/components/SearchForm";
import TripCard from "@/components/TripCard";
import type { Trajet } from "@/lib/types";

const BADGES = [
  { icon: MapPinned, label: "14 régions couvertes" },
  { icon: ShieldCheck, label: "Paiement sécurisé PayTech" },
  { icon: Zap, label: "Réservation instantanée" },
];

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
      <section className="animate-fade-up relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2 p-6 text-center sm:p-12">
        <div
          aria-hidden
          className="animate-glow-pulse pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
        />
        <div className="relative">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Voyagez malin à travers le{" "}
            <span className="bg-gradient-to-r from-brand-light to-brand bg-clip-text text-transparent">
              Sénégal
            </span>{" "}
            🇸🇳
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted sm:text-lg">
            SenTrajet met en relation conducteurs et passagers sur les 14
            régions du pays. Réservez votre place et payez en Wave ou Orange
            Money.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {BADGES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-medium text-muted"
              >
                <Icon size={13} strokeWidth={2.25} className="text-brand" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <SearchForm />

      <section className="animate-fade-up" style={{ animationDelay: "80ms" }}>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <Flame size={18} strokeWidth={2.25} className="text-brand" />
          Trajets disponibles maintenant
        </h2>

        {trajets && trajets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {(trajets as Trajet[]).map((t) => (
              <TripCard key={t.id} trajet={t} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <MapPinned size={28} strokeWidth={1.75} className="mx-auto text-muted" />
            <p className="mt-3 text-sm text-muted">
              Aucun trajet disponible pour le moment. Soyez le premier à{" "}
              <a href="/publier" className="font-semibold text-brand hover:underline">
                publier un trajet
              </a>
              !
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
