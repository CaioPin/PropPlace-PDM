import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "../api";

interface AuthContexto {
  token: string | null;
  username?: string | null;
  logar: (username: string, senha: string) => Promise<string>;
  deslogar: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContexto>({
  token: null,
  username: null,
  logar: async (username: string, senha: string) => "",
  deslogar: async () => {},
  isLoading: false,
});

interface IProps {
  children: React.ReactNode;
}
function SessionProvider({ children }: IProps) {
  const [isLoading, defineIsLoading] = useState<boolean>(false);
  const [token, defineToken] = useState<string | null>(null);
  const [username, defineUsername] = useState<string | null>(null);

  async function logar(username: string, senha: string) {
    const dados = {
      username,
      senha,
    };
    try {
      defineIsLoading(true);
      const response = await api.post("users/login", dados);

      const { token, username } = response.data as {
        token: string;
        username: string;
      };

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      await AsyncStorage.setItem("auth.token", token);
      await AsyncStorage.setItem("auth.username", username);
      defineToken(token);
      defineUsername(username);
      defineIsLoading(false);
      return "sucesso"
    } catch (error) {
      console.error("Falha ao logar", error);
      defineIsLoading(false);
      return "erro";
    }
  }

  async function deslogar() {
    defineIsLoading(true);
    defineToken(null);
    defineUsername(null);
    await AsyncStorage.removeItem("auth.token");
    await AsyncStorage.removeItem("auth.username");
    defineIsLoading(false);
  }

  useEffect(() => {
    async function loadStorage() {
      defineIsLoading(true);
      const tokenStorage = await AsyncStorage.getItem("auth.token");
      const nameStorage = await AsyncStorage.getItem("auth.username");
      defineIsLoading(false);
      if (tokenStorage) {
        api.defaults.headers.common.Authorization = `Bearer ${tokenStorage}`;
        defineToken(tokenStorage);
        defineUsername(nameStorage);
      }
    }
    loadStorage();
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, username, logar, deslogar, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext, SessionProvider };
