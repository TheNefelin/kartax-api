import SecretData from "../utils/SecretData.js";
import PGSQL from "../utils/PGSQL.js";
import { application } from "express";

const secretData = new SecretData();
const pgSql = new PGSQL();

const error = { cod: 401, data: [{ estado: false, msge: "" }] };
const ok = { cod: 200, data: [{ estado: true, msge: "" }] };

const msge = {
    errorCompletar: "Debe Completar Todos los Campos",
    errorClave: "La contraseña no Coincide",
    errorCorreo: "El Correo ya Existe",
    errorUsuario: "El Usuario ya Existe",
    errorLogin: "Usuario o Contraseña Incorrecta",
    errorBD: "Error al Conectarse a la BD",
    errorSinDatos: "No Hay Registros Disponibles",
    errorId: "El ID debe ser Numerico",
    errorPermiso: "No Esta Autorizado para Modificar el Dato",
    post: "Datos Ingresados Correctamente",
    put: "Datos Modificado Correctamente",
    login: "Sesion Iniciada Correctamente"
};

// funciones que responden a las rutas publicas ---------------------------
// ------------------------------------------------------------------------

// devuelve encuesta
export async function encuesta_get() {
    const votos = await pgSql.getEncuestaVotos();
    ok.data[0].votos = votos;

    const entidades = await pgSql.getEncuestaEntidades();
    ok.data[0].entidades = entidades;

    return ok;
};

// guarda encuesta
export async function encuesta_post(obj) {
    console.log(obj)
    const { entidad, experiencia, velocidad, intuitivo, recomendable, sugerencia } = obj 
    // valida los campos
    if (isNaN(experiencia) || isNaN(velocidad) || isNaN(intuitivo) || isNaN(recomendable)) {
        error.data[0].msge = msge.errorCompletar;
        return error;
    };
    // guarda la encuesta
    const respuesta = await pgSql.setEncuesta(entidad, experiencia, velocidad, intuitivo, recomendable, sugerencia);

    if (respuesta.length > 0) {
        ok.data[0].msge = msge.post;
        return ok
    } else {
        error.data[0].msge = msge.errorBD;
        return error;
    };
};

// registrar Nuevo Usuario
export async function registrarse(txtNombres, txtApellidos, txtUser, txtEmail, txtPass1, txtPass2) {
    // valida que todos los campos tengan datos
    if (!txtNombres || !txtApellidos || !txtUser || !txtEmail || !txtPass1 || !txtPass2) {
        error.data[0].msge = msge.errorCompletar;
        return error;
    };
    // valida que la contraseña coincida
    if (txtPass1 !== txtPass2) {
        error.data[0].msge = msge.errorClave;
        return error;
    };
    // valida que el correo no exista
    const correo = await pgSql.validar_correo(txtEmail);
    if (correo[0].cont > 0) {
        error.data[0].msge = msge.errorCorreo;
        return error;
    };
    // valida que el usuario no exista
    const usuario = await pgSql.validar_usuario(txtUser);
    if (usuario[0].cont > 0) {
        error.data[0].msge = msge.errorUsuario;
        return error;
    }
    // crea nuevo usuario
    const nuevoUsuario = await pgSql.registrarAdmin(txtNombres, txtApellidos, txtUser, txtEmail, txtPass1);
    if (nuevoUsuario.length > 0) {
        ok.data[0].msge = msge.post;
        return ok
    } else {
        error.data[0].msge = msge.errorBD;
        return error;
    };
};

// validaciones para inciiar sesion y crear token
export async function iniciar_sesion(usuario, clave) {
    // valida que todos los campos tengan datos
    if (!usuario || !clave) {
        error.data[0].msge = msge.errorCompletar;
        return error;
    };
    // valida el inicio sesion
    const resultado = await pgSql.iniciar_sesion(usuario, clave);
    if (resultado.length > 0) {
        if (resultado[0].cant == 0) {
            error.data[0].msge = msge.errorLogin;
            return error;
        }
    } else {
        error.data[0].msge = msge.errorBD;
        return error;
    }
    // crea token despues d evalidar inicio sesion
    const token = secretData.newToken(usuario, clave, 60);
    ok.data[0].token = token;
    ok.data[0].msge = msge.login;

    console.log()
    return ok
};

// funciones que responden a las rutas privadas ---------------------------
// ------------------------------------------------------------------------

// aun no esta definida
export async function admin(usuarioAdmin, token) {
    // valida que todos los campos tengan datos
    if (!usuarioAdmin || !token) {
        error.data[0].msge = msge.errorCompletar;
        return error;
    };
    // valida token
    const resultadoToken = secretData.validateToken(token);
    if (!resultadoToken[0].estado) {
        error.data[0].msge = resultadoToken[0].msge;
        return error;
    };
    return ok;
};

// carga todos los negocios del usuario administrador
export async function admin_negocios(usuarioAdmin, token) {
    // valida que todos los campos tengan datos
    if (!usuarioAdmin || !token) {
        error.data[0].msge = msge.errorCompletar;
        return error;
    };
    // valida token
    const resultadoToken = secretData.validateToken(token);
    if (!resultadoToken[0].estado) {
        error.data[0].msge = resultadoToken[0].msge;
        return error;
    };
    // devuelve los negocios encontrados
    const arrNegocios = await pgSql.getNegocios_ByUsuarioAdmin(usuarioAdmin);
    ok.data[0].negocios = arrNegocios;
    return ok;
};

