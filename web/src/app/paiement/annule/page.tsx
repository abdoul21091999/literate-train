import Link from "next/link";
import { XCircle, Home } from "lucide-react";

export default function PaiementAnnulePage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/15 text-danger">
        <XCircle size={32} strokeWidth={2} />
      </span>
      <h1 className="mt-4 text-2xl font-bold">Paiement annulé</h1>
      <p className="mt-2 text-sm text-muted">
        Vous avez annulé le paiement. Votre réservation n&apos;a pas été
        confirmée — vous pouvez réessayer à tout moment.
      </p>

      <Link
        href="/"
        className="btn-brand mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-bold"
      >
        <Home size={16} strokeWidth={2.25} />
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
