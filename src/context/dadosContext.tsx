import { createContext, useEffect, useState } from "react";

import { api } from "../api";
import { UsuarioDTO } from "@/models/Usuario";
import { ImovelDTO, ImovelEnderecado } from "@/models/Imovel";
import { enderecaImoveis } from "@/utils/enderecaImovel";
import { useAuthContext } from "@/hooks/useAuthContext";

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
  const [carregandoUsuarios, setCarregandoUsuarios] = useState<boolean>(false);
  const [carregandoImoveis, setCarregandoImoveis] = useState<boolean>(false);
  const [todosUsuarios, setTodosUsuarios] = useState<UsuarioDTO[]>([]);
  const [todosImoveis, setTodosImoveis] = useState<ImovelEnderecado[]>([]);
  const { token } = useAuthContext();


  useEffect(() => {
    (async () => {
      setCarregandoImoveis(true);
      try {
        const respostaImoveis = await api.get<ImovelDTO[]>("/imoveis");
        const imoveisComEndereco = await enderecaImoveis(respostaImoveis.data)
        setTodosImoveis(imoveisComEndereco);
      } catch (error) {
        console.error("Erro ao carregar imóveis: ", error);
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
