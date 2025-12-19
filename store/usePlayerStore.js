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

      updateGroup: (groupId, name) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId ? { ...g, name } : g
          ),
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

      clearGroup: (groupId) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.groupId === groupId ? { ...p, groupId: "default" } : p
          ),
        })),

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

      // Ajouter l'utilisateur comme joueur dans le groupe actif (crée une copie)
      addMyselfToGroup: () =>
        set((state) => {
          const { userProfile, activeGroupId, players } = state;

          // Vérifier si l'utilisateur n'existe pas déjà dans le groupe
          // On vérifie par nom ET groupe car on peut avoir plusieurs copies
          const alreadyExists = players.some(
            (p) => p.name === userProfile.name &&
                   (p.groupId || "default") === activeGroupId &&
                   p.avatarId === userProfile.avatarId
          );

          if (alreadyExists) {
            return state; // Ne rien faire si déjà présent
          }

          // Créer une copie de l'utilisateur pour ce groupe avec un ID unique
          return {
            players: [
              ...players,
              {
                ...userProfile,
                id: "user_" + Date.now().toString(), // Nouvel ID unique
                groupId: activeGroupId || "default",
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }),

      // Ajouter plusieurs joueurs existants à un groupe (crée des copies)
      addPlayersToGroup: (playerIds, targetGroupId) =>
        set((state) => {
          // Créer des copies des joueurs sélectionnés pour le nouveau groupe
          const newPlayers = [];
          playerIds.forEach((playerId) => {
            const playerToCopy = state.players.find((p) => p.id === playerId);
            if (playerToCopy) {
              newPlayers.push({
                ...playerToCopy,
                id: Date.now().toString() + "_" + playerId, // Nouvel ID unique
                groupId: targetGroupId,
                createdAt: new Date().toISOString(),
              });
            }
          });

          return { players: [...state.players, ...newPlayers] };
        }),

      // Retirer un joueur d'un groupe (supprime cette copie du joueur)
      removePlayerFromGroup: (playerId) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== playerId),
        })),
    }),
    {
      name: "teamshuffle-storage-v2",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
