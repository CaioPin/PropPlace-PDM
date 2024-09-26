import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores } from "@/constants/cores";
import { Campo, CampoIcones } from "@/components/Campo";
import { Mapa } from "@/components/Mapa";
import { Modal } from "@/components/Modal";
import axios from "axios";

let atraso = setTimeout(() => {}, 1);

interface GeocodeResponse {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
  status: string;
}
export default function TelaMapa() {
  const [coordenadas, definirCoordenadas] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [mensagemErro, definirMensagemErro] = useState("");
  const [textoBusca, definirTextoBusca] = useState("");

  async function buscar(textoBusca: string) {
    if (!textoBusca) return;

    const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?language=pt-BR&key=${process.env.EXPO_PUBLIC_MAPS_API_KEY}&address=`;

    try {
      const resposta = await axios.get<GeocodeResponse>(
        geocodingApiUrl + textoBusca
      );
      const coordsResposta = resposta.data.results[0]?.geometry.location;
      const { lat: latitude, lng: longitude } = coordsResposta;
      definirCoordenadas({ latitude, longitude });
    } catch (erro) {
      definirMensagemErro(
        `Erro ao buscar por "${textoBusca}". Por favor, tente novamente em instantes...`
      );
    }
  }

  function aoMudar(textoBusca: string) {
    clearTimeout(atraso);
    atraso = setTimeout(() => buscar(textoBusca), 1000);
  }

  useEffect(() => {
    aoMudar(textoBusca);
  }, [textoBusca]);

  return (
    <SafeAreaView style={{ backgroundColor: cores.fundo, flexGrow: 1 }}>
      <View className="flex gap-y-8 relative h-full px-8 pb-8 overflow-hidden">
        <Campo
          ativo
          value={textoBusca}
          onChangeText={definirTextoBusca}
          icone={CampoIcones.LUPA}
          placeholder="Pesquisar..."
          aoMudar={() => {}}
        />

        <Mapa
          centro={coordenadas}
          selecionavel
          realizarRequisicoes
        >
          <Mapa.AdicionaImovel/>
        </Mapa>
        <View className="absolute left-8 bottom-0 bg-paleta-fundo w-full h-8"></View>

        <Modal
          titulo={mensagemErro}
          visible={!!mensagemErro}
          onClose={() => definirMensagemErro("")}
        />
      </View>
    </SafeAreaView>
  );
}
