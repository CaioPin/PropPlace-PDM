import { createContext, useEffect, useState } from "react";

import { api } from "../api";
import { UsuarioDTO } from "@/models/Usuario";
import { ImovelDTO, ImovelEnderecado } from "@/models/Imovel";
import { enderecaImoveis } from "@/utils/enderecaImovel";
import { useAuthContext } from "@/hooks/useAuthContext";
import { pegaStatusDeErro } from "@/utils/pegaStatusDeErro";

interface UsuariosContext {
  todosUsuarios: UsuarioDTO[];
  carregandoUsuarios: boolean;
}

interface ImoveisContext {
  todosImoveis: ImovelEnderecado[];
  carregandoImoveis: boolean;
  excluirImovel: (id: string) => Promise<void>;
}

const DadosContext = createContext<UsuariosContext & ImoveisContext>({
  todosUsuarios: [],
  todosImoveis: [],
  carregandoUsuarios: false,
  carregandoImoveis: false,
  excluirImovel: async () => {},
});

interface IProps {
  children: React.ReactNode;
}

function DadosProvider({ children }: IProps) {
  const [carregandoUsuarios, setCarregandoUsuarios] = useState<boolean>(true);
  const [carregandoImoveis, setCarregandoImoveis] = useState<boolean>(true);
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

   async function excluirImovel(id: string){
    try{
      await api.delete(`/imoveis/${id}`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setTodosImoveis((prevImoveis) =>
        prevImoveis.filter((imovel) => imovel.id !== id));
    }
    catch(error){
      console.error("Erro ao excluir imóvel: ", error);
    }
  }

  return (
    <DadosContext.Provider
      value={{
        todosUsuarios,
        carregandoUsuarios,
        carregandoImoveis,
        todosImoveis,
        excluirImovel,
      }}>
      {children}
    </DadosContext.Provider>
  );
}
export { DadosContext, DadosProvider };
