import { Stack } from "expo-router";

export default function LoginLayout() {
  // supondo que home tenha uma estrutura de stack, seria feito aqui
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="recuperarAcesso"
        options={{ presentation: "modal" }}></Stack.Screen>
    </Stack>
  );
}
