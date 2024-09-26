import { api } from "@/api";
import { Botao } from "@/components/Botao";
import { Campo, CampoIcones } from "@/components/Campo";
import { Loading } from "@/components/Loading";
import { Modal } from "@/components/Modal";
import { validacoesUsuario } from "@/utils/validacoes";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function RecuperaAcesso() {
  const [emailRecuperacao, defineEmailRecuperacao] = useState("");
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagemFalha, defineMensagemFalha] = useState("");
  const estaAberto = router.canGoBack();

  async function confirmaEnvio() {
    const validacao = validacoesUsuario({
      nomeCompleto: nome,
      nomeUsuario: username,
      email: emailRecuperacao,
    });
    
    const haPreenchidoIncorretamente =
      validacao.includes("nomeCompleto") ||
      validacao.includes("nomeUsuario") ||
      validacao.includes("email");

    if (haPreenchidoIncorretamente) {
      defineMensagemFalha("Preencha todos os campos corretamente.");
      return;
    }
    if (confirmar.trim().toLowerCase() !== "quero continuar") {
      defineMensagemFalha("Digite \"Quero continuar\" corretamente.");
      return;
    }

    try {
      setLoading(true);
      const { status } = await api.post("/users/recuperaSenha", {
        nome,
        username,
        email: emailRecuperacao,
      });
      setSucesso(true);
    } catch (error) {
      console.error(error);
      defineMensagemFalha("Algo deu errado. Tente novamente mais tarde");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center bg-paleta-fundo/60">
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
          <Botao
            variante="enviar"
            onPress={() => {
              if (emailRecuperacao) setModalAberto(true);
            }}>
            <Botao.Titulo>Continue</Botao.Titulo>
          </Botao>
        </View>
      </View>
      <Modal
        titulo="Antes de continuar..."
        subtitulo="Precisamos nos certificar de que o email inserido lhe pertence. Preencha os campos seguintes com suas informações de cadastro."
        visible={modalAberto}
        onRequestClose={() => setModalAberto(false)}>
        <View className="flex-1 justify-center items-center gap-4 py-4">
          <Campo
            ativo
            value={nome}
            onChangeText={setNome}
            icone={CampoIcones.PESSOA}
            placeholder="Nome completo"
            aoMudar={() => {}}
          />
          <Campo
            ativo
            value={username}
            autoCapitalize="none"
            onChangeText={setUsername}
            icone={CampoIcones.PESSOA}
            placeholder="Nome de usuário"
            aoMudar={() => {}}
          />
          <Text className="font-regular text-base text-paleta-secundaria">
            Uma nova senha será gerada e será enviada ao email cadastrado. Não
            esqueça de redefinir a senha após o próximo login. Para continuar,
            digite "Quero continuar" no próximo campo
          </Text>
          <Campo
            ativo
            value={confirmar}
            onChangeText={setConfirmar}
            placeholder="Quero continuar"
            aoMudar={() => {}}
          />
          {!loading ? (
            <Botao variante="enviar" onPress={confirmaEnvio}>
              <Botao.Titulo>Enviar</Botao.Titulo>
            </Botao>
          ) : (
            <Loading />
          )}
        </View>
      </Modal>
      <Modal
        titulo="Falha na requisição"
        subtitulo={mensagemFalha}
        visible={!!mensagemFalha}
        onClose={() => {
          defineMensagemFalha("");
        }}
      />
      <Modal
        titulo="Sucesso"
        subtitulo={`Confira seu email e faça login novamente`}
        visible={sucesso}
        onClose={() => {
          setSucesso(false);
          if (estaAberto) router.back();
          else router.navigate("/login");
        }}
      />
    </View>
  );
}
