const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todos los ventas con un limite
const getVentas = async (req, res) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limit);
        const queryVentas = `SELECT * FROM vent_ventas ORDER BY id_venta DESC OFFSET $1 LIMIT $2;`;
        const queryTotalVentas = `SELECT COUNT(*) FROM vent_ventas;`;
        const [ventas, totalVentas] = await Promise.all([
            db_postgres.query(queryVentas, [desde, limit]),
            db_postgres.one(queryTotalVentas),
        ]);
        res.json({
            ok: true,
            ventas,
            totalVentas: totalVentas.count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener las ventas.",
        });
    }
};

// Obtener todas las ventas
const getVentasAll = async (req, res) => {
    try {
        const queryVentas = `SELECT * FROM vent_ventas ORDER BY id_venta DESC;`;
        const queryTotalVentas = `SELECT COUNT(*) FROM vent_ventas;`;
        const queryTotalVentasPendientes = `SELECT COUNT(*) FROM vent_ventas WHERE estado_pago = 'PENDIENTE';`;

        const querySumaAbono = `SELECT SUM(abono) FROM vent_ventas;`;
        const querySumaImporteTotal = `SELECT SUM(importe_total) FROM vent_ventas;`;

        const [ventas, totalVentas, totalVentasPendientes, sumaAbono, sumaImporteTotal] = await Promise.all([
            db_postgres.query(queryVentas),
            db_postgres.one(queryTotalVentas),
            db_postgres.one(queryTotalVentasPendientes),
            db_postgres.one(querySumaAbono),
            db_postgres.one(querySumaImporteTotal),
        ]);

        const sumaSaldo = sumaImporteTotal.sum - sumaAbono.sum;

        res.json({
            ok: true,
            ventas,
            totalVentas: totalVentas.count,
            totalVentasPendientes: totalVentasPendientes.count,
            sumaSaldo,
            sumaImporteTotal: sumaImporteTotal.sum,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener las ventas.",
        });
    }
};

// Obtener un venta por su ID
const getVentaById = async (req, res) => {
    try {
        const id_venta = req.params.id;

        const venta = await db_postgres.query("SELECT * FROM vent_ventas WHERE id_venta = $1", [id_venta]);

        if (!venta) {
            return res.status(404).json({
                ok: false,
                msg: "Venta no encontrado.",
            });
        }

        const importe_total = venta[0].importe_total;
        const abono = venta[0].abono;
        const saldo = importe_total - abono;

        res.json({
            ok: true,
            venta,
            saldo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el venta.",
        });
    }
};

// Crear nueva venta
const createVenta = async (req, res = response) => {
    const { id_tipo_comprobante, id_cliente, id_info_tributaria, clave_acceso, codigo, fecha_emision, fecha_vencimiento, total_sin_impuesto, total_descuento, valor, propina, importe_total, id_forma_pago, fecha_pago, abono, observacion } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.array(),
            msg: "Datos no válidos. Por favor, verifica los campos.",
        });
    }
    console.log('fecha emision: ', fecha_emision)
    console.log('fecha vencimient: ', fecha_vencimiento)
    try {
        let venta;
        let estado_pago = "PENDIENTE";

        console.log('abono: ', abono)
        console.log('observacion: ', observacion)
        console.log('id forma de pago: ', id_forma_pago)
        console.log('id_tipo_comprobante: ', id_tipo_comprobante)
        // Solo si llega un abono mayor a cero, hay obervación y forma de pago se hace el pago
        if (!isNaN(abono) && (abono > 0) && (observacion.trim() !== "") && !isNaN(id_forma_pago)) {
            console.log("PAGAR")
            if (importe_total == abono) {
                estado_pago = "PAGADA";
            }
            venta = await db_postgres.one(
                "INSERT INTO public.vent_ventas (id_tipo_comprobante, id_cliente, id_info_tributaria, clave_acceso, codigo, fecha_emision, fecha_vencimiento, estado_pago, total_sin_impuesto, total_descuento, valor, propina, importe_total, abono, estado) " +
                "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
                [id_tipo_comprobante, id_cliente, id_info_tributaria, clave_acceso, codigo, fecha_emision, fecha_vencimiento, estado_pago, total_sin_impuesto, total_descuento, valor, propina, importe_total, abono, true]
            );

            /**Logica adicional para hacer automaticamente los asientos */
            const asiento = await db_postgres.one(
                "INSERT INTO cont_asientos (fecha_registro, fecha_asiento, referencia, documento, observacion, estado) VALUES (CURRENT_DATE, $1, $2, $3, $4, $5) RETURNING *",
                [fecha_emision, "Venta (Venta)", codigo, "Generado por el sistema", true]
            );

            const id_asiento = asiento.id_asiento

            // 1. ACTIVO - CTA # 6 CAJA MATRIZ
            const detalle_asiento = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 6, "CAJA MATRIZ", codigo, abono, 0.00]
            );

            // 5. EGRESOS - CTA # 98 MATERIALES UTILIZADOS
            const detalle_asiento2 = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 98, "MATERIALES UTILIZADOS", codigo, abono, 0.00]
            );

            // 1. ACTIVO - CTA # 20 INVENTARIO MATERIA PRIMA
            const detalle_asiento3 = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 20, "INVENTARIO MATERIA PRIMA", codigo, 0.00, abono]
            );

            // 5. EGRESOS - CTA # 90 VENTA DE BIENES
            const detalle_asiento4 = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 90, "VENTA DE BIENES", codigo, 0.00, abono]
            );
            /**FIN */

            const id_venta = venta.id_venta
            const pago = await db_postgres.one(
                "INSERT INTO cont_pagos (id_asiento, id_forma_pago, id_venta, fecha_pago, abono, observacion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [id_asiento, id_forma_pago, id_venta, fecha_pago, abono, observacion, true]
            );
        } else {
            console.log("SOLO INGRESAR LA FACTURA VENTA")
            venta = await db_postgres.one(
                "INSERT INTO public.vent_ventas (id_tipo_comprobante, id_cliente, clave_acceso, codigo, fecha_emision, fecha_vencimiento, estado_pago, total_sin_impuesto, total_descuento, valor, propina, importe_total, estado) " +
                "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
                [id_tipo_comprobante, id_cliente, clave_acceso, codigo, fecha_emision, fecha_vencimiento, estado_pago, total_sin_impuesto, total_descuento, valor, propina, importe_total, true]
            );
        }
        res.json({
            ok: true,
            msg: "Venta creada correctamente.",
            venta,
        });
        console.log('crear venta venta: ', venta)
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: "Error al crear la venta. Por favor, inténtalo de nuevo.",
        });
    }
};

