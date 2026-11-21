# Installation et dépannage : Git, Node, GitHub

Fiche formateur. Toute l'installation se fait sur place, le samedi matin, avec
les formateurs. Chez elle, la personne ne fait que ce qu'elle sait faire seule :
installer l'application Claude, prendre l'abonnement, créer son compte GitHub.

Principe : la personne ne tape aucune commande. Claude vérifie, installe et
relie GitHub. Elle ne fait que trois gestes : cliquer « Oui » quand son
ordinateur demande une autorisation, taper le mot de passe de son ordinateur,
coller un code dans une page GitHub.

Statut : les commandes sont standard, mais le chemin complet n'a pas encore été
joué sur un Windows vierge. Voir « Ce qui reste à tester » en bas.

## 1. Ce qu'il faut sur chaque machine

| Outil | À quoi il sert | Obligatoire pour l'application Claude ? |
| --- | --- | --- |
| Git | Garder l'historique du projet, l'envoyer sur GitHub | Non, mais nécessaire pour sauvegarder |
| Node.js (version LTS) | Faire tourner la plupart des projets web et leur aperçu | Non, l'application embarque Claude Code |
| GitHub CLI (`gh`) | Connecter le compte GitHub sans jeton ni clé, créer le dépôt | Non, l'application propose de l'installer à la première demande de fusion |

L'onglet Code fonctionne sans rien de tout cela (sur Windows sans Git, Claude
passe par PowerShell). Donc Claude peut toujours démarrer, et c'est lui qui
installe le reste.

## 2. Le chemin normal : une phrase à coller, tous ensemble, en arrivant

Dans l'application Claude, onglet **Code**, session **Local**, n'importe quel
dossier (par exemple un dossier « projets » créé dans le dossier personnel).
Coller :

```text
Prépare mon ordinateur pour construire des projets. Je débute : ne me demande
jamais de taper une commande. Fais tout toi-même et dis-moi seulement quand je
dois cliquer sur une fenêtre ou taper le mot de passe de mon ordinateur.

1. Vérifie si Git, Node.js (version LTS) et GitHub CLI (gh) sont installés.
2. Installe ce qui manque avec la méthode officielle la plus simple pour mon
   système. Windows : winget. Mac : les outils en ligne de commande d'Apple
   pour Git, les installateurs officiels .pkg pour Node.js et gh. N'installe
   pas Homebrew s'il n'est pas déjà là.
3. Si une commande reste introuvable juste après son installation, cherche-la
   à son emplacement habituel avant de conclure à un échec. Si elle y est,
   dis-moi de fermer complètement l'application Claude puis de la rouvrir.
4. Relie mon compte GitHub : lance « gh auth login --web --clipboard
   --git-protocol https », et dis-moi de coller le code dans la page qui
   s'ouvre. Ensuite lance « gh auth setup-git » et renseigne mon nom et mon
   adresse Git à partir de mon compte GitHub.
5. Installe le skill setup-projet dans mes skills personnels
   (~/.claude/skills/setup-projet/) depuis cette adresse :
   https://formation-ia-ruby.vercel.app/kits/setup-projet.zip
6. Termine par un tableau : Git, Node.js, npm, gh, connexion GitHub, skill
   setup-projet. Pour chacun : prêt ou pas prêt, et la version.
```

C'est le premier geste de la matinée, avant toute théorie : tout le monde colle
la phrase en même temps, un formateur la projette et la fait avec le groupe.
Les installations tournent ensuite pendant le premier bloc de théorie. Les
formateurs passent voir les tableaux à la première pause et traitent les « pas
prêt » avec les sections 3 et 5.

Ce qu'il faut avoir préparé, parce que vingt téléchargements simultanés
peuvent saturer le wifi du lieu :

- une clé USB avec les installateurs de Node.js LTS, Git pour Windows et
  GitHub CLI, pour Mac et pour Windows ;
- un partage de connexion de secours ;
- un ou deux ordinateurs déjà prêts à prêter.

