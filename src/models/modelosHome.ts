import { ImageSourcePropType } from "react-native";

class ModeloImovelHome {
    imagem: ImageSourcePropType;
    titulo: string;
    subtitulo?: string;
    redirecionamento: () => void

    constructor(imagem:ImageSourcePropType, titulo:string, subtitulo:string, redirecionamento:() => void) {
        this.imagem = imagem;
        this.titulo = titulo;
        this.subtitulo = subtitulo;
        this.redirecionamento = redirecionamento;
    }
}

class ModeloProprietarioHome {
    id: string;
    imagem: ImageSourcePropType;
    nomeCompleto: string;

    constructor(id:string, imagem:ImageSourcePropType, nomeCompleto:string) {
        this.id = id;
        this.imagem = imagem;
        this.nomeCompleto = nomeCompleto;
    }
}

export { ModeloImovelHome, ModeloProprietarioHome };
