import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSessionStore } from "../../store/useSessionStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const router = useRouter();

  // Récupération correcte depuis le store (history et non sessions)
  const history = useSessionStore((state) => state.sessions);
  const deleteFromHistory = useSessionStore((state) => state.deleteFromHistory);
  const clearHistory = useSessionStore(
    (state) =>
      state.clearHistory || (() => useSessionStore.setState({ history: [] }))
  ); // Fallback si la fonction n'existe pas

  // Fonction pour charger une vieille session dans la vue résultat
  const handleViewSession = (session) => {
    // On injecte manuellement la session dans le store comme "currentSession"
    useSessionStore.setState({ currentSession: session });
    router.push("/session/result");
  };

  const handleDeleteSession = (sessionId) => {
    Alert.alert("Supprimer", "Retirer ce match de l'historique ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => deleteFromHistory(sessionId),
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert("Attention", "Vider tout l'historique ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Tout effacer",
        style: "destructive",
        onPress: () => useSessionStore.setState({ history: [] }),
      },
    ]);
  };

  // Helper pour la date (Jour / Mois)
  const getDateParts = (isoString) => {
    const date = new Date(isoString);
    return {
      day: date.getDate(),
      month: date
        .toLocaleDateString("fr-FR", { month: "short" })
        .toUpperCase()
        .replace(".", ""),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      year: date.getFullYear(),
    };
  };

  // Composant : Carte de Match (Design Ticket)
  const MatchCard = ({ item }) => {
    const { day, month, time, year } = getDateParts(item.date);
    const isBalanced = item.method === "balanced";

    return (
      <TouchableOpacity
        className="bg-white rounded-3xl mb-4 shadow-sm border border-gray-100 flex-row overflow-hidden active:scale-[0.98]"
        onPress={() => handleViewSession(item)}
      >
        {/* Colonne Date (Style Ticket) */}
        <View className="bg-gray-100 w-20 items-center justify-center border-r border-dashed border-gray-300 py-4">
          <Text className="text-gray-400 text-xs font-bold uppercase mb-1">
            {month}
          </Text>
          <Text className="text-dark font-black text-3xl">{day}</Text>
          <Text className="text-gray-400 text-xs font-bold mt-1">{year}</Text>
        </View>

        {/* Contenu Principal */}
        <View className="flex-1 p-4 justify-between">
          {/* Header Carte */}
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                {time} • {item.players.length} JOUEURS
              </Text>
              <View className="flex-row items-center">
                <Ionicons
                  name={
                    isBalanced
                      ? "options"
                      : item.method === "random"
                      ? "shuffle"
                      : "location"
                  }
                  size={12}
                  color="#007BFF"
                />
                <Text className="text-primary font-bold text-xs ml-1 uppercase">
                  Mode{" "}
                  {isBalanced
                    ? "Équilibré"
                    : item.method === "random"
                    ? "Aléatoire"
                    : "Postes"}
                </Text>
              </View>
            </View>

            {/* Bouton Supprimer discret */}
            <TouchableOpacity
              onPress={() => handleDeleteSession(item.id)}
              className="bg-gray-50 p-2 rounded-full"
            >
              <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          {/* VS Visuel */}
          <View className="flex-row items-center mt-2">
            <View className="flex-1 flex-row items-center">
              <View className="w-2 h-8 bg-blue-500 rounded-full mr-2" />
              <View>
                <Text className="font-bold text-dark text-sm">Team A</Text>
                <View className="flex-row">
                  {[...Array(Math.round(item.stats?.avgLevelTeamA || 0))].map(
                    (_, i) => (
                      <Ionicons key={i} name="star" size={8} color="#FFC107" />
                    )
                  )}
                </View>
              </View>
            </View>

            <Text className="text-gray-300 font-black italic mx-2">VS</Text>

            <View className="flex-1 flex-row items-center justify-end">
              <View className="items-end">
                <Text className="font-bold text-dark text-sm">Team B</Text>
                <View className="flex-row">
                  {[...Array(Math.round(item.stats?.avgLevelTeamB || 0))].map(
                    (_, i) => (
                      <Ionicons key={i} name="star" size={8} color="#FFC107" />
                    )
                  )}
                </View>
              </View>
              <View className="w-2 h-8 bg-red-500 rounded-full ml-2" />
            </View>
          </View>
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
              Archives
            </Text>
            <Text className="text-3xl font-black text-dark italic tracking-tighter">
              Match <Text className="text-primary">History</Text>
            </Text>
          </View>
          <View className="bg-blue-50 w-12 h-12 rounded-2xl items-center justify-center">
            <Ionicons name="time" size={24} color="#007BFF" />
          </View>
        </View>
      </View>

      {/* Liste */}
      {history?.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8 opacity-50">
          <View className="bg-gray-200 p-6 rounded-full mb-4">
            <Ionicons name="trophy-outline" size={48} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-bold text-gray-500">
            Aucun match joué
          </Text>
          <Text className="text-gray-400 text-center mt-2 px-6">
            Générez des équipes et sauvegardez-les pour remplir votre
            historique.
          </Text>
          <TouchableOpacity
            className="mt-6 bg-primary px-6 py-3 rounded-xl"
            onPress={() => router.push("/session/config")}
          >
            <Text className="text-white font-bold">Lancer un match</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MatchCard item={item} />}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Footer : Bouton Clear All */}
          {history?.length > 0 && (
            <View className="absolute bottom-8 align-center self-center">
              <TouchableOpacity
                onPress={handleClearAll}
                className="bg-white px-5 py-2 rounded-full shadow-lg border border-gray-100 flex-row items-center"
              >
                <Ionicons name="trash-bin" size={16} color="#EF4444" />
                <Text className="text-red-500 font-bold text-xs ml-2 uppercase">
                  Vider l'historique
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
