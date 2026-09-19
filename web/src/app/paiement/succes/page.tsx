import Link from "next/link";
import { CheckCircle2, Hourglass, Ticket } from "lucide-react";
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
      <span
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
          confirmed ? "bg-success/15 text-success" : "bg-brand/15 text-brand"
        }`}
      >
        {confirmed ? (
          <CheckCircle2 size={32} strokeWidth={2} />
        ) : (
          <Hourglass size={28} strokeWidth={2} />
        )}
      </span>
      <h1 className="mt-4 text-2xl font-bold">
        {confirmed ? "Paiement confirmé !" : "Paiement en cours de traitement"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {confirmed
          ? "Votre réservation est confirmée. Bon voyage avec SenTrajet !"
          : "Nous attendons la confirmation de PayTech. Cela peut prendre quelques instants — vérifiez votre profil dans un moment."}
      </p>

      {payment?.booking?.trajet && (
        <div className="card-elevated mt-6 rounded-2xl border border-border bg-surface p-4 text-sm">
          <span className="font-semibold">
            {payment.booking.trajet.from_city} → {payment.booking.trajet.to_city}
          </span>
        </div>
      )}

      <Link
        href="/profil"
        className="btn-brand mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-bold"
      >
        <Ticket size={16} strokeWidth={2.25} />
        Voir mes réservations
      </Link>
    </div>
  );
}
