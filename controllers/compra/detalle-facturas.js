const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todos los detalle_facturas
const getDetalleFacturas = async (req, res) => {
    try {
        const detalle_facturas = await db_postgres.query("SELECT * FROM comp_detalle_facturas_compras ORDER BY id_detalle_factura_compra DESC");

        res.json({
            ok: true,
            detalle_facturas,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los detalle_facturas.",
        });
    }
};

// Obtener un detalle_factura por su ID
const getDetalleFacturaById = async (req, res) => {
    try {
        const id_detalle_factura_compra = req.params.id;

        console.log("getFacturaById")
        console.log("id")
        console.log(id_detalle_factura_compra)

        const detalle_factura = await db_postgres.query("SELECT * FROM comp_detalle_facturas_compras WHERE id_detalle_factura_compra = $1", [id_detalle_factura_compra]);
        if (!detalle_factura) {
            return res.status(404).json({
                ok: false,
                msg: "Detalle Factura no encontrado.",
            });
        }
        res.json({
            ok: true,
            detalle_factura,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el detalle_factura.",
        });
    }
};


// Obtener un detalle_factura por su ID_FACTURA
const getDetallesFacturaByIdFactura = async (req, res) => {
    try {

        const id_factura_compra = req.params.factura;

        if (!id_factura_compra) {
            return res.status(400).json({
                ok: false,
                msg: "El id_factura_compra de cuenta es requerido.",
            });
        }

        const detalles_factura = await db_postgres.query(`
            SELECT * FROM comp_detalle_facturas_compras
            WHERE id_factura_compra = $1
        `, [id_factura_compra]);

        if (!detalles_factura) {
            return res.status(404).json({
                ok: false,
                msg: "Detalles de Factura no encontrado.",
            });
        }
        res.json({
            ok: true,
            detalles_factura,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el detalle_factura.",
        });
    }
};

/*
// Crear un nuevo detalle_factura
const createDetalleFactura = async (req, res = response) => {
    
    console.log('CREAR DETALLE COMPRA');
    const { detalles } = req.body; // Obtener el arreglo de detalles desde el cuerpo de la solicitud
    try {
        const promises = detalles.map(async (detalle) => {

            const { id_producto, id_factura_compra, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total } = detalle;
            const detalle_factura = await db_postgres.one(
                "INSERT INTO public.comp_detalle_facturas_compras (id_producto, id_factura_compra, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total) " +
                "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
                [id_producto, id_factura_compra, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total]
            );

            return detalle_factura;
        });

        const detalle_facturas = await Promise.all(promises);

        const token = await generarJWT(detalle_facturas[0].id_detalle_factura_compra);
        res.json({
            ok: true,
            msg: "Detalles de factura creados correctamente.",
            detalle_facturas,
            token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear los detalles de factura. Por favor, inténtalo de nuevo.",
        });
    }
};
*/

// Crear un nuevo detalle_factura
const createDetalleFactura = async (req, res = response) => {

    console.log('CREAR DETALLE COMPRA');
    const { detalles } = req.body; // Obtener el arreglo de detalles desde el cuerpo de la solicitud
    try {
        const promises = detalles.map(async (detalle) => {

            const { id_producto, id_factura_compra, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total } = detalle;
            const detalle_factura = await db_postgres.one(
                "INSERT INTO public.comp_detalle_facturas_compras (id_producto, id_factura_compra, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total) " +
                "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
                [id_producto, id_factura_compra, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total]
            );

            console.log("Precio Unitario", precio_unitario)
            console.log("Valor", valor)
            console.log("Precio total", precio_total)
            const nuevoPrecioCompra = precio_total / cantidad;
            console.log("Nuevo Precio de Compra", nuevoPrecioCompra)
            const stockActualizado = await actualizarStockProducto(id_producto, cantidad, nuevoPrecioCompra);

            return detalle_factura;
        });

        //const detalle_facturas = await Promise.all(promises);

        //const token = await generarJWT(detalle_facturas[0].id_detalle_factura_compra);
        res.json({
            ok: true,
            msg: "Detalles de factura creados correctamente.",
            //detalle_factura,
            //token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear los detalles de factura. Por favor, inténtalo de nuevo.",
        });
    }
};

