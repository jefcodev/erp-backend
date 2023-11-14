const { response } = require("express");
const { db_postgres } = require("../../database/config");

const getApus = async (req, res = response) => {
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
}; 


const getApuDetalle = async (req, res = response) => {
    try {
      // Suponemos que tienes un parámetro en la URL para especificar la cabecera de la que deseas obtener el detalle.
      const cabeceraId = req.params.id; // Asume que está en la URL o en los parámetros de la solicitud.
        

      const capituloQuery = await db_postgres.query(
        `SELECT * FROM apu_capitulo WHERE id_capitulo =$1`,[cabeceraId]
      );
      // Consulta la base de datos para obtener los detalles de apu_mano_obra relacionados con la cabecera especificada.
      const manoObraQuery = await db_postgres.query(
        `SELECT * FROM apu_mano_obra WHERE id_capitulo = $1`,
        [cabeceraId]
      );
  
      // Consulta la base de datos para obtener los detalles de apu_materiales relacionados con la cabecera especificada.
      const materialesQuery = await db_postgres.query(
        `SELECT * FROM apu_materiales WHERE id_capitulo = $1`,
        [cabeceraId]
      );
  
      // Consulta la base de datos para obtener los detalles de apu_equipos relacionados con la cabecera especificada.
      const equiposQuery = await db_postgres.query(
        `SELECT * FROM apu_equipos WHERE id_capitulo = $1`,
        [cabeceraId]
      );
  
      res.json({
        ok: true,
        capitulo: capituloQuery,
        mano_obra: manoObraQuery,
        materiales: materialesQuery,
        equipos: equiposQuery,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        mensaje: "Error en el servidor",
      });
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
const insertarTransporte = async (capituloId, transporte) => {
  if (transporte && transporte.length > 0) {
    const valoresTransporte = transporte
      .map(
        (transporte) =>
          `(${capituloId}, '${transporte.codigot}', '${transporte.descripciont}', ${transporte.cantidadt},'${transporte.unidadt}',${transporte.preciot} )`
      )
      .join(",");
    await db_postgres.query(
      `INSERT INTO apu_transporte (id_capitulo, codigo, descripcion, cantidad, unidad, costo) VALUES ${valoresTransporte}`
    );
  }
};

const createApu = async (req, res) => {
  const { codigo, nombre, descripcion, rendimiento, unidad , total,materiales, equipos, mano_obra, transporte } =
    req.body;

  try {
    const apu_capitulo = await db_postgres.query(
      `INSERT INTO apu_capitulo (codigo, nombre, descripcion, rendimiento, unidad, total) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_capitulo`,
      [codigo, nombre, descripcion, rendimiento, unidad, total]
    );

    let capituloId;
    apu_capitulo.forEach(({ id_capitulo }) => {
      capituloId = id_capitulo;
    });

    await Promise.all([
      insertarMateriales(capituloId, materiales),
      insertarEquipos(capituloId, equipos),
      insertarManoObra(capituloId, mano_obra),
      insertarTransporte(capituloId, transporte),

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
  getApuDetalle,
  createApu
};
