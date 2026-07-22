export const notes = [
  { id: 'N01', title: 'Envoyer l’agenda révisé', detail: 'Aujourd’hui avant 11 h 30', state: 'today', source: 'inbox/01-demandes.md' },
  { id: 'N02', title: 'Préparer le pack d’icônes', detail: 'Prochain sprint', state: 'later', source: 'inbox/01-demandes.md' },
  { id: 'N03', title: 'Préparer le lancement pilote', detail: 'Date à confirmer', state: 'confirm', source: 'inbox/02-reunion.md' },
  { id: 'N04', title: 'Archiver l’ancienne checklist', detail: 'Après validation par Léa', state: 'later', source: 'inbox/02-reunion.md' },
  { id: 'N05', title: 'Confirmer la date au partenaire', detail: '18 ou 19 septembre', state: 'confirm', source: 'inbox/03-messages.md' },
  { id: 'N06', title: 'Transmettre le nombre de participants', detail: 'Aujourd’hui avant 16 h', state: 'today', source: 'inbox/03-messages.md' },
];

export const stateLabels = {
  today: 'Actions du jour',
  confirm: 'À confirmer',
  later: 'Plus tard',
};
