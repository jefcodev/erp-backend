const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todos los pagos con un limite
const getPagos = async (req, res) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limit);
        const query = `SELECT * FROM cont_pagos ORDER BY id_pago DESC OFFSET $1 LIMIT $2;`;
        const queryCount = `SELECT COUNT(*) FROM cont_pagos;`;
        const [pagos, total] = await Promise.all([
            db_postgres.query(query, [desde, limit]),
            db_postgres.one(queryCount),
        ]);
        res.json({
            ok: true,
            pagos,
            total: total.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los pagos.",
        });
    }
};

// Obtener todos los pagos con un limite y busqueda
const getPagosSearch = async (req, res) => {
    try {
        const search = req.query.search || ''; // Obtener la cadena de búsqueda desde la URL
        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limit);

        const queryPagos = `
        SELECT * FROM cont_pagos
        WHERE identificacion ILIKE '%' || $1 || '%' or
            razon_social ILIKE '%' || $1 || '%' OR
            direccion ILIKE '%' || $1 || '%'
        ORDER BY id_pago DESC
        OFFSET $2 LIMIT $3;
        `;
        const queryPagosCount = `SELECT COUNT(*) FROM cont_pagos;`;
        const [pagos, total] = await Promise.all([
            db_postgres.query(queryPagos, [`%${search}%`, desde, limit]),
            db_postgres.one(queryPagosCount),
        ]);
        res.json({
            ok: true,
            pagos,
            total: total.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los pagos.",
        });
    }
};

// Obtener todos los pagos
const getPagosAll = async (req, res) => {
    try {
        const queryAll = `SELECT * FROM cont_pagos ORDER BY id_pago DESC;`;
        const queryCount = `SELECT COUNT(*) FROM cont_pagos;`;
        const [pagos, total] = await Promise.all([
            db_postgres.query(queryAll),
            db_postgres.one(queryCount),
        ]);
        res.json({
            ok: true,
            pagos,
            total: total.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los pagos.",
        });
    }
};

// Obtener un pago por su ID
const getPagoById = async (req, res) => {
    try {
        const id_pago = req.params.id;
        const pago = await db_postgres.query("SELECT * FROM cont_pagos WHERE id_pago = $1", [id_pago]);
        if (!pago) {
            return res.status(404).json({
                ok: false,
                msg: "Pago no encontrado.",
            });
        }
        res.json({
            ok: true,
            pago,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el pago.",
        });
    }
};

// Obtener un pago por su identificación
const getPagoByIndentificacion = async (req, res) => {
    try {
        const identificacion = req.params.identificacion;
        if (!identificacion) {
            return res.status(400).json({
                ok: false,
                msg: "La identificación es requerida.",
            });
        }
        const pago = await db_postgres.query(`SELECT * FROM cont_pagos WHERE identificacion = $1;`, [identificacion]);
        if (!pago) {
            return res.status(404).json({
                ok: false,
                msg: "Pago no encontrado.",
            });
        }
        res.json({
            ok: true,
            pago,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el pago.",
        });
    }
};

// Crear un nuevo pago
const createPago = async (req, res = response) => {
    const { identificacion, razon_social, nombre_comercial, direccion, telefono, email, tipo_contribuyente, regimen, categoria, obligado_contabilidad, agente_retención, contribuyente_especial } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array(),
            msg: "Datos no válidos. Por favor, verifica los campos.",
        });
    }
    try {
        const identificacionExists = await db_postgres.oneOrNone("SELECT * FROM cont_pagos WHERE identificacion = $1", [identificacion]);
        if (identificacionExists) {
            return res.status(400).json({
                ok: false,
                msg: "La identificación ya existe. Por favor, proporciona una identificación única.",
            });
        }
        const emailExists = await db_postgres.oneOrNone("SELECT * FROM cont_pagos WHERE email = $1", [email]);
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: "El email ya existe. Por favor, proporciona un email único.",
            });
        }
        const pago = await db_postgres.one(
            "INSERT INTO cont_pagos (identificacion, razon_social, nombre_comercial, direccion, telefono, email, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [identificacion, razon_social, nombre_comercial, direccion, telefono, email, true]
        );
        res.json({
            ok: true,
            msg: "Pago creado correctamente.",
            pago,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear el pago. Por favor, inténtalo de nuevo.",
        });
    }
};

// Actualizar un pago
const updatePago = async (req, res = response) => {
    const id_pago = req.params.id;
    const { razon_social, nombre_comercial, direccion, telefono, email } = req.body;
    try {
        const pagoExists = await db_postgres.oneOrNone("SELECT * FROM cont_pagos WHERE id_pago = $1", [id_pago]);
        if (!pagoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El pago no existe. Por favor, proporciona un ID de pago válido.",
            });
        }
        const emailExists = await db_postgres.oneOrNone("SELECT * FROM cont_pagos WHERE email = $1 AND id_pago != $2", [email, id_pago]);
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: "El correo electrónico ya está en uso. Por favor, proporciona un correo electrónico único.",
            });
        }
        const pagoUpdate = await db_postgres.one(
            "UPDATE cont_pagos SET razon_social = $1, nombre_comercial = $2, direccion = $3, telefono = $4, email = $5 WHERE id_pago = $6 RETURNING *",
            [razon_social, nombre_comercial, direccion, telefono, email, id_pago]
        );
        res.json({
            ok: true,
            msg: "Pago actualizado correctamente.",
            pagoUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el pago. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar un pago
const deletePago = async (req, res = response) => {
    const id_pago = req.params.id;
    try {
        const pagoExists = await db_postgres.oneOrNone("SELECT * FROM cont_pagos WHERE id_pago = $1", [id_pago]);
        if (!pagoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El pago no existe. Por favor, proporciona un ID de pago válido.",
            });
        }
        const pagoDelete = await db_postgres.query("UPDATE cont_pagos SET estado = $1 WHERE id_pago = $2 RETURNING *", [false, id_pago]);
        res.json({
            ok: true,
            msg: "Pago borrado correctamente.",
            pagoDelete,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar el pago. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getPagos,
    getPagosSearch,
    getPagosAll,
    getPagoById,
    getPagoByIndentificacion,
    createPago,
    updatePago,
    deletePago,
};
