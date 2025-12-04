import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../store/usePlayerStore";

export default function HomeScreen() {
  const router = useRouter();
  // On récupère le nombre de joueurs pour rendre l'écran "vivant"
  const playersCount = usePlayerStore((state) => state.players.length);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* --- ZONE D'EN-TÊTE (Background Bleu) --- */}
      <View className="bg-primary h-[35%] rounded-b-[40px] pt-12 px-6 items-center shadow-lg z-10 relative">
        {/* Motif décoratif de fond (cercles) */}
        <View className="absolute top-[-50] left-[-50] w-40 h-40 bg-white/10 rounded-full" />
        <View className="absolute top-[20] right-[-20] w-20 h-20 bg-white/10 rounded-full" />

        {/* Logo & Titre */}
        <View className="items-center mb-4">
          <View className="bg-white/20 p-4 rounded-2xl backdrop-blur-md mb-3 border border-white/10">
            <Ionicons name="football" size={42} color="white" />
          </View>
          <Text className="text-4xl font-black text-white italic tracking-tighter">
            Team<Text className="text-yellow-400">Shuffle</Text>
          </Text>
          <Text className="text-blue-100 font-medium text-sm mt-1 tracking-widest uppercase">
            Générateur d'équipes Pro
          </Text>
        </View>

        {/* Badge Info Rapide */}
        <View className="bg-white/10 px-4 py-1 rounded-full flex-row items-center border border-white/20">
          <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
          <Text className="text-white text-xs font-bold">
            {playersCount} Joueur{playersCount !== 1 ? "s" : ""} dans le
            vestiaire
          </Text>
        </View>
      </View>

      {/* --- ZONE DE CONTENU (Chevauchement) --- */}
      <View className="flex-1 px-6 -mt-10">
        {/* 1. CARTE PRINCIPALE : Lancer le match */}
        <TouchableOpacity
          className="bg-white rounded-3xl p-6 shadow-xl mb-6 flex-row items-center justify-between active:scale-[0.98] transition-transform"
          style={{ elevation: 10 }}
          onPress={() => router.push("/session/config")}
        >
          <View className="flex-1 pr-4">
            <Text className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">
              Prêt à jouer ?
            </Text>
            <Text className="text-dark font-black text-2xl mb-2">
              Créer des équipes
            </Text>
            <Text className="text-gray-500 text-sm leading-5">
              Aléatoire, Équilibré ou par Postes.
            </Text>
          </View>
          <View className="bg-primary w-14 h-14 rounded-2xl items-center justify-center shadow-lg shadow-blue-200">
            <Ionicons
              name="play"
              size={28}
              color="white"
              style={{ marginLeft: 4 }}
            />
          </View>
        </TouchableOpacity>

        {/* 2. GRILLE D'ACTIONS SECONDAIRES */}
        <View className="flex-row gap-4 mb-6">
          {/* Carte : Mes Joueurs */}
          <TouchableOpacity
            className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 active:bg-gray-50"
            onPress={() => router.push("/players")}
          >
            <View className="bg-green-100 w-10 h-10 rounded-xl items-center justify-center mb-3">
              <Ionicons name="people" size={20} color="#34C759" />
            </View>
            <Text className="text-dark font-bold text-lg mb-1">Effectif</Text>
            <Text className="text-gray-400 text-xs font-medium">
              Gérer les joueurs et niveaux
            </Text>
          </TouchableOpacity>

          {/* Carte : Historique */}
          <TouchableOpacity
            className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 active:bg-gray-50"
            onPress={() => router.push("/history")}
          >
            <View className="bg-orange-100 w-10 h-10 rounded-xl items-center justify-center mb-3">
              <Ionicons name="time" size={20} color="#FF9500" />
            </View>
            <Text className="text-dark font-bold text-lg mb-1">Historique</Text>
            <Text className="text-gray-400 text-xs font-medium">
              Revoir les matchs passés
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. SETTINGS / EXTRAS (Optionnel) */}
        <TouchableOpacity
          className="bg-white/60 p-4 rounded-2xl border border-dashed border-gray-300 flex-row items-center justify-center mb-4 active:bg-white"
          onPress={() => alert("Bientôt disponible !")}
        >
          <Ionicons
            name="settings-outline"
            size={18}
            color="#6C757D"
            className="mr-2"
          />
          <Text className="text-gray-500 font-bold text-sm">
            Paramètres de l'application
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer minimaliste */}
      <View className="items-center pb-8">
        <Text className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">
          Version MVP 1.0 • Built with Expo
        </Text>
      </View>
    </View>
  );
}
