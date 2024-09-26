import { iconesLib } from "@/assets/icons/iconesLib";
import { Carrossel, CarrosselTamanho, CarrosselVisualizacao, CarrosselItem } from "@/components/Carrosel";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { Button } from "@rneui/base";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DadosContext } from "@/context/dadosContext";
import { useContext, useEffect, useState } from "react";
import { cores } from "@/constants/cores";
import { Mapa } from "@/components/Mapa";
import { router, useLocalSearchParams } from "expo-router";
import { IMAGE_API_URL } from "@/api";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Botao } from "@/components/Botao";
import { Modal } from "@/components/Modal";
import { formataMoeda } from "@/utils/formatacoes";

export default function informacaoImovel(){
    const { id } = useLocalSearchParams(); 
    const { userId } = useAuthContext();
    const {todosImoveis, carregandoImoveis, excluirImovel} = useContext(DadosContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [imovel, setImovel] = useState<any>();
    const [imagens, defineImagens] = useState<CarrosselItem[]>([]);
    const [modal, setModal] = useState(false);
    const [sucessoModal, setSucessoModal] = useState(false);
    const [falhaModal, setFalhaModal] = useState(false);

    function defineImovel(){
        setLoading(carregandoImoveis);
        setImovel(todosImoveis.find((imovel) => imovel.id === id));
    }

    function excluiImovel(id: string){
        excluirImovel(id);
        setImovel(todosImoveis.find((imovel) => imovel.id === id));
        if(imovel){
            setFalhaModal(true);
        }else {
            setSucessoModal(true);
        }
    }

    function listaImagem(){
        if (imovel) {
            const novasImagens = imovel.imagens.map((imagem: { nomeImagem: string; }) => ({
                caminho: `${IMAGE_API_URL}${imagem.nomeImagem}`,
            }));
            defineImagens(novasImagens);
        }
    }

    useEffect(() => {
        defineImovel();
    }, [carregandoImoveis, id]);

    useEffect(() => {
        listaImagem();
    }, [imovel]);

    return <SafeAreaView style={{backgroundColor: cores.fundo, 
                                flexGrow: 1, padding: 4}}>
        <ScrollView>
            <View className="pt-4">
                <Button icon={iconesLib.setaVoltar}
                buttonStyle={{width: 60}}
                type="clear"
                titleStyle={estilo.texto}
                onPress={() => router.back()}
                />
            </View>
            <View className="flex flex-column">
                {loading? (
                    <Text className="justify-center self-center align-center" style={estilo.texto}>Procurando imóvel.</Text>
                ) : imovel? (
                    <View className="px-4 pt-2 flex-1">
                        <Text style={estilo.textoComPeso1}>{imovel.nome}</Text>
                        <Text className="pb-4 pt-2" style={estilo.texto}>{imovel.endereco}</Text>
                        <Carrossel itens={imagens}
                        tamanho={CarrosselTamanho.MEDIO}
                        visualizacao={CarrosselVisualizacao.EXPANDIDA}
                        ></Carrossel>
                        <Text style={estilo.textoComPeso2}>{formataMoeda(imovel.preco)}</Text>
                        <Text className="pt-4 pb-2" style={estilo.texto}>{imovel.descricao}</Text>
                        <Text style={estilo.textoComPeso1}>Max. pessoas: {imovel.numInquilinos}</Text>
                       
                                {imovel.endereco? (
                                <View className="h-64 py-4" style={{ position: 'relative' }}>                                        
                                <Mapa centro={{latitude: imovel.latitude, longitude: imovel.longitude}} marcarCentro/>
                                    <View style={{
                                        position: 'absolute',
                                        bottom: 15,
                                        right: 5,
                                        alignItems: 'center'
                                    }}>  
                                        <TouchableOpacity onPress={() => router.navigate({pathname: "../mapa"})}>
                                            <Text style={[estilo.texto, { textDecorationLine: 'underline' }]}>Ver no mapa</Text>
                                        </TouchableOpacity>                      
                                    </View> 
                                </View>
                                ) : (
                                    <View className="flex-1 items-center justify-center my-20">
                                      <Text style={estilo.texto}>Não foi possível localizar o imóvel no mapa.</Text>
                                    </View>                                
                                )}
                                
                        {imovel.userId === userId ? (
                            <View className="flex flex-row justify-evenly pb-4">
                                <Botao variante="generico" onPress={() => router.navigate({pathname: "../formularioImovel", params: {id: imovel.id}})}>
                                    <Botao.Titulo>Editar</Botao.Titulo>
                                </Botao>
                                <Botao variante="cancelar" onPress={() => setModal(true)}>
                                    <Botao.Titulo>Deletar</Botao.Titulo>
                                </Botao>
                            </View>
                        ) : (
                            <View className="flex flex-row justify-center pb-4">
                                <Botao variante={imovel.disponivel === true?
                                                "enviar" 
                                                : "inativo"} 
                                     onPress={() => router.navigate({pathname: "./formularioAluguel", 
                                     params: {id: imovel.id}})}>
                                    <Botao.Titulo>Alugar</Botao.Titulo>
                                </Botao>
                            </View>
                        )}
                    </View>
                ) : (
                <Text className="justify-center self-center" style={estilo.texto}>Não foi possível encontrar o imóvel.</Text>
                )}
                
                <Modal visible={modal}
                onClose={() => setModal(false)}
                titulo="Deseja deletar o imóvel?">
                    <View className="flex flex-row justify-evenly pt-4">
                        <Botao variante="enviar" 
                         onPress={() => {{excluiImovel(imovel.id)
                            setModal(false);
                         }}} 
                         style={{width: 80}}>
                            <Botao.Titulo>Sim</Botao.Titulo>
                        </Botao>
                        <Botao variante="cancelar"
                         onPress={() => setModal(false)} 
                         style={{width: 80}}>
                            <Botao.Titulo>Não</Botao.Titulo>
                        </Botao>
                    </View>
                </Modal>

                <Modal visible={sucessoModal}
                onClose={() => {setSucessoModal(false)
                    router.back();
                }}
                titulo="Imóvel deletado com sucesso!"/>

                <Modal visible={falhaModal}
                onClose={() => setFalhaModal(false)}
                titulo="Não foi possível deletar o imóvel"></Modal>
            
            </View>
        </ScrollView>
    </SafeAreaView>
}

const estilo = {
    texto: ConstrutorEstiloConstante.construtor()
    .corSecundaria()
    .fonteGG()
    .peso3()
    .construir(),
    textoComPeso1: ConstrutorEstiloConstante.construtor()
    .corSecundaria()
    .fonteXG()
    .peso9()
    .construir(),
    textoComPeso2: ConstrutorEstiloConstante.construtor()
    .corSecundaria()
    .fonteXXXG()
    .peso9()
    .construir(),
}