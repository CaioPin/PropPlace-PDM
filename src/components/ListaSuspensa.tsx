import { Dropdown } from "react-native-element-dropdown";
import { cores } from "@/constants/cores";
import { fonte } from "@/constants/fonte";
import { Text, View } from "react-native";

interface ListaSuspensaPropriedades {
    titulo: string,
    itens: {nome: string, valor: any}[],
    aoMudar: (valor: any) => void,
    valorInicial?: any
}

function ListaSuspensa({itens, valorInicial, titulo, aoMudar}:ListaSuspensaPropriedades) {
    return (
        <View>
            <Text className="text-paleta-secundaria text-g mb-3">{titulo}</Text>
            <Dropdown data={itens} labelField={"nome"} valueField={"valor"} value={valorInicial} onChange={aoMudar}
                placeholder="Selecione uma opção" placeholderStyle={estilos.textoReservado}
                style={{...estilos.elemento, borderStyle: "solid"}} containerStyle={estilos.conteiner}
                selectedTextStyle={estilos.texto} itemTextStyle={estilos.texto} activeColor="transparent" />
        </View>
    );
}

const estilos = {
    elemento: {borderWidth: 1, borderColor: cores.primaria, borderRadius: 6, padding: 12},
    conteiner: {backgroundColor: cores.fundo, borderWidth: 1, borderColor: cores.primaria, borderRadius: 12},
    texto: {fontSize: fonte.tipo.m, color: cores.secundaria},
    textoReservado: {fontSize: fonte.tipo.m, color: cores.auxiliar}
};

export { ListaSuspensa };
