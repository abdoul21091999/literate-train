const SECTIONS = [
  {
    title: "🎯 Le problème",
    body: "Au Sénégal, voyager entre régions repose sur les gares routières informelles (Beaux-Marchés, garages) : attente longue, prix négociés au cas par cas, pas de traçabilité ni de garantie de place.",
  },
  {
    title: "💡 La solution",
    body: "SenTrajet connecte conducteurs disposant de places libres et passagers, avec recherche par ville/date, prix fixe affiché, réservation en ligne et paiement Mobile Money (Wave, Orange Money) via PayTech.",
  },
  {
    title: "💰 Modèle économique",
    body: "Commission de 8 à 12 % prélevée sur chaque réservation payée en ligne. Options futures : mise en avant de trajets, abonnement conducteurs professionnels, partenariats avec les gares routières.",
  },
  {
    title: "📈 Marché",
    body: "14 régions, plus de 17 millions d'habitants, un taux de pénétration Mobile Money parmi les plus élevés d'Afrique de l'Ouest — un terrain favorable au paiement digital du covoiturage.",
  },
  {
    title: "🚀 Feuille de route",
    body: "V1 web (recherche, publication, réservation, paiement) → application mobile iOS/Android → vérification d'identité des conducteurs → notation & avis → programme de fidélité.",
  },
];

export default function BusinessPlanPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">📋 Business Plan — SenTrajet</h1>
        <p className="mt-1 text-sm text-muted">
          Covoiturage interurbain au Sénégal, du garage informel à la
          réservation en ligne.
        </p>
      </div>

      {SECTIONS.map((s) => (
        <div key={s.title} className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-bold">{s.title}</h2>
          <p className="mt-2 text-sm text-muted">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
