# Repas de la semaine et listes de courses

## Contexte
Demande : des menus pour tous les repas, adaptés à l'objectif et à la séance du jour, à partir de plats qu'elle aime (fromage, viande, poulet, plats frits, cookies, pâtes all'assassina, camembert au four, pommes dauphines), avec recettes pour 1 et 2 personnes et une liste de courses chiffrée à l'Intermarché de Septèmes-les-Vallons pour 2 ou 3 jours. Équipement : four, airfryer, micro-ondes.

## Options
- Menus générés à la volée ou différents chaque semaine : plus de variété, mais des listes de courses impossibles à chiffrer à l'avance.
- Une semaine type fixe, calée sur la semaine du programme : simple à suivre et chiffrable.
- Prix : relevé automatique impossible (intermarche.com répond 403 aux requêtes hors navigateur) ; relevé manuel dans le navigateur avec le magasin choisi.

## Choix
- Une semaine type de 7 jours dans `src/data/meals.json`, séparée de `program.json`, générée par un script hors dépôt : toute modification des listes de courses doit revérifier que les achats couvrent les recettes de chaque bloc. Plats préférés en versions au four ou à l'airfryer, plats du soir cuisinés en double pour le déjeuner du lendemain.
- Rien sur les calories ni le poids (règle `meta.never_show`), un test le vérifie. Aucun aliment interdit.
- Trois listes : lundi à mercredi, jeudi et vendredi, samedi et dimanche, pour 1 et 2 personnes. Les quantités à acheter viennent des besoins de chaque recette, au conditionnement le moins cher, en tenant compte de ce qui reste des listes précédentes (la salade, le poulet frais, le lait et la purée de tomates ouverts ne sont pas reportés). Le placard (huile, épices, riz, pâtes) est une liste à part.
- Le choix 1 ou 2 personnes est enregistré dans les réglages (`settings.servings`).

## Sources
- Prix relevés le 2026-11-23 sur intermarche.com, magasin Intermarché Super Septèmes-les-Vallons. Les produits en vrac sont comptés au prix d'une pièce moyenne affiché par le site.
- À refaire de temps en temps : les prix changent avec les promotions, certains produits étaient en promo ce jour-là (haricots rouges Saint Eloi 250 g).
