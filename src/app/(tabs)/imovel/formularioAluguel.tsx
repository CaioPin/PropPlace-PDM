import { iconesLib } from "@/assets/icons/iconesLib";
import { Botao } from "@/components/Botao";
import { Calendario } from "@/components/Calendario";
import { Campo } from "@/components/Campo";
import { Checkbox, CheckboxOpcoes, CheckboxTitulo } from "@/components/Checkbox";
import { Modal } from "@/components/Modal";
import { cores } from "@/constants/cores";
import { DadosContext } from "@/context/dadosContext";
import { useAuthContext } from "@/hooks/useAuthContext";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { Button } from "@rneui/base";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function formularioAluguel(){
    const { id } = useLocalSearchParams();
    const { userId } = useAuthContext();
    const { todosUsuarios, carregandoUsuarios, todosImoveis } = useContext(DadosContext);
    const [ usuario, setUsuario ] = useState<any>();
    const [ imovel, setImovel ] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [ modal, setModal ] = useState<boolean>(false);
    const [ calendario, setCalendario ] = useState<boolean>(false);

    function encontraUser(){
        setLoading(carregandoUsuarios);
        setUsuario(todosUsuarios.find((usuario) => usuario.id === userId));
    }

    async function encontraImovel() {
        setImovel(todosImoveis.find((imovel) => imovel.id === id));
    }

    function aoSelecionarOpcao(opcao: string){
        if(opcao === "Personalizado"){
            setCalendario(true);
        }
    }

    useEffect(() => {
        encontraUser();
        encontraImovel();
    }, [carregandoUsuarios]);

    return <SafeAreaView style={{backgroundColor: cores.fundo, 
                                flexGrow: 1, padding: 4}}>
        <ScrollView>
            <View>
                <Button icon={iconesLib.setaVoltar}
                buttonStyle={{width: 60}}
                type="clear"
                titleStyle={estilo.texto}
                onPress={() => router.back()}></Button>
                {/* TODO: corrigir router.back q impede de voltar na pagina dps q sai */}
            </View>
            {loading? (
                <Text className="justify-center self-center align-center" style={estilo.texto}>Carregando...</Text>
            ) : (
                <View className="px-4 pt-4 gap-6 flex flex-column">
                    <Text className="mb-6" style={estilo.textoComPeso}>Preencha o formulário:</Text>
                    <Campo aoMudar={() => {}} 
                        autoFocus
                        titulo="Nome completo"
                        texto={usuario.nome}
                        ativo
                    />
                    <Campo aoMudar={() => {}}
                        titulo="Telefone"
                        texto={usuario.telefone}
                        keyboardType="phone-pad"
                        autoComplete="tel-device"
                        maxLength={11}
                        ativo
                    />
                    <Campo aoMudar={() => {}}
                        titulo="Quantidade de pessoas"
                        keyboardType="phone-pad"
                        ativo
                    />
                    <Checkbox aoSelecionar={aoSelecionarOpcao}
                        opcoes={CheckboxOpcoes["Tempo de contrato"]} 
                        titulo={CheckboxTitulo.tempoContrato}
                    />

                    {calendario? (<Calendario/>) : (null)}
                    
                    <View className="flex flex-row justify-center mb-4">
                        <Botao variante="enviar" onPress={() => {setModal(true)}}>
                            <Botao.Titulo>Enviar</Botao.Titulo>
                        </Botao>
                    </View>
                </View>
            )}

            <View>
                <Modal visible={modal}
                onClose={() => {{setModal(false)}
                router.back()}} 
                 titulo="Solicitação enviada. O proprietário avaliará a solicitação e retornará o contato."/>
            </View>
            
        </ScrollView>
    </SafeAreaView>
}

const estilo = {
    texto: ConstrutorEstiloConstante.construtor()
    .fonteG()
    .corSecundaria()
    .construir(),
    textoComPeso: ConstrutorEstiloConstante.construtor()
    .fonteXXG()
    .peso9()
    .corSecundaria()
    .construir(),
}