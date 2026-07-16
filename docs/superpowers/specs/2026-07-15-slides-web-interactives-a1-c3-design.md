# Slides Web interactives A1 à C3 — Spécification de conception

Date : 15 juillet 2026
Statut : conception validée par Paul

## 1. Objectif

Créer le mode présentation Web de la formation « Les briques du Vibe Coding »
pour toutes les briques comprises entre A1 et C3. Le livrable n'est pas un
PowerPoint. Il s'intègre au site Astro existant et devient le support projeté
pendant la formation.

Le mode présentation doit :

- expliquer la progression globale puis décortiquer chaque concept ;
- rester très visuel et compréhensible au premier regard ;
- proposer des interactions qui révèlent réellement le fonctionnement d'une idée ;
- ouvrir le wiki, les ressources officielles et les pages de téléchargement au
  bon moment ;
- rester compréhensible après la formation sans devenir un document dense ;
- fournir à Mathieu les mêmes composants, règles et outils pour produire D à F.

Le site canonique utilisé par les liens est
`https://formation-ia-ruby.vercel.app`.

## 2. Public et contexte d'usage

Le public comprend 11 à 25 adultes débutants, sur Mac et Windows, avec des
niveaux techniques variés. Les slides sont projetées et pilotées par un
formateur. Les participants disposent du site sur leur propre ordinateur et
ouvrent directement les liens proposés ; aucun QR code n'est requis.

Le deck est hybride : il privilégie l'animation en salle, tout en gardant assez
de contexte pour qu'une personne retrouve ensuite l'idée et le chemin vers la
documentation détaillée.

## 3. Principes éditoriaux

### 3.1 Le nombre de slides dépend du raisonnement

Aucune brique ne reçoit un quota automatique. Un concept utilise exactement le
nombre de slides nécessaire pour être compris sans surcharger l'écran. Une
slide est ajoutée seulement lorsqu'elle représente une nouvelle étape de
compréhension, un nouvel état ou une nouvelle décision.

Une slide trop dense doit être découpée. Deux slides qui n'ajoutent pas de
progression cognitive doivent être fusionnées. La concision est obtenue par le
choix du bon visuel, pas par la suppression d'une étape indispensable.

### 3.2 Une slide porte une thèse

Chaque slide possède :

- une thèse ou une consigne formulée en une phrase ;
- un objet visuel dominant qui prouve, simule ou rend manipulable cette thèse ;
- quelques repères textuels seulement ;
- un lien contextuel lorsqu'une profondeur supplémentaire est utile ;
- une note formateur séparée du contenu projeté.

Le visuel occupe généralement 70 à 85 % de la composition et porte environ 80 %
de l'explication. Le texte complète le raisonnement oral ; il ne compense pas un
visuel décoratif ou vague.

### 3.3 Rythme d'une brique

Les rôles suivants sont disponibles sans devenir une séquence obligatoire :

1. ouverture et résultat visé ;
2. idée forte ;
3. décomposition du mécanisme ;
4. démonstration ou manipulation ;
5. mission et critère de réussite ;
6. checkpoint observable ;
7. approfondissement facultatif ;
8. transition vers la brique suivante.

Chaque brique retient uniquement les rôles utiles. Les compositions varient
pour éviter une cadence mécanique.

## 4. Architecture du mode présentation

### 4.1 Source de vérité

Les briques MDX existantes restent la source détaillée et durable. Une couche
de narration séparée contient uniquement la version condensée nécessaire aux
slides : thèses, états du visuel, libellés courts, notes formateur et liens.

Cette séparation évite de transformer les MDX en fichiers de mise en page et
évite aussi de recopier les explications complètes dans les slides.

### 4.2 Composants logiques

- **Manifeste de présentation** : ordre des briques et des slides, contenu
  condensé, type de scène, liens et notes.
- **Registre de scènes** : associe chaque type de scène à un composant Astro ou
  JSX réutilisable.
- **Scènes pédagogiques** : composants visuels spécialisés, interactifs lorsque
  l'interaction apporte du sens.
- **Shell de présentation** : navigation, progression, plein écran, sommaire et
  panneau formateur.
- **Résolveur de liens** : construit et valide les liens profonds vers le wiki
  et distingue les destinations internes, officielles et de téléchargement.
- **Validation de contenu** : échoue tôt si une slide, une ancre, un ordre ou un
  composant référencé est invalide.

