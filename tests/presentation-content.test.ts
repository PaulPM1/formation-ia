import assert from 'node:assert/strict';
import test from 'node:test';
import { isTrainingExample } from '../src/components/presentation/visuals/a/training-example';

import { PRESENTATION_DECKS, PRESENTATION_SLIDES } from '../src/presentation/manifests';
import { validatePresentation } from '../src/presentation/presentation-validation';

const expectedIds = [
  'a1', 'a2', 'a3', 'a4', 'b0', 'b1', 'b2', 'b3', 'b4', 'b4-bis',
  'c1', 'c2', 'c3', 'd1', 'd2', 'd2-bis', 'd3', 'd4', 'e1', 'e2',
  'e3', 'e4',
];

const expectedSlides = [
  { id: 'a1-opening', claim: "À l'entraînement, le modèle apprend à prédire la suite.", visualKey: 'token-predictor' },
  { id: 'a1-context', claim: 'Le contexte change le sens avant de changer les mots.', visualKey: 'context-comparison' },
  { id: 'a1-plausible', claim: 'Probable, cohérent et vrai ne désignent pas la même chose.', visualKey: 'verification-audit' },
  { id: 'a1-mission', claim: 'Expliquez, repérez, puis améliorez la consigne.', visualKey: 'mission-board' },
  { id: 'a2-landscape', claim: 'Le bon outil se choisit par la sortie attendue, pas par sa puissance supposée.', visualKey: 'solution-comparison' },
  { id: 'a2-chat', claim: 'Claude Chat et ChatGPT suffisent quand la sortie est une réponse à relire.', visualKey: 'solution-comparison' },
  { id: 'a2-object', claim: 'Artifacts et Canvas transforment l’échange en objet éditable.', visualKey: 'solution-comparison' },
  { id: 'a2-work', claim: 'Cowork et Work prennent en charge un livrable multiétape.', visualKey: 'solution-comparison' },
  { id: 'a2-code', claim: 'Claude Code et Codex travaillent dans un projet et prouvent leurs changements.', visualKey: 'solution-comparison' },
  { id: 'a2-decision', claim: 'Sortie, contexte, action et preuve déterminent la solution minimale.', visualKey: 'solution-comparison' },
  { id: 'a2-prioritize', claim: 'Choisissez une solution par situation, puis justifiez ce qu’elle évite.', visualKey: 'solution-prioritizer' },
  { id: 'a3-model-fit', claim: 'Le bon modèle dépend du niveau d’exigence.', visualKey: 'model-cost-guide' },
  { id: 'a3-api-cost', claim: 'Le même dossier coûte de 0,23 à 1,50 $ selon le modèle.', visualKey: 'model-cost-guide' },
  { id: 'a3-access', claim: 'L’abonnement achète une capacité privilégiée, pas des tokens.', visualKey: 'model-cost-guide' },
  { id: 'a4-convincing', claim: 'Une erreur bien formulée reste une erreur.', visualKey: 'verification-audit' },
  { id: 'a4-biases', claim: 'Nos biais transforment la fluidité en confiance excessive.', visualKey: 'verification-audit' },
  { id: 'a4-risk', claim: "L'effort de vérification doit suivre le niveau de risque.", visualKey: 'verification-audit' },
  { id: 'a4-method', claim: "Stop — Source — Test — Décision rend l'incertitude visible.", visualKey: 'verification-audit' },
  { id: 'a4-mission', claim: 'Auditez une réponse avant de décider.', visualKey: 'mission-board' },
  { id: 'b0-layers', claim: 'Une voie, quatre niveaux d’action à tester.', visualKey: 'solution-comparison' },
  { id: 'b0-test', claim: 'Le kit est un banc d’essai, pas votre projet personnel.', visualKey: 'mission-board' },
  { id: 'b1-vague', claim: 'Chat suffit lorsque la sortie est une réponse à relire.', visualKey: 'prompt-builder' },
  { id: 'b1-four-blocks', claim: 'Objectif, contexte, contraintes et forme rendent cette réponse testable.', visualKey: 'prompt-builder' },
  { id: 'b1-mission', claim: 'Transformez six notes en brief sourcé dans Claude Chat ou ChatGPT.', visualKey: 'prompt-builder' },
  { id: 'b1-loop', claim: 'Un test binaire nomme l’écart avant la correction.', visualKey: 'prompt-builder' },
  { id: 'b2-object', claim: 'Artifacts et Canvas transforment la réponse en objet manipulable.', visualKey: 'artifact-test-loop' },
  { id: 'b2-mvp', claim: 'Une boîte de tri à trois états suffit pour tester l’idée.', visualKey: 'artifact-test-loop' },
  { id: 'b2-mission', claim: 'Construisez puis exécutez cinq tests sur les six notes.', visualKey: 'artifact-test-loop' },
  { id: 'b2-correction', claim: 'Une correction ciblée ne vaut que si les cinq tests repassent.', visualKey: 'artifact-test-loop' },
  { id: 'b3-delegation', claim: 'Cowork et Work prennent plusieurs étapes en charge ; vous gardez le périmètre.', visualKey: 'pacte-workspace' },
  { id: 'b3-pacte', claim: 'P.A.C.T.E. transforme une délégation en contrat observable.', visualKey: 'pacte-workspace' },
  { id: 'b3-mission', claim: 'Faites produire un brief fini dans Cowork ou Work.', visualKey: 'pacte-workspace' },
  { id: 'b3-check', claim: 'Le livrable n’est fini que si sources et incertitude passent le test.', visualKey: 'pacte-workspace' },
  { id: 'b4-context', claim: 'Claude Code et Codex travaillent dans le contexte réel d’un projet.', visualKey: 'ipmtr-loop' },
  { id: 'b4-ipmtr', claim: 'Inspecter, planifier, modifier, tester et relire borne le changement.', visualKey: 'ipmtr-loop' },
  { id: 'b4-mission', claim: 'Ajoutez les sources aux cartes sans modifier le tri.', visualKey: 'ipmtr-loop' },
  { id: 'b4-test', claim: 'Après quatre essais, choisissez la plus petite surface suffisante.', visualKey: 'solution-prioritizer' },
  { id: 'b4bis-install', claim: 'Le rattrapage ne corrige que le maillon local qui manque.', visualKey: 'workspace-triptych' },
  { id: 'b4bis-workspace', claim: 'Explorateur, fichier et terminal doivent pointer vers le même kit.', visualKey: 'workspace-triptych' },
  { id: 'b4bis-checkpoint', claim: 'Le poste est prêt lorsque le test passe et l’agent de code ouvre le bon dossier.', visualKey: 'workspace-triptych' },
  { id: 'c1-repeat', claim: 'Une méthode répétée trois fois mérite peut-être un Skill.', visualKey: 'skill-anatomy' },
  { id: 'c1-neighbors', claim: 'Skill, contexte, outil et hook ne répondent pas au même besoin.', visualKey: 'skill-anatomy' },
  { id: 'c1-anatomy', claim: 'Description, procédure et sortie rendent le Skill découvrable et testable.', visualKey: 'skill-anatomy' },
  { id: 'c1-trigger', claim: 'Une description précise décide quand le Skill intervient.', visualKey: 'skill-anatomy' },
  { id: 'c1-tests', claim: 'Un cas positif et un cas négatif révèlent les mauvais déclenchements.', visualKey: 'skill-anatomy' },
  { id: 'c1-mission', claim: 'Encodez une procédure de cinq étapes maximum.', visualKey: 'mission-board' },
  { id: 'c2-api', claim: "Une API est le contrat d'un service ; MCP standardise la connexion à l'IA.", visualKey: 'mcp-connection-map' },
  { id: 'c2-chain', claim: 'Utilisateur, client, serveur MCP et ressource forment une chaîne.', visualKey: 'mcp-connection-map' },
  { id: 'c2-tools', claim: "Commencer par l'inventaire des outils rend la portée visible.", visualKey: 'mcp-connection-map' },
  { id: 'c2-permissions', claim: 'La connexion augmente capacité et surface de risque ensemble.', visualKey: 'mcp-connection-map' },
  { id: 'c2-readonly', claim: "Une première requête en lecture seule limite le coût d'une erreur.", visualKey: 'mcp-connection-map' },
  { id: 'c2-revoke', claim: 'Une intégration sûre inclut sa propre révocation.', visualKey: 'mcp-connection-map' },
  { id: 'c2-mission', claim: 'Cartographiez données, action, preuve et révocation.', visualKey: 'mission-board' },
  { id: 'c3-trigger', claim: 'Un hook répond à un événement ; une tâche planifiée répond au temps.', visualKey: 'trigger-timeline' },
  { id: 'c3-hook', claim: "Un hook exécute une règle immédiate dans le cycle de l'outil.", visualKey: 'trigger-timeline' },
  { id: 'c3-schedule', claim: 'Une tâche planifiée ouvre une nouvelle exécution avec des outils autorisés.', visualKey: 'trigger-timeline' },
  { id: 'c3-guardrails', claim: "Bornée, observable et réversible : sinon l'automatisation amplifie l'erreur.", visualKey: 'trigger-timeline' },
  { id: 'c3-pause', claim: 'Tester, surveiller, mettre en pause et supprimer font partie du système.', visualKey: 'trigger-timeline' },
  { id: 'c3-mission', claim: "Concevez une automatisation que quelqu'un d'autre peut arrêter.", visualKey: 'mission-board' },
  { id: 'd1-journey', claim: 'Tous les termes du dev racontent une seule histoire : le voyage du code.', visualKey: 'mcp-connection-map' },
  { id: 'd1-workspace', claim: 'Le tour du poste de travail donne une image à chaque terme.', visualKey: 'workspace-triptych' },
  { id: 'd1-git-github', claim: 'Git est l’outil, GitHub est la plateforme.', visualKey: 'verification-audit' },
  { id: 'd1-reflex', claim: 'Le lexique ne se mémorise pas : il se demande.', visualKey: 'prompt-builder' },
  { id: 'd1-mission', claim: 'Définissez chaque terme avec vos mots, pas ceux de la slide.', visualKey: 'mission-board' },
  { id: 'd1-resources', claim: 'L’antisèche reste sur la table, les ressources prolongent.', visualKey: 'resource-rail' },
  { id: 'd2-fear', claim: 'Un commit est un point de sauvegarde de jeu vidéo.', visualKey: 'context-comparison' },
  { id: 'd2-three-words', claim: 'Commit, push, pull : un aller-retour entre votre machine et GitHub.', visualKey: 'mcp-connection-map' },
  { id: 'd2-demo', claim: 'Casser puis ressusciter : le filet de sécurité est réel.', visualKey: 'ipmtr-loop' },
  { id: 'd2-verify', claim: 'Faire confiance, oui ; à l’aveugle, non.', visualKey: 'verification-audit' },
  { id: 'd2-mission', claim: 'Sauvegardez, cassez, revenez : sur votre propre projet.', visualKey: 'mission-board' },
  { id: 'd2-rule', claim: 'Petite victoire = checkpoint.', visualKey: 'checkpoint' },
  { id: 'd2bis-ritual', claim: 'Faire naître un projet suit un rituel en quatre temps, chacun avec son propriétaire.', visualKey: 'setup-diagnostic' },
  { id: 'd2bis-diagnostic', claim: 'Ne créez que ce qui manque.', visualKey: 'setup-diagnostic' },
  { id: 'd2bis-authorize', claim: 'L’IA guide l’autorisation ; vous cliquez, vos mots de passe restent à vous.', visualKey: 'setup-diagnostic' },
  { id: 'd2bis-birth', claim: 'Le prompt rituel fait naître le projet : créé, versionné, en ligne.', visualKey: 'prompt-builder' },
  { id: 'd2bis-mission', claim: 'Faites naître le projet du fil rouge, preuve à l’appui.', visualKey: 'mission-board' },
  { id: 'd2bis-proof', claim: 'On n’avance jamais sans preuve visible.', visualKey: 'checkpoint' },
  { id: 'd3-public', claim: 'Le déploiement fait passer le projet de « chez moi » à une adresse pour tout le monde.', visualKey: 'context-comparison' },
  { id: 'd3-loop', claim: 'Repo connecté, chaque push, mise à jour automatique : la boucle ne demande plus rien.', visualKey: 'mcp-connection-map' },
  { id: 'd3-demo', claim: 'Toute la boucle du déploiement continu, vécue en une minute.', visualKey: 'setup-diagnostic' },
  { id: 'd3-mission', claim: 'Votre projet doit s’ouvrir sur un appareil qui n’est pas le vôtre.', visualKey: 'mission-board' },
  { id: 'd3-checkpoint', claim: 'Ce qui est déployé est public, code compris.', visualKey: 'checkpoint' },
  { id: 'd3-resources', claim: 'Les ressources Vercel prolongent la boucle.', visualKey: 'resource-rail' },
  { id: 'd4-exigence', claim: 'L’IA écrit du code qui marche, pas forcément du code sûr.', visualKey: 'verification-audit' },
  { id: 'd4-rules', claim: 'Quatre règles d’or couvrent l’essentiel des dégâts évitables.', visualKey: 'verification-audit' },
  { id: 'd4-prompts', claim: 'Deux prompts prêts à l’emploi : au démarrage, et avant chaque mise en ligne.', visualKey: 'prompt-builder' },
  { id: 'd4-audit', claim: 'Le rapport qui trouve la clé fait plus d’effet que dix slides.', visualKey: 'verification-audit' },
  { id: 'd4-mission', claim: 'Auditez votre projet, corrigez le plus grave, prouvez-le.', visualKey: 'mission-board' },
  { id: 'd4-checkpoint', claim: 'Poser la bonne exigence vaut mieux que connaître chaque technique.', visualKey: 'checkpoint' },
  { id: 'e1-brief', claim: "Une demande d'une phrase laisse le modèle inventer le brief.", visualKey: 'prompt-builder' },
  { id: 'e1-leviers', claim: "Contexte, spécificité, rôle et contraintes réduisent l'ambiguïté.", visualKey: 'prompt-builder' },
  { id: 'e1-demo', claim: 'Le bon prompt fournit ce que le modèle ne pouvait pas deviner.', visualKey: 'context-comparison' },
  { id: 'e1-contexte', claim: 'La fenêtre de contexte est une ressource qui se remplit et se pollue.', visualKey: 'context-budget' },
  { id: 'e1-repartir', claim: "La reformulation propre bat l'empilement de rustines.", visualKey: 'prompt-builder' },
  { id: 'e1-mission', claim: 'Écrivez deux versions, comparez, puis dégradez un levier.', visualKey: 'mission-board' },
  { id: 'e2-plan', claim: "Un projet se lit comme le plan d'une maison, pas ligne à ligne.", visualKey: 'ipmtr-loop' },
  { id: 'e2-roles', claim: 'Un fichier, un rôle : la séparation rend la modification possible.', visualKey: 'context-budget' },
  { id: 'e2-carte', claim: "La carte d'un projet s'interroge sans lire son code.", visualKey: 'prompt-builder' },
  { id: 'e2-trente', claim: 'Trente secondes pour expliquer votre projet, sinon vous ne le contrôlez plus.', visualKey: 'checkpoint' },
  { id: 'e2-mission', claim: 'Établissez la carte de votre projet et localisez la prochaine modification.', visualKey: 'mission-board' },
  { id: 'e3-cycle', claim: 'Cadrer, petite étape, tester, ajuster : on ne demande jamais le projet entier.', visualKey: 'ipmtr-loop' },
  { id: 'e3-mvp', claim: 'Le MVP est la plus petite version qui rend déjà service.', visualKey: 'context-budget' },
  { id: 'e3-etapes', claim: 'Si une étape ne peut pas être testée, elle est trop grosse.', visualKey: 'context-comparison' },
  { id: 'e3-enlisement', claim: "Trois signaux d'enlisement appellent trois parades, pas plus d'insistance.", visualKey: 'checkpoint' },
  { id: 'e3-mission', claim: 'Cadrez le projet de votre restitution finale.', visualKey: 'mission-board' },
  { id: 'e4-cycle', claim: 'Cadrer, architecturer, construire : planifier par rôles avant d’écrire une ligne.', visualKey: 'ipmtr-loop' },
  { id: 'e4-roles', claim: 'Faire jouer analyste, chef de produit et architecte à l’IA avant de coder.', visualKey: 'context-comparison' },
  { id: 'e4-prompt', claim: 'Un prompt rejoue les trois rôles, un par message, avant tout code.', visualKey: 'prompt-builder' },
  { id: 'e4-mission', claim: 'Obtenez un plan écrit et vérifiable avant la première ligne de code.', visualKey: 'mission-board' },
  { id: 'e4-bmad', claim: 'BMAD installe pour de bon l’équipe d’agents des projets ambitieux.', visualKey: 'resource-rail' },
];

