import pkg from "pg";
import SecretData from "./SecretData.js";

const { Pool, Client } = pkg;
const secretData = new SecretData();

export default class PGSQL {
    constructor() {

    }
    async iniciar_sesion(usuario, clave) {
        return await myQuery(
            `SELECT 
                COUNT(id) AS cant 
            FROM usuario 
            WHERE 
                usuario = $1 
                AND clave = crypt($2, clave);`, 
            [usuario, clave]
        );
    };
    async getNegocio_ById(id_negocio) {
        return await myQuery(
            `SELECT 
                id, 
                nombre, 
                logo
            FROM negocio
            WHERE 
                is_active = TRUE 
                AND id = $1;`,
            [id_negocio]
        );
    };
    async getNegocio_ByIdMesa(id_mesa) {
        return await myQuery(
            `SELECT 
                b.id,
                b.nombre,
                b.logo,
                a.id AS id_mesa 
            FROM mesa a 
                INNER JOIN negocio b ON b.id = a.id_negocio
            WHERE
                a.id = $1
                AND a.is_active = TRUE
                AND b.is_active = TRUE;`,
            [id_mesa]
        );
    };
    async getTipoAlim_ByIdNegocio(id_negocio) {
        return await myQuery(
            `SELECT 
                id, 
                nombre, 
                img
            FROM tipo_alimento
            WHERE 
                is_active = TRUE 
                AND id_negocio = $1;`,
            [id_negocio]
        );
    };
    async getItemCateg_All() {
        return await myQuery(
            `SELECT 
                id, 
                nombre
            FROM item_categ;`,
            []
        );
    }
    async getItemCateg_ByIdAlim(id_tipo_alimento) {
        return await myQuery(
            `SELECT 
                id,
                nombre
            FROM item_categ
            WHERE 
                id_tipo_alimento = $1;`,
            [id_tipo_alimento]
        );
    };
    async getItem_ByIdItemCateg(id_item_categ) {
        return await myQuery(
            `SELECT 
                id,
                nombre,
                descripcion,
                precio,
                img
            FROM item
            WHERE 
                is_active = TRUE
                AND id_item_categ = $1;`,
            [id_item_categ]
        );
    };
};

async function myQuery(sql, values) {
    const client = new Client(secretData.conexionPG());
    let resultado;

    try {
        await client.connect();
        console.log("+ pg Abrir");
        const res = await client.query(sql, values);
        resultado = res.rows;
    } catch (err) {
        console.log(err);
        resultado = [];
    } finally {
        await client.release;
        await client.end();
        console.log("- pg cerrar");
    };

    return resultado;
};

async function transaccionSetUsuario(idNegocio, values) {
    const pool = new Pool(conexion);
    let resultado;

    try {
        await pool.connect()
        await pool.query("BEGIN");

        const res1 = await pool.query("INSERT INTO usuario (nombres, apellidos, correo, usuario, clave, is_active, id_rol) VALUES ($1, $2, $3, $4, crypt($5, gen_salt('bf')), $6, $7) RETURNING id", values);
        console.table(res1.rows)
        const res2 = await pool.query("INSERT INTO usuario_negocio (id_usuario, id_negocio, fecha) VALUES ($1, $2, NOW()) RETURNING *", [res1.rows[0].id, idNegocio]);
        console.table(res2.rows)

        await pool.query("COMMIT");
        resultado = res2.rows
    } catch (err) {
        await pool.query("ROLLBACK");
        console.log(err);
        resultado = [];
    } finally {
        await pool.release;
        pool.end;
    };

    return resultado;
};
