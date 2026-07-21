# Prototype fil rouge : ton assistant personnel (cerveau + mains)

Plan de build du prototype de référence, construit par Matthieu avant la formation.
Triple objectif : valider les timings de chaque plateau, produire la démo, et
fabriquer les kits que les participants recevront.

Décisions actées : le fil rouge est un **assistant personnel à cinq organes**,
pas une simple mémoire. Niveau socle : identité + cerveau (P1, P2). Bonus :
savoir-faire complets (P3). Les niveaux « toujours actif » restent en démo C3.

Principe de conception du TP : **on prémâche la saisie, on garde la décision.**
Tout ce qui est remplissage de document est fourni ou délégué à l'IA ; tout ce
qui est choix, vérification et correction reste aux participants.

## Les cinq organes

1. **Identité** : il a un nom, un ton, il te connaît (CLAUDE.md).
2. **Cerveau** : la mémoire structurée et versionnée (dossiers + git).
3. **Savoir-faire** : les skills (capture, briefing, revue).
4. **Sens** : les connexions MCP (agenda, Notion) ; démo C2/C3.
5. **Visage** : le dashboard déployé qui affiche le brief (B2, B4, D3).

Méthode : celle de E3. Chaque étape est testable, chaque plateau a un critère
de fierté (ce qu'on peut montrer à quelqu'un), et on note le temps réel. Une
étape qui dépasse le double de son budget est redécoupée. Règle de calibrage :
budget participant = double du temps Matthieu.

## P1 : Naissance (budget : 1 h, dont production du kit)

| Étape | Budget | Test de vérification | Temps réel |
| --- | --- | --- | --- |
| Créer `assistant/`, l'ouvrir dans Claude Code, rituel D2-bis | 10 min | Le repo existe sur GitHub | |
| Rédiger le **kit interview** : 10 questions que l'assistant pose à son humain (identité, habitudes, projets, style de réponse) | 20 min | Le prompt d'interview produit un CLAUDE.md complet sans rien écrire à la main | |
| Se faire interviewer soi-même, choisir nom et personnalité | 15 min | « Présente-toi » : la réponse est personnelle, dans le ton choisi | |
| Test de connaissance croisé : une question hors mémoire | 5 min | L'assistant dit qu'il ne sait pas au lieu d'inventer | |
| Commit « naissance » | 5 min | L'historique commence bien | |

**Critère de fierté :** l'assistant se présente à quelqu'un d'autre et cite
trois vraies infos sur toi.
**Kit produit :** le prompt d'interview (10 questions + consignes de rédaction
du CLAUDE.md).

## P2 : Le cerveau (budget : 2 h 30, dont production du kit)

| Étape | Budget | Test de vérification | Temps réel |
| --- | --- | --- | --- |
| Concevoir la structure : `profil/`, `projets/`, `connaissances/`, `journal/`, `inbox/` + règles de routage dans le CLAUDE.md | 30 min | « Où chercher quoi » tient en cinq lignes et l'assistant les applique | |
| Fabriquer le **kit inbox** : 8 documents variés à trier (notes, listes, une recette, un début de projet, un doc piège sans catégorie évidente) | 40 min | Le tri du kit force au moins deux décisions de routage non triviales | |
| Faire le grand tri soi-même : l'assistant propose, on valide ou corrige | 30 min | Toute l'inbox est rangée, les règles ont été amendées au moins une fois | |
| Ajouter 3 vrais documents personnels | 15 min | Trois questions, trois réponses justes et sourcées | |
| Checkpoints git au fil de l'eau (règle D2) | 10 min | L'historique raconte la construction | |
| Test d'enlisement volontaire : question ambiguë | 15 min | Une règle de routage améliorée en réponse | |

**Critère de fierté :** le voisin pose trois questions pièges sur les documents,
score 3 sur 3 avec sources.
**Kit produit :** l'inbox de 8 documents à trier.

## P3 : Les savoir-faire (budget : 2 h 30, dont production du kit)

| Étape | Budget | Test de vérification | Temps réel |
| --- | --- | --- | --- |
| Écrire le skill `capture` au propre : il servira d'**exemple fourni** | 45 min | Trois captures différentes (texte collé, idée dictée, lien) rangées au même format | |
| Construire le skill `briefing` comme le feront les participants (sans copier capture) | 45 min | Le brief tient en dix lignes, cite ses sources, lit `journal/` et `projets/` | |
| Skill libre : en inventer un utile à ta vraie vie (le « skill secret » du défi participant) | 30 min | Il se déclenche au bon moment sans être appelé explicitement | |
| Audit sécurité avec le prompt D4 | 15 min | Rien de sensible dans le repo, rapport archivé | |

**Critère de fierté :** tu ne donnes plus de consignes, tu dis « capture » ou
« brief ».
**Kit produit :** le skill `capture` complet et commenté.

## P4 : Sens et visage (budget : 2 h, dont production du kit)

| Étape | Budget | Test de vérification | Temps réel |
| --- | --- | --- | --- |
| Fabriquer le **kit dashboard** : template HTML/CSS pré-stylé d'une page « Mon brief du jour », données en dur | 45 min | Le template est joli tel quel et clairement balisé « à brancher » | |
| Brancher le template : le brief généré par le skill remplit la page | 30 min | Recharger la page affiche le brief du jour réel | |
| Déployer (rituel D3) | 15 min | L'URL s'ouvre sur le téléphone | |
| Démo niveau « sens » : un MCP (agenda ou Notion) alimente le brief | 30 min | Le brief cite un vrai rendez-vous du lendemain | |

**Critère de fierté :** montrer son brief du jour sur son téléphone à table.
**Kit produit :** le template dashboard.

## Hors prototype

- Tâche planifiée « brief chaque matin » : démo C3 en formation, bouquet final.
- La revue hebdo (skill `revue`) : mentionnée en ouverture, pas construite.

## Relevé pour le calibrage du TP

À remplir en fin de build : temps total par plateau, étape la plus longue,
étape la plus frustrante (chaque frustration devient une entrée Dépannage du
TP), et ce qui doit encore être prémâché. Vérifier en particulier que P2 tient
dans une matinée participant une fois doublé.
