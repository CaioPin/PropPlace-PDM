type ArrayFormatacao = {posicao:number, caractere:string, proximo:number}[];

function formatacaoNumerica(numero:string, formatacao:ArrayFormatacao, tamanho:number) {
    const numeroFormatado = formatacao.reduce((numeroEmConstrucao, { posicao, caractere, proximo }) => {
        return tamanho > posicao ? numeroEmConstrucao + caractere + numero.substring(posicao, posicao + proximo) : numeroEmConstrucao;
    }, "");

    return numeroFormatado;
}

function formataTelefone(valor:string) {
    const formatacaoTelefone = [
        { posicao: 0, caractere: "(", proximo: 2 },
        { posicao: 2, caractere: ") ", proximo: 5 },
        { posicao: 7, caractere: "-", proximo: 4 }
    ];

    const regexApenasNumeros = /\d+/g;
    const telefoneSemFormatacao = valor.match(regexApenasNumeros)?.join("") || "";
    const tamanhoTelefone = telefoneSemFormatacao.length;

    return formatacaoNumerica(telefoneSemFormatacao, formatacaoTelefone, tamanhoTelefone);
}

function formataMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

function formataSenha(valor:string) {
    return valor.split("").map(() => "*").join("");
}

export { formataTelefone, formataMoeda, formataSenha };
