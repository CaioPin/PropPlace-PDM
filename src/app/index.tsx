import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import { Menu } from "../components/Menu"
import { Usuarios } from "@/components/Usuarios"

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />  
      <Text>Open up Index.tsx to start working on your app!</Text>
        <Menu />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
