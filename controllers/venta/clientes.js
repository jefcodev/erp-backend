const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todos los clientes con un limite
const getClientes = async (req, res) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limit);
        const queryClientes = `SELECT * FROM vent_clientes ORDER BY id_cliente DESC OFFSET $1 LIMIT $2;`;
        const queryClientesCount = `SELECT COUNT(*) FROM vent_clientes`;
        const [clientes, total] = await Promise.all([
            db_postgres.query(queryClientes, [desde, limit]),
            db_postgres.one(queryClientesCount),
        ]);
        res.json({
            ok: true,
            clientes,
            total: total.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los clientes.",
        });
    }
};

// Obtener todos los clientes
const getClientesAll = async (req, res) => {
    try {
        const queryAll = `SELECT * FROM vent_clientes ORDER BY id_cliente DESC;`;
        const queryCount = `SELECT COUNT(*) FROM vent_clientes;`;
        const [clientes, total] = await Promise.all([
            db_postgres.query(queryAll),
            db_postgres.one(queryCount),
        ]);
        console.log("get all clientes: ", total.count)
        res.json({
            ok: true,
            clientes,
            total: total.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los clientes.",
        });
    }
};

// Obtener un cliente por su ID
const getClienteById = async (req, res) => {
    try {
        const id_cliente = req.params.id;

        const cliente = await db_postgres.query("SELECT * FROM vent_clientes WHERE id_cliente = $1", [id_cliente]);

        if (!cliente) {
            return res.status(404).json({
                ok: false,
                msg: "Cliente no encontrado.",
            });
        }
        res.json({
            ok: true,
            cliente,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el cliente.",
        });
    }
};

// Obtener un cliente por su identificación
const getClienteByIndentificacion = async (req, res) => {
    try {
        const identificacion = req.params.identificacion;
        if (!identificacion) {
            return res.status(400).json({
                ok: false,
                msg: "La identificación es requerida.",
            });
        }

        const proveedor = await db_postgres.query(`SELECT * FROM vent_clientes WHERE identificacion = $1;`, [identificacion]);

        if (!proveedor) {
            return res.status(404).json({
                ok: false,
                msg: "Proveedor no encontrado.",
            });
        }
        res.json({
            ok: true,
            proveedor,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el proveedor.",
        });
    }
};


// Crear un nuevo cliente
const createCliente = async (req, res = response) => {
    const { identificacion, razon_social, direccion, telefono, email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array(),
            msg: "Datos no válidos. Por favor, verifica los campos.",
        });
    }
    try {
        const identificacionExists = await db_postgres.oneOrNone("SELECT * FROM vent_clientes WHERE identificacion = $1", [identificacion]);
        if (identificacionExists) {
            return res.status(400).json({
                ok: false,
                msg: "La identificación ya existe. Por favor, proporciona una identificación única.",
            });
        }
        const emailExists = await db_postgres.oneOrNone("SELECT * FROM vent_clientes WHERE email = $1", [email]);
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: "El email ya existe. Por favor, proporciona un email único.",
            });
        }
        const cliente = await db_postgres.one(
            "INSERT INTO vent_clientes (identificacion, razon_social, direccion, telefono, email, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [identificacion, razon_social, direccion, telefono, email, true]
        );
        res.json({
            ok: true,
            msg: "Cliente creado correctamente.",
            cliente,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear el cliente. Por favor, inténtalo de nuevo.",
        });
    }
};

// Actualizar un cliente
const updateCliente = async (req, res = response) => {
    const id_cliente = req.params.id;
    const { razon_social, direccion, telefono, email } = req.body;
    try {
        const clienteExists = await db_postgres.oneOrNone("SELECT * FROM vent_clientes WHERE id_cliente = $1", [id_cliente]);
        if (!clienteExists) {
            return res.status(400).json({
                ok: false,
                msg: "El cliente no existe. Por favor, proporciona un ID de cliente válido.",
            });
        }
        const emailExists = await db_postgres.oneOrNone("SELECT * FROM vent_clientes WHERE email = $1 AND id_cliente != $2", [email, id_cliente]);
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: "El correo electrónico ya está en uso. Por favor, proporciona un correo electrónico único.",
            });
        }
        const clienteUpdate = await db_postgres.one(
            "UPDATE vent_clientes SET razon_social = $1, direccion = $2, telefono = $3, email = $4 WHERE id_cliente = $5 RETURNING *",
            [razon_social, direccion, telefono, email, id_cliente]
        );
        res.json({
            ok: true,
            msg: "Cliente actualizado correctamente.",
            clienteUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el cliente. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar un cliente
const deleteCliente = async (req, res = response) => {
    const id_cliente = req.params.id;
    try {
        const clienteExists = await db_postgres.oneOrNone("SELECT * FROM vent_clientes WHERE id_cliente = $1", [id_cliente]);
        if (!clienteExists) {
            return res.status(400).json({
                ok: false,
                msg: "El cliente no existe. Por favor, proporciona un ID de cliente válido.",
            });
        }
        const clienteDelete = await db_postgres.query("UPDATE vent_clientes SET estado = $1 WHERE id_cliente = $2 RETURNING *", [false, id_cliente]);
        res.json({
            ok: true,
            msg: "Cliente borrado correctamente.",
            clienteDelete,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar el cliente. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getClientes,
    getClientesAll,
    getClienteById,
    getClienteByIndentificacion,
    createCliente,
    updateCliente,
    deleteCliente,
};
