enum CheckboxOpcoesQuantidade{
    DOIS,
    QUATRO
}

interface CheckboxOpcao{
    titulo: string
}

interface CheckboxPropriedades{
    opcoes: CheckboxOpcao[],
    quantOpcoes: CheckboxOpcoesQuantidade
}

function Checkbox({opcoes, quantOpcoes = CheckboxOpcoesQuantidade.DOIS}: CheckboxPropriedades){
    
}