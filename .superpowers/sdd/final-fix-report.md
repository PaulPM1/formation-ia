# Rapport de correction finale du Bloc B

Date : 23 juillet 2026

Base de travail : `8b300053fa9d42de72539b706129a94a91423d78`

## Statut

Les quatre findings importants et le finding mineur sont corrigés sans ajout de
fonctionnalité ni de dépendance runtime.

- 21 routes B conservées.
- 110 slides conservées.
- 75 minutes de socle conservées.
- 10 minutes de rattrapage B4-bis conservées.
- ZIP public déterministe et synchronisé.
- Aucun U+2014 ajouté.
- Aucun paquet runtime ajouté.

## Fichiers

Contrat B3 et intégrations :

- `kits/bloc-b-assistant/mission-agent/brief-contract.mjs`
- `kits/bloc-b-assistant/mission-agent/verify-brief.mjs`
- `src/features/block-b/brief-validator.ts`
- `public/kits/bloc-b-assistant.zip`

Contenu et présentation :

- `src/presentation/manifests/b.ts`
- `kits/bloc-b-assistant-formateur/README.md`
- `kits/bloc-b-assistant-formateur/replis.md`
- `kits/bloc-b-assistant-formateur/corriges/objet-correction.md`
- renommage de `corriges/brief-chat-6-lignes.md` vers
  `corriges/brief-chat.md`

QA et tests :

- `scripts/qa-block-b-wiki.mjs`
- `tests/helpers/block-b-brief-cases.ts`
- `tests/block-b-brief-validator.test.ts`
- `tests/block-b-curriculum.test.ts`
- `tests/block-b-kit.test.ts`
- `tests/site-theme.test.ts`

## TDD, preuves RED puis GREEN

### Groupe éditorial B1, B2 et B4-bis

RED :

```text
npm test -- --test-name-pattern="titres des decks B|B1 contrôle la fiche réelle|B4 et B4-bis restent génériques|corrigés formateur|repli B2"
5 échecs ciblés :
- B0 portait encore le titre Préflight ;
- B1 corrigeait encore une longueur de brief ;
- le lien Claude Code pointait vers la variante VS Code ;
- le corrigé B2 demandait encore de rejouer quatre tests ;
- le repli B2 demandait encore de rejouer quatre tests.
```

GREEN :

```text
npx tsx --test --test-name-pattern="titres des decks B|B1 contrôle la fiche réelle|B4 et B4-bis restent génériques" tests/block-b-curriculum.test.ts
3/3 tests réussis

npx tsx --test --test-name-pattern="corrigés formateur|repli B2" tests/block-b-kit.test.ts
2/2 tests réussis
```

B1 corrige maintenant la source absente de N06. Sa preuve, ses notes formateur
et sa description accessible contrôlent N01 à N06 une fois, les trois sections,
les trois sources exactes et le conflit non tranché. B2 part d'un brief sourcé.
Le corrigé et le repli B2 nomment les cinq gestes de la fiche.

### Groupe contrat B3

RED :

```text
npm test -- --test-name-pattern="contrat partagé|mission agent autonome|sorties adversariales|ZIP public"
Échecs observés :
- séparateur virgule refusé dans le navigateur ;
- ancien chemin inbox accepté dans le navigateur et dans Node ;
- conflit tranché accepté ;
- module brief-contract.mjs absent ;
- source avec suffixe ou source supplémentaire encore acceptée par Node ;
- module absent du ZIP.
```

GREEN :

```text
npx tsx --test tests/block-b-brief-validator.test.ts
13/13 tests réussis

npx tsx --test --test-name-pattern="mission agent autonome|sorties adversariales" tests/block-b-kit.test.ts
2/2 tests réussis

npm run typecheck
0 erreur, 0 avertissement, 0 indication
```

### Groupe QA sans JavaScript

RED :

```text
npm test -- --test-name-pattern="QA wiki B couvre"
Le verrou source échouait car le contexte sans JavaScript ne parcourait que B1.
```

GREEN :

```text
npx tsx --test --test-name-pattern="QA wiki B couvre" tests/site-theme.test.ts
1/1 test réussi

npm run qa:block-b-wiki
Claude et OpenAI présents et visibles sans JavaScript sur B0, B1, B2, B3 et B4.
```

