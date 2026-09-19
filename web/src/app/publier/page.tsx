import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { SENEGAL_REGIONS } from "@/lib/regions";
import { publishTrajet } from "./actions";

const ERRORS: Record<string, string> = {
  champs: "Merci de vérifier les champs du formulaire (villes différentes, prix et places > 0).",
  serveur: "Une erreur est survenue, réessayez.",
};

export default async function PublierPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const profile = await getCurrentProfile();
  const { erreur } = await searchParams;

  if (!profile) {
    redirect("/connexion?next=/publier");
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold">➕ Publier un trajet</h1>
      <p className="mt-1 text-sm text-muted">
        Proposez des places libres dans votre véhicule et fixez votre prix.
      </p>

      {erreur && ERRORS[erreur] && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {ERRORS[erreur]}
        </p>
      )}

      <form action={publishTrajet} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted">De</label>
            <select
              name="from_city"
              required
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 outline-none focus:border-brand"
            >
              <option value="">Ville de départ</option>
              {SENEGAL_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">À</label>
            <select
              name="to_city"
              required
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 outline-none focus:border-brand"
            >
              <option value="">Destination</option>
              {SENEGAL_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">Date</label>
            <input
              type="date"
              name="date"
              required
              min={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">Heure</label>
            <input
              type="time"
              name="time"
              required
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">
              Prix par place (FCFA)
            </label>
            <input
              type="number"
              name="price_per_seat"
              min={0}
              step={100}
              required
              placeholder="5000"
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">
              Places disponibles
            </label>
            <input
              type="number"
              name="seats_total"
              min={1}
              max={9}
              required
              placeholder="4"
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 outline-none focus:border-brand"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Véhicule (optionnel)
          </label>
          <input
            name="vehicle"
            placeholder="Ex: Toyota Corolla grise"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Notes (optionnel)
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Point de rendez-vous, bagages autorisés, climatisation…"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 outline-none focus:border-brand"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-brand px-4 py-3 font-bold text-brand-foreground hover:opacity-90"
        >
          Publier le trajet
        </button>
      </form>
    </div>
  );
}
