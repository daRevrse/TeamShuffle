import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../../store/usePlayerStore";
import { useSessionStore } from "../../store/useSessionStore";
import Constants from "expo-constants"; // Pour la version de l'app

export default function SettingsScreen() {
  const router = useRouter();
  const { resetAllPlayers, players } = usePlayerStore();
  const { clearHistory, history } = useSessionStore(); // Attention: vérifie si c'est 'sessions' ou 'history' dans ton store session

  // Actions de nettoyage
  const handleResetPlayers = () => {
    Alert.alert(
      "Attention !",
      "Cela va effacer TOUS les joueurs et les groupes. Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Tout effacer",
          style: "destructive",
          onPress: () => {
            resetAllPlayers();
            Alert.alert(
              "Terminé",
              "La base de données joueurs a été réinitialisée."
            );
          },
        },
      ]
    );
  };

  const handleResetHistory = () => {
    Alert.alert(
      "Effacer l'historique ?",
      "Voulez-vous supprimer tous les matchs enregistrés ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Effacer",
          style: "destructive",
          onPress: () => {
            if (clearHistory) clearHistory(); // Sécurité si la fonction n'existe pas
            Alert.alert("Terminé", "L'historique est vide.");
          },
        },
      ]
    );
  };

  const handleContact = () => {
    Linking.openURL("mailto:support@flowkraftagency.com");
  };

  // Composant pour une ligne de paramètre
  const SettingItem = ({
    icon,
    color,
    title,
    subtitle,
    onPress,
    isDestructive,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white p-4 mb-3 rounded-2xl border border-gray-100 shadow-sm active:bg-gray-50"
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
          isDestructive ? "bg-red-50" : "bg-gray-100"
        }`}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isDestructive ? "#FF3B30" : color || "#4B5563"}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`font-bold text-base ${
            isDestructive ? "text-red-500" : "text-dark"
          }`}
        >
          {title}
        </Text>
        {subtitle && <Text className="text-gray-400 text-xs">{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#E5E7EB" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{ title: "Paramètres", headerBackTitle: "Retour" }}
      />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Section GESTION DES DONNÉES */}
        <Text className="text-gray-400 font-bold text-xs uppercase mb-3 ml-2">
          Gestion des données
        </Text>

        <SettingItem
          icon="people"
          color="#007BFF"
          title="Réinitialiser l'effectif"
          subtitle={`${players.length} joueurs enregistrés`}
          onPress={handleResetPlayers}
          isDestructive={true}
        />

        <SettingItem
          icon="time"
          color="#FF9500"
          title="Vider l'historique"
          subtitle="Supprimer tous les matchs passés"
          onPress={handleResetHistory}
          isDestructive={true}
        />

        {/* Section À PROPOS */}
        <Text className="text-gray-400 font-bold text-xs uppercase mb-3 ml-2 mt-4">
          À propos
        </Text>

        <SettingItem
          icon="information-circle"
          color="#34C759"
          title="Version de l'application"
          subtitle={`v2.0.0`}
          onPress={() => {}}
        />

        <SettingItem
          icon="mail"
          color="#5856D6"
          title="Nous contacter"
          subtitle="Signaler un bug ou suggérer une idée"
          onPress={handleContact}
        />

        {/* Section RÉSEAUX SOCIAUX */}
        <Text className="text-gray-400 font-bold text-xs uppercase mb-3 ml-2 mt-4">
          FlowKraft Agency
        </Text>

        <SettingItem
          icon="globe-outline"
          color="#007BFF"
          title="Site Web"
          subtitle="flowkraftagency.com"
          onPress={() => Linking.openURL("https://flowkraftagency.com")}
        />

        <SettingItem
          icon="logo-instagram"
          color="#E1306C"
          title="Instagram"
          subtitle="@flowkraftagency"
          onPress={() =>
            Linking.openURL("https://www.instagram.com/flowkraft_agency/")
          }
        />

        <SettingItem
          icon="logo-linkedin"
          color="#0A66C2"
          title="LinkedIn"
          subtitle="FlowKraft Agency"
          onPress={() =>
            Linking.openURL("https://linkedin.com/company/flowkraft-agency")
          }
        />

        <SettingItem
          icon="logo-facebook"
          color="#1877F2"
          title="Facebook"
          subtitle="FlowKraft Agency"
          onPress={() =>
            Linking.openURL("https://facebook.com/flowkraftagency")
          }
        />

        {/* Footer */}
        <View className="items-center mt-8 mb-4">
          <Ionicons name="football" size={48} color="#E5E7EB" />
          <Text className="text-gray-300 font-bold mt-2">TeamShuffle 2025</Text>
          <Text className="text-gray-400 text-xs mt-1">
            Développé par FlowKraft Agency
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
