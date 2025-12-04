import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSessionStore = create(
  persist(
    (set, get) => ({
      // Historique des sessions
      sessions: [],

      // Session courante (avant sauvegarde dans l'historique)
      currentSession: null,

      // Créer une nouvelle session
      createSession: (players, teams, method) => {
        const session = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          players: players,
          teams: teams,
          method: method,
          stats: {
            avgLevelTeamA: calculateAverage(teams.teamA),
            avgLevelTeamB: calculateAverage(teams.teamB),
            difference: Math.abs(
              calculateAverage(teams.teamA) - calculateAverage(teams.teamB)
            ),
          },
        };

        set({ currentSession: session });
        return session;
      },

      // Sauvegarder la session courante dans l'historique
      saveToHistory: () => {
        const { currentSession, sessions } = get();
        if (currentSession) {
          set({
            sessions: [currentSession, ...sessions],
          });
        }
      },

      // Charger une session depuis l'historique
      loadSession: (sessionId) => {
        const { sessions } = get();
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
          set({ currentSession: session });
        }
      },

      // Supprimer une session de l'historique
      deleteSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
        }));
      },

      // Tout effacer
      clearHistory: () => {
        set({ sessions: [], currentSession: null });
      },

      // Réinitialiser la session courante
      resetCurrentSession: () => {
        set({ currentSession: null });
      },
    }),
    {
      name: "teamshuffle-sessions",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Fonction utilitaire pour calculer la moyenne des niveaux
function calculateAverage(team) {
  if (!team || team.length === 0) return 0;
  const total = team.reduce((sum, player) => sum + (player.level || 0), 0);
  return Math.round((total / team.length) * 10) / 10; // Arrondi à 1 décimale
}
