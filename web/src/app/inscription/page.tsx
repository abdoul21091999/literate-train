"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function InscriptionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });

    setLoading(false);

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "Un compte existe déjà avec cet email."
          : "Une erreur est survenue, réessayez."
      );
      return;
    }

    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <h1 className="text-2xl font-bold">Vérifiez votre email ✉️</h1>
        <p className="mt-3 text-sm text-muted">
          Nous vous avons envoyé un lien de confirmation. Cliquez dessus pour
          activer votre compte SenTrajet, puis connectez-vous.
        </p>
        <Link
          href="/connexion"
          className="mt-6 inline-block rounded-lg bg-brand px-4 py-2.5 font-bold text-brand-foreground hover:opacity-90"
        >
          Aller à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <p className="mt-1 text-sm text-muted">
        Rejoignez SenTrajet pour réserver ou proposer des trajets.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nom complet</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 outline-none focus:border-brand"
            placeholder="Moustapha Diop"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Téléphone</label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 outline-none focus:border-brand"
            placeholder="+221 77 000 00 00"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 outline-none focus:border-brand"
            placeholder="vous@exemple.sn"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 outline-none focus:border-brand"
            placeholder="Au moins 6 caractères"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-2.5 font-bold text-brand-foreground hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-semibold text-brand">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}
