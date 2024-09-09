import { Slot } from "expo-router";
import { View } from "react-native";
import "@/styles/global.css";
import { useFonts } from "expo-font";
import {
  Inter_500Medium,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { Loading } from "@/components/Loading";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-paleta-fundo">
      <StatusBar translucent />
      <Slot />    
    </View>
  );
}
