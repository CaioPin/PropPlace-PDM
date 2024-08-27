import { getMediaLibraryPermissionsAsync, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { requestForegroundPermissionsAsync } from "expo-location";

async function permissaoGaleria() {
    const estaPermitido = await getMediaLibraryPermissionsAsync();
    if (estaPermitido.granted) return true;

    return requestMediaLibraryPermissionsAsync().then(permissao => permissao.granted);
}

async function permissaoLocalizacao() {
    return requestForegroundPermissionsAsync().then(permissao => permissao.granted);
}

export { permissaoGaleria, permissaoLocalizacao };
