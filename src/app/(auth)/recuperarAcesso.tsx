import { Botao } from "@/components/Botao";
import { Campo, CampoIcones } from "@/components/Campo";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function RecuperaAcesso() {
  const [emailRecuperacao, defineEmailRecuperacao] = useState("");
  const estaAberto = router.canGoBack();

  return (
    <View className="flex-1 justify-center bg-paleta-fundo/60" >
      <View className="bg-paleta-fundo p-8 mx-2 rounded-xl border-2 border-paleta-secundaria/60 gap-2">
        <Text className="text-paleta-secundaria font-extrabold text-xg text-left">
          Recupere seu acesso
        </Text>
        <Text className="text-paleta-secundaria font-regular text-xg leading-6 text-left pb-2">
          Insira email cadastrado
        </Text>
        <Campo
          ativo
          autoComplete="email"
          autoCapitalize="none"
          autoFocus
          value={emailRecuperacao}
          onChangeText={defineEmailRecuperacao}
          icone={CampoIcones.EMAIL}
          placeholder="E-mail de recuperação"
          aoMudar={() => {}}
        />
        <View className="flex-row items-center justify-between mt-2 px-2">
          {estaAberto && (
            <Text
              onPress={() => router.back()}
              className="text-p text-blue-700">
              Voltar ao log-in
            </Text>
          )}
          <Botao variante="enviar">
            <Botao.Titulo>Enviar</Botao.Titulo>
          </Botao>
        </View>
      </View>
    </View>
  );
}
