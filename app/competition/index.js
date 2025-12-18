import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCompetitionStore } from "../../store/useCompetitionStore";

/**
 * Écran d'accueil Mode Compétition
 * Affiche l'historique des tournois + bouton pour créer un nouveau tournoi
 */
export default function CompetitionScreen() {
  const router = useRouter();
  const { competitions, currentCompetition, deleteCompetition, loadCompetition } =
    useCompetitionStore();

  const handleCreateNew = () => {
    router.push("/competition/setup");
  };

  const handleViewCompetition = (competition) => {
    loadCompetition(competition.id);
    router.push("/competition/manage");
  };

  const handleDeleteCompetition = (competitionId) => {
    Alert.alert(
      "Supprimer le tournoi",
      "Voulez-vous supprimer ce tournoi de l'historique ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteCompetition(competitionId),
        },
      ]
    );
  };

  const handleContinueCurrent = () => {
    router.push("/competition/manage");
  };

  // Helper pour formater la date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return {
      day: date.getDate(),
      month: date
        .toLocaleDateString("fr-FR", { month: "short" })
        .toUpperCase()
        .replace(".", ""),
      year: date.getFullYear(),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Carte de tournoi
  const CompetitionCard = ({ item }) => {
    const { day, month, year, time } = formatDate(item.createdAt);
    const isLeague = item.format === "league";
    const isFinished = item.phase === "finished";

    // Calculer les stats
    let totalMatches = 0;
    let playedMatches = 0;

    if (isLeague) {
      totalMatches = item.matches?.length || 0;
      playedMatches = item.matches?.filter((m) => m.status === "played").length || 0;
    } else if (item.phase === "pools") {
      Object.values(item.poolMatches || {}).forEach((matches) => {
        totalMatches += matches.length;
        playedMatches += matches.filter((m) => m.status === "played").length;
      });
    } else if (item.phase === "knockout") {
      totalMatches = item.knockoutMatches?.length || 0;
      playedMatches = item.knockoutMatches?.filter((m) => m.winner).length || 0;
    }

    const progress = totalMatches > 0 ? Math.round((playedMatches / totalMatches) * 100) : 0;

    // Trouver le leader (si mode ligue)
    let leader = null;
    if (isLeague && item.standings) {
      const sorted = Object.keys(item.standings)
        .map((key) => ({ teamKey: key, ...item.standings[key] }))
        .sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          return b.goalDifference - a.goalDifference;
        });
      if (sorted.length > 0) {
        leader = item.teamNames[sorted[0].teamKey];
      }
    }

    return (
      <TouchableOpacity
        className="bg-white rounded-3xl mb-4 shadow-lg border-2 border-gray-100 overflow-hidden active:scale-[0.98]"
        onPress={() => handleViewCompetition(item)}
      >
        {/* Bande de couleur en haut */}
        <View className={`h-2 ${isLeague ? "bg-blue-500" : "bg-orange-500"}`} />

        <View className="p-5">
          {/* En-tête */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                    isLeague ? "bg-blue-50" : "bg-orange-50"
                  }`}
                >
                  <Ionicons
                    name={isLeague ? "list" : "git-network"}
                    size={20}
                    color={isLeague ? "#3B82F6" : "#F97316"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-black text-dark" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-xs text-gray-400 mt-1">
                    {day} {month} {year} • {time}
                  </Text>
                </View>
              </View>
            </View>

            {/* Badge statut */}
            <View
              className={`px-3 py-1 rounded-full ${
                isFinished ? "bg-green-100" : "bg-blue-100"
              }`}
            >
              <Text
                className={`text-xs font-black ${
                  isFinished ? "text-green-700" : "text-blue-700"
                }`}
              >
                {isFinished ? "✓ TERMINÉ" : "EN COURS"}
              </Text>
            </View>
          </View>

          {/* Infos */}
          <View className="flex-row items-center mb-3">
            <View className="flex-row items-center flex-1">
              <Ionicons name="people" size={14} color="#9CA3AF" />
              <Text className="text-gray-600 text-sm ml-1 font-bold">
                {item.nbTeams} équipes
              </Text>
            </View>
            <View className="flex-row items-center flex-1">
              <Ionicons name="football" size={14} color="#9CA3AF" />
              <Text className="text-gray-600 text-sm ml-1 font-bold">
                {playedMatches}/{totalMatches} matchs
              </Text>
            </View>
          </View>

          {/* Barre de progression */}
          {!isFinished && (
            <View className="mb-3">
              <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                <View
                  style={{ width: `${progress}%` }}
                  className={`h-full ${isLeague ? "bg-blue-500" : "bg-orange-500"}`}
                />
              </View>
              <Text className="text-xs text-gray-500 font-bold mt-1 text-center">
                Progression: {progress}%
              </Text>
            </View>
          )}

          {/* Phase actuelle ou Leader */}
          {!isFinished ? (
            <View className={`px-3 py-2 rounded-xl ${isLeague ? "bg-blue-50" : "bg-orange-50"}`}>
              <Text className={`text-xs font-bold ${isLeague ? "text-blue-800" : "text-orange-800"}`}>
                {item.phase === "league" && "📊 Phase de ligue"}
                {item.phase === "pools" && "🏁 Phase de poules"}
                {item.phase === "knockout" &&
                  `🏆 ${
                    item.currentKnockoutRound === "final"
                      ? "Finale"
                      : item.currentKnockoutRound === "semi"
                      ? "Demi-finales"
                      : item.currentKnockoutRound === "quarter"
                      ? "Quarts"
                      : "Élimination directe"
                  }`}
              </Text>
            </View>
          ) : (
            leader && (
              <View className="bg-yellow-50 px-3 py-2 rounded-xl flex-row items-center">
                <Ionicons name="trophy" size={16} color="#F59E0B" />
                <Text className="text-yellow-800 text-xs font-bold ml-2">
                  Vainqueur: {leader}
                </Text>
              </View>
            )
          )}

          {/* Bouton supprimer */}
          {isFinished && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleDeleteCompetition(item.id);
              }}
              className="absolute top-3 right-3 bg-red-50 p-2 rounded-full"
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* En-tête */}
      <View className="bg-white px-4 pt-4 pb-6 rounded-b-[30px] shadow-sm z-10 mb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">
              Mode Compétition
            </Text>
            <Text className="text-3xl font-black text-dark italic tracking-tighter">
              Tournoi <Text className="text-primary">Manager</Text>
            </Text>
          </View>
          <View className="bg-yellow-50 w-12 h-12 rounded-2xl items-center justify-center">
            <Ionicons name="trophy" size={24} color="#F59E0B" />
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Tournoi en cours */}
        {currentCompetition && !currentCompetition.isReadOnly && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-dark mb-3">
              🔥 Tournoi en cours
            </Text>
            <TouchableOpacity
              className="bg-white rounded-3xl shadow-xl border-2 border-primary overflow-hidden active:scale-[0.98]"
              onPress={handleContinueCurrent}
            >
              {/* Bande animée en haut */}
              <View className="h-1 bg-primary" />

              <View className="p-5">
                {/* En-tête */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <View
                        className={`w-10 h-10 rounded-xl items-center justify-center mr-3 ${
                          currentCompetition.format === "league"
                            ? "bg-blue-50"
                            : "bg-orange-50"
                        }`}
                      >
                        <Ionicons
                          name={
                            currentCompetition.format === "league"
                              ? "list"
                              : "git-network"
                          }
                          size={20}
                          color={
                            currentCompetition.format === "league"
                              ? "#3B82F6"
                              : "#F97316"
                          }
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-xl font-black text-dark" numberOfLines={1}>
                          {currentCompetition.name}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {currentCompetition.format === "league"
                            ? "Mode Ligue"
                            : "Mode Poules + Élimination"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="bg-primary/10 p-3 rounded-2xl">
                    <Ionicons name="arrow-forward" size={24} color="#007BFF" />
                  </View>
                </View>

                {/* Stats */}
                {(() => {
                  let totalMatches = 0;
                  let playedMatches = 0;

                  if (currentCompetition.format === "league") {
                    totalMatches = currentCompetition.matches?.length || 0;
                    playedMatches =
                      currentCompetition.matches?.filter((m) => m.status === "played")
                        .length || 0;
                  } else if (currentCompetition.phase === "pools") {
                    Object.values(currentCompetition.poolMatches || {}).forEach(
                      (matches) => {
                        totalMatches += matches.length;
                        playedMatches += matches.filter(
                          (m) => m.status === "played"
                        ).length;
                      }
                    );
                  }

                  const progress =
                    totalMatches > 0
                      ? Math.round((playedMatches / totalMatches) * 100)
                      : 0;

                  return (
                    <>
                      <View className="flex-row items-center mb-3">
                        <View className="flex-row items-center flex-1">
                          <Ionicons name="people" size={16} color="#9CA3AF" />
                          <Text className="text-gray-600 text-sm ml-1 font-bold">
                            {currentCompetition.nbTeams} équipes
                          </Text>
                        </View>
                        <View className="flex-row items-center flex-1">
                          <Ionicons name="football" size={16} color="#9CA3AF" />
                          <Text className="text-gray-600 text-sm ml-1 font-bold">
                            {playedMatches}/{totalMatches} matchs
                          </Text>
                        </View>
                      </View>

                      {/* Barre de progression */}
                      <View className="mb-3">
                        <View className="bg-gray-100 h-3 rounded-full overflow-hidden">
                          <View
                            style={{ width: `${progress}%` }}
                            className="h-full bg-primary"
                          />
                        </View>
                        <Text className="text-xs text-gray-500 font-bold mt-2">
                          Progression: {progress}%
                        </Text>
                      </View>

                      {/* Phase actuelle */}
                      <View className="bg-blue-50 px-3 py-2 rounded-xl">
                        <Text className="text-blue-800 text-xs font-bold">
                          {currentCompetition.phase === "league" &&
                            "📊 Phase de ligue en cours"}
                          {currentCompetition.phase === "pools" &&
                            "🏁 Phase de poules en cours"}
                          {currentCompetition.phase === "knockout" &&
                            `🏆 ${
                              currentCompetition.currentKnockoutRound === "final"
                                ? "Finale"
                                : currentCompetition.currentKnockoutRound === "semi"
                                ? "Demi-finales"
                                : currentCompetition.currentKnockoutRound ===
                                  "quarter"
                                ? "Quarts de finale"
                                : "Élimination directe"
                            }`}
                        </Text>
                      </View>
                    </>
                  );
                })()}
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Bouton Nouveau Tournoi */}
        <TouchableOpacity
          className="bg-primary p-6 rounded-3xl shadow-lg flex-row items-center justify-between mb-6 active:scale-[0.98]"
          onPress={handleCreateNew}
        >
          <View className="flex-1">
            <Text className="text-white font-black text-xl mb-1">
              Nouveau Tournoi
            </Text>
            <Text className="text-blue-100 text-sm">
              Créer une compétition personnalisée
            </Text>
          </View>
          <View className="bg-white/20 w-12 h-12 rounded-2xl items-center justify-center">
            <Ionicons name="add-circle" size={28} color="white" />
          </View>
        </TouchableOpacity>

        {/* Carte info */}
        <View className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-5 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <Text className="text-blue-900 font-bold text-lg ml-2">
              Comment ça marche ?
            </Text>
          </View>
          <Text className="text-blue-800 leading-6">
            1. Créez un tournoi avec 2 à 16 équipes{"\n"}
            2. Choisissez le format (Ligue ou Poules){"\n"}
            3. Enregistrez les scores des matchs{"\n"}
            4. Suivez le classement en temps réel
          </Text>
        </View>

        {/* Historique */}
        {competitions.length > 0 ? (
          <>
            <Text className="text-lg font-bold text-dark mb-3">
              📋 Historique des tournois
            </Text>
            {competitions.map((comp) => (
              <CompetitionCard key={comp.id} item={comp} />
            ))}
          </>
        ) : (
          <View className="items-center justify-center p-8 opacity-50">
            <View className="bg-gray-200 p-6 rounded-full mb-4">
              <Ionicons name="trophy-outline" size={48} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-bold text-gray-500">
              Aucun tournoi
            </Text>
            <Text className="text-gray-400 text-center mt-2 px-6">
              Créez votre premier tournoi pour commencer
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
