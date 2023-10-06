const { response } = require('express');
const { db_postgres } = require("../../database/config");

const getApus = async (req, res = response) => {

    const apus = await db_postgres.query('SELECT * FROM apu_header ');

    res.json({
        ok: true,
        apus
    });

};


module.exports = {
    getApus

}