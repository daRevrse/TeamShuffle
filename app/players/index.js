import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../../store/usePlayerStore"; // Import du store

export default function PlayersListScreen() {
  const router = useRouter();
  // Récupérer les joueurs depuis le store
  const players = usePlayerStore((state) => state.players);

  // Fonction pour afficher le badge de poste
  const renderPositionBadge = (position) => {
    const colors = {
      G: "bg-yellow-500", // Gardien
      D: "bg-blue-500", // Défenseur
      M: "bg-green-500", // Milieu
      A: "bg-red-500", // Attaquant
    };
    return (
      <View
        className={`${
          colors[position] || "bg-gray-500"
        } w-8 h-8 rounded-full items-center justify-center mr-3`}
      >
        <Text className="text-white font-bold">{position}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-light">
      {/* Liste des joueurs */}
      {players.length === 0 ? (
        // État vide (Empty State)
        <View className="flex-1 items-center justify-center p-8">
          <View className="bg-gray-200 p-6 rounded-full mb-4">
            <Ionicons name="people-outline" size={48} color="#6C757D" />
          </View>
          <Text className="text-xl font-bold text-dark mb-2">Aucun joueur</Text>
          <Text className="text-gray text-center mb-6">
            Ajoutez vos amis pour commencer à créer des équipes équitables.
          </Text>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-xl flex-row items-center"
            onPress={() => router.push("/players/new")}
          >
            <Ionicons name="add" size={24} color="white" className="mr-2" />
            <Text className="text-white font-bold">Ajouter un joueur</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Liste remplie
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white p-4 rounded-xl mb-3 shadow-sm flex-row items-center border border-gray-100"
              onPress={() => router.push(`/players/${item.id}`)}
            >
              {/* Badge Poste */}
              {renderPositionBadge(item.position)}

              {/* Infos Joueur */}
              <View className="flex-1">
                <Text className="text-lg font-bold text-dark">{item.name}</Text>
                <View className="flex-row items-center">
                  {/* Affichage des étoiles de niveau */}
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < item.level ? "star" : "star-outline"}
                      size={14}
                      color="#FFC107"
                    />
                  ))}
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Bouton Flottant (FAB) pour ajouter */}
      {players.length > 0 && (
        <TouchableOpacity
          className="absolute bottom-8 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
          onPress={() => router.push("/players/new")} // "new" servira d'ID spécial
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}
