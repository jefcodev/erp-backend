const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todos los formas_pago
const getTiposComprobantes = async (req, res) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limit);
        const query = `SELECT * FROM cont_tipos_comprobantes ORDER BY id_tipo_comprobante DESC OFFSET $1 LIMIT $2;`;
        const queryCount = `SELECT COUNT(*) FROM cont_tipos_comprobantes;`;
        const [formas_pago, total] = await Promise.all([
            db_postgres.query(query, [desde, limit]),
            db_postgres.one(queryCount),
        ]);
        res.json({
            ok: true,
            formas_pago,
            total: total.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los formas_pago.",
        });
    }
};

// Obtener todos los formas_pago
const getTiposComprobantesAll = async (req, res) => {
    try {
        const queryAll = `SELECT * FROM cont_tipos_comprobantes ORDER BY id_tipo_comprobante DESC;`;
        const queryCount = `SELECT COUNT(*) FROM cont_tipos_comprobantes;`;
        const [tipos_comprobantes, total] = await Promise.all([
            db_postgres.query(queryAll),
            db_postgres.one(queryCount),
        ]);
        res.json({
            ok: true,
            tipos_comprobantes,
            total: total.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los formas_pago.",
        });
    }
};

// Obtener una forma de pago por su ID
const getTipoComprobanteById = async (req, res) => {
    try {
        const id_tipo_comprobante = req.params.id;

        console.log("getTipoComprobanteById")
        console.log("id")
        console.log(id_tipo_comprobante)

        const forma_pago = await db_postgres.query("SELECT * FROM cont_tipos_comprobantes WHERE id_tipo_comprobante = $1", [id_tipo_comprobante]);
        if (!forma_pago) {
            return res.status(404).json({
                ok: false,
                msg: "Forma Pago no encontrado.",
            });
        }
        res.json({
            ok: true,
            forma_pago,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el forma de pago.",
        });
    }
};

// Obtener una forma de pago por su Código
const getTipoComprobanteByCodigo = async (req, res) => {
    try {
        const codigo = req.params.codigo;

        console.log("getTipoComprobanteByCodigo")
        console.log("codigo")
        console.log(codigo)

        if (!codigo) {
            return res.status(400).json({
                ok: false,
                msg: "El código es requerido.",
            });
        }

        const forma_pago = await db_postgres.query(`
            SELECT * FROM cont_tipos_comprobantes
            WHERE codigo = $1`
            , [codigo]);

        if (!forma_pago) {
            return res.status(404).json({
                ok: false,
                msg: "Forma Pago no encontrado.",
            });
        }
        res.json({
            ok: true,
            forma_pago,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener la forma de pago.",
        });
    }
};

// Crear un nuevo forma de pago
const createTipoComprobante = async (req, res = response) => {
    const { codigo, descripcion } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array(),
            msg: "Datos no válidos. Por favor, verifica los campos.",
        });
    }
    try {
        const codigoExists = await db_postgres.oneOrNone("SELECT * FROM cont_tipos_comprobantes WHERE codigo = $1", [codigo]);
        if (codigoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El código ya existe. Por favor, proporciona un código único.",
            });
        }
        const descripcionExists = await db_postgres.oneOrNone("SELECT * FROM cont_tipos_comprobantes WHERE descripcion = $1", [descripcion]);
        if (descripcionExists) {
            return res.status(400).json({
                ok: false,
                msg: "La descripción ya existe. Por favor, proporciona una descripción única.",
            });
        }
        const forma_pago = await db_postgres.one(
            "INSERT INTO cont_tipos_comprobantes (codigo, descripcion, estado) VALUES ($1, $2, $3) RETURNING *",
            [codigo, descripcion, true]
        );
        res.json({
            ok: true,
            msg: "Forma Pago creado correctamente.",
            forma_pago,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear el forma de pago. Por favor, inténtalo de nuevo.",
        });
    }
};

// Actualizar un forma de pago
const updateTipoComprobante = async (req, res = response) => {
    const id_tipo_comprobante = req.params.id;
    const { codigo, descripcion, cuenta_padre } = req.body;
    try {
        const formaPagoExists = await db_postgres.oneOrNone("SELECT * FROM cont_tipos_comprobantes WHERE id_tipo_comprobante = $1", [id_tipo_comprobante]);
        if (!formaPagoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El forma de pago no existe. Por favor, proporciona un ID de forma de pago válido.",
            });
        }
        const descripcionExists = await db_postgres.oneOrNone("SELECT * FROM cont_tipos_comprobantes WHERE descripcion = $1 AND id_tipo_comprobante != $2", [descripcion, id_tipo_comprobante]);
        if (descripcionExists) {
            return res.status(400).json({
                ok: false,
                msg: "El descripción ya está en uso. Por favor, proporciona un descripción único.",
            });
        }
        const formaPagoUpdate = await db_postgres.one(
            "UPDATE cont_tipos_comprobantes SET descripcion = $1 WHERE id_tipo_comprobante = $2 RETURNING *",
            [descripcion, id_tipo_comprobante]
        );
        res.json({
            ok: true,
            msg: "Forma Pago actualizado correctamente.",
            formaPagoUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el forma de pago. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar o activar una forma de pago
const deleteTipoComprobante = async (req, res = response) => {
    const id_tipo_comprobante = req.params.id;
    try {
        const forma_pagoExists = await db_postgres.oneOrNone("SELECT * FROM cont_tipos_comprobantes WHERE id_tipo_comprobante = $1", [id_tipo_comprobante]);
        if (!forma_pagoExists) {
            return res.status(400).json({
                ok: false,
                msg: "La forma de pago no existe. Por favor, proporciona un ID de forma de pago válido.",
            });
        }

        // Cambiar el estado del forma_pago
        const nuevoEstado = !forma_pagoExists.estado; // Cambiar el estado actual al opuesto
        const query = "UPDATE cont_tipos_comprobantes SET estado = $1 WHERE id_tipo_comprobante = $2 RETURNING *";
        const forma_pagoToggle = await db_postgres.query(query, [nuevoEstado, id_tipo_comprobante]);

        res.json({
            ok: true,
            msg: `Forma de Pago ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`,
            forma_pagoToggle,
        });

    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar la Forma de Pago. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getTiposComprobantes,
    getTiposComprobantesAll,
    getTipoComprobanteById,
    getTipoComprobanteByCodigo,
    createTipoComprobante,
    updateTipoComprobante,
    deleteTipoComprobante,
};
