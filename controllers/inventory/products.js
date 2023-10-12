const { response } = require('express');
const { db_postgres } = require("../../database/config");

const getProducts = async (req, res) => {

    const products = await db_postgres.query('SELECT * FROM inve_productos ');
    const totalValor = await db_postgres.query('SELECT COUNT(*) FROM inve_productos');

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
    const { id_tipo_inventario, id_categorias, id_unidad, id_ice, codigo, descripcion, especificaciones, ficha, stock, stock_minimo, stock_maximo, iva, precios } = req.body;

    try {
        
        // Verificar si el código existe
        const codigoExists = await db_postgres.oneOrNone(
            "SELECT * FROM inve_productos WHERE codigo = $1",
            [codigo]
        );

        if (codigoExists) {
            return res.status(400).json({
                ok: false,
                msg: "El código ya existe",
            });
        }

        // Insertar el producto en la tabla INVE_PRODUCTOS
        const producto = await db_postgres.query(
            `INSERT INTO inve_productos (id_tipo_inventario, id_categorias, id_unidad, id_ice, codigo, descripcion,especificaciones,ficha, stock, stock_minimo, stock_maximo, iva, estado) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id_producto`,
            [id_tipo_inventario, id_categorias, id_unidad, id_ice, codigo, descripcion, especificaciones, ficha, stock, stock_minimo, stock_maximo, iva, true]
        );

        let productId;
        producto.forEach(({ id_producto }) => {
            productId = id_producto;
        });

        if (precios && precios.length > 0) {
            // Insertar precios en la tabla INVE_PRECIOS
            const valoresPrecios = precios.map(precio => `(${productId}, ${precio}, 0)`).join(',');
            await db_postgres.query(
                `INSERT INTO inve_precios (id_producto, precio, utilidad) VALUES ${valoresPrecios}`
            );
        }

        res.json({
            ok: true,
            msg: 'Producto creado exitosamente.'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error: 'Error al crear el producto.'

        });
    }
};




const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {id_tipo_inventario, id_categorias, id_unidad, id_ice, codigo, descripcion, especificaciones, ficha, stock, stock_minimo, stock_maximo, iva, precios} = req.body;

    try {
        // Verificar si el producto existe
        const productoExists = await db_postgres.oneOrNone(
            "SELECT * FROM inve_productos WHERE id_producto = $1",
            [id]
        );

        if (!productoExists) {
            return res.status(404).json({
                ok: false,
                msg: "El producto no existe",
            });
        }

        // Actualizar el producto en la tabla INVE_PRODUCTOS
        await db_postgres.none(
            `UPDATE inve_productos
            SET id_tipo_inventario = $2,
                id_categorias = $3,
                id_unidad = $4,
                id_ice = $5,
                codigo = $6,
                descripcion = $7,
                especificaciones = $8,
                ficha = $9,
                stock = $10,
                stock_minimo = $11,
                stock_maximo = $12,
                iva = $13
            WHERE id_producto = $1`,
            [
                id,
                id_tipo_inventario,
                id_categorias,
                id_unidad,
                id_ice,
                codigo,
                descripcion,
                especificaciones,
                ficha,
                stock,
                stock_minimo,
                stock_maximo,
                iva,
            ]
        );

        if (precios && precios.length > 0) {
            // Eliminar precios antiguos del producto
            await db_postgres.none(
                "DELETE FROM inve_precios WHERE id_producto = $1",
                [id]
            );

            // Insertar nuevos precios en la tabla INVE_PRECIOS
            const valoresPrecios = precios.map(
                (precio) => `(${id}, ${precio}, 0)`
            ).join(',');
            await db_postgres.query(
                `INSERT INTO inve_precios (id_producto, precio, utilidad) VALUES ${valoresPrecios}`
            );
        }

        res.json({
            ok: true,
            msg: 'Producto actualizado exitosamente.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            error: 'Error al actualizar el producto.'
        });
    }
};




module.exports = {
    getProducts,
    createProduct,
    updateProduct

}