const createDetalleFactura2 = async (req, res = response) => {
    console.log('CREAR DETALLE COMPRAS');
    const { detalles } = req.body;

    try {
        const detalle_factura = await Promise.all(
            detalles.map(async (detalle) => {
                const {
                    id_producto,
                    id_factura_venta,
                    codigo_principal,
                    descripcion,
                    cantidad,
                    precio_unitario,
                    descuento,
                    precio_total_sin_impuesto,
                    codigo,
                    codigo_porcentaje,
                    tarifa,
                    base_imponible,
                    valor,
                    ice,
                    precio_total,
                } = detalle;

                // Inserta el detalle de factura en la base de datos
                const detalle_factura = await db_postgres.one(
                    "INSERT INTO public.vent_detalle_facturas_ventas (id_producto, id_factura_venta, codigo_principal, descripcion, cantidad, precio_unitario, descuento, precio_total_sin_impuesto, codigo, codigo_porcentaje, tarifa, base_imponible, valor, ice, precio_total) " +
                    "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
                    [
                        id_producto,
                        id_factura_venta,
                        codigo_principal,
                        descripcion,
                        cantidad,
                        precio_unitario,
                        descuento,
                        precio_total_sin_impuesto,
                        codigo,
                        codigo_porcentaje,
                        tarifa,
                        base_imponible,
                        valor,
                        ice,
                        precio_total,
                    ]
                );
                console.log("Precio Unitario", precio_unitario)
                console.log("Valor", valor)
                console.log("Precio total", precio_total)
                const nuevoPrecioCompra = precio_total / cantidad;
                console.log("Nuevo Precio de Compra", nuevoPrecioCompra)

                // Aquí puedes agregar la lógica para actualizar el stock del producto
                const stockActualizado = await actualizarStockProducto(id_producto, cantidad, nuevoPrecioCompra);

                return detalle_factura;
            })
        );

        //const token = await generarJWT(detalle_facturas[0].id_detalle_factura_venta);

        res.json({
            ok: true,
            msg: "Detalles de factura creados correctamente.",
            detalle_factura,
            //token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear los detalles de factura. Por favor, inténtalo de nuevo.",
        });
    }
};

// Función para actualizar el stock del producto
const actualizarStockProducto = async (id_producto, cantidad, nuevoPrecioCompra) => {
    try {
        // Realiza la lógica para actualizar el stock del producto en la base de datos
        // Puedes usar db_postgres o tu propia lógica para actualizar el stock
        // Aquí deberías restar 'cantidad' al stock del producto con el 'id_producto' dado
        console.log('🟩id prodcuto: ', id_producto)
        console.log('CANTIDAD: ', cantidad)
        // Ejemplo:
        await db_postgres.none("UPDATE inve_productos SET stock = stock + $1, precio_compra = $2 WHERE id_producto = $3", [cantidad, nuevoPrecioCompra, id_producto]);

        return true; // Indica que la actualización del stock fue exitosa
    } catch (error) {
        return false; // Indica que ocurrió un error al actualizar el stock
    }
};

// Actualizar un detalle_factura
const updateDetalleFactura = async (req, res = response) => {
    const id_detalle_factura_compra = req.params.id;
    const { descripcion } = req.body;
    try {
        const facturaExists = await db_postgres.oneOrNone("SELECT * FROM comp_detalle_facturas_compras WHERE id_detalle_factura_compra = $1", [id_detalle_factura_compra]);
        if (!facturaExists) {
            return res.status(400).json({
                ok: false,
                msg: "El detalle_factura no existe. Por favor, proporciona un ID de detalle_factura válido.",
            });
        }
        const facturaUpdate = await db_postgres.one(
            "UPDATE comp_detalle_facturas_compras SET descripcion = $1 WHERE id_detalle_factura_compra = $2 RETURNING *",
            [descripcion, id_detalle_factura_compra]
        );
        res.json({
            ok: true,
            msg: "Detalle Factura actualizado correctamente.",
            facturaUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el detalle_factura. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getDetalleFacturas,
    getDetalleFacturaById,
    getDetallesFacturaByIdFactura,
    createDetalleFactura,
    updateDetalleFactura,
};
