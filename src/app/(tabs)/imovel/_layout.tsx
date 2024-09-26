import { DadosProvider } from "@/context/dadosContext";
import { Stack } from "expo-router";

export default function imovelLayout() {
  
  return (
    <DadosProvider>
      <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="formularioAluguel"/>
    </Stack>
    </DadosProvider>
  );
}
