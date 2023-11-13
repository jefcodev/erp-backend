const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todos los tarifas IVA
const getTarifasIVA = async (req, res) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limit);
        const query = `SELECT * FROM cont_tarifas_iva ORDER BY id_tarifa_iva DESC OFFSET $1 LIMIT $2;`;
        const queryCount = `SELECT COUNT(*) FROM cont_tarifas_iva;`;
        const [tarifas_iva, total] = await Promise.all([
            db_postgres.query(query, [desde, limit]),
            db_postgres.one(queryCount),
        ]);
        res.json({
            ok: true,
            tarifas_iva,
            total: total.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener las tarifas IVA.",
        });
    }
};

// Obtener todos las tarifas IVA
const getTarifasIVAAll = async (req, res) => {
    try {
        const queryAll = `SELECT * FROM cont_tarifas_iva ORDER BY id_tarifa_iva DESC;`;
        const queryCount = `SELECT COUNT(*) FROM cont_tarifas_iva;`;
        const [tarifas_iva, total] = await Promise.all([
            db_postgres.query(queryAll),
            db_postgres.one(queryCount),
        ]);
        res.json({
            ok: true,
            tarifas_iva,
            total: total.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener las tarifas IVA.",
        });
    }
};

// Obtener tarifa IVA por su ID
const getTarifaIVAById = async (req, res) => {
    try {
        const id_tarifa_iva = req.params.id;
        const tarifa_iva = await db_postgres.query("SELECT * FROM cont_tarifas_iva WHERE id_tarifa_iva = $1", [id_tarifa_iva]);
        if (!tarifa_iva) {
            return res.status(404).json({
                ok: false,
                msg: "Tarifa IVA no encontrado.",
            });
        }
        res.json({
            ok: true,
            tarifa_iva,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el tarifa_iva.",
        });
    }
};


// Crear tarifa IVA
const createTarifaIVA = async (req, res = response) => {
    const { codigo, descripcion, porcentaje } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array(),
            msg: "Datos no válidos. Por favor, verifica los campos.",
        });
    }
    try {
        const codigoExists = await db_postgres.oneOrNone("SELECT * FROM cont_tarifas_iva WHERE codigo = $1", [codigo]);
        if (codigoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El código ya existe. Por favor, proporciona un código único.",
            });
        }

        const tarifa_iva = await db_postgres.one(
            "INSERT INTO cont_tarifas_iva (codigo, descripcion, porcentaje, estado) VALUES ($1, $2, $3, $4) RETURNING *",
            [codigo, descripcion, porcentaje, true]
        );
        res.json({
            ok: true,
            msg: "Tarifa IVA creado correctamente.",
            tarifa_iva,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear el tarifa IVA. Por favor, inténtalo de nuevo.",
        });
    }
};

// Actualizar tarifa IVA
const updateTarifaIVA = async (req, res = response) => {
    const id_tarifa_iva = req.params.id;
    const { descripcion, porcentaje } = req.body;
    try {
        const tarifaIVAExists = await db_postgres.oneOrNone("SELECT * FROM cont_tarifas_iva WHERE id_tarifa_iva = $1", [id_tarifa_iva]);
        if (!tarifaIVAExists) {
            return res.status(400).json({
                ok: false,
                msg: "La tarifa IVA no existe. Por favor, proporciona un ID de tarifa iva válida.",
            });
        }
        const tarifaIVAUpdate = await db_postgres.one(
            "UPDATE cont_tarifas_iva SET descripcion = $1, porcentaje = $2 WHERE id_tarifa_iva = $3 RETURNING *",
            [descripcion, porcentaje, id_tarifa_iva]
        );
        res.json({
            ok: true,
            msg: "Tarifa IVA actualizado correctamente.",
            tarifaIVAUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar tarifa IVA. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar o activar una tarifa IVA
const deleteTarifaIVA = async (req, res = response) => {
    const id_tarifa_iva = req.params.id;
    try {
        const tarifa_ivaExists = await db_postgres.oneOrNone("SELECT * FROM cont_tarifas_iva WHERE id_tarifa_iva = $1", [id_tarifa_iva]);
        if (!tarifa_ivaExists) {
            return res.status(400).json({
                ok: false,
                msg: "La tarifa IVA no existe. Por favor, proporciona un ID de tarifa iva válido.",
            });
        }
         // Cambiar el estado de la tarifa IVA
         const nuevoEstado = !tarifa_ivaExists.estado; // Cambiar el estado actual al opuesto
         const query = "UPDATE cont_tarifas_iva SET estado = $1 WHERE id_tarifa_iva = $2 RETURNING *";
         const tarifaIVAToggle = await db_postgres.query(query, [nuevoEstado, id_tarifa_iva]);
 
         res.json({
             ok: true,
             msg: `Tarifa IVA ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`,
             tarifaIVAToggle,
         });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar la tarifa IVA. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getTarifasIVA,
    getTarifasIVAAll,
    getTarifaIVAById,
    createTarifaIVA,
    updateTarifaIVA,
    deleteTarifaIVA,
};
