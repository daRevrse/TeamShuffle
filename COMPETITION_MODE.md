# Mode Compétition - Documentation

## Vue d'ensemble

Le mode compétition permet de créer et gérer des tournois complets avec 2 à 16 équipes.

## Fonctionnalités

### 1. Création de tournoi (3 étapes)
- **Étape 1**: Choisir le nombre d'équipes (2-16)
- **Étape 2**: Personnaliser les noms des équipes
- **Étape 3**: Choisir le format (Ligue ou Poules + Élimination)

### 2. Formats disponibles

#### Mode Ligue (2-16 équipes)
- Tous contre tous (round-robin)
- **Calendrier par journées**: Les matchs sont organisés intelligemment pour que chaque équipe joue une fois par journée
- Classement en temps réel (points, différence de buts)
- Algorithme de rotation circulaire pour équilibrer les matchs
- Gestion automatique des équipes impaires (système de "bye")

#### Mode Poules + Élimination (6-16 équipes)
- **Phase de poules**:
  - 2 ou 4 poules configurables
  - Tous contre tous dans chaque poule
  - Classement par poule
  - Choix du nombre de qualifiés par poule (1-4)

- **Phase à élimination directe**:
  - Génération automatique du tableau
  - Sélection du vainqueur (pas de score nécessaire)
  - Progression automatique entre les tours:
    - Huitièmes → Quarts → Demi → Finale
  - Tournoi terminé automatiquement après la finale

### 3. Gestion des matchs

#### Mode Ligue
- Affichage par journées (comme un vrai championnat)
- Badge de progression par journée (X/Y matchs)
- Indicateur visuel: vert quand tous les matchs d'une journée sont joués
- Enregistrement des scores (0-99)
- Mise à jour automatique du classement

#### Mode Poules
- Organisation par poule (A, B, C, D)
- Classement indépendant par poule
- Bouton pour passer en phase éliminatoire

#### Mode Knockout
- Affichage des matchs du tour en cours
- Sélection simple du vainqueur (2 boutons colorés)
- Bouton "Tour suivant" automatique quand tous les matchs sont terminés

### 4. Historique des tournois

Cartes améliorées avec:
- Bande de couleur distinctive (bleu = Ligue, orange = Poules)
- Icône du format
- Date et heure de création
- Badge de statut (En cours / Terminé)
- **Statistiques détaillées**:
  - Nombre d'équipes
  - Matchs joués / Total
  - Barre de progression
- **Informations contextuelles**:
  - Phase actuelle si en cours
  - Nom du vainqueur si terminé (mode ligue)
- Bouton de suppression pour les tournois terminés

## Algorithmes

### Génération des journées (Round-Robin)
```
Exemple avec 4 équipes (A, B, C, D):

Journée 1: A-B, C-D
Journée 2: A-C, D-B
Journée 3: A-D, B-C

→ Chaque équipe joue contre toutes les autres une fois
→ Chaque équipe joue une fois par journée maximum
```

### Calcul du classement
- Victoire: 3 points
- Match nul: 1 point
- Défaite: 0 point
- Tri: Points → Différence de buts → Buts marqués

## Structure des données

### Compétition
```javascript
{
  id: "timestamp",
  name: "Nom du tournoi",
  format: "league" | "pools",
  phase: "league" | "pools" | "knockout" | "finished",
  nbTeams: 4,
  teamNames: { team1: "Les Lions", team2: "Les Tigres", ... },

  // Mode Ligue
  matches: [{ id, round, teamA, teamB, scoreA, scoreB, status }],
  standings: { team1: { points, wins, draws, losses, ... } },

  // Mode Poules
  pools: { poolA: ["team1", "team2"], poolB: [...] },
  poolMatches: { poolA: [...], poolB: [...] },
  poolStandings: { poolA: {...}, poolB: {...} },

  // Mode Knockout
  knockoutMatches: [{ id, round, teamA, teamB, winner, status }],
  currentKnockoutRound: "quarter" | "semi" | "final"
}
```

## Fichiers principaux

- `app/competition/index.js` - Accueil + Historique
- `app/competition/setup.js` - Configuration en 3 étapes
- `app/competition/manage.js` - Gestion du tournoi
- `store/useCompetitionStore.js` - État global
- `utils/matchGenerator.js` - Algorithmes de génération

## Notes de développement

### Améliorations apportées (18/12/2025)

1. **Système de journées intelligent**
   - Algorithme round-robin pour organiser les matchs
   - Chaque équipe joue une fois par journée
   - Gestion automatique des nombres impairs d'équipes

2. **Interface historique premium**
   - Design de carte moderne avec bande de couleur
   - Statistiques détaillées et barre de progression
   - Affichage du vainqueur pour les tournois terminés
   - Meilleure hiérarchie visuelle des informations

3. **UX améliorée**
   - Badges de progression par journée
   - Indicateurs visuels clairs (vert = terminé)
   - Boutons contextuels pour chaque phase
   - Prévention des erreurs avec validations

## Tests recommandés

1. Créer un tournoi en mode Ligue avec 4 équipes
2. Vérifier que les journées affichent bien les matchs groupés
3. Jouer tous les matchs d'une journée → vérifier le badge vert
4. Créer un tournoi en mode Poules avec 8 équipes
5. Terminer les poules et passer en élimination
6. Vérifier que l'historique affiche correctement toutes les infos
