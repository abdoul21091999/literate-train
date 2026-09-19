"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Plus, ClipboardList } from "lucide-react";

const TABS = [
  { href: "/", label: "Rechercher", icon: Search },
  { href: "/publier", label: "Publier", icon: Plus },
  { href: "/business-plan", label: "Business Plan", icon: ClipboardList },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex max-w-5xl gap-1 border-t border-border px-4">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "border-brand text-foreground"
                : "border-transparent text-muted hover:border-brand/50 hover:text-foreground"
            }`}
          >
            <Icon size={15} strokeWidth={2.25} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
