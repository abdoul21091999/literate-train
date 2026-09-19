import { createClient } from "@/lib/supabase/server";
import SearchForm from "@/components/SearchForm";
import TripCard from "@/components/TripCard";
import type { Trajet } from "@/lib/types";

type SearchParams = { from?: string; to?: string; date?: string };

export default async function TrajetsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { from, to, date } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("trajets")
    .select("*, driver:profiles(*)")
    .eq("status", "active")
    .gt("seats_available", 0)
    .order("departure_at", { ascending: true });

  if (from) query = query.eq("from_city", from);
  if (to) query = query.eq("to_city", to);

  if (date) {
    const start = new Date(`${date}T00:00:00`).toISOString();
    const end = new Date(`${date}T23:59:59`).toISOString();
    query = query.gte("departure_at", start).lte("departure_at", end);
  } else {
    query = query.gte("departure_at", new Date().toISOString());
  }

  const { data: trajets } = await query;

  return (
    <div className="space-y-6">
      <SearchForm defaultFrom={from} defaultTo={to} defaultDate={date} />

      <div>
        <h1 className="mb-4 text-lg font-bold">
          {trajets?.length ?? 0} trajet(s) trouvé(s)
          {from && to ? ` — ${from} → ${to}` : ""}
        </h1>

        {trajets && trajets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {(trajets as Trajet[]).map((t) => (
              <TripCard key={t.id} trajet={t} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
            Aucun trajet ne correspond à votre recherche. Essayez d&apos;autres
            villes ou une autre date.
          </p>
        )}
      </div>
    </div>
  );
}
