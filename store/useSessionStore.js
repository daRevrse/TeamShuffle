import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Fonction utilitaire locale
function calculateAverage(team) {
  if (!team || team.length === 0) return 0;
  const total = team.reduce((sum, player) => sum + (player.level || 3), 0);
  return Math.round((total / team.length) * 10) / 10;
}

export const useSessionStore = create(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,

      createSession: (players, teams, method) => {
        const teamsArray = Object.values(teams);
        const averages = teamsArray.map((t) => calculateAverage(t));
        const maxAvg = Math.max(...averages);
        const minAvg = Math.min(...averages);

        const stats = {
          // Génère avgLevelTeamA, avgLevelTeamB, etc.
          ...Object.keys(teams).reduce((acc, key, index) => {
            acc[`avgLevel${key.charAt(0).toUpperCase() + key.slice(1)}`] =
              averages[index];
            return acc;
          }, {}),
          difference: Math.round((maxAvg - minAvg) * 10) / 10,
        };

        const session = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          players,
          teams,
          method,
          stats,
        };

        set({ currentSession: session });
      },

      saveToHistory: () => {
        const { currentSession, sessions } = get();
        if (
          currentSession &&
          !sessions.find((s) => s.id === currentSession.id)
        ) {
          set({ sessions: [currentSession, ...sessions] });
        }
      },

      loadSession: (sessionId) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (session) set({ currentSession: session });
      },

      deleteSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
        }));
      },

      clearHistory: () => set({ sessions: [], currentSession: null }),
    }),
    {
      name: "teamshuffle-sessions-v3", // Nouvelle version
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
