import Link from "next/link";
import { Bus } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import NavTabs from "@/components/NavTabs";
import Avatar from "@/components/Avatar";

export default async function Navbar() {
  const profile = await getCurrentProfile();

  return (
    <header className="glass sticky top-0 z-20 border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-light to-brand text-brand-foreground shadow-[0_4px_14px_-4px_var(--brand)]">
            <Bus size={19} strokeWidth={2.25} />
          </span>
          <span>
            <span className="block text-lg font-extrabold leading-none tracking-tight">
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
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
              >
                <Avatar avatarUrl={profile.avatar_url} fullName={profile.full_name} size={26} />
                {profile.full_name}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="btn-brand rounded-lg px-3 py-2 text-sm font-bold"
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>

      <NavTabs />
    </header>
  );
}
