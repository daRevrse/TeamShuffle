import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../../store/usePlayerStore";
import { useSessionStore } from "../../store/useSessionStore";
import { TeamGenerator } from "../../utils/teamGenerator";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SessionConfigScreen() {
  const router = useRouter();

  // 1. On récupère les données brutes du store (Stable)
  const allPlayers = usePlayerStore((state) => state.players);
  const activeGroupId = usePlayerStore((state) => state.activeGroupId);
  const groups = usePlayerStore((state) => state.groups);

  const { createSession } = useSessionStore();

  // 2. On filtre avec useMemo pour éviter la boucle infinie
  const players = useMemo(() => {
    const activeId = activeGroupId || "default";
    return allPlayers.filter((p) => (p.groupId || "default") === activeId);
  }, [allPlayers, activeGroupId]);

  // 3. On récupère le nom du groupe actif
  const activeGroupName = useMemo(() => {
    return groups.find((g) => g.id === activeGroupId)?.name || "Général";
  }, [groups, activeGroupId]);

  // États locaux
  const [selectedPlayers, setSelectedPlayers] = useState(new Set());
  const [method, setMethod] = useState("balanced");

  // Définition des modes de jeu
  const methods = [
    {
      id: "balanced",
      name: "Équilibré",
      icon: "options",
      desc: "Niveau égal",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: "random",
      name: "Aléatoire",
      icon: "shuffle",
      desc: "100% Hasard",
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      id: "position",
      name: "Par Postes",
      icon: "football",
      desc: "Structure tactique",
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  // Gestionnaires d'événements
  const togglePlayer = (id) => {
    const next = new Set(selectedPlayers);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedPlayers(next);
  };

  const toggleAll = () => {
    if (selectedPlayers.size === players.length) {
      setSelectedPlayers(new Set());
    } else {
      // On sélectionne uniquement les joueurs du groupe actif
      setSelectedPlayers(new Set(players.map((p) => p.id)));
    }
  };

  const handleGenerate = () => {
    if (selectedPlayers.size < 2) {
      return Alert.alert(
        "Pas assez de joueurs",
        "Sélectionne au moins 2 joueurs pour lancer un match."
      );
    }

    // On filtre pour ne garder que les objets joueurs sélectionnés
    const activePlayers = players.filter((p) => selectedPlayers.has(p.id));

    try {
      // 1. Génération algorithmique
      const teams = TeamGenerator.generate(activePlayers, method);

      // 2. Création de session
      createSession(activePlayers, teams, method);

      // 3. Navigation
      router.push("/session/result");
    } catch (error) {
      console.error("Erreur génération:", error);
      // Affiche le vrai message d'erreur pour aider au debug
      Alert.alert(
        "Oups !",
        error.message ||
          "Une erreur est survenue lors de la création des équipes."
      );
    }
  };

  // Rendu du badge de poste
  const PositionBadge = ({ position }) => {
    const colors = {
      G: "bg-yellow-500",
      D: "bg-blue-500",
      M: "bg-green-500",
      A: "bg-red-500",
    };
    return (
      <View
        className={`${
          colors[position] || "bg-gray-400"
        } w-7 h-7 rounded-full items-center justify-center mr-3`}
      >
        <Text className="text-white font-bold text-xs">{position}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* En-tête Fixe */}
      <View className="bg-white px-4 pt-4 pb-4 rounded-b-[30px] shadow-sm z-10 mb-2">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">
              Configuration
            </Text>
            <Text className="text-3xl font-black text-dark italic tracking-tighter">
              Match <Text className="text-primary">Setup</Text>
            </Text>
            <Text className="text-gray-500 text-xs font-bold">
              Groupe : {activeGroupName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleAll}
            className="bg-gray-100 px-3 py-2 rounded-xl"
          >
            <Text className="text-primary font-bold text-xs">
              {selectedPlayers.size === players.length
                ? "Tout décocher"
                : "Tout cocher"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barre de progression */}
        <View className="bg-gray-100 h-2 rounded-full overflow-hidden mt-1">
          <View
            className="bg-primary h-full rounded-full"
            style={{
              width: `${
                players.length > 0
                  ? (selectedPlayers.size / players.length) * 100
                  : 0
              }%`,
            }}
          />
        </View>
        <Text className="text-right text-xs font-bold text-gray-400 mt-1">
          {selectedPlayers.size} / {players.length} Joueurs prêts
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Section 1 : Mode de Jeu */}
        <Text className="font-bold text-dark text-lg mb-3 mt-2 ml-1">
          Stratégie de tirage
        </Text>
        <View className="flex-row gap-3 mb-6">
          {methods.map((m) => {
            const isActive = method === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                // onPress={() => setMethod(m.id)}
                className={`flex-1 p-3 rounded-2xl border-2 items-center justify-center ${
                  isActive
                    ? "bg-white border-primary shadow-md"
                    : "bg-white border-transparent"
                }`}
              >
                <View className={`${m.bg} p-2 rounded-full mb-2`}>
                  <Ionicons
                    name={m.icon}
                    size={20}
                    color={isActive ? "#007BFF" : "#9CA3AF"}
                  />
                </View>
                <Text
                  className={`font-bold text-xs mb-0.5 ${
                    isActive ? "text-dark" : "text-gray-400"
                  }`}
                >
                  {m.name}
                </Text>
                <Text className="text-[10px] text-gray-400 text-center leading-3">
                  {m.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section 2 : Liste des Joueurs */}
        <Text className="font-bold text-dark text-lg mb-3 ml-1">
          Feuille de match
        </Text>
        {players.length === 0 ? (
          <View className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 items-center">
            <Ionicons name="people-outline" size={48} color="#D1D5DB" />
            <Text className="text-gray-400 font-bold mb-2 mt-2">
              Ce groupe est vide
            </Text>
            <TouchableOpacity onPress={() => router.push("/players")}>
              <Text className="text-primary font-bold">
                + Ajouter dans {activeGroupName}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white rounded-2xl p-2 shadow-sm">
            {players.map((player) => {
              const isSelected = selectedPlayers.has(player.id);
              return (
                <TouchableOpacity
                  key={player.id}
                  onPress={() => togglePlayer(player.id)}
                  className={`flex-row items-center p-3 mb-1 rounded-xl transition-all ${
                    isSelected ? "bg-blue-50/50" : "bg-white"
                  }`}
                >
                  {/* Checkbox */}
                  <View
                    className={`w-6 h-6 rounded-lg border-2 mr-3 items-center justify-center ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>

                  <View className="flex-1 flex-row items-center justify-between">
                    <View>
                      <Text
                        className={`font-bold text-base ${
                          isSelected ? "text-dark" : "text-gray-400"
                        }`}
                      >
                        {player.name}
                      </Text>
                      <Text className="text-xs text-gray-400 font-medium">
                        {player.position} • Niv {player.level}
                      </Text>
                    </View>

                    {/* Indicateur Niveau */}
                    <View className="flex-row">
                      {[...Array(player.level || 0)].map((_, i) => (
                        <View
                          key={i}
                          className={`w-1 h-3 ml-0.5 rounded-full ${
                            isSelected ? "bg-yellow-400" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Footer Flottant */}
      <View className="absolute bottom-6 left-4 right-4">
        <TouchableOpacity
          className={`w-full py-4 rounded-2xl shadow-xl flex-row items-center justify-center ${
            selectedPlayers.size < 2 ? "bg-gray-800 opacity-50" : "bg-dark"
          }`}
          disabled={selectedPlayers.size < 2}
          onPress={handleGenerate}
        >
          <Ionicons name="flash" size={20} color="#FACC15" className="mr-2" />
          <Text className="text-white text-lg font-black uppercase tracking-wider ml-2">
            Lancer le match
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
