const { response } = require('express');
const { db_postgres } = require("../../database/config");

const getClients = async (req, res = response) => {

    try {
        const desde = Number(req.query.desde) || 0;
        const limit = 5;

        //Consultas
        const queryClients = ` SELECT * FROM sal_clients OFFSET $1 LIMIT $2;`;
        const queryClientsCount = `SELECT COUNT(*) FROM sal_clients ;`;

        //Promesas
        const [clients, total] = await Promise.all([
            db_postgres.query(queryClients, [desde, limit]),
            db_postgres.one(queryClientsCount)
        ]);

        const totalCount = total.count;

        res.json({
            ok: true,
            clients,
            total: totalCount
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Error al obtener los datos",
        });

    }

};

const createClient = async (req, res) => {
    // True si es empresa y false si es individual
    const { ci, name, lastname, address, phone, email, id_group_cli, type, tradename} = req.body;

    try {

        const product = await db_postgres.query(`INSERT INTO sal_clients  (ci, name, lastname, address, phone, email, id_group_cli, status, type, tradename) 
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`, [ci, name, lastname, address, phone, email, id_group_cli, true, type, tradename]);


        res.json({
            ok: true,
            product,
            message: 'Producto creado exitosamente.'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error al crear el producto.'
        });
    }
};



module.exports = {
    getClients,
    createClient

}