import { Loading } from "@/components/Loading";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Link, Redirect } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function App() {
  const { username } = useAuthContext();

  return (
    <View className="flex-1 justify-center items-center px-5 bg-paleta-fundo gap-4">
      {username ? (
        <>
          <Redirect href={"/home"}></Redirect>
        </>
      ) : (
        <>
          <Redirect href={"/login"}></Redirect>
        </>
      )}
    </View>
  );
}
