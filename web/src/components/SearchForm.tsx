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
      className="rounded-2xl border border-border bg-surface p-5"
    >
      <h2 className="mb-4 text-lg font-bold">🗺️ Trouvez votre trajet</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-muted">De</label>
          <select
            name="from"
            defaultValue={defaultFrom ?? ""}
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
            name="to"
            defaultValue={defaultTo ?? ""}
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
          <label className="mb-1 block text-sm font-medium text-muted">
            Date du voyage
          </label>
          <input
            type="date"
            name="date"
            defaultValue={defaultDate ?? ""}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 outline-none focus:border-brand"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-brand px-4 py-3 font-bold text-brand-foreground hover:opacity-90 sm:w-auto"
      >
        🔍 Rechercher des trajets
      </button>
    </form>
  );
}
