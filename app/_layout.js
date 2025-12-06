import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../global.css";

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#000000" },
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
          options={{
            title: "Joueur",
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="session/config"
          options={{ title: "Configuration Match" }}
        />
        <Stack.Screen
          name="session/result"
          options={{ title: "Équipes", headerBackVisible: false }}
        />
        <Stack.Screen
          name="profile/index"
          options={{ title: "Mon Profil", presentation: "modal" }}
        />
        <Stack.Screen name="history/index" options={{ title: "Historique" }} />
        <Stack.Screen
          name="scan"
          options={{
            title: "Scanner",
            presentation: "modal",
            headerShown: false,
          }}
        />

        {/* Cette ligne est optionnelle car Expo Router détecte les fichiers, mais c'est bien pour la propreté */}
        <Stack.Screen
          name="import"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack>
    </View>
  );
}
