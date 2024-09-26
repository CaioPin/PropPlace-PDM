import { ImageSourcePropType } from "react-native";

class ModeloImovelHome {
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

interface ImagemProprietario {
    nomeImagem: string
}

class ModeloProprietarioHome {
    id: string;
    imagem: ImagemProprietario;
    nomeCompleto: string;

    constructor(id:string, imagem:ImagemProprietario, nomeCompleto:string) {
        this.id = id;
        this.imagem = imagem;
        this.nomeCompleto = nomeCompleto;
    }
}

export { ModeloImovelHome, ModeloProprietarioHome };
