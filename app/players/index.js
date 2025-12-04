import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../../store/usePlayerStore";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayersListScreen() {
  const router = useRouter();
  const players = usePlayerStore((state) => state.players);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les joueurs selon la recherche
  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Badge de poste stylisé
  const PositionBadge = ({ position }) => {
    const styles = {
      G: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
      },
      D: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      M: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
      },
      A: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
    };
    const style = styles[position] || styles.M;

    return (
      <View
        className={`${style.bg} ${style.border} border w-10 h-10 rounded-xl items-center justify-center mr-4`}
      >
        <Text className={`${style.text} font-black text-lg`}>{position}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* En-tête avec Recherche */}
      <View className="bg-white px-4 pt-4 pb-4 rounded-b-[30px] shadow-sm z-10">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-black text-dark italic tracking-tighter">
            Effectif <Text className="text-primary">Pro</Text>
          </Text>
          <View className="bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-gray-500 font-bold text-xs">
              {players.length} Joueurs
            </Text>
          </View>
        </View>

        {/* Barre de recherche */}
        <View className="bg-gray-100 flex-row items-center px-4 py-3 rounded-2xl border border-gray-200">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Rechercher un joueur..."
            className="flex-1 ml-3 font-medium text-dark"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Liste */}
      {players.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8 opacity-60">
          <Ionicons name="people" size={64} color="#D1D5DB" />
          <Text className="text-xl font-bold text-gray-400 mt-4 text-center">
            Le vestiaire est vide.
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Ajoute ton premier joueur pour commencer.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlayers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-10">
              Aucun joueur trouvé pour "{searchQuery}"
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white p-4 rounded-2xl mb-3 shadow-sm flex-row items-center border border-gray-100 active:scale-[0.98]"
              onPress={() => router.push(`/players/${item.id}`)}
            >
              <PositionBadge position={item.position} />

              <View className="flex-1">
                <Text className="text-lg font-bold text-dark">{item.name}</Text>
                <View className="flex-row items-center mt-1">
                  {/* Indicateur de niveau visuel (Barre de progression style jeu vidéo) */}
                  <View className="flex-row gap-0.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <View
                        key={lvl}
                        className={`h-1.5 w-6 rounded-full ${
                          lvl <= item.level ? "bg-primary" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#E5E7EB" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* FAB (Floating Action Button) */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-dark w-16 h-16 rounded-full items-center justify-center shadow-2xl border-4 border-white/20"
        onPress={() => router.push("/players/new")}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
