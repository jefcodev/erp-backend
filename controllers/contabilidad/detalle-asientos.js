const { response } = require("express");
const { validationResult } = require("express-validator");
const { generarJWT } = require("../../helpers/jwt");
const { db_postgres } = require("../../database/config");

// Obtener todos los detalle_asientos
const getDetalleAsientos = async (req, res) => {
    try {
        const detalles_asientos = await db_postgres.query("SELECT * FROM cont_detalles_asientos ORDER BY id_detalle_asiento ASC");

        res.json({
            ok: true,
            detalles_asientos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los detalle_asientos.",
        });
    }
};

// Obtener un detalle_asiento por su ID
const getDetalleAsientoById = async (req, res) => {
    try {
        const id_detalle_asiento = req.params.id;

        const detalle_asiento = await db_postgres.query("SELECT * FROM cont_detalles_asientos WHERE id_detalle_asiento = $1", [id_detalle_asiento]);
        if (!detalle_asiento) {
            return res.status(404).json({
                ok: false,
                msg: "Detalle Asiento no encontrado.",
            });
        }
        res.json({
            ok: true,
            detalle_asiento,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el detalle_asiento.",
        });
    }
};

// Obtener un detalle_asiento por su ID_ASIENTO
const getDetallesAsientoByIdAsiento = async (req, res) => {
    try {
        const id_asiento = req.params.asiento;

        if (!id_asiento) {
            return res.status(400).json({
                ok: false,
                msg: "El id_asiento de asiento es requerido.",
            });
        }

        const detalles_asientos = await db_postgres.query("SELECT * FROM cont_detalles_asientos WHERE id_asiento = $1", [id_asiento]);

        if (!detalles_asientos) {
            return res.status(404).json({
                ok: false,
                msg: "Detalles de Asiento no encontrado.",
            });
        }

        // Calcular la suma total de Debe y Haber
        const sumaTotalQuery = `
            SELECT
                SUM(debe) as total_debe,
                SUM(haber) as total_haber
            FROM cont_detalles_asientos
            WHERE id_asiento = $1
        `;

        const sumaTotalResult = await db_postgres.query(sumaTotalQuery, [id_asiento]);
        console.log("SUMAS: ", sumaTotalResult)

        const total_debe = parseFloat(sumaTotalResult[0].total_debe || 0);
        const total_haber = parseFloat(sumaTotalResult[0].total_haber || 0);

        console.log("Lleva detalle Asiento por id_asiento", detalles_asientos)
        console.log("SUMA DEBE", total_debe)
        console.log("SUMA HABER", total_haber)
        res.json({
            ok: true,
            detalles_asientos,
            total_debe,
            total_haber,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el detalle_asiento.",
        });
    }
};

// Crear un nuevo detalle_asiento
const createDetalleAsiento2 = async (req, res = response) => {

    const { id_asiento, id_cuenta, descripcion, documento, debe, haber } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array(),
            msg: "Datos no válidos. Por favor, verifica los campos.",
        });
    }
    try {
        const detalle_asiento = await db_postgres.one(
            "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [id_asiento, id_cuenta, descripcion, documento, debe, haber]
        );

        const token = await generarJWT(detalle_asiento.id_detalle_asiento);
        res.json({
            ok: true,
            msg: "Detalle Asiento creado correctamente.",
            detalle_asiento,
            token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear el detalle_asiento. Por favor, inténtalo de nuevo.",
        });
    }
};

// Crear un nuevo detalle_asiento
const createDetalleAsiento = async (req, res = response) => {

    const { detalles } = req.body; // Obtener el arreglo de detalles desde el cuerpo de la solicitud

    try {
        const promises = detalles.map(async (detalle) => {
            const { id_asiento, id_cuenta, descripcion, documentod, debe, haber } = detalle;

            const detalle_asiento = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, id_cuenta, descripcion, documentod, debe, haber]
            );

            return detalle_asiento;
        });

        const detalle_asientos = await Promise.all(promises);

        const token = await generarJWT(detalle_asientos[0].id_detalle_asiento);
        res.json({
            ok: true,
            msg: "Detalles de asiento creados correctamente.",
            detalle_asientos,
            token: token,
        });

    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear los detalles de asiento. Por favor, inténtalo de nuevo.",
        });
    }
};


// Actualizar un detalle_asiento
const updateDetalleAsiento = async (req, res = response) => {
    const id_detalle_asiento = req.params.id;
    const { descripcion } = req.body;
    try {
        const asientoExists = await db_postgres.oneOrNone("SELECT * FROM cont_detalles_asientos WHERE id_detalle_asiento = $1", [id_detalle_asiento]);
        if (!asientoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El detalle_asiento no existe. Por favor, proporciona un ID de detalle_asiento válido.",
            });
        }
        const asientoUpdate = await db_postgres.one(
            "UPDATE cont_detalles_asientos SET descripcion = $1 WHERE id_detalle_asiento = $2 RETURNING *",
            [descripcion, id_detalle_asiento]
        );
        res.json({
            ok: true,
            msg: "Detalle Asiento actualizado correctamente.",
            asientoUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el detalle_asiento. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar un detalle_asiento
/*const deleteDetalleAsiento = async (req, res = response) => {
    const id_detalle_asiento = req.params.id;
    try {
        const asientoExists = await db_postgres.oneOrNone("SELECT * FROM cont_detalles_asientos WHERE id_detalle_asiento = $1", [id_detalle_asiento]);
        if (!asientoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El detalle_asiento no existe. Por favor, proporciona un ID de detalle_asiento válido.",
            });
        }
        const asientoDelete = await db_postgres.query("UPDATE cont_detalles_asientos SET estado = $1 WHERE id_detalle_asiento = $2 RETURNING *", [false, id_detalle_asiento]);
        res.json({
            ok: true,
            msg: "Detalle Asiento borrado correctamente.",
            asientoDelete,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar el detalle_asiento. Por favor, inténtalo de nuevo.",
        });
    }
};*/

module.exports = {
    getDetalleAsientos,
    getDetalleAsientoById,
    getDetallesAsientoByIdAsiento,
    createDetalleAsiento,
    updateDetalleAsiento,
    //deleteDetalleAsiento,
};
