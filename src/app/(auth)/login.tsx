import { useState } from "react";
import { Link, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

import { validacoesUsuario } from "@/utils/validacoes";

import { Botao } from "@/components/Botao";
import { Campo, CampoIcones } from "@/components/Campo";
import { Modal } from "@/components/Modal";
import { Loading } from "@/components/Loading";

import { useAuthContext } from "@/hooks/useAuthContext";

export default function Login() {
  const { logar, isLoading } = useAuthContext();
  const [username, definirUsername] = useState("");
  const [senha, definirSenha] = useState("");
  const [falhaModalAberto, defineFalhaModalAberto] = useState(false);
  const [mensagemFalha, defineMensagemFalha] = useState("Preencha os campos corretamente");

  const realizaLogin = async () => {
    const usuario = { nomeUsuario: username, senha };
    const validacao = validacoesUsuario(usuario);
    const haCamposInvalidos = validacao.length > 0;

    if (haCamposInvalidos) {
      defineFalhaModalAberto(true);
      return;
    }

    const resultado = await logar(username, senha);

    if (resultado === "erro") {
      defineMensagemFalha(
        "Verifique se seu nome de usuário e senha estão corretos"
      );
      defineFalhaModalAberto(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <View className="flex-1 justify-center p-8 gap-4 bg-paleta-fundo">
          <Text className="font-extrabold text-xg text-paleta-secundaria py-4">
            Bem vindo.{"\n"}Faça log-in para acessar sua conta
          </Text>
          <View className="flex gap-6 items-center">
            <Campo
              ativo
              autoComplete="username"
              autoCapitalize="none"
              returnKeyType="next"
              autoFocus
              value={username}
              onChangeText={definirUsername}
              icone={CampoIcones.PESSOA}
              placeholder="Nome de usuário"
              aoMudar={() => {}}
            />
            <Campo
              ativo
              autoComplete="password"
              autoCapitalize="none"
              returnKeyType="done"
              value={senha}
              onChangeText={definirSenha}
              icone={CampoIcones.CADEADO}
              placeholder="Senha"
              aoMudar={() => {}}
            />
          </View>
          <View className="flex-row justify-end">
            <TouchableOpacity
              onPress={() => router.navigate("/recuperarAcesso")}>
              <Text className="text-p text-blue-700">Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          <View className="flex items-center">
            <Botao variante="enviar" onPress={realizaLogin}>
              <Botao.Titulo>Enviar</Botao.Titulo>
            </Botao>
          </View>
          <View className="flex-row items-center py-4 justify-center gap-2">
            <Text className="text-p">Novo usuário?</Text>
            <Link href="/cadastro" className="text-p text-blue-700">
              Registre-se
            </Link>
          </View>

          <Modal
            titulo="Falha de autenticação"
            subtitulo={mensagemFalha}
            visible={falhaModalAberto}
            onRequestClose={() => {
              defineFalhaModalAberto(false);
            }}
          />
        </View>
      )}
    </>
  );
}
