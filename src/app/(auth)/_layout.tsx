import { Redirect, Slot, Stack } from "expo-router";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function App() {
  const { username } = useAuthContext();

  if (username) {
    return <Redirect href={"/"} />;
    // se já está logado, não precisa ter acesso
    // as telas de autenticacao
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="recuperarAcesso"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="cadastro" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
