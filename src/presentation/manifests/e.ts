import { externalLink, wikiLink } from '../presentation-links';
import type { PresentationDeck, PresentationSlide } from '../presentation-model';

const slide = (value: PresentationSlide) => value;

const links = {
  promptGuide: externalLink('official', "Prompt engineering : vue d'ensemble", 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview'),
  multishot: externalLink('official', 'Utiliser des exemples : multishot prompting', 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting'),
  memory: externalLink('official', 'Garder le cap avec un fichier CLAUDE.md', 'https://code.claude.com/docs/en/memory'),
  bestPractices: externalLink('official', 'Bonnes pratiques Claude Code', 'https://www.anthropic.com/engineering/claude-code-best-practices'),
};

export const E_DECKS = [
  {
    brickId: 'e1', family: 'e', order: 13, title: 'Prompt et gestion du contexte', slides: [
      slide({
        id: 'e1-leviers', role: 'explanation',
        claim: "Contexte, spécificité, rôle et contraintes réduisent l'ambiguïté.",
        support: 'Deux réflexes complètent les leviers : décomposer une grosse demande en étapes et donner des exemples quand le format compte.',
        visual: { key: 'prompt-builder', data: {
          interaction: 'Assembler les quatre leviers.',
          blocks: [
            { name: 'Contexte', question: 'De quoi il s’agit, pour qui, dans quel but.' },
            { name: 'Spécificité', question: 'Longueur, langue, niveau de détail.' },
            { name: 'Rôle et format', question: '« Agis comme… », « réponds en tableau ».' },
            { name: 'Contraintes', question: 'Ce qu’il ne faut pas faire.' },
          ],
        } },
        links: [wikiLink('e1', 'concept-durable', 'Les quatre leviers'), links.promptGuide],
        speaker: { durationMinutes: 4, notes: 'Un exemple par levier, sans cours magistral. Mentionner zero-shot, one-shot et few-shot : quelques exemples diversifiés valent mieux que beaucoup d’exemples redondants.', transition: 'Voyons ces leviers agir sur la même tâche.' },
        accessibleDescription: 'Quatre blocs nommés contexte, spécificité, rôle et format, contraintes s’assemblent en un brief complet.',
      }),
      slide({
        id: 'e1-demo', role: 'demonstration',
        claim: 'Le bon prompt fournit ce que le modèle ne pouvait pas deviner.',
        support: 'Aucun des deux prompts n’est magique : le second dit simplement l’indevinable.',
        visual: { key: 'context-comparison', data: {
          interaction: 'Comparer les deux demandes.',
          sharedPrompt: 'Un planning de révisions pour les partiels.',
          contexts: [
            { audience: 'Demande en une phrase', constraints: 'quelques conseils génériques', vocabulary: 'hypothèses inventées' },
            { audience: 'Demande briefée', constraints: 'tableau par semaine', vocabulary: 'six semaines, 1 h par soir, week-ends légers' },
          ],
          observation: 'Même besoin, deux réponses : générique d’un côté, directement utilisable de l’autre.',
        } },
        links: [wikiLink('e1', 'pratique-avec-claude', 'Comparer les deux demandes'), links.multishot],
        speaker: { durationMinutes: 4, notes: 'Montrer les deux résultats côte à côte. Variante participative : faire réparer le mauvais prompt levier par levier par la salle.', transition: 'Un bon prompt ne suffit pas si la conversation elle-même se dégrade.' },
        accessibleDescription: 'Deux panneaux comparent la demande en une phrase et la demande briefée pour le même planning, avec leurs résultats attendus.',
      }),
      slide({
        id: 'e1-repartir', role: 'checkpoint',
        claim: "La reformulation propre bat l'empilement de rustines.",
        support: 'Sur un projet qui dure, un fichier de référence conserve le cap d’une conversation à l’autre.',
        visual: { key: 'prompt-builder', data: {
          interaction: 'Rejouer le réflexe de relance.',
          loop: ['Conversation qui dérape', 'Stop', 'Résumé de l’état', 'Conversation neuve', 'Cap retrouvé'],
          exampleGap: 'Cinq corrections successives ont pollué le fil : la réponse empire à chaque tour.',
          correction: 'Reformuler la demande complète dans une conversation neuve, avec un résumé propre.',
          proof: 'La réponse repart du bon état, pas des rustines.',
        } },
        links: [links.memory],
        speaker: { durationMinutes: 3, notes: 'Insister : ce réflexe servira dans tous les ateliers suivants. Un fichier CLAUDE.md ou un document de specs joue le rôle de mémoire durable.', transition: 'La mission met les leviers et ce réflexe à l’épreuve sur une tâche réelle.' },
        accessibleDescription: 'Une boucle en cinq étapes mène d’une conversation qui dérape à une conversation neuve nourrie d’un résumé propre.',
      }),
    ],
  },
  {
    brickId: 'e2', family: 'e', order: 14, title: 'Code design', slides: [
      slide({
        id: 'e2-roles', role: 'explanation',
        claim: 'Un fichier, un rôle : la séparation rend la modification possible.',
        support: 'Un fichier unique de deux mille lignes qui fait tout est un signal d’alarme, pour vous comme pour l’agent.',
        visual: { key: 'context-budget', data: {
          interaction: 'Comparer les deux structures.',
          comparisons: [
            { mode: 'Fichier fourre-tout', context: 'Deux mille lignes mélangées', toolUse: 'L’agent relit tout pour changer un détail', progression: 'Chaque correction en casse une autre' },
            { mode: 'Projet rangé', context: 'Un fichier, un rôle', toolUse: 'L’agent ouvre le bon fichier directement', progression: 'Une pièce change sans casser le reste' },
          ],
          relationship: 'Un agent modifie mieux un projet bien rangé : l’architecture rend la modification suivante possible.',
        } },
        links: [wikiLink('e2', 'concept-durable', 'Séparation des responsabilités')],
        speaker: { durationMinutes: 3, notes: 'Rester au niveau de la carte : pas de jargon MVC, patterns ou couches. L’architecture n’est pas un luxe d’expert.', transition: 'Cette carte s’obtient sans lire le code : il suffit de la demander.' },
        accessibleDescription: 'Deux parcours comparent un fichier fourre-tout et un projet rangé selon le contexte, le travail de l’agent et la progression.',
      }),
      slide({
        id: 'e2-carte', role: 'demonstration',
        claim: "La carte d'un projet s'interroge sans lire son code.",
        support: 'Si la réponse ne distingue pas clairement les rôles, c’est le projet qui a un problème, pas la question.',
        visual: { key: 'prompt-builder', data: {
          interaction: 'Assembler la demande de carte.',
          objective: 'Obtenir la carte du projet créé en B4',
          context: 'Le dossier du projet, ouvert dans Claude Code',
          constraints: ['Sans jargon', 'Une phrase par fichier', 'Ne rien modifier'],
          form: 'Liste des fichiers avec leur rôle, puis le fichier à modifier pour deux changements donnés',
          preview: ['index.html : ce que l’on voit', 'app.js : ce que ça fait', 'depenses.json : ce que ça retient', 'Couleur du titre : index.html', 'Rappel quotidien : app.js'],
        } },
        links: [wikiLink('e2', 'pratique-avec-claude', 'Interroger la carte du projet')],
        speaker: { durationMinutes: 3, notes: 'Lancer la demande en direct sur le projet de B4 et faire vérifier que chaque rôle tient en une phrase compréhensible.', transition: 'Reste à vérifier que cette carte tient dans votre tête, pas seulement à l’écran.' },
        accessibleDescription: 'Une demande structurée (objectif, contexte, contraintes, forme) produit la carte d’un projet et l’emplacement de deux modifications.',
      }),
      slide({
        id: 'e2-trente', role: 'checkpoint',
        claim: 'Trente secondes pour expliquer votre projet, sinon vous ne le contrôlez plus.',
        support: 'Le risque propre au développement assisté : un projet qui fonctionne mais que personne ne comprend.',
        visual: { key: 'checkpoint', data: {
          interaction: 'Passer le test des trente secondes.',
          checks: [
            'Chaque fichier a un rôle dicible en une phrase',
            'Vous savez où vivrait votre prochaine modification',
            'Aucun fichier ne fait trop de choses',
            'La structure reste aussi simple que le besoin',
          ],
          rule: 'Pour un mini-outil, trois fichiers bien nommés valent mieux qu’une structure de framework complète.',
          successCriterion: 'La carte du projet se restitue à voix haute, sans notes, en moins de trente secondes.',
        } },
        links: [wikiLink('e2', 'concept-durable', 'Le test des trente secondes')],
        speaker: { durationMinutes: 3, notes: 'Message essentiel : on ne relit pas le code ligne à ligne, on vérifie que la carte est logique. La sur-ingénierie est aussi un défaut de design.', transition: 'La mission applique ce test à votre propre projet.' },
        accessibleDescription: 'Quatre vérifications préparent le test des trente secondes, avec une règle contre la sur-ingénierie et un critère de restitution orale.',
      }),
    ],
  },
  {
    brickId: 'e3', family: 'e', order: 15, title: 'Cadrage et itération', slides: [
      slide({
        id: 'e3-mvp', role: 'explanation',
        claim: 'Le MVP est la plus petite version qui rend déjà service.',
        support: 'La liste « plus tard » n’est pas une poubelle : c’est le carnet de route des itérations suivantes.',
        visual: { key: 'context-budget', data: {
          interaction: 'Retirer tout ce qui peut attendre.',
          meter: [
            { item: 'Afficher trois dépenses saisies en dur', contextLoad: 'faible', relevance: 'rend service seul', keep: true },
            { item: 'Saisie de nouvelles dépenses', contextLoad: 'moyenne', relevance: 'itération suivante', keep: false },
            { item: 'Comptes multiples', contextLoad: 'forte', relevance: 'plus tard', keep: false },
            { item: 'Graphiques et catégories automatiques', contextLoad: 'forte', relevance: 'plus tard', keep: false },
            { item: 'Export des données', contextLoad: 'moyenne', relevance: 'plus tard', keep: false },
          ],
          objective: 'Une seule fonctionnalité retenue : tout le reste alimente la liste « plus tard ».',
        } },
        links: [wikiLink('e3', 'concept-durable', 'MVP et liste plus tard')],
        speaker: { durationMinutes: 3, notes: 'Un MVP à cinq fonctionnalités n’est pas un MVP : demander laquelle rend service seule, les autres vont dans « plus tard ».', transition: 'Chaque étape retenue doit ensuite passer un test simple.' },
        accessibleDescription: 'Cinq fonctionnalités d’un suivi de dépenses sont triées : une seule est retenue comme MVP, les quatre autres partent dans la liste plus tard.',
      }),
      slide({
        id: 'e3-etapes', role: 'demonstration',
        claim: 'Si une étape ne peut pas être testée, elle est trop grosse.',
        support: '« Ajoute la gestion complète du budget » n’est pas testable ; « affiche mes trois dernières dépenses » l’est.',
        visual: { key: 'context-comparison', data: {
          interaction: 'Comparer les deux démarrages.',
          sharedPrompt: 'Construire un suivi de dépenses.',
          contexts: [
            { audience: 'Projet entier demandé d’un coup', constraints: 'un bloc volumineux invérifiable', vocabulary: 'comptes, graphiques, catégories, export' },
            { audience: 'Première étape seulement', constraints: 'une page contrôlable en une minute', vocabulary: 'trois dépenses saisies en dur' },
          ],
          observation: 'La seconde annonce aussi la méthode à l’IA : ses réponses se cadrent d’elles-mêmes.',
        } },
        links: [wikiLink('e3', 'pratique-avec-claude', 'Deux démarrages comparés')],
        speaker: { durationMinutes: 3, notes: 'Anecdote à incarner : le projet complet cassé et incompris vingt minutes plus tard, contre l’empilement de petites victoires.', transition: 'Même bien découpé, un travail avec l’IA peut s’enliser : trois signaux l’annoncent.' },
        accessibleDescription: 'Deux panneaux comparent la demande du projet entier et la demande d’une première étape testable pour le même suivi de dépenses.',
      }),
      slide({
        id: 'e3-enlisement', role: 'checkpoint',
        claim: "Trois signaux d'enlisement appellent trois parades, pas plus d'insistance.",
        support: 'Le timeboxing complète les parades : un choix cosmétique se décide en cinq minutes maximum.',
        visual: { key: 'checkpoint', data: {
          interaction: 'Associer chaque signal à sa parade.',
          checks: [
            { signal: 'Claude « corrige » en cassant autre chose', parade: 'Revenir à la dernière version qui marchait' },
            { signal: 'La même solution revient, simplement reformulée', parade: 'Repartir d’une conversation propre avec un résumé de l’état' },
            { signal: 'Le code enfle sans progrès visible', parade: 'Redécouper le problème en plus petit' },
          ],
          rule: 'L’énergie va au cœur du projet, pas aux détails réversibles.',
          successCriterion: 'Au premier signal, vous appliquez une parade au lieu d’insister.',
        } },
        links: [wikiLink('e1', 'concept-durable', 'Le réflexe repartir propre (E1)')],
        speaker: { durationMinutes: 3, notes: 'Relier à E1 : repartir propre est la deuxième parade. Quand quelqu’un est bloqué, la bonne question est presque toujours « quelle est la plus petite étape testable ? ».', transition: 'La mission transforme cette méthode en plan d’attaque de votre projet final.' },
        accessibleDescription: 'Trois signaux d’enlisement sont associés chacun à une parade, avec une règle de timeboxing des choix cosmétiques.',
      }),
    ],
  },
] satisfies PresentationDeck[];
