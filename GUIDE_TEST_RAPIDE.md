# 🧪 Guide de Test Rapide - TeamShuffle

## 🚀 Lancement (2 min)

```bash
# Ouvrir le terminal dans le dossier TeamShuffle
cd TeamShuffle

# Lancer l'app
npx expo start --clear
```

**Résultat attendu** :
- Le serveur Metro démarre
- Un QR code s'affiche
- L'URL est : `exp://192.168.x.x:8081`

---

## 📱 Sur Ton Smartphone

### iOS
1. Ouvrir l'app **Appareil photo**
2. Scanner le QR code
3. Cliquer sur la notification Expo Go

### Android
1. Ouvrir l'app **Expo Go**
2. Scanner le QR code avec l'app

---

## ✅ Checklist de Test (10 min)

### 1. Page d'Accueil (30 sec)
- [ ] L'écran s'affiche avec le logo ⚽
- [ ] 3 boutons sont visibles
- [ ] Les styles NativeWind fonctionnent
- [ ] Pas d'erreur dans la console

### 2. Gestion des Joueurs (2 min)
- [ ] Cliquer sur "Mes Joueurs"
- [ ] Cliquer sur le bouton **+**
- [ ] Ajouter un joueur :
  - Nom : "Cristiano"
  - Poste : Attaquant (A)
  - Niveau : 5 étoiles
- [ ] Cliquer "Enregistrer"
- [ ] Le joueur apparaît dans la liste
- [ ] Ajouter 5-6 joueurs de plus (mix de niveaux)

**Résultat attendu** :
- Badge coloré pour chaque poste
- Étoiles affichées pour le niveau
- Liste fluide

### 3. Création de Session (3 min)
- [ ] Retour à l'accueil
- [ ] Cliquer "Créer des équipes"
- [ ] Vérifier que tous les joueurs sont sélectionnés
- [ ] Désélectionner 1-2 joueurs
- [ ] Tester "Tout sélectionner" / "Tout désélectionner"
- [ ] Choisir la méthode "Équilibré"
- [ ] Cliquer "⚽ Générer les équipes"

**Résultat attendu** :
- Navigation vers l'écran de résultat
- 2 équipes affichées (bleue et rouge)
- Niveaux moyens calculés
- Liste des joueurs visible

### 4. Affichage des Équipes (2 min)
- [ ] Vérifier Team A (bleue) et Team B (rouge)
- [ ] Vérifier les badges de postes
- [ ] Vérifier les étoiles de niveau
- [ ] Regarder la différence de niveau
- [ ] Cliquer "Remélanger"
- [ ] Les équipes changent
- [ ] Remélanger 2-3 fois

**Résultat attendu** :
- Équipes différentes à chaque fois
- Niveaux moyens recalculés
- Pas de bug

### 5. Partage (2 min) 📤 **NOUVEAU**
- [ ] Cliquer sur "Partager"
- [ ] Le bouton devient "Partage..."
- [ ] Le menu de partage s'ouvre
- [ ] Choisir une app (WhatsApp, SMS, etc.)
- [ ] L'image se charge dans l'app
- [ ] Vérifier la qualité de l'image :
  - [ ] Texte lisible
  - [ ] Couleurs correctes
  - [ ] Équipes bien affichées
  - [ ] Branding "TeamShuffle" visible

**Résultat attendu** :
- Screenshot de haute qualité
- Partage fonctionne vers n'importe quelle app
- Image contient toutes les infos

### 6. Sauvegarde (1 min)
- [ ] Cliquer "💾 Sauvegarder dans l'historique"
- [ ] Message "Sauvegardé !" apparaît
- [ ] Cliquer OK
- [ ] Retour à l'accueil

**Résultat attendu** :
- Message de confirmation
- Redirection vers l'accueil

### 7. Historique (2 min)
- [ ] Cliquer "Historique"
- [ ] La session apparaît dans la liste
- [ ] Voir date, joueurs, méthode
- [ ] Cliquer "👁️ Voir"
- [ ] Les mêmes équipes s'affichent
- [ ] Revenir à l'historique
- [ ] Tester la suppression (bouton 🗑️)

**Résultat attendu** :
- Historique sauvegardé
- Sessions rechargeables
- Suppression fonctionne

### 8. Persistence (1 min)
- [ ] Fermer complètement l'app
- [ ] Relancer l'app
- [ ] Aller dans "Mes Joueurs"
- [ ] Les joueurs sont toujours là
- [ ] Aller dans "Historique"
- [ ] L'historique est toujours là

**Résultat attendu** :
- Toutes les données sont conservées
- AsyncStorage fonctionne

---

## 🐛 Problèmes Possibles

### Les styles ne s'appliquent pas
**Symptôme** : Texte noir sur fond blanc, pas de couleurs
**Solution** :
```bash
# Arrêter le serveur (Ctrl+C)
npx expo start --clear
```

### Erreur au lancement
**Symptôme** : "Unable to resolve module"
**Solution** :
```bash
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start --clear
```

### Le partage ne fonctionne pas
**Symptôme** : Erreur "Partage non disponible"
**Solution** : Tester sur un vrai appareil (pas émulateur)

### Les données ne se sauvegardent pas
**Symptôme** : Joueurs/historique disparaissent
**Solution** :
1. Vérifier la console pour erreurs AsyncStorage
2. Fermer proprement l'app avant de relancer

---

## 📊 Résultats Attendus

### Performance
- ⚡ Génération d'équipes : < 1 seconde
- ⚡ Navigation : instantanée
- ⚡ Partage : 1-2 secondes
- ⚡ Pas de lag

### Qualité
- ✅ Pas de bugs visuels
- ✅ Texte lisible
- ✅ Couleurs correctes
- ✅ Animations fluides
- ✅ Boutons réactifs

### Fonctionnalités
- ✅ Toutes les features marchent
- ✅ Persistence OK
- ✅ Partage OK
- ✅ Pas de crash

---

## 🎯 Test Complet = 10 minutes

Si tous les tests passent, **l'app est prête** ! ✅

---

## 📝 Rapport de Bug (si nécessaire)

Si tu trouves un bug :

1. **Noter** :
   - Ce que tu faisais
   - Ce qui s'est passé
   - Ce qui aurait dû se passer

2. **Console** :
   - Ouvrir le terminal
   - Copier les erreurs rouges

3. **Screenshot** :
   - Prendre une capture d'écran

---

## 🎉 Félicitations !

Si tous les tests sont **✅**, ton application TeamShuffle est **100% fonctionnelle** !

Tu peux maintenant :
1. **Utiliser l'app** pour de vraies parties de foot
2. **Partager** les équipes avec tes amis
3. **Ajouter** des animations (étape suivante)

---

**Bon test !** 🧪⚽
