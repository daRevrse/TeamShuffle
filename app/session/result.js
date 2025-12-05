import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
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
  const { teamA, teamB } = teams;

  const handleShuffle = () => {
    try {
      const newTeams = TeamGenerator.generate(currentSession.players, method);
      createSession(currentSession.players, newTeams, method);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  const handleSave = () => {
    saveToHistory();
    Alert.alert("Succès", "Sauvegardé dans l'historique !", [
      { text: "OK", onPress: () => router.push("/") },
    ]);
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) return Alert.alert("Erreur", "Partage non disponible");

      // Petit délai pour laisser le temps au UI de se mettre à jour si besoin
      setTimeout(async () => {
        if (viewShotRef.current) {
          const uri = await viewShotRef.current.capture();
          await Sharing.shareAsync(uri, {
            mimeType: "image/png",
            dialogTitle: "Match Ready!",
          });
        }
        setIsSharing(false);
      }, 100);
    } catch (error) {
      console.error(error);
      setIsSharing(false);
    }
  };

  // Composant : Badge de Position Minimaliste
  const PositionBadge = ({ position }) => {
    const colors = {
      G: "bg-yellow-500",
      D: "bg-blue-500",
      M: "bg-emerald-500",
      A: "bg-rose-500",
    };
    return (
      <View
        className={`${
          colors[position] || "bg-gray-400"
        } w-8 h-8 rounded-lg items-center justify-center mr-3 shadow-sm`}
      >
        <Text className="text-white font-bold text-xs">{position}</Text>
      </View>
    );
  };

  // Composant : Carte d'équipe
  const TeamCard = ({ team, name, color, accentColor, avgLevel }) => (
    <View className="bg-white rounded-3xl overflow-hidden mb-4 shadow-sm border border-gray-100">
      {/* Header de l'équipe */}
      <View className={`${color} p-4 flex-row justify-between items-center`}>
        <View>
          <Text className="text-white font-black text-2xl uppercase italic tracking-tighter">
            {name}
          </Text>
          <Text className="text-white/80 text-xs font-bold uppercase tracking-widest">
            {team.length} Joueurs
          </Text>
        </View>
        <View className="bg-white/20 px-3 py-1 rounded-full flex-row items-center backdrop-blur-md">
          <Text className="text-white font-bold mr-1 text-lg">{avgLevel}</Text>
          <Ionicons name="star" size={14} color="white" />
        </View>
      </View>

      {/* Liste des joueurs */}
      <View className="p-2">
        {team.map((player, index) => (
          <View
            key={player.id}
            className={`flex-row items-center p-3 ${
              index !== team.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            {/* Numéro style maillot */}
            <Text className="text-gray-300 font-black text-xl w-8 text-center mr-1 italic">
              {index + 1}
            </Text>

            <PositionBadge position={player.position} />

            <View className="flex-1">
              <Text className="text-dark font-bold text-base">
                {player.name}
              </Text>
              {/* Niveau visualisé par des points discrets */}
              <View className="flex-row mt-1 opacity-50">
                {[...Array(5)].map((_, i) => (
                  <View
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      i < player.level ? accentColor : "bg-gray-200"
                    }`}
                  />
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Zone de Capture (Screenshot) */}
          <ViewShot
            ref={viewShotRef}
            options={{ format: "png", quality: 0.9 }}
            style={{ backgroundColor: "#F9FAFB" }}
          >
            <View className="p-4 pt-6">
              {/* En-tête "Match Day" */}
              <View className="items-center mb-6">
                <Text className="text-gray-400 font-bold tracking-[0.3em] text-xs uppercase mb-1">
                  OFFICIAL LINEUP
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-3xl font-black text-dark italic">
                    MATCH
                  </Text>
                  <Text className="text-3xl font-black text-primary italic ml-1">
                    DAY
                  </Text>
                </View>
                <View className="flex-row items-center mt-2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                  <Ionicons
                    name={
                      method === "balanced"
                        ? "options"
                        : method === "random"
                        ? "shuffle"
                        : "location"
                    }
                    size={14}
                    color="#6C757D"
                  />
                  <Text className="text-gray-500 text-xs font-bold ml-1 uppercase">
                    Mode{" "}
                    {method === "balanced"
                      ? "Équilibré"
                      : method === "random"
                      ? "Aléatoire"
                      : "Postes"}
                  </Text>
                </View>
              </View>

              {/* Conteneur des équipes avec badge VS */}
              <View className="relative">
                <TeamCard
                  team={teamA}
                  name="Team Alpha"
                  color="bg-blue-600"
                  accentColor="bg-blue-600"
                  avgLevel={stats.avgLevelTeamA}
                />

                {/* Badge VS Central */}
                <View className="absolute left-[42%] top-[40%] z-10 bg-dark w-14 h-14 rounded-full items-center justify-center border-4 border-gray-50 shadow-lg">
                  <Text className="text-white font-black italic text-lg">
                    VS
                  </Text>
                </View>

                <TeamCard
                  team={teamB}
                  name="Team Bravo"
                  color="bg-rose-600"
                  accentColor="bg-rose-600"
                  avgLevel={stats.avgLevelTeamB}
                />
              </View>

              {/* Footer du Screenshot */}
              <View className="items-center mt-4 opacity-40">
                <View className="flex-row items-center">
                  <Ionicons name="football" size={16} color="black" />
                  <Text className="font-bold text-xs ml-2">
                    Généré par TeamShuffle
                  </Text>
                </View>
              </View>
            </View>
          </ViewShot>
        </ScrollView>

        {/* Barre d'Actions Flottante (Moderne) */}
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
            {isSharing ? (
              <Ionicons name="hourglass" size={24} color="#34C759" />
            ) : (
              <Ionicons name="share-social" size={24} color="#34C759" />
            )}
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
