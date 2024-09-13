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

function Modal({ titulo, subtitulo = "", onClose, children, className, ...rest }: Props) {
  return (
    <RNModal transparent animationType="fade" {...rest}>
      <View className="flex-1 justify-center bg-black/60 px-4">
        <View className="bg-paleta-fundo px-5 pt-5 pb-10 rounded-xl max-h-96">
          {onClose && (
            <TouchableOpacity
              className="-mt-2 flex flex-row-reverse"
              activeOpacity={0.7}
              onPress={onClose}>
              {iconesLib.X}
            </TouchableOpacity>
          )}
          {titulo && (
            <Text className="text-paleta-secundaria font-semibold text-lg text-center ">
              {titulo}
            </Text>
          )}

          {subtitulo.trim().length > 0 && (
            <Text className="text-paleta-secundaria font-regular text-lg leading-6 my-2 text-center">
              {subtitulo}
            </Text>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

export { Modal };
