import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Icônes minimalistes

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-light items-center justify-center px-6">
      {/* En-tête / Logo */}
      <View className="items-center mb-12">
        <View className="bg-primary/10 p-6 rounded-full mb-4">
          <Ionicons name="football" size={64} color="#007BFF" />
        </View>
        <Text className="text-4xl font-bold text-dark">
          Team<Text className="text-primary">Shuffle</Text>
        </Text>
        <Text className="text-gray text-center mt-2 text-lg">
          Des équipes équitables en quelques secondes.
        </Text>
      </View>

      {/* Bouton Principal : Créer des équipes */}
      <TouchableOpacity
        className="w-full bg-primary py-5 px-6 rounded-2xl shadow-lg flex-row items-center justify-center mb-6 active:opacity-90"
        onPress={() => router.push("/session/config")}
      >
        <Ionicons name="play" size={28} color="white" className="mr-3" />
        <Text className="text-white text-xl font-bold ml-2">
          Créer des équipes
        </Text>
      </TouchableOpacity>

      {/* Boutons Secondaires */}
      <View className="w-full gap-y-4">
        {/* Gestion des joueurs */}
        <TouchableOpacity
          className="w-full bg-white py-4 px-6 rounded-xl border border-gray-200 shadow-sm flex-row items-center active:bg-gray-50"
          onPress={() => router.push("/players")}
        >
          <View className="bg-success/10 p-2 rounded-lg mr-4">
            <Ionicons name="people" size={24} color="#34C759" />
          </View>
          <View className="flex-1">
            <Text className="text-dark text-lg font-semibold">Mes Joueurs</Text>
            <Text className="text-gray text-sm">
              Ajouter, modifier ou noter
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        {/* Historique */}
        <TouchableOpacity
          className="w-full bg-white py-4 px-6 rounded-xl border border-gray-200 shadow-sm flex-row items-center active:bg-gray-50"
          onPress={() => router.push("/history")} // Nous créerons cette route plus tard
        >
          <View className="bg-warning/10 p-2 rounded-lg mr-4">
            <Ionicons name="time" size={24} color="#FFC107" />
          </View>
          <View className="flex-1">
            <Text className="text-dark text-lg font-semibold">Historique</Text>
            <Text className="text-gray text-sm">
              Retrouver les compos passées
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      {/* Version footer */}
      <Text className="absolute bottom-8 text-gray-400 text-xs">
        Version MVP 1.0
      </Text>
    </SafeAreaView>
  );
}
