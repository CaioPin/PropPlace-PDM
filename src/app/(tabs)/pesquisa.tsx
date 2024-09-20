import { View, ScrollView, Text } from "react-native";
import { api } from "@/api";
import { Campo, CampoIcones } from "@/components/Campo";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores } from "@/constants/cores";
import { iconesLib } from "@/assets/icons/iconesLib";
import { Button, Image } from "@rneui/base";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { useEffect, useState } from "react";
import { Usuario } from "@/components/Usuario";
import { Imovel } from "@/components/Imovel";
import { Modal } from "@/components/Modal";
import { Checkbox, CheckboxOpcoes, CheckboxTitulo } from "@/components/Checkbox";
import { Botao } from "@/components/Botao";
import { IMAGE_API_URL } from "@/api";
import usuarioPadrao from "@/assets/images/usuario.png"
import imovelPadrao from "@/assets/images/imovelPadrao.png"

export default function Pesquisa() {
  const [pressed, setPressed] = useState<number>(0);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [modalImovel, defineModalImovel] = useState(false);
  const [modalUser, defineModalUser] = useState(false);
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState<string[]>([]);


  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFyaTEyMjMiLCJpYXQiOjE3MjY3ODEwNTgsImV4cCI6MTcyNjc5OTA1OCwic3ViIjoiZjcyMDEzM2ItODc3Ny00OTdiLTkyNDctNjNiOGVhYjVkNmM4In0.MrJxAWJdOZWLu_PZmeSyPMuNPXjdnQ3UXForGGmDAjE";


  async function listaImoveis() {
    try{
    setLoading(true);
    const imoveisLista = await api.get("/imoveis");

    if (imoveisLista && imoveisLista.data) {
      setImoveis(imoveisLista.data);
    }else {
      console.error("Dados de imóveis não encontrados");
    }
    
    }
    catch(error){
      console.error("Erro ao buscar imóveis:", error);
    }
    finally {
      setLoading(false);
    }
  }

  async function listaUsuarios() {
    try{
    setLoading(true);
    const usuariosLista = await api.get("/users", {
      headers:{
        Authorization: `Bearer ${token}`
        //TODO: token de usuario
      }
    });

    if (usuariosLista && usuariosLista.data) { 
      setUsuarios(usuariosLista.data);
    }else {
      console.error('Dados de usuários não encontrados');
    }
  }
    catch(error){
      console.error('Erro ao buscar usuários:', error);
    }
    finally {
      setLoading(false);
    }
  }

  async function buscaImoveis(nome: string) {
    try{
      setLoading(true);
      const imoveisResultado = await api.get(`/imoveis/nome/${nome}`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      setImoveis(imoveisResultado.data);
    }catch(error){
        console.error('Erro ao buscar imóvel:', error);
     }
    finally {
        setLoading(false);
    }
  }

  async function buscaUsuarios(nome: string) {
    try{
      setLoading(true);
      const usuariosResultado = await api.get(`/users/${nome}`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      if (usuariosResultado.data.message == "Usuário não encontrado") {
        setUsuarios([]);
      } else {
        setUsuarios(usuariosResultado.data);
      }
    }catch(error){
        console.error('Erro ao buscar usuário:', error);

     }
    finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    listaImoveis();
}, []);

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

  const aoSelecionarOpcao = (opcao: string) => {
    setOpcoesSelecionadas((prevOpcoes) => {
      if (prevOpcoes.includes(opcao)) {
        return prevOpcoes.filter((item) => item !== opcao);
      } else {
        return [...prevOpcoes, opcao];
      }
    });
  };

  return <SafeAreaView style={{backgroundColor: cores.fundo, 
                              flexGrow: 1, padding: 4}}>
          <ScrollView>
            <View className="flex flex-row">
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
              <View>
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
                      endereco={imovel.latitude} 
                      preco={imovel.preco} 
                      disponivel={imovel.disponivel} 
                      redirecionamento={function (): void {
                      throw new Error("Function not implemented.");
                      }}/>
                    
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
                  <ScrollView>
                  
                     {usuarios.map((usuario, index) => (
                    
                      <Usuario 
                      key={index} 
                      ImagemUsuario={usuario.imagem? 
                      { uri : `${IMAGE_API_URL}${usuario.imagem.nomeImagem}`}
                      : usuarioPadrao} 
                      NomeUsuario={usuario.username} 
                      NivelUsuario={""}/>
                    ))}

                    </ScrollView>
                  )}
              </View>
            )}

      <View>
        {/* // TODO: consertar modal */}
        <Modal visible={modalUser} onClose={() => {defineModalUser(false)}}>
          <Checkbox
            opcoes={CheckboxOpcoes["Filtrar usuários:"]}
            titulo={CheckboxTitulo.filtroPessoa}
            separador={true}
            aoSelecionar={aoSelecionarOpcao}
            
          />
          <View className="flex justify-center items-center">
            <Botao variante="enviar"
            onPress={() => {defineModalUser(false)}}>
              <Botao.Titulo>Confirmar</Botao.Titulo>
            </Botao>
          </View>
        </Modal>

        <Modal visible={modalImovel} onClose={() => {defineModalImovel(false)}}>
        <Checkbox
          opcoes={CheckboxOpcoes["Filtrar imóveis:"]}
          titulo={CheckboxTitulo.filtroImovel} separador={true}
          aoSelecionar={aoSelecionarOpcao}
          />
          <Checkbox
            opcoes={CheckboxOpcoes["Filtrar imóveis por tipo:"]}
            titulo={CheckboxTitulo.tiposImovel} separador={true}
            aoSelecionar={aoSelecionarOpcao}
          />
          <View className="flex justify-center items-center">
            <Botao variante="enviar"
            onPress={() => {defineModalImovel(false)}}>
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
