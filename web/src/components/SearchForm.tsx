import { MapPin, Navigation, CalendarDays, Search, Map } from "lucide-react";
import { SENEGAL_REGIONS } from "@/lib/regions";

type Props = {
  defaultFrom?: string;
  defaultTo?: string;
  defaultDate?: string;
};

export default function SearchForm({ defaultFrom, defaultTo, defaultDate }: Props) {
  return (
    <form
      action="/trajets"
      method="GET"
      className="card-elevated rounded-2xl border border-border bg-surface p-5"
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <Map size={18} strokeWidth={2.25} className="text-brand" />
        Trouvez votre trajet
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-muted">De</label>
          <div className="relative">
            <MapPin
              size={16}
              strokeWidth={2.25}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <select
              name="from"
              defaultValue={defaultFrom ?? ""}
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
              name="to"
              defaultValue={defaultTo ?? ""}
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
          <label className="mb-1 block text-sm font-medium text-muted">
            Date du voyage
          </label>
          <div className="relative">
            <CalendarDays
              size={16}
              strokeWidth={2.25}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="date"
              name="date"
              defaultValue={defaultDate ?? ""}
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="btn-brand mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold sm:w-auto"
      >
        <Search size={16} strokeWidth={2.5} />
        Rechercher des trajets
      </button>
    </form>
  );
}
