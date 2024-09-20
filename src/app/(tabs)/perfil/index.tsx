import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormulario } from "@/hooks/useFormulario";
import { Campo } from "@/components/Campo";
import { Carrossel, CarrosselTamanho } from "@/components/Carrosel";
import { Botao } from "@/components/Botao";
import { Loading } from "@/components/Loading";
import { Modal } from "@/components/Modal";
import { useAuthContext } from "@/hooks/useAuthContext";
import { ModeloImovelPerfil, ModeloUsuarioPerfil } from "@/models/modelosPerfil";
import { cores } from "@/constants/cores";
import { permissaoGaleria } from "@/utils/permissoes";
import { formataTelefone } from "@/utils/formatacoes";
import { validacoesUsuario } from "@/utils/validacoes";

import adicionar from "@/assets/images/adicionar.png";
import usuarioPadrao from "@/assets/images/usuario.png";
import { constroiPerfilUsuario } from "@/utils/constroiModelo";

interface Objeto {
    [key: string]: any
}

export default function Perfil() {
    const [usuario, definirUsuario] = useState<ModeloUsuarioPerfil>();
    const [imoveis, definirImoveis] = useState<ModeloImovelPerfil[]>([]);
    const [editando, definirEditando] = useState(false);
    const [carregando, definirCarregando] = useState(true);
    const [mensagemErro, definirMensagemErro] = useState("");
    const [caminhoImagem, definirCaminhoImagem] = useState("");
    const [usuarioEditado, definirUsuarioEditado] = useFormulario();
    const [atualizarCampos, definirAtualizarCampos] = useState(0);
    const { id: paramId } = useLocalSearchParams(); // renomeando pra não confundir
    const { userId } = useAuthContext()

    const ehPerfilDoUserLogado = paramId === userId
        // condição pro perfil ser do usuario logado ou de outro usuario
    const campos:Objeto = {
        imagem: "Foto de perfil",
        nomeCompleto: "Nome completo",
        email: "E-mail",
        contato: "Número para contato",
        nomeUsuario: "Nome de usuário"
    };
    
    useEffect(() => {
        (async () => await atualizarPerfil())();
    }, [paramId]);

    async function atualizarPerfil() {
        definirCarregando(true);

        if (!ehPerfilDoUserLogado) {
            
            const usuarioAvulso = await constroiPerfilUsuario(paramId as string)

            definirUsuario(usuarioAvulso);
            definirImoveis(usuarioAvulso.imoveis || []);
        } else {
            const usuarioLogado = await constroiPerfilUsuario(userId as string)
            const adicionarImovel = new ModeloImovelPerfil(adicionar, "Adicionar imóvel",
                "", () => router.push({pathname: "/formularioImovel", params: {id: ""}}));
            
            definirUsuario(usuarioLogado);
            definirImoveis([adicionarImovel, ...(usuarioLogado.imoveis || [])]);
        }

        definirCarregando(false);
    }

    function acaoBotaoCancelar() {
        definirEditando(false);
        definirUsuarioEditado({});
        definirCaminhoImagem("");
        definirAtualizarCampos(atualizarCampos + 1);
    }

    async function acaoBotaoSalvar() {
        const camposIncorretos = validacoesUsuario(usuarioEditado).map(campo => `"${campos[campo]}"`).join(", ");

        if (camposIncorretos.length > 0) {
            definirMensagemErro(`O(s) campo(s) ${camposIncorretos} apresenta(m) informacoes incorretas. Por favor, reveja-as para poder prosseguir.`);
            return;
        }

        const partesUri = caminhoImagem.split(".");

        const dados = new FormData();
        Object.keys(usuarioEditado).forEach(key => {
            dados.append(key, usuarioEditado[key]);
        });
        if (caminhoImagem) {
            dados.append("imagem", JSON.stringify({
                uri: caminhoImagem,
                name: `imagemPerfil_${usuarioEditado.nomeCompleto}`,
                type: `image/${partesUri[partesUri.length - 1]}`
            }));
        }

        // TODO: adicionar chamada à API
        await atualizarPerfil();
        acaoBotaoCancelar();
    }

    function acaoBotaoEditarInformacoes() {
        definirEditando(true);
        definirUsuarioEditado({
            nomeCompleto: usuario?.nomeCompleto,
            email: usuario?.email,
            contato: usuario?.contato,
            nomeUsuario: usuario?.nomeUsuario
        });
    }

    function acaoBotaoAlterarSenha() {
        router.navigate("/perfil/alterarSenha");
    }

    async function acaoImagem() {
        if (!editando) return;

        const permissao = await permissaoGaleria();
        if (!permissao) {
            definirMensagemErro("Você precisa permitir o acesso à galeria para alterar a foto de perfil.");
            return;
        }

        const imagem = await launchImageLibraryAsync({mediaTypes: MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1]});
        if (!imagem.assets) return;

        definirCaminhoImagem(imagem.assets[0].uri);
    }

    function cabecalhoUsuario() {
        const tailwind = "border border-paleta-secundaria rounded-full mr-8";
        const estilo = {width: 50, height: 50};
        const textoAlternativo = `Foto de ${usuario?.nomeCompleto}`;

        return (
            <View className="flex flex-row items-center">
                <TouchableOpacity onPress={acaoImagem}>
                    { caminhoImagem ?
                        <Image className={tailwind} style={estilo} src={caminhoImagem}
                            alt={textoAlternativo} progressiveRenderingEnabled /> :
                        <Image className={tailwind} style={estilo} source={usuario?.imagem || usuarioPadrao}
                            alt={textoAlternativo} progressiveRenderingEnabled/>
                    }
                </TouchableOpacity>
                <Text className="flex-1 text-paleta-secundaria text-g" numberOfLines={2}>{usuario?.nomeCompleto}</Text>
            </View>
        );
    }

    return ( carregando ?
        <Loading /> :
        <SafeAreaView style={{backgroundColor: cores.fundo, flexGrow: 1}}>
            <ScrollView>
                <View className="flex justify-center gap-y-8 px-8 pb-8">
                    { cabecalhoUsuario() }

                    <View className="flex gap-y-8">
                        <Campo titulo={campos.nomeCompleto} texto={campos.nomeCompleto} valorInicial={usuario?.nomeCompleto} ativo={editando}
                            aoMudar={(nomeCompleto) => definirUsuarioEditado({nomeCompleto})} atualizar={atualizarCampos} />

                        <Campo titulo={campos.email} texto={campos.email} valorInicial={usuario?.email} ativo={editando} teclado="email-address"
                            aoMudar={(email) => definirUsuarioEditado({email})} atualizar={atualizarCampos} />

                        <Campo titulo={campos.contato} texto={campos.contato} valorInicial={usuario?.contato} ativo={editando} teclado="numeric"
                            aoMudar={(contato) => definirUsuarioEditado({contato})} formatacao={formataTelefone} atualizar={atualizarCampos} />

                        { ehPerfilDoUserLogado && <Campo titulo={campos.nomeUsuario} texto={campos.nomeUsuario} valorInicial={usuario?.nomeUsuario} ativo={editando}
                            aoMudar={(nomeUsuario) => definirUsuarioEditado({nomeUsuario})} atualizar={atualizarCampos} />}
                    </View>

                    { !editando && <Carrossel itens={imoveis} tamanho={CarrosselTamanho.GRANDE} mostrarTexto /> }

                    { ehPerfilDoUserLogado &&
                        <View className="flex flex-row justify-evenly w-full">
                            { editando ?
                                <>
                                    <Botao variante="cancelar" onPress={acaoBotaoCancelar}>
                                        <Botao.Titulo>Cancelar</Botao.Titulo>
                                    </Botao>
                                    <Botao variante="enviar" onPress={acaoBotaoSalvar}>
                                        <Botao.Titulo>Salvar</Botao.Titulo>
                                    </Botao>
                                </> :
                                <>
                                    <Botao onPress={acaoBotaoEditarInformacoes}>
                                        <Botao.Titulo>Editar informações</Botao.Titulo>
                                    </Botao>
                                    <Botao onPress={acaoBotaoAlterarSenha}>
                                        <Botao.Titulo>Alterar senha</Botao.Titulo>
                                    </Botao>
                                </>
                            }
                        </View>
                        
                    }

                    <Modal titulo={mensagemErro} visible={!!mensagemErro} onClose={() => definirMensagemErro("")} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
