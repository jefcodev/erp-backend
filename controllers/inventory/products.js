const { response } = require('express');
const { db_postgres } = require("../../database/config");

const getProducts = async (req, res) => {

    const products = await db_postgres.query('SELECT * FROM inv_products ');
    const totalValor = await db_postgres.query('SELECT COUNT(*) FROM inv_products');

    let total;
    totalValor.forEach(({ count }) => {
        total = count;
    });

    res.json({
        ok: true,
        products,
        total
    });

};

const createProduct = async (req, res) => {
    const { sku, name, description, specifications, pur_price, mini_stock, stock, prices , id_category, id_iva, id_unit} = req.body;

    try {

        const product = await db_postgres.query(`INSERT INTO inv_products (sku, name, description, specifications, pur_price, status, mini_stock, stock, id_category, id_iva, id_unit) 
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`, [sku, name, description, specifications, pur_price, true, mini_stock, stock, id_category, id_iva, id_unit]);

         let productId;
         product.forEach(({ id }) => {
                productId = id;
         });
         
         if (prices && prices.length > 0) {
            const priceValues = prices.map(price => `(${productId}, ${price})`).join(',');
            await db_postgres.query(`INSERT INTO inv_prices (id_product, price) VALUES ${priceValues}`);
        }
     

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
    getProducts,
    createProduct

}