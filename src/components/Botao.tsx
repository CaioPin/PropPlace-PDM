import {
  ActivityIndicator,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import clsx from "clsx";
import { createContext, useContext } from "react";

type Variantes = "generico" | "inativo" | "enviar" | "cancelar";

type BotaoProps = TouchableOpacityProps & {
  variante?: Variantes;
  isLoading?: boolean;
};

const ThemeContext = createContext<{ variante?: Variantes }>({});

function Botao({
  variante = "generico",
  children,
  isLoading,
  className,
  ...rest
}: BotaoProps) {
  return (
    <TouchableOpacity
      className={clsx(
        "h-12 flex-row items-center justify-center rounded-lg gap-2 px-4",
        {
          "bg-paleta-secundaria": variante === "generico",
          "bg-paleta-terciaria": variante === "inativo",
          "bg-paleta-construtiva": variante === "enviar",
          "bg-paleta-destrutiva": variante === "cancelar",
        },
        className
      )}
      activeOpacity={0.7}
      disabled={isLoading || variante === "inativo"}
      {...rest}>
      <ThemeContext.Provider value={{ variante }}>
        {isLoading ? (
          <ActivityIndicator className="text-paleta-auxiliar" />
        ) : (
          children
        )}
      </ThemeContext.Provider>
    </TouchableOpacity>
  );
}

function Titulo({ children }: TextProps) {
  const { variante } = useContext(ThemeContext);

  return (
    <Text
      className={clsx("text-g font-regular", {
        "text-paleta-secundaria": variante === "inativo",
        "text-paleta-branco": variante !== "inativo",
      })}>
      {children}
    </Text>
  );
}

Botao.Titulo = Titulo;

export { Botao };
