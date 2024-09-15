import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { cores } from '../../constants/cores';

export const iconesLib = {
    adicionarFoto: <MaterialIcons name="add-a-photo" size={60} color={cores.secundaria} />,
    cadeado: <AntDesign name="lock1" size={20} color={cores.secundaria} />,
    email: <Fontisto name="email" size={20} color={cores.secundaria} />,
    lixeira: <Feather name="trash-2" size={14} color={cores.branco} />,
    lupa2: <AntDesign name="search1" size={28} color={cores.secundaria} />,
    lupaAtiva: <Ionicons name="search" size={30} color={cores.secundaria} />,
    lupa: <AntDesign name="search1" size={20} color={cores.secundaria} />,
    pessoa: <Ionicons name="person" size={20} color={cores.secundaria} />,
    telefone: <MaterialCommunityIcons name="cellphone" size={20} color={cores.secundaria} />,
    home: <Ionicons name="home-outline" size={30} color={cores.secundaria} />,
    homeAtivo: <Ionicons name="home-sharp" size={30} color={cores.secundaria} />,
    mapa: <MaterialCommunityIcons name="map-marker-outline" size={30} color={cores.secundaria} />,
    mapaAtivo: <MaterialCommunityIcons name="map-marker" size={30} color={cores.secundaria} />,
    user: <FontAwesome5 name="user-circle" size={26} color={cores.secundaria} />,
    userAtivo: <FontAwesome name="user-circle-o" size={26} color={cores.secundaria} />,
    X: <Feather name="x" size={24} color={cores.preto} />,
    circulo: <FontAwesome name="circle-thin" size={24} color={cores.secundaria} />,
    circulo2: <FontAwesome name="circle" size={24} color={cores.secundaria} />,
    filtro: <Ionicons name="filter" size={28} color={cores.secundaria} />,
    olho: <Feather name='eye' size={20} color={cores.secundaria} />,
    olhoFechado: <Feather name='eye-off' size={20} color={cores.secundaria} />
}
