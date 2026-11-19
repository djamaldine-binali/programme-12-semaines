# Stack et hébergement

## Contexte
App perso, sans compte ni serveur, utilisée sur téléphone pendant les séances. Le brief impose Vite, React, TypeScript et `vite-plugin-pwa`, avec un déploiement sur GitHub Pages ou Netlify.

## Options
- Next.js (stack par défaut) : rendu serveur inutile ici, tout est local au téléphone.
- Vite + React : demandé par le brief, build statique simple.
- Hébergement : GitHub Pages (dépôt public obligatoire en offre gratuite) ou Netlify (dépôt privé possible, compte à créer).

## Choix
- Vite 8, React 19, TypeScript 7, `vite-plugin-pwa` 2, Vitest 5, oxlint (fourni par le template Vite). Versions fixées, publiées depuis au moins deux semaines.
- Polices auto-hébergées avec Fontsource : hors ligne dès le premier lancement, aucune requête vers Google.
- Navigation par hash (`#/programme`) : fonctionne sur n'importe quel hébergeur statique, sans dépendance.
- GitHub Pages avec un dépôt public.

## Sources (consultées le 2026-11-19)
- Offres GitHub : https://docs.github.com/en/get-started/learning-about-github/githubs-plans (« GitHub Pages in public repositories » pour GitHub Free).
- Versions : registre npm (`npm view <paquet> time`).
