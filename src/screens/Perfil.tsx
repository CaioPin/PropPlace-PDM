import { useEffect, useState } from "react";
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Campo } from "@/components/Campo";
import { Carrossel, CarrosselTamanho } from "@/components/Carrosel";
import { Botao } from "@/components/Botao";
import { Loading } from "@/components/Loading";
import { Modal } from "@/components/Modal";
import { ConstrutorEstiloConstante } from "@/utils/ConstrutorEstiloConstante";
import { permissaoGaleria } from "@/utils/permissoes";
import { formataTelefone } from "@/utils/formatacoes";
import { validacoesUsuario } from "@/utils/validacoes";
import { ParametrosPaginas } from "@/constants/parametrosPaginas";

import adicionar from "../assets/images/adicionar.png";
import imovelPadrao from "../assets/images/imovelPadrao.png";
import usuarioPadrao from "../assets/images/usuario.png";

interface Objeto {
    [key: string]: any
};

class Imovel {
    imagem: ImageSourcePropType;
    titulo: string;
    subtitulo: string;
    redirecionamento: () => void;

    constructor(imagem:ImageSourcePropType, titulo:string, subtitulo:string, redirecionamento:() => void) {
        this.imagem = imagem;
        this.titulo = titulo;
        this.subtitulo = subtitulo;
        this.redirecionamento = redirecionamento;
    }
}

class Usuario {
    imagem: ImageSourcePropType;
    nomeCompleto: string;
    email: string;
    contato: string;
    nomeUsuario: string;
    imoveis: Imovel[];

    constructor(imagem:ImageSourcePropType, nomeCompleto:string, email:string, contato:string, nomeUsuario:string, imoveis:Imovel[]) {
        this.imagem = imagem;
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.contato = contato;
        this.nomeUsuario = nomeUsuario;
        this.imoveis = imoveis;
    }
}

type Propriedades = NativeStackScreenProps<ParametrosPaginas, "Perfil">;

