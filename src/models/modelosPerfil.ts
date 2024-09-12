import { ImageSourcePropType } from "react-native";

class ModeloImovelPerfil {
    imagem: ImageSourcePropType;
    titulo: string;
    subtitulo?: string;
    redirecionamento: () => void;

    constructor(imagem:ImageSourcePropType, titulo:string, subtitulo:string, redirecionamento:() => void) {
        this.imagem = imagem;
        this.titulo = titulo;
        this.subtitulo = subtitulo;
        this.redirecionamento = redirecionamento;
    }
}

class ModeloUsuarioPerfil {
    imagem?: ImageSourcePropType;
    nomeCompleto: string;
    email: string;
    contato: string;
    nomeUsuario: string;
    imoveis?: ModeloImovelPerfil[];

    constructor(imagem:ImageSourcePropType, nomeCompleto:string, email:string, contato:string, nomeUsuario:string, imoveis:ModeloImovelPerfil[]) {
        this.imagem = imagem;
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.contato = contato;
        this.nomeUsuario = nomeUsuario;
        this.imoveis = imoveis;
    }
}

export { ModeloImovelPerfil, ModeloUsuarioPerfil };
