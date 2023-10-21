const { response } = require("express");
const { validationResult } = require("express-validator");
const { generarJWT } = require("../../helpers/jwt");
const { db_postgres } = require("../../database/config");

// Obtener el estado de resultado
const getEstadoResultado = async (req, res) => {
    try {
        const estado_resultado = await db_postgres.query(
            "SELECT c.ID_CUENTA, c.CODIGO, c.DESCRIPCION, SUM(da.DEBE) - SUM(da.HABER) AS SALDO " +
            "FROM CONT_CUENTAS c " +
            "LEFT JOIN CONT_DETALLE_ASIENTOS da ON c.ID_CUENTA = da.ID_CUENTA " +
            "WHERE c.CODIGO LIKE '4%' OR c.CODIGO LIKE '5%' OR c.CODIGO LIKE '6%' " +
            "GROUP BY c.ID_CUENTA, c.CODIGO, c.DESCRIPCION " +
            "HAVING SUM(da.DEBE) - SUM(da.HABER) IS NOT NULL " +
            "UNION " +
            "SELECT 4, '4', 'INGRESOS', NULL " +
            "UNION " +
            "SELECT 5, '5', 'EGRESOS', NULL " +
            "UNION " +
            "SELECT 6, '6', 'GASTOS', NULL " +
            "ORDER BY CODIGO"
        );
        res.json({
            ok: true,
            estado_resultado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el estado de resultado.",
        });
    }
};


// Obtener la suma de debe y haber del libro diario
const getSumaIEG = async (req, res) => {
    try {
        const suma_ieg = await db_postgres.query(

            "SELECT " +
            "SUM(CASE WHEN c.CODIGO LIKE '4%' THEN da.DEBE - da.HABER ELSE 0 END) AS Ingreso, " +
            "SUM(CASE WHEN c.CODIGO LIKE '5%' THEN da.DEBE - da.HABER ELSE 0 END) AS Egreso, " +
            "SUM(CASE WHEN c.CODIGO LIKE '6%' THEN da.DEBE - da.HABER ELSE 0 END) AS Gasto " +
            "FROM CONT_CUENTAS c " +
            "LEFT JOIN CONT_DETALLE_ASIENTOS da ON c.ID_CUENTA = da.ID_CUENTA " +
            "WHERE c.CODIGO LIKE '4%' OR c.CODIGO LIKE '5%' OR c.CODIGO LIKE '6%'"
        );
        res.json({
            ok: true,
            suma_ieg,
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
    getEstadoResultado,
    getSumaIEG,
};
