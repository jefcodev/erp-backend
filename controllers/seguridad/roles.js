const { response } = require('express');
const { db_postgres } = require("../../database/config");

const getRoles = async (req, res) => {

    const roles = await db_postgres.query('SELECT * FROM sec_roles');

    res.json({
        ok: true,
        roles
    });

}

const createRol = async (req, res = response) => {
    const { nombre, descripcion, permisos } = req.body;

    try {

        const rol = await db_postgres.query('INSERT INTO sec_roles (nombre, descripcion, estado,permisos) VALUES ($1,$2,$3,$4);',
            [nombre, descripcion, true, permisos]);

        res.json({
            ok: true,
            msg: "Rol creado correctamente"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


};


const updateRol = async (req, res = response) => {

    const {id} = req.params;
    const {nombre,descripcion, permisos} = req.body;
    try {

        const rol = await db_postgres.oneOrNone("SELECT * FROM sec_roles WHERE id = $1", [1]);

        if (!rol) {
            return res.status(404).json({
                ok: true,
                msg: 'Rol no encontrado por id',
            });
        }

        // Actualizar rol

        const rolActualizado = await db_postgres.query("UPDATE sec_roles SET nombre = $1, descripcion =$2, permisos =$3 WHERE id = $4",
        [nombre,descripcion,permisos,id])

        res.json({
            ok: true,
            msg:"Rol actualizado correctamente"
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};


const deleteRol = async (req, res = response) => {

    const {id} = req.params;
    try {

        // Consultar si el rol existe
        const rol = await db_postgres.oneOrNone("SELECT * FROM sec_roles WHERE id = $1", [id]);

        if (!rol) {
            return res.status(404).json({
                ok: true,
                msg: 'Rol no encontrado',
            });
        }


       // Verificar si el rol esta en uso
       const rolUso = await db_postgres.oneOrNone("SELECT * FROM sec_users WHERE rol_id = $1 ", [id]);

       if (rolUso) {
           return res.status(400).json({
               ok: false,
               msg: "No se puede eliminar por que el rol esta en uso",
           });
       }

        // Actualizar rol

        const rolActualizado = await db_postgres.query("UPDATE sec_roles SET estado = $1 WHERE id = $2",
        [false,id])

        res.json({
            ok: true,
            msg:"Rol eliminado correctamente"
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

};


module.exports = {
    getRoles,
    createRol,
    updateRol,
    deleteRol
}