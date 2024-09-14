import { useState } from "react";
import { Link, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { validacoesUsuario } from "@/utils/validacoes";

import { Botao } from "@/components/Botao";
import { Campo, CampoIcones } from "@/components/Campo";
import { Modal } from "@/components/Modal";

import { useAuthContext } from "@/hooks/useAuthContext";
import { Loading } from "@/components/Loading";

const estilo = {
  bemVindo: ConstrutorEstiloConstante.construtor()
    .fonteGG()
    .corSecundaria()
    .construir(),
};


export default function Login() {
  const { logar, isLoading } = useAuthContext();
  const [username, definirUsername] = useState("");
  const [senha, definirSenha] = useState("");
  const [falhaModalAberto, defineFalhaModalAberto] = useState(false);

  const realizaLogin = async () => {
    const usuario = { nomeUsuario: username, senha };
    const validacao = validacoesUsuario(usuario);
    const haCamposInvalidos = validacao.length > 0;

    if (haCamposInvalidos) {
      defineFalhaModalAberto(true);
      return;
    }

    const resultado = await logar(username, senha);
    console.log(resultado);
    
    if (isLoading) {
      return <Loading />;
    }

    if (resultado === "erro") {
      defineFalhaModalAberto(true);
    }
  };

  // TODO: atualizar estilo da fonte
  return (
    <>
      <View className="flex-1 justify-center p-4 gap-4 bg-paleta-fundo">
        <Text style={estilo.bemVindo} className="font-semibold py-4">
          Bem vindo.{"\n"}Faça log-in para acessar sua conta
        </Text>
        <View className="flex gap-6 items-center">
          <Campo
            ativo
            autoComplete="username"
            value={username}
            onChangeText={definirUsername}
            icone={CampoIcones.PESSOA}
            placeholder="Nome de usuário"
            aoMudar={() => {}}
          />
          <Campo
            ativo
            secureTextEntry
            autoComplete="password"
            value={senha}
            onChangeText={definirSenha}
            icone={CampoIcones.CADEADO}
            placeholder="Senha"
            aoMudar={() => {}}
          />
        </View>
        <View className="flex-row justify-end">
          <TouchableOpacity
            onPress={() => router.push("/login/recuperarAcesso")}>
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
          titulo="Falha de autenticação"
          subtitulo="tente novamente"
          visible={falhaModalAberto}
          onRequestClose={() => {
            defineFalhaModalAberto(false);
          }}
        />
      </View>
    </>
  );
}
