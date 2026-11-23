# Identité « Amélia »

## Contexte
L'app s'appelle désormais Amélia. Le style d'origine (fond blanc, listes à plat, liens par défaut) ne donnait pas envie de cliquer et on s'y perdait. Une image de loutre de banque d'images a été donnée comme inspiration pour le logo.

## Options
Trois directions proposées : « Bord de rivière » (vert d'eau et saumon), « Loutre joueuse » (lilas et jaune), « Galet et corail » (fond galet, corail actuel, Archivo).

## Choix
- « Galet et corail » : fond galet #f1efec, encre #2e2b29, corail #d9482f pour l'action et les grands chiffres, sable #e4ddd5, loutre #6b6461 et museau #cbb59e. Tout ce qui se touche est posé sur une carte blanche (classe globale `.card`).
- Une barre de marque (loutre + « Amélia » + réglages) en haut de chaque écran à onglets, un grand numéro de semaine et une barre des 12 semaines sur l'écran Aujourd'hui, une encoche corail sur l'onglet courant.
- Logo : une loutre dessinée pour l'app (tête plate, petites oreilles basses, plastron blanc), pas une copie de l'image de référence, dont la licence ne couvre pas forcément un logo. Composant `OtterMark`, `public/favicon.svg`.

## Icônes PNG
Rendues depuis le SVG de la loutre (le contenu de `OtterMark`, couleurs en dur) avec Chrome sans interface : une page HTML de la taille de l'icône, fond #d9482f, loutre posée en bas et centrée, à 86 % de la largeur (70 % pour `pwa-maskable-512.png`, zone sûre Android), puis `chrome --headless=new --screenshot=<fichier> --window-size=<taille>,<taille>`.
