const { response } = require("express");
const { validationResult } = require("express-validator");
const { generarJWT } = require("../../helpers/jwt");
const { db_postgres } = require("../../database/config");

// Obtener todos los proveedores
const getProveedores = async (req, res) => {
    try {
        const proveedores = await db_postgres.query("SELECT * FROM comp_proveedores ORDER BY id_proveedor ASC");

        res.json({
            ok: true,
            proveedores,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los proveedores.",
        });
    }
};

// Obtener un proveedor por su ID
const getProveedorById = async (req, res) => {
    try {
        const id_proveedor = req.params.id;
        const proveedor = await db_postgres.query("SELECT * FROM comp_proveedores WHERE id_proveedor = $1", [id_proveedor]);
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

// Obtener un proveedor por su ID
const getProveedorByIndentificacion = async (req, res) => {
    try {
        const identificacion = req.params.identificacion;
        console.log("getCuentaByidentificacion")
        console.log("identificacion")
        console.log(identificacion)

        if (!identificacion) {
            return res.status(400).json({
                ok: false,
                msg: "La identificación es requerida.",
            });
        }

        const proveedor = await db_postgres.query(`
            SELECT * FROM COMP_PROVEEDORES
            WHERE identificacion = $1;`
            , [identificacion]);


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

// Crear un nuevo proveedor
const createProveedor = async (req, res = response) => {
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
        const identificacionExists = await db_postgres.oneOrNone("SELECT * FROM comp_proveedores WHERE identificacion = $1", [identificacion]);
        if (identificacionExists) {
            return res.status(400).json({
                ok: false,
                msg: "La identificación ya existe. Por favor, proporciona una identificación única.",
            });
        }
        const emailExists = await db_postgres.oneOrNone("SELECT * FROM comp_proveedores WHERE email = $1", [email]);
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: "El email ya existe. Por favor, proporciona un email único.",
            });
        }
        const proveedor = await db_postgres.one(
            "INSERT INTO comp_proveedores (identificacion, razon_social, nombre_comercial, direccion, telefono, email, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [identificacion, razon_social, nombre_comercial, direccion, telefono, email, true]
        );
        //const token = await generarJWT(proveedor.id_proveedor);
        res.json({
            ok: true,
            msg: "Proveedor creado correctamente.",
            proveedor,
            //  token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear el proveedor. Por favor, inténtalo de nuevo.",
        });
    }
};

// Actualizar un proveedor
const updateProveedor = async (req, res = response) => {
    const id_proveedor = req.params.id;
    const { razon_social, nombre_comercial, direccion, telefono, email } = req.body;
    try {
        const proveedorExists = await db_postgres.oneOrNone("SELECT * FROM comp_proveedores WHERE id_proveedor = $1", [id_proveedor]);
        if (!proveedorExists) {
            return res.status(400).json({
                ok: false,
                msg: "El proveedor no existe. Por favor, proporciona un ID de proveedor válido.",
            });
        }
        const emailExists = await db_postgres.oneOrNone("SELECT * FROM comp_proveedores WHERE email = $1 AND id_proveedor != $2", [email, id_proveedor]);
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: "El correo electrónico ya está en uso. Por favor, proporciona un correo electrónico único.",
            });
        }
        const proveedorUpdate = await db_postgres.one(
            "UPDATE comp_proveedores SET razon_social = $1, nombre_comercial = $2, direccion = $3, telefono = $4, email = $5 WHERE id_proveedor = $6 RETURNING *",
            [razon_social, nombre_comercial, direccion, telefono, email, id_proveedor]
        );
        res.json({
            ok: true,
            msg: "Proveedor actualizado correctamente.",
            proveedorUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el proveedor. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar un proveedor
const deleteProveedor = async (req, res = response) => {
    const id_proveedor = req.params.id;
    try {
        const proveedorExists = await db_postgres.oneOrNone("SELECT * FROM comp_proveedores WHERE id_proveedor = $1", [id_proveedor]);
        if (!proveedorExists) {
            return res.status(400).json({
                ok: false,
                msg: "El proveedor no existe. Por favor, proporciona un ID de proveedor válido.",
            });
        }
        const proveedorDelete = await db_postgres.query("UPDATE comp_proveedores SET estado = $1 WHERE id_proveedor = $2 RETURNING *", [false, id_proveedor]);
        res.json({
            ok: true,
            msg: "Proveedor borrado correctamente.",
            proveedorDelete,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar el proveedor. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getProveedores,
    getProveedorById,
    getProveedorByIndentificacion,
    createProveedor,
    updateProveedor,
    deleteProveedor,
};
