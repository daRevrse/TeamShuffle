import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../../store/usePlayerStore";
import { AVATARS } from "../../constants/avatars";

export default function PlayerFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = id !== "new";

  // On récupère les données et actions du store
  const {
    addPlayer,
    updatePlayer,
    removePlayer,
    players,
    groups,
    activeGroupId,
  } = usePlayerStore();

  // États locaux
  const [name, setName] = useState("");
  const [level, setLevel] = useState(3);
  const [position, setPosition] = useState("M");
  const [groupId, setGroupId] = useState(activeGroupId || "default");
  const [avatarId, setAvatarId] = useState(1);
  const [jerseyNumber, setJerseyNumber] = useState("");

  // Chargement des données en mode édition
  useEffect(() => {
    if (isEditing && id) {
      const playerToEdit = players.find((p) => p.id === id);
      if (playerToEdit) {
        setName(playerToEdit.name);
        setLevel(playerToEdit.level);
        setPosition(playerToEdit.position);
        setGroupId(playerToEdit.groupId || "default");
        setAvatarId(playerToEdit.avatarId || 1);
        setJerseyNumber(
          playerToEdit.jerseyNumber ? String(playerToEdit.jerseyNumber) : ""
        );
      }
    }
  }, [id]);

  // Sauvegarde
  const handleSave = () => {
    if (!name.trim())
      return Alert.alert("Oups !", "Le joueur doit avoir un nom.");

    const playerData = {
      name,
      level,
      position,
      groupId,
      avatarId,
      jerseyNumber: jerseyNumber ? parseInt(jerseyNumber) : null,
    };

    isEditing ? updatePlayer(id, playerData) : addPlayer(playerData);
    router.back();
  };

  // Suppression
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

  // Configuration des postes avec couleurs associées
  const positions = [
    {
      code: "G",
      label: "Gardien",
      color: "bg-yellow-500",
      text: "text-yellow-600",
      bgLight: "bg-yellow-50",
      border: "border-yellow-500",
    },
    {
      code: "D",
      label: "Défenseur",
      color: "bg-blue-500",
      text: "text-blue-600",
      bgLight: "bg-blue-50",
      border: "border-blue-500",
    },
    {
      code: "M",
      label: "Milieu",
      color: "bg-green-500",
      text: "text-green-600",
      bgLight: "bg-green-50",
      border: "border-green-500",
    },
    {
      code: "A",
      label: "Attaquant",
      color: "bg-red-500",
      text: "text-red-600",
      bgLight: "bg-red-50",
      border: "border-red-500",
    },
  ];

  // Trouver le style du poste actif
  const activeStyle =
    positions.find((p) => p.code === position) || positions[2]; // Fallback M

  // Récupérer l'avatar actuel
  const currentAvatar = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "#1A1A1A",
          headerRight: () =>
            isEditing ? (
              <TouchableOpacity
                onPress={handleDelete}
                className="bg-red-50 p-2 rounded-full border border-red-100"
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
        <TouchableOpacity
          className="absolute top-14 left-4"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        {/* --- ZONE DE PREVIEW (CARTE DYNAMIQUE) --- */}
        <View className="items-center justify-center pt-28 pb-8 px-6">
          <View
            className={`w-full max-w-[280px] rounded-[24px] p-1 shadow-2xl ${activeStyle.color}`}
          >
            <View className="bg-white rounded-[22px] p-5 items-center overflow-hidden relative">
              {/* Badge Poste dans le coin */}
              <View
                className={`absolute top-0 right-0 ${activeStyle.color} w-16 h-16 rounded-bl-3xl items-center justify-center pl-2 pb-2`}
              >
                <Text className="text-white font-black text-2xl">
                  {position}
                </Text>
              </View>

              {/* Niveau (Gros chiffre) */}
              <View className="items-center mt-2 mb-2">
                <Text className="text-6xl font-black text-dark tracking-tighter">
                  {level}
                </Text>
                <View className="flex-row gap-1">
                  {[...Array(level)].map((_, i) => (
                    <Ionicons key={i} name="star" size={14} color="#FFC107" />
                  ))}
                </View>
              </View>

              {/* Avatar avec numéro */}
              <View className="relative mb-4">
                <View className="w-24 h-24 rounded-full items-center justify-center">
                  <Image
                    source={currentAvatar.source}
                    style={{ width: 80, height: 80 }}
                    resizeMode="contain"
                  />
                </View>
                {jerseyNumber && (
                  <View className="absolute -bottom-2 -right-2 bg-dark w-10 h-10 rounded-full items-center justify-center border-2 border-white shadow-lg">
                    <Text className="text-white font-black text-sm">
                      {jerseyNumber}
                    </Text>
                  </View>
                )}
              </View>

              {/* Nom */}
              <Text
                className="text-2xl font-black text-dark text-center uppercase tracking-tighter mb-1"
                numberOfLines={1}
              >
                {name || "NOM"}
              </Text>

              {/* Groupe (Badge discret) */}
              <View className="bg-gray-100 px-3 py-1 rounded-full">
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {groups.find((g) => g.id === groupId)?.name || "GÉNÉRAL"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* --- FORMULAIRE --- */}
        <View className="bg-white rounded-t-[32px] px-6 pt-8 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          {/* Input Nom */}
          <View className="mb-6">
            <Text className="text-gray-400 font-bold text-xs uppercase mb-2 ml-1">
              Identité
            </Text>
            <TextInput
              className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-xl font-bold text-dark"
              placeholder="Nom du joueur"
              placeholderTextColor="#C7C7CC"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Sélecteur de Groupe */}
          <View className="mb-6">
            <Text className="text-gray-400 font-bold text-xs uppercase mb-2 ml-1">
              Groupe
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {groups.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  onPress={() => setGroupId(g.id)}
                  className={`mr-3 px-5 py-3 rounded-xl border-2 transition-all ${
                    groupId === g.id
                      ? "bg-dark border-dark"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      groupId === g.id ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {g.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Sélecteur Niveau */}
          <View className="mb-6">
            <Text className="text-gray-400 font-bold text-xs uppercase mb-2 ml-1">
              Niveau global ({level}/5)
            </Text>
            <View className="bg-gray-50 p-2 rounded-2xl border border-gray-100 flex-row justify-between">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => {
                    console.log("Niveau sélectionné:", star);
                    setLevel(star);
                  }}
                  activeOpacity={0.7}
                  style={[
                    {
                      flex: 1,
                      paddingVertical: 16,
                      alignItems: "center",
                      borderRadius: 12,
                    },
                    level === star && {
                      backgroundColor: "#FFFFFF",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2, // Android shadow
                    },
                  ]}
                >
                  <Ionicons
                    name={star <= level ? "star" : "star-outline"}
                    size={32}
                    color={star <= level ? "#FFC107" : "#E5E7EB"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sélecteur Avatar */}
          <View className="mb-6">
            <Text className="text-gray-400 font-bold text-xs uppercase mb-2 ml-1">
              Avatar
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {AVATARS.map((avatar) => {
                const isActive = avatarId === avatar.id;
                return (
                  <TouchableOpacity
                    key={avatar.id}
                    onPress={() => setAvatarId(avatar.id)}
                    className={`mr-3 w-16 h-16 rounded-full items-center justify-center border-3 ${
                      isActive ? "border-dark" : "border-gray-200"
                    }`}
                  >
                    <Image
                      source={avatar.source}
                      style={{ width: 48, height: 48 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Numéro de Dossard */}
          <View className="mb-6">
            <Text className="text-gray-400 font-bold text-xs uppercase mb-2 ml-1">
              Numéro de Dossard (Optionnel)
            </Text>
            <TextInput
              className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-xl font-bold text-dark text-center"
              placeholder="Ex: 10"
              placeholderTextColor="#C7C7CC"
              keyboardType="number-pad"
              maxLength={2}
              value={jerseyNumber}
              onChangeText={setJerseyNumber}
            />
          </View>

          {/* Sélecteur Poste */}
          <View className="mb-8">
            <Text className="text-gray-400 font-bold text-xs uppercase mb-2 ml-1">
              Poste sur le terrain
            </Text>
            <View className="flex-row flex-wrap justify-between gap-3">
              {positions.map((pos) => {
                const isActive = position === pos.code;
                return (
                  <TouchableOpacity
                    key={pos.code}
                    className={`flex-1 min-w-[45%] py-4 rounded-2xl items-center border-2 ${
                      isActive
                        ? `${pos.bgLight} ${pos.border}`
                        : "border-transparent bg-gray-50"
                    }`}
                    onPress={() => setPosition(pos.code)}
                  >
                    <Text
                      className={`font-black text-lg ${
                        isActive ? pos.text : "text-gray-400"
                      }`}
                    >
                      {pos.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Bouton Action */}
          <TouchableOpacity
            className={`w-full py-5 rounded-2xl shadow-lg active:opacity-90 ${
              name.trim().length > 0 ? "bg-dark" : "bg-gray"
            }`}
            onPress={handleSave}
            disabled={name.trim().length === 0}
          >
            <Text className="text-white text-center font-bold text-xl uppercase tracking-wider">
              {isEditing ? "Sauvegarder" : "Créer la carte"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
