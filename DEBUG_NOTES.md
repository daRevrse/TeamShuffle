# Notes de débogage

## Problèmes identifiés

### 1. Sélection du niveau (app/players/[id].js)
- **Symptôme** : Les étoiles ne réagissent pas au clic
- **Correctifs appliqués** :
  - Ajout de `console.log` pour tracer les clics (ligne 287)
  - Ajout de `activeOpacity={0.7}` (ligne 293)
  - Ajout de `justify-center` pour améliorer la zone de clic (ligne 290)

**Comment tester** :
1. Ouvrir l'app
2. Aller dans "Effectif"
3. Créer ou modifier un joueur
4. Cliquer sur les étoiles de niveau
5. Vérifier dans la console Metro : doit afficher "Niveau sélectionné: X"
6. Vérifier visuellement : les étoiles doivent changer et le chiffre en haut doit se mettre à jour

### 2. Sélection du mode de génération (app/session/config.js)
- **Symptôme** : Les modes ne se sélectionnent pas
- **Correctifs appliqués** :
  - Ajout de `console.log` dans handleChangeMethod (ligne 87)
  - Ajout de `console.log` dans onPress (ligne 180)
  - Ajout de `activeOpacity={0.7}` (ligne 183)

**Comment tester** :
1. Aller dans "Créer des équipes"
2. Cliquer sur les différents modes (Équilibré, Aléatoire, Par Postes)
3. Vérifier dans la console Metro : doit afficher "Méthode cliquée: random" etc.
4. Vérifier visuellement : la bordure bleue doit changer de carte

## Si ça ne marche toujours pas

### Étape 1 : Vérifier les logs
```bash
npx expo start --clear
```
Puis ouvrir la console Metro et chercher les messages de debug.

### Étape 2 : Vérifier NativeWind
Le problème peut venir de TailwindCSS qui ne compile pas correctement.

### Étape 3 : Tester avec un bouton simple
Créer un bouton de test basique pour voir si TouchableOpacity fonctionne.

## Date : 2025-12-18
