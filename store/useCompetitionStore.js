import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  generateLeagueMatches,
  generatePools,
  generatePoolMatches,
  calculateStandings,
  getQualifiedTeams,
  generateKnockoutMatches,
  generateNextKnockoutRound,
} from "../utils/matchGenerator";

/**
 * Store pour gérer les compétitions/tournois
 * Supporte deux formats: Ligue et Poules+Élimination
 */

export const useCompetitionStore = create(
  persist(
    (set, get) => ({
      competitions: [], // Historique des compétitions terminées
      currentCompetition: null, // Compétition en cours

      /**
       * Créer une nouvelle compétition
       * @param {Object} config - Configuration du tournoi
       */
      createCompetition: (config) => {
        const {
          name,
          format, // "league" | "pools"
          nbTeams,
          teamNames, // { team1: "Les Lions", team2: "Les Tigres", ... }
          poolCount, // Nombre de poules (si format pools)
          qualifiedPerPool, // Nombre de qualifiés par poule
        } = config;

        // Générer les clés d'équipes (team1, team2, ...)
        const teamKeys = Array.from({ length: nbTeams }, (_, i) => `team${i + 1}`);

        // Structure de base
        const competition = {
          id: Date.now().toString(),
          name,
          format,
          phase: format === "league" ? "league" : "pools", // pools | knockout | finished
          createdAt: new Date().toISOString(),
          nbTeams,
          teamNames,
          teams: teamKeys.reduce((acc, key) => {
            acc[key] = { name: teamNames[key], players: [] };
            return acc;
          }, {}),
        };

        if (format === "league") {
          // MODE LIGUE
          competition.matches = generateLeagueMatches(teamKeys);
          competition.standings = {};
          teamKeys.forEach((key) => {
            competition.standings[key] = {
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
        } else {
          // MODE POULES + ÉLIMINATION
          const pools = generatePools(teamKeys, poolCount);
          const poolMatches = generatePoolMatches(pools);

          competition.poolCount = poolCount;
          competition.qualifiedPerPool = qualifiedPerPool;
          competition.pools = pools;
          competition.poolMatches = poolMatches;
          competition.poolStandings = {};

          // Initialiser les classements par poule
          Object.keys(pools).forEach((poolKey) => {
            competition.poolStandings[poolKey] = {};
            pools[poolKey].forEach((teamKey) => {
              competition.poolStandings[poolKey][teamKey] = {
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
          });

          competition.knockoutMatches = [];
          competition.currentKnockoutRound = null;
        }

        set({ currentCompetition: competition });
      },

      /**
       * Mettre à jour le nom d'une équipe
       */
      updateTeamName: (teamKey, newName) => {
        set((state) => {
          if (!state.currentCompetition) return state;

          return {
            currentCompetition: {
              ...state.currentCompetition,
              teamNames: {
                ...state.currentCompetition.teamNames,
                [teamKey]: newName,
              },
              teams: {
                ...state.currentCompetition.teams,
                [teamKey]: {
                  ...state.currentCompetition.teams[teamKey],
                  name: newName,
                },
              },
            },
          };
        });
      },

      /**
       * Enregistrer le score d'un match en mode Ligue
       */
      updateLeagueMatch: (matchId, scoreA, scoreB) => {
        set((state) => {
          if (!state.currentCompetition) return state;

          const matches = state.currentCompetition.matches.map((m) => {
            if (m.id === matchId) {
              return {
                ...m,
                scoreA,
                scoreB,
                status: "played",
                winner:
                  scoreA > scoreB
                    ? m.teamA
                    : scoreB > scoreA
                    ? m.teamB
                    : "draw",
              };
            }
            return m;
          });

          // Recalculer le classement
          const teamKeys = Object.keys(state.currentCompetition.teams);
          const standings = calculateStandings(matches, teamKeys);

          return {
            currentCompetition: {
              ...state.currentCompetition,
              matches,
              standings,
            },
          };
        });
      },

      /**
       * Enregistrer le score d'un match de poule
       */
      updatePoolMatch: (poolKey, matchId, scoreA, scoreB) => {
        set((state) => {
          if (!state.currentCompetition) return state;

          const poolMatches = { ...state.currentCompetition.poolMatches };
          poolMatches[poolKey] = poolMatches[poolKey].map((m) => {
            if (m.id === matchId) {
              return {
                ...m,
                scoreA,
                scoreB,
                status: "played",
                winner:
                  scoreA > scoreB
                    ? m.teamA
                    : scoreB > scoreA
                    ? m.teamB
                    : "draw",
              };
            }
            return m;
          });

          // Recalculer le classement de cette poule
          const poolStandings = { ...state.currentCompetition.poolStandings };
          const teamKeys = state.currentCompetition.pools[poolKey];
          poolStandings[poolKey] = calculateStandings(
            poolMatches[poolKey],
            teamKeys
          );

          return {
            currentCompetition: {
              ...state.currentCompetition,
              poolMatches,
              poolStandings,
            },
          };
        });
      },

      /**
       * Passer à la phase d'élimination directe
       */
      startKnockoutPhase: () => {
        set((state) => {
          if (!state.currentCompetition) return state;

          const { poolStandings, qualifiedPerPool } = state.currentCompetition;
          const qualified = getQualifiedTeams(poolStandings, qualifiedPerPool);
          const knockoutMatches = generateKnockoutMatches(qualified);

          // Déterminer le round
          let currentRound = "";
          if (qualified.length === 16) currentRound = "round16";
          else if (qualified.length === 8) currentRound = "quarter";
          else if (qualified.length === 4) currentRound = "semi";
          else if (qualified.length === 2) currentRound = "final";

          return {
            currentCompetition: {
              ...state.currentCompetition,
              phase: "knockout",
              knockoutMatches,
              currentKnockoutRound: currentRound,
            },
          };
        });
      },

      /**
       * Enregistrer le vainqueur d'un match d'élimination
       */
      updateKnockoutMatch: (matchId, winner) => {
        set((state) => {
          if (!state.currentCompetition) return state;

          const knockoutMatches = state.currentCompetition.knockoutMatches.map(
            (m) => {
              if (m.id === matchId) {
                return { ...m, winner, status: "played" };
              }
              return m;
            }
          );

          return {
            currentCompetition: {
              ...state.currentCompetition,
              knockoutMatches,
            },
          };
        });
      },

      /**
       * Passer au tour suivant en phase élimination
       */
      advanceKnockoutRound: () => {
        set((state) => {
          if (!state.currentCompetition) return state;

          const { currentKnockoutRound, knockoutMatches } =
            state.currentCompetition;

          // Récupérer les matchs du tour actuel
          const currentRoundMatches = knockoutMatches.filter(
            (m) => m.round === currentKnockoutRound
          );

          // Vérifier que tous les matchs sont joués
          const allPlayed = currentRoundMatches.every((m) => m.winner);
          if (!allPlayed) return state;

          // Déterminer le tour suivant
          let nextRound = "";
          if (currentKnockoutRound === "round16") nextRound = "quarter";
          else if (currentKnockoutRound === "quarter") nextRound = "semi";
          else if (currentKnockoutRound === "semi") nextRound = "final";
          else if (currentKnockoutRound === "final") {
            // Tournoi terminé
            return {
              currentCompetition: {
                ...state.currentCompetition,
                phase: "finished",
              },
            };
          }

          // Générer les matchs du tour suivant
          const nextMatches = generateNextKnockoutRound(
            currentRoundMatches,
            nextRound
          );

          return {
            currentCompetition: {
              ...state.currentCompetition,
              knockoutMatches: [...knockoutMatches, ...nextMatches],
              currentKnockoutRound: nextRound,
            },
          };
        });
      },

      /**
       * Terminer la compétition (mode Ligue)
       */
      finishLeagueCompetition: () => {
        set((state) => {
          if (!state.currentCompetition) return state;

          return {
            currentCompetition: {
              ...state.currentCompetition,
              phase: "finished",
              finishedAt: new Date().toISOString(),
            },
          };
        });
      },

      /**
       * Sauvegarder la compétition dans l'historique
       * Si terminée, retire de currentCompetition
       * Si en cours, garde dans currentCompetition et sauvegarde dans l'historique
       */
      saveCompetition: () => {
        set((state) => {
          if (!state.currentCompetition) return state;

          const isFinished = state.currentCompetition.phase === "finished";

          // Si déjà dans l'historique, la mettre à jour
          const existingIndex = state.competitions.findIndex(
            (c) => c.id === state.currentCompetition.id
          );

          let newCompetitions;
          if (existingIndex >= 0) {
            // Mettre à jour l'existant
            newCompetitions = [...state.competitions];
            newCompetitions[existingIndex] = {
              ...state.currentCompetition,
              savedAt: new Date().toISOString(),
            };
          } else {
            // Ajouter nouveau
            newCompetitions = [
              { ...state.currentCompetition, savedAt: new Date().toISOString() },
              ...state.competitions,
            ];
          }

          return {
            competitions: newCompetitions,
            currentCompetition: isFinished ? null : state.currentCompetition,
          };
        });
      },

      /**
       * Charger une compétition depuis l'historique
       * Seuls les tournois terminés sont en lecture seule
       */
      loadCompetition: (competitionId) => {
        set((state) => {
          const competition = state.competitions.find(
            (c) => c.id === competitionId
          );
          if (competition) {
            // Déplacer vers currentCompetition et retirer de l'historique si pas terminé
            if (competition.phase === "finished") {
              return { currentCompetition: { ...competition, isReadOnly: true } };
            } else {
              // Tournoi en cours - le déplacer de l'historique vers currentCompetition
              return {
                currentCompetition: { ...competition },
                competitions: state.competitions.filter((c) => c.id !== competitionId),
              };
            }
          }
          return state;
        });
      },

      /**
       * Supprimer une compétition de l'historique
       */
      deleteCompetition: (competitionId) => {
        set((state) => ({
          competitions: state.competitions.filter(
            (c) => c.id !== competitionId
          ),
        }));
      },

      /**
       * Annuler la compétition en cours
       */
      clearCurrentCompetition: () => {
        set({ currentCompetition: null });
      },
    }),
    {
      name: "teamshuffle-competitions-v2",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
