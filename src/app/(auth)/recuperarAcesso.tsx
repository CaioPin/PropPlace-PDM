import { Botao } from "@/components/Botao";
import { Campo, CampoIcones } from "@/components/Campo";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Sucesso() {
  const [emailRecuperacao, defineEmailRecuperacao] = useState("");
  return (
    <View className="flex-1 justify-center bg-paleta-fundo p-4">
      <Text className="text-paleta-secundaria font-semibold text-gg text-left pb-2">
        Recupere seu acesso
      </Text>
      <Text className="text-paleta-secundaria font-regular text-gg leading-6 text-left pb-4">
        Insira email cadastrado
      </Text>
      <Campo
        className="mt-2"
        ativo
        autoComplete="email"
        autoCapitalize="none"
        autoFocus
        value={emailRecuperacao}
        onChangeText={defineEmailRecuperacao}
        icone={CampoIcones.CADEADO}
        placeholder="E-mail de recuperação"
        aoMudar={() => {}}
      />
      <View className="flex-row items-center justify-between mt-4 px-4">
        <Text onPress={() => router.push("/login")} className="text-blue-700">
          Voltar ao log-in
        </Text>
        <Botao variante="enviar">
          <Botao.Titulo>Enviar</Botao.Titulo>
        </Botao>
      </View>
    </View>
  );
}
