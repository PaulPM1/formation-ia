import { externalLink, wikiLink } from '../presentation-links';
import type { PresentationDeck, PresentationSlide } from '../presentation-model';

const slide = (value: PresentationSlide) => value;

const claudeOverview = externalLink(
  'official',
  'Présentation de Claude et de ses capacités',
  'https://platform.claude.com/docs/en/intro',
);
const usageLimits = externalLink(
  'official',
  "Comprendre les limites d'usage et de longueur",
  'https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work',
);
const agentsGuide = externalLink(
  'official',
  'Building effective agents',
  'https://www.anthropic.com/engineering/building-effective-agents',
);
const codeOverview = externalLink(
  'official',
  'Présentation de Claude Code',
  'https://code.claude.com/docs/en/overview',
);
const artifactsGuide = externalLink(
  'official',
  'Artifacts — Claude Help Center',
  'https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them',
);
const coworkGuide = externalLink(
  'official',
  'Bien démarrer avec Cowork',
  'https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork',
);
const planGuide = externalLink(
  'official',
  'Choisir un forfait Claude',
  'https://support.claude.com/en/articles/11049762-choose-a-claude-plan',
);
const apiPricing = externalLink(
  'official',
  "Tarification de l'API Claude",
  'https://platform.claude.com/docs/en/about-claude/pricing',
);
const hallucinationGuide = externalLink(
  'official',
  'Réduire les hallucinations',
  'https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations',
);
const transparencyGuide = externalLink(
  'official',
  "Principes de transparence d'Anthropic",
  'https://www.anthropic.com/transparency',
);

