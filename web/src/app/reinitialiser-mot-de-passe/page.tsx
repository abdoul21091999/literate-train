"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ReinitialiserMotDePassePage() {
  const router = useRouter();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The recovery link sets the session via the URL hash on load — give
    // the client a moment to pick it up, then check either way.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("Une erreur est survenue, réessayez.");
      return;
    }

    setDone(true);
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 2000);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 size={28} strokeWidth={2} />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Mot de passe mis à jour</h1>
        <p className="mt-2 text-sm text-muted">Redirection vers l&apos;accueil…</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <p className="text-sm text-muted">
          Vérification du lien de réinitialisation…
        </p>
        <p className="mt-2 text-xs text-muted">
          Si rien ne se passe, le lien a peut-être expiré — redemandez-en un
          depuis la page{" "}
          <a href="/mot-de-passe-oublie" className="font-semibold text-brand hover:underline">
            mot de passe oublié
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-light to-brand text-brand-foreground shadow-[0_6px_18px_-6px_var(--brand)]">
          <KeyRound size={22} strokeWidth={2.25} />
        </span>
        <h1 className="mt-3 text-2xl font-bold">Nouveau mot de passe</h1>
        <p className="mt-1 text-sm text-muted">Choisissez votre nouveau mot de passe.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card-elevated space-y-4 rounded-2xl border border-border bg-surface p-5"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Nouveau mot de passe
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

        <div>
          <label className="mb-1 block text-sm font-medium text-muted">
            Confirmer le mot de passe
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 outline-none transition-colors focus:border-brand"
              placeholder="••••••••"
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
          {loading ? "Mise à jour…" : "Mettre à jour le mot de passe"}
        </button>
      </form>
    </div>
  );
}
