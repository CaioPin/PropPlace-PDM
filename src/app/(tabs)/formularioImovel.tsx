import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
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

import imovelPadrao from "@/assets/images/imovelPadrao.png";
import logo from "@/assets/images/logo.png";
import usuario from "@/assets/images/usuario.png";

interface Coordenadas {
    latitude: number,
    longitude: number
}

interface Objeto {
    [key: string]: string
}

export default function FormularioImovel() {
    const { id, longitude, latitude } = useLocalSearchParams();
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
        capacidade: "Número máximo de pessoas",
        preco: "Preço",
        alugado: "Disponibilidade",
        endereco: "Endereço",
        coordenadas: "Localização no mapa"
    };

    useEffect(() => {
        (async () => {
            if (id) {
                definirCarregando(true);
    
                // TODO: adicionar requisicao para buscar imóvel do ID
                const mock = {
                    imagens: [imovelPadrao, logo, usuario, logo],
                    nome: "Mansão em Copacabana",
                    tipo: "Casa",
                    descricao: "600m²: tudo e um pouco mais",
                    capacidade: 40,
                    preco: 35800,
                    alugado: false,
                    endereco: "Rio de Janeiro - RJ",
                    coordenadas: [-22.968687544875245, -43.18173037127648]
                };
    
                definirImovel(mock);
                definirImagens(mock.imagens.map(imagem => ({imagem})));
                definirCoordenadas({latitude: mock.coordenadas[0], longitude: mock.coordenadas[1]});
                definirPreco(mock.preco.toString());
                definirCarregando(false);
            } else {
                resetarInformacoes();
            }
        })();
    }, [id]);

    useEffect(() => {
      (async () => {
        if (latitude && longitude) {
          definirCoordenadas({
            longitude: Number(longitude as string),
            latitude: Number(latitude as string),
          });
        }
      })();
    }, [latitude, longitude]);

    function resetarInformacoes() {
        definirImovel({nome: "", tipo: "", descricao: "", capacidade: "", preco: "", alugado: false, endereco: ""});
        definirImagens([]);
        definirCoordenadas(undefined);
        definirPreco("");
        definirAtualizar(atualizar + 1);
    }

    async function acaoBotaoSalvar() {
        const imovelCompleto = {...imovel, imagens, coordenadas};
        const camposIncorretos = validacoesImovel(imovelCompleto).map(campo => `"${campos[campo]}"`).join(", ");

        if (camposIncorretos.length > 0) {
            definirMensagemErro(`O(s) campo(s) ${camposIncorretos} apresenta(m) informacoes incorretas. Por favor, reveja-as para poder prosseguir.`);
            return;
        }

        const dados = new FormData();
        Object.keys(imovel).forEach(key => {
            dados.append(key, imovel[key].toString());
        });
        dados.append("preco", imovel.preco.toString().replace(",", "."));
        // TODO: ajustar alocação de imagens
        dados.append("imagens", JSON.stringify(imagens.map(imagem => {
            if (imagem.caminho) {
                const partesUri = imagem.caminho.split(".");
                return {
                    uri: imagem.caminho,
                    name: `imagemImovel_${imovel.nome}`,
                    type: `image/${partesUri[partesUri.length - 1]}`
                };
            }
            
            return imagem;
        })));
        dados.append("coordenadas", JSON.stringify([coordenadas?.longitude, coordenadas?.latitude]));

        // TODO: adicionar chamad à API
        console.log(dados);
        if (!id) resetarInformacoes();
        router.back();
    }

    const itensListaTipo = [
        {nome: "Apartamento", valor: "Apartamento"},
        {nome: "Casa", valor: "Casa"},
        {nome: "Estúdio", valor: "Estúdio"},
        {nome: "República", valor: "República"}
    ];
    const itensListaDisponibilidade = [
        {nome: "Disponível", valor: false},
        {nome: "Alugado", valor: true}
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
                            aoMudar={(nome) => definirImovel({nome})} ativo />

                        <ListaSuspensa titulo={campos.tipo} itens={itensListaTipo} valorInicial={imovel.tipo}
                            aoMudar={(tipo) => definirImovel({tipo: tipo.valor})} />

                        <Campo titulo={campos.descricao} texto="50m²: 1 sala, 1 suíte, 1 cozinha" valorInicial={imovel.descricao}
                            aoMudar={(descricao) => definirImovel({descricao})} ativo />

                        <Campo titulo={campos.capacidade} texto="0" valorInicial={imovel.capacidade?.toString()}
                            aoMudar={(capacidade) => definirImovel({capacidade})} teclado="numeric" ativo />
                        

{/*                         TODO: Mudar campo para adicionar vírgula automaticamente no valor */}
                        
                        <Campo titulo={campos.preco} texto="R$ 0,00" valorInicial={preco} formatacao={formataMoedaString}
                            aoMudar={(preco) => definirImovel({preco})} atualizar={atualizar} teclado="numeric" ativo />

                        <ListaSuspensa titulo={campos.alugado} itens={itensListaDisponibilidade} valorInicial={imovel.alugado || false}
                            aoMudar={(alugado) => definirImovel({alugado: alugado.valor})} />

                        <Campo titulo={campos.endereco} texto="Cidade - UF" valorInicial={imovel.endereco}
                            aoMudar={(endereco) => definirImovel({endereco})} ativo />
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
