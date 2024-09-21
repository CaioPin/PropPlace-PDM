import axios from "axios";

type ArrayFormatacao = {posicao:number, caractere:string, proximo:number}[];

function formatacaoNumerica(numero:string, formatacao:ArrayFormatacao, tamanho:number) {
    const numeroFormatado = formatacao.reduce((numeroEmConstrucao, { posicao, caractere, proximo }) => {
        return tamanho > posicao ? numeroEmConstrucao + caractere + numero.substring(posicao, posicao + proximo) : numeroEmConstrucao;
    }, "");

    return numeroFormatado;
}

function formataTelefone(valor:string) {
    const formatacaoTelefone = [
        { posicao: 0, caractere: "(", proximo: 2 },
        { posicao: 2, caractere: ") ", proximo: 5 },
        { posicao: 7, caractere: "-", proximo: 4 }
    ];

    const regexApenasNumeros = /\d+/g;
    const telefoneSemFormatacao = valor.match(regexApenasNumeros)?.join("") || "";
    const tamanhoTelefone = telefoneSemFormatacao.length;

    return formatacaoNumerica(telefoneSemFormatacao, formatacaoTelefone, tamanhoTelefone);
}

function formataMoedaString(valor:string) {
    const prefixo = "R$ ";
    const moeda = valor.replace("R", "").replace("$", "").replace(" ", "").replaceAll(".", ",");

    if (moeda.split(",").length > 2 || moeda.split(",")[1]?.length > 2) {
        return prefixo + moeda.substring(0, moeda.length - 1);
    }
    
    return prefixo + moeda;
}

function formataMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

function formataSenha(valor:string) {
    return valor.split("").map(() => "*").join("");
}

async function formataEndereco(lat: number, lng: number) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=pt-BR&result_type=administrative_area_level_2&key=${process.env.EXPO_PUBLIC_MAPS_API_KEY}`;

  const enderecoFormatado = await axios
    .get(url)
    .then((resp) => {
      const resultado = resp.data.results[0]
      const cidade = resultado.address_components[0].long_name;
      const estado_sigla = resultado.address_components[1].short_name;
      return `${cidade} - ${estado_sigla}`;
    })
    .catch((erro) => {
      console.log(erro);
    });

  return enderecoFormatado ? enderecoFormatado : "";
}

export { formataTelefone, formataMoedaString, formataMoeda, formataSenha, formataEndereco };