Le premier passage du nouveau sweep a compté une occurrence technique dans une
balise `script`. Le contrôle a été borné aux noeuds textuels rendables, hors
`script`, `style` et `template`, puis le scénario complet est passé.

## Mutualisation B3

`brief-contract.mjs` est pur et autonome dans `mission-agent/`. Il ne contient
aucun import Node. Il produit les trois résultats `structure`, `sources` et
`uncertainty`.

`verify-brief.mjs` l'importe pour la structure du livrable, les sources et
l'incertitude. Il conserve seulement les responsabilités Node : lecture du
fichier, inventaire de sortie et empreintes SHA-256.

`brief-validator.ts` importe exactement le même module et transforme ses trois
booléens en trois `BriefCheck`. Aucune logique de contrat n'est dupliquée.

Les cas mutualisés couvrent :

- canonique simple ;
- point-virgule ;
- virgule ;
- plusieurs blocs source ;
- ancien chemin `inbox/...` ;
- suffixe `.md.bak` ;
- source inconnue ;
- source supplémentaire ;
- entrée vide ;
- conflit dispersé ;
- conflit tranché.

Les anciens chemins et toutes les variantes adversariales échouent dans les
deux environnements.

## ZIP

- `sources-sha256.json` est inchangé car aucune source N01-N06 ne change.
- `brief-contract.mjs` est inclus dans le ZIP B3 autonome.
- Taille générée : 10 430 octets.
- Deux constructions successives sont identiques.
- La même empreinte est obtenue sous UTC, Europe/Paris et
  America/Los_Angeles.
- `npm run kit:block-b:check` confirme la synchronisation.

## Validation finale, 12 commandes séparées

1. `npm run kit:block-b` : succès, ZIP de 10 430 octets.
2. `npm run kit:block-b:check` : succès, kit synchronisé.
3. `npm test` : 178/178 tests réussis.
4. `npm run content:check` : 24 briques valides.
5. `npm run presentation:check` : 110 slides valides.
6. `npm run typecheck` : 0 diagnostic.
7. `npm run build` : 148 pages générées.
8. `npm run qa:block-b-wiki` : persistance, validation locale, 0 requête,
   no-JS B0 à B4 et mobile validés.
9. `npm run qa:block-b` : 21/21 routes, desktop, mobile et zoom 200 %.
10. `npm run qa:presenter` : 110/110 routes mobiles et 111 pages générées.
11. `npm run qa:font-floor` : 110/110 routes à au moins 12 px.
12. `git diff --check` : aucune erreur.

Tous les serveurs lancés par les QA ont été arrêtés. Aucun port de QA ne reste
en écoute.

## Revue visuelle B0, B1, B2 et B4-bis

### B0

- Thèse : une voie permet de tester quatre niveaux d'action.
- Grammaire : décision et comparaison.
- Interaction : comparer les quatre sorties et leurs deux surfaces.
- Repli : les quatre lignes et les deux voies restent lisibles sans JS.
- Silencieux : réussi, la relation sortie vers surface est explicite.
- Coup d'oeil : réussi, les quatre niveaux se lisent verticalement.
- Nécessité : réussie, le comparatif rend l'équivalence des voies visible.

### B1

- Thèse : nommer un écart binaire avant une correction ciblée.
- Grammaire : transformation et boucle de correction.
- Interaction : parcourir Prompt, Réponse, Audit, Correction et Preuve.
- Repli : la boucle, l'écart N06, la correction et la preuve restent visibles.
- Silencieux : réussi, l'absence de source N06 est immédiatement comprise.
- Coup d'oeil : réussi, l'oeil va de la boucle à l'écart puis à la preuve.
- Nécessité : réussie, la progression relie réellement écart et preuve.

### B2

- Thèse : un brief sourcé devient un objet manipulable, puis une correction
  exige de rejouer cinq tests.
