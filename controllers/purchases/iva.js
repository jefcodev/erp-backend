const { response } = require('express');
const { db_postgres } = require("../../database/config");

const getIva = async (req, res) => {

    const iva = await db_postgres.query('SELECT * FROM pur_iva ');

    res.json({
        ok: true,
        iva
    });

};






module.exports={
 getIva

}