function Perfil({route:rota, navigation:navegacao}:Propriedades) {
    const [usuario, definirUsuario] = useState<Usuario>();
    const [imoveis, definirImoveis] = useState<Imovel[]>([]);
    const [editando, definirEditando] = useState(false);
    const [mensagemErro, deifnirMensagemErro] = useState("");
    const [caminhoImagem, definirCaminhoImagem] = useState("");
    const [usuarioEditado, definirUsuarioEditado] = useState<Objeto>({});
    const id = rota.params?.id;

    const campos:Objeto = {
        imagem: "Foto de perfil",
        nomeCompleto: "Nome completo",
        email: "E-mail",
        contato: "Número para contato",
        nomeUsuario: "Nome de usuário"
    };
    
    useEffect(() => {
        (async () => {
            if (id) {
                // TODO: adicionar requisicao para buscar usuario do ID
                const mock = {
                    imagem: usuarioPadrao,
                    nomeCompleto: "Bruno Mars",
                    email: "bruno@mars.com",
                    contato: "99999999999",
                    nomeUsuario: "brunomars",
                    imoveis: [new Imovel(
                        imovelPadrao,
                        "Mansão em Ipanema",
                        "Rio de Janeiro - RJ",
                        () => {})
                    ]
                };

                const usuarioMockado = new Usuario(mock.imagem, mock.nomeCompleto, mock.email, mock.contato, mock.nomeUsuario, mock.imoveis);

                definirUsuario(usuarioMockado);
                definirImoveis(usuarioMockado.imoveis);
            } else {
                // TODO: adicionar requisicao para buscar usuario logado
                const mock = {
                    imagem: usuarioPadrao,
                    nomeCompleto: "Lady Gaga",
                    email: "lady@gaga.com",
                    contato: "00000000000",
                    nomeUsuario: "gaga",
                    imoveis: [new Imovel(
                        imovelPadrao,
                        "Mansão em Copacabana",
                        "Rio de Janeiro - RJ",
                        () => {})
                    ]
                };
                // TODO: adicionar redirecionamento para página de adição de imóvel
                const adicionarImovel = new Imovel(adicionar, "Adicionar imóvel", "", () => navegacao.navigate("Perfil"));

                const usuarioMockado = new Usuario(mock.imagem, mock.nomeCompleto, mock.email, mock.contato, mock.nomeUsuario, mock.imoveis);
                
                definirUsuario(usuarioMockado);
                definirImoveis([adicionarImovel, ...usuarioMockado.imoveis]);
            }
        })();
    }, []);

    function aoMudar(campo:string, valor:string) {
        definirUsuarioEditado({...usuarioEditado, [campo]: valor.trim()});
    }

    function acaoBotaoSalvar() {
        const novasInformacoes:Objeto = {...usuarioEditado};

        const camposIncorretos = validacoesUsuario(novasInformacoes).map(campo => `"${campos[campo]}"`).join(", ");

        if (camposIncorretos.length > 0) {
            deifnirMensagemErro(`O(s) campo(s) ${camposIncorretos} apresenta(m) informacoes incorretas. Por favor, reveja-as para poder prosseguir.`);
            return;
        }

        const partesUri = caminhoImagem.split(".");

        const dados = new FormData();
        Object.keys(novasInformacoes).forEach(key => {
            dados.append(key, novasInformacoes[key]);
        });
        if (caminhoImagem) {
            dados.append("imagem", JSON.stringify({
                uri: caminhoImagem,
                name: `imagemPerfil_${usuarioEditado.nomeCompleto}`,
                type: `image/${partesUri[partesUri.length - 1]}`
            }));
        }

        // TODO: adicionar chamada à API
    }

    function acaoBotaoEditarInformacoes() {
        definirEditando(true);
        definirUsuarioEditado({
            nomeCompleto: usuario!.nomeCompleto,
            email: usuario!.email,
            contato: usuario!.contato,
            nomeUsuario: usuario!.nomeUsuario
        });
    }

    function acaoBotaoAlterarSenha() {
        // TODO: adicionar redirecionamento para página de mudança de senha
        navegacao.navigate("Perfil");
    }

    async function acaoImagem() {
        if (!editando) return;

        const permissao = await permissaoGaleria();
        if (!permissao) {
            deifnirMensagemErro("Você precisa permitir o acesso à galeria para alterar a foto de perfil.");
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
                            resizeMode="contain" alt={textoAlternativo} progressiveRenderingEnabled /> :
                        <Image className={tailwind} style={estilo} source={usuario?.imagem || imovelPadrao}
                            resizeMode="contain" alt={textoAlternativo} progressiveRenderingEnabled/>
                    }
                </TouchableOpacity>
                <Text className="flex-1" style={estilos.nome} numberOfLines={2}>{usuario?.nomeCompleto}</Text>
            </View>
        );
    }

    return ( usuario ?
        <View className="flex justify-center gap-y-8 p-8 overflow-scroll">
            { cabecalhoUsuario() }

            <View className="flex gap-y-8">
                <Campo titulo={campos.nomeCompleto} texto={campos.nomeCompleto} valorInicial={usuario.nomeCompleto} ativo={editando}
                    aoMudar={(valor:string) => aoMudar("nomeCompleto", valor)} />

                <Campo titulo={campos.email} texto={campos.email} valorInicial={usuario.email} ativo={editando} teclado="email-address"
                    aoMudar={(valor:string) => aoMudar("email", valor)} />

                <Campo titulo={campos.contato} texto={campos.contato} valorInicial={usuario.contato} ativo={editando} teclado="numeric"
                    aoMudar={(valor:string) => aoMudar("contato", valor)} formatacao={formataTelefone} />

                { !id && <Campo titulo={campos.nomeUsuario} texto={campos.nomeUsuario} valorInicial={usuario.nomeUsuario} ativo={editando}
                    aoMudar={(valor:string) => aoMudar("nomeUsuario", valor)} />}
            </View>

            { !editando && <Carrossel itens={imoveis} tamanho={CarrosselTamanho.GRANDE} mostrarTexto /> }

            { !id &&
                <View className="flex flex-row justify-evenly w-full">
                    { editando ?
                        <>
                            <Botao variante="cancelar" onPress={() => navegacao.replace("Perfil", {id})}>
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

            { mensagemErro && <Modal titulo={mensagemErro} onClose={() => deifnirMensagemErro("")} /> }
        </View> :
        <Loading />
    );
}

const estilos = {
    nome: ConstrutorEstiloConstante.construtor().fonteG().corSecundaria().construir()
};

export { Perfil };
