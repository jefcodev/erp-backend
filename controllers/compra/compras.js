const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener todas los compras con un límite
const getCompras = async (req, res) => {
    try {
        const desde = Number(req.query.desde) || 0;
        const limit = Number(req.query.limit);

        const queryCompras = `SELECT * FROM comp_compras ORDER BY id_compra DESC OFFSET $1 LIMIT $2;`;
        const queryTotalCompras = `SELECT COUNT(*) FROM comp_compras;`;
        const [compras, totalCompras] = await Promise.all([
            db_postgres.query(queryCompras, [desde, limit]),
            db_postgres.one(queryTotalCompras),
        ]);
        res.json({
            ok: true,
            compras,
            totalCompras: totalCompras.count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener las compras.",
        });
    }
};

// Obtener todas las compras
const getComprasAll = async (req, res) => {
    try {
        const queryCompras = `SELECT * FROM comp_compras ORDER BY id_compra DESC;`;
        const queryTotalCompras = `SELECT COUNT(*) FROM comp_compras;`;
        const queryTotalComprasPendientes = `SELECT COUNT(*) FROM comp_compras WHERE estado_pago = 'PENDIENTE';`;

        const querySumaAbono = `SELECT SUM(abono) FROM comp_compras;`;
        const querySumaImporteTotal = `SELECT SUM(importe_total) FROM comp_compras;`;

        const [compras, totalCompras, totalComprasPendientes, sumaAbono, sumaImporteTotal] = await Promise.all([
            db_postgres.query(queryCompras),
            db_postgres.one(queryTotalCompras),
            db_postgres.one(queryTotalComprasPendientes),
            db_postgres.one(querySumaAbono),
            db_postgres.one(querySumaImporteTotal),
        ]);

        const sumaSaldo = sumaImporteTotal.sum - sumaAbono.sum;

        res.json({
            ok: true,
            compras,
            totalCompras: totalCompras.count,
            totalComprasPendientes: totalComprasPendientes.count,
            sumaSaldo,
            sumaImporteTotal: sumaImporteTotal.sum,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener las compras.",
        });
    }
};

// Obtener un compra por su ID
const getCompraById = async (req, res) => {
    try {
        const id_compra = req.params.id;

        const compra = await db_postgres.query("SELECT * FROM comp_compras WHERE id_compra = $1", [id_compra]);

        if (!compra) {
            return res.status(404).json({
                ok: false,
                msg: "Compra no encontrada.",
            });
        }

        const importe_total = compra[0].importe_total;
        const abono = compra[0].abono;
        const saldo = importe_total - abono;

        res.json({
            ok: true,
            compra,
            saldo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el compra.",
        });
    }
};

// Crear nueva compra
const createCompra = async (req, res = response) => {
    const { id_tipo_comprobante, id_proveedor, id_asiento, id_info_tributaria, clave_acceso, codigo, fecha_emision, fecha_vencimiento, total_sin_impuesto, total_descuento, valor, propina, importe_total, credito_tributario, id_forma_pago, fecha_pago, abono, observacion } = req.body;
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
        let compra;
        let estado_pago = "PENDIENTE";

        console.log('id forma de pago: ', id_forma_pago)
        console.log('fecha_pago: ', fecha_pago)
        console.log('abono: ', abono)
        console.log('observacion: ', observacion)
        // Solo si llega un abono mayor a cero, hay obervación y forma de pago se hace el pago
        if (!isNaN(abono) && (abono > 0) && (observacion.trim() !== "") && !isNaN(id_forma_pago)) {
            console.log("PAGAR")
            console.log("id_tipo comrtpo", id_tipo_comprobante)
            console.log("credito: ", credito_tributario)
            if (importe_total == abono) {
                estado_pago = "PAGADA";
            }
            compra = await db_postgres.one(
                `INSERT INTO public.comp_compras (id_tipo_comprobante, id_proveedor, id_info_tributaria, clave_acceso, codigo, fecha_emision, fecha_vencimiento, estado_pago, total_sin_impuesto, total_descuento, valor, propina, importe_total, abono, credito_tributario, estado)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
                [id_tipo_comprobante, id_proveedor, id_info_tributaria, clave_acceso, codigo, fecha_emision, fecha_vencimiento, estado_pago, total_sin_impuesto, total_descuento, valor, propina, importe_total, abono, credito_tributario, true]
            );

            console.log("444444444444")

            /**Logica adicional para hacer automaticamente los asientos */
            const asiento = await db_postgres.one(
                "INSERT INTO cont_asientos (fecha_registro, fecha_asiento, referencia, documento, observacion, estado) VALUES (CURRENT_DATE, $1, $2, $3, $4, $5) RETURNING *",
                [fecha_emision, "Compra (Compra)", codigo, "Generado por el sistema", true]
            );
            const id_asiento = asiento.id_asiento
            console.log("55555555555555")
            // ACTIVO - CTA # 8 CAJA CHICA MATRIZ
            const detalle_asiento = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 8, "CAJA CHICA MATRIZ", codigo, 0.00, abono]
            );

            console.log("666666666666")
            // GASTOS - CTA # 42 PROVEEDORES
            const detalle_asiento2 = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 42, "PROVEEDORES", codigo, abono, 0.00]
            );
            /**FIN */

            const id_compra = compra.id_compra
            const pago = await db_postgres.one(
                "INSERT INTO cont_pagos (id_asiento, id_forma_pago, id_compra, fecha_pago, abono, observacion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [id_asiento, id_forma_pago, id_compra, fecha_pago, abono, observacion, true]
            );
        } else {
            console.log("solo ingresar compra")
            compra = await db_postgres.one(
                `INSERT INTO public.comp_compras (id_tipo_comprobante, id_proveedor, id_info_tributaria, clave_acceso, codigo, fecha_emision, fecha_vencimiento, estado_pago, total_sin_impuesto, total_descuento, valor, propina, importe_total, credito_tributario, estado)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
                [id_tipo_comprobante, id_proveedor, id_info_tributaria, clave_acceso, codigo, fecha_emision, fecha_vencimiento, estado_pago, total_sin_impuesto, total_descuento, valor, propina, importe_total, credito_tributario, true]
            );
        }
        res.json({
            ok: true,
            msg: "Compra creada correctamente.",
            compra,
        });
        console.log('crear compra: ', compra)
    } catch (error) {
        res.status(501).json({
            ok: false,
            msg: "Error al crear la compra. Por favor, inténtalo de nuevo.",
        });
    }
};

