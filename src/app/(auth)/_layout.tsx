import { Redirect, Slot } from "expo-router";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function App() {
  const { username } = useAuthContext();

  if (username) {
    return <Redirect href={"/"} />;
    // se já está logado, não precisa ter acesso
    // as telas de autenticacao
  }

  return <Slot />;
}
