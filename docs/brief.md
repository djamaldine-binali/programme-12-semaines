# Web app « Programme 12 semaines »

Tu vas créer une web app mobile (PWA) qui guide une personne dans un programme sportif de 12 semaines à la maison. Tout le contenu du programme existe déjà et se trouve dans ce dossier. Ton travail : en faire une app agréable et fiable à utiliser au quotidien sur téléphone, pendant les séances.

Commence par lire `program.json` en entier, puis ouvre `reference/version-web-actuelle.html` et `reference/programme-12-semaines.pdf` pour comprendre le rendu actuel. Ensuite, propose-moi un plan court (architecture, écrans, étapes) avant d'écrire du code.

---

## 1. Contexte

- **Utilisatrice** : une femme de 22 ans, débutante. Elle s'entraîne à la maison avec une chaise pour seul matériel, et court dehors.
- **Ses objectifs** :
  - affiner le ventre, le haut du dos, les bras et les mollets ;
  - muscler les fessiers et les cuisses ;
  - courir 25 à 30 minutes sans s'arrêter à la fin du programme.
- **Le programme** :
  - 2 séances de renfo (A et B) qui évoluent chaque mois ;
  - une course le mardi, avec un plan semaine par semaine ;
  - du fractionné le samedi ;
  - une routine de posture le jeudi et le dimanche ;
  - des étirements après chaque séance ;
  - des conseils d'alimentation et de vie quotidienne.
- **Langue** : toute l'interface est en français. Le ton tutoie, encourage et reste simple, comme dans les textes de `program.json`.

## 2. Règles absolues

1. **Rien qui puisse complexer.** L'app ne demande, n'affiche et ne calcule jamais de poids, d'IMC, de tour de taille, de calories, de mensurations ni de photos avant/après (voir `meta.never_show`). Le suivi porte uniquement sur la régularité : séances faites, semaines complétées, ressenti.
2. **Le contenu de `program.json` fait foi.** Ne modifie pas les exercices, les séries, les consignes ou les textes, et n'en ajoute pas. Si quelque chose te semble incohérent, signale-le-moi au lieu de le corriger tout seul.
3. **Pas de backend, pas de compte.** Tout reste sur l'appareil.
4. **La sécurité reste visible** : les règles « écouter son corps » et « douleur en course » (`rules.listen_to_body`, `rules.running_pain_rule`) doivent apparaître aux bons endroits, pas seulement dans une page cachée.

## 3. Les données (`program.json`)

- `meta` : titre, public, objectifs (`goals.affiner`, `goals.muscler`), matériel, éléments interdits.
- `week_template` : l'activité de chaque jour de la semaine. Le vendredi, on fait la séance A les semaines impaires et la B les semaines paires.
- `rules` :
  - repos entre les séries : 60 à 90 s ;
  - semaines allégées : 4 et 8, avec la règle qui va avec ;
  - progression : règle de passage à la version suivante ;
  - étirements : à faire après chaque séance ;
  - pas par jour selon le mois ;
  - règles de sécurité.
- `exercises` : 33 exercices, indexés par id. Chacun a :
  - `name` et `cue` (la consigne) ;
  - `youtube_id` et `youtube_url` ;
  - `diagram_svg` : un schéma en SVG inline. En gris la position de départ, en noir l'arrivée, avec une flèche entre les deux. Pour les exercices statiques, une seule position.
- `sessions.A` / `sessions.B` : la liste ordonnée des exercices. Chaque item a 3 entrées `months` (mois 1, 2, 3), chacune avec l'id de l'exercice du mois et un `dose` structuré :
  - `sets` : nombre de séries ;
  - `target` : répétitions ou secondes ;
  - `unit` : `reps`, `seconds` ou `taps` ;
  - `per_side` : par jambe ou par côté ;
  - `note` : par exemple « pause 2 s en haut » ;
  - `text` : la version lisible du dosage.

  L'exercice peut changer d'un mois à l'autre : par exemple, le pont fessier devient pieds sur chaise, puis sur une jambe.
- `posture_routine`, `stretch_routine` : listes d'exercices avec leur dosage en texte (par exemple « 30 s / côté » ou « 10 lents »).
- `running` :
  - `tuesday_runs` : un objet par semaine (1 à 12), avec `reps`, `run_s`, `walk_s` et `deload`. Les semaines 11 et 12 sont en continu, de 25 à 30 min ;
  - échauffement et retour au calme : 5 min de marche chacun ;
  - `saturday_intervals` : un objet par mois. Le mois 1, le fractionné se fait à la maison avec 4 mouvements en rotation. Les mois 2 et 3, il se fait en courant.
- `nutrition`, `daily_life` : les conseils, en texte.

