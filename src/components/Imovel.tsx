import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import { formataMoeda } from "@/utils/formatacoes";

interface ImovelPropriedades {
    imagem: ImageSourcePropType,
    nome: string,
    endereco: string,
    preco: number,
    disponivel: boolean
    redirecionamento: () => void
}

function Imovel({imagem, nome, endereco, preco, disponivel, redirecionamento}:ImovelPropriedades) {
    const tamanho = 110;
    const tailwindIndicadorDisponibilidade = "rounded-full w-3 h-3 " + (disponivel ? "bg-paleta-construtiva" : "bg-paleta-destrutiva");
    
    return (
        <View className="flex flex-row gap-x-3">
            <Image source={imagem} alt={nome} className="rounded-md"
                resizeMode="contain" style={{width: tamanho, height: tamanho}}
                progressiveRenderingEnabled/>

            <View className="flex flex-1 justify-between">
                <Text className="text-paleta-secundaria text-g font-black" numberOfLines={1}>
                    {nome}
                </Text>

                <Text className="text-paleta-secundaria text-g" numberOfLines={1}>
                    {endereco}
                </Text>

                <Text className="text-paleta-secundaria text-m font-medium" numberOfLines={1}>
                    {formataMoeda(preco)}
                </Text>

                <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row items-center gap-x-1">
                        <View className={tailwindIndicadorDisponibilidade} />

                        <Text className="text-paleta-secundaria text-p font-medium">
                            {disponivel ? "Disponível" : "Indisponível"}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={redirecionamento}>
                        <Text className="text-paleta-auxiliar text-p underline decoration-paleta-auxiliar">
                            Mais detalhes
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export { Imovel };
