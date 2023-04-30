import pkg from "pg";
import SecretData from "./SecretData.js";

const { Pool, Client } = pkg;
const secretData = new SecretData(); // la conexion secreta a la bd

export default class PGSQL {
    constructor() {}
    // ----------------------------------------------------------------------
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
    // publico --------------------------------------------------------------
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
    async getItemCategAndItem_ByIdAlim(id_tipo_alimento) {
        return await get_ItemCateg_Items(id_tipo_alimento);
    };
    async getItem_ById(id_item) {
        return await myQuery(
            `SELECT 
                id,
                nombre,
                precio
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
    async setItem_IntoComanda(arrObj, id_comanda) {
        return transaccion_AgregarPedidosAComanda(arrObj, id_comanda)
    };
    async updateItem_OfComanda(arrObj) {
        return transaccion_PagarPedidos(arrObj);
    }
    async validarComandaYMesa(id_mesa) {
        return transaccion_ValidarComandaYMesa(id_mesa);
    };
    // privado --------------------------------------------------------------
    async getUsuario_ByUsuario(usuario) {
        return await myQuery(
            `SELECT
                a.id,
                a.usuario,
                a.nombres,
                a.apellidos,
                a.correo,
                b.nombre AS rol
            FROM usuario a 
                INNER JOIN rol b ON a.id_rol = b.id
            WHERE
                a.is_active = TRUE
                AND a.usuario = $1;`,
            [usuario]
        );
    };
    async getNegocios_ByIdUsuario(id_usuario) {
        return await myQuery(
            `SELECT 
                a.nombre,
                a.rut,
                a.direccion,
                a.descripcion,
                a.logo,
                a.is_active,
                b.fecha
            FROM negocio a 
                INNER JOIN usuario_negocio b ON a.id = b.id_negocio
            WHERE 
                b.id_usuario = $1;`,
            [id_usuario]
        );
    };
    // ----------------------------------------------------------------------
};

// funcion que ejecuta todas las querys de la clase
async function myQuery(sql, values) {
    const client = new Client(secretData.conexionPG());
    let resultado = [];

    try {
        await client.connect();
        const res = await client.query(sql, values);
        resultado = res.rows;
    } catch (err) {
        console.log(err);
    } finally {
        await client.release;
        await client.end();
    };

    return resultado;
};

// transaccion que valida la disponibilidad de la mesa y crea comanda si es que no existe
async function transaccion_ValidarComandaYMesa(id_mesa) {
    const pool = new Pool(secretData.conexionPG());

    const resultado = [];

    try {
        await pool.connect();
        await pool.query("BEGIN");

        const res1 = await pool.query("SELECT b.id FROM mesa a INNER JOIN comanda b ON a.id = b.id_mesa WHERE b.is_active = TRUE AND b.id_mesa = $1;", [id_mesa]);
        const res2 = await pool.query("SELECT COUNT(id) AS cont FROM mesa WHERE is_active = TRUE AND id = $1;", [id_mesa]);

        if (res1.rows.length > 0) {
            resultado.push({id_comanda: res1.rows[0].id});
        } else {
            if (res2.rows[0].cont > 0) {
                const res3 = await pool.query("INSERT INTO comanda (fecha, is_active, id_mesa) VALUES (NOW(), TRUE, $1) RETURNING id;", [id_mesa]);
                
                resultado.push({id_comanda: res3.rows[0].id});
            };
        };

        console.log("Transaccion Exitosa!!!");
        await pool.query("COMMIT");
    } catch (err) {
        await pool.query("ROLLBACK");
        console.log("Transaccion Cancelada!!!");
        console.log(err);
    } finally {
        await pool.release;
        pool.end();
    };

    return resultado;
};

// transaccion agregar pedidos
async function transaccion_AgregarPedidosAComanda(arrObj, id_comanda) {
    const pool = new Pool(secretData.conexionPG());

    const resultado = [];

    try {
        await pool.connect();
        await pool.query("BEGIN");

        // valida si la comanda esta activa
        const res = await pool.query("SELECT id FROM comanda WHERE is_active = TRUE AND id = $1;", [id_comanda]);

        // ingresa pedidos si esta activa
        if (res.rows.length > 0) {
            await arrObj.reduce(async (acc, e) => {
                await acc;
                const id = await pool.query(`INSERT INTO comanda_deta (fecha, id_item, id_comanda) VALUES (NOW(), $1, $2) RETURNING id`, [e.idItem, id_comanda]);
                resultado.push({id_pedido: id.rows[0].id})
            }, Promise.resolve());
        };

        console.log("Transaccion Exitosa!!!");
        await pool.query("COMMIT");
    } catch (err) {
        await pool.query("ROLLBACK");
        console.log("Transaccion Cancelada!!!");
        console.log(err);
    } finally {
        await pool.release;
        pool.end();
    };

    return resultado;
};

// transaccion pagar pedido
async function transaccion_PagarPedidos(arrObj) {
    const pool = new Pool(secretData.conexionPG());

    const resultado = [];

    try { 
        await pool.connect();
        await pool.query("BEGIN");

        await arrObj.reduce(async (acc, e) => {
            await acc;
            const id = await pool.query("DELETE FROM public.comanda_deta WHERE id = $1 RETURNING id", [parseInt(e.id)]);
            resultado.push({pedido_eliminado: id.rows[0].id})
        }, Promise.resolve());

        // await Promise.all(arrObj.map(async (e) => {
        //     const res = await pool.query("DELETE FROM public.comanda_deta WHERE id = $1 RETURNING id", [parseInt(e.id)]);
        //     resultado.id.push(res.rows[0].id);
        //     console.table(res.rows);
        // }));

        console.log("Transaccion Exitosa!!!");
        await pool.query("COMMIT");
    } catch (err) {
        await pool.query("ROLLBACK");
        console.log("Transaccion Cancelada!!!");
        console.log(err);
    } finally {
        await pool.release;
        pool.end();
    };

    return resultado;
};

// Funcion que carga la categorias de item con sus items para el front
async function get_ItemCateg_Items(id_tipo_alimento) {
    const pool = new Pool(secretData.conexionPG());

    const resultado = [];

    try {
        await pool.connect();
        await pool.query("BEGIN");

        // obtiene todas las categorias por tipo alimento
        const itemCateg = await pool.query("SELECT id, nombre FROM item_categ WHERE id_tipo_alimento = $1;", [id_tipo_alimento]);

        // obtiene todos los items por categoria
        await itemCateg.rows.reduce(async (acc, e) => {
            await acc;

            const items = await pool.query("SELECT id, nombre, descripcion, precio, img FROM item WHERE is_active = TRUE AND id_item_categ = $1", [e.id]);
            e.items = items.rows;
            resultado.push(e);
        }, Promise.resolve());

        console.log("Transaccion Exitosa!!!");
        await pool.query("COMMIT");
    } catch (err) {
        await pool.query("ROLLBACK");
        console.log("Transaccion Cancelada!!!");
        console.log(err);
    } finally {
        await pool.release;
        pool.end();
    };

    return resultado;
}