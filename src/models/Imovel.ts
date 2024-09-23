import { Imagem } from "./Imagem";

type ImovelBase = {
  id: string;
  nome: string;
  userId: string; // id do dono do imóvel
  tipo: string;
  descricao: string;
  disponivel: boolean,
  preco: number;
  numInquilinos: number;
  imagens: Imagem[];
}

export type Coordinates = {
  latitude: number,
  longitude: number
}

export type ImovelDTO = ImovelBase & Coordinates 

export type ImovelEnderecado = ImovelDTO & { endereco: string }