- Grammaire : simulation et comparaison avant/après.
- Interaction : révéler les états, comparer les itérations et rejouer la suite.
- Repli : avant, après, cinq preuves et états d'itération restent visibles.
- Silencieux : réussi, le changement de nature du résultat est explicite.
- Coup d'oeil : réussi, la flèche de transformation et la boucle dominent.
- Nécessité : réussie, les interactions vérifient des états et une régression.

### B4-bis

- Thèse : dossier, fichier, terminal et agent choisi doivent partager le même
  périmètre local.
- Grammaire : construction et checkpoint.
- Interaction : comparer les commandes macOS et Windows.
- Repli : les deux commandes restent visibles sans JS.
- Silencieux : réussi, le chemin commun et `node --test` suffisent à comprendre
  la preuve.
- Coup d'oeil : réussi, les trois panneaux convergent vers le même dossier.
- Nécessité : réussie, le choix de plateforme modifie une commande utile.

Les vues 16:9 ont été inspectées manuellement. Les QA couvrent en plus le
mobile, le zoom 200 %, le mouvement réduit et le repli sans JavaScript.

## Auto-revue

- Aucun ancien marqueur actif trouvé dans le manifeste B, le kit participant ou
  les ressources formateur.
- Aucun chemin historique n'est accepté par le contrat.
- Aucun U+2014 dans les fichiers modifiés.
- Aucun changement de `package.json`, `package-lock.json` ou des empreintes de
  sources.
- Aucun serveur de preview ou de QA restant.
- `git diff --check` propre.

## Préoccupations résiduelles

- La détection d'un conflit explicitement tranché repose sur une liste fermée
  de verbes décisionnels. Les cas actuellement spécifiés sont couverts ; toute
  nouvelle formulation adversariale devra être ajoutée au corpus mutualisé.
- Les liens Claude Code et Codex sont officiels et vérifiés au moment de cette
  correction, mais restent des dépendances externes susceptibles d'évoluer.

## Re-revue finale : tokenisation Unicode

### Preuves RED

- Après ajout des cinq cas mutualisés demandés,
  `npx tsx --test tests/block-b-brief-validator.test.ts` échoue avec 17/18
  tests réussis : `conflit annoncé comme tranché` retourne encore
  `uncertainty: true`.
- Le même corpus exécuté par
  `npx tsx --test --test-name-pattern="mission agent autonome|sorties adversariales" tests/block-b-kit.test.ts`
  échoue avec 1/2 test réussi sur le même cas et le même booléen.
- Avant le commit documentaire,
  `git diff --check f747a781588c55c8f0af58a0c42ec3d82bd7bb71..HEAD`
  reproduit l'espace final à la ligne 3 de
  `2026-07-23-bloc-b-parcours-miroir-design.md`.

### Correctif

- La détection par `\b` a été remplacée par une tokenisation Unicode :
  normalisation NFD, retrait des marques diacritiques, extraction par
  `\p{L}` et comparaison à une liste fermée de tokens normalisés.
- Les décisions précédées de `non` ou `pas` ne sont pas considérées comme
  prises. `conflit non tranché` conserve donc les deux dates à confirmer.
- Le corpus partagé couvre maintenant les formulations `tranché`, `décidée`,
  `fixée`, `écarté` et le contre-exemple négatif `non tranché`.
- Les deux espaces finaux après la date de la spécification ont été retirés.

### Preuves GREEN

- `npx tsx --test tests/block-b-brief-validator.test.ts` : 18/18.
- `npx tsx --test --test-name-pattern="mission agent autonome|sorties adversariales" tests/block-b-kit.test.ts` :
  2/2.
- `npm run kit:block-b` : succès, ZIP régénéré à 10 638 octets.
- `npm run kit:block-b:check` : kit synchronisé.
- `npm run typecheck` : 0 erreur, 0 avertissement, 0 indice.
- `npm test` : 183/183.
- `git diff --check` sur le correctif de travail : aucune erreur.
- Après commit,
  `git diff --check f747a781588c55c8f0af58a0c42ec3d82bd7bb71..HEAD` :
  aucune erreur.

### Préoccupation résiduelle

La liste décisionnelle reste volontairement fermée. Une nouvelle flexion ou
une nouvelle formulation métier devra être ajoutée au corpus mutualisé avant
d'entrer dans le contrat.
