import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../../store/usePlayerStore";
import { useSessionStore } from "../../store/useSessionStore";
import { TeamGenerator } from "../../utils/teamGenerator";

export default function SessionConfigScreen() {
  const router = useRouter();

  const allPlayers = usePlayerStore((state) => state.players);
  const activeGroupId = usePlayerStore((state) => state.activeGroupId);
  const groups = usePlayerStore((state) => state.groups);
  const { createSession } = useSessionStore();

  const players = useMemo(() => {
    const activeId = activeGroupId || "default";
    return allPlayers.filter((p) => (p.groupId || "default") === activeId);
  }, [allPlayers, activeGroupId]);

  const activeGroupName = useMemo(
    () => groups.find((g) => g.id === activeGroupId)?.name || "Général",
    [groups, activeGroupId]
  );

  const [selectedPlayers, setSelectedPlayers] = useState(new Set());
  const [method, setMethod] = useState("balanced");
  const [nbTeams, setNbTeams] = useState(2);

  const methods = [
    {
      id: "balanced",
      name: "Équilibré",
      icon: "options",
      desc: "Niveau égal",
      bg: "bg-blue-50",
    },
    // {
    //   id: "random",
    //   name: "Aléatoire",
    //   icon: "shuffle",
    //   desc: "100% Hasard",
    //   bg: "bg-orange-50",
    // },
    // {
    //   id: "position",
    //   name: "Par Postes",
    //   icon: "football",
    //   desc: "Tactique",
    //   bg: "bg-green-50",
    // },
  ];

  const togglePlayer = (id) => {
    const next = new Set(selectedPlayers);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedPlayers(next);
  };

  const toggleAll = () => {
    if (selectedPlayers.size === players.length) setSelectedPlayers(new Set());
    else setSelectedPlayers(new Set(players.map((p) => p.id)));
  };

  const handleGenerate = () => {
    if (selectedPlayers.size < nbTeams) {
      return Alert.alert(
        "Pas assez de joueurs",
        `Il faut au moins ${nbTeams} joueurs.`
      );
    }

    const activePlayers = players.filter((p) => selectedPlayers.has(p.id));

    try {
      const teams = TeamGenerator.generate(activePlayers, method, nbTeams);

      createSession(activePlayers, teams, method);
      router.push("/session/result");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  const handleChangeMethod = (newMethod) => {
    setMethod(newMethod);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
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
          {selectedPlayers.size} joueurs prêts
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* SÉLECTEUR NOMBRE D'ÉQUIPES */}
        <Text className="font-bold text-dark text-lg mb-3 mt-2 ml-1">
          Nombre d'équipes
        </Text>
        <View className="flex-row gap-3 mb-6">
          {[2, 3, 4].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setNbTeams(n)}
              className={`flex-1 py-4 rounded-2xl border-2 items-center justify-center ${
                nbTeams === n
                  ? "bg-dark border-dark"
                  : "bg-white border-gray-100"
              }`}
            >
              <Text
                className={`font-black text-xl ${
                  nbTeams === n ? "text-white" : "text-gray-400"
                }`}
              >
                {n}
              </Text>
              <Text
                className={`text-[10px] font-bold uppercase ${
                  nbTeams === n ? "text-white" : "text-gray-300"
                }`}
              >
                Teams
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="font-bold text-dark text-lg mb-3 ml-1">Stratégie</Text>
        <View className="flex-row gap-3 mb-6">
          {methods.map((m) => {
            const isActive = method === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => handleChangeMethod(m.id)}
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
                  className={`font-bold text-xs mb-0.5 text-center ${
                    isActive ? "text-dark" : "text-gray-400"
                  }`}
                >
                  {m.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text className="font-bold text-dark text-lg mb-3 ml-1">Effectif</Text>
        <View className="bg-white rounded-2xl p-2 shadow-sm mb-4">
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
                  <Text
                    className={`font-bold text-base ${
                      isSelected ? "text-dark" : "text-gray-400"
                    }`}
                  >
                    {player.name}
                  </Text>
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
      </ScrollView>

      <View className="absolute bottom-6 left-4 right-4">
        <TouchableOpacity
          className={`w-full py-4 rounded-2xl shadow-xl flex-row items-center justify-center ${
            selectedPlayers.size < nbTeams
              ? "bg-gray-800 opacity-50"
              : "bg-dark"
          }`}
          disabled={selectedPlayers.size < nbTeams}
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
