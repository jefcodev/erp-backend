const { response } = require("express");
const { db_postgres } = require("../../database/config");

/* const getApus = async (req, res = response) => {
  try {
    const apusQuery = await db_postgres.query(` SELECT * FROM apu_capitulo`);

    res.json({
      ok: true,
      datos: apusQuery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor",
    });
  }
};  */

const getApus = async (req, res) => {
    try {
      const codigoCapitulo = 'CAP-010'; // Reemplaza con el código deseado
  
      // Realiza una consulta SQL para obtener los datos del capítulo
      const capituloQuery = await db_postgres.query(`
        SELECT codigo, nombre, descripcion
        FROM apu_capitulo
        WHERE codigo = $1
      `, [codigoCapitulo]);
  
      // Verifica si se encontraron resultados
      if (capituloQuery && capituloQuery.rows && capituloQuery.rows.length === 0) {
        return res.status(404).json({ mensaje: "Capítulo no encontrado" });
      }
  
      // Obtiene los datos del capítulo
      const capituloData = capituloQuery.rows[0];
  
      // Realiza consultas SQL para obtener los datos de materiales, equipos y mano de obra
      const materialesQuery = await db_postgres.query(`
        SELECT codigo, descripcion, cantidad, unidad, desperdicio, precio
        FROM apu_materiales
        WHERE id_capitulo = $1
      `, [capituloData.id_capitulo]);
  
      const equiposQuery = await db_postgres.query(`
        SELECT codigo, descripcion, cantidad, unidad, precio
        FROM apu_equipos
        WHERE id_capitulo = $1
      `, [capituloData.id_capitulo]);
  
      const manoObraQuery = await db_postgres.query(`
        SELECT codigo, descripcion, cantidad, unidad, precio
        FROM apu_mano_obra
        WHERE id_capitulo = $1
      `, [capituloData.id_capitulo]);
  
      // Formatea los resultados en la estructura deseada
      const response = {
        codigo: capituloData.codigo,
        nombre: capituloData.nombre,
        descripcion: capituloData.descripcion,
        materiales: materialesQuery.rows,
        equipos: equiposQuery.rows,
        mano_obra: manoObraQuery.rows,
      };
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error en el servidor" });
    }
  };
  


const insertarMateriales = async (capituloId, materiales) => {
  if (materiales && materiales.length > 0) {
    const valoresMateriales = materiales
      .map(
        (material) =>
          `(${capituloId}, '${material.codigo}', '${material.descripcion}', ${material.cantidad},'${material.unidad}',${material.desperdicio},${material.precio} )`
      )
      .join(",");
    await db_postgres.query(
      `INSERT INTO apu_materiales (id_capitulo, codigo, descripcion, cantidad, unidad, desperdicio, precio) VALUES ${valoresMateriales}`
    );
  }
};

const insertarEquipos = async (capituloId, equipos) => {
  if (equipos && equipos.length > 0) {
    const valoresEquipos = equipos
      .map(
        (equipo) =>
          `(${capituloId}, '${equipo.codigoe}', '${equipo.descripcione}', ${equipo.cantidade},'${equipo.unidade}',${equipo.precioe} )`
      )
      .join(",");
    await db_postgres.query(
      `INSERT INTO apu_equipos (id_capitulo, codigo, descripcion, cantidad, unidad, precio) VALUES ${valoresEquipos}`
    );
  }
};

const insertarManoObra = async (capituloId, mano_obra) => {
  if (mano_obra && mano_obra.length > 0) {
    const valoresManoObra = mano_obra
      .map(
        (manoObra) =>
          `(${capituloId}, '${manoObra.codigom}', '${manoObra.descripcionm}', ${manoObra.cantidadm},'${manoObra.unidadm}',${manoObra.preciom} )`
      )
      .join(",");
    await db_postgres.query(
      `INSERT INTO apu_mano_obra (id_capitulo, codigo, descripcion, cantidad, unidad, precio) VALUES ${valoresManoObra}`
    );
  }
};

const createApu = async (req, res) => {
  const { codigo, nombre, descripcion, rendimiento, unidad , materiales, equipos, mano_obra } =
    req.body;

  try {
    const apu_capitulo = await db_postgres.query(
      `INSERT INTO apu_capitulo (codigo, nombre, descripcion, rendimiento, unidad) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id_capitulo`,
      [codigo, nombre, descripcion, rendimiento, unidad]
    );

    let capituloId;
    apu_capitulo.forEach(({ id_capitulo }) => {
      capituloId = id_capitulo;
    });

    await Promise.all([
      insertarMateriales(capituloId, materiales),
      insertarEquipos(capituloId, equipos),
      insertarManoObra(capituloId, mano_obra),
    ]);

    res.json({
      ok: true,
      msg: "APU creado exitosamente.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: "Error al crear el APU.",
    });
  }
};

module.exports = {
  getApus,
  createApu,
};
