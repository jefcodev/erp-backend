const { response } = require("express");
const { validationResult } = require("express-validator");
const { generarJWT } = require("../../helpers/jwt");
const { db_postgres } = require("../../database/config");

// Obtener todos los formas_pago
const getFormasPago = async (req, res) => {
    try {
        const formas_pago = await db_postgres.query("SELECT * FROM cont_formas_pago ORDER BY Codigo ASC");

        res.json({
            ok: true,
            formas_pago,
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
const getFormaPagoById = async (req, res) => {
    try {
        const id_forma_pago = req.params.id;

        console.log("getFormaPagoById")
        console.log("id")
        console.log(id_forma_pago)

        const forma_pago = await db_postgres.query("SELECT * FROM cont_formas_pago WHERE id_forma_pago = $1", [id_forma_pago]);
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
const getFormaPagoByCodigo = async (req, res) => {
    try {
        const codigo = req.params.codigo;

        console.log("getFormaPagoByCodigo")
        console.log("codigo")
        console.log(codigo)

        if (!codigo) {
            return res.status(400).json({
                ok: false,
                msg: "El código es requerido.",
            });
        }

        const forma_pago = await db_postgres.query(`
            SELECT * FROM cont_formas_pago
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
const createFormaPago = async (req, res = response) => {
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
        const codigoExists = await db_postgres.oneOrNone("SELECT * FROM cont_formas_pago WHERE codigo = $1", [codigo]);
        if (codigoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El código ya existe. Por favor, proporciona un código único.",
            });
        }
        const descripcionExists = await db_postgres.oneOrNone("SELECT * FROM cont_formas_pago WHERE descripcion = $1", [descripcion]);
        if (descripcionExists) {
            return res.status(400).json({
                ok: false,
                msg: "La descripción ya existe. Por favor, proporciona una descripción única.",
            });
        }
        const forma_pago = await db_postgres.one(
            "INSERT INTO cont_formas_pago (codigo, descripcion, estado) VALUES ($1, $2, $3) RETURNING *",
            [codigo, descripcion, true]
        );
        const token = await generarJWT(forma_pago.id_forma_pago);
        res.json({
            ok: true,
            msg: "Forma Pago creado correctamente.",
            forma_pago,
            token: token,
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
const updateFormaPago = async (req, res = response) => {
    const id_forma_pago = req.params.id;
    const { codigo, descripcion, cuenta_padre } = req.body;
    try {
        const formaPagoExists = await db_postgres.oneOrNone("SELECT * FROM cont_formas_pago WHERE id_forma_pago = $1", [id_forma_pago]);
        if (!formaPagoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El forma de pago no existe. Por favor, proporciona un ID de forma de pago válido.",
            });
        }
        const descripcionExists = await db_postgres.oneOrNone("SELECT * FROM cont_formas_pago WHERE descripcion = $1 AND id_forma_pago != $2", [descripcion, id_forma_pago]);
        if (descripcionExists) {
            return res.status(400).json({
                ok: false,
                msg: "El descripción ya está en uso. Por favor, proporciona un descripción único.",
            });
        }
        const formaPagoUpdate = await db_postgres.one(
            "UPDATE cont_formas_pago SET descripcion = $1 WHERE id_forma_pago = $2 RETURNING *",
            [descripcion, id_forma_pago]
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

// Eliminar un forma de pago
const deleteFormaPago = async (req, res = response) => {
    const id_forma_pago = req.params.id;
    try {
        const formaPagoExists = await db_postgres.oneOrNone("SELECT * FROM cont_formas_pago WHERE id_forma_pago = $1", [id_forma_pago]);
        if (!formaPagoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El forma de pago no existe. Por favor, proporciona un ID de forma de pago válido.",
            });
        }
        const formaPagoDelete = await db_postgres.query("UPDATE cont_formas_pago SET estado = $1 WHERE id_forma_pago = $2 RETURNING *", [false, id_forma_pago]);
        res.json({
            ok: true,
            msg: "Forma Pago borrado correctamente.",
            formaPagoDelete,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar el forma de pago. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getFormasPago,
    getFormaPagoById,
    getFormaPagoByCodigo,
    createFormaPago,
    updateFormaPago,
    deleteFormaPago,
};
