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
          name="session/result"
          options={{ title: "Équipes", headerBackVisible: false }}
        />
      </Stack>
    </View>
  );
}
