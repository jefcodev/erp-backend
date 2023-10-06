const { response } = require('express');
const { db_postgres } = require("../../database/config");

const getPurchases = async (req, res) => {

    const purchases = await db_postgres.query('SELECT * FROM pur_headers ');

    res.json({
        ok: true,
        purchases
    });

};

/* const createPurchase = async (req, res) => {

    const {date_buy, code_buy,id_supplier, products} = req.body;

    try {

        const pur_header = await db_postgres.query(`INSERT INTO pur_headers (date_buy, code_buy,id_supplier, status) VALUES ($1, $2, $3, $4) RETURNING id`, [date_buy, code_buy, id_supplier, true]);
         let pur_headerId;
         pur_header.forEach(({ id }) => {
            pur_headerId = id;
         });
         
         if (products && products.length > 0) {
            const priceValues = products.map(resp => `(${pur_headerId}, ${resp})`).join(',');
            await db_postgres.query(`INSERT INTO pur_details (id_pur_header, id_product) VALUES ${priceValues}`);
        }
     
        res.json({
            ok: true,
            message: 'Compra creado exitosamente.'
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            error: 'Error al crear el producto.'
        });
    }
}; */


const createPurchase = async (req, res) => {
    const { date_buy, code_buy, id_supplier, products } = req.body;

    try {
        const pur_header = await db_postgres.query(
            `INSERT INTO pur_headers (date_buy, code_buy, id_supplier, status) VALUES ($1, $2, $3, $4) RETURNING id`,
            [date_buy, code_buy, id_supplier, true]
        );

        let pur_headerId;
        pur_header.forEach(({ id}) => {
           pur_headerId = id;
        });

        if (products && products.length > 0) {
            const values = products.map((product) => `(${pur_headerId}, ${product.id}, '${product.description_product}', 
            ${product.amount_product}, ${product.iva_product},${product.price_product})`).join(',');
            await db_postgres.query(
                `INSERT INTO pur_details (id_pur_header, id_product, description_product, amount_product, iva_product, price_product) VALUES ${values}`
            );
        }
        
        res.json({
            ok: true,
            message: 'Compra creada exitosamente.',
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error: 'Error al crear el producto.',
        });
    }
};

module.exports={
 getPurchases,
 createPurchase

}