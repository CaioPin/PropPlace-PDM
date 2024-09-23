import { iconesLib } from "@/assets/icons/iconesLib";
import { Carrossel, CarrosselTamanho, CarrosselVisualizacao, CarrosselItem } from "@/components/Carrosel";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { Button } from "@rneui/base";
import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DadosContext } from "@/context/dadosContext";
import { useContext, useEffect, useState } from "react";
import { cores } from "@/constants/cores";
import { ImovelDTO } from "@/models/Imovel";
import { Mapa } from "@/components/Mapa";

export default function informacaoImovel(id: string){
    const {todosImoveis, carregandoImoveis} = useContext(DadosContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [imovel, setImovel] = useState<any>();

    function defineImovel(){
        setLoading(carregandoImoveis);
        setImovel(todosImoveis.find((imovel: ImovelDTO) => imovel.id === id))
    }

    useEffect(() => {
        defineImovel();
    }, [carregandoImoveis]);

    return <SafeAreaView style={{backgroundColor: cores.fundo, 
                                flexGrow: 1, padding: 4}}>
        <ScrollView>
            <View className="pt-4">
                <Button icon={iconesLib.setaVoltar}
                buttonStyle={{width: 60}}
                type="clear"
                titleStyle={estilo.texto}
                />
            </View>
            <View className="flex flex-column">
                {loading? (
                    <Text className="justify-center self-center" style={estilo.texto}>Procurando imóvel.</Text>
                ) : imovel? (
                    <View>
                        <Text style={estilo.textoComPeso}>{imovel.nome}</Text>
                        <Text style={estilo.texto}>{imovel.endereco}</Text>
                        <Carrossel itens={[]}
                        tamanho={CarrosselTamanho.GRANDE}
                        visualizacao={CarrosselVisualizacao.EXPANDIDA}
                        ></Carrossel>
                        <Text style={estilo.textoComPeso}>{imovel.preco}</Text>
                        <Text style={estilo.texto}>{imovel.descricao}</Text>
                        <Text style={estilo.texto}>Max. pessoas: {imovel.numInquilinos}</Text>
                        <Mapa realizarRequisicoes />
                    </View>
                    // TODO: Botoes
                // TODO: Se imovel for do user, botao diferente
                ) : (
                <Text className="justify-center self-center" style={estilo.texto}>Não foi possível encontrar o imóvel.</Text>
                )}
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