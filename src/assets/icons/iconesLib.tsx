import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { cores } from '../../constants/cores';

export const iconesLib = {
    adicionarFoto: <MaterialIcons name="add-a-photo" size={60} color={cores.secundaria} />,
    cadeado: <AntDesign name="lock1" size={20} color={cores.secundaria} />,
    email: <Fontisto name="email" size={20} color={cores.secundaria} />,
    lixeira: <Feather name="trash-2" size={14} color={cores.branco} />,
    lupa2: <AntDesign name="search1" size={24} color={cores.secundaria} />,
    lupa: <AntDesign name="search1" size={20} color={cores.secundaria} />,
    pessoa: <Ionicons name="person" size={20} color={cores.secundaria} />,
    telefone: <MaterialCommunityIcons name="cellphone" size={20} color={cores.secundaria} />,
    home: <FontAwesome6 name="house" size={24} color={cores.secundaria} />,
    mapa: <Feather name="map-pin" size={24} color={cores.secundaria} />,
    user: <FontAwesome5 name="user-circle" size={24} color={cores.secundaria} />,
    circulo: <FontAwesome name="circle-thin" size={24} color={cores.secundaria} />,
    circulo2: <FontAwesome name="circle" size={24} color={cores.secundaria} />
}
