import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../../store/usePlayerStore";
import { AVATARS } from "../../constants/avatars";
import { useState } from "react";

export default function PlayersListScreen() {
  const router = useRouter();

  const {
    groups,
    activeGroupId,
    setActiveGroup,
    addGroup,
    deleteGroup,
    getActivePlayers,
    addMyselfToGroup,
    userProfile,
  } = usePlayerStore();

  const players = getActivePlayers();
  const [searchQuery, setSearchQuery] = useState("");

  // États pour la modale de création de groupe
  const [isModalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName("");
      setModalVisible(false);
    }
  };

  const handleLongPressGroup = (group) => {
    if (group.isDefault) return;
    Alert.alert(
      "Supprimer le groupe ?",
      `Les joueurs de "${group.name}" seront déplacés dans "Général".`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteGroup(group.id),
        },
      ]
    );
  };

  const handleAddMyself = () => {
    addMyselfToGroup();
    Alert.alert("Ajouté !", `${userProfile.name} a été ajouté au groupe.`);
  };

  const PositionBadge = ({ position }) => {
    const styles = {
      G: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
      },
      D: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      M: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
      },
      A: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
    };
    const style = styles[position] || styles.M;
    return (
      <View
        className={`${style.bg} ${style.border} border px-2 py-0.5 rounded-lg`}
      >
        <Text className={`${style.text} font-black text-xs`}>{position}</Text>
      </View>
    );
  };

  const PlayerAvatar = ({ avatarSource, jerseyNumber }) => {
    return (
      <View className="mr-4 relative">
        <Image
          source={avatarSource}
          style={{ width: 48, height: 48 }}
          resizeMode="contain"
        />
        {jerseyNumber && (
          <View className="absolute -bottom-1 -right-1 bg-dark rounded-full w-5 h-5 items-center justify-center border-2 border-white">
            <Text className="text-white font-black text-[10px]">
              {jerseyNumber}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white-50">
      {/* En-tête */}
      <View className="bg-white pt-4 pb-2 rounded-b-[30px] shadow-sm z-10">
        <View className="px-4 flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-black text-dark italic tracking-tighter">
            Effectif <Text className="text-primary"></Text>
          </Text>
          <TouchableOpacity
            className="bg-gray-100 p-2 rounded-full border border-gray-200"
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="qr-code" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Barre des Groupes */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
          className="flex-row"
        >
          {groups.map((group) => {
            const isActive = group.id === activeGroupId;
            return (
              <TouchableOpacity
                key={group.id}
                onPress={() => setActiveGroup(group.id)}
                onLongPress={() => handleLongPressGroup(group)}
                className={`mr-3 px-4 py-2 rounded-full border ${
                  isActive ? "bg-dark border-dark" : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`font-bold ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                >
                  {group.name}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center border border-primary/20 dashed"
          >
            <Ionicons name="add" size={20} color="#000000" />
          </TouchableOpacity>
        </ScrollView>

        <View className="mx-4 mb-4 flex-row gap-2">
          <View className="flex-1 bg-gray-100 flex-row items-center px-4 py-3 rounded-2xl border border-gray-200">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Rechercher..."
              className="flex-1 ml-3 font-medium text-dark"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            className="bg-primary w-12 rounded-2xl items-center justify-center"
            onPress={handleAddMyself}
          >
            <Ionicons name="person-add" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-dark w-12 rounded-2xl items-center justify-center"
            onPress={() => router.push("/scan")}
          >
            <Ionicons name="scan" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste filtrée */}
      {filteredPlayers.length === 0 ? (
        <View className="flex-1 items-center justify-center p-8 opacity-60">
          <Ionicons name="people" size={64} color="#D1D5DB" />
          <Text className="text-xl font-bold text-gray-400 mt-4 text-center">
            {players.length === 0 ? "Ce groupe est vide." : "Aucun résultat."}
          </Text>
          <TouchableOpacity onPress={() => router.push("/players/new")}>
            <Text className="text-primary font-bold mt-2">
              Ajouter un joueur ici
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredPlayers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => {
            const avatar = AVATARS.find((a) => a.id === item.avatarId) || AVATARS[0];
            return (
              <TouchableOpacity
                className="bg-white p-4 rounded-2xl mb-3 shadow-sm flex-row items-center border border-gray-100 active:scale-[0.98]"
                onPress={() => router.push(`/players/${item.id}`)}
              >
                <PlayerAvatar avatarSource={avatar.source} jerseyNumber={item.jerseyNumber} />
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-lg font-bold text-dark flex-1" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <PositionBadge position={item.position} />
                  </View>
                  <View className="flex-row items-center">
                    <View className="flex-row gap-0.5">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <View
                          key={lvl}
                          className={`h-1.5 w-6 rounded-full ${
                            lvl <= item.level ? "bg-primary" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#E5E7EB" />
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* MODALE CRÉATION GROUPE (Compatible Android) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center bg-black/50 px-6"
        >
          <View className="bg-white p-6 rounded-3xl w-full shadow-2xl">
            <Text className="text-xl font-bold text-dark mb-4">
              Nouveau Groupe
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-lg"
              placeholder="Nom du groupe (ex: Five Lundi)"
              autoFocus
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="px-4 py-3 rounded-xl bg-gray-100"
              >
                <Text className="font-bold text-gray-500">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateGroup}
                className="px-6 py-3 rounded-xl bg-primary"
              >
                <Text className="font-bold text-white">Créer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-dark w-16 h-16 rounded-full items-center justify-center shadow-2xl border-4 border-white/20"
        onPress={() => router.push("/players/new")}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}
