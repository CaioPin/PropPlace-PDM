import { View, Text } from "react-native";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Redirect } from "expo-router";

export default function Home() {

  const { deslogar } = useAuthContext();
  const sair = () => {
    deslogar();
  };

  // navega-se pra cá com router.push("/home") ou "/(tabs)/home"
  // index sempre aponta pro nome do diretório. app -> "/"
  return (
    <View className="flex-1 justify-center items-center px-5 bg-paleta-fundo">
      <Text>Home Screen</Text>
      <Text className="bg-red-400" onPress={sair}>
        Clique para deslogar
      </Text>
    </View>
  );
}
