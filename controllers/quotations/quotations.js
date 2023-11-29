const { response } = require("express");
const { db_postgres } = require("../../database/config");

const getQuotations = async (req, res) => {
  const quotations = await db_postgres.query("SELECT * FROM vent_proformas ORDER BY id_proforma DESC");
  res.json({
    ok: true,
    quotations,
  });
};

const createQuotation = async (req, res = response) => {
  const { id_cliente, fecha, descuento, total, productos } = req.body;

  try {
    const quo_header = await db_postgres.query(
      `INSERT INTO vent_proformas (id_cliente, fecha, descuento, total, estado) VALUES ($1, $2, $3, $4, $5) RETURNING id_proforma`,
      [id_cliente, fecha, descuento, total, false]
    );

    let prof_id;
    quo_header.forEach(({ id_proforma }) => {
      prof_id = id_proforma;
    });

    if (productos && productos.length > 0) {
      const values = productos
        .map(
          (productos) => `( ${prof_id}, '${productos.item}', ${productos.item_id}, 
                            ${productos.cantidad}, ${productos.precio_unitario},${productos.descuento})`
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

module.exports = {
  getQuotations,
  createQuotation,
};
