const { response } = require("express");
const { validationResult } = require("express-validator");
const { generarJWT } = require("../../helpers/jwt");
const { db_postgres } = require("../../database/config");

// Obtener todos los facturas
const getFacturas = async (req, res) => {
    try {
        const facturas = await db_postgres.query("SELECT * FROM vent_facturas_ventas ORDER BY id_factura_venta ASC");

        res.json({
            ok: true,
            facturas,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener las facturas.",
        });
    }
};

// Obtener un factura por su ID
const getFacturaById = async (req, res) => {
    try {
        const id_factura_venta = req.params.id;

        const factura = await db_postgres.query("SELECT * FROM vent_facturas_ventas WHERE id_factura_venta = $1", [id_factura_venta]);

        if (!factura) {
            return res.status(404).json({
                ok: false,
                msg: "Factura no encontrado.",
            });
        }

        const valor_total = factura[0].valor_total;
        const abono = factura[0].abono;
        const saldo = valor_total - abono;

        res.json({
            ok: true,
            factura,
            saldo,

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el factura.",
        });
    }
};

// Crear nueva factura
const createFactura = async (req, res = response) => {
    //const { id_cliente, id_forma_pago, id_asiento, codigo, fecha_emision, fecha_vencimiento, estado_pago, subtotal_sin_impuestos, total_descuento, iva, valor_total, abono } = req.body;
    const { id_cliente, id_forma_pago, id_asiento, codigo, fecha_emision, fecha_vencimiento, subtotal_sin_impuestos, total_descuento, iva, valor_total, abono } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array(),
            msg: "Datos no válidos. Por favor, verifica los campos.",
        });
    }

    let estado_pago = "PENDIENTE";
    if (valor_total == abono) {
        estado_pago = "PAGADO";
    }

    try {
        const factura = await db_postgres.one(
            "INSERT INTO public.vent_facturas_ventas (id_cliente, id_forma_pago, id_asiento, codigo, fecha_emision, fecha_vencimiento, estado_pago, subtotal_sin_impuestos, total_descuento, iva, valor_total, abono, estado) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
            [id_cliente, id_forma_pago, id_asiento, codigo, fecha_emision, fecha_vencimiento, estado_pago, subtotal_sin_impuestos, total_descuento, iva, valor_total, abono, true]
        );

        res.json({
            ok: true,
            msg: "Factura creado correctamente.",
            factura,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al crear el factura. Por favor, inténtalo de nuevo.",
        });
    }
};

// Actualizar un factura
const updateFactura = async (req, res = response) => {
    const id_factura_venta = req.params.id;
    const { estado_pago, abono } = req.body;
    try {
        const facturaExists = await db_postgres.oneOrNone("SELECT * FROM vent_facturas_ventas WHERE id_factura_venta = $1", [id_factura_venta]);

        const abono_sumado = parseFloat(abono) + parseFloat(facturaExists.abono)

        if (!facturaExists) {
            return res.status(400).json({
                ok: false,
                msg: "La factura no existe. Por favor, proporciona un ID de factura válido.",
            });
        }

        let estado_pago = "";
        if (facturaExists.valor_total == abono_sumado) {
            estado_pago = "PAGADO";
        }else{
            estado_pago = "PENDIENTE";
        }

        const facturaUpdate = await db_postgres.one(
            "UPDATE vent_facturas_ventas SET estado_pago = $1, abono = $2 WHERE id_factura_venta = $3 RETURNING *",
            [estado_pago, abono_sumado, id_factura_venta]
        );
        /**Logica adicional para hacer automaticamente los pagos en asientos */

        const asiento = await db_postgres.one(
            //"INSERT INTO cont_asientos (fecha, referencia, documento, observacion, estado) VALUES (CURRENT_TIMESTAMP, $1, $2, $3, $4) RETURNING *",
            "INSERT INTO cont_asientos (fecha, referencia, documento, observacion, estado) VALUES (CURRENT_DATE, $1, $2, $3, $4) RETURNING *",
            ["Venta (Gasto)", facturaExists.codigo, "Generado por el sistema", true]
        );

        // ACTIVO - CTA # 8 CAJA CHICA MATRIZ
        const detalle_asiento = await db_postgres.one(
            "INSERT INTO cont_detalle_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [asiento.id_asiento, 8, "descripcion", facturaExists.codigo, 0.00, abono]
        );

        // GASTOS - CTA # 38 PROVEEDORES
        const detalle_asiento2 = await db_postgres.one(
            "INSERT INTO cont_detalle_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [asiento.id_asiento, 38, "descripcion", facturaExists.codigo, abono, 0.00]
        );
        /**FIN */

        res.json({
            ok: true,
            msg: "Factura actualizada correctamente.",
            facturaUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el factura. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar un factura
const deleteFactura = async (req, res = response) => {
    const id_factura_venta = req.params.id;
    try {
        const facturaExists = await db_postgres.oneOrNone("SELECT * FROM vent_facturas_ventas WHERE id_factura_venta = $1", [id_factura_venta]);
        if (!facturaExists) {
            return res.status(400).json({
                ok: false,
                msg: "El factura no existe. Por favor, proporciona un ID de factura válido.",
            });
        }
        const estado_pago = "ANULADA";
        const facturaDelete = await db_postgres.query("UPDATE vent_facturas_ventas SET estado = $1, estado_pago =$2 WHERE id_factura_venta = $3 RETURNING *", [false, estado_pago, id_factura_venta]);
        
        /**Logica adicional para hacer automaticamente los asientos */

        const asiento = await db_postgres.one(
            //"INSERT INTO cont_asientos (fecha, referencia, documento, observacion, estado) VALUES (CURRENT_TIMESTAMP, $1, $2, $3, $4) RETURNING *",
            "INSERT INTO cont_asientos (fecha, referencia, documento, observacion, estado) VALUES (CURRENT_DATE, $1, $2, $3, $4) RETURNING *",
            ["Venta (Gasto)", facturaExists.codigo, "Generado por el sistema", true]
        );

        // ACTIVO - CTA # 8 CAJA CHICA MATRIZ
        const detalle_asiento = await db_postgres.one(
            "INSERT INTO cont_detalle_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [asiento.id_asiento, 8, "descripcion", facturaExists.codigo, 0.00, abono]
        );

        // GASTOS - CTA # 38 PROVEEDORES
        const detalle_asiento2 = await db_postgres.one(
            "INSERT INTO cont_detalle_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [asiento.id_asiento, 38, "descripcion", facturaExists.codigo, abono, 0.00]
        );
        /**FIN */
        
        
        res.json({
            ok: true,
            msg: "Factura borrado correctamente.",
            facturaDelete,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar el factura. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getFacturas,
    getFacturaById,
    createFactura,
    updateFactura,
    deleteFactura,
};
