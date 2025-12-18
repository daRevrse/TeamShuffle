import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useCompetitionStore } from "../../store/useCompetitionStore";

/**
 * Écran de configuration d'un nouveau tournoi
 * Permet de choisir le nombre d'équipes, les noms, et le format
 */
export default function CompetitionSetupScreen() {
  const router = useRouter();
  const { createCompetition } = useCompetitionStore();

  const [step, setStep] = useState(1); // 1: Nombre, 2: Noms, 3: Format
  const [nbTeams, setNbTeams] = useState(4);
  const [teamNames, setTeamNames] = useState({});
  const [format, setFormat] = useState("league"); // league | pools
  const [poolCount, setPoolCount] = useState(2);
  const [qualifiedPerPool, setQualifiedPerPool] = useState(2);

  // Initialiser les noms d'équipes par défaut
  const initializeTeamNames = (count) => {
    const names = {};
    for (let i = 1; i <= count; i++) {
      names[`team${i}`] = `Équipe ${i}`;
    }
    return names;
  };

  // Étape 1: Choisir le nombre d'équipes
  const handleSelectTeamCount = (count) => {
    setNbTeams(count);
    setTeamNames(initializeTeamNames(count));
  };

  const handleNextToNames = () => {
    if (!teamNames || Object.keys(teamNames).length === 0) {
      setTeamNames(initializeTeamNames(nbTeams));
    }
    setStep(2);
  };

  // Étape 2: Modifier les noms
  const handleUpdateTeamName = (teamKey, newName) => {
    setTeamNames((prev) => ({ ...prev, [teamKey]: newName }));
  };

  const handleNextToFormat = () => {
    setStep(3);
  };

  // Étape 3: Choisir le format et créer
  const handleCreateTournament = () => {
    const tournamentName = `Tournoi ${new Date().toLocaleDateString("fr-FR")}`;

    const config = {
      name: tournamentName,
      format,
      nbTeams,
      teamNames,
      poolCount: format === "pools" ? poolCount : undefined,
      qualifiedPerPool: format === "pools" ? qualifiedPerPool : undefined,
    };

    createCompetition(config);
    router.replace("/competition/manage");
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* En-tête avec progress */}
      <View className="bg-white px-4 pt-4 pb-6 rounded-b-[30px] shadow-sm z-10 mb-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => {
              if (step > 1) setStep(step - 1);
              else router.back();
            }}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-dark">
            Nouveau Tournoi ({step}/3)
          </Text>
          <View className="w-10" />
        </View>

        {/* Progress bar */}
        <View className="flex-row gap-2">
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              className={`flex-1 h-1 rounded-full ${
                s <= step ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ÉTAPE 1: Nombre d'équipes */}
        {step === 1 && (
          <View>
            <Text className="text-2xl font-black text-dark mb-2">
              Combien d'équipes ?
            </Text>
            <Text className="text-gray-500 mb-6">
              Sélectionnez le nombre d'équipes qui participeront au tournoi
              (2-16)
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {[2, 3, 4, 6, 8, 12, 16].map((count) => (
                <TouchableOpacity
                  key={count}
                  onPress={() => handleSelectTeamCount(count)}
                  style={{
                    width: "30%",
                    paddingVertical: 20,
                    borderRadius: 16,
                    borderWidth: 3,
                    alignItems: "center",
                    borderColor: nbTeams === count ? "#007BFF" : "#E5E7EB",
                    backgroundColor: nbTeams === count ? "#EFF6FF" : "#FFFFFF",
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-3xl font-black ${
                      nbTeams === count ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    {count}
                  </Text>
                  <Text
                    className={`text-xs font-bold mt-1 ${
                      nbTeams === count ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    équipes
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sélecteur personnalisé */}
            <View className="mt-6 bg-white p-4 rounded-2xl border border-gray-100">
              <Text className="text-sm font-bold text-gray-500 mb-2">
                Ou choisissez un nombre personnalisé (2-16)
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-2xl font-black"
                keyboardType="number-pad"
                maxLength={2}
                value={nbTeams.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 2;
                  if (num >= 2 && num <= 16) {
                    handleSelectTeamCount(num);
                  }
                }}
              />
            </View>
          </View>
        )}

        {/* ÉTAPE 2: Noms des équipes */}
        {step === 2 && (
          <View>
            <Text className="text-2xl font-black text-dark mb-2">
              Noms des équipes
            </Text>
            <Text className="text-gray-500 mb-6">
              Personnalisez les noms de vos {nbTeams} équipes
            </Text>

            {Object.keys(teamNames).map((teamKey, index) => {
              const colors = [
                "bg-blue-500",
                "bg-red-500",
                "bg-green-500",
                "bg-orange-500",
                "bg-purple-500",
                "bg-pink-500",
                "bg-yellow-500",
                "bg-indigo-500",
              ];
              const color = colors[index % colors.length];

              return (
                <View
                  key={teamKey}
                  className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 flex-row items-center"
                >
                  <View className={`w-4 h-12 ${color} rounded-full mr-3`} />
                  <View className="flex-1">
                    <Text className="text-xs text-gray-400 font-bold mb-1">
                      ÉQUIPE {index + 1}
                    </Text>
                    <TextInput
                      className="text-lg font-bold text-dark"
                      value={teamNames[teamKey]}
                      onChangeText={(text) =>
                        handleUpdateTeamName(teamKey, text)
                      }
                      placeholder={`Équipe ${index + 1}`}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ÉTAPE 3: Format du tournoi */}
        {step === 3 && (
          <View>
            <Text className="text-2xl font-black text-dark mb-2">
              Format du tournoi
            </Text>
            <Text className="text-gray-500 mb-6">
              Choisissez comment les matchs seront organisés
            </Text>

            {/* Mode Ligue */}
            <TouchableOpacity
              onPress={() => setFormat("league")}
              className={`bg-white p-5 rounded-3xl mb-4 border-2 ${
                format === "league" ? "border-primary" : "border-gray-100"
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View
                    className={`w-12 h-12 rounded-2xl items-center justify-center ${
                      format === "league" ? "bg-blue-50" : "bg-gray-50"
                    }`}
                  >
                    <Ionicons
                      name="list"
                      size={24}
                      color={format === "league" ? "#007BFF" : "#9CA3AF"}
                    />
                  </View>
                  <View className="ml-3">
                    <Text className="text-lg font-black text-dark">
                      Mode Ligue
                    </Text>
                    <Text className="text-xs text-gray-400">
                      Tous contre tous
                    </Text>
                  </View>
                </View>
                {format === "league" && (
                  <Ionicons name="checkmark-circle" size={28} color="#007BFF" />
                )}
              </View>
              <Text className="text-sm text-gray-600">
                Chaque équipe affronte toutes les autres équipes. Le classement
                détermine le vainqueur. Idéal pour 2-8 équipes.
              </Text>
            </TouchableOpacity>

            {/* Mode Poules (si ≥6 équipes) */}
            {nbTeams >= 6 && (
              <>
                <TouchableOpacity
                  onPress={() => setFormat("pools")}
                  className={`bg-white p-5 rounded-3xl mb-4 border-2 ${
                    format === "pools" ? "border-primary" : "border-gray-100"
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View
                        className={`w-12 h-12 rounded-2xl items-center justify-center ${
                          format === "pools" ? "bg-orange-50" : "bg-gray-50"
                        }`}
                      >
                        <Ionicons
                          name="git-network"
                          size={24}
                          color={format === "pools" ? "#F97316" : "#9CA3AF"}
                        />
                      </View>
                      <View className="ml-3">
                        <Text className="text-lg font-black text-dark">
                          Poules + Élimination
                        </Text>
                        <Text className="text-xs text-gray-400">
                          Format compétition
                        </Text>
                      </View>
                    </View>
                    {format === "pools" && (
                      <Ionicons
                        name="checkmark-circle"
                        size={28}
                        color="#007BFF"
                      />
                    )}
                  </View>
                  <Text className="text-sm text-gray-600 mb-3">
                    Phase de poules, puis phase à élimination directe avec les
                    meilleurs de chaque poule. Idéal pour 6-16 équipes.
                  </Text>
                </TouchableOpacity>

                {/* Configuration des poules */}
                {format === "pools" && (
                  <View className="bg-blue-50 p-5 rounded-3xl border-2 border-blue-200 mb-4">
                    <Text className="text-sm font-bold text-blue-900 mb-4">
                      ⚙️ Configuration des poules
                    </Text>

                    {/* Nombre de poules */}
                    <Text className="text-xs font-bold text-blue-800 mb-2">
                      Nombre de poules
                    </Text>
                    <View className="flex-row gap-2 mb-4">
                      {[2, 4].map((count) => (
                        <TouchableOpacity
                          key={count}
                          onPress={() => setPoolCount(count)}
                          style={{
                            flex: 1,
                            paddingVertical: 12,
                            borderRadius: 12,
                            borderWidth: 2,
                            alignItems: "center",
                            borderColor:
                              poolCount === count ? "#007BFF" : "transparent",
                            backgroundColor:
                              poolCount === count ? "#FFFFFF" : "#DBEAFE",
                          }}
                        >
                          <Text
                            className={`font-bold ${
                              poolCount === count
                                ? "text-primary"
                                : "text-blue-600"
                            }`}
                          >
                            {count} poules
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Qualifiés par poule */}
                    <Text className="text-xs font-bold text-blue-800 mb-2">
                      Qualifiés par poule
                    </Text>
                    <View className="flex-row gap-2">
                      {[1, 2, 3, 4].map((count) => (
                        <TouchableOpacity
                          key={count}
                          onPress={() => setQualifiedPerPool(count)}
                          style={{
                            flex: 1,
                            paddingVertical: 12,
                            borderRadius: 12,
                            borderWidth: 2,
                            alignItems: "center",
                            borderColor:
                              qualifiedPerPool === count
                                ? "#007BFF"
                                : "transparent",
                            backgroundColor:
                              qualifiedPerPool === count
                                ? "#FFFFFF"
                                : "#DBEAFE",
                          }}
                        >
                          <Text
                            className={`font-bold ${
                              qualifiedPerPool === count
                                ? "text-primary"
                                : "text-blue-600"
                            }`}
                          >
                            Top {count}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text className="text-xs text-blue-700 mt-3">
                      💡 {poolCount * qualifiedPerPool} équipes se
                      qualifieront pour la phase à élimination directe
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bouton de navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
        <TouchableOpacity
          onPress={() => {
            if (step === 1) handleNextToNames();
            else if (step === 2) handleNextToFormat();
            else handleCreateTournament();
          }}
          className="bg-primary py-4 rounded-2xl shadow-lg"
        >
          <Text className="text-white font-bold text-center text-lg uppercase">
            {step === 3 ? "Créer le tournoi" : "Continuer"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