// Actualizar una venta
const updateVenta = async (req, res = response) => {
    try {
        const id_venta = req.params.id;
        const { fecha_vencimiento, id_forma_pago, fecha_pago, abono, observacion } = req.body;
        const ventaExists = await db_postgres.oneOrNone("SELECT * FROM vent_ventas WHERE id_venta = $1", [id_venta]);

        if (!ventaExists) {
            return res.status(400).json({
                ok: false,
                msg: "La venta no existe. Por favor, proporciona un ID de venta válido.",
            });
        }

        const abono1 = parseFloat(abono) || 0;
        const abono2 = parseFloat(ventaExists.abono) || 0;

        let abono_sumado = 0;
        let ventaUpdate;
        const codigo = ventaExists.codigo

        // Solo si llega un abono mayor a cero, hay obervación y forma de pago se hace el pago
        if (!isNaN(abono1) && (abono1 > 0) && (observacion.trim() !== "") && !isNaN(id_forma_pago)) {
            
            console.log("PAGAR")
            abono_sumado = abono1 + abono2;
            let estado_pago = "PENDIENTE";
            if (ventaExists.importe_total == abono_sumado) {
                estado_pago = "PAGADA";
            }

            ventaUpdate = await db_postgres.one(
                "UPDATE vent_ventas SET fecha_vencimiento = $1, estado_pago = $2, abono = $3 WHERE id_venta = $4 RETURNING *",
                [fecha_vencimiento, estado_pago, abono_sumado, id_venta]
            );

            /**Logica adicional para hacer automaticamente los asientos */
            const asiento = await db_postgres.one(
                "INSERT INTO cont_asientos (fecha_registro, fecha_asiento, referencia, documento, observacion, estado) VALUES (CURRENT_DATE, $1, $2, $3, $4, $5) RETURNING *",
                [fecha_pago, "Venta (Venta)", codigo, "Generado por el sistema", true]
            );

            const id_asiento = asiento.id_asiento;

            // 1. ACTIVO - CTA # 6 CAJA MATRIZ
            const detalle_asiento = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 6, "CAJA MATRIZ", codigo, abono, 0.00]
            );

            // 5. EGRESOS - CTA # 98 MATERIALES UTILIZADOS
            const detalle_asiento2 = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 98, "MATERIALES UTILIZADOS", codigo, abono, 0.00]
            );

            // 1. ACTIVO - CTA # 20 INVENTARIO MATERIA PRIMA
            const detalle_asiento3 = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 20, "INVENTARIO MATERIA PRIMA", codigo, 0.00, abono]
            );

            // 5. EGRESOS - CTA # 90 VENTA DE BIENES
            const detalle_asiento4 = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 90, "VENTA DE BIENES", codigo, 0.00, abono]
            );
            /**FIN */

            const pago = await db_postgres.one(
                "INSERT INTO cont_pagos (id_asiento, id_forma_pago, id_venta, fecha_pago, abono, observacion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [id_asiento, id_forma_pago, id_venta, fecha_pago, abono, observacion, true]
            );
        } else if (fecha_vencimiento !== null) {
            console.log("ACTUALIZAR")
            // No hay abono, observación o forma de pago válidos, y la fecha_vencimiento no es null, por lo que solo actualizamos fecha_vencimiento
            ventaUpdate = await db_postgres.one(
                "UPDATE vent_ventas SET fecha_vencimiento = $1 WHERE id_venta = $2 RETURNING *",
                [fecha_vencimiento, id_venta]
            );

        }

        res.json({
            ok: true,
            msg: "Venta actualizada correctamente.",
            ventaUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el venta. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar una venta
const deleteVenta = async (req, res = response) => {
    const id_venta = req.params.id;
    try {
        const ventaExists = await db_postgres.oneOrNone("SELECT * FROM vent_ventas WHERE id_venta = $1", [id_venta]);
        if (!ventaExists) {
            return res.status(400).json({
                ok: false,
                msg: "El venta no existe. Por favor, proporciona un ID de venta válido.",
            });
        }
        const estado_pago = "ANULADA";
        const ventaDelete = await db_postgres.query("UPDATE vent_ventas SET estado = $1, estado_pago =$2 WHERE id_venta = $3 RETURNING *", [false, estado_pago, id_venta]);

        res.json({
            ok: true,
            msg: "Venta borrado correctamente.",
            ventaDelete,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar el venta. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getVentas,
    getVentaById,
    getVentasAll,
    createVenta,
    updateVenta,
    deleteVenta,
};
