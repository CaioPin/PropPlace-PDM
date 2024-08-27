import { iconesLib } from "../assets/icons/iconesLib";
import { ConstrutorEstiloConstante } from "../utils/ConstrutorEstiloConstante";
import { StyledButton, StyledText, StyledView } from "../utils/elementosEstilizaveis";

function Menu(){
 
    return(
        <StyledView className="flex flex-row justify-between w-full">

        <StyledButton buttonStyle={{width: 90}} 
        icon={iconesLib.home} 
        title={"Home"} 
        iconPosition="top" 
        titleStyle={estilo.texto} 
        type="clear" 
        ></StyledButton>

        <StyledButton buttonStyle={{width: 90}} 
        icon={iconesLib.lupa} 
        title={"Pesquisar"} 
        iconPosition="top" 
        titleStyle={estilo.texto} 
        type="clear" 
        ></StyledButton>

        <StyledButton buttonStyle={{width: 90}} 
        icon={iconesLib.mapa} 
        title={"Mapa"} 
        iconPosition="top" 
        titleStyle={estilo.texto} 
        type="clear" 
        ></StyledButton>

        <StyledButton buttonStyle={{width: 90}} icon={iconesLib.user} title={"Perfil"} iconPosition="top" titleStyle={estilo.texto} type="clear" ></StyledButton>

        </StyledView>
    );
}

const estilo = {
    texto: ConstrutorEstiloConstante.construtor().fonteM().corSecundaria().construir(),
}

export { Menu };