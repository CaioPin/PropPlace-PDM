import { useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Carrossel, CarrosselTamanho } from "@/components/Carrosel";
import { Mapa } from "@/components/Mapa";
import { Loading } from "@/components/Loading";
import { ModeloImovelHome, ModeloProprietarioHome } from "@/models/modelosHome";
import { cores } from "@/constants/cores";

import usuarioPadrao from "@/assets/images/usuario.png";
import imovelPadrao from "@/assets/images/imovelPadrao.png";

export default function Home() {
    const [nome, definirNome] = useState("");
    const [imoveis, definirImoveis] = useState<ModeloImovelHome[]>();
    const [proprietarios, definirProprietarios] = useState<ModeloProprietarioHome[]>();
    const [carregando, definirCarregando] = useState(false);

    useEffect(() => {
        (async () => {
            definirCarregando(true);

            // TODO: adicionar requisição à API
            const mock = {
                nome: "Bruno Mars",
                imoveis: [
                    { id: "1", imagem: imovelPadrao, nome: "Mansão 1", endereco: "Rio de Janeiro - RJ" },
                    { id: "2", imagem: imovelPadrao, nome: "Mansão 2", endereco: "Rio de Janeiro - RJ" },
                    { id: "3", imagem: imovelPadrao, nome: "Mansão 3", endereco: "Rio de Janeiro - RJ" },
                    { id: "4", imagem: imovelPadrao, nome: "Mansão 4", endereco: "Rio de Janeiro - RJ" }
                ],
                proprietarios: [
                    { id: "1", imagem: usuarioPadrao, nomeCompleto: "Pessoa 1" },
                    { id: "2", imagem: usuarioPadrao, nomeCompleto: "Pessoa 2" },
                    { id: "3", imagem: usuarioPadrao, nomeCompleto: "Pessoa 3" },
                    { id: "4", imagem: usuarioPadrao, nomeCompleto: "Pessoa 4" }
                ]
            };

            const modelosImoveis = mock.imoveis?.map((imovel) => (
                new ModeloImovelHome(imovel.imagem, imovel.nome, imovel.endereco, () => router.navigate({pathname: "/", params: {id: imovel.id}}))
            ));
            const modelosProprietarios = mock.proprietarios.map((proprietario => (
                new ModeloProprietarioHome(proprietario.id, proprietario.imagem, proprietario.nomeCompleto)
            )));

            definirNome(mock.nome.split(" ")[0]);
            if (modelosImoveis?.length > 0) definirImoveis(modelosImoveis);
            definirProprietarios(modelosProprietarios);

            definirCarregando(false);
        })();
    }, []);

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
                    <Text className="font-extrabold text-xg text-paleta-secundaria text-center">Bem-vinda(o), {nome}!</Text>

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