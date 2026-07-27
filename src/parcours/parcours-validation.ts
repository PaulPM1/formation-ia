import {
  CAPTURE_PEREMPTION_JOURS,
  KEBAB_PATTERN,
  POURQUOI_MAX,
  ROLE_MAX,
  VISUEL_KEYS,
  VOCABULAIRE_INTERDIT,
  type Guide,
  type Outil,
  type Panne,
} from './parcours-model';

const visuelKeys = new Set<string>(VISUEL_KEYS);

const vide = (value: unknown): boolean =>
  typeof value !== 'string' || value.trim().length === 0;

function validatePanne(panne: Panne, prefixe: string, issues: string[]): void {
  if (!KEBAB_PATTERN.test(panne.id)) {
    issues.push(`${prefixe} : identifiant de panne « ${panne.id} » hors kebab-case.`);
  }
  if (vide(panne.symptome)) issues.push(`${prefixe} : symptome vide.`);
  if (vide(panne.cause)) issues.push(`${prefixe} : cause vide.`);
  if (vide(panne.preuve)) issues.push(`${prefixe} : preuve de sortie vide.`);
  if (panne.reparation.length === 0) issues.push(`${prefixe} : reparation vide.`);
}

// Échappé en Unicode pour que le validateur ne se signale pas lui-même
// lors d'une recherche du caractère dans le dépôt.
const TIRET_CADRATIN = '\u2014';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
/** Préfixe d'une clé Anthropic : ne doit jamais figurer dans un bloc envoyé à Claude. */
const CLE_PATTERN = /sk-[a-z]{2,}-/i;

const motifsInterdits = VOCABULAIRE_INTERDIT.map((mot) => ({
  mot,
  motif: new RegExp(`(^|[^\\p{L}\\p{N}])${mot.replace(/ /g, '\\s+')}($|[^\\p{L}\\p{N}])`, 'iu'),
}));

/**
 * Les textes que le participant lit vraiment. Volontairement hors périmètre :
 * `fichiers[].contenu` (du contenu technique authentique, qu'on montre tel
 * quel) et les chemins de fichiers.
 */
export function collecterTextesLisibles(guide: Guide): { chemin: string; texte: string }[] {
  const textes: { chemin: string; texte: string }[] = [
    { chemin: `${guide.id}.titre`, texte: guide.titre },
    { chemin: `${guide.id}.promesse`, texte: guide.promesse },
  ];
  if (guide.pourQui) textes.push({ chemin: `${guide.id}.pourQui`, texte: guide.pourQui });

  for (const etape of guide.etapes) {
    const base = `${guide.id}/${etape.id}`;
    textes.push({ chemin: `${base}.titre`, texte: etape.titre });
    if (etape.pourquoi) textes.push({ chemin: `${base}.pourquoi`, texte: etape.pourquoi });
    if (etape.danger) textes.push({ chemin: `${base}.danger`, texte: etape.danger });
    if (etape.aClaude) textes.push({ chemin: `${base}.aClaude`, texte: etape.aClaude });
    textes.push({ chemin: `${base}.preuve.visible`, texte: etape.preuve.visible });
    textes.push({ chemin: `${base}.preuve.sinon`, texte: etape.preuve.sinon });
    for (const [index, geste] of etape.gestes.entries()) {
      textes.push({ chemin: `${base}.gestes[${index}]`, texte: geste.action });
      if (geste.ancre) textes.push({ chemin: `${base}.gestes[${index}].ancre`, texte: geste.ancre });
    }
    if (etape.visuel.key === 'capture') {
      textes.push({ chemin: `${base}.visuel.alt`, texte: etape.visuel.alt });
      for (const repere of etape.visuel.reperes) {
        textes.push({ chemin: `${base}.visuel.repere`, texte: repere.label });
      }
    }
    for (const panne of etape.pannes) {
      const p = `${base}#${panne.id}`;
      textes.push({ chemin: `${p}.symptome`, texte: panne.symptome });
      textes.push({ chemin: `${p}.cause`, texte: panne.cause });
      textes.push({ chemin: `${p}.preuve`, texte: panne.preuve });
      for (const [index, geste] of panne.reparation.entries()) {
        textes.push({ chemin: `${p}.reparation[${index}]`, texte: geste.action });
      }
    }
  }

  return textes;
}

const joursEcoules = (depuis: string, jusqu: string): number =>
  Math.round((Date.parse(jusqu) - Date.parse(depuis)) / 86_400_000);

