import { router } from "expo-router";
import { Text, View } from "react-native";
import { useState } from "react";

import { useAuthContext } from "@/hooks/useAuthContext";

import { Campo, CampoIcones } from "@/components/Campo";
import { Botao } from "@/components/Botao";

import { validacoesUsuario } from "@/utils/validacoes";
import { api } from "@/api";
import { pegaStatusDeErro } from "@/utils/pegaStatusDeErro";
import { Modal } from "@/components/Modal";
import { Loading } from "@/components/Loading";

export default function AlterarSenha() {
  const [senhaAtual, defineSenhaAtual] = useState("");
  const [novaSenha, defineNovaSenha] = useState("");
  const [novaSenhaRepete, defineNovaSenhaRepete] = useState("");
  const [mensagemModal, defineMensagemModal] = useState("");
  const [carregando, defineCarregando] = useState(false);

  const { userId, deslogar } = useAuthContext();

  const estaAberto = router.canGoBack();
  const mensagemSucesso = "Senha atualizada com sucesso! Faça login novamente.";

  async function realizaAlteracao() {
    const validacaoNovaSenha = validacoesUsuario({
      senha: novaSenha,
    });

    if (validacaoNovaSenha.length !== 0) {
      defineMensagemModal(
        "Certifique-se de que a nova senha tem no mínimo 8 caracteres e nenhum espaço vazio."
      );
      return;
    }

    if (novaSenha !== novaSenhaRepete) {
      defineMensagemModal(
        "Certifique-se de que a nova senha foi repetida corretamente."
      );
      return;
    }

    if (!senhaAtual) {
      defineMensagemModal("Certifique-se de preencher os campos corretamente.");
      return;
    }

    defineCarregando(true);
    const resultadoStatus = await patchSenha(userId!, senhaAtual, novaSenha);
    defineCarregando(false);

    switch (resultadoStatus) {
      case 500:
        defineMensagemModal("Erro de conexão com o servidor.");
        break;
      case 400:
        defineMensagemModal("Campos preenchidos incorretamente.");
        break;
      case 401:
        defineMensagemModal("Senha atual incorreta.");
        break;
      case 200:
        defineMensagemModal(mensagemSucesso);
        break;
      default:
        break;
    }
  }

  async function patchSenha(
    userId: string,
    senhaAtual: string,
    novaSenha: string
  ) {
    try {
      const resposta = await api.patch(`/users/${userId}/password`, {
        antigaSenha: senhaAtual,
        senha: novaSenha,
      });

      return resposta.status;
    } catch (erro) {
      const resposta = pegaStatusDeErro(erro);
      return resposta?.status;
    }
  }

  return (
    <View className="flex-1 justify-center bg-paleta-fundo/60">
      <View className="bg-paleta-fundo p-8 mx-2 rounded-xl border-2 border-paleta-secundaria/60 gap-6">
        <Text className="text-paleta-secundaria font-extrabold text-xg text-left pb-2">
          Altere sua senha
        </Text>

        <Campo
          ativo
          autoCapitalize="none"
          autoFocus
          value={senhaAtual}
          onChangeText={defineSenhaAtual}
          icone={CampoIcones.CADEADO}
          placeholder="Senha atual"
          aoMudar={() => {}}
        />

        <Campo
          ativo
          autoCapitalize="none"
          value={novaSenha}
          onChangeText={defineNovaSenha}
          icone={CampoIcones.CADEADO}
          placeholder="Nova senha"
          aoMudar={() => {}}
        />

        <Campo
          ativo
          autoCapitalize="none"
          value={novaSenhaRepete}
          onChangeText={defineNovaSenhaRepete}
          icone={CampoIcones.CADEADO}
          placeholder="Repita a nova senha"
          aoMudar={() => {}}
        />

          <View className="flex-row items-center justify-between mt-4 px-2">
            {estaAberto && (
              <Text
                onPress={() => router.back()}
                className="text-regular text-blue-700">
                Voltar
              </Text>
            )}
            <Botao variante="enviar" onPress={realizaAlteracao}>
              <Botao.Titulo>Enviar</Botao.Titulo>
            </Botao>
          </View>

        <Modal
          titulo={mensagemModal}
          visible={!!mensagemModal || carregando}
          onRequestClose={() => {
            defineMensagemModal("");
            if (mensagemModal === mensagemSucesso) {
              deslogar();
            }
          }}>
          {carregando && <Loading />}
        </Modal>
      </View>
    </View>
  );
}