// agreagar nuevo negocio
export async function admin_negocios_post(usuarioAdmin, token, data) {
    // valida que todos los campos tengan datos
    if (!usuarioAdmin || !token) {
        error.data[0].msge = msge.errorCompletar;
        return error;
    };
    // valida token
    const resultadoToken = secretData.validateToken(token);
    if (!resultadoToken[0].estado) {
        error.data[0].msge = resultadoToken[0].msge;
        return error;
    };
    // se validan los campos
    let { nombre, rut, direccion, descripcion, img, check } = data;
    nombre = nombre ? nombre : "";
    rut = rut ? rut : "";
    direccion = direccion ? direccion : "";
    descripcion = descripcion ? descripcion : "";
    img = img ? img : "";
    check = check == "on" ? true : false;
    // crea un nuevo negocio
    const resultado = await pgSql.createNegocio(usuarioAdmin, nombre, rut, direccion, descripcion, img, check);
    if (resultado.length > 0) {
        ok.data[0].msge = msge.post;
        return ok
    } else {
        error.data[0].msge = msge.errorBD;
        return error;
    };
};

// modificar negocio
export async function admin_negocios_put(usuarioAdmin, token, data) {
    // valida que todos los campos tengan datos
    if (!usuarioAdmin || !token) {
        error.data[0].msge = msge.errorCompletar;
        return error;
    };
    // valida token
    const resultadoToken = secretData.validateToken(token);
    if (!resultadoToken[0].estado) {
        error.data[0].msge = resultadoToken[0].msge;
        return error;
    };
    // valida el id
    let { id, nombre, rut, direccion, descripcion, img, check } = data;
    if (isNaN(id)) {
        error.data[0].msge = msge.errorId;
        return error;
    };
    // // valida si el negocio pertenece al usuarioAdmin
    const resultadoNegocio = await pgSql.validarNegocio_ByUsuario(id, usuarioAdmin);
    if (parseInt(resultadoNegocio[0].cant) == 0) {
        error.data[0].msge = msge.errorPermiso;
        return error;
    };
    // se validan los campos
    nombre = nombre ? nombre : "";
    rut = rut ? rut : "";
    direccion = direccion ? direccion : "";
    descripcion = descripcion ? descripcion : "";
    img = img ? img : "";
    check = check == "on" ? true : false;
    // modifica negocio
    const resultado = await pgSql.updateNegocio(id, nombre, rut, direccion, descripcion, img, check);
    if (resultado.length > 0) {
        ok.data[0].msge = msge.put;
        return ok
    } else {
        error.data[0].msge = msge.errorBD;
        return error;
    };
};

// carga todos los usuarios por usuario administrador
export async function admin_usuarios(usuarioAdmin, token) {
    // valida que todos los campos tengan datos
    if (!usuarioAdmin || !token) {
        error.data[0].msge = msge.errorCompletar;
        return error;
    };
    // valida token
    const resultadoToken = secretData.validateToken(token);
    if (!resultadoToken[0].estado) {
        error.data[0].msge = resultadoToken[0].msge;
        error.data[0].estadoToken = false;
        return error;
    } else {
        ok.data[0].estadoToken = true;
    };
    // devuelve los usuarios encontrados
    const arrUsuarios = await pgSql.getUsuarios_ByUsuarioAdmin(usuarioAdmin);
    ok.data[0].usuarios = arrUsuarios;
    return ok;
};

// agreagar nuevo usuario
export async function admin_usuarios_post(usuarioAdmin, token, data) {
    // valida que todos los campos tengan datos
    if (!usuarioAdmin || !token) {
        error.data[0].msge = msge.errorCompletar;
        return error;
    };
    // valida token
    const resultadoToken = secretData.validateToken(token);
    if (!resultadoToken[0].estado) {
        error.data[0].msge = resultadoToken[0].msge;
        error.data[0].estadoToken = false;
        ok.data[0].estadoToken = false;
        return error;
    } else {
        error.data[0].estadoToken = true;
        ok.data[0].estadoToken = true;
    };
    // valida los campos
    let { nombres, apellidos, correo, usuario, clave, estado } = data;
    
    if (!nombres || !apellidos || !correo || !usuario || !clave) {
        error.data[0].msge = msge.errorCompletar;
        return error;
    };
    estado = estado == "on" ? true : false;

    // valida que el correo no exista
    const valCorreo = await pgSql.validar_correo(correo);
    if (valCorreo[0].cont > 0) {
        error.data[0].msge = msge.errorCorreo;
        return error;
    };
    // valida que el usuario no exista
    const valUsuario = await pgSql.validar_usuario(usuario);
    if (valUsuario[0].cont > 0) {
        error.data[0].msge = msge.errorUsuario;
        return error;
    }

console.log(valCorreo)
console.log(valUsuario)

    // registra nuevo usuario
    // const resultado = await pgSql.registrarUsuario(usuarioAdmin, nombres, apellidos, correo, usuario, clave, estado);
    // if (resultado.length > 0) {
    //     ok.data[0].msge = msge.post;
    //     return ok
    // } else {
    //     error.data[0].msge = msge.errorBD;
    //     return error;
    // };
};

// funciones que extraen informacion desde la API -------------------------
// ------------------------------------------------------------------------

// funciones --------------------------------------------------------------
// ------------------------------------------------------------------------

