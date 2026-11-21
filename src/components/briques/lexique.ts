// Les douze mots de la brique D1, dans l'ordre où la carte du projet les pose.
export const LEXIQUE = [
  { mot: 'Dossier', icon: 'folder', phrase: 'Là où vit votre projet, sur votre ordinateur.' },
  { mot: 'Fichier', icon: 'file', phrase: 'Un morceau du projet : une page, une image, un réglage.' },
  { mot: 'Dépendance', icon: 'box', phrase: 'Un outil tout fait que Claude ajoute au projet, pour ne pas tout réécrire.' },
  { mot: 'Clé API', icon: 'key', phrase: 'Un mot de passe qui laisse le projet utiliser un service. Elle reste secrète.' },
  { mot: 'Localhost', icon: 'screen', phrase: 'L’adresse de l’aperçu. Elle ne marche que sur votre ordinateur.' },
  { mot: 'Commit', icon: 'save', phrase: 'Une sauvegarde du projet, avec un nom.' },
  { mot: 'GitHub', icon: 'github', phrase: 'Le site qui garde une copie de votre projet.' },
  { mot: 'Dépôt', icon: 'folder', phrase: 'L’espace de votre projet sur GitHub, avec tout son historique.' },
  { mot: 'Déploiement', icon: 'rocket', phrase: 'La mise en ligne : le projet reçoit une adresse.' },
  { mot: 'Front', icon: 'eye', phrase: 'Ce que le visiteur voit et touche.' },
  { mot: 'Back', icon: 'server', phrase: 'Ce qui travaille derrière, sans se montrer.' },
  { mot: 'Base de données', icon: 'database', phrase: 'Là où le projet range ce qu’il doit retenir : comptes, recettes, commandes.' },
] as const;

export const numero = (mot: (typeof LEXIQUE)[number]['mot']) => LEXIQUE.findIndex((entry) => entry.mot === mot) + 1;
