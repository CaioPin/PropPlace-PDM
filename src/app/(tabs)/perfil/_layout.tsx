import { Stack } from "expo-router";

export default function PerfilLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="index" options={{}} /> */}
      <Stack.Screen
        name="alterarSenha"
        options={{ presentation: "transparentModal" }}
      />
    </Stack>
  );
}
