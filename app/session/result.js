import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSessionStore } from "../../store/useSessionStore";
import { TeamGenerator } from "../../utils/teamGenerator";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

export default function SessionResultScreen() {
  const router = useRouter();
  const viewShotRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const { currentSession, saveToHistory, createSession } = useSessionStore();

  if (!currentSession) {
    return (
      <View className="flex-1 items-center justify-center bg-light p-6">
        <Ionicons name="sad-outline" size={64} color="#6C757D" />
        <Text className="text-xl font-bold text-dark mt-4 mb-2">
          Aucune session active
        </Text>
        <Text className="text-gray text-center mb-6">
          Crée d'abord une session pour voir les équipes.
        </Text>
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-xl"
          onPress={() => router.replace("/session/config")}
        >
          <Text className="text-white font-bold">Créer une session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { teams, method, stats } = currentSession;
  const { teamA, teamB } = teams;

  // Remélanger les équipes
  const handleShuffle = () => {
    try {
      const newTeams = TeamGenerator.generate(currentSession.players, method);
      createSession(currentSession.players, newTeams, method);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  // Sauvegarder dans l'historique
  const handleSave = () => {
    saveToHistory();
    Alert.alert(
      "Sauvegardé !",
      "Cette composition a été ajoutée à l'historique.",
      [
        {
          text: "OK",
          onPress: () => router.push("/"),
        },
      ]
    );
  };

  // Partager via screenshot
  const handleShare = async () => {
    try {
      setIsSharing(true);

      // Vérifier si le partage est disponible
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          "Partage non disponible",
          "Le partage n'est pas supporté sur cet appareil."
        );
        setIsSharing(false);
        return;
      }

      // Capturer le screenshot
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();

        // Ouvrir le menu de partage natif
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Partager les équipes",
        });
      }
    } catch (error) {
      console.error("Erreur de partage:", error);
      Alert.alert(
        "Erreur",
        "Impossible de partager les équipes. Réessaye !"
      );
    } finally {
      setIsSharing(false);
    }
  };

  // Badge de poste avec design amélioré
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
        } w-9 h-9 rounded-full items-center justify-center mr-3 shadow-md`}
        style={{ elevation: 4 }}
      >
        <Text className="text-white font-extrabold text-sm">{position}</Text>
      </View>
    );
  };

  // Rendu d'une équipe
  const renderTeam = (team, teamName, bgColor, textColor) => {
    const teamKey = teamName.replace(" ", "");
    return (
      <View className={`${bgColor} rounded-3xl p-6 shadow-lg`} style={{ elevation: 8 }}>
        {/* En-tête de l'équipe avec design amélioré */}
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-1">
            <View className="bg-white/30 px-6 py-3 rounded-2xl shadow-md mb-2" style={{ elevation: 4 }}>
              <Text className={`${textColor} text-3xl font-extrabold tracking-wider text-center`}>
                {teamName}
              </Text>
            </View>
          </View>
          <View className="bg-white/90 px-5 py-3 rounded-2xl shadow-sm ml-3" style={{ elevation: 2 }}>
            <View className="items-center">
              <Ionicons name="trophy" size={24} color={bgColor === "bg-blue-500" ? "#3B82F6" : "#EF4444"} />
              <Text className="text-dark font-extrabold text-xl mt-1">
                {stats[`avgLevel${teamKey}`]}/5
              </Text>
              <View className="flex-row items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < Math.round(stats[`avgLevel${teamKey}`]) ? "star" : "star-outline"}
                    size={12}
                    color="#FFC107"
                    style={{ marginHorizontal: -1 }}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Liste des joueurs avec design amélioré */}
        <View className="gap-y-3">
          {team.map((player, index) => (
            <View
              key={player.id}
              className="bg-white/20 rounded-2xl p-4 flex-row items-center shadow-md"
              style={{ elevation: 3 }}
            >
              {/* Numéro avec badge circulaire */}
              <View className="bg-white/40 w-9 h-9 rounded-full items-center justify-center mr-3">
                <Text className={`${textColor} font-extrabold text-lg`}>
                  {index + 1}
                </Text>
              </View>

              {/* Badge Poste */}
              {renderPositionBadge(player.position)}

              {/* Nom et info */}
              <View className="flex-1">
                <Text className={`${textColor} font-extrabold text-lg tracking-wide`} numberOfLines={1}>
                  {player.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <View className="bg-white/40 px-2 py-0.5 rounded-full mr-2">
                    <Text className={`${textColor} text-xs font-bold`}>
                      Niveau {player.level}
                    </Text>
                  </View>
                  <View className="flex-row">
                    {[...Array(player.level)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name="star"
                        size={12}
                        color="#FFC107"
                        style={{ marginLeft: i === 0 ? 0 : -2 }}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Footer équipe avec statistiques détaillées */}
        <View className="mt-5 pt-4 border-t-2 border-white/30">
          <View className="flex-row items-center justify-around">
            <View className="items-center">
              <Ionicons name="people" size={20} color="white" />
              <Text className={`${textColor} text-lg font-extrabold mt-1`}>
                {team.length}
              </Text>
              <Text className={`${textColor} text-xs font-semibold`}>
                joueur{team.length > 1 ? "s" : ""}
              </Text>
            </View>
            <View className="h-12 w-0.5 bg-white/30" />
            <View className="items-center">
              <Ionicons name="stats-chart" size={20} color="white" />
              <Text className={`${textColor} text-lg font-extrabold mt-1`}>
                {stats[`avgLevel${teamKey}`]}
              </Text>
              <Text className={`${textColor} text-xs font-semibold`}>
                niveau moyen
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-light">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* ViewShot pour capturer le screenshot */}
        <ViewShot
          ref={viewShotRef}
          options={{
            format: "png",
            quality: 1.0,
          }}
        >
          <View className="bg-light p-4">
            {/* En-tête avec design premium */}
            <View className="bg-white rounded-3xl p-6 mb-5 items-center shadow-lg" style={{ elevation: 6 }}>
              <View className="bg-primary/10 rounded-full p-3 mb-3">
                <Text className="text-5xl">⚽</Text>
              </View>
              <Text className="text-3xl font-extrabold text-dark mb-3 tracking-wide">
                Équipes générées
              </Text>
              <View className="bg-primary rounded-full px-6 py-3 mb-2 shadow-md" style={{ elevation: 3 }}>
                <View className="flex-row items-center">
                  <Ionicons
                    name={method === "balanced" ? "balance-scale" : method === "random" ? "shuffle" : "location"}
                    size={16}
                    color="white"
                  />
                  <Text className="text-white font-bold ml-2">
                    {method === "balanced" ? "Équilibré" : method === "random" ? "Aléatoire" : "Par postes"}
                  </Text>
                </View>
              </View>
              {stats.difference !== undefined && (
                <View className="bg-gray-100 px-5 py-2 rounded-full mt-2">
                  <View className="flex-row items-center">
                    <Ionicons name="analytics" size={14} color="#6C757D" />
                    <Text className="text-gray text-sm font-semibold ml-2">
                      Différence : {stats.difference.toFixed(1)} ⭐
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Les 2 équipes l'une en dessous de l'autre */}
            <View className="gap-y-4 mb-4">
              {renderTeam(teamA, "Team A", "bg-blue-500", "text-white")}
              {renderTeam(teamB, "Team B", "bg-red-500", "text-white")}
            </View>

            {/* Branding dans le screenshot avec style amélioré */}
            <View className="items-center mt-4 bg-white rounded-2xl p-4 shadow-sm" style={{ elevation: 2 }}>
              <View className="flex-row items-center">
                <Text className="text-5xl mr-2">⚽</Text>
                <View>
                  <Text className="text-dark font-extrabold text-base">
                    TeamShuffle
                  </Text>
                  <Text className="text-gray text-xs">
                    Des équipes équitables en secondes
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ViewShot>

        {/* Conseil (hors du screenshot) avec design amélioré */}
        <View className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 mb-4 mt-4 shadow-md" style={{ elevation: 3 }}>
          <View className="flex-row items-center">
            <View className="bg-yellow-400 rounded-full p-2 mr-3">
              <Ionicons name="bulb" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-yellow-900 font-bold text-base mb-1">
                Pas satisfait ?
              </Text>
              <Text className="text-yellow-800 text-sm">
                Remélange les équipes pour un nouveau tirage !
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Actions (fixe en bas) avec design premium */}
      <View className="bg-white border-t-2 border-gray-200 p-4 shadow-lg" style={{ elevation: 10 }}>
        <View className="flex-row gap-x-3 mb-3">
          <TouchableOpacity
            className="flex-1 bg-warning py-4 rounded-2xl flex-row items-center justify-center shadow-md active:opacity-90"
            style={{ elevation: 4 }}
            onPress={handleShuffle}
          >
            <View className="bg-white/20 rounded-full p-1 mr-2">
              <Ionicons name="shuffle" size={20} color="white" />
            </View>
            <Text className="text-white font-extrabold text-base">Remélanger</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 ${isSharing ? "bg-gray-400" : "bg-gray-600"} py-4 rounded-2xl flex-row items-center justify-center shadow-md active:opacity-90`}
            style={{ elevation: 4 }}
            onPress={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <>
                <View className="bg-white/20 rounded-full p-1 mr-2">
                  <Ionicons name="hourglass-outline" size={20} color="white" />
                </View>
                <Text className="text-white font-extrabold text-base">Partage...</Text>
              </>
            ) : (
              <>
                <View className="bg-white/20 rounded-full p-1 mr-2">
                  <Ionicons name="share-social" size={20} color="white" />
                </View>
                <Text className="text-white font-extrabold text-base">Partager</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-success py-5 rounded-2xl items-center shadow-lg active:opacity-90"
          style={{ elevation: 5 }}
          onPress={handleSave}
        >
          <View className="flex-row items-center">
            <View className="bg-white/20 rounded-full p-2 mr-3">
              <Ionicons name="save" size={24} color="white" />
            </View>
            <Text className="text-white font-extrabold text-lg">
              Sauvegarder dans l'historique
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
