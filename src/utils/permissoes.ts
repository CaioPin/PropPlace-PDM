import { getMediaLibraryPermissionsAsync, requestMediaLibraryPermissionsAsync } from "expo-image-picker";

async function permissaoGaleria() {
    const estaPermitido = await getMediaLibraryPermissionsAsync();
    if (estaPermitido.granted) return true;

    return requestMediaLibraryPermissionsAsync().then(permissao => permissao.granted);
}

export { permissaoGaleria };
