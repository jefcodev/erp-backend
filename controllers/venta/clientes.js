const { response } = require("express");
const { validationResult } = require("express-validator");
const { generarJWT } = require("../../helpers/jwt");
const { db_postgres } = require("../../database/config");

// Obtener todos los clientes
const getClientes = async (req, res) => {
    try {
        const clientes = await db_postgres.query("SELECT * FROM vent_clientes ORDER BY id_cliente DESC");
        
        res.json({
            ok: true,
            clientes,
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

// Crear un nuevo cliente
const createCliente = async (req, res = response) => {
    const { identificacion, nombre, apellido, direccion, telefono, email } = req.body;
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
            "INSERT INTO vent_clientes (identificacion, nombre, apellido, direccion, telefono, email, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [identificacion, nombre, apellido, direccion, telefono, email, true]
        );
        const token = await generarJWT(cliente.id_cliente);
        res.json({
            ok: true,
            msg: "Cliente creado correctamente.",
            cliente,
            token: token,
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
    const { nombre, apellido, direccion, telefono, email } = req.body;
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
            "UPDATE vent_clientes SET nombre = $1, apellido = $2, direccion = $3, telefono = $4, email = $5 WHERE id_cliente = $6 RETURNING *",
            [nombre, apellido, direccion, telefono, email, id_cliente]
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
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
};
