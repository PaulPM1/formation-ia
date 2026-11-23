// Les questions courtes de la page /faq : une réponse en deux phrases au plus,
// et le plus souvent une phrase à donner à Claude.

export type Question = {
  question: string;
  reponse: string;
  /** La phrase à copier et à coller dans la conversation Claude. */
  aClaude?: string;
  lien?: { href: string; label: string };
};

export type GroupeQuestions = {
  id: string;
  titre: string;
  /** Nom d'une icône de src/components/briques/EcoIcon.astro. */
  icone: string;
  questions: Question[];
};

/** Garde-fou : une réponse plus longue redevient un cours. */
export const REPONSE_MAX = 200;

export const QUESTIONS: GroupeQuestions[] = [
  {
    id: 'avant',
    titre: 'Avant de venir',
    icone: 'check',
    questions: [
      {
        question: 'Que dois-je faire chez moi avant la session ?',
        reponse:
          'Trois choses : installer l’application Claude, prendre l’abonnement, créer un compte GitHub. Tout le reste se fait sur place, avec les formateurs.',
        lien: { href: '/briques/d2-bis/', label: 'Préparer son ordinateur' },
      },
      {
        question: 'Faut-il savoir coder ?',
        reponse: 'Non. Vous décrivez ce que vous voulez, Claude construit, vous regardez le résultat et vous corrigez.',
        lien: { href: '/briques/b2/', label: 'Claude Code' },
      },
      {
        question: 'Je n’ai pas encore d’idée de projet',
        reponse: 'Venez avec une envie, même floue. Claude vous pose des questions et la transforme en projet.',
        lien: { href: '/briques/e3/', label: 'Lancer son projet' },
      },
      {
        question: 'Mon projet doit-il être fini dimanche ?',
        reponse: 'Non. Vous repartez avec un projet lancé et la méthode pour le continuer chez vous.',
      },
    ],
  },
  {
    id: 'ordinateur',
    titre: 'Mon ordinateur',
    icone: 'laptop',
    questions: [
      {
        question: 'Claude dit qu’un outil est introuvable, juste après l’avoir installé',
        reponse: 'Quittez complètement l’application Claude, rouvrez-la, puis redemandez.',
        aClaude: 'Vérifie de nouveau que tout est installé et montre-moi le tableau.',
      },
      {
        question: 'Mon ordinateur demande un mot de passe ou une autorisation',
        reponse:
          'C’est normal pendant l’installation : il s’agit du mot de passe de votre ordinateur. Lisez la fenêtre, puis acceptez.',
      },
      {
        question: 'C’est un ordinateur du travail, il refuse toute installation',
        reponse: 'N’insistez pas et appelez un formateur : il existe une façon de travailler sans rien installer.',
      },
      {
        question: 'Claude me demande la permission avant d’agir',
        reponse: 'Il vous prévient avant de toucher à votre ordinateur. Lisez sa phrase, puis acceptez.',
        lien: { href: '/briques/b2/', label: 'Claude Code' },
      },
    ],
  },
  {
    id: 'projet',
    titre: 'Mon projet',
    icone: 'rocket',
    questions: [
      {
        question: 'L’aperçu reste vide',
        reponse: 'Le projet n’est pas encore lancé. Demandez-le.',
        aClaude: 'Lance le projet et affiche-le dans l’aperçu.',
      },
      {
        question: 'Je vois un message d’erreur que je ne comprends pas',
        reponse: 'Copiez-le tel quel et donnez-le à Claude. Au deuxième échec, appelez un formateur.',
        aClaude: 'Voici l’erreur que je vois. Répare-la et explique-moi en deux phrases.',
      },
      {
        question: 'Claude a cassé quelque chose qui marchait',
        reponse: 'Chaque sauvegarde est un point de retour. Demandez à y revenir.',
        aClaude: 'Ça marchait avant ta dernière modification. Reviens à la dernière sauvegarde.',
        lien: { href: '/briques/d2/', label: 'Sauvegarder sur GitHub' },
      },
      {
        question: 'Claude tourne en rond ou oublie ce qu’on a dit',
        reponse: 'La conversation est devenue trop longue. Ouvrez-en une nouvelle, puis donnez-lui cette phrase.',
        aClaude: 'On continue mon projet. Relis les fichiers de suivi et dis-moi où on en est.',
        lien: { href: '/briques/e1/', label: 'Demande et contexte' },
      },
      {
        question: 'Mon idée est trop grosse',
        reponse: 'On ne la réduit pas, on l’ordonne : une fonctionnalité à la fois, la plus utile d’abord.',
        aClaude: 'Quelle est la prochaine fonctionnalité de ma liste ? Construis seulement celle-là.',
        lien: { href: '/briques/e3/', label: 'Lancer son projet' },
      },
    ],
  },
  {
    id: 'en-ligne',
    titre: 'Sauvegarder et mettre en ligne',
    icone: 'globe',
    questions: [
      {
        question: 'Comment sauvegarder mon projet ?',
        reponse: 'Demandez-le. La première fois, vous collez un code dans une page GitHub, et c’est tout.',
        aClaude: 'Sauvegarde mon projet sur GitHub.',
        lien: { href: '/briques/d2/', label: 'Sauvegarder sur GitHub' },
      },
      {
        question: 'Tout le monde peut-il voir mon projet sur GitHub ?',
        reponse: 'Non : Claude crée une copie privée, visible de vous seul. Vous pouvez le vérifier.',
        aClaude: 'Mon projet sur GitHub est-il privé ou public ?',
      },
      {
        question: 'Comment montrer mon projet à quelqu’un ?',
        reponse: 'Mettez-le en ligne : il reçoit une adresse que vous pouvez envoyer.',
        aClaude: 'Mets mon projet en ligne.',
        lien: { href: '/faq/mise-en-ligne/', label: 'Les écrans de Vercel, un par un' },
      },
      {
        question: 'Ai-je besoin d’une clé API ?',
        reponse:
          'Seulement si votre projet doit lui-même interroger Claude ou un autre service. Pour un site qui affiche des pages, non.',
        lien: { href: '/faq/cle-api/', label: 'Donner une clé à votre projet' },
      },
      {
        question: 'Où coller ma clé API ?',
        reponse: 'Jamais dans la conversation. Claude prépare un fichier à l’abri, et vous y collez la clé vous-même.',
        lien: { href: '/briques/d4/', label: 'Sécurité : quatre règles' },
      },
    ],
  },
  {
    id: 'apres',
    titre: 'Après le week-end',
    icone: 'back',
    questions: [
      {
        question: 'Comment reprendre mon projet chez moi ?',
        reponse: 'Ouvrez l’application Claude, onglet Code, et le même dossier. Puis donnez cette phrase.',
        aClaude: 'On continue mon projet. Où en est-on, et quelle est la prochaine étape ?',
      },
      {
        question: 'J’ai atteint la limite d’utilisation',
        reponse: 'Elle se recharge d’elle-même. Faites une pause, puis reprenez dans la même conversation.',
        lien: { href: '/briques/a3/', label: 'Abonnement, clé API et choix du modèle' },
      },
      {
        question: 'Je change d’ordinateur, ou un outil a disparu',
        reponse: 'Redonnez à Claude la phrase de préparation : elle n’installe que ce qui manque.',
        lien: { href: '/briques/d2-bis/', label: 'Préparer son ordinateur' },
      },
    ],
  },
];
