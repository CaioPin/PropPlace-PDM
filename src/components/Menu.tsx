import { iconesLib } from "../assets/icons/iconesLib";
import { ConstrutorEstiloConstante } from "../utils/ConstrutorEstiloConstante";
import { StyledButton, StyledView } from "../utils/elementosEstilizaveis";

function Menu(){
 
    return(
        <StyledView className="flex flex-row justify-between w-full px-2 border-t-2 border-[#554348]">

        <StyledButton buttonStyle={{flexGrow: 1}} 
        icon={iconesLib.home} 
        title={"Home"} 
        iconPosition="top" 
        titleStyle={estilo.texto} 
        type="clear"/>

        <StyledButton buttonStyle={{flexGrow: 1}} 
        icon={iconesLib.lupa2} 
        title={"Pesquisar"} 
        iconPosition="top" 
        titleStyle={estilo.texto} 
        type="clear" />

        <StyledButton buttonStyle={{flexGrow: 1}} 
        icon={iconesLib.mapa} 
        title={"Mapa"} 
        iconPosition="top" 
        titleStyle={estilo.texto} 
        type="clear"/>

        <StyledButton buttonStyle={{flexGrow: 1}} 
        icon={iconesLib.user} 
        title={"Perfil"} 
        iconPosition="top" 
        titleStyle={estilo.texto} 
        type="clear"/>

        </StyledView>
    );
}

const estilo = {
    texto: ConstrutorEstiloConstante.construtor().fonteM().corSecundaria().construir(),
}

export { Menu };