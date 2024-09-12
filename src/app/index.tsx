import { Botao } from "@/components/Botao";
import { Link, router } from "expo-router";
import { View, Text } from "react-native";

export default function App() {
  return (
    <View className="flex-1 justify-center items-center px-5 bg-paleta-fundo gap-4">
      <Text>Root Screen</Text>
      <Link href="/home" className="text-blue-700">Ir pra home em (tabs)</Link>
        {/* rotas em diretorio com () no nome podem ter a parte entre parenteses omitida: router.push("(tabs)/home") dá na mesma*/}
    </View>
  );
}
