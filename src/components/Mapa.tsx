import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { getCurrentPositionAsync } from "expo-location";
import {Callout as RNCallout, MapPressEvent, MapViewProps, Marker, Region, MapMarker } from "react-native-maps";
import MapView from "react-native-maps";
import { permissaoLocalizacao } from "@/utils/permissoes";

import pinImovelLivre from "@/assets/images/pinImovelLivre.png";
import pinImovelAlugado from "@/assets/images/pinImovelAlugado.png";
import pinImovelSelecionado from "@/assets/images/pinImovelSelecionado.png";
import pinToque from "@/assets/images/pinToque.png";
import { cores } from "@/constants/cores";
import { Botao } from "./Botao";
import { router } from "expo-router";

interface MapaCoordenadas {
    latitude: number,
    longitude: number
}

interface MapaPropriedades extends MapViewProps {
    centro?: MapaCoordenadas,
    marcarCentro?: boolean,
    selecionavel?: boolean,
    realizarRequisicoes?: boolean
    isFormInput?: boolean
    aoMudar?: (valor:MapaCoordenadas) => void
}
const CoordenadaContexto = createContext<MapaCoordenadas | undefined>(undefined)

function Mapa({centro, marcarCentro, selecionavel, realizarRequisicoes, aoMudar = ()=>{}, children, isFormInput, ...rest}: MapaPropriedades) {
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
                if (marcarCentro) definirMarcadorCentro(coordenadaPadrao);
                if (isFormInput) definirMarcadorToque(centro)
                return;
            }

            const permissao = await permissaoLocalizacao();
            if (!permissao) return;
            const {latitude, longitude} = await getCurrentPositionAsync({}).then(posicao => posicao.coords);
            definirCentroMapa({latitude, longitude});
            definirLocalizacao({latitude, longitude});
        })();
    }, [centro]);

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
        aoMudar(coordenadas);

        if (selecionavel) definirMarcadorToque(coordenadas);
    }

    return (
      <MapView
        style={{ width: "100%", height: "100%" }}
        region={{ ...centroMapa, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
        onRegionChangeComplete={mudancaDeRegiao}
        onPress={toqueNoMapa}
        moveOnMarkerPress
        loadingEnabled
        loadingIndicatorColor={cores.primaria}
        loadingBackgroundColor={cores.fundo}
        showsUserLocation
        {...rest}>
        {realizarRequisicoes && construirMarcadorImovel()}
        {marcarCentro && construirMarcadorCentro()}
        {selecionavel && construirMarcadorToque()}

        <CoordenadaContexto.Provider value={marcadorToque}>
          {children}
        </CoordenadaContexto.Provider>
      </MapView>
    );
}

function AdicionaImovel() {
  const coordenadas = useContext<MapaCoordenadas | undefined>(
    CoordenadaContexto
  );
  if (!coordenadas) return;
  const { latitude, longitude } = coordenadas;
  const markerRef = useRef<MapMarker>(null);
  
  return (
    <Marker coordinate={coordenadas} image={pinToque} ref={markerRef}>
      <RNCallout
        tooltip
        onPress={() => {
          router.push({
            pathname: "/formularioImovel",
            params: { latitude, longitude },
          });
          markerRef.current?.hideCallout();
        }}>
        <View className="flex-1 items-center justify-center bg-paleta-fundo content-normal max-w-100 pb-2 mb-2 rounded-xl border-2 gap-2 border-paleta-secundaria/60">
          <Text className="m-2 font-semibold text-lg text-paleta-secundaria">
            Criar imóvel aqui?
          </Text>
          <Botao variante="enviar">
            <Botao.Titulo>✔️</Botao.Titulo>
          </Botao>
        </View>
      </RNCallout>
    </Marker>
  );
}

Mapa.AdicionaImovel = AdicionaImovel;

export { Mapa };
