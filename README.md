# Amélia

Application web (PWA) qui guide un programme sportif de 12 semaines à la maison : séances de renfo A et B, course du mardi, fractionné du samedi, routines de posture et d'étirements, conseils, repas de la semaine et liste de courses. Tout reste sur le téléphone : pas de compte, pas de serveur.

Le contenu du programme est dans `src/data/program.json` et fait foi. Le brief complet est dans `docs/brief.md`.

## Installation

Node 20.19 ou plus récent (testé avec Node 24).

```bash
npm install
```

## Lancement

```bash
npm run dev
```

L'app est servie sous `/programme-12-semaines/` : http://localhost:5173/programme-12-semaines/

Les vidéos intégrées ne marchent qu'en http(s), pas en ouvrant le fichier directement (`file://`).

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm test` | Tests Vitest (planning, minuteur, dosages, suivi, cohérence du JSON) |
| `npm run build` | Typecheck puis build de production dans `dist/`, avec le service worker |
| `npm run preview` | Sert `dist/` en local pour tester l'installation et le hors ligne |
| `npm run lint` | oxlint |
| `npm run format` | Prettier |

Aucune variable d'environnement.

## Déploiement (GitHub Pages)

Le workflow `.github/workflows/deploy.yml` lance les tests, construit l'app et la publie à chaque push sur `main`.

Une seule fois, activer Pages avec GitHub Actions comme source :

```bash
gh api -X POST repos/<compte>/programme-12-semaines/pages -f build_type=workflow
```

(ou dans le dépôt : Settings, Pages, Source : GitHub Actions). L'app est ensuite en ligne sur `https://<compte>.github.io/programme-12-semaines/`.

Pour héberger ailleurs ou sous un autre nom de dépôt, changer `base` dans `vite.config.ts`.

## Structure

```
src/
  data/         program.json et ses types
  lib/          logique sans interface : planning, minuteur, sons, stockage, dosages, suivi
  state/        état de l'app (contexte React) relié au stockage local
  components/   briques d'interface : schéma, vidéo, minuteurs, barre d'onglets…
  screens/      un écran par route : Aujourd'hui, séances, Programme, Suivi, Conseils, Réglages
docs/           brief et fiches de décision
reference/      version web et PDF d'origine du programme
```

## Données

La progression (date de début, séances faites, ressenti, réglages) est enregistrée dans le `localStorage` du navigateur, sous une seule clé versionnée (`p12`). Elle s'exporte et s'importe en JSON depuis les réglages.

## Rappels d'eau (Supabase)

Les rappels passent par un projet Supabase (`supabase/`). Sans les variables `VITE_PUSH_FUNCTIONS_URL` et `VITE_VAPID_PUBLIC_KEY` (voir `.env.example`), l'app marche sans rappels. Mise en place : `docs/decisions/2026-11-24-rappels-eau.md`.
