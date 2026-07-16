import assert from 'node:assert/strict';
import test from 'node:test';

import { PRESENTATION_DECKS, PRESENTATION_SLIDES } from '../src/presentation/manifests';
import { validatePresentation } from '../src/presentation/presentation-validation';

const expectedIds = [
  'a1', 'a2', 'a3', 'a4', 'a5', 'b0', 'b1', 'b2', 'b3', 'b4', 'b4-bis',
  'c1', 'c2', 'c3',
];

const expectedSlides = [
  { id: 'a1-opening', claim: "Une réponse fluide n'est pas une preuve.", visualKey: 'token-predictor' },
  { id: 'a1-token-loop', claim: 'Une réponse se construit token après token.', visualKey: 'token-predictor' },
  { id: 'a1-context', claim: 'Changer le contexte change la suite plausible.', visualKey: 'context-comparison' },
  { id: 'a1-plausible', claim: 'Plausible et vrai sont deux questions différentes.', visualKey: 'verification-audit' },
  { id: 'a1-mission', claim: 'Expliquez, repérez, puis améliorez la consigne.', visualKey: 'mission-board' },
  { id: 'a2-three-modes', claim: 'Réponse, workflow et agent ne délèguent pas la même chose.', visualKey: 'response-workflow-agent' },
  { id: 'a2-response', claim: 'Une réponse transforme du contexte en texte.', visualKey: 'response-workflow-agent' },
  { id: 'a2-workflow', claim: "Un workflow suit un chemin décidé à l'avance.", visualKey: 'response-workflow-agent' },
  { id: 'a2-agent-loop', claim: "Un agent choisit la prochaine action selon ce qu'il observe.", visualKey: 'response-workflow-agent' },
  { id: 'a2-classify', claim: 'La variabilité du chemin détermine le bon mode.', visualKey: 'mission-board' },
  { id: 'a3-right-surface', claim: "Le bon outil donne juste assez de contexte et d'action.", visualKey: 'interface-continuum' },
  { id: 'a3-continuum', claim: "Chat, Artifacts, Cowork et Claude Code augmentent progressivement la capacité d'action.", visualKey: 'interface-continuum' },
  { id: 'a3-choice', claim: "Toute tâche n'a pas besoin de devenir agentique.", visualKey: 'interface-continuum' },
  { id: 'a3-mission', claim: 'Associez chaque prochaine action à la surface la plus simple.', visualKey: 'mission-board' },
  { id: 'a4-three-costs', claim: "Abonnement, limite d'usage et API sont trois réalités différentes.", visualKey: 'context-budget' },
  { id: 'a4-context-meter', claim: 'Chaque élément de contexte a un coût et une utilité.', visualKey: 'context-budget' },
  { id: 'a4-agentic', claim: 'Lire, agir et se corriger multiplie les étapes consommées.', visualKey: 'context-budget' },
  { id: 'a4-budget', claim: 'Optimiser consiste à fournir le contexte utile une fois.', visualKey: 'context-budget' },
  { id: 'a4-checkpoint', claim: "Un point d'arrêt évite de relancer sans preuve.", visualKey: 'checkpoint' },
  { id: 'a5-convincing', claim: 'Une erreur bien formulée reste une erreur.', visualKey: 'verification-audit' },
  { id: 'a5-biases', claim: 'Nos biais transforment la fluidité en confiance excessive.', visualKey: 'verification-audit' },
  { id: 'a5-risk', claim: "L'effort de vérification doit suivre le niveau de risque.", visualKey: 'verification-audit' },
  { id: 'a5-method', claim: "Stop — Source — Test — Décision rend l'incertitude visible.", visualKey: 'verification-audit' },
  { id: 'a5-mission', claim: 'Auditez une réponse avant de décider.', visualKey: 'mission-board' },
  { id: 'b0-layers', claim: 'Compte, surface, fonctionnalités et API sont quatre couches distinctes.', visualKey: 'setup-diagnostic' },
  { id: 'b0-diagnostic', claim: 'Le setup commence par un état observable.', visualKey: 'setup-diagnostic' },
  { id: 'b0-test', claim: '« Atelier prêt » prouve que la conversation fonctionne.', visualKey: 'setup-diagnostic' },
  { id: 'b0-fallback', claim: 'Une fonction absente appelle un chemin de repli, pas un blocage.', visualKey: 'setup-diagnostic' },
  { id: 'b0-ready', claim: 'Le groupe est prêt lorsque chacun peut agir sans donnée sensible.', visualKey: 'checkpoint' },
  { id: 'b1-vague', claim: 'Une demande vague force Claude à inventer le brief.', visualKey: 'prompt-builder' },
  { id: 'b1-four-blocks', claim: "Objectif, contexte, contraintes et forme réduisent l'ambiguïté.", visualKey: 'prompt-builder' },
  { id: 'b1-builder', claim: 'Un prompt utile est un brief lisible par une autre personne.', visualKey: 'prompt-builder' },
  { id: 'b1-loop', claim: "La première réponse ouvre une boucle d'évaluation.", visualKey: 'prompt-builder' },
  { id: 'b1-mission', claim: 'Écrivez, évaluez et corrigez une seule fois.', visualKey: 'mission-board' },
  { id: 'b2-object', claim: 'Un Artifact fait sortir le résultat du fil de discussion.', visualKey: 'artifact-test-loop' },
  { id: 'b2-anatomy', claim: 'Conversation, objet et versions ont des rôles distincts.', visualKey: 'artifact-test-loop' },
  { id: 'b2-mvp', claim: 'Une action principale suffit pour rendre le prototype testable.', visualKey: 'artifact-test-loop' },
  { id: 'b2-tests', claim: 'Définir trois tests avant de construire donne une preuve de fin.', visualKey: 'artifact-test-loop' },
  { id: 'b2-correction', claim: "Corriger l'écart principal vaut mieux que tout réécrire.", visualKey: 'artifact-test-loop' },
  { id: 'b2-mission', claim: "Construisez un mini-outil que quelqu'un utilise sans explication.", visualKey: 'mission-board' },
  { id: 'b3-delegation', claim: 'Cowork délègue le travail, jamais la responsabilité.', visualKey: 'pacte-workspace' },
  { id: 'b3-pacte', claim: "P.A.C.T.E. borne la tâche avant l'exécution.", visualKey: 'pacte-workspace' },
  { id: 'b3-permissions', claim: 'Une permission trop large agrandit la surface de risque.', visualKey: 'pacte-workspace' },
  { id: 'b3-observe', claim: 'Un agent doit rester observable et interruptible.', visualKey: 'pacte-workspace' },
  { id: 'b3-check', claim: 'Le résumé de Claude ne remplace pas une vérification indépendante.', visualKey: 'pacte-workspace' },
  { id: 'b3-mission', claim: 'Produisez une sortie vérifiée sans toucher aux originaux.', visualKey: 'mission-board' },
  { id: 'b4-context', claim: "Claude Code agit dans le contexte réel d'un dossier.", visualKey: 'ipmtr-loop' },
  { id: 'b4-ipmtr', claim: 'Inspecter, planifier, modifier, tester et relire forme une boucle.', visualKey: 'ipmtr-loop' },
  { id: 'b4-permission', claim: 'Comprendre une commande précède son autorisation.', visualKey: 'ipmtr-loop' },
  { id: 'b4-test', claim: 'Le test et le diff sont les preuves du changement.', visualKey: 'ipmtr-loop' },
  { id: 'b4-mission', claim: 'Réalisez une modification limitée et vérifiée.', visualKey: 'mission-board' },
  { id: 'b4-transition', claim: "Voir le dossier, le fichier et le terminal prépare l'étape suivante.", visualKey: 'workspace-triptych' },
  { id: 'b4bis-workspace', claim: 'Un workspace est un dossier ouvert avec son contexte.', visualKey: 'workspace-triptych' },
  { id: 'b4bis-install', claim: 'Mac et Windows arrivent au même test par des chemins différents.', visualKey: 'setup-diagnostic' },
  { id: 'b4bis-triptych', claim: 'Explorateur, éditeur et terminal montrent trois vues du même projet.', visualKey: 'workspace-triptych' },
  { id: 'b4bis-path', claim: 'Le terminal doit pointer vers le dossier affiché.', visualKey: 'workspace-triptych' },
  { id: 'b4bis-checkpoint', claim: 'Le setup est fini lorsque fichier et terminal concordent.', visualKey: 'checkpoint' },
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
];

