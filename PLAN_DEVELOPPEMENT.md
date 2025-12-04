# Plan de Développement TeamShuffle

## ✅ Configuration NativeWind - TERMINÉ

### Corrections appliquées :
1. **metro.config.js** créé avec `withNativeWind`
2. **tailwind.config.js** mis à jour avec `presets: [require("nativewind/preset")]`
3. **global.css** déjà présent
4. **app/_layout.js** importe déjà `../global.css`
5. **babel.config.js** configuré avec le preset NativeWind

### Pour tester :
```bash
npx expo start --clear
```

---

## 📋 Prochaines Étapes

### 1. Store pour les Sessions ⏳
**Fichier** : `store/useSessionStore.js`

**Fonctionnalités** :
- Créer une session avec joueurs sélectionnés
- Générer des équipes selon différents algorithmes
- Sauvegarder l'historique des sessions
- Persister avec AsyncStorage

**Structure de données** :
```javascript
{
  id: string,
  date: timestamp,
  players: Player[],
  teams: {
    teamA: Player[],
    teamB: Player[]
  },
  method: 'random' | 'balanced' | 'position',
  stats: {
    avgLevelTeamA: number,
    avgLevelTeamB: number,
    difference: number
  }
}
```

---

### 2. Écran Configuration Session ⏳
**Route** : `app/session/config.js`

**Fonctionnalités** :
- Sélectionner les joueurs disponibles (checkbox)
- Choisir la méthode de génération :
  - 🎲 **Aléatoire** : Distribution totalement random
  - ⚖️ **Équilibré** : Balance par niveau
  - 📍 **Par postes** : Distribution équitable des postes (G/D/M/A)
- Afficher le nombre de joueurs sélectionnés
- Bouton "Générer les équipes"

**UI** :
```
┌─────────────────────────────┐
│ Joueurs disponibles (8/12)  │
│ [Tout sélectionner]          │
├─────────────────────────────┤
│ ✓ [G] Nom Joueur ⭐⭐⭐⭐⭐   │
│ ✓ [D] Nom Joueur ⭐⭐⭐       │
│   [M] Nom Joueur ⭐⭐⭐⭐     │
├─────────────────────────────┤
│ Méthode de génération :      │
│ ◉ Équilibré                  │
│ ○ Aléatoire                  │
│ ○ Par postes                 │
├─────────────────────────────┤
│ [Générer les équipes]        │
└─────────────────────────────┘
```

---

### 3. Algorithmes de Génération d'Équipes ⏳
**Fichier** : `utils/teamGenerator.js`

#### Algorithme 1 : Aléatoire
```javascript
shuffle(players) → split en 2 groupes
```

#### Algorithme 2 : Équilibré
```javascript
1. Trier les joueurs par niveau (desc)
2. Distribuer alternativement en équilibrant le niveau moyen
3. Calculer la différence de niveau entre équipes
```

#### Algorithme 3 : Par Postes
```javascript
1. Séparer par poste (G, D, M, A)
2. Distribuer équitablement chaque poste
3. Si impair, alterner l'attribution
```

**Fonctions utilitaires** :
- `calculateAverageLevel(team)`
- `shuffleArray(array)`
- `generateTeams(players, method)`

---

### 4. Écran Résultat avec Équipes ⏳
**Route** : `app/session/result.js`

**Fonctionnalités** :
- Afficher les 2 équipes côte à côte
- Badge de couleur par équipe (bleu/rouge)
- Niveau moyen de chaque équipe
- Liste des joueurs avec poste et niveau
- Bouton "Remélanger" (regénère avec même méthode)
- Bouton "Partager" (screenshot)
- Bouton "Sauvegarder" dans l'historique

**UI** :
```
┌─────────────────────────────┐
│       ⚽ ÉQUIPES GÉNÉRÉES     │
│   Méthode : Équilibré        │
├──────────────┬──────────────┤
│  ÉQUIPE A    │  ÉQUIPE B    │
│  ⭐ 3.5      │  ⭐ 3.4      │
├──────────────┼──────────────┤
│ [G] Joueur 1 │ [G] Joueur 2 │
│ [D] Joueur 3 │ [D] Joueur 4 │
│ [M] Joueur 5 │ [M] Joueur 6 │
│ [A] Joueur 7 │ [A] Joueur 8 │
├──────────────┴──────────────┤
│ [🔀 Remélanger] [📤 Partager]│
└─────────────────────────────┘
```

---

### 5. Fonctionnalité de Partage 📤
**Dépendances** :
- `expo-sharing`
- `react-native-view-shot`

**Installation** :
```bash
npx expo install expo-sharing react-native-view-shot
```

