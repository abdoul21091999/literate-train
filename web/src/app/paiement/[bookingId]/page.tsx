import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { startPayment } from "./actions";

const ERRORS: Record<string, string> = {
  introuvable: "Cette réservation est introuvable ou déjà payée.",
  paytech: "Le service de paiement est momentanément indisponible. Réessayez.",
};

export default async function PaiementPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { bookingId } = await params;
  const { erreur } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?next=/paiement/${bookingId}`);
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, trajet:trajets(from_city, to_city, departure_at)")
    .eq("id", bookingId)
    .eq("passenger_id", user.id)
    .single();

  if (!booking) notFound();

  if (booking.status === "confirmed") {
    redirect(`/paiement/succes?ref=${bookingId}`);
  }

  const boundAction = startPayment.bind(null, bookingId);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">💳 Paiement</h1>
      <p className="mt-1 text-sm text-muted">
        Vous serez redirigé vers PayTech pour payer en toute sécurité par
        Wave ou Orange Money.
      </p>

      {erreur && ERRORS[erreur] && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {ERRORS[erreur]}
        </p>
      )}

      <div className="mt-6 space-y-3 rounded-2xl border border-border bg-surface p-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Trajet</span>
          <span className="font-semibold">
            {booking.trajet.from_city} → {booking.trajet.to_city}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Places</span>
          <span className="font-semibold">{booking.seats}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-base">
          <span className="font-semibold">Total</span>
          <span className="font-extrabold text-brand">
            {booking.amount_total.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
      </div>

      <form action={boundAction} className="mt-6">
        <button
          type="submit"
          className="w-full rounded-lg bg-brand px-4 py-3 font-bold text-brand-foreground hover:opacity-90"
        >
          Payer avec PayTech
        </button>
      </form>
    </div>
  );
}
