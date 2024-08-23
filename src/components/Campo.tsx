import { useState } from "react";
import { StyledText, StyledTextInput, StyledView } from "../utils/elementosEstilizaveis";
import { ConstrutorEstiloConstante } from "../utils/ConstrutorEstiloConstante";
import { iconesLib } from "../assets/icons/iconesLib";

enum CampoIcones {
    CADEADO = "cadeado",
    EMAIL = "email",
    LUPA = "lupa",
    PESSOA = "pessoa",
    TELEFONE = "telefone"
}

interface CampoPropriedades {
    titulo?: string,
    texto?: string,
    valorInicial?: string,
    icone?: CampoIcones,
    ativo: boolean
}

function Campo({titulo, texto = "", valorInicial = "", icone, ativo}:CampoPropriedades) {
    const [valor, definirValor] = useState(valorInicial);
    
    const tailwindConteiner = "w-full";
    const tailwindTitulo = "mb-3";
    const tailwindAreaCampo = "flex flex-row justify-between items-center w-full p-3 " + (ativo ? "border rounded-md" : "border-b");
    const tailwindCampoTexto = "flex-1";
    const tailwindImagem = "ml-3";
    
    return(
        <StyledView className={tailwindConteiner}>
            { titulo && <StyledText className={tailwindTitulo} style={estilo.titulo}>{titulo}</StyledText> }
            
            <StyledView className={tailwindAreaCampo} style={ativo ? estilo.areaCampoAtivo : estilo.areaCampoInativo}>
                <StyledTextInput className={tailwindCampoTexto} style={ativo ? estilo.textoAtivo : estilo.textoInativo}
                    placeholder={texto} value={valor} onChangeText={definirValor} editable={ativo} />

                { icone && <StyledView className={tailwindImagem}>{iconesLib[icone]}</StyledView> }
            </StyledView>
        </StyledView>
    );
}

const estilo = {
    titulo: ConstrutorEstiloConstante.construtor().fonteG().corSecundaria().construir(),
    textoAtivo: ConstrutorEstiloConstante.construtor().fonteM().corSecundaria().construir(),
    textoInativo: ConstrutorEstiloConstante.construtor().fonteM().corAuxiliar().construir(),
    areaCampoAtivo: ConstrutorEstiloConstante.construtor().bordaPrimaria().construir(),
    areaCampoInativo: ConstrutorEstiloConstante.construtor().bordaAuxiliar().construir()
};

export { CampoIcones, Campo };
