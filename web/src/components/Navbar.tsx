import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

const TABS = [
  { href: "/", label: "🔍 Rechercher" },
  { href: "/publier", label: "➕ Publier" },
  { href: "/business-plan", label: "📋 Business Plan" },
];

export default async function Navbar() {
  const profile = await getCurrentProfile();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-lg">
            🚌
          </span>
          <span>
            <span className="block text-lg font-extrabold leading-none">
              SenTrajet
            </span>
            <span className="block text-xs text-muted">
              Covoiturage interurbain au Sénégal
            </span>
          </span>
        </Link>

        <span className="hidden rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-muted sm:inline-flex sm:items-center sm:gap-1">
          🇸🇳 14 régions
        </span>

        <nav className="flex items-center gap-2">
          {profile ? (
            <>
              <Link
                href="/profil"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-2"
              >
                {profile.full_name}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-2"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded-lg bg-brand px-3 py-2 text-sm font-bold text-brand-foreground hover:opacity-90"
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="mx-auto flex max-w-5xl gap-1 border-t border-border px-4">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="border-b-2 border-transparent px-3 py-2.5 text-sm font-semibold text-muted hover:border-brand hover:text-foreground"
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
