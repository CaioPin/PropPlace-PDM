import { api, IMAGE_API_URL } from "@/api";
import { UsuarioDTO } from "@/models/Usuario";
import imovelPadrao from "@/assets/images/imovelPadrao.png";
import usuarioPadrao from "@/assets/images/usuario.png";
import {
  ModeloImovelPerfil,
} from "@/models/modelosPerfil";
import { router } from "expo-router";
import { ImovelDTO } from "@/models/Imovel";

type constroiPerfilArgs = {
  userId: string
  imoveisSaoEditaveis?: boolean
}

export async function constroiPerfilUsuario(
  { userId, imoveisSaoEditaveis = false} : constroiPerfilArgs
) {
  const usuario: UsuarioDTO = await api
    .get("/users/id/" + userId)
    .then(({ data }) => data)
    .catch((erro) => {
      console.error(erro);
    });
  const { nome, imagem, email, telefone, imoveis } = usuario;
  let imagemValida = imagem
    ? { uri: IMAGE_API_URL + imagem.nomeImagem }
    : usuarioPadrao;

  const perfil = {
    imagem: imagemValida,
    nomeCompleto: nome,
    email,
    contato: telefone,
    nomeUsuario: usuario.username,
    imoveis: imoveis.map(({ imagens, nome, descricao, id: idImovel }) => {
      const imagem = imagens[0]
        ? { uri: IMAGE_API_URL + imagens[0].nomeImagem }
        : imovelPadrao;

        const redirecionamento = imoveisSaoEditaveis ? () => {
          router.navigate({
            pathname: "/imovel",
            params: { id: idImovel },
          });
        } : () => {
          router.navigate({
            pathname: "/imovel",
            params: { id: idImovel },
          });
        }
      return new ModeloImovelPerfil(imagem, nome, descricao, redirecionamento);
    }),
  };
  return perfil;
}

type constroiImovelArgs = {
  identificador: string
}

export async function constroiImovel({identificador}:constroiImovelArgs) {
  const mandaReq = "/imoveis/id/" + identificador
  const imovelApi: ImovelDTO = await api
    .get("/imoveis/id/" + identificador)
    .then(({ data }) => data.imovel)
    .catch((erro) => {
      console.error(erro);
    });

    const imagens = imovelApi.imagens?.map(imagem => ({caminho: IMAGE_API_URL + imagem.nomeImagem})) || [];
    const imovelMapeado = {
      id: imovelApi.id,
      nome: imovelApi.nome,
      tipo: imovelApi.tipo,
      descricao: imovelApi.descricao,
      numInquilinos: imovelApi.numInquilinos,
      preco: imovelApi.preco,
      disponivel: imovelApi.disponivel,
      latitude: imovelApi.latitude,
      longitude: imovelApi.longitude,
      imagens
    };

    return imovelMapeado;
}
