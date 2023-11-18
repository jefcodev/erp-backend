const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todos los detalles_ventas
const getDetalleVentas = async (req, res) => {
    try {
        const detalles_ventas = await db_postgres.query("SELECT * FROM vent_detalles_ventas ORDER BY id_detalle_venta DESC");

        res.json({
            ok: true,
            detalles_ventas,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los detalles_ventas.",
        });
    }
};

// Obtener un detalle_venta por su ID
const getDetalleVentaById = async (req, res) => {
    try {
        const id_detalle_venta = req.params.id;

        console.log("getVentaById")
        console.log("id")
        console.log(id_detalle_venta)

        const detalle_venta = await db_postgres.query("SELECT * FROM vent_detalles_ventas WHERE id_detalle_venta = $1", [id_detalle_venta]);
        if (!detalle_venta) {
            return res.status(404).json({
                ok: false,
                msg: "Detalle Venta no encontrado.",
            });
        }
        res.json({
            ok: true,
            detalle_venta,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el detalle_venta.",
        });
    }
};


// Obtener un detalle_venta por su id_venta
const getDetallesVentaByIdVenta = async (req, res) => {
    try {

        const id_venta = req.params.venta;

        if (!id_venta) {
            return res.status(400).json({
                ok: false,
                msg: "El id_venta de cuenta es requerido.",
            });
        }

        const detalles_ventas = await db_postgres.query(`
            SELECT * FROM vent_detalles_ventas
            WHERE id_venta = $1
        `, [id_venta]);

        if (!detalles_ventas) {
            return res.status(404).json({
                ok: false,
                msg: "Detalles de Venta no encontrado.",
            });
        }
        res.json({
            ok: true,
            detalles_ventas,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el detalle_venta.",
        });
    }
};

// Crear un nuevo detalle_venta
/*const createDetalleVenta = async (req, res = response) => {

    console.log('CREAR DETALLE VENTA');
    const { detalles } = req.body; // Obtener el arreglo de detalles desde el cuerpo de la solicitud

    try {
        const promises = detalles.map(async (detalle) => {

            const { id_producto, id_venta, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total } = detalle;
            const detalle_venta = await db_postgres.one(
                "INSERT INTO public.vent_detalles_ventas (id_producto, id_venta, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total) " +
                "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
                [id_producto, id_venta, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total]
            );

            return detalle_venta;
        });

        const detalles_ventas = await Promise.all(promises);

        const token = await generarJWT(detalles_ventas[0].id_detalle_venta);
        res.json({
            ok: true,
            msg: "Detalles de venta creados correctamente.",
            detalles_ventas,
            token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear los detalles de venta. Por favor, inténtalo de nuevo.",
        });
    }
};
*/

const createDetalleVenta = async (req, res = response) => {
    console.log('CREAR DETALLE VENTA');
    const { detalles } = req.body;

    try {
        const detalles_ventas = await Promise.all(
            detalles.map(async (detalle) => {
                const { id_producto, id_venta, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total } = detalle;

                // Inserta el detalle de venta en la base de datos
                const detalleVenta = await db_postgres.one(
                    "INSERT INTO public.vent_detalles_ventas (id_producto, id_venta, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total) " +
                    "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
                    [id_producto, id_venta, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total]
                );
                // Aquí puedes agregar la lógica para actualizar el stock del producto
                const stockActualizado = await actualizarStockProducto(id_producto, cantidad);

                return detalleVenta;
            })
        );

        res.json({
            ok: true,
            msg: "Detalles de venta creados correctamente.",
            detalles_ventas,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear los detalles de venta. Por favor, inténtalo de nuevo.",
        });
    }
};

// Función para actualizar el stock del producto
const actualizarStockProducto = async (id_producto, cantidad) => {
    try {
        // Realiza la lógica para actualizar el stock del producto en la base de datos
        // Puedes usar db_postgres o tu propia lógica para actualizar el stock
        // Aquí deberías restar 'cantidad' al stock del producto con el 'id_producto' dado
        console.log('🟩id prodcuto: ', id_producto)
        console.log('CANTIDAD: ', cantidad)
        // Ejemplo:
        await db_postgres.none("UPDATE inve_productos SET stock = stock - $1 WHERE id_producto = $2", [cantidad, id_producto]);

        return true; // Indica que la actualización del stock fue exitosa
    } catch (error) {
        return false; // Indica que ocurrió un error al actualizar el stock
    }
};

// Actualizar un detalle_venta
const updateDetalleVenta = async (req, res = response) => {
    const id_detalle_venta = req.params.id;
    const { descripcion } = req.body;
    try {
        const ventaExists = await db_postgres.oneOrNone("SELECT * FROM vent_detalles_ventas WHERE id_detalle_venta = $1", [id_detalle_venta]);
        if (!ventaExists) {
            return res.status(400).json({
                ok: false,
                msg: "El detalle_venta no existe. Por favor, proporciona un ID de detalle_venta válido.",
            });
        }
        const ventaUpdate = await db_postgres.one(
            "UPDATE vent_detalles_ventas SET descripcion = $1 WHERE id_detalle_venta = $2 RETURNING *",
            [descripcion, id_detalle_venta]
        );
        res.json({
            ok: true,
            msg: "Detalle Venta actualizado correctamente.",
            ventaUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el detalle_venta. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getDetalleVentas,
    getDetalleVentaById,
    getDetallesVentaByIdVenta,
    createDetalleVenta,
    updateDetalleVenta,
};