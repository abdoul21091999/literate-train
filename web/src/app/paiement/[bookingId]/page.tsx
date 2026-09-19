import { notFound, redirect } from "next/navigation";
import { CreditCard, ShieldCheck } from "lucide-react";
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
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-light to-brand text-brand-foreground shadow-[0_6px_18px_-6px_var(--brand)]">
          <CreditCard size={22} strokeWidth={2.25} />
        </span>
        <h1 className="mt-3 text-2xl font-bold">Paiement</h1>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted">
          <ShieldCheck size={14} strokeWidth={2.25} className="text-success" />
          Redirection sécurisée vers PayTech — Wave ou Orange Money
        </p>
      </div>

      {erreur && ERRORS[erreur] && (
        <p className="mt-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {ERRORS[erreur]}
        </p>
      )}

      <div className="card-elevated mt-6 space-y-3 rounded-2xl border border-border bg-surface p-5">
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
          className="btn-brand flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold"
        >
          <CreditCard size={16} strokeWidth={2.25} />
          Payer avec PayTech
        </button>
      </form>
    </div>
  );
}