test('A1 résout la même amorce dans deux univers sémantiques', () => {
  const contextSlide = PRESENTATION_SLIDES.find((slide) => slide.id === 'a1-context');
  assert.equal(contextSlide?.visual.data.sharedPrompt, 'Le navigateur a ouvert…');
  assert.deepEqual(contextSlide?.visual.data.contexts, [
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
  ]);
});

function slideData(slideId: string) {
  const slide = PRESENTATION_SLIDES.find((candidate) => candidate.id === slideId);
  assert.ok(slide, slideId);
  return slide.visual.data;
}

test('couvre toutes les briques A1 à E4 dans l’ordre pédagogique', () => {
  assert.deepEqual(PRESENTATION_DECKS.map((deck) => deck.brickId), expectedIds);
});

test('contient les 110 étapes de compréhension validées', () => {
  assert.deepEqual(
    PRESENTATION_SLIDES.map((slide) => ({
      id: slide.id,
      claim: slide.claim,
      visualKey: slide.visual.key,
    })),
    expectedSlides,
  );
});

test('A2 propose quatre paires équivalentes dans un ordre non progressif', () => {
  const exercise = PRESENTATION_SLIDES.find((slide) => slide.id === 'a2-prioritize');
  const options = exercise?.visual.data.options as Array<{
    id: string;
    need: string;
    solutions: string[];
  }>;
  const scenarios = exercise?.visual.data.scenarios as Array<{ answer: string }>;

  assert.deepEqual(options, [
    { id: 'chat', need: 'Réponse', solutions: ['Claude Chat', 'ChatGPT Chat'] },
    { id: 'object', need: 'Objet', solutions: ['Claude Artifacts', 'ChatGPT Canvas'] },
    { id: 'work', need: 'Livrable', solutions: ['Claude Cowork', 'ChatGPT Work'] },
    { id: 'code', need: 'Projet', solutions: ['Claude Code', 'Codex'] },
  ]);
  assert.deepEqual(scenarios.map((scenario) => scenario.answer), [
    'code', 'chat', 'work', 'object',
  ]);
});

