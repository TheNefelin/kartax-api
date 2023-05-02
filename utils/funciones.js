import SecretData from "../utils/SecretData.js";
import PGSQL from "../utils/PGSQL.js";
import { application } from "express";

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

// aun no esta definida
export async function admin(usuario, token) {
    if (!usuario || !token) {
        return error;
    };

    const resultadoToken = secretData.validateToken(token);

    if (!resultadoToken[0].estado) {
        error.data = [{ token: resultadoToken[0] }];
        return error;
    };

    const arrUsuario = await pgSql.getUsuario_ByUsuario(usuario);
    return { cod: 201, data: [{ token: resultadoToken[0], usuario: arrUsuario }] };
};

// carga todos los negocios del usuario administrador
export async function admin_negocios(usuario, token) {
    if (!usuario || !token) {
        return error;
    };

    const resultadoToken = secretData.validateToken(token);

    if (!resultadoToken[0].estado) {
        error.data = [{ token: resultadoToken[0] }];
        return error;
    };

    const arrUsuario = await pgSql.getUsuario_ByUsuario(usuario);
    const negocios = await pgSql.getNegocios_ByIdUsuario(arrUsuario[0].id);

    return { cod: 201, data: [{ token: resultadoToken[0], usuario: arrUsuario, negocios }] };
};

// agreagar nuevo negocio
export async function admin_negocios_post(usuario, token, data) {
    if (!usuario || !token) {
        return error;
    };

    const resultadoToken = secretData.validateToken(token);

    if (!resultadoToken[0].estado) {
        error.data = [{ token: resultadoToken[0] }];
        return error;
    };

    let { nombre, rut, direccion, descripcion, img, check } = data;

        // se validan los campos
        nombre = nombre ? nombre : "" ;
        rut = rut ? rut : "" ;
        direccion = direccion ? direccion : "" ;
        descripcion = descripcion ? descripcion : "" ;
        img = img ? img : "" ;
        check = check == "on" ? true : false ;

        const arrUsuario = await pgSql.getUsuario_ByUsuario(usuario);
        const negocios = await pgSql.getNegocios_ByIdUsuario(arrUsuario[0].id);
        const resultado = await pgSql.createNegocio(arrUsuario[0].id, nombre, rut, direccion, descripcion, img, check);

        if (resultado.length > 0) {
            return { cod: 201, data: [{ token: resultadoToken[0], usuario: arrUsuario, negocios, msge: "Se ha Agregado Correctamente!!!" }] };
        } else {
            error.data = [{ token: resultadoToken[0], usuario: arrUsuario, negocios, msge: "NO se ha podido Agregar" }];
            return error;
        }
};

// modificar negocio
export async function admin_negocios_put(usuario, token, data) {
    if (!usuario || !token) {
        return error;
    };

    const resultadoToken = secretData.validateToken(token);

    if (!resultadoToken[0].estado) {
        error.data = [{ token: resultadoToken[0] }];
        return error;
    };

    let { id, nombre, rut, direccion, descripcion, img, check } = data;

    if (isNaN(id)) {
        error.data = [{ token: resultadoToken[0], msge: "Debe Ingresar un ID Negocio Válido" }];
        return error;
    };

    // valida si el negocio pertenece al usuario
    const resultadoNegocio = await pgSql.validarNegocio_ByUsuario(id, usuario);

    if (parseInt(resultadoNegocio[0].cant) == 0) {
        error.data = [{ token: resultadoToken[0], msge: "El Negocio no Pertenece al Usuario" }];
        return error;
    };

    // se validan los campos
    nombre = nombre ? nombre : "" ;
    rut = rut ? rut : "" ;
    direccion = direccion ? direccion : "" ;
    descripcion = descripcion ? descripcion : "" ;
    img = img ? img : "" ;
    check = check == "on" ? true : false ;

    const resultado = await pgSql.updateNegocio(id, nombre, rut, direccion, descripcion, img, check);
    const arrUsuario = await pgSql.getUsuario_ByUsuario(usuario);
    const negocios = await pgSql.getNegocios_ByIdUsuario(arrUsuario[0].id);

    if (resultado.length > 0) {
        return { cod: 201, data: [{ token: resultadoToken[0], usuario: arrUsuario, negocios, msge: "Se ha Modificado Correctamente!!!" }] };
    } else {
        error.data = [{ token: resultadoToken[0], usuario: arrUsuario, negocios, msge: "NO se ha podido Modificado" }];
        return error;
    }
};

// carga todos los usuarios del usuario administrador
export async function admin_usuarios(usuario, token) {
    if (!usuario || !token) {
        return error;
    };

    const resultadoToken = secretData.validateToken(token);

    if (!resultadoToken[0].estado) {
        error.data = [{ token: resultadoToken[0] }];
        return error;
    };

    const arrUsuario = await pgSql.getUsuario_ByUsuario(usuario);
    const arrUsuarios = await pgSql.getUsuarios_ByIdNegocio(arrUsuario[0].id_negocio);

    return { cod: 201, data: [{ token: resultadoToken[0], usuario: arrUsuario, usuarios: arrUsuarios }] };
};

// funciones que extraen informacion desde la API -------------------------
// ------------------------------------------------------------------------

// funciones --------------------------------------------------------------
// ------------------------------------------------------------------------

