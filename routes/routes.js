import { Router, json } from "express";
import * as fn from "../utils/funciones.js"

import SecretData from "../utils/SecretData.js";
import PGSQL from "../utils/PGSQL.js";

const secretData = new SecretData();
const pgSql = new PGSQL();

const misRutas = Router();
const api_version = "/api/v1"

export default misRutas;

misRutas.get("/", async (req, res) => {
    res.json(["Kartax's API Running"]);
});

// publico //------------------------------------------------------------ //
// ---------------------------------------------------------------------- //

// datos del front Tipo Alimento, Categoria Item, Items -----------------

// obtiene los datos del negocio por idMesa
misRutas.get("/negocio/idMesa/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getNegocio_ByIdMesa(id);
    res.status(resultado.length > 0 ? 201 : 400).json(resultado);
});

// obtiene lista de tipo alimentos por IdNegocio
misRutas.get("/tipo-alimento/:idNegocio", async (req, res) => {
    const id = isNaN(req.params.idNegocio) ? 0: req.params.idNegocio;
    const resultado = await pgSql.getTipoAlim_ByIdNegocio(id);
    res.status(resultado.length > 0 ? 201 : 400).json(resultado);
});

// obtien todas la categorias de item y los items por idTipoAlimento
misRutas.get("/item-categ-e-items/:idTipoAlim", async (req, res) => {
    const id = isNaN(req.params.idTipoAlim) ? 0: req.params.idTipoAlim;
    const resultado = await pgSql.getItemCategAndItem_ByIdAlim(id);
    res.status(resultado.length > 0 ? 201 : 400).json(resultado);
});

// obtiene lista de items por id categoria de items
misRutas.get("/item/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getItem_ById(id);
    res.status(resultado.length > 0 ? 201 : 400).json(resultado);
});

// comanda activa -------------------------------------------------------

// valida si la mesa esta activa y crea la comanda en caso de que no exista
misRutas.get("/mesa/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.validarComandaYMesa(id);
    res.status(resultado.length > 0 ? 201 : 400).json(resultado);
});

// obtien los items de la comanda activa de la mesa
misRutas.get("/comanda-deta/idMesa/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getItemComanda_ByIdMesa(id);
    res.status(201).json(resultado);
});

// agrega items a la comanda activa
misRutas.post("/comanda-deta", async (req, res) => {
    const { items, idComanda } = req.body;

    if (items && idComanda) {
        const resultado = await pgSql.setItem_IntoComanda(items, idComanda);
        res.status(201).json(resultado);
    } else {
        res.status(400).json("Formato json incorrecto!!");
    };
});

// pagar items de la comanda activa
misRutas.put("/comanda-deta", async (req, res) => {
    const { arrItem } = req.body;

    if (arrItem) {
        const resultado = await pgSql.updateItem_OfComanda(arrItem);
        res.status(201).json(resultado);
    } else {
        res.status(400).json("Formato json incorrecto!!");
    }
});

// registrar una nueva cuenta
misRutas.post("/registrar-usuario", async (req, res) => {
    const { txtNombres, txtApellidos, txtUser, txtEmail, txtPass1, txtPass2 } = req.body;
    const resultado = await fn.registrarse(txtNombres, txtApellidos, txtUser, txtEmail, txtPass1, txtPass2);
    console.log(resultado);
    res.status(resultado.cod).json(resultado.data);
});

// inicia sesion y devuelve un token en resultado.data
misRutas.post("/iniciar-sesion", async (req, res) => {
    const { txtUser, txtPass } = req.body;
    const resultado = await fn.iniciar_sesion(txtUser, txtPass);
    console.log(resultado);
    res.status(resultado.cod).json(resultado.data);
});

//valida el token
misRutas.get("/token/:token", async (req, res) => {
    const { token } = req.params;
    const resultado = secretData.validateToken(token);
    console.log(resultado);
    res.json(resultado);
});

// privado -------------------------------------------------------------- //
// ---------------------------------------------------------------------- //
misRutas.get("/admin/:usuario&:token", async (req, res) => {
    const { usuario, token } = req.params;
    const resultado = await fn.admin(usuario, token);
    res.status(resultado.cod).json(resultado.data);
});

misRutas.get("/admin/negocios/:usuario&:token", async (req, res) => {
    const { usuario, token } = req.params;
    const resultado = await fn.admin_negocios(usuario, token);
    console.log(resultado);
    res.status(resultado.cod).json(resultado.data);
});

misRutas.post("/admin/negocios", async (req, res) => {
    const { usuario, token, data } = req.body;
    const resultado = await fn.admin_negocios_post(usuario, token, data);
    console.log(resultado);
    res.status(resultado.cod).json(resultado.data);
});

misRutas.put("/admin/negocios", async (req, res) => {
    const { usuario, token, data } = req.body;
    console.log(req.files)
    const resultado = await fn.admin_negocios_put(usuario, token, data);
    console.log(resultado);
    res.status(resultado.cod).json(resultado.data);
});

misRutas.get("/admin/usuarios/:usuario&:token", async (req, res) => {
    const { usuario, token } = req.params;
    const resultado = await fn.admin_usuarios(usuario, token);
    console.log(resultado);
    res.status(resultado.cod).json(resultado.data);
});

misRutas.post("/admin/usuarios", async (req, res) => {
    const { usuario, token, data } = req.body;
    const resultado = await fn.admin_usuarios_post(usuario, token, data);
    console.log(resultado);
    res.status(resultado.cod).json(resultado.data);
});

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

misRutas.get("/encuesta", async (req, res) => {
    const resultado = await fn.encuesta_get();
    console.log(resultado);
    res.status(resultado.cod).json(resultado.data);
});

misRutas.post("/encuesta", async (req, res) => {
    const resultado = await fn.encuesta_post(req.body);
    console.log(resultado);
    res.status(resultado.cod).json(resultado.data);
});

misRutas.post("/upload", (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No ha Enviado Archivo")
    };

    const archivo = req.files.img;
    const ruta = `${secretData.ruta()}/img/${archivo.name}`;

    archivo.mv(ruta, (err) => {
        if (err)
            return res.status(500).send(err);

        res.send("Archivo Cargado");
    });
});

misRutas.get("*", (req, res) => {
    res.redirect("/");
});
