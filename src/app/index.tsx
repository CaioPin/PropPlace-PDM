import { useAuthContext } from "@/hooks/useAuthContext";
import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function App() {
  const { username, userId, deslogar } = useAuthContext();

  return (
    <View className="flex-1 justify-center items-center px-5 bg-paleta-fundo gap-4">
      <Text>Root Screen acessível universalmente</Text>
      {username ? (
        <>
          <Text>
            username: "{username + '"\n'}id: "{userId + '"\n'}está logado
          </Text>
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

      <Pressable className="flex gap-y-3 bg-red-400" onPress={deslogar}>
        <Text>Deslogar</Text>
      </Pressable>
    </View>
  );
}
