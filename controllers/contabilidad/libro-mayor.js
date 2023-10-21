const { response } = require("express");
const { validationResult } = require("express-validator");
const { generarJWT } = require("../../helpers/jwt");
const { db_postgres } = require("../../database/config");

// Obtener el libro mayor
const getLibroMayor = async (req, res) => {
    try {
        const libro_mayor = await db_postgres.query(
            "SELECT c.codigo, c.descripcion, SUM(da.debe) AS total_debe, SUM(da.haber) AS total_haber, SUM(da.debe) - SUM(da.haber) AS saldo FROM cont_asientos a JOIN cont_detalle_asientos da ON a.id_asiento = da.id_asiento JOIN CONT_CUENTAS c ON da.id_cuenta = c.ID_CUENTA GROUP BY c.codigo, c.descripcion ORDER BY c.codigo");
        res.json({
            ok: true,
            libro_mayor,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el libro mayor.",
        });
    }
};

module.exports = {
    getLibroMayor,
};
