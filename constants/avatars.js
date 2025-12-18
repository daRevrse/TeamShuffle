/**
 * Catalogue d'avatars disponibles avec emojis
 */

export const AVATARS = [
  {
    id: 1,
    emoji: "⚽",
    placeholder: { color: "#FF6B6B", icon: "football" },
    source: require("../assets/avatars/avatar_01.png"),
  },
  {
    id: 2,
    emoji: "🏆",
    placeholder: { color: "#4ECDC4", icon: "trophy" },
    source: require("../assets/avatars/avatar_02.png"),
  },
  {
    id: 3,
    emoji: "⚡",
    placeholder: { color: "#45B7D1", icon: "flash" },
    source: require("../assets/avatars/avatar_03.png"),
  },
  {
    id: 4,
    emoji: "⭐",
    placeholder: { color: "#FFA07A", icon: "star" },
    source: require("../assets/avatars/avatar_04.png"),
  },
  {
    id: 5,
    emoji: "🚀",
    placeholder: { color: "#98D8C8", icon: "rocket" },
    source: require("../assets/avatars/avatar_05.png"),
  },
  {
    id: 6,
    emoji: "🛡️",
    placeholder: { color: "#F7DC6F", icon: "shield" },
    source: require("../assets/avatars/avatar_06.png"),
  },
  {
    id: 7,
    emoji: "⚡",
    placeholder: { color: "#BB8FCE", icon: "thunderstorm" },
    source: require("../assets/avatars/avatar_07.png"),
  },
  {
    id: 8,
    emoji: "💪",
    placeholder: { color: "#85C1E2", icon: "fitness" },
    source: require("../assets/avatars/avatar_08.png"),
  },
  {
    id: 9,
    emoji: "🥇",
    placeholder: { color: "#F8B500", icon: "medal" },
    source: require("../assets/avatars/avatar_09.png"),
  },
  {
    id: 10,
    emoji: "🔥",
    placeholder: { color: "#E74C3C", icon: "flame" },
    source: require("../assets/avatars/avatar_10.png"),
  },
];

export const DEFAULT_AVATAR = AVATARS[0];
