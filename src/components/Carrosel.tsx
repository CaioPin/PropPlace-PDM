import { useEffect, useState } from "react";
import { Image, ImageSourcePropType, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { iconesLib } from "../assets/icons/iconesLib";
import { permissaoGaleria } from "../utils/permissoes";

import imovelPadrao from "../assets/images/imovelPadrao.png";

interface CarrosselItem {
    imagem?: ImageSourcePropType,
    caminho?: string,
    titulo?: string,
    subtitulo?: string,
    redirecionamento?: () => void
}

enum CarrosselTamanho {
    PEQUENO = 50,
    MEDIO = 85,
    GRANDE = 100
}

enum CarrosselVisualizacao {
    TELA_TODA,
    EXPANDIDA,
    OCULTA
}

interface CarrosselPropriedades {
    itens: CarrosselItem[],
    tamanho: CarrosselTamanho,
    visualizacao?: CarrosselVisualizacao,
    multilinhas?: boolean,
    editavel?: boolean,
    mostrarTexto?: boolean,
    aoMudar?: (itens:CarrosselItem[]) => void
}

function Carrossel({itens, tamanho, visualizacao = CarrosselVisualizacao.OCULTA, multilinhas, editavel, mostrarTexto, aoMudar}:CarrosselPropriedades) {
    const [itemFocado, definirItemFocado] = useState<CarrosselItem>();

    useEffect(() => {
        if (visualizacao === CarrosselVisualizacao.EXPANDIDA && itens.length > 0) {
            definirItemFocado(itens[0]);
        } else {
            definirItemFocado(undefined);
        }
    }, [itens, visualizacao]);

    function visualizacaoTelaToda() {
        const imagens = itens.map(renderizavel => ({url: renderizavel.caminho || "", props: {source: renderizavel.imagem}}));
        const indice = itens.indexOf(itemFocado || {});
        
        return (
            <Modal visible transparent>
                <TouchableWithoutFeedback onPress={() => definirItemFocado(undefined)}>
                    <ImageViewer imageUrls={imagens} index={indice} />
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

    function visualizacaoExpandida() {
        const textoAlternativo = itemFocado?.titulo || "Imagem do imóvel";
        const tailwindView = "h-64 flex justify-center items-center";
        const tailwindImagem = "max-h-64 max-w-full mb-3";

        return (
            <View className={tailwindView} style={{height: 268}}>
                <Image source={itemFocado?.imagem} alt={textoAlternativo} className={tailwindImagem}
                    resizeMode="contain" defaultSource={imovelPadrao} progressiveRenderingEnabled  />
            </View>
        );
    }

    function focarItem() {
        if (!itemFocado) return <></>;

        if (visualizacao === CarrosselVisualizacao.TELA_TODA) return visualizacaoTelaToda();
        if (visualizacao === CarrosselVisualizacao.EXPANDIDA) return visualizacaoExpandida();

        return <></>;
    }

    async function adicionarImagem() {
        const permissao = await permissaoGaleria();
        if (!permissao) {
            alert("Você precisa permitir o acesso à galeria para adicionar fotos do imóvel.");
            return;
        }

        const limiteDeImagens = 6;
        const limiteDeSelecao = limiteDeImagens - itens.length;
        if (limiteDeSelecao < 1) return;

        const imagens = await launchImageLibraryAsync({mediaTypes: MediaTypeOptions.Images, allowsMultipleSelection: true, selectionLimit: limiteDeSelecao});
        if (!imagens.assets) return;

        const novasImagens = imagens.assets.map(imagem => ({caminho: imagem.uri}));
        if (aoMudar) aoMudar([...itens, ...novasImagens]);
    }

    function adicaoDeImagem() {
        return (
            <View className="flex justify-center items-center rounded-md w-24 h-24 mr-5 bg-paleta-primaria" onTouchStart={adicionarImagem}>
                {iconesLib.adicionarFoto}
            </View>
        );
    }

    function removerItem(item:CarrosselItem) {
        if (aoMudar) aoMudar(itens.filter((itemRenderizavel) => itemRenderizavel !== item));
    }

    function renderizarItem(item:CarrosselItem, indice:number) {
        const textoAlternativo = item.titulo || "Imagem do imóvel";
        const tailwindContainer = "relative " + (tamanho === CarrosselTamanho.GRANDE ? "mr-8" : "mr-3 mb-3");
        
        return (
            <View className={tailwindContainer} style={{width: tamanho}} key={indice}>
                { editavel &&
                    <View className="flex justify-center items-center absolute top-0 right-0 rounded-full w-5 h-5 z-10 bg-paleta-destrutiva" onTouchStart={() => removerItem(item)}>
                        {iconesLib.lixeira}
                    </View> }
                    
                <TouchableOpacity onPress={item.redirecionamento || (() => definirItemFocado(item))}>
                    <Image source={item.imagem || imovelPadrao} src={item.caminho}
                        alt={textoAlternativo} className="rounded-md"
                        resizeMode="contain" style={{width: tamanho, height: tamanho}}
                        progressiveRenderingEnabled />

                    { mostrarTexto && item.titulo &&
                        <Text className="text-paleta-secundaria text-m mt-3" numberOfLines={2}>{item.titulo}</Text> }
                    { mostrarTexto && item.subtitulo &&
                        <Text className="text-paleta-secundaria text-pp mt-2" numberOfLines={1}>{item.subtitulo}</Text> }
                </TouchableOpacity>
            </View>
        );
    }

    const tailwindView = "w-full flex " + (editavel ? "flex-row" : "items-center");
    const tailwindCarrossel = (multilinhas ? "flex flex-row flex-wrap " : "") + (editavel ? "flex-1" : "");
    const Elemento = multilinhas ? View : ScrollView;

    return (
        <View className={tailwindView}>
            { focarItem() }
            { editavel && adicaoDeImagem() }

            <Elemento className={tailwindCarrossel} horizontal showsHorizontalScrollIndicator={false}>
                { itens.map((item, indice) => renderizarItem(item, indice)) }
            </Elemento>
        </View>
    );
}

export { CarrosselTamanho, CarrosselVisualizacao, CarrosselItem, Carrossel };
