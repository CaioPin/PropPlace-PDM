import { DadosProvider } from "@/context/dadosContext";
import { Slot } from "expo-router";

export default function informacaoImovelLayout() {
  
  return (
    <DadosProvider>
      <Slot />
    </DadosProvider>
  );
}
