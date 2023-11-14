const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener el balance general
const getBalanceGeneralFecha = async (req, res) => {
    try {
        const fechaInicio = req.params.fecha_inicio;
        const fechaFin = req.params.fecha_fin;

        const balance_general = await db_postgres.query(
            `
            SELECT 
                c.ID_CUENTA, 
                c.CODIGO, 
                c.DESCRIPCION, 
                CASE 
                    WHEN c.CODIGO LIKE '1%' THEN SUM(da.DEBE) - SUM(da.HABER)
                    WHEN c.CODIGO LIKE '2%' THEN SUM(da.HABER) - SUM(da.DEBE)
                    WHEN c.CODIGO LIKE '3%' THEN SUM(da.HABER) - SUM(da.DEBE)
                END AS SALDO
            FROM CONT_CUENTAS c
            LEFT JOIN CONT_DETALLE_ASIENTOS da ON c.ID_CUENTA = da.ID_CUENTA
            LEFT JOIN CONT_ASIENTOS a ON da.ID_ASIENTO = a.ID_ASIENTO
            WHERE (c.CODIGO LIKE '1%' OR c.CODIGO LIKE '2%' OR c.CODIGO LIKE '3%')
            AND (a.FECHA_ASIENTO BETWEEN $1 AND $2)
            AND a.ESTADO = true  -- Agregamos la condición para el estado true
            GROUP BY c.ID_CUENTA, c.CODIGO, c.DESCRIPCION 
            HAVING 
                CASE 
                    WHEN c.CODIGO LIKE '1%' THEN SUM(da.DEBE) - SUM(da.HABER)
                    WHEN c.CODIGO LIKE '2%' THEN SUM(da.HABER) - SUM(da.DEBE)
                    WHEN c.CODIGO LIKE '3%' THEN SUM(da.HABER) - SUM(da.DEBE)
                END IS NOT NULL
            UNION
            SELECT 1, '1', 'ACTIVO', NULL 
            UNION 
            SELECT 2, '2', 'PASIVO', NULL
            UNION 
            SELECT 3, '3', 'PATRIMONIO', NULL
            ORDER BY CODIGO;
            `,
            [fechaInicio, fechaFin]
        );

        res.json({
            ok: true,
            balance_general,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el balance general.",
        });
    }
};

// Obtener la suma de debe y haber del libro diario
const getSumaAPPFecha = async (req, res) => {
    try {

        const fechaInicio = req.params.fecha_inicio;
        const fechaFin = req.params.fecha_fin;

        const suma_app = await db_postgres.query(
            `
            SELECT
                SUM(CASE WHEN c.CODIGO LIKE '1%' THEN da.DEBE - da.HABER ELSE 0 END) AS Activo, 
                ABS(SUM(CASE WHEN c.CODIGO LIKE '2%' THEN da.DEBE - da.HABER ELSE 0 END)) AS Pasivo, 
                SUM(CASE WHEN c.CODIGO LIKE '3%' THEN da.HABER - da.DEBE ELSE 0 END) AS Patrimonio 
            FROM CONT_CUENTAS c 
            LEFT JOIN CONT_DETALLE_ASIENTOS da ON c.ID_CUENTA = da.ID_CUENTA 
            LEFT JOIN CONT_ASIENTOS a ON da.ID_ASIENTO = a.ID_ASIENTO
            WHERE (c.CODIGO LIKE '1%' OR c.CODIGO LIKE '2%' OR c.CODIGO LIKE '3%')
            AND (a.FECHA_ASIENTO BETWEEN $1 AND $2)
            AND a.ESTADO = true;
            `,
            [fechaInicio, fechaFin]
        );

        res.json({
            ok: true,
            suma_app,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener la suma.",
        });
    }
};

// Obtener el balance general
const getBalanceGeneral = async (req, res) => {
    try {
        const balance_general = await db_postgres.query(
            //"SELECT c.ID_CUENTA, c.CODIGO, c.DESCRIPCION, SUM(da.DEBE) - SUM(da.HABER) AS SALDO FROM CONT_CUENTAS c LEFT JOIN CONT_DETALLE_ASIENTOS da ON c.ID_CUENTA = da.ID_CUENTA WHERE c.CODIGO LIKE '1%' OR c.CODIGO LIKE '2%' OR c.CODIGO LIKE '3%' GROUP BY c.ID_CUENTA, c.CODIGO, c.DESCRIPCION HAVING SUM(da.DEBE) - SUM(da.HABER) IS NOT NULL UNION SELECT 1, '1', 'ACTIVO', NULL UNION SELECT 2, '2', 'PASIVO', NULL UNION SELECT 3, '3', 'PATRIMONIO', NULL ORDER BY CODIGO ");
            "SELECT c.ID_CUENTA, c.CODIGO, c.DESCRIPCION, SUM(da.DEBE) - SUM(da.HABER) AS SALDO " +
            "FROM CONT_CUENTAS c " +
            "LEFT JOIN CONT_DETALLE_ASIENTOS da ON c.ID_CUENTA = da.ID_CUENTA " +
            "WHERE c.CODIGO LIKE '1%' OR c.CODIGO LIKE '2%' OR c.CODIGO LIKE '3%' " +
            "GROUP BY c.ID_CUENTA, c.CODIGO, c.DESCRIPCION " +
            "HAVING SUM(da.DEBE) - SUM(da.HABER) IS NOT NULL " +
            "UNION " +
            "SELECT 1, '1', 'ACTIVO', NULL " +
            "UNION " +
            "SELECT 2, '2', 'PASIVO', NULL " +
            "UNION " +
            "SELECT 3, '3', 'PATRIMONIO', NULL " +
            "ORDER BY CODIGO");
        res.json({
            ok: true,
            balance_general,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el balance general.",
        });
    }
};

// Obtener la suma de debe y haber del libro diario
const getSumaAPP = async (req, res) => {
    try {
        const suma_app = await db_postgres.query(
            "SELECT " +
            "SUM(CASE WHEN c.CODIGO LIKE '1%' THEN da.DEBE - da.HABER ELSE 0 END) AS Activo, " +
            "SUM(CASE WHEN c.CODIGO LIKE '2%' THEN da.DEBE - da.HABER ELSE 0 END) AS Pasivo, " +
            "SUM(CASE WHEN c.CODIGO LIKE '3%' THEN da.DEBE - da.HABER ELSE 0 END) AS Patrimonio " +
            "FROM CONT_CUENTAS c " +
            "LEFT JOIN CONT_DETALLE_ASIENTOS da ON c.ID_CUENTA = da.ID_CUENTA " +
            "WHERE c.CODIGO LIKE '1%' OR c.CODIGO LIKE '2%' OR c.CODIGO LIKE '3%'"
        );
        res.json({
            ok: true,
            suma_app,
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
    getBalanceGeneral,
    getSumaAPP,
    getBalanceGeneralFecha,
    getSumaAPPFecha,
};
