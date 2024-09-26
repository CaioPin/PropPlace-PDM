import { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Carrossel, CarrosselTamanho } from "@/components/Carrosel";
import { Mapa } from "@/components/Mapa";
import { Loading } from "@/components/Loading";
import { ModeloImovelHome, ModeloProprietarioHome } from "@/models/modelosHome";
import { cores } from "@/constants/cores";
import { DadosContext } from "@/context/dadosContext";
import { IMAGE_API_URL } from "@/api";

import usuarioPadrao from "@/assets/images/usuario.png";
import imovelPadrao from "@/assets/images/imovelPadrao.png";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function Home() {
    const { userId } = useAuthContext();
    const [usuario, defineUsuario] = useState<any>();
    const [imoveis, definirImoveis] = useState<ModeloImovelHome[]>();
    const {todosImoveis, carregandoImoveis, carregandoUsuarios, todosUsuarios } = useContext(DadosContext);
    const [proprietarios, definirProprietarios] = useState<ModeloProprietarioHome[]>();
    const [carregando, definirCarregando] = useState(false);

    function defineImoveis(){
        definirCarregando(carregandoImoveis);

            // TODO: adicionar requisição à API

            const modelosImoveis = todosImoveis?.map((imovel) => (
                new ModeloImovelHome({ uri: imovel.imagens[0]? 
                    `${IMAGE_API_URL}${imovel.imagens[0].nomeImagem}`
                     : imovelPadrao}, imovel.nome, imovel.endereco, () => 
                    router.navigate({pathname: "../imovel", 
                        params: {id: imovel.id}}))
            ));
            
            if (modelosImoveis?.length > 0) definirImoveis(modelosImoveis);
    }

    // async function defineProprietarios(){
    //     const modelosProprietarios = todosUsuarios.map((proprietario => (
    //             new ModeloProprietarioHome(proprietario.id, 
    //                 {uri: proprietario.imagem? 
    //                     proprietario.imagem : usuarioPadrao}, proprietario.nome)
    //         )));            
    //         definirProprietarios(modelosProprietarios);
    // }

    useEffect(() => {
        console.log(todosImoveis)
        if (!carregandoImoveis && !carregandoUsuarios) {
            defineImoveis();
            definirCarregando(carregandoImoveis);
        }
    }, [carregandoImoveis, carregandoUsuarios]);

    function renderizarProprietario(proprietario:ModeloProprietarioHome) {
        const tamanho = {height: 80, width: 80};
        const textoAlternativo = `Foto de ${proprietario.nomeCompleto}`;

        return (
            <TouchableOpacity className="flex gap-y-3"
                onPress={() => router.navigate({pathname: "/perfil", params: {id: proprietario.id}})}>

                <Image className="border border-paleta-secundaria rounded-full" style={tamanho}
                    source={proprietario.imagem || usuarioPadrao} alt={textoAlternativo}
                    progressiveRenderingEnabled />

                <Text className="fonte-m text-paleta-secundaria text-center" numberOfLines={2}>{proprietario.nomeCompleto}</Text>
            </TouchableOpacity>
        );
    }

    const tailwindTexto = "font-semibold text-g text-paleta-secundaria";
    const tailwindSecao = "flex gap-y-3";

    return ( carregando ?
        <Loading /> :
        <SafeAreaView style={{backgroundColor: cores.fundo, flexGrow: 1}}>
            <ScrollView>
                <View className="flex justify-center gap-y-8 px-8">
                    <Text className="font-extrabold text-xg text-paleta-secundaria text-center">Bem-vinda(o), !</Text>

                    { imoveis &&
                        <View className={tailwindSecao}>
                            <Text className={tailwindTexto}>Seus imóveis</Text>
                            <Carrossel itens={imoveis} tamanho={CarrosselTamanho.GRANDE} mostrarTexto />
                        </View>
                    }

                    <View className={tailwindSecao}>
                        <Text className={tailwindTexto}>Principais proprietários</Text>
                        <FlatList data={proprietarios} keyExtractor={(proprietario) => proprietario.id}
                            renderItem={(proprietario) => renderizarProprietario(proprietario.item)}
                            ItemSeparatorComponent={() => <View className="h-full w-8"></View>}
                            horizontal showsHorizontalScrollIndicator={false} />
                    </View>

                    <View className={tailwindSecao}>
                        <Text className={tailwindTexto}>Próximo a você</Text>
                        <View className="h-64">
                            <Mapa realizarRequisicoes />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
  }