// Actualizar una compra
const updateCompra = async (req, res = response) => {
    const id_compra = req.params.id;
    const { fecha_vencimiento, id_forma_pago, fecha_pago, abono, observacion } = req.body;

    try {
        const compraExists = await db_postgres.oneOrNone("SELECT * FROM comp_compras WHERE id_compra = $1", [id_compra]);

        if (!compraExists) {
            return res.status(400).json({
                ok: false,
                msg: "La compra no existe. Por favor, proporciona un ID de compra válido.",
            });
        }

        // solo para actualizar la fecha vencimiento si no hay abono
        const abono1 = parseFloat(abono) || 0;
        const abono2 = parseFloat(compraExists.abono) || 0;

        let abono_sumado = 0;
        let compraUpdate;

        // Solo si llega un abono mayor a cero, hay obervación y forma de pago se hace el pago
        if (!isNaN(abono1) && (abono1 > 0) && !isNaN(id_forma_pago) && (fecha_pago !== null) && (observacion.trim() !== "")) {
            //if ((!isNaN(abono1) && !isNaN(abono2)) && (abono1 > 0) && (observacion.trim() !== "")) {
            abono_sumado = abono1 + abono2;
            let estado_pago = "PENDIENTE";
            if (compraExists.importe_total == abono_sumado) {
                estado_pago = "PAGADA";
            }
            compraUpdate = await db_postgres.one(
                "UPDATE comp_compras SET fecha_vencimiento = $1, estado_pago = $2, abono = $3 WHERE id_compra = $4 RETURNING *",
                [fecha_vencimiento, estado_pago, abono_sumado, id_compra]
            );


            /**Logica adicional para hacer automaticamente los pagos en asientos */
            const asiento = await db_postgres.one(
                "INSERT INTO cont_asientos (fecha_registro, fecha_asiento, referencia, documento, observacion, estado) VALUES (CURRENT_DATE, CURRENT_DATE, $1, $2, $3, $4) RETURNING *",
                ["Compra (Compra)", compraExists.codigo, "Generado por el sistema", true]
            );
            const id_asiento = asiento.id_asiento;
            // ACTIVO - CTA # 8 CAJA CHICA MATRIZ
            const detalle_asiento = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 8, "CAJA CHICA MATRIZ", compraExists.codigo, 0.00, abono]
            );

            // GASTOS - CTA # 38 PROVEEDORES
            const detalle_asiento2 = await db_postgres.one(
                "INSERT INTO cont_detalles_asientos (id_asiento, id_cuenta, descripcion, documento, debe, haber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [id_asiento, 38, "PROVEEDORES", compraExists.codigo, abono, 0.00]
            );
            /**FIN */

            const pago = await db_postgres.one(
                "INSERT INTO cont_pagos (id_asiento, id_forma_pago, id_compra, fecha_pago, abono, observacion, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [id_asiento, id_forma_pago, id_compra, fecha_pago, abono, observacion, true]

            );

        } else if (fecha_vencimiento !== null) {
            // No hay abono, observación o forma de pago válidos, y la fecha_vencimiento no es null, por lo que solo actualizamos fecha_vencimiento
            compraUpdate = await db_postgres.one(
                "UPDATE comp_compras SET fecha_vencimiento = $1 WHERE id_compra = $2 RETURNING *",
                [fecha_vencimiento, id_compra]
            );
        }

        res.json({
            ok: true,
            msg: "Compra actualizada correctamente.",
            compraUpdate,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al actualizar el compra. Por favor, inténtalo de nuevo.",
        });
    }
};

// Eliminar una compra
const deleteCompra = async (req, res = response) => {
    const id_compra = req.params.id;
    try {
        const compraExists = await db_postgres.oneOrNone("SELECT * FROM comp_compras WHERE id_compra = $1", [id_compra]);
        if (!compraExists) {
            return res.status(400).json({
                ok: false,
                msg: "El compra no existe. Por favor, proporciona un ID de compra válido.",
            });
        }
        const estado_pago = "ANULADA";
        const compraDelete = await db_postgres.query("UPDATE comp_compras SET estado = $1, estado_pago =$2 WHERE id_compra = $3 RETURNING *", [false, estado_pago, id_compra]);

        res.json({
            ok: true,
            msg: "Compra borrado correctamente.",
            compraDelete,
        });
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: "Error al eliminar el compra. Por favor, inténtalo de nuevo.",
        });
    }
};

module.exports = {
    getCompras,
    getComprasAll,
    getCompraById,
    createCompra,
    updateCompra,
    deleteCompra,
};