function validateEditorial(guide: Guide, aujourdHui: string, issues: string[]): void {
  for (const { chemin, texte } of collecterTextesLisibles(guide)) {
    if (texte.includes(TIRET_CADRATIN)) {
      issues.push(`${chemin} : tiret cadratin interdit.`);
    }
    for (const { mot, motif } of motifsInterdits) {
      if (motif.test(texte)) {
        issues.push(`${chemin} : vocabulaire interdit « ${mot} ».`);
      }
    }
  }

  for (const etape of guide.etapes) {
    const prefixe = `${guide.id}/${etape.id}`;

    if (etape.pourquoi && etape.pourquoi.length > POURQUOI_MAX) {
      issues.push(`${prefixe} : pourquoi de ${etape.pourquoi.length} caractères, maximum ${POURQUOI_MAX}.`);
    }

    if (etape.aClaude && CLE_PATTERN.test(etape.aClaude)) {
      issues.push(`${prefixe} : une clé ne doit jamais figurer dans un bloc envoyé à Claude.`);
    }

    if (etape.visuel.key === 'capture') {
      if (vide(etape.visuel.alt)) {
        issues.push(`${prefixe} : capture sans alt.`);
      }
      if (!DATE_PATTERN.test(etape.visuel.verifieLe)) {
        issues.push(`${prefixe} : verifieLe « ${etape.visuel.verifieLe} » doit être au format AAAA-MM-JJ.`);
      } else if (joursEcoules(etape.visuel.verifieLe, aujourdHui) > CAPTURE_PEREMPTION_JOURS) {
        issues.push(
          `${prefixe} : capture vérifiée le ${etape.visuel.verifieLe}, à recontrôler.`,
        );
      }
    }
  }
}

export function validateGuides(
  guides: Guide[],
  aujourdHui: string = new Date().toISOString().slice(0, 10),
): string[] {
  const issues: string[] = [];

  for (const guide of guides) {
    if (!KEBAB_PATTERN.test(guide.id)) {
      issues.push(`Guide « ${guide.id} » : identifiant hors kebab-case.`);
    }

    // Les ancres vivent dans l’URL d’un guide : l’unicité se joue par guide,
    // pas globalement. Deux guides peuvent donc avoir une étape homonyme.
    const etapeIds = new Set<string>();
    const panneIds = new Set<string>();

    for (const etape of guide.etapes) {
      const prefixe = `${guide.id}/${etape.id}`;

      if (!KEBAB_PATTERN.test(etape.id)) {
        issues.push(`${prefixe} : identifiant d’étape hors kebab-case.`);
      } else if (etapeIds.has(etape.id)) {
        issues.push(`${prefixe} : identifiant d’étape en double.`);
      } else {
        etapeIds.add(etape.id);
      }

      if (vide(etape.preuve?.visible)) issues.push(`${prefixe} : preuve.visible vide.`);
      if (vide(etape.preuve?.sinon)) issues.push(`${prefixe} : preuve.sinon vide.`);

      if (etape.lieu === 'navigateur' && vide(etape.service)) {
        issues.push(`${prefixe} : lieu navigateur sans service renseigné.`);
      }

      if (!visuelKeys.has(etape.visuel?.key)) {
        issues.push(`${prefixe} : visuel inconnu « ${etape.visuel?.key} ».`);
      }

      for (const panne of etape.pannes) {
        if (panneIds.has(panne.id)) {
          issues.push(`${prefixe} : identifiant de panne « ${panne.id} » en double.`);
        } else {
          panneIds.add(panne.id);
        }
        validatePanne(panne, `${prefixe}#${panne.id}`, issues);
      }
    }

    validateEditorial(guide, aujourdHui, issues);
  }

  return issues;
}

export function validateOutils(outils: Outil[]): string[] {
  const issues: string[] = [];
  const noms = new Set<string>();

  for (const outil of outils) {
    if (vide(outil.nom)) issues.push('Un outil de la carte n’a pas de nom.');
    if (noms.has(outil.nom)) issues.push(`Outil « ${outil.nom} » en double.`);
    noms.add(outil.nom);

    if (vide(outil.role)) issues.push(`Outil « ${outil.nom} » : role vide.`);
    if (outil.role.length > ROLE_MAX) {
      issues.push(`Outil « ${outil.nom} » : role de ${outil.role.length} caractères, maximum ${ROLE_MAX}.`);
    }
    if (outil.role.includes(TIRET_CADRATIN)) {
      issues.push(`Outil « ${outil.nom} » : tiret cadratin interdit.`);
    }
    if (!outil.logo.endsWith('.svg')) {
      issues.push(`Outil « ${outil.nom} » : le logo doit être un SVG.`);
    }
  }

  return issues;
}