Crée des types TypeScript qui décrivent exactement ce JSON, et importe-le tel quel.

## 4. Fonctionnalités

### Démarrage
- Au premier lancement, elle choisit la date de début. Propose le lundi qui vient, modifiable ensuite dans les réglages.
- L'app calcule la semaine (1 à 12), le mois (1 à 3), le jour et l'activité prévue.
- Avant le début, l'app affiche un écran d'attente. Après la semaine 12, elle affiche un écran « programme terminé » qui conseille 2 à 4 semaines de maintien en gardant les mêmes habitudes.

### Aujourd'hui (écran d'accueil)
- L'activité du jour, en grand, avec un bouton pour la démarrer.
- La semaine en cours : les 7 jours, avec ceux déjà faits cochés.
- Un rappel discret si la semaine est allégée, et l'objectif de pas du mois.
- On peut lancer une autre séance que celle prévue, par exemple si elle a décalé un jour.

### Séance de renfo (mode guidé)
- On avance exercice par exercice. Chaque écran montre :
  - le schéma SVG en grand ;
  - le nom et le dosage du mois en cours (2 séries seulement en semaine allégée) ;
  - la consigne ;
  - la vidéo.
- Un compteur de séries. Pour les exercices en secondes, un minuteur qui enchaîne les deux côtés quand l'exercice est « par côté ».
- Un minuteur de repos entre les séries (60, 75 ou 90 s, à régler), avec un bip et une vibration à la fin.
- Des boutons Suivant, Précédent et Passer.
- À la fin, l'app propose d'enchaîner la routine d'étirements, puis enregistre la séance comme faite.

### Course du mardi
- Un minuteur d'intervalles guidé pour la semaine en cours : échauffement, puis les répétitions course/marche, puis le retour au calme.
- Les chiffres sont très grands et lisibles en courant, avec la phase en cours bien visible (course ou marche) et la suivante.
- Un bip différent pour chaque phase, plus une vibration. Utilise la Web Audio API et `navigator.vibrate` quand c'est disponible.
- L'écran reste allumé avec la Wake Lock API quand c'est possible. Si ça ne marche pas, rien ne doit planter.
- Pause, reprise et arrêt. Le rappel « douleur aux tibias ou aux genoux » s'affiche avant de démarrer.
- À la fin, elle donne son ressenti (facile, ok ou dur). Si elle répond « dur », l'app propose de refaire cette étape la semaine suivante. Elle choisit, rien ne change automatiquement.

### Fractionné du samedi
- Un minuteur effort/récupération adapté au mois.
- Le mois 1, l'app affiche le mouvement à faire à chaque tour (rotation des 4 mouvements), avec la fiche « mountain climbers » accessible.
- Les semaines 4 et 8, le fractionné est remplacé par une marche de 30 min.

### Posture et étirements
- Des routines guidées avec un minuteur pour les positions tenues. Pour « par côté », l'app enchaîne les deux côtés.

### Programme et bibliothèque
- Une vue d'ensemble des 12 semaines et des 3 mois, avec ce qui change d'un mois à l'autre.
- Une bibliothèque des 33 fiches : schéma, consigne, vidéo, et dans quelle séance et quel mois l'exercice apparaît.

### Suivi
- Un calendrier ou historique des séances faites, avec le ressenti.
- Le nombre de semaines complétées, sans gamification envahissante.
- Aucune mesure corporelle.

### Conseils
- Les objectifs (affiner / muscler) et les textes de `nutrition` et `daily_life`, plus la règle « écouter son corps ».

### Réglages
- Date de début, durée de repos, sons et vibrations, thème (auto, clair ou sombre).
- Export et import de la progression en fichier JSON, et remise à zéro (avec confirmation).

## 5. Vidéos intégrées

- La vidéo se lit **dans l'app**, sans ouvrir YouTube.
- Utilise un lecteur « façade » : on affiche la miniature `https://i.ytimg.com/vi/<id>/hqdefault.jpg` avec un bouton lecture. Au tap seulement, on la remplace par l'iframe `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&playsinline=1&rel=0`. Rien de YouTube ne se charge tant qu'elle ne clique pas.
- Affiche toujours, en petit, un lien « Ouvrir sur YouTube » en solution de secours.
- **Vérifie que chacune des 33 vidéos accepte l'intégration**, par exemple via `https://www.youtube.com/oembed?url=<youtube_url>&format=json` : une réponse 401 ou 404 veut dire que l'intégration est bloquée ou que la vidéo a disparu. Donne-moi la liste de celles qui posent problème au lieu de les remplacer toi-même.
- Note : les lecteurs intégrés ne marchent que si l'app est servie en http(s), pas en `file://`.

