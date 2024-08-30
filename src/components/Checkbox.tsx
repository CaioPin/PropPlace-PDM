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
    [CheckboxPossiveis.tiposImovel]: ["Apartamento", "Casa", "Kitnet", "República",],
    [CheckboxPossiveis.filtroPessoa]: ["Inquilino", "Proprietário"],
    [CheckboxPossiveis.tempoContrato]: ["1 ano", "Personalizado"],
    [CheckboxPossiveis.filtroImovel]: ["Livre", "Alugado"]
};

interface CheckboxPropriedades{
    opcoes: string[],
}

function Checkbox({opcoes}: CheckboxPropriedades){
    const [check, setCheck] = useState<number | null>(null);

        return(
            <View>
                {opcoes.map((opcaoNome, index) => (
                <CheckBox className="w-max"
                containerStyle={{}}
                key={index}
                title={opcaoNome}
                textStyle={estilo.textoEstilo}
                checkedIcon={iconesLib.circulo2} 
                checkedColor={cores.secundaria}
                uncheckedIcon={iconesLib.circulo} 
                uncheckedColor={cores.fundo}
                iconType="FontAwesome"
                checked={check === index}
                onPress={() => setCheck(index)}
                />
                ))}
            </View>
        )
}

const estilo = {
    containerEstilo: {paddingTop: 0, borderBottomWidth: 2, borderColor: cores.secundaria, minWidth:350},
    textoEstilo: ConstrutorEstiloConstante.construtor().fonteGG().corSecundaria().construir()
}

export {Checkbox, CheckboxOpcoes};