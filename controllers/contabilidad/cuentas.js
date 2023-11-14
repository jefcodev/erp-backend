const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todas las cuentas con un límite
const getCuentas = async (req, res) => {
    console.log("lleva cuentas limit")
    try {
        //const cuentas = await db_postgres.query("SELECT * FROM cont_cuentas ORDER BY Codigo ASC");
        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limit);
        console.log("req: ", req.query)
        console.log("desde: ", desde)
        console.log("limit: ", limit)

        const queryCuentas = `SELECT * FROM cont_cuentas ORDER BY codigo ASC OFFSET $1 LIMIT $2;`;
        const queryTotalCuentas = `SELECT COUNT(*) FROM cont_cuentas;`;
        const [cuentas, totalCuentas] = await Promise.all([
            db_postgres.query(queryCuentas, [desde, limit]),
            db_postgres.one(queryTotalCuentas),
        ]);
        res.json({
            ok: true,
            cuentas,
            totalCuentas: totalCuentas.count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los cuentas.",
        });
    }
};

// Obtener todos los cuentas
const getCuentasAll = async (req, res) => {
    try {
        const queryCuentas = `SELECT * FROM cont_cuentas ORDER BY codigo ASC;`;
        const queryTotalCuentas = `SELECT COUNT(*) FROM cont_cuentas;`;

        const [cuentas, totalCuentas] = await Promise.all([
            db_postgres.query(queryCuentas),
            db_postgres.one(queryTotalCuentas),
        ]);


        res.json({
            ok: true,
            cuentas,
            totalCuentas: totalCuentas.count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener las cuentas.",
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
        console.log("Lleva cuenta:", cuenta)
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
        res.json({
            ok: true,
            msg: "Cuenta creado correctamente.",
            cuenta,
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

// Eliminar o activar una cuenta
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
        // Cambiar el estado del proveedor
        const nuevoEstado = !cuentaExists.estado; // Cambiar el estado actual al opuesto
        const query = "UPDATE cont_cuentas SET estado = $1 WHERE id_cuenta = $2 RETURNING *";
        const cuentaToggle = await db_postgres.query(query, [nuevoEstado, id_cuenta]);

        res.json({
            ok: true,
            msg: `Cuenta ${nuevoEstado ? 'activada' : 'desactivada'} correctamente.`,
            cuentaToggle,
        });

    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar la cuenta. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getCuentas,
    getCuentasAll,
    getCuentaById,
    getCuentaByCodigo,
    createCuenta,
    updateCuenta,
    deleteCuenta,
};
