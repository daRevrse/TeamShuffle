# 🛠️ TeamShuffle - Commandes Utiles

## 🚀 Démarrage

```bash
# Démarrer le serveur de développement
npm start

# Démarrer avec cache nettoyé
npx expo start --clear

# Démarrer sur Android
npm run android

# Démarrer sur iOS
npm run ios

# Démarrer sur Web
npm run web
```

---

## 📦 Installation & Dépendances

```bash
# Installer les dépendances
npm install --legacy-peer-deps

# Installer une nouvelle dépendance Expo
npx expo install [package-name]

# Exemple: installer expo-sharing
npx expo install expo-sharing

# Mettre à jour Expo
npx expo upgrade
```

---

## 🧹 Nettoyage

```bash
# Nettoyer le cache Metro
npx expo start --clear

# Nettoyer node_modules (si problème)
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Nettoyer les caches Expo
npx expo start -c

# Sur Windows
rd /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps
```

---

## 🐛 Debug & Logs

```bash
# Afficher les logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS

# Ouvrir le menu développeur
# Sur l'émulateur: Cmd+D (Mac) ou Ctrl+D (Windows)
# Sur téléphone: Secouer l'appareil

# Recharger l'app
# Sur l'émulateur: R ou Cmd+R
```

---

## 🔧 Configuration NativeWind

Si les styles ne marchent pas :

```bash
# 1. Vérifier que metro.config.js existe
cat metro.config.js

# 2. Vérifier tailwind.config.js
cat tailwind.config.js

# 3. Nettoyer et redémarrer
npx expo start --clear

# 4. Si toujours pas: réinstaller NativeWind
npm uninstall nativewind tailwindcss
npx expo install nativewind tailwindcss
```

---

## 📱 Build & Déploiement

```bash
# Installer EAS CLI (une seule fois)
npm install -g eas-cli

# Login à Expo
eas login

# Initialiser EAS
eas build:configure

# Build Android (APK de développement)
eas build --platform android --profile preview

# Build iOS
eas build --platform ios --profile preview

# Build pour production
eas build --platform all --profile production

# Publier une mise à jour OTA
eas update
```

---

## 🧪 Tests

```bash
# Lancer Jest (si configuré)
npm test

# Lancer tests avec coverage
npm test -- --coverage

# Lancer tests en mode watch
npm test -- --watch
```

---

## 📊 Analyse & Performance

```bash
# Analyser la taille du bundle
npx expo export --dump-sourcemap

# Profiler les performances
# Dans l'app: Menu Dev > Toggle Performance Monitor

# Analyser les dépendances
npm ls

# Voir les dépendances outdated
npm outdated
```

---

## 🔐 Variables d'environnement

Créer `.env` :
```bash
# .env
API_URL=https://api.example.com
API_KEY=your_key_here
```

Installer `react-native-dotenv` :
```bash
npx expo install react-native-dotenv
```

---

## 🗃️ AsyncStorage

```bash
# Nettoyer AsyncStorage (pour debug)
# Ajouter dans le code temporairement:
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.clear();
```

---

## 🎨 Icônes & Assets

```bash
# Chercher une icône Ionicons
# https://ionic.io/ionicons

# Générer des icônes d'app
npx expo install expo-app-icon

# Optimiser les images
npm install -g sharp-cli
sharp input.png --width 1024 --output output.png
```

---

## 🌐 Partage & Export

```bash
# Partage natif
npx expo install expo-sharing

# Capture d'écran
npx expo install react-native-view-shot

# Export PDF
npx expo install react-native-html-to-pdf
```

---

## 🔔 Notifications

```bash
# Notifications push
npx expo install expo-notifications

# Notifications locales
npx expo install expo-notifications expo-device
```

---

## 📍 Localisation

```bash
# i18n
npm install react-i18next i18next

# Localisation Expo
npx expo install expo-localization
```

---

## 🎨 Animations

```bash
# Reanimated (déjà installé)
npx expo install react-native-reanimated

# Lottie (animations JSON)
npx expo install lottie-react-native

# Confetti
npx expo install react-native-confetti-cannon
```

---

## 📊 Charts & Graphiques

```bash
# Chart Kit
npx expo install react-native-chart-kit react-native-svg

# Victory Charts
npx expo install victory-native
```

---

## 🗄️ Base de données locale

```bash
# SQLite
npx expo install expo-sqlite

# Realm
npm install realm
```

---

## ☁️ Backend & API

```bash
# Firebase
npx expo install firebase

# Axios (requêtes HTTP)
npm install axios

# React Query
npm install @tanstack/react-query
```

---

## 🧰 Outils utiles

```bash
# Formater le code avec Prettier
npm install --save-dev prettier
npx prettier --write .

# Linter ESLint
npm install --save-dev eslint
npx eslint .

# TypeDoc (documentation)
npm install --save-dev typedoc
```

---

## 📱 Expo Go

```bash
# Télécharger Expo Go
# iOS: App Store
# Android: Google Play Store

# Scanner le QR code affiché dans le terminal

# Ou entrer l'URL manuellement:
exp://192.168.x.x:8081
```

---

## 🚨 Dépannage Rapide

### Erreur "Module not found"
```bash
npm install --legacy-peer-deps
npx expo start --clear
```

### Port 8081 déjà utilisé
```bash
# Windows
netstat -ano | findstr :8081
taskkill /F /PID [PID]

# Mac/Linux
lsof -ti:8081 | xargs kill -9
```

### Problème de cache
```bash
rm -rf node_modules/.cache
npx expo start --clear
```

### App ne se met pas à jour
```bash
# Fermer complètement l'app sur le téléphone
# Puis relancer depuis Expo Go
```

---

## 📚 Ressources

- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **NativeWind**: https://www.nativewind.dev
- **Zustand**: https://github.com/pmndrs/zustand
- **Ionicons**: https://ionic.io/ionicons

---

## 💡 Raccourcis Expo Go

Sur le téléphone, secouer l'appareil pour ouvrir le menu :
- **Reload** : Recharger l'app
- **Debug** : Ouvrir le debugger
- **Performance** : Afficher le monitor de performance
- **Element Inspector** : Inspecter les éléments

---

**Garde ce fichier sous la main !** 📌
