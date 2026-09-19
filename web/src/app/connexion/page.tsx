"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ConnexionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-light to-brand text-brand-foreground shadow-[0_6px_18px_-6px_var(--brand)]">
          <LogIn size={22} strokeWidth={2.25} />
        </span>
        <h1 className="mt-3 text-2xl font-bold">Connexion</h1>
        <p className="mt-1 text-sm text-muted">Accédez à votre compte SenTrajet.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="card-elevated space-y-4 rounded-2xl border border-border bg-surface p-5"
      >
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
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-brand hover:underline">
          Inscrivez-vous
        </Link>
      </p>
    </div>
  );
}
