import { iconesLib } from "../assets/icons/iconesLib";
import { ConstrutorEstiloConstante } from "../utils/ConstrutorEstiloConstante";
import { View } from "react-native"
import { Button } from "@rneui/base"

function Menu(){
 
    return(
      <View className="flex-1 flex-col-reverse">

        <View className="flex flex-row justify-between w-full  px-2 border-t-2
        border-paleta-secundaria bg-paleta-fundo">

        <Button buttonStyle={{flexGrow: 1}} 
        icon={iconesLib.home} 
        title={"Home"} 
        iconPosition="top" 
        titleStyle={estilo.texto} 
        type="clear" 
        />

        <Button buttonStyle={{flexGrow: 1}} 
        icon={iconesLib.lupa2} 
        title={"Pesquisar"} 
        iconPosition="top" 
        titleStyle={estilo.texto} 
        type="clear" />

        <Button buttonStyle={{flexGrow: 1}} 
        icon={iconesLib.mapa} 
        title={"Mapa"} 
        iconPosition="top" 
        titleStyle={estilo.texto} 
        type="clear"/>

        <Button buttonStyle={{flexGrow: 1}} 
        icon={iconesLib.user} 
        title={"Perfil"} 
        iconPosition="top" 
        titleStyle={estilo.texto} 
        type="clear" />

        </View>
      </View>

    );
}

const estilo = {
  texto: ConstrutorEstiloConstante.construtor()
    .fonteM()
    .corSecundaria()
    .construir(),
}

export { Menu }
