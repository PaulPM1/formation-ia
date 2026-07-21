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
    brickId: 'e1', family: 'e', order: 19, title: 'Prompt et gestion du contexte', slides: [
      slide({
        id: 'e1-brief', role: 'opening',
        claim: "Une demande d'une phrase laisse le modèle inventer le brief.",
        support: '« Fais-moi un planning de révisions » oblige Claude à deviner la situation, la disponibilité, les priorités et la forme.',
        visual: { key: 'prompt-builder', data: {
          interaction: 'Révéler ce que la demande ne dit pas.',
          blocks: [
            { name: 'Situation', question: 'Partiels ? Concours ? Dans combien de temps ?' },
            { name: 'Disponibilité', question: 'Une heure par soir ? Les week-ends ?' },
            { name: 'Priorités', question: 'Quelles matières en retard ?' },
            { name: 'Forme', question: 'Liste, tableau ou calendrier ?' },
          ],
        } },
        links: [wikiLink('e1', 'concept-durable', 'Briefer une IA')],
        speaker: { durationMinutes: 2, notes: 'Rappeler A1 : qualité d’entrée, qualité de sortie. Analogie du collaborateur brillant mais sans aucune mémoire de vous.', transition: 'Quatre leviers structurent ce que le modèle ne peut pas deviner.' },
        accessibleDescription: 'Quatre blocs révèlent les questions restées sans réponse dans une demande de planning formulée en une seule phrase.',
      }),
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
        id: 'e1-contexte', role: 'explanation',
        claim: 'La fenêtre de contexte est une ressource qui se remplit et se pollue.',
        support: 'Sur un long échange, le modèle perd le fil du début ; chaque correction ratée pollue la suite.',
        visual: { key: 'context-budget', data: {
          interaction: 'Ajouter ou retirer du contexte.',
          meter: [
            { item: 'Brief initial complet', contextLoad: 'faible', relevance: 'forte', keep: true },
            { item: 'Document de référence utile', contextLoad: 'moyenne', relevance: 'forte', keep: true },
            { item: 'Cinq corrections ratées empilées', contextLoad: 'forte', relevance: 'faible', keep: false },
            { item: 'Résumé propre de l’état et de l’objectif', contextLoad: 'faible', relevance: 'forte', keep: true },
          ],
          objective: 'Fournir le contexte utile une fois, retirer ce qui pollue.',
        } },
        links: [wikiLink('e1', 'concept-durable', 'Gérer la fenêtre de contexte')],
        speaker: { durationMinutes: 3, notes: 'Relier aux tokens de A1. Nommer le piège : répondre « non, pas comme ça » cinq fois de suite remplit le contexte de rustines.', transition: 'Quand la conversation dérape, il existe un réflexe simple.' },
        accessibleDescription: 'Quatre éléments de contexte affichent leur charge et leur pertinence ; les corrections ratées sont retirées de la sélection.',
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
      slide({
        id: 'e1-mission', role: 'mission',
        claim: 'Écrivez deux versions, comparez, puis dégradez un levier.',
        support: 'Réussite : vous savez nommer le levier qui a le plus amélioré le résultat.',
        visual: { key: 'mission-board', data: {
          interaction: 'Ouvrir la mission E1.',
          mission: [
            'Choisissez une tâche réelle : message délicat, organisation d’un événement, aide à la décision.',
            'Écrivez la version spontanée, en une phrase.',
            'Écrivez la version structurée avec les quatre leviers identifiés explicitement.',
            'Soumettez les deux à Claude et comparez les réponses.',
            'Dégradez volontairement un levier (retirez le contexte ou le format) et observez ce qui change.',
          ],
          successCriterion: 'Vous nommez le levier qui a le plus amélioré votre résultat et celui qui manquait dans votre version spontanée.',
          deliverables: ['Deux prompts côte à côte', 'Annotation levier par levier', 'Observation de la dégradation'],
        } },
        links: [wikiLink('e1', 'mission-commune', 'Mission E1 complète'), links.promptGuide],
        speaker: { durationMinutes: 4, notes: 'Debrief : faire nommer le levier décisif par deux ou trois personnes. Terminer sur le réflexe « repartir propre » quand une conversation s’enlise.', transition: 'Ces réflexes de brief s’appliquent maintenant à la lecture d’un projet généré.' },
        accessibleDescription: 'Cinq étapes conduisent de la version spontanée à la version structurée, puis à une dégradation volontaire d’un levier.',
      }),
    ],
  },
  {
    brickId: 'e2', family: 'e', order: 20, title: 'Code design', slides: [
      slide({
        id: 'e2-plan', role: 'opening',
        claim: "Un projet se lit comme le plan d'une maison, pas ligne à ligne.",
        support: 'Inutile de savoir maçonner pour lire un plan : quatre zones suffisent.',
        visual: { key: 'ipmtr-loop', data: {
          interaction: 'Parcourir les quatre zones.',
          boundary: 'Lire la carte du projet, pas le code ligne à ligne.',
          context: [
            { surface: 'Interface', reveals: 'Ce que l’utilisateur voit' },
            { surface: 'Logique', reveals: 'Ce que le projet fait' },
            { surface: 'Données', reveals: 'Ce que le projet retient' },
            { surface: 'Configuration', reveals: 'Comment le projet tourne' },
          ],
          loopBack: 'Une carte illisible renvoie à Inspecter avant toute modification.',
        } },
        links: [wikiLink('e2', 'concept-durable', 'Lire le plan d’un projet'), links.bestPractices],
        speaker: { durationMinutes: 3, notes: 'Analogie de la maison : cuisine, chambres, tableau électrique. Rappeler que cette lecture est l’étape Inspecter de la boucle vue en B4.', transition: 'Ce plan repose sur un principe unique : un fichier, un rôle.' },
        accessibleDescription: 'Quatre zones du projet (interface, logique, données, configuration) sont listées à côté de la boucle de travail de Claude Code.',
      }),
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
      slide({
        id: 'e2-mission', role: 'mission',
        claim: 'Établissez la carte de votre projet et localisez la prochaine modification.',
        support: 'Réussite : la carte se restitue de tête en moins de trente secondes.',
        visual: { key: 'mission-board', data: {
          interaction: 'Ouvrir la mission E2.',
          mission: [
            'Demandez à Claude la carte du projet : rôle de chaque fichier en une phrase.',
            'Choisissez une modification que vous aimeriez faire et demandez où elle vivrait, sans la réaliser.',
            'Posez la question de contrôle : y a-t-il un fichier qui fait trop de choses ? Si oui, comment le découper ?',
            'Restituez la carte à voix haute, sans notes.',
          ],
          successCriterion: 'Vous restituez la carte de votre projet à voix haute, sans notes, en moins de trente secondes.',
          deliverables: ['Carte du projet : fichiers et rôles en une phrase', 'Emplacement identifié de la prochaine modification'],
        } },
        links: [wikiLink('e2', 'mission-commune', 'Mission E2 complète'), links.bestPractices],
        speaker: { durationMinutes: 3, notes: 'Faire restituer deux ou trois cartes devant le groupe. Si Claude propose une refonte complète, refuser : demander le plus petit changement utile.', transition: 'Une carte lisible rend possible l’itération par petits pas : c’est l’objet de la brique suivante.' },
        accessibleDescription: 'Quatre étapes mènent de la demande de carte à sa restitution orale, avec deux livrables : la carte et l’emplacement de la modification.',
      }),
    ],
  },
  {
    brickId: 'e3', family: 'e', order: 21, title: 'Cadrage et itération', slides: [
      slide({
        id: 'e3-cycle', role: 'opening',
        claim: 'Cadrer, petite étape, tester, ajuster : on ne demande jamais le projet entier.',
        support: 'Comme en randonnée, on ne vise pas le sommet : on vise le prochain repère visible.',
        visual: { key: 'ipmtr-loop', data: {
          interaction: 'Parcourir le cycle.',
          boundary: 'On demande la prochaine étape vérifiable, jamais le projet entier.',
          context: [
            { surface: 'Cadrer', reveals: 'L’idée en une phrase et le MVP' },
            { surface: 'Petite étape', reveals: 'La prochaine avancée vérifiable' },
            { surface: 'Tester', reveals: 'Un contrôle qui tient en une minute' },
            { surface: 'Ajuster', reveals: 'Corriger ou redécouper avant de continuer' },
          ],
          loopBack: 'Ajuster renvoie à cadrer la petite étape suivante.',
        } },
        links: [wikiLink('e3', 'concept-durable', 'Le cycle de cadrage')],
        speaker: { durationMinutes: 3, notes: 'C’est la méthode qui sépare « j’ai joué avec l’IA » de « j’ai livré un projet ». La boucle outillée de B4 en est la version Claude Code.', transition: 'Le point de départ du cycle est la version la plus petite qui rend service.' },
        accessibleDescription: 'Le cycle cadrer, petite étape, tester, ajuster est détaillé en quatre stades à côté de la boucle de travail, avec retour au cadrage.',
      }),
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
      slide({
        id: 'e3-mission', role: 'mission',
        claim: 'Cadrez le projet de votre restitution finale.',
        support: 'Réussite : chaque étape a un critère observable et le MVP a résisté à « que peut-on encore retirer ? ».',
        visual: { key: 'mission-board', data: {
          interaction: 'Ouvrir la mission E3.',
          mission: [
            'Votre idée en une phrase.',
            'Le MVP : la version à une seule fonctionnalité qui rend déjà service.',
            'Les trois premières étapes testables, avec pour chacune son critère de vérification.',
            'La liste « plus tard » : tout ce que vous avez volontairement écarté.',
            'Soumettez le cadrage à Claude et demandez-lui de le challenger : est-ce vraiment un MVP ? Quelle étape est trop grosse ?',
          ],
          successCriterion: 'Chaque étape a un critère de vérification observable et le MVP a résisté à la question « que peut-on encore retirer ? ».',
          deliverables: ['Plan d’attaque : idée, MVP, trois étapes testables, liste « plus tard »'],
          output: 'Ce document est réutilisé tel quel pour la présentation finale.',
        } },
        links: [wikiLink('e3', 'mission-commune', 'Mission E3 complète'), links.bestPractices],
        speaker: { durationMinutes: 3, notes: 'Deux ou trois volontaires lisent leur MVP ; la salle vote : vraiment minimal ou pas ? Cette méthode vaut pour n’importe quel projet, avec ou sans IA.', transition: 'Ce cadrage devient le fil conducteur des ateliers de pratique et de la présentation finale.' },
        accessibleDescription: 'Cinq étapes construisent le plan d’attaque du projet final : idée, MVP, étapes testables, liste plus tard, puis challenge par Claude.',
      }),
    ],
  },
] satisfies PresentationDeck[];
