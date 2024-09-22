import { createContext, useEffect, useState } from "react";

import { api } from "../api";
import { UsuarioDTO } from "@/models/Usuario";
import { ImovelDTO, ImovelEnderecado } from "@/models/Imovel";
import { enderecaImoveis } from "@/utils/enderecaImovel";

interface UsuariosContext {
  todosUsuarios: UsuarioDTO[];
  carregandoUsuarios: boolean;
}

interface ImoveisContext {
  todosImoveis: ImovelEnderecado[];
  carregandoImoveis: boolean;
}

const DadosContext = createContext<UsuariosContext & ImoveisContext>({
  todosUsuarios: [],
  todosImoveis: [],
  carregandoUsuarios: false,
  carregandoImoveis: false,
});

interface IProps {
  children: React.ReactNode;
}

function DadosProvider({ children }: IProps) {
  const [carregandoUsuarios, setCarregandoUsuarios] = useState<boolean>(false);
  const [carregandoImoveis, setCarregandoImoveis] = useState<boolean>(false);
  const [todosUsuarios, setTodosUsuarios] = useState<UsuarioDTO[]>([]);
  const [todosImoveis, setTodosImoveis] = useState<ImovelEnderecado[]>([]);

  useEffect(() => {
    (async () => {
      setCarregandoImoveis(true);
      try {
        const respostaImoveis = await api.get<ImovelDTO[]>("/imoveis");
        const imoveisComEndereco = await enderecaImoveis(respostaImoveis.data)
        setTodosImoveis(imoveisComEndereco);
      } catch (error) {
        console.error(error);
      } finally {
        setCarregandoImoveis(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      console.log("fez chamada")
      setCarregandoUsuarios(true);
      try {
        const respostaUsuarios = await api.get<UsuarioDTO[]>("/users");
        setTodosUsuarios(respostaUsuarios.data);
      } catch (error) {
        console.error(error);
      } finally {
        setCarregandoUsuarios(false);
      }
    })();
  }, []);

  return (
    <DadosContext.Provider
      value={{
        todosUsuarios,
        carregandoUsuarios,
        carregandoImoveis,
        todosImoveis,
      }}>
      {children}
    </DadosContext.Provider>
  );
}
export { DadosContext, DadosProvider };
