import { useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { usePlayerStore } from "../store/usePlayerStore";
import { Alert } from "react-native";

export default function ImportScreen() {
  const router = useRouter();
  // Expo Router récupère automatiquement les paramètres de l'URL (?data=...)
  const { data } = useLocalSearchParams();

  const { addPlayer, activeGroupId, groups, players } = usePlayerStore();

  useEffect(() => {
    if (data) {
      // Petit délai pour laisser l'interface se monter
      const timer = setTimeout(() => {
        processImport();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Si on arrive ici sans données, retour accueil
      router.replace("/");
    }
  }, [data]);

  const processImport = () => {
    try {
      // 1. Décodage des données
      // useLocalSearchParams décode souvent déjà l'URI, mais par sécurité :
      console.log("Data reçue:", data);
      const jsonString = typeof data === "string" ? data : JSON.stringify(data);
      const playerData = JSON.parse(jsonString);

      // 2. Validation basique
      if (!playerData.n) {
        throw new Error("Nom manquant");
      }

      // 3. Récupération du nom du groupe actuel pour le message
      const currentGroup = groups.find((g) => g.id === activeGroupId);
      const groupName = currentGroup ? currentGroup.name : "Général";
      const targetGroupId = activeGroupId || "default";

      // 4. Vérification des doublons
      const duplicatePlayer = players.find(
        (p) =>
          p.name.toLowerCase().trim() === playerData.n.toLowerCase().trim() &&
          p.groupId === targetGroupId
      );

      if (duplicatePlayer) {
        // Doublon détecté - proposer les options
        Alert.alert(
          "Doublon détecté",
          `Un joueur nommé "${playerData.n}" existe déjà dans le groupe "${groupName}". Que voulez-vous faire ?`,
          [
            { text: "Annuler l'import", style: "cancel", onPress: () => router.replace("/players") },
            {
              text: "Ajouter quand même",
              onPress: () => {
                addPlayer({
                  name: playerData.n,
                  level: playerData.l || 3,
                  position: playerData.p || "M",
                  groupId: targetGroupId,
                  avatarId: playerData.a || 1,
                  jerseyNumber: playerData.j || null,
                });
                Alert.alert(
                  "Ajouté !",
                  `Le joueur ${playerData.n} a été ajouté au groupe "${groupName}".`,
                  [{ text: "Voir l'équipe", onPress: () => router.replace("/players") }]
                );
              },
            },
          ]
        );
        return;
      }

      // 5. Ajout au store (pas de doublon)
      addPlayer({
        name: playerData.n,
        level: playerData.l || 3,
        position: playerData.p || "M",
        groupId: targetGroupId,
        avatarId: playerData.a || 1,
        jerseyNumber: playerData.j || null,
      });

      // 6. Succès et Redirection
      Alert.alert(
        "Succès !",
        `Le joueur ${playerData.n} a été ajouté au groupe "${groupName}".`,
        [
          {
            text: "Voir l'équipe",
            onPress: () => router.replace("/players"),
          },
        ]
      );
    } catch (error) {
      console.error("Erreur import:", error);
      Alert.alert("Erreur", "Le QR code est invalide ou corrompu.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#007BFF" />
      <Text className="mt-4 text-gray-500 font-bold">
        Importation du joueur...
      </Text>
    </View>
  );
}
