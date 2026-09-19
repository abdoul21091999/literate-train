"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Lock, UserPlus, Loader2, MailCheck } from "lucide-react";
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
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-light to-brand text-brand-foreground shadow-[0_6px_18px_-6px_var(--brand)]">
          <MailCheck size={26} strokeWidth={2.25} />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Vérifiez votre email</h1>
        <p className="mt-3 text-sm text-muted">
          Nous vous avons envoyé un lien de confirmation. Cliquez dessus pour
          activer votre compte SenTrajet, puis connectez-vous.
        </p>
        <Link
          href="/connexion"
          className="btn-brand mt-6 inline-block rounded-lg px-4 py-2.5 font-bold"
        >
          Aller à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-light to-brand text-brand-foreground shadow-[0_6px_18px_-6px_var(--brand)]">
          <UserPlus size={22} strokeWidth={2.25} />
        </span>
        <h1 className="mt-3 text-2xl font-bold">Créer un compte</h1>
        <p className="mt-1 text-sm text-muted">
          Rejoignez SenTrajet pour réserver ou proposer des trajets.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card-elevated space-y-4 rounded-2xl border border-border bg-surface p-5"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-muted">Nom complet</label>
          <div className="relative">
            <User
              size={16}
              strokeWidth={2.25}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
              placeholder="Moustapha Diop"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-muted">Téléphone</label>
          <div className="relative">
            <Phone
              size={16}
              strokeWidth={2.25}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
              placeholder="+221 77 000 00 00"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-muted">Email</label>
          <div className="relative">
            <Mail
              size={16}
              strokeWidth={2.25}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
              placeholder="vous@exemple.sn"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Mot de passe
          </label>
          <div className="relative">
            <Lock
              size={16}
              strokeWidth={2.25}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
              placeholder="Au moins 6 caractères"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-danger/30 bg-danger/10 p-2.5 text-sm text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-brand flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-bold disabled:cursor-not-allowed"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-semibold text-brand hover:underline">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}
