import { Botao } from "@/components/Botao";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { Campo, CampoIcones } from "@/components/Campo";
import { Link, router } from "expo-router";
import { Modal } from "@/components/Modal";

const estilo = {
  bemVindo: ConstrutorEstiloConstante.construtor()
    .fonteGG()
    .corSecundaria()
    .construir(),
};

export default function Login() {
  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [recuperaSenhaModalAberto, defineRecuperaSenhaModalAberto] =
    useState(false);
  const [emailRecuperacao, defineEmailRecuperacao] = useState("");
  const [falhaModalAberto, defineFalhaModalAberto] =
    useState(false);

  const realizaLogin = async () => {
    // TODO lógica de login

    console.log({ email, senha });
    // se der tudo certo
    // router.push("/home");

    // se der errado
    defineFalhaModalAberto(true);
  };

  const abreRecuperaSenhaModal = () => {
    defineRecuperaSenhaModalAberto(true);
  };

  return (
    <>
      <View className="flex-1 justify-center p-4 gap-4">
        <Text style={estilo.bemVindo} className="font-semibold py-4">
          Bem vindo.{"\n"}Faça log-in para acessar sua conta
        </Text>
        <View className="flex gap-6 items-center">
          <Campo
            ativo
            value={email}
            onChangeText={definirEmail}
            icone={CampoIcones.EMAIL}
            placeholder="E-mail ou nome de usuário"
          />
          <Campo
            ativo
            secureTextEntry
            value={senha}
            onChangeText={definirSenha}
            icone={CampoIcones.CADEADO}
            placeholder="Senha"
          />
        </View>
        <View className="flex-row justify-end">
          <TouchableOpacity onPress={abreRecuperaSenhaModal}>
            <Text className="text-blue-700">Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        <View className="flex items-center">
          <Botao variante="enviar" onPress={realizaLogin}>
            <Botao.Titulo>Enviar</Botao.Titulo>
          </Botao>
        </View>
        <View className="flex-row items-center py-4 justify-center gap-2">
          <Text>Novo usuário?</Text>
          <Link href="/cadastro" className="text-blue-700">
            Registre-se
          </Link>
        </View>

        <Modal
          titulo="Recupere seu acesso"
          subtitulo="Insira o email cadastrado"
          visible={recuperaSenhaModalAberto}>
          <Campo
            ativo
            value={emailRecuperacao}
            onChangeText={defineEmailRecuperacao}
            icone={CampoIcones.CADEADO}
            placeholder="E-mail de recuperação"
            className="mt-2"
          />
          <View className="flex-row items-center justify-between mt-4 px-4">
            <TouchableOpacity
              onPress={() => defineRecuperaSenhaModalAberto(false)}>
              <Text className="text-blue-700">Voltar ao log-in</Text>
            </TouchableOpacity>
            <Botao variante="enviar">
              <Botao.Titulo>Enviar</Botao.Titulo>
            </Botao>
          </View>
        </Modal>

        <Modal
          titulo="Falha de autenticação"
          subtitulo="tente novamente"
          visible={falhaModalAberto}
          onClose={() => {
            defineFalhaModalAberto(false);
          }} />
      </View>
    </>
  );
}
