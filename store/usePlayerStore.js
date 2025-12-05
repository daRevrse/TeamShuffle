import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      players: [],
      // 1. Gestion des Groupes
      groups: [{ id: "default", name: "Général", isDefault: true }],
      activeGroupId: "default",

      // 2. Mon Profil
      userProfile: {
        name: "Moi",
        level: 3,
        position: "M",
        id: "me_" + Date.now(),
      },

      // --- ACTIONS GROUPES ---

      addGroup: (name) =>
        set((state) => ({
          groups: [
            ...state.groups,
            { id: Date.now().toString(), name, isDefault: false },
          ],
          activeGroupId: Date.now().toString(),
        })),

      deleteGroup: (groupId) =>
        set((state) => {
          if (groupId === "default") return state;

          const updatedPlayers = state.players.map((p) =>
            p.groupId === groupId ? { ...p, groupId: "default" } : p
          );

          return {
            groups: state.groups.filter((g) => g.id !== groupId),
            players: updatedPlayers,
            activeGroupId: "default",
          };
        }),

      setActiveGroup: (id) => set({ activeGroupId: id }),

      updateUserProfile: (data) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...data },
        })),

      // --- ACTIONS JOUEURS ---

      addPlayer: (playerData) =>
        set((state) => ({
          players: [
            ...state.players,
            {
              id: Date.now().toString(),
              name: playerData.name,
              level: playerData.level || 3,
              position: playerData.position || "M",
              groupId: playerData.groupId || state.activeGroupId || "default",
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updatePlayer: (id, updatedData) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === id ? { ...p, ...updatedData } : p
          ),
        })),

      removePlayer: (id) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
        })),

      // NOUVEAU : Tout effacer (Factory Reset des données joueurs)
      resetAllPlayers: () =>
        set({
          players: [],
          groups: [{ id: "default", name: "Général", isDefault: true }],
          activeGroupId: "default",
        }),

      getActivePlayers: () => {
        const { players, activeGroupId } = get();
        return players.filter(
          (p) => (p.groupId || "default") === activeGroupId
        );
      },
    }),
    {
      name: "teamshuffle-storage-v2",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
