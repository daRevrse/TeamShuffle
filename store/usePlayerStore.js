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
        avatarId: 1,
        jerseyNumber: null,
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
              avatarId: playerData.avatarId || 1,
              jerseyNumber: playerData.jerseyNumber || null,
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

      // Ajouter l'utilisateur comme joueur dans le groupe actif
      addMyselfToGroup: () =>
        set((state) => {
          const { userProfile, activeGroupId, players } = state;

          // Vérifier si l'utilisateur n'existe pas déjà dans le groupe
          const alreadyExists = players.some(
            (p) => p.id === userProfile.id && (p.groupId || "default") === activeGroupId
          );

          if (alreadyExists) {
            return state; // Ne rien faire si déjà présent
          }

          // Ajouter l'utilisateur comme joueur
          return {
            players: [
              ...players,
              {
                ...userProfile,
                groupId: activeGroupId || "default",
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }),
    }),
    {
      name: "teamshuffle-storage-v2",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
