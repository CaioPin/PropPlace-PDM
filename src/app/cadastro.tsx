import React, { useState } from "react";
import { View, Text } from "react-native";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { Campo, CampoIcones } from "@/components/Campo";
import { Botao } from "@/components/Botao";
import { Link } from "expo-router";
import { Modal } from "@/components/Modal";

const estilo = {
  registrese: ConstrutorEstiloConstante.construtor()
    .fonteGG()
    .corSecundaria()
    .construir(),
};

const Cadastro = () => {
  //campos
  const [nome, definirNome] = useState("");
  const [telefone, definirTelefone] = useState("");
  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [senhaRepete, definirSenhaRepete] = useState("");
  const [falhaModalAberto, defineFalhaModalAberto] = useState(false);

  const realizaCadastro = async () => {
    // todo
    console.log({ nome, telefone, email, senha, senhaRepete });
    // se der errado
    defineFalhaModalAberto(true);
  };

  return (
    <>
      <View className="flex-1 justify-center p-4 gap-4">
        <Text className="py-4 font-semibold" style={estilo.registrese}>
          Registre-se
        </Text>
        <View className="flex gap-6 items-center">
          <Campo
            ativo
            value={nome}
            onChangeText={definirNome}
            icone={CampoIcones.PESSOA}
            placeholder="Nome"
          />
          <Campo
            ativo
            value={telefone}
            onChangeText={definirTelefone}
            icone={CampoIcones.TELEFONE}
            placeholder="Telefone"
          />
          <Campo
            ativo
            value={email}
            onChangeText={definirEmail}
            icone={CampoIcones.EMAIL}
            placeholder="E-mail"
          />
          <Campo
            ativo
            secureTextEntry
            value={senha}
            onChangeText={definirSenha}
            icone={CampoIcones.CADEADO}
            placeholder="Senha forte"
          />
          <Campo
            ativo
            secureTextEntry
            value={senhaRepete}
            onChangeText={definirSenhaRepete}
            icone={CampoIcones.CADEADO}
            placeholder="Repita a senha"
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
      </View>
      <Modal
        titulo="Falha no registro"
        subtitulo="Preencha os campos corretamente"
        visible={falhaModalAberto}
        onClose={() => {
          defineFalhaModalAberto(false);
        }}></Modal>
    </>
  );
};

export default Cadastro;
