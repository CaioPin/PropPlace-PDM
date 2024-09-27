import { createContext, useEffect, useState } from "react";

import { api } from "../api";
import { UsuarioDTO } from "@/models/Usuario";
import { ImovelDTO, ImovelEnderecado } from "@/models/Imovel";
import { enderecaImoveis, enderecaImovel } from "@/utils/enderecaImovel";
import { useAuthContext } from "@/hooks/useAuthContext";
import { pegaStatusDeErro } from "@/utils/pegaStatusDeErro";

interface RespostaEnvioEmail {
  message?: string;
  error?: string;
}

interface UsuariosContext {
  todosUsuarios: UsuarioDTO[];
  carregandoUsuarios: boolean;
  enviaEmail: (destinatario: string, informacoes: Object) => Promise<RespostaEnvioEmail>
}

interface ImoveisContext {
  todosImoveis: ImovelEnderecado[];
  atualizaImovel: (idImovel: string) => void;
  carregandoImoveis: boolean;
  excluirImovel: (id: string) => Promise<void>;
}

const DadosContext = createContext<UsuariosContext & ImoveisContext>({
  todosUsuarios: [],
  todosImoveis: [],
  atualizaImovel: (idImovel = "") => {},
  carregandoUsuarios: false,
  carregandoImoveis: false,
  excluirImovel: async () => {},
  enviaEmail: async () => ({}),
});

interface IProps {
  children: React.ReactNode;
}

function DadosProvider({ children }: IProps) {
  const [carregandoUsuarios, setCarregandoUsuarios] = useState<boolean>(false);
  const [carregandoImoveis, setCarregandoImoveis] = useState<boolean>(false);
  const [todosUsuarios, setTodosUsuarios] = useState<UsuarioDTO[]>([]);
  const [todosImoveis, setTodosImoveis] = useState<ImovelEnderecado[]>([]);
  const { token, deslogar } = useAuthContext();

  useEffect(() => {
    (async () => {
      setCarregandoImoveis(true);
      try {
        const respostaImoveis = await api.get<ImovelDTO[]>("/imoveis");
        const imoveisComEndereco = await enderecaImoveis(respostaImoveis.data)
        setTodosImoveis(imoveisComEndereco);
      } catch (error) {
        console.error("Erro ao carregar imóveis: ", error);
        const { status } = pegaStatusDeErro(error)!
        if (status === 403) {
          deslogar()
        }
      } finally {
        setCarregandoImoveis(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setCarregandoUsuarios(true);
      try {
        const respostaUsuarios = await api.get<UsuarioDTO[]>("/users");
        setTodosUsuarios(respostaUsuarios.data);
      } catch (error) {
        console.error("Erro ao carregar usuários: ",error);
        const { status } = pegaStatusDeErro(error)!
        if (status === 403) {
          deslogar()
        }
      } finally {
        setCarregandoUsuarios(false);
      }
    })();
  }, []);

  async function excluirImovel(id: string) {
    try {
      const resposta = await api.delete(`/imoveis/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (resposta.status === 200) {
        setCarregandoImoveis(true)
        setTodosImoveis((prevImoveis) =>
          prevImoveis.filter((imovel) => imovel.id !== id)
        );        
      } else {
        console.error("Erro ao excluir o imóvel.");
      }
    } catch (error) {
      console.error("Erro ao excluir imóvel: ", error);
    }finally{
      setCarregandoImoveis(false)
    }
  }

  async function enviaEmail(destinatario: string, informacoes: Object){
    try{
      await api.post(`/users/enviaEmail`,{
        destinatario,
        informacoes
      });
      return ({ message: 'Email enviado com sucesso!' });
  } catch (erro) {
    console.error(erro);
    return ({ error: 'Erro ao enviar email' });
  }
}

async function atualizaImovel(idImovel: string) {
  setCarregandoImoveis(true)
  const todosImoveisAttPromise = todosImoveis.map(async (imovel) => {
    if (imovel.id === idImovel) {
      const imovelAtt: ImovelDTO = await api
        .get("/imoveis/id/" + idImovel)
        .then(({ data }) => data.imovel)
        .catch((erro) => {
          console.error(erro);
        });
      const imovelAttEnderecado: ImovelEnderecado = await enderecaImovel(
        imovelAtt
      );
      return imovelAttEnderecado;
    }
    return imovel;
  });
  const todosImoveisAtt = await Promise.all(todosImoveisAttPromise)
  setCarregandoImoveis(false)
  setTodosImoveis(todosImoveisAtt);
}

  return (
    <DadosContext.Provider
      value={{
        todosUsuarios,
        carregandoUsuarios,
        carregandoImoveis,
        todosImoveis,
        excluirImovel,
        enviaEmail,
        atualizaImovel
      }}>
      {children}
    </DadosContext.Provider>
  );
}
export { DadosContext, DadosProvider };
