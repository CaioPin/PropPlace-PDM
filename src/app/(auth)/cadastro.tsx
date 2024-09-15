import React, { useState } from "react";
import { View, Text } from "react-native";
import { Link, router } from "expo-router";

import { Campo, CampoIcones } from "@/components/Campo";
import { Botao } from "@/components/Botao";
import { Modal } from "@/components/Modal";

import { formataTelefone } from "@/utils/formatacoes";
import { validacoesUsuario } from "@/utils/validacoes";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { api } from "@/api";
import { pegaStatusDeErro } from "@/utils/pegaStatusDeErro";
import { Loading } from "@/components/Loading";

const estilo = {
  registrese: ConstrutorEstiloConstante.construtor()
    .fonteGG()
    .corSecundaria()
    .construir(),
};

const Cadastro = () => {
  //campos
  const [nome, definirNome] = useState("");
  const [username, definirUsername] = useState("");
  const [telefone, definirTelefone] = useState("");
  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [senhaRepetida, definirSenhaRepete] = useState("");
  const [falhaModalAberto, defineFalhaModalAberto] = useState(false);
  const [sucessoModalAberto, defineSucessoModalAberto] = useState(false);
  const [carregando, defineCarregando] = useState(false);

  async function chamaApiCadastro() {
    try {
      const resposta = await api.post("/users", {
        nome,
        username,
        senha,
        telefone,
        email,
      });

      const { status } = resposta.data as {
        status: number;
      };
      return status;
    } catch (erro) {
      console.error(erro);
      const resposta = pegaStatusDeErro(erro);

      return resposta?.status;
    }
  }

  const realizaCadastro = async () => {
    const validacao = validacoesUsuario({
      nomeCompleto: nome,
      nomeUsuario: username,
      senha,
      contato: telefone,
      email,
    });

    const haCamposInvalidos = validacao.length > 0;

    if (haCamposInvalidos || senha !== senhaRepetida) {
      defineFalhaModalAberto(true);

      return;
    }
    defineCarregando(true);
    const respostaStatus = await chamaApiCadastro();
    defineCarregando(false);
    if (respostaStatus === 201) {
      defineSucessoModalAberto(true);
    } else {
      defineFalhaModalAberto(true);
    }
  };

  function redirecionaParaLogin() {
    defineSucessoModalAberto(false);
    router.push("/login");
  }
  // TODO: atualizar estilo da fonte
  return (
    <>
      {carregando ? (
        <Loading />
      ) : (
        <View className="flex-1 justify-center p-4 gap-4 bg-paleta-fundo">
          <Text className="py-4 font-semibold" style={estilo.registrese}>
            Registre-se
          </Text>
          <View className="flex gap-6 items-center">
            <Campo
              ativo
              autoFocus
              autoComplete="name"
              value={nome}
              onChangeText={definirNome}
              icone={CampoIcones.PESSOA}
              placeholder="Nome"
              aoMudar={() => {}}
            />
            <Campo
              ativo
              autoCapitalize="none"
              autoComplete="username-new"
              value={username}
              onChangeText={definirUsername}
              icone={CampoIcones.PESSOA}
              placeholder="Nome de usuário"
              aoMudar={() => {}}
            />
            <Campo
              ativo
              keyboardType="phone-pad"
              autoComplete="tel-national"
              value={telefone}
              aoMudar={definirTelefone}
              formatacao={formataTelefone}
              icone={CampoIcones.TELEFONE}
              placeholder="Telefone"
            />
            <Campo
              ativo
              autoComplete="email"
              value={email}
              onChangeText={definirEmail}
              icone={CampoIcones.EMAIL}
              placeholder="E-mail"
              aoMudar={() => {}}
            />
            <Campo
              ativo
              secureTextEntry
              autoComplete="new-password"
              value={senha}
              onChangeText={definirSenha}
              icone={CampoIcones.CADEADO}
              placeholder="Senha forte"
              aoMudar={() => {}}
            />
            <Campo
              ativo
              secureTextEntry
              autoComplete="new-password"
              value={senhaRepetida}
              onChangeText={definirSenhaRepete}
              icone={CampoIcones.CADEADO}
              placeholder="Repita a senha"
              aoMudar={() => {}}
            />
          </View>

          <View className="flex items-center">
            <Botao variante="enviar" onPress={realizaCadastro}>
              <Botao.Titulo>Enviar</Botao.Titulo>
            </Botao>
          </View>

          <View className="flex-row items-center py-2 justify-center gap-2">
            <Text>Já tem registro?</Text>
            <Link href="/login" className="text-blue-700">
              Faça log-in
            </Link>
          </View>
          <Modal
            titulo="Falha no registro"
            subtitulo="Tente novamente"
            visible={falhaModalAberto}
            onClose={() => {
              defineFalhaModalAberto(false);
            }}
          />

          <Modal
            visible={sucessoModalAberto}
            titulo="Registro realizado com sucesso"
            onRequestClose={redirecionaParaLogin}>
            <View className="flex justify-center items-center">
              <Botao variante="enviar" onPress={redirecionaParaLogin}>
                <Botao.Titulo>Continuar</Botao.Titulo>
              </Botao>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

export default Cadastro;
