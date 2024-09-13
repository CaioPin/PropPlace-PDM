import { View, Text } from "react-native";

export default function Home() {
  // navega-se pra cá com router.push("/home") ou "/(tabs)/home"
  // index sempre aponta pro nome do diretório. app -> "/"
  return <View className="flex-1 justify-center items-center px-5 bg-paleta-fundo">
          <Text>Home Screen</Text>
  </View>;
}
