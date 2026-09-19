# SenTrajet 🚌🇸🇳

Covoiturage interurbain au Sénégal — trouvez ou proposez un trajet entre les
14 régions du pays, réservez en ligne et payez par Wave, Orange Money, Free
Money ou carte bancaire via [PayTech](https://paytech.sn).

## Structure du monorepo

```
sen-trajet/
├── web/        Application web (Next.js 16, App Router, Supabase, PayTech)
├── mobile/     Application mobile (Expo / React Native, iOS + Android)
└── supabase/
    └── schema.sql   Schéma de base de données (tables, RLS, triggers)
```

Le web et le mobile partagent la même base Supabase. Le mobile appelle en
plus deux routes API du site web (`/api/bookings`, `/api/paytech/initiate`)
pour la création de réservation et le déclenchement du paiement, car ces
opérations doivent s'exécuter côté serveur (clé secrète PayTech).

## 1. Mettre en place Supabase

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL du projet, exécutez le contenu de `supabase/schema.sql`.
3. Récupérez dans **Project Settings → API** : `Project URL`, `anon public
   key` et `service_role key`.
4. (Optionnel) Désactivez la confirmation d'email si vous testez rapidement,
   dans **Authentication → Providers → Email**.

## 2. Mettre en place PayTech

1. Créez un compte marchand sur [paytech.sn](https://paytech.sn).
2. Récupérez votre `API_KEY` et `API_SECRET` dans le tableau de bord.
3. Laissez `PAYTECH_ENV=test` pendant l'intégration (bac à sable), puis
   passez à `prod` pour accepter de vrais paiements.
4. Documentation API : <https://docs.intech.sn/doc_paytech.php>

## 3. Lancer le site web

```bash
cd web
cp .env.example .env.local   # puis renseignez vos clés Supabase / PayTech
npm install
npm run dev
```

Le site est alors disponible sur <http://localhost:3000>. C'est aussi le
serveur que l'application mobile appelle pour créer une réservation et
lancer un paiement — il doit donc être déployé (Vercel, par ex.) pour que le
mobile fonctionne en dehors du développement local.

## 4. Lancer l'application mobile

```bash
cd mobile
cp .env.example .env   # pointez EXPO_PUBLIC_API_BASE_URL vers le site déployé
npm install
npm run start           # puis 'a' pour Android, 'i' pour iOS, 'w' pour le web
```

L'app mobile lit et écrit directement dans Supabase (recherche, publication
de trajet, profil), et appelle les routes `/api/bookings` et
`/api/paytech/initiate` du site web pour réserver et payer. Le paiement
PayTech s'ouvre dans un navigateur intégré, limité à Wave et Orange Money.

## Fonctionnalités

- 🔍 Recherche de trajets par ville de départ, destination et date
- ➕ Publication d'un trajet (prix, places, véhicule, notes)
- 👤 Comptes utilisateurs (email + mot de passe via Supabase Auth)
- 💳 Paiement en ligne Wave / Orange Money via PayTech, avec webhook IPN
  vérifié par signature HMAC-SHA256
- ⭐ Profils avec note, nombre de trajets et badge « vérifié »
- 📱 Application mobile Expo (iOS + Android) partageant le même backend

## Notes de sécurité

- Toutes les tables Supabase ont la Row Level Security (RLS) activée : un
  utilisateur ne peut modifier que ses propres trajets/réservations.
- Les écritures sur `payments` ne se font que côté serveur (clé
  `service_role`), jamais depuis le client.
- Le webhook `/api/paytech/ipn` rejette toute notification dont la
  signature HMAC ne correspond pas — voir `web/src/lib/paytech.ts`.
