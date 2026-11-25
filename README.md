# 🎯 Devine le nombre

Un petit jeu de devinette en **HTML, CSS et JavaScript pur**, sans framework ni dépendance. L'ordinateur choisit un nombre secret et tu dois le trouver en un nombre limité d'essais, avec des indices à chaque tentative.

Ce projet est la version graphique d'un programme Python en console réalisé dans le cadre de mes cours de développement web et mobile.

## ✨ Fonctionnalités

- **3 niveaux de difficulté** : Facile (1 à 50, 10 essais), Moyen (1 à 100, 10 essais), Difficile (1 à 200, 8 essais)
- **Indices en temps réel** : « Trop grand ! » ou « Trop petit ! », avec un code couleur
- **Jauge de l'intervalle** : elle se réduit à chaque indice pour montrer où se trouve encore le nombre
- **Pastilles d'essais restants** et **historique** des nombres déjà essayés (↑ / ↓)
- **Validation de la saisie** : une entrée invalide affiche une erreur sans consommer d'essai
- **Meilleur score** par niveau, sauvegardé dans le navigateur (`localStorage`)
- **Mode clair / sombre**, également mémorisé
- **Animation de confettis** à la victoire
- **Design responsive** : fonctionne sur téléphone, tablette et ordinateur

## 🎮 Règles du jeu

1. Choisis un niveau de difficulté.
2. Saisis un nombre dans l'intervalle indiqué, puis clique sur **Valider** (ou appuie sur Entrée).
3. Le jeu te dit si ton nombre est trop grand ou trop petit.
4. Trouve le nombre secret avant d'épuiser tous tes essais.
5. Clique sur **Rejouer** pour lancer une nouvelle partie.

## 🚀 Lancer le projet

Aucune installation n'est nécessaire.

```bash
git clone https://github.com/<ton-pseudo>/<nom-du-depot>.git
cd <nom-du-depot>
```

Ouvre ensuite le fichier `index.html` dans ton navigateur (double-clic).

## 📁 Structure du projet

```
├── index.html   # Structure de la page
├── style.css    # Styles, thèmes clair/sombre, responsive
└── script.js    # Logique du jeu, historique, scores, confettis
```

## 🛠️ Technologies

- HTML5
- CSS3 (variables CSS, flexbox, grid, animations)
- JavaScript (ES6+, DOM, `localStorage`, Canvas)

## 🔮 Pistes d'amélioration

- Ajouter des effets sonores
- Ajouter un mode deux joueurs
- Créer un classement des meilleurs scores
- Ajouter un niveau « Expert »

## 👤 Auteur

**Mahamadou** — étudiant en développement web et mobile à l'IIBS Dakar.