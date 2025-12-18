import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSessionStore } from "../../store/useSessionStore";
import { TeamGenerator } from "../../utils/teamGenerator";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SessionResultScreen() {
  const router = useRouter();
  const viewShotRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const { currentSession, saveToHistory, updateSession, shuffleCount, incrementShuffleCount, isFromHistory } = useSessionStore();

  // États pour la modification des noms d'équipes
  const [teamNames, setTeamNames] = useState({
    teamA: "Team Alpha",
    teamB: "Team Bravo",
    teamC: "Team Charlie",
    teamD: "Team Delta",
  });
  const [editingTeam, setEditingTeam] = useState(null);
  const [tempName, setTempName] = useState("");

  if (!currentSession) return null;

  const { teams, method, stats } = currentSession;
  const teamsKeys = Object.keys(teams); // ["teamA", "teamB"...]
  const nbTeams = teamsKeys.length;

  const handleShuffle = () => {
    // Empêcher le mélange si la session vient de l'historique
    if (isFromHistory) {
      Alert.alert(
        "Session en lecture seule",
        "Cette session vient de l'historique et ne peut pas être modifiée."
      );
      return;
    }

    // Vérifier si la limite de 3 mélanges est atteinte
    if (shuffleCount >= 3) {
      Alert.alert(
        "Limite atteinte",
        "Vous avez utilisé vos 3 tentatives de mélange. Sauvegardez ou créez une nouvelle session."
      );
      return;
    }

    try {
      // Incrémenter AVANT de générer les nouvelles équipes
      incrementShuffleCount();

      const newTeams = TeamGenerator.generate(
        currentSession.players,
        method,
        nbTeams
      );

      // Utiliser updateSession pour préserver le compteur
      updateSession(newTeams);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  const handleSave = () => {
    saveToHistory();
    Alert.alert("Succès", "Sauvegardé !", [
      { text: "OK", onPress: () => router.push("/") },
    ]);
  };

  const handleEditTeamName = (teamKey) => {
    setEditingTeam(teamKey);
    setTempName(teamNames[teamKey]);
  };

  const handleSaveTeamName = () => {
    if (tempName.trim()) {
      setTeamNames({ ...teamNames, [editingTeam]: tempName.trim() });
    }
    setEditingTeam(null);
    setTempName("");
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      if (!(await Sharing.isAvailableAsync()))
        return Alert.alert("Erreur", "Partage non disponible");
      setTimeout(async () => {
        const uri = await viewShotRef.current.capture();
        await Sharing.shareAsync(uri);
        setIsSharing(false);
      }, 100);
    } catch (error) {
      setIsSharing(false);
    }
  };

  const teamConfig = {
    teamA: { bg: "bg-blue-600" },
    teamB: { bg: "bg-red-600" },
    teamC: { bg: "bg-green-600" },
    teamD: { bg: "bg-orange-500" },
  };

  // Fonction de tri par poste : G -> D -> M -> A
  const sortPlayersByPosition = (players) => {
    const positionOrder = { G: 1, D: 2, M: 3, A: 4 };
    return [...players].sort((a, b) => {
      const orderA = positionOrder[a.position] || 999;
      const orderB = positionOrder[b.position] || 999;
      return orderA - orderB;
    });
  };

  const TeamCard = ({ teamKey, teamData }) => {
    const config = teamConfig[teamKey];
    const avgKey = `avgLevel${
      teamKey.charAt(0).toUpperCase() + teamKey.slice(1)
    }`;
    const avg = stats[avgKey] || 0;

    // Tri des joueurs par poste
    const sortedPlayers = sortPlayersByPosition(teamData);

    return (
      <View className="bg-white rounded-3xl overflow-hidden mb-4 shadow-sm border border-gray-100">
        <View
          className={`${config.bg} p-4 flex-row justify-between items-center`}
        >
          <TouchableOpacity onPress={() => handleEditTeamName(teamKey)} className="flex-1">
            <Text className="text-white font-black text-xl uppercase italic tracking-tighter">
              {teamNames[teamKey]}
            </Text>
          </TouchableOpacity>
          <View className="bg-white/20 px-3 py-1 rounded-full flex-row items-center">
            <Text className="text-white font-bold mr-1">{avg}</Text>
            <Ionicons name="star" size={12} color="white" />
          </View>
        </View>
        <View className="p-2">
          {sortedPlayers.map((player) => (
            <View
              key={player.id}
              className="flex-row items-center p-3 border-b border-gray-50 last:border-0"
            >
              <View
                className={`w-6 h-6 rounded-full items-center justify-center mr-3 bg-gray-100`}
              >
                <Text className="text-xs font-bold text-gray-500">
                  {player.position}
                </Text>
              </View>
              <Text className="flex-1 text-dark font-bold">{player.name}</Text>
              <View className="flex-row">
                {[...Array(player.level || 0)].map((_, i) => (
                  <View
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      i < player.level ? config.bg : "bg-gray-200"
                    }`}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Modale d'édition du nom d'équipe */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editingTeam !== null}
        onRequestClose={() => setEditingTeam(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white p-6 rounded-3xl w-full shadow-2xl">
            <Text className="text-xl font-bold text-dark mb-4">
              Renommer l'équipe
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-lg font-bold"
              placeholder="Nom de l'équipe"
              autoFocus
              value={tempName}
              onChangeText={setTempName}
            />
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => setEditingTeam(null)}
                className="px-4 py-3 rounded-xl bg-gray-100"
              >
                <Text className="font-bold text-gray-500">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveTeamName}
                className="px-6 py-3 rounded-xl bg-primary"
              >
                <Text className="font-bold text-white">Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: "png", quality: 0.9 }}
            style={{ backgroundColor: "#F9FAFB" }}
          >
            <View className="p-4 pt-6">
              <View className="items-center mb-6">
                <Text className="text-3xl font-black text-dark italic">
                  MATCH <Text className="text-primary">DAY</Text>
                </Text>
                <View className="flex-row items-center mt-2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                  <Text className="text-gray-500 text-xs font-bold uppercase">
                    {method} • {nbTeams} Équipes
                  </Text>
                </View>
                <Text className="text-gray-400 text-[10px] mt-2">
                  Écart max : {stats.difference}
                </Text>
              </View>

              {teamsKeys.map((key) => (
                <TeamCard key={key} teamKey={key} teamData={teams[key]} />
              ))}

              <View className="items-center mt-4 opacity-40">
                <Text className="font-bold text-xs ml-2">
                  Généré par TeamShuffle
                </Text>
              </View>
            </View>
          </ViewShot>
        </ScrollView>

        <View className="absolute bottom-8 left-4 right-4 bg-dark/90 p-2 rounded-[24px] flex-row shadow-2xl backdrop-blur-xl border border-white/10">
          <TouchableOpacity
            className={`flex-1 py-4 items-center justify-center rounded-xl ${
              shuffleCount >= 3 || isFromHistory ? "opacity-50" : "active:bg-white/10"
            }`}
            onPress={handleShuffle}
            disabled={shuffleCount >= 3 || isFromHistory}
          >
            <View className="relative">
              <Ionicons name="shuffle" size={24} color="white" />
              {shuffleCount < 3 && !isFromHistory && (
                <View className="absolute -top-1 -right-1 bg-yellow-400 w-5 h-5 rounded-full items-center justify-center">
                  <Text className="text-dark text-[10px] font-black">
                    {3 - shuffleCount}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-white text-[10px] font-bold mt-1 uppercase">
              {isFromHistory ? "Historique" : "Mélanger"}
            </Text>
          </TouchableOpacity>
          <View className="w-[1px] h-8 bg-white/20 self-center mx-2" />
          <TouchableOpacity
            className="flex-1 py-4 items-center justify-center rounded-xl active:bg-white/10"
            onPress={handleShare}
          >
            <Ionicons
              name={isSharing ? "hourglass" : "share-social"}
              size={24}
              color="#34C759"
            />
            <Text className="text-[#34C759] text-[10px] font-bold mt-1 uppercase">
              Partager
            </Text>
          </TouchableOpacity>
          <View className="w-[1px] h-8 bg-white/20 self-center mx-2" />
          <TouchableOpacity
            className="flex-1 py-4 items-center justify-center rounded-xl active:bg-white/10"
            onPress={handleSave}
          >
            <Ionicons name="save-outline" size={24} color="white" />
            <Text className="text-white text-[10px] font-bold mt-1 uppercase">
              Sauver
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
