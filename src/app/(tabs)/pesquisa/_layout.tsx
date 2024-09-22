import { DadosProvider } from "@/context/dadosContext";
import { Slot } from "expo-router";

export default function PesquisaLayout() {
  
  return (
    <DadosProvider>
      <Slot />
    </DadosProvider>
  );
}
