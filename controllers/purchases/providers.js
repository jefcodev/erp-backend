const { response } = require('express');
const { db_postgres } = require("../../database/config");

const getProviders = async (req, res) => {

    const providers = await db_postgres.query('SELECT * FROM pur_providers ');

    res.json({
        ok: true,
        providers
    });

};



module.exports={
 getProviders

}