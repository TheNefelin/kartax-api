import SecretData from "../utils/SecretData.js";
import PGSQL from "../utils/PGSQL.js";

const secretData = new SecretData();
const pgSql = new PGSQL();

const error = { cod: 400, data: [] };

// validaciones para inciiar sesion y crear token
export async function iniciar_sesion(obj) {
    const { usuario, clave } = obj;

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

    const token = secretData.newToken(usuario, clave, 1);

    return {cod: 201, data: [{token}]}
};

// -- todas las funciones data_ obtienen los datos de la BD atravez del objeto PGSQL
export async function data_negocio() {

}


function validarToken(token) {
    const resultado = secretData.validateToken(token);
    return resultado
    if (resultado.estado) {
        return true;
    } else {
        return false;
    };
};