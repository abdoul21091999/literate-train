import Link from "next/link";

export default function PaiementAnnulePage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="text-5xl">❌</div>
      <h1 className="mt-4 text-2xl font-bold">Paiement annulé</h1>
      <p className="mt-2 text-sm text-muted">
        Vous avez annulé le paiement. Votre réservation n&apos;a pas été
        confirmée — vous pouvez réessayer à tout moment.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-brand px-4 py-2.5 font-bold text-brand-foreground hover:opacity-90"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
