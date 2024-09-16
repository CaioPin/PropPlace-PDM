import { useContext } from "react";
import { AuthContext } from "@/context/authContext";

export function useAuthContext() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error(
      "useAuthContext precisa estar dentro de <SessionProvider />"
    );
  }
  return contexto;
}
