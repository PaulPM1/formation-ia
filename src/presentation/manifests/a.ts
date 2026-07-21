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
  'https://code.claude.com/docs/en/how-claude-code-works',
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
const anthropicModels = externalLink(
  'official',
  'Modèles Claude',
  'https://platform.claude.com/docs/en/about-claude/models/overview',
);
const anthropicPricing = externalLink(
  'official',
  "Tarification de l'API Claude",
  'https://platform.claude.com/docs/en/about-claude/pricing',
);
const anthropicPlans = externalLink(
  'official',
  'Forfaits Claude',
  'https://claude.com/pricing',
);
const openaiModels = externalLink(
  'official',
  'Modèles OpenAI',
  'https://developers.openai.com/api/docs/models',
);
const openaiPricing = externalLink(
  'official',
  'Tarification des modèles OpenAI',
  'https://developers.openai.com/api/docs/models',
);
const openaiPlans = externalLink(
  'official',
  'ChatGPT Plus',
  'https://help.openai.com/en/articles/6950777',
);
const chatgptProPlans = externalLink(
  'official',
  'ChatGPT Pro',
  'https://help.openai.com/en/articles/9793128/',
);
const googleModels = externalLink(
  'official',
  'Modèles Gemini',
  'https://ai.google.dev/gemini-api/docs/pricing',
);
const googlePricing = externalLink(
  'official',
  'Tarification de l\'API Gemini',
  'https://ai.google.dev/gemini-api/docs/pricing',
);
const googlePlans = externalLink(
  'official',
  'Forfaits Google AI',
  'https://one.google.com/intl/fr_fr/about/google-ai-plans/',
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
const chatgptCanvasGuide = externalLink(
  'official',
  'Utiliser Canvas dans ChatGPT',
  'https://help.openai.com/en/articles/9930697-what-is-the-canvas-feature-in-chatgpt-and-how-do-i-use-it',
);
const chatgptWorkGuide = externalLink(
  'official',
  'Choisir entre Chat, Work et Codex',
  'https://help.openai.com/en/articles/20001275/',
);
const codexGuide = externalLink(
  'official',
  'Bien démarrer avec Codex',
  'https://openai.com/codex/get-started/',
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
        claim: "À l'entraînement, le modèle apprend à prédire la suite.",
        support: 'Il prédit un fragment, compare avec le texte attendu, puis ajuste ses paramètres.',
        visual: {
          key: 'token-predictor',
          data: {
            interaction: 'Mettre en pause ou rejouer la démonstration.',
            trainingExample: {
              tokens: ['Le', ' soleil', ' réchauffe', ' doucement', ' la', ' pierre', '.'],
              steps: [
                { target: 'Le', candidates: [{ token: 'Le', probability: 52 }, { token: 'Un', probability: 31 }, { token: 'Cette', probability: 17 }] },
                { target: ' soleil', candidates: [{ token: ' soleil', probability: 64 }, { token: ' vent', probability: 23 }, { token: ' chat', probability: 13 }] },
                { target: ' réchauffe', candidates: [{ token: ' réchauffe', probability: 61 }, { token: ' éclaire', probability: 25 }, { token: ' frappe', probability: 14 }] },
                { target: ' doucement', candidates: [{ token: ' doucement', probability: 44 }, { token: ' encore', probability: 33 }, { token: ' lentement', probability: 23 }] },
                { target: ' la', candidates: [{ token: ' la', probability: 70 }, { token: ' une', probability: 20 }, { token: ' cette', probability: 10 }] },
                { target: ' pierre', candidates: [{ token: ' pierre', probability: 58 }, { token: ' pièce', probability: 27 }, { token: ' terre', probability: 15 }] },
                { target: '.', candidates: [{ token: '.', probability: 76 }, { token: ' chaude', probability: 14 }, { token: ' grise', probability: 10 }] },
              ],
            },
          },
        },
        links: [wikiLink('a1', 'concept-durable', 'Comprendre le mécanisme'), claudeOverview],
        speaker: {
          durationMinutes: 2,
          notes: "Laisser jouer une boucle complète. Préciser que les scores sont illustratifs et qu'en pratique un token peut être un fragment ou un signe.",
          transition: 'À la génération, la même prédiction est réutilisée sans phrase cible fournie.',
        },
        accessibleDescription: "Une phrase cible se révèle automatiquement. À chaque étape, le modèle simule trois suites, compare sa prédiction au token attendu, puis ajuste ses paramètres.",
      }),
      slide({
        id: 'a1-context',
        role: 'demonstration',
        claim: 'Le contexte change le sens avant de changer les mots.',
        support: 'Le même début de phrase active une interprétation différente selon ce qui le précède.',
        visual: {
          key: 'context-comparison',
          data: {
            interaction: 'Basculer entre les deux contextes.',
            sharedPrompt: 'Le navigateur a ouvert…',
            contexts: [
              {
                label: 'En mer',
                leadIn: "Le vent se lève, l'équipage quitte le port.",
                interpretation: 'Un membre de l’équipage',
                completion: 'les voiles',
              },
              {
                label: 'Sur ordinateur',
                leadIn: 'La page ne répond plus, il relance Chrome.',
                interpretation: 'Le logiciel de navigation',
                completion: 'un nouvel onglet',
              },
            ],
            observation: 'Même amorce, deux sens, deux suites plausibles',
          },
        },
        links: [wikiLink('a1', 'pratique-avec-claude', 'Comparer les prompts')],
        speaker: {
          durationMinutes: 2,
          notes: 'Afficher les deux branches et faire nommer le sens du mot « navigateur » avant de révéler chaque suite.',
          transition: 'Une suite adaptée au contexte peut encore être fausse ou incohérente.',
        },
        accessibleDescription: 'Le début « Le navigateur a ouvert… » devient « les voiles » après un contexte maritime et « un nouvel onglet » après un contexte informatique.',
      }),
      slide({
        id: 'a1-plausible',
        role: 'checkpoint',
        claim: 'Probable, cohérent et vrai ne désignent pas la même chose.',
        support: 'Cinq propriétés contre-intuitives séparent la génération linguistique de la preuve.',
        visual: {
          key: 'verification-audit',
          data: {
            interaction: 'Classer chaque affirmation puis afficher sa nuance.',
            buckets: ['Exacte', 'Simplifiée', 'À vérifier'],
            statements: [
              {
                text: "Une erreur souvent répétée peut être plus probable qu'une vérité rarement formulée.",
                answer: 'Exacte',
                reason: 'La fréquence des formulations influence la plausibilité statistique ; elle ne constitue pas une preuve.',
              },
              {
                text: "Le mot généré n'est pas nécessairement celui qui avait la probabilité la plus élevée.",
                answer: 'À vérifier',
                reason: "Cela dépend du décodage : l'échantillonnage peut retenir un token moins probable ; le décodage glouton choisit le premier.",
              },
              {
                text: 'Répéter une information dans le contexte peut renforcer son influence sans la rendre plus vraie.',
                answer: 'Exacte',
                reason: 'La répétition renforce le signal présent dans le contexte, sans modifier la réalité extérieure.',
              },
              {
                text: "Quand un LLM justifie sa réponse, il ne restitue pas forcément le calcul qui l'a réellement produite.",
                answer: 'Exacte',
                reason: "Une justification générée peut être utile, mais elle n'est pas une lecture garantie des opérations internes du modèle.",
              },
              {
                text: 'Des mots plausibles pris un par un ne garantissent pas une réponse cohérente dans son ensemble.',
                answer: 'Exacte',
                reason: 'La prédiction est locale ; la cohérence globale doit encore être construite et contrôlée sur toute la réponse.',
              },
            ],
          },
        },
        links: [wikiLink('a1', 'concept-durable', 'Voir les trois conséquences'), usageLimits],
        speaker: {
          durationMinutes: 3,
          notes: 'Faire voter avant chaque correction. Ne pas annoncer que quatre affirmations sur cinq sont exactes : le déséquilibre est volontairement contre-intuitif.',
          transition: 'Mettons ces distinctions en pratique sur une réponse produite par Claude.',
        },
        accessibleDescription: 'Cinq affirmations sur fréquence, échantillonnage, répétition, justification et cohérence sont classées puis expliquées une par une.',
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
    title: 'Choisir la bonne solution IA',
    slides: [
      slide({
        id: 'a2-landscape',
        role: 'opening',
        claim: 'Le bon outil se choisit par la sortie attendue, pas par sa puissance supposée.',
        support: 'Réponse, objet, livrable ou projet vérifié : chaque sortie appelle un niveau de contexte et d’action.',
        visual: {
          key: 'solution-comparison',
          data: {
            variant: 'landscape',
            interaction: 'Lire les quatre niveaux de sortie.',
            criteria: ['Sortie', 'Contexte', 'Action', 'Preuve'],
            levels: [
              {
                need: 'Réponse',
                output: 'Texte à relire',
                workflow: 'Contexte → échange → réponse',
                solutions: ['Claude Chat', 'ChatGPT Chat'],
              },
              {
                need: 'Objet',
                output: 'Contenu éditable ou interactif',
                workflow: 'Échange → objet → aperçu',
                solutions: ['Claude Artifacts', 'ChatGPT Canvas'],
              },
              {
                need: 'Livrable',
                output: 'Document fini en plusieurs étapes',
                workflow: 'Objectif → plan → outils → livrable',
                solutions: ['Claude Cowork', 'ChatGPT Work'],
              },
              {
                need: 'Projet',
                output: 'Changement vérifié dans un dépôt',
                workflow: 'Inspecter → modifier → tester → diff',
                solutions: ['Claude Code', 'Codex'],
              },
            ],
            warning: 'Fonctions et accès disponibles selon le forfait et le workspace.',
          },
        },
        links: [wikiLink('a2', 'concept-durable', 'Choisir par la sortie'), agentsGuide, chatgptWorkGuide],
        speaker: {
          durationMinutes: 3,
          notes: 'Faire nommer la sortie avant les marques. Présenter les quatre niveaux comme des établis et non comme une hiérarchie de puissance.',
          transition: 'Commençons par le niveau minimal : une réponse que l’on peut relire immédiatement.',
        },
        accessibleDescription: 'Quatre niveaux relient une sortie attendue à deux solutions : Claude Chat ou ChatGPT Chat, Artifacts ou Canvas, Cowork ou Work, Claude Code ou Codex.',
      }),
      slide({
        id: 'a2-chat',
        role: 'explanation',
        claim: 'Claude Chat et ChatGPT suffisent quand la sortie est une réponse à relire.',
        support: 'Le contexte est fourni dans la conversation ; le résultat reste un texte, un plan ou un tableau.',
        visual: {
          key: 'solution-comparison',
          data: {
            variant: 'pair',
            interaction: 'Comparer Claude Chat et ChatGPT Chat.',
            need: 'Réponse conversationnelle',
            solutions: [
              {
                name: 'Claude Chat', ecosystem: 'Claude', context: 'Conversation, pièces jointes et projet Claude',
                workflow: ['Fournir le contexte', 'Échanger', 'Relire la réponse'], output: 'Texte, plan ou tableau',
                actions: 'Chercher et raisonner dans le contexte autorisé', limit: 'Ne modifie pas un environnement de travail à votre place',
                proof: 'Réponse relue directement', access: 'Compte Claude et fonctions activées',
              },
              {
                name: 'ChatGPT Chat', ecosystem: 'OpenAI', context: 'Conversation, fichiers et projet ChatGPT',
                workflow: ['Fournir le contexte', 'Échanger', 'Relire la réponse'], output: 'Texte, plan ou tableau',
                actions: 'Chercher et raisonner dans le contexte autorisé', limit: 'N’est pas le meilleur établi pour un livrable long ou un dépôt',
                proof: 'Réponse relue directement', access: 'Compte ChatGPT et fonctions activées',
              },
            ],
            choiceSignal: 'Choisir l’écosystème déjà disponible lorsque la réponse elle-même est le livrable.',
          },
        },
        links: [wikiLink('a2', 'concept-durable', 'Réponse conversationnelle'), claudeOverview, chatgptWorkGuide],
        speaker: {
          durationMinutes: 3,
          notes: 'Utiliser l’exemple d’un email collé. Faire constater que la preuve tient dans la lecture de la réponse et qu’aucun accès supplémentaire n’est utile.',
          transition: 'Si le résultat doit devenir un objet que l’on édite et prévisualise, la conversation seule devient étroite.',
        },
        accessibleDescription: 'Deux panneaux comparent Claude Chat et ChatGPT Chat selon le même contexte, le même flux conversationnel, leurs limites et leur preuve de fin.',
      }),
      slide({
        id: 'a2-object',
        role: 'explanation',
        claim: 'Artifacts et Canvas transforment l’échange en objet éditable.',
        support: 'Le contenu sort du fil pour être modifié, prévisualisé et réutilisé dans un espace borné.',
        visual: {
          key: 'solution-comparison',
          data: {
            variant: 'pair',
            interaction: 'Comparer Artifacts et Canvas.',
            need: 'Objet éditable ou interactif',
            solutions: [
              {
                name: 'Claude Artifacts', ecosystem: 'Claude', context: 'Conversation et objet autonome',
                workflow: ['Décrire', 'Générer l’objet', 'Tester', 'Itérer ou partager'], output: 'Document, visualisation ou mini-outil interactif',
                actions: 'Créer et mettre à jour un objet visible', limit: 'Environnement borné, sans remplacer l’intégration dans un vrai projet',
                proof: 'Aperçu utilisable et version relue', access: 'Artifacts disponible dans Claude',
              },
              {
                name: 'ChatGPT Canvas', ecosystem: 'OpenAI', context: 'Conversation et document ou code dans Canvas',
                workflow: ['Ouvrir Canvas', 'Rédiger ou coder', 'Éditer', 'Prévisualiser'], output: 'Document ou code directement éditable',
                actions: 'Réviser, commenter et prévisualiser dans Canvas', limit: 'Ne représente pas à lui seul le dépôt, le build et les tests réels',
                proof: 'Contenu édité et aperçu contrôlé', access: 'Canvas disponible dans ChatGPT',
              },
            ],
            choiceSignal: 'Choisir un objet lorsque l’édition ou l’essai apporte plus de valeur qu’une réponse figée.',
          },
        },
        links: [wikiLink('a2', 'concept-durable', 'Objet éditable'), artifactsGuide, chatgptCanvasGuide],
        speaker: {
          durationMinutes: 3,
          notes: 'Comparer un calculateur interactif à une description du calculateur. Montrer que l’aperçu est la preuve, puis rappeler la frontière avec un projet réel.',
          transition: 'Quand plusieurs sources et étapes doivent aboutir à un livrable fini, il faut un établi de travail plus large.',
        },
        accessibleDescription: 'Deux panneaux comparent Claude Artifacts et ChatGPT Canvas par leur contexte, leur cycle d’édition, leur sortie, leur limite et leur preuve.',
      }),
      slide({
        id: 'a2-work',
        role: 'explanation',
        claim: 'Cowork et Work prennent en charge un livrable multiétape.',
        support: 'Objectif, sources et permissions alimentent un plan qui peut s’adapter avant de livrer un résultat fini.',
        visual: {
          key: 'solution-comparison',
          data: {
            variant: 'pair',
            interaction: 'Comparer Cowork et Work.',
            need: 'Livrable professionnel multiétape',
            solutions: [
              {
                name: 'Claude Cowork', ecosystem: 'Claude', context: 'Projet, fichiers, connecteurs et dossiers autorisés',
                workflow: ['Définir l’objectif', 'Examiner le plan', 'Suivre les étapes', 'Relire le livrable'], output: 'Document, tableau, présentation ou dossier traité',
                actions: 'Coordonner plusieurs étapes et utiliser les outils accordés', limit: 'Les accès locaux et externes doivent rester bornés et révocables',
                proof: 'Livrable contrôlé et changements observables', access: 'Cowork et connecteurs selon le forfait et le workspace',
              },
              {
                name: 'ChatGPT Work', ecosystem: 'OpenAI', context: 'Projet ChatGPT, fichiers, apps et sources autorisées',
                workflow: ['Définir le livrable', 'Fournir les sources', 'Suivre le travail', 'Relire le résultat'], output: 'Document, feuille, présentation, rapport ou site',
                actions: 'Mener un travail long et multiétape avec les outils accordés', limit: 'Les actions et données accessibles dépendent du plan et du workspace',
                proof: 'Livrable fini, sources et décisions relues', access: 'Work disponible pour les comptes et workspaces éligibles',
              },
            ],
            choiceSignal: 'Choisir le travail agentique lorsque le résultat exige plusieurs étapes, sources ou outils.',
          },
        },
        links: [wikiLink('a2', 'concept-durable', 'Livrable multiétape'), coworkGuide, chatgptWorkGuide],
        speaker: {
          durationMinutes: 3,
          notes: 'Faire distinguer un rapport fini d’une réponse sur la méthode. Insister sur le plan, les sources autorisées et la relecture indépendante.',
          transition: 'Le travail sur un dépôt ajoute une contrainte : il faut aussi exécuter et vérifier dans l’environnement réel.',
        },
        accessibleDescription: 'Deux panneaux comparent Claude Cowork et ChatGPT Work selon les sources, le plan multiétape, les livrables, les permissions et la preuve.',
      }),
      slide({
        id: 'a2-code',
        role: 'explanation',
        claim: 'Claude Code et Codex travaillent dans un projet et prouvent leurs changements.',
        support: 'Ils inspectent les fichiers, modifient, exécutent des commandes et relisent les tests ou le diff.',
        visual: {
          key: 'solution-comparison',
          data: {
            variant: 'pair',
            interaction: 'Comparer Claude Code et Codex.',
            need: 'Changement vérifié dans un projet',
            solutions: [
              {
                name: 'Claude Code', ecosystem: 'Claude', context: 'Dépôt, terminal, état Git et instructions du projet',
                workflow: ['Inspecter', 'Planifier', 'Modifier', 'Tester', 'Relire le diff'], output: 'Changement appliqué et vérifié',
                actions: 'Lire et écrire des fichiers, lancer des commandes et tests', limit: 'Accès technique trop large pour une simple réponse ou un objet isolé',
                proof: 'Tests, diff et état Git relus', access: 'Projet ouvert et permissions locales ou cloud accordées',
              },
              {
                name: 'Codex', ecosystem: 'OpenAI', context: 'Dépôt, environnement local ou cloud et instructions du projet',
                workflow: ['Inspecter', 'Planifier', 'Modifier', 'Tester', 'Revoir'], output: 'Changement de code prêt à relire ou livrer',
                actions: 'Modifier le projet, exécuter des commandes, tester et revoir', limit: 'Ne doit pas élargir les permissions au-delà du dépôt et de la tâche',
                proof: 'Tests, diff et revue du résultat', access: 'Codex sur une surface et un environnement autorisés',
              },
            ],
            choiceSignal: 'Choisir l’outil déjà configuré pour le dépôt, puis borner fichiers, commandes et critère d’arrêt.',
          },
        },
        links: [wikiLink('a2', 'concept-durable', 'Projet vérifié'), codeOverview, codexGuide],
        speaker: {
          durationMinutes: 3,
          notes: 'Faire lire le flux à voix haute. Exiger une preuve de fin observable : test, diff ou revue, jamais le simple résumé de l’agent.',
          transition: 'Ces quatre niveaux se choisissent avec les mêmes questions, quel que soit l’écosystème.',
        },
        accessibleDescription: 'Deux panneaux comparent Claude Code et Codex selon le contexte projet, la boucle inspecter–modifier–tester, les permissions et la preuve.',
      }),
      slide({
        id: 'a2-decision',
        role: 'checkpoint',
        claim: 'Sortie, contexte, action et preuve déterminent la solution minimale.',
        support: 'L’écosystème et les accès disponibles départagent ensuite deux solutions de même niveau.',
        visual: {
          key: 'solution-comparison',
          data: {
            variant: 'decision',
            interaction: 'Parcourir les quatre questions de décision.',
            questions: [
              { criterion: 'Sortie', question: 'Faut-il une réponse, un objet, un livrable ou un changement dans un projet ?' },
              { criterion: 'Contexte', question: 'La conversation suffit-elle, ou faut-il des fichiers, des apps ou un dépôt ?' },
              { criterion: 'Action', question: 'Que peut lire, créer, modifier ou exécuter la solution ?' },
              { criterion: 'Preuve', question: 'Relire un texte, tester un aperçu, contrôler un livrable ou vérifier tests et diff ?' },
            ],
            tieBreaker: 'À capacité suffisante, préférer la solution déjà autorisée qui demande le moins d’accès.',
            warning: 'Ne pas choisir un agent uniquement parce que la tâche paraît longue.',
          },
        },
        links: [wikiLink('a2', 'pratique-avec-claude', 'Grille de décision')],
        speaker: {
          durationMinutes: 3,
          notes: 'Faire répondre au groupe dans l’ordre. La sortie élimine d’abord trois niveaux ; l’écosystème ne tranche qu’entre solutions comparables.',
          transition: 'Appliquons cette grille à quatre situations où une seule solution est prioritaire.',
        },
        accessibleDescription: 'Quatre questions successives filtrent les solutions par sortie, contexte, action et preuve, puis l’accès disponible départage les équivalents.',
      }),
      slide({
        id: 'a2-prioritize',
        role: 'mission',
        claim: 'Choisissez une solution par situation, puis justifiez ce qu’elle évite.',
        support: 'Réussite : quatre choix sur quatre, fondés sur la sortie, le contexte, l’action et la preuve.',
        visual: {
          key: 'solution-prioritizer',
          data: {
            interaction: 'Prioriser une solution dans quatre situations.',
            options: [
              { id: 'chat', need: 'Réponse', solutions: ['Claude Chat', 'ChatGPT Chat'] },
              { id: 'object', need: 'Objet', solutions: ['Claude Artifacts', 'ChatGPT Canvas'] },
              { id: 'work', need: 'Livrable', solutions: ['Claude Cowork', 'ChatGPT Work'] },
              { id: 'code', need: 'Projet', solutions: ['Claude Code', 'Codex'] },
            ],
            scenarios: [
              {
                title: 'Corriger un formulaire',
                situation: 'Le dépôt local du site est ouvert dans votre agent de code avec ses consignes projet. Vous devez corriger le formulaire mobile, lancer les tests et présenter le diff.',
                signals: ['Sortie : changement de code', 'Contexte : dépôt', 'Action : modifier et exécuter', 'Preuve : tests et diff'],
                answer: 'code',
                reason: 'Claude Code comme Codex peuvent travailler dans le dépôt, exécuter les tests et produire le diff attendu.',
                tempting: 'object',
                temptingReason: 'Artifacts ou Canvas peuvent montrer du code, mais ne remplacent pas les tests et le diff du dépôt réel.',
              },
              {
                title: 'Répondre à un client',
                situation: 'Un email client est déjà fourni dans la conversation. Vous devez proposer une réponse de cinq lignes, sans créer ni modifier de fichier.',
                signals: ['Sortie : texte court', 'Contexte : conversation', 'Action : aucune', 'Preuve : relecture'],
                answer: 'chat',
                reason: 'Claude Chat comme ChatGPT Chat produisent directement la réponse courte à relire dans la conversation.',
                tempting: 'work',
                temptingReason: 'Cowork ou Work ajouteraient un plan, des étapes et des accès inutiles pour une réponse de cinq lignes.',
              },
              {
                title: 'Prioriser des entretiens',
                situation: 'Votre espace de travail contient douze entretiens clients. Vous devez les analyser et livrer une synthèse ainsi qu’un tableau de priorités.',
                signals: ['Sortie : deux livrables', 'Contexte : douze fichiers', 'Action : travail multiétape', 'Preuve : sources et priorités relues'],
                answer: 'work',
                reason: 'Claude Cowork comme ChatGPT Work peuvent mener le travail multiétape sur les douze fichiers et produire les deux livrables finis.',
                tempting: 'chat',
                temptingReason: 'Claude Chat ou ChatGPT Chat peuvent aider, mais laissent davantage d’orchestration manuelle pour douze sources et deux livrables.',
              },
              {
                title: 'Tester un calculateur',
                situation: 'Vous voulez créer un calculateur interactif de budget formation, le tester puis partager son aperçu. Aucun projet existant ne doit être modifié.',
                signals: ['Sortie : mini-outil', 'Contexte : conversation', 'Action : créer un objet', 'Preuve : aperçu testé'],
                answer: 'object',
                reason: 'Claude Artifacts comme ChatGPT Canvas permettent de créer, tester et partager cet objet interactif dans un environnement borné.',
                tempting: 'code',
                temptingReason: 'Claude Code ou Codex demanderaient un dépôt et un environnement de développement sans nécessité ici.',
              },
            ],
            successCriterion: '4 décisions sur 4 en choisissant la paire minimale qui produit la preuve attendue.',
          },
        },
        links: [wikiLink('a2', 'mission-commune', 'Mission A2 complète')],
        speaker: {
          durationMinutes: 7,
          notes: 'Faire voter avant chaque validation. Après la correction, demander quelle permission ou quel contexte rend l’alternative trop faible ou trop large.',
          transition: 'Après avoir choisi la bonne surface, choisissons la puissance réellement nécessaire.',
        },
        accessibleDescription: 'Quatre situations professionnelles proposent quatre paires de solutions équivalentes. Chaque correction nomme la paire prioritaire, le signal décisif et l’alternative trop faible ou trop large.',
      }),
    ],
  },
  {
    brickId: 'a3',
    family: 'a',
    order: 3,
    title: 'Choisir son modèle et son mode de paiement',
    slides: [
      slide({
        id: 'a3-model-fit',
        role: 'opening',
        claim: 'Le bon modèle dépend du niveau d’exigence.',
        support: 'La bonne gamme dépend du compromis entre exigence, volume et coût.',
        visual: {
          key: 'model-cost-guide',
          data: {
            variant: 'models',
            interaction: 'Choisir le niveau d’exigence.',
            tiers: [
              {
                id: 'volume',
                label: 'Cadré et volumineux',
                signal: 'Extraction, classement, reformulation et sous-tâches répétables',
                models: [
                  { vendor: 'Anthropic', name: 'Claude Haiku 4.5' },
                  { vendor: 'OpenAI', name: 'GPT-5.6 Luna' },
                  { vendor: 'Google', name: 'Gemini 3.5 Flash-Lite' },
                ],
              },
              {
                id: 'balance',
                label: 'Professionnel courant',
                signal: 'Rédaction nuancée, analyse, code et agents ordinaires',
                models: [
                  { vendor: 'Anthropic', name: 'Claude Sonnet 5' },
                  { vendor: 'OpenAI', name: 'GPT-5.6 Terra' },
                  { vendor: 'Google', name: 'Gemini 3.6 Flash' },
                ],
              },
              {
                id: 'exigence',
                label: 'Très exigeant',
                signal: 'Problème difficile, forte précision attendue ou agent long',
                models: [
                  { vendor: 'Anthropic', name: 'Claude Opus 4.8 / Fable 5', note: 'Opus : code complexe · Fable : agents longs' },
                  { vendor: 'OpenAI', name: 'GPT-5.6 Sol' },
                  { vendor: 'Google', name: 'Gemini 3.1 Pro Preview' },
                ],
              },
            ],
            rule: 'Commencer à l’équilibre, descendre pour le volume, monter seulement après un test insuffisant.',
            snapshot: 'Relevé du 21 juillet 2026',
          },
        },
        links: [anthropicModels, openaiModels, googleModels],
        speaker: {
          durationMinutes: 3,
          notes: 'Faire comparer les trois niveaux sans transformer les marques en classement absolu. Commencer à l’équilibre, descendre pour le volume et ne monter qu’après un test insuffisant.',
          transition: 'Appliquons la même charge à chaque modèle pour rendre l’écart de coût visible.',
        },
        accessibleDescription: 'Trois niveaux de tâche, du travail cadré et volumineux au problème très exigeant, affichent chacun un signal de décision et un modèle Anthropic, OpenAI et Google.',
      }),
      slide({
        id: 'a3-api-cost',
        role: 'demonstration',
        claim: 'Le même dossier coûte de 0,23 à 1,50 $ selon le modèle.',
        support: 'La charge reste identique : 100 000 tokens d’entrée et 10 000 tokens de sortie par dossier.',
        visual: {
          key: 'model-cost-guide',
          data: {
            variant: 'costs',
            interaction: 'Comparer 1, 10 ou 100 dossiers.',
            caseLabel: 'Cas de référence',
            workload: { inputTokens: 100_000, outputTokens: 10_000 },
            prices: [
              { tier: 'Équilibre', vendor: 'Anthropic', model: 'Claude Sonnet 5', inputPerMTok: 2, outputPerMTok: 10, note: 'tarif de lancement jusqu’au 31 août 2026' },
              { tier: 'Équilibre', vendor: 'OpenAI', model: 'GPT-5.6 Terra', inputPerMTok: 2.5, outputPerMTok: 15 },
              { tier: 'Équilibre', vendor: 'Google', model: 'Gemini 3.6 Flash', inputPerMTok: 1.5, outputPerMTok: 7.5 },
              { tier: 'Exigence', vendor: 'Anthropic', model: 'Claude Fable 5', inputPerMTok: 10, outputPerMTok: 50 },
              { tier: 'Exigence', vendor: 'OpenAI', model: 'GPT-5.6 Sol', inputPerMTok: 5, outputPerMTok: 30 },
              { tier: 'Exigence', vendor: 'Google', model: 'Gemini 3.1 Pro Preview', inputPerMTok: 2, outputPerMTok: 12, note: 'contexte ≤ 200k' },
            ],
            caveat: 'USD hors taxes. Outils, recherche, cache, images, stockage et long contexte non inclus. Prix et modèles évolutifs.',
            snapshot: 'Relevé du 21 juillet 2026',
          },
        },
        links: [anthropicPricing, openaiPricing, googlePricing],
        speaker: {
          durationMinutes: 3,
          notes: 'Conserver l’hypothèse 100 000 tokens d’entrée et 10 000 de sortie. Rappeler la date, le tarif de lancement de Sonnet 5 et les coûts exclus ; ce cas n’est ni une moyenne universelle ni une promesse de quota.',
          transition: 'L’API facture cette consommation ; un abonnement achète un autre régime d’accès.',
        },
        accessibleDescription: 'Un tableau compare six modèles à charge identique pour un et cent dossiers. Les montants vont de 0,225 à 1,50 dollar par dossier et restent lisibles sans graphique.',
      }),
      slide({
        id: 'a3-access',
        role: 'explanation',
        claim: 'L’abonnement achète une capacité privilégiée, pas des tokens.',
        support: 'Abonnement et API répondent à deux régimes d’usage différents et peuvent être combinés.',
        visual: {
          key: 'model-cost-guide',
          data: {
            variant: 'access',
            subscriptionTitle: 'Capacité dans un produit',
            subscriptionPoints: [
              '≈ 20 $/mois pour les offres individuelles courantes',
              'Fonctions et modèles inclus selon le forfait',
              'Limites variables et partagées',
            ],
            apiTitle: 'Consommation mesurée',
            apiPoints: [
              'Paiement exact à l’usage',
              'Automatisation et choix explicite du modèle',
              'Dépense ouverte à plafonner',
            ],
            hybrid: 'Abonnement pour le quotidien · API pour les workflows mesurés',
            conclusion: 'Aujourd’hui, l’abonnement peut donner une capacité qui coûterait davantage au tarif API. Ce rapport peut changer.',
            reference: '100 dossiers via API : environ 22,50 à 150 $ selon le modèle',
            intensivePlans: 'Offres intensives : 100 à 250 $/mois · quotas non équivalents',
            snapshot: 'Ordres de grandeur au 21 juillet 2026',
          },
        },
        links: [anthropicPlans, openaiPlans, chatgptProPlans, googlePlans],
        speaker: {
          durationMinutes: 2,
          notes: 'Ne pas présenter l’abonnement comme un préachat de tokens ni promettre cent dossiers. Distinguer le modèle visible dans l’interface de l’identifiant API et rappeler que prix, limites et inclusions évoluent.',
          transition: 'Même le meilleur modèle ne transforme pas une réponse plausible en preuve.',
        },
        accessibleDescription: 'Deux colonnes opposent un abonnement à capacité variable et une API facturée à l’usage, puis les relient à un usage hybride explicitement nommé.',
      }),
    ],
  },
  {
    brickId: 'a4',
    family: 'a',
    order: 4,
    title: 'Biais cognitifs des IA',
    slides: [
      slide({
        id: 'a4-convincing',
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
        links: [wikiLink('a4', 'concept-durable', 'Comprendre le risque'), hallucinationGuide],
        speaker: {
          durationMinutes: 3,
          notes: 'Montrer une fausse information bien formulée et demander un vote rapide. Ne pas résumer par « l’IA ment ».',
          transition: 'Pourquoi accordons-nous autant de crédit à une réponse fluide ?',
        },
        accessibleDescription: 'Cinq affirmations fictives et concrètes sont révélées comme deux faits, une inférence, une affirmation sans source et une recommandation trop sûre.',
      }),
      slide({
        id: 'a4-biases',
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
        links: [wikiLink('a4', 'concept-durable', 'Hallucination et biais')],
        speaker: {
          durationMinutes: 4,
          notes: 'Nommer hallucination et cinq biais sans culpabiliser les participants ; demander un exemple concret pour chacun.',
          transition: 'La bonne réponse n’est pas de tout vérifier avec la même intensité.',
        },
        accessibleDescription: 'Cinq cartes nomment un biais cognitif et l’effet précis qui peut augmenter la confiance accordée à la réponse.',
      }),
      slide({
        id: 'a4-risk',
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
        id: 'a4-method',
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
        links: [wikiLink('a4', 'pratique-avec-claude', 'Appliquer la méthode'), hallucinationGuide],
        speaker: {
          durationMinutes: 3,
          notes: 'Réaliser un audit en binômes et exiger une source indépendante ou un test concret avant la décision.',
          transition: 'Utilisons la méthode sur une réponse volontairement imparfaite.',
        },
        accessibleDescription: 'Quatre étapes successives suspendent la décision, cherchent une source, testent puis décident avec incertitude explicite.',
      }),
      slide({
        id: 'a4-mission',
        role: 'mission',
        claim: 'Auditez une réponse avant de décider.',
        support: 'Réussite : la version corrigée ne masque aucune affirmation incertaine derrière un ton affirmatif.',
        visual: {
          key: 'mission-board',
          data: {
            interaction: 'Ouvrir la mission A4.',
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
        links: [wikiLink('a4', 'mission-commune', 'Mission A4 complète')],
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
