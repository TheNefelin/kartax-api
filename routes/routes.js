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

// publico --------------------------------------------------------------
// ----------------------------------------------------------------------
misRutas.get("/negocio/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getNegocio_ById(id);
    res.json(resultado);
});

misRutas.get("/negocio/idMesa/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getNegocio_ByIdMesa(id);
    res.json(resultado);
});

misRutas.get("/tipo-alimento/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getTipoAlim_ByIdNegocio(id);
    res.json(resultado);
});

misRutas.get("/item-categ", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getItemCateg_All();
    res.json(resultado);
});

misRutas.get("/item-categ/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getItemCateg_ByIdAlim(id);
    res.json(resultado);
});

misRutas.get("/item/:id", async (req, res) => {
    const id = isNaN(req.params.id) ? 0: req.params.id;
    const resultado = await pgSql.getItem_ByIdItemCateg(id);
    res.json(resultado);
});

misRutas.get("/iniciar-sesion/:usuario&:clave", async (req, res) => {
    const { usuario, clave } = req.params;
    const resultado = await pgSql.iniciar_sesion(usuario, clave);

    if (resultado[0].cant > 0) {
        const token = secretData.newToken(usuario, clave, 60);
        res.json([{estado: true, token: token}]);
    } else {
        res.json([{estado: false, token: ""}]);
    };
});

// privado --------------------------------------------------------------
// ----------------------------------------------------------------------
misRutas.get("/token/:token", async (req, res) => {
    const { token } = req.params;
    const resultado = secretData.validateToken(token);
    res.json(resultado);
});

// funciones ------------------------------------------------------------
// ----------------------------------------------------------------------
function validarToken(token) {
    const resultado = secretData.validateToken(token);

    if (resultado.estado) {
        return true;
    } else {
        return false;
    };
};

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
