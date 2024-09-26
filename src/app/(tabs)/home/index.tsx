import { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Carrossel, CarrosselTamanho } from "@/components/Carrosel";
import { Mapa } from "@/components/Mapa";
import { Loading } from "@/components/Loading";
import { ModeloImovelHome, ModeloProprietarioHome } from "@/models/modelosHome";
import { cores } from "@/constants/cores";
import { useAuthContext } from "@/hooks/useAuthContext";
import { constroiPerfilUsuario } from "@/utils/constroiModelo";
import { api, IMAGE_API_URL } from "@/api";

import usuarioPadrao from "@/assets/images/usuario.png";

export default function Home() {
    const { userId } = useAuthContext();
    const [usuario, defineUsuario] = useState<any>();
    const [imoveis, definirImoveis] = useState<ModeloImovelHome[]>();
    const {todosImoveis, carregandoImoveis, carregandoUsuarios, todosUsuarios } = useContext(DadosContext);
    const [proprietarios, definirProprietarios] = useState<ModeloProprietarioHome[]>();
    const [carregando, definirCarregando] = useState(false);
    const { userId } = useAuthContext();

    function defineImoveis(){
        definirCarregando(carregandoImoveis);

            const perfil = await constroiPerfilUsuario({userId: userId as string});
            definirNome(perfil.nomeCompleto);
            if (perfil.imoveis?.length > 0) definirImoveis(perfil.imoveis);

            const usuarios = await api.get("/users")
                .then(({data}) => data
                    .map((usuario:any) => new ModeloProprietarioHome(usuario.id, usuario.imagem, usuario.nome)));
            definirProprietarios(usuarios);

    useEffect(() => {
        console.log(todosImoveis)
        if (!carregandoImoveis && !carregandoUsuarios) {
            defineImoveis();
            definirCarregando(carregandoImoveis);
        }
    }, [carregandoImoveis, carregandoUsuarios]);

    function renderizarProprietario(proprietario:ModeloProprietarioHome) {
        const tailwind = "border border-paleta-secundaria rounded-full";
        const tamanho = {height: 80, width: 80};
        const textoAlternativo = `Foto de ${proprietario.nomeCompleto}`;

        return (
            <TouchableOpacity className="flex gap-y-3"
                onPress={() => router.navigate({pathname: "/perfil", params: {id: proprietario.id}})}>

                { proprietario.imagem ? 
                    <Image className={tailwind} style={tamanho} alt={textoAlternativo}
                        src={IMAGE_API_URL + proprietario.imagem.nomeImagem} progressiveRenderingEnabled /> :
                    <Image className={tailwind} style={tamanho} alt={textoAlternativo}
                        source={usuarioPadrao}  progressiveRenderingEnabled />
                }

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
                        <Text className={tailwindTexto}>Principais usuários</Text>
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