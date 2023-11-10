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
                    `(${capituloId}, '${equipo.codigo}', '${equipo.descripcion}', ${equipo.cantidad},'${equipo.unidad}',${equipo.precio} )`
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
                    `(${capituloId}, '${manoObra.codigo}', '${manoObra.descripcion}', ${manoObra.cantidad},'${manoObra.unidad}',${manoObra.precio} )`
            )
            .join(",");
        await db_postgres.query(
            `INSERT INTO apu_mano_obra (id_capitulo, codigo, descripcion, cantidad, unidad, precio) VALUES ${valoresManoObra}`
        );
    }
};

const createApu = async (req, res) => {
    const { codigo, nombre, descripcion, materiales, equipos, mano_obra } = req.body;

    try {
        const apu_capitulo = await db_postgres.query(
            `INSERT INTO apu_capitulo (codigo, nombre, descripcion) 
            VALUES ($1, $2, $3) RETURNING id_capitulo`,
            [codigo, nombre, descripcion]
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
            msg: 'APU creado exitosamente.'

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error: 'Error al crear el APU.'
        });
    }
};


module.exports = {
  getApus,
  createApu,
};
