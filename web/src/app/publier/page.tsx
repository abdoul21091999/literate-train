import { redirect } from "next/navigation";
import {
  MapPin,
  Navigation,
  CalendarDays,
  Clock,
  Banknote,
  Users,
  Car,
  StickyNote,
  Rocket,
} from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { SENEGAL_REGIONS } from "@/lib/regions";
import { publishTrajet } from "./actions";

const ERRORS: Record<string, string> = {
  champs: "Merci de vérifier les champs du formulaire (villes différentes, prix et places > 0, véhicule requis).",
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
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Rocket size={22} strokeWidth={2.25} className="text-brand" />
        Publier un trajet
      </h1>
      <p className="mt-1 text-sm text-muted">
        Proposez des places libres dans votre véhicule et fixez votre prix.
      </p>

      {erreur && ERRORS[erreur] && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {ERRORS[erreur]}
        </p>
      )}

      <form
        action={publishTrajet}
        className="card-elevated mt-6 space-y-4 rounded-2xl border border-border bg-surface p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted">De</label>
            <div className="relative">
              <MapPin
                size={16}
                strokeWidth={2.25}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <select
                name="from_city"
                required
                className="w-full appearance-none rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
              >
                <option value="">Ville de départ</option>
                {SENEGAL_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">À</label>
            <div className="relative">
              <Navigation
                size={16}
                strokeWidth={2.25}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <select
                name="to_city"
                required
                className="w-full appearance-none rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
              >
                <option value="">Destination</option>
                {SENEGAL_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">Date</label>
            <div className="relative">
              <CalendarDays
                size={16}
                strokeWidth={2.25}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="date"
                name="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">Heure</label>
            <div className="relative">
              <Clock
                size={16}
                strokeWidth={2.25}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="time"
                name="time"
                required
                className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">
              Prix par place (FCFA)
            </label>
            <div className="relative">
              <Banknote
                size={16}
                strokeWidth={2.25}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="number"
                name="price_per_seat"
                min={0}
                step={100}
                required
                placeholder="5000"
                className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">
              Places disponibles
            </label>
            <div className="relative">
              <Users
                size={16}
                strokeWidth={2.25}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="number"
                name="seats_total"
                min={1}
                max={9}
                required
                placeholder="4"
                className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-muted">Véhicule</label>
          <div className="relative">
            <Car
              size={16}
              strokeWidth={2.25}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              name="vehicle"
              required
              placeholder="Ex: Toyota Corolla grise"
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Notes (optionnel)
          </label>
          <div className="relative">
            <StickyNote
              size={16}
              strokeWidth={2.25}
              className="pointer-events-none absolute left-3 top-3 text-muted"
            />
            <textarea
              name="notes"
              rows={3}
              placeholder="Point de rendez-vous, bagages autorisés, climatisation…"
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-brand w-full rounded-lg px-4 py-3 font-bold"
        >
          Publier le trajet
        </button>
      </form>
    </div>
  );
}
