/**
 * TeamGenerator - Algorithmes de génération d'équipes
 * 3 méthodes disponibles : random, balanced, position
 */

export class TeamGenerator {
  /**
   * Mélange un tableau de manière aléatoire (Fisher-Yates shuffle)
   */
  static shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Calcule le niveau moyen d'une équipe
   */
  static calculateAverageLevel(team) {
    if (!team || team.length === 0) return 0;
    const total = team.reduce((sum, player) => sum + (player.level || 0), 0);
    return Math.round((total / team.length) * 10) / 10;
  }

  /**
   * MÉTHODE 1 : Génération ALÉATOIRE
   * Distribution totalement random
   */
  static generateRandom(players) {
    const shuffled = this.shuffle(players);
    const midPoint = Math.ceil(shuffled.length / 2);

    return {
      teamA: shuffled.slice(0, midPoint),
      teamB: shuffled.slice(midPoint),
    };
  }

  /**
   * MÉTHODE 2 : Génération ÉQUILIBRÉE
   * Trie par niveau et distribue alternativement
   */
  static generateBalanced(players) {
    // Trier par niveau décroissant
    const sorted = [...players].sort((a, b) => (b.level || 0) - (a.level || 0));

    const teamA = [];
    const teamB = [];

    // Distribution snake draft (1→2, 2→1, 1→2, etc.)
    sorted.forEach((player, index) => {
      const teamALevel = this.calculateAverageLevel(teamA) * teamA.length;
      const teamBLevel = this.calculateAverageLevel(teamB) * teamB.length;

      // Ajouter au team qui a le niveau total le plus faible
      if (teamA.length === teamB.length) {
        // Si même nombre, alterner en commençant par teamA
        if (Math.floor(index / 2) % 2 === 0) {
          teamA.push(player);
        } else {
          teamB.push(player);
        }
      } else if (teamALevel <= teamBLevel) {
        teamA.push(player);
      } else {
        teamB.push(player);
      }
    });

    return { teamA, teamB };
  }

  /**
   * MÉTHODE 3 : Génération PAR POSTES
   * Distribution équitable des postes (G, D, M, A)
   */
  static generateByPosition(players) {
    const positions = ["G", "D", "M", "A"];
    const teamA = [];
    const teamB = [];

    // Pour chaque poste, distribuer alternativement
    positions.forEach((position) => {
      const positionPlayers = players.filter((p) => p.position === position);
      const shuffled = this.shuffle(positionPlayers);

      shuffled.forEach((player, index) => {
        if (index % 2 === 0) {
          teamA.push(player);
        } else {
          teamB.push(player);
        }
      });
    });

    // Vérifier si tous les joueurs sont assignés
    const assigned = [...teamA, ...teamB];
    const unassigned = players.filter(
      (p) => !assigned.find((ap) => ap.id === p.id)
    );

    // Distribuer les non-assignés (cas rare)
    unassigned.forEach((player, index) => {
      if (index % 2 === 0) {
        teamA.push(player);
      } else {
        teamB.push(player);
      }
    });

    return { teamA, teamB };
  }

  /**
   * FONCTION PRINCIPALE
   * Génère les équipes selon la méthode choisie
   */
  static generate(players, method = "balanced") {
    if (!players || players.length < 2) {
      throw new Error("Il faut au moins 2 joueurs pour créer des équipes");
    }

    switch (method) {
      case "random":
        return this.generateRandom(players);
      case "balanced":
        return this.generateBalanced(players);
      case "position":
        return this.generateByPosition(players);
      default:
        return this.generateBalanced(players);
    }
  }

  /**
   * UTILITAIRE : Calculer la différence de niveau entre 2 équipes
   */
  static calculateDifference(teamA, teamB) {
    const avgA = this.calculateAverageLevel(teamA);
    const avgB = this.calculateAverageLevel(teamB);
    return Math.abs(avgA - avgB);
  }

  /**
   * UTILITAIRE : Obtenir des statistiques sur les équipes générées
   */
  static getTeamsStats(teamA, teamB) {
    return {
      teamA: {
        count: teamA.length,
        avgLevel: this.calculateAverageLevel(teamA),
        positions: this.countPositions(teamA),
      },
      teamB: {
        count: teamB.length,
        avgLevel: this.calculateAverageLevel(teamB),
        positions: this.countPositions(teamB),
      },
      difference: this.calculateDifference(teamA, teamB),
    };
  }

  /**
   * UTILITAIRE : Compter le nombre de joueurs par poste
   */
  static countPositions(team) {
    return team.reduce((acc, player) => {
      const pos = player.position || "Unknown";
      acc[pos] = (acc[pos] || 0) + 1;
      return acc;
    }, {});
  }
}
