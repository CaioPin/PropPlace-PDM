import { StyleSheet } from "react-native";
import { cores } from "../constants/cores";
import { fonte } from "../constants/fonte";

class ConstrutorEstiloConstante {
    estilo: object;

    constructor(estilo: object) {
        this.estilo = estilo;
    };

    static construtor() { return new ConstrutorEstiloConstante({}); }
    
    adicionarEstilo(atributo: object) {
        this.estilo = {...this.estilo, ...atributo}
        return this;
    }

    fonteXG() { return this.adicionarEstilo({fontSize: fonte.tipo.xg}); }
    fonteGG() { return this.adicionarEstilo({fontSize: fonte.tipo.gg}); }
    fonteG() { return this.adicionarEstilo({fontSize: fonte.tipo.g}); }
    fonteM() { return this.adicionarEstilo({fontSize: fonte.tipo.m}); }
    fonteP() { return this.adicionarEstilo({fontSize: fonte.tipo.p}); }
    fontePP() { return this.adicionarEstilo({fontSize: fonte.tipo.pp}); }
    fonteXP() { return this.adicionarEstilo({fontSize: fonte.tipo.xp}); }

    peso1() { return this.adicionarEstilo({fontWeight: 100}); }
    peso2() { return this.adicionarEstilo({fontWeight: 200}); }
    peso3() { return this.adicionarEstilo({fontWeight: 300}); }
    peso4() { return this.adicionarEstilo({fontWeight: 400}); }
    peso5() { return this.adicionarEstilo({fontWeight: 500}); }
    peso6() { return this.adicionarEstilo({fontWeight: 600}); }
    peso7() { return this.adicionarEstilo({fontWeight: 700}); }
    peso8() { return this.adicionarEstilo({fontWeight: 800}); }
    peso9() { return this.adicionarEstilo({fontWeight: 900}); }

    corPrimaria() { return this.adicionarEstilo({color: cores.primaria}); }
    corSecundaria() { return this.adicionarEstilo({color: cores.secundaria}); }
    corTerciaria() { return this.adicionarEstilo({color: cores.terciaria}); }
    corAuxiliar() { return this.adicionarEstilo({color: cores.auxiliar}); }
    corBranca() { return this.adicionarEstilo({color: cores.branco}); }
    corPreta() { return this.adicionarEstilo({color: cores.preto}); }

    bordaPrimaria() { return this.adicionarEstilo({borderColor: cores.primaria}); }
    bordaSecundaria() { return this.adicionarEstilo({borderColor: cores.secundaria}); }
    bordaTerciaria() { return this.adicionarEstilo({borderColor: cores.terciaria}); }
    bordaAuxiliar() { return this.adicionarEstilo({borderColor: cores.auxiliar}); }
    bordaConstrutiva() { return this.adicionarEstilo({borderColor: cores.construtiva}); }
    bordaDestrutiva() { return this.adicionarEstilo({borderColor: cores.destrutiva}); }

    fundoPrimario() { return this.adicionarEstilo({backgroundColor: cores.primaria}); }
    fundoPadrao() { return this.adicionarEstilo({backgroundColor: cores.fundo}); }
    fundoConstrutivo() { return this.adicionarEstilo({backgroundColor: cores.construtiva}); }
    fundoDestrutivo() { return this.adicionarEstilo({backgroundColor: cores.destrutiva}); }

    construir() {
        return StyleSheet.create({estilo: this.estilo}).estilo;
    }
}

export { ConstrutorEstiloConstante };
