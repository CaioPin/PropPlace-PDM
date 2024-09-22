import { Button } from "@rneui/base";
import { Image, Text, View } from "react-native";
import { ImageProps } from "@rneui/themed";

import usuario from "../assets/images/usuario.png"

interface UsuariosPropriedades{
    ImagemUsuario?: ImageProps,
    NomeUsuario: string,
    NivelUsuario: string,
}

//TODO: Receber caminho para pagina do usuario 

function Usuario({ImagemUsuario, NomeUsuario, NivelUsuario}: UsuariosPropriedades){
    return(
        <Button buttonStyle={estilo.botaoEstilo} type="clear">
            <View className="w-full flex-row py-2">
                {/* TODO: Colocar imagem default caso nao receba imagem */}
                <Image className="rounded-full border border-paleta-secundaria" source={ImagemUsuario} defaultSource={usuario} style={estilo.imagemEstilo} progressiveRenderingEnabled/>
                <View className="ml-3 flex-1">
                    <Text className="text-paleta-secundaria text-g pt-1 font-black">{NomeUsuario}</Text>
                    <Text className="text-paleta-secundaria text-m pt-1.5">{NivelUsuario}</Text>
                </View>
            </View>
        </Button>
    );
}

const estilo = {
    botaoEstilo: {
        paddingHorizontal: 0, paddingVertical: 0
    },
    imagemEstilo: {
        width: 58, height: 58
    }
}

export {Usuario};