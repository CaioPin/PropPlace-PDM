import { ImovelDTO, ImovelEnderecado } from "@/models/Imovel";
import { formataEndereco } from "./formatacoes";

export async function enderecaImoveis(
  imoveis: ImovelDTO[]
): Promise<ImovelEnderecado[]> {
  const enderecaImoveisPromises = imoveis.map(enderecaImovel);
  const enderecaImoveis = await Promise.all(enderecaImoveisPromises);
  return enderecaImoveis;
}

export const enderecaImovel = async (imovel: ImovelDTO) => {
  return {
    ...imovel,
    endereco: await formataEndereco(imovel.latitude, imovel.longitude),
  };
};
