import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../global.css";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { handleDeepLink } from "../utils/deepLinkHandler";

export default function Layout() {
  useEffect(() => {
    // Écoute des liens pendant que l'app est ouverte
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    // Vérifie si l'app a été ouverte via un lien
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#007BFF" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#F8F9FA" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "TeamShuffle", headerShown: false }}
        />
        <Stack.Screen name="players/index" options={{ title: "Mes Joueurs" }} />
        <Stack.Screen
          name="players/[id]"
          options={{ title: "Joueur", presentation: "modal" }}
        />
        <Stack.Screen
          name="session/config"
          options={{ title: "Configuration Match" }}
        />
        <Stack.Screen
          name="history/index"
          options={{ title: "Historique", headerBackVisible: true }}
        />
        <Stack.Screen
          name="session/result"
          options={{ title: "Équipes", headerBackVisible: true }}
        />
        <Stack.Screen
          name="profile/index"
          options={{ title: "Mon Profil", presentation: "modal" }}
        />
        {/* On laisse 'scan' se gérer automatiquement ou on l'ajoute explicitement */}
        <Stack.Screen
          name="scan"
          options={{
            title: "Scanner",
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}
