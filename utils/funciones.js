import SecretData from "../utils/SecretData.js";
import PGSQL from "../utils/PGSQL.js";

const secretData = new SecretData();
const pgSql = new PGSQL();

const error = { cod: 400, data: [] };

// funciones que responden a las rutas publicas ---------------------------
// ------------------------------------------------------------------------

// validaciones para inciiar sesion y crear token
export async function iniciar_sesion(usuario, clave) {
    if (!usuario || !clave) {
        return error
    };

    const resultado = await pgSql.iniciar_sesion(usuario, clave);
    
    if (resultado.length > 0) {
        if (resultado[0].cant == 0) {
            return error
        }; 
    } else {
        return error
    }

    const token = secretData.newToken(usuario, clave, 60);

    return {cod: 201, data: [{ token }]}
};

// funciones que responden a las rutas privadas ---------------------------
// ------------------------------------------------------------------------

export async function admin(usuario, token) {
    if (!usuario || !token) {
        return error;
    };

    const resultadoToken = secretData.validateToken(token);

    if (!resultadoToken[0].estado) {
        error.data.push(resultadoToken[0]);
        return error;
    };

    const arrUsuario = await pgSql.getUsuario_ByUsuario(usuario);
    return { cod: 201, data: [{ token: resultadoToken[0], usuario: arrUsuario }] };
};

export async function admin_negocios(usuario, token) {
    if (!usuario || !token) {
        return error;
    };

    const resultadoToken = secretData.validateToken(token);

    if (!resultadoToken[0].estado) {
        error.data.push(resultadoToken[0]);
        return error;
    };

    const arrUsuario = await pgSql.getUsuario_ByUsuario(usuario);
    const negocios = await pgSql.getNegocios_ByIdUsuario(arrUsuario[0].id);

    return { cod: 201, data: [{ token: resultadoToken[0], usuario: arrUsuario, negocios }] };
};

// funciones que extraen informacion desde la API -------------------------
// ------------------------------------------------------------------------

// funciones --------------------------------------------------------------
// ------------------------------------------------------------------------

