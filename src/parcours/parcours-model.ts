export const LIEUX = ['machine', 'vscode', 'navigateur'] as const;
export type Lieu = (typeof LIEUX)[number];

export const VISUEL_KEYS = ['capture', 'claude', 'arborescence', 'trois-lieux'] as const;
export type VisuelKey = (typeof VISUEL_KEYS)[number];

/** Longueur maximale d'un `pourquoi` : garde-fou contre le retour du registre scolaire. */
export const POURQUOI_MAX = 160;
/** Longueur maximale de la ligne d'un outil sur la carte d'accueil. */
export const ROLE_MAX = 100;
/** Six mois : au-delà, une capture d'écran est réputée suspecte. */
export const CAPTURE_PEREMPTION_JOURS = 183;

/**
 * Mots que le participant ne doit jamais lire : il n'est pas développeur.
 * Comparés avec des frontières de mot, donc « clic » ne déclenche pas « cli ».
 */
export const VOCABULAIRE_INTERDIT = [
  'terminal',
  'ligne de commande',
  'shell',
  'cli',
  'git status',
  'git log',
  'npm run',
] as const;

export const KEBAB_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type Geste = {
  /** Un impératif, une seule action. */
  action: string;
  /** Le repère stable dans l'interface, jamais la position du bouton. */
  ancre?: string;
};

export type Panne = {
  id: string;
  /** Si vrai, la panne remonte dans la grille « Ça coince ? » de l'accueil. */
  frequente: boolean;
  /** Ce que le lecteur voit, au mot près si c'est un message affiché. */
  symptome: string;
  cause: string;
  reparation: Geste[];
  preuve: string;
};

export type Fichier = {
  chemin: string;
  /** Du contenu réel, copiable. Jamais une description de contenu. */
  contenu: string;
  commentaire?: string;
};

export type Repere = {
  label: string;
  position: 'haut' | 'bas' | 'gauche' | 'droite' | 'centre';
};

export type Visuel =
  /**
   * Le texte collé n'est pas répété ici : il vit dans `Etape.aClaude`, seul
   * champ rendu à l'écran et seul champ contrôlé par le validateur. La figure
   * ne montre que la réponse attendue.
   */
  | { key: 'claude'; reponse: string[] }
  | { key: 'arborescence'; avant: string[]; apres: string[]; ignores?: string[] }
  | { key: 'trois-lieux'; accent: 'projet' | 'ligne' | 'cle' }
  | {
      key: 'capture';
      /** Chemin sous `public/`, sans barre oblique initiale. */
      fichier: string;
      alt: string;
      service: string;
      /** Date de dernière vérification humaine, au format AAAA-MM-JJ. */
      verifieLe: string;
      reperes: Repere[];
    };

export type Etape = {
  id: string;
  titre: string;
  lieu: Lieu;
  /** Obligatoire quand `lieu` vaut `navigateur` : alimente le bandeau. */
  service?: string;
  /** Une ligne, repliée par défaut. Jamais un paragraphe. */
  pourquoi?: string;
  gestes: Geste[];
  /** Le bloc à copier et coller dans la conversation Claude. */
  aClaude?: string;
  fichiers?: Fichier[];
  /** Signalé avant le geste, pour ce qui est irréversible. */
  danger?: string;
  preuve: { visible: string; sinon: string };
  visuel: Visuel;
  pannes: Panne[];
};

export type Guide = {
  id: string;
  titre: string;
  /** Une phrase, affichée sur la carte de l'accueil. */
  promesse: string;
  /** Filtre d'entrée : dit tout de suite à qui le guide ne s'adresse pas. */
  pourQui?: string;
  prerequis: string[];
  etapes: Etape[];
};

export type Outil = {
  nom: string;
  /** Chemin sous `public/`, sans barre oblique initiale. */
  logo: string;
  role: string;
};
