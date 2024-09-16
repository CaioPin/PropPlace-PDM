import { View, ScrollView, Text } from "react-native";
import { api } from "@/api";
import { Campo, CampoIcones } from "@/components/Campo";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores } from "@/constants/cores";
import { iconesLib } from "@/assets/icons/iconesLib";
import { Button } from "@rneui/base";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { useEffect, useState } from "react";
import { Usuario } from "@/components/Usuario";
import { Imovel } from "@/components/Imovel";

export default function Pesquisa() {
  const [pressed, setPressed] = useState<number | null>(0);
  const [imoveis, setImoveis] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inquilinos, setInquilinos] = useState<any[]>([]);


  async function listaImoveis() {
    try{
    setLoading(true);
    const imoveisLista = await api.get("/imoveis");

    if (imoveisLista && imoveisLista.data) {
      setImoveis(imoveisLista.data); 
    }else {
      console.error('Dados de imóveis não encontrados');
    }
    
    }
    catch(error){
      console.error('Erro ao buscar imóveis:', error);
    }
    finally {
      setLoading(false);
    }
  }

  async function listaInquilinos() {
    try{
    setLoading(true);
    const inquilinosLista = await api.get("/users", {
      headers:{
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFyaTEyMjMiLCJpYXQiOjE3MjY0NDc3NzksImV4cCI6MTcyNjQ2NTc3OSwic3ViIjoiOTQxYTA3YjItMmQwYi00MjczLWFkZWItMzJiNmIzODI2ZTZmIn0.bc02WI1KaWRqJDbP7lI398LkLviczlLQQjCG_WO0bto"}`
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
                aoMudar={() => {}}
                />
              </View>

              <Button buttonStyle={{width: 50}}
              icon={iconesLib.filtro}
              type="clear"
              titleStyle={estilo.texto}
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
                imagem={0} 
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
