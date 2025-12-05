import * as Linking from "expo-linking";
import { Alert } from "react-native";
import { usePlayerStore } from "../store/usePlayerStore";

export const handleDeepLink = (url) => {
  try {
    // 1. Analyser l'URL
    const parsed = Linking.parse(url);

    // On ne réagit que si le chemin est "import"
    if (parsed.path === "import" && parsed.queryParams?.data) {
      // 2. Décoder les données (URI Component -> JSON String -> Object)
      const jsonString = decodeURIComponent(parsed.queryParams.data);
      const data = JSON.parse(jsonString);

      // Vérification basique
      if (!data.n || !data.l || !data.p) {
        throw new Error("Données invalides");
      }

      // 3. Ajouter le joueur via le Store
      // On utilise getState() pour accéder aux fonctions du store hors d'un composant React
      const store = usePlayerStore.getState();
      const activeGroupName =
        store.groups.find((g) => g.id === store.activeGroupId)?.name ||
        "Général";

      store.addPlayer({
        name: data.n,
        level: data.l,
        position: data.p,
        // On l'ajoute dans le groupe actuellement sélectionné par l'utilisateur
        groupId: store.activeGroupId,
      });

      // 4. Feedback utilisateur
      Alert.alert(
        "Nouveau joueur !",
        `Succès : ${data.n} a été ajouté au groupe "${activeGroupName}".`,
        [{ text: "Super !" }]
      );
    }
  } catch (error) {
    console.error("Erreur import:", error);
    Alert.alert("Erreur", "Impossible de lire le profil du joueur.");
  }
};