test("l'ouverture A1 fournit une distribution illustrative valide pour chaque token", () => {
  const opening = PRESENTATION_SLIDES.find((slide) => slide.id === 'a1-opening');
  const training = opening?.visual.data.trainingExample;
  assert.ok(isTrainingExample(training));

  assert.equal(training.tokens.length, training.steps.length);
  training.steps.forEach((step, index) => {
    assert.equal(step.target, training.tokens[index]);
    assert.equal(step.candidates.reduce((sum, candidate) => sum + candidate.probability, 0), 100);
  });
});

test('le checkpoint A1 contient les cinq affirmations nuancées validées', () => {
  const checkpoint = PRESENTATION_SLIDES.find((slide) => slide.id === 'a1-plausible');
  const statements = checkpoint?.visual.data.statements as Array<{ text: string; answer: string; reason: string }>;
  assert.deepEqual(statements, [
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
  ]);
});

test('conserve les contenus canoniques revus de B0, A4 et P.A.C.T.E.', () => {
  const b0Test = slideData('b0-test');
  assert.deepEqual(b0Test.mission, [
    'Choisir Claude ou OpenAI.',
    'Télécharger le Kit d’entraînement du Bloc B.',
    'Ouvrir les trois fichiers de notes/.',
    'Nommer les quatre sorties à produire.',
  ]);
  assert.equal(
    b0Test.successCriterion,
    'Une voie choisie, trois notes ouvertes et aucune confusion avec le projet personnel.',
  );
  assert.deepEqual(b0Test.evidence, [
    'Choix visible',
    'Trois fichiers lisibles',
    'Quatre niveaux reformulés',
  ]);

  const pacte = slideData('b3-pacte').pacte as Array<{ letter: string; name: string; prompt: string }>;
  assert.deepEqual(pacte[3], {
    letter: 'T',
    name: 'Terminaison',
    prompt: 'Le vérificateur passe et les empreintes sont identiques',
  });
  assert.ok(!pacte.some((item) => item.name === 'Trace'));

  const biases = slideData('a4-biases').biases as Array<{ name: string }>;
  assert.deepEqual(biases.map((bias) => bias.name), [
    "Biais d'automatisation",
    'Biais de confirmation',
    'Ancrage',
    'Anthropomorphisme',
    "Effet d'autorité",
  ]);
});

