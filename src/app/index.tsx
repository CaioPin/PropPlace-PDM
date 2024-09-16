import { useAuthContext } from "@/hooks/useAuthContext";
import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function App() {
  const { username } = useAuthContext();

  return (
    <View className="flex-1 justify-center items-center px-5 bg-paleta-fundo gap-4">
      <Text>Root Screen acessível universalmente</Text>
      {username ? (
        <>
          <Text>{username} está logado</Text>
          <Link href="/home" className="text-blue-700">
            Ir pra home em (tabs)
          </Link>
        </>
      ) : (
        <>
          <Text>Ninguém está logado. Apenas rotas (auth) acessíveis</Text>
          <Link href="/login" className="text-blue-700">
            Ir pra login
          </Link>
        </>
      )}
      {/* rotas em diretorio com () no nome podem ter a parte entre parenteses omitida: router.push("(tabs)/home") dá na mesma*/}
    </View>
  );
}
