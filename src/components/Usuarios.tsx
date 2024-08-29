import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { Button } from "@rneui/base";
import { Image, Text, View } from "react-native";
import { cores } from "@/constants/cores";

import imovelPadrao from "../assets/images/imovelPadrao.png"

function Usuarios(){
    return(
        <Button buttonStyle={estilo.botaoEstilo} type="clear">
            <View className="w-full flex-row">
                <Image className="rounded-full" style={estilo.imagemEstilo} source={imovelPadrao}/>
                    <View className="ml-3 flex-1">
                        <Text className="pt-1 font-black" style={estilo.titulo}>Nome Usuário</Text>
                        <Text className="pt-1.5" style={estilo.subtitulo}>Proprietário/Inquilino</Text>
                    </View>
            </View>
        </Button>
    );
}

const estilo = {
    corBackgroung: ConstrutorEstiloConstante.construtor().fundoPadrao().construir(),
    titulo: ConstrutorEstiloConstante.construtor().fonteG().corSecundaria().construir(),
    subtitulo: ConstrutorEstiloConstante.construtor().fonteM().corSecundaria().construir(),
    botaoEstilo: {
        margin: 5, paddingHorizontal: 0, paddingVertical: 0, height: 60
    },
    imagemEstilo: {
        width: 58, height: 58, borderWidth: 1, borderColor: cores.secundaria,
    }
}

export {Usuarios};