import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import mime from "mime";
import { useFormulario } from "@/hooks/useFormulario";
import { Carrossel, CarrosselItem, CarrosselTamanho, CarrosselVisualizacao } from "@/components/Carrosel";
import { Campo } from "@/components/Campo";
import { Mapa } from "@/components/Mapa";
import { Botao } from "@/components/Botao";
import { cores } from "@/constants/cores";
import { Loading } from "@/components/Loading";
import { formataMoedaString } from "@/utils/formatacoes";
import { ListaSuspensa } from "@/components/ListaSuspensa";
import { Modal } from "@/components/Modal";
import { validacoesImovel } from "@/utils/validacoes";
import { constroiImovel } from "@/utils/constroiModelo";
import { api, IMAGE_API_URL } from "@/api";

interface Coordenadas {
    latitude: number,
    longitude: number
}

interface Objeto {
    [key: string]: string
}

export default function FormularioImovel() {
    const { id: identificadorImovel } = useLocalSearchParams();
    const [imovel, definirImovel] = useFormulario({});
    const [imagens, definirImagens] = useState<CarrosselItem[]>([]);
    const [coordenadas, definirCoordenadas] = useState<Coordenadas>();
    const [carregando, definirCarregando] = useState(false);
    const [preco, definirPreco] = useState("");
    const [mensagemErro, definirMensagemErro] = useState("");
    const [atualizar, definirAtualizar] = useState(0);

    const campos:Objeto = {
        imagens: "Fotos do imóvel",
        nome: "Nome",
        tipo: "Tipo",
        descricao: "Descricao",
        numInquilinos: "Número máximo de pessoas",
        preco: "Preço",
        disponivel: "Disponibilidade",
        latitude: "Localização no mapa",
        longitude: ""
    };

    useEffect(() => {
        (async () => {
            if (identificadorImovel) {
                definirCarregando(true);
    
                const imovelMapeado = await constroiImovel({identificador: identificadorImovel as string});
    
                definirImovel(imovelMapeado);
                definirImagens(imovelMapeado.imagens);
                definirCoordenadas({
                    latitude: imovelMapeado.latitude,
                    longitude: imovelMapeado.longitude
                });
                definirPreco(imovelMapeado.preco.toString());
                definirCarregando(false);
            } else {
                resetarInformacoes();
            }
        })();
    }, [identificadorImovel]);

    function resetarInformacoes() {
        definirImovel({nome: "", tipo: "", descricao: "", numInquilinos: "", preco: "", disponivel: true});
        definirImagens([]);
        definirCoordenadas(undefined);
        definirPreco("");
        definirAtualizar(atualizar + 1);
    }

    async function atualizarImagens(id?:string) {
        const url = `/${id || imovel.id}/imagens`;
        const novasImagens = imagens.filter(imagem => imagem.caminho?.includes("file:///"));

        const dadosImagens = new FormData();
        novasImagens.forEach(imagem => {
            const caminho = imagem.caminho;

            if (!caminho) return;

            dadosImagens.append("images", {
                uri: caminho,
                type: mime.getType(caminho),
                name: `imagemImovel_${imovel.nome}.${mime.getType(caminho)?.split("/")[1]}`
            } as any);
        });

        const caminhosImagens = imagens.map(imagem => imagem.caminho);
        const imagensParaDeletar = imovel.imagens.filter((imagem:any) => !caminhosImagens.includes(imagem.caminho));

        imagensParaDeletar.forEach(async (imagem:Objeto) => {
            await api.delete(url,
                {data: {nomeImagem: imagem.caminho.split(IMAGE_API_URL)[1]}});
        });

        const config = {     
            headers: { 'content-type': 'multipart/form-data' }
        }

        if (novasImagens.length > 0) await api.post(url, dadosImagens, config);
    }

    async function acaoBotaoSalvar() {
        const preco = parseFloat(imovel.preco.toString().replace(",", "."));
        const numInquilinos = parseInt(imovel.numInquilinos);

        const imovelCompleto = {...imovel, ...coordenadas, imagens, preco, numInquilinos};
        const camposIncorretos = validacoesImovel(imovelCompleto).map(campo => `"${campos[campo]}"`).join(", ");

        let idImovel = "";

        if (camposIncorretos.length > 0) {
            definirMensagemErro(`O(s) campo(s) ${camposIncorretos} apresenta(m) informacoes incorretas. Por favor, reveja-as para poder prosseguir.`);
            return;
        }

        const dadosImovel = {
            nome: imovel.nome,
            tipo: imovel.tipo,
            descricao: imovel.descricao,
            disponivel: imovel.disponivel,
            preco: preco,
            numInquilinos: numInquilinos,
            latitude: coordenadas?.latitude,
            longitude: coordenadas?.longitude
        };

        try {
            if (!imovel.id) {
                const retornoApi = await api.post("/imoveis", dadosImovel).then(retorno => retorno.data);
                idImovel = retornoApi.imovel.id;
            } else {
                await api.put(`/imoveis/${imovel.id}`, dadosImovel);
                idImovel = "";
            }
        } catch (erro) {
            console.log(erro);
            definirMensagemErro(`Houve um erro ao salvar as informações do imóvel.`);
            return;
        }

        try {
            await atualizarImagens(idImovel);
        } catch (erro) {
            console.log(erro);
            definirMensagemErro(`Houve um erro ao salvar as imagens do imóvel.`);
            return;
        }

        if (!identificadorImovel) resetarInformacoes();
        router.back();
    }

    const itensListaTipo = [
        {nome: "Apartamento", valor: "Apartamento"},
        {nome: "Casa", valor: "Casa"},
        {nome: "Estúdio", valor: "Estúdio"},
        {nome: "Kitnet", valor: "Kitnet"},
        {nome: "República", valor: "República"}
    ];
    const itensListaDisponibilidade = [
        {nome: "Disponível", valor: true},
        {nome: "Alugado", valor: false}
    ];

    return ( carregando ?
        <Loading /> :
        <SafeAreaView style={{backgroundColor: cores.fundo, flexGrow: 1}}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View className="flex gap-y-8 px-8 pb-8">
                    <Carrossel itens={imagens} tamanho={CarrosselTamanho.PEQUENO} visualizacao={CarrosselVisualizacao.TELA_TODA}
                        aoMudar={definirImagens} editavel multilinhas />

                    <View className="flex gap-y-8">
                        <Campo titulo={campos.nome} texto="Apartamento no Edifício XPTO" valorInicial={imovel.nome}
                            onChangeText={(nome) => definirImovel({nome})} aoMudar={() => {}} ativo />

                        <ListaSuspensa titulo={campos.tipo} itens={itensListaTipo} valorInicial={imovel.tipo}
                            aoMudar={(tipo) => definirImovel({tipo: tipo.valor})} />

                        <Campo titulo={campos.descricao} texto="50m²: 1 sala, 1 suíte, 1 cozinha" valorInicial={imovel.descricao}
                            onChangeText={(descricao) => definirImovel({descricao})} aoMudar={() => {}} ativo />

                        <Campo titulo={campos.numInquilinos} texto="0" valorInicial={imovel.numInquilinos?.toString()} teclado="numeric"
                            onChangeText={(numInquilinos) => definirImovel({numInquilinos})} aoMudar={() => {}} ativo />
                        
                        <Campo titulo={campos.preco} texto="R$ 0,00" valorInicial={preco} formatacao={formataMoedaString}
                            aoMudar={(preco) => definirImovel({preco})} atualizar={atualizar} teclado="numeric" ativo />

                        <ListaSuspensa titulo={campos.disponivel} itens={itensListaDisponibilidade} valorInicial={imovel.disponivel}
                            aoMudar={(disponivel) => definirImovel({disponivel: disponivel.valor})} />
                    </View>

                    <View className="h-64">
                        <Mapa centro={coordenadas} selecionavel marcarCentro={!!coordenadas} aoMudar={definirCoordenadas} isFormInput/>
                    </View>
                    
                    <View className="flex flex-row justify-center gap-8 w-full">
                        <Botao variante="cancelar" onPress={() => router.back()}>
                            <Botao.Titulo>Cancelar</Botao.Titulo>
                        </Botao>
                        <Botao variante="enviar" onPress={acaoBotaoSalvar}>
                            <Botao.Titulo>Salvar</Botao.Titulo>
                        </Botao>
                    </View>

                    <Modal titulo={mensagemErro} visible={!!mensagemErro} onClose={() => definirMensagemErro("")} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
