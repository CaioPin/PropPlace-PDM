import { useEffect, useState } from "react";
import { View } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { cores } from "../constants/cores";

LocaleConfig.locales.pt = {
    monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
    today: "Hoje"
};
LocaleConfig.defaultLocale = "pt";

function Calendario() {
    const hoje = new Date();
    const hojeFormatado = formatarData(hoje);
    const dataMaxima = `${hoje.getFullYear() + 5}-${hoje.getMonth() + 1}-${hoje.getDate()}`;

    const estiloMarcacao = {color: cores.construtiva, textColor: cores.branco};
    const marcacaoDataInicial = {...estiloMarcacao, startingDay: true};
    const marcacaoDataFinal = {...estiloMarcacao, endingDay: true};

    const [datasMarcadas, definirDatasMarcadas] = useState({});
    const [datas, definirDatas] = useState({});

    function formatarData(data:Date) {
        const ano = data.getFullYear();
        const mes = (data.getMonth() < 9 ? "0" : "") + (data.getMonth() + 1);
        const dia = (data.getDate() < 10 ? "0" : "") + data.getDate();
        return `${ano}-${mes}-${dia}`;
    }

    useEffect(()=> {
        if (Object.keys(datasMarcadas).length < 2) {
            definirDatas(datasMarcadas);
        } else {
            const [stringDataInicial, stringDataFinal] = Object.keys(datasMarcadas);
            const datasIntermediarias:any = {};
            const dataMutavel = new Date(stringDataInicial);
            const dataLimite = new Date(stringDataFinal);

            while (dataMutavel < dataLimite) {
                dataMutavel.setDate(dataMutavel.getDate() + 1);

                const dataFormatada = formatarData(dataMutavel);
                datasIntermediarias[dataFormatada] = estiloMarcacao;
            }

            definirDatas({...datasIntermediarias, ...datasMarcadas});
        }
    }, [datasMarcadas]);

    function marcarOutraData(data:DateData) {
        const [stringDataInicial, stringDataFinal] = Object.keys(datasMarcadas);
        const dataInicial = new Date(stringDataInicial);
        const dataFinal = new Date(stringDataFinal);
        const novaData = new Date(data.dateString);

        const diferencaDataInicial = Math.abs(dataInicial.getTime() - novaData.getTime());
        const diferencaDataFinal = Math.abs(dataFinal.getTime() - novaData.getTime());

        const novaDataInicial = diferencaDataInicial < diferencaDataFinal ? data.dateString : stringDataInicial;
        const novaDataFinal = diferencaDataInicial < diferencaDataFinal ? stringDataFinal : data.dateString;
        definirDatasMarcadas({[novaDataInicial]: marcacaoDataInicial, [novaDataFinal]: marcacaoDataFinal});
    }

    function marcarSegundaData(data:DateData) {
        const stringDataMarcada = Object.keys(datasMarcadas)[0];
        const dataMarcada = new Date(stringDataMarcada);
        const novaData = new Date(data.dateString);

        if (novaData > dataMarcada) {
            const dataFinal = {[data.dateString]: marcacaoDataFinal};
            definirDatasMarcadas({...datasMarcadas, ...dataFinal});
        }  else {
            const dataInicial = {[data.dateString]: marcacaoDataInicial};
            const dataFinal = {[stringDataMarcada]: marcacaoDataFinal};
            definirDatasMarcadas({...dataInicial, ...dataFinal});
        }
    }

    function marcarData(data:DateData) {
        const quantidadeDatas = Object.keys(datasMarcadas).length;

        if (quantidadeDatas === 0) {
            definirDatasMarcadas({[data.dateString]: marcacaoDataInicial});
            return;
        }

        if (Object.keys(datasMarcadas).includes(data.dateString)) return;

        if (quantidadeDatas === 1) marcarSegundaData(data);
        else marcarOutraData(data);
    }

    return (
        <View style={{width: "100%"}}>
            <Calendar style={{borderRadius: 10}} onDayPress={marcarData} theme={tema}
                initialDate={hojeFormatado} minDate={hojeFormatado} maxDate={dataMaxima}
                markingType={"period"} markedDates={datas} hideExtraDays={false}
                showSixWeeks enableSwipeMonths disableAllTouchEventsForDisabledDays />
        </View>
    );
}

const corDeFundo = "#C9E1E1";
const tema = {
    backgroundColor: corDeFundo,
    calendarBackground: corDeFundo,
    textSectionTitleColor: cores.secundaria,
    dayTextColor: cores.secundaria,
    monthTextColor: cores.secundaria,
    arrowColor: cores.secundaria,
    textDisabledColor: cores.primaria
};

export { Calendario };
