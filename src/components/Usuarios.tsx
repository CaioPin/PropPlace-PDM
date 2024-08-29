import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { Button } from "@rneui/base";
import { Image, Text, View } from "react-native";
import { ImageProps } from "@rneui/themed";

import usuario from "../assets/images/usuario.png"

interface UsuariosPropriedades{
    ImagemUsuario?: ImageProps,
    NomeUsuario: string,
    NivelUsuario: string,
}

function Usuarios({ImagemUsuario, NomeUsuario, NivelUsuario}: UsuariosPropriedades){
    return(
        <Button buttonStyle={estilo.botaoEstilo} type="clear">
            <View className="w-full flex-row">
                <Image className="rounded-full border border-paleta-secundaria" source={usuario} style={estilo.imagemEstilo} progressiveRenderingEnabled/>
                <View className="ml-3 flex-1">
                    <Text className="pt-1 font-black" style={estilo.titulo}>{NomeUsuario}</Text>
                    <Text className="pt-1.5" style={estilo.subtitulo}>{NivelUsuario}</Text>
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
        paddingHorizontal: 0, paddingVertical: 0
    },
    imagemEstilo: {
        width: 58, height: 58
    }
}

export {Usuarios};