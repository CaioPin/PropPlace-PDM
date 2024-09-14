import { Link, Redirect, router, Slot } from "expo-router";
import { View, Text } from "react-native";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function App() {
  const { username } = useAuthContext();

  if (username) {
    return <Redirect href={"/"} />; 
  }

  return <Slot />;
}
