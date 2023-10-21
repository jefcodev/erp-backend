const { response } = require("express");
const { validationResult } = require("express-validator");
const { generarJWT } = require("../../helpers/jwt");
const { db_postgres } = require("../../database/config");

// Obtener el libro diario
const getLibroDiario = async (req, res) => {
    try {
        const libro_diario = await db_postgres.query(
            "SELECT a.id_asiento, a.fecha, c.codigo, c.descripcion, da.debe, da.haber FROM cont_asientos a JOIN cont_detalle_asientos da ON a.id_asiento = da.id_asiento JOIN CONT_CUENTAS c ON da.id_cuenta = c.ID_CUENTA ORDER BY a.fecha");
        res.json({
            ok: true,
            libro_diario,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el libro diario.",
        });
    }
};

// Obtener la suma de debe y haber del libro diario
const getSumaDebeHaber = async (req, res) => {
    try {
        const suma_debe_haber = await db_postgres.query(
            "SELECT SUM(debe) AS total_debe, SUM(haber) AS total_haber FROM cont_detalle_asientos");
        res.json({
            ok: true,
            suma_debe_haber,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener la suma.",
        });
    }
};

module.exports = {
    getLibroDiario,
    getSumaDebeHaber,
};
