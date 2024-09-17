import { useEffect, useState } from "react";
import { View, Text, TextInput, KeyboardTypeOptions, TextInputProps, Pressable } from "react-native";
import { iconesLib } from "../assets/icons/iconesLib";
import { useVisibilidadeSenha } from "@/hooks/useVisibilidadeSenha";

enum CampoIcones {
  CADEADO = "cadeado",
  EMAIL = "email",
  LUPA = "lupa",
  PESSOA = "pessoa",
  TELEFONE = "telefone",
}

interface CampoPropriedades extends TextInputProps {
    aoMudar: (parametro:string) => void,
    titulo?: string,
    texto?: string,
    valorInicial?: string,
    ativo?: boolean,
    atualizar?: number,
    icone?: CampoIcones,
    teclado?: KeyboardTypeOptions,
    formatacao?: (parametro:string) => string
}

function semFormatacao(valor:string) {
    return valor;
}

function Campo({aoMudar, titulo, texto = "", valorInicial = "", ativo, atualizar, icone, teclado = "default", formatacao = semFormatacao, ...rest}:CampoPropriedades) {
    const {iconeOlho, mudaVisibilidadeSenha, visibilidadeSenha} = useVisibilidadeSenha()
    const campoEhSenha = icone === CampoIcones.CADEADO
    const [valor, definirValor] = useState("");
    const [valorFormatado, definirValorFormatado] = useState("");

    useEffect(() => {
        definirValor(valorInicial);
        definirValorFormatado(formatacao(valorInicial));
    }, [valorInicial, atualizar]);

    function calculaCaracteresRemovidos(formatado:string, naoFormatado:string):number {
        if (formatacao(naoFormatado).length > formatado.length) {
            return 1 + calculaCaracteresRemovidos(formatado, naoFormatado.substring(0, naoFormatado.length - 1));
        }
    
        return 0;
    }

    function mudancaDeValor(novoValor:string) {
        const novoValorFormatado = formatacao(novoValor);

        if (valorFormatado.length > novoValorFormatado.length) {
            const caracteresRemovidos = calculaCaracteresRemovidos(novoValorFormatado, valor);
            const novoValorSemFormatacao = valor.substring(0, valor.length - caracteresRemovidos);

            definirValor(novoValorSemFormatacao);
            aoMudar(novoValorSemFormatacao);
        } else if (novoValorFormatado.length > valorFormatado.length) {
            const novoValorSemFormatacao = valor + novoValor.charAt(novoValor.length - 1);

            definirValor(novoValorSemFormatacao);
            aoMudar(novoValorSemFormatacao);
        }

        definirValorFormatado(novoValorFormatado);
    }
    
    const tailwindAreaCampo = "flex flex-row justify-between items-center w-full p-3 " + (ativo ? "border border-paleta-primaria rounded-md" : "border-b border-paleta-auxiliar");
    const tailwindTexto = "flex-1 text-m " + (ativo ? "text-paleta-secundaria" : "text-paleta-auxiliar");
    
    return(
        <View className="w-full">
            { titulo && <Text className="text-paleta-secundaria text-g mb-3">{titulo}</Text> }
            
            <View className={tailwindAreaCampo}>
                <TextInput className={tailwindTexto}
                    placeholder={texto} editable={ativo} keyboardType={teclado}
                    value={valorFormatado} onChangeText={mudancaDeValor} secureTextEntry={ campoEhSenha && visibilidadeSenha } {...rest}/>

                { campoEhSenha && 
                <Pressable onPress={mudaVisibilidadeSenha}>{iconeOlho}</Pressable>}
                { icone && <View className="ml-3">{iconesLib[icone]}</View> }
            </View>
        </View>
    );
}

export { CampoIcones, Campo };