export const A_DECKS = [
  {
    brickId: 'a1',
    family: 'a',
    order: 1,
    title: "C'est quoi un LLM",
    slides: [
      slide({
        id: 'a1-opening',
        role: 'opening',
        claim: "Une réponse fluide n'est pas une preuve.",
        support: 'Le modèle optimise une suite cohérente ; la vérité reste à établir.',
        visual: {
          key: 'token-predictor',
          data: {
            interaction: 'Lancer la prédiction.',
            prompt: 'Claude est…',
            candidates: [
              { token: 'un', plausibility: 'la plus forte parmi les exemples' },
              { token: 'capable', plausibility: 'forte parmi les exemples' },
              { token: 'toujours', plausibility: 'plus faible parmi les exemples' },
            ],
            legend: 'Classement qualitatif illustratif, sans score calculé',
            warning: 'Probabilité linguistique ≠ preuve factuelle',
          },
        },
        links: [wikiLink('a1', 'concept-durable', 'Comprendre le mécanisme'), claudeOverview],
        speaker: {
          durationMinutes: 2,
          notes: 'Faire compléter oralement « Claude est… » sans corriger immédiatement. Éviter les analogies du cerveau ou de la personne omnisciente.',
          transition: 'Observons comment la phrase apparaît, fragment après fragment.',
        },
        accessibleDescription: 'Une phrase inachevée alimente trois prochains tokens classés qualitativement ; un avertissement sépare plausibilité et vérité.',
      }),
      slide({
        id: 'a1-token-loop',
        role: 'explanation',
        claim: 'Une réponse se construit token après token.',
        support: 'Le modèle choisit un fragment plausible, l’ajoute au contexte et recommence.',
        visual: {
          key: 'token-predictor',
          data: {
            interaction: "Avancer d'un token.",
            loop: ['Contexte', 'Probabilités', 'Prochain token', 'Contexte enrichi'],
            example: ['Le', ' chat', ' dort', '.'],
            activeStep: 'Prochain token',
          },
        },
        links: [wikiLink('a1', 'concept-durable', 'Tokens et génération')],
        speaker: {
          durationMinutes: 2,
          notes: 'Dessiner la boucle « contexte → prochain token → réponse » et rappeler qu’un token peut être un mot, un fragment ou un signe.',
          transition: 'Cette boucle dépend entièrement de ce qui se trouve déjà dans le contexte.',
        },
        accessibleDescription: 'Une boucle en quatre étapes montre le contexte enrichi après chaque fragment de la phrase « Le chat dort. ».',
      }),
      slide({
        id: 'a1-context',
        role: 'demonstration',
        claim: 'Changer le contexte change la suite plausible.',
        support: 'Le public, les messages précédents et les documents fournis orientent la réponse.',
        visual: {
          key: 'context-comparison',
          data: {
            interaction: 'Basculer entre deux contextes.',
            sharedPrompt: "Explique ce qu'est un LLM.",
            contexts: [
              { audience: 'Enfant de 10 ans', constraints: '4 phrases', vocabulary: 'fragments de texte' },
              { audience: 'Adulte non technique', constraints: '120 mots', vocabulary: 'tokens, prédiction, limite' },
            ],
            observation: 'Même notion, explications différentes',
          },
        },
        links: [wikiLink('a1', 'pratique-avec-claude', 'Comparer les prompts')],
        speaker: {
          durationMinutes: 2,
          notes: 'Réaliser les deux prompts destinés à des publics différents et faire nommer ce qui change dans les sorties.',
          transition: 'Une réponse adaptée peut rester factuellement fragile.',
        },
        accessibleDescription: 'Deux panneaux comparent le même prompt adapté à un enfant puis à un adulte, avec contraintes et vocabulaire distincts.',
      }),
      slide({
        id: 'a1-plausible',
        role: 'checkpoint',
        claim: 'Plausible et vrai sont deux questions différentes.',
        support: 'Une phrase peut être exacte, simplifiée ou demander une vérification.',
        visual: {
          key: 'verification-audit',
          data: {
            interaction: 'Classer une affirmation.',
            statement: 'Un LLM retrouve toujours la bonne ligne dans une base de données.',
            buckets: ['Exacte', 'Simplifiée', 'À vérifier'],
            answer: 'À vérifier',
            reason: 'Un LLM génère ; il ne récite pas toujours une fiche exacte.',
          },
        },
        links: [wikiLink('a1', 'concept-durable', 'Voir les trois conséquences'), usageLimits],
        speaker: {
          durationMinutes: 2,
          notes: 'Faire distinguer fluidité, cohérence et exactitude. Message essentiel : la fluidité est une capacité ; la vérité doit encore être établie.',
          transition: 'Mettons ce réflexe en pratique sur une notion connue.',
        },
        accessibleDescription: 'Une affirmation sur les LLM doit être rangée dans l’une de trois catégories ; la correction explique pourquoi elle demande vérification.',
      }),
      slide({
        id: 'a1-mission',
        role: 'mission',
        claim: 'Expliquez, repérez, puis améliorez la consigne.',
        support: 'Réussite : la deuxième consigne précise au moins le public, le niveau de détail et la forme attendue.',
        visual: {
          key: 'mission-board',
          data: {
            interaction: 'Ouvrir la mission A1.',
            mission: [
              'Choisissez une notion que vous connaissez bien : votre métier, une règle de jeu ou une recette.',
              "Demandez à Claude de l'expliquer à un débutant en cinq phrases.",
              'Repérez une phrase exacte, une phrase simplifiée et une phrase qui demanderait une vérification.',
              'Réécrivez la consigne pour améliorer la réponse.',
            ],
            successCriterion: 'Votre deuxième consigne précise au moins le public, le niveau de détail et la forme attendue.',
            deliverables: ['Définition personnelle en trois phrases', 'Deux consignes', 'Une limite à garder en tête'],
          },
        },
        links: [wikiLink('a1', 'mission-commune', 'Mission A1 complète')],
        speaker: {
          durationMinutes: 2,
          notes: 'Faire formuler la définition par deux participants et vérifier explicitement les trois éléments du critère de réussite.',
          transition: "Si le modèle produit du texte, qu'est-ce qui lui permet aussi d'agir ?",
        },
        accessibleDescription: 'Un tableau de mission présente quatre actions, trois livrables et le critère public–détail–forme.',
      }),
    ],
  },
  {
    brickId: 'a2',
    family: 'a',
    order: 2,
    title: 'LLM vs Agent',
    slides: [
      slide({
        id: 'a2-three-modes',
        role: 'opening',
        claim: 'Réponse, workflow et agent ne délèguent pas la même chose.',
        support: 'Le chemin est respectivement textuel, prédéfini ou adapté aux observations.',
        visual: {
          key: 'response-workflow-agent',
          data: {
            interaction: 'Comparer les trois modes.',
            modes: [
              { name: 'Réponse', path: 'Contexte → texte', autonomy: 'Aucune action' },
              { name: 'Workflow', path: 'Étapes 1 → 2 → 3', autonomy: 'Chemin fixé' },
              { name: 'Agent', path: 'Observer → choisir → agir → corriger', autonomy: 'Chemin variable' },
            ],
          },
        },
        links: [wikiLink('a2', 'concept-durable', 'Distinguer les trois modes'), agentsGuide],
        speaker: {
          durationMinutes: 3,
          notes: 'Rappeler qu’un modèle génère et faire nommer des outils possibles. Ne pas présenter l’agent comme une IA simplement plus puissante.',
          transition: 'Isolons d’abord le cas le plus simple : produire une réponse.',
        },
        accessibleDescription: 'Trois colonnes opposent réponse textuelle, workflow à chemin fixe et agent à boucle adaptable.',
      }),
      slide({
        id: 'a2-response',
        role: 'explanation',
        claim: 'Une réponse transforme du contexte en texte.',
        support: 'Le modèle n’agit pas sur l’environnement : il génère une sortie à partir des éléments fournis.',
        visual: {
          key: 'response-workflow-agent',
          data: {
            interaction: 'Isoler le mode réponse.',
            activeMode: 'Réponse',
            input: 'Article fourni',
            operation: 'Générer',
            output: 'Résumé',
            tools: [],
          },
        },
        links: [wikiLink('a2', 'pratique-avec-claude', 'Comparer deux demandes')],
        speaker: {
          durationMinutes: 2,
          notes: 'Utiliser « Résumer un article fourni » : l’entrée et la sortie suffisent, aucune action externe n’est nécessaire.',
          transition: 'Lorsque les étapes sont connues, on obtient plutôt un workflow.',
        },
        accessibleDescription: 'Un flux unique relie un article fourni à un résumé, sans outil ni action externe.',
      }),
      slide({
        id: 'a2-workflow',
        role: 'explanation',
        claim: "Un workflow suit un chemin décidé à l'avance.",
        support: 'L’ordre des opérations est connu avant le départ, comme une recette.',
        visual: {
          key: 'response-workflow-agent',
          data: {
            interaction: 'Parcourir les étapes fixes.',
            activeMode: 'Workflow',
            example: 'Transformer une liste de contacts',
            steps: ['Extraire', 'Mapper cinq colonnes', 'Valider le format', 'Exporter'],
            branching: false,
          },
        },
        links: [wikiLink('a2', 'concept-durable', 'Workflow déterministe')],
        speaker: {
          durationMinutes: 3,
          notes: 'Tracer une recette fixe et demander si une observation intermédiaire pourrait modifier l’ordre des étapes.',
          transition: 'Si le résultat observé décide de la prochaine étape, le chemin devient agentique.',
        },
        accessibleDescription: 'Quatre boîtes alignées montrent un traitement de contacts dont l’ordre ne varie pas.',
      }),
      slide({
        id: 'a2-agent-loop',
        role: 'demonstration',
        claim: "Un agent choisit la prochaine action selon ce qu'il observe.",
        support: 'Il utilise des outils, observe leurs résultats, puis corrige ou s’arrête.',
        visual: {
          key: 'response-workflow-agent',
          data: {
            interaction: 'Rejouer la boucle.',
            activeMode: 'Agent',
            objective: "Résoudre un test en échec",
            loop: ['Observer le projet', 'Choisir un fichier', 'Modifier', 'Lancer le test', 'Corriger ou arrêter'],
            stopCriterion: 'Test vert et diff borné',
            confirmations: ['Avant modification', 'Avant commande risquée'],
          },
        },
        links: [agentsGuide, codeOverview],
        speaker: {
          durationMinutes: 4,
          notes: 'Tracer la boucle agentique et insister sur objectif, périmètre, confirmations et preuve de fin.',
          transition: 'La longueur de la tâche ne suffit donc pas pour choisir le mode.',
        },
        accessibleDescription: 'Une boucle part d’un test en échec, observe, modifie et reteste jusqu’au critère d’arrêt.',
      }),
      slide({
        id: 'a2-classify',
        role: 'mission',
        claim: 'La variabilité du chemin détermine le bon mode.',
        support: 'Réussite : le classement se fonde sur la variabilité du chemin, pas sur la longueur de la tâche.',
        visual: {
          key: 'mission-board',
          data: {
            interaction: 'Classer quatre situations.',
            mission: [
              'Résumer un article fourni.',
              'Chaque vendredi, récupérer trois sources autorisées, comparer les nouveautés et produire une note.',
              'Convertir une liste de contacts en tableau selon cinq colonnes définies.',
              "Explorer un projet, trouver la cause d'un test en échec, proposer une correction puis relancer le test.",
            ],
            columns: ['Entrée', 'Type', 'Outil ou action', 'Validation humaine', 'Preuve de fin'],
            successCriterion: "Votre classement s'appuie sur la variabilité du chemin et non sur la longueur de la tâche.",
          },
        },
        links: [wikiLink('a2', 'mission-commune', 'Mission A2 complète')],
        speaker: {
          durationMinutes: 3,
          notes: 'Faire classer les quatre situations en binômes, corriger puis insister sur le périmètre et la preuve de fin.',
          transition: 'Les interfaces Claude donnent accès à différents degrés de cette boucle.',
        },
        accessibleDescription: 'Quatre situations doivent être réparties entre réponse, workflow et agent selon cinq colonnes de justification.',
      }),
    ],
  },
  {
    brickId: 'a3',
    family: 'a',
    order: 3,
    title: 'Pourquoi Claude pour le code',
    slides: [
      slide({
        id: 'a3-right-surface',
        role: 'opening',
        claim: "Le bon outil donne juste assez de contexte et d'action.",
        support: 'Il doit permettre la preuve attendue sans élargir inutilement les accès.',
        visual: {
          key: 'interface-continuum',
          data: {
            interaction: 'Déplacer le besoin sur le continuum.',
            axes: { horizontal: "Capacité d'action", vertical: 'Contexte disponible' },
            need: 'Clarifier le cahier des charges d’un minuteur',
            target: 'Chat',
            decisionQuestions: ['Quel contexte ?', 'Quelle action ?', 'Quelle preuve ?'],
          },
        },
        links: [wikiLink('a3', 'concept-durable', 'Choisir le bon établi')],
        speaker: {
          durationMinutes: 3,
          notes: 'Présenter les quatre interfaces comme des établis, pas comme une hiérarchie de puissance.',
          transition: 'Plaçons maintenant les quatre établis sur le même continuum.',
        },
        accessibleDescription: 'Un besoin est positionné sur deux axes, contexte et capacité d’action, au niveau minimal correspondant à Chat.',
      }),
      slide({
        id: 'a3-continuum',
        role: 'explanation',
        claim: "Chat, Artifacts, Cowork et Claude Code augmentent progressivement la capacité d'action.",
        support: 'Conversation, objet visible, travail multiétape puis boucle de développement.',
        visual: {
          key: 'interface-continuum',
          data: {
            interaction: 'Explorer chaque surface.',
            surfaces: [
              { name: 'Chat', use: 'Réfléchir et cadrer', context: 'Conversation', action: 'Texte' },
              { name: 'Artifacts', use: 'Prototyper', context: 'Conversation + objet', action: 'Création visible' },
              { name: 'Cowork', use: 'Traiter des ressources', context: 'Dossier + outils', action: 'Travail multiétape' },
              { name: 'Claude Code', use: 'Modifier un projet', context: 'Fichiers + terminal', action: 'Code, commandes, tests' },
            ],
          },
        },
        links: [artifactsGuide, coworkGuide, codeOverview],
        speaker: {
          durationMinutes: 3,
          notes: 'Réaliser le classement collectif et rappeler que la continuité d’outils sert l’apprentissage de degrés d’autonomie.',
          transition: 'Ce continuum aide à choisir la surface minimale qui suffit.',
        },
        accessibleDescription: 'Quatre étapes décrivent le passage de la conversation à la modification vérifiée d’un projet réel.',
      }),
      slide({
        id: 'a3-choice',
        role: 'checkpoint',
        claim: "Toute tâche n'a pas besoin de devenir agentique.",
        support: 'Les méthodes restent transférables : contexte utile, plan, permissions limitées, petites étapes et vérification.',
        visual: {
          key: 'interface-continuum',
          data: {
            interaction: "Choisir l'interface minimale.",
            tasks: [
              { task: 'Clarifier un brief', minimum: 'Chat', reason: 'Conversation suffisante' },
              { task: 'Prototype interactif', minimum: 'Artifacts', reason: 'Objet testable nécessaire' },
              { task: 'Classer cinq réunions', minimum: 'Cowork', reason: 'Sources et étapes multiples' },
              { task: 'Ajouter le prototype à une app', minimum: 'Claude Code', reason: 'Projet et tests requis' },
            ],
            rule: 'Le moins d’accès possible pour produire la preuve attendue',
          },
        },
        links: [wikiLink('a3', 'pratique-avec-claude', 'Exercice de classement')],
        speaker: {
          durationMinutes: 2,
          notes: 'Éviter les comparatifs de modèles et les promesses de performance absolue ; ramener le choix au contexte, aux permissions et à la preuve.',
          transition: 'Appliquons cette règle au cas d’usage fil rouge.',
        },
        accessibleDescription: 'Quatre tâches sont associées à l’interface minimale capable de produire leur preuve de réussite.',
      }),
      slide({
        id: 'a3-mission',
        role: 'mission',
        claim: 'Associez chaque prochaine action à la surface la plus simple.',
        support: 'Réussite : au moins une action reste une simple conversation ; tout ne devient pas agentique.',
        visual: {
          key: 'mission-board',
          data: {
            interaction: 'Ouvrir la mission A3.',
            mission: "Prenez votre cas d'usage fil rouge. Décrivez quatre prochaines actions et associez chacune à l'interface la plus simple qui suffit.",
            instruction: 'Pour chaque action, notez :',
            fields: ['Résultat voulu', 'Contexte nécessaire', 'Action autorisée', 'Preuve de réussite'],
            successCriterion: 'Au moins une action reste une simple conversation ; tout ne devient pas automatiquement une tâche agentique.',
            deliverable: "Une mini-carte en quatre étapes, de l'idée au résultat vérifié.",
          },
        },
        links: [wikiLink('a3', 'mission-commune', 'Mission A3 complète')],
        speaker: {
          durationMinutes: 2,
          notes: 'Laisser les participants produire leur carte, puis rappeler les six principes transférables.',
          transition: 'Une interface plus agentique utilise davantage de contexte et d’actions : regardons ce que cela consomme.',
        },
        accessibleDescription: 'Une carte de mission demande quatre actions, chacune documentée par résultat, contexte, permission et preuve.',
      }),
    ],
  },
  {
    brickId: 'a4',
    family: 'a',
    order: 4,
    title: 'Les coûts',
    slides: [
      slide({
        id: 'a4-three-costs',
        role: 'opening',
        claim: "Abonnement, limite d'usage et API sont trois réalités différentes.",
        support: 'Accès au produit, capacité sur une période et facturation technique ne se lisent pas avec la même unité.',
        visual: {
          key: 'context-budget',
          data: {
            interaction: 'Sélectionner les trois couches.',
            layers: [
              { name: 'Abonnement', measures: 'Accès et capacité selon le forfait', check: 'Page des forfaits' },
              { name: "Limite d'usage", measures: 'Travail possible sur une période', check: 'État d’usage du produit' },
              { name: 'API', measures: 'Entrées, sorties et outils', check: 'Tarification et mesure réelles' },
            ],
            warning: 'Prix et quotas changent : consulter la source officielle',
          },
        },
        links: [wikiLink('a4', 'concept-durable', 'Les trois réalités du coût'), planGuide, usageLimits, apiPricing],
        speaker: {
          durationMinutes: 4,
          notes: 'Distinguer abonnement, limite et API sur trois colonnes, sans annoncer de quota universel.',
          transition: 'Dans chaque couche, le contexte fourni influence la consommation.',
        },
        accessibleDescription: 'Trois colonnes différencient abonnement, limite d’usage et API par ce qu’ils mesurent et où les vérifier.',
      }),
      slide({
        id: 'a4-context-meter',
        role: 'demonstration',
        claim: 'Chaque élément de contexte a un coût et une utilité.',
        support: 'Demande, historique, documents, instructions et outils occupent l’entrée du modèle.',
        visual: {
          key: 'context-budget',
          data: {
            interaction: 'Ajouter ou retirer du contexte.',
            meter: [
              { item: 'Objectif et critère', contextLoad: 'faible', relevance: 'directe', keep: true },
              { item: 'Document concerné', contextLoad: 'significative', relevance: 'directe', keep: true },
              { item: 'Historique long sur plusieurs sujets', contextLoad: 'élevée', relevance: 'faible', keep: false },
              { item: 'Sujets sans rapport', contextLoad: 'inutile', relevance: 'nulle', keep: false },
              { item: 'Résumé des décisions', contextLoad: 'faible', relevance: 'forte', keep: true },
            ],
            legend: {
              contextLoad: ['faible', 'significative', 'élevée', 'inutile'],
              relevance: ['nulle', 'faible', 'forte', 'directe'],
            },
            objective: 'Conserver ce qui sert le résultat ou sa vérification',
          },
        },
        links: [wikiLink('a4', 'pratique-avec-claude', 'Comparer les conversations A et B')],
        speaker: {
          durationMinutes: 3,
          notes: 'Comparer les conversations A et B et faire retirer ce qui consomme sans aider le résultat.',
          transition: 'Une boucle agentique multiplie ces lectures et productions.',
        },
        accessibleDescription: 'Une jauge qualitative compare cinq éléments selon leur charge de contexte, leur pertinence et la décision de les conserver.',
      }),
      slide({
        id: 'a4-agentic',
        role: 'explanation',
        claim: 'Lire, agir et se corriger multiplie les étapes consommées.',
        support: 'Une tâche agentique peut relire des fichiers, appeler des outils et produire plusieurs sorties intermédiaires.',
        visual: {
          key: 'context-budget',
          data: {
            interaction: 'Comparer question et tâche agentique.',
            comparisons: [
              {
                mode: 'Question courte',
                context: 'ciblé',
                toolUse: 'aucun',
                progression: 'une réponse directe',
              },
              {
                mode: 'Tâche agentique',
                context: 'plus étendu et relu au fil de la tâche',
                toolUse: 'plusieurs appels possibles',
                progression: 'observations, actions et corrections successives',
              },
            ],
            relationship: 'La tâche agentique mobilise généralement davantage de contexte et d’étapes.',
            factors: ['Longueur', 'Complexité', 'Modèle', "Niveau d'effort", 'Fonctions utilisées'],
          },
        },
        links: [usageLimits, apiPricing],
        speaker: {
          durationMinutes: 3,
          notes: 'Expliquer les facteurs de consommation sans transformer l’exemple en estimation tarifaire universelle.',
          transition: 'Le bon objectif n’est pas le prompt le plus court, mais le contexte utile une seule fois.',
        },
        accessibleDescription: 'Une comparaison qualitative oppose une question directe à une tâche agentique qui relit du contexte, appelle des outils et se corrige.',
      }),
      slide({
        id: 'a4-budget',
        role: 'mission',
        claim: 'Optimiser consiste à fournir le contexte utile une fois.',
        support: 'Réussite : chaque élément conservé sert directement le résultat ou sa vérification.',
        visual: {
          key: 'context-budget',
          data: {
            interaction: 'Construire une fiche budget.',
            mission: "À partir d'une tâche de votre fil rouge, rédigez une fiche budget.",
            fields: [
              'Résultat réellement nécessaire',
              'Contexte indispensable',
              'Contexte que vous pouvez résumer ou retirer',
              "Outil et niveau d'autonomie nécessaires",
              "Point d'arrêt",
              'Preuve qui évite de relancer la tâche inutilement',
            ],
            successCriterion: 'Chaque élément de contexte conservé sert directement le résultat ou sa vérification.',
          },
        },
        links: [wikiLink('a4', 'mission-commune', 'Mission A4 complète')],
        speaker: {
          durationMinutes: 3,
          notes: 'Faire produire puis partager les fiches budget en binômes. Optimiser signifie fournir le contexte utile une fois, au bon endroit.',
          transition: 'Un budget a aussi besoin d’un point d’arrêt observable.',
        },
        accessibleDescription: 'Une fiche à six champs relie résultat, contexte, autonomie, arrêt et preuve ; le critère exige l’utilité de chaque élément.',
      }),
      slide({
        id: 'a4-checkpoint',
        role: 'checkpoint',
        claim: "Un point d'arrêt évite de relancer sans preuve.",
        support: 'Une charte simple transforme l’économie de contexte en habitudes répétables.',
        visual: {
          key: 'checkpoint',
          data: {
            interaction: 'Valider les cinq règles.',
            rules: [
              'Un fil par objectif',
              'Demander un plan avant une longue exécution',
              'Limiter les fichiers',
              'Tester sur un petit échantillon',
              'Arrêter quand le critère est atteint',
            ],
            proof: 'Critère atteint et résultat vérifié',
          },
        },
        links: [wikiLink('a4', 'livrable', 'Charte personnelle')],
        speaker: {
          durationMinutes: 2,
          notes: 'Faire choisir cinq règles concrètes et vérifier qu’au moins une règle définit explicitement la fin de tâche.',
          transition: 'Économiser du contexte ne suffit pas si une réponse fausse paraît convaincante.',
        },
        accessibleDescription: 'Une checklist de cinq règles se termine par la preuve que le critère est atteint et le résultat vérifié.',
      }),
    ],
  },
  {
    brickId: 'a5',
    family: 'a',
    order: 5,
    title: 'Biais cognitifs des IA',
    slides: [
      slide({
        id: 'a5-convincing',
        role: 'opening',
        claim: 'Une erreur bien formulée reste une erreur.',
        support: 'Le modèle peut générer une information fausse sans intention de tromper.',
        visual: {
          key: 'verification-audit',
          data: {
            interaction: 'Révéler les affirmations douteuses.',
            exerciseNotice: 'Exemple pédagogique entièrement fictif.',
            statements: [
              { text: 'Dans le dossier fictif, 12 réponses ont été recueillies.', category: 'fait vérifiable', fictional: true },
              { text: 'Sept réponses fictives mentionnent un délai supérieur à trois jours.', category: 'fait vérifiable', fictional: true },
              { text: "Le délai semble être la principale source d'insatisfaction.", category: 'inférence raisonnable', fictional: true },
              { text: 'Réduire le délai fidélisera tous les clients.', category: 'affirmation sans source', fictional: true },
              { text: "Il faut donc réorganiser immédiatement toute l'équipe support.", category: 'recommandation trop sûre', fictional: true },
            ],
            initialSignal: 'Ton fluide et affirmatif',
          },
        },
        links: [wikiLink('a5', 'concept-durable', 'Comprendre le risque'), hallucinationGuide],
        speaker: {
          durationMinutes: 3,
          notes: 'Montrer une fausse information bien formulée et demander un vote rapide. Ne pas résumer par « l’IA ment ».',
          transition: 'Pourquoi accordons-nous autant de crédit à une réponse fluide ?',
        },
        accessibleDescription: 'Cinq affirmations fictives et concrètes sont révélées comme deux faits, une inférence, une affirmation sans source et une recommandation trop sûre.',
      }),
      slide({
        id: 'a5-biases',
        role: 'explanation',
        claim: 'Nos biais transforment la fluidité en confiance excessive.',
        support: 'Cinq raccourcis mentaux peuvent masquer l’incertitude ou décourager la vérification.',
        visual: {
          key: 'verification-audit',
          data: {
            interaction: 'Explorer les cinq biais.',
            biases: [
              { name: "Biais d'automatisation", effect: "Croire la machine parce qu'elle a répondu vite et proprement" },
              { name: 'Biais de confirmation', effect: 'Retenir surtout ce qui conforte notre idée initiale' },
              { name: 'Ancrage', effect: 'Laisser la première proposition orienter toutes les suivantes' },
              { name: 'Anthropomorphisme', effect: 'Attribuer au modèle une intention, une mémoire ou une compréhension humaine' },
              { name: "Effet d'autorité", effect: 'Confondre ton affirmatif, vocabulaire technique et preuve' },
            ],
          },
        },
        links: [wikiLink('a5', 'concept-durable', 'Hallucination et biais')],
        speaker: {
          durationMinutes: 4,
          notes: 'Nommer hallucination et cinq biais sans culpabiliser les participants ; demander un exemple concret pour chacun.',
          transition: 'La bonne réponse n’est pas de tout vérifier avec la même intensité.',
        },
        accessibleDescription: 'Cinq cartes nomment un biais cognitif et l’effet précis qui peut augmenter la confiance accordée à la réponse.',
      }),
      slide({
        id: 'a5-risk',
        role: 'checkpoint',
        claim: "L'effort de vérification doit suivre le niveau de risque.",
        support: 'L’enjeu, la réversibilité et l’impact déterminent la profondeur du contrôle.',
        visual: {
          key: 'verification-audit',
          data: {
            interaction: "Déplacer une décision sur l'échelle.",
            scale: [
              { risk: 'Faible', example: 'Brainstorming réversible', verification: 'Relecture rapide' },
              { risk: 'Moyen', example: 'Note interne partagée', verification: 'Source + contre-lecture' },
              { risk: 'Élevé', example: 'Décision juridique ou médicale', verification: 'Sources primaires + expert compétent' },
            ],
            question: 'Quel serait le coût d’une erreur ?',
          },
        },
        links: [transparencyGuide],
        speaker: {
          durationMinutes: 2,
          notes: 'Faire relier l’effort de vérification au niveau de risque, et non au seul degré de confiance ressenti.',
          transition: 'Une méthode courte permet de rendre ce contrôle systématique.',
        },
        accessibleDescription: 'Une échelle à trois niveaux associe chaque risque à un exemple et à un effort de vérification proportionné.',
      }),
      slide({
        id: 'a5-method',
        role: 'demonstration',
        claim: "Stop — Source — Test — Décision rend l'incertitude visible.",
        support: 'La méthode sépare ce qui est affirmé, ce qui peut être contrôlé et ce qui justifie l’action.',
        visual: {
          key: 'verification-audit',
          data: {
            interaction: 'Parcourir les quatre étapes.',
            steps: [
              { name: 'Stop', action: 'Suspendre la décision' },
              { name: 'Source', action: 'Chercher une source indépendante' },
              { name: 'Test', action: 'Exécuter un contrôle concret' },
              { name: 'Décision', action: 'Agir avec le niveau d’incertitude visible' },
            ],
            output: 'Faits, inférences, inconnues et recommandation calibrée',
          },
        },
        links: [wikiLink('a5', 'pratique-avec-claude', 'Appliquer la méthode'), hallucinationGuide],
        speaker: {
          durationMinutes: 3,
          notes: 'Réaliser un audit en binômes et exiger une source indépendante ou un test concret avant la décision.',
          transition: 'Utilisons la méthode sur une réponse volontairement imparfaite.',
        },
        accessibleDescription: 'Quatre étapes successives suspendent la décision, cherchent une source, testent puis décident avec incertitude explicite.',
      }),
      slide({
        id: 'a5-mission',
        role: 'mission',
        claim: 'Auditez une réponse avant de décider.',
        support: 'Réussite : la version corrigée ne masque aucune affirmation incertaine derrière un ton affirmatif.',
        visual: {
          key: 'mission-board',
          data: {
            interaction: 'Ouvrir la mission A5.',
            input: 'Réponse courte fictive à auditer avant toute décision.',
            exerciseNotice: 'Exemple pédagogique entièrement fictif.',
            statements: [
              { text: 'Dans le dossier fictif, 12 réponses ont été recueillies.', category: 'fait vérifiable', fictional: true },
              { text: 'Sept réponses fictives mentionnent un délai supérieur à trois jours.', category: 'fait vérifiable', fictional: true },
              { text: "Le délai semble être la principale source d'insatisfaction.", category: 'inférence raisonnable', fictional: true },
              { text: 'Réduire le délai fidélisera tous les clients.', category: 'affirmation sans source', fictional: true },
              { text: "Il faut donc réorganiser immédiatement toute l'équipe support.", category: 'recommandation trop sûre', fictional: true },
            ],
            mission: [
              'Surlignez chaque catégorie avec une couleur.',
              'Appliquez Stop — Source — Test — Décision.',
              'Réécrivez la réponse pour rendre les limites explicites.',
              'Choisissez une source indépendante ou un test concret.',
            ],
            successCriterion: 'Votre version corrigée ne masque aucune affirmation incertaine derrière un ton affirmatif.',
          },
        },
        links: [wikiLink('a5', 'mission-commune', 'Mission A5 complète')],
        speaker: {
          durationMinutes: 3,
          notes: 'Partager une vérification et faire expliciter les incertitudes restantes dans la version corrigée.',
          transition: 'Ces réflexes accompagneront toutes les interfaces, surtout celles qui peuvent agir.',
        },
        accessibleDescription: 'Un tableau de mission présente cinq affirmations fictives à classer, puis une correction séparée, avant contrôle, réécriture et preuve.',
      }),
    ],
  },
] satisfies PresentationDeck[];
