import { api, IMAGE_API_URL } from "@/api";
import { UsuarioDTO } from "@/models/Usuario";
import imovelPadrao from "@/assets/images/imovelPadrao.png";
import usuarioPadrao from "@/assets/images/usuario.png";
import {
  ModeloImovelPerfil,
} from "@/models/modelosPerfil";
import { router } from "expo-router";

export async function constroiPerfilUsuario(userId: string) {
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
      return new ModeloImovelPerfil(imagem, nome, descricao, () => {
        router.navigate({
          pathname: "/formularioImovel",
          params: { id: idImovel },
        });
      });
    }),
  };
  return perfil;
}
