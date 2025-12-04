import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../../store/usePlayerStore";
import { useSessionStore } from "../../store/useSessionStore";
import { TeamGenerator } from "../../utils/teamGenerator";

export default function SessionConfigScreen() {
  const router = useRouter();
  const { players } = usePlayerStore();
  const { createSession } = useSessionStore();

  // États locaux
  const [selectedPlayers, setSelectedPlayers] = useState(new Set());
  const [method, setMethod] = useState("balanced");

  // Méthodes de génération disponibles
  const methods = [
    {
      id: "balanced",
      name: "Équilibré",
      icon: "scale-outline",
      description: "Répartition par niveau",
      color: "bg-success",
    },
    {
      id: "random",
      name: "Aléatoire",
      icon: "shuffle-outline",
      description: "Totalement random",
      color: "bg-warning",
    },
    {
      id: "position",
      name: "Par postes",
      icon: "grid-outline",
      description: "Équilibre G/D/M/A",
      color: "bg-primary",
    },
  ];

  // Toggle sélection d'un joueur
  const togglePlayer = (playerId) => {
    const newSet = new Set(selectedPlayers);
    if (newSet.has(playerId)) {
      newSet.delete(playerId);
    } else {
      newSet.add(playerId);
    }
    setSelectedPlayers(newSet);
  };

  // Tout sélectionner / Tout désélectionner
  const toggleAll = () => {
    if (selectedPlayers.size === players.length) {
      setSelectedPlayers(new Set());
    } else {
      setSelectedPlayers(new Set(players.map((p) => p.id)));
    }
  };

  // Générer les équipes
  const handleGenerate = () => {
    if (selectedPlayers.size < 2) {
      Alert.alert(
        "Pas assez de joueurs",
        "Sélectionne au moins 2 joueurs pour créer des équipes."
      );
      return;
    }

    // Filtrer les joueurs sélectionnés
    const activePlayers = players.filter((p) => selectedPlayers.has(p.id));

    try {
      // Générer les équipes selon la méthode choisie
      const teams = TeamGenerator.generate(activePlayers, method);

      // Créer la session
      createSession(activePlayers, teams, method);

      // Naviguer vers l'écran de résultat
      router.push("/session/result");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  // Badge de poste
  const renderPositionBadge = (position) => {
    const colors = {
      G: "bg-yellow-500",
      D: "bg-blue-500",
      M: "bg-green-500",
      A: "bg-red-500",
    };
    return (
      <View
        className={`${
          colors[position] || "bg-gray-500"
        } w-7 h-7 rounded-full items-center justify-center mr-3`}
      >
        <Text className="text-white font-bold text-xs">{position}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-light">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Section : Joueurs disponibles */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-dark">
              Joueurs disponibles ({selectedPlayers.size}/{players.length})
            </Text>
            <TouchableOpacity
              className="bg-primary/10 px-4 py-2 rounded-lg"
              onPress={toggleAll}
            >
              <Text className="text-primary font-semibold text-sm">
                {selectedPlayers.size === players.length
                  ? "Tout déselectionner"
                  : "Tout sélectionner"}
              </Text>
            </TouchableOpacity>
          </View>

          {players.length === 0 ? (
            <View className="bg-white p-6 rounded-xl items-center">
              <Ionicons name="people-outline" size={48} color="#6C757D" />
              <Text className="text-gray text-center mt-3">
                Aucun joueur. Ajoute-en d'abord !
              </Text>
              <TouchableOpacity
                className="bg-primary px-4 py-2 rounded-lg mt-3"
                onPress={() => router.push("/players")}
              >
                <Text className="text-white font-semibold">Gérer les joueurs</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="gap-y-2">
              {players.map((player) => (
                <TouchableOpacity
                  key={player.id}
                  className={`bg-white p-4 rounded-xl flex-row items-center border-2 ${
                    selectedPlayers.has(player.id)
                      ? "border-success bg-success/5"
                      : "border-transparent"
                  }`}
                  onPress={() => togglePlayer(player.id)}
                >
                  {/* Checkbox */}
                  <View
                    className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                      selectedPlayers.has(player.id)
                        ? "bg-success border-success"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedPlayers.has(player.id) && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>

                  {/* Badge Poste */}
                  {renderPositionBadge(player.position)}

                  {/* Infos Joueur */}
                  <View className="flex-1">
                    <Text className="text-base font-bold text-dark">
                      {player.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < player.level ? "star" : "star-outline"}
                          size={12}
                          color="#FFC107"
                        />
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Section : Méthode de génération */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-dark mb-3">
            Méthode de génération
          </Text>
          <View className="gap-y-3">
            {methods.map((m) => (
              <TouchableOpacity
                key={m.id}
                className={`bg-white p-4 rounded-xl border-2 ${
                  method === m.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent"
                }`}
                onPress={() => setMethod(m.id)}
              >
                <View className="flex-row items-center">
                  <View
                    className={`${m.color} w-12 h-12 rounded-full items-center justify-center mr-4`}
                  >
                    <Ionicons name={m.icon} size={24} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-dark">
                      {m.name}
                    </Text>
                    <Text className="text-gray text-sm">{m.description}</Text>
                  </View>
                  {method === m.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#007BFF" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bouton Générer (fixe en bas) */}
      <View className="bg-white border-t border-gray-200 p-4">
        <TouchableOpacity
          className={`py-4 rounded-2xl items-center shadow-lg ${
            selectedPlayers.size < 2
              ? "bg-gray-300"
              : "bg-primary active:opacity-90"
          }`}
          onPress={handleGenerate}
          disabled={selectedPlayers.size < 2}
        >
          <Text className="text-white font-bold text-lg">
            ⚽ Générer les équipes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
