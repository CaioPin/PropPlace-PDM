import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";

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
                <Text className="color-paleta-secundaria font-black" style={estilo.nome} numberOfLines={1}>
                    {nome}
                </Text>

                <Text className="color-paleta-secundaria" style={estilo.endereco} numberOfLines={1}>
                    {endereco}
                </Text>

                <Text className="color-paleta-secundaria font-medium" style={estilo.preco} numberOfLines={1}>
                    R$ {preco.toFixed(2).toString().replace(".", ",")}
                </Text>

                <View className="flex flex-row justify-between items-center">
                    <View className="flex flex-row items-center gap-x-1">
                        <View className={tailwindIndicadorDisponibilidade} />

                        <Text className="color-paleta-secundaria font-medium" style={estilo.disponibilidade}>
                            {disponivel ? "Disponível" : "Indisponível"}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={redirecionamento}>
                        <Text className="color-paleta-auxiliar underline decoration-paleta-auxiliar" style={estilo.redirecionamento}>
                            Mais detalhes
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const estilo = {
    nome: ConstrutorEstiloConstante.construtor().fonteG().construir(),
    endereco: ConstrutorEstiloConstante.construtor().fonteG().construir(),
    preco: ConstrutorEstiloConstante.construtor().fonteM().construir(),
    disponibilidade: ConstrutorEstiloConstante.construtor().fonteP().construir(),
    redirecionamento: ConstrutorEstiloConstante.construtor().fonteP().construir(),
}

export { Imovel };
