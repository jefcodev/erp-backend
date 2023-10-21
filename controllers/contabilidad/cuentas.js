const { response } = require("express");
const { validationResult } = require("express-validator");
const { generarJWT } = require("../../helpers/jwt");
const { db_postgres } = require("../../database/config");

// Obtener todos los cuentas
const getCuentas = async (req, res) => {
    try {
        const cuentas = await db_postgres.query("SELECT * FROM cont_cuentas ORDER BY Codigo ASC");

        res.json({
            ok: true,
            cuentas,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los cuentas.",
        });
    }
};

// Obtener un cuenta por su ID
const getCuentaById = async (req, res) => {
    try {
        const id_cuenta = req.params.id;

        console.log("getCuentaById")
        console.log("id")
        console.log(id_cuenta)

        const cuenta = await db_postgres.query("SELECT * FROM cont_cuentas WHERE id_cuenta = $1", [id_cuenta]);
        if (!cuenta) {
            return res.status(404).json({
                ok: false,
                msg: "Cuenta no encontrado.",
            });
        }
        res.json({
            ok: true,
            cuenta,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el cuenta.",
        });
    }
};


const getCuentaByCodigo = async (req, res) => {
    try {
        
        const codigo = req.params.codigo;
        console.log("getCuentaByCodigo")
        console.log("codigo")
        console.log(codigo)

        if (!codigo) {
            return res.status(400).json({
                ok: false,
                msg: "El código de cuenta es requerido.",
            });
        }

        const cuenta = await db_postgres.query(`
            SELECT * FROM public.cont_cuentas
            WHERE cuenta_padre LIKE $1 || '%'
            AND LENGTH(codigo) = LENGTH($1) + 2
            ORDER BY codigo DESC
            LIMIT 1;
        `, [codigo]);

        if (!cuenta) {
            return res.status(404).json({
                ok: false,
                msg: "Cuenta no encontrado.",
            });
        }

        res.json({
            ok: true,
            cuenta: cuenta,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener la cuenta.",
        });
    }
};

// Crear un nuevo cuenta
const createCuenta = async (req, res = response) => {
    const { codigo, descripcion, cuenta_padre } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array(),
            msg: "Datos no válidos. Por favor, verifica los campos.",
        });
    }
    try {
        const descripcionExists = await db_postgres.oneOrNone("SELECT * FROM cont_cuentas WHERE descripcion = $1", [descripcion]);
        if (descripcionExists) {
            return res.status(400).json({
                ok: false,
                msg: "La descripción ya existe. Por favor, proporciona una descripción única.",
            });
        }
        const cuenta = await db_postgres.one(
            "INSERT INTO cont_cuentas (codigo, descripcion, cuenta_padre, estado) VALUES ($1, $2, $3, $4) RETURNING *",
            [codigo, descripcion, cuenta_padre, true]
        );
        const token = await generarJWT(cuenta.id_cuenta);
        res.json({
            ok: true,
            msg: "Cuenta creado correctamente.",
            cuenta,
            token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear el cuenta. Por favor, inténtalo de nuevo.",
        });
    }
};

// Actualizar un cuenta
const updateCuenta = async (req, res = response) => {
    const id_cuenta = req.params.id;
    const { codigo, descripcion, cuenta_padre } = req.body;
    try {
        const cuentaExists = await db_postgres.oneOrNone("SELECT * FROM cont_cuentas WHERE id_cuenta = $1", [id_cuenta]);
        if (!cuentaExists) {
            return res.status(400).json({
                ok: false,
                msg: "El cuenta no existe. Por favor, proporciona un ID de cuenta válido.",
            });
        }
        const descripcionExists = await db_postgres.oneOrNone("SELECT * FROM cont_cuentas WHERE descripcion = $1 AND id_cuenta != $2", [descripcion, id_cuenta]);
        if (descripcionExists) {
            return res.status(400).json({
                ok: false,
                msg: "El descripción ya está en uso. Por favor, proporciona un descripción único.",
            });
        }
        const cuentaUpdate = await db_postgres.one(
            "UPDATE cont_cuentas SET descripcion = $1 WHERE id_cuenta = $2 RETURNING *",
            [descripcion, id_cuenta]
        );
        res.json({
            ok: true,
            msg: "Cuenta actualizado correctamente.",
            cuentaUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el cuenta. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar un cuenta
const deleteCuenta = async (req, res = response) => {
    const id_cuenta = req.params.id;
    try {
        const cuentaExists = await db_postgres.oneOrNone("SELECT * FROM cont_cuentas WHERE id_cuenta = $1", [id_cuenta]);
        if (!cuentaExists) {
            return res.status(400).json({
                ok: false,
                msg: "El cuenta no existe. Por favor, proporciona un ID de cuenta válido.",
            });
        }
        const cuentaDelete = await db_postgres.query("UPDATE cont_cuentas SET estado = $1 WHERE id_cuenta = $2 RETURNING *", [false, id_cuenta]);
        res.json({
            ok: true,
            msg: "Cuenta borrado correctamente.",
            cuentaDelete,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar el cuenta. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getCuentas,
    //getCuenta,
    getCuentaById,
    getCuentaByCodigo,
    createCuenta,
    updateCuenta,
    deleteCuenta,
};
