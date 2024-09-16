import { useState } from "react";

interface Objeto {
    [key: string]: any
}

function useFormulario(valorInicial:Objeto = {}): [Objeto, (valor:Objeto) => void] {
    const [formulario, _definirFormulario] = useState<Objeto>(valorInicial);

    function definirFormulario(valor:Objeto) {
        _definirFormulario({...formulario, ...valor});
    }

    return [formulario, definirFormulario];
}

export { useFormulario };
