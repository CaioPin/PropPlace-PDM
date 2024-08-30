import { iconesLib } from "@/assets/icons/iconesLib"
import { CheckBox } from "@rneui/base"
import { View } from "react-native"
import { cores } from "@/constants/cores";
import { useState } from "react";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";

enum CheckboxPossiveis{
    tiposImovel = "tiposImovel",
    filtroPessoa = "filtroPessoa",
    tempoContrato = "tempoContrato",
    filtroImovel = "filtroImovel",
}

const CheckboxOpcoes: { [key in CheckboxPossiveis]: string[] } = {
    [CheckboxPossiveis.tiposImovel]: ["Apartamento", "Casa", "Kitnet", "República"],
    [CheckboxPossiveis.filtroPessoa]: ["Inquilino", "Proprietário"],
    [CheckboxPossiveis.tempoContrato]: ["1 ano", "Personalizado"],
    [CheckboxPossiveis.filtroImovel]: ["Livre", "Alugado"]
};

interface CheckboxPropriedades{
    opcoes: string[],
    separador: boolean
}

function Checkbox({opcoes, separador}: CheckboxPropriedades){
    const [check, setCheck] = useState<number | null>(0);
    const quantidade = opcoes.length;

        return(
            <View>
                {opcoes.map((opcaoNome, index) => (
                    <CheckBox
                    containerStyle={index === quantidade -1 || 
                        !separador? estilo.containerSemLinha : estilo.containerComLinha}
                    key={index}
                    title={opcaoNome}
                    textStyle={estilo.textoEstilo}
                    checkedIcon={iconesLib.circulo2} 
                    uncheckedIcon={iconesLib.circulo} 
                    iconType="FontAwesome"
                    checked={check === index}
                    onPress={() => setCheck(index)}
                    />
                ))}
            </View>
        )
}

const estilo = {
    containerSemLinha: {paddingTop: 0, minWidth:320},
    containerComLinha: {paddingTop: 0, minWidth:320, 
        borderBottomWidth: 2, borderColor: cores.secundaria},
    textoEstilo: ConstrutorEstiloConstante.construtor().fonteGG().corSecundaria().construir(),
}

export {Checkbox, CheckboxOpcoes};