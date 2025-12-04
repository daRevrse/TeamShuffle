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
  const { id } = useLocalSearchParams(); // Récupère l'ID depuis l'URL
  const isEditing = id !== "new";

  // Accès au store
  const { addPlayer, updatePlayer, removePlayer, players } = usePlayerStore();

  // États du formulaire
  const [name, setName] = useState("");
  const [level, setLevel] = useState(3); // Niveau par défaut (Moyen)
  const [position, setPosition] = useState("M"); // Poste par défaut (Milieu)

  // Chargement des données si on est en mode édition
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

  // Gestion de la sauvegarde
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom du joueur est obligatoire.");
      return;
    }

    const playerData = { name, level, position };

    if (isEditing) {
      updatePlayer(id, playerData);
    } else {
      addPlayer(playerData);
    }
    router.back();
  };

  // Gestion de la suppression
  const handleDelete = () => {
    Alert.alert(
      "Supprimer le joueur",
      "Es-tu sûr de vouloir supprimer ce joueur ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            removePlayer(id);
            router.back();
          },
        },
      ]
    );
  };

  // Liste des postes disponibles
  const positions = [
    { code: "G", label: "Gardien", color: "bg-yellow-500" },
    { code: "D", label: "Défenseur", color: "bg-blue-500" },
    { code: "M", label: "Milieu", color: "bg-green-500" },
    { code: "A", label: "Attaquant", color: "bg-red-500" },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-light"
    >
      <Stack.Screen
        options={{
          title: isEditing ? "Modifier le joueur" : "Nouveau joueur",
          headerRight: () =>
            isEditing ? (
              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash" size={24} color="#FF3B30" />
              </TouchableOpacity>
            ) : null,
        }}
      />

      <ScrollView className="flex-1 p-6">
        {/* Champ Nom */}
        <Text className="text-gray-600 font-bold mb-2 uppercase text-xs">
          Nom du joueur
        </Text>
        <TextInput
          className="bg-white p-4 rounded-xl border border-gray-200 text-lg mb-6"
          placeholder="Ex: Zinedine Zidane"
          value={name}
          onChangeText={setName}
          autoFocus={!isEditing} // Focus auto si nouveau
        />

        {/* Sélection du Niveau */}
        <Text className="text-gray-600 font-bold mb-2 uppercase text-xs">
          Niveau global ({level}/5)
        </Text>
        <View className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex-row justify-between items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setLevel(star)}
              className="p-2"
            >
              <Ionicons
                name={star <= level ? "star" : "star-outline"}
                size={32}
                color="#FFC107"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sélection du Poste */}
        <Text className="text-gray-600 font-bold mb-2 uppercase text-xs">
          Poste de prédilection
        </Text>
        <View className="flex-row flex-wrap justify-between gap-2 mb-8">
          {positions.map((pos) => (
            <TouchableOpacity
              key={pos.code}
              className={`w-[48%] py-4 rounded-xl items-center border-2 ${
                position === pos.code
                  ? "border-primary bg-blue-50"
                  : "border-transparent bg-white"
              }`}
              onPress={() => setPosition(pos.code)}
            >
              <View
                className={`${pos.color} w-8 h-8 rounded-full items-center justify-center mb-2`}
              >
                <Text className="text-white font-bold">{pos.code}</Text>
              </View>
              <Text
                className={`font-semibold ${
                  position === pos.code ? "text-primary" : "text-gray-500"
                }`}
              >
                {pos.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bouton de Validation */}
        <TouchableOpacity
          className="bg-primary py-4 rounded-2xl items-center shadow-lg active:opacity-90"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-lg">
            {isEditing ? "Enregistrer les modifications" : "Ajouter le joueur"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
