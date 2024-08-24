import { useEffect, useState } from "react";
import {MapPressEvent, Marker, Region} from "react-native-maps";
import { getCurrentPositionAsync } from "expo-location";
import { StyledMapView } from "../utils/elementosEstilizaveis";
import { permissaoLocalizacao } from "../utils/permissoes";

import pinImovelLivre from "../assets/images/pinImovelLivre.png";
import pinImovelAlugado from "../assets/images/pinImovelAlugado.png";
import pinImovelSelecionado from "../assets/images/pinImovelSelecionado.png";
import pinToque from "../assets/images/pinToque.png";

interface MapaCoordenadas {
    latitude: number,
    longitude: number
}

interface MapaPropriedades {
    centro?: MapaCoordenadas,
    marcarCentro?: boolean,
    selecionavel?: boolean,
    realizarRequisicoes?: boolean
}

function Mapa({centro, marcarCentro, selecionavel, realizarRequisicoes}:MapaPropriedades) {
    const coordenadaPadrao = {latitude: -22.970228680657357, longitude: -43.18134420587482};
    const imovelPadrao = {nome: "", coordenadas: {latitude: 0, longitude: 0}, alugado: false, pagina: ""};

    const [centroMapa, definirCentroMapa] = useState(coordenadaPadrao);
    const [localizacao, definirLocalizacao] = useState(coordenadaPadrao);
    const [marcadorToque, definirMarcadorToque] = useState(coordenadaPadrao);
    const [marcadorCentro, definirMarcadorCentro] = useState(coordenadaPadrao);
    const [imoveis, definirImoveis] = useState([imovelPadrao]);

    useEffect(() => {
        (async () => {
            if (centro) {
                definirCentroMapa(centro);
                definirLocalizacao(centro);
                if (marcarCentro) definirMarcadorCentro(centro);

                return;
            }

            const permissao = await permissaoLocalizacao();
            if (!permissao) return;
        
            const {latitude, longitude} = await getCurrentPositionAsync({}).then(posicao => posicao.coords);
            definirCentroMapa({latitude, longitude});
            definirLocalizacao({latitude, longitude});
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!realizarRequisicoes) return;

            // TODO: adicionar requisição ao back-end
            const mock = [
                {nome: "Imóvel livre", coordenadas: {latitude: -22.870228680657354, longitude: -43.08134420587480}, alugado: false, pagina: ""},
                {nome: "Imóvel alugado", coordenadas: {latitude: -22.970228680657354, longitude: -43.18134420587480}, alugado: true, pagina: ""}
            ];
            definirImoveis(mock);
        })();
    }, [localizacao]);

    function construirMarcadorImovel() {
        return (<>
            { imoveis.map((imovel, indice) => {
                const pinImovel = imovel.alugado ? pinImovelAlugado : pinImovelLivre;

                // TODO: adicionar redirecionamento ao selecionar o marcador
                return <Marker coordinate={imovel.coordenadas} image={pinImovel} title={imovel.nome}
                    onSelect={() => {}} key={indice} />;
            }) }
        </>);
    }

    function construirMarcadorCentro() {
        return <Marker coordinate={marcadorCentro} image={pinImovelSelecionado} />;
    }

    function construirMarcadorToque() {
        return <Marker coordinate={marcadorToque} image={pinToque} />;
    }

    function mudancaDeRegiao(regiao:Region) {
        definirLocalizacao({latitude: regiao.latitude, longitude: regiao.longitude});
    }

    function toqueNoMapa(evento:MapPressEvent) {
        const coordenadas = evento.nativeEvent.coordinate;
        definirCentroMapa(coordenadas);
        definirLocalizacao(coordenadas);

        if (selecionavel) definirMarcadorToque(coordenadas);
    }

    const tailwindMapa = "w-full h-full";

    return (
        <StyledMapView className={tailwindMapa} region={{...centroMapa, latitudeDelta: 0.02, longitudeDelta: 0.02}}
            onRegionChangeComplete={mudancaDeRegiao} onPress={toqueNoMapa} moveOnMarkerPress={false}>
            
            { realizarRequisicoes && construirMarcadorImovel() }
            { marcarCentro && construirMarcadorCentro() }
            { selecionavel && construirMarcadorToque() }
        </StyledMapView>
    );
}

export { Mapa };
