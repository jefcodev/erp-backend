const { response } = require('express');
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
            mensaje: 'Error en el servidor',
        });
    }
};




module.exports = {
    getApus

}