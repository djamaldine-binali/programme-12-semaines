# Programme 12 semaines

PWA perso (Vite, React, TypeScript) qui guide un programme sportif de 12 semaines. Le brief complet est dans `docs/brief.md`.

## Commandes
- `npm run dev`, `npm run build`, `npm test` (Vitest), `npm run lint` (oxlint), `npm run format` (Prettier).

## Règles du projet
- `src/data/program.json` fait foi : ne jamais modifier ni compléter son contenu. Signaler les incohérences.
- Jamais de poids, IMC, mensurations, calories ni photos (voir `meta.never_show`).
- Pas de backend : tout passe par `src/lib/storage.ts` (une clé localStorage versionnée).
- Interface en français, tutoiement ; code, noms et commits en anglais.
- Dates : toujours des `DayKey` (`AAAA-MM-JJ`) et les fonctions de `schedule.ts`, jamais de calcul en millisecondes (changement d'heure).
- Minuteurs : basés sur des horodatages (`Date.now()`), jamais sur un compteur incrémenté.
- Corail `--coral` (#d9482f) seulement pour les aplats et les grands chiffres ; texte et boutons en `--coral-strong` (contraste AA).

## Pièges
- `package.json` force `glob` 14 sous `workbox-build` (faille de glob 11) : à retirer quand vite-plugin-pwa embarquera un workbox à jour.
- Les vidéos YouTube ne se lisent pas en `file://` : tester avec `npm run dev` ou `npm run preview`.
