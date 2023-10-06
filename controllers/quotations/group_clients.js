const { response } = require('express');
const { db_postgres } = require("../../database/config");

const getGroupClients = async (req, res) => {

    const groupClients = await db_postgres.query('SELECT * FROM sal_group_clients ');

    res.json({
        ok: true,
        groupClients
    });

};



module.exports={
    getGroupClients

}