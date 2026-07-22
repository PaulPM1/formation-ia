import { externalLink, kitLink, wikiLink, WIKI_BASE_URL } from '../presentation-links';
import type { PresentationDeck, PresentationSlide } from '../presentation-model';

const slide = (value: PresentationSlide) => value;

const links = {
  claude: externalLink('official', 'Ouvrir Claude', 'https://claude.ai/'),
  artifacts: externalLink(
    'official',
    'Prérequis officiels des Artifacts',
    'https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them',
  ),
  cowork: externalLink(
    'official',
    'Bien démarrer avec Claude Cowork',
    'https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork',
  ),
  vscode: externalLink(
    'official',
    'Claude Code dans VS Code',
    'https://code.claude.com/docs/en/vs-code',
  ),
  kit: kitLink('bloc-b-assistant.zip', 'Télécharger le kit Bloc B'),
  recovery: externalLink(
    'digression',
    'Ouvrir le rattrapage poste',
    `${WIKI_BASE_URL}/presenter/b4-bis/b4bis-install/`,
  ),
};

export const B_DECKS: PresentationDeck[] = [
  {
    brickId: 'b0', family: 'b', order: 5, title: 'Préflight', slides: [
      slide({
        id: 'b0-layers', role: 'opening',
        claim: 'Une même inbox traverse quatre outils, avec une preuve différente à chaque étape.',
        support: 'Chat synthétise, Artifact rend manipulable, Cowork agit sur les fichiers et Claude Code modifie la page.',
        visual: { key: 'setup-diagnostic', data: {
          interaction: 'Suivre la mission continue.',
          layers: [
            { name: 'Chat', check: 'Brief sourcé', fallback: 'Correction en six lignes' },
            { name: 'Artifact', check: 'Tri testé', fallback: 'Artifact formateur préparé' },
            { name: 'Cowork', check: 'Sortie vérifiée', fallback: 'Sortie témoin à contrôler' },
            { name: 'Claude Code', check: 'Test et diff', fallback: 'Démonstration facultative' },
          ],
        } },
        links: [links.kit, links.recovery, wikiLink('b0', 'concept-durable', 'Comprendre le préflight')],
        speaker: {
          durationMinutes: 2,
          notes: 'Afficher kits/bloc-b-assistant/README.md. Annoncer 55 minutes de socle, 5 minutes de marge et 20 minutes facultatives. L’installation complète reste hors chrono.',
          transition: 'Vérifions maintenant que chaque capacité répond avant de lancer le chrono.',
        },
        accessibleDescription: 'Quatre étapes alignées relient la même inbox à quatre preuves distinctes : brief, tri, sortie vérifiée puis test et diff.',
      }),
      slide({
        id: 'b0-test', role: 'checkpoint',
        claim: 'Le chrono démarre seulement lorsque Chat, Artifact, Cowork et le kit répondent.',
        support: 'Un poste presque prêt utilise le rattrapage de dix minutes ; une installation complète reste hors séance.',
        visual: { key: 'setup-diagnostic', data: {
          interaction: 'Exécuter le préflight.',
          prompt: 'Réponds uniquement par « Atelier prêt » puis donne la date du jour.',
          steps: [
            'Ouvrir Chat et obtenir « Atelier prêt »',
            'Vérifier que la création d’Artifacts est activée',
            'Vérifier Claude Desktop connecté et Cowork visible',
            'Décompresser le kit et ouvrir son README',
          ],
          expected: '4 contrôles sur 4, sinon rattrapage ou repli préparé',
          evidence: 'Chat répond, Artifact et Cowork sont visibles, le dossier du kit est lisible.',
          caution: 'Ne jamais utiliser de donnée réelle ou sensible pendant la mission.',
        } },
        links: [links.claude, links.artifacts, links.cowork, links.kit, links.recovery],
        speaker: {
          durationMinutes: 3,
          notes: 'Couper à 05:00. Ouvrir README.md. Repli : distribuer le kit déjà décompressé et orienter les postes presque prêts vers B4-bis ; toute installation longue sort du chrono.',
          transition: 'Tout le monde part maintenant des six mêmes notes fictives.',
        },
        accessibleDescription: 'Une checklist de quatre contrôles exige une réponse Chat, Artifacts activé, Cowork connecté et le kit ouvert avant le départ.',
      }),
    ],
  },
  {
    brickId: 'b1', family: 'b', order: 6, title: 'Claude Chat', slides: [
      slide({
        id: 'b1-vague', role: 'opening',
        claim: '« Organise mes notes » oblige Claude à inventer le résultat.',
        support: 'Le conflit du 18 et du 19 septembre révèle immédiatement ce que le prompt ne précise pas.',
        visual: { key: 'prompt-builder', data: {
          interaction: 'Rendre les hypothèses visibles.',
          before: 'Organise mes notes.',
          assumptions: ['Quel résultat ?', 'Quelles sources ?', 'Que faire du conflit ?', 'Sous quelle forme ?'],
          after: 'Produis un brief en trois sections, cite la source de chaque action et conserve le conflit sous « À confirmer ».',
        } },
        links: [links.kit, wikiLink('b1', 'concept-durable', 'Structurer le brief')],
        speaker: {
          durationMinutes: 2,
          notes: 'Montrer les deux dates contradictoires dans inbox/02-reunion.md et inbox/03-messages.md. Ne pas demander encore de résoudre le cas.',
          transition: 'Quatre blocs rendent la sortie attendue testable.',
        },
        accessibleDescription: 'Une demande vague est reliée à quatre ambiguïtés, puis à un brief qui impose sections, sources et conflit non résolu.',
      }),
      slide({
        id: 'b1-four-blocks', role: 'explanation',
        claim: 'Objectif, contexte, contraintes et forme rendent le brief testable.',
        support: 'Chaque bloc correspond à un critère que l’on peut relire sans interprétation.',
        visual: { key: 'prompt-builder', data: {
          interaction: 'Assembler les quatre blocs.',
          blocks: [
            { name: 'Objectif', question: 'Préparer le brief opérationnel du jour' },
            { name: 'Contexte', question: 'Six notes fictives réparties dans trois fichiers' },
            { name: 'Contraintes', question: 'Une source par action ; conflit laissé à confirmer' },
            { name: 'Forme', question: 'Actions du jour, À confirmer, Plus tard' },
          ],
        } },
        links: [wikiLink('b1', 'pratique-avec-claude', 'Voir les quatre blocs')],
        speaker: {
          durationMinutes: 2,
          notes: 'Faire lire les quatre blocs à voix haute. La source et l’incertitude sont des contraintes, pas des finitions.',
          transition: 'Les participants peuvent maintenant exécuter le prompt complet.',
        },
        accessibleDescription: 'Quatre blocs nommés définissent le résultat, les six notes, les garanties de traçabilité et les trois sections attendues.',
      }),
      slide({
        id: 'b1-mission', role: 'mission',
        claim: 'Transformez six notes en brief sourcé sans résoudre le conflit.',
        support: 'La preuve tient dans trois sections, une source par action et la mention « À confirmer ».',
        visual: { key: 'prompt-builder', data: {
          interaction: 'Exécuter le prompt prêt à copier.',
          promptPath: 'prompts/01-chat.md',
          objective: 'Créer le brief du jour à partir des six notes',
          context: 'Lire les trois fichiers de inbox/ ; toutes les données sont fictives',
          constraints: ['Citer [source: fichier] après chaque action', 'Ne pas trancher les dates contradictoires', 'Ne rien ajouter'],
          form: 'Trois sections : Actions du jour, À confirmer, Plus tard',
          sections: ['Actions du jour', 'À confirmer', 'Plus tard'],
          sourceRule: 'Une source par action',
          uncertaintyRule: 'L’échéance contradictoire reste « À confirmer »',
          preview: ['3 sections', '6 notes', 'Sources visibles', 'Conflit conservé', 'Zéro invention'],
        } },
        links: [links.kit, wikiLink('b1', 'mission-commune', 'Consigne Chat')],
        speaker: {
          durationMinutes: 6,
          notes: 'Couper à 08:00 dans B1. Ouvrir prompts/01-chat.md. Repli : afficher corriges/brief-chat-6-lignes.md et faire auditer ses sources et son incertitude.',
          transition: 'La première sortie n’est acceptée qu’après une correction ciblée.',
        },
        accessibleDescription: 'Le prompt complet assemble objectif, contexte, contraintes et forme, avec cinq critères visibles pour auditer le brief obtenu.',
      }),
      slide({
        id: 'b1-loop', role: 'checkpoint',
        claim: 'Une correction ciblée réduit la sortie à six lignes sans perdre les garanties.',
        support: 'On corrige la longueur, jamais les sources ni l’incertitude utile.',
        visual: { key: 'prompt-builder', data: {
          interaction: 'Comparer avant et après correction.',
          loop: ['Prompt', 'Réponse', 'Audit', 'Correction', 'Preuve'],
          exampleGap: 'Le brief dépasse six lignes ou une action perd sa source.',
          correction: 'Réduis à exactement six lignes en conservant les trois sections, chaque source et « À confirmer ».',
          proof: '6 lignes ; 3 sections ; chaque action sourcée ; conflit non tranché',
        } },
        links: [wikiLink('b1', 'critères-de-réussite', 'Critères de réussite Chat')],
        speaker: {
          durationMinutes: 2,
          notes: 'Couper B1 à 12:00. Faire compter les lignes puis pointer une source et le conflit. Repli : utiliser la correction standard du kit formateur.',
          transition: 'Le brief devient maintenant un objet manipulable.',
        },
        accessibleDescription: 'Une boucle relie prompt, réponse, audit, correction et preuve finale : six lignes, trois sections, sources et conflit conservés.',
      }),
    ],
  },
  {
    brickId: 'b2', family: 'b', order: 7, title: 'Artifacts', slides: [
      slide({
        id: 'b2-object', role: 'opening',
        claim: 'L’Artifact transforme le brief en objet que l’on peut réellement tester.',
        support: 'Le même contenu gagne des états, des compteurs et une remise à zéro.',
        visual: { key: 'artifact-test-loop', data: {
          interaction: 'Observer la transformation.',
          before: { location: 'Conversation', output: 'Brief en six lignes' },
          after: { location: 'Artifact', output: 'Boîte de tri interactive' },
          affordances: ['Déplacer une note', 'Compter chaque état', 'Réinitialiser', 'Retester'],
        } },
        links: [links.artifacts, links.kit, wikiLink('b2', 'concept-durable', 'Du brief à l’objet')],
        speaker: {
          durationMinutes: 2,
          notes: 'Montrer que le contenu reste identique : seule la capacité d’agir et de tester change.',
          transition: 'Réduisons l’objet à la plus petite simulation utile.',
        },
        accessibleDescription: 'Le brief en conversation se transforme en boîte de tri avec quatre actions observables : déplacer, compter, remettre à zéro et retester.',
      }),
      slide({
        id: 'b2-mvp', role: 'explanation',
        claim: 'Une boîte de tri à trois états suffit pour tester l’idée.',
        support: 'Aujourd’hui, Plus tard et Archiver rendent chaque décision visible.',
        visual: { key: 'artifact-test-loop', data: {
          interaction: 'Réduire le périmètre.',
          idea: 'Un assistant complet de gestion de projet',
          removed: ['Connexion', 'Notifications', 'Multi-utilisateur', 'Historique avancé'],
          retained: 'Six notes dans trois colonnes',
          primaryAction: 'Changer l’état d’une note et observer les compteurs.',
        } },
        links: [wikiLink('b2', 'pratique-avec-claude', 'Définir le MVP')],
        speaker: {
          durationMinutes: 3,
          notes: 'Insister sur la seule relation utile : une note change d’état, donc un compteur change.',
          transition: 'Le prompt prêt à copier construit exactement ce MVP.',
        },
        accessibleDescription: 'Un entonnoir retire quatre fonctions et conserve six notes, trois états et une action principale liée aux compteurs.',
      }),
      slide({
        id: 'b2-mission', role: 'mission',
        claim: 'Construisez puis testez le tri sur les six notes.',
        support: 'Le résultat passe seulement si les trois états, les compteurs et la remise à zéro fonctionnent.',
        visual: { key: 'artifact-test-loop', data: {
          interaction: 'Exécuter les quatre tests.',
          promptPath: 'prompts/02-artifact.md',
          objectTitle: 'Boîte de tri à six notes',
          categories: ['Aujourd’hui', 'Plus tard', 'Archiver'],
          requiredControls: ['Compteurs', 'Remise à zéro'],
          state: 'Six notes chargées dans Aujourd’hui',
          tests: [
            { name: 'Tri', action: 'Déplacer une note vers Plus tard', expected: 'Les deux colonnes et compteurs changent' },
            { name: 'Archive', action: 'Archiver une note', expected: 'La note rejoint Archiver' },
            { name: 'Compteurs', action: 'Faire deux déplacements', expected: 'Le total reste égal à six' },
            { name: 'Reset', action: 'Cliquer Remise à zéro', expected: 'Les six notes reviennent dans Aujourd’hui' },
          ],
        } },
        links: [links.kit, wikiLink('b2', 'mission-commune', 'Consigne Artifact')],
        speaker: {
          durationMinutes: 10,
          notes: 'Couper à 15:00 dans B2. Ouvrir prompts/02-artifact.md. Repli : ouvrir l’Artifact formateur préparé et faire exécuter les quatre tests, sans attendre une génération.',
          transition: 'Un test révèle volontairement un risque : l’archivage est immédiat.',
        },
        accessibleDescription: 'Une boucle de test relie la boîte de six notes à quatre preuves : tri, archivage, total constant et remise à zéro.',
      }),
      slide({
        id: 'b2-correction', role: 'checkpoint',
        claim: 'La confirmation d’archivage se corrige sans casser le tri.',
        support: 'Après la correction, les quatre tests sont rejoués depuis zéro.',
        visual: { key: 'artifact-test-loop', data: {
          interaction: 'Comparer les deux itérations.',
          iteration1: { passing: ['Tri', 'Compteurs', 'Reset'], failing: ['Archivage sans confirmation'] },
          targetedChange: 'Demander confirmation avant de déplacer vers Archiver',
          evidence: 'Rejouer Tri, Archive, Compteurs et Reset',
          iteration2: { passing: ['Tri', 'Confirmation', 'Compteurs', 'Reset'], failing: [] },
        } },
        links: [wikiLink('b2', 'critères-de-réussite', 'Critères de réussite Artifact')],
        speaker: {
          durationMinutes: 3,
          notes: 'Couper B2 à 18:00. Faire rejouer tous les tests, pas seulement celui corrigé. Repli : montrer les deux captures avant et après du kit formateur.',
          transition: 'Le même dossier passe maintenant à un outil capable d’agir sur les fichiers.',
        },
        accessibleDescription: 'Deux itérations montrent trois tests passants, un archivage sans confirmation, une correction ciblée puis quatre tests passants.',
      }),
    ],
  },
  {
    brickId: 'b3', family: 'b', order: 8, title: 'Cowork', slides: [
      slide({
        id: 'b3-delegation', role: 'opening',
        claim: 'Cowork agit sur les fichiers ; vous gardez le périmètre et la décision.',
        support: 'L’inbox reste en lecture seule, la sortie reçoit un seul livrable et le plan attend une approbation.',
        visual: { key: 'pacte-workspace', data: {
          interaction: 'Séparer les responsabilités.',
          workspace: {
            sources: ['inbox/01-demandes.md', 'inbox/02-reunion.md', 'inbox/03-messages.md'],
            plan: ['Lire', 'Proposer', 'Attendre l’accord'],
            output: ['sortie/brief-du-jour.md'],
          },
          humanResponsibilities: ['Définir le périmètre', 'Approuver le plan', 'Contrôler la preuve'],
          agentResponsibilities: ['Lire les six notes', 'Créer le brief', 'Signaler le conflit'],
        } },
        links: [links.cowork, links.kit, wikiLink('b3', 'concept-durable', 'Déléguer sous contrôle')],
        speaker: {
          durationMinutes: 3,
          notes: 'Montrer physiquement inbox/ et sortie/. Les originaux sont une frontière, pas une simple consigne de style.',
          transition: 'P.A.C.T.E. convertit cette frontière en contrat observable.',
        },
        accessibleDescription: 'Une carte sépare les trois fichiers sources, le plan approuvé, la limite de permissions, le fichier de sortie et les originaux inchangés.',
      }),
      slide({
        id: 'b3-pacte', role: 'explanation',
        claim: 'P.A.C.T.E. transforme une délégation en contrat observable.',
        support: 'Périmètre, Action, Contraintes, Terminaison et Exécution couvrent la mission de bout en bout.',
        visual: { key: 'pacte-workspace', data: {
          interaction: 'Lire le contrat de gauche à droite.',
          pacte: [
            { letter: 'P', name: 'Périmètre', prompt: 'Lire uniquement inbox/ ; écrire uniquement dans sortie/' },
            { letter: 'A', name: 'Action', prompt: 'Créer sortie/brief-du-jour.md à partir des six notes' },
            { letter: 'C', name: 'Contraintes', prompt: 'Ne modifier ni supprimer aucun original ; ne pas trancher le conflit' },
            { letter: 'T', name: 'Terminaison', prompt: 'Le vérificateur passe et les empreintes sont identiques' },
            { letter: 'E', name: 'Exécution', prompt: 'Présenter le plan puis attendre mon approbation avant d’écrire' },
          ],
        } },
        links: [wikiLink('b3', 'pratique-avec-claude', 'Écrire le P.A.C.T.E.')],
        speaker: {
          durationMinutes: 4,
          notes: 'Faire repérer la condition d’arrêt et le moment d’approbation. Sans ces deux points, la délégation reste ambiguë.',
          transition: 'Le prompt complet applique ce contrat au dossier du kit.',
        },
        accessibleDescription: 'Cinq étapes P.A.C.T.E. bornent les dossiers, le fichier à créer, les interdits, la preuve de fin et l’approbation préalable.',
      }),
      slide({
        id: 'b3-mission', role: 'mission',
        claim: 'Faites produire un brief du jour sans toucher à l’inbox.',
        support: 'Le plan est approuvé avant l’écriture ; le conflit et les sources restent visibles.',
        visual: { key: 'pacte-workspace', data: {
          interaction: 'Suivre les cinq événements.',
          promptPath: 'prompts/03-cowork.md',
          readScope: 'inbox/',
          writeScope: 'sortie/',
          planApproval: true,
          keepOriginals: true,
          conflictRule: 'Conserver le conflit sous « À confirmer »',
          timeline: [
            { event: 'Lecture', state: 'Trois fichiers, six notes' },
            { event: 'Plan', state: 'Présenté, aucune écriture' },
            { event: 'Approbation', state: 'Accord humain explicite' },
            { event: 'Écriture', state: 'sortie/brief-du-jour.md uniquement' },
            { event: 'Rapport', state: 'Sources, conflit et contrôles annoncés' },
          ],
          controls: ['Plan approuvé', 'Originaux inchangés', 'Un seul fichier créé'],
        } },
        links: [links.kit, wikiLink('b3', 'mission-commune', 'Consigne Cowork')],
        speaker: {
          durationMinutes: 8,
          notes: 'Couper à 15:00 dans B3. Ouvrir prompts/03-cowork.md. Repli : copier le brief témoin dans sortie/ puis consacrer le temps restant au vérificateur et aux empreintes.',
          transition: 'Le résumé de Cowork ne suffit pas : une preuve indépendante tranche.',
        },
        accessibleDescription: 'Une chronologie montre lecture, plan sans écriture, approbation humaine, création d’un seul fichier puis rapport de contrôle.',
      }),
      slide({
        id: 'b3-check', role: 'checkpoint',
        claim: 'Le résultat n’est fini que si la sortie est traçable et les originaux intacts.',
        support: 'Le vérificateur contrôle fichier, sources, incertitude et empreintes indépendamment du résumé de Cowork.',
        visual: { key: 'pacte-workspace', data: {
          interaction: 'Comparer rapport et preuves.',
          reported: ['Brief créé', 'Six notes traitées', 'Originaux inchangés'],
          independentChecks: [
            { check: 'Sortie', evidence: 'Le brief est l’unique livrable dans sortie/' },
            { check: 'Sources', evidence: 'Chaque note cite sa source sur la même action' },
            { check: 'Incertitude', evidence: '« À confirmer » conserve le conflit' },
            { check: 'Empreintes', evidence: 'Les SHA-256 de inbox/ sont identiques' },
          ],
          command: 'node verify-cowork.mjs',
          expected: '4 contrôles réussis',
        } },
        links: [links.kit, wikiLink('b3', 'critères-de-réussite', 'Critères de réussite Cowork')],
        speaker: {
          durationMinutes: 5,
          notes: 'Couper B3 à 20:00. Lancer node verify-cowork.mjs. Repli : utiliser les cas positif et négatif préparés pour montrer un échec sur source, conflit ou empreinte.',
          transition: 'Le socle est terminé en 55 minutes ; garder 5 minutes de marge avant C1 ou ouvrir B4 si le groupe est prêt.',
        },
        accessibleDescription: 'Quatre contrôles indépendants vérifient la sortie unique, les six associations note-source, le conflit à confirmer et les empreintes des originaux.',
      }),
    ],
  },
  {
    brickId: 'b4', family: 'b', order: 9, title: 'Claude Code', track: 'optional', slides: [
      slide({
        id: 'b4-context', role: 'opening',
        claim: 'Claude Code relie la demande aux fichiers, commandes et diff du projet.',
        support: 'La mini-page fonctionne déjà ; elle omet seulement la source sous chaque carte.',
        visual: { key: 'ipmtr-loop', data: {
          interaction: 'Localiser le contexte utile.',
          boundary: 'kits/bloc-b-assistant/code/ ; aucun autre fichier à modifier',
          context: [
            { surface: 'brief.mjs', reveals: 'Les six cartes et leurs sources' },
            { surface: 'app.mjs', reveals: 'Le tri existant à préserver' },
            { surface: 'brief.test.mjs', reveals: 'Le test incomplet à compléter' },
            { surface: 'VS Code', reveals: 'Le diff à accepter ou refuser' },
          ],
        } },
        links: [links.vscode, links.kit, wikiLink('b4', 'concept-durable', 'Contexte du projet')],
        speaker: {
          durationMinutes: 2,
          notes: 'Ouvrir code/README.md puis montrer la page avant toute demande. Le tri doit déjà fonctionner.',
          transition: 'Une boucle courte borne le seul changement autorisé.',
        },
        accessibleDescription: 'Quatre surfaces relient les données, le tri existant, le test à compléter et le diff de VS Code dans un périmètre unique.',
      }),
      slide({
        id: 'b4-ipmtr', role: 'explanation',
        claim: 'Inspecter, planifier, modifier, tester et relire borne le changement.',
        support: 'Trois portes empêchent d’avancer sans permission comprise, test exécuté et diff relu.',
        visual: { key: 'ipmtr-loop', data: {
          interaction: 'Parcourir I.P.M.T.R.',
          steps: [
            { letter: 'I', name: 'Inspecter', evidence: 'Identifier les fichiers et le tri actuel' },
            { letter: 'P', name: 'Planifier', evidence: 'Trois étapes maximum, puis accord' },
            { letter: 'M', name: 'Modifier', evidence: 'Ajouter uniquement la source' },
            { letter: 'T', name: 'Tester', evidence: 'node --test passe' },
            { letter: 'R', name: 'Relire', evidence: 'Diff inline accepté dans VS Code' },
          ],
          loopBack: 'Un tri cassé, un test rouge ou un diff trop large renvoie à Inspecter.',
        } },
        links: [links.vscode, wikiLink('b4', 'pratique-avec-claude', 'Appliquer I.P.M.T.R.')],
        speaker: {
          durationMinutes: 4,
          notes: 'Faire franchir les trois portes dans l’ordre. Le plan et le diff sont des moments de décision humaine.',
          transition: 'Le prompt facultatif peut maintenant être exécuté sur la mini-page.',
        },
        accessibleDescription: 'Une boucle de cinq étapes comporte trois portes explicites : permission avant modification, test avant preuve et diff avant acceptation.',
      }),
      slide({
        id: 'b4-mission', role: 'mission',
        claim: 'Ajoutez les sources aux cartes sans modifier le tri.',
        support: 'Le plan tient en trois étapes, le test est complété et le diff reste limité.',
        visual: { key: 'ipmtr-loop', data: {
          interaction: 'Choisir l’action bornée.',
          promptPath: 'prompts/04-claude-code.md',
          onlyChange: 'Ajouter la source sous chaque carte',
          preserveSort: true,
          testCommand: 'node --test',
          reviewSurface: 'Diff VS Code',
          command: 'node --test',
          questions: ['Quels fichiers seront lus ?', 'Le plan tient-il en trois étapes ?', 'Le tri existant reste-t-il inchangé ?', 'Quel test prouve la source ?'],
          choices: [
            { action: 'Approuver le plan limité', when: 'Seulement si la source est l’unique changement' },
            { action: 'Demander une réduction', when: 'Si le plan refactorise ou redessine la page' },
            { action: 'Refuser', when: 'Si le périmètre sort de code/' },
          ],
        } },
        links: [links.kit, links.vscode, wikiLink('b4', 'mission-commune', 'Consigne Claude Code')],
        speaker: {
          durationMinutes: 10,
          notes: 'Couper à 16:00 dans B4. Ouvrir prompts/04-claude-code.md. Repli : appliquer le patch formateur préparé, puis garder le test et la revue du diff en direct.',
          transition: 'La modification n’est terminée qu’après les trois preuves.',
        },
        accessibleDescription: 'Quatre questions et trois décisions bornent une mission qui ajoute seulement la source, préserve le tri, exécute le test et ouvre le diff.',
      }),
      slide({
        id: 'b4-test', role: 'checkpoint',
        claim: 'La page, le test et le diff prouvent le changement.',
        support: 'Une source visible ne suffit pas si le tri casse ou si le diff dépasse la demande.',
        visual: { key: 'ipmtr-loop', data: {
          interaction: 'Prendre une décision après preuve.',
          summary: 'Claude annonce « terminé » ; vérifiez les trois surfaces avant d’accepter.',
          proofs: [
            { source: 'Page', result: 'Chaque carte affiche son fichier source' },
            { source: 'Test', result: 'node --test passe et protège le tri' },
            { source: 'Diff VS Code', result: 'Aucun changement hors source et test' },
          ],
          decision: ['Accepter', 'Demander une correction', 'Revenir au plan'],
        } },
        links: [links.vscode, wikiLink('b4', 'critères-de-réussite', 'Critères de réussite Claude Code')],
        speaker: {
          durationMinutes: 4,
          notes: 'Couper B4 à 20:00. Faire relire le diff inline avant toute acceptation. Repli : comparer le diff témoin et un diff volontairement trop large.',
          transition: 'Rejoindre C1 ; B4-bis reste une piste de rattrapage isolée.',
        },
        accessibleDescription: 'Trois preuves indépendantes montrent la source sur la page, le test passant et un diff limité, puis proposent trois décisions humaines.',
      }),
    ],
  },
  {
    brickId: 'b4-bis', family: 'b', order: 10, title: 'Rattrapage VS Code', track: 'recovery', slides: [
      slide({
        id: 'b4bis-install', role: 'opening',
        claim: 'Le rattrapage ne corrige que le maillon qui manque.',
        support: 'Une installation complète n’entre jamais dans ces dix minutes.',
        visual: { key: 'workspace-triptych', data: {
          interaction: 'Identifier le maillon manquant.',
          sharedContext: 'kits/bloc-b-assistant/code/',
          panes: [
            { name: 'Dossier', role: 'Le kit est décompressé et ouvert' },
            { name: 'Terminal', role: 'Node répond dans ce dossier' },
            { name: 'Extension', role: 'Claude Code s’ouvre dans VS Code' },
          ],
        } },
        links: [links.kit, links.vscode, wikiLink('b4-bis', 'diagnostic-initial', 'Diagnostic de rattrapage')],
        speaker: {
          durationMinutes: 3,
          notes: 'Couper à 03:00. Diagnostiquer dossier, terminal ou extension. Repli : placer le participant en observation de B4 ; ne lancer aucune installation longue.',
          transition: 'Les trois vues doivent maintenant désigner le même dossier.',
        },
        accessibleDescription: 'Trois panneaux distinguent le dossier du kit, Node dans le terminal et l’extension Claude Code afin de ne corriger que le maillon absent.',
      }),
      slide({
        id: 'b4bis-workspace', role: 'demonstration',
        claim: 'Explorateur, fichier et terminal doivent pointer vers le même kit.',
        support: 'Le chemin partagé évite de tester un dossier pendant que l’on en modifie un autre.',
        visual: { key: 'workspace-triptych', data: {
          interaction: 'Basculer entre macOS et Windows.',
          folder: 'kits/bloc-b-assistant/code',
          contents: ['README.md', 'brief.mjs', 'app.mjs', 'brief.test.mjs'],
          command: {
            mac: 'cd kits/bloc-b-assistant/code && code .',
            windows: 'cd kits\\bloc-b-assistant\\code; code .',
          },
          trustRule: 'N’accepter Workspace Trust que pour ce kit fictif et connu.',
        } },
        links: [links.vscode, wikiLink('b4-bis', 'pratique-avec-claude', 'Ouvrir le workspace')],
        speaker: {
          durationMinutes: 4,
          notes: 'Couper à 07:00. Faire pointer l’Explorateur, l’onglet et le terminal sur code/. Repli : utiliser Fichier > Ouvrir le dossier et le terminal intégré.',
          transition: 'Un test partagé et l’ouverture de Claude Code valident le poste.',
        },
        accessibleDescription: 'Un triptyque relie le dossier code dans l’Explorateur, un fichier du kit dans l’Éditeur et la même localisation dans le Terminal.',
      }),
      slide({
        id: 'b4bis-checkpoint', role: 'checkpoint',
        claim: 'Le poste est prêt lorsque le test passe dans le bon dossier et Claude Code s’ouvre.',
        support: 'Dossier, terminal et extension concordent ; la piste de rattrapage s’arrête ici.',
        visual: { key: 'workspace-triptych', data: {
          interaction: 'Vérifier le chemin et la commande.',
          explorerPath: 'kits/bloc-b-assistant/code',
          sharedContext: 'kits/bloc-b-assistant/code',
          commands: [
            { shell: 'macOS / Git Bash', command: 'pwd && node --test', expectedSuffix: '/kits/bloc-b-assistant/code · tests passants' },
            { shell: 'Windows PowerShell', command: 'Get-Location; node --test', expectedSuffix: '\\kits\\bloc-b-assistant\\code · tests passants' },
          ],
          mismatchAction: 'Rouvrir le terminal depuis le dossier code, puis relancer node --test.',
        } },
        links: [links.vscode, links.kit, wikiLink('b4-bis', 'test-final', 'Checkpoint de rattrapage')],
        speaker: {
          durationMinutes: 3,
          notes: 'Couper B4-bis à 10:00. Exiger node --test puis l’ouverture du panneau Claude Code. Repli : observer B4 sur le poste voisin ; terminer l’installation hors chrono.',
          transition: 'Fermer cette piste isolée et revenir au sommaire ou à la séquence principale.',
        },
        accessibleDescription: 'Deux commandes, pour macOS ou Windows, vérifient le chemin du dossier code et un test passant avant l’ouverture de Claude Code.',
      }),
    ],
  },
];
