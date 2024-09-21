import { iconesLib } from "@/assets/icons/iconesLib";
import {
  View,
  Text,
  ModalProps,
  ScrollView,
  Modal as RNModal,
  TouchableOpacity,
} from "react-native";

type Props = ModalProps & {
  titulo?: string;
  subtitulo?: string;
  onClose?: () => void;
};

function Modal({
  titulo = "",
  subtitulo = "",
  onClose,
  children,
  className,
  ...rest
}: Props) {
  let { onRequestClose } = rest;
  let mostraX = !!onClose;
  if (!onClose && !onRequestClose) {
    throw new Error(
      "Modal não é fechável. passe a função que seta visible com onClose (x visivel) ou onRequestClose (omitir x)"
    );
  }
  if(onRequestClose){
    onClose = onRequestClose as () => void;
    mostraX = false;
  }

  return (
    <RNModal
      transparent
      animationType="fade"
      {...rest}
      onRequestClose={onClose}>
      <View className="flex-1 justify-center bg-paleta-terciaria/60 px-4">
        <View className="bg-paleta-fundo px-5 p-5 rounded-xl max-h-96">
          {mostraX && (
            <TouchableOpacity
              className="-mt-2 flex flex-row-reverse"
              activeOpacity={0.7}
              onPress={onClose}>
              {iconesLib.X}
            </TouchableOpacity>
          )}
          {titulo.trim().length > 0 && (
            <Text className="text-paleta-secundaria font-semibold text-gg text-center">
              {titulo}
            </Text>
          )}
          {subtitulo.trim().length > 0 && (
            <Text className="text-paleta-secundaria font-regular text-gg leading-6 text-center">
              {subtitulo}
            </Text>
          )}
          {children && (
            <ScrollView className="pt-5" showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          )}
        </View>
      </View>
    </RNModal>
  );
}

export { Modal };
