import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import { Campo, CampoIcones } from "@/components/Campo";
import { Botao } from "@/components/Botao";
import { Modal } from "@/components/Modal";

import { validacoesUsuario } from "@/utils/validacoes";
import { api } from "@/api";
import { pegaStatusDeErro } from "@/utils/pegaStatusDeErro";
import { Loading } from "@/components/Loading";
import { cores } from "@/constants/cores";

const Cadastro = () => {
  //campos
  const [nome, definirNome] = useState("");
  const [username, definirUsername] = useState("");
  const [telefone, definirTelefone] = useState("");
  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [senhaRepetida, definirSenhaRepete] = useState("");
  const [falhaModalAberto, defineFalhaModalAberto] = useState(false);
  const [mensagemFalha, defineMensagemFalha] = useState("");
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

      return resposta.status;
    } catch (erro) {
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
    const haPreenchidoIncorretamente =
      validacao.includes("nomeCompleto") ||
      validacao.includes("nomeUsuario") ||
      validacao.includes("email");

    if (haPreenchidoIncorretamente) {
      defineMensagemFalha("Preencha todos os campos corretamente.");
      defineFalhaModalAberto(true);
      return;
    }

    if (validacao.includes("contato")) {
      defineMensagemFalha("Preencha os 11 numeros do telefone corretamente.");
      defineFalhaModalAberto(true);
      return;
    }
    if (validacao.includes("senha")) {
      defineMensagemFalha(
        "Preencha as senhas novamente com no mínimo 8 caracteres."
      );
      defineFalhaModalAberto(true);
      return;
    }
    if (senha !== senhaRepetida) {
      defineMensagemFalha("As senhas preenchidas devem ser iguais.");
      defineFalhaModalAberto(true);
      return;
    }

    defineCarregando(true);
    const respostaStatus = await chamaApiCadastro();
    defineCarregando(false);

    if (respostaStatus === 201) {
      defineSucessoModalAberto(true);
      return;
    }
    if (respostaStatus === 400) {
      defineMensagemFalha("Bad Request: Campos preenchidos incorretamente.");
      defineFalhaModalAberto(true);
      return;
    }
    if (respostaStatus === 409) {
      defineMensagemFalha("Conflito: Email ou nome de usuário já cadastrado");
      defineFalhaModalAberto(true);
      return;
    }
  };

  function redirecionaParaLogin() {
    defineSucessoModalAberto(false);
    router.navigate("/login");
  }

  return (
    <>
      {carregando ? (
        <Loading />
      ) : (
        <SafeAreaView style={{ backgroundColor: cores.fundo, flexGrow: 1 }}>
          <ScrollView
            contentContainerStyle={{
              justifyContent: "center",
              flex: 1,
              gap: 16,
              paddingHorizontal: 32,
            }}>
            <Text className="font-extrabold text-xg text-paleta-secundaria py-4">
              Registre-se
            </Text>
            <View className="flex gap-6 items-center">
              <Campo
                ativo
                autoFocus
                autoComplete="name"
                inputMode="text"
                returnKeyType="next"
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
                returnKeyType="next"
                value={username}
                onChangeText={definirUsername}
                icone={CampoIcones.PESSOA}
                placeholder="Nome de usuário"
                aoMudar={() => {}}
              />
              <Campo
                ativo
                keyboardType="phone-pad"
                autoComplete="tel-device"
                returnKeyType="next"
                maxLength={11}
                value={telefone}
                onChangeText={definirTelefone}
                icone={CampoIcones.TELEFONE}
                placeholder="Telefone"
                aoMudar={() => {}}
              />
              <Campo
                ativo
                autoComplete="email"
                autoCapitalize="none"
                inputMode="email"
                returnKeyType="next"
                value={email}
                onChangeText={definirEmail}
                icone={CampoIcones.EMAIL}
                placeholder="E-mail"
                aoMudar={() => {}}
              />
              <Campo
                ativo
                autoComplete="new-password"
                autoCapitalize="none"
                returnKeyType="next"
                value={senha}
                onChangeText={definirSenha}
                icone={CampoIcones.CADEADO}
                placeholder="Senha forte"
                aoMudar={() => {}}
              />
              <Campo
                ativo
                autoComplete="new-password"
                autoCapitalize="none"
                returnKeyType="done"
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
              <Text className="text-p">Já tem registro?</Text>
              <Link href="/login" className="text-p text-blue-700">
                Faça log-in
              </Link>
            </View>
            <Modal
              titulo="Falha no registro"
              subtitulo={mensagemFalha}
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
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default Cadastro;
