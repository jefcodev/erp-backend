const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todos los proveedores con un limite
const getProveedores = async (req, res) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limit);
        const query = `SELECT * FROM comp_proveedores ORDER BY id_proveedor DESC OFFSET $1 LIMIT $2;`;
        const queryCount = `SELECT COUNT(*) FROM comp_proveedores;`;
        const [proveedores, total] = await Promise.all([
            db_postgres.query(query, [desde, limit]),
            db_postgres.one(queryCount),
        ]);
        res.json({
            ok: true,
            proveedores,
            total: total.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los proveedores.",
        });
    }
};

// Obtener todos los proveedores con un limite y busqueda
const getProveedoresSearch = async (req, res) => {
    try {
        const search = req.query.search || ''; // Obtener la cadena de búsqueda desde la URL
        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limit);

        const queryProveedores = `
        SELECT * FROM comp_proveedores
        WHERE identificacion ILIKE '%' || $1 || '%' or
            razon_social ILIKE '%' || $1 || '%' OR
            direccion ILIKE '%' || $1 || '%'
        ORDER BY id_proveedor DESC
        OFFSET $2 LIMIT $3;
        `;
        const queryProveedoresCount = `SELECT COUNT(*) FROM comp_proveedores;`;
        const [proveedores, total] = await Promise.all([
            db_postgres.query(queryProveedores, [`%${search}%`, desde, limit]),
            db_postgres.one(queryProveedoresCount),
        ]);
        res.json({
            ok: true,
            proveedores,
            total: total.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los proveedores.",
        });
    }
};

// Obtener todos los proveedores
const getProveedoresAll = async (req, res) => {
    try {
        const queryAll = `SELECT * FROM comp_proveedores ORDER BY id_proveedor DESC;`;
        const queryCount = `SELECT COUNT(*) FROM comp_proveedores;`;
        const [proveedores, total] = await Promise.all([
            db_postgres.query(queryAll),
            db_postgres.one(queryCount),
        ]);
        res.json({
            ok: true,
            proveedores,
            total: total.count
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

// Obtener un proveedor por su identificación
const getProveedorByIndentificacion = async (req, res) => {
    try {
        const identificacion = req.params.identificacion;
        console.log('🟩 LLEGA BUSCAR PROVEEDOR: ', identificacion)

        if (!identificacion) {
            return res.status(400).json({
                ok: false,
                msg: "La identificación es requerida.",
            });
        }
        const proveedor = await db_postgres.query(`SELECT * FROM comp_proveedores WHERE identificacion = $1;`, [identificacion]);
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
        console.log('🟩 sale: ', proveedor)

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
    console.log('🟩 LLEGA CREAR PROVEEDOR: ')
    /*const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array(),
            msg: "Datos no válidos. Por favor, verifica los campos.",
        });
    }*/
    console.log('IDENTIFICACION: ', identificacion)
    console.log('RAZON SOCIAL: ', razon_social)
    console.log('DIRECCION: ', direccion)
    console.log('telefono 0: ', telefono)

    let nuevoTelefono = telefono; // Crear una nueva variable para 'telefono'
    let nuevoEmail = email; // Crear una nueva variable para 'email'

    if (telefono === '0') {
        // Asignar un valor nulo o vacío a 'nuevoTelefono' y 'nuevoEmail' cuando 'telefono' sea '0'
        console.log('ENTRAAAAAAAAAAA')
        nuevoTelefono = null;
        nuevoEmail = null;
    }
    console.log('telefono: ', nuevoTelefono)
    console.log('email: ', nuevoEmail)

    try {

        const identificacionExists = await db_postgres.oneOrNone("SELECT * FROM comp_proveedores WHERE identificacion = $1", [identificacion]);
        if (identificacionExists) {
            return res.status(400).json({
                ok: false,
                msg: "La identificación ya existe. Por favor, proporciona una identificación única.",
            });
        }
        const emailExists = await db_postgres.oneOrNone("SELECT * FROM comp_proveedores WHERE email = $1", [nuevoEmail]);
        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: "El email ya existe. Por favor, proporciona un email único.",
            });
        }
        const proveedor = await db_postgres.one(
            "INSERT INTO comp_proveedores (identificacion, razon_social, nombre_comercial, direccion, telefono, email, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [identificacion, razon_social, nombre_comercial, direccion, nuevoTelefono, nuevoEmail, true]
        );
        res.json({
            ok: true,
            msg: "Proveedor creado correctamente.",
            proveedor,
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

// Eliminar o activar un proveedor
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

        // Cambiar el estado del proveedor
        const nuevoEstado = !proveedorExists.estado; // Cambiar el estado actual al opuesto
        const query = "UPDATE comp_proveedores SET estado = $1 WHERE id_proveedor = $2 RETURNING *";
        const proveedorToggle = await db_postgres.query(query, [nuevoEstado, id_proveedor]);

        res.json({
            ok: true,
            msg: `Proveedor ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`,
            proveedorToggle,
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
    getProveedoresSearch,
    getProveedoresAll,
    getProveedorById,
    getProveedorByIndentificacion,
    createProveedor,
    updateProveedor,
    deleteProveedor,
};
