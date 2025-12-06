import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
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
  const { currentSession, saveToHistory, createSession } = useSessionStore();

  if (!currentSession) return null;

  const { teams, method, stats } = currentSession;
  const teamsKeys = Object.keys(teams); // ["teamA", "teamB"...]
  const nbTeams = teamsKeys.length;

  const handleShuffle = () => {
    try {
      const newTeams = TeamGenerator.generate(
        currentSession.players,
        method,
        nbTeams
      );
      createSession(currentSession.players, newTeams, method);
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
    teamA: { name: "Team Alpha", bg: "bg-blue-600" },
    teamB: { name: "Team Bravo", bg: "bg-red-600" },
    teamC: { name: "Team Charlie", bg: "bg-green-600" },
    teamD: { name: "Team Delta", bg: "bg-orange-500" },
  };

  const TeamCard = ({ teamKey, teamData }) => {
    const config = teamConfig[teamKey];
    const avgKey = `avgLevel${
      teamKey.charAt(0).toUpperCase() + teamKey.slice(1)
    }`;
    const avg = stats[avgKey] || 0;

    return (
      <View className="bg-white rounded-3xl overflow-hidden mb-4 shadow-sm border border-gray-100">
        <View
          className={`${config.bg} p-4 flex-row justify-between items-center`}
        >
          <Text className="text-white font-black text-xl uppercase italic tracking-tighter">
            {config.name}
          </Text>
          <View className="bg-white/20 px-3 py-1 rounded-full flex-row items-center">
            <Text className="text-white font-bold mr-1">{avg}</Text>
            <Ionicons name="star" size={12} color="white" />
          </View>
        </View>
        <View className="p-2">
          {teamData.map((player, idx) => (
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
            className="flex-1 py-4 items-center justify-center rounded-xl active:bg-white/10"
            onPress={handleShuffle}
          >
            <Ionicons name="shuffle" size={24} color="white" />
            <Text className="text-white text-[10px] font-bold mt-1 uppercase">
              Mélanger
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