## 6. Stack et architecture

- Vite, React et TypeScript, avec `vite-plugin-pwa`. L'app doit être installable sur l'écran d'accueil et marcher hors ligne, sauf les vidéos.
- CSS simple : variables CSS et CSS modules ou un fichier par composant. Pas de framework UI lourd.
- Le stockage local passe par un petit module unique (localStorage, avec try/catch), versionné pour pouvoir migrer plus tard.
- Organisation suggérée, que tu peux ajuster si tu as mieux :
  - `src/data/program.json` et `src/data/types.ts` ;
  - `src/lib/schedule.ts` : date de début → semaine, mois, jour, activité, semaine allégée, alternance A/B du vendredi ;
  - `src/lib/timer.ts`, `src/lib/sound.ts`, `src/lib/storage.ts` ;
  - `src/screens/` : Today, Workout, Run, Intervals, Routine, Program, Library, History, Tips, Settings ;
  - `src/components/` : Diagram, VideoFacade, Timer, SetCounter, WeekStrip, etc.
- La navigation se fait par une barre d'onglets en bas : Aujourd'hui, Programme, Suivi, Conseils. Les réglages sont accessibles depuis l'accueil.
- Les tests (Vitest) portent au minimum sur `schedule.ts` :
  - calcul de la semaine et du mois ;
  - semaines 4 et 8 ;
  - alternance A/B le vendredi ;
  - avant le début et après la semaine 12 ;
  - changement d'heure.
- Le déploiement se fait sur GitHub Pages ou Netlify. Mets les étapes exactes dans le README.

## 7. Design

- Reprends la direction de `reference/version-web-actuelle.html` :
  - fond blanc franc, encre chaude `#1d1a18` ;
  - corail `#d9482f` pour le renfo, bleu `#2b5aa6` pour la course, sable `#efe9e1` pour la récupération ;
  - polices Archivo (titres) et Inter (texte) ;
  - un thème sombre cohérent.
- Les schémas gardent un fond clair (`#efe9e1`) dans les deux thèmes, pour rester lisibles.
- Pense mobile d'abord : cibles tactiles de 44 px minimum, texte de 16 px minimum, contrastes AA, focus visible, `prefers-reduced-motion` respecté.
- **Je ne veux pas d'esthétique « générée par IA »** : pas de dégradés violets, de glassmorphism partout, d'emojis en guise d'icônes, de cartes toutes identiques avec une barre colorée, ni de slogans creux. Je veux une app qui ressemble à un vrai produit, sobre, avec du caractère, pensée pour être utilisée en sueur avec une main.
- Pour les icônes, utilise une seule librairie cohérente (par exemple Lucide) ou des SVG simples faits main.

## 8. Style de code

- Le code doit avoir l'air écrit par un humain : des noms clairs, des petites fonctions, des composants courts, pas de code mort.
- Pas de commentaires inutiles. Les rares commentaires nécessaires sont brefs et naturels, comme ceux qu'écrirait un développeur pour un collègue.
- Pas de dépendances superflues. Chaque dépendance doit servir.
- Un README en français, concret : installation, lancement, build, déploiement, structure du projet. Pas de blabla marketing.
- Je suis étudiant en développement web. À la fin, explique-moi en quelques lignes les choix importants (calcul du planning, minuteurs, PWA, stockage) pour que je puisse reprendre le code moi-même.

## 9. Comment procéder

1. Lis tout le dossier, puis propose un plan : écrans, architecture et ordre de réalisation. Attends mon feu vert.
2. Commence par le socle : types, `schedule.ts` avec ses tests, stockage, navigation.
3. Ensuite, dans cet ordre : écran Aujourd'hui, séance guidée de renfo, course, fractionné, routines, bibliothèque, suivi, conseils, réglages, PWA.
4. Vérifie les vidéos (section 5) et donne-moi la liste de celles qui posent problème.
5. Termine par une checklist de ce que je dois tester sur un vrai téléphone (iPhone et Android) : sons, vibrations, écran qui reste allumé, installation, hors ligne, vidéos.

## 10. Critères de réussite

- Une séance complète (renfo, course, fractionné, posture, étirements) se fait du début à la fin sans quitter l'app.
- Le dosage affiché correspond toujours au bon mois et à la bonne semaine, allégée ou non.
- Les minuteurs restent justes même si l'écran se met en veille un instant : ils se basent sur des horodatages, pas sur un simple compteur incrémenté.
- Aucune mention de poids, d'IMC, de mensurations ou de calories, nulle part.
- L'app est installable, utilisable hors ligne, lisible en plein soleil comme en thème sombre.
- `npm run build` et les tests passent sans erreur.
