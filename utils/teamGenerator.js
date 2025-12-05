/**
 * FONCTIONS UTILITAIRES (HORS CLASSE)
 * Cela évite les bugs de contexte "this" qui font planter l'app
 */

const shuffleArray = (array) => {
  if (!array) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const calculateAvg = (team) => {
  if (!team || team.length === 0) return 0;
  // On utilise une valeur par défaut (3) si le niveau est manquant
  const total = team.reduce((sum, player) => sum + (player.level || 3), 0);
  return Math.round((total / team.length) * 10) / 10;
};

/**
 * GÉNÉRATEUR D'ÉQUIPES
 */
export class TeamGenerator {
  // --- MODE ALÉATOIRE ---
  static generateRandom(players) {
    const shuffled = shuffleArray(players);
    const midPoint = Math.ceil(shuffled.length / 2);

    return {
      teamA: shuffled.slice(0, midPoint),
      teamB: shuffled.slice(midPoint),
    };
  }

  // --- MODE ÉQUILIBRÉ ---
  static generateBalanced(players) {
    // Tri décroissant par niveau
    const sorted = [...players].sort((a, b) => (b.level || 3) - (a.level || 3));
    const teamA = [];
    const teamB = [];

    // Distribution intelligente (Snake Draft amélioré)
    sorted.forEach((player) => {
      const sumA = teamA.reduce((s, p) => s + (p.level || 3), 0);
      const sumB = teamB.reduce((s, p) => s + (p.level || 3), 0);

      // 1. Équilibrer le nombre de joueurs en priorité
      if (teamA.length < teamB.length) {
        teamA.push(player);
      } else if (teamB.length < teamA.length) {
        teamB.push(player);
      } else {
        // 2. Si égalité numérique, équilibrer le niveau total
        if (sumA <= sumB) teamA.push(player);
        else teamB.push(player);
      }
    });

    return { teamA, teamB };
  }

  // --- MODE PAR POSTES ---
  static generateByPosition(players) {
    const positions = ["G", "D", "M", "A"];
    const teamA = [];
    const teamB = [];

    // Pour chaque poste, on mélange et on distribue
    positions.forEach((pos) => {
      const pList = players.filter((p) => p.position === pos);
      const shuffled = shuffleArray(pList);

      shuffled.forEach((player, index) => {
        if (index % 2 === 0) teamA.push(player);
        else teamB.push(player);
      });
    });

    // Gestion des joueurs sans poste ou non assignés
    const assignedIds = new Set([...teamA, ...teamB].map((p) => p.id));
    const others = players.filter((p) => !assignedIds.has(p.id));

    others.forEach((player) => {
      if (teamA.length <= teamB.length) teamA.push(player);
      else teamB.push(player);
    });

    return { teamA, teamB };
  }

  // --- POINT D'ENTRÉE ---
  static generate(players, method = "balanced") {
    if (!players || players.length < 2) {
      throw new Error("Il faut au moins 2 joueurs pour générer des équipes.");
    }

    switch (method) {
      case "random":
        return this.generateRandom(players);
      case "position":
        return this.generateByPosition(players);
      case "balanced":
      default:
        return this.generateBalanced(players);
    }
  }
}
