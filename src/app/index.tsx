import { Text, View } from "react-native"

export default function App() {
  return (
    <View className="flex-1 justify-center items-center px-5">
      <Text className="font-regular">INDEX</Text>
      <Text className="font-medium">testa com font-medium</Text>
      <Text>testa sem font</Text>
      <Text className="font-regular">testa font-regular</Text>

      <Text className="font-semibold">testa font-semibold</Text>
    </View>
  )
}
