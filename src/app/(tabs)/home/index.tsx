import { View, Text } from "react-native";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Redirect } from "expo-router";
import { Modal } from "@/components/Modal";
import { Botao } from "@/components/Botao";
import { useContext, useState } from "react";
import { logouContexto } from "@/app/(auth)/login";

export default function Home() {
  const logou = useContext(logouContexto);
  const [sucessoModalAberto, defineSucessoModalAberto] = useState(logou);

  const { deslogar } = useAuthContext();
  const sair = () => {
    deslogar();
    return <Redirect href={"/"} />;
  };

  // navega-se pra cá com router.push("/home") ou "/(tabs)/home"
  // index sempre aponta pro nome do diretório. app -> "/"
  return (
    <View className="flex-1 justify-center items-center px-5 bg-paleta-fundo">
      <Text>Home Screen</Text>
      <Text className="bg-red-400" onPress={sair}>
        Deslogar
      </Text>

      <Modal
        visible={sucessoModalAberto}
        titulo="Login realizado com sucesso"
        onRequestClose={() => defineSucessoModalAberto(false)}>
        <View className="flex justify-center items-center">
          <Botao
            variante="enviar"
            onPress={() => defineSucessoModalAberto(false)}>
            <Botao.Titulo>Continuar</Botao.Titulo>
          </Botao>
        </View>
      </Modal>
    </View>
  );
}
