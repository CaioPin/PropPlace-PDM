import { useState } from "react";
import { iconesLib } from "@/assets/icons/iconesLib";

export const useVisibilidadeSenha = () => {
  const [visibilidadeSenha, defineVisibilidadeSenha] = useState(true);
  const [iconeOlho, defineIcone] = useState(iconesLib.olho);

  const mudaVisibilidadeSenha = () => {
    if (iconeOlho === iconesLib.olho) {
      defineIcone(iconesLib.olhoFechado);
      defineVisibilidadeSenha(!visibilidadeSenha);
    } else if (iconeOlho === iconesLib.olhoFechado) {
      defineIcone(iconesLib.olho);
      defineVisibilidadeSenha(!visibilidadeSenha);
    }
  };

  return {
    visibilidadeSenha,
    iconeOlho,
    mudaVisibilidadeSenha,
  };
};
