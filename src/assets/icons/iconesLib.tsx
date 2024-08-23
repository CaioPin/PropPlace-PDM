import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { cores } from '../../constants/cores';

export const iconesLib = {
    adicionarFoto: <MaterialIcons name="add-a-photo" size={60} color={cores.secundaria} />,
    cadeado: <AntDesign name="lock1" size={20} color={cores.secundaria} />,
    email: <Fontisto name="email" size={20} color={cores.secundaria} />,
    lixeira: <Feather name="trash-2" size={14} color={cores.branco} />,
    lupa: <AntDesign name="search1" size={20} color={cores.secundaria} />,
    pessoa: <Ionicons name="person" size={20} color={cores.secundaria} />,
    telefone: <MaterialCommunityIcons name="cellphone" size={20} color={cores.secundaria} />
}
