import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PaiementSuccesPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const supabase = await createClient();

  const { data: payment } = ref
    ? await supabase
        .from("payments")
        .select("*, booking:bookings(*, trajet:trajets(from_city, to_city))")
        .eq("provider_ref", ref)
        .single()
    : { data: null };

  const confirmed = payment?.status === "success";

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="text-5xl">{confirmed ? "✅" : "⏳"}</div>
      <h1 className="mt-4 text-2xl font-bold">
        {confirmed ? "Paiement confirmé !" : "Paiement en cours de traitement"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {confirmed
          ? "Votre réservation est confirmée. Bon voyage avec SenTrajet !"
          : "Nous attendons la confirmation de PayTech. Cela peut prendre quelques instants — vérifiez votre profil dans un moment."}
      </p>

      {payment?.booking?.trajet && (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-4 text-sm">
          <span className="font-semibold">
            {payment.booking.trajet.from_city} → {payment.booking.trajet.to_city}
          </span>
        </div>
      )}

      <Link
        href="/profil"
        className="mt-6 inline-block rounded-lg bg-brand px-4 py-2.5 font-bold text-brand-foreground hover:opacity-90"
      >
        Voir mes réservations
      </Link>
    </div>
  );
}
