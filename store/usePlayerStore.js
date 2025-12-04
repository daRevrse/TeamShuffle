import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      players: [],

      // Ajouter un joueur [cite: 21, 22, 23]
      addPlayer: (playerData) =>
        set((state) => ({
          players: [
            ...state.players,
            {
              id: Date.now().toString(), // ID unique simple
              name: playerData.name,
              level: playerData.level || 3, // Par défaut niveau moyen (3)
              position: playerData.position || "M", // G, D, M, A
              photo: playerData.photo || null,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      // Modifier un joueur
      updatePlayer: (id, updatedData) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === id ? { ...p, ...updatedData } : p
          ),
        })),

      // Supprimer un joueur
      removePlayer: (id) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
        })),

      // Utile pour le mode équilibré [cite: 33, 98]
      getAverageLevel: () => {
        const { players } = get();
        if (players.length === 0) return 0;
        const total = players.reduce((sum, p) => sum + (p.level || 0), 0);
        return total / players.length;
      },
    }),
    {
      name: "teamshuffle-storage", // Nom de la clé de sauvegarde
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
