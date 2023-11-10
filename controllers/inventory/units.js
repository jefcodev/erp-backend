const { response } = require('express');
const { db_postgres } = require("../../database/config");

const getUnits = async (req, res) => {

    const units = await db_postgres.query('SELECT * FROM inve_unidades_medida ');

    res.json({
        ok: true,
        units
    });

};

const createUnit = async (req, res = response) => {
    const { name_units } = req.body;

    try {

        const unit = await db_postgres.query('INSERT INTO inve_unidades_medida (name_units, status) VALUES ($1,$2);',
            [name_units,true]);

        res.json({
            ok: true,
            msg: "Unidad creado correctamente"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


};


const updateUnit = async (req, res = response) => {

    const {id} = req.params;
    const {name_units} = req.body;
    try {

        // Consultar si la unidad existe
        const unit = await db_postgres.oneOrNone("SELECT * FROM inv_units WHERE id = $1", [id]);

        if (!unit) {
            return res.status(404).json({
                ok: true,
                msg: 'Unidad no encontrado',
            });
        }


        // Actualizar categoría

        const unitUpdate = await db_postgres.query("UPDATE inv_units SET name_units = $1 WHERE id = $2",
        [name_units,id])

        res.json({
            ok: true,
            msg:"Unidad actualizada correctamente"
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};


const deleteUnit = async (req, res = response) => {

    const {id} = req.params;
    try {

        // Consultar si la unidad existe
        const unit = await db_postgres.oneOrNone("SELECT * FROM inv_units WHERE id = $1", [id]);

        if (!unit) {
            return res.status(404).json({
                ok: true,
                msg: 'Unidad no encontrado',
            });
        }


       // Verificar si la categoría esta en uso
       const unitUse = await db_postgres.query("SELECT * FROM inv_products WHERE id_unit = $1 ", [id]);
        
       if (unitUse) {
           return res.status(400).json({
               ok: false,
               msg: "No se puede eliminar por que la unidad esta en uso",
           });
       }

        // Actualizar categoría

        const categorieUpdate = await db_postgres.query("UPDATE inv_units SET status = $1 WHERE id = $2",
        [false,id])

        res.json({
            ok: true,
            msg:"Unidad eliminado correctamente"
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
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit

}