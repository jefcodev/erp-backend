const { response } = require("express");
const { validationResult } = require("express-validator");
const { generarJWT } = require("../../helpers/jwt");
const { db_postgres } = require("../../database/config");

// Obtener todos los productos
const getProductos = async (req, res) => {
    try {
        const productos = await db_postgres.query("SELECT * FROM inve_productos ORDER BY id_producto ASC");

        res.json({
            ok: true,
            productos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los productos.",
        });
    }
};

// Obtener un producto por su ID
const getProductoById = async (req, res) => {
    try {
        const id_producto = req.params.id;
        const producto = await db_postgres.query("SELECT * FROM inve_productos WHERE id_producto = $1", [id_producto]);
        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: "Producto no encontrado.",
            });
        }
        res.json({
            ok: true,
            producto,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el producto.",
        });
    }
};

// Crear un nuevo producto
const createProducto = async (req, res = response) => {
    const { codigo_principal, descripcion, stock, precio_compra } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array(),
            msg: "Datos no válidos. Por favor, verifica los campos.",
        });
    }
    try {
        const productoExiste = await db_postgres.oneOrNone("SELECT * FROM inve_productos WHERE codigo_principal = $1", [codigo_principal]);

        if (productoExiste) {
            const stock_actual = parseFloat(productoExiste.stock)
            console.log("stock actual: ", stock_actual)
            const stock_llega = parseFloat(stock)
            console.log("stock llega: ", stock_llega)
            const stock_actualizado = (stock_actual + stock_llega)
            console.log("stock_actualizado: ", stock_actualizado)
            const productoUpdate = await db_postgres.one(
                `UPDATE inve_productos SET stock = $1 WHERE codigo_principal = $2 RETURNING *`,
                [stock_actualizado, codigo_principal]
            );
            res.json({
                ok: true,
                msg: "Producto actualizado correctamente.",
                productoUpdate,
            });
        } else {
            const producto = await db_postgres.one(
                `INSERT INTO inve_productos (codigo_principal, descripcion, stock, precio_compra, fecha_registro, estado) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5) RETURNING *`,
                [codigo_principal, descripcion, stock, precio_compra, true]
            );
            res.json({
                ok: true,
                msg: "Producto creado correctamente.",
                producto,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear el producto. Por favor, inténtalo de nuevo.",
        });
    }
};

// Actualizar un producto
const updateProducto = async (req, res = response) => {
    const id_producto = req.params.id;
    const { codigo_principal, descripcion, stock, utilidad, descuento, precio_compra, precio_venta } = req.body;
    try {
        const productoExists = await db_postgres.oneOrNone("SELECT * FROM inve_productos WHERE id_producto = $1", [id_producto]);
        if (!productoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El producto no existe. Por favor, proporciona un ID de producto válido.",
            });
        }
        const productoUpdate = await db_postgres.one(
            "UPDATE inve_productos SET codigo_principal = $1, descripcion = $2, stock = $3, utilidad = $4, descuento = $5, precio_compra = $6, precio_venta = $7  WHERE id_producto = $8 RETURNING *",
            [codigo_principal, descripcion, stock, utilidad, descuento, precio_compra, precio_venta, id_producto]
        );
        res.json({
            ok: true,
            msg: "Producto actualizado correctamente.",
            productoUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el producto. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar un producto
const deleteProducto = async (req, res = response) => {
    const id_producto = req.params.id;
    try {
        const productoExists = await db_postgres.oneOrNone("SELECT * FROM inve_productos WHERE id_producto = $1", [id_producto]);
        if (!productoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El producto no existe. Por favor, proporciona un ID de producto válido.",
            });
        }
        const productoDelete = await db_postgres.query("UPDATE inve_productos SET estado = $1 WHERE id_producto = $2 RETURNING *", [false, id_producto]);
        res.json({
            ok: true,
            msg: "Producto borrado correctamente.",
            productoDelete,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar el producto. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
};
