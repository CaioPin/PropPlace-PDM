import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GEOCODING_TOKEN } from "@env";
import { cores } from "@/constants/cores";
import { Campo, CampoIcones } from "@/components/Campo";
import { Mapa } from "@/components/Mapa";
import { Modal } from "@/components/Modal";

let atraso = setTimeout(() => {}, 1);

interface Coordenadas {
    latitude: number,
    longitude: number
}

export default function TelaMapa() {
    const [coordenadas, definirCoordenadas] = useState<Coordenadas>();
    const [mensagemErro, definirMensagemErro] = useState("Carai2");
    
    async function buscar(textoBusca:string) {
        if (!textoBusca) return;

        const geocodingApiUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
        const url = `${geocodingApiUrl}${textoBusca}.json?access_token=${GEOCODING_TOKEN}`;
        console.log(url);
        
        try {
            // TOOD: substituir fetch por axios
            const resposta = await fetch(url).then(resposta => resposta.json());
            const coordenadasBusca = resposta?.features[0]?.center;
            definirCoordenadas({latitude: coordenadasBusca[1], longitude: coordenadasBusca[0]});
        } catch (erro) {
            definirMensagemErro(`Erro ao buscar por "${textoBusca}". Por favor, tente novamente em instantes...`);
        }
    }

    function aoMudar(textoBusca:string) {
        clearTimeout(atraso);
        atraso = setTimeout(() => buscar(textoBusca), 1000);
    }

    return (
        <SafeAreaView style={{ backgroundColor: cores.fundo, flexGrow: 1 }}>
            <View className="flex gap-y-8 relative h-full px-8 pb-8 overflow-hidden">
                <Campo texto="Pesquisar..." icone={CampoIcones.LUPA} valorInicial={""} aoMudar={aoMudar} ativo />

                <Mapa centro={coordenadas} realizarRequisicoes />
                <View className="absolute left-8 bottom-0 bg-paleta-fundo w-full h-8"></View>

                <Modal titulo={mensagemErro} visible={!!mensagemErro} onClose={() => definirMensagemErro("")} />
            </View>
        </SafeAreaView>
    );
}