Sur Mac, les outils d'Apple (Git) se téléchargent chez Apple et prennent cinq à
quinze minutes : c'est l'installation la plus lente, d'où l'intérêt de la
lancer dès l'arrivée.

L'adresse du zip est celle du site de la formation : elle ne répond qu'une fois
cette version du site mise en ligne.

## 3. Installation à la main, si Claude bute

À faire par un formateur, pas par la personne.

### Mac

1. Git : ouvrir Terminal, lancer `xcode-select --install`, cliquer
   « Installer » dans la fenêtre. Compter cinq à quinze minutes.
2. Node.js : sur nodejs.org, télécharger l'installateur macOS de la version
   LTS (fichier .pkg), l'ouvrir, tout accepter, taper le mot de passe du Mac.
3. GitHub CLI : sur cli.github.com, télécharger l'installateur macOS (.pkg),
   même geste.
4. Quitter Claude (Cmd+Q) et le rouvrir.

### Windows

1. Ouvrir PowerShell et lancer, une ligne à la fois (cliquer « Oui » à chaque
   fenêtre d'autorisation) :

   ```powershell
   winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements
   winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
   winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements
   ```

2. Si `winget` n'existe pas : installateurs de git-scm.com, nodejs.org et
   cli.github.com, en gardant toutes les options par défaut.
3. Quitter complètement Claude (clic droit sur son icône près de l'horloge,
   Quitter) et le rouvrir.

### Vérifier (les deux systèmes)

```text
git --version
node --version
npm --version
gh --version
gh auth status
```

Cinq réponses sans erreur : la machine est prête.

## 4. Relier GitHub : la méthode retenue

Une seule méthode, identique sur Mac et Windows : GitHub CLI.

1. `gh auth login --web --clipboard --git-protocol https` : le navigateur
   s'ouvre, le code est déjà copié. La personne le colle et clique
   « Authorize ».
2. `gh auth setup-git` : Git utilise désormais cette connexion pour envoyer.
3. Pour chaque projet, Claude crée lui-même le dépôt depuis le dossier :
   `gh repo create nom-du-projet --private --source . --push`.

Pourquoi celle-ci : pas de jeton à créer, pas de clé SSH, pas de dépôt à créer
à la main sur le site ni d'adresse à recopier. La personne dit « sauvegarde mon
projet sur GitHub » et colle un code une seule fois dans sa vie.

Conséquence : le dépôt modèle (« Use this template ») n'est plus nécessaire.
Il imposait de créer le dépôt en ligne puis de le ramener sur l'ordinateur,
ce que l'application ne propose pas en un clic pour une session locale. Le
chemin devient : un dossier vide, « lance setup-projet », et Claude crée le
dépôt quand la première fonctionnalité marche.

## 5. Pannes classiques

| Ce qu'on voit | Cause | Solution |
| --- | --- | --- |
| `node`, `git` ou `gh` « n'est pas reconnu » ou `command not found` juste après l'installation | L'application a été ouverte avant l'installation et garde l'ancienne liste de chemins | Quitter complètement Claude et le rouvrir. Si ça persiste, redémarrer l'ordinateur |
| Même message après redémarrage | L'outil n'est pas dans le PATH | Vérifier qu'il existe (`C:\Program Files\nodejs`, `C:\Program Files\Git\cmd`, `C:\Program Files\GitHub CLI` ; `/usr/local/bin` sur Mac), puis ajouter le dossier au PATH dans les variables d'environnement de l'utilisateur. Sur Windows l'application ne lit pas le profil PowerShell : seul le PATH système ou utilisateur compte |
| Windows : `npm.ps1 cannot be loaded because running scripts is disabled` | PowerShell bloque les scripts par défaut | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, ou appeler `npm.cmd` |
| Windows : `winget` introuvable | Windows 10 ancien | Mettre à jour « Programme d'installation d'application » dans le Microsoft Store, ou passer par les installateurs |
| Windows : la fenêtre d'autorisation demande un mot de passe administrateur que la personne n'a pas | Ordinateur de travail verrouillé | Ne pas insister : plan B, section 6 |
| Mac : `xcrun: error: invalid active developer path` | Outils Apple absents ou cassés après une mise à jour de macOS | `xcode-select --install` |
| Mac : fenêtre « la commande git nécessite les outils de développement » | Premier usage de Git | Cliquer « Installer », attendre la fin |
| Mac : `EACCES` pendant un `npm install -g` | Installation globale sans droits | Ne pas utiliser `sudo`. Utiliser `npx` ou installer dans le projet |
| `Author identity unknown` ou `Please tell me who you are` | Nom et adresse Git jamais renseignés | `git config --global user.name "..."` et `user.email "..."` |
| Envoi refusé : `Authentication failed`, `Password authentication is not supported`, erreur 403 | Git n'utilise pas la connexion GitHub | `gh auth login` (section 4) puis `gh auth setup-git` |
| `Repository not found` à l'envoi | Mauvais compte GitHub connecté, ou adresse du dépôt fausse | `gh auth status` pour voir le compte, `git remote -v` pour voir l'adresse |
| `remote origin already exists` | Le dossier est déjà relié à un dépôt | `git remote set-url origin <adresse>` |
| Envoi rejeté (`non-fast-forward`, `fetch first`) | Le dépôt en ligne contient déjà un fichier créé sur le site | `git pull --rebase origin main` puis renvoyer |
| `EADDRINUSE` ou « port 3000 déjà utilisé » | Un ancien lancement du projet tourne encore | Demander à Claude d'arrêter l'ancien serveur ou d'utiliser un autre port |
| `self signed certificate in certificate chain`, `unable to get local issuer certificate` | Réseau ou antivirus d'entreprise qui intercepte les connexions | Passer sur un partage de connexion du téléphone. Si c'est l'ordinateur lui-même : plan B |
| Windows : installations très lentes, erreurs `EPERM` ou `EBUSY` | Projet rangé dans un dossier synchronisé par OneDrive (souvent Documents ou Bureau) | Déplacer le projet dans `C:\Users\<nom>\projets` |
| Node déjà présent mais très ancien, le projet refuse de se lancer | Vieille installation | Réinstaller la version LTS par-dessus |
| L'aperçu reste vide | Le projet n'est pas lancé, ou la configuration d'aperçu manque | Demander « lance le projet et affiche-le dans l'aperçu » : Claude crée la configuration (`.claude/launch.json`). Une simple page HTML s'ouvre sans rien lancer |
| Claude demande une autorisation à chaque commande et la personne hésite | Mode de permission manuel | Normal pendant l'installation : lire la phrase, accepter. Ne pas activer le mode sans aucune permission |

Réflexe général : coller le message d'erreur à Claude avec « répare ça et
explique-moi en deux phrases ». Appeler un formateur au deuxième échec, pas au
cinquième.

## 6. Plan B : l'ordinateur refuse toute installation

Cas typique : ordinateur de travail sans droits. Ne pas y passer la matinée.

- Session **cloud** dans l'onglet Code : rien à installer, le dépôt est choisi
  sur GitHub. Limite connue : pas d'aperçu local confirmé, le résultat se
  regarde après mise en ligne.
- Ou binôme avec une machine qui marche.

À prévoir : un ou deux ordinateurs de secours déjà préparés.

## 7. Reprendre chez soi

La machine reste prête après la session. Si un outil manque plus tard, la même
phrase (section 2) répare : elle ne réinstalle que ce qui manque.

## Ce qui reste à tester

- Le prompt de la section 2 de bout en bout sur un Windows vierge et sur un Mac
  sans outils Apple.
- Que `gh auth login --web --clipboard` lancé par Claude ouvre bien le
  navigateur sans attendre une touche Entrée.
- Qu'un skill posé dans `~/.claude/skills/` apparaît bien dans une session
  locale de l'onglet Code (documenté), et qu'un zip téléversé par Plugins
  aussi (non documenté).
- Le comportement sur un ordinateur de travail réel.
- Le débit du wifi du lieu avec tout le groupe qui installe en même temps.
