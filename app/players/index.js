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
import { useState, useEffect } from "react";

export default function PlayersListScreen() {
  const router = useRouter();

  const {
    groups,
    activeGroupId,
    setActiveGroup,
    addGroup,
    updateGroup,
    deleteGroup,
    clearGroup,
    getActivePlayers,
    addMyselfToGroup,
    addPlayersToGroup,
    removePlayerFromGroup,
    userProfile,
  } = usePlayerStore();

  const players = getActivePlayers();
  // Utiliser un sélecteur pour garantir la réactivité
  const allPlayers = usePlayerStore((state) => state.players);
  const [searchQuery, setSearchQuery] = useState("");

  // États pour la modale de création de groupe
  const [isModalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  // États pour la modale d'ajout de joueurs
  const [isAddPlayersModalVisible, setAddPlayersModalVisible] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  // États pour la modale de modification de groupe
  const [isEditGroupModalVisible, setEditGroupModalVisible] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Nettoyer la sélection quand la modale se ferme ou quand les données changent
  useEffect(() => {
    if (!isAddPlayersModalVisible) {
      setSelectedPlayers([]);
    }
  }, [isAddPlayersModalVisible]);

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
      `Gérer "${group.name}"`,
      "Que voulez-vous faire ?",
      [
        {
          text: "Modifier",
          onPress: () => {
            setEditingGroupId(group.id);
            setEditGroupName(group.name);
            setEditGroupModalVisible(true);
          },
        },
        {
          text: "Vider",
          onPress: () => {
            Alert.alert(
              "Vider le groupe ?",
              `Tous les joueurs de "${group.name}" seront déplacés dans "Général".`,
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Vider",
                  style: "destructive",
                  onPress: () => clearGroup(group.id),
                },
              ]
            );
          },
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
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
          },
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };

  const handleAddPlayers = () => {
    // Réinitialiser la sélection avant d'ouvrir la modale
    setSelectedPlayers([]);
    // Ouvrir la modale (les données seront fraîches grâce au hook usePlayerStore)
    setAddPlayersModalVisible(true);
  };

  const handleConfirmAddPlayers = () => {
    if (selectedPlayers.length > 0) {
      addPlayersToGroup(selectedPlayers, activeGroupId);
      Alert.alert("Succès", `${selectedPlayers.length} joueur(s) ajouté(s) au groupe.`);
      setAddPlayersModalVisible(false);
      setSelectedPlayers([]);
    }
  };

  const handleTogglePlayerSelection = (playerId) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleRemovePlayerFromGroup = (playerId, playerName) => {
    Alert.alert(
      "Retirer du groupe ?",
      `Voulez-vous retirer ${playerName} de ce groupe ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Retirer",
          style: "destructive",
          onPress: () => removePlayerFromGroup(playerId),
        },
      ]
    );
  };

  const handleUpdateGroup = () => {
    if (editGroupName.trim()) {
      updateGroup(editingGroupId, editGroupName.trim());
      setEditGroupModalVisible(false);
      setEditingGroupId(null);
      setEditGroupName("");
    }
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
            onPress={handleAddPlayers}
          >
            <Ionicons name="people" size={24} color="white" />
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
              <View className="bg-white p-4 rounded-2xl mb-3 shadow-sm flex-row items-center border border-gray-100">
                <TouchableOpacity
                  className="flex-1 flex-row items-center active:opacity-70"
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
                {activeGroupId !== "default" && (
                  <TouchableOpacity
                    className="ml-2 bg-red-50 p-2 rounded-xl border border-red-100"
                    onPress={() => handleRemovePlayerFromGroup(item.id, item.name)}
                  >
                    <Ionicons name="remove-circle" size={20} color="#DC3545" />
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      )}

      {/* MODALE CRÉATION GROUPE */}
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

      {/* MODALE MODIFICATION GROUPE */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isEditGroupModalVisible}
        onRequestClose={() => setEditGroupModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center bg-black/50 px-6"
        >
          <View className="bg-white p-6 rounded-3xl w-full shadow-2xl">
            <Text className="text-xl font-bold text-dark mb-4">
              Modifier le Groupe
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-lg font-bold"
              placeholder="Nom du groupe"
              autoFocus
              value={editGroupName}
              onChangeText={setEditGroupName}
            />
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => setEditGroupModalVisible(false)}
                className="px-4 py-3 rounded-xl bg-gray-100"
              >
                <Text className="font-bold text-gray-500">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdateGroup}
                className="px-6 py-3 rounded-xl bg-primary"
              >
                <Text className="font-bold text-white">Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODALE SÉLECTION JOUEURS */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddPlayersModalVisible}
        onRequestClose={() => setAddPlayersModalVisible(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-20 bg-white rounded-t-3xl">
            <View className="p-6 border-b border-gray-100 flex-row items-center justify-between">
              <Text className="text-2xl font-black text-dark">
                Ajouter des joueurs
              </Text>
              <TouchableOpacity
                onPress={() => setAddPlayersModalVisible(false)}
                className="bg-gray-100 p-2 rounded-full"
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <Text className="text-sm font-bold text-gray-500">
                {selectedPlayers.length} joueur(s) sélectionné(s)
              </Text>
            </View>

            <ScrollView className="flex-1 px-6 py-4">
              {/* Carte spéciale pour l'utilisateur (Mon Profil) */}
              {(() => {
                const userAvatar = AVATARS.find((a) => a.id === userProfile.avatarId) || AVATARS[0];
                // Vérifier si l'utilisateur est dans le groupe actuel
                // On récupère les données fraîches du store à chaque render
                const freshPlayers = usePlayerStore.getState().players;
                // Vérifier par nom et avatar car un utilisateur peut avoir plusieurs copies
                const isUserInGroup = freshPlayers.some(
                  (p) => p.name === userProfile.name &&
                         p.avatarId === userProfile.avatarId &&
                         (p.groupId || "default") === activeGroupId
                );

                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (!isUserInGroup) {
                        addMyselfToGroup();
                        Alert.alert("Ajouté !", `${userProfile.name} a été ajouté au groupe.`);
                      }
                    }}
                    disabled={isUserInGroup}
                    className={`flex-row items-center p-4 rounded-2xl mb-4 border-2 ${
                      isUserInGroup
                        ? "bg-gray-100 border-gray-200 opacity-50"
                        : "bg-gradient-to-r from-primary/10 to-primary/5 border-primary"
                    }`}
                  >
                    <View className="bg-primary w-6 h-6 rounded-full items-center justify-center mr-4">
                      <Ionicons name="person" size={14} color="white" />
                    </View>
                    <PlayerAvatar avatarSource={userAvatar.source} jerseyNumber={userProfile.jerseyNumber} />
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-lg font-black text-primary">
                          {userProfile.name}
                        </Text>
                        <View className="bg-primary/10 px-2 py-0.5 rounded-full">
                          <Text className="text-[10px] font-black text-primary uppercase">MOI</Text>
                        </View>
                      </View>
                      {isUserInGroup && (
                        <Text className="text-xs text-gray-500">Déjà dans ce groupe</Text>
                      )}
                    </View>
                    <PositionBadge position={userProfile.position} />
                    {!isUserInGroup && (
                      <View className="ml-2 bg-primary p-2 rounded-full">
                        <Ionicons name="add" size={20} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })()}

              {/* Séparateur */}
              {(() => {
                const freshPlayers = usePlayerStore.getState().players;
                const availablePlayers = freshPlayers.filter(
                  (p) => (p.groupId || "default") !== activeGroupId
                );
                return availablePlayers.length > 0 && (
                  <View className="flex-row items-center mb-4 mt-2">
                    <View className="flex-1 h-px bg-gray-200" />
                    <Text className="mx-3 text-xs font-bold text-gray-400 uppercase">
                      Autres joueurs
                    </Text>
                    <View className="flex-1 h-px bg-gray-200" />
                  </View>
                );
              })()}

              {(() => {
                const freshPlayers = usePlayerStore.getState().players;
                const availablePlayers = freshPlayers.filter(
                  (p) => (p.groupId || "default") !== activeGroupId
                );
                return availablePlayers.length === 0;
              })() ? (
                <View className="items-center justify-center py-12">
                  <Ionicons name="people-outline" size={64} color="#D1D5DB" />
                  <Text className="text-gray-400 font-bold text-lg mt-4">
                    Aucun autre joueur disponible
                  </Text>
                  <Text className="text-gray-400 text-sm text-center mt-2 px-8">
                    Créez d'abord des joueurs pour pouvoir les ajouter à ce groupe
                  </Text>
                </View>
              ) : (
                // Utiliser les données fraîches du store à chaque render
                usePlayerStore.getState().players.map((player) => {
                  const avatar = AVATARS.find((a) => a.id === player.avatarId) || AVATARS[0];
                  const isSelected = selectedPlayers.includes(player.id);
                  // Vérifier strictement si le joueur est dans le groupe actuel
                  const isInCurrentGroup = (player.groupId || "default") === activeGroupId;

                  // Ne pas afficher les joueurs déjà dans le groupe actuel
                  if (isInCurrentGroup) {
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      key={player.id}
                      onPress={() => handleTogglePlayerSelection(player.id)}
                      className={`flex-row items-center p-4 rounded-2xl mb-3 border-2 ${
                        isSelected
                          ? "bg-primary/10 border-primary"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 ${
                        isSelected ? "bg-primary border-primary" : "border-gray-300"
                      }`}>
                        {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                      </View>
                      <PlayerAvatar avatarSource={avatar.source} jerseyNumber={player.jerseyNumber} />
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-dark">
                          {player.name}
                        </Text>
                      </View>
                      <PositionBadge position={player.position} />
                    </TouchableOpacity>
                  );
                }).filter(Boolean) // Enlever les null
              )}
            </ScrollView>

            <View className="p-6 border-t border-gray-100 bg-white">
              <TouchableOpacity
                onPress={handleConfirmAddPlayers}
                disabled={selectedPlayers.length === 0}
                className={`py-4 rounded-2xl items-center ${
                  selectedPlayers.length > 0 ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <Text className="text-white font-bold text-lg">
                  Ajouter {selectedPlayers.length > 0 && `(${selectedPlayers.length})`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
