# ⚽ TeamShuffle

Application mobile React Native pour générer automatiquement des équipes de football équilibrées.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Expo](https://img.shields.io/badge/expo-~54.0-black)
![React Native](https://img.shields.io/badge/react--native-0.81-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📱 Fonctionnalités

### ✅ MVP v1.0 Implémenté

- **Gestion des joueurs**

  - Ajout, modification et suppression
  - Nom, niveau (1-5 étoiles), poste (G/D/M/A)
  - Liste avec recherche et filtres
  - Persistence locale avec AsyncStorage

- **Génération d'équipes**

  - 3 algorithmes de génération :
    - ⚖️ **Équilibré** : Balance par niveau
    - 🎲 **Aléatoire** : Distribution random
    - 📍 **Par postes** : Équilibre G/D/M/A
  - Calcul automatique du niveau moyen
  - Différence de niveau entre équipes
  - Fonction "Remélanger"

- **Historique des sessions**

  - Sauvegarde automatique
  - Affichage des stats (date, joueurs, méthode)
  - Rechargement des sessions passées
  - Suppression et gestion de l'historique

- **Interface moderne**
  - Design minimaliste et sportif
  - NativeWind (Tailwind CSS)
  - Icônes Ionicons
  - Responsive

---

## 🚀 Installation

### Prérequis

- Node.js >= 20.18
- npm ou yarn
- Expo Go sur smartphone (iOS/Android)

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/daRevrse/TeamShuffle.git
cd teamshuffle

# 2. Installer les dépendances
npm install --legacy-peer-deps

# 3. Lancer le serveur
npm start

# 4. Scanner le QR code avec Expo Go
```

---

## 📁 Structure du Projet

```
TeamShuffle/
├── app/                          # Écrans (Expo Router)
│   ├── index.js                  # Page d'accueil
│   ├── _layout.js                # Navigation
│   ├── players/
│   │   ├── index.js              # Liste joueurs
│   │   └── [id].js               # Ajout/Édition
│   ├── session/
│   │   ├── config.js             # Configuration session
│   │   └── result.js             # Résultat équipes
│   └── history/
│       └── index.js              # Historique
├── store/
│   ├── usePlayerStore.js         # State management joueurs
│   └── useSessionStore.js        # State management sessions
├── utils/
│   └── teamGenerator.js          # Algorithmes de génération
├── global.css                    # Styles Tailwind
├── tailwind.config.js            # Config Tailwind
├── metro.config.js               # Config Metro + NativeWind
└── babel.config.js               # Config Babel
```

---

## 🛠️ Stack Technique

- **Framework** : Expo (React Native)
- **Langage** : JavaScript
- **Styling** : NativeWind (Tailwind CSS)
- **State Management** : Zustand
- **Navigation** : Expo Router
- **Stockage** : AsyncStorage (100% offline)
- **Icônes** : @expo/vector-icons (Ionicons)

---

## 🎮 Utilisation

### 1. Ajouter des joueurs

1. Page d'accueil > **Mes Joueurs**
2. Cliquer sur le bouton **+**
3. Renseigner : Nom, Poste, Niveau
4. **Enregistrer**

### 2. Créer une session

1. Page d'accueil > **Créer des équipes**
2. Sélectionner les joueurs disponibles
3. Choisir la méthode de génération
4. **Générer les équipes**

### 3. Consulter les équipes

- Voir les 2 équipes avec stats
- **Remélanger** si besoin
- **Sauvegarder** dans l'historique

### 4. Historique

- Accéder à toutes les sessions passées
- Voir les détails d'une session
- Supprimer des sessions

---

## 🧮 Algorithmes

### Aléatoire 🎲

Distribution totalement random des joueurs.

### Équilibré ⚖️

1. Tri des joueurs par niveau (décroissant)
2. Distribution alternée en équilibrant le niveau total
3. Snake draft pour minimiser la différence

### Par Postes 📍

1. Distribution équitable par poste (G, D, M, A)
2. Chaque équipe reçoit des joueurs de chaque poste
3. Alternance pour les postes impairs

---

## 📚 Documentation

- [PLAN_DEVELOPPEMENT.md](PLAN_DEVELOPPEMENT.md) - Plan complet du projet
- [RESUME_FINAL.md](RESUME_FINAL.md) - Résumé des fonctionnalités
- [PROCHAINES_ETAPES.md](PROCHAINES_ETAPES.md) - Roadmap et améliorations
- [COMMANDES_UTILES.md](COMMANDES_UTILES.md) - Commandes et astuces
- [NATIVEWIND_FIX.md](NATIVEWIND_FIX.md) - Configuration NativeWind

---

## 🐛 Dépannage

### Les styles ne s'appliquent pas

```bash
npx expo start --clear
```

### Erreur "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Port 8081 déjà utilisé

```bash
# Windows
netstat -ano | findstr :8081
taskkill /F /PID [PID]

# Mac/Linux
lsof -ti:8081 | xargs kill -9
```

---

## 🔜 Roadmap

### v1.1 (À venir)

- [ ] Partage des équipes (screenshot)
- [ ] Animations et transitions
- [ ] Toast notifications
- [ ] Haptic feedback

### v2.0 (Futur)

- [ ] Statistiques avancées
- [ ] Mode 3+ équipes
- [ ] Thème sombre
- [ ] Export PDF
- [ ] Backup cloud

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

MIT License - voir [LICENSE](LICENSE)

---

## 👨‍💻 Auteur

Développé avec ❤️ pour les amateurs de football

---

## 🙏 Remerciements

- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [NativeWind](https://www.nativewind.dev)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 📞 Support

Pour toute question ou problème :

- Créer une [issue](https://github.com/daRevrse/TeamShuffle/issues)
- Email : support@flowkraftagency.com

---

**Bon match ! ⚽**