Le projet reste statique. Aucun compte, backend, stockage distant ou
synchronisation entre écrans n'est ajouté.

### 4.3 Routes

- `/presenter` : lancement, sommaire et reprise de la séquence ;
- `/presenter/<brique>/<slide>` : URL stable d'une slide ;
- un état interactif significatif peut être représenté dans l'URL lorsqu'il
  doit être partageable ou retrouvable ;
- les slides inconnues renvoient vers le sommaire avec une explication claire.

### 4.4 Format du manifeste

Chaque entrée décrit au minimum :

- identifiant stable ;
- brique source ;
- rôle pédagogique ;
- thèse ou consigne ;
- composant visuel ;
- données et états nécessaires au visuel ;
- notes formateur, durée indicative et transition ;
- liens vers le wiki et les sources externes ;
- texte alternatif ou description équivalente.

Le manifeste doit rester assez simple pour que Mathieu ajoute D à F sans
modifier le moteur.

## 5. Système visuel

### 5.1 Direction retenue

La direction s'appelle **champ lumineux vivant**. Elle prolonge le kit de
construction du site sans reprendre son fond quadrillé.

- fond ivoire clair ;
- grands halos lumineux très lents, teintés par la famille pédagogique ;
- aucun motif de mosaïque ou grille permanente ;
- formes franches et contours nets pour les objets qui ont un rôle ;
- accent jaune pour A, bleu pour B, corail pour C, puis couleurs existantes du
  site pour D à F ;
- Archivo pour les affirmations et Inter pour les repères ;
- Geist Mono uniquement pour les commandes, fichiers ou données techniques ;
- mouvement périphérique discret, automatiquement supprimé avec
  `prefers-reduced-motion`.

Le fond ne doit jamais être l'animation principale. Le mouvement central sert
le mécanisme expliqué.

### 5.2 Grammaires visuelles

Le registre propose des familles de représentations, pas des gabarits rigides :

- transformation avant/après ;
- séquence ou boucle ;
- comparaison synchronisée ;
- carte de système et flux ;
- décision et embranchement ;
- simulation manipulable ;
- construction progressive ;
- mission et checkpoint ;
- transition et changement d'échelle.

Chaque conteneur, flèche, état et animation doit encoder une relation réelle.
Les cartes décoratives, icônes génériques, effets gratuits et faux tableaux de
bord sont interdits.

### 5.3 Test de compréhension visuelle

Avant validation, chaque slide passe trois tests :

1. **test silencieux** : l'idée principale est identifiable sans commentaire ;
2. **test du coup d'œil** : la hiérarchie se lit en quelques secondes sur un
   vidéoprojecteur ;
3. **test de nécessité** : l'interaction ou l'animation révèle une relation qui
   serait moins claire dans un visuel statique.

Une interaction sans valeur pédagogique est supprimée.

## 6. Skill `slide-visual-director`

Un skill versionné dans `.agents/skills/slide-visual-director/` garantit la
continuité du langage visuel. Il doit se déclencher lors de la création, de la
refonte ou de la modification d'une slide ou d'un composant visuel du mode
présentation.

Son entrée comprend la thèse, l'objectif d'apprentissage, le public, la slide
précédente, la slide suivante et les contraintes techniques. Son workflow :

1. reformuler ce que le visuel doit faire comprendre ;
2. choisir une grammaire visuelle pertinente ;
3. définir les états, relations et interactions avant de dessiner ;
4. construire ou adapter le composant en Astro/JSX, SVG, CSS ou Canvas ;
5. fournir un équivalent accessible et une version à mouvement réduit ;
6. vérifier les trois tests de compréhension visuelle ;
7. rendre compte des compromis éventuels.

Le skill contient un `SKILL.md`, les métadonnées d'agent et une référence courte
au contrat visuel. Il ne duplique pas le code des composants et ne contient pas
d'effets préfabriqués sans signification.

## 7. Interactions et navigation

### 7.1 Contrôles

- flèches gauche et droite pour naviguer ;
- espace pour avancer lorsque le focus n'est pas dans un contrôle ;
- boutons précédent et suivant toujours visibles ou facilement révélables ;
- sommaire accessible à tout moment ;
- mode plein écran ;
- progression par bloc, brique et slide ;
- panneau formateur masqué par défaut avec notes, durée et transition.

Le système ne détourne pas une touche lorsqu'un lien, un bouton, un champ ou un
contrôle interactif possède le focus.

### 7.2 Interactions sémantiques

Une interaction peut :

- révéler les étapes d'une boucle ;
- modifier un paramètre et montrer sa conséquence ;
- comparer deux états alignés ;
- ouvrir ou fermer une branche explicative ;
- rejouer une transformation ;
- vérifier une décision ou un classement.

Tous les contrôles fonctionnent au clavier, exposent un libellé accessible et
conservent un ordre de focus logique. Sans JavaScript, la slide montre un état
final compréhensible au lieu d'une zone vide.

### 7.3 Contrat des liens

Les liens sont visibles, nommés par leur destination et s'ouvrent dans un nouvel
onglet lorsque la présentation doit rester affichée.

- **Approfondir** : ancre précise de la brique sur le wiki ;
- **Ressource officielle** : documentation ou article source ;
- **Télécharger** : page officielle de l'application ou du système ;
- **Digression** : explication complémentaire ou ressource recommandée.

Les liens utilisent le domaine canonique et jamais une URL locale. Un lien
externe est distingué visuellement sans dépendre seulement de la couleur.

## 8. Colonne vertébrale visuelle A1 à C3

Le plan détaillé des slides sera établi pendant la planification. Les objets
visuels structurants attendus sont :

- **A1** : prédiction token par token et influence du contexte ;
- **A2** : réponse, workflow et agent comparés par leur boucle et leur autonomie ;
- **A3** : continuum Chat, Artifacts, Cowork et Claude Code selon contexte,
  action et contrôle ;
- **A4** : circulation du contexte et facteurs de consommation ;
- **A5** : audit interactif Stop — Source — Test — Décision ;
- **B0** : diagnostic de disponibilité et chemins de repli ;
- **B1** : transformation d'une demande vague en brief à quatre blocs ;
- **B2** : boucle MVP, trois tests, correction ;
- **B3** : cadre P.A.C.T.E. appliqué à un dossier et à ses permissions ;
- **B4** : boucle I.P.M.T.R., permissions, test et lecture du diff ;
- **B4-bis** : relation dossier, fichier, éditeur et terminal, avec chemins Mac
  et Windows ;
- **C1** : anatomie d'un Skill, déclenchement positif et négatif ;
- **C2** : chaîne utilisateur, client Claude, serveur MCP et API ou ressource,
  avec permissions et révocation ;
- **C3** : événement contre cadence, puis cycle de vie observable et réversible
  d'une automatisation.

Cette liste impose les idées à rendre visibles, pas un nombre de slides.

## 9. Robustesse et erreurs

Le build échoue si :

- deux slides possèdent le même identifiant ;
- l'ordre ou la route est incohérent ;
- une brique, un composant ou une ancre interne référencée manque ;
- un lien de téléchargement n'utilise pas une source officielle déclarée ;
- une slide interactive ne fournit pas de description accessible ou de repli ;
- le manifeste D à F ne respecte pas le même contrat public.

Les indisponibilités temporaires d'un site externe ne doivent pas bloquer chaque
build local. Leur URL, leur provenance et leur statut sont cependant contrôlés
avant publication de la formation.

## 10. Vérification

La livraison est terminée lorsque :

- toutes les briques A1 à C3 possèdent une narration complète ;
- chaque slide passe les tests silencieux, du coup d'œil et de nécessité ;
- la navigation fonctionne au clavier, au clic et en plein écran ;
- les états interactifs restent compréhensibles avec mouvement réduit ;
- les routes peuvent être ouvertes et rafraîchies directement ;
- les liens internes, officiels et de téléchargement sont valides ;
- le panneau formateur affiche notes, durée et transition ;
- les vues sont vérifiées en 16:9, sur écran plus étroit et sur mobile ;
- les contrôles éditoriaux, tests automatisés et build Astro passent ;
- Mathieu peut créer une slide D à F avec le manifeste, les composants et le
  skill sans modifier le shell.

## 11. Hors périmètre

- fichier PowerPoint ou export PPTX ;
- QR codes ;
- synchronisation des écrans participants ;
- compte utilisateur ou backend ;
- reproduction complète du wiki dans les slides ;
- animation décorative sans fonction pédagogique ;
- obligation d'un nombre identique de slides par brique.
