const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todos los asientos con un limite
const getAsientos = async (req, res) => {
    console.log("lleva asientos limit")
    try {

        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limit);
        console.log("req: ", req.query)
        console.log("desde: ", desde)
        console.log("limit: ", limit)

        const queryAsientos = `SELECT * FROM cont_asientos ORDER BY id_asiento DESC OFFSET $1 LIMIT $2;`;
        const queryTotalAsientos = `SELECT COUNT(*) FROM cont_asientos;`;

        const [asientos, totalAsientos] = await Promise.all([
            db_postgres.query(queryAsientos, [desde, limit]),
            db_postgres.one(queryTotalAsientos),
        ]);

        res.json({
            ok: true,
            asientos,
            totalAsientos: totalAsientos.count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los asientos.",
        });
    }
};

// Obtener todos los asientos
const getAsientosAll = async (req, res) => {
    console.log("lleva asientos ALL")
    try {
        const queryAsientos = `SELECT * FROM cont_asientos ORDER BY id_asiento DESC;`;
        const queryTotalAsientos = `SELECT COUNT(*) FROM cont_asientos;`;

        const [asientos, totalAsientos] = await Promise.all([
            db_postgres.query(queryAsientos),
            db_postgres.one(queryTotalAsientos),
        ]);

        res.json({
            ok: true,
            asientos,
            totalAsientos: totalAsientos.count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener las facturas.",
        });
    }
};

// Obtener un asiento por su ID
const getAsientoById = async (req, res) => {
    try {
        const id_asiento = req.params.id;

        console.log("getAsientoById")
        console.log("id")
        console.log(id_asiento)

        const asiento = await db_postgres.query("SELECT * FROM cont_asientos WHERE id_asiento = $1", [id_asiento]);
        if (!asiento) {
            return res.status(404).json({
                ok: false,
                msg: "Asiento no encontrado.",
            });
        }
        res.json({
            ok: true,
            asiento,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el asiento.",
        });
    }
};

// Crear un nuevo asiento
const createAsiento = async (req, res = response) => {
    console.log('CREAR ASIENTO')
    const { fecha_asiento, referencia, documento, observacion } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array(),
            msg: "Datos no válidos. Por favor, verifica los campos.",
        });
    }
    try {
        const asiento = await db_postgres.one(
            "INSERT INTO cont_asientos (fecha_registro, fecha_asiento, referencia, documento, observacion, estado) VALUES (CURRENT_DATE, $1, $2, $3, $4, $5) RETURNING *",
            [fecha_asiento, referencia, documento, observacion, true]
        );

        res.json({
            ok: true,
            msg: "Asiento creado correctamente.",
            asiento,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear el asiento. Por favor, inténtalo de nuevo.",
        });
    }
};

// Actualizar un asiento
const updateAsiento = async (req, res = response) => {
    const id_asiento = req.params.id;
    const { referencia, documento, observacion } = req.body;
    try {
        const asientoExists = await db_postgres.oneOrNone("SELECT * FROM cont_asientos WHERE id_asiento = $1", [id_asiento]);
        if (!asientoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El asiento no existe. Por favor, proporciona un ID de asiento válido.",
            });
        }
        const asientoUpdate = await db_postgres.one(
            "UPDATE cont_asientos SET referencia = $1, documento = $2, observacion = $3 WHERE id_asiento = $4 RETURNING *",
            [referencia, documento, observacion, id_asiento]
        );
        res.json({
            ok: true,
            msg: "Asiento actualizado correctamente.",
            asientoUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el asiento. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar un asiento
const deleteAsiento = async (req, res = response) => {
    const id_asiento = req.params.id;
    try {
        const asientoExists = await db_postgres.oneOrNone("SELECT * FROM cont_asientos WHERE id_asiento = $1", [id_asiento]);
        if (!asientoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El asiento no existe. Por favor, proporciona un ID de asiento válido.",
            });
        }
        const asientoDelete = await db_postgres.query("UPDATE cont_asientos SET estado = $1 WHERE id_asiento = $2 RETURNING *", [false, id_asiento]);
        res.json({
            ok: true,
            msg: "Asiento borrado correctamente.",
            asientoDelete,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar el asiento. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getAsientos,
    getAsientosAll,
    getAsientoById,
    createAsiento,
    updateAsiento,
    deleteAsiento,
};
