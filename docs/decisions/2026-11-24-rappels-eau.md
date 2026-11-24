# Compteur d'eau et rappels

## Contexte
Demande : des rappels pour boire de l'eau au fil de la journée, et un compteur qui sait où elle en est selon ses réponses aux rappels (« je bois maintenant » ou « déjà bu »). L'app n'a pas de serveur : une app web ne peut afficher une notification que si un serveur la pousse (Web Push), même quand elle est fermée.

## Options
- Rappels seulement app ouverte : aucun serveur, mais pas de rappel app fermée.
- Web Push avec un petit serveur Supabase (UE) : vrais rappels, sur iPhone seulement si l'app est installée sur l'écran d'accueil (iOS 16.4 et plus).
- Web Push avec Cloudflare Workers : tâches planifiées sans mise en pause, mais hors de la stack habituelle.

## Choix
- Supabase, région West EU (Paris), offre gratuite : l'utilisateur l'utilisera aussi pour ses sites. Une table `push_subscriptions` (RLS activée, aucun accès public), trois fonctions (`subscribe`, `unsubscribe`, `send-reminders`), un job `pg_cron` toutes les heures.
- Le serveur ne connaît que l'abonnement du téléphone, son fuseau et les heures de rappel (10 h à 20 h, toutes les 2 h). Les quantités bues restent sur le téléphone : c'est le service worker qui rédige le rappel à partir d'IndexedDB.
- L'eau est stockée en IndexedDB et non dans l'état localStorage, parce que le service worker doit la lire et l'écrire. Elle n'est donc pas dans l'export de la progression.
- Objectif par défaut 2 L par jour (référence EFSA pour une femme, eau des aliments comprise), réglable à 1,5 ou 2,5 L. Le rythme attendu va de 8 h à 21 h.
- Sur iPhone, les notifications n'ont pas de boutons : toucher le rappel ouvre un écran « Je bois maintenant / C'est déjà fait / Plus tard ». Sur Android, les boutons sont dans la notification.
- Mise en pause des projets gratuits après une semaine sans activité : le job horaire interroge la base, et un workflow GitHub fait une vraie requête chaque jour en plus.

## Mise en place
1. `node scripts/generate-push-secrets.mjs <identifiant du projet>` : écrit les clés VAPID et le secret du job dans `supabase/functions/.env` et `supabase/vault-setup.local` (ignorés par Git), et les deux valeurs publiques dans `.env.local`.
2. Coller le contenu de `supabase/vault-setup.local` dans l'éditeur SQL du tableau de bord.
3. `supabase link <identifiant>`, `supabase secrets set --env-file supabase/functions/.env`, `supabase db push`, puis `supabase functions deploy subscribe unsubscribe send-reminders --no-verify-jwt`.
4. Variables du dépôt GitHub `VITE_PUSH_FUNCTIONS_URL` et `VITE_VAPID_PUBLIC_KEY` (valeurs publiques) pour le build.

## Sources (consultées les 2026-11-23 et 2026-11-24)
- Planifier une fonction : https://supabase.com/docs/guides/functions/schedule-functions
- pg_net : https://supabase.com/docs/guides/database/extensions/pg_net
- Secrets des fonctions : https://supabase.com/docs/guides/functions/secrets
- Mise en pause des projets gratuits : https://supabase.com/docs/guides/platform/free-plan-pausing
- Web Push sur iOS : https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- Bibliothèque d'envoi : https://jsr.io/@negrel/webpush (0.5.0)
- EFSA, eau : https://www.efsa.europa.eu/es/press/news/nda100326
- À vérifier au déploiement : la commande `create extension pg_cron` n'apparaît pas dans la doc lue.
