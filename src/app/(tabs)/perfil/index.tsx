import { useContext, useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import mime from "mime";
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
import { constroiPerfilUsuario } from "@/utils/constroiModelo";

import adicionar from "@/assets/images/adicionar.png";
import usuarioPadrao from "@/assets/images/usuario.png";
import { api } from "@/api";
import { Button } from "@rneui/base";
import { DadosContext } from "@/context/dadosContext";

interface Objeto {
    [key: string]: any
}

export default function Perfil() {
    const [usuario, definirUsuario] = useState<ModeloUsuarioPerfil>();
    const [imoveis, definirImoveis] = useState<ModeloImovelPerfil[]>([]);
    const [editando, definirEditando] = useState(false);
    const [carregando, definirCarregando] = useState(true);
    const [mensagemErro, definirMensagemErro] = useState("");
    const [caminhoImagem, definirCaminhoImagem] = useState<string | undefined>();
    const [usuarioEditado, definirUsuarioEditado] = useFormulario({});
    const [atualizarCampos, definirAtualizarCampos] = useState(0);
    const [ehPerfilDoUserLogado, definirEhPerfilDoUserLogado] = useState(false);
    const { id: paramId } = useLocalSearchParams(); // renomeando pra não confundir
    const { userId, deslogar } = useAuthContext();
    const { todosImoveis } = useContext(DadosContext);

    const campos:Objeto = {
        imagem: "Foto de perfil",
        nomeCompleto: "Nome completo",
        email: "E-mail",
        contato: "Número para contato",
        nomeUsuario: "Nome de usuário"
    };
    
    useEffect(() => {
        definirEhPerfilDoUserLogado(paramId === userId);
        (async () => await atualizarPerfil())();
    }, [paramId, todosImoveis]);

    async function atualizarPerfil() {
        definirCarregando(true);

        if (paramId !== userId) {
            
            const usuarioAvulso = await constroiPerfilUsuario({
              userId: paramId as string,
            });

            definirUsuario(usuarioAvulso);
            definirImoveis(usuarioAvulso.imoveis || []);
        } else {
            const usuarioLogado = await constroiPerfilUsuario({
              userId: userId as string,
              imoveisSaoEditaveis: true,
            });
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
        definirCaminhoImagem(undefined);
        definirAtualizarCampos(atualizarCampos + 1);
    }

    async function acaoBotaoSalvar() {
        const camposIncorretos = validacoesUsuario(usuarioEditado).map(campo => `"${campos[campo]}"`).join(", ");

        if (camposIncorretos.length > 0) {
            definirMensagemErro(`O(s) campo(s) ${camposIncorretos} apresenta(m) informacoes incorretas. Por favor, reveja-as para poder prosseguir.`);
            return;
        }

        try {
            const dados = {
                nome: usuarioEditado.nomeCompleto,
                email: usuarioEditado.email,
                telefone: usuarioEditado.contato,
                username: usuarioEditado.nomeUsuario
            }
            await api.put(`/users/${userId}`, dados);
        } catch (erro) {
            console.log(erro);
            definirMensagemErro(`Houve um erro ao salvar as informações do perfil.`);
            return;
        }

        try {
            if (caminhoImagem) {
                const dados = new FormData();
                dados.append("imagem", {
                    uri: caminhoImagem,
                    type: mime.getType(caminhoImagem),
                    name: `imagemPerfil_${usuarioEditado.nomeCompleto}.${mime.getType(caminhoImagem)?.split("/")[1]}`
                } as any);
                const configuracao = {headers: {"content-type": "multipart/form-data"}};
    
                await api.put("/imagem/user", dados, configuracao);
            }
        } catch (erro) {
            console.log(erro);
            definirMensagemErro(`Houve um erro ao salvar a foto de perfil.`);
            return;
        }

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
                <Text className="flex-1 text-paleta-secundaria text-xg" numberOfLines={2}>{usuario?.nomeCompleto}</Text>
                { paramId === userId &&<Button onPress={deslogar}
                title="Sair"
                titleStyle={{color: cores.destrutiva}}
                type="clear"/> }
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
                        <Campo titulo={campos.nomeCompleto} texto={campos.nomeCompleto}
                            valorInicial={editando ? usuarioEditado.nomeCompleto : usuario?.nomeCompleto}
                            ativo={editando} atualizar={atualizarCampos} aoMudar={() => {}}
                            onChangeText={(nomeCompleto) => definirUsuarioEditado({nomeCompleto})} />

                        <Campo titulo={campos.email} texto={campos.email}
                            valorInicial={editando ? usuarioEditado.email : usuario?.email}
                            ativo={editando} teclado="email-address" atualizar={atualizarCampos} aoMudar={() => {}}
                            onChangeText={(email) => definirUsuarioEditado({email})} />

                        <Campo titulo={campos.contato} texto={campos.contato}
                            valorInicial={editando ? usuarioEditado.contato : usuario?.contato}
                            ativo={editando} teclado="numeric" atualizar={atualizarCampos}
                            aoMudar={(contato) => definirUsuarioEditado({contato})} formatacao={formataTelefone} />

                        { ehPerfilDoUserLogado && <Campo titulo={campos.nomeUsuario} texto={campos.nomeUsuario}
                            valorInicial={editando ? usuarioEditado.nomeUsuario : usuario?.nomeUsuario}
                            ativo={editando} atualizar={atualizarCampos} aoMudar={() => {}}
                            onChangeText={(nomeUsuario) => definirUsuarioEditado({nomeUsuario})} />}
                    </View>

                    { !editando && <>
                        <Text className="text-paleta-secundaria font-medium text-g mb-3">Imóveis</Text>
                        <Carrossel itens={imoveis} tamanho={CarrosselTamanho.GRANDE} mostrarTexto />
                    </>}

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
