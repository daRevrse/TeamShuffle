import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../../store/usePlayerStore";

export default function PlayerFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = id !== "new";
  const { addPlayer, updatePlayer, removePlayer, players } = usePlayerStore();

  const [name, setName] = useState("");
  const [level, setLevel] = useState(3);
  const [position, setPosition] = useState("M");

  useEffect(() => {
    if (isEditing) {
      const playerToEdit = players.find((p) => p.id === id);
      if (playerToEdit) {
        setName(playerToEdit.name);
        setLevel(playerToEdit.level);
        setPosition(playerToEdit.position);
      }
    }
  }, [id]);

  const handleSave = () => {
    if (!name.trim())
      return Alert.alert("Oups !", "Le joueur doit avoir un nom.");
    const playerData = { name, level, position };
    isEditing ? updatePlayer(id, playerData) : addPlayer(playerData);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert("Supprimer", "Sûr de vouloir virer ce joueur ?", [
      { text: "Non", style: "cancel" },
      {
        text: "Oui, supprimer",
        style: "destructive",
        onPress: () => {
          removePlayer(id);
          router.back();
        },
      },
    ]);
  };

  const positions = [
    {
      code: "G",
      label: "Gardien",
      color: "bg-yellow-500",
      border: "border-yellow-500",
    },
    {
      code: "D",
      label: "Défenseur",
      color: "bg-blue-500",
      border: "border-blue-500",
    },
    {
      code: "M",
      label: "Milieu",
      color: "bg-green-500",
      border: "border-green-500",
    },
    {
      code: "A",
      label: "Attaquant",
      color: "bg-red-500",
      border: "border-red-500",
    },
  ];

  // Trouver la couleur active pour la preview
  const activeColor =
    positions.find((p) => p.code === position)?.color || "bg-gray-500";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <Stack.Screen
        options={{
          headerTitle: "", // On masque le titre par défaut pour un look plus propre
          headerTransparent: true,
          headerTintColor: isEditing ? "#1A1A1A" : "#1A1A1A",
          headerRight: () =>
            isEditing ? (
              <TouchableOpacity
                onPress={handleDelete}
                className="bg-red-100 p-2 rounded-full"
              >
                <Ionicons name="trash" size={20} color="#FF3B30" />
              </TouchableOpacity>
            ) : null,
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* --- ZONE DE PREVIEW (CARTE) --- */}
        <View className="items-center justify-center pt-24 pb-8 px-6">
          <View className="bg-white w-full max-w-[280px] rounded-3xl p-6 shadow-xl border border-gray-100 items-center">
            {/* Haut de la carte */}
            <View className="flex-row w-full justify-between items-start mb-4">
              <View className="items-center">
                <Text className="text-4xl font-black text-dark">{level}</Text>
                <Text className="text-xs font-bold text-gray-400 uppercase">
                  NIV
                </Text>
              </View>
              <View
                className={`${activeColor} w-12 h-12 rounded-xl items-center justify-center shadow-lg`}
              >
                <Text className="text-white font-black text-xl">
                  {position}
                </Text>
              </View>
            </View>

            {/* Avatar (Placeholder) */}
            <View className="bg-gray-50 w-24 h-24 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm">
              <Ionicons name="person" size={48} color="#D1D5DB" />
            </View>

            {/* Nom */}
            <Text
              className="text-2xl font-black text-dark text-center uppercase tracking-tighter"
              numberOfLines={1}
            >
              {name || "Nom du joueur"}
            </Text>
            <Text className="text-gray-400 text-xs font-bold mt-1 tracking-widest">
              TEAMSHUFFLE CARD
            </Text>
          </View>
        </View>

        {/* --- FORMULAIRE --- */}
        <View className="bg-white rounded-t-[40px] px-6 pt-8 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          {/* Input Nom */}
          <Text className="text-gray-400 font-bold text-xs uppercase mb-2 ml-1">
            Identité
          </Text>
          <TextInput
            className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-xl font-bold text-dark mb-6"
            placeholder="Nom du joueur"
            value={name}
            onChangeText={setName}
          />

          {/* Sélecteur Niveau */}
          <Text className="text-gray-400 font-bold text-xs uppercase mb-2 ml-1">
            Niveau de jeu
          </Text>
          <View className="bg-gray-50 p-2 rounded-2xl border border-gray-100 flex-row justify-between mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setLevel(star)}
                className={`flex-1 py-3 items-center rounded-xl ${
                  level === star ? "bg-white shadow-sm" : ""
                }`}
              >
                <Ionicons
                  name="star"
                  size={24}
                  color={star <= level ? "#FFC107" : "#E5E7EB"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Sélecteur Poste */}
          <Text className="text-gray-400 font-bold text-xs uppercase mb-2 ml-1">
            Poste Préféré
          </Text>
          <View className="flex-row flex-wrap justify-between gap-3 mb-8">
            {positions.map((pos) => {
              const isActive = position === pos.code;
              return (
                <TouchableOpacity
                  key={pos.code}
                  className={`flex-1 min-w-[45%] py-4 rounded-2xl items-center border-2 ${
                    isActive
                      ? pos.border + " bg-white"
                      : "border-transparent bg-gray-50"
                  }`}
                  onPress={() => setPosition(pos.code)}
                >
                  <Text
                    className={`font-black text-lg ${
                      isActive ? "text-dark" : "text-gray-400"
                    }`}
                  >
                    {pos.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bouton Sauvegarder */}
          <TouchableOpacity
            className="bg-primary w-full py-5 rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98]"
            onPress={handleSave}
          >
            <Text className="text-white text-center font-bold text-xl uppercase tracking-wider">
              {isEditing ? "Mettre à jour" : "Créer la carte"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
