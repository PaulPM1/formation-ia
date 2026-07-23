export type BriefContractExpectation = {
  structure: boolean;
  sources: boolean;
  uncertainty: boolean;
};

export type BriefContractCase = {
  name: string;
  markdown: string;
  expected: BriefContractExpectation;
};

export const canonicalBrief = `# Brief du jour
## Actions du jour
- [N01] Envoyer l’agenda. [source: demandes.md]
- [N06] Transmettre le nombre. [source: messages.md]
## À confirmer
- [N03, N05] Confirmer le 18 ou le 19 septembre. [sources: reunion.md ; messages.md]
## Plus tard
- [N02] Préparer les icônes. [source: demandes.md]
- [N04] Archiver après validation. [source: reunion.md]
`;

const pass = {
  structure: true,
  sources: true,
  uncertainty: true,
} as const;

export const briefContractCases: BriefContractCase[] = [
  {
    name: 'canonique simple avec point-virgule',
    markdown: canonicalBrief,
    expected: pass,
  },
  {
    name: 'sources séparées par une virgule',
    markdown: canonicalBrief.replace(
      '[sources: reunion.md ; messages.md]',
      '[sources: reunion.md, messages.md]',
    ),
    expected: pass,
  },
  {
    name: 'sources réparties dans plusieurs blocs',
    markdown: canonicalBrief.replace(
      '[sources: reunion.md ; messages.md]',
      '[source: reunion.md] [source: messages.md]',
    ),
    expected: pass,
  },
  {
    name: 'ancien chemin inbox',
    markdown: canonicalBrief.replace(
      '[source: demandes.md]',
      '[source: inbox/01-demandes.md]',
    ),
    expected: { ...pass, sources: false },
  },
  {
    name: 'suffixe de sauvegarde',
    markdown: canonicalBrief.replace(
      '[source: demandes.md]',
      '[source: demandes.md.bak]',
    ),
    expected: { ...pass, sources: false },
  },
  {
    name: 'source inconnue',
    markdown: canonicalBrief.replace(
      '[source: demandes.md]',
      '[source: inconnue.md]',
    ),
    expected: { ...pass, sources: false },
  },
  {
    name: 'source supplémentaire',
    markdown: canonicalBrief.replace(
      '[source: demandes.md]',
      '[source: demandes.md] [source: messages.md]',
    ),
    expected: { ...pass, sources: false },
  },
  {
    name: 'entrée source vide',
    markdown: canonicalBrief.replace(
      '[sources: reunion.md ; messages.md]',
      '[sources: reunion.md ; messages.md ; ]',
    ),
    expected: { ...pass, sources: false },
  },
  {
    name: 'conflit dispersé',
    markdown: canonicalBrief.replace(
      '- [N03, N05] Confirmer le 18 ou le 19 septembre. [sources: reunion.md ; messages.md]',
      [
        '- [N03] Confirmer le 18 ou le 19. [source: reunion.md]',
        '- [N05] Attendre septembre. [source: messages.md]',
      ].join('\n'),
    ),
    expected: { ...pass, uncertainty: false },
  },
  {
    name: 'conflit tranché',
    markdown: canonicalBrief.replace(
      'Confirmer le 18 ou le 19 septembre.',
      'Décision prise : retenir le 18 ou le 19 septembre.',
    ),
    expected: { ...pass, uncertainty: false },
  },
  {
    name: 'conflit annoncé comme tranché',
    markdown: canonicalBrief.replace(
      'Confirmer le 18 ou le 19 septembre.',
      'Le conflit est tranché : le 18 ou le 19 septembre.',
    ),
    expected: { ...pass, uncertainty: false },
  },
  {
    name: 'date annoncée comme décidée',
    markdown: canonicalBrief.replace(
      'Confirmer le 18 ou le 19 septembre.',
      'La date est décidée : le 18 ou le 19 septembre.',
    ),
    expected: { ...pass, uncertainty: false },
  },
  {
    name: 'date annoncée comme fixée',
    markdown: canonicalBrief.replace(
      'Confirmer le 18 ou le 19 septembre.',
      'La date est fixée : le 18 ou le 19 septembre.',
    ),
    expected: { ...pass, uncertainty: false },
  },
  {
    name: 'date écartée malgré les deux options conservées',
    markdown: canonicalBrief.replace(
      'Confirmer le 18 ou le 19 septembre.',
      'Le 19 est écarté : retenir le 18 ou le 19 septembre.',
    ),
    expected: { ...pass, uncertainty: false },
  },
  {
    name: 'conflit explicitement non tranché',
    markdown: canonicalBrief.replace(
      'Confirmer le 18 ou le 19 septembre.',
      'Le conflit reste non tranché : confirmer le 18 ou le 19 septembre.',
    ),
    expected: pass,
  },
  {
    name: 'conflit non tranché avec auxiliaire',
    markdown: canonicalBrief.replace(
      'Confirmer le 18 ou le 19 septembre.',
      'Le conflit n’a pas été tranché : le 18 ou le 19 septembre.',
    ),
    expected: pass,
  },
  {
    name: 'date non fixée avec auxiliaire et adverbe',
    markdown: canonicalBrief.replace(
      'Confirmer le 18 ou le 19 septembre.',
      'La date n’est pas encore fixée : le 18 ou le 19 septembre.',
    ),
    expected: pass,
  },
  {
    name: 'décision distincte après une proposition niée',
    markdown: canonicalBrief.replace(
      'Confirmer le 18 ou le 19 septembre.',
      'Le conflit n’a pas été tranché, mais retenir le 18 ou le 19 septembre.',
    ),
    expected: { ...pass, uncertainty: false },
  },
];
