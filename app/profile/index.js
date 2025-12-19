import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Share,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../../store/usePlayerStore";
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";
import { AVATARS } from "../../constants/avatars";

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, updateUserProfile } = usePlayerStore();

  // États locaux pour le formulaire
  const [name, setName] = useState(userProfile.name);
  const [level, setLevel] = useState(userProfile.level);
  const [position, setPosition] = useState(userProfile.position);
  const [avatarId, setAvatarId] = useState(userProfile.avatarId || 1);
  const [jerseyNumber, setJerseyNumber] = useState(
    userProfile.jerseyNumber ? String(userProfile.jerseyNumber) : ""
  );

  // Mettre à jour le store quand on quitte ou sauvegarde
  const handleSave = () => {
    updateUserProfile({
      name,
      level,
      position,
      avatarId,
      jerseyNumber: jerseyNumber ? parseInt(jerseyNumber) : null,
    });
    if (router.canGoBack()) router.back();
  };

  // Génération du lien de partage (Token)
  const generateShareData = () => {
    // 1. On crée un objet léger (minifié pour réduire la taille du QR)
    const data = {
      n: name, // Nom
      l: level, // Niveau
      p: position, // Poste
      id: userProfile.id, // ID Unique
    };

    // 2. Encodage en chaîne JSON puis URI component
    const jsonString = JSON.stringify(data);
    const encodedData = encodeURIComponent(jsonString);

    // 3. Création du Deep Link
    // Format : teamshuffle://import?data=...
    const deepLink = Linking.createURL("import", {
      queryParams: { data: encodedData },
    });

    return deepLink;
  };

  const shareLink = async () => {
    // 1. On récupère les données brutes
    const data = {
      n: name,
      l: level,
      p: position,
      id: userProfile.id,
    };

    // 2. On encode juste le JSON (pas besoin de Linking.createURL ici)
    const jsonString = JSON.stringify(data);
    const encodedData = encodeURIComponent(jsonString);

    const webUrl = `https://teamshuffle.flowkraftagency.com/share.html?data=${encodedData}`;

    try {
      await Share.share({
        // Message plus sympa
        message: `Rejoins ma team sur TeamShuffle ! ⚽\nClique ici pour m'ajouter : ${webUrl}`,
        // URL pour iOS (optionnel mais recommandé)
        url: webUrl,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  // Positions disponibles
  const positions = [
    { code: "G", label: "Gardien", color: "bg-yellow-500" },
    { code: "D", label: "Défenseur", color: "bg-blue-500" },
    { code: "M", label: "Milieu", color: "bg-green-500" },
    { code: "A", label: "Attaquant", color: "bg-red-500" },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <Stack.Screen
        options={{ title: "Mon Profil & QR", presentation: "modal" }}
      />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
        {/* --- CARTE D'IDENTITÉ (QR CODE) --- */}
        <View className="items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
          {/* Avatar avec badge numéro */}
          <View className="relative mb-4">
            <View className="bg-gray-50 rounded-full p-4">
              <Image
                source={AVATARS.find((a) => a.id === avatarId)?.source || AVATARS[0].source}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
            </View>
            {jerseyNumber && (
              <View className="absolute -bottom-1 -right-1 bg-dark w-10 h-10 rounded-full items-center justify-center border-2 border-white shadow-lg">
                <Text className="text-white font-black text-sm">
                  {jerseyNumber}
                </Text>
              </View>
            )}
          </View>

          <View className="bg-white p-2 rounded-xl shadow-sm mb-4">
            {/* Le QR Code contient le lien Deep Link */}
            <QRCode
              value={generateShareData()}
              size={160}
              color="black"
              backgroundColor="white"
            />
          </View>
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
            SCANNE POUR M'AJOUTER
          </Text>
          <Text className="text-2xl font-black text-dark text-center">
            {name}
          </Text>
          <View className="flex-row items-center mt-2 bg-gray-100 px-3 py-1 rounded-full">
            <Text className="font-bold text-gray-600 mr-2">
              {positions.find((p) => p.code === position)?.label}
            </Text>
            <View className="flex-row">
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name="star"
                  size={12}
                  color={i < level ? "#FFC107" : "#D1D5DB"}
                />
              ))}
            </View>
          </View>
        </View>

        {/* --- ACTIONS PARTAGE --- */}
        <TouchableOpacity
          className="bg-primary flex-row items-center justify-center py-4 rounded-2xl shadow-lg shadow-blue-200 mb-8"
          onPress={shareLink}
        >
          <Ionicons
            name="share-outline"
            size={24}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white font-bold text-lg">
            Partager mon lien
          </Text>
        </TouchableOpacity>

        {/* --- FORMULAIRE D'ÉDITION --- */}
        <Text className="text-dark font-bold text-lg mb-4">
          Modifier mes infos
        </Text>

        {/* Sélecteur Avatar */}
        <View className="bg-white p-4 rounded-2xl border border-gray-100 mb-4">
          <Text className="text-gray-400 text-xs font-bold uppercase mb-3">
            Choisis ton avatar
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
                    isActive ? "border-primary bg-blue-50" : "border-gray-200 bg-gray-50"
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

        {/* Nom */}
        <View className="bg-white p-4 rounded-2xl border border-gray-100 mb-4">
          <Text className="text-gray-400 text-xs font-bold uppercase mb-1">
            Nom du joueur
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="text-lg font-bold text-dark"
            placeholder="Ton pseudo"
          />
        </View>

        {/* Numéro de Maillot */}
        <View className="bg-white p-4 rounded-2xl border border-gray-100 mb-4">
          <Text className="text-gray-400 text-xs font-bold uppercase mb-1">
            Numéro de Maillot (Optionnel)
          </Text>
          <TextInput
            value={jerseyNumber}
            onChangeText={setJerseyNumber}
            className="text-lg font-bold text-dark text-center"
            placeholder="Ex: 10"
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>

        {/* Niveau */}
        <View className="bg-white p-4 rounded-2xl border border-gray-100 mb-4 flex-row justify-between items-center">
          <Text className="text-gray-400 text-xs font-bold uppercase">
            Niveau
          </Text>
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setLevel(star)}
                className="p-1"
              >
                <Ionicons
                  name={star <= level ? "star" : "star-outline"}
                  size={28}
                  color="#FFC107"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Poste */}
        <View className="flex-row justify-between gap-2 mb-8">
          {positions.map((pos) => (
            <TouchableOpacity
              key={pos.code}
              className={`flex-1 py-3 items-center rounded-xl border-2 ${
                position === pos.code
                  ? "bg-white border-primary"
                  : "bg-gray-100 border-transparent"
              }`}
              onPress={() => setPosition(pos.code)}
            >
              <Text
                className={`font-bold ${
                  position === pos.code ? "text-primary" : "text-gray-400"
                }`}
              >
                {pos.code}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleSave} className="items-center py-4">
          <Text className="text-gray-400 font-bold">Fermer et Sauvegarder</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
