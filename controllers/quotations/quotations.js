const { response } = require("express");
const { db_postgres } = require("../../database/config");
const { validationResult } = require("express-validator");

const getQuotations = async (req, res) => {
  const quotations = await db_postgres.query("SELECT * FROM vent_proformas ORDER BY id_proforma DESC");
  res.json({
    ok: true,
    quotations,
  });
};


const getQuotationsId = async (req, res) => {
  try {
    const { id } = req.params;

    // Consulta principal para obtener los datos de la proforma
    const proforma = await db_postgres.oneOrNone(
      'SELECT * FROM vent_proformas WHERE id_proforma = $1',
      [id]
    );

    if (!proforma) {
      return res.status(404).json({ error: 'Proforma no encontrada' });
    }

    // Consulta para obtener los detalles de la proforma
    const detalles = await db_postgres.query(
      'SELECT * FROM vent_detalles_proformas WHERE id_proforma = $1',
      [id]
    );

    // Combina los datos de la proforma y los detalles
    const proformaId = {
      ...proforma,
      detalle: detalles || [],
    };

    res.status(200).json({
      ok: true,
      proformaId
    }
      
      );
  } catch (error) {
    console.error('Error al obtener la proforma por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



const createVentaProfroma = async (req, res = response) => {
  const { id_tipo_comprobante, id_cliente, id_info_tributaria, clave_acceso, codigo, fecha_emision, fecha_vencimiento, total_sin_impuesto, total_descuento, valor, propina, importe_total, id_forma_pago, fecha_pago, abono, observacion } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({
          ok: false,
          errors: errors.array(),
          msg: "Datos no válidos. Por favor, verifica los campos.",
      });
  }

  try {
      let venta;
      let estado_pago = "PENDIENTE";

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







/* De proforma a factura  */

const createVenta = async (req, res = response) => {
  const { id_tipo_comprobante, id_cliente, id_info_tributaria, clave_acceso, codigo, fecha_emision, fecha_vencimiento, total_sin_impuesto, total_descuento, valor, propina, importe_total, id_forma_pago, fecha_pago, abono, observacion , id_proforma} = req.body;
  const errors = validationResult(req);
  console.log('Id prforma' + id_proforma);
  
  /* Actualizar estado de proforma */
  await db_postgres.result(
    "UPDATE vent_proformas SET estado = $1 WHERE id_proforma = $2",
    [true, id_proforma] );


  if (!errors.isEmpty()) {
      return res.status(400).json({
          ok: false,
          errors: errors.array(),
          msg: "Datos no válidos. Por favor, verifica los campos.",
      });
  }
  try {
      let venta;
      let estado_pago = "PENDIENTE";
      
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

/* De proforma a factura FIN */
















const createQuotation = async (req, res = response) => {
  const { id_cliente, fecha, descuento, total, detalle } = req.body;

  try {
    const quo_header = await db_postgres.query(
      `INSERT INTO vent_proformas (id_cliente, fecha, descuento, total, estado) VALUES ($1, $2, $3, $4, $5) RETURNING id_proforma`,
      [id_cliente, fecha, descuento, total, false]
    );

    let prof_id;
    quo_header.forEach(({ id_proforma }) => {
      prof_id = id_proforma;
    });

    if (detalle && detalle.length > 0) {
      const values = detalle
        .map(
          (detalle) => `( ${prof_id}, '${detalle.item}', ${detalle.item_id}, 
                            ${detalle.cantidad}, ${detalle.precio_unitario},${detalle.descuento})`
        )
        .join(",");
    
      await db_postgres.query(
        `INSERT INTO vent_detalles_proformas (id_proforma, item, item_id, cantidad, precio_unitario, descuento) VALUES ${values}`
      );
    }
    res.json({
      ok: true,
      message: "Cotización creada exitosamente.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: "Error al crear LA COTIZACIÓN.",
    });
  }
};

const updateQuotation = async (req, res = response) => {
  const { id_proforma, id_cliente, fecha, descuento, total, detalle } = req.body;

  try {
    // Actualizar la cabecera de la cotización
    await db_postgres.query(
      `UPDATE vent_proformas 
       SET id_cliente = $1, fecha = $2, descuento = $3, total = $4 
       WHERE id_proforma = $5`,
      [id_cliente, fecha, descuento, total, id_proforma]
    );

    // Eliminar los detalles existentes de la cotización
    await db_postgres.query(
      `DELETE FROM vent_detalles_proformas 
       WHERE id_proforma = $1`,
      [id_proforma]
    );

    // Insertar los nuevos detalles de la cotización, si los hay
    if (detalle && detalle.length > 0) {
      const values = detalle
        .map(
          (detalle) => `( ${id_proforma}, '${detalle.item}', ${detalle.item_id}, 
                            ${detalle.cantidad}, ${detalle.precio_unitario},${detalle.descuento})`
        )
        .join(",");
    
      await db_postgres.query(
        `INSERT INTO vent_detalles_proformas (id_proforma, item, item_id, cantidad, precio_unitario, descuento) VALUES ${values}`
      );
    }

    res.json({
      ok: true,
      message: "Cotización actualizada exitosamente.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: "Error al actualizar la cotización.",
    });
  }
};


module.exports = {
  getQuotations,
  createQuotation,
  getQuotationsId,
  updateQuotation,
  createVenta
};
