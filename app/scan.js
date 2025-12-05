import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-light">
        <Text className="text-center mb-4 text-lg">
          Nous avons besoin de la caméra pour scanner le profil.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Autoriser la caméra</Text>
        </TouchableOpacity>
        {/* Bouton retour si on refuse */}
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary font-bold">Annuler</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    // Détection des liens de l'app
    if (data.startsWith("exp://") || data.startsWith("teamshuffle://")) {
      Linking.openURL(data);
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Interface par-dessus la caméra */}
      <View className="flex-1 justify-between py-12 px-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="self-start bg-black/50 p-2 rounded-full"
        >
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>

        <View className="items-center">
          <View className="w-64 h-64 border-2 border-white/50 rounded-3xl" />
          <Text className="text-white mt-4 font-bold bg-black/50 px-4 py-2 rounded-full">
            Scanne le profil d'un ami
          </Text>
        </View>
        <View />
      </View>
    </View>
  );
}
