import { View, ScrollView, Text, ImageSourcePropType } from "react-native";
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

export default function Pesquisa() {
  const [pressed, setPressed] = useState<number | null>(0);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inquilinos, setInquilinos] = useState<any[]>([]);
  const [imagens, setImagens] = useState<{ [key: string]: ImageSourcePropType }>({});
  const [imagem, setImagem] = useState<{[key: string]: ImageSourcePropType}>({});
  const [texto, setTexto] = useState("");
  const [modal, defineModal] = useState(false);

  const BASE_URL_IMAGENS = `http://192.168.0.194:3000/images/`;

  const handleChangeText = (novoTexto: string) => {
    setTexto(novoTexto);
  };


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

  async function listaImagens(id: string) {
    try{
      setLoading(true);
      const imagensLista = await api.get(`/${id}/imagens`,{
        headers:{
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFyaTEyMjMiLCJpYXQiOjE3MjY1MDc1NTEsImV4cCI6MTcyNjUyNTU1MSwic3ViIjoiOTQxYTA3YjItMmQwYi00MjczLWFkZWItMzJiNmIzODI2ZTZmIn0.w4JN33qHCWu_fdpFct0MgRMiJ2-X-E5k2qvlUsRVHTk"}`
        },
      });

      if (imagensLista && imagensLista.data) {
        setImagem(imagensLista.data.imagens[0]);
      }else {
        console.error("Imagens de imóvel não encontradas");
      }

      return imagem;

    }
    catch(error){
      console.error("Erro ao buscar imagens:", error);
    }
    finally{
      setLoading(false);
    }
    
  }

  async function listaInquilinos() {
    try{
    setLoading(true);
    const inquilinosLista = await api.get("/users", {
      headers:{
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFyaTEyMjMiLCJpYXQiOjE3MjY1MDc1NTEsImV4cCI6MTcyNjUyNTU1MSwic3ViIjoiOTQxYTA3YjItMmQwYi00MjczLWFkZWItMzJiNmIzODI2ZTZmIn0.w4JN33qHCWu_fdpFct0MgRMiJ2-X-E5k2qvlUsRVHTk"}`
        //TODO: token de usuario
      }
    });

    if (inquilinosLista && inquilinosLista.data) {
      const inquilinosAchados = inquilinosLista.data.flat(); 
      setInquilinos(inquilinosAchados);
    }else {
      console.error('Dados de inquilinos não encontrados');
    }
  }
    catch(error){
      console.error('Erro ao buscar inquilinos:', error);
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
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFyaTEyMjMiLCJpYXQiOjE3MjY1MDc1NTEsImV4cCI6MTcyNjUyNTU1MSwic3ViIjoiOTQxYTA3YjItMmQwYi00MjczLWFkZWItMzJiNmIzODI2ZTZmIn0.w4JN33qHCWu_fdpFct0MgRMiJ2-X-E5k2qvlUsRVHTk"}`
        }
      })
      console.log(imoveisResultado)
      setImoveis(imoveisResultado.data);
    }catch(error){
        console.error('Erro ao buscar imóvel:', error);
     }
    finally {
        setLoading(false);
    }
  }

  async function buscaInquilinos(nome: string) {
    try{
      setLoading(true);
      const inquilinosResultado = await api.get(`/users/${nome}`, {
        headers:{
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFyaTEyMjMiLCJpYXQiOjE3MjY1MDc1NTEsImV4cCI6MTcyNjUyNTU1MSwic3ViIjoiOTQxYTA3YjItMmQwYi00MjczLWFkZWItMzJiNmIzODI2ZTZmIn0.w4JN33qHCWu_fdpFct0MgRMiJ2-X-E5k2qvlUsRVHTk"}`
        }
      })
      console.log(inquilinosResultado)
      setInquilinos(inquilinosResultado.data);
    }catch(error){
        console.error('Erro ao buscar inquilino:', error);
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
      listaInquilinos(); 
    }
  }, [pressed]);

  useEffect(() => {
    if (pressed === 0) {
      listaImoveis(); 
    }
  }, [pressed]);

  useEffect(() => {
    if (texto) {
      if (pressed === 0) {
        buscaImoveis(texto);
      } else if (pressed === 1) {
        buscaInquilinos(texto);
      }
    }
  }, [texto, pressed]);

  useEffect(() => {
    if (imoveis.length > 0) {
      imoveis.forEach(async (imovel) => {
        const imagem = await listaImagens(imovel.id); 
        if (imagem) {
          setImagens((prevImagens) => ({
            ...prevImagens,
            [imovel.id]: { uri: `${BASE_URL_IMAGENS}${imagem.nomeImagem}` },
          }));
        }
      });
    }
  }, [imoveis]);

  const buttonStyle = (buttonId: number) => ({
    flexGrow: 1,
    borderBottomWidth: pressed === buttonId ? 2 : 0, 
    borderColor: cores.secundaria,
  });

  const titleStyle = (buttonId: number) => (
    pressed === buttonId ? estilo.textoComPeso : estilo.texto
  );

  return <SafeAreaView style={{backgroundColor: cores.fundo, 
                              flexGrow: 1, padding: 4}}>

            <View className="flex flex-row">
              <View className="grow">
                <Campo
                ativo
                icone={CampoIcones.LUPA} 
                placeholder="Pesquisar" 
                titulo={texto}
                aoMudar={() => {}}
                //TODO colocar pesquisa para funcionar
                />
              </View>

              <Button buttonStyle={{width: 50}}
              icon={iconesLib.filtro}
              type="clear"
              titleStyle={estilo.texto}
              onPress={() => {defineModal(true)}}
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
              title="Inquilinos"
              titleStyle={titleStyle(1)}
              onPress={()=> setPressed(1)}
              /> 

            </View>

            {pressed === 0 ? (
        <View>
          {loading ? (
            <Text style={estilo.texto}>Carregando imóveis...</Text>
          ) : (
            <ScrollView>

              {imoveis.map((imovel, index) => (
    
                <Imovel key={index} 
                imagem={{uri: `${BASE_URL_IMAGENS}${imagem.nomeImagem}`}} 
                nome={imovel.nome} 
                endereco={imovel.latitude} 
                preco={imovel.preco} 
                disponivel={imovel.disponivel} 
                redirecionamento={function (): void {
                throw new Error("Function not implemented.");
                }}></Imovel>
              ))}
              
            </ScrollView>
          )}
        </View>
      ) : (
        <View>
          {loading ? (
            <Text style={estilo.texto}>Carregando inquilinos...</Text>
          ) : (
            <ScrollView>

               {inquilinos.map((inquilino, index) => (
                <Usuario key={index} 
                NomeUsuario={inquilino.nome} 
                NivelUsuario={""}></Usuario>
              ))}

            </ScrollView>
          )}
        </View>
      )}

      <View className="h-max">
        {/* // TODO: consertar modal */}
        <Modal visible={modal} onClose={() => {defineModal(false)}}>
          <Checkbox
            opcoes={CheckboxOpcoes["Filtrar usuários:"]}
            titulo={CheckboxTitulo.filtroPessoa} separador={true}
          />
           <Checkbox
            opcoes={CheckboxOpcoes["Filtrar imóveis por tipo:"]}
            titulo={CheckboxTitulo.tiposImovel} separador={true}
          />
          <Checkbox 
          opcoes={CheckboxOpcoes["Filtrar imóveis:"]}
          titulo={CheckboxTitulo.filtroImovel} separador={true}/>
          <View className="flex justify-center items-center">
            <Botao variante="enviar"
            onPress={() => {defineModal(false)}}>
              <Botao.Titulo>Confirmar</Botao.Titulo>
            </Botao>
          </View>
        </Modal>
        </View>


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