test('A3 contient trois décisions sans mission ni checkpoint et les tarifs validés', () => {
  const a3Slides = PRESENTATION_SLIDES.filter((slide) => slide.id.startsWith('a3-'));
  assert.equal(a3Slides.length, 3);
  assert.ok(a3Slides.every((slide) => !['mission', 'checkpoint'].includes(slide.role)));

  const tiers = slideData('a3-model-fit').tiers as Array<{
    models: Array<{ vendor: string }>;
  }>;
  assert.equal(tiers.length, 3);
  assert.ok(tiers.every((tier) => tier.models.length === 3));
  assert.ok(tiers.every((tier) =>
    tier.models.map((model) => model.vendor).join(',') === 'Anthropic,OpenAI,Google'
  ));

  const prices = slideData('a3-api-cost').prices as Array<{
    inputPerMTok: number;
    outputPerMTok: number;
  }>;
  assert.deepEqual(prices.map(({ inputPerMTok, outputPerMTok }) => ({ inputPerMTok, outputPerMTok })), [
    { inputPerMTok: 2, outputPerMTok: 10 },
    { inputPerMTok: 2.5, outputPerMTok: 15 },
    { inputPerMTok: 1.5, outputPerMTok: 7.5 },
    { inputPerMTok: 10, outputPerMTok: 50 },
    { inputPerMTok: 5, outputPerMTok: 30 },
    { inputPerMTok: 2, outputPerMTok: 12 },
  ]);

  const access = slideData('a3-access');
  assert.equal(access.reference, '100 dossiers via API : environ 22,50 à 150 $ selon le modèle');
  assert.equal(access.intensivePlans, 'Offres intensives : 100 à 250 $/mois · quotas non équivalents');
  assert.equal(access.snapshot, 'Ordres de grandeur au 21 juillet 2026');

  const accessSlide = a3Slides.find((candidate) => candidate.id === 'a3-access');
  assert.ok(accessSlide?.links.some((link) => (
    link.label === 'ChatGPT Pro'
      && link.href === 'https://help.openai.com/en/articles/9793128/'
  )));
});

