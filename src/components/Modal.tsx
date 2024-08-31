import {
  View,
  Text,
  ModalProps,
  ScrollView,
  Modal as RNModal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

type Props = ModalProps & {
  titulo?: string;
  subtitulo?: string;
  onClose?: () => void;
};

function Modal({ titulo, subtitulo = "", onClose, children, ...rest }: Props) {
  return (
    <RNModal transparent animationType="slide" {...rest}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center bg-black/60 px-4">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-paleta-fundo px-5 pt-5 pb-10 rounded-xl">
              <ScrollView showsVerticalScrollIndicator={false}>
                {titulo && (
                  <View className="items-center pt-3">
                    <Text className="text-paleta-secundaria font-semibold text-lg max-w-xs">
                      {titulo}
                    </Text>
                  </View>
                )}

                {subtitulo.trim().length > 0 && (
                  <Text className="text-paleta-secundaria font-regular text-lg leading-6  my-2">
                    {subtitulo}
                  </Text>
                )}
                {children}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

export { Modal };
