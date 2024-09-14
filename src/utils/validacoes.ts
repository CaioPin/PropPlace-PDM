interface Objeto {
    [key: string]: any
}

function validaValorPresente(valor:string) {
    return valor.trim().length > 0;
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
        nomeCompleto: validaValorPresente,
        email: validaEmail,
        contato: validaContato,
        senha: validaSenha,
        nomeUsuario: validaValorPresente
    };

    return Object.keys(usuario).filter(key => !validacoes[key](usuario[key])).map(key => key);
}

export { validacoesUsuario };
