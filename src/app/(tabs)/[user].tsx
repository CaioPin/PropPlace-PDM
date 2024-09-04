import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function User() {
  
  const userParams = useLocalSearchParams<{user: string}>()

  return <View className="flex-1 justify-center items-center px-5 bg-paleta-fundo">
          <Text>{userParams.user} screen</Text>
  </View>;
}
