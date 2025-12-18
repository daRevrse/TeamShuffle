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
      <View className="bg-primary h-[35%] rounded-b-[30px] pt-16 px-6 items-center shadow-lg z-10 relative">
        {/* Motif décoratif de fond (cercles) */}
        <View className="absolute top-[-50] left-[-50] w-40 h-40 bg-white/10 rounded-full" />
        <View className="absolute top-[20] right-[-20] w-20 h-20 bg-white/10 rounded-full" />

        {/* Logo & Titre */}
        <View className="items-center mb-3">
          <View className="mb-2 shadow-lg">
            <Image
              source={require("../assets/logo_in_app.png")}
              style={{ width: 70, height: 70 }}
              resizeMode="contain"
            />
          </View>
          <Text className="text-3xl font-black text-white italic tracking-tighter">
            Team<Text className="text-yellow-400">Shuffle</Text>
          </Text>
          <Text className="text-blue-100 font-medium text-xs mt-0.5 tracking-widest uppercase">
            Générateur d'équipes
          </Text>
        </View>

        {/* Badge Info Rapide */}
        <View className="bg-white/10 px-3 py-1 rounded-full flex-row items-center border border-white/20">
          <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
          <Text className="text-white text-xs font-bold">
            {playersCount} Joueur{playersCount !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {/* --- ZONE DE CONTENU (Chevauchement) --- */}
      <View className="flex-1 px-6 mt-6">
        {/* 1. CARTE PRINCIPALE : Lancer le match */}
        <TouchableOpacity
          className="bg-white rounded-3xl p-5 shadow-xl mb-4 flex-row items-center justify-between active:scale-[0.98] transition-transform"
          style={{ elevation: 10 }}
          onPress={() => router.push("/session/config")}
        >
          <View className="flex-1 pr-4">
            <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-wider mb-1">
              Prêt à jouer ?
            </Text>
            <Text className="text-dark font-black text-xl mb-1">
              Créer des équipes
            </Text>
            <Text className="text-gray-500 text-xs leading-4">
              Aléatoire, Équilibré ou par Postes.
            </Text>
          </View>
          <View className="bg-primary w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-blue-200">
            <Ionicons
              name="play"
              size={24}
              color="white"
              style={{ marginLeft: 4 }}
            />
          </View>
        </TouchableOpacity>

        {/* 2. GRILLE D'ACTIONS SECONDAIRES */}
        <View className="flex-row gap-3 mb-4">
          {/* Carte : Mes Joueurs */}
          <TouchableOpacity
            className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 active:bg-gray-50"
            onPress={() => router.push("/players")}
          >
            <View className="bg-green-100 w-9 h-9 rounded-xl items-center justify-center mb-2">
              <Ionicons name="people" size={18} color="#34C759" />
            </View>
            <Text className="text-dark font-bold text-base mb-0.5">Effectif</Text>
            <Text className="text-gray-400 text-[11px] font-medium">
              Gérer joueurs
            </Text>
          </TouchableOpacity>

          {/* Carte : Historique */}
          <TouchableOpacity
            className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 active:bg-gray-50"
            onPress={() => router.push("/history")}
          >
            <View className="bg-orange-100 w-9 h-9 rounded-xl items-center justify-center mb-2">
              <Ionicons name="time" size={18} color="#FF9500" />
            </View>
            <Text className="text-dark font-bold text-base mb-0.5">Historique</Text>
            <Text className="text-gray-400 text-[11px] font-medium">
              Matchs passés
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. MODE COMPÉTITION */}
        <TouchableOpacity
          className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-yellow-400 p-4 rounded-3xl shadow-lg mb-3 flex-row items-center justify-between active:scale-[0.98]"
          onPress={() => router.push("/competition")}
        >
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <View className="bg-white/20 px-2 py-0.5 rounded-full mr-2">
                <Text className="text-white text-[9px] font-black uppercase">
                  Nouveau
                </Text>
              </View>
            </View>
            <Text className="text-white font-black text-lg mb-0.5">
              Mode Compétition
            </Text>
            <Text className="text-yellow-50 text-[11px]">
              Tournois et classements
            </Text>
          </View>
          <View className="bg-white/20 w-11 h-11 rounded-2xl items-center justify-center">
            <Ionicons name="trophy" size={24} color="white" />
          </View>
        </TouchableOpacity>

        {/* 4. SETTINGS / EXTRAS */}
        <TouchableOpacity
          className="bg-white/60 p-3 rounded-2xl border border-dashed border-gray-300 flex-row items-center justify-center active:bg-white"
          onPress={() => router.push("/settings")}
        >
          <Ionicons
            name="settings-outline"
            size={16}
            color="#6C757D"
            className="mr-2"
          />
          <Text className="text-gray-500 font-bold text-xs">
            Paramètres
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer minimaliste */}
      <View className="items-center pb-6">
        <Text className="text-gray-300 text-[9px] font-bold uppercase tracking-widest">
          Version 1.0 • FlowKraft
        </Text>
      </View>
    </View>
  );
}
