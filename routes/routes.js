import { Router } from "express";
import SecretData from "../utils/SecretData.js";
import PGSQL from "../utils/PGSQL.js";

const secretData = new SecretData();
const pgSql = new PGSQL();
const misRutas = Router();

export default misRutas;

misRutas.get("/", async (req, res) => {
    res.json(["Kartax's API"]);
});

// publico //------------------------------------------------------------
// ----------------------------------------------------------------------
// obtiene los datos del negocio
misRutas.get("/negocio/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getNegocio_ById(id);
    res.json(resultado);
});

// obtiene los datos del negocio por mesa
misRutas.get("/negocio/idMesa/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getNegocio_ByIdMesa(id);
    res.json(resultado);
});

// obtiene lista de tipo alimentos
misRutas.get("/tipo-alimento/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getTipoAlim_ByIdNegocio(id);
    res.json(resultado);
});

// obtiene toda la lista de categoria item
misRutas.get("/item-categ", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getItemCateg_All();
    res.json(resultado);
});

// obtiene lista de categoria item por id tipo alimentos
misRutas.get("/item-categ/IdTipoAlimento/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getItemCateg_ByIdAlim(id);
    res.json(resultado);
});

// obtiene lista de items por id
misRutas.get("/item/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getItem_ByIdItem(id);
    res.json(resultado);
});

// obtiene lista de items por id categoria de items
misRutas.get("/item/IdCateg/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getItem_ByIdItemCateg(id);
    res.json(resultado);
});

// valida el inicio de sesion generando un token
misRutas.get("/iniciar-sesion/:usuario&:clave", async (req, res) => {
    const { usuario, clave } = req.params;
    const resultado = await pgSql.iniciar_sesion(usuario, clave);

    if (resultado[0].cant > 0) {
        const token = secretData.newToken(usuario, clave, 1);
        res.json([{estado: true, token: token}]);
    } else {
        res.json([{estado: false, token: ""}]);
    };
});

// comanda activa -------------------------------------------------------
// valida si la mesa esta activa y crea la comanda en caso de que no exista
misRutas.get("/mesa/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.transaccion_ValidarComandaYMesa(id);
    console.log(resultado)
    res.json(resultado);
});

// obtien los items de la comanda activa de la mesa
misRutas.get("/comanda-deta/idMesa/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;

    if (id) {
        const resultado = await pgSql.getItemComanda_ByIdMesa(id);
        res.json(resultado);
    } else {
        res.status(400).json("Formato json incorrecto!!");
    }
});

// agrega items a la comanda activa
misRutas.post("/comanda-deta", async (req, res) => {
    const { items, idComanda } = req.body;

    if (items && idComanda) {
        await pgSql.setItem_IntoComanda(items, idComanda);
        res.status(201).json("Datos Ingresados Correctamente!!");
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

// privado --------------------------------------------------------------
// ----------------------------------------------------------------------
misRutas.get("/token/:token", async (req, res) => {
    const { token } = req.params;
    const resultado = secretData.validateToken(token);
    res.json(resultado);
});

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
misRutas.get("/testing", (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

misRutas.get("/upload", async (req, res) => {
    res.send(`
    <form method="POST" enctype="multipart/form-data">
        <input type="file" name="img" required>
        <button>Upload</button>
    </form>`
    );
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