function slideData(slideId: string) {
  const slide = PRESENTATION_SLIDES.find((candidate) => candidate.id === slideId);
  assert.ok(slide, slideId);
  return slide.visual.data;
}

test('couvre toutes les briques A1 à C3 dans l’ordre pédagogique', () => {
  assert.deepEqual(PRESENTATION_DECKS.map((deck) => deck.brickId), expectedIds);
});

test('contient les 76 étapes de compréhension validées', () => {
  assert.deepEqual(
    PRESENTATION_SLIDES.map((slide) => ({
      id: slide.id,
      claim: slide.claim,
      visualKey: slide.visual.key,
    })),
    expectedSlides,
  );
});

test('conserve les contenus canoniques revus de B0, A5 et P.A.C.T.E.', () => {
  const b0Test = slideData('b0-test');
  assert.match(String(b0Test.prompt), /Atelier prêt/);
  assert.match(String(b0Test.prompt), /date du jour/);
  assert.match(String(b0Test.expected), /Atelier prêt/);
  assert.match(String(b0Test.expected), /date du jour/);

  const pacte = slideData('b3-pacte').pacte as Array<{ letter: string; name: string; prompt: string }>;
  assert.deepEqual(pacte[3], {
    letter: 'T',
    name: 'Terminaison',
    prompt: 'Quelle preuve indique que le travail est fini ?',
  });
  assert.ok(!pacte.some((item) => item.name === 'Trace'));

  const biases = slideData('a5-biases').biases as Array<{ name: string }>;
  assert.deepEqual(biases.map((bias) => bias.name), [
    "Biais d'automatisation",
    'Biais de confirmation',
    'Ancrage',
    'Anthropomorphisme',
    "Effet d'autorité",
  ]);
});

test('emploie des relations qualitatives et un audit fictif concret', () => {
  for (const slideId of ['a1-opening', 'a4-context-meter', 'a4-agentic']) {
    const serialized = JSON.stringify(slideData(slideId));
    for (const unsupportedKey of ['probability', 'size', 'utility', 'reads', 'toolCalls', 'outputs', 'loops']) {
      assert.ok(!serialized.includes(`\"${unsupportedKey}\"`), `${slideId}: ${unsupportedKey}`);
    }
  }

  for (const slideId of ['a5-convincing', 'a5-mission']) {
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
