import {
  View,
  Text,
  ModalProps,
  ScrollView,
  Modal as RNModal,
  TouchableOpacity,
} from "react-native"

import { iconesLib } from "@/assets/icons/iconesLib"

type Props = ModalProps & {
  titulo: string
  subtitulo?: string
  onClose?: () => void
}

export function Modal({
  titulo,
  subtitulo = "",
  onClose,
  children,
  ...rest
}: Props) {

  return (
    <RNModal transparent animationType="slide" {...rest}>
      <View className="flex-1 justify-center bg-black/60 px-4" >
        <View className="bg-paleta-primaria px-5 pt-5 pb-10 rounded-xl">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between items-center pt-5" >
              <Text className="text-paleta-secundaria font-semibold text-xl">{titulo}</Text>

              {onClose && (
                <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
                  {iconesLib.X}
                </TouchableOpacity>
              )}
            </View>

            {subtitulo.trim().length > 0 && (
              <Text className="text-paleta-secundaria font-regular text-lg leading-6  my-2">
                {subtitulo}
              </Text>
            )}
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  )
}
