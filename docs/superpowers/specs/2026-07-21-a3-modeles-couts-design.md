# Refonte A3 — modèles, exigences et coûts

**Date :** 21 juillet 2026

**Statut :** design validé oralement, en attente de relecture de la spécification

**Brique :** A3, actuellement « Les coûts »

## Intention

La brique A3 doit apprendre à choisir un modèle proportionné à la tâche et à son niveau d’exigence, puis à choisir entre abonnement et API. Le public doit comprendre sans commentaire qu’un modèle plus puissant n’est pas automatiquement le meilleur choix et qu’un abonnement achète une capacité d’usage privilégiée, pas un volume garanti de tokens.

La brique passe de cinq à trois slides, sans exercice. Les explications sur l’hygiène de contexte, les boucles agentiques, les fiches budget et les points d’arrêt disparaissent de cette brique afin d’éviter le chevauchement avec A2 et de concentrer A3 sur la décision modèle–coût–mode d’accès.

## Objectif pédagogique

À la fin de la brique, le participant sait :

1. classer une tâche selon son volume et son niveau d’exigence ;
2. sélectionner une gamme de modèles cohérente chez Anthropic, OpenAI ou Google ;
3. estimer le coût API d’un cas simple à partir des tokens d’entrée et de sortie ;
4. distinguer un abonnement à capacité variable d’une API facturée à l’usage.

Le principe durable est : **commencer avec le modèle équilibré, descendre pour les tâches cadrées et volumineuses, monter seulement lorsqu’un test montre que l’exigence le justifie.**

## Périmètre et fraîcheur des données

Les trois écosystèmes sont traités au même niveau : Anthropic, OpenAI et Google. Les noms et prix affichés constituent un relevé daté du 21 juillet 2026. Chaque slide tarifaire rappelle que les modèles, prix, quotas et conditions d’accès évoluent.

Sources officielles de référence :

- Anthropic : [vue d’ensemble des modèles](https://platform.claude.com/docs/en/about-claude/models/overview), [tarification API](https://platform.claude.com/docs/en/about-claude/pricing) et [forfaits Claude](https://claude.com/pricing) ;
- OpenAI : [catalogue des modèles](https://developers.openai.com/api/docs/models), [ChatGPT Plus](https://help.openai.com/en/articles/6950777) et [ChatGPT Pro](https://help.openai.com/en/articles/9793128/) ;
- Google : [tarification Gemini API](https://ai.google.dev/gemini-api/docs/pricing) et [forfaits Google AI](https://one.google.com/intl/fr_fr/about/google-ai-plans/).

Les tarifs sont affichés en dollars américains hors taxes, conformément aux pages API. Les prix locaux des abonnements peuvent différer selon le pays, la devise, les taxes et le canal de souscription.

## Structure du deck

### Slide 1 — Le bon modèle dépend du niveau d’exigence

**Rôle :** ouverture.

**Thèse silencieuse :** la bonne gamme dépend du compromis entre exigence, volume et coût.

**Grammaire :** décision.

**Durée cible :** 3 minutes.

Le visuel présente trois niveaux horizontaux et trois colonnes éditeur. Un contrôle à trois positions met en évidence un niveau sans cacher les deux autres :

| Niveau | Signal de tâche | Anthropic | OpenAI | Google |
| --- | --- | --- | --- | --- |
| Cadré et volumineux | extraction, classement, reformulation, sous-tâches répétables | Claude Haiku 4.5 | GPT-5.6 Luna | Gemini 3.5 Flash-Lite |
| Professionnel courant | rédaction nuancée, analyse, code et agents ordinaires | Claude Sonnet 5 | GPT-5.6 Terra | Gemini 3.6 Flash |
| Très exigeant | problème difficile, forte précision attendue, agent long ou complexe | Claude Opus 4.8 ou Fable 5 | GPT-5.6 Sol | Gemini 3.1 Pro Preview |

Opus 4.8 et Fable 5 ne sont pas présentés comme des synonymes : Opus sert de référence pour le code agentique complexe et le travail d’entreprise, tandis que Fable vise les agents de longue durée et les raisonnements les plus exigeants. La slide évite tout classement absolu entre éditeurs.

**Interaction :** sélectionner « volume », « équilibre » ou « exigence » pour accentuer la ligne correspondante et afficher son signal de décision. Le niveau « équilibre » est sélectionné au chargement.

**Repli accessible :** les trois lignes, les signaux et tous les modèles sont visibles sans JavaScript. Les boutons sont de vrais boutons ou radios, avec focus visible. Le niveau actif est nommé en texte et ne dépend pas de la couleur.

**Tests visuels :**

- Silencieux : on comprend qu’une tâche plus exigeante appelle une gamme différente.
- Coup d’œil : le parcours visuel va du volume vers l’exigence et traverse les trois éditeurs.
- Nécessité : le contrôle sert à comparer une même gamme entre éditeurs ; il ne révèle aucune information indispensable.

### Slide 2 — Le même dossier coûte de 0,23 à 1,50 $ selon le modèle

**Rôle :** démonstration.

**Thèse silencieuse :** pour une charge identique, le choix du modèle change fortement le coût API.

**Grammaire :** simulation.

**Durée cible :** 3 minutes.

Le cas de référence est affiché en permanence : **100 000 tokens d’entrée et 10 000 tokens de sortie par dossier**. Il représente un dossier documentaire conséquent suivi d’une production structurée. Il ne constitue ni une consommation moyenne universelle ni une promesse de quota.

Le calcul est :

`coût = 0,1 × prix d’entrée par million + 0,01 × prix de sortie par million`

Tarifs et résultats de référence :

| Niveau | Modèle | Entrée / MTok | Sortie / MTok | 1 dossier | 100 dossiers |
| --- | --- | ---: | ---: | ---: | ---: |
| Équilibre | Claude Sonnet 5 | 2 $ | 10 $ | 0,30 $ | 30 $ |
| Équilibre | GPT-5.6 Terra | 2,50 $ | 15 $ | 0,40 $ | 40 $ |
| Équilibre | Gemini 3.6 Flash | 1,50 $ | 7,50 $ | 0,225 $ | 22,50 $ |
| Exigence | Claude Fable 5 | 10 $ | 50 $ | 1,50 $ | 150 $ |
| Exigence | GPT-5.6 Sol | 5 $ | 30 $ | 0,80 $ | 80 $ |
| Exigence | Gemini 3.1 Pro Preview, contexte ≤ 200k | 2 $ | 12 $ | 0,32 $ | 32 $ |

Le prix de Claude Sonnet 5 est explicitement marqué comme tarif de lancement valable jusqu’au 31 août 2026 ; le tarif standard annoncé ensuite est de 3 $ en entrée et 15 $ en sortie, soit 0,45 $ par dossier de référence. Gemini 3.1 Pro est identifié comme modèle Preview. Ces mentions doivent être lisibles sans surcharger la comparaison principale.

Les appels d’outils, la recherche, le cache, les images, le stockage et les paliers de long contexte ne sont pas intégrés au calcul. Une note indique qu’ils peuvent ajouter des coûts.

**Interaction :** choisir 1, 10 ou 100 dossiers. Les totaux et les barres proportionnelles se mettent à jour ; le coût unitaire et l’hypothèse restent visibles.

**Repli accessible :** sans JavaScript, le tableau montre le coût d’un dossier et de 100 dossiers. Les montants complets sont présents dans le HTML et ne dépendent pas d’un graphique.

**Tests visuels :**

- Silencieux : l’écart entre modèles est visible pour une charge strictement identique.
- Coup d’œil : l’hypothèse mène aux montants, puis à l’amplitude de coût.
- Nécessité : le contrôle de volume montre que le coût unitaire faible devient significatif à l’échelle.

### Slide 3 — L’abonnement achète une capacité privilégiée, pas des tokens

**Rôle :** conclusion et décision.

**Thèse silencieuse :** abonnement et API répondent à deux régimes d’usage différents et peuvent être combinés.

**Grammaire :** comparaison.

**Durée cible :** 2 minutes.

Le visuel oppose deux régimes et fait converger leurs usages vers une zone hybride :

| Abonnement | API |
| --- | --- |
| Prix mensuel prévisible | Paiement exact à l’usage |
| Accès aux produits, fonctions et modèles selon le forfait | Choix explicite du modèle et paramètres mesurables |
| Limites variables, partagées entre fonctions et susceptibles d’évoluer | Dépense ouverte à plafonner et surveiller |
| Adapté au travail humain fréquent dans l’interface | Adapté à l’automatisation, au volume mesuré et à l’intégration |

Le repère de prix principal est **environ 20 $ par mois pour les offres individuelles payantes courantes** : Claude Pro à 20 $ en facturation mensuelle, ChatGPT Plus à 20 $, Google AI Pro autour de 20 $ selon le marché. Les offres intensives sont regroupées en un ordre de grandeur de **100 à 250 $ par mois**, sans prétendre qu’elles donnent des quotas équivalents.

La slide rapproche ce repère de la simulation précédente : 100 dossiers identiques coûteraient environ 22,50 à 150 $ par API selon le modèle. Cette comparaison illustre pourquoi un abonnement peut aujourd’hui fournir une capacité privilégiée par rapport au prix API, sans affirmer qu’il garantit ces 100 dossiers ni que le modèle accessible dans l’interface correspond exactement à l’identifiant API.

**Interaction :** aucun contrôle requis. Une lecture statique est préférable : « travail humain fréquent » mène à l’abonnement, « workflow automatisé et mesuré » mène à l’API, et « usage professionnel courant » peut combiner les deux.

**Repli accessible :** le comparatif et la conclusion sont du HTML natif. La zone hybride est nommée en texte ; aucune relation ne dépend uniquement d’une flèche ou d’une couleur.

**Tests visuels :**

- Silencieux : on ne confond pas abonnement et préachat de tokens.
- Coup d’œil : les deux régimes se lisent en miroir puis convergent vers l’usage hybride.
- Nécessité : aucune interaction n’est ajoutée, car elle n’améliorerait pas la décision.

## Direction visuelle commune

Le visuel occupe 70 à 85 % de chaque slide. Le fond ivoire, l’encre sombre et les accents de la famille A restent inchangés. Les trois éditeurs sont distingués par leur nom et leur structure de colonne, jamais par un logo récupéré ni par la couleur seule.

La typographie conserve la hiérarchie actuelle : thèse courte, support limité à ce que le visuel ne peut pas encoder, montants alignés avec des chiffres tabulaires. Les cartes décoratives, flèches sans relation, jauges de puissance non mesurées et animations continues sont exclues.

Les transitions de mise en évidence respectent `prefers-reduced-motion`. Aucun mouvement n’est nécessaire pour comprendre l’état final.

## Contenu éditorial de la brique

Le fichier MDX est réécrit pour refléter les trois décisions : niveau d’exigence, estimation API, mode d’accès. La durée cible passe de 15 à 8 minutes. La mission commune, le livrable, les défis centrés sur la réduction de contexte et la charte en cinq règles sont supprimés. Les notes formateur contiennent :

- le cas de calcul et ses limites ;
- l’interdiction de présenter les modèles comme un classement absolu entre marques ;
- l’avertissement sur la date des prix et la différence entre modèle d’interface et identifiant API ;
- la règle « tester avant de monter en gamme ».

La transition depuis A2 devient : « Après avoir choisi la bonne surface, choisissons la puissance réellement nécessaire. » La transition vers A4 devient : « Même le meilleur modèle ne transforme pas une réponse plausible en preuve. »

## Architecture d’implémentation envisagée

La refonte modifie uniquement les fichiers nécessaires :

- `src/content/briques/a-comprendre/a3-couts.mdx` ;
- `src/presentation/manifests/a.ts` ;
- le registre et le modèle des clés visuelles si une nouvelle clé A3 est créée ;
- un composant Astro dédié à la comparaison de modèles et aux coûts, avec logique d’état pure séparée si nécessaire ;
- les tests de contenu, de données, de routage et de visuels touchés par le passage de cinq à trois slides.

Les anciennes variantes A3 de `ContextBudget.astro` ne sont supprimées que si aucune autre slide ne les utilise. La slide 3 peut rester dans le composant A3 dédié pour partager la même sémantique et les mêmes données tarifaires, sans introduire une nouvelle abstraction générique prématurée.

## Vérification attendue

La livraison doit vérifier :

1. trois slides A3 exactement, sans mission ni checkpoint ;
2. navigation `a2-prioritize → nouvelle ouverture A3 → trois slides A3 → a4-convincing` ;
3. calculs exacts pour 1, 10 et 100 dossiers ;
4. valeurs tarifaires et date présentes dans le manifeste ou une source de données testable ;
5. rendu lisible aux tailles de présentation prévues et sous 52 rem ;
6. contenu intégralement compréhensible sans JavaScript ;
7. contrôle clavier, focus visible et état actif nommé ;
8. absence de mouvement non essentiel avec `prefers-reduced-motion` ;
9. réussite des tests silencieux, coup d’œil et nécessité sur les trois slides ;
10. réussite de `npm test`, `npm run content:check`, `npm run presentation:check`, `npm run typecheck` et `npm run build`.

## Hors périmètre

- établir un benchmark de qualité entre éditeurs ;
- promettre un nombre de messages ou de dossiers par abonnement ;
- convertir les prix en euros avec un taux de change éphémère ;
- comparer les politiques de confidentialité, la souveraineté ou les contrats Enterprise ;
- enseigner en détail le cache, Batch, Flex, Priority, le grounding ou les coûts propres aux outils ;
- conserver un exercice dans A3.
