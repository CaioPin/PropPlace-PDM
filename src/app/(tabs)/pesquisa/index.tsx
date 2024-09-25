import { View, ScrollView, Text } from "react-native";
import { Campo, CampoIcones } from "@/components/Campo";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores } from "@/constants/cores";
import { iconesLib } from "@/assets/icons/iconesLib";
import { Button } from "@rneui/base";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { useContext, useEffect, useState } from "react";
import { Usuario } from "@/components/Usuario";
import { Imovel } from "@/components/Imovel";
import { Modal } from "@/components/Modal";
import { Checkbox, CheckboxOpcoes, CheckboxTitulo } from "@/components/Checkbox";
import { Botao } from "@/components/Botao";
import { IMAGE_API_URL } from "@/api";
import { UsuarioDTO } from "@/models/Usuario";
import usuarioPadrao from "@/assets/images/usuario.png"
import imovelPadrao from "@/assets/images/imovelPadrao.png"
import { DadosContext } from "@/context/dadosContext";
import { router } from "expo-router";

export default function Pesquisa() {
  const valorPadraoUser = "Inquilino";
  const valorPadraoImovel = "Apartamento";

  const [pressed, setPressed] = useState<number>(0);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);

  const [pesquisa, setPesquisa] = useState("");
  const [modalImovel, defineModalImovel] = useState(false);
  const [modalUser, defineModalUser] = useState(false);
  const [opcaoUser, setOpcaoUser] = useState<string>(valorPadraoUser);
  const [opcaoImovel, setOpcaoImovel] = useState<string>(valorPadraoImovel);
  const {todosImoveis, todosUsuarios, carregandoImoveis, carregandoUsuarios} = useContext(DadosContext)

  function listaImoveis() {
    setLoading(carregandoImoveis);
    setImoveis(todosImoveis);
    setLoading(carregandoImoveis);
  }

  async function listaUsuarios() {
    setLoading(carregandoUsuarios);
    setUsuarios(todosUsuarios);
    setLoading(carregandoUsuarios);
  }

  async function buscaImoveis(nome: string) {
      const imoveisResultado = todosImoveis.filter(({ nome: nomeImovel }) =>
        nomeImovel.toLowerCase().includes(nome.toLowerCase())
      );
      setImoveis(imoveisResultado);
  }

  async function buscaUsuarios(nome: string) {
    const usuariosResultado = todosUsuarios.filter(({ username: nomeUsuario }) =>
      nomeUsuario.toLowerCase().includes(nome.toLowerCase())
    );
    setUsuarios(usuariosResultado);
  }

  async function buscaImoveisTipo (tipo: string) {
    try{
      setLoading(true);
      if(tipo === "República"){
        tipo = "republica";
      }else if(tipo === "Estúdio"){
        tipo = "estudio";
      }else{
        tipo = tipo.toLowerCase();
      }
      if(tipo === "todos"){
        listaImoveis();
        return
      }
      const imoveisTipoResultado = todosImoveis.filter(({tipo: tipoImovel}) => tipo === tipoImovel)
      setImoveis(imoveisTipoResultado);
    }catch(error){
      console.error("Erro ao buscar imóveis por tipo: ", error);
    }
    finally{
      setLoading(false);
    }
  }

  async function buscaUserTipo(tipo: string) {
    try{
      setLoading(true);
      const usuariosLista = todosUsuarios
      const usuariosList: any[] = []; 
      if (usuariosLista) {
        if(tipo === "Todos"){
          setUsuarios(usuariosLista);
          return;
        }
        usuariosLista.map((usuario: UsuarioDTO) => {
          if(tipo === "Inquilino"){
            if(usuario.imoveis.length === 0){
              usuariosList.push(usuario);
            }
          }else if(tipo === "Proprietário"){
            if(usuario.imoveis.length > 0){
              usuariosList.push(usuario)
            }
          }
        })
        setUsuarios(usuariosList);
      }else {
        console.error('Dados de usuários não encontrados');
      }
    }catch(error){
      console.error("Não foi possível filtrar usuários por tipo: ", error);
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    listaImoveis();
}, [carregandoImoveis]);

  useEffect(() => {
    if (pressed === 1) {
      listaUsuarios(); 
    }
  }, [pressed]);

  useEffect(() => {
    if (pressed === 0) {
      listaImoveis();
    }
  }, [pressed]);

  useEffect(() => {
    if (pesquisa.length > 0) {
      if (pressed === 0) {
        buscaImoveis(pesquisa);
      } else {
        buscaUsuarios(pesquisa);
      }
    } else {
      if (pressed === 0) {
        listaImoveis();
      } else {
        listaUsuarios();
      }
    }
  }, [pesquisa, pressed]);

  const buttonStyle = (buttonId: number) => ({
    flexGrow: 1,
    borderBottomWidth: pressed === buttonId ? 2 : 0, 
    borderColor: cores.secundaria,
  });

  const titleStyle = (buttonId: number) => (
    pressed === buttonId ? estilo.textoComPeso : estilo.texto
  );

  const handleOpenModal = () => {
    if (pressed === 0) {
      defineModalImovel(true);
    } else {
      defineModalUser(true);
    }
  };

  const confirmarSelecao = () => {
    if(pressed === 0){
      buscaImoveisTipo(opcaoImovel);
      setOpcaoImovel(valorPadraoImovel);
      defineModalImovel(false);
    }else{
      buscaUserTipo(opcaoUser);
      setOpcaoUser(valorPadraoUser);
      defineModalUser(false);
    }
  };

  function aoSelecionarOpcao(opcao: string){
    if(pressed === 0){
      if (opcaoImovel === opcao) {
        return opcaoImovel;
      } else {
        setOpcaoImovel(opcao)
        return opcaoImovel;
      }
    }else{
      if (opcaoUser === opcao) {
        return opcaoUser;
      } else {
        setOpcaoUser(opcao)
        return opcaoUser;
      }
    }
  };

  return <SafeAreaView style={{backgroundColor: cores.fundo, 
                              flexGrow: 1, padding: 4}}>
          <ScrollView>
            <View className="flex flex-row px-2">
              <View className="grow">
                <Campo
                ativo
                icone={CampoIcones.LUPA} 
                placeholder="Pesquisar" 
                value={pesquisa}
                onChangeText={(text) => setPesquisa(text)}
                aoMudar={(text) => setPesquisa(text)}
                />
              </View>

              <Button buttonStyle={{width: 50}}
              icon={iconesLib.filtro}
              type="clear"
              titleStyle={estilo.texto}
              onPress={handleOpenModal}
              />
            </View>

            <View className="flex flex-row w-full justify-center px-2 py-4">

              <Button buttonStyle={buttonStyle(0)}
              type="clear"
              title="Imóveis"
              titleStyle={titleStyle(0)}
              onPress={()=> setPressed(0)}
              />

              <Button buttonStyle={buttonStyle(1)}
              type="clear"
              title="Usuários"
              titleStyle={titleStyle(1)}
              onPress={()=> setPressed(1)}
              /> 

            </View>

            {pressed === 0 ? (
              <View className="px-2">
                {loading ? (
                  <Text style={estilo.texto}>Carregando imóveis...</Text>
                ) : imoveis.length === 0? (
                      <Text style={estilo.texto}>Não há imóveis no momento.</Text>
                ) : ( 
                  <ScrollView>

                    {imoveis.map((imovel, index) => (
                    
                      <Imovel key={index} 
                      imagem={imovel.imagens[0] ? 
                      {uri: `${IMAGE_API_URL}${imovel.imagens[0]?.nomeImagem}`}
                      : imovelPadrao}
                      nome={imovel.nome} 
                      endereco={imovel.endereco}
                      preco={imovel.preco} 
                      disponivel={imovel.disponivel} 
                      redirecionamento={() => router.navigate({pathname: "../imovel", 
                        params: {id: imovel.id}})}/>
                    
                    ))}

                  </ScrollView>
                )}
              </View>
            ) : (

              <View>
                {loading ? (
                  <Text style={estilo.texto}>Carregando usuários...</Text>
                ) : usuarios.length === 0 ? (
                  <Text style={estilo.texto}>Não há usuários no momento.</Text>
                ) :  (
                  <ScrollView scrollEnabled>
                  
                     {usuarios.map((usuario) => (
                    
                      <Usuario 
                        key={usuario.id} 
                        ImagemUsuario={usuario.imagem? 
                        { uri : `${IMAGE_API_URL}${usuario.imagem.nomeImagem}`}
                        : usuarioPadrao} 
                        NomeUsuario={usuario.nome} 
                        NivelUsuario={usuario.username}
                        onPress={() => 
                          router.push({
                            pathname: "/perfil",
                            params: { id: usuario.id }
                          })
                        }
                        />
                    ))}

                    </ScrollView>
                  )}
              </View>
            )}

      <View>
        <Modal visible={modalUser} onClose={() => {defineModalUser(false)}}>
          <Checkbox
            opcoes={CheckboxOpcoes["Filtrar usuários:"]}
            titulo={CheckboxTitulo.filtroPessoa}
            separador={true}
            aoSelecionar={aoSelecionarOpcao} 
          />
          <View className="flex justify-center items-center">
            <Botao variante="enviar"
            onPress={confirmarSelecao}>
              <Botao.Titulo>Confirmar</Botao.Titulo>
            </Botao>
          </View>
        </Modal>

        <Modal visible={modalImovel} onClose={() => {defineModalImovel(false)}}>
        <Checkbox
          opcoes={CheckboxOpcoes["Filtrar imóveis por tipo:"]}
          titulo={CheckboxTitulo.tiposImovel} 
          separador={true}
          aoSelecionar={aoSelecionarOpcao}
          />
          {/* TODO: Filtro por disponibilidade? */}
          <View className="flex justify-center items-center">
            <Botao variante="enviar"
            onPress={confirmarSelecao}>
              <Botao.Titulo>Confirmar</Botao.Titulo>
            </Botao>
          </View>
        </Modal>

        </View>
      </ScrollView> 

    </SafeAreaView>
}

const estilo = {
    texto: ConstrutorEstiloConstante.construtor()
    .corSecundaria()
    .fonteG()
    .peso6()
    .construir(),
    textoComPeso: ConstrutorEstiloConstante.construtor()
    .corSecundaria()
    .fonteG()
    .peso7()
    .construir(),
}
