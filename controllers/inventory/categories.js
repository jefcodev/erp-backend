const { response } = require('express');
const { db_postgres } = require("../../database/config");

const getCategories = async (req, res) => {

    const categories = await db_postgres.query('SELECT * FROM inve_categorias ');

    res.json({
        ok: true,
        categories
    });

};


const createCategorie = async (req, res = response) => {
    const { name } = req.body;

    try {

        const rol = await db_postgres.query('INSERT INTO inv_categories (name, status) VALUES ($1,$2);',
            [name,true]);

        res.json({
            ok: true,
            msg: "Categoría creado correctamente"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};


const updateCategorie = async (req, res = response) => {

    const {id} = req.params;
    const {name} = req.body;

    try {

        // Consultar si la categoría existe
        const categorie = await db_postgres.oneOrNone("SELECT * FROM inv_categories WHERE id = $1", [id]);

        if (!categorie) {
            return res.status(404).json({
                ok: true,
                msg: 'Categoría no encontrado',
            });
        }

        // Actualizar categoría

        const categorieUpdate = await db_postgres.query("UPDATE inv_categories SET name = $1 WHERE id = $2",
        [name,id])

        res.json({
            ok: true,
            msg:"Categoría actualizada correctamente"
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};



const deleteCategorie = async (req, res = response) => {

    const {id} = req.params;
    try {

        // Consultar si la categoría existe
        const categorie = await db_postgres.oneOrNone("SELECT * FROM inv_categories WHERE id = $1", [id]);

        if (!categorie) {
            return res.status(404).json({
                ok: true,
                msg: 'Categoría no encontrado',
            });
        }


       // Verificar si la categoría esta en uso
       const categorieUse = await db_postgres.query("SELECT * FROM inv_products WHERE id_category = $1 ", [id]);

       if (categorieUse) {
           return res.status(400).json({
               ok: false,
               msg: "No se puede eliminar por que la categoría esta en uso",
           });
       }

        // Actualizar categoría

        const categorieUpdate = await db_postgres.query("UPDATE inv_categories SET status = $1 WHERE id = $2",
        [false,id])

        res.json({
            ok: true,
            msg:"Categorie eliminado correctamente"
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};



module.exports ={
    getCategories,
    createCategorie,
    updateCategorie,
    deleteCategorie
}