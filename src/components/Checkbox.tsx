import { iconesLib } from "@/assets/icons/iconesLib"
import { CheckBox } from "@rneui/base"
import { View, Text } from "react-native"
import { cores } from "@/constants/cores";
import { useState } from "react";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";

enum CheckboxTitulo{
    tiposImovel = "Filtrar imóveis por tipo:",
    filtroPessoa = "Filtrar usuários:",
    tempoContrato = "Tempo de contrato",
}

const CheckboxOpcoes: { [key in CheckboxTitulo]: string[] } = {
    [CheckboxTitulo.tiposImovel]: ["Apartamento", "Casa", "Kitnet", "Estúdio", "República", "Todos"],
    [CheckboxTitulo.filtroPessoa]: ["Inquilino", "Proprietário", "Todos"],
    [CheckboxTitulo.tempoContrato]: ["1 ano", "Personalizado"],
};

interface CheckboxPropriedades{
    opcoes: string[],
    separador?: boolean,
    titulo: CheckboxTitulo,
    aoSelecionar(opcao: string): void
}

function Checkbox({opcoes, separador, titulo, aoSelecionar}: CheckboxPropriedades){
    const [check, setCheck] = useState<number | null>(0);
    const quantidade = opcoes.length;

        return(
            <View>
                <Text className="text-paleta-secundaria text-xg font-black mb-2 pl-6 pt-0">{titulo}</Text>
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
                    onPress={() => {setCheck(index)
                    aoSelecionar(opcaoNome)}
                    }
                    />
                ))}
            </View>
        )
}

const estilo = {
    containerSemLinha: {paddingTop: 0, minWidth:320, 
        backgroundColor: cores.fundo, paddingBottom: 12},
    containerComLinha: {paddingTop: 0, minWidth:320, 
        backgroundColor: cores.fundo, borderBottomWidth: 2, 
        borderColor: cores.secundaria, paddingBottom: 6},
    textoEstilo: ConstrutorEstiloConstante.construtor().fonteGG().corSecundaria().construir(),
}

export {Checkbox, CheckboxOpcoes, CheckboxTitulo};