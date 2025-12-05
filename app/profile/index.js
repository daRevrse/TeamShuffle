import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Share,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../../store/usePlayerStore";
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, updateUserProfile } = usePlayerStore();

  // États locaux pour le formulaire
  const [name, setName] = useState(userProfile.name);
  const [level, setLevel] = useState(userProfile.level);
  const [position, setPosition] = useState(userProfile.position);

  // Mettre à jour le store quand on quitte ou sauvegarde
  const handleSave = () => {
    updateUserProfile({ name, level, position });
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
    const url = generateShareData();
    try {
      await Share.share({
        message: `Ajoute-moi à ta team sur TeamShuffle ! ⚽\n${url}`,
        url: url, // Pour iOS
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
          <View className="bg-white p-2 rounded-xl shadow-sm mb-4">
            {/* Le QR Code contient le lien Deep Link */}
            <QRCode
              value={generateShareData()}
              size={180}
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
