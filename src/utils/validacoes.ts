interface Objeto {
    [key: string]: any
}

function semValidacao(valor:any) {
    return true;
}

function validaValorPresente(valor:any) {
    return valor !== undefined;
}

function validaStringValida(valor:string) {
    return valor?.trim().length > 0;
}

function validaNumeroValido(valor:number) {
    return valor > 0;
}

function validaArrayValido(valor:any[]) {
    return valor?.length > 0;
}

function validaObjetoValido(valor:object) {
    return Object.keys(valor || {}).length > 0;
}

function validaEmail(valor:string) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(valor.toLowerCase());
}

function validaContato(valor:string) {
    const regex = /\d+/g;
    return valor.match(regex)?.join("").length === 11;
}

function validaSenha(senha: string) {
    return senha.trim().length >= 8 // minimo de caracteres
        && senha.trim() === senha; // sem espacos vazios
}

function validacoesUsuario(usuario:Objeto) {
    const validacoes: Objeto = {
        nomeCompleto: validaStringValida,
        email: validaEmail,
        contato: validaContato,
        senha: validaSenha,
        nomeUsuario: validaValorPresente
    };

    return Object.keys(usuario).filter(key => !validacoes[key](usuario[key])).map(key => key);
}

function validacoesImovel(imovel:Objeto) {
    const validacoes: Objeto = {
        id: semValidacao,
        imagens: validaArrayValido,
        nome: validaStringValida,
        tipo: validaStringValida,
        descricao: validaStringValida,
        numInquilinos: validaNumeroValido,
        preco: validaNumeroValido,
        disponivel: validaValorPresente,
        latitude: validaValorPresente,
        longitude: validaValorPresente
    };

    return Object.keys(imovel).filter(key => !validacoes[key](imovel[key])).map(key => key);
}

export { validacoesUsuario, validacoesImovel };
