/**
 * Utilitaire pour générer les matchs d'un tournoi
 */

/**
 * Génère tous les matchs pour un format ligue (tous contre tous)
 * Organisés par journées (round-robin) pour que chaque équipe joue une fois par journée
 * @param {Array<string>} teamKeys - ["team1", "team2", "team3", ...]
 * @returns {Array<Object>} Liste des matchs ordonnés par journée
 */
export function generateLeagueMatches(teamKeys) {
  const n = teamKeys.length;
  const matches = [];
  let matchId = 1;

  // Si nombre impair, ajouter une équipe "bye" (repos)
  const teams = [...teamKeys];
  if (n % 2 !== 0) {
    teams.push(null); // null = équipe au repos
  }

  const totalTeams = teams.length;
  const totalRounds = totalTeams - 1;
  const matchesPerRound = totalTeams / 2;

  // Algorithme round-robin (rotation circulaire)
  for (let round = 0; round < totalRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const home = (round + match) % (totalTeams - 1);
      const away = (totalTeams - 1 - match + round) % (totalTeams - 1);

      // La dernière équipe reste fixe
      const teamA = match === 0 ? teams[totalTeams - 1] : teams[home];
      const teamB = teams[away];

      // Ne pas créer de match si une équipe est "bye"
      if (teamA !== null && teamB !== null) {
        matches.push({
          id: `match-${matchId}`,
          matchNumber: matchId,
          round: round + 1, // Journée
          teamA,
          teamB,
          scoreA: null,
          scoreB: null,
          status: "pending", // pending | played
          winner: null,
        });
        matchId++;
      }
    }
  }

  return matches;
}

/**
 * Génère les poules automatiquement
 * @param {Array<string>} teamKeys - Liste des équipes
 * @param {number} poolCount - Nombre de poules (2, 4)
 * @returns {Object} { poolA: [...], poolB: [...], ... }
 */
export function generatePools(teamKeys, poolCount) {
  const shuffled = [...teamKeys].sort(() => Math.random() - 0.5);
  const pools = {};
  const teamsPerPool = Math.ceil(shuffled.length / poolCount);

  const poolNames = ["poolA", "poolB", "poolC", "poolD"];

  for (let i = 0; i < poolCount; i++) {
    const start = i * teamsPerPool;
    const end = start + teamsPerPool;
    pools[poolNames[i]] = shuffled.slice(start, end);
  }

  return pools;
}

/**
 * Génère les matchs pour chaque poule
 * @param {Object} pools - { poolA: [...], poolB: [...] }
 * @returns {Object} { poolA: [matches], poolB: [matches] }
 */
export function generatePoolMatches(pools) {
  const poolMatches = {};

  Object.keys(pools).forEach((poolKey) => {
    poolMatches[poolKey] = generateLeagueMatches(pools[poolKey]);
  });

  return poolMatches;
}

/**
 * Récupère les équipes qualifiées de chaque poule
 * @param {Object} poolStandings - Classements par poule
 * @param {number} qualifiedPerPool - Nombre d'équipes qualifiées par poule
 * @returns {Array<string>} Liste des équipes qualifiées
 */
export function getQualifiedTeams(poolStandings, qualifiedPerPool) {
  const qualified = [];

  Object.keys(poolStandings).forEach((poolKey) => {
    const standings = poolStandings[poolKey];
    // Trier par points, puis différence de buts
    const sorted = Object.keys(standings)
      .map((teamKey) => ({ teamKey, ...standings[teamKey] }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.goalDifference - a.goalDifference;
      });

    // Prendre les N premiers
    for (let i = 0; i < Math.min(qualifiedPerPool, sorted.length); i++) {
      qualified.push(sorted[i].teamKey);
    }
  });

  return qualified;
}

/**
 * Génère le tableau d'élimination directe
 * @param {Array<string>} qualifiedTeams - Équipes qualifiées
 * @returns {Array<Object>} Matchs d'élimination
 */
export function generateKnockoutMatches(qualifiedTeams) {
  const matches = [];
  const teamCount = qualifiedTeams.length;

  // Déterminer le nombre de tours (Quarts, Demi, Finale)
  let round = "";
  if (teamCount === 16) round = "round16";
  else if (teamCount === 8) round = "quarter";
  else if (teamCount === 4) round = "semi";
  else if (teamCount === 2) round = "final";
  else round = "round"; // Round générique

  // Créer les matchs du premier tour
  for (let i = 0; i < teamCount; i += 2) {
    matches.push({
      id: `knockout-${round}-${i / 2 + 1}`,
      round,
      matchNumber: i / 2 + 1,
      teamA: qualifiedTeams[i],
      teamB: qualifiedTeams[i + 1] || null,
      winner: null,
      status: "pending", // pending | played
    });
  }

  return matches;
}

/**
 * Génère le tour suivant en phase éliminatoire
 * @param {Array<Object>} previousRoundMatches - Matchs du tour précédent
 * @param {string} nextRound - Nom du tour suivant
 * @returns {Array<Object>} Matchs du tour suivant
 */
export function generateNextKnockoutRound(previousRoundMatches, nextRound) {
  const winners = previousRoundMatches
    .filter((m) => m.winner)
    .map((m) => m.winner);

  if (winners.length < 2) return [];

  return generateKnockoutMatches(winners).map((m) => ({
    ...m,
    round: nextRound,
    id: `knockout-${nextRound}-${m.matchNumber}`,
  }));
}

/**
 * Calculer le classement à partir des matchs
 * @param {Array<Object>} matches - Liste des matchs
 * @param {Array<string>} teamKeys - Liste des équipes
 * @returns {Object} Classement
 */
export function calculateStandings(matches, teamKeys) {
  const standings = {};

  // Initialiser
  teamKeys.forEach((key) => {
    standings[key] = {
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  // Calculer
  matches
    .filter((m) => m.status === "played" && m.scoreA !== null && m.scoreB !== null)
    .forEach((match) => {
      const { teamA, teamB, scoreA, scoreB } = match;

      standings[teamA].played += 1;
      standings[teamB].played += 1;
      standings[teamA].goalsFor += scoreA;
      standings[teamA].goalsAgainst += scoreB;
      standings[teamB].goalsFor += scoreB;
      standings[teamB].goalsAgainst += scoreA;

      if (scoreA > scoreB) {
        standings[teamA].wins += 1;
        standings[teamA].points += 3;
        standings[teamB].losses += 1;
      } else if (scoreB > scoreA) {
        standings[teamB].wins += 1;
        standings[teamB].points += 3;
        standings[teamA].losses += 1;
      } else {
        standings[teamA].draws += 1;
        standings[teamB].draws += 1;
        standings[teamA].points += 1;
        standings[teamB].points += 1;
      }

      standings[teamA].goalDifference =
        standings[teamA].goalsFor - standings[teamA].goalsAgainst;
      standings[teamB].goalDifference =
        standings[teamB].goalsFor - standings[teamB].goalsAgainst;
    });

  return standings;
}
