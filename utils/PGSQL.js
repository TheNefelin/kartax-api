import pkg from "pg";
import SecretData from "./SecretData.js";

const { Pool, Client } = pkg;
const secretData = new SecretData(); // la conexion secreta a la bd

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
    async getItem_ByIdItem(id_item) {
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
                AND id = $1;`,
            [id_item]
        );
    };
    // comanda activa -------------------------------------------------------
    async getItemComanda_ByIdMesa(id_mesa) {
        return await myQuery(
            `SELECT 
                b.id_comanda,
                b.id,
                b.id_item,
                c.nombre,
                c.precio,
                c.is_active
            FROM comanda a 
                INNER JOIN comanda_deta b ON b.id_comanda = a.id
                INNER JOIN item c ON c.id = b.id_item
            WHERE
                a.id_mesa = $1
                AND a.is_active = TRUE
            ORDER BY
                c.nombre;`,
            [id_mesa]
        );
    };
    async setItem_IntoComanda(arrItem, id_comanda) {
        const resultado = await myQuery("SELECT id FROM comanda WHERE is_active = TRUE AND id = $1;", [id_comanda]);
        if (resultado.length > 0) {
            arrItem.forEach(async e => {
                const id_item = e.idItem;

                await myQuery(
                    `INSERT INTO comanda_deta 
                        (fecha, id_item, id_comanda)
                    VALUES
                        (NOW(), $1, $2)`,
                    [id_item, id_comanda]
                );
            });
        };
    };
    async updateItem_OfComanda(arrObj) {
        return transaccion_PagarPedidos(arrObj);
    }
    // ----------------------------------------------------------------------
    async transaccion_ValidarComandaYMesa(id_mesa) {
        return validarComandaYMesa(id_mesa);
    };
};

// funcion que ejecuta todas las querys de la clase
async function myQuery(sql, values) {
    const client = new Client(secretData.conexionPG());
    let resultado;

    try {
        await client.connect();
        const res = await client.query(sql, values);
        resultado = res.rows;
    } catch (err) {
        console.log(err);
        resultado = [];
    } finally {
        await client.release;
        await client.end();
    };

    return resultado;
};

// transaccion que valida la disponibilidad de la mesa y crea comanda si es que no existe
async function validarComandaYMesa(id_mesa) {
    const pool = new Pool(secretData.conexionPG());

    const resultado = {
        estado: false,
        msge: "",
        idComanda: 0,
    };

    try {
        await pool.connect();
        await pool.query("BEGIN");

        const res1 = await pool.query("SELECT b.id FROM mesa a INNER JOIN comanda b ON a.id = b.id_mesa WHERE b.is_active = TRUE AND b.id_mesa = $1;", [id_mesa]);
        const res2 = await pool.query("SELECT COUNT(id) AS cont FROM mesa WHERE is_active = TRUE AND id = $1;", [id_mesa]);

        if (res1.rows.length > 0) {
            resultado.estado = true;
            resultado.msge = "Comanda Abierta";
            resultado.idComanda = res1.rows[0].id;
        } else {
            if (res2.rows[0].cont > 0) {
                const res3 = await pool.query("INSERT INTO comanda (fecha, is_active, id_mesa) VALUES (NOW(), TRUE, $1) RETURNING id;", [id_mesa]);
                
                resultado.estado = true;
                resultado.msge = "Mesa Disponible";
                resultado.idComanda = res3.rows[0].id;
            } else {
                resultado.estado = false;
                resultado.msge = "Mesa Cerrada";
            };
        };

        await pool.query("COMMIT");
    } catch (err) {
        await pool.query("ROLLBACK");
        resultado.estado = false;
        resultado.msge = err;
    } finally {
        await pool.release;
        pool.end();
    };

    return [resultado];
};

// transaccion pagar pedido
async function transaccion_PagarPedidos(arrObj) {
    const pool = new Pool(secretData.conexionPG());

    const resultado = {
        estado: false,
        msge: "",
        idComanda: 0,
    };

    try { 
        await pool.connect();
        await pool.query("BEGIN");

        arrObj.forEach(e => {
            console.log(e)
        });

        await pool.query("COMMIT");
    } catch (err) {
        await pool.query("ROLLBACK");
        resultado.estado = false;
        resultado.msge = err;
    } finally {
        await pool.release;
        pool.end();
    };
};