/**
 * TeamGenerator - Algorithmes de génération d'équipes (Multi-teams)
 */

// Fonction shuffle externe pour éviter les bugs de contexte "this"
const shuffleArray = (array) => {
  if (!array) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export class TeamGenerator {
  // Initialiser N équipes vides
  static initTeams(nbTeams) {
    return Array.from({ length: nbTeams }, () => []);
  }

  // Formater le résultat en objet { teamA, teamB, ... }
  static formatResult(teamsArray) {
    const keys = ["teamA", "teamB", "teamC", "teamD"];
    const result = {};
    teamsArray.forEach((team, index) => {
      if (keys[index]) result[keys[index]] = team;
    });
    return result;
  }

  // --- MODE ALÉATOIRE ---
  static generateRandom(players, nbTeams) {
    const shuffled = shuffleArray(players);
    const teams = this.initTeams(nbTeams);

    shuffled.forEach((player, index) => {
      const teamIndex = index % nbTeams;
      teams[teamIndex].push(player);
    });

    return this.formatResult(teams);
    // throw new Error("Mode 'Aléatoire' bientôt disponible !");
  }

  // --- MODE ÉQUILIBRÉ ---
  static generateBalanced(players, nbTeams) {
    const sorted = [...players].sort((a, b) => (b.level || 3) - (a.level || 3));
    const teams = this.initTeams(nbTeams);

    sorted.forEach((player) => {
      // Trouver l'équipe avec le moins de joueurs
      let minSize = Math.min(...teams.map((t) => t.length));
      let candidateTeams = teams.filter((t) => t.length === minSize);

      // Parmi elles, celle avec le niveau total le plus bas
      candidateTeams.sort((a, b) => {
        const sumA = a.reduce((sum, p) => sum + (p.level || 3), 0);
        const sumB = b.reduce((sum, p) => sum + (p.level || 3), 0);
        return sumA - sumB;
      });

      candidateTeams[0].push(player);
    });

    return this.formatResult(teams);
  }

  // --- MODE PAR POSTES ---
  static generateByPosition(players, nbTeams) {
    const positions = ["G", "D", "M", "A"];
    const teams = this.initTeams(nbTeams);

    // 1. Assigner par poste (si existant)
    positions.forEach((pos) => {
      const pList = players.filter((p) => p.position === pos);
      const shuffled = shuffleArray(pList);
      shuffled.forEach((player, index) => {
        const offset = positions.indexOf(pos);
        const teamIndex = (index + offset) % nbTeams;
        teams[teamIndex].push(player);
      });
    });

    // 2. Gérer les joueurs SANS position
    const assignedIds = new Set(teams.flat().map((p) => p.id));
    const others = players.filter((p) => !assignedIds.has(p.id));

    // PATCH : éviter crash si others contient undefined
    others
      .filter((p) => p && p.id)
      .forEach((player) => {
        let target = teams.reduce((a, b) => (a.length <= b.length ? a : b));
        target.push(player);
      });

    return this.formatResult(teams);
  }

  // --- POINT D'ENTRÉE ---
  static generate(players, method = "balanced", nbTeams = 2) {
    if (!players || players.length < nbTeams) {
      throw new Error(
        `Il faut au moins ${nbTeams} joueurs pour faire ${nbTeams} équipes.`
      );
    }

    switch (method) {
      case "random":
        return this.generateRandom(players, nbTeams);
      case "position":
        return this.generateByPosition(players, nbTeams);
      case "balanced":
      default:
        return this.generateBalanced(players, nbTeams);
    }
  }
}
