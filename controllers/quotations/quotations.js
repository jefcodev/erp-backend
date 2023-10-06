const { response } = require("express");
const { db_postgres } = require("../../database/config");

const getQuotations = async (req, res) => {
    const quotations = await db_postgres.query("SELECT * FROM quo_headers ");

    res.json({
        ok: true,
        quotations,
    });
};

const createQuotation = async (req, res = response) => {
    const uid = req.uid;
    console.log(uid);
    const { date_quo, code_quo, id_client, products } = req.body;

    try {
        const usuario = await db_postgres.query("SELECT nombre FROM sec_users where id=$1",[uid]);

        // Desestructurar para contar la cantidad de usuarios
        let nombreUser;
        usuario.forEach(({ nombre }) => {
            nombreUser = nombre;
        });
        
        const quo_header = await db_postgres.query(
            `INSERT INTO quo_headers (date_quo, code_quo, id_client, status, created) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [date_quo, code_quo, id_client, true, nombreUser]
        );

        let quo_headerId;
        quo_header.forEach(({ id }) => {
            quo_headerId = id;
        });
        if (products && products.length > 0) {
            const values = products
                .map(
                    (
                        product
                    ) => `( ${quo_headerId}, ${product.id}, '${product.description_product}', 
                            ${product.amount_product}, ${product.iva_product},${product.price_product})`
                )
                .join(",");
            await db_postgres.query(
                `INSERT INTO quo_details (id_quo_header, id_product, description_product, 
                    amount_product, iva_product, price_product) VALUES ${values}`
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
            error: "Error al crear el producto.",
        });
    }
};

module.exports = {
    getQuotations,
    createQuotation,
};
