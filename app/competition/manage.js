import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useCompetitionStore } from "../../store/useCompetitionStore";

/**
 * Écran de gestion d'un tournoi
 * Supporte: Mode Ligue, Mode Poules, Mode Élimination directe
 */
export default function ManageCompetitionScreen() {
  const router = useRouter();
  const {
    currentCompetition,
    updateLeagueMatch,
    updatePoolMatch,
    updateKnockoutMatch,
    startKnockoutPhase,
    advanceKnockoutRound,
    finishLeagueCompetition,
    saveCompetition,
  } = useCompetitionStore();

  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");
  const [selectedPool, setSelectedPool] = useState(null);

  // Modal pour sélectionner le vainqueur (knockout)
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  // État pour la pagination des journées (league format)
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

  if (!currentCompetition) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-8">
        <Ionicons name="trophy-outline" size={64} color="#D1D5DB" />
        <Text className="text-gray-400 font-bold text-lg mt-4">
          Aucun tournoi en cours
        </Text>
        <TouchableOpacity
          className="mt-4 bg-primary px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { format, phase, teamNames, isReadOnly } = currentCompetition;

  // Couleurs des équipes
  const getTeamColor = (teamKey) => {
    const colors = {
      team1: "#3B82F6",
      team2: "#EF4444",
      team3: "#10B981",
      team4: "#F97316",
      team5: "#8B5CF6",
      team6: "#EC4899",
      team7: "#F59E0B",
      team8: "#6366F1",
    };
    return colors[teamKey] || "#9CA3AF";
  };

  // === HANDLERS ===

  const handleOpenScoreModal = (match, poolKey = null) => {
    if (isReadOnly) return;
    setSelectedMatch(match);
    setSelectedPool(poolKey);
    setScoreA(match.scoreA !== null ? match.scoreA.toString() : "");
    setScoreB(match.scoreB !== null ? match.scoreB.toString() : "");
    setShowScoreModal(true);
  };

  const handleSaveScore = () => {
    if (scoreA === "" || scoreB === "") {
      Alert.alert("Erreur", "Veuillez entrer les deux scores");
      return;
    }

    const parsedScoreA = parseInt(scoreA);
    const parsedScoreB = parseInt(scoreB);

    if (selectedPool) {
      // Match de poule
      updatePoolMatch(selectedPool, selectedMatch.id, parsedScoreA, parsedScoreB);
    } else {
      // Match de ligue
      updateLeagueMatch(selectedMatch.id, parsedScoreA, parsedScoreB);
    }

    setShowScoreModal(false);
    setSelectedMatch(null);
    setSelectedPool(null);
    setScoreA("");
    setScoreB("");
  };

  const handleOpenWinnerModal = (match) => {
    if (isReadOnly) return;
    setSelectedMatch(match);
    setShowWinnerModal(true);
  };

  const handleSelectWinner = (teamKey) => {
    updateKnockoutMatch(selectedMatch.id, teamKey);
    setShowWinnerModal(false);
    setSelectedMatch(null);
  };

  const handleStartKnockout = () => {
    Alert.alert(
      "Passer en élimination directe",
      "Les phases de poule sont terminées. Voulez-vous passer en phase à élimination directe ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Continuer",
          onPress: () => startKnockoutPhase(),
        },
      ]
    );
  };

  const handleAdvanceRound = () => {
    advanceKnockoutRound();
  };

  const handleFinishLeague = () => {
    Alert.alert(
      "Terminer le tournoi",
      "Voulez-vous terminer et sauvegarder ce tournoi ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Terminer",
          onPress: () => {
            finishLeagueCompetition();
            saveCompetition();
            router.back();
          },
        },
      ]
    );
  };

  const handleSaveTournament = () => {
    Alert.alert(
      "Sauvegarder",
      "Voulez-vous sauvegarder et terminer ce tournoi ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Sauvegarder",
          onPress: () => {
            saveCompetition();
            router.back();
          },
        },
      ]
    );
  };

  // === COMPOSANTS ===

  // Carte de match
  const MatchCard = ({ match, onPress, poolKey = null }) => {
    const teamAName = teamNames[match.teamA];
    const teamBName = teamNames[match.teamB];
    const colorA = getTeamColor(match.teamA);
    const colorB = getTeamColor(match.teamB);
    const isPlayed = match.status === "played";

    return (
      <TouchableOpacity
        onPress={() => onPress(match, poolKey)}
        disabled={isReadOnly}
        className={`bg-white p-4 rounded-2xl mb-3 border ${
          isPlayed ? "border-green-200" : "border-gray-100"
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center justify-between">
          {/* Équipe A */}
          <View className="flex-1 flex-row items-center">
            <View
              style={{ backgroundColor: colorA }}
              className="w-3 h-10 rounded-full mr-2"
            />
            <Text
              className="flex-1 font-bold text-dark"
              numberOfLines={1}
            >
              {teamAName}
            </Text>
          </View>

          {/* Score */}
          <View className="mx-4">
            {isPlayed ? (
              <View className="flex-row items-center">
                <Text className="font-black text-2xl text-dark">
                  {match.scoreA}
                </Text>
                <Text className="font-black text-xl text-gray-300 mx-2">-</Text>
                <Text className="font-black text-2xl text-dark">
                  {match.scoreB}
                </Text>
              </View>
            ) : (
              <View className="bg-gray-100 px-4 py-2 rounded-xl">
                <Text className="font-bold text-gray-400 text-xs">VS</Text>
              </View>
            )}
          </View>

          {/* Équipe B */}
          <View className="flex-1 flex-row items-center justify-end">
            <Text
              className="flex-1 font-bold text-dark text-right"
              numberOfLines={1}
            >
              {teamBName}
            </Text>
            <View
              style={{ backgroundColor: colorB }}
              className="w-3 h-10 rounded-full ml-2"
            />
          </View>
        </View>

        {isPlayed && (
          <View className="mt-2 items-center">
            <Text className="text-xs text-green-600 font-bold">
              ✓ Match joué
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Carte classement
  const StandingsTable = ({ standings, teamKeys }) => {
    const sorted = teamKeys
      .map((key) => ({ teamKey: key, ...standings[key] }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.goalDifference - a.goalDifference;
      });

    return (
      <View className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        {sorted.map((team, index) => (
          <View
            key={team.teamKey}
            className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-0"
          >
            <View className="flex-row items-center flex-1">
              <Text className="text-2xl font-black text-gray-300 w-8">
                {index + 1}
              </Text>
              <View
                style={{ backgroundColor: getTeamColor(team.teamKey) }}
                className="w-3 h-8 rounded-full mr-3"
              />
              <View className="flex-1">
                <Text className="font-bold text-dark" numberOfLines={1}>
                  {teamNames[team.teamKey]}
                </Text>
                <Text className="text-xs text-gray-400">
                  {team.played}J • {team.wins}V {team.draws}N {team.losses}D
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="font-black text-xl text-dark">{team.points}</Text>
              <Text className="text-xs text-gray-400">pts</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  // Carte knockout match
  const KnockoutMatchCard = ({ match }) => {
    const teamAName = teamNames[match.teamA];
    const teamBName = teamNames[match.teamB];
    const colorA = getTeamColor(match.teamA);
    const colorB = getTeamColor(match.teamB);
    const isPlayed = match.status === "played";

    return (
      <TouchableOpacity
        onPress={() => handleOpenWinnerModal(match)}
        disabled={isReadOnly || isPlayed}
        className={`bg-white p-5 rounded-3xl mb-3 border-2 ${
          isPlayed ? "border-green-200" : "border-gray-100"
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center justify-between mb-3">
          {/* Équipe A */}
          <View
            className={`flex-1 p-4 rounded-2xl mr-2 ${
              match.winner === match.teamA ? "bg-green-50" : "bg-gray-50"
            }`}
          >
            <View className="flex-row items-center mb-2">
              <View
                style={{ backgroundColor: colorA }}
                className="w-3 h-8 rounded-full mr-2"
              />
              <Text className="flex-1 font-black text-dark" numberOfLines={1}>
                {teamAName}
              </Text>
            </View>
            {match.winner === match.teamA && (
              <Text className="text-green-600 font-bold text-xs">
                ✓ Qualifié
              </Text>
            )}
          </View>

          {/* VS */}
          <Text className="font-black text-gray-300">VS</Text>

          {/* Équipe B */}
          <View
            className={`flex-1 p-4 rounded-2xl ml-2 ${
              match.winner === match.teamB ? "bg-green-50" : "bg-gray-50"
            }`}
          >
            <View className="flex-row items-center mb-2">
              <View
                style={{ backgroundColor: colorB }}
                className="w-3 h-8 rounded-full mr-2"
              />
              <Text className="flex-1 font-black text-dark" numberOfLines={1}>
                {teamBName}
              </Text>
            </View>
            {match.winner === match.teamB && (
              <Text className="text-green-600 font-bold text-xs">
                ✓ Qualifié
              </Text>
            )}
          </View>
        </View>

        {!isPlayed && !isReadOnly && (
          <View className="items-center">
            <Text className="text-xs text-gray-400 font-bold">
              Appuyez pour choisir le vainqueur
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // === RENDU ===

  return (
    <View className="flex-1 bg-gray-50">
      {/* Modale de score */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showScoreModal}
        onRequestClose={() => setShowScoreModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white p-6 rounded-3xl w-full shadow-2xl">
            <Text className="text-xl font-bold text-dark mb-4 text-center">
              Score du match
            </Text>

            {selectedMatch && (
              <>
                <View className="flex-row items-center justify-between mb-6">
                  <View className="flex-1">
                    <Text className="font-bold text-gray-500 text-xs mb-2 text-center">
                      {teamNames[selectedMatch.teamA]}
                    </Text>
                    <TextInput
                      className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 text-center text-3xl font-black"
                      placeholder="0"
                      keyboardType="number-pad"
                      maxLength={2}
                      value={scoreA}
                      onChangeText={setScoreA}
                    />
                  </View>

                  <Text className="text-3xl font-black text-gray-300 mx-4">-</Text>

                  <View className="flex-1">
                    <Text className="font-bold text-gray-500 text-xs mb-2 text-center">
                      {teamNames[selectedMatch.teamB]}
                    </Text>
                    <TextInput
                      className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 text-center text-3xl font-black"
                      placeholder="0"
                      keyboardType="number-pad"
                      maxLength={2}
                      value={scoreB}
                      onChangeText={setScoreB}
                    />
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setShowScoreModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-100"
                  >
                    <Text className="font-bold text-gray-500 text-center">
                      Annuler
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveScore}
                    className="flex-1 px-4 py-3 rounded-xl bg-primary"
                  >
                    <Text className="font-bold text-white text-center">
                      Enregistrer
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modale de sélection du vainqueur */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showWinnerModal}
        onRequestClose={() => setShowWinnerModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white p-6 rounded-3xl w-full shadow-2xl">
            <Text className="text-xl font-bold text-dark mb-2 text-center">
              Qui a gagné ?
            </Text>
            <Text className="text-sm text-gray-500 mb-6 text-center">
              Sélectionnez l'équipe qualifiée pour le tour suivant
            </Text>

            {selectedMatch && (
              <>
                <TouchableOpacity
                  onPress={() => handleSelectWinner(selectedMatch.teamA)}
                  style={{
                    backgroundColor: getTeamColor(selectedMatch.teamA),
                  }}
                  className="p-5 rounded-2xl mb-3"
                >
                  <Text className="font-black text-white text-lg text-center">
                    {teamNames[selectedMatch.teamA]}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSelectWinner(selectedMatch.teamB)}
                  style={{
                    backgroundColor: getTeamColor(selectedMatch.teamB),
                  }}
                  className="p-5 rounded-2xl mb-3"
                >
                  <Text className="font-black text-white text-lg text-center">
                    {teamNames[selectedMatch.teamB]}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowWinnerModal(false)}
                  className="px-4 py-3 rounded-xl bg-gray-100 mt-3"
                >
                  <Text className="font-bold text-gray-500 text-center">
                    Annuler
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* En-tête */}
      <View className="bg-white px-4 pt-4 pb-6 rounded-b-[30px] shadow-sm z-10 mb-4">
        <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">
          {format === "league" ? "Mode Ligue" : "Mode Poules + Élimination"}
        </Text>
        <Text className="text-2xl font-black text-dark italic tracking-tighter">
          {currentCompetition.name}
        </Text>
        {phase !== "finished" && !isReadOnly && (
          <View className="flex-row items-center mt-2">
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-blue-600 text-xs font-bold">
                {phase === "league" && "Phase de ligue"}
                {phase === "pools" && "Phase de poules"}
                {phase === "knockout" &&
                  `${
                    currentCompetition.currentKnockoutRound === "final"
                      ? "Finale"
                      : currentCompetition.currentKnockoutRound === "semi"
                      ? "Demi-finales"
                      : currentCompetition.currentKnockoutRound === "quarter"
                      ? "Quarts"
                      : "Élimination"
                  }`}
              </Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* MODE LIGUE */}
        {format === "league" && (
          <>
            {/* Classement */}
            <Text className="font-bold text-dark text-lg mb-3">
              🏆 Classement
            </Text>
            <StandingsTable
              standings={currentCompetition.standings}
              teamKeys={Object.keys(currentCompetition.teams)}
            />

            {/* Matchs par journées - Vue paginée */}
            <Text className="font-bold text-dark text-lg mb-3 mt-6">
              ⚽ Calendrier ({currentCompetition.matches.filter((m) => m.status === "played").length}/
              {currentCompetition.matches.length} matchs)
            </Text>

            {/* Grouper les matchs par journée et afficher avec pagination */}
            {(() => {
              const matchesByRound = {};
              currentCompetition.matches.forEach((match) => {
                const round = match.round || 1;
                if (!matchesByRound[round]) {
                  matchesByRound[round] = [];
                }
                matchesByRound[round].push(match);
              });

              const sortedRounds = Object.keys(matchesByRound).sort((a, b) => parseInt(a) - parseInt(b));
              const totalRounds = sortedRounds.length;

              // S'assurer que l'index est valide
              const validIndex = Math.min(currentRoundIndex, totalRounds - 1);
              if (validIndex !== currentRoundIndex) {
                setCurrentRoundIndex(validIndex);
              }

              const currentRound = sortedRounds[validIndex];
              const matches = matchesByRound[currentRound];
              const playedCount = matches.filter((m) => m.status === "played").length;
              const allPlayed = playedCount === matches.length;

              // Vérifier si la journée précédente est terminée
              const isPreviousRoundComplete = validIndex === 0 ||
                matchesByRound[sortedRounds[validIndex - 1]].every((m) => m.status === "played");

              const isLocked = !isPreviousRoundComplete && !isReadOnly;

              return (
                <>
                  {/* Sélecteur de journée avec navigation */}
                  <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
                    <View className="flex-row items-center justify-between mb-4">
                      <TouchableOpacity
                        onPress={() => setCurrentRoundIndex(Math.max(0, currentRoundIndex - 1))}
                        disabled={currentRoundIndex === 0}
                        className={`w-12 h-12 rounded-xl items-center justify-center ${
                          currentRoundIndex === 0 ? "bg-gray-100" : "bg-primary"
                        }`}
                      >
                        <Ionicons
                          name="chevron-back"
                          size={24}
                          color={currentRoundIndex === 0 ? "#D1D5DB" : "#FFFFFF"}
                        />
                      </TouchableOpacity>

                      <View className="flex-1 mx-4">
                        <View className="flex-row items-center justify-center mb-2">
                          <View
                            className={`w-2 h-8 rounded-full mr-2 ${
                              allPlayed
                                ? "bg-green-500"
                                : isLocked
                                ? "bg-gray-300"
                                : "bg-primary"
                            }`}
                          />
                          <Text className="font-black text-dark text-xl">
                            Journée {currentRound}
                          </Text>
                          {isLocked && (
                            <View className="ml-2 bg-gray-100 px-2 py-1 rounded-full flex-row items-center">
                              <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
                            </View>
                          )}
                        </View>
                        <View className="flex-row items-center justify-center">
                          <View
                            className={`px-3 py-1 rounded-full ${
                              allPlayed
                                ? "bg-green-50"
                                : isLocked
                                ? "bg-gray-50"
                                : "bg-blue-50"
                            }`}
                          >
                            <Text
                              className={`text-xs font-bold ${
                                allPlayed
                                  ? "text-green-600"
                                  : isLocked
                                  ? "text-gray-400"
                                  : "text-blue-600"
                              }`}
                            >
                              {playedCount}/{matches.length} matchs
                            </Text>
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => setCurrentRoundIndex(Math.min(totalRounds - 1, currentRoundIndex + 1))}
                        disabled={currentRoundIndex === totalRounds - 1}
                        className={`w-12 h-12 rounded-xl items-center justify-center ${
                          currentRoundIndex === totalRounds - 1 ? "bg-gray-100" : "bg-primary"
                        }`}
                      >
                        <Ionicons
                          name="chevron-forward"
                          size={24}
                          color={currentRoundIndex === totalRounds - 1 ? "#D1D5DB" : "#FFFFFF"}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Indicateur de progression des journées */}
                    <View className="flex-row items-center justify-center gap-1">
                      {sortedRounds.map((round, idx) => {
                        const roundMatches = matchesByRound[round];
                        const roundComplete = roundMatches.every((m) => m.status === "played");
                        const isCurrentRound = idx === validIndex;

                        return (
                          <TouchableOpacity
                            key={round}
                            onPress={() => setCurrentRoundIndex(idx)}
                            className={`h-2 rounded-full ${
                              isCurrentRound
                                ? "w-8"
                                : "w-2"
                            } ${
                              roundComplete
                                ? "bg-green-500"
                                : isCurrentRound
                                ? "bg-primary"
                                : "bg-gray-200"
                            }`}
                          />
                        );
                      })}
                    </View>
                  </View>

                  {/* Message de verrouillage si nécessaire */}
                  {isLocked && (
                    <View className="bg-gray-50 p-4 rounded-2xl mb-3 border border-gray-200">
                      <View className="flex-row items-center">
                        <Ionicons name="information-circle" size={20} color="#9CA3AF" />
                        <Text className="text-gray-600 text-sm ml-2 flex-1">
                          Terminez la journée précédente pour débloquer
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Matchs de la journée sélectionnée */}
                  <View style={{ opacity: isLocked ? 0.5 : 1 }}>
                    {matches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onPress={isLocked ? () => {} : handleOpenScoreModal}
                      />
                    ))}
                  </View>
                </>
              );
            })()}
          </>
        )}

        {/* MODE POULES */}
        {format === "pools" && phase === "pools" && (
          <>
            {Object.keys(currentCompetition.pools).map((poolKey, poolIndex) => {
              const poolName = ["A", "B", "C", "D"][poolIndex];
              const teamKeys = currentCompetition.pools[poolKey];
              const matches = currentCompetition.poolMatches[poolKey];
              const standings = currentCompetition.poolStandings[poolKey];

              return (
                <View key={poolKey} className="mb-8">
                  <Text className="font-bold text-dark text-xl mb-3">
                    🏁 Poule {poolName}
                  </Text>

                  {/* Classement poule */}
                  <Text className="font-bold text-gray-500 text-sm mb-2">
                    Classement
                  </Text>
                  <StandingsTable standings={standings} teamKeys={teamKeys} />

                  {/* Matchs poule */}
                  <Text className="font-bold text-gray-500 text-sm mb-2 mt-4">
                    Matchs ({matches.filter((m) => m.status === "played").length}/
                    {matches.length})
                  </Text>
                  {matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onPress={handleOpenScoreModal}
                      poolKey={poolKey}
                    />
                  ))}
                </View>
              );
            })}

            {/* Bouton passer en knockout */}
            {!isReadOnly && (
              <View className="mt-4">
                <TouchableOpacity
                  onPress={handleStartKnockout}
                  className="bg-orange-500 py-4 rounded-2xl"
                >
                  <Text className="text-white font-bold text-center text-lg uppercase">
                    Passer en phase à élimination →
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* MODE KNOCKOUT */}
        {phase === "knockout" && (
          <>
            <Text className="font-bold text-dark text-xl mb-3">
              🏆{" "}
              {currentCompetition.currentKnockoutRound === "final"
                ? "Finale"
                : currentCompetition.currentKnockoutRound === "semi"
                ? "Demi-finales"
                : currentCompetition.currentKnockoutRound === "quarter"
                ? "Quarts de finale"
                : currentCompetition.currentKnockoutRound === "round16"
                ? "Huitièmes de finale"
                : "Phase à élimination"}
            </Text>

            {currentCompetition.knockoutMatches
              .filter((m) => m.round === currentCompetition.currentKnockoutRound)
              .map((match) => (
                <KnockoutMatchCard key={match.id} match={match} />
              ))}

            {/* Bouton tour suivant */}
            {!isReadOnly &&
              currentCompetition.knockoutMatches
                .filter((m) => m.round === currentCompetition.currentKnockoutRound)
                .every((m) => m.winner) && (
                <View className="mt-4">
                  <TouchableOpacity
                    onPress={handleAdvanceRound}
                    className="bg-green-500 py-4 rounded-2xl"
                  >
                    <Text className="text-white font-bold text-center text-lg uppercase">
                      {currentCompetition.currentKnockoutRound === "final"
                        ? "Terminer le tournoi"
                        : "Tour suivant →"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </>
        )}

        {/* Tournoi terminé */}
        {phase === "finished" && (
          <View className="bg-green-50 p-6 rounded-3xl border-2 border-green-200">
            <View className="items-center mb-4">
              <Ionicons name="trophy" size={64} color="#10B981" />
              <Text className="text-2xl font-black text-green-900 mt-4">
                Tournoi Terminé !
              </Text>
              <Text className="text-green-700 text-center mt-2">
                Ce tournoi est désormais dans l'historique
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Boutons d'action */}
      {!isReadOnly && phase !== "finished" && (
        <View className="absolute bottom-6 left-4 right-4">
          <View className="flex-row gap-3">
            {/* Bouton Sauvegarder (continuer plus tard) */}
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Sauvegarder",
                  "Le tournoi sera sauvegardé et vous pourrez le reprendre plus tard.",
                  [
                    { text: "Annuler", style: "cancel" },
                    {
                      text: "Sauvegarder",
                      onPress: () => {
                        saveCompetition();
                        router.back();
                      },
                    },
                  ]
                );
              }}
              className="flex-1 bg-blue-500 py-4 rounded-2xl shadow-xl flex-row items-center justify-center"
            >
              <Ionicons name="save" size={22} color="white" />
              <Text className="text-white font-bold text-base ml-2 uppercase">
                Sauvegarder
              </Text>
            </TouchableOpacity>

            {/* Bouton Terminer (finaliser définitivement) */}
            <TouchableOpacity
              onPress={
                format === "league" ? handleFinishLeague : handleSaveTournament
              }
              className="flex-1 bg-green-500 py-4 rounded-2xl shadow-xl flex-row items-center justify-center"
            >
              <Ionicons name="checkmark-circle" size={22} color="white" />
              <Text className="text-white font-bold text-base ml-2 uppercase">
                Terminer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
