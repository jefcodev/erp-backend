const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todos los detalle_compras
const getDetalleCompras = async (req, res) => {
    try {
        const detalles_compras = await db_postgres.query("SELECT * FROM comp_detalles_compras ORDER BY id_detalle_compra DESC");
        res.json({
            ok: true,
            detalles_compras,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los detalle_compras.",
        });
    }
};

// Obtener un detalle_compra por su ID
const getDetalleCompraById = async (req, res) => {
    try {
        const id_detalle_compra = req.params.id;
        const detalle_compra = await db_postgres.query("SELECT * FROM comp_detalles_compras WHERE id_detalle_compra = $1", [id_detalle_compra]);
        if (!detalle_compra) {
            return res.status(404).json({
                ok: false,
                msg: "Detalle Compra no encontrado.",
            });
        }
        res.json({
            ok: true,
            detalle_compra,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el detalle_compra.",
        });
    }
};


// Obtener un detalle_compra por su ID_FACTURA
const getDetallesCompraByIdCompra = async (req, res) => {
    try {
        const id_compra = req.params.compra;
        if (!id_compra) {
            return res.status(400).json({
                ok: false,
                msg: "El id_compra de cuenta es requerido.",
            });
        }
        const detalles_compras = await db_postgres.query(`
            SELECT * FROM comp_detalles_compras
            WHERE id_compra = $1
        `, [id_compra]);

        if (!detalles_compras) {
            return res.status(404).json({
                ok: false,
                msg: "Detalles de Compra no encontrado.",
            });
        }
        res.json({
            ok: true,
            detalles_compras,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el detalle_compra.",
        });
    }
};

// Crear un nuevo detalle_compra
const createDetalleCompra = async (req, res = response) => {
    try {
        const { detalles } = req.body; // Obtener el arreglo de detalles desde el cuerpo de la solicitud
        const promises = detalles.map(async (detalle) => {

            const { id_producto, id_compra, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total } = detalle;
            const detalle_compra = await db_postgres.one(
                "INSERT INTO public.comp_detalles_compras (id_producto, id_compra, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total) " +
                "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
                [id_producto, id_compra, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total]
            );
            const nuevoPrecioCompra = precio_total / cantidad;
            const stockActualizado = await actualizarStockProducto(id_producto, cantidad, nuevoPrecioCompra);
            return detalle_compra;
        });
        res.json({
            ok: true,
            msg: "Detalles de compra creados correctamente.",
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear los detalles de compra. Por favor, inténtalo de nuevo.",
        });
    }
};

// Función para actualizar el stock del producto
const actualizarStockProducto = async (id_producto, cantidad, nuevoPrecioCompra) => {
    try {
        await db_postgres.none("UPDATE inve_productos SET stock = stock + $1, precio_compra = $2 WHERE id_producto = $3", [cantidad, nuevoPrecioCompra, id_producto]);
        return true; 
    } catch (error) {
        return false;
    }
};

// Actualizar un detalle_compra
const updateDetalleCompra = async (req, res = response) => {
    const id_detalle_compra = req.params.id;
    const { descripcion } = req.body;
    try {
        const compraExists = await db_postgres.oneOrNone("SELECT * FROM comp_detalles_compras WHERE id_detalle_compra = $1", [id_detalle_compra]);
        if (!compraExists) {
            return res.status(400).json({
                ok: false,
                msg: "El detalle_compra no existe. Por favor, proporciona un ID de detalle_compra válido.",
            });
        }
        const compraUpdate = await db_postgres.one(
            "UPDATE comp_detalles_compras SET descripcion = $1 WHERE id_detalle_compra = $2 RETURNING *",
            [descripcion, id_detalle_compra]
        );
        res.json({
            ok: true,
            msg: "Detalle Compra actualizado correctamente.",
            compraUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el detalle_compra. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getDetalleCompras,
    getDetalleCompraById,
    getDetallesCompraByIdCompra,
    createDetalleCompra,
    updateDetalleCompra,
};