test('conserve un audit fictif concret', () => {
  for (const slideId of ['a4-convincing', 'a4-mission']) {
    const statements = slideData(slideId).statements as Array<{ category: string; fictional: boolean; text: string }>;
    assert.equal(statements.length, 5, slideId);
    assert.deepEqual(statements.map((statement) => statement.category), [
      'fait vérifiable',
      'fait vérifiable',
      'inférence raisonnable',
      'affirmation sans source',
      'recommandation trop sûre',
    ]);
    assert.ok(statements.every((statement) => statement.fictional && statement.text.trim()), slideId);
  }
});

test('chaque slide possède une thèse, une description et une note formateur', () => {
  for (const slide of PRESENTATION_SLIDES) {
    assert.ok(slide.claim.trim(), slide.id);
    assert.ok(slide.accessibleDescription.trim(), slide.id);
    assert.ok(slide.speaker.notes.trim(), slide.id);
    assert.ok(slide.speaker.transition.trim(), slide.id);
  }
  assert.deepEqual(validatePresentation(PRESENTATION_DECKS), []);
});

test('les ressources externes utilisent leurs destinations officielles canoniques', () => {
  const obsoleteHosts = new Set([
    'docs.anthropic.com',
    'status.anthropic.com',
    'support.anthropic.com',
  ]);

  for (const slide of PRESENTATION_SLIDES) {
    for (const link of slide.links.filter((candidate) => candidate.kind !== 'wiki')) {
      assert.ok(!obsoleteHosts.has(new URL(link.href).hostname), `${slide.id} → ${link.href}`);
    }
  }
});
