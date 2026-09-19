import {
  ClipboardList,
  Target,
  Lightbulb,
  Wallet,
  TrendingUp,
  Rocket,
  type LucideIcon,
} from "lucide-react";

const SECTIONS: { title: string; icon: LucideIcon; body: string }[] = [
  {
    title: "Le problème",
    icon: Target,
    body: "Au Sénégal, voyager entre régions repose sur les gares routières informelles (Beaux-Marchés, garages) : attente longue, prix négociés au cas par cas, pas de traçabilité ni de garantie de place.",
  },
  {
    title: "La solution",
    icon: Lightbulb,
    body: "SenTrajet connecte conducteurs disposant de places libres et passagers, avec recherche par ville/date, prix fixe affiché, réservation en ligne et paiement Mobile Money (Wave, Orange Money) via PayTech.",
  },
  {
    title: "Modèle économique",
    icon: Wallet,
    body: "Frais de service fixe de 300 FCFA prélevés sur chaque réservation payée en ligne, quel que soit le prix du trajet — simple, transparent, sans pourcentage variable qui pénalise les longs trajets. Options futures : abonnement conducteurs professionnels, mise en avant de trajets, partenariats avec les gares routières.",
  },
  {
    title: "Marché",
    icon: TrendingUp,
    body: "14 régions, plus de 17 millions d'habitants, un taux de pénétration Mobile Money parmi les plus élevés d'Afrique de l'Ouest — un terrain favorable au paiement digital du covoiturage.",
  },
  {
    title: "Feuille de route",
    icon: Rocket,
    body: "V1 web (recherche, publication, réservation, paiement) → application mobile iOS/Android → vérification d'identité des conducteurs → notation & avis → programme de fidélité.",
  },
];

export default function BusinessPlanPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <ClipboardList size={22} strokeWidth={2.25} className="text-brand" />
          Business Plan — SenTrajet
        </h1>
        <p className="mt-1 text-sm text-muted">
          Covoiturage interurbain au Sénégal, du garage informel à la
          réservation en ligne.
        </p>
      </div>

      {SECTIONS.map((s, i) => (
        <div
          key={s.title}
          className="card-elevated animate-fade-up rounded-2xl border border-border bg-surface p-5"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <h2 className="flex items-center gap-2 font-bold">
            <s.icon size={16} strokeWidth={2.25} className="text-brand" />
            {s.title}
          </h2>
          <p className="mt-2 text-sm text-muted">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
