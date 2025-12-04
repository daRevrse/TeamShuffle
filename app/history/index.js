import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSessionStore } from "../../store/useSessionStore";

export default function HistoryScreen() {
  const router = useRouter();
  const { sessions, loadSession, deleteSession, clearHistory } =
    useSessionStore();

  // Formater la date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Voir une session
  const handleViewSession = (session) => {
    loadSession(session.id);
    router.push("/session/result");
  };

  // Supprimer une session
  const handleDeleteSession = (sessionId) => {
    Alert.alert(
      "Supprimer la session",
      "Es-tu sûr de vouloir supprimer cette session ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteSession(sessionId),
        },
      ]
    );
  };

  // Tout effacer
  const handleClearAll = () => {
    Alert.alert(
      "Tout effacer",
      "Es-tu sûr de vouloir supprimer tout l'historique ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Tout effacer",
          style: "destructive",
          onPress: () => clearHistory(),
        },
      ]
    );
  };

  // Rendu d'une session
  const renderSession = ({ item }) => (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-100">
      {/* En-tête */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Ionicons name="calendar" size={16} color="#6C757D" />
            <Text className="text-gray text-sm ml-2">
              {formatDate(item.date)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="people" size={16} color="#6C757D" />
            <Text className="text-gray text-sm ml-2">
              {item.players.length} joueurs
            </Text>
            <Text className="text-gray text-sm mx-2">•</Text>
            <Text className="text-primary text-sm font-semibold">
              {item.method === "balanced"
                ? "Équilibré"
                : item.method === "random"
                ? "Aléatoire"
                : "Par postes"}
            </Text>
          </View>
        </View>
      </View>

      {/* Statistiques équipes */}
      <View className="flex-row gap-x-2 mb-3">
        {/* Team A */}
        <View className="flex-1 bg-blue-50 rounded-lg p-3">
          <Text className="text-blue-700 font-bold mb-1">Team A</Text>
          <Text className="text-blue-600 text-xs">
            {item.teams.teamA.length} joueurs
          </Text>
          <Text className="text-blue-600 text-xs">
            ⭐ {item.stats.avgLevelTeamA}/5
          </Text>
        </View>

        {/* Team B */}
        <View className="flex-1 bg-red-50 rounded-lg p-3">
          <Text className="text-red-700 font-bold mb-1">Team B</Text>
          <Text className="text-red-600 text-xs">
            {item.teams.teamB.length} joueurs
          </Text>
          <Text className="text-red-600 text-xs">
            ⭐ {item.stats.avgLevelTeamB}/5
          </Text>
        </View>
      </View>

      {/* Différence */}
      <View className="bg-gray-50 rounded-lg p-2 mb-3">
        <Text className="text-gray text-xs text-center">
          Différence : {item.stats.difference.toFixed(1)} ⭐
        </Text>
      </View>

      {/* Actions */}
      <View className="flex-row gap-x-2">
        <TouchableOpacity
          className="flex-1 bg-primary py-2 rounded-lg flex-row items-center justify-center active:opacity-90"
          onPress={() => handleViewSession(item)}
        >
          <Ionicons name="eye" size={18} color="white" />
          <Text className="text-white font-semibold ml-2">Voir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-50 px-4 py-2 rounded-lg items-center justify-center active:bg-red-100"
          onPress={() => handleDeleteSession(item.id)}
        >
          <Ionicons name="trash" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-light">
      {sessions.length === 0 ? (
        // État vide
        <View className="flex-1 items-center justify-center p-6">
          <View className="bg-gray-200 p-6 rounded-full mb-4">
            <Ionicons name="time-outline" size={48} color="#6C757D" />
          </View>
          <Text className="text-xl font-bold text-dark mb-2">
            Aucun historique
          </Text>
          <Text className="text-gray text-center mb-6">
            Les sessions que tu sauvegardes apparaîtront ici.
          </Text>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-xl"
            onPress={() => router.push("/session/config")}
          >
            <Text className="text-white font-bold">Créer une session</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Liste des sessions
        <>
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            renderItem={renderSession}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          />

          {/* Bouton Tout effacer (fixe en bas) */}
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <TouchableOpacity
              className="bg-red-500 py-4 rounded-xl items-center active:opacity-90"
              onPress={handleClearAll}
            >
              <Text className="text-white font-bold">
                🗑️ Tout effacer l'historique
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