**Fonctionnement** :
1. Capturer l'écran des équipes en image
2. Ouvrir le menu de partage natif
3. Partager via WhatsApp, SMS, etc.

---

### 6. Écran Historique des Sessions 📋
**Route** : `app/history/index.js`

**Fonctionnalités** :
- Liste des sessions passées (plus récentes en premier)
- Afficher : date, nombre de joueurs, méthode
- Clic pour voir le détail (route vers result avec session chargée)
- Swipe pour supprimer
- Bouton "Tout effacer"

**UI** :
```
┌─────────────────────────────┐
│       📋 HISTORIQUE          │
├─────────────────────────────┤
│ 📅 4 déc. 2025 - 14h30      │
│ 8 joueurs • Équilibré        │
│ ⭐ 3.5 vs 3.4 (Diff: 0.1)   │
├─────────────────────────────┤
│ 📅 3 déc. 2025 - 18h00      │
│ 10 joueurs • Par postes      │
│ ⭐ 3.2 vs 3.3 (Diff: 0.1)   │
├─────────────────────────────┤
│ [Tout effacer]               │
└─────────────────────────────┘
```

---

### 7. Détail d'une Session Historique
**Route** : `app/history/[id].js`

Afficher la composition exacte des équipes de cette session passée.
Même layout que `session/result.js` mais en lecture seule.

---

### 8. Améliorations UI/UX 🎨

#### Animations avec `react-native-reanimated`
- Transitions entre écrans
- Animation du bouton FAB
- Shake sur erreur de formulaire
- Confetti lors de la génération d'équipes

#### Icônes et visuels
- Utiliser `@expo/vector-icons` (déjà installé)
- Améliorer les badges de postes
- Ajouter des illustrations pour empty states

#### Feedback utilisateur
- Toast notifications
- Loading states
- Haptic feedback (vibrations)

---

## 🗂️ Structure de Fichiers Finale

```
TeamShuffle/
├── app/
│   ├── index.js                    ✅ Home
│   ├── _layout.js                  ✅ Navigation
│   ├── players/
│   │   ├── index.js                ✅ Liste joueurs
│   │   └── [id].js                 ✅ Ajout/Édition joueur
│   ├── session/
│   │   ├── config.js               ⏳ Configuration session
│   │   └── result.js               ⏳ Résultat équipes
│   └── history/
│       ├── index.js                ⏳ Liste historique
│       └── [id].js                 ⏳ Détail session
├── store/
│   ├── usePlayerStore.js           ✅ Store joueurs
│   └── useSessionStore.js          ⏳ Store sessions
├── utils/
│   └── teamGenerator.js            ⏳ Algorithmes
├── components/
│   ├── PlayerCard.js               ⏳ Card joueur réutilisable
│   ├── TeamDisplay.js              ⏳ Affichage équipe
│   └── EmptyState.js               ⏳ État vide générique
├── global.css                      ✅
├── tailwind.config.js              ✅
├── metro.config.js                 ✅
├── babel.config.js                 ✅
└── package.json                    ✅
```

---

## 🎯 Ordre de Développement Recommandé

### Phase 1 : Backend logique (1-2h)
1. ✅ Corriger NativeWind
2. ⏳ Créer `useSessionStore.js`
3. ⏳ Implémenter `teamGenerator.js`

### Phase 2 : Écrans principaux (2-3h)
4. ⏳ Créer `session/config.js`
5. ⏳ Créer `session/result.js`
6. ⏳ Tester le flux complet

### Phase 3 : Historique (1h)
7. ⏳ Créer `history/index.js`
8. ⏳ Créer `history/[id].js`

### Phase 4 : Partage (30min)
9. ⏳ Installer dépendances
10. ⏳ Implémenter capture + partage

### Phase 5 : Polish (1-2h)
11. ⏳ Composants réutilisables
12. ⏳ Animations
13. ⏳ Tests finaux

---

## 🚀 Commandes Utiles

```bash
# Démarrer le projet
npm start

# Nettoyer le cache
npx expo start --clear

# Installer une nouvelle dépendance
npx expo install [package]

# Build pour tester sur téléphone
npx expo start
# Puis scanner le QR code avec Expo Go
```

---

## 📝 Notes Importantes

- ✅ NativeWind v4 configuré correctement
- ✅ Babel avec preset NativeWind déplacé dans presets
- ✅ Store joueurs avec persistence AsyncStorage
- ⚠️ Installer `expo-sharing` et `react-native-view-shot` pour le partage
- 💡 Penser à gérer les cas limites (1 joueur, nombre impair, etc.)

---

**Dernière mise à jour** : 4 décembre 2025
**Statut** : Configuration OK, prêt pour le